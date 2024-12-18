"use strict";
const { Util } = require('../lib/util');

module.exports = (ctx, themeConfig) => {
    const {cmd, index, ports} = themeConfig;
    if (Util.isServerCmd(cmd))
        configServer(ctx, ports, index);
};

/**
 * 添加Hexo服务器配置信息
 * 
 * @param hexo Hexo实例
 * @param ports 多主题服务器端口列表
 * @param index 多主题目录配置的数组索引
 */
function configServer(hexo, ports, index) {
    const port = configPort(ports, index);
    // 添加服务器配置信息
    hexo.config.server = Object.assign({
        port: port,
        log: false,
        // `undefined` uses Node's default (try `::` with fallback to `0.0.0.0`)
        ip: undefined,
        compress: false,
        header: true
    }, hexo.config.server);
}

/**
 * 配置服务器端口
 * 
 * @param ports 多主题服务器端口列表
 * @param index 多主题目录配置的数组索引
 */
function configPort(ports, index) {
    let port = 4001;
    if (ports && ports[index]) {
        port = ports[index];
    } else {
        port+= index;
    }
    return port;
}