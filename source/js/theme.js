(function($){
    document.body.classList.remove('bg-color');
    document.body.classList.add('bg-img');
    document.body.classList.add('touch-none');
    
    const COOKIE_NAME = 'theme';

    // 【设为默认/取消默认】按钮点击事件
    $('.theme-default').on('click', function() {
        const thiz = $(this);
        const theme = Diversity.data.get(COOKIE_NAME);
        const curTheme = thiz.parent('p').attr('theme');
        // 没有设置默认主题 或者 已设置默认主题，但不是当前主题
        if (!theme || (theme && theme != curTheme)) {
            var expirationDate = new Date();
            // 设置默认主题为当前所在主题
            Diversity.data.set(COOKIE_NAME, curTheme);
            // 设置主题标志，1：设置过主题 0：没有设置过
            Diversity.data.setIfNotAbsent('theme_flag', 1);
            $.gritter.add({
                title: Diversity.data.convert(config.gritter.title_theme, curTheme),
                text: config.gritter.text_configured + ' <a class="gritter-link" href="' 
                    + config.menu.blog + '">' + config.gritter.text_clicktojump + '</a>',
                time: 4000,
                image: window.location.origin + '/images/diversity.png',
                class_name: 'gritter-success gritter-light'
            });
        } else if (theme && theme == curTheme) {
            // 已设置默认主题，并且就是当前主题，则认为是取消默认
            Diversity.data.remove(COOKIE_NAME);
            $.gritter.add({
                title: Diversity.data.convert(config.gritter.title_theme, theme),
                text: config.gritter.text_canceled,
                time: 4000,
                image: window.location.origin + '/images/diversity.png',
                class_name: 'gritter-warning gritter-light'
            });
        } 
        // 遍历所有的含主题的卡片div，设置【设为默认/取消默认】的展示文本
        initCardButtonText();
    });

    // 遍历所有的含主题的卡片div，设置【设为默认/取消默认】的展示文本
    initCardButtonText();

    function initCardButtonText() {
        $('.card').each(function() {
            const thiz = $(this);
            const button = thiz.find('button.theme-default');
            const theme = Diversity.data.get(COOKIE_NAME);
            const curTheme = button.parent('p').attr('theme');
            if (!theme || theme != curTheme) {
                // 按钮文本改为设为默认
                button.text(config.button.theme_default);
                button.removeClass('btn-default').addClass('btn-primary');
            } else {
                // 按钮文本改为取消默认
                button.text(config.button.cancel_defalut);
                button.removeClass('btn-primary').addClass('btn-default');
            }
        });
    }

    // 主题直达按钮点击事件
    $('.theme-redirect').on('click', function() {
        const theme = $(this).parent('p').attr('theme');
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
        url = url.replace(config.menu.theme, '');

        if (!url.endsWith("/")) url += "/";

        url += theme;

        // 跳转
        window.open(url, "_blank");
    });

    // 主题来源按钮点击事件
    $('.theme-source').on('click', function() {
        const theme = $(this).parent('p').attr('theme');
        const source = config.source[theme];
        if (source)
            window.open(source, "_blank");
    });

})(jQuery);