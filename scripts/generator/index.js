"use strict";
module.exports = (ctx, theme) => {
    const { generator } = ctx.extend;
    // 标记首要主题【即Diversity主题】
    ctx.config.primary_theme = theme;
    // Diversity主题生成器特殊处理
    if (ctx.config.theme === theme) {
        generator.register('asset', require('./asset'));
        generator.register('post', require('./empty'));
        generator.register('category', require('./empty'));
        generator.register('archive', require('./empty'));
        generator.register('atom', require('./empty'));
        generator.register('tag', require('./empty'));
        // 禁用分页，这是为了主题选择页面只生成一个
        ctx.config.index_generator.per_page = 0;
    }
    generator.register('page', require('./page'));
};