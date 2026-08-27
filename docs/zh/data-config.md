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

除了主题介绍，还可以通过数据文件配置导航菜单，详情请查阅 [diversity_menu.yml](../../../other/source/_data/diversity_menu.yml) 模板文件。
