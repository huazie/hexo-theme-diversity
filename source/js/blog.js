(function(){
	// 展示默认的主题
	showDefaultBlogPage();
})();

function showDefaultBlogPage() {
    // 设置的默认主题名
    const theme = Diversity.data.get('theme');
    const blogIframe = document.getElementById('blog');
	// 如果没有设置默认主题，则跳转无主题页
	if (!theme) {
        blogIframe.src = '/no-theme.html';
        return;
    }

    // 添加loading效果
    blogIframe.classList.add('loading');

    const href = window.location.href;
    const hostname = window.location.hostname;
    const port = window.location.port;

    let url;

    // 本地环境 localhost 或者 127.0.0.1 或者 同个局域网下带有端口
    if (port) {
        url = href.replace(port, Diversity.data.getThemeServerPort(theme));
    } else { // 静态页面部署环境
        url = href;
    }

    // 获取path参数，blogIframe中的页面链接路径
    let path = Diversity.browser.getParameter('path');

    // 截取url中非参数的部分【不包含 ? 】
    url = url.indexOf('?') != -1 ? url.substring(0, url.indexOf('?')) : url;

    // 主题选择页面路径含其他内容，类似 '/diversity/theme'，直接导航有问题，需要去除
    url = url.replace(config.menu.blog, '');

    if (!url.endsWith("/")) url += "/";

    url += theme;

    // 如果存在页面链接路径参数，则追加到博客页访问url中
    if (path) 
        url += path;

    blogIframe.src = url;

    blogIframe.addEventListener('load', function() {
        // 去除loading效果
        blogIframe.classList.remove('loading');
        try {
            // 注意：这块代码本地因为针对不同主题启动不同的http服务，主页面与iframe页面跨域了，无法正常运行
            // 获取iframe的窗口对象
            const iframeWindow = blogIframe.contentWindow || blogIframe.contentDocument.defaultView;
            // 获取header标签
            const header = document.getElementById('header');
            // 获取header标签的类名列表
            const navHeaderClassList = header.classList;
            // 获取返回顶部按钮
            const backToTop = document.querySelector('.back-to-top');
            // 添加iframe窗口的滚动事件
            iframeWindow && iframeWindow.addEventListener('scroll', function() {
                let scrollHeight = iframeWindow.pageYOffset || iframeWindow.document.documentElement.scrollTop;
                // 菜单导航栏处于显示的状态
                if (!navHeaderClassList.contains('hidden')) {
                    // 博客页滚动高度要减掉header标签的高度
                    scrollHeight -= header.clientHeight;
                }
                // 隐藏或显示菜单导航栏
                navHeaderClassList.toggle('hidden', scrollHeight >= config.page.blog_scroll_height);
                // 获取页面可以滚动的高度
                const contentHeight = iframeWindow.document.body.scrollHeight - iframeWindow.innerHeight;
                // 当前滚动位置占总可滚动高度的百分比
                const scrollPercent = contentHeight > 0 ? Math.min(100 * iframeWindow.scrollY / contentHeight, 100) : 0;
                if (backToTop) {
                    backToTop.classList.toggle('back-to-top-on', Math.round(scrollPercent) >= config.back2top.scroll_percent);
                    backToTop.querySelector('span').innerText = Math.round(scrollPercent) + '%';
                }
            });

            backToTop && backToTop.addEventListener('click', () => {
                window.anime({
                    targets  : iframeWindow && iframeWindow.document.scrollingElement,
                    duration : 500,
                    easing   : 'linear',
                    scrollTop: 0
                });
            });

            if (iframeWindow) {
                // 当前设置的默认主题
                const theme = Diversity.data.get('theme');
                // 博客页iframe窗口的pathname，包含主题名的某个路径【例如 /landscape/archives/】
                let blogPath = iframeWindow.location.pathname;
                // 取pathname中，主题名后的部分【如上取 /archives/】
                blogPath = blogPath.substring(blogPath.indexOf(theme) + theme.length);
                // 博客页主窗口的pathname
                const originPath = window.location.pathname;
                // path参数
                let param = blogPath === '/' ? '' : '?path=' + blogPath;
                // 浏览器展示的新地址
                const newUrl = window.location.origin + originPath + param;
                // 使用 replaceState 替换当前的历史记录条目，并更新博客页主窗口的地址栏
                history && history.replaceState({ path: originPath }, '', newUrl);
            }
        } catch (error) {
        }

        // 深色模式
        if (Diversity.utils.isDarkMode()) {
            blogIframe.classList.add('dark-filter');
        }
    });

    // 获取返回顶部按钮
    const backToTop = document.querySelector('.back-to-top');
    // 被排除主题，配置中的主题不展示返回顶部按钮
    const excludeArr = config.back2top.exclude;
    if (excludeArr && excludeArr.includes(theme)) {
        backToTop.parentNode.removeChild(backToTop);
    }
}

document.addEventListener('color-scheme:refresh', () => {
    try {
        const theme = Diversity.data.get('theme');
        const blogIframe = document.getElementById('blog');
        // 没有设置默认主题
        if (!theme)
            blogIframe.contentDocument.documentElement.classList.toggle("dark-theme");
        else
            blogIframe.classList.toggle('dark-filter');
    } catch (error) {
    }
});