'use strict';

const path = require('path');

// 添加 Giscus 评论系统相关的Diversity主题注入过滤器
hexo.extend.filter.register('theme_inject', injects => {
    const config = hexo.theme.config.giscus;
    // 没有启用 Giscus
    if (!config.enable) return;

    // 没有配置GitHub仓库名称
    if (!config.repo) {
        hexo.log.error('giscus.repo can\'t be null.');
        return;
    }

    // comment 视图添加 giscus
    injects.comment.raw('giscus', '<div class="comments giscus-container"><div class="giscus"></div></div>', {}, { cache: true });

    // pageEnd 视图添加 giscus
    injects.pageEnd.file('giscus', path.join(hexo.theme_dir, 'layout/_third-party/comments/giscus.ejs'));
});