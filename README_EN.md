# <img src="source/images/diversity.png" width="80" height="80"> Diversity [![build and deploy](https://img.shields.io/github/actions/workflow/status/huazie/huazie.github.io/pages.yml?branch=main&label=build%20and%20deploy&logo=github)](https://github.com/huazie/huazie.github.io/actions/workflows/pages.yml) [![Hexo version](https://img.shields.io/badge/hexo-%3E=5.3.0-blue?style=flat&logo=hexo)](https://hexo.io) [![license](https://img.shields.io/badge/license-MIT-orange)](https://github.com/huazie/hexo-theme-diversity/blob/main/LICENSE) ![GitHub Repo stars](https://img.shields.io/github/stars/huazie/hexo-theme-diversity?style=flat)
A theme that supports free switching between multiple themes for [Hexo].

## Install

Execute the following command and modify `theme` in `_config.yml` to `diversity`.

```
git clone --depth 1 https://github.com/huazie/hexo-theme-diversity themes/diversity
```

``` diff
_config.yml
- theme: other-theme
+ theme: diversity
```

There are two ways to integrate other themes as follows[Check the configuration of the `themes` property in `_config.diversity.yml`]:

- Download the source code related to the theme to be integrated into the `themes` directory at the root of the project, and name them respectively, as shown below [where `diversity` is the one downloaded as mentioned above]:

```pre
├─themes
│  ├─diversity
│  ├─light
│  ├─phase
```

- Import via project dependencies. For example, for the `landscape` theme, it's as follows:

```json
"dependencies": {
    "hexo-theme-landscape": "^1.0.0"
}
```

## Update

Execute the following command to update Diversity.

```
cd themes/diversity
git pull
```

## Config

### Diversity Theme Config

The `_config.yml` file located in the `themes/diversity` directory contains the following configuration:

```yml
title: Diversity

description: Blog Diversity, A theme that supports free switching between multiple themes for [Hexo].

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

page:
  blog_scroll_height: 200

back2top:
  enable: true
  enable_scroll_percent: false
  scroll_percent: 5
  position: right
  color: "#fc6423"
  exclude: [next]

comments:
  lazyload: false

utterances:
  enable: false
  repo: user-name/repo-name
  issue_term: pathname
  theme: github-light
```

- **title** - Default Title of Diversity Theme
- **description** - Default Description of Diversity Theme
- **image** - The URL of the image that will be displayed when the web page link is shared on social platforms
- **favicon** - The path to the Favicon [A small icon used to identify and distinguish different websites in the browser's tab, address bar, or bookmark bar]
- **back_image** - Background image after flipping the theme image
- **path** - Multi-theme image paths [Theme Name + Image Path]. Taking the `landscape` theme as an example:
  - If the image path is not configured, it will default to `/images/default.png`.
- **source** - Theme Project Source [For button navigation to the source of the theme]
- **page** - Page Configuration
  - **blog_scroll_height** - Scroll Height for Blog Page (Unit: `px`)
    - Hide Menu Navigation Bar when Scroll Height is Greater Than or Equal to Configured Height
    - Show Menu Navigation Bar when Scroll Height is Less Than Configured Height
- **back2top** - B2t Configuration
  - **enable** - Whether to enable. Available values: `true` | `false`
  - **enable_scroll_percent** - Whether to enable displaying the scroll percent label in b2t button. Available values: `true` | `false`
  - **scroll_percent** - Minimum scroll percentage to display the b2t button, recommended values: 2 | 3 | 4 | 5
  - **position** - B2t button position. Available values: `left` | `right`
  - **color** - The color displayed when the mouse hovers over b2t button or the b2t button is touched.
  - **exclude** - Excluded themes do not display the b2t button.
- **comments** - Comment System Configuration
  - **lazyload** - Enable Lazy Loading for Comments, Available values: `true` | `false`
- **utterances** - Utterances Configuration, For more information: https://utteranc.es
  - **enable** - Whether to enable. Available values: `true` | `false`
  - **repo** - Github repository owner and name
  - **issue_term** - Issue Matching Rule, Available values: `pathname` | `url` | `title` | `og:title` | `issue number` | `specific term`
    - **pathname** - Issue title contains page pathname. Utterances will search for an issue whose title contains the blog post's pathname URL component. If a matching issue is not found, Utterances will automatically create one the first time someone comments on your post.
    - **url** - Issue title contains page URL. Utterances will search for an issue whose title contains the blog post's URL. If a matching issue is not found, Utterances will automatically create one the first time someone comments on your post.
    - **title** - Issue title contains page title. Utterances will search for an issue whose title contains the blog post's title. If a matching issue is not found, Utterances will automatically create one the first time someone comments on your post.
    - **og:title** - Issue title contains page `og:title`，Utterances will search for an issue whose title contains the page's Open Graph title meta. If a matching issue is not found, Utterances will automatically create one the first time someone comments on your post.
    - **issue number** - Specific issue number. You configure Utterances to load a specific issue by number. Issues are not automatically created.
    - **other value** - Issue title contains specific term. You configure Utterances to search for an issue whose title contains a specific term of your choosing. If a matching issue is not found, Utterances will automatically create one the first time someone comments on your post. The issue's title will be the term you chose.
  - **theme** - Utterances theme, Available values: `github-light` | `github-dark` | `preferred-color-scheme` | `github-dark-orange` | `icy-dark` | `dark-blue` | `photon-dark` | `boxy-light`

Copy the `_config.diversity.yml` located in the `themes/diversity` to the root directory of your Hexo project.

```yml
themes: [landscape,light,phase]

#ports: [5000,5001,5002]
```

- **themes** - Multi-theme List
- **ports** - A list of multi-theme server ports (not configured, default starting from 4001), used for locally starting HTTP services corresponding to each theme with `hexo server`.

Copy or move the directories and files from the `other` directory within the `themes/diversity` directory to your Hexo project root directory.

### Diversity I18N Config

The `en.yml` file in the `languages` directory under the `themes/diversity` folder contains the following configuration:

```yml
menu:
  blog: Blog
  theme: Theme
  comment: Comment

button:
  theme-default: DEFAULT
  cancel-defalut: CANCEL
  theme-redirect: REDIRECT
  theme-source: SOURCE
  back-to-top: BACK TO TOP

gritter:
  title-theme: Theme [{0}]
  text-configured: Configured
  text-canceled: Cancelled
  text-click-to-jump: Click here

no-theme:
  tip-text: Default theme not set up! Click the button below to configure now.
  btn-text: Theme Select

introduction:
  landscape: A brand new default theme for Hexo.
  phase: Feel the flow of time with Phase, the most beautiful theme for Hexo.
  light: A simple theme for Hexo.
```

- **menu** - Display name for the navigation bar menu
- **button** - Button Text
- **gritter** - Prompt text on the theme selection page
- **no-theme** - Text for the no theme page
- **introduction** - Theme introduction [if not configured, then no introduction is displayed]

### Other Theme Config

Add a `config` directory in the root directory of your Hexo project. 

For each theme in the aforementioned multi-theme list, create a configuration directory with the corresponding theme name.

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

## Documentation

For a detailed understanding, please refer to the articles in the [[Blog Framework - Hexo]](https://blog.huazie.com/diversity/blog/?path=/categories/%E5%8D%9A%E5%AE%A2%E6%A1%86%E6%9E%B6-Hexo/) category on Huazie's blog.