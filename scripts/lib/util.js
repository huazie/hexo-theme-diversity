'use strict';
// 导入hexo-fs模块
const hexo_fs_1 = require("hexo-fs");
const path_1 = require("path");

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

}

module.exports = Util;