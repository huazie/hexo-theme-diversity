# 国际化配置

`themes/diversity` 目录下的 `languages` 目录中的 `zh-CN.yml` 包含如下配置：

```yml
menu:
  blog: 博客
  theme: 主题
  comment: 留言

button:
  theme-default: 设为默认
  cancel-default: 取消默认
  theme-redirect: 主题直达
  theme-source: 主题来源
  back-to-top: 返回顶部

gritter:
  title-theme: 主题【{0}】
  text-configured: 已设置
  text-canceled: 已取消
  text-click-to-jump: 点击跳转

no-theme:
  tip-text: 您还没有设置默认主题！点击下方按钮前往设置
  btn-text: 主题选择

page:
  contents: 目录
  back_to_top: 回到顶部
  last_updated: 上次更新：%s

loading-tips:
  comment: 评论正在加载中...

introduction:
  landscape: Hexo 中的一个全新的默认主题，需要 Hexo 2.4 或者 更高的版本。
  phase: 通过 Phase，感受时间流逝，它是 Hexo 最美丽的主题。
  light: Hexo 中的一个简约主题。
  next: NexT 是一个高质量且优雅的 Hexo 主题。它从零开始，用心打造。
```

> 主题介绍（introduction）是各接入主题的兜底文案：若 `source/_data` 下的数据文件未配置某主题介绍，则回退读取此处 i18n。数据文件可覆盖或扩展本段，优先级为：语言数据文件 > 旧格式数据文件 > 本 i18n。详见 [data-config.md](data-config.md)。

## 配置项说明

- **menu** - 导航栏菜单展示名称【兜底文案，未配置时回退为菜单 key】。支持通过数据文件覆盖与扩展，详细说明请查阅 [data-config.md](data-config.md)。
- **button** - 按钮文本
- **gritter** - 主题选择页的提示文本
- **no-theme** - 无主题页的文本
- **page** - 页面相关文本
- **loading-tips** - 加载提示文本
- **introduction** - 主题介绍【兜底文案，未配置时回退为空，不展示介绍】。支持通过数据文件覆盖与扩展，详细说明请查阅 [data-config.md](data-config.md)。
