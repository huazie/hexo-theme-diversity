"use strict";

const { parse } = require('url');
const cheerio = require('cheerio');

module.exports = (ctx, theme) => {
    const { helper } = ctx.extend;
    // Diversity主题生成器特殊处理
    if (ctx.config.theme === theme) {
        // 导航菜单栏的辅助函数
        helper.register('header_menu', require('./navigation'));
        // 一种在生成的HTML页面中嵌入JSON格式配置信息的辅助函数
        helper.register('diversity_data', data);
        // 生成Diversity主题的核心配置信息的辅助函数（内含 introduction 主题介绍映射，模板内直接使用）
        helper.register('diversity_config', config);
        // Diversity主题内容注入的辅助函数
        helper.register('diversity_inject', inject);
        // 添加页面目录链接锚点的辅助函数
        helper.register('page_anchor', pageAnchor);
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
        darkmode: theme.darkmode,
        source: theme.source,
        page: theme.page,
        back2top: theme.back2top,
        menu: diversity_menu,
        index: diversity_menu[Object.keys(diversity_menu)[0]],
        button: {
            theme_default: __('button.theme-default'),
            cancel_default: __('button.cancel-default'),
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

    // 获取当前语言，优先从页面配置获取，其次从站点配置获取
    const lang = this.page.lang || this.page.language || config.language || 'zh-CN';
    // 主题自带介绍：从 i18n 取 __('introduction.' + theme)
    // 注意：hexo-i18n 在 key 缺失时返回 key 字符串本身，这里过滤掉以免写入 'introduction.xxx'
    const langFileIntro = {};
    theme.themes.forEach(function (t) {
        const key = 'introduction.' + t;
        const v = __(key);
        if (v && v !== key) {
            langFileIntro[t] = v;
        }
    });
    // 主题介绍：合并 i18n 自带 + 旧格式数据文件({theme}_introduction.{lang}) + 新格式数据文件(languages/{lang}.yml 的 introduction 段)
    const introMap = getIntroductionMap(lang, site.data, config.theme, langFileIntro);

    theme.themes.forEach(function(theme) {
        exportConfig.introduction[theme] = introMap[theme] || '';
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

/**
 * 为给定的 HTML 字符串中的标题元素（h1 - h6）添加锚点链接功能，并添加相应的类名以方便样式设置和交互操作。
 * 
 * @param {string} str - 一个 HTML 字符串，表示需要处理的包含标题元素的 HTML 内容。
 * @returns {string} - 返回经过处理后的 HTML 字符串，其中标题元素（h1 - h6）已添加了锚点链接相关的类和 HTML 结构。如果传入的 HTML 字符串中不存在标题元素（h1 - h6），则直接返回原传入的字符串。
 */
function pageAnchor(str) {
    const $ = cheerio.load(str, {decodeEntities: false});
    const headings = $('h1, h2, h3, h4, h5, h6');

    if (!headings.length) return str;

    headings.each(function() {
        const id = $(this).attr('id');
        $(this)
            .addClass('article-heading')
            .append(`<a class="article-anchor" href="#${id}" aria-hidden="true"></a>`);
    });

    return $.html();
}

/**
 * 合并主题介绍映射（逐主题，数据优先，i18n 自带兜底）。
 * 优先级（高 → 低）：
 *   1. 语言数据文件 source/_data/languages/{lang}.yml 的 introduction 段
 *      （hexo 加载为 site.data.languages[lang].introduction，个别版本扁平化为 site.data['languages/{lang}']）
 *   2. 旧格式数据文件 source/_data/{theme}_introduction.{lang}.yml
 *      （hexo 加载为 site.data['{theme}_introduction.{lang}']）
 *   3. 主题自带介绍（由调用方从 i18n __('introduction.{theme}') 取得后传入 langFileIntro 兜底）
 * 数据文件只需写需要覆盖或新增的主题，其余自动由主题自带介绍补齐。
 * @param {string} lang - 语言代码
 * @param {object} siteData - site.data（数据文件内容）
 * @param {string} themeName - 主题名（用于旧格式数据文件的 key）
 * @param {object} langFileIntro - 主题自带介绍映射（i18n 取得，{themeName: intro}）
 * @returns {object} 合并后的介绍映射 {themeName: intro}
 */
function getIntroductionMap(lang, siteData, themeName, langFileIntro) {
    // 新格式：source/_data/languages/{lang}.yml → hexo 加载为 site.data.languages[lang]（嵌套）
    // 个别版本/配置可能扁平化为 site.data['languages/{lang}']，这里两种都兼容
    const newLangData = (siteData.languages && siteData.languages[lang]) || siteData['languages/' + lang] || {};
    const newData = newLangData.introduction || {};
    // 旧格式：source/_data/{theme}_introduction.{lang}.yml → site.data['{theme}_introduction.{lang}']
    const legacyData = siteData[themeName + '_introduction.' + lang] || {};
    const merged = Object.assign({}, langFileIntro, legacyData, newData);
    // 去除值首尾空白
    Object.keys(merged).forEach(key => {
        if (typeof merged[key] === 'string') {
            merged[key] = merged[key].trim();
        }
    });
    return merged;
}