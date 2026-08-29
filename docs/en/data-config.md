# Data File Configuration

Diversity theme supports dynamic configuration through data files in the `source/_data` directory, allowing customization without modifying theme code.

## Theme Introduction Configuration

Theme introductions support a three-layer configuration. The merge priority from high to low is: **language data file > legacy data file > theme's own i18n**.

### 1. Language Data File (Recommended, highest priority)

Create a `languages` subdirectory under `source/_data`, with one file per language, named `languages/{lang}.yml`, for example:

- `source/_data/languages/zh-CN.yml` (Chinese)
- `source/_data/languages/en.yml` (English)

Hexo loads this file into `site.data.languages[lang]` (a pure data file that does **NOT** pollute the theme i18n). In the `introduction` section, **only write the themes you want to override or add**; the rest automatically fall back to the theme's own i18n.

```yml
# Theme introduction (extension config): only write themes to override or add
introduction:
  icarus: A simple and modern Hexo theme with modular design.
```

### 2. Legacy Data File (Compatible, secondary priority)

The legacy naming `{theme}_introduction.{lang}.yml` is still supported, for example:

- `diversity_introduction.zh-CN.yml` (Chinese)
- `diversity_introduction.en.yml` (English)

```yml
# theme_name: theme_introduction
landscape: A brand new default theme for Hexo, requiring Hexo 2.4 or higher.
phase: Feel the flow of time with Phase, the most beautiful theme for Hexo.
light: A simple and minimal theme for Hexo.
next: A high quality elegant Hexo theme crafted from scratch with love.
icarus: A simple and modern Hexo theme with modular design.
```

### 3. Theme's Own i18n (Fallback)

If a theme introduction is not configured in any data file, it falls back to the `introduction` section of the theme's own language file `themes/diversity/languages/{lang}.yml` (i.e. i18n `__('introduction.{theme}')`). This file already has built-in introductions for landscape / phase / light / next, and usually needs no modification.

### 4. Priority Explanation

The merge priority for theme introductions is as follows (high → low):

1. **Language data file** (`source/_data/languages/{lang}.yml` `introduction` section) - Highest priority
2. **Legacy data file** (`source/_data/{theme}_introduction.{lang}.yml`) - Secondary priority
3. **Theme's own i18n** (`themes/diversity/languages/{lang}.yml` `introduction` section) - Fallback

### 5. Quick Sync

Data file templates are included in the theme's `other/source/_data/` directory (including `languages/{lang}.yml` and `diversity_introduction.{lang}.yml`). Execute the sync command to use them:

```bash
hexo dsync
```

Or use force overwrite mode:

```bash
hexo dsync --force
```

## Navigation Menu Configuration

Navigation menus support configuring "paths" and "display names" separately. The merge priority is: **language data file > legacy data file > theme's own i18n > menu key**.

### 1. Menu Paths (diversity_menu.yml, language-independent)

Menu paths are configured in `source/_data/diversity_menu.yml`, shared by all languages:

```yml
blog: /diversity/blog/
theme: /diversity/theme/
comment: /diversity/comment/
game: /diversity/game/
```

### 2. Menu Names (language data file, recommended, highest priority)

Menu display names are per-language. It is recommended to write them into the `menu` section of `source/_data/languages/{lang}.yml` (**only write the menus you want to override or add**; the rest automatically fall back to the theme's own i18n):

```yml
# Navigation menu names: only configure display names; paths are in diversity_menu.yml
menu:
  game: Game
```

### 3. Legacy Menu Names (compatible, secondary priority)

The legacy naming `diversity_menu.{lang}.yml` is still supported, e.g. `diversity_menu.en.yml`:

```yml
# Legacy format: menu_key: display_name
game: Game
```

### 4. Priority Explanation

The merge priority for menu display names is as follows (high → low):

1. **Language data file** (`source/_data/languages/{lang}.yml` `menu` section) - Highest priority
2. **Legacy data file** (`source/_data/diversity_menu.{lang}.yml`) - Secondary priority
3. **Theme's own i18n** (`themes/diversity/languages/{lang}.yml` `menu` section, i.e. `__('menu.{key}')`) - Fallback
4. **Menu key** (shown as-is when nothing above is configured) - Last fallback

### 5. Quick Sync

Data file templates are included in the theme's `other/source/_data/` directory (including `languages/{lang}.yml` and `diversity_menu.yml`). Execute the sync command to use them:

```bash
hexo dsync
```

Or use force overwrite mode:

```bash
hexo dsync --force
```

## Open Source Projects Configuration

The open source projects showcase page (`layout: open`) is driven by data files, supporting both grid and list display modes.

### 1. Data File (single-file mode)

Create an `open` subdirectory under `source/_data`, one file per project, **the filename is the key**, named `open/{key}.yml`, e.g.:

- `source/_data/open/hexo-theme-diversity.yml` (key = hexo-theme-diversity)
- `source/_data/open/flea-game.yml` (key = flea-game)

The file is loaded by Hexo as `site.data['open/{key}']`.

```yml
# Open source project config (single-file mode: filename is the key, this file key = hexo-theme-diversity)
name: Diversity Theme
logo: /images/diversity.svg
source: https://github.com/huazie/hexo-theme-diversity
demo: https://blog.huazie.com
doc: https://github.com/huazie/hexo-theme-diversity#readme
author: Huazie
author_url: https://github.com/huazie
description: Hexo custom theme supporting multi-theme switching, dark/light mode and the Diversity unified comment system.
tags: [Hexo, Theme, JavaScript]
language: JavaScript
license: MIT
order: 1
```

### 2. Field Reference

| Field | Required | Description |
|-------|----------|-------------|
| `name` | ✅ | Project name |
| `logo` | - | Logo image path (falls back to a first-letter placeholder when absent) |
| `source` | - | Source repository URL, shows the "Source" button |
| `demo` | - | Online demo URL, shows the "Demo" button |
| `doc` | - | Documentation URL, shows the "Docs" button |
| `author` | - | Author |
| `author_url` | - | Author homepage URL; when set, the author name becomes a clickable link (opens in a new tab) |
| `description` | - | Project description (auto-clamped to two lines, expandable) |
| `tags` | - | Tag list |
| `language` | - | Primary programming language (string or array; an array shows multiple language values inside one badge with a single label) |
| `license` | - | License (links to the LICENSE file of the source repo when set) |
| `license_url` | - | Custom license link URL (overrides the default LICENSE link) |
| `order` | - | Sort value, ascending (treated as 0 when absent) |

### 3. Showcase Page

Create `source/diversity/open/index.md`, specifying `layout: open` and the default display mode:

```yml
---
title: Open Source Projects
layout: open
#display: grid
---
```

`display` available values: `grid` | `list`. When absent, it falls back to `open.display` in the theme's `_config.yml`, then to `grid`.

### 4. Quick Sync

Data file templates are included in the theme's `other/source/_data/open/` directory. Execute the sync command to use them:

```bash
hexo dsync
```

Or use force overwrite mode:

```bash
hexo dsync --force
```

## Build Exclusion (ignore)

`themes/diversity/other` is the Diversity theme's **sync source directory**: `hexo dsync` (and `hexo s` for local preview) copies its contents into the site root — `other/source/*` → `source/*`, `other/_config.*` → site root, etc. It contains **more than just data files**: besides `source/_data/` (data file templates such as `diversity_menu.yml`, `open/*.yml`, `languages/*.yml`), it also holds page markdown under `source/diversity/` (standalone pages like `blog`, `comment`, `open`, `theme`). This directory exists only for "sync distribution" and **must not take part in the Hexo build**.

### Background

The Hexo theme i18n processor uses the pattern `languages/*path` (`*` is equivalent to `(.*)?` in hexo-util and matches across directories), so it walks the entire theme directory. As a result, `themes/diversity/other/source/_data/languages/*.yml` is also loaded as a language file.

In those template data files, the `introduction:` and `menu:` sections are comments only by default, so YAML parses them as `null`. When `hexo-i18n` recurses into a `null` child node in `flattenObject` and calls `Object.keys(null)`, it throws `TypeError: Cannot convert undefined or null to object`, breaking `hexo g`.

> Note: after `hexo dsync`, the contents of `other/` already exist in the site's `source/`; the build reads the **synced copy**. `other/` is kept inside the theme merely as the sync source and must be excluded from the build entirely — otherwise not only i18n but any processor scanning the theme directory could be hit.

### Configuration

In the project root `_config.yml`, exclude the **whole** `other` directory (not just a subfolder), so adding/removing content under `other/` later won't trip the same trap again:

```yml
# Hexo ignores these folders/files across the whole project
ignore:
  # the other/ directory is for sync only and should not be built (otherwise the theme i18n processor misreads it as a language file)
  - '**/themes/diversity/other/**'
```

`ignore` takes effect globally (both the source box and the theme box), so matched directories are neither scanned nor written to `public/`.

### Why not skip_render / include / exclude

- `skip_render`: only affects the asset/post processors under `source/`, and the file is still copied as-is into `public/` (just not rendered). It does not apply to the theme directory (theme box), and this case needs "never read at all".
- `include` / `exclude`: only apply to the `source/` directory and cannot cover `themes/diversity/other`.
