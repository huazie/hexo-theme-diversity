"use strict";

/**  
 * 生成一个包含指定类名的菜单列表数据
 *
 * @param {string} className - 要应用于菜单项和链接的类名【关键部分】
 * @returns {string} - 包含菜单项的HTML字符串
 */
function headerMenu(className) {
    const menu = this.site.data.diversity_menu;
    let result = '';
    const self = this;

    for (const [title, path] of Object.entries(menu)) {
        result += `<li class="${className}-li"><a href="${path}" class="${className}-link">${self.__('menu.' + title)}</a></li>`;
    }

    return result;
}

module.exports = headerMenu;