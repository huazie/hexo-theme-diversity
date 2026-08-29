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

    // 描述两行省略 + 「更多>>」展开/收起（无溢出时不渲染占位，不占用空间）
    function applyClamp() {
        var descs = list.querySelectorAll('.open-desc');
        descs.forEach(function (desc) {
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
