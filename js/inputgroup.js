var avalon = require("avalon")

avalon.component("ms:inputgroup", {
    $slot: "content",
    content: "",
    $template: "{{before|html}}{{content|html}}{{after|html}}",
    size: "", //lg sm xs
    before: "",
    after: "",
    beforebtn: false,
    afterbtn: false,
    $dispose: function (vm, element) {
        element.innerHTML = ""
    },
    $ready: function (vm, element) {
        var btn = avalon(element)
        var input = element.getElementsByTagName("input")[0]
        if (input) {
            avalon(input).addClass("form-control")
        }

        if (vm.after) {
            if (!vm.afterbtn) {
                vm.afterbtn = /^\<(ms\:button|button)/.test(vm.after)
            }
            if (vm.afterbtn) {
                if (!/input-group-btn/.test(vm.after)) {
                    vm.after = '<span class="input-group-btn">' + vm.after + '</span>'
                }
            } else {
                if (!/input-group-addon/.test(vm.after)) {
                    vm.after = '<span class="input-group-addon">' + vm.after + '</span>'
                }
            }
        }
        if (vm.before) {
            if (!vm.beforebtn) {
                vm.beforebtn = /^\<(ms\:button|button)/.test(vm.before)
            }
            if (vm.beforebtn) {
                if (!/input-group-btn/.test(vm.before)) {
                    vm.before = '<span class="input-group-btn">' + vm.before + '</span>'
                }
            } else {
                if (!/input-group-addon/.test(vm.before)) {
                    vm.before = '<span class="input-group-addon">' + vm.before + '</span>'
                }
            }
        }

        btn.addClass("input-group")
        if (vm.size) {
            btn.addClass("input-group-" + vm.size)
        }
    }
})


module.exports = avalon
// 文档 http://v4-alpha.getbootstrap.com/components/buttons/
// 代码 https://github.com/twbs/bootstrap/blob/v4-dev/dist/js/umd/button.js