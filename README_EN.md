# <img src="source/images/diversity.png" width="80" height="80"> Diversity
A multi-theme that allows for free switching for [Hexo].

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

## Update

Execute the following command to update Diversity.

```
cd themes/diversity
git pull
```

## Config

### Diversity Theme Config

The `_config.yml` file located in the `themes/diversity` directory contains the following configuration:

```
title: Theme Selection

description: This is a theme selection page 

image: /images/diversity.png

favicon: /images/diversity.png

back_image: /images/back.jpg

path:
  landscape: /images/landscape.jpg
  phase: /images/phase.png
  light: /images/light.jpg

source:
  landscape: https://github.com/hexojs/hexo-theme-landscape
  phase: https://github.com/hexojs/hexo-theme-phase
  light: https://github.com/hexojs/hexo-theme-light

introduction:
  landscape: A brand new default theme for Hexo.
  phase: Feel the flow of time with Phase, the most beautiful theme for Hexo.
  light: A simple theme for Hexo.
```

- **title** - The title of the theme selection page
- **description** - The description of the web page
- **image** - The URL of the image that will be displayed when the web page link is shared on social platforms
- **favicon** - The path to the Favicon [A small icon used to identify and distinguish different websites in the browser's tab, address bar, or bookmark bar]
- **back_image** - Background image after flipping the theme image
- **path** - Multi-theme image paths [Theme Name + Image Path]. Taking the `landscape` theme as an example:
  - If the image path is not configured, it will default to `/images/default.png`.
- **source** - Theme Project Source [For button navigation to the source of the theme]
- **introduction** - Theme Introduction

Copy the `_config.diversity.yml` located in the `themes/diversity` to the root directory of your Hexo project.

```
themes: [landscape,light,phase]

#ports: [5000,5001,5002]
```

- **themes** - Multi-theme List
- **ports** - A list of multi-theme server ports (not configured, default starting from 4001), used for locally starting HTTP services corresponding to each theme with `hexo server`.


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

To modify the `_config.yml` file in each theme's directory, taking **landscape** as an example:

``` diff
_config.yml
- url: http://example.com
+ url: http://example.com/landscape

- public_dir: public
+ public_dir: public/landscape

- theme: other-theme
+ theme: landscape
```