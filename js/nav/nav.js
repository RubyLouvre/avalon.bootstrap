var avalon = require("avalon")
var $ = require("../selector/selector")

avalon.component("ms:nav", {
    $slot: "content",
    content: "",
    $replace: true,
    $template: '<ul class="nav">{{content|html}}</ul>',
    $ready: function (vm, element) {
        var root = avalon(element)
        normailizeMenu(element)
        if (/(tabs|pills)/.test(vm.type)) {
            root.addClass("nav-" + vm.type)
        }
        if (vm.stacked) {
            root.addClass("nav-stacked")
        }
    }
})

function normailizeMenu(elem) {
    var items = $("li", elem)
    items = items.filter(function (el) {
        return el.parentNode === elem
    }).forEach(function (el) {
        avalon(el).addClass("nav-item")
        var a = el.children[0]
        if (a && a.nodeName === "A") {
            avalon(a).addClass("nav-link")
        }
    })
}

function delegate(event) {
    var tigger = event.target
    while (tigger && tigger.nodeType === 1) {
        if (/^(tab|pill)$/.test(tigger.getAttribute("data-toggle"))) {
            event.preventDefault()
            while (tigger && tigger.nodeType === 1) {
                var vm = tigger["ms-nav-vm"]
                if (vm) {
                    avalon.components["ms-nav"].show.call(vm)
                    break
                }
                tigger = tigger.parentNode
            }
            break
        }
        tigger = tigger.parentNode
    }
}

avalon(document).bind("click", delegate)

module.exports = avalon


/**
 * 
 * 
 * 声明式(标签化)只是『接口』的一种形式
 * 
 * http://leeluolee.github.io/fequan-netease/#/64
 * 自定义标签是MVVM扫描引擎的激活点之一, 自定义标签+符合一定规则的HTML标签构成组件
 */