var avalon = require("avalon")
var dropdowns = []
var backdrops = []
var ClassName = {
    BACKDROP: 'dropdown-backdrop',
    DISABLED: 'disabled',
    OPEN: 'open'
}
avalon.component("ms:dropdown", {
    $slot: "content",
    content: "",
    $template: "{{content|html}}",
    onHide: avalon.noop,
    onHidden: avalon.noop,
    onShow: avalon.noop,
    onShown: avalon.noop,
    $skipArray: ["toggleElement", "menuElement"],
    onInit: avalon.noop,
    $init: function(vm){
        vm.onInit(vm)
    },
    $dispose: function (vm, element) {
        avalon.Array.remove(dropdowns, vm)
        element["ms-dropdown-vm"] = void 0
        element.innerHTML = ""
    },
    keydownHandler: function (event) {
        var target = this
        if (!/(38|40|27|32)/.test(event.which) || /input|textarea/i.test(event.target.tagName)) {
            return
        }

        event.preventDefault()
        event.stopPropagation()

        if (target.disabled || avalon(target).hasClass(ClassName.DISABLED)) {//toggleElement
            return
        }
        var parent = getParent(target)
        if (!parent)
            return


        var vm = parent["ms-dropdown-vm"]

        var isActive = avalon(parent).hasClass(ClassName.OPEN)

        if (!isActive && event.which !== 27 || isActive && event.which === 27) {
            if (event.which === 27) {
                var toggle = vm.toggleElement
                avalon.fireDom(toggle, "focus")
            }
            avalon.fireDom(target, "click")
            return
        }
        var children = vm.menuElement.children, items = []
        for (var i = 0, el; el = children[i++]; ) {
            if ((el.offsetWidth || el.offsetHeight) &&
                    !el.disabled &&
                    /\bdropdown\-item\b/.test(el.className) &&
                    !/\disabled\b/.test(el.className)
                    ) {
                items.push(el)
            }
        }


        if (!items.length) {
            return
        }

        var index = items.indexOf(event.target)
        if (!~index) {
            index = 0
        }
        if (event.which === 38) {
            // up
            index--;
            if (index === -1) {
                index = items.length - 1
            }
        }

        if (event.which === 40) {
            // down
            index++
            if (index === items.length) {
                index = 0
            }
        }



        items[index].focus()
    },
    toggle: function (event) {

        if (this.disabled || avalon(this).hasClass(ClassName.DISABLED)) {
            return false
        }
        var parent = getParent(this) //Dropdown._getParentFromElement(this);
        if (!parent || !parent["ms-dropdown-vm"])
            return
        var vm = parent["ms-dropdown-vm"]
        var isActive = vm.open

        avalon.components["ms:dropdown"]._clearMenus(0)
        if (isActive) {
            return false
        }

        if ('ontouchstart' in document.documentElement) {
            // if mobile we use a backdrop because click events don't delegate
            var backdrop = document.createElement('div');
            backdrop.className = ClassName.BACKDROP
            backdrop.parentNode.insertBefore(dropdown, this)
            avalon(backdrop).bind('click', avalon.components["ms:dropdown"]._clearMenus)
            backdrops.push(backdrop)
        }
        var ret = vm.onShow.call(parent, vm)
        if (ret === false) {
            return false
        }
        this.focus()
        avalon.log("又打开")
        vm.open = true
        vm.onShown.call(parent, vm)

    },
    _clearMenus: function (event) {//关闭页面上所有菜单
        if (event && event.which === 3) {//右键
            return;
        }
        if (backdrops.length) {
            var backdrop = backdrops[0]
            backdrop.parentNode.removeChild(backdrop);
        }

        for (var i = 0; i < dropdowns.length; i++) {
            var vm = dropdowns[i]
            var toggle = vm.toggleElement
            var parent = toggle.parentNode

            if (!vm.open) {
                continue
            }
//&& /input|textarea/i.test(event.target.tagName)
            if (event && event.type === 'click' &&
                    avalon.contains(parent, event.target)) {
                continue
            }
            var ret = vm.onHide.call(parent, vm)

            if (ret === false) {
                continue
            }

            vm.open = false

            vm.onHidden.call(parent, vm)

        }
    },
    $ready: function (vm, element) {
        element["ms-dropdown-vm"] = vm

        avalon.Array.ensure(dropdowns, vm)

        var dropdown = avalon(element)
        dropdown.addClass("dropdown")
        dropdown.toggleClass(ClassName.OPEN, vm.open)
        //----------
        var children = element.children, btn, menu
        for (var i = 0, el; el = children[i++]; ) {
            if (/button/i.test(el.nodeName)) {
                btn = avalon(el)
                vm.toggleElement = el
                el.style.position = "absolute"//hack bootstrap v4
            } else if (!menu) {
                normailizeMenu(el.childNodes)
                menu = avalon(el)
                vm.menuElement = el
            }
        }
        if (!btn) {
            avalon.log("必须指定<ms:button>或button")
            return
        }
        btn.addClass("dropdown-toggle")
        btn.attr("data-toggle", "dropdown")
        btn.attr("aria-haspopup", "true")
        vm.$watch(ClassName.OPEN, function (a) {
            dropdown.toggleClass(ClassName.OPEN, a)
            dropdown.attr("aria-expanded", a)
            if (a) {
                element.setAttribute(ClassName.OPEN, true)
            } else {
                element.removeAttribute(ClassName.OPEN)
            }
        })
        //---------------
        menu.attr("role", "menu")
        menu.addClass("dropdown-menu")
        menu.css("top", btn[0].offsetHeight)//hack bootstrap v4

        if (vm.menuRight) {
            menu.addClass("dropdown-menu-right")
        }
    }
})
var rdropdown = /\bdropdown\-(item|divider|header)\b/
function normailizeMenu(elems) {
    for (var i = 0, el; el = elems[i++]; ) {
        if (el.nodeType === 1) {
            if (!rdropdown.test(el.className)) {
                switch (el.nodeName.toLowerCase()) {
                    case "button":
                    case "a":
                        avalon(el).addClass("dropdown-item")
                        break
                    case "div":
                        avalon(el).addClass("dropdown-divider")
                        break
                    case "h1":
                    case "h2":
                    case "h3":
                    case "h4":
                    case "h5":
                    case "h6":
                        avalon(el).addClass("dropdown-header")
                        break
                }
            }
        }
    }
}
function getParent(target) {
    while (target && target.nodeType === 1) {
        if (avalon(target).hasClass("dropdown")) {
            return target
        }
        target = target.parentNode
    }
    return null
}

function delegate(event) {
    var target = event.target
    var eventType = event.type
    while (target && target.nodeType === 1) {
        var isToggle = target.getAttribute("data-toggle") === "dropdown"
        var isMenu = /^(menu|listbox)$/.test(target.getAttribute("role"))
        if (eventType === "keydown" && (isToggle || isMenu)) {
            avalon.components["ms:dropdown"].keydownHandler.call(target, event)
            break
        }
        if (eventType === "click" && isToggle) {
            avalon.components["ms:dropdown"].toggle.call(target, event)
            break
        }
        target = target.parentNode
    }

}
avalon(document).bind("click", delegate)
avalon(document).bind("keydown", delegate)
avalon(document).bind("click", avalon.components["ms:dropdown"]._clearMenus)



module.exports = avalon
// 文档 http://v4-alpha.getbootstrap.com/components/buttons/
// 代码 https://github.com/twbs/bootstrap/blob/v4-dev/dist/js/umd/button.js