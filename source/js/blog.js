(function($){
	// 展示默认的主题
	showDefaultBlogPage();
})(jQuery);

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
        url = href.replace(port, getThemeServerPort(theme));
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
            let iframeWindow = blogIframe.contentWindow || blogIframe.contentDocument.defaultView;
            // 获取header标签
            let navHeaderClassList = document.getElementById('header').classList;
            // 添加iframe窗口的滚动事件
            iframeWindow.addEventListener('scroll', function() {
                let scrollHeight = iframeWindow.pageYOffset || iframeWindow.document.documentElement.scrollTop;
                if (scrollHeight >= config.page.blog_scroll_height) {
                    // 隐藏菜单导航栏
                    navHeaderClassList.add('hidden');
                } else {
                    // 显示菜单导航栏
                    navHeaderClassList.remove('hidden');
                }
            });
        } catch (error) {
        }
    });
}

function getThemeServerPort(theme) {
    let index = config.themes.indexOf(theme);
    const ports = config.ports;
    let port = 4001;
    if (ports && ports[index]) {
        port = ports[index];
    } else {
        port += index;
    }
    return port;
}