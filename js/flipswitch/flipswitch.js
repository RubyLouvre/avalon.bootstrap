var avalon = require("../focusin/focusin")

var $ = require("../selector/selector")

//http://www.bootstrap-switch.org/
avalon.component("ms:flipswitch", {
    $template: require("text!./flipswitch.html"),
    $replace: true,
    onColor: "primary",
    offColor: "default",
    onText: "ON",
    offText: "OFF",
    labelText: "",
    size: "",
    duplex: "",
    name: "",
    btnWidth: "auto", //如果处理里on, off, label按钮的长度
    disabled: false,
    readonly: false,
    checked: false,
    onChange: avalon.noop,
    onInit: avalon.noop,
    $animateDistance: 0,
    $dragDistance: 0,
    $marginLeft: 0,
    $btnWidth : 0,
    $pageX: 0,
    $dragStart: 0,
    $skipArray: ["$on", "$off", "$label", "_element", "$container", "btnWidth"],
    $ready: function (vm, element, vms) {
        var root = avalon(element)
        this._element = element
        element["ms-flipswitch-vm"] = vm
        this.$container = $(".flipswitch-container", element)[0]
        this.$on = $(".flipswitch-handle-on", element)[0]
        this.$off = $(".flipswitch-handle-off", element)[0]

        this.$label = $(".flipswitch-label", element)[0]
        var input = element.getElementsByTagName("input")[0]
        input.name = vm.name

        if (vm.size) {
            root.addClass("flipswitch-" + vm.size)
        }
        function switchDisabled(a) {
            root.toggleClass("flipswitch-disabled", a)
            input.disabled = a
        }
        function switchReadOnly(a) {
            root.toggleClass("flipswitch-readonly", a)
            input.readonly = a
        }

        function switchChecked(a) {
            input.checked = a
            root.toggleClass("flipswitch-on", a)
            root.toggleClass("flipswitch-off", !a)
            if (a) {
                vm.$container.style.marginLeft = "0px"
                avalon.log("ON", a)
            } else {
                vm.$container.style.marginLeft = (-1 * vm.$animateDistance) + "px"
                avalon.log("OFF", a)
            }
            if (vm.duplex) {
                for (var i = 0, el; el = vms[i++]; ) {
                    if (vm.hasOwnProperty(vm.duplex)) {
                        el[vm.duplex] = a;
                        break
                    }
                }
            }
            avalon.fireDom(input, "change")
            vm.onChange.call(element, vm)
        }
        vm.$watch("disabled", switchDisabled)
        vm.$watch("readonly", switchReadOnly)
        vm.$watch("checked", switchChecked)

        switchDisabled(vm.disabled)
        switchReadOnly(vm.readonly)

        setTimeout(function () {
            vm._width()
            switchChecked(vm.checked)
            vm.onInit(vm)
        })
        function dragstart(e) {
            if (vm.$dragStart || vm.disabled || vm.readonly) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            vm.$dragStart = true
            vm.$pageX = e.pageX || e.touches[0].pageX
            vm.$marginLeft = avalon(vm.$container).css("marginLeft")
            root.removeClass("flipswitch-animate")
        }
        avalon.bind(this.$label, "mousedown", dragstart)
        avalon.bind(this.$label, "touchstart", dragstart)
        avalon.bind(this.$label, "mouseleave", function (e) {
            vm._dragend(e)
        })

    },
    toggleState: function () {
        if (this.disabled || this.readonly) {
            return
        }
        this.checked = !this.checked
    },
    state: function (checked) {
        if (this.disabled || this.readonly) {
            return
        }
        this.checked = checked
    },
    _drag: function (e) {

        if (this.$dragStart) {//确保$dragStart为数字
            e.preventDefault()
            //水平移动距离 ,正数向右移动(开), 负数向左移动(关)
            var difference = this.$dragDistance = (e.pageX || e.touches[0].pageX) - this.$pageX
            if (difference < -this.$btnWidth || difference > 0) {
                return
            }
            avalon(this.$container).css("margin-left", difference)
        }


    },
    _dragend: function (e) {
        var distance = Math.abs(this.$dragDistance)
        console.log(distance)
        if (!this.$dragStart || distance < 10) {
            //如果没有移动，或移动距离太少，还原现场
            console.log("11111111")
            //  avalon(this.$container).css("margin-left", this.$marginLeft)
            avalon(this._element).addClass("flipswitch-animate")
            this.$dragStart = 0
        } else {
            e.preventDefault()
            avalon(this._element).addClass("flipswitch-animate")
            if (!this.checked) {//如果是OFF
                if (distance < this.$animateDistance / 2) {
                    this.checked = true
                } else {
                    this.$container.style.marginLeft = (-1 * this.$animateDistance) + "px"
                }
            } else {//如果原来是ON
                // 如果拖动不正确,则不触发点击事件,也不改变状态,还原之前移动的距离
                if (distance > this.$animateDistance / 2) {
                    this.checked = false
                } else {
                    this.$container.style.marginLeft = "0px"
                }
            }
            this.$dragDistance = 0
            this.$pageX = 0
            this.$marginLeft = 0
            var _this = this
            setTimeout(function () {
                _this.$dragStart = 0
            }, 300)
        }
    },
    _width: function () {
        var btns = [this.$on, this.$off, this.$label]
        btns.forEach(function (el) {
            el.style.width = ""
        })

        var btnWidth = this.btnWidth === "auto" ?
                Math.max(this.$on.offsetWidth, this.$off.offsetWidth) :
                this.btnWidth
        
        var labelWidth = this.$btnWidth = btnWidth
        btns.forEach(function (el) {
            avalon(el).width(btnWidth)
        })

        if (this.btnWidth === "auto") {
            labelWidth = this.$label.offsetWidth
            if (labelWidth > btnWidth) {
                avalon(this.$label).width(labelWidth)
            }
        }
        var total = labelWidth + btnWidth * 2
        var offset = this.$container.offsetWidth

        avalon(this.$container).width(offset);
        var width = btnWidth + labelWidth
        this.$animateDistance = btnWidth - (total - offset)
        avalon(this._element).width(width)
        return width
    }
})
function delegate(event, other) {
    var button = event.target
    while (button && button.nodeType === 1) {
        var vm = button["ms-button-vm"]
        if (vm) {
            if (other) {
                other(button)
            } else {
                event.preventDefault()
                var hasActive = false
                if (button.getAttribute("data-toggle") === "button") {
                    vm.active = !vm.active
                    hasActive = true
                }
                toggleRadios(button, vm, hasActive)
            }
            break
        }
        button = button.parentNode
    }
}

avalon.bind(document, "focusout", function (e) {
    var el = e.target
    while (el && el.nodeName === 1) {
        if (avalon(el).hasClass("flipswitch-focused")) {
            avalon(el).removeClass("flipswitch-focused")
            avalon.fireDom(el, "blur")
            break
        }
        el = el.parentNode
    }
})
function delegate(e, callback) {
    var el = e.target || e.touches[0], vm
    while (el && el.nodeType === 1) {
        if (el.getAttribute("data-toggle")) {
            var trigger = el
            while (el) {
                vm = el["ms-flipswitch-vm"]
                if (vm) {
                    break
                }
                el = el.parentNode
            }
            if (!vm)
                return
            callback(e, trigger, vm)
            break
        }
        el = el.parentNode

    }
}
avalon.bind(document, "click", function (e) {
    delegate(e, function (event, el, vm) {
        var match = el.className.match(/flipswitch\-(handle\-on|handle\-off|label)/) || []
        switch (match[1]) {
            case "handle-on":
                event.preventDefault()
                event.stopPropagation()
                vm.state(false)
                break
            case "handle-off":
                event.preventDefault()
                event.stopPropagation()
                vm.state(true)
                break
            case "label":
                event.stopPropagation()

                if (!vm.$dragStart) {
                    vm.toggleState()
                }
                break
        }
        avalon.fireDom(vm._element, "focus")
        avalon(vm._element).addClass("flipswitch-focused")

    })
})

function labelCallback(e) {
    delegate(e, function (event, el, vm) {
        if (/flipswitch\-label\b/.test(el.className)) {
            switch (e.type) {
                case "mousemove":
                case "touchmove":
                    vm._drag(event)
                    break
                case "mouseup":
                case "touchend":
                    vm._dragend(event)
                    break
            }
        }
    })
}


avalon.bind(document, "mousemove", labelCallback)
avalon.bind(document, "touchmove", labelCallback)
avalon.bind(document, "mouseup", labelCallback)
avalon.bind(document, "touchend", labelCallback)
