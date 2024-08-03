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
 * 数据的增删改查相关操作
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