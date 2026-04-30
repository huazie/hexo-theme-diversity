# 数据文件配置

Diversity 主题支持通过 `source/_data` 目录下的数据文件进行部分配置的动态化，无需修改主题代码即可自定义内容。

## 主题介绍配置

### 1. 创建数据文件

在 `source/_data` 目录下创建多语言数据文件，命名格式为 `{theme}_introduction.{lang}.yml`，例如：

- `diversity_introduction.zh-CN.yml`（中文）
- `diversity_introduction.en.yml`（英文）

### 2. 数据文件内容格式

```yml
# 主题名: 主题介绍
landscape: Hexo 中的一个全新的默认主题，需要 Hexo 2.4 或者 更高的版本。
phase: 通过 Phase，感受时间流逝，它是 Hexo 最美丽的主题。
light: Hexo 中的一个简约主题。
next: NexT 是一个高质量且优雅的 Hexo 主题。它从零开始，用心打造。
icarus: 一个简洁、现代的 Hexo 主题，具有模块化设计。
```

### 3. 优先级说明

主题介绍的读取优先级如下：

1. **数据文件** (`source/_data/{theme}_introduction.{lang}.yml`) - 最高优先级
2. **语言文件** (`languages/{lang}.yml` 中的 `introduction` 配置) - 次优先级
3. **空字符串**（如果都没有配置）- 不展示介绍

### 4. 快速同步

数据文件模板已包含在主题的 `other/source/_data/` 目录下，执行同步命令即可：

```bash
hexo dsync
```
或使用强制覆盖模式：

```bash
hexo dsync --force
```

## 导航菜单配置

除了主题介绍，还可以通过数据文件配置导航菜单，详情请查阅 [diversity_menu.yml](../../../other/source/_data/diversity_menu.yml) 模板文件。
