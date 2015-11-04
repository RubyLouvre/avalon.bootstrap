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
    onInit: avalon.noop,
    $skipArray: ["_trigger", "_element"],
    open: false,
    _trigger: {},
    _element: {},
    $dispose: function (vm, element) {
        vm._element = vm._trigger = null
        avalon.Array.remove(dropdowns, vm)
        element["ms-dropdown-vm"] = void 0
        element.innerHTML = ""
    },
    
    $ready: function (vm, element) {
        var trigger = getPrevElement(element)
        if (!trigger) {
            throw "<ms:dropdown>元素前面必须存在元素节点"
        }
        var parent = element.parentNode

        avalon(parent).addClass("dropdown")

        avalon(trigger).addClass("toggle-dropdown").
                attr("data-toggle", "dropdown")
        vm._trigger = trigger
        avalon(element).addClass("dropdown-menu").
                attr("role", "menu")


        element["ms-dropdown-vm"] = vm

        vm._element = element
        if (vm.menuRight) {
            avalon(element).addClass("dropdown-menu-right")
        }

        normailizeMenu(element.childNodes)


        function switchOpen(a) {
            avalon(parent).toggleClass(ClassName.OPEN, a)

            trigger.setAttribute("aria-expanded", a)
            if (a) {
                parent.setAttribute(ClassName.OPEN, true)
            } else {
                parent.removeAttribute(ClassName.OPEN)
            }
        }

        avalon.Array.ensure(dropdowns, vm)
        
        if (avalon(parent).hasClass(ClassName.OPEN)) {
            vm.open = true
        }
        
        switchOpen(vm.open)

        vm.$watch(ClassName.OPEN, switchOpen)
        vm.onInit(vm)

    },
    keydownHandler: function (event) {

        // this可能为trigger或 menu
        if (!/(38|40|27|32)/.test(event.which) || /input|textarea/i.test(event.target.tagName)) {
            return
        }

        event.preventDefault()
        event.stopPropagation()

        if (this.disabled || avalon(this).hasClass(ClassName.DISABLED)) {
            return
        }
        var menu = this
        if (avalon(this).hasClass("toggle-dropdown")) {
            menu = getNextElement(menu)
            if (!menu)
                return
        }

        var vm = menu["ms-dropdown-vm"]
        var isActive = vm.open

        if (!isActive && event.which !== 27 || isActive && event.which === 27) {
            if (event.which === 27) {
                var trigger = vm._trigger
                avalon.fireDom(trigger, "focus")
            }
            avalon.fireDom(this, "click")
            return
        }
        var children = menu.children, items = []
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
    toggle: function () {
        //this 为 trigger
        if (this.disabled || avalon(this).hasClass(ClassName.DISABLED)) {
            return false
        }

        var menu = getNextElement(this)
       
        if (!menu)
            return
        var vm = menu["ms-dropdown-vm"]
        var isActive = vm.open

        avalon.components["ms:dropdown"]._clearMenus(0)
        if (isActive) {
            return false
        }

        if ('ontouchstart' in document.documentElement) {
            // if mobile we use a backdrop because click events don't delegate
            var backdrop = document.createElement('div')
            backdrop.className = ClassName.BACKDROP
            this.parentNode.insertBefore(backdrop, this)
            avalon(backdrop).bind('click', avalon.components["ms:dropdown"]._clearMenus)
            backdrops.push(backdrop)
        }
        var ret = vm.onShow.call(menu, vm)
        if (ret === false) {
            return false
        }
        this.focus()
        vm.open = true
        vm.onShown.call(menu, vm)

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
            var menu = vm._element

            if (!vm.open) {
                continue
            }
            if (event && event.type === 'click' &&
                    avalon.contains(menu.parentNode, event.target)) {
                continue
            }
            var ret = vm.onHide.call(menu, vm)

            if (ret === false) {
                continue
            }

            vm.open = false

            vm.onHidden.call(menu, vm)

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
function getNextElement(node) {
    node = node.nextSibling
    while (node.nodeType !== 1) {
        node = node.nextSibling
    }
    return node
}

function getPrevElement(node) {
    node = node.previousSibling
    while (node.nodeType !== 1) {
        node = node.previousSibling
    }
    return node
}

function getDropDownParent(target) {
    var parent = target.parentNode
    if (avalon(parent).hasClass("dropdown"))
        return parent
    return null
}

function delegate(event) {
    var target = event.target
    var eventType = event.type
    while (target && target.nodeType === 1) {
        var isTigger = target.getAttribute("data-toggle") === "dropdown"
        var isMenu = /^(menu|listbox)$/.test(target.getAttribute("role"))
        if (eventType === "keydown" && (isTigger || isMenu)) {
            avalon.components["ms:dropdown"].keydownHandler.call(target, event)
            break
        }
        if (eventType === "click" && isTigger) {
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