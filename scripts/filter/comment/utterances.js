'use strict';

const path = require('path');

// 添加 Utterances 评论系统相关的Diversity主题注入过滤器
hexo.extend.filter.register('theme_inject', injects => {
    const config = hexo.theme.config.utterances;
    // 没有启用 Utterances
    if (!config.enable) return;

    // 没有配置GitHub仓库所有者和名称
    if (!config.repo) {
        hexo.log.error('utterances.repo can\'t be null.');
        return;
    }

    // comment 视图添加 utterances
    injects.comment.raw('utterances', '<div class="comments utterances-container"></div>', {}, { cache: true });

    // pageEnd 视图添加 utterances
    injects.pageEnd.file('utterances', path.join(hexo.theme_dir, 'layout/_third-party/comments/utterances.ejs'));
});