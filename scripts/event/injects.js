'use strict';

const fs = require('fs');
const path = require('path');
const { points } = require('../lib/util');
const defaultExtname = '.ejs';

/**
 * 视图注入配置类
 * 
 * @see [next-theme/hexo-theme-next] - 来自 NexT 中的相关设计
 */
class ViewInject {
    constructor(base_dir) {
        // Hexo项目的基础目录路径
        this.base_dir = base_dir;
        // 存储视图相关的原始数据的数组
        this.raws = [];
    }

    /**
     * 用于添加视图相关的原始数据（如视图模板内容等）到raws数组中的方法。
     *
     * @param {string} name - 表示视图相关数据对应的文件名，可带有路径信息（相对路径或后续处理为绝对路径），
     *                        如果文件名没有扩展名，会自动添加默认扩展名（由defaultExtname变量决定）。
     * @param {*} raw - 视图相关的原始数据内容，具体类型根据实际情况而定，例如可能是字符串形式的视图模板代码等。
     * @param {...*} args - 可变参数，用于传递其他额外的参数信息，具体含义和使用取决于具体的业务场景，
     *                     比如可能是视图渲染时需要的局部变量、配置选项等相关的数据。
     */
    raw(name, raw, ...args) {
        // 如果没有扩展名，则添加默认的扩展名
        if (path.extname(name) === '') {
            name += defaultExtname;
        }
        this.raws.push({ name, raw, args });
    }
    
    /**
     * 用于从文件中读取内容，并将读取到的内容作为视图相关的原始数据添加到raws数组中
     *
     * @param {string} name - 表示视图相关数据对应的文件名，可带有路径信息（相对路径或后续处理为绝对路径），
     *                        如果文件名没有扩展名，会自动添加从传入的文件（file）获取到的扩展名。
     * @param {string} file - 表示要读取内容的文件的相对路径（相对于基础目录this.base_dir），
     *                       通过此路径和基础目录可确定文件的绝对位置以便读取内容。
     * @param {...*} args - 可变参数，用于传递其他额外的参数信息，具体含义和使用取决于具体的业务场景，
     *                     比如可能是视图渲染时需要的局部变量、配置选项等相关的数据。
     */
    file(name, file, ...args) {
        // 如果没有扩展名，则添加从传入的文件（file）获取到的扩展名
        if (path.extname(name) === '') {
            name += path.extname(file);
        }
        // 首先基于传入的基础目录和文件相对路径，来获取文件的绝对路径
        // 然后通过文件绝对路径来读取文件内容
        // 最后添加视图相关的原始数据到raws数组中
        this.raw(name, fs.readFileSync(path.resolve(this.base_dir, file), 'utf8'), ...args);
    }
}

// 初始化视图注入相关的配置对象
function initInject(base_dir) {
    const injects = {};
    points.views.forEach(item => {
        injects[item] = new ViewInject(base_dir);
    });
    return injects;
}

module.exports = hexo => {
    const injects = initInject(hexo.base_dir);
    // 执行 theme_inject 过滤器
    hexo.execFilterSync('theme_inject', injects);
    hexo.theme.config.injects = {};

    // 遍历注入点中的视图类型
    points.views.forEach(type => {
        const configs = Object.create(null);
        hexo.theme.config.injects[type] = [];
        // 遍历当前视图类型对应的原始数据
        injects[type].raws.forEach((injectObj, index) => {
            // 举例： 评论系统 utterances
            // name 形如 inject/comment/utterances
            const name = `inject/${type}/${injectObj.name}`;
            // 将视图相关的原始数据与视图名称关联
            hexo.theme.setView(name, injectObj.raw);
            configs[name] = {
                // 设置视图的布局名称为上面的视图名称
                layout: name,
                // 设置视图的本地数据（可能是传递给视图渲染的一些数据等）
                locals: injectObj.args[0],
                // 设置视图的可选参数（可能涉及视图渲染的一些配置选项等）
                options: injectObj.args[1],
                // 设置视图的顺序，如果injectObj.args数组长度大于等于3，则取第三个元素作为顺序值，
                // 否则使用当前遍历的索引（index）作为顺序值，用于后续对视图进行排序
                order: injectObj.args[2] || index
            };

        });
        // 对当前视图类型下的所有视图配置（configs对象中的值）按照顺序（order属性）进行排序
        hexo.theme.config.injects[type] = Object.values(configs)
            .sort((x, y) => x.order - y.order);
    });
};