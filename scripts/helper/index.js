"use strict";

const { parse } = require('url');

module.exports = (ctx, theme) => {
    const { helper } = ctx.extend;
    // Diversity主题生成器特殊处理
    if (ctx.config.theme === theme) {
        // 导航菜单栏的辅助函数
        helper.register('header_menu', require('./navigation'));
        // 一种在生成的HTML页面中嵌入JSON格式配置信息的辅助函数
        helper.register('diversity_data', data);
        // 生成Diversity主题的核心配置信息的辅助函数
        helper.register('diversity_config', config);
        // Diversity主题内容注入的辅助函数
        helper.register('diversity_inject', inject);
    } else {
        // 其他主题
        // 覆盖原css辅助函数[不同主题引入的css路径和名称可能一样，这里需要按主题名称加js路径和名称记忆]
        helper.register('css', require('./css'));
        // 覆盖原js辅助函数[不同主题引入的js路径和名称可能一样，这里需要按主题名称加js路径和名称记忆]
        helper.register('js', require('./js'));
    }
};

/**
 * 生成一个包含JSON数据的<script>标签的函数
 *
 * @param {string} name - 要设置的data-name属性的值，通常用于标识这段JSON数据的用途或名称
 * @param {...*} data - 可变数量的参数，这些参数将被合并成一个对象。如果只有一个参数且它是一个对象，则直接使用该对象；
 *                      如果有多个参数，则尝试将它们合并成一个对象（注意：如果参数不是对象或合并时键名冲突，后面的参数会覆盖前面的）
 * @returns {string} - 一个包含JSON数据的<script>标签的字符串
 */
function data(name, ...data) {
    const json = data.length === 1 ? data[0] : Object.assign({}, ...data);
    return `<script class="diversity-config" data-name="${name}" type="application/json">${
        JSON.stringify(json).replace(/</g, '\\u003c')
    }</script>`;
}

/**
 * Diversity主题的核心配置
 * 
 * @returns {object} 核心配置信息
 */
function config() {
    const { config, theme, site, __ } = this;
    const diversity_menu = site.data.diversity_menu;
    const exportConfig = {
        author: this.author,
        hostname: parse(config.url).hostname || config.url,
        theme: config.theme,
        version: this.diversity_version,
        themes: theme.themes,
        ports: theme.ports,
        source: theme.source,
        page: theme.page,
        back2top: theme.back2top,
        comments: theme.comments,
        menu: diversity_menu,
        index: diversity_menu[Object.keys(diversity_menu)[0]],
        button: {
            theme_default: __('button.theme-default'),
            cancel_defalut: __('button.cancel-defalut'),
            theme_redirect: __('button.theme-redirect'),
            theme_source: __('button.theme-source')
        },
        gritter: {
            title_theme: __('gritter.title-theme'),
            text_configured: __('gritter.text-configured'),
            text_canceled: __('gritter.text-canceled'),
            text_clicktojump: __('gritter.text-click-to-jump')
        },
        introduction: {},
        no_theme: {
            back_image: theme.back_image,
            tip_text: __('no-theme.tip-text'),
            btn_text: __('no-theme.btn-text')
        }
    };

    theme.themes.forEach(function(theme) {
        exportConfig.introduction[theme] = __('introduction.' + theme);
    });

    return exportConfig;
}

/**
 * 根据指定的注入点获取并处理主题相关的注入内容，并将处理后的结果合并返回。
 *
 * @param {string} point - 注入点标识
 * @returns {string} - 将查找到的对应注入点下的所有内容项经过渲染处理后拼接而成的字符串
 */
function inject(point) {
    return this.theme.injects[point]
        .map(item => this.partial(item.layout, item.locals, item.options))
        .join('');
}