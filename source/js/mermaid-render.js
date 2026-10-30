/**
 * mermaid 图前端渲染：
 * 开源详情页 README 与文章正文中的 mermaid 围栏在构建时被 filter 插件抽为占位容器
 * （<div class="mermaid-holder" data-mermaid="图源 HTML 实体编码">，见 scripts/filter/mermaid.js），
 * 本脚本读属性原文（getAttribute 自动解码）交给 mermaid 渲染为图表。
 * 未出现 mermaid 占位的页面不加载 mermaid 库，零开销；
 * 渲染失败时回退显示图源原文，内容永不丢失。
 */
(function () {
    'use strict';

    function isDark() {
        return document.documentElement.classList.contains('dark-theme');
    }

    function loadMermaid(cb) {
        if (window.mermaid) return cb();
        var s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';
        s.onload = function () { cb(); };
        s.onerror = function () { /* CDN 失败：保留占位容器原样 */ };
        document.head.appendChild(s);
    }

    function render(blocks) {
        try {
            window.mermaid.initialize({
                startOnLoad: false,
                theme: isDark() ? 'dark' : 'default',
                securityLevel: 'loose' // 允许 label 内 <br/> 等标记
            });
        } catch (e) { return; }
        blocks.forEach(function (b, i) {
            window.mermaid.render('mermaid-' + Date.now() + '-' + i, b.code).then(function (res) {
                b.el.innerHTML = res.svg;
            }).catch(function (e) {
                console.warn('[mermaid-render] 渲染失败，回退显示图源:', e && e.message);
                b.el.textContent = b.code;
                b.el.classList.add('mermaid-fallback');
            });
        });
    }

    function init() {
        // 不限定父容器：文章页由多主题子实例渲染，各主题正文容器 class 不同
        // （diversity 为 .article-content），mermaid-holder 是 filter 生成的专属 class，全局查找无误匹配
        var holders = document.querySelectorAll('.mermaid-holder[data-mermaid]');
        if (!holders.length) return;
        loadMermaid(function () {
            var blocks = [];
            holders.forEach(function (el) {
                blocks.push({ el: el, code: el.getAttribute('data-mermaid') });
            });
            render(blocks);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
