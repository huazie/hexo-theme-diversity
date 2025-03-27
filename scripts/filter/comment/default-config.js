'use strict';

const path = require('path');

// 添加默认配置的Diversity主题注入过滤器
hexo.extend.filter.register('theme_inject', injects => {
    injects.comment.raws.forEach(element => {

        const injectName = path.basename(element.name, path.extname(element.name));
        element.args[0] = Object.assign({
            configKey: injectName,
            class: injectName,
            label: injectName
        }, element.args[0]);

        const locals = element.args[0];
        const config = hexo.theme.config.comments;
        // 默认展示的评论系统
        if (config.active === locals.configKey) {
            element.args[0].active = 'active';
        }
    });
}, 99);