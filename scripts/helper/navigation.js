"use strict";

/**
 * 生成一个包含指定类名的菜单列表数据
 *
 * @param {string} className - 要应用于菜单项和链接的类名【关键部分】
 * @returns {string} - 包含菜单项的HTML字符串
 */
function headerMenu(className) {
    const menu = this.site.data.diversity_menu;
    if (!menu) return '';

    // 获取当前语言，优先从页面配置获取，其次从站点配置获取
    const lang = this.page.lang || this.page.language || this.config.language || 'zh-CN';
    // 菜单名称合并（优先级：新格式语言数据文件 > 旧格式数据文件 > 主题 i18n > 菜单 key）：
    //   1. 新格式：source/_data/languages/{lang}.yml 的 menu 段 → site.data.languages[lang].menu
    //      （个别版本/配置可能扁平化为 site.data['languages/{lang}']，两种都兼容）
    //   2. 旧格式：source/_data/diversity_menu.{lang}.yml → site.data['diversity_menu.{lang}']
    const langMenu = ((this.site.data.languages && this.site.data.languages[lang]) || this.site.data['languages/' + lang] || {}).menu || {};
    const legacyMenu = this.site.data['diversity_menu.' + lang] || {};
    const menuNames = Object.assign({}, legacyMenu, langMenu);

    let result = '';
    const self = this;

    for (const [title, path] of Object.entries(menu)) {
        // 菜单名称优先级：数据文件 > 语言文件(languages) > 菜单 key
        const name = menuNames[title] || self.__('menu.' + title) || title;
        result += `<li class="${className}-li"><a href="${path}" class="${className}-link">${name}</a></li>`;
    }

    return result;
}

module.exports = headerMenu;