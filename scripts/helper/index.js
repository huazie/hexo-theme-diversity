"use strict";
module.exports = (ctx) => {
    const { helper } = ctx.extend;
    // 多主题模式，覆盖原css辅助函数[不同主题引入的css路径和名称可能一样，这里需要按主题名称加js路径和名称记忆]
    helper.register('css', require('./css'));
    // 多主题模式，覆盖原js辅助函数[不同主题引入的js路径和名称可能一样，这里需要按主题名称加js路径和名称记忆]
    helper.register('js', require('./js'));
};