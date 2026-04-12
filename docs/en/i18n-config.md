# I18N Configuration

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

page:
  contents: Contents
  back_to_top: Back to Top
  last_updated: "Last updated: %s"

loading-tips:
  comment: Loading comments...

introduction:
  landscape: A brand new default theme for Hexo.
  phase: Feel the flow of time with Phase, the most beautiful theme for Hexo.
  light: A simple theme for Hexo.
```

## Configuration Options

- **menu** - Display name for the navigation bar menu
- **button** - Button Text
- **gritter** - Prompt text on the theme selection page
- **no-theme** - Text for the no theme page
- **page** - Page-related text
- **loading-tips** - Loading prompt text
- **introduction** - Theme introduction [if not configured, then no introduction is displayed]
