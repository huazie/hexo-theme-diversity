"use strict";
module.exports = (ctx) => {
    const { generator } = ctx.extend;
    generator.register('asset', require('./asset'));
    generator.register('page', require('./empty'));
    generator.register('post', require('./empty'));
    generator.register('category', require('./empty'));
    generator.register('archive', require('./empty'));
    generator.register('atom', require('./empty'));
    generator.register('tag', require('./empty'));
    // 禁用分页，这是为了主题选择页面只生成一个
    ctx.config.index_generator.per_page = 0;
};