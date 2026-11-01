"use strict";

module.exports = (ctx, theme) => {
    const { filter } = ctx.extend;
    // mermaid 图表支持：所有 Hexo 实例无条件注册（幂等）——
    // 文章页由多主题子实例渲染（主实例 post 生成器为 empty），README 开源详情页由主实例渲染，
    // 两条渲染路径都需要先于 backtick_code_block（priority 10）抽走围栏、渲染后还原；
    // 占位抽走后二次 encode 匹配不到围栏为 no-op，主/子实例重复注册无副作用
    const mermaid = require('./mermaid');
    filter.register('before_post_render', mermaid.encodeFences, 5);
    filter.register('after_post_render', mermaid.restoreFences);
    // Diversity主题过滤器特殊处理
    if (ctx.config.theme === theme) {
    	// 添加模板的局部变量的过滤器，用于修改模板的局部变量
        filter.register('template_locals', require('./locals'));
    } else {
        // 子主题页面自引用 canonical 注入（主实例页面由 head.ejs 直接输出，无需注入）
        filter.register('_after_html_render', require('./canonical')(ctx));
    }
};