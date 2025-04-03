const loadUtterances = () => {
    const loadingElement = document.getElementById('loading-utterances');
    // 配色方案刷新，重新加载评论
    // 加载提示被隐藏，需要再次显示
    loadingElement.classList.remove('hidden');

    // 加载评论模块
    Diversity.utils.loadComments('.utterances-container')
        .then(() => Diversity.utils.getScript(config.utterances.js, {
            attributes: {
                async: true,
                crossOrigin: 'anonymous',
                'repo': config.utterances.repo,
                'issue-term': config.utterances.issue_term,
                'theme': Diversity.utils.isDarkMode() ? config.utterances.dark : config.utterances.theme
            },
            parentNode: document.querySelector('.utterances-container')
        }));

    // Utterances加载
    window.addEventListener('message', (e) => {
        if (e.data && e.data.type == 'resize') {
            // 检测到Utterances iframe发送了消息，且数据中type为resize，
            // 则认为Utterances评论已加载，隐藏加载提示
            loadingElement.classList.add('hidden');
        }
    });
}

document.addEventListener('page:loaded', loadUtterances);
document.addEventListener('color-scheme:refresh', loadUtterances);