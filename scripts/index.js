'use strict';

const path_1 = require("path");
const Hexo = require('hexo');
const { Util } = require('./lib/util');

// Diversity的主题名
const themeName = hexo.config.theme;
// 添加过滤器
require('./filter')(hexo, themeName);
// 添加辅助函数（Helper）
require('./helper')(hexo, themeName);
// 在生成器解析前执行
hexo.extend.filter.register('before_generate', () => {
    // 配置生成器
    require('./generator')(hexo, themeName);
    // 添加Diversity主题注入过滤器处理 theme_inject
    require('./event/injects')(hexo);
}, 100);

hexo.on('ready', () => {
    if (!/^(g|s|v)/.test(hexo.env.cmd)) return;
    const { version } = require('../package.json');
    hexo.log.info(`Diversity version ${version}`);
    // 监控 _config.diversity.yml 文件变化
    require('./event/watcher')(hexo, cmd);
});

// 获取控制台命令的别名
const { alias } = hexo.extend.console;
// 获取hexo执行命令
const cmd = alias[hexo.env.cmd];
// 当前项目根目录
const cwd = process.cwd();
hexo.log.info('Cmd =', cmd);
const themeConfig = hexo.config.theme_config;
if (!themeConfig || !themeConfig.themes) {
    hexo.log.error('Please add the [_config.diversity.yml] file in [' + cwd + '].');
    hexo.log.error('The "themes" property must to be configured.');
    return;
}
themeConfig.cmd = cmd;
// 获取配置的多主题列表
const themes = themeConfig.themes;
if (!(Array.isArray(themes))) {
    hexo.log.error('Please check the [_config.diversity.yml] file.');
    hexo.log.error('The "themes" property must be an Array.');
    return;
}

// 多主题目录配置的数组索引
let index = 0;
// 循环处理配置的多主题列表
themes.forEach(function(theme) {
    themeConfig.index = index;
    if (Util.isMatchCmd(cmd)) {
        hexo.log.info('Theme', (index + 1), '=', theme);
        const {args} = hexo.env;
        const fileName = '_config.yml';
        args.output = path_1.join(cwd, 'config', theme);
        if (!Util.isExist(args.output, fileName)) {
            hexo.log.error('Please add the [' + fileName + '] file in [' + args.output + '].');
            return;
        }
        args.config = path_1.join(args.output, fileName);
        const hexo1 = new Hexo(cwd, args);
        require('./config')(hexo1, themeConfig);
        hexo1.init()
            .then(() => require('./helper')(hexo1, themeName))
            .then(() => require('./generator')(hexo1, themeName))
            // 监控 _config.${theme}.yml 文件变化，如 _config.landscape.yml
            .then(() => require('./event/watcher')(hexo1, cmd))
            .then(() => hexo1.call(cmd, args))
            .then(() => hexo1.exit())
            .catch(err => hexo1.exit(err));
    } 
    // 下一个主题
    index++;
});