/* 
 * https://github.com/jamesflorentino/nanoScrollerJS
 */
var avalon = require("avalon")
require("!style!css!sass!./scrollbar.scss");

var isIE7 = document.documentMode === 7 || /msie 7./i.test(window.navigator.appVersion)
var transform = avalon.cssName('transform')
var hasTransform = typeof transform === "string"
var activeVm = null
var allVm = []
var rAF = window.requestAnimationFrame
var cAF = window.cancelAnimationFrame
function getBrowserScrollbarWidth() {
    var outer, outerStyle, scrollbarWidth;
    outer = document.createElement('div');
    outerStyle = outer.style;
    outerStyle.position = 'absolute';
    outerStyle.width = '100px';
    outerStyle.height = '100px';
    outerStyle.overflow = "scroll";
    outerStyle.top = '-9999px';
    document.body.appendChild(outer);
    scrollbarWidth = outer.offsetWidth - outer.clientWidth;
    document.body.removeChild(outer);
    return scrollbarWidth;
}

function isFFWithBuggyScrollbar() {
    var isOSXFF, ua, version;
    ua = window.navigator.userAgent;
    isOSXFF = /(?=.+Mac OS X)(?=.+Firefox)/.test(ua);
    if (!isOSXFF) {
        return false;
    }
    version = /Firefox\/\d{2}\./.exec(ua);
    if (version) {
        version = version[0].replace(/\D+/g, '');
    }
    return isOSXFF && +version > 23;
}
var BROWSER_SCROLLBAR_WIDTH = 0
avalon.component("ms:scrollbar", {
    iOSNativeScrolling: false,
    preventPageScrolling: false,
    disableResize: false,
    alwaysVisible: false,
    flashDelay: 1500,
    sliderMinHeight: 20,
    sliderMaxHeight: null,
    $slot: "__content",
    $replace: true,
    $template: '<div class="nano">' +
            '<div class="nano-content">{{__content|html}}</div>' +
            '<div class="nano-pane"><div class="nano-slider"></div></div>' +
            '</div>',
    __content: "",
    position: 0, //top, bottom, #id, number
    isBeingDragged: false,
    sliderHeight: 0,
    sliderY: 0,
    contentScrollTop: 0,
    previousPosition: 0,
    prevScrollTop: NaN,
    maxSliderTop: 0,
    contentHeight: 0,
    paneHeight: 0,
    paneOuterHeight: 0,
    paneTop: 0,
    stopped: 0,
    onScrolling: avalon.noop, //需要用户重写
    onScrollEnd: avalon.noop, //需要用户重写
    onScrollTop: avalon.noop, //需要用户重写
    $dispose: function (vm, element) {
        element["ms-scrollar-vm"] = null
        avalon.Array.remove(allVm, vm)
    },
    $ready: function (vm, element) {
        if (!BROWSER_SCROLLBAR_WIDTH) {
            BROWSER_SCROLLBAR_WIDTH = getBrowserScrollbarWidth()
        }
        //  avalon.scan(element, vm)
        vm._element = element
        console.log(vm.__content)
        element["vm-scrollbar-vm"] = vm
        avalon.Array.ensure(allVm, vm)
        var children = element.children
        for (var i = 0, el; el = children[i++]; ) {
            if (/nano\-content/.test(el.className)) {
                vm.content = avalon(el)
            } else if (/nano\-pane/.test(el.className)) {
                vm.pane = avalon(el)
            }
        }
        vm.slider = vm.pane && avalon(vm.pane[0].getElementsByTagName("div")[0])
        vm.content.tabIndex = vm.tabIndex || -1
        if (vm.iOSNativeScrolling && element.style.WebkitOverflowScrolling != null) {
            vm.nativeScrolling()
        } else {
            vm.generate()
        }
        function switchPosition(value) {
            if (vm.isActive) {
                if (isFinite(value)) {
                    value = +value
                    if (value < 0) {
                        vm.scrollTop(vm.contentHeight - vm.content.height() - value)
                    } else {
                        vm.scrollTop(value)
                    }

                } else if (value.charAt(0) === "#") {
                    var el = document.getElementById(value.slice(1))
                    if (el && avalon.contains(element, el)) {
                        vm.scrollTop(el.offsetTop)
                    }
                } else if (value === "top") {
                    vm.scrollTop(value)
                } else if (value === "bottom") {
                    vm.scrollTop(vm.contentHeight - vm.content.height())
                }
            }

        }

        vm.$watch("position", switchPosition)

        switchPosition(vm.position)


        if (!vm.iOSNativeScrolling) {
            vm.slider.bind("mousedown", function (e) {
                vm.onSliderMouseDown(e)
            });
            vm.pane.bind("mousedown", function (e) {
                vm.onSliderMouseDown(e)
            });
            String("scroll,mousewheel").replace(/\w+/g, function (method) {
                vm.pane.bind(method, function (e) {
                    vm.onPaneWheel(e)
                })

            })
        }

        String("scroll,mousewheel,touchmove").replace(/\w+/g, function (method) {
            vm.content.bind(method, function (event) {
                vm.onContentScroll(event)
            })
        })

        vm.reset()
    },
    scrollTop: function (offsetY) {
        if (!this.isActive) {
            return;
        }
        this.content.scrollTop(+offsetY)
        this.onPaneWheel()

        this.stop().restore();
        return this;
    },
    reset: function () {
        if (!this.pane) {//如果没有生成滚动器的容器...
            this.generate().stop()
        }

        if (this.iOSNativeScrolling) {
            this.contentHeight = this.content[0].scrollHeight
            return
        }
        if (this.stopped) {
            this.restore()
        }
        var root = avalon(this._element)
        var content = this.content[0];
        var contentStyle = content.style;
        var contentStyleOverflowY = contentStyle.overflowY
        var isScrolling = contentStyleOverflowY === "scroll"
        if (isIE7) {
            this.content.css({
                height: this.content.height()
            })
        }

        var contentHeight = content.scrollHeight + BROWSER_SCROLLBAR_WIDTH
        var parentMaxHeight = parseInt(root.css("max-height"), 10);
        if (parentMaxHeight > 0) {
            root.height("");
            root.height(content.scrollHeight > parentMaxHeight ?
                    parentMaxHeight : content.scrollHeight);
        }

        var paneHeight = this.pane.outerHeight();
        var paneTop = parseInt(this.pane.css('top'), 10);
        var paneBottom = parseInt(this.pane.css('bottom'), 10);
        var paneOuterHeight = paneHeight + paneTop + paneBottom;
        var sliderHeight = Math.round(paneOuterHeight / contentHeight * paneHeight);
        if (sliderHeight < this.sliderMinHeight) {
            sliderHeight = this.sliderMinHeight;
        } else if ((this.sliderMaxHeight != null) && sliderHeight > this.sliderMaxHeight) {
            sliderHeight = this.sliderMaxHeight;
        }
        if (isScrolling && contentStyle.overflowX !== "scroll") {
            sliderHeight += BROWSER_SCROLLBAR_WIDTH;
        }
        this.maxSliderTop = paneOuterHeight - sliderHeight
        this.contentHeight = contentHeight
        this.paneHeight = paneHeight
        this.paneOuterHeight = paneOuterHeight
        this.sliderHeight = sliderHeight
        this.paneTop = paneTop
        this.slider.height(sliderHeight)
        this.scroll()
        this.pane[0].style.display = ""
        this.isActive = true
        //如果容器完全显示里面的容器,并且没设置scroll
        if ((content.scrollHeight === content.clientHeight) ||
                (this.pane.outerHeight(true) >= content.scrollHeight &&
                        !isScrolling)) {
            this.pane[0].style.display = "none"
            this.isActive = false;
        } else if (root[0].clientHeight === content.scrollHeight &&
                isScrolling) {
            this.slider[0].style.display = "none"
        } else {
            this.slider[0].style.display = ""
        }
        this.pane.css({
            opacity: (this.alwaysVisible ? 1 : ''),
            visibility: (this.alwaysVisible ? 'visible' : '')
        })
        var contentPosition = this.content.css('position');
        if (contentPosition === 'static' || contentPosition === 'relative') {
            var right = parseInt(this.content.css('right'), 10);
            if (right) {
                this.$content.css({
                    right: '',
                    marginRight: right
                })
            }
        }
        return this

    },
    setOnScrollStyles: function () {
        var cssValue;
        if (hasTransform) {
            cssValue = {};
            cssValue[transform] = "translate(0, " + this.sliderTop + "px)";
        } else {
            cssValue = {
                top: this.sliderTop
            };
        }
        if (rAF) {
            if (cAF && this.scrollRAF) {
                cAF(this.scrollRAF);
            }
            var _this = this
            this.scrollRAF = rAF(function () {
                _this.scrollRAF = null;
                return _this.slider.css(cssValue)
            })
        } else {
            this.slider.css(cssValue);
        }
    },
    updateScrollValues: function () {
        var content, direction;
        content = this.content[0];
        this.maxScrollTop = content.scrollHeight - content.clientHeight;
        this.prevScrollTop = this.contentScrollTop || 0;
        this.contentScrollTop = content.scrollTop;
        direction = this.contentScrollTop > this.previousPosition ? "down" :
                this.contentScrollTop < this.previousPosition ? "up" : "same";
        this.previousPosition = this.contentScrollTop;
        if (direction !== "same") {
            this.onScrolling.call(this._element, this, {
                position: this.contentScrollTop,
                maximum: this.maxScrollTop,
                direction: direction
            })
        }
        if (!this.iOSNativeScrolling) {
            this.maxSliderTop = this.paneHeight - this.sliderHeight;
            this.sliderTop = this.maxScrollTop === 0 ? 0 :
                    this.contentScrollTop * this.maxSliderTop / this.maxScrollTop;
        }
    },
    preventScrolling: function (e, direction) {
        if (!this.isActive) {
            return;
        }
        if (direction === "down" && e.wheelDelta > 0 || direction === "up" && e.wheelDelta < 0) {
            e.preventDefault()
        }
    },
    scroll: function () {
        if (!this.isActive) {
            return;
        }
        this.sliderY = Math.max(0, this.sliderY);
        this.sliderY = Math.min(this.maxSliderTop, this.sliderY);
        this.content.scrollTop(this.maxScrollTop * this.sliderY / this.maxSliderTop);
        if (!this.iOSNativeScrolling) {
            this.updateScrollValues();
            this.setOnScrollStyles();
        }
    },
    stop: function () {
        if (cAF && this.scrollRAF) {
            cAF(this.scrollRAF);
            this.scrollRAF = null;
        }
        this.stopped = true;
        if (!this.iOSNativeScrolling) {
            this.pane[0].style.display = "none"
        }
        return this;
    },
    nativeScrolling: function () {
        this.content[0].style.WebkitOverflowScrolling = 'touch'
        this.iOSNativeScrolling = true
        this.isActive = true
    },
    generate: function () {
        var cssRule
        if (BROWSER_SCROLLBAR_WIDTH === 0 && isFFWithBuggyScrollbar()) {
            var currentPadding = parseFloat(this.content.css('padding-right')) || 0
            cssRule = {
                right: -14,
                paddingRight: +currentPadding + 14
            }
        } else if (BROWSER_SCROLLBAR_WIDTH) {
            cssRule = {
                right: -BROWSER_SCROLLBAR_WIDTH
            }
            avalon(this._element).addClass("has-scrollbar")
        }
        if (cssRule) {
            this.content.css(cssRule)
        }
    },
    restore: function () {
        this.stopped = false;
        if (!this.iOSNativeScrolling) {
            this.pane[0].style.display = ""
        }
    },
    onSliderMouseDown: function (e) {
        this.isBeingDragged = true;
        this.offsetY = e.pageY - avalon(this.slider).offset().top
        if (this.slider !== e.target) {
            this.offsetY = 0;
        }
        this.pane.addClass("active")
        activeVm = this
    },
    onPaneMouseDown: function (e) {
        this.sliderY = (e.offsetY || e.layerY) - (this.sliderHeight * 0.5)
        this.scroll()
        this.onSliderMouseDown(e)
    },
    onPaneWeel: function (e) {
        this.sliderY += (e.wheelDelta > 0 ? 1 : -1)
        this.scroll()
    },
    onContentScroll: function (e) {
        this.updateScrollValues()
        if (this.isBeingDragged) {
            return;
        }
        if (!this.iOSNativeScrolling) {
            this.sliderY = this.sliderTop
            this.setOnScrollStyles();
        }
        if (e == null) {
            return;
        }
        if (this.contentScrollTop >= this.maxScrollTop) {
            if (this.preventPageScrolling) {
                this.preventScrolling(e, "down");
            }
            if (this.prevScrollTop !== this.maxScrollTop) {
                this.onScrollEnd.call(this._element, this)
            }
        } else if (this.contentScrollTop === 0) {
            if (this.preventPageScrolling) {
                this.preventScrolling(e, "up");
            }
            if (this.prevScrollTop !== 0) {
                this.onScrollTop.call(this._element, this)
            }
        }
    },
    onMouseUp: function () {// 绑到全局
        this.isBeingDragged = false
        this.pane.removeClass("active")
        activeVm = null
    },
    onMouseMove: function (e) {// 绑到全局
        this.sliderY = e.pageY - avalon(this._element).offset().top -
                this.paneTop - (this.offsetY || this.sliderHeight * 0.5)
        this.scroll()
        if (this.contentScrollTop >= this.maxScrollTop &&
                this.prevScrollTop !== this.maxScrollTop) {
            this.onScrollEnd.call(this._element, this)
        } else if (this.contentScrollTop === 0 && this.prevScrollTop !== 0) {
            this.onScrollTop.call(this._element, this)
        }
    },
    onMouseEnter: function (e) {
        if (!this.isBeingDragged) {
            return
        }
        if ((e.buttons || e.which) !== 1) {
            this.onMouseUp.call(this, arguments)
        }
    }
})

function delegate(event, callback) {
    var target = event.target
    while (target && target.nodeType === 1) {
        var match = (target.className.match(/nano\-(slider|content|pane)/) || [])[1]
        if (match) {
            var el = target
            while (target && target.nodeType === 1) {
                var vm = target["ms-scrollbar-vm"]
                if (vm) {
                    callback(match, el, vm)
                    break
                }
            }
        }
        target = target.parentNode
    }
}

avalon.ready(function () {
   
    var body = document.body


    avalon.bind(document, "mousemove", function (event) {
        if (activeVm) {
            avalon.onMouseMove(event)
        }
    })
    avalon.bind(document, "mouseup", function (event) {
        if (activeVm) {
            activeVm.onMouseUp(event)
        }
    })

    avalon.bind(window, "resize", function () {
        for (var i = 0, vm; vm = allVm[i++]; ) {
            if (!vm.disableResize) {
                vm.onReset()
            }
        }
    })

    avalon.bind(body, "mouseenter", function (event) {
        if (activeVm) {
            activeVm.onMouseEnter(event)
        }
    })
})


module.exports = avalon





