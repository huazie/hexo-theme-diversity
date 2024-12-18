document.addEventListener('page:loaded', () => {
    // 加载评论模块
    Diversity.utils.loadComments('.utterances-container')
        .then(() => Diversity.utils.getScript('https://utteranc.es/client.js', {
            attributes: {
                async: true,
                crossOrigin: 'anonymous',
                'repo': config.utterances.repo,
                'issue-term': config.utterances.issue_term,
                'theme': config.utterances.theme
            },
            parentNode: document.querySelector('.utterances-container')
        }));
});