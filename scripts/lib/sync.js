/**
 * 同步 Diversity 主题配置和资源
 * 执行 hexo server 命令后同步 _config.diversity.yml 配置和 other 目录内容
 * 执行 hexo dsync 命令专门同步 _config.diversity.yml 配置和 other 目录内容
 *
 * 使用强制覆盖模式：
 *   hexo s --force     // 本地预览时强制覆盖已存在文件
 *   hexo s -f          // 本地预览时强制覆盖已存在文件（参数简写）
 *   hexo dsync --force // 本地同步时强制覆盖已存在文件
 *   hexo dsync -f      // 本地同步时强制覆盖已存在文件（参数简写）
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { Util } = require('./util');

/**
 * 解析命令行参数，检查是否启用强制模式
 */
function isForceMode() {
    const forceFlags = [
        '--force',
        '-f'
    ];
    return forceFlags.some(flag => process.argv.includes(flag));
}

/**
 * Sync 类 - 处理 Diversity 主题配置和资源同步
 */
class Sync {
    /**
     * 构造函数
     * @param {Object} hexo - Hexo 实例
     */
    constructor(hexo) {
        this.hexo = hexo;
        this.baseDir = process.cwd();
        this.initialized = false;
    }

    /**
     * 获取模式文本
     * @param {boolean} force - 是否强制模式
     * @returns {string} 模式描述
     */
    getModeText(force = false) {
        return force ? '强制覆盖' : '跳过已存在';
    }

    /**
     * 复制文件
     * @param {string} src - 源文件路径
     * @param {string} dest - 目标文件路径
     * @param {boolean} force - 是否强制覆盖
     */
    copyFile(src, dest, force = false) {
        if (!fs.existsSync(src)) return false;

        const relPath = path.relative(this.baseDir, src);

        // 检查文件是否存在，且未启用强制模式
        if (fs.existsSync(dest) && !force) {
            this.hexo.log.info(`[Diversity] 同步文件: ${relPath} [${this.getModeText(force)}]`);
            return false; // 跳过，不复制
        }

        // 确保目标目录存在
        const destDir = path.dirname(dest);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        if (fs.existsSync(dest) && force)
            this.hexo.log.info(`[Diversity] 同步文件: ${relPath} [${this.getModeText(force)}]`);
        else
            this.hexo.log.info(`[Diversity] 同步文件: ${relPath}`);

        fs.copyFileSync(src, dest);

        return true;
    }

    /**
     * 递归复制目录
     * @param {string} src - 源目录路径
     * @param {string} dest - 目标目录路径
     * @param {boolean} force - 是否强制覆盖
     */
    copyDir(src, dest, force = false) {
        if (!fs.existsSync(src)) return false;

        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }

        const entries = fs.readdirSync(src, { withFileTypes: true });

        this.hexo.log.info(`[Diversity] 同步目录: ${path.relative(this.baseDir, src)}`);

        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            if (entry.isDirectory()) {
                this.copyDir(srcPath, destPath, force);
            } else {
                this.copyFile(srcPath, destPath, force);
            }
        }
        return true;
    }

    /**
     * 执行同步逻辑（核心方法）
     * @param {boolean} force - 是否强制覆盖
     */
    doSync(force) {
        const mode = this.getModeText(force);
        this.hexo.log.info(`[Diversity] 开始同步 [${mode}]...`);

        const themeDir = this.hexo.theme_dir;
        const configSrc = path.join(themeDir, '_config.diversity.yml');
        const configDest = path.join(this.baseDir, '_config.diversity.yml');
        const otherDir = path.join(themeDir, 'other');

        // 1. 复制配置文件
        if (fs.existsSync(configSrc)) {
            // 独立的主题配置文件不需要强制覆盖
            this.copyFile(configSrc, configDest, false);
        }

        // 2. 同步 other 目录内容
        if (fs.existsSync(otherDir)) {
            const entries = fs.readdirSync(otherDir, { withFileTypes: true });

            for (const entry of entries) {
                const srcPath = path.join(otherDir, entry.name);
                const destPath = path.join(this.baseDir, entry.name);

                if (entry.isDirectory()) {
                    this.copyDir(srcPath, destPath, force);
                } else {
                    this.copyFile(srcPath, destPath, force);
                }
            }
        }

        this.hexo.log.info('[Diversity] 同步完成');
    }

    /**
     * 同步 Diversity 主题配置和资源（server 命令触发）
     */
    syncDiversity() {
        // 获取控制台命令的别名
        const { alias } = this.hexo.extend.console;
        // 获取hexo执行命令
        const cmd = alias[this.hexo.env.cmd];
        // 限制在 server 命令才执行
        // 只执行一次
        if (!Util.isServerCmd(cmd) || this.initialized) {
            return;
        }

        const force = isForceMode();

        this.doSync(force);

        this.initialized = true;
    }
}

module.exports = Sync;
