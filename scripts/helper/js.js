"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const hexo_util_1 = require("hexo-util");
const moize_1 = __importDefault(require("moize"));
let relative_link = true;
let hexo1;

/**
 * 内部js辅助函数实现
 * @param theme 主题名称【这里主要用于区分记忆】
 * @param args  参数列表
 */
function innerJsHelper(theme, ...args) {
    let result = '\n';
    args.flat(Infinity).forEach(item => {
        if (typeof item === 'string' || item instanceof String) {
            let path = item;
            if (!path.endsWith('.js')) {
                path += '.js';
            }
            result += `<script src="${hexo_util_1.url_for.call(hexo1, path)}"></script>\n`;
            console.log('#####[' + theme + '] ' path + ' ' + hexo_util_1.url_for.call(hexo1, path));
        }
        else {
            // Custom attributes
            item.src = hexo_util_1.url_for.call(hexo1, item.src);
            if (!item.src.endsWith('.js'))
                item.src += '.js';
            result += (0, hexo_util_1.htmlTag)('script', Object.assign({}, item), '') + '\n';
        }
    });
    return result;
}

// 创建一个记忆化版本的 innerJsHelper  
const memoizedInnerJsHelper = (0, moize_1.default)(innerJsHelper, {  
    maxSize: 10,  
    isDeepEqual: true,
    updateCacheForKey() {
        return relative_link;
    }  
}); 

function jsHelper(...args) {
    relative_link = this.config.relative_link;
    hexo1 = this;
    return memoizedInnerJsHelper(this.config.theme, args);
}
module.exports = jsHelper;