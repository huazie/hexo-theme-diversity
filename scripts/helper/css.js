"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const hexo_util_1 = require("hexo-util");
const hexo_log_1 = __importDefault(require("hexo-log"));
const moize_1 = __importDefault(require("moize"));
let relative_link = true;
let hexo1;
let LOG;

/**
 * 内部css辅助函数实现
 * @param theme 主题名称【这里主要用于区分记忆】
 * @param args  参数列表
 */
function innerCssHelper(theme, ...args) {
    let result = '\n';
    args.flat(Infinity).forEach(item => {
        if (typeof item === 'string' || item instanceof String) {
            let path = item;
            if (!path.endsWith('.css')) {
                path += '.css';
            }
            result += `<link rel="stylesheet" href="${hexo_util_1.url_for.call(hexo1, path)}">\n`;
            LOG.info('[' + theme + '] ' + path + ' ' + hexo_util_1.url_for.call(hexo1, path));
        }
        else {
            // Custom attributes
            let href = item.href;
            if (!href.endsWith('.css'))
                href += '.css';
            item.href = hexo_util_1.url_for.call(hexo1, href);
            result += (0, hexo_util_1.htmlTag)('link', Object.assign({ rel: 'stylesheet' }, item)) + '\n';
            LOG.info('[' + theme + '] ' + href + ' ' + item.href);
        }
    });
    return result;
}

// 创建一个记忆化版本的 innerCssHelper  
const memoizedInnerCssHelper = (0, moize_1.default)(innerCssHelper, {  
    maxSize: 10,  
    isDeepEqual: true,
    updateCacheForKey() {
        return relative_link;
    }  
}); 

function cssHelper(...args) {
    relative_link = this.config.relative_link;
    hexo1 = this;
    LOG = (0, hexo_log_1.default)(this.env);
    return memoizedInnerCssHelper(this.config.theme, args);
}
module.exports = cssHelper;

