'use strict';

// 导入hexo模块
const path_1 = require("path");
const Hexo = require('hexo');
const Util = require('./lib/util');
const server = require('./lib/server');
const generate = require('./lib/generate');
const clean = require('./lib/clean');

// 获取控制台命令的别名
const { alias } = hexo.extend.console;
// 获取hexo执行命令
const cmd = alias[hexo.env.cmd];
// 当前项目根目录
const cwd = process.cwd();
console.log('##### cmd = ' + cmd);
const themeConfig = hexo.config.theme_config;
if (!themeConfig || !themeConfig.themes) {
    console.log('##### Please add the [_config.diversity.yml] file in [' + cwd + '].');
    console.log('##### The "themes" property must to be configured.');
    return;
}
// 获取配置的多主题服务器端口
const ports = themeConfig.ports;
// 获取配置的多主题列表
const themes = themeConfig.themes;
if (!(Array.isArray(themes))) {
    console.log('##### Please check the [_config.diversity.yml] file.');
    console.log('##### The "themes" property must be an Array.');
    return;
}

// Hexo实例数组
const hexos = [];
// 多主题目录配置的数组索引
let index = 0;
// 循环处理配置的多主题列表
themes.forEach(function(theme) {
    console.log('##### theme = ' + theme);
    const {args} = hexo.env;
    const fileName = getConfigFileName(theme);
    args.output = cwd + path_1.sep + 'config' + path_1.sep + theme;
    if (!Util.isExist(args.output, fileName)) {
        console.log('##### Please add the [' + fileName + '] file in [' + args.output + '].');
        return;
    }
    args.config = args.output + path_1.sep + fileName;
    if (Util.isMatchCmd(cmd)) {
        const hexo1 = new Hexo(cwd, args);
        if (Util.isServerCmd(cmd))
            configServer(hexo1, ports, index);
        hexos.push(hexo1);
    } 
    // 下一个主题
    index++;
});

// 循环处理多个Hexo实例
hexos.forEach(function(hexo1) {
    const {args} = hexo.env;
    if (Util.isServerCmd(cmd)) {
        hexo1.init().then(function(){
            server(hexo1, args);
        });
    } else if (Util.isGenerateCmd(cmd)) {
        hexo1.init().then(function(){
            generate(hexo1, args);
        });
    } else if (Util.isCleanCmd(cmd)) {
        hexo1.init().then(function(){
            clean(hexo1);
        });
    }
});

/**
 * 获取用于加载指定主题的Hexo配置文件名
 * 
 * @param theme 主题名
 * @return 指定主题对应的Hexo配置文件名
 */
function getConfigFileName(theme) {
    return '_' + theme + '_config.yml';
}

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