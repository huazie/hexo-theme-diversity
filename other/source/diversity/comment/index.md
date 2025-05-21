---
title: 留言
subTitle: Diversity 主题接入介绍
date: 2024-12-22 19:48:25
updated: 2024-12-22 19:48:25
layout: comment
comments: true
---

[![build and deploy](https://img.shields.io/github/actions/workflow/status/huazie/huazie.github.io/pages.yml?branch=main&label=build%20and%20deploy&logo=github)](https://github.com/huazie/huazie.github.io/actions/workflows/pages.yml) [![Hexo version](https://img.shields.io/badge/hexo-%3E=5.3.0-blue?style=flat&logo=hexo)](https://hexo.io) [![license](https://img.shields.io/badge/license-MIT-orange)](https://github.com/huazie/hexo-theme-diversity/blob/main/LICENSE) [![GitHub Repo stars](https://img.shields.io/github/stars/huazie/hexo-theme-diversity?style=flat)](https://github.com/huazie/hexo-theme-diversity/stargazers)

博客多样性，一款多主题自由切换的 **Hexo** 主题

## 安装

在你的 **Hexo** 项目根目录，执行以下命令，并将 `_config.yml` 中的 `theme` 修改为 `diversity`。

```
git clone --depth 1 https://github.com/huazie/hexo-theme-diversity themes/diversity
```

``` diff
_config.yml
- theme: other-theme
+ theme: diversity
```

接入其他主题，有如下两种方式【查看 `_config.diversity.yml` 中 `themes` 属性配置】：

- 将待接入主题相关的源码下载到项目根目录的 `themes` 目录下，并各自命名，如下所示【其中 `diversity` 是上述所下载的】：
```text
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

