'use strict';

/**
 * 子主题页面自引用 canonical 注入。
 *
 * 子主题布局为外部主题（landscape/light/phase/icarus/next），无法在主题模板内输出
 * <link rel="canonical">，故借助 hexo 路由级过滤点 _after_html_render（视图渲染完成后
 * 执行、携带页面 locals）在构建期按页注入自引用 canonical。
 *
 * 说明：子实例 config.url 自带主题路径（如 http://blog.huazie.com/landscape），
 * url + 页面路由路径即为该页面的规范 URL。同一文章在多个子主题实例各有 URL，
 * 此处统一自引用作为规范基线；主实例（diversity）页面由 head.ejs 直接输出，不经过本过滤器。
 *
 * @param {Hexo} ctx 子 Hexo 实例
 * @returns {Function} _after_html_render 过滤器：(result, locals) => result
 */
module.exports = function (ctx) {
    return function (result, locals) {
        if (typeof result !== 'string' || !result.includes('</head>')) return result;
        // 主题已自带 canonical（如 next）时跳过，避免重复输出
        if (result.indexOf('rel="canonical"') !== -1) return result;
        const config = ctx.config || {};
        if (!config.url || !locals || !locals.path) return result;
        const base = config.url.replace(/\/+$/, '');
        // 归一化：去掉尾部 index.html（与主实例 og:url 口径一致）
        const path = String(locals.path).replace(/(index\.html)$/, '').replace(/"/g, '%22');
        return result.replace('</head>', '<link rel="canonical" href="' + base + '/' + path + '"></head>');
    };
};
