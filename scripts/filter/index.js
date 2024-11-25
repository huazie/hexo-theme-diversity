"use strict";

module.exports = (ctx, theme) => {
    const { filter } = ctx.extend;
    // Diversity主题过滤器特殊处理
    if (ctx.config.theme === theme) {
    	// 添加模板的局部变量的过滤器，用于修改模板的局部变量
        filter.register('template_locals', require('./locals'));
    }
};