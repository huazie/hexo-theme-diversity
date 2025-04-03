const loadGitalk = () => {
    let gitalkId;
    let number = -1;
    // 加载评论模块
    Diversity.utils.loadComments('.gitalk-container')
        .then(() => Diversity.utils.getScript(config.gitalk.js, {
            condition: window.Gitalk
        }))
        .then(() => {
            let issueTerm = config.gitalk.issue_term;
            if (issueTerm === 'pathname') 
                gitalkId = window.location.pathname;
            else if (issueTerm === 'url')
                gitalkId = window.location.href;
            else if (issueTerm === 'title')
                gitalkId = window.document.title;
            else if (Diversity.validate.test('pNum', issueTerm)) {
                number = parseInt(issueTerm, 10);
            }
        })
        .then(() => {
            if (gitalkId)
                Diversity.log("GitHub issue label is [" + gitalkId + "]");
            let confgObj = {
                clientID: config.gitalk.client_id,
                clientSecret: config.gitalk.client_secret,
                repo: config.gitalk.repo,
                owner: config.gitalk.github_id,
                admin: [config.gitalk.admin_user],
                id: gitalkId,
                labels: [],
                number: number,
                proxy: config.gitalk.proxy,
                distractionFreeMode: config.gitalk.distraction_free_mode
            }
            if (config.gitalk.language)
                confgObj.language = config.gitalk.language;
            const gitalk = new Gitalk(confgObj);
            gitalk.render(document.querySelector('.gitalk-container'));
        });
}

document.addEventListener('page:loaded', loadGitalk);
document.addEventListener('color-scheme:refresh', loadGitalk);