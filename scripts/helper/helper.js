"use strict";
module.exports = (ctx) => {
    const { helper } = ctx.extend;

    // 导航菜单栏的辅助函数
    helper.register('header_menu', function(className) {
        const menu = this.site.data.diversity_menu;
        let result = '';
        const self = this;

        for (const [title, path] of Object.entries(menu)) {
            result += `<li class="${className}-li"><a href="${path}" class="${className}-link">${self.__('menu.' + title)}</a></li>`;
        }

        return result;
    });
};