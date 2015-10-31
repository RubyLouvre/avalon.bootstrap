var avalon = require("avalon")

avalon.component("ms:listgroup", {
    $slot: "content",
    content: "",
    $template: "<ul>{{content|html}}</ul>",
    size: "", //lg sm xs
    $replace: true,
    $init: function (vm, element) {
        if (/^\s*\<a/.test(element.innerHTML)) {
            vm.$template = "<div>{{content|html}}</div>"
        }
    },
    $ready: function (vm, element) {
        var root = avalon(element)
        root.addClass("list-group")
        normailizeMenu(element.childNodes)
    }
})
function normailizeMenu(elems) {
    for (var i = 0, el; el = elems[i++]; ) {
        if (el.nodeType === 1) {
            avalon(el).addClass("list-group-item")
        }
    }
}

module.exports = avalon
// 文档 http://v4-alpha.getbootstrap.com/components/buttons/
// 代码 https://github.com/twbs/bootstrap/blob/v4-dev/dist/js/umd/button.js