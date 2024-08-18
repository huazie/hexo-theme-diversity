'use strict';

const pagination = require('hexo-pagination');

module.exports = function(locals) {
    const config = this.config;
    const perPage = config.category_generator.per_page;
    const paginationDir = config.pagination_dir || 'page';
    const orderBy = config.category_generator.order_by || '-date';

    let pages = locals.categories.reduce((result, category) => {
        if (!category.length) return result;

        const posts = category.posts.sort(orderBy);

        const data = pagination(category.path, posts, {
            perPage,
            layout: ['category', 'archive', 'index'],
            format: paginationDir + '/%d/',
            data: {
                category: category.name
            }
        });

        return result.concat(data);
    }, []);

    // generate category index page, usually /categories/index.html
    if (config.category_generator.enable_index_page) {
        let allCategoryPosts = locals.categories;
        // 获取全部分类
        for (const category of allCategoryPosts.data) {
            const posts = category.posts.sort(orderBy);
            const date = posts.toArray()[posts.length - 1].date;
            // 分类创建的日期为其下最早的文章
            category.date = date;
            category.title = category.name;
            category.categories = {length: 0};
            category.tags = {length: 0};
        }
        // 按日期排序
        allCategoryPosts = allCategoryPosts.sort(orderBy);

        let categoryDir = config.category_dir;
        if (categoryDir[categoryDir.length - 1] !== '/') {
            categoryDir += '/';
        }
        const dataAll = pagination(categoryDir, allCategoryPosts, {
            perPage,
            layout: ['category-index', 'category', 'archive', 'index'],
            format: paginationDir + '/%d/',
            data: {
                category: ''
            }
        });
        pages = pages.concat(dataAll);
    }

    return pages;
};
