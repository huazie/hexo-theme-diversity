(function($){

    let xPos = 0;
    gsap.timeline()
        .set('.ring', { rotationY:180, cursor:'grab' })
        .from('.img', {
            duration:1.5,
            y:200,
            opacity:0,
            stagger:0.1,
            ease:'expo'
        })
        .add(()=>{
            $('.img').on('mouseenter', (e)=>{
                let current = e.currentTarget;
                gsap.to('.img', {opacity:(i,t)=>(t==current)? 1:0.5, ease:'power3'})
            })
            $('.img').on('mouseleave', (e)=>{
                gsap.to('.img', {opacity:1, ease:'power2.inOut'})
            })
        }, '-=0.5')

    // 当用户按下鼠标按钮
    $(window).on('mousedown', dragStart);
    // 当用户释放鼠标按钮
    $(window).on('mouseup', dragEnd);
    // 当用户滚动鼠标滚轮时触发
    $(window).on('wheel', wheel);
    // 当用户点击左右箭头时触发
    $(".left-arrow, .right-arrow").on('click', arrowClick);
            
    function dragStart(e) { 
        if (e.touches) e.clientX = e.touches[0].clientX;
        xPos = Math.round(e.clientX);
        gsap.set('.ring', {cursor:'grabbing'})
        $(window).on('mousemove touchmove', drag);
    }

    function dragEnd(e) {
        $(window).off('mousemove touchmove', drag);
        gsap.set('.ring', {cursor:'grab'});
    }

    function drag(e) {
        if (e.touches) e.clientX = e.touches[0].clientX;        

        gsap.to('.ring', {
            rotationY: '-=' + ((Math.round(e.clientX) - xPos) % 360),
            onUpdate: updateBackgroundPosition
        });

        xPos = Math.round(e.clientX);
    }

    /**
     * 鼠标滚动事件监听回调
     */
    function wheel(e) {
        // 获取滚动的方向，deltaY > 0 表示向下滚动，deltaY < 0 表示向上滚动
        // 根据不同浏览器标准化deltaY 
        var deltaY = e.originalEvent.deltaY || e.originalEvent.detail * -40;  
      
        const angle = getRotateAngle();

        // 根据滚动的方向设置旋转角度 
        var rotationAmount = deltaY > 0 ? -1 * angle : angle;
      
        gsap.to('.ring', {  
            rotationY: '+=' + rotationAmount,  
            onUpdate: updateBackgroundPosition
        });
    }

    function arrowClick(event) {
        const arrow = event.target;

        const angle = getRotateAngle();

        // 根据点击的左右箭头设置旋转角度
        const rotationAmount = arrow.classList.contains('left-arrow') ? -1 * angle : angle;

        gsap.to('.ring', { 
            rotationY: '+=' + rotationAmount,  
            onUpdate: updateBackgroundPosition
        });
    }

    /**
     * 返回每次旋转的角度
     */
    function getRotateAngle() {
        const themeNum = config.themes.length;
        // 采用10个的旋转图片样式布局
        const ROTATE_NUM_10 = 10;
        let angle = 0;
        if (themeNum <= ROTATE_NUM_10) {
            angle = 360 / ROTATE_NUM_10;
        }
        return angle;
    }

    /**
     * 设置类名为img的标签的CSS属性backgroundPosition的值
     */
    function updateBackgroundPosition() {
        gsap.set('.img', {  
            backgroundPosition: function(i) {  
                return getBackgroundPosition(i);  
            }
        });
    }

    /**
     * 返回background-position属性，以在每个图像中创建视差滚动效果
     */
    function getBackgroundPosition(i) { 
        return ( 100-gsap.utils.wrap(0,360,gsap.getProperty('.ring', 'rotationY')-180-i*36)/360*500 )+'px 0px';
    }

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
                title: convert(config.gritter.title_theme, curTheme),
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
                title: convert(config.gritter.title_theme, theme),
                text: config.gritter.text_canceled,
                time: 4000,
                image: window.location.origin + '/images/diversity.png',
                class_name: 'gritter-warning gritter-light'
            });
        } 
        // 遍历所有的含主题的卡片div，设置【设为默认/取消默认】的展示文本
        initCardButtonText();
    });

    /**  
     * 转换带有占位符的字符串。 替换前的字符串包含如{0}、{1}等占位符，
     * 这些占位符将被相应的 placeholders 数组中的值替换。  
     *  
     * @param {string} before - 替换前的原始字符串，包含占位符
     * @param {...} placeholders - 一个可变数量的参数，用于替换字符串中的占位符
     * @returns {string} - 替换占位符后的新字符串
     */
    function convert(before, ...placeholders) {
        // 使用正则表达式匹配所有形如{0}、{1}等的占位符；
        // 'g'标志表示全局匹配，即匹配字符串中所有符合条件的占位符；
        // \\{ 和 \\} 用于匹配字面量的花括号，因为花括号在正则表达式中有特殊含义；
        // ([0-${placeholders.length - 1}]) 是一个捕获组，用于捕获占位符中的数字（即索引）。
        // 使用正则表达式匹配所有占位符，并通过函数动态替换它们  
        return before.replace(new RegExp(`\\{([0-${placeholders.length - 1}])\\}`, 'g'), (match, index) => {
            // 在这里，match参数是匹配的整个占位符（如"{0}"），但因为我们使用了捕获组，  
            // 所以index参数实际上是我们捕获的数字字符串（如"0"）；
            // 我们将这个数字字符串转换为整数，以便用作 placeholders 数组的索引；  
            // 然后返回 placeholders 数组中对应索引的元素作为替换值；
            // 将index（字符串）转换为整数，然后作为索引访问placeholders数组。
            return placeholders[parseInt(index, 10)];  
        });  
    }

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
            url = href.replace(port, getThemeServerPort(theme));
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

    // 主题来源按钮点击事件
    $('.theme-source').on('click', function() {
        const theme = $(this).parent('p').attr('theme');
        const source = config.source[theme];
        if (source)
            window.open(source, "_blank");
    });

})(jQuery);