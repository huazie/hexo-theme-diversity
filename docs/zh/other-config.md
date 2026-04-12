# 多主题相关配置

在你的 **Hexo** 项目根目录，添加 **config** 目录。

为上述**多主题列表**【查看 `_config.diversity.yml` 中 `themes` 属性配置】中的每个主题添加一个对应主题名的配置目录，

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
