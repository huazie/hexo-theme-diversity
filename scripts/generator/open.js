"use strict";
// 开源项目详情页生成器（⑦）：
// 以 layout: open 的列表页所在目录为根，为 site.data 中 open/ 前缀的每个项目生成 <列表页目录>/<key>/ 详情页；
// 新增 source/_data/open/*.yml 数据文件后详情页自动带出，无需手写页面；站点无 open 列表页时整体跳过。
// README（方案 A）：本地缓存 site.data['open-readme/<key>']（data processor 渲染好的 HTML）优先，
// 未命中时从 GitHub raw 拉取并写回缓存（详见 lib/readme.js）；无 README 时详情页降级为卡片式内容。
const { loadReadme } = require('../lib/readme');

async function openDetailGenerator(locals) {
    const pages = Array.isArray(locals.pages) ? locals.pages : locals.pages.toArray();
    // 列表页：layout 为 open 的站点页面（如 source/diversity/open/index.md）
    const openPage = pages.find((p) => p.layout === 'open' && p.path);
    if (!openPage) return [];
    // 列表页路径去掉文件名即详情页根目录（diversity/open/index.html → diversity/open/）
    const base = openPage.path.replace(/[^/]+$/, '');
    const data = locals.data || {};
    const projects = Object.keys(data)
        .filter((key) => key.indexOf('open/') === 0)
        .map((key) => {
            const p = Object.assign({}, data[key]);
            p.key = key.slice(5);
            return p;
        })
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    const ctx = this;
    return Promise.all(projects.map(async (p) => {
        const readme = await loadReadme(ctx, data['open-readme/' + p.key], p, p.key);
        return {
            path: base + p.key + '/index.html',
            layout: ['open-detail', 'page', 'index'],
            data: {
                title: p.name,
                // 详情页数据与列表页路径（layout 内拼「返回列表」「标签回跳」链接用）
                project: p,
                list_path: openPage.path,
                readme
            }
        };
    }));
}
module.exports = openDetailGenerator;
