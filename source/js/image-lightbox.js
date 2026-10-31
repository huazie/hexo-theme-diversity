/**
 * 文章图片放大查看（lightbox）：
 * 点击各主题正文容器内的图片进入全屏查看器——滚轮缩放（以鼠标为锚点）/ 拖拽平移 /
 * 移动端双指捏合 / 双击复位 / ESC、遮罩、按钮关闭，交互与 mermaid 图查看器一致。
 * 仅正文图片生效：链接图（<a> 包裹，含主题 fancybox 包装）、mermaid 图、
 * 表情/小图标（自然宽 < 100px）不接管；标注 data-no-zoom 或 class no-zoom 可显式跳过。
 * 自带图片放大能力的主题（_config.diversity.yml 的 image_zoom.skip）在构建期不注入本脚本。
 */
(function () {
    'use strict';
    if (window.__divImgLb) return; // 防重复注入
    window.__divImgLb = true;
    // 运行时共存守卫：主题自带 fancybox 已加载时让位（构建期 skip 的双保险）
    if (window.Fancybox || (window.jQuery && window.jQuery.fancybox)) return;

    // 各主题正文容器：landscape(.article-entry) / light(.post-content) / phase(.e-content)
    // / next(.post-body) / icarus(.content) / diversity 正文与开源详情 README(.article-content,.open-readme)
    var CONTENT_SEL = '.article-entry,.entry,.post-body,.post-content,.e-content,.content,.article-content,.open-readme';

    var lb = { overlay: null, wrap: null, img: null,
               s: 1, s0: 1, tx: 0, ty: 0, natW: 0, natH: 0 };

    function injectStyle() {
        if (document.getElementById('img-lightbox-style')) return;
        var style = document.createElement('style');
        style.id = 'img-lightbox-style';
        style.textContent =
            '.img-lightbox{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.78);' +
            'overflow:hidden;touch-action:none;user-select:none;-webkit-user-select:none;' +
            'animation:img-lb-fade .2s ease}' +
            '@keyframes img-lb-fade{from{opacity:0}to{opacity:1}}' +
            '.img-lightbox-wrap{position:absolute;left:0;top:0;transform-origin:0 0;will-change:transform}' +
            '.img-lightbox-wrap img{display:block;cursor:grab;-webkit-user-drag:none;max-width:none}' +
            '.img-lightbox-wrap img:active{cursor:grabbing}' +
            '.img-lightbox-close{position:absolute;top:16px;right:20px;width:36px;height:36px;' +
            'border:none;border-radius:50%;background:rgba(255,255,255,.16);color:#fff;font-size:20px;' +
            'line-height:36px;text-align:center;cursor:pointer;transition:background .2s;padding:0;z-index:2}' +
            '.img-lightbox-close:hover{background:rgba(255,255,255,.32)}' +
            '.img-lightbox-hint{position:absolute;bottom:14px;left:0;right:0;text-align:center;' +
            'color:rgba(255,255,255,.55);font-size:12px;pointer-events:none;z-index:2}';
        document.head.appendChild(style);
    }

    function lbApply() {
        lb.wrap.style.transform = 'translate(' + lb.tx + 'px,' + lb.ty + 'px) scale(' + lb.s + ')';
    }

    function lbCenter() {
        lb.tx = (window.innerWidth - lb.natW * lb.s) / 2;
        lb.ty = (window.innerHeight - lb.natH * lb.s) / 2;
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
        document.body.style.overflow = '';
        document.removeEventListener('keydown', lbOnKeydown);
        lb.overlay.parentNode.removeChild(lb.overlay);
        lb.overlay = null; lb.wrap = null; lb.img = null;
    }

    function lbOnKeydown(e) {
        if (e.key === 'Escape') closeLightbox();
    }

    function openLightbox(src) {
        injectStyle();
        closeLightbox(); // 防御：已打开先复位

        lb.overlay = document.createElement('div');
        lb.overlay.className = 'img-lightbox';
        lb.overlay.innerHTML =
            '<button class="img-lightbox-close" type="button" aria-label="关闭">&times;</button>' +
            '<div class="img-lightbox-hint">滚轮缩放 · 拖拽移动 · 双击复位 · ESC 关闭</div>';
        lb.wrap = document.createElement('div');
        lb.wrap.className = 'img-lightbox-wrap';
        lb.overlay.appendChild(lb.wrap);

        var img = document.createElement('img');
        img.alt = '';
        img.draggable = false;
        lb.img = img;
        lb.wrap.appendChild(img);
        document.body.appendChild(lb.overlay);
        document.body.style.overflow = 'hidden';

        // 加载完成（缓存图 onload 仍会触发）后按自然尺寸适配视口：
        // 大图缩小到 92vw/88vh 内、小图适度放大，上限 3 倍防糊
        img.onload = function () {
            if (!lb.overlay) return; // 期间已被关闭
            lb.natW = img.naturalWidth || 800;
            lb.natH = img.naturalHeight || 600;
            var fit = Math.min(window.innerWidth * 0.92 / lb.natW, window.innerHeight * 0.88 / lb.natH);
            lb.s0 = Math.min(fit, 3);
            lb.s = lb.s0;
            lbCenter();
        };
        img.onerror = function () {
            console.warn('[image-lightbox] 图片加载失败:', src);
            closeLightbox();
        };
        img.src = src; // 先挂 onload 再赋 src，确保缓存图也能触发

        /* ---- 滚轮缩放（以鼠标为中心） ---- */
        lb.overlay.addEventListener('wheel', function (e) {
            e.preventDefault();
            lbZoomAt(e.clientX, e.clientY, e.deltaY < 0 ? 1.15 : 1 / 1.15);
        }, { passive: false });

        /* ---- 拖拽平移 + 双指捏合（Pointer Events 统一鼠标/触摸） ----
         * 不能在 pointerdown 立即 setPointerCapture——capture 期间合成 click 的
         * target 会重定向到 overlay，导致单击图即误关（与 mermaid 查看器同坑） */
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
            if (e.target.closest('.img-lightbox-close')) return;
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
            if (e.target.closest('.img-lightbox-close')) return; // 按钮自带监听
            if (moved) return;
            if (e.target === lb.overlay) closeLightbox();
        });
        lb.overlay.addEventListener('dblclick', function (e) {
            if (e.target.closest('.img-lightbox-close')) return;
            lb.s = lb.s0;
            lbCenter();
        });
        lb.overlay.querySelector('.img-lightbox-close').addEventListener('click', closeLightbox);
        document.addEventListener('keydown', lbOnKeydown);
    }

    function init() {
        // 可放大指针样式：init 即注入（遮罩样式 injectStyle 仍为打开时懒注入）
        if (!document.getElementById('img-zoomable-style')) {
            var zs = document.createElement('style');
            zs.id = 'img-zoomable-style';
            zs.textContent = '.img-zoomable{cursor:zoom-in}';
            document.head.appendChild(zs);
        }
        // 可放大图片标记放大镜指针（与点击判定同条件）
        function markZoomable(img) {
            if (!img || img.tagName !== 'IMG' || !img.closest) return;
            if (img.classList.contains('img-zoomable')) return;
            if (!img.closest(CONTENT_SEL)) return;
            if (img.closest('a') || img.closest('.mermaid-holder')) return;
            if (img.hasAttribute('data-no-zoom') || img.classList.contains('no-zoom')) return;
            if (!img.complete) { img.classList.add('img-zoomable'); return; } // 加载中先标记（img.width 是显示宽非原图宽），load 后按 naturalWidth 复查
            if ((img.naturalWidth || 0) < 100) return;
            img.classList.add('img-zoomable');
        }
        // 捕获阶段收 img load（load 不冒泡）：懒加载图加载完成后按真实尺寸复查
        document.addEventListener('load', function (e) {
            if (e.target && e.target.tagName === 'IMG' && e.target.classList.contains('img-zoomable') &&
                (e.target.naturalWidth || 0) < 100) {
                e.target.classList.remove('img-zoomable');
            } else if (e.target && e.target.tagName === 'IMG') {
                markZoomable(e.target);
            }
        }, true);
        Array.prototype.forEach.call(document.querySelectorAll(CONTENT_SEL.split(',').map(function (s) { return s + ' img'; }).join(',')), markZoomable);

        // 事件委托到 document：目标为正文容器内、未被接管的图片才进查看器
        document.addEventListener('click', function (e) {
            var t = e.target;
            if (!t || t.tagName !== 'IMG' || !t.closest) return;
            if (!t.closest(CONTENT_SEL)) return;        // 仅正文图片
            if (t.closest('a')) return;                 // 链接图/主题 fancybox 已包装
            if (t.closest('.mermaid-holder')) return;   // mermaid 图走专属查看器
            if (t.hasAttribute('data-no-zoom') || t.classList.contains('no-zoom')) return;
            var w = t.naturalWidth || t.width;          // 表情/小图标不放大
            if (w && w < 100) return;
            e.preventDefault();
            openLightbox(t.getAttribute('data-src') || t.currentSrc || t.src);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
