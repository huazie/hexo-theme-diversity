/**
 * Diversity 工具集
 *
 * @author huazie
 * @since 2.0.0
 *
 */
var Diversity = {
    /**
     * @type {String}
     * @property version
     */
    VERSION: '2.0.0',
    /**
     *
     * @method toString
     * @return {String} 'Diversity'
     */
    toString: function () {
        return 'Diversity';
    },
    /**
     * console.log方法(兼容IE)
     *
     * @method log
     * @param {String} text
     */
    log: function (text) {
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
     * @return {String} 'Huazie.validate'
     */
    toString: function() {
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
    get: function(name) {
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
    set: function(name, value) {
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
    setIfNotAbsent: function(name, value) {
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
    remove: function(name) {
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
    convert: function(before, ...placeholders) {
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
    getThemeServerPort: function(theme) {
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
    toString: function () {
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
    getParameter: function (name, url) {
        var reqUrl = url || window.location.href;
        if (reqUrl.length === 0) {
            return null;
        }
        if (reqUrl.indexOf("?") === -1) {
            return null;
        }
        reqUrl = unescape(reqUrl).substring(reqUrl.indexOf("?") + 1);
        if (reqUrl.length === 0) {
            return null;
        }
        var params = reqUrl.split('&');
        for (var i = 0; i < params.length; i++) {
            var parts = params[i].split('=', 2);
            if (parts[0] === name) {
                if (parts.length < 2 || typeof (parts[1]) === "undefined" || parts[1] === "null")
                    return '';
                return parts[1];
            }
        }
        return null;
    }
};