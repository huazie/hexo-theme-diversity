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

    // 采用10个的旋转图片样式布局
    const ROTATE_NUM = 10;
    let middle = ROTATE_NUM / 2;
    const rotateNumClass = "rotate-" + ROTATE_NUM + "-";
    // 一开始将中间的图片设置为激活
    $("." + rotateNumClass + middle).addClass('active');
            
    function dragStart(e) { 
        if (e.touches) e.clientX = e.touches[0].clientX;
        xPos = Math.round(e.clientX);
        gsap.set('.ring', {cursor:'grabbing'})
        $(window).on('mousemove', drag);
    }

    function dragEnd(e) {
        $(window).off('mousemove', drag);
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

    // 旋转角度
    const angle = getRotateAngle();

    /**
     * 鼠标滚动事件监听回调
     */
    function wheel(e) {
        // 获取滚动的方向，deltaY > 0 表示向下滚动，deltaY < 0 表示向上滚动
        // 根据不同浏览器标准化deltaY 
        var deltaY = e.originalEvent.deltaY || e.originalEvent.detail * -40;  
      
        // 根据滚动的方向设置旋转角度 
        var rotationAmount = deltaY > 0 ? -1 * angle : angle;
      
        gsap.to('.ring', {
            rotationY: '+=' + rotationAmount,  
            onUpdate: updateBackgroundPosition
        });
    }

    let isRotating = false; // 旋转状态（true：正在旋转中 false：旋转结束）

    function arrowClick(event) {
        if (isRotating) return; // 如果正在旋转，直接返回，不执行后续操作

        const arrow = event.target;
        // 根据点击的左右箭头，向左或向右旋转主题卡片
        rotateThemeCard(arrow.classList.contains('left-arrow'));
    }

    let startX;
    let diffX;
    let isSliding = false; // 滑动状态（true：正在滑动 false：停止滑动 ）

    $(window).on('touchstart', function(e) {
        diffX = 0;
        startX = e.touches[0].clientX;
        isSliding = true;
    });

    $(window).on('touchmove', function(e) {
        if (!isSliding) return;
        let moveX = e.touches[0].clientX;
        diffX = moveX - startX;
    });

    $(window).on('touchend', function() {
        if (!isSliding) return;
        if (isRotating) return; // 如果正在旋转，直接返回，不执行后续操作

        if (Math.abs(diffX) > 50) { // 设定一个阈值，防止轻微移动也触发
            rotateThemeCard(diffX > 0);
        }
        diffX = 0;
        isSliding = false; // 确保touchend时重置状态
    });

    /**
     * 返回每次旋转的角度
     */
    function getRotateAngle() {
        const themeNum = config.themes.length;
        let angle = 0;
        if (themeNum <= ROTATE_NUM) {
            angle = 360 / ROTATE_NUM;
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

    /**
     * 向左或向右旋转主题卡片
     */
    function rotateThemeCard(leftFlag) {
        // 设置旋转角度
        const rotationAmount = leftFlag ? -1 * angle : angle;

        isRotating = true; // 设置旋转状态为true

        gsap.to('.ring', {
            rotationY: '+=' + rotationAmount,
            onUpdate: updateBackgroundPosition,
            onComplete: function() {
                // 激活下一个包含img的div展示，实现切换后自动翻转
                activeNext(leftFlag);
                // 旋转完成后，将状态设置为false
                isRotating = false;
            }
        });
    }

    /**
     * 激活下一个包含img的div展示，实现切换后自动翻转
     */  
    function activeNext(leftFlag) {
        const classList = document.querySelector('.img.active').classList;
        let rotateNumId; // 例如：rotate-10-5, 则 rotateNumId = 5
        for (var i = 0; i < classList.length; i++) {  
            if (classList[i].includes(rotateNumClass)) {
                rotateNumId = parseInt(classList[i].replace(rotateNumClass, '').trim());
                break;
            }
        }
        let nextRotateNumId = rotateNumId;
        if (leftFlag)
            nextRotateNumId--;
        else 
            nextRotateNumId++;

        if (nextRotateNumId < 0)
            nextRotateNumId = ROTATE_NUM - 1;
        else if (nextRotateNumId >= ROTATE_NUM)
            nextRotateNumId = 0;

        // 去除当前已激活的div
        document.querySelector("." + rotateNumClass + rotateNumId).classList.remove('active');
        // 添加要切换激活的div
        document.querySelector("." + rotateNumClass + nextRotateNumId).classList.add('active');
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