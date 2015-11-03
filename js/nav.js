var avalon = require("avalon")
var $ = require("../selector/selector")
require("../transition/transition")

var ClassName = {
    DROPDOWN_MENU: 'dropdown-menu',
    ACTIVE: 'active',
    FADE: 'fade',
    IN: 'in'
};
avalon.component("ms:nav", {
    $slot: "content",
    content: "",
    $replace: true,
    $template: '<ul class="nav">{{content|html}}</ul>',
    $skipArray: ["_element", "type"],
    type: "tabs",
    onShow: avalon.noop,
    onShown: avalon.noop,
    onHide: avalon.noop,
    onHidden: avalon.noop,
    onInit: avalon.noop,
    activeIndex: NaN,
    $ready: function (vm, element) {
        var root = avalon(element)
        vm._element = element
        element["ms-nav-vm"] = vm
        var menu = normailizeMenu(element)
        if(root.hasClass("nav-pills")){
            vm.type = "pills"
        }
        if (/(tabs|pills)/.test(vm.type)) {
            root.addClass("nav-" + vm.type)
        }
        if (vm.type === "tabs") {
            root.attr("role", "tablist")
        }
        if (vm.stacked) {
            root.addClass("nav-stacked")
        }
        var needActive = menu[vm.activeIndex]

        if (needActive) {
            this.show(needActive)
        }
        vm.onInit(vm)
    },
    show: function (elem) {

        var _this = this //切换页面

        if (avalon(elem).hasClass(ClassName.ACTIVE)) {
            return
        }

        var previous = undefined;
        var root = this._element
        var previous = $(".active", root)
        previous = previous[previous.length - 1]

        if (previous) {
            var hideRet = this.onHide.call(this, previous)
        }

        var showRet = this.onShow.call(this, elem)

        if (hideRet === false || showRet === false) {
            return
        }
        var hasToggle = elem.getAttribute("data-toggle")

        if (hasToggle) {

            var id = elem.getAttribute("href", 2) || elem.getAttribute("data-target")
            if (id && id.length > 2 && id.charAt("0") === "#") {
                //target为要打开切换卡面板或下拉菜单
                var target = document.getElementById(id.slice(1))
            }

        }

        this._activate(elem, root)

        var complete = function complete() {
             _this.onHidden.call(_this, elem)
            _this.onShown.call(_this, previous)
        }

        if (target) {
            this._activate(target, target.parentNode, complete)
        } else {
            complete()
        }
    },
    _activate: function (element, container, callback) {
        var active = $(".active", container)[0] //找到已经打开的面板或选中的下拉菜单项
        var hook = avalon.eventHooks.transitionend
        var _this = this
        var transitionend = hook && hook.type
        var isTransitioning = callback && transitionend && (active && avalon(active).hasClass(ClassName.FADE) ||
                Boolean($(".fade", container)[0]))

        var complete = function () {
            _this._transitionComplete(element, active, isTransitioning, callback)
            if (active) {
                avalon.unbind(active, transitionend, complete)
            }
        }


        if (active && isTransitioning) {
            avalon.bind(active, transitionend, complete)
        } else {
            complete()
        }

        if (active) {
            avalon(active).removeClass(ClassName.IN);
        }
    },
    _transitionComplete: function (element, active, isTransitioning, callback) {
        if (active) {
            avalon(active).removeClass(ClassName.ACTIVE);


            active.setAttribute('aria-expanded', false)
        }
        //未处于活动状态的面板或菜单处于激活
        avalon(element).addClass(ClassName.ACTIVE)
        element.setAttribute('aria-expanded', true)

        if (isTransitioning) {
            var reflow = element.offsetWidth
            avalon(element).addClass(ClassName.IN);
        } else {
            avalon(element).removeClass(ClassName.FADE);
        }


        if (callback) {
            callback();
        }
    }



})


function normailizeMenu(elem) {
    var items = $("li", elem), ret = []
    items = items.filter(function (el) {
        return el.parentNode === elem
    }).forEach(function (el) {
        avalon(el).addClass("nav-item")
        var a = el.children[0]
        if (a && a.nodeName === "A") {
            avalon(a).addClass("nav-link")
            if (!a.getAttribute("data-toggle")) {
                a.setAttribute("data-toggle", "tab")
            }
            ret.push(a)
        }
    })
    return ret
}

function delegate(event) {
    var tigger = event.target
    while (tigger && tigger.nodeType === 1) {
        if (avalon(tigger).hasClass("nav-link")) {
            event.preventDefault()
            if (avalon(tigger).hasClass("disabled"))
                return

            var _target = tigger
            while (tigger && tigger.nodeType === 1) {
                var vm = tigger["ms-nav-vm"]
                if (vm) {
                    avalon.components["ms:nav"].show.call(vm, _target)
                    break
                }
                tigger = tigger.parentNode
            }
            break
        }
        tigger = tigger.parentNode
    }
}

avalon(document).bind("click", delegate)

module.exports = avalon


/**
 * 
 * 
 * 声明式(标签化)只是『接口』的一种形式
 * 
 * http://leeluolee.github.io/fequan-netease/#/64
 * 自定义标签是MVVM扫描引擎的激活点之一, 自定义标签+符合一定规则的HTML标签构成组件
 */