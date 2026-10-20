"use strict";
// 开源项目详情页 README 获取（⑦ 方案 A：拉取 + 本地缓存）：
// 1. 缓存命中：source/_data/open-readme/<key>.md 存在时，hexo data processor（pattern: _data/*path，跨目录）
//    会把它渲染为 HTML 载入 site.data['open-readme/<key>']，generator 直接取用，零网络依赖
// 2. 缓存未命中：从 raw.githubusercontent.com 拉取 README.md，渲染为 HTML，并把 md 原文写回缓存
//    （下次构建命中 1）；强制更新 = 删除缓存文件后重新构建
// 3. 无 GitHub source / 拉取失败 → 返回 null，详情页降级为卡片式内容，构建不因网络问题中断
const https = require('https');
const fs = require('fs');
const path = require('path');

// 从 GitHub 仓库地址解析 owner/repo（支持 .git 后缀与 git@ 形式）
function parseRepo(url) {
    const m = /github\.com[/:]([^/]+)\/([^/#?]+?)(?:\.git)?(?:[/#?]|$)/.exec(url || '');
    return m ? { owner: m[1], repo: m[2] } : null;
}

// HTTPS GET 文本，10s 超时；非 200 / 异常统一返回 null
function fetchText(url) {
    return new Promise(function (resolve) {
        const req = https.get(url, { headers: { 'User-Agent': 'hexo-theme-diversity' } }, function (res) {
            if (res.statusCode !== 200) { res.resume(); return resolve(null); }
            let data = '';
            res.setEncoding('utf8');
            res.on('data', function (c) { data += c; });
            res.on('end', function () { resolve(data); });
        });
        req.setTimeout(10000, function () { req.destroy(); resolve(null); });
        req.on('error', function () { resolve(null); });
    });
}

// README 内相对路径改写为 GitHub 绝对地址：图片走 raw（可外链直显）、链接走 blob（可浏览）；
// 绝对地址与页内锚点不动
function rewritePaths(html, repo) {
    const raw = 'https://raw.githubusercontent.com/' + repo.owner + '/' + repo.repo + '/HEAD/';
    const blob = 'https://github.com/' + repo.owner + '/' + repo.repo + '/blob/HEAD/';
    const prefix = (p) => p.replace(/^(?:\.\/|\/)+/, '');
    html = html.replace(/(<img\b[^>]*?\bsrc=)(["'])([^"']+)\2/gi, function (m, pre, q, src) {
        return (/^(?:https?:)?\/\//i.test(src) || src.charAt(0) === '#') ? m : pre + q + raw + prefix(src) + q;
    });
    html = html.replace(/(<a\b[^>]*?\bhref=)(["'])([^"']+)\2/gi, function (m, pre, q, href) {
        return (/^(?:https?:)?\/\//i.test(href) || href.charAt(0) === '#') ? m : pre + q + blob + prefix(href) + q;
    });
    return html;
}

// md → HTML：走 hexo 标准文章渲染管线（直连 renderSync 不经过渲染 filter，
// 反引号代码块不会高亮成 figure.highlight，外链等后处理也缺失，与站内文章样式不一致）。
// mermaid 围栏由 filter 插件（scripts/filter/mermaid.js）在渲染前后处理，本模块不再单独操心
async function renderMarkdown(ctx, md) {
    const pre = { content: md };
    await ctx.extend.filter.exec('before_post_render', pre, { context: ctx });
    const html = ctx.render.renderSync({ text: pre.content, engine: 'markdown' });
    const post = { content: html };
    await ctx.extend.filter.exec('after_post_render', post, { context: ctx });
    return post.content;
}

// 取项目 README 渲染后的 HTML；cachedData 为 site.data 命中的缓存（<key>.json，{content: md 原文}）。
// ⚠️ 缓存不能用 .md：data processor 会直渲染成缺 filter 管线的 HTML；也不能用 .txt 等无渲染器的扩展名
// （file.render 返回 null，site.data 根本不载入）；.json 渲染为对象、md 原文存 content，渲染统一走 renderMarkdown
async function loadReadme(ctx, cachedData, p, key) {
    const repo = parseRepo(p.source);
    if (!repo) return null;
    let md = cachedData && typeof cachedData.content === 'string' ? cachedData.content : '';
    if (!md) {
        md = await fetchText('https://raw.githubusercontent.com/' + repo.owner + '/' + repo.repo + '/HEAD/README.md');
        if (!md) return null;
        // 写回缓存（.json 存原文，下次构建命中后统一走 renderMarkdown 管线）；写失败不影响本次渲染
        try {
            const dir = path.join(ctx.base_dir, 'source', '_data', 'open-readme');
            fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(path.join(dir, key + '.json'), JSON.stringify({ content: md }));
        } catch (e) { /* ignore */ }
    }
    let html;
    try {
        html = await renderMarkdown(ctx, md);
    } catch (e) {
        return null;
    }
    // README 完整保留（含自带 h1 标题/logo），详情页不再另设大标题避免重复；
    // 数据表格包一层滚动容器：overflow 在 display:block 表格上不能裁剪内部表格盒（thead 会画出容器外撑宽页面），
    // 必须由外层 div 负责横向滚动。
    // ⚠️ figure.highlight 内的行号表格必须排除：包上 wrap 会被 .open-table-wrap table 的
    // width max-content 收缩成紧贴内容，而 page 正文（留言页）的代码块 table 被
    // .article-content table 的 display block 撑成全宽——两页代码块形态就不一致了
    return rewritePaths(html, repo).replace(
        /<figure class="highlight[\s\S]*?<\/figure>|<table>|<\/table>/gi,
        function (m) {
            const head = m.slice(0, 7).toLowerCase();
            if (head === '<figure' || head === '</figur') return m; // 代码块整体原样（内部 table 已随之跳过）
            return head === '<table>' ? '<div class="open-table-wrap"><table>' : '</table></div>';
        }
    );
}

module.exports = { loadReadme, parseRepo };
