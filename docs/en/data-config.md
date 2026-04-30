# Data File Configuration

Diversity theme supports dynamic configuration through data files in the `source/_data` directory, allowing customization without modifying theme code.

## Theme Introduction Configuration

### 1. Create Data Files

Create multilingual data files in the `source/_data` directory, named in the format `{theme}_introduction.{lang}.yml`, for example:

- `diversity_introduction.zh-CN.yml` (Chinese)
- `diversity_introduction.en.yml` (English)

### 2. Data File Content Format

```yml
# theme_name: theme_introduction
landscape: A brand new default theme for Hexo, requiring Hexo 2.4 or higher.
phase: Feel the flow of time with Phase, the most beautiful theme for Hexo.
light: A simple and minimal theme for Hexo.
next: A high quality elegant Hexo theme crafted from scratch with love.
icarus: A simple and modern Hexo theme with modular design.
```

### 3. Priority Explanation

The reading priority for theme introductions is as follows:

1. **Data File** (`source/_data/{theme}_introduction.{lang}.yml`) - Highest priority
2. **Language File** (`languages/{lang}.yml` with `introduction` config) - Secondary priority
3. **Empty String** (if neither is configured) - No introduction displayed

### 4. Quick Sync

Data file templates are included in the theme's `other/source/_data/` directory. Execute the sync command to use them:

```bash
hexo dsync
```

Or use force overwrite mode:

```bash
hexo dsync --force
```

## Navigation Menu Configuration

In addition to theme introductions, navigation menus can also be configured through data files. For details, please refer to the [diversity_menu.yml](../../../other/source/_data/diversity_menu.yml) template file.
