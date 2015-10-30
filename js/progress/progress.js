var avalon = require("avalon")
require("./percentage.css")

var supportNative = document.createElement("progress") + "" === "[object HTMLProgressElement]"

avalon.component("ms:progress", {
    value: 0,
    max: 100,
    label: "",
    $template: supportNative ? '<progress ms-attr-value="value" ms-attr-max="max" class="progress" ms-text="value"></proress>' :
            '<div class="progress">' +
            '<span class="progress-bar" ms-css-width="{{value}}%"></span>' +
            '</div>',
    color: "primary", //primary secondary success warning danger 
    $skipArray: ["label"],
    $init: function (vm, element) {
        var fragment = document.createDocumentFragment()
        var n = element.childNodes
        while (n[0])
            fragment.appendChild(n[0])
        vm.label = fragment
    },
    $dispose: function (vm, element) {
        element.innerHTML = ""
    },
    $ready: function (vm, element) {
        var root = avalon(element.children[0])
        if (vm.color) {
            root.addClass("progress-" + vm.color)
        }
        if (vm.striped) {
            root.addClass("progress-striped")
        }
        var el = document.createElement("span")
        el.className = "percentage"
        el.appendChild(vm.label)
        element.appendChild(el)
        function setColor(a) {
            el.style.color = Number(a) > 50 ? "#fff" : "#000"
        }

        vm.$watch("value", setColor)

        setColor(vm.value)



    }
})


module.exports = avalon
// 文档 http://v4-alpha.getbootstrap.com/components/progress/
