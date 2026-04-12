# Multi-Theme Configuration

Add a `config` directory in the root directory of your Hexo project.

For each theme in the aforementioned **multi-theme list** [Check the configuration of the `themes` property in `_config.diversity.yml`], create a configuration directory with the corresponding theme name.

And within that configuration directory, add a corresponding `_config.yml` file (you can simply copy one from the original `_config.yml` located in your project's root directory). The structure would be something like this:

```pre
├─config
│  ├─landscape
│  │  ├─_config.yml
│  ├─light
│  │  ├─_config.yml
│  ├─phase
│  │  ├─_config.yml
```

To modify the `_config.yml` file in each theme's config directory, taking **landscape** as an example:

``` diff
_config.yml
- url: http://example.com
+ url: http://example.com/landscape

- public_dir: public
+ public_dir: public/landscape

- theme: other-theme
+ theme: landscape
```

Within the root directory of your Hexo project, we can still add separate `_config.[theme].yml` files for different themes. For more information, please refer to the official documentation on [Configuration](https://hexo.io/zh-cn/docs/configuration).

For different themes, the generation of category and tag index pages can be enabled in their respective configurations, as shown below:
```yml
category_generator:
  enable_index_page: true
  layout: category-index  
  per_page: 10
  order_by: -date
```

- **category_generator** - Category Generator Config
  - **enable_index_page** - true 【enable category index page, usually `/categories/index.html`]
  - **layout** - Category index page layout. If not configured, the default is `category-index`
  - **per_page** - Categories displayed per page
  - **order_by** - Categories order. Order by descending date (new to old) by default

```yml
tag_generator:
  enable_index_page: true
  layout: tag-index
  per_page: 100
  order_by: -date
```

- **tag_generator** - Tag Generator Config
  - **enable_index_page** - true 【enable tag index page, usually `/tags/index.html`]
  - **layout** - Tag index page layout. If not configured, the default is `tag-index`
  - **per_page** - Tags displayed per page
  - **order_by** - Tags order. Order by descending date (new to old) by default
