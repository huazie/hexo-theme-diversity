'use strict';

/**
 * 注入到子主题 HTML 页面 </body> 前的路由监听脚本。
 *
 * 子主题在 pjax:complete / load / hashchange 时，
 * 通过 postMessage 向父窗口（diversity）发送路由变化通知。
 *
 * 注意：</script> 字符串用 '<' + '/script>' 拼接，避开 HTML 解析器误判
 */
module.exports =
    '<script>' +
    '(function() {' +
    '    if (window.parent !== window) {' +
    '        if (typeof Pjax !== "undefined") {' +
    '            document.addEventListener("pjax:complete", function() {' +
    '                window.parent.postMessage({ type: "diversity:route-change", path: location.pathname }, "*");' +
    '            });' +
    '        }' +
    '        window.addEventListener("load", function() {' +
    '            window.parent.postMessage({ type: "diversity:route-change", path: location.pathname }, "*");' +
    '        });' +
    '        window.addEventListener("hashchange", function() {' +
    '            window.parent.postMessage({ type: "diversity:route-change", path: location.pathname }, "*");' +
    '        });' +
    '    }' +
    '})();' +
    '<' + '/script>';
