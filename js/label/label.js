var avalon = require("avalon")

avalon.component("ms:label", {
    $slot: "content",
    content: "",
    color: "default", //primary success info warning danger
    $template: "<span>{{content|html}}</span>",
    $replace: true,
    pill: false,
    $dispose: function (vm, element) {
        element.innerHTML = ""
    },
    $ready: function (vm, element) {
        var root = avalon(element)
        root.addClass("label")
        root.addClass("label-"+vm.color)
        if(vm.pill){
            root.addClass("label-pill")
        }
    }
})


module.exports = avalon
// 文档 http://v4-alpha.getbootstrap.com/components/buttons/
// 代码 https://github.com/twbs/bootstrap/blob/v4-dev/dist/js/umd/button.js