"use strict";
// mermaid 图表支持（文章与开源详情页 README 统一生效，由 filter/index.js 注册）：
// ⚠️ mermaid 围栏若直接走 hexo 渲染管线，backtick_code_block 会包上 hexoPostRenderCodeBlock
// 保护标签并对 { } 做 Swig 转义、图源被实体化破坏（-&gt;&gt;），前端拿到的是无法解析的图源。
// encodeFences（before_post_render，priority 5 必须先于 backtick_code_block 的默认 10）：
//   把 ```mermaid 围栏抽成 base64 注释占位 —— base64 字符集对 markdown/HTML/代码高亮全惰性，
//   无状态穿透整条管线（不依赖 before/after 两次 filter 之间共享对象，README 自定义渲染路径亦命中）。
// restoreFences（after_post_render，默认 priority 10）：解码还原为 <div class="mermaid-holder"
//   data-mermaid="图源">，前端 source/js/mermaid-render.js 读属性渲染；注册晚于内置
//   external_link/excerpt，占位 div 不会被 cheerio 二次序列化。
const FENCE_RE = /```mermaid\r?\n([\s\S]*?)```/g;
const PLACEHOLDER_RE = /<!--MERMAID ([A-Za-z0-9+/=]+)-->/g;

// data-mermaid 属性值 HTML 转义；浏览器 getAttribute 读取时自动解码
function escapeAttr(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function encodeFences(data) {
    if (typeof data.content === 'string' && data.content.indexOf('```mermaid') !== -1) {
        data.content = data.content.replace(FENCE_RE, function (m, code) {
            return '\n<!--MERMAID ' + Buffer.from(code.replace(/\r?\n$/, ''), 'utf8').toString('base64') + '-->\n';
        });
    }
    return data;
}

function restoreFences(data) {
    if (typeof data.content === 'string' && data.content.indexOf('<!--MERMAID ') !== -1) {
        data.content = data.content.replace(PLACEHOLDER_RE, function (m, b64) {
            let code;
            try { code = Buffer.from(b64, 'base64').toString('utf8'); } catch (e) { return m; }
            return '<div class="mermaid-holder" data-mermaid="' + escapeAttr(code) + '"></div>';
        });
    }
    return data;
}

module.exports = { encodeFences, restoreFences };
