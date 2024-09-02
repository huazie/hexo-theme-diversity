(function(){
	// 展示默认的主题
	showDefaultBlogPage();
})();

function showDefaultBlogPage() {
    const theme = Diversity.data.get('theme');
    const blogIframe = document.getElementById('blog');
	// 如果没有设置默认主题，则跳转无主题页
	if (!theme) {
        const flag = Diversity.data.get('theme_flag');
        blogIframe.src = '/no-theme.html?theme_flag=' + (flag ? flag : 0);
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

    // 主题选择页面路径含其他内容，类似 '/diversity/theme'，直接导航有问题，需要去除
    url = url.replace(config.menu.blog, '');

    if (!url.endsWith("/")) url += "/";

    url += theme;

    blogIframe.src = url;

    blogIframe.addEventListener('load', function() {
        // 去除loading效果
        blogIframe.classList.remove('loading');
        try {
            // 注意：这块代码本地因为针对不同主题启动不同的http服务，主页面与iframe页面跨域了，无法正常运行
            // 获取iframe的窗口对象
            const iframeWindow = blogIframe.contentWindow || blogIframe.contentDocument.defaultView;
            // 获取header标签
            const navHeaderClassList = document.getElementById('header').classList;
            // 获取返回顶部按钮
            const backToTop = document.querySelector('.back-to-top');
            // 添加iframe窗口的滚动事件
            iframeWindow && iframeWindow.addEventListener('scroll', function() {
                const scrollHeight = iframeWindow.pageYOffset || iframeWindow.document.documentElement.scrollTop;
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
        } catch (error) {
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