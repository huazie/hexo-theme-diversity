"use strict";

function customLocalsFilter(locals) {
    const { i18n } = this.theme;
    const { config } = this;
    const { __, theme } = locals;
    locals.diversity_version = require('../../package.json').version;
    locals.title = __('title') !== 'title' ? __('title') : config.title;
    locals.subtitle = __('subtitle') !== 'subtitle' ? __('subtitle') : config.subtitle;
    locals.author = __('author') !== 'author' ? __('author') : config.author;
    locals.description = __('description') !== 'description' ? __('description') : config.description;
    locals.languages = [...i18n.languages];
    locals.languages.splice(locals.languages.indexOf('default'), 1);
}

module.exports = customLocalsFilter;