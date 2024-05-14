"use strict";
module.exports = (ctx) => {
    const { helper } = ctx.extend;
    helper.register('css', require('./css'));
    helper.register('js', require('./js'));
};