'use strict';
const path_1 = require("path");
const Hexo = require('hexo');
const Util = require('./lib/util');

// Diversity的主题名
const themeName = hexo.config.theme;
// 在生成器解析前执行
hexo.extend.filter.register('before_generate', () => require('./generator')(hexo, themeName), 100);

// 添加辅助函数（Helper）
require('./helper/helper')(hexo);

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
themeConfig.cmd = cmd;
// 获取配置的多主题列表
const themes = themeConfig.themes;
if (!(Array.isArray(themes))) {
    console.log('##### Please check the [_config.diversity.yml] file.');
    console.log('##### The "themes" property must be an Array.');
    return;
}

// 多主题目录配置的数组索引
let index = 0;
// 循环处理配置的多主题列表
themes.forEach(function(theme) {
    themeConfig.index = index;
    console.log('##### theme = ' + theme);
    if (Util.isMatchCmd(cmd)) {
        const {args} = hexo.env;
        const fileName = '_config.yml';
        args.output = cwd + path_1.sep + 'config' + path_1.sep + theme;
        if (!Util.isExist(args.output, fileName)) {
            console.log('##### Please add the [' + fileName + '] file in [' + args.output + '].');
            return;
        }
        args.config = args.output + path_1.sep + fileName;
        const hexo1 = new Hexo(cwd, args);
        require('./config')(hexo1, themeConfig);
        hexo1.init()
            .then(() => require('./helper')(hexo1))
            .then(() => require('./generator')(hexo1, themeName))
            .then(() => hexo1.call(cmd, args))
            .then(() => hexo1.exit())
            .catch(err => hexo1.exit(err));
    } 
    // 下一个主题
    index++;
});