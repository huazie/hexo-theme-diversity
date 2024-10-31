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

})(jQuery);