'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Diversity injector 入口。
 * 注册各Hexo主题所需的各类注入脚本。
 *
 * @param {Hexo} ctx - 已初始化的子 Hexo 实例
 * @param {object} themeConfig - Diversity 主题配置（站点 _config.diversity.yml）
 */
module.exports = function injector(ctx, themeConfig) {
    const { injector } = ctx.extend;
    // 注册 body_end 注入点：各Hexo主题路由监听脚本
    injector.register('body_end', require('./route-listener'));
    // 注册 body_end 注入点：mermaid 图渲染脚本（内联，与主题 source/js/mermaid-render.js 同源）。
    // 子主题页面无 diversity 的 head.ejs 条件注入，改为全局注入；
    // 脚本自带零开销守卫：页面无 mermaid 占位容器时直接返回，不加载 mermaid 库
    const mermaidSrc = fs.readFileSync(path.join(__dirname, '../../source/js/mermaid-render.js'), 'utf8');
    injector.register('body_end', '<script>' + mermaidSrc + '<' + '/script>');
    // 注册 body_end 注入点：代码块增强（语言标签/复制按钮，内联，与主题 source/js/code-copy.js 同源）。
    // 全局注入，脚本自带零开销守卫：页面无代码块时直接返回，不注入任何样式/节点
    const codeCopySrc = fs.readFileSync(path.join(__dirname, '../../source/js/code-copy.js'), 'utf8');
    injector.register('body_end', '<script>' + codeCopySrc + '<' + '/script>');
    // 注册 body_end 注入点：文章图片放大查看（内联，与主题 source/js/image-lightbox.js 同源）。
    // 白名单机制：仅 page.image_zoom 中列出的子主题注入查看脚本（未自带图片放大能力、
    // 需要添加的主题才配置）；自带放大能力的主题（如 landscape/light/phase = fancybox、
    // icarus = lightGallery、next = Fancybox）不配置，构建期零开销
    const pageCfg = (themeConfig && themeConfig.page) || {};
    const enableThemes = Array.isArray(pageCfg.image_zoom) ? pageCfg.image_zoom : [];
    if (enableThemes.indexOf(ctx.config.theme) !== -1) {
        const imgLbSrc = fs.readFileSync(path.join(__dirname, '../../source/js/image-lightbox.js'), 'utf8');
        injector.register('body_end', '<script>' + imgLbSrc + '<' + '/script>');
    }
};
