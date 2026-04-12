# <img src="source/images/diversity.png" width="80" height="80"> Diversity [![build and deploy](https://img.shields.io/github/actions/workflow/status/huazie/huazie.github.io/pages.yml?branch=main&label=build%20and%20deploy&logo=github)](https://github.com/huazie/huazie.github.io/actions/workflows/pages.yml) [![NPM version](https://img.shields.io/npm/v/hexo-theme-diversity.svg?style=flat&logo=npm)](https://www.npmjs.com/package/hexo-theme-diversity) [![Hexo version](https://img.shields.io/badge/hexo-%3E=5.3.0-blue?style=flat&logo=hexo)](https://hexo.io) [![license](https://img.shields.io/badge/license-MIT-orange)](https://github.com/huazie/hexo-theme-diversity/blob/main/LICENSE) [![GitHub Repo stars](https://img.shields.io/github/stars/huazie/hexo-theme-diversity?style=flat)](https://github.com/huazie/hexo-theme-diversity/stargazers)
A theme that supports free switching between multiple themes for [Hexo].

## Install

### Integrating Diversity Theme

Execute the following command and modify `theme` in `_config.yml` to `diversity`.

```
git clone --depth 1 https://github.com/huazie/hexo-theme-diversity themes/diversity
```

``` diff
_config.yml
- theme: other-theme
+ theme: diversity
```

Copy the `_config.diversity.yml` located in the `themes/diversity` to the root directory of your Hexo project.

Copy or move the directories and files from the `other` directory within the `themes/diversity` directory to your Hexo project root directory.

Alternatively, you can install the theme as a project dependency. Add the following to your `package.json` (replace `x.x.x` with the desired version):

```json
"dependencies": {
    "hexo-theme-diversity": "^x.x.x"
}
```

### Integrating Other Themes

There are two ways [Check the configuration of the `themes` property in `_config.diversity.yml`]:

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

Add other theme-related configurations. For details, please refer to [docs/en/other-config.md](docs/en/other-config.md).

## Update

Execute the following command to update Diversity.

```
cd themes/diversity
git pull
```

## Configuration

### Diversity Theme Configuration

For detailed configuration of `diversity` theme , please refer to [docs/en/diversity-config.md](docs/en/diversity-config.md).

### Diversity I18N Configuration

For detailed i18n configuration, please refer to [docs/en/i18n-config.md](docs/en/i18n-config.md).

### Multi-Theme Configuration

For detailed multi-theme configuration, please refer to [docs/en/other-config.md](docs/en/other-config.md).

## Documentation

For a detailed understanding, please refer to the articles in the [[Blog Framework - Hexo]](https://blog.huazie.com/diversity/blog/?path=/categories/%E5%8D%9A%E5%AE%A2%E6%A1%86%E6%9E%B6-Hexo/) category on Huazie's blog.

## Plugin

The following are standalone Hexo plugins extracted from the Diversity theme. You are welcome to try them out:

- [hexo-hot-config](https://github.com/huazie/diversity-plugins/tree/main/packages/hexo-hot-config/README.md) - Hexo hot configuration plugin, supporting real-time configuration updates.
- [hexo-generator-comments](https://github.com/huazie/diversity-plugins/tree/main/packages/hexo-generator-comments/README.md) - Hexo multi-comment system generator plugin, supporting integration and switching of multiple comment systems, providing a unified comment interface.
- [hexo-comments-utterances](https://github.com/huazie/diversity-plugins/tree/main/packages/hexo-comments-utterances/README.md) - Hexo Utterances comment plugin, supporting integration of Utterances comment system.
- [hexo-comments-gitalk](https://github.com/huazie/diversity-plugins/tree/main/packages/hexo-comments-gitalk/README.md) - Hexo Gitalk comment plugin, supporting integration of Gitalk comment system.
- [hexo-comments-giscus](https://github.com/huazie/diversity-plugins/tree/main/packages/hexo-comments-giscus/README.md) - Hexo Giscus comment plugin, supporting integration of Giscus comment system.