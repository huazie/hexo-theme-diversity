(function () {
    /**
     * 激活指定的 tab 项（纯原生 JS，不依赖 Bootstrap）
     * @param {HTMLElement} tabElement - 被点击的 <a data-toggle="tab"> 元素
     */
    function activateTab(tabElement) {
        if (!tabElement) return;

        const targetId = tabElement.getAttribute('href');
        if (!targetId) return;

        // 移除所有 active 状态
        var allTabs = document.querySelectorAll('.nav-tabs li');
        var allLinks = document.querySelectorAll('.nav-tabs a[data-toggle="tab"]');
        var allPanes = document.querySelectorAll('.tab-content .tab-pane');

        for (var i = 0; i < allTabs.length; i++) allTabs[i].classList.remove('active');
        for (var j = 0; j < allLinks.length; j++) allLinks[j].classList.remove('active');
        for (var k = 0; k < allPanes.length; k++) allPanes[k].classList.remove('active');

        // 激活当前 tab 和对应面板
        var parentLi = tabElement.parentElement;
        if (parentLi) parentLi.classList.add('active');
        tabElement.classList.add('active');

        var targetPane = document.querySelector(targetId);
        if (targetPane) targetPane.classList.add('active');
    }

    /**
     * 默认激活第一个 tab
     */
    function activateFirstTab() {
        var firstTab = document.querySelector('.nav-tabs a[data-toggle="tab"]');
        if (firstTab) activateTab(firstTab);
    }

    /**
     * 绑定 tab 点击事件（事件委托）
     */
    function bindTabEvents() {
        var navTab = document.getElementById('comment-nav-tab');
        if (!navTab) return;

        var storage = config.comments.storage;

        navTab.addEventListener('click', function(event) {
            var target = event.target.closest('a[data-toggle="tab"]');
            if (!target) return;

            event.preventDefault();
            activateTab(target);

            if (storage) {
                var comment = target.dataset.comment;
                if (comment) {
                    Diversity.data.set('selected_comment', comment);
                }
            }
        });
    }

    /**
     * 初始化 tabs
     */
    function initTabs() {
        var storage = config.comments.storage;
        if (!storage) {
            Diversity.data.remove('selected_comment');
        }

        var comment = Diversity.data.get('selected_comment');

        if (comment) {
            var element = document.querySelector('a[data-comment="' + comment + '"]');
            if (element) {
                activateTab(element);
            } else {
                activateFirstTab();
            }
        } else {
            activateFirstTab();
        }

        bindTabEvents();
    }

    // DOM 就绪后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTabs);
    } else {
        initTabs();
    }

})();