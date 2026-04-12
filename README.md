# <img src="source/images/diversity.png" width="80" height="80"> Diversity [![build and deploy](https://img.shields.io/github/actions/workflow/status/huazie/huazie.github.io/pages.yml?branch=main&label=build%20and%20deploy&logo=github)](https://github.com/huazie/huazie.github.io/actions/workflows/pages.yml) [![NPM version](https://img.shields.io/npm/v/hexo-theme-diversity.svg?style=flat&logo=npm)](https://www.npmjs.com/package/hexo-theme-diversity) [![Hexo version](https://img.shields.io/badge/hexo-%3E=5.3.0-blue?style=flat&logo=hexo)](https://hexo.io) [![license](https://img.shields.io/badge/license-MIT-orange)](https://github.com/huazie/hexo-theme-diversity/blob/main/LICENSE) [![GitHub Repo stars](https://img.shields.io/github/stars/huazie/hexo-theme-diversity?style=flat)](https://github.com/huazie/hexo-theme-diversity/stargazers)
博客多样性，一款多主题自由切换的Hexo主题

[英文说明/English Documentation](README_EN.md)

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

将 `themes/diversity` 目录下的 `_config.diversity.yml`，添加到你的 **Hexo** 项目根目录。

将 `themes/diversity` 目录下的 `other` 目录中的目录和文件复制或移动到你的 **Hexo** 项目根目录。

当然你也可以选择通过项目依赖导入，在 **Hexo** 项目 package.json 文件中添加如下【`x.x.x` 替换为指定版本号】：

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

添加其他主题相关配置，详细说明请查阅 [docs/zh/other-config.md](docs/zh/other-config.md)。

## 更新

执行以下命令，用以更新 **Diversity**。

```
cd themes/diversity
git pull
```

## 配置

### Diversity 主题配置

详细 `Diversity` 主题配置说明，请查阅 [docs/zh/diversity-config.md](docs/zh/diversity-config.md)。

### 国际化配置

详细国际化配置说明，请查阅 [docs/zh/i18n-config.md](docs/zh/i18n-config.md)。

### 多主题相关配置

详细多主题相关配置说明，请查阅 [docs/zh/theme-config.md](docs/zh/theme-config.md)。

## 文档

详细了解，请翻看 **Huazie** 的博客分类之 [博客框架-Hexo](https://blog.huazie.com/diversity/blog/?path=/categories/%E5%8D%9A%E5%AE%A2%E6%A1%86%E6%9E%B6-Hexo/) 中的文章。

## 插件

以下为 Diversity 主题独立出来的 Hexo 插件，欢迎大家使用：

- [hexo-hot-config](https://github.com/huazie/diversity-plugins/tree/main/packages/hexo-hot-config/README.md)  - Hexo 热配置插件，支持实时更新配置
- [hexo-generator-comments](https://github.com/huazie/diversity-plugins/tree/main/packages/hexo-generator-comments/README.md) - Hexo 多评论系统生成插件，支持多种评论系统的集成与切换，提供统一的评论界面。
- [hexo-comments-utterances](https://github.com/huazie/diversity-plugins/tree/main/packages/hexo-comments-utterances/README.md) - Hexo Utterances 评论插件，支持 Utterances 评论系统的集成
- [hexo-comments-gitalk](https://github.com/huazie/diversity-plugins/tree/main/packages/hexo-comments-gitalk/README.md) - Hexo Gitalk 评论插件，支持 Gitalk 评论系统的集成
- [hexo-comments-giscus](https://github.com/huazie/diversity-plugins/tree/main/packages/hexo-comments-giscus/README.md) - Hexo Giscus 评论插件，支持 Giscus 评论系统的集成