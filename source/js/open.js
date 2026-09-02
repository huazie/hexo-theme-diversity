(function () {
    // 开源项目展示模式切换（方格 / 列表）
    var list = document.getElementById('open-list');
    if (!list) return;

    // 展开/收起文案：由 open.ejs 通过 data 属性注入（i18n），缺省兜底中文
    var moreText = list.dataset.more || '更多>>';
    var collapseText = list.dataset.collapse || '收起';

    var buttons = document.querySelectorAll('.open-switch');
    buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var mode = btn.getAttribute('data-mode');
            list.className = 'open-' + mode;
            buttons.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            requestAnimationFrame(applyClamp);
        });
    });

    // 手机端卡片展开/收起：同步所有卡片，避免同行等高拉伸留白
    var toggles = document.querySelectorAll('.open-toggle');
    var cards = document.querySelectorAll('.open-card');
    function setAllExpanded(on) {
        cards.forEach(function (c) { c.classList.toggle('expanded', on); });
        toggles.forEach(function (t) {
            t.setAttribute('aria-expanded', on ? 'true' : 'false');
            t.setAttribute('aria-label', on ? collapseText : moreText);
        });
    }
    toggles.forEach(function (t) {
        t.addEventListener('click', function () {
            var card = t.closest('.open-card');
            if (!card) return;
            // 以当前卡片目标状态为准，同步所有卡片
            setAllExpanded(!card.classList.contains('expanded'));
        });
    });

    // 搜索：按 名称/描述/标签/语言/协议/作者 模糊匹配，多关键词按空格拆分取交集
    var input = document.getElementById('open-search-input');
    var clearBtn = list.parentNode.querySelector('.open-search-clear');
    var status = list.parentNode.querySelector('.open-status');
    var noResult = list.parentNode.querySelector('.open-no-result');
    // 参与高亮的元素：缓存原始文本，避免高亮标签叠加
    var marks = [];
    cards.forEach(function (card) {
        card.querySelectorAll('.open-name, .open-desc, .open-tag, .open-badge-value').forEach(function (n) {
            if (n.dataset.raw === undefined) n.dataset.raw = n.textContent;
            marks.push(n);
        });
    });

    function escapeHtml(s) {
        return s.replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    // 按字符掩码标记命中区间，避免多关键词下嵌套/重叠替换
    function markText(text, tokens) {
        var lower = text.toLowerCase();
        var mask = [];
        var hit = false;
        tokens.forEach(function (tk) {
            var from = 0, idx;
            while ((idx = lower.indexOf(tk, from)) !== -1) {
                for (var i = idx; i < idx + tk.length; i++) mask[i] = true;
                hit = true;
                from = idx + tk.length;
            }
        });
        if (!hit) return escapeHtml(text);
        var out = '', buf = '', on = false;
        for (var i = 0; i < text.length; i++) {
            if (mask[i] && !on) { out += escapeHtml(buf) + '<mark class="open-hl">'; buf = ''; on = true; }
            else if (!mask[i] && on) { out += escapeHtml(buf) + '</mark>'; buf = ''; on = false; }
            buf += text[i];
        }
        return out + escapeHtml(buf) + (on ? '</mark>' : '');
    }

    function applySearch() {
        var value = (input.value || '').toLowerCase().trim();
        var tokens = value ? value.split(/\s+/) : [];
        var matched = 0;

        cards.forEach(function (card) {
            var text = (card.dataset.search || '').toLowerCase();
            var ok = tokens.every(function (tk) { return text.indexOf(tk) !== -1; });
            card.classList.toggle('is-hidden', !ok);
            if (ok) matched++;
        });

        marks.forEach(function (n) {
            n.innerHTML = tokens.length ? markText(n.dataset.raw, tokens) : escapeHtml(n.dataset.raw);
        });

        if (clearBtn) clearBtn.hidden = !value;
        if (status) {
            status.hidden = !tokens.length;
            // 占位符用 {n}：hexo 的 __() 会把 %s 立即格式化掉
            if (tokens.length) status.textContent = (status.dataset.result || '{n}').replace('{n}', matched);
        }
        if (noResult) noResult.hidden = !(tokens.length && !matched);

        requestAnimationFrame(applyClamp);
    }

    if (input) {
        var timer;
        input.addEventListener('input', function () {
            clearTimeout(timer);
            timer = setTimeout(applySearch, 100);
        });
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && input.value) { input.value = ''; applySearch(); }
        });
    }
    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            input.value = '';
            applySearch();
            input.focus();
        });
    }

    // 描述两行省略 + 「更多>>」展开/收起（无溢出时不渲染占位，不占用空间）
    function applyClamp() {
        var descs = list.querySelectorAll('.open-desc');
        descs.forEach(function (desc) {
            // 被搜索过滤掉的卡片无需测量（display:none 下高度恒为 0）
            var card = desc.closest('.open-card');
            if (card && card.classList.contains('is-hidden')) return;
            // 清理旧的「更多」按钮
            var old = desc.parentNode.querySelector(':scope > .open-more');
            if (old) old.remove();

            // 先恢复未省略态，测量完整高度与省略态高度
            desc.classList.remove('clamp');
            var full = desc.scrollHeight;
            desc.classList.add('clamp');
            var clamped = desc.clientHeight;
            var overflow = full > clamped + 2;

            var expanded = desc.dataset.expanded === '1';
            if (overflow) {
                if (expanded) {
                    desc.classList.remove('clamp');
                }
                var link = document.createElement('span');
                link.className = 'open-more';
                link.textContent = expanded ? collapseText : moreText;
                link.addEventListener('click', function () {
                    var on = desc.dataset.expanded !== '1';
                    desc.dataset.expanded = on ? '1' : '0';
                    desc.classList.toggle('clamp', !on);
                    link.textContent = on ? collapseText : moreText;
                    requestAnimationFrame(applyClamp);
                });
                desc.parentNode.insertBefore(link, desc.nextSibling);
            } else {
                desc.classList.remove('clamp');
            }
        });
    }

    window.addEventListener('resize', function () { requestAnimationFrame(applyClamp); });
    window.addEventListener('load', function () { requestAnimationFrame(applyClamp); });
    applyClamp();
})();
