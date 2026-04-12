# Basic Configuration

## `_config.yml`

The `_config.yml` file located in the `themes/diversity` directory contains the following configuration:

```yml
title: Diversity

description: Blog Diversity, A theme that supports free switching between multiple themes for [Hexo].

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

font:
  western:
    family: 
  chinese:
    family: 
  nav:
    family: 
    size: 
  page:
    family:

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

- **title** - Default Title of Diversity Theme
- **description** - Default Description of Diversity Theme
- **image** - The URL of the image that will be displayed when the web page link is shared on social platforms
- **favicon** - The path to the Favicon [A small icon used to identify and distinguish different websites in the browser's tab, address bar, or bookmark bar]
- **back_image** - Background image after flipping the theme image
- **darkmode** - Dark Mode, Available values: 0 (Off) | 1 (Follow System) | 2（Manual Switching）
- **path** - Multi-theme image paths [Theme Name + Image Path]. Taking the `landscape` theme as an example:
  - If the image path is not configured, it will default to `/images/default.png`.
- **source** - Theme Project Source [For button navigation to the source of the theme]
- **page** - Page Configuration
  - **header_nav_position** - Position of the top navigation bar, Defaults to left if not configured. Available values: `left` | `center` | `right`
  - **blog_scroll_height** - Scroll Height for Blog Page (Unit: `px`)
    - Hide Menu Navigation Bar when Scroll Height is Greater Than or Equal to Configured Height
    - Show Menu Navigation Bar when Scroll Height is Less Than Configured Height
- **back2top** - B2t Configuration
  - **enable** - Whether to enable. Available values: `true` | `false`
  - **enable_scroll_percent** - Whether to enable displaying the scroll percent label in b2t button. Available values: `true` | `false`
  - **scroll_percent** - Minimum scroll percentage to display the b2t button, recommended values: `2` | `3` | `4` | `5`
  - **position** - B2t button position. Available values: `left` | `right`
  - **color** - The color displayed when the mouse hovers over b2t button or the b2t button is touched.
  - **exclude** - Excluded themes do not display the b2t button.
- **font** - Font Configuration (Western fonts prioritized, Chinese fonts as supplement)
  - **western** - Western Font Configuration
    - **family** - Western Font family, Available values: `Arial` | `Helvetica` | `Tahoma` | `Sitka` | `Times New Roman` | `Courier New` | `Verdana` | `Georgia` | `Palatino` | `Garamond` | `Comic Sans MS` | `Trebuchet MS`
      - Single font example: 'Arial' or 'Times New Roman' or "Times New Roman"
      - Multiple fonts example: 'Tahoma, Times New Roman, Courier New' or "Times New Roman, Courier New, Verdana"
  - **chinese** - Chinese Font Configuration
    - **family** - Chinese Font family, Available values: `楷体` | `等线` | `黑体` | `宋体` | `仿宋`
      - Single font example: '楷体' or "楷体"
      - Multiple fonts example: '楷体, 等线, 黑体' or "楷体, 等线, 黑体"
  - **nav** - Navigation bar font configuration
    - **family** - Navigation bar font family. Optional values refer to the Chinese and Western font familys mentioned above.
    - **size** - Navigation bar font size (Example: `1.1em` or `17px`)
  - **page** - Page font configuration
    - **family** - Page font family. Optional values refer to the Chinese and Western font familys mentioned above.
- **comments** - Comment System Configuration
  - **style** - Choose a default display style for comment systems with multiple enabled. Available values: tabs
  - **active** - Choose a comment system to be displayed by default. Available values: `utterances` | `gitalk`
  - **storage** - Enable memory of visitor's selected comment system, Available values: `true` | `false`
  - **lazyload** - Enable Lazy Loading for Comments, Available values: `true` | `false`
  - **nav** - Modify texts or order for navigation elements
    - **`utterances`** - Comment system name (Refer to existing comment system definitions).
      - **text** - Display text for the navigation element [Optional]. Defaults to the comment system name.
      - **order** - Display order of the navigation element (higher numbers appear later).
- **utterances** - Utterances Configuration, For more information: https://utteranc.es
  - **enable** - Whether to enable. Available values: `true` | `false`
  - **loading** - Whether to enable loading indicator, Available values: `true` | `false`
  - **repo** - Github repository owner and name
  - **issue_term** - Issue Matching Rule, Available values: `pathname` | `url` | `title` | `og:title` | `issue number` | `specific term`
    - **`pathname`** - Issue title contains page pathname. Utterances will search for an issue whose title contains the blog post's pathname URL component. If a matching issue is not found, Utterances will automatically create one the first time someone comments on your post.
    - **`url`** - Issue title contains page URL. Utterances will search for an issue whose title contains the blog post's URL. If a matching issue is not found, Utterances will automatically create one the first time someone comments on your post.
    - **`title`** - Issue title contains page title. Utterances will search for an issue whose title contains the blog post's title. If a matching issue is not found, Utterances will automatically create one the first time someone comments on your post.
    - **`og:title`** - Issue title contains page `og:title`，Utterances will search for an issue whose title contains the page's Open Graph title meta. If a matching issue is not found, Utterances will automatically create one the first time someone comments on your post.
    - **`issue number`** - Specific issue number. You configure Utterances to load a specific issue by number. Issues are not automatically created.
    - **`other value`** - Issue title contains specific term. You configure Utterances to search for an issue whose title contains a specific term of your choosing. If a matching issue is not found, Utterances will automatically create one the first time someone comments on your post. The issue's title will be the term you chose.
  - **theme** - Utterances default theme, Available values: `github-light` | `github-dark` | `preferred-color-scheme` | `github-dark-orange` | `icy-dark` | `dark-blue` | `photon-dark` | `boxy-light`
  - **dark** - Utterances dark theme
- **gitalk** - Gitalk Configuration, For more information: https://gitalk.github.io/
  - **enable** - Whether to enable. Available values: `true` | `false`
  - **github_id** - GitHub repo owner
  - **repo** - Repository name to store issues
  - **client_id** - GitHub Application Client ID
  - **client_secret** - GitHub Application Client Secret
  - **admin_user** - GitHub repo owner and collaborators, only these guys can initialize gitHub issues.
  - **distraction_free_mode** - Facebook-like distraction free mode. Available values: `true` | `false`
  - **proxy** - Proxy Address. When the official proxy is not available, you can change it to your own proxy address.
  - **issue_term** - Issue Matching Rule, Available values: `pathname` | `url` | `title` | `issue number`
    - **`pathname`** - Issue's Labels includes the page pathname
    - **`url`** - Issue's Labels includes the page url
    - **`title`** - Issue's Labels includes the page title
    - **`issue number`** - Specific issue number. You configure Gitalk to load a specific issue by number.
  - **language** - Gitalk's display language depends on user's browser or system environment. If you want everyone visiting your site to see a uniform language, you can set a force language value. Available values: `zh-CN` | `zh-TW` | `en` | `es-ES` | `fr` | `ru`
- **giscus** - Giscus Configuration, For more information: https://giscus.app/
  - **enable** - Whether to enable. Available values: `true` | `false`
  - **loading** - Whether to enable loading indicator, Available values: `true` | `false`
  - **repo** - Github repository name, This repo is where the discussions will be linked to.
  - **repo_id** - Github repository id. Users can preview the `<script>` content by entering their repository details on [giscus.app](https://giscus.app/)
  - **category** - Github discussion category. When searching for a matching discussion, giscus will only search in this category. Available values: `Announcements` | `General` | `Ideas` | `Polls` | `Q&A` | `Show and tell`
  - **category_id** - Github discussion category id. Users can view the `<script>` content by selecting a Discussion category on [giscus.app](https://giscus.app/)
  - **mapping** - Page ↔️ Discussions Mapping Rules, Available values: `pathname` | `url` | `title` | `og:title` | `specific`
    - **`pathname`** - Discussion title contains page pathname. Giscus will search for a discussion whose title contains the page's pathname URL component.
    - **`url`** - Discussion title contains page URL. Giscus will search for a discussion whose title contains the page's URL.
    - **`title`** - Discussion title contains page `<title>`. Giscus will search for a discussion whose title contains the page's `<title>` HTML tag.
    - **`og:title`** - Discussion title contains page og:title. Giscus will search for a discussion whose title contains the page's `<meta property="og:title">` HTML tag.
    - **`specific`** - Specifically designated to be used in conjunction with the term configuration property.
  - **term** - When `mapping` is set to `specific`, the `term` property is required and must be configured as follows:
    - Discussion title contains a specific term.
    - Specific discussion number. This option does not support automatic discussion creation.
  - **strict** - Whether to use strict title matching. Avoid mismatches due to GitHub's fuzzy searching method when there are multiple discussions with similar titles. Available values: 0 | 1
  - **reactions_enabled** - Whether to enable reactions for the main post. The reactions for the discussion's main post will be shown before the comments. Available values: 0 | 1
  - **emit_metadata** - Whether to emit discussion metadata. Discussion metadata will be sent periodically to the parent window (the embedding page).
  - **theme** - Giscus default theme, Available values: `light` | `light_high_contrast` | `light_protanopia` | `light_tritanopia` | `dark` | `dark_high_contrast` | `dark_protanopia` | `dark_tritanopia` | `dark_dimmed` | `preferred_color_scheme` | `transparent_dark` | `noborder_light` | `noborder_dark` | `noborder_gray` | `cobalt` | `purple_dark`
  - **dark** - Giscus dark theme
  - **lang** - The interface language of the comment section (displayed text). If not configured, it defaults to `window.navigator.language`. Available values: `zh-CN` | `zh-TW` | `en` | `es-ES` | `fr` | `ru`
  - **input_position** - Comment input position, Available values:
    - **`bottom`** - The comment input box will be placed below the comments
    - **`top`** - The comment input box will be placed above the comments, so that users can leave a comment without scrolling to the bottom of the discussion.
  - **data_loading** - Load the comments lazily. Loading of the comments will be deferred until the user scrolls near the comments container. This is done by adding loading="lazy" to the `<iframe>` element.

## `_config.diversity.yml`

```yml
themes: [landscape,light,phase]

#ports: [5000,5001,5002]
```

- **themes** - Multi-theme List
- **ports** - A list of multi-theme server ports (not configured, default starting from 4001), used for locally starting HTTP services corresponding to each theme with `hexo server`.