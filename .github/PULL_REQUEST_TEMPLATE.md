## PR Checklist
<!-- Remove items that do not apply. For completed items, change [ ] to [x] to select (将 [ ] 换成 [x] 来选择) -->

**Please read and check followings before submitting a PR.**

- [ ] Local `hexo g` build passes for all affected instances. <!-- 主实例必验；改动 scripts/ 时按 _config.diversity.yml 的 themes 配置逐个验证子实例（数量不限）；仅改主实例布局/资源时验证主实例即可 -->
- [ ] Added: complete and consistent with the rest of the theme. <!-- 新增可以是任意内容（配置、布局、脚本、数据、文档、i18n 等），按实际需要补齐所有相关位置 -->
- [ ] Changed: all affected parts verified, no regressions. <!-- 变更可以是任意内容，按实际影响面验证，不预先限定范围 -->
- [ ] Removed: no dangling references left anywhere. <!-- 删除可以是任意内容，全仓清理所有残留引用 -->
- [ ] UI: light + dark, desktop + mobile, colors via CSS variables. <!-- UI 改动需验证明暗与桌面/移动端，颜色统一用 var() -->

## PR Type
<!-- What kind of change does this PR introduce?（勾选本次变更类型） -->

- [ ] Bugfix. <!-- 缺陷修复 -->
- [ ] Feature. <!-- 新功能 -->
- [ ] Improvement. <!-- 既有功能改进 -->
- [ ] Code style update (e.g. formatting). <!-- 代码风格调整（如格式化） -->
- [ ] Refactoring (no changes to functionality and APIs). <!-- 重构（不改功能与接口） -->
- [ ] Documentation. <!-- 文档 -->
- [ ] Translation. <!-- 翻译 / 多语言文案 -->
- [ ] Version Upgrade. <!-- 版本升级 -->
- [ ] Other... Please describe: <!-- 其他，请说明 -->

## Description
<!-- What changed and why; attach before/after screenshots for UI changes（改了什么、为什么；UI 改动附前后截图） -->

Closes # <!-- 有关联 issue 填编号，无则删掉本行 -->
