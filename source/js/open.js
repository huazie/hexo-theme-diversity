(function () {
    // 开源项目展示模式切换（方格 / 列表）
    var list = document.getElementById('open-list');
    if (!list) return;

    // 展开/收起文案：由 open.ejs 通过 data 属性注入（i18n），缺省兜底中文
    var moreText = list.dataset.more || '更多>>';
    var collapseText = list.dataset.collapse || '收起';

    // 分页配置：每页条数由 open.ejs 通过 data 属性注入（theme.open.page_size，0 表示不分页）
    var pageSize = parseInt(list.dataset.pageSize, 10) || 0;
    var currentPage = 1;

    var buttons = document.querySelectorAll('.open-switch');
    // 视图模式记忆：用主题 Diversity.data 工具类存取（localStorage 优先，降级 Cookies），刷新后恢复
    var DISPLAY_KEY = 'open-display';
    var store = window.Diversity && Diversity.data;
    var savedDisplay = store ? store.get(DISPLAY_KEY) : null;
    if (savedDisplay === 'grid' || savedDisplay === 'list') {
        list.className = 'open-' + savedDisplay;
        buttons.forEach(function (b) {
            b.classList.toggle('active', b.getAttribute('data-mode') === savedDisplay);
        });
    }
    buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var mode = btn.getAttribute('data-mode');
            list.className = 'open-' + mode;
            buttons.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            if (store) store.set(DISPLAY_KEY, mode);
            applyGridCols();
            requestAnimationFrame(applyClamp);
            replayCardAnim();
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
    // 标签筛选：activeTag 单选（再次点击取消），与搜索关键词取交集
    var tagbar = list.parentNode.querySelector('.open-tagbar');
    var activeTag = '';
    // 筛选栏中动态补充的 chip（点击卡片标签筛选时，该标签可能不在常用标签栏里）
    var dynamicChip = null;
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

    // 筛选栏 chip 高亮同步：选中态把 count 徽标换成 ×（点击 × 直接删除筛选并清理 URL）；
    // 当前选中标签不在筛选栏时（点击卡片标签筛选的场景），动态补一个可删除的 chip
    var X_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    function syncTagbar() {
        if (!tagbar) return;
        // 移除上一轮的动态 chip，避免重复累积
        if (dynamicChip && dynamicChip.parentNode) dynamicChip.parentNode.removeChild(dynamicChip);
        dynamicChip = null;
        var known = false;
        tagbar.querySelectorAll('.open-tagchip').forEach(function (chip) {
            if (chip.getAttribute('data-tag') === activeTag) known = true;
        });
        if (activeTag && !known) {
            dynamicChip = document.createElement('button');
            dynamicChip.type = 'button';
            dynamicChip.className = 'open-tagchip';
            dynamicChip.setAttribute('data-tag', activeTag);
            dynamicChip.innerHTML = escapeHtml(activeTag);
            tagbar.appendChild(dynamicChip);
        }
        tagbar.querySelectorAll('.open-tagchip').forEach(function (chip) {
            var on = chip.getAttribute('data-tag') === activeTag;
            chip.classList.toggle('active', on);
            chip.setAttribute('aria-pressed', on ? 'true' : 'false');
            var x = chip.querySelector('.open-tagchip-x');
            if (on && !x) {
                x = document.createElement('span');
                x.className = 'open-tagchip-x';
                x.setAttribute('aria-hidden', 'true');
                x.innerHTML = X_SVG;
                chip.appendChild(x);
            } else if (!on && x) {
                x.parentNode.removeChild(x);
            }
        });
    }

    // URL 同步（③）：?q=搜索词&tag=标签；replaceState 不产生历史记录，刷新/分享可还原，前进后退由 popstate 处理
    function writeUrl() {
        if (!window.URLSearchParams || !window.history || !history.replaceState) return;
        var params = new URLSearchParams(location.search);
        if (input.value.trim()) params.set('q', input.value.trim()); else params.delete('q');
        if (activeTag) params.set('tag', activeTag); else params.delete('tag');
        var qs = params.toString();
        history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
    }

    // 从 URL 还原 搜索词/标签（仅接受卡片真实存在的标签，避免无效值）
    function initFromUrl() {
        if (!window.URLSearchParams) return;
        var params = new URLSearchParams(location.search);
        input.value = params.get('q') || '';
        activeTag = '';
        var tag = params.get('tag') || '';
        if (tag) {
            // cards 是 NodeList，无 some 方法，借用 Array.prototype
            var valid = Array.prototype.some.call(cards, function (c) {
                return (c.dataset.tags || '').split('|').indexOf(tag) !== -1;
            });
            if (valid) activeTag = tag;
        }
        syncTagbar();
    }

    function applySearch(animate) {
        var value = (input.value || '').toLowerCase().trim();
        var tokens = value ? value.split(/\s+/) : [];
        var matched = 0;

        cards.forEach(function (card) {
            var text = (card.dataset.search || '').toLowerCase();
            var ok = tokens.every(function (tk) { return text.indexOf(tk) !== -1; });
            // 标签筛选与关键词取交集
            if (ok && activeTag) ok = (card.dataset.tags || '').split('|').indexOf(activeTag) !== -1;
            // 只记录命中标记，是否隐藏（未命中 / 不在当前页）统一交给 applyPage 处理
            card.dataset.match = ok ? '1' : '0';
            if (ok) matched++;
        });

        marks.forEach(function (n) {
            n.innerHTML = tokens.length ? markText(n.dataset.raw, tokens) : escapeHtml(n.dataset.raw);
        });

        if (clearBtn) clearBtn.hidden = !value;
        if (status) {
            // 有关键词或选中标签即展示结果计数
            var filtering = tokens.length > 0 || !!activeTag;
            status.hidden = !filtering;
            // 占位符用 {n}：hexo 的 __() 会把 %s 立即格式化掉
            if (filtering) status.textContent = (status.dataset.result || '{n}').replace('{n}', matched);
        }
        if (noResult) noResult.hidden = !((tokens.length || activeTag) && !matched);

        // 状态写入 URL
        writeUrl();
        // 新搜索从头翻页
        currentPage = 1;
        applyPage(animate);
    }

    if (input) {
        var timer;
        input.addEventListener('input', function () {
            clearTimeout(timer);
            timer = setTimeout(applySearch, 100);
        });
        input.addEventListener('keydown', function (e) {
            // Esc：有关键词清关键词，仅有标签清标签（清空并失焦）
            if (e.key === 'Escape' && (input.value || activeTag)) {
                input.value = '';
                activeTag = '';
                syncTagbar();
                applySearch();
                input.blur();
            }
        });
    }
    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            input.value = '';
            applySearch();
            input.focus();
        });
    }
    // 清空搜索与标签并回到完整列表（清除按钮 / 无结果重置按钮共用）
    function resetSearch() {
        input.value = '';
        activeTag = '';
        syncTagbar();
        applySearch();
        replayCardAnim();
    }
    var resetBtn = list.parentNode.querySelector('.open-reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            resetSearch();
            input.focus();
        });
    }
    // 标签筛选入口（①）：筛选栏 chip 与卡片内标签均可触发；事件委托读 data-tag，标签高亮重绘不影响
    function toggleTag(tag) {
        activeTag = activeTag === tag ? '' : tag;
        syncTagbar();
        applySearch(true);
    }
    if (tagbar) {
        tagbar.addEventListener('click', function (e) {
            var chip = e.target.closest('.open-tagchip');
            if (!chip) return;
            // × 仅负责删除筛选（清空 activeTag 并同步清理 URL）
            if (e.target.closest('.open-tagchip-x')) {
                activeTag = '';
                syncTagbar();
                applySearch(true);
                return;
            }
            toggleTag(chip.getAttribute('data-tag'));
        });
    }
    list.addEventListener('click', function (e) {
        var tag = e.target.closest('.open-tag');
        if (!tag || !tag.getAttribute('data-tag')) return;
        var wasActive = activeTag === tag.getAttribute('data-tag');
        toggleTag(tag.getAttribute('data-tag'));
        // 选中新标签时回到列表顶部，便于查看筛选结果；取消选中不动
        if (!wasActive && activeTag) list.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    // 快捷键：/ 聚焦搜索框（输入类元素聚焦时不抢占），Esc 清空并失焦
    if (input) {
        document.addEventListener('keydown', function (e) {
            if (e.key !== '/') return;
            var active = document.activeElement;
            var typing = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
            if (typing) return;
            e.preventDefault();
            input.focus();
        });
    }

    // 分页：对「搜索命中的卡片」按 pageSize 分页；is-hidden = 未命中 或 不在当前页
    var pagination = document.getElementById('open-pagination');
    // 上一页/下一页文案：由 open.ejs 通过 data 属性注入（i18n），缺省兜底中文
    var prevText = (pagination && pagination.dataset.prev) || '上一页';
    var nextText = (pagination && pagination.dataset.next) || '下一页';

    // PC 端方格列数自适应：行数不超过 4 的前提下选「浪费位最少」的列数（上限 4，平票取更大列数），保证尽量铺满整行
    var GRID_COL_MAX = 4;
    var GRID_ROW_MAX = 4;
    var GRID_COL_MIN_W = 320; // 与 open.styl 中 minmax 最小列宽保持一致
    function idealGridCols(n) {
        if (n <= 1) return Math.max(1, n);
        var best = Math.min(n, GRID_COL_MAX), bestWaste = Infinity;
        for (var c = Math.min(n, GRID_COL_MAX); c >= 2; c--) {
            var rows = Math.ceil(n / c);
            if (rows > GRID_ROW_MAX) continue;
            var waste = rows * c - n;
            if (waste < bestWaste) { bestWaste = waste; best = c; }
        }
        return best;
    }

    // 方格列数落库：list 宽度不足以容纳理想列数时降级（保证卡片不挤）；列表模式/不分页时清除，交回 auto-fill
    function applyGridCols() {
        if (!list.classList.contains('open-grid') || pageSize <= 0) {
            list.classList.remove('has-grid-cols');
            return;
        }
        var gap = 24; // 与 open.styl 桌面端 gap 保持一致
        var width = list.clientWidth || list.parentNode.clientWidth;
        // 方格最少一行 2 个：宽度降级与理想列数计算结果都保底 2 列
        var byWidth = Math.max(2, Math.floor((width + gap) / (GRID_COL_MIN_W + gap)));
        var cols = Math.max(2, Math.min(idealGridCols(pageSize), byWidth));
        list.classList.add('has-grid-cols');
        list.style.setProperty('--open-grid-cols', cols);
    }

    function applyPage(animate) {
        var matched = 0;
        var start = 0;
        var end;
        if (pageSize > 0) {
            cards.forEach(function (card) {
                if (card.dataset.match !== '0') matched++;
            });
            var totalPages = Math.max(1, Math.ceil(matched / pageSize));
            if (currentPage > totalPages) currentPage = totalPages;
            if (currentPage < 1) currentPage = 1;
            start = (currentPage - 1) * pageSize;
            end = start + pageSize;
        }
        var vi = 0;
        cards.forEach(function (card) {
            var isMatch = card.dataset.match !== '0';
            var show = isMatch && (pageSize <= 0 || (vi >= start && vi < end));
            if (isMatch) vi++;
            card.classList.toggle('is-hidden', !show);
        });
        renderPagination(pageSize > 0 ? matched : 0);
        requestAnimationFrame(applyClamp);
        // 列表内容整体变化时（翻页/重置）播放入场动画；搜索输入的高频变化不播，避免闪烁
        if (animate) replayCardAnim();
    }

    // 卡片 stagger 入场：逐个延迟淡入上浮，动画由 CSS .anim-in 定义（尊重系统减弱动态效果设置）
    function replayCardAnim() {
        var visible = list.querySelectorAll('.open-card:not(.is-hidden)');
        visible.forEach(function (card, i) {
            card.classList.remove('anim-in');
            void card.offsetWidth; // 强制 reflow 重启动画
            card.style.animationDelay = Math.min(i * 40, 320) + 'ms';
            card.classList.add('anim-in');
        });
    }

    // 页码按钮全部重绘（数量少，无需增量更新）；prev/next 越界时禁用
    function renderPagination(matched) {
        if (!pagination) return;
        if (pageSize <= 0 || matched <= pageSize) {
            pagination.hidden = true;
            pagination.innerHTML = '';
            return;
        }
        var totalPages = Math.ceil(matched / pageSize);
        var html = '<button class="open-page-btn open-page-nav" data-page="prev" aria-label="' + prevText + '"' + (currentPage === 1 ? ' disabled' : '') + '><svg class="open-page-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button>';
        for (var i = 1; i <= totalPages; i++) {
            html += '<button class="open-page-btn' + (i === currentPage ? ' active' : '') + '" data-page="' + i + '"' + (i === currentPage ? ' aria-current="page"' : '') + '>' + i + '</button>';
        }
        html += '<button class="open-page-btn open-page-nav" data-page="next" aria-label="' + nextText + '"' + (currentPage === totalPages ? ' disabled' : '') + '><svg class="open-page-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button>';
        pagination.innerHTML = html;
        pagination.hidden = false;
    }

    if (pagination) {
        // 事件委托：按钮随 innerHTML 重绘，监听挂在容器上
        pagination.addEventListener('click', function (e) {
            var btn = e.target.closest('[data-page]');
            if (!btn || btn.disabled) return;
            var p = btn.getAttribute('data-page');
            if (p === 'prev') currentPage--;
            else if (p === 'next') currentPage++;
            else currentPage = parseInt(p, 10) || 1;
            applyPage(true);
            list.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

    window.addEventListener('resize', function () { requestAnimationFrame(applyGridCols); requestAnimationFrame(applyClamp); });
    window.addEventListener('load', function () { requestAnimationFrame(applyClamp); });
    // 浏览器前进/后退时按 URL 还原筛选状态
    window.addEventListener('popstate', function () {
        initFromUrl();
        applySearch();
    });
    applyGridCols();
    // 从 URL 还原 搜索词/标签（?q= & ?tag=），初次加载播一次入场动画
    initFromUrl();
    applySearch(true);
})();
