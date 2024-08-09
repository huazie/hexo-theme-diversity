# <img src="source/images/diversity.png" width="80" height="80"> Diversity [![Build and Test](https://github.com/huazie/huazie.github.io/actions/workflows/pages.yml/badge.svg)](https://github.com/huazie/huazie.github.io/actions/workflows/pages.yml)
博客多样性，一款多主题自由切换的Hexo主题

[英文说明/English Documentation](README_EN.md)

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

## 更新

执行以下命令，用以更新 **Diversity**。

```
cd themes/diversity
git pull
```

## 配置

### 基础配置

`themes/diversity` 目录下的 `_config.yml` 包含如下配置：

```
title: Diversity

description: 博客多样性，一款多主题自由切换的Hexo主题

image: /images/diversity.png

favicon: /images/diversity.ico

back_image: /images/back.jpg

path:
  landscape: /images/landscape.jpg
  phase: /images/phase.png
  light: /images/light.jpg

source:
  landscape: https://github.com/hexojs/hexo-theme-landscape
  phase: https://github.com/hexojs/hexo-theme-phase
  light: https://github.com/hexojs/hexo-theme-light
```

- **title** - Diversity主题默认标题
- **description** - Diversity主题默认描述
- **image** - 当网页链接被分享到社交平台时显示的图片URL
- **favicon** - Favicon路径【一个小型图标，用于在浏览器的标签页、地址栏或书签栏中标识和区分不同的网站】
- **back_image** - 主题图片翻转后的背景图片
- **path** - 多主题图片路径【主题名 + 图片路径】。 以 `landscape` 主题举例：
  - 如果该图片路径未配置，默认取 `/images/default.png`
- **source** - 主题项目来源【用于主题来源按钮点击跳转】

将 `themes/diversity` 目录下的 `_config.diversity.yml`，添加到你的 **Hexo** 项目根目录

```
themes: [landscape,light,phase]

#ports: [5000,5001,5002]
```

- **themes** - 多主题列表
- **ports** - 多主题服务器端口列表（不配置，默认从4001开始），用于本地 `hexo server` 启动各主题对应的HTTP服务

将 `themes/diversity` 目录下的 `other` 目录中的目录和文件复制或移动到你的 **Hexo** 项目根目录

### 国际化配置

`themes/diversity` 目录下的 `languages` 目录中的 `zh-CN.yml` 包含如下配置：

```yml
menu:
  blog: 博客
  theme: 主题

button:
  theme-default: 设为默认
  cancel-defalut: 取消默认
  theme-redirect: 主题直达
  theme-source: 主题来源

gritter:
  title-theme: 主题【{0}】
  text-configured: 已设置
  text-canceled: 已取消
  text-click-to-jump: 点击跳转

no-theme:
  tip-text: 您还没有设置默认主题！点击下方按钮前往设置
  btn-text: 主题选择

introduction:
  landscape: Hexo 中的一个全新的默认主题，需要 Hexo 2.4 或者 更高的版本。
  phase: 通过 Phase，感受时间流逝，它是 Hexo 最美丽的主题。
  light: Hexo 中的一个简约主题。
```

- **menu** - 导航栏菜单展示名称
- **button** - 主题选择页的按钮文本
- **gritter** - 主题选择页的提示文本
- **no-theme** - 无主题页的文本
- **introduction** - 主题介绍【如果没有配置，则不展示介绍】

### 多主题相关配置

在你的 **Hexo** 项目根目录，添加 **config** 目录，为上述多主题列表中的每个主题添加一个对应主题名的配置目录，

并在该配置目录下添加对应的 `_config.yml` 【直接从你原来项目根目录下的 `_config.yml` 复制一份即可】，形如：

```pre
├─config
│  ├─landscape
│  │  ├─_config.yml
│  ├─light
│  │  ├─_config.yml
│  ├─phase
│  │  ├─_config.yml
```

修改上述各主题配置目录下的 `_config.yml`，以 **landscape** 举例：

``` diff
_config.yml
- url: http://example.com
+ url: http://example.com/landscape

- public_dir: public
+ public_dir: public/landscape

- theme: other-theme
+ theme: landscape
```

在你的 **Hexo** 项目根目录下，我们依旧可以添加不同主题独立的 `_config.[theme].yml` 文件，更多了解请查看官方[《配置》](https://hexo.io/zh-cn/docs/configuration)