# <img src="source/images/diversity.png" width="80" height="80"> Diversity [![build and deploy](https://img.shields.io/github/actions/workflow/status/huazie/huazie.github.io/pages.yml?branch=main&label=build%20and%20deploy&logo=github)](https://github.com/huazie/huazie.github.io/actions/workflows/pages.yml) [![Hexo version](https://img.shields.io/badge/hexo-%3E=5.3.0-blue?style=flat&logo=hexo)](https://hexo.io) [![license](https://img.shields.io/badge/license-MIT-orange)](https://github.com/huazie/hexo-theme-diversity/blob/main/LICENSE) [![GitHub Repo stars](https://img.shields.io/github/stars/huazie/hexo-theme-diversity?style=flat)](https://github.com/huazie/hexo-theme-diversity/stargazers)
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

接入其他主题，有如下两种方式【查看 `_config.diversity.yml` 中 `themes` 属性配置】：

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

## 更新

执行以下命令，用以更新 **Diversity**。

```
cd themes/diversity
git pull
```

## 配置

### 基础配置

`themes/diversity` 目录下的 `_config.yml` 包含如下配置：

```yml
title: Diversity

description: 博客多样性，一款多主题自由切换的Hexo主题

image: /images/diversity.png

favicon: /images/diversity.ico

back_image: /images/back.jpg

darkmode: 0

path:
  landscape: /images/landscape.jpg
  phase: /images/phase.png
  light: /images/light.jpg

source:
  landscape: https://github.com/hexojs/hexo-theme-landscape
  phase: https://github.com/hexojs/hexo-theme-phase
  light: https://github.com/hexojs/hexo-theme-light

page:
  header_nav_position: 
  blog_scroll_height: 200

back2top:
  enable: true
  enable_scroll_percent: false
  scroll_percent: 5
  position: right
  color: "#fc6423"
  exclude: [next]

comments:
  style: tabs
  active:
  storage: true
  lazyload: false
  nav:
    #utterances:
    #  text: Utterances
    #  order: 0
    #gitalk:
    #  order: 1

utterances:
  enable: false
  loading: true
  repo: user-name/repo-name
  issue_term: pathname
  theme: github-light
  dark: github-dark

gitalk:
  enable: false
  github_id: 
  repo: 
  client_id: 
  client_secret: 
  admin_user: 
  distraction_free_mode: true
  proxy: https://cors-anywhere.azm.workers.dev/https://github.com/login/oauth/access_token
  issue_term: pathname
  language:

giscus:
  enable: false
  loading: true
  repo: your-username/your-repo-name
  repo_id: 
  category: 
  category_id: 
  mapping: pathname
  term: 
  strict: 0
  reactions_enabled: 1
  emit_metadata: 0
  theme: light
  dark: dark
  lang: 
  input_position: bottom
  data_loading: lazy
```

- **title** - Diversity主题默认标题
- **description** - Diversity主题默认描述
- **image** - 当网页链接被分享到社交平台时显示的图片URL
- **favicon** - Favicon路径【一个小型图标，用于在浏览器的标签页、地址栏或书签栏中标识和区分不同的网站】
- **back_image** - 主题图片翻转后的背景图片
- **darkmode** - 深色模式，可选值： 0（关闭） | 1（跟随系统）| 2（手动切换）
- **path** - 多主题图片路径【主题名 + 图片路径】。 以 `landscape` 主题举例：
  - 如果该图片路径未配置，默认取 `/images/default.png`
- **source** - 主题项目来源【用于主题来源按钮点击跳转】
- **page** - 页面配置
  - **header_nav_position** - 顶部导航栏位置【不配置，默认靠左】，可选值：`left`（靠左）| `center`（居中）| `right`（靠右）
  - **blog_scroll_height** - 博客页滚动高度【单位：`px`】
    - 滚动页面高度大于等于配置高度，隐藏菜单导航栏
    - 滚动页面高度小于配置高度，显示菜单导航栏
- **back2top** - 返回顶部按钮配置
  - **enable** - 是否启用，可选值： `true` | `false`
  - **enable_scroll_percent** - 返回顶部按钮中是否启用展示滚动百分比，可选值： `true` | `false`
  - **scroll_percent** - 展示返回顶部按钮的最少滚动百分比，建议值： `2` | `3` | `4` | `5`
  - **position** - 返回顶部按钮展示位置，可选值： `left` | `right`
  - **color** - 鼠标悬浮或用户触摸时，返回顶部按钮的内容所展示的颜色
  - **exclude** - 被排除主题，配置中的主题不展示返回顶部按钮
- **comments** - 评论系统配置
  - **style** - 多个评论系统启用时，选择一个默认展示风格。可选值：tabs 【选项卡】 
  - **active** - 选择一个默认显示的评论系统。可选值：`utterances` | `gitalk`
  - **storage** - 是否记住访客选择的评论系统，可选值： `true` | `false`。设置为 `true` 意味着记住访客选择的评论系统。
  - **lazyload** - 是否懒加载评论系统，可选值： `true` | `false`
  - **nav** - 调整导航元素的展示文本或顺序
    - **`utterances`** - 评论系统名，参考各评论系统定义即可
      - **text** - 导航元素的展示文本【选填】，默认为评论系统名
      - **order** - 导航元素的展示顺序【数字越大，展示越靠后】
- **utterances** - Utterances 配置，更多信息查看：https://utteranc.es
  - **enable** - 是否启用，可选值： `true` | `false`
  - **loading** - 是否启用加载提示，可选值：`true` | `false`
  - **repo** - GitHub仓库所有者和名称
  - **issue_term** - 指定issue的匹配规则，可选值： `pathname` | `url` | `title` | `og:title` | `issue number` | `specific term`
    - **`pathname`** - issue标题包含页面路径名。Utterances 会搜索标题包含页面路径名的issue。如果未找到匹配的议题，当有人首次发表评论时，Utterances 将自动创建一个。
    - **`url`** - issue标题包含页面URL。Utterances 会搜索标题包含页面URL 的issue。如果未找到匹配的议题，当有人首次发表评论时，Utterances 将自动创建一个。
    - **`title`** - issue标题包含页面标题。Utterances 会搜索标题包含页面标题的issue。如果未找到匹配的议题，当有人首次发表评论时，Utterances 将自动创建一个。
    - **`og:title`** - issue标题包含页面 `og:title`。Utterances 会搜索标题包含页面 Open Graph 标题元数据的issue。如果未找到匹配的议题，当有人首次发表评论时，Utterances 将自动创建一个。
    - **`issue number`** - 特定issue编号。您可以通过该编号配置 Utterances 以加载特定issue。不会自动创建issue。
    - **`specific term`** - issue标题包含特定术语。您可以配置 Utterances 以搜索标题包含您配置的特定术语的issue。如果未找到匹配的议题，当有人首次发表评论时，Utterances 将自动创建一个，且该issue的标题将是您设置的术语。
  - **theme** - Utterances 默认主题，可选值： `github-light` | `github-dark` | `preferred-color-scheme` | `github-dark-orange` | `icy-dark` | `dark-blue` | `photon-dark` | `boxy-light`
  - **dark** - Utterances 深色主题
- **gitalk** - Gitalk 配置，更多信息查看：https://gitalk.github.io/
  - **enable** - 是否启用，可选值： `true` | `false`
  - **github_id** - GitHub 仓库所有者
  - **repo** - 用于存储评论issues的 GitHub 仓库名
  - **client_id** - GitHub 应用客户端 ID
  - **client_secret** - GitHub 应用客户端密钥
  - **admin_user** - GitHub 仓库所有者和协作者，只有这些人可以创建 GitHub issues。
  - **distraction_free_mode** - 类似 Facebook 的免打扰模式，可选值： `true` | `false`
  - **proxy** - 代理地址。当官方代理不可用时，您可以将其更改为自己的代理地址。
  - **issue_term** - 指定issue的匹配规则，可选值： `pathname` | `url` | `title` | `issue number`
    - **`pathname`** - issue的标签包含页面路径名。
    - **`url`** - issue的标签包含页面URL。
    - **`title`** - issue的标签包含页面标题。
    - **`issue number`** - 特定issue编号。您可以通过该编号配置 Gitalk 以加载特定issue。
  - **language** - Gitalk 的显示语言取决于用户的浏览器或系统环境。如果您希望所有访问您网站的用户看到统一的语言，您可以设置一个强制语言值。 可选值：`zh-CN` | `zh-TW` | `en` | `es-ES` | `fr` | `ru`
- **giscus** - Giscus 配置，更多信息查看：https://giscus.app/
  - **enable** - 是否启用，可选值： `true` | `false`
  - **loading** - 是否启用加载提示，可选值：`true` | `false`
  - **repo** - GitHub 仓库名称【格式：用户名/仓库名】，指定评论数据存储在哪个 GitHub 仓库的 Discussions 中。
  - **repo_id** - GitHub 仓库的唯一ID。用户可以在 https://giscus.app/ 填写仓库后查看`<script>`内容。
  - **category** - GitHub Discussions 分类名称。将评论归类到特定讨论板块，方便管理。可选值： `Announcements` | `General` | `Ideas` | `Polls` | `Q&A` | `Show and tell`
  - **category_id** - Discussions 分类的唯一 ID。用户可以在 https://giscus.app/ 选择Discussion 分类后查看`<script>`内容。
  - **mapping** - 指定GitHub discussion的匹配规则，可选值： `pathname` | `url` | `title` | `og:title` | `specific`
    - **`pathname`** - Discussion 的标题包含页面的 pathname。giscus 将查找标题中包含页面 URL 的 pathname 部分的 discussion。
    - **`url`** - Discussion 的标题包含页面的 URL。giscus 将查找标题中包含页面 URL 的 discussion。
    - **`title`** - Discussion 的标题包含页面的 `<title>`。giscus 将查找标题中包含页面的 `<title>` 标签的 discussion。
    - **`og:title`** - Discussion 的标题包含页面的 og:title。giscus 将查找标题中包含页面的 `<meta property="og:title">`标签的 discussion。
    - **`specific`** - 特别指定，需要搭配 **term** 配置属性使用。
  - **term** - 指定GitHub discussion的匹配值，当 mapping 为 `specific` 时，该值必须配置，如下：
    - Discussion 的标题包含特定字符串
    - 特定 Discussion 号
  - **strict** - 是否启用严格的标题匹配。当有多个具有相似标题的讨论时，避免由于 GitHub 的模糊搜索方法而导致的不匹配。可选值: 0（关闭）| 1（启用）
  - **reactions_enabled** - 是否启用主帖子上的反应。启用后，Discussion 的主帖子上的反应将会显示在评论前。可选值：0（关闭）| 1（启用）
  - **emit_metadata** - 是否输出 discussion 的元数据。Discussion 的元数据将定期被发送到父页面（被嵌入的页面）。
  - **theme** - Giscus 默认主题，可选值：`light` | `light_high_contrast` | `light_protanopia` | `light_tritanopia` | `dark` | `dark_high_contrast` | `dark_protanopia` | `dark_tritanopia` | `dark_dimmed` | `preferred_color_scheme` | `transparent_dark` | `noborder_light` | `noborder_dark` | `noborder_gray` | `cobalt` | `purple_dark`
  - **dark** - Giscus 深色主题
  - **lang** - 评论区的语言（界面文本）。如果配置为空，则取 `window.navigator.language`。 可选值：`zh-CN` | `zh-TW` | `en` | `es-ES` | `fr` | `ru`
  - **input_position** - 评论输入框的位置，可选值：
    - **`bottom`** - 将评论输入框固定在页面的底部（评论列表下方）
    - **`top`** - 将评论输入框固定在页面的顶部（评论列表上方）
  - **data_loading** - 懒加载评论。评论的加载将延迟到用户滚动到评论容器附近。 这是通过将 loading="lazy" 添加到 `<iframe>` 元素来完成的。

将 `themes/diversity` 目录下的 `_config.diversity.yml`，添加到你的 **Hexo** 项目根目录

```yml
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
  comment: 留言

button:
  theme-default: 设为默认
  cancel-defalut: 取消默认
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
```

- **menu** - 导航栏菜单展示名称
- **button** - 按钮文本
- **gritter** - 主题选择页的提示文本
- **no-theme** - 无主题页的文本
- **page** - 页面相关文本
- **loading-tips** - 加载提示文本
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

针对不同主题，可在各自配置中启用分类和标签生成配置
```yml
category_generator:
  enable_index_page: true
  layout: category-index
  per_page: 10
  order_by: -date
```

- **category_generator** - 分类生成配置
  - **enable_index_page** - `true` 【启用分类首页生成, 通常是 `/categories/index.html`]
  - **layout** - 分类首页布局。 如果不配置，则默认为 `category-index`
  - **per_page** - 每页展示条数
  - **order_by** - 默认按日期降序排列（新到旧）

```yml
tag_generator:
  enable_index_page: true
  layout: tag-index
  per_page: 100
  order_by: -date
```

- **tag_generator** - 标签生成配置
  - **enable_index_page** - `true` 【启用标签首页生成, 通常是 `/tags/index.html`]
  - **layout** - 标签首页布局。 如果不配置，则默认为 `tag-index`
  - **per_page** - 每页展示条数
  - **order_by** - 默认按日期降序排列（新到旧）

## 文档

详细了解，请翻看 **Huazie** 的博客分类之 [博客框架-Hexo](https://blog.huazie.com/diversity/blog/?path=/categories/%E5%8D%9A%E5%AE%A2%E6%A1%86%E6%9E%B6-Hexo/) 中的文章。