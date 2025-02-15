(function() {
    const className = 'diversity-config';
    const staticConfig = {};
    let otherConfig = {};

    const parse = text => JSON.parse(text || '{}');

    const update = name => {
        const targetEle = document.querySelector(`.${className}[data-name="${name}"]`);
        if (!targetEle) return;
        const parsedConfig = parse(targetEle.text);
        if (name === 'main') {
            Object.assign(staticConfig, parsedConfig);
        } else {
            otherConfig[name] = parsedConfig;
        }
    };

    // 提前获取Diversity主要配置信息
    update('main');

    window.config = new Proxy({}, {
        get(overrideConfig, name) {
            let existing;
            if (name in staticConfig) {
                existing = staticConfig[name];
            } else {
                if (!(name in otherConfig)) update(name);
                existing = otherConfig[name];
            }

            if (!(name in overrideConfig) && Array.isArray(existing)) {
                overrideConfig[name] = [];
            }

            if (!(name in overrideConfig) && typeof existing === 'object') {
                overrideConfig[name] = {};
            }

            if (name in overrideConfig) {
                const override = overrideConfig[name];

                // 根据值的类型（数组或对象）来创建对应的代理对象进行相关操作
                if (Array.isArray(override) && Array.isArray(existing)) {
                    return createArrayProxy(existing, override);
                }
                if (typeof override === 'object' && typeof existing === 'object') {
                    return createObjectProxy({...existing,...override }, override);
                }

                return override;
            }

            return existing;
        }
    });

    // 创建数组代理的函数，用于处理数组类型的配置数据获取和设置逻辑
    const createArrayProxy = (arrayTarget, override) => {
        return new Proxy(arrayTarget, {
            set(arrayInnerTarget, index, value, arrayReceiver) {
                // 同步修改原始数组和override数组
                arrayInnerTarget[index] = value;
                override[index] = value;
                return true;
            }
        });
    };

    // 创建对象代理的函数，用于处理对象类型的配置数据设置逻辑
    const createObjectProxy = (target, override) => {
        return new Proxy(target, {
            set(targetInner, prop, value) {
                // 同步修改原始数组和override数组
                targetInner[prop] = value;
                override[prop] = value;
                return true;
            }
        });
    };

    // onPageLoaded 函数用于在文档对象（document）上触发一个名为'page:loaded'的自定义事件,
    // 并且设置该事件会冒泡(bubbles属性为true)，即可以在DOM树中向上传播，让父元素也能捕获到这个事件。
    const onPageLoaded = () => document.dispatchEvent(
        new Event('page:loaded', {
            bubbles: true
        })
    );

    // 检查文档是否还处于正在加载的过程中
    if (document.readyState === 'loading') {
        // 如果文档处于正在加载状态，那么就给文档对象添加一个'readystatechange'事件监听器。
        // 当文档的状态发生改变时（比如加载完成等情况），就会触发这个监听器所关联的回调函数【即onPageLoaded函数】，
        // 同时设置{ once: true }这个选项，表示这个监听器只会被触发一次，触发之后就会自动移除，避免重复监听。
        document.addEventListener('readystatechange', onPageLoaded, {
            once: true
        });
    } else {
        // 文档已经加载完成了，直接调用onPageLoaded函数来手动触发'page:loaded'事件，
        // 以确保后续依赖这个事件的其他代码逻辑能够正常执行，模拟文档加载完成后的事件触发情况。
        onPageLoaded();
    }
})();

/**
 * Diversity 工具集
 *
 * @author huazie
 * @since 2.0.0
 *
 */
Diversity = {
    /**
     * Current object name
     *
     * @method toString
     * @return {String} 'Diversity'
     */
    toString() {
        return 'Diversity';
    },
    /**
     * console.log方法(兼容IE)
     *
     * @method log
     * @param {String} text
     */
    log(text) {
        window.console && console.log(text);
    }
};

/**
 * Diversity数据操作
 *
 * @namespace Huazie
 * @class data
 */
Diversity.data = {
    /**
     * Current object name
     *
     * @method toString
     * @return {String} 'Huazie.data'
     */
    toString() {
        return "Diversity.data";
    },
    /**  
     * 从localStorage或Cookies中获取指定名称的数据项。
     * 
     * 如果浏览器支持localStorage，则优先从localStorage中获取；
     * 否则，从Cookies中获取。
     * 
     * @param {string} name - 要获取的数据项的名称
     * @returns {string|null} - 返回获取到的数据项的值，如果未找到则返回null
     */
    get(name) {
        return localStorage ? localStorage.getItem(name) : Cookies.get(name);
    },
    /**  
     * 将一个数据项设置到localStorage或Cookies中。
     * 
     * 如果浏览器支持localStorage，则将其存储到localStorage；
     * 否则，使用Cookies存储，并设置默认有效期为30天。  
     * 
     * @param {string} name - 要设置的数据项的名称
     * @param {string} value - 要设置的数据项的值
     */
    set(name, value) {
        if (localStorage)
            localStorage.setItem(name, value);
        else {
            var date = new Date();
            // 默认有效期 30天 
            date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
            Cookies.set(name, value, { expires: date });
        }
    },
    /**  
     * 如果指定名称的数据项不存在，则才会设置。 
     * 这有助于避免覆盖已存在的数据项。
     *   
     * @param {string} name - 要设置的数据项的名称 
     * @param {string} value - 要设置的数据项的值 
     */
    setIfNotAbsent(name, value) {
        if (!this.get(name))
            this.set(name, value);
    },
    /**  
     * 从localStorage或Cookies中移除指定名称的数据项。
     * 
     * 如果浏览器支持localStorage，则从localStorage中移除；
     * 否则，从Cookies中移除。
     * 
     * @param {string} name - 要移除的数据项的名称
     */
    remove(name) {
        if (localStorage)
            localStorage.removeItem(name)
        else
            Cookies.remove(name);
    },
    /**  
     * 转换带有占位符的字符串。 替换前的字符串包含如{0}、{1}等占位符，
     * 这些占位符将被相应的 placeholders 数组中的值替换。  
     *  
     * @param {string} before - 替换前的原始字符串，包含占位符
     * @param {...} placeholders - 一个可变数量的参数，用于替换字符串中的占位符
     * @returns {string} - 替换占位符后的新字符串
     */
    convert(before, ...placeholders) {
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
    },
    /**  
     * 获取当前主题名关联的本地端口port  
     *  
     * @param {string} theme - 主题名
     * @returns {string} - 替换占位符后的新字符串
     */
    getThemeServerPort(theme) {
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
}

/**
 * 浏览器，URL等相关操作
 *
 * @namespace Huazie
 * @class browser
 */
Diversity.browser = {

    /**
     * Current object name
     *
     * @method toString
     * @return {String} 'Diversity.browser'
     */
    toString() {
        return "Diversity.browser";
    },
    /**
     * 获取URL地址栏参数值
     *
     * @method getParameter
     * @param {String} name 参数名
     * @param {String} url [optional,default=当前URL]URL地址
     * @return {String} 参数值
     */
    getParameter(name, url) {
        var reqUrl = url || window.location.href;
        if (reqUrl.length === 0) {
            return null;
        }
        if (reqUrl.indexOf("?") === -1) {
            return null;
        }
        reqUrl = decodeURIComponent(reqUrl).substring(reqUrl.indexOf("?") + 1);
        if (reqUrl.length === 0) {
            return null;
        }
        var params = reqUrl.split('&');
        for (var i = 0; i < params.length; i++) {
            var parts = params[i].split('=', 2);
            if (parts[0] === name) {
                if (parts.length < 2 || typeof(parts[1]) === "undefined" || parts[1] === "null")
                    return '';
                return decodeURIComponent(parts[1]);
            }
        }
        return null;
    }
};

/**
 * Diversity 公共能力
 *
 * @namespace Huazie
 * @class utils
 */
Diversity.utils = {

    // 用于存储每个元素对应的 IntersectionObserver 实例
    _elementObserverMap: new Map(),
    /**
     * Current object name
     *
     * @method toString
     * @return {String} 'Diversity.utils'
     */
    toString() {
        return "Diversity.utils";
    },
    /**
     * 加载评论模块，支持旧版回调和新版Promise风格
     * 
     * 该方法基于Intersection Observer API实现延迟加载评论的功能，
     * 当评论所在的元素进入视口时，才会加载评论。
     * 
     * @param {string} selector - 用于选择包含评论的元素的选择器
     * @param {Function} [legacyCallback] - （可选）旧版回调函数，当评论加载完成后会被调用
     * @returns {Promise} - 返回一个Promise对象，该对象在评论加载完成后被解析
     */
    isDarkMode() {
        let isDarkMode = false;
        if (config.darkmode === 1)
            isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        else if (config.darkmode === 2)
            isDarkMode = document.documentElement.classList.contains('dark-theme');
        return isDarkMode;
    },
    /**
     * 加载评论模块，支持旧版回调和新版Promise风格
     * 
     * 该方法基于Intersection Observer API实现延迟加载评论的功能，
     * 当评论所在的元素进入视口时，才会加载评论。
     * 
     * @param {string} selector - 用于选择包含评论的元素的选择器
     * @param {Function} [legacyCallback] - （可选）旧版回调函数，当评论加载完成后会被调用
     * @returns {Promise} - 返回一个Promise对象，该对象在评论加载完成后被解析
     * @see [next-theme/hexo-theme-next] - 来自 NexT 中的相关设计
     */
    loadComments(selector, legacyCallback) {
        if (legacyCallback) {
            // 如果提供了旧版回调函数，则使用.then()方法将其转换为Promise风格的处理
            return this.loadComments(selector).then(legacyCallback);
        }
        // 返回一个新的Promise对象，用于处理异步加载评论的逻辑
        return new Promise(resolve => {
            const element = document.querySelector(selector);
            // 清空元素里的内容
            if (element && element.innerHTML.trim() !== '') {
                element.innerHTML = '';
            }
            if (!config.comments.lazyload || !element) {
                resolve();
                return;
            }

            // 检查该元素是否已经有对应的 IntersectionObserver 实例
            if (this._elementObserverMap.has(element)) {
                // 若有，则断开之前的 IntersectionObserver 实例
                const previousObserver = this._elementObserverMap.get(element);
                previousObserver.disconnect();
            }

            const intersectionObserver = new IntersectionObserver((entries, observer) => {
                const entry = entries[0];
                if (!entry.isIntersecting) return;
                resolve();
                observer.disconnect();
                // 评论加载完成后，从映射中移除该元素对应的记录
                this._elementObserverMap.delete(element);
            });
            intersectionObserver.observe(element);
            // 将新的 IntersectionObserver 实例与元素关联起来
            this._elementObserverMap.set(element, intersectionObserver);
        });
    },
    /**
     * 用于动态加载JavaScript脚本文件，支持根据不同条件和配置来加载脚本，并返回一个Promise对象以便处理加载结果。
     *
     * @param {string | object} src - 要加载的脚本文件的源地址。可以是一个字符串，表示脚本的URL地址；
     *                               也可以是一个包含 `url` 和 `integrity` 属性的对象，其中 `url` 为脚本的URL，
     *                               `integrity` 用于设置脚本的完整性校验信息（如Subresource Integrity，SRI相关内容）。
     * @param {object} [options = {}] - 一个可选的配置对象，用于设置脚本加载的相关条件、属性以及指定父节点等信息。
     *                                  若不传该参数，则使用默认的空对象。
     * @param {function | boolean} [legacyCondition] - 旧版本遗留的条件参数，用于兼容之前的调用方式。
     *                                                 如果 `options` 参数传入的是一个函数，那么这个参数会作为条件使用；
     *                                                 若 `options` 传入的是对象，此参数通常可忽略（但在某些特定的兼容场景下可能有用）。
     * @returns {Promise} - 返回一个Promise对象，当脚本成功加载时会 resolve，加载出现错误时会 reject，
     *                      通过这个Promise可以处理脚本加载的后续逻辑，比如在成功加载后执行一些依赖该脚本的初始化操作等。
     * @see [next-theme/hexo-theme-next] - 来自 NexT 中的相关设计
     */
    getScript(src, options = {}, legacyCondition) {
        // 如果是函数类型，说明是旧的调用方式
        if (typeof options === 'function') {
            return this.getScript(src, {
                condition: legacyCondition
            }).then(options);
        }
        // 从options对象中提取相应的属性，并设置默认值（如果不存在的话）
        const {
            condition = false,
            attributes: {
                id = '',
                async = false,
                defer = false,
                crossOrigin = '',
                dataset = {},
                // 使用剩余参数语法收集其他未明确列出的属性到otherAttributes对象中，方便后续处理
                ...otherAttributes
            } = {},
            parentNode = null
        } = options;
        // 返回一个Promise对象，用于处理脚本加载的异步过程，Promise内部通过不同的逻辑来决定脚本的创建、添加以及加载结果的处理。
        return new Promise((resolve, reject) => {
            if (condition) {
                resolve();
            } else {
                // 创建一个script元素节点，代表要加载的JavaScript脚本元素，后续会将其添加到页面文档中进行加载
                const script = document.createElement('script');

                // 用于在页面中唯一标识该脚本元素（例如方便后续通过id查找等操作）
                if (id) script.id = id;
                // 设置脚本的跨域相关属性（比如设置跨域请求的模式等）
                if (crossOrigin) script.crossOrigin = crossOrigin;
                // 用于控制脚本是否异步加载（async为true时异步加载）
                script.async = async;
                // 用于控制脚本是否延迟加载（defer为true时延迟加载）
                script.defer = defer;
                // 用于设置脚本元素的自定义数据属性
                Object.assign(script.dataset, dataset);
                // 用于设置其他额外的、未在前面单独列出的属性（例如可能是一些自定义的HTML属性等）
                Object.entries(otherAttributes).forEach(([name, value]) => {
                    script.setAttribute(name, String(value));
                });
                // 为script元素的onload事件绑定resolve函数，当脚本成功加载完成时，
                // 会触发onload事件，进而将Promise状态置为已解决（resolved）
                script.onload = resolve;
                // 为script元素的onerror事件绑定reject函数，当脚本加载出现错误（例如404找不到脚本文件等情况）时，会触发onerror事件，
                // 进而将Promise状态置为已拒绝（rejected），可以在外部通过catch方法捕获并处理加载错误。
                script.onerror = reject;
                // 如果是对象类型，说明包含了更详细的脚本源信息（如带有完整性校验信息）
                if (typeof src === 'object') {
                    const { url, integrity } = src;
                    script.src = url;
                    // 如果存在完整性校验信息（integrity属性有值），则将其赋值给script元素的integrity属性，并设置crossOrigin为'anonymous'，
                    // 这是按照SRI（Subresource Integrity）相关规范要求进行的操作，用于确保脚本内容的完整性和安全性。
                    if (integrity) {
                        script.integrity = integrity;
                        script.crossOrigin = 'anonymous';
                    }
                } else {
                    // / 如果src是字符串类型，直接将其赋值给script元素的src属性，作为脚本的URL地址，用于加载脚本
                    script.src = src;
                }
                // 根据parentNode的值，将创建好且配置好属性的script元素添加到指定的父节点下。
                // 如果parentNode为null，则默认添加到文档的<head>标签内（这是常见的脚本添加位置之一），从而开始脚本的加载过程。
                (parentNode || document.head).appendChild(script);
            }
        });
    }
};