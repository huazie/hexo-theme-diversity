# 数据文件配置

Diversity 主题支持通过 `source/_data` 目录下的数据文件进行部分配置的动态化，无需修改主题代码即可自定义内容。

## 主题介绍配置

主题介绍支持三层配置，合并优先级从高到低依次为：**语言数据文件 > 旧格式数据文件 > 主题自带 i18n**。

### 1. 语言数据文件（推荐，优先级最高）

在 `source/_data` 目录下创建 `languages` 子目录，按语言各建一个文件，命名格式为 `languages/{lang}.yml`，例如：

- `source/_data/languages/zh-CN.yml`（中文）
- `source/_data/languages/en.yml`（英文）

该文件被 Hexo 加载为 `site.data.languages[lang]`（纯数据文件，**不会**污染主题 i18n）。在 `introduction` 段中**只需写需要覆盖或新增的主题**，其余主题会自动回退到主题自带 i18n。

```yml
# 主题介绍（扩展配置）：只需写需要覆盖或新增的主题
introduction:
  icarus: 一个简洁、现代的 Hexo 主题，具有模块化设计。
```

### 2. 旧格式数据文件（兼容，次优先级）

兼容旧版命名 `{theme}_introduction.{lang}.yml`，例如：

- `diversity_introduction.zh-CN.yml`（中文）
- `diversity_introduction.en.yml`（英文）

```yml
# 主题名: 主题介绍
landscape: Hexo 中的一个全新的默认主题，需要 Hexo 2.4 或者 更高的版本。
phase: 通过 Phase，感受时间流逝，它是 Hexo 最美丽的主题。
light: Hexo 中的一个简约主题。
next: NexT 是一个高质量且优雅的 Hexo 主题。它从零开始，用心打造。
icarus: 一个简洁、现代的 Hexo 主题，具有模块化设计。
```

### 3. 主题自带 i18n（兜底）

若数据文件未配置某主题介绍，则回退读取主题自带语言文件 `themes/diversity/languages/{lang}.yml` 的 `introduction` 段（即 i18n `__('introduction.{theme}')`）。该文件已内置 landscape / phase / light / next 等主题介绍，一般无需修改。

### 4. 优先级说明

主题介绍的合并优先级如下（高 → 低）：

1. **语言数据文件** (`source/_data/languages/{lang}.yml` 的 `introduction` 段) - 最高优先级
2. **旧格式数据文件** (`source/_data/{theme}_introduction.{lang}.yml`) - 次优先级
3. **主题自带 i18n** (`themes/diversity/languages/{lang}.yml` 的 `introduction` 段) - 兜底

### 5. 快速同步

数据文件模板已包含在主题的 `other/source/_data/` 目录下（含 `languages/{lang}.yml` 与 `diversity_introduction.{lang}.yml`），执行同步命令即可：

```bash
hexo dsync
```

或使用强制覆盖模式：

```bash
hexo dsync --force
```

## 导航菜单配置

导航菜单支持配置「路径」与「显示名称」，两者分开配置，合并优先级：**语言数据文件 > 旧格式数据文件 > 主题自带 i18n > 菜单 key**。

### 1. 菜单路径（diversity_menu.yml，无语言区分）

菜单路径在 `source/_data/diversity_menu.yml` 中配置，所有语言共用：

```yml
blog: /diversity/blog/
theme: /diversity/theme/
comment: /diversity/comment/
game: /diversity/game/
```

### 2. 菜单名称（语言数据文件，推荐，优先级最高）

菜单显示名称按语言配置，推荐写入 `source/_data/languages/{lang}.yml` 的 `menu` 段（**只需写需要覆盖或新增的菜单**，其余自动回退主题自带 i18n）：

```yml
# 导航菜单名称：仅配置显示名称，路径在 diversity_menu.yml 中
menu:
  game: 游戏
```

### 3. 旧格式菜单名称（兼容，次优先级）

兼容旧版命名 `diversity_menu.{lang}.yml`，例如 `diversity_menu.zh-CN.yml`：

```yml
# 旧格式：菜单 key: 显示名称
game: 游戏
```

### 4. 优先级说明

菜单显示名称的合并优先级如下（高 → 低）：

1. **语言数据文件** (`source/_data/languages/{lang}.yml` 的 `menu` 段) - 最高优先级
2. **旧格式数据文件** (`source/_data/diversity_menu.{lang}.yml`) - 次优先级
3. **主题自带 i18n** (`themes/diversity/languages/{lang}.yml` 的 `menu` 段，即 `__('menu.{key}')`) - 兜底
4. **菜单 key**（以上均未配置时显示 key 本身） - 最后兜底

### 5. 快速同步

数据文件模板已包含在主题的 `other/source/_data/` 目录下（含 `languages/{lang}.yml` 与 `diversity_menu.yml`），执行同步命令即可：

```bash
hexo dsync
```

或使用强制覆盖模式：

```bash
hexo dsync --force
```

## 开源项目配置

开源项目展示页（`layout: open`）通过数据文件配置项目列表，支持方格 / 列表两种展示模式。

### 1. 数据文件（单文件模式）

在 `source/_data` 目录下创建 `open` 子目录，每个开源项目一个文件，**文件名即 key**，命名格式 `open/{key}.yml`，例如：

- `source/_data/open/hexo-theme-diversity.yml`（key = hexo-theme-diversity）
- `source/_data/open/flea-game.yml`（key = flea-game）

该文件被 Hexo 加载为 `site.data['open/{key}']`。

```yml
# 开源项目配置（单文件模式：文件名即 key，本文件 key = hexo-theme-diversity）
name: Diversity Theme
logo: /images/diversity.svg
source: https://github.com/huazie/hexo-theme-diversity
demo: https://blog.huazie.com
doc: https://github.com/huazie/hexo-theme-diversity#readme
author: Huazie
author_url: https://github.com/huazie
description: Hexo 自定义主题，支持多主题自由切换、明暗模式与 Diversity 统一评论系统。
tags: [Hexo, 主题, JavaScript]
language: JavaScript
license: MIT
order: 1
```

### 2. 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `name` | ✅ | 项目名称 |
| `logo` | - | 项目 Logo 图片路径（未配置时显示名称首字母占位） |
| `source` | - | 源码仓库地址，展示「源码」按钮 |
| `demo` | - | 在线演示地址，展示「演示」按钮 |
| `doc` | - | 文档地址，展示「文档」按钮 |
| `author` | - | 作者 |
| `author_url` | - | 作者主页链接，配置后作者名可点击跳转（新窗口打开） |
| `description` | - | 项目描述（超出两行自动省略，可展开） |
| `tags` | - | 标签列表 |
| `language` | - | 主要开发语言（字符串或数组；配置数组时同一徽章内并列展示多个语言值，标签只出现一次） |
| `license` | - | 开源协议（配置后自动链接到源码仓库的 LICENSE 文件） |
| `license_url` | - | 自定义协议链接地址（覆盖默认 LICENSE 链接） |
| `order` | - | 排序值，数字越小越靠前（未配置按 0 处理） |

### 3. 展示页面

创建 `source/diversity/open/index.md`，指定 `layout: open` 与默认展示模式：

```yml
---
title: 开源项目
layout: open
#display: grid
---
```

`display` 可选值：`grid`（方格） | `list`（列表）。未配置时依次回退主题 `_config.yml` 的 `open.display`、默认 `grid`。

### 4. 快速同步

数据文件模板已包含在主题的 `other/source/_data/open/` 目录下，执行同步命令即可：

```bash
hexo dsync
```

或使用强制覆盖模式：

```bash
hexo dsync --force
```

## 构建排除（ignore 配置）

`themes/diversity/other` 是 Diversity 主题的**同步源目录**：`hexo dsync`（以及 `hexo s` 本地预览）会将其内容整体拷贝到站点根目录——`other/source/*` 复制到 `source/*`、`other/_config.*` 复制到站点根等。它里面**不止数据文件**：除 `source/_data/`（数据文件模板，如 `diversity_menu.yml`、`open/*.yml`、`languages/*.yml`）外，还包含 `source/diversity/` 下的页面 markdown（如 `blog`、`comment`、`open`、`theme` 等独立页）。该目录只用于「同步分发」，本身**不应参与 Hexo 构建**。

### 问题背景

Hexo 主题 i18n 处理器的 pattern 为 `languages/*path`（`*` 在 hexo-util 中等价于 `(.*)?`，可跨目录匹配），会遍历整个主题目录。因此 `themes/diversity/other/source/_data/languages/*.yml` 也会被当作语言文件加载。

这些数据文件模板的 `introduction:` 与 `menu:` 段默认仅有注释，YAML 解析为 `null`。`hexo-i18n` 在 `flattenObject` 中递归到 `null` 子节点时执行 `Object.keys(null)`，会抛出 `TypeError: Cannot convert undefined or null to object`，导致 `hexo g` 构建失败。

> 备注：`other/` 的内容在 `hexo dsync` 后已存在于站点 `source/`，构建时读取的是**同步后的副本**；保留 `other/` 在主题目录内只是作为同步源，必须将其整体排除在构建之外——否则不仅 i18n 处理器会发现它，任何扫描主题目录的处理器都可能误伤。

### 配置方式

在项目根目录 `_config.yml` 的 `ignore` 下排除**整个** `other` 目录（而非某个子目录），避免后续往 `other/` 增删内容时再次踩坑：

```yml
# Hexo 会忽略整个 Hexo 项目下的这些文件夹或文件
ignore:
  # other 目录仅用于同步，不参与构建（否则会被主题 i18n 处理器误当作语言文件读取）
  - '**/themes/diversity/other/**'
```

`ignore` 为全局生效（同时作用于 source box 与 theme box），匹配目录后既不会被扫描，也不会输出到 `public/`。

### 为什么不用 skip_render / include / exclude

- `skip_render`：仅作用于 `source/` 目录下的 asset/post 处理器，且文件仍会原样复制到 `public/`（只是跳过渲染）。它对主题目录（theme box）无效，且本场景需要「彻底不读」。
- `include` / `exclude`：仅作用于 `source/` 目录，无法覆盖 `themes/diversity/other`。
