"use strict";
// 开源项目详情页生成器（⑦）：
// 以 layout: open 的列表页所在目录为根，为 site.data 中 open/ 前缀的每个项目生成 <列表页目录>/<key>/ 详情页；
// 新增 source/_data/open/*.yml 数据文件后详情页自动带出，无需手写页面；站点无 open 列表页时整体跳过。
// README（方案 A）：本地缓存 site.data['open-readme/<key>']（<key>.json，{content: md 原文}，渲染统一走
// lib/readme.js 的 filter 管线），未命中时从 GitHub raw 拉取并写回缓存；无 README 时详情页降级为卡片式内容。
const { loadReadme } = require('../lib/readme');

// 缓存未命中的项目同时最多 3 个走网络，避免对 raw.githubusercontent 的突发并发
const FETCH_LIMIT = 3;

// 限并发 map：limit 个 worker 共享任务队列，结果按原顺序返回
async function mapLimit(items, limit, fn) {
    const results = new Array(items.length);
    let next = 0;
    async function worker() {
        while (next < items.length) {
            const i = next++;
            results[i] = await fn(items[i], i);
        }
    }
    await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
    return results;
}

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
    return mapLimit(projects, FETCH_LIMIT, async (p) => {
        const readme = await loadReadme(ctx, data["open-readme/" + p.key], p, p.key);
        return {
            path: base + p.key + '/index.html',
            layout: ['open-detail', 'page', 'index'],
            data: {
                title: p.name,
                // 项目描述：head.ejs 的 meta description / og:description 按页面描述优先取值
                description: p.description,
                // 详情页数据与列表页路径（layout 内拼「返回列表」「标签回跳」链接用）
                project: p,
                list_path: openPage.path,
                readme,
                // 评论接入开关：与留言页同机制（page.ejs 中 page.comments 控制），项目 yml 可置 false 关闭
                comments: p.comments !== false
            }
        };
    });
}
module.exports = openDetailGenerator;
