'use strict';

const pagination = require('hexo-pagination');

module.exports = function(locals) {
    const config = this.config;
    // 标签首页布局。 如果不配置，则默认为 tag-index
    const tLayout = config.category_generator.layout || 'tag-index';
    const perPage = config.tag_generator.per_page;
    const paginationDir = config.pagination_dir || 'page';
    const orderBy = config.tag_generator.order_by || '-date';
    const tags = locals.tags;
    let tagDir;

    let pages = tags.reduce((result, tag) => {
        if (!tag.length) return result;

        const posts = tag.posts.sort(orderBy);
        const data = pagination(tag.path, posts, {
            perPage: perPage,
            layout: ['tag', 'archive', 'index'],
            format: paginationDir + '/%d/',
            data: {
                tag: tag.name
            }
        });

        return result.concat(data);
    }, []);

    // generate tag index page, usually /tags/index.html
    if (config.tag_generator.enable_index_page) {
        let allTagPosts = tags;
        // 获取全部分类
        for (const tag of allTagPosts.data) {
            const posts = tag.posts.sort(orderBy);
            const date = posts.toArray()[posts.length - 1].date;
            // 分类创建的日期为其下最早的文章
            tag.date = date;
            tag.title = tag.name;
            tag.categories = {length: 0};
            tag.tags = {length: 0};
        }
        // 按日期排序
        allTagPosts = allTagPosts.sort(orderBy);

        tagDir = config.tag_dir;
        if (tagDir[tagDir.length - 1] !== '/') {
            tagDir += '/';
        }

        const dataAll = pagination(tagDir, allTagPosts, {
            perPage,
            layout: [tLayout, 'tag', 'archive', 'index'],
            format: paginationDir + '/%d/',
            data: {
                tag: ''
            }
        });
        pages = pages.concat(dataAll);
    }

    return pages;
};
