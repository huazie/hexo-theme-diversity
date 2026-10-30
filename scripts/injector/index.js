'use strict';

const fs = require('fs');
const path = require('path');

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
    // 注册 body_end 注入点：mermaid 图渲染脚本（内联，与主题 source/js/mermaid-render.js 同源）。
    // 子主题页面无 diversity 的 head.ejs 条件注入，改为全局注入；
    // 脚本自带零开销守卫：页面无 mermaid 占位容器时直接返回，不加载 mermaid 库
    const mermaidSrc = fs.readFileSync(path.join(__dirname, '../../source/js/mermaid-render.js'), 'utf8');
    injector.register('body_end', '<script>' + mermaidSrc + '<' + '/script>');
};
