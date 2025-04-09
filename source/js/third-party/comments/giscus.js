const loadGiscus = () => {
    const loadingElement = document.getElementById('loading-giscus');
    // 配色方案刷新，重新加载评论
    // 加载提示被隐藏，需要再次显示
    loadingElement.classList.remove('hidden');

    let lang;
    // 加载评论模块
    Diversity.utils.loadComments('.giscus')
        .then(() => {
            lang = config.giscus.lang;
            if (!lang)
                lang = window.navigator.language;
        })
        .then(() => Diversity.utils.getScript(config.giscus.js, {
            attributes: {
                async                   : true,
                crossOrigin             : 'anonymous',
                'data-repo'             : config.giscus.repo,
                'data-repo-id'          : config.giscus.repo_id,
                'data-category'         : config.giscus.category,
                'data-category-id'      : config.giscus.category_id,
                'data-mapping'          : config.giscus.mapping,
                'data-term'             : config.giscus.term,
                'data-strict'           : config.giscus.strict,
                'data-reactions-enabled': config.giscus.reactions_enabled,
                'data-emit-metadata'    : config.giscus.emit_metadata,
                'data-theme'            : Diversity.utils.isDarkMode() ? config.giscus.dark : config.giscus.theme,
                'data-lang'             : lang,
                'data-input-position'   : config.giscus.input_position,
                'data-loading'          : config.giscus.data_loading
            },
            parentNode: document.querySelector('.giscus')
        }));

    // Giscus加载
    window.addEventListener('message', (e) => {
        if (e.data && e.data.giscus) {
            // 检测到Giscus iframe发送了消息，且数据中存在giscus
            // 则认为Giscus评论已加载，隐藏加载提示
            loadingElement.classList.add('hidden');
        }
    });
}

document.addEventListener('page:loaded', loadGiscus);
document.addEventListener('color-scheme:refresh', loadGiscus);