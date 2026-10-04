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

// 取项目 README 渲染后的 HTML；cachedHtml 为 site.data 命中的已渲染 HTML，未命中时联网拉取并写缓存
async function loadReadme(ctx, cachedHtml, p, key) {
    const repo = parseRepo(p.source);
    if (!repo) return null;
    let html = typeof cachedHtml === 'string' ? cachedHtml : '';
    if (!html) {
        const md = await fetchText('https://raw.githubusercontent.com/' + repo.owner + '/' + repo.repo + '/HEAD/README.md');
        if (!md) return null;
        try {
            html = ctx.render.renderSync({ text: md, engine: 'markdown' });
        } catch (e) {
            return null;
        }
        // 写回缓存（下次构建由 data processor 载入 site.data，不再走网络）；写失败不影响本次渲染
        try {
            const dir = path.join(ctx.base_dir, 'source', '_data', 'open-readme');
            fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(path.join(dir, key + '.md'), md);
        } catch (e) { /* ignore */ }
    }
    return rewritePaths(html, repo);
}

module.exports = { loadReadme, parseRepo };
