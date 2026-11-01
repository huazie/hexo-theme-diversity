/**
 * 代码块增强：语言标签 + 复制按钮。
 * 对页面中的 <figure class="highlight <lang>">（hexo highlight.js 渲染产物）右上角
 * 叠加语言标签与复制按钮：点击复制代码列文本，成功后图标短暂切换为对勾。
 * 页面无代码块时零开销（不注入任何样式/节点）；颜色全部走 CSS 变量，暗色模式自动跟随。
 * 主实例由 head.ejs 按内容条件引入，子主题实例经 injector 全局内联注入（mermaid 同模式）。
 */
(function () {
    'use strict';
    if (window.__divCodeCopy) return; // 防重复注入
    window.__divCodeCopy = true;

    // 文案按页面语言内置（子主题实例不加载 diversity 的 i18n，自包含最简）
    var isZh = (document.documentElement.lang || '').indexOf('zh') === 0;
    var text = {
        copy: isZh ? '复制代码' : 'Copy code', copied: isZh ? '已复制' : 'Copied',
        expand: isZh ? '展开代码' : 'Expand code', collapse: isZh ? '收起代码' : 'Collapse code',
    };

    // 内联 SVG 图标（currentColor 跟随按钮 color）：不依赖页面图标字体（各子主题 FA 版本不一，
    // FA7 无 fa-files-o、ForkAwesome 下颜色继承浅灰，均导致图标不可见）
    var ICON_COPY = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" ' +
        'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';
    var ICON_CHECK = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" ' +
        'stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M20 6L9 17l-5-5"/></svg>';
    var ICON_CHEVRON = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" ' +
        'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M6 9l6 6 6-6"/></svg>';

    function injectStyle() {
        if (document.getElementById('code-copy-style')) return;
        var style = document.createElement('style');
        style.id = 'code-copy-style';
        style.textContent =
            // 用 .hl-enhanced 类提高特异性（0,2,0），防止子主题 figure.highlight 等规则覆盖 padding
            '.highlight.hl-enhanced{position:relative;padding-top:34px}' + // 顶部预留工具条空间，防首行代码被遮挡
            '.hl-tools{position:absolute;top:6px;right:6px;left:6px;display:flex;align-items:center;' +
            'justify-content:flex-end;gap:2px;z-index:2;pointer-events:none}' +
            // 变量均带兜底：主实例走 _colors.styl 变量表，子主题实例（无该变量表）用 fallback，明暗均柔和
            // 颜色显式指定：子主题无 --text-color 变量，inherit 会继承到代码块的浅色（图标近乎隐形），故不依赖变量/继承
            '.hl-lang{font-family:var(--code-font-family,Consolas,\'Liberation Mono\',Menlo,Courier,monospace);' +
            'font-weight:600;font-size:11px;color:#3a3a3a;pointer-events:none;padding-left:2px;' +
            'margin-right:auto;user-select:none;-webkit-user-select:none}' +
            '.dark-theme .hl-lang{color:#ddd}' +
            // 圆形按钮，背景统一半透明灰（--header-divider-color 在 main 亮色下过浅，圆框隐形）
            '.hl-copy{width:24px;height:24px;padding:0;border:none;border-radius:50%;cursor:pointer;' +
            'display:flex;align-items:center;justify-content:center;color:#3a3a3a;pointer-events:auto;' +
            'background:rgba(128,128,128,.22);transition:opacity .2s}' +
            '.hl-copy:hover{opacity:.8}' +
            // color:inherit 压过主题全局 svg{color:var(--svg-color)}，让 stroke=currentColor 跟随按钮色（copied 变绿）
            '.hl-copy svg{display:block;color:inherit}' +
            '.dark-theme .hl-copy{color:#ddd}' +
            '.hl-copy.copied{color:#22863a}' +
            '.dark-theme .hl-copy.copied{color:#7ee787}' +
            // 深色代码块（部分子主题如 landscape 页面浅色但代码块深底）：enhance 时按背景亮度加类自适应
            '.hl-dark-box .hl-lang{color:#ddd}' +
            '.hl-dark-box .hl-copy{color:#ddd}' +
            '.hl-dark-box .hl-copy.copied{color:#7ee787}' +
            // 折叠按钮：语言标签左侧，点击展开/收起代码区（收起时箭头转向右、隐藏 table）
            '.hl-fold{width:20px;height:20px;padding:0;border:none;background:none;cursor:pointer;pointer-events:auto;' +
            'display:flex;align-items:center;justify-content:center;color:#3a3a3a;transition:transform .2s}' +
            '.hl-fold:hover{opacity:.8}' +
            '.hl-fold svg{display:block;color:inherit}' +
            '.dark-theme .hl-fold,.hl-dark-box .hl-fold{color:#ddd}' +
            '.highlight.is-collapsed table{display:none}' +
            '.highlight.is-collapsed .hl-fold{transform:rotate(-90deg)}';
        document.head.appendChild(style);
    }

    function getCodeText(figure) {
        var code = figure.querySelector('td.code') || figure.querySelector('pre');
        return code ? code.innerText : '';
    }

    // 启发式语言识别：仅用于未指定语言（plaintext/无标记）的代码块，按特征顺序匹配
    function detectLang(figure) {
        var s = getCodeText(figure).slice(0, 600).trim();
        if (!s) return '';
        if (/^[{[]/.test(s) && /"[\w.-]+"\s*:/.test(s)) return 'json';
        if (/^#!.*\b(bash|sh|zsh)\b/m.test(s) || /^(\$|>)\s+\S/m.test(s) ||
            /^(npm|yarn|pnpm|git|sudo|curl|wget|pip|brew|apt|cd|mkdir|mv|cp|rm)\s/m.test(s)) return 'shell';
        if (/^<\?xml[\s>]/.test(s)) return 'xml';
        if (/<!DOCTYPE html|<html[\s>]/i.test(s)) return 'html';
        if (/^<\/?[\w:-]+[\s>]/.test(s)) return 'xml';
        if (/(^|\n)\s*(def |class \w+|import \w|from \w+ import)/.test(s)) return 'python';
        if (/(function\s*\w*\s*\(|=>|const \w|let \w|console\.log)/.test(s)) return 'javascript';
        if (/\b(SELECT\b[\s\S]*\bFROM|INSERT INTO|CREATE TABLE|UPDATE \w+ SET)\b/i.test(s)) return 'sql';
        // 纯命令行片段：注释行（#…）+ 小写命令行（无标点；允许行尾 // 注释）
        var lines = s.split('\n').map(function (t) { return t.trim(); }).filter(Boolean);
        if (lines.length && /[a-z]/.test(s) && lines.every(function (l) {
            var c = l.replace(/\/\/.*$/, '').trim();
            if (!c || /^#/.test(c)) return true;
            return /^(\$|>)\s*\S/.test(c) || /^[a-z][\w@/-]*(\s+--?[\w-]+|\s+[\w./@:%-]+)*$/.test(c);
        })) return 'shell';
        if (!/[{};]/.test(s) && /(^|\n)\s*[\w.-]+\s*:\s+\S/.test(s)) return 'yaml';
        return '';
    }

    function copyText(str, done) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(str).then(done, function () { fallbackCopy(str, done); });
        } else {
            fallbackCopy(str, done);
        }
    }

    // 兼容兜底：隐藏 textarea + execCommand
    function fallbackCopy(str, done) {
        var ta = document.createElement('textarea');
        ta.value = str;
        ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } catch (err) { /* 忽略 */ }
        document.body.removeChild(ta);
    }

    // 代码块背景是否为深色（采样 figure → 内部 td.code/pre 的不透明背景色算亮度）
    function isDarkBox(figure) {
        var el = figure;
        for (var i = 0; i < 2 && el; i++) {
            var bg = getComputedStyle(el).backgroundColor;
            var m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
            if (m && (m[4] === undefined || parseFloat(m[4]) > 0.5)) {
                return (0.299 * m[1] + 0.587 * m[2] + 0.114 * m[3]) < 140;
            }
            el = el.querySelector('td.code') || el.querySelector('pre');
        }
        return false;
    }

    function enhance(figure) {
        if (figure.querySelector('.hl-copy')) return; // 已增强
        // 主题自带 caption 头部（如 icarus：折叠按钮 + 复制按钮 + 语言名）时不注入，避免重复
        if (figure.querySelector('figcaption')) return;
        var tools = document.createElement('div');
        tools.className = 'hl-tools';

        // 折叠按钮：语言左侧，点击展开/收起代码区（隐藏 table，箭头随状态旋转）
        var fold = document.createElement('button');
        fold.type = 'button';
        fold.className = 'hl-fold';
        fold.setAttribute('aria-expanded', 'true');
        fold.title = text.collapse;
        fold.innerHTML = ICON_CHEVRON;
        fold.addEventListener('click', function () {
            var collapsed = figure.classList.toggle('is-collapsed');
            fold.setAttribute('aria-expanded', String(!collapsed));
            fold.title = collapsed ? text.expand : text.collapse;
        });
        tools.appendChild(fold);

        // 语言标签：取 figure 的第二个 class（hexo 输出 "highlight <lang>"）；
        // 未指定语言（plaintext/无标记）时启发式自动识别，识别不出按 plaintext 展示
        var lang = (figure.className.split(/\s+/)[1] || '').toLowerCase();
        if (!lang || lang === 'plaintext') lang = detectLang(figure) || 'plaintext';
        if (lang) {
            var label = document.createElement('span');
            label.className = 'hl-lang';
            label.textContent = lang;
            tools.appendChild(label);
        }

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'hl-copy';
        btn.setAttribute('aria-label', text.copy);
        btn.title = text.copy;
        btn.innerHTML = ICON_COPY;
        var timer = null;
        btn.addEventListener('click', function () {
            copyText(getCodeText(figure), function () {
                btn.classList.add('copied');
                btn.innerHTML = ICON_CHECK;
                btn.title = text.copied;
                clearTimeout(timer);
                timer = setTimeout(function () {
                    btn.classList.remove('copied');
                    btn.innerHTML = ICON_COPY;
                    btn.title = text.copy;
                }, 1500);
            });
        });
        tools.appendChild(btn);
        if (isDarkBox(figure)) figure.classList.add('hl-dark-box');
        figure.classList.add('hl-enhanced');
        figure.appendChild(tools);
    }

    function init() {
        // 零开销守卫：无代码块直接返回（脚本在 head 执行时 DOM 未解析，必须延迟到此处判断）
        var figures = document.querySelectorAll('figure.highlight');
        if (!figures.length) return;
        injectStyle();
        Array.prototype.forEach.call(figures, enhance);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
