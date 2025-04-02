'use strict';

const path = require('path');

// 添加默认配置的Diversity主题注入过滤器
hexo.extend.filter.register('theme_inject', injects => {
    injects.comment.raws.forEach(element => {
        // 获取注入对象名
        const injectName = path.basename(element.name, path.extname(element.name));
        element.args[0] = Object.assign({
            configKey: injectName,
            class: injectName,
            text: injectName
        }, element.args[0]);

        const locals = element.args[0];
        const config = hexo.theme.config.comments;
        // 默认展示的评论系统
        if (config.active === locals.configKey) {
            element.args[0].active = 'active';
        }
        // 调整导航元素的文本或顺序
        if (config.nav) {
            const nav = config.nav[locals.configKey] || {};
            // 顺序
            if (nav.order) {
                element.args[2] = nav.order;
            }
            // 文本
            if (nav.text) {
                locals.text = nav.text;
            }
        }
    });
}, 99);