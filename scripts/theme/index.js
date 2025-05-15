"use strict";

const { join } = require('path');
const { watch } = require('chokidar');
const { readFileSync } = require('fs');
const yaml = require('js-yaml');

class ThemeConfig {
    constructor(hexo) {
        this.updateCount = 0;
        this.hexo = hexo;
        this.watcher = null;
        this.configPath = this._getThemeConfigPath();
    }

    // 获取独立的主题配置文件真实路径
    _getThemeConfigPath() {
        const themeName = this.hexo.config.theme;
        const path = join(this.hexo.base_dir, `_config.${themeName}.yml`);
        try {
            readFileSync(path); // 检查文件可读性
            return path;
        } catch (err) {
            throw new Error(`未找到主题配置文件，请确认 _config.${themeName}.yml 存在`);
        }
    }

    // 加载独立的主题配置文件内容
    _loadThemeConfig(callback) {
        try {
            const content = readFileSync(this.configPath, "utf8");
            let themeConfig = yaml.load(content) || {};
            callback && typeof callback === 'function'  && callback(themeConfig);
            this.hexo.log.info(`[ThemeConfig] 重新加载主题配置: ${this.configPath}`);
        } catch (err) {
            this.hexo.log.error('[ThemeConfig] 配置加载失败（可能影响页面生成）:', err);
        }
    }

    // 加载默认的主题配置文件内容
    loadDefaultThemeConfig() {
        try {
            const path = join(this.hexo.theme_dir, '_config.yml');
            const content = readFileSync(path, "utf8");
            return yaml.load(content) || {};
        } catch (err) {
            this.hexo.log.error('[ThemeConfig] 默认主题配置加载失败:', err);
        }
    }

    // 监听配置文件变化
    watch(callback) {
        if (this.watcher) return;

        // 使用 chokidar 进行精准监听
        this.watcher = watch(this.configPath, {
            persistent: true,
            ignoreInitial: true,
            awaitWriteFinish: {
                stabilityThreshold: 500,
                pollInterval: 100
            }
        });

        // 防抖处理（500ms内多次修改只触发一次）
        let reloadTimer = null;
        this.watcher.on('change', (path) => {
            if (reloadTimer) clearTimeout(reloadTimer);

            reloadTimer = setTimeout(() => {
                this.updateCount++;
                this.hexo.log.info(`[ThemeConfig] 检测到配置变更【第 ${this.updateCount} 次】: ${path}`);
                this._loadThemeConfig(callback);
                this.hexo.emit('themeConfig:updated');
                reloadTimer = null;
            }, 500);
        });

        this.hexo.log.info(`[ThemeConfig] 已启动配置文件监听: ${this.configPath}`);
    }

    // 停止监听
    unwatch() {
        if (!this.watcher) return;

        this.watcher.close().then(() => {
            this.hexo.log.info(`[ThemeConfig] 已停止配置文件监听: ${this.configPath}`);
            this.watcher = null;
        });
    }
}

module.exports = ThemeConfig;