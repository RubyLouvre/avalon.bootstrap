var avalon = require("avalon")
require("./percentage.css")

var supportNative = document.createElement("progress") + "" === "[object HTMLProgressElement]"

avalon.component("ms:progress", {
    value: 0,
    max: 100,
    label: "",
    $template: supportNative ? '<progress ms-attr-value="value" ms-attr-max="max" class="progress" ms-text="value"></proress>'   :
            '<div class="progress">' +
            '<span class="progress-bar" ms-css-width="{{value}}%"></span>' +
            '</div>',
    color: "primary", //primary secondary success warning danger 
    $init: function(vm, element){
        vm.label = element.innerHTML
    },
    $dispose: function (vm, element) {
        element.innerHTML = ""
    },
    $ready: function (vm, element) {
        var p = avalon(element.children[0])
        if (vm.color) {
            p.addClass("progress-" + vm.color)
        }
        if (vm.striped) {
            p.addClass("progress-striped")
        }
        if(vm.label.trim()){
           var el = document.createElement("span")
           el.className = "percentage"
           el.innerHTML = vm.label
           element.appendChild(el)
        }
    }
})


module.exports = avalon
// 文档 http://v4-alpha.getbootstrap.com/components/buttons/
// 代码 https://github.com/twbs/bootstrap/blob/v4-dev/dist/js/umd/button.js