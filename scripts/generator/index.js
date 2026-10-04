"use strict";
module.exports = (ctx, theme) => {
    const { generator } = ctx.extend;
    // 标记首要主题【即Diversity主题】
    ctx.config.primary_theme = theme;
    // Diversity主题生成器特殊处理
    if (ctx.config.theme === theme) {
        generator.register('post', require('./empty'));
        generator.register('category', require('./empty'));
        generator.register('archive', require('./empty'));
        generator.register('atom', require('./empty'));
        generator.register('tag', require('./empty'));
        // 禁用分页，这是为了主题选择页面只生成一个
        ctx.config.index_generator.per_page = 0;
    } else {
        // 其他主题替换 category 和 tag 生成器，支持生成分类首页和标签首页
        generator.register('category', require('./category'));
        generator.register('tag', require('./tag'));
    }
    generator.register('page', require('./page'));
    generator.register('asset', require('./asset'));
    // 开源项目详情页（⑦）：为 source/_data/open/*.yml 各项目生成详情页；站点无 open 列表页时自动跳过
    generator.register('open', require('./open'));
};