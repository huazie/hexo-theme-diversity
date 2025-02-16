(function () {
    // phone端菜单栏展示
    const body = document.getElementsByTagName("body")[0];
    const navToggle = document.getElementById("mobile-nav-toggle");
    const dimmer = document.getElementById("mobile-nav-dimmer");
    const CLASS_NAME = "mobile-nav-on";
    if (!navToggle) return;

    navToggle.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        body.classList.toggle(CLASS_NAME);
    });

    dimmer.addEventListener("click", function (e) {
        if (!body.classList.contains(CLASS_NAME)) return;
        e.preventDefault();
        body.classList.remove(CLASS_NAME);
    });

    /**
     * 导航栏选项激活显示
     *
     * @param {HTMLElement} thiz - 当前遍历到的 li 元素
     */
    const navActive = (thiz) => {
        const a = thiz.querySelector("a");
        if (!a) return; // 如果没有找到 a 元素，则直接返回
        let href = a.getAttribute("href");
        // 如果菜单url没有配置“/” 结尾，则添加。
        if (!href.endsWith("/")) href += "/";
        if (
            window.location.href.includes(href) ||
            (window.location.pathname === "/" &&
                (href === "/" || href === config.index))
        ) {
            // 添加激活显示的样式
            thiz.classList.add("active");
            // 添加事件监听器阻止默认行为
            a.addEventListener("click", function (event) {
                event.preventDefault();
            });
        }
    }

    document.querySelectorAll("li.main-nav-li").forEach(navActive);
    document.querySelectorAll("li.mobile-nav-li").forEach(navActive);

    if (config.darkmode && config.darkmode === 2) {
        const colorSchemeToggle = document.getElementById("color-scheme-toggle");

        const initColorScheme = () => {
            const savedColorScheme = Diversity.data.get("color_scheme");
            if (savedColorScheme === "dark") {
                document.documentElement.classList.add("dark-theme");
            }
        }

        const toggleColorScheme = () => {
            document.documentElement.classList.toggle("dark-theme");
            const isDark = document.documentElement.classList.contains("dark-theme");
            Diversity.data.set("color_scheme", isDark ? "dark" : "light");
            document.dispatchEvent(
                new Event("color-scheme:refresh", {
                    bubbles: true,
                })
            );
        }

        // 读取并初始化配色方案
        initColorScheme();

        colorSchemeToggle && colorSchemeToggle.addEventListener("click", toggleColorScheme);
    }
})();