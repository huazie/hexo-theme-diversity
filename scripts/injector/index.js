'use strict';

/**
 * Diversity injector 入口。
 * 注册各Hexo主题所需的各类注入脚本。
 *
 * @param {Hexo} ctx - 已初始化的子 Hexo 实例
 */
module.exports = function injector(ctx) {
    const { injector } = ctx.extend;
    // 注册 body_end 注入点：各Hexo主题路由监听脚本
    injector.register('body_end', require('./route-listener'));
};
