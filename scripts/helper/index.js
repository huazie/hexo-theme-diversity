"use strict";
module.exports = (ctx, theme) => {
    const { helper } = ctx.extend;
    // Diversity主题生成器特殊处理
    if (ctx.config.theme === theme) {
        // 导航菜单栏的辅助函数
        helper.register('header_menu', require('./navigation'));
    } else {
        // 其他主题
        // 覆盖原css辅助函数[不同主题引入的css路径和名称可能一样，这里需要按主题名称加js路径和名称记忆]
        helper.register('css', require('./css'));
        // 覆盖原js辅助函数[不同主题引入的js路径和名称可能一样，这里需要按主题名称加js路径和名称记忆]
        helper.register('js', require('./js'));
    }
};