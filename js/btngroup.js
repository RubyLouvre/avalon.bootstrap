var avalon = require("avalon")

avalon.component("ms:btngroup", {
    $slot: "content",
    content: "",
    $template: "{{content|html}}",
    size: "", //lg sm xs
    label: "",
    vertical: false,
    $dispose: function (vm, element) {
        element.innerHTML = ""
    },
    $ready: function (vm, element) {
        var btn = avalon(element)
        btn.attr("role", "group")
        if (vm.label)
            btn.attr("aria-label", vm.label)
        if(vm.vertical){
             btn.addClass("btn-group-vertical")
        }else{
             btn.addClass("btn-group")
        }
       
        if (vm.size) {
            btn.addClass("btn-group-" + vm.size)
        }
    }
})


module.exports = avalon
// 文档 http://v4-alpha.getbootstrap.com/components/buttons/
// 代码 https://github.com/twbs/bootstrap/blob/v4-dev/dist/js/umd/button.js