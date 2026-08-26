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

In addition to theme introductions, navigation menus can also be configured through data files. For details, please refer to the [diversity_menu.yml](../../../other/source/_data/diversity_menu.yml) template file.
