'use strict';

const path = require('path');

// 添加 Gitalk 评论系统相关的Diversity主题注入过滤器
hexo.extend.filter.register('theme_inject', injects => {
    const config = hexo.theme.config.gitalk;
    // 没有启用 Gitalk
    if (!config.enable) return;

    // 没有配置GitHub 仓库所有者
    if (!config.repo) {
        hexo.log.error('gitalk.repo can\'t be null.');
        return;
    }

    // 没有配置GitHub 仓库所有者
    if (!config.github_id) {
        hexo.log.error('gitalk.github_id can\'t be null.');
        return;
    }

    // 没有配置GitHub 应用客户端 ID
    if (!config.client_id) {
        hexo.log.error('gitalk.client_id can\'t be null.');
        return;
    }

    // 没有配置GitHub 应用客户端密钥
    if (!config.client_secret) {
        hexo.log.error('gitalk.client_secret can\'t be null.');
        return;
    }
 
    // comment 视图添加 gitalk
    injects.comment.raw('gitalk', '<div class="comments gitalk-container"></div>', {}, { cache: true });

    // pageEnd 视图添加 gitalk
    injects.pageEnd.file('gitalk', path.join(hexo.theme_dir, 'layout/_third-party/comments/gitalk.ejs'));
});