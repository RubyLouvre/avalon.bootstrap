var avalon = require("avalon")
var $ = require("../selector/selector")
avalon.component("ms:panel", {
    $slot: "content",
    content: "",
    $template: "<div>{{content|html}}</div>",
    color: "default", //lg sm xs
    $replace: true,

    $ready: function (vm, element) {
        var root = avalon(element)

        root.addClass("panel")
        root.addClass("panel-" + vm.color)
        normailize(element.childNodes)
        $(".panel-heading > h1, .panel-heading > h2,.panel-heading > h3," +
                ".panel-heading > h4,.panel-heading > h5,.panel-heading > h6",
                element).forEach(function (el) {
            avalon(el).addClass("panel-title")
        })

    }
})
function normailize(elems) {
    var divs = []
    for (var i = 0, el; el = elems[i++]; ) {
        if (el.nodeType === 1 && el.tagName === "DIV") {
            divs.push(el)
        }
    }
    switch (divs.length) {
        case 1:
            avalon(divs[0]).addClass("panel-body")
            break
        case 2:
            avalon(divs[0]).addClass("panel-heading")
            avalon(divs[1]).addClass("panel-body")
            break
        case 3:
            avalon(divs[0]).addClass("panel-heading")
            avalon(divs[1]).addClass("panel-body")
            avalon(divs[2]).addClass("panel-footer")
            break
     //   default:
          //  throw "ms:panel标签最多只允许存在三个元素节点"
    }
}

module.exports = avalon
// 文档 http://v4-alpha.getbootstrap.com/components/buttons/
// 代码 https://github.com/twbs/bootstrap/blob/v4-dev/dist/js/umd/button.js