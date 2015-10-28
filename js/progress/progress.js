var avalon = require("avalon")
var supportNative = document.createElement("progress") + "" === "[object HTMLProgressElement]"
avalon.component("ms:progress", {
    value: 0,
    max: 100,
    $template: supportNative ? '<progress ms-attr-value="value" ms-attr-max="max" class="progress" ms-text="value">{{value}}%</proress> ' :
            '<div class="progress">' +
            '<span class="progress-bar" ms-css-width="{{value}}%">{{value}}%</span>' +
            '</div>',
    color: "primary", //primary secondary success warning danger 
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
    }
})


module.exports = avalon
// 文档 http://v4-alpha.getbootstrap.com/components/buttons/
// 代码 https://github.com/twbs/bootstrap/blob/v4-dev/dist/js/umd/button.js