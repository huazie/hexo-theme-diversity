"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const hexo_util_1 = require("hexo-util");
const moize_1 = __importDefault(require("moize"));
let relative_link = true;
function jsHelper(...args) {
    let result = '\n';
    relative_link = this.config.relative_link;
    args.flat(Infinity).forEach(item => {
        if (typeof item === 'string' || item instanceof String) {
            let path = item;
            if (!path.endsWith('.js')) {
                path += '.js';
            }
            result += `<script src="${hexo_util_1.url_for.call(this, path)}"></script>\n`;
            console.log('#####new ' + this.config.theme + ' ' + hexo_util_1.url_for.call(this, path));
        }
        else {
            // Custom attributes
            item.src = hexo_util_1.url_for.call(this, item.src);
            if (!item.src.endsWith('.js'))
                item.src += '.js';
            result += (0, hexo_util_1.htmlTag)('script', Object.assign({}, item), '') + '\n';
        }
    });
    return result;
}
module.exports = jsHelper;