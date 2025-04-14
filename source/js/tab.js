(function () {
    const storage = config.comments.storage;
    if (!storage) {
        Diversity.data.remove("selected_comment");
    }
    const comment = Diversity.data.get("selected_comment");
    // 访客选择了指定的评论系统且启用了记忆功能
    if (comment) {
        // 获取该评论系统对应的<a>标签
        const element = document.querySelector(`a[data-comment="${comment}"]`);
        $(element).tab('show');
    }

    const navTab = document.getElementById("comment-nav-tab");
    storage && navTab.addEventListener('click', function(event) {
        const target = event.target.closest('a[data-toggle="tab"]');
        if (!target) return;
        // 阻止默认跳转行为
        event.preventDefault();
        // 获取自定义属性值（例如 data-comment）
        const comment = target.dataset.comment;
        // 记住访客选择的评论系统
        if (comment) {
            Diversity.data.set("selected_comment", comment);
        }
    });

})();