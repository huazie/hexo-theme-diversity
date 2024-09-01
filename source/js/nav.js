(function(){

	// phone端菜单栏展示
	var body = document.getElementsByTagName('body')[0];
	var navToggle = document.getElementById('mobile-nav-toggle');
	var dimmer = document.getElementById('mobile-nav-dimmer');
	var CLASS_NAME = 'mobile-nav-on';
	if (!navToggle) return;

	navToggle.addEventListener('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
		body.classList.toggle(CLASS_NAME);
	});

	dimmer.addEventListener('click', function(e) {
		if (!body.classList.contains(CLASS_NAME)) return;
		e.preventDefault();
		body.classList.remove(CLASS_NAME);
	});

	document.querySelectorAll('li.main-nav-li').forEach(navActive);
	document.querySelectorAll('li.mobile-nav-li').forEach(navActive);

    /**
	 * 导航栏选项激活显示
	 * 
	 * @param {HTMLElement} thiz - 当前遍历到的 li 元素
	 */
    function navActive(thiz) {
        const a = thiz.querySelector('a');
        if (!a) return; // 如果没有找到 a 元素，则直接返回
        let href = a.getAttribute('href');
        // 如果菜单url没有配置“/” 结尾，则添加。
        if (!href.endsWith("/")) href += "/";
        if (window.location.href.endsWith(href) || (window.location.pathname === '/' 
            && (href === '/' || href === config.menu.blog))) {
            // 添加激活显示的样式
            thiz.classList.add('active');
            // 添加事件监听器阻止默认行为
            a.addEventListener('click', function(event) {
                event.preventDefault();
            });
        }
    }	

})();