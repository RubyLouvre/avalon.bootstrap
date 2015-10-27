require("avalon")


avalon.component("ms:button", {
    color: "primary", //primary secondary success warning danger link
    outline: false,
    $slot: "content",
    size: "", //lg sm
    content: "",
    $init: function (vm, element) {
        element.setAttribute("ms-class-12", "disabled:disabled")
    },
    $template: "{{content|html}}",
    block: false, //是否占满一行
    active: false,
    disabled: false,
    $dispose: function (vm, element) {
        element["ms-button-vm"] = void 0
        element.innerHTML = ""
    },
    $ready: function (vm, element) {
        var btn = avalon(element)
        element["ms-button-vm"] = vm
        btn.attr("role", "button")
        btn.addClass("btn")
        if (vm.color) {
            btn.addClass("btn-" + vm.color + (!!vm.outline ? "-outline" : ""))
        }
        if (vm.size) {
            btn.addClass("btn-" + vm.size)
        }
        if (vm.block) {
            btn.addClass("btn-block")
        }
        function activate(a, b) {
            setTimeout(function () {
                btn.toggleClass("active", a)
                var input = element.getElementsByTagName("input")[0]
                input && (input.checked = a)
                element.setAttribute('aria-pressed', a)
                if (!b)
                    avalon.fireDom(element, "change")
            })
        }

        vm.$watch("active", activate)
        activate(!!vm.active, true)

    }
})

function toggleRadios(element) {
    var parent = element.parentNode
    while (parent && parent.nodeType === 1) {
        if (parent.getAttribute("data-toggle") === "buttons") {
            var input = element.getElementsByTagName("input")[0]
            if (input) {
                if (input.type === 'radio') {
                    var all = parent.getElementsByTagName("ms:button")
                    for (var i = 0, el; el = all[i++]; ) {
                        if (el["ms-button-vm"] && el !== element) {
                            el["ms-button-vm"].active = false
                        }
                    }
                }
            }
        }
        parent = parent.parentNode
    }
}
function delegate(event, other) {
    var button = event.target
    while (button && button.nodeType === 1) {
        var vm = button["ms-button-vm"]
        if (vm) {
            if (other) {
                other(button)
            } else {
                event.preventDefault()
                vm.active = !vm.active
                toggleRadios(button)
            }
            break
        }
        button = button.parentNode
    }
}
avalon(document).bind("click", delegate)


avalon.ready(function () {
    var supportFocusin = !!document.body.attachEvent
    if (!supportFocusin) {
        function swap() {
            supportFocusin = true
        }
        var a = document.createElement('a') // create test element
        a.style.visibility = "hidden"
        a.href = "#" // to make it focusable
        a.addEventListener('focusin', swap, false); // bind focusin
        document.body.appendChild(a) // append
        a.focus() // focus
        document.body.removeChild(a) // remove again
    }

    if (!supportFocusin) {
        avalon.log("当前浏览器不支持focusin")
        avalon.each({
            focusin: "focus",
            focusout: "blur"
        }, function (origType, fixType) {
            avalon.eventHooks[origType] = {
                type: fixType,
                phase: true
            }
        })
    }
    avalon(document).bind("focusin", function (event) {
        delegate(event, function (button) {
            avalon(button).addClass("focus")
        })
    })
    avalon(document).bind("focusout", function (event) {
        delegate(event, function (button) {
            avalon(button).removeClass("focus")
        })
    })

})


module.exports = avalon
// 文档 http://v4-alpha.getbootstrap.com/components/buttons/
// 代码 https://github.com/twbs/bootstrap/blob/v4-dev/dist/js/umd/button.js