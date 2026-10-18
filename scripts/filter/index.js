"use strict";

module.exports = (ctx, theme) => {
    const { filter } = ctx.extend;
    // Diversity主题过滤器特殊处理
    if (ctx.config.theme === theme) {
    	// 添加模板的局部变量的过滤器，用于修改模板的局部变量
        filter.register('template_locals', require('./locals'));
        // mermaid 图表支持：先于 backtick_code_block（priority 10）抽走围栏，渲染后还原
        const mermaid = require('./mermaid');
        filter.register('before_post_render', mermaid.encodeFences, 5);
        filter.register('after_post_render', mermaid.restoreFences);
    }
};