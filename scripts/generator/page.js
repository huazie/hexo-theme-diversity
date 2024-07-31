"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const bluebird_1 = __importDefault(require("bluebird"));

function pageGenerator(locals) {
    const theme = this.config.theme;
    // 首要主题【即Diversity主题】
    const primary_theme = this.config.primary_theme;
    
    return bluebird_1.default.filter(locals.pages.toArray(), (page) => {
        const { path } = page;
        if (theme === primary_theme)
            // Diversity主题
            // 只保留diversity目录下的页面
            return path.startsWith(primary_theme);
        else
            // 其他主题
            // 过滤掉diversity目录下的页面
            return !path.startsWith(primary_theme);
    }).map((page) => {
        const { path, layout } = page;
        if (!layout || layout === 'false' || layout === 'off') {
            return {
                path,
                data: page.content
            };
        }
        const layouts = ['page', 'post', 'index'];
        if (layout !== 'page')
            layouts.unshift(layout);
        page.__page = true;
        return {
            path,
            layout: layouts,
            data: page
        };
    });
}
module.exports = pageGenerator;