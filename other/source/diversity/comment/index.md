---
title: 留言
subTitle: Diversity 主题接入介绍
date: 2024-12-22 19:48:25
updated: 2026-04-16 23:54:12
layout: comment
comments: true
---

[![build and deploy](https://img.shields.io/github/actions/workflow/status/huazie/huazie.github.io/pages.yml?branch=main&label=build%20and%20deploy&logo=github)](https://github.com/huazie/huazie.github.io/actions/workflows/pages.yml) [![NPM version](https://img.shields.io/npm/v/hexo-theme-diversity.svg?style=flat&logo=npm)](https://www.npmjs.com/package/hexo-theme-diversity) [![Hexo version](https://img.shields.io/badge/hexo-%3E=5.3.0-blue?style=flat&logo=hexo)](https://hexo.io) [![license](https://img.shields.io/badge/license-MIT-orange)](https://github.com/huazie/hexo-theme-diversity/blob/main/LICENSE) [![GitHub Repo stars](https://img.shields.io/github/stars/huazie/hexo-theme-diversity?style=flat)](https://github.com/huazie/hexo-theme-diversity/stargazers)

博客多样性，一款多主题自由切换的 **Hexo** 主题

## 安装

### 1. 接入Diversity主题

在你的 **Hexo** 项目根目录，执行以下命令，并将 `_config.yml` 中的 `theme` 修改为 `diversity`。

```
git clone --depth 1 https://github.com/huazie/hexo-theme-diversity themes/diversity
```

``` diff
_config.yml
- theme: other-theme
+ theme: diversity
```

**同步 Diversity 主题配置和资源**

你可以采用如下三种方式：

1. 手动同步【不推荐】

将 `themes/diversity` 目录下的 `_config.diversity.yml`，添加到你的 **Hexo** 项目根目录。

将 `themes/diversity` 目录下的 `other` 目录中的目录和文件复制或移动到你的 **Hexo** 项目根目录。

2. 执行 `hexo server` 命令后同步 `_config.diversity.yml` 配置和 `other` 目录内容。【推荐】

```
# 本地预览时同步【非强制覆盖】
hexo s
# 使用强制覆盖模式
hexo s --force     // 本地预览时强制覆盖已存在文件
hexo s -f          // 本地预览时强制覆盖已存在文件（参数简写）
```

3. 执行 `hexo dsync` 命令专门同步 `_config.diversity.yml` 配置和 `other` 目录内容。【推荐】

```
# 本地直接同步【非强制覆盖】
hexo dsync
# 使用强制覆盖模式：
hexo dsync --force // 本地同步时强制覆盖已存在文件
hexo dsync -f      // 本地同步时强制覆盖已存在文件（参数简写）
```

当然你也可以选择通过项目依赖导入，在 **Hexo** 项目 `package.json` 文件中添加如下【`x.x.x` 替换为指定版本号】：

```json
"dependencies": {
    "hexo-theme-diversity": "^x.x.x"
}
```

### 2. 接入其他主题

有如下两种方式【查看 `_config.diversity.yml` 中 `themes` 属性配置】：

- 将待接入主题相关的源码下载到项目根目录的 `themes` 目录下，并各自命名，如下所示【其中 `diversity` 是上述所下载的】：

```pre
├─themes
│  ├─diversity
│  ├─light
│  ├─phase
```

- 通过项目依赖导入，比如 `landscape` 主题，如下：

```json
"dependencies": {
    "hexo-theme-landscape": "^1.0.0"
}
```

添加其他主题相关配置，详细说明请查阅 [docs/zh/other-config.md](https://github.com/huazie/hexo-theme-diversity/blob/main/docs/zh/other-config.md)。

## 配置

详细了解，请翻看项目 [README](https://github.com/huazie/hexo-theme-diversity/blob/main/README.md) 文件。

## 文档

详细了解，请翻看 **Huazie** 的博客分类之 [博客框架-Hexo](../../diversity/blog/?path=/categories/%E5%8D%9A%E5%AE%A2%E6%A1%86%E6%9E%B6-Hexo/) 中的文章。 

## 版本

详细了解，请查看项目 [Releases](https://github.com/huazie/hexo-theme-diversity/releases)。

## 问题

反馈 **Bug** 或者咨询使用问题，可以

- [Issues](https://github.com/huazie/hexo-theme-diversity/issues)

- [Discussions](https://github.com/huazie/hexo-theme-diversity/discussions)

- 下方留言评论

