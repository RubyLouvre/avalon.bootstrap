var avalon = require("../focusin/focusin")
//var $ = require("../selector/selector")
require("../transition/transition")

var ClassName = {
    IN: 'in',
    COLLAPSE: 'collapse',
    COLLAPSING: 'collapsing',
    COLLAPSED: 'collapsed'
}
avalon.component("ms:collapse", {
    $slot: "content",
    content: "",
    target: "",
    $toggle: "toggle",
    $element: {},
    $template: "<div>{{content|html}}</div>",
    onShow: avalon.noop,
    onShown: avalon.noop,
    onHide: avalon.noop,
    onHidden: avalon.noop,
    toggle: function () {
        if (avalon(this.$element).hasClass(ClassName.IN)) {
            this.hide()
        } else {
            this.show()
        }
    },
    _getDimension: function () {
        var hasWidth = avalon(this._element).hasClass("width")
        return hasWidth ? "width" : "height"
    },
    $replace: true,
    show: function () {
        var _this = this
        var element = this.$element
        if (this._isTransitioning || avalon(element).hasClass(ClassName.IN)) {
            return
        }
//
//        var actives = undefined;
//        var activesData = undefined;
//
//        if (this._parent) {
//            actives = $('.panel > .in, .panel > .collapsing');
//            if (!actives.length) {
//                actives = null;
//            }
//        }
//
//        if (actives) {
//            if (actives[0]._isTransitioning) {
//                return;
//            }
//        }
        var ret = this.onShow.call(element, this)
        if (ret === false) {
            return
        }
        var dimension = this._getDimension()

        avalon(element).removeClass(ClassName.COLLAPSE).addClass(ClassName.COLLAPSING);

        element.style[dimension] = 0;
        element.setAttribute('aria-expanded', true)
        this._isTransitioning = true
        var hook = avalon.eventHooks.transitionend
        var transtionend = hook && hook.type

        var complete = function complete() {
            avalon(element).removeClass(ClassName.COLLAPSING).
                    addClass(ClassName.COLLAPSE).
                    addClass(ClassName.IN)

            element.style[dimension] = ''
            _this._isTransitioning = false
            _this.onShown.call(element, _this)
            avalon.unbind(element, transtionend, complete)
        }


        if (!transtionend) {
            complete()
            return
        }

        var capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1)
        var scrollSize = 'scroll' + capitalizedDimension;

        avalon.bind(element, transtionend, complete)

        element.style[dimension] = element[scrollSize] + 'px'
    },
    _isTransitioning: false,
    hide: function () {
        var _this = this
        var element = this.$element
        if (this._isTransitioning || !avalon(element).hasClass(ClassName.IN)) {
            return
        }
        var ret = this.onHide.call(element, this)
        if (ret === false) {
            return
        }

        var dimension = this._getDimension()
        var offsetDimension = dimension === "width" ? 'offsetWidth' : 'offsetHeight'

        element.style[dimension] = element[offsetDimension] + 'px'

        var reflow = element.offsetHeight

        avalon(element).addClass(ClassName.COLLAPSING).removeClass(ClassName.COLLAPSE).removeClass(ClassName.IN)

        element.setAttribute('aria-expanded', false)

        this._isTransitioning = true
        var hook = avalon.eventHooks.transitionend
        var transtionend = hook && hook.type
        var complete = function complete() {
            _this._isTransitioning = false
            avalon.unbind(element, transtionend, complete)
            avalon(element).removeClass(ClassName.COLLAPSING).addClass(ClassName.COLLAPSE)
            _this.onHidden.call(element, _this)

        }
        element.style[dimension] = 0

        if (!transtionend) {
            complete()
            return
        }
        avalon.bind(element, transtionend, complete)
    },
    $ready: function (vm, element) {
        element["ms-collapse-vm"] = vm
        vm.$element = element
        var host = avalon(element)
        host.addClass("collapse")
        element.id = vm.target
    }
})

function delegate(event) {
    var button = event.target
    while (button && button.nodeType === 1) {
        if (button.getAttribute("data-toggle") === "collapse") {
            event.preventDefault()
            var id = button.getAttribute("data-target") || button.getAttribute("href", 2)
            if (id && id.length > 1 && id.charAt("0") === "#") {
                id = id.slice(1)
                var el = document.getElementById(id)
                if (el && el["ms-collapse-vm"]) {
                    var vm = el["ms-collapse-vm"]
                    var method = vm.$toggle
                    avalon.components["ms:collapse"][method].call(vm)
                }
            }
            break

        }
        button = button.parentNode
    }
}

avalon(document).bind("click", delegate)

module.exports = avalon
