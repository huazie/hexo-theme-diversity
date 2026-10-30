/**
 * mermaid 图前端渲染：
 * 开源详情页 README 与文章正文中的 mermaid 围栏在构建时被 filter 插件抽为占位容器
 * （<div class="mermaid-holder" data-mermaid="图源 HTML 实体编码">，见 scripts/filter/mermaid.js），
 * 本脚本读属性原文（getAttribute 自动解码）交给 mermaid 渲染为图表。
 * 未出现 mermaid 占位的页面不加载 mermaid 库，零开销；
 * 渲染失败时回退显示图源原文，内容永不丢失。
 * 渲染成功的图表支持点击放大查看（lightbox 查看器：滚轮缩放 / 拖拽平移 /
 * 双击复位 / 移动端双指捏合，ESC/遮罩/按钮关闭）。
 */
(function () {
    'use strict';

    function isDark() {
        // 1) 手动模式记忆优先：与 nav.js initColorScheme 对齐（Diversity.data 直用
        //    localStorage 原名 key），且页面加载早期 class 未恢复时也能判对（免竞态）
        try {
            var saved = localStorage.getItem('color_scheme');
            if (saved === 'dark') return true;
            if (saved === 'light') return false;
        } catch (e) { /* localStorage 不可用（隐私模式等） */ }
        // 2) html class（nav.js 恢复/切换后的即时状态）
        if (document.documentElement.classList.contains('dark-theme')) return true;
        // 3) 跟随系统（darkmode=1 类站点无 class 也可能是暗色页面）
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
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
        allBlocks = blocks; // 留存图源，主题切换时按新主题重渲染
        var dark = isDark();
        try {
            window.mermaid.initialize({
                startOnLoad: false,
                theme: dark ? 'dark' : 'default',
                securityLevel: 'loose' // 允许 label 内 <br/> 等标记
            });
        } catch (e) { return; }
        blocks.forEach(function (b, i) {
            window.mermaid.render('mermaid-' + Date.now() + '-' + i, b.code).then(function (res) {
                b.el.innerHTML = res.svg;
                // 记录渲染时的主题：lightbox 据此决定衬底（浅色图加深色遮罩上文字不可读）
                b.el.setAttribute('data-mermaid-theme', dark ? 'dark' : 'light');
            }).catch(function (e) {
                console.warn('[mermaid-render] 渲染失败，回退显示图源:', e && e.message);
                b.el.textContent = b.code;
                b.el.classList.add('mermaid-fallback');
            });
        });
    }

    // 主题切换后按新主题重渲染所有图表：mermaid 主题在 initialize 时固定，
    // 切换后不重渲染会在暗色页面残留浅色图（无背景盒的深色文字不可读）
    function rerenderAll() {
        if (!window.mermaid || !allBlocks.length) return;
        var dark = isDark();
        try {
            window.mermaid.initialize({
                startOnLoad: false,
                theme: dark ? 'dark' : 'default',
                securityLevel: 'loose'
            });
        } catch (e) { return; }
        allBlocks.forEach(function (b, i) {
            var el = b.el;
            if (!el.isConnected) return;
            // lightbox 开着且 SVG 已移入该容器预览层：先关闭，避免替换后旧 SVG 成游离节点
            if (lb.overlay && lb.home === el) closeLightbox();
            window.mermaid.render('mermaid-' + Date.now() + '-r' + i, b.code).then(function (res) {
                el.innerHTML = res.svg;
                el.setAttribute('data-mermaid-theme', dark ? 'dark' : 'light');
            }).catch(function (e) { /* 重渲染失败保留旧图 */ });
        });
    }

    // 监听主题变化：html class（手动切换/nav.js 恢复）+ 系统偏好（跟随系统的站点）
    function watchTheme() {
        var last = isDark();
        var timer = null;
        function onChange() {
            var cur = isDark();
            if (cur === last) return;
            last = cur;
            clearTimeout(timer);
            timer = setTimeout(rerenderAll, 120); // debounce：合并连续 class 变化
        }
        try {
            new MutationObserver(onChange).observe(document.documentElement,
                { attributes: true, attributeFilter: ['class'] });
        } catch (e) { /* 忽略 */ }
        if (window.matchMedia) {
            try {
                var mq = window.matchMedia('(prefers-color-scheme: dark)');
                if (mq.addEventListener) mq.addEventListener('change', onChange);
                else if (mq.addListener) mq.addListener(onChange);
            } catch (e) { /* 忽略 */ }
        }
    }

    /* ==================== 放大查看（lightbox 查看器） ==================== */

    var lb = { overlay: null, wrap: null, svg: null, home: null, prev: null,
               s: 1, s0: 1, tx: 0, ty: 0, natW: 0, natH: 0, ex: 0 };
    var allBlocks = []; // 已渲染图表（el + 图源），供主题切换时重渲染

    function injectLightboxStyle() {
        if (document.getElementById('mermaid-lightbox-style')) return;
        var style = document.createElement('style');
        style.id = 'mermaid-lightbox-style';
        style.textContent =
            '.mermaid-holder svg{cursor:zoom-in}' +
            '.mermaid-lightbox{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.78);' +
            'overflow:hidden;touch-action:none;user-select:none;-webkit-user-select:none;' +
            'animation:mermaid-lb-fade .2s ease}' +
            '@keyframes mermaid-lb-fade{from{opacity:0}to{opacity:1}}' +
            '.mermaid-lightbox-wrap{position:absolute;left:0;top:0;transform-origin:0 0;will-change:transform}' +
            '.mermaid-lightbox-wrap svg{display:block;cursor:grab}' +
            '.mermaid-lightbox-wrap svg:active{cursor:grabbing}' +
            // 浅色主题图加白色衬底卡片：图中无背景盒的深色文字（时序图消息等）
            // 直接贴在深色遮罩上会不可读；暗色主题图为浅色文字，透明即可
            '.mermaid-lightbox-wrap.mermaid-lb-card{background:#fff;border-radius:10px;' +
            'padding:24px;box-shadow:0 12px 48px rgba(0,0,0,.45)}' +
            '.mermaid-lightbox-close{position:absolute;top:16px;right:20px;width:36px;height:36px;' +
            'border:none;border-radius:50%;background:rgba(255,255,255,.16);color:#fff;font-size:20px;' +
            'line-height:36px;text-align:center;cursor:pointer;transition:background .2s;padding:0;z-index:2}' +
            '.mermaid-lightbox-close:hover{background:rgba(255,255,255,.32)}' +
            '.mermaid-lightbox-hint{position:absolute;bottom:14px;left:0;right:0;text-align:center;' +
            'color:rgba(255,255,255,.55);font-size:12px;pointer-events:none;z-index:2}';
        document.head.appendChild(style);
    }

    function lbApply() {
        lb.wrap.style.transform = 'translate(' + lb.tx + 'px,' + lb.ty + 'px) scale(' + lb.s + ')';
    }

    function lbCenter() {
        lb.tx = (window.innerWidth - (lb.natW + lb.ex) * lb.s) / 2;
        lb.ty = (window.innerHeight - (lb.natH + lb.ex) * lb.s) / 2;
        lbApply();
    }

    // 以屏幕坐标 (cx, cy) 为锚点缩放，保持锚点下的图内容不动
    function lbZoomAt(cx, cy, factor) {
        var s2 = Math.min(Math.max(lb.s * factor, 0.1), 12);
        var k = s2 / lb.s;
        lb.tx = cx - (cx - lb.tx) * k;
        lb.ty = cy - (cy - lb.ty) * k;
        lb.s = s2;
        lbApply();
    }

    function closeLightbox() {
        if (!lb.overlay) return;
        // 图表移回原位，并完整恢复打开前的属性与内联样式
        // （打开时改写了 width/height 属性与 style.width/maxWidth，不恢复会导致
        //  文章页 SVG 以自然尺寸硬展示、超出正文容器）
        if (lb.home && lb.svg && lb.prev) {
            var svg = lb.svg;
            if (lb.prev.width === null) svg.removeAttribute('width');
            else svg.setAttribute('width', lb.prev.width);
            if (lb.prev.height === null) svg.removeAttribute('height');
            else svg.setAttribute('height', lb.prev.height);
            svg.style.cssText = lb.prev.cssText;
            lb.home.appendChild(svg);
        }
        document.body.style.overflow = '';
        document.removeEventListener('keydown', lbOnKeydown);
        lb.overlay.parentNode.removeChild(lb.overlay);
        lb.overlay = null; lb.wrap = null; lb.svg = null; lb.home = null; lb.prev = null;
    }

    function lbOnKeydown(e) {
        if (e.key === 'Escape') closeLightbox();
    }

    // 从 SVG 的 viewBox 解析自然尺寸（mermaid SVG 均带 viewBox）
    function lbNatSize(svg) {
        var vb = (svg.getAttribute('viewBox') || '').split(/[\s,]+/);
        var w = parseFloat(vb[2]), h = parseFloat(vb[3]);
        if (!w || !h) {
            w = svg.width.baseVal.value || 600;
            h = svg.height.baseVal.value || 400;
        }
        return { w: w, h: h };
    }

    function openLightbox(holder) {
        var svg = holder.querySelector('svg');
        if (!svg) return; // 未渲染成功（fallback 文本态）不支持放大
        injectLightboxStyle();
        closeLightbox(); // 防御：已打开先复位

        var size = lbNatSize(svg);
        lb.natW = size.w; lb.natH = size.h;
        lb.home = holder; lb.svg = svg;
        // 记录打开前的属性与内联样式，关闭时完整还原
        lb.prev = {
            width: svg.getAttribute('width'),
            height: svg.getAttribute('height'),
            cssText: svg.style.cssText
        };

        lb.overlay = document.createElement('div');
        lb.overlay.className = 'mermaid-lightbox';
        lb.overlay.innerHTML =
            '<button class="mermaid-lightbox-close" type="button" aria-label="关闭">&times;</button>' +
            '<div class="mermaid-lightbox-hint">滚轮缩放 · 拖拽移动 · 双击复位 · ESC 关闭</div>';
        lb.wrap = document.createElement('div');
        lb.wrap.className = 'mermaid-lightbox-wrap';
        lb.overlay.appendChild(lb.wrap);

        // 摆脱 mermaid 自带的 max-width/width 限制，按 viewBox 自然尺寸展示
        svg.removeAttribute('width');
        svg.removeAttribute('height');
        svg.style.maxWidth = 'none';
        svg.style.width = size.w + 'px';
        svg.style.height = size.h + 'px';
        lb.wrap.appendChild(svg); // 移动（非克隆）SVG 进预览层，关闭时移回原位
        document.body.appendChild(lb.overlay);
        document.body.style.overflow = 'hidden';

        // 浅色主题图套白色衬底卡片（保证无背景盒文字可读），暗色图透明
        var lightCard = holder.getAttribute('data-mermaid-theme') !== 'dark';
        if (lightCard) lb.wrap.classList.add('mermaid-lb-card');
        lb.ex = lightCard ? 48 : 0; // 卡片上下左右各 24px 内边距，随缩放计入整体尺寸

        // 初始缩放：恰好适配视口（大图缩小、小图放大），上限 3 倍防过度放大
        var fit = Math.min(window.innerWidth * 0.92 / (size.w + lb.ex), window.innerHeight * 0.88 / (size.h + lb.ex));
        lb.s0 = Math.min(fit, 3);
        lb.s = lb.s0;
        lbCenter();

        /* ---- 滚轮缩放（以鼠标为中心） ---- */
        lb.overlay.addEventListener('wheel', function (e) {
            e.preventDefault();
            lbZoomAt(e.clientX, e.clientY, e.deltaY < 0 ? 1.15 : 1 / 1.15);
        }, { passive: false });

        /* ---- 拖拽平移 + 双指捏合（Pointer Events 统一鼠标/触摸） ----
         * 注意：不能在 pointerdown 立即 setPointerCapture——capture 期间合成 click
         * 的 target 会重定向到 overlay，导致"单击图即关闭"、双击复位失效。
         * 仅在判定为拖拽手势（移动超阈值/双指捏合）后才捕获指针。 */
        var pointers = new Map();
        var pinchDist = 0;
        var moved = false;   // 本轮按下后是否发生了拖拽/捏合手势
        var captured = false;

        function ensureCapture() {
            if (captured) return;
            captured = true;
            pointers.forEach(function (p, id) {
                try { lb.overlay.setPointerCapture(id); } catch (err) { /* 忽略 */ }
            });
        }

        lb.overlay.addEventListener('pointerdown', function (e) {
            if (e.target.closest('.mermaid-lightbox-close')) return;
            pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
            moved = false;
            if (pointers.size === 2) {
                var pts = Array.from(pointers.values());
                pinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
                ensureCapture(); // 双指手势开始，立即捕获
                moved = true;
            }
        });
        lb.overlay.addEventListener('pointermove', function (e) {
            if (!pointers.has(e.pointerId)) return;
            var prev = pointers.get(e.pointerId);
            pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
            if (pointers.size === 2) {
                // 双指捏合缩放（以两指中点为锚）
                var pts = Array.from(pointers.values());
                var d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
                if (pinchDist > 0 && d > 0) {
                    lbZoomAt((pts[0].x + pts[1].x) / 2, (pts[0].y + pts[1].y) / 2, d / pinchDist);
                }
                pinchDist = d;
                return;
            }
            // 单指/鼠标拖拽平移：超过阈值才判定为拖拽并捕获指针
            var dx = e.clientX - prev.x, dy = e.clientY - prev.y;
            if (!captured && Math.abs(dx) + Math.abs(dy) > 3) {
                ensureCapture();
                moved = true;
            }
            if (moved) {
                lb.tx += dx;
                lb.ty += dy;
                lbApply();
            }
        });
        function lbPointerUp(e) {
            pointers.delete(e.pointerId);
            if (pointers.size < 2) pinchDist = 0;
            if (pointers.size === 0) captured = false;
        }
        lb.overlay.addEventListener('pointerup', lbPointerUp);
        lb.overlay.addEventListener('pointercancel', lbPointerUp);

        /* ---- 点击遮罩空白关闭（拖拽过不关）；双击复位 ---- */
        lb.overlay.addEventListener('click', function (e) {
            if (e.target.closest('.mermaid-lightbox-close')) return; // 按钮自带监听
            if (moved) return;
            if (e.target === lb.overlay) closeLightbox();
        });
        lb.overlay.addEventListener('dblclick', function (e) {
            if (e.target.closest('.mermaid-lightbox-close')) return;
            lb.s = lb.s0;
            lbCenter();
        });
        lb.overlay.querySelector('.mermaid-lightbox-close').addEventListener('click', closeLightbox);
        document.addEventListener('keydown', lbOnKeydown);
    }

    function init() {
        // 不限定父容器：文章页由多主题子实例渲染，各主题正文容器 class 不同
        // （diversity 为 .article-content），mermaid-holder 是 filter 生成的专属 class，全局查找无误匹配
        var holders = document.querySelectorAll('.mermaid-holder[data-mermaid]');
        if (!holders.length) return;
        // 事件委托：渲染为异步 promise 完成，委托到 document 免去时序依赖
        document.addEventListener('click', function (e) {
            var holder = e.target.closest ? e.target.closest('.mermaid-holder') : null;
            if (holder) openLightbox(holder);
        });
        loadMermaid(function () {
            var blocks = [];
            holders.forEach(function (el) {
                blocks.push({ el: el, code: el.getAttribute('data-mermaid') });
            });
            render(blocks);
            watchTheme(); // 主题切换（含 nav.js 恢复 class）后按新主题重渲染
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
