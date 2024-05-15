"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const hexo_fs_1 = require("hexo-fs");
const bluebird_1 = __importDefault(require("bluebird"));
const path_1 = require("path");
const picocolors_1 = require("picocolors");
const process = (name, ctx) => {
    return bluebird_1.default.filter(ctx.model(name).toArray(), (asset) => {
        if (!(0, hexo_fs_1.exists)(asset.source)) {
            return asset.remove();
        }
        // 获取项目根目录
        const baseDir = ctx.base_dir;
        const { source } = asset;
        const relativePath = source.substring(baseDir.length, source.length);
        // 剔除项目根目录source目录下的资源
        return !relativePath.startsWith('source');
    }).map((asset) => {
        const { source } = asset;
        let { path } = asset;
        const data = {
            modified: asset.modified
        };
        console.log('######### ' + source);
        if (asset.renderable && ctx.render.isRenderable(path)) {
            // Replace extension name if the asset is renderable
            const filename = path.substring(0, path.length - (0, path_1.extname)(path).length);
            path = `${filename}.${ctx.render.getOutput(path)}`;
            data.data = () => ctx.render.render({
                path: source,
                toString: true
            }).catch(err => {
                ctx.log.error({ err }, 'Asset render failed: %s', (0, picocolors_1.magenta)(path));
            });
        }
        else {
            data.data = () => (0, hexo_fs_1.createReadStream)(source);
        }
        return { path, data };
    });
};
function assetGenerator() {
    return bluebird_1.default.all([
        process('Asset', this)
        // 去除 PostAsset 的资源数据生成
        // ,process('PostAsset', this)
    ]).then(data => [].concat(...data));
}
module.exports = assetGenerator;