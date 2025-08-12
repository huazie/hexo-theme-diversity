'use strict';
// 导入hexo-fs模块
const hexo_fs_1 = require("hexo-fs");
const path_1 = require("path");
const hexo_util_1 = require("hexo-util");

class Util {
	/**
	 * 判断指定路径下的文件是否存在
	 * 
	 * @param path 指定路径
	 * @parma fileName 文件名
	 * @return true：存在，false：不存在
	 */
	static isExist(path, fileName) {
		const dest = (0, path_1.join)(path, fileName);
        return (0, hexo_fs_1.existsSync)(dest);
	}

	/**
	 * 是否是匹配的命令
	 * 
	 * @param cmd 命令标识
	 * @return true： 是，false：不是
	 */
	static isMatchCmd(cmd) {
	    return Util.isServerCmd(cmd) || Util.isGenerateCmd(cmd) || Util.isCleanCmd(cmd);
	}

	/**
	 * 是否是 server 命令
	 * 
	 * @param cmd 命令标识
	 * @return true： 是，false：不是
	 */
	static isServerCmd(cmd) {
	    return cmd === 'server';
	}

	/**
	 * 是否是 generate 命令
	 * 
	 * @param cmd 命令标识
	 * @return true： 是，false：不是
	 */
	static isGenerateCmd(cmd) {
	    return cmd === 'generate';
	}

	/**
	 * 是否是 clean 命令
	 * 
	 * @param cmd 命令标识
	 * @return true： 是，false：不是
	 */
	static isCleanCmd(cmd) {
	    return cmd === 'clean';
	}

}

// 注入点定义
const points = {
	// 视图定义
    views: [
        'pageEnd',
        'comment'
    ]
};

module.exports = {
    Util,
    points
};