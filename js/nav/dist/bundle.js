/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var avalon = __webpack_require__(1)
	__webpack_require__(2)

	__webpack_require__(4)

	__webpack_require__(7)
	avalon.define({
	    $id: "test"
	})

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*==================================================
	 Copyright (c) 2013-2015 司徒正美 and other contributors
	 http://www.cnblogs.com/rubylouvre/
	 https://github.com/RubyLouvre
	 http://weibo.com/jslouvre/
	 
	 Released under the MIT license
	 avalon.shim.js 1.5.5 built in 2015.10.27
	 support IE6+ and other browsers
	 ==================================================*/
	(function(global, factory) {

	    if (typeof module === "object" && typeof module.exports === "object") {
	        // For CommonJS and CommonJS-like environments where a proper `window`
	        // is present, execute the factory and get avalon.
	        // For environments that do not have a `window` with a `document`
	        // (such as Node.js), expose a factory as module.exports.
	        // This accentuates the need for the creation of a real `window`.
	        // e.g. var avalon = require("avalon")(window);
	        module.exports = global.document ? factory(global, true) : function(w) {
	            if (!w.document) {
	                throw new Error("Avalon requires a window with a document")
	            }
	            return factory(w)
	        }
	    } else {
	        factory(global)
	    }

	// Pass this if window is not defined yet
	}(typeof window !== "undefined" ? window : this, function(window, noGlobal){

	/*********************************************************************
	 *                    全局变量及方法                                  *
	 **********************************************************************/
	var expose = new Date() - 0
	//http://stackoverflow.com/questions/7290086/javascript-use-strict-and-nicks-find-global-function
	var DOC = window.document
	var head = DOC.getElementsByTagName("head")[0] //HEAD元素
	var ifGroup = head.insertBefore(document.createElement("avalon"), head.firstChild) //避免IE6 base标签BUG
	ifGroup.innerHTML = "X<style id='avalonStyle'>.avalonHide{ display: none!important }</style>"
	ifGroup.setAttribute("ms-skip", "1")
	ifGroup.className = "avalonHide"
	var rnative = /\[native code\]/ //判定是否原生函数
	function log() {
	    if (window.console && avalon.config.debug) {
	        // http://stackoverflow.com/questions/8785624/how-to-safely-wrap-console-log
	        Function.apply.call(console.log, console, arguments)
	    }
	}


	var subscribers = "$" + expose

	var stopRepeatAssign = false
	var nullObject = {} //作用类似于noop，只用于代码防御，千万不要在它上面添加属性
	var rword = /[^, ]+/g //切割字符串为一个个小块，以空格或豆号分开它们，结合replace实现字符串的forEach
	var rw20g = /\w+/g
	var rcomplexType = /^(?:object|array)$/
	var rsvg = /^\[object SVG\w*Element\]$/
	var rwindow = /^\[object (?:Window|DOMWindow|global)\]$/
	var oproto = Object.prototype
	var ohasOwn = oproto.hasOwnProperty
	var serialize = oproto.toString
	var ap = Array.prototype
	var aslice = ap.slice
	var W3C = window.dispatchEvent
	var root = DOC.documentElement
	var avalonFragment = DOC.createDocumentFragment()
	var cinerator = DOC.createElement("div")
	var class2type = {}
	"Boolean Number String Function Array Date RegExp Object Error".replace(rword, function (name) {
	    class2type["[object " + name + "]"] = name.toLowerCase()
	})
	function scpCompile(array){
	    return Function.apply(noop,array)
	}
	function noop(){}

	function oneObject(array, val) {
	    if (typeof array === "string") {
	        array = array.match(rword) || []
	    }
	    var result = {},
	            value = val !== void 0 ? val : 1
	    for (var i = 0, n = array.length; i < n; i++) {
	        result[array[i]] = value
	    }
	    return result
	}

	//生成UUID http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
	var generateID = function (prefix) {
	    prefix = prefix || "avalon"
	    return String(Math.random() + Math.random()).replace(/\d\.\d{4}/, prefix)
	}
	function IE() {
	    if (window.VBArray) {
	        var mode = document.documentMode
	        return mode ? mode : window.XMLHttpRequest ? 7 : 6
	    } else {
	        return NaN
	    }
	}
	var IEVersion = IE()

	avalon = function (el) { //创建jQuery式的无new 实例化结构
	    return new avalon.init(el)
	}


	/*视浏览器情况采用最快的异步回调*/
	avalon.nextTick = new function () {// jshint ignore:line
	    var tickImmediate = window.setImmediate
	    var tickObserver = window.MutationObserver
	    if (tickImmediate) {
	        return tickImmediate.bind(window)
	    }

	    var queue = []
	    function callback() {
	        var n = queue.length
	        for (var i = 0; i < n; i++) {
	            queue[i]()
	        }
	        queue = queue.slice(n)
	    }

	    if (tickObserver) {
	        var node = document.createTextNode("avalon")
	        new tickObserver(callback).observe(node, {characterData: true})// jshint ignore:line
	        var bool = false
	        return function (fn) {
	            queue.push(fn)
	            bool = !bool
	            node.data = bool
	        }
	    }


	    return function (fn) {
	        setTimeout(fn, 4)
	    }
	}// jshint ignore:line
	/*********************************************************************
	 *                 avalon的静态方法定义区                              *
	 **********************************************************************/
	avalon.init = function (el) {
	    this[0] = this.element = el
	}
	avalon.fn = avalon.prototype = avalon.init.prototype

	avalon.type = function (obj) { //取得目标的类型
	    if (obj == null) {
	        return String(obj)
	    }
	    // 早期的webkit内核浏览器实现了已废弃的ecma262v4标准，可以将正则字面量当作函数使用，因此typeof在判定正则时会返回function
	    return typeof obj === "object" || typeof obj === "function" ?
	            class2type[serialize.call(obj)] || "object" :
	            typeof obj
	}

	var isFunction = typeof alert === "object" ? function (fn) {
	    try {
	        return /^\s*\bfunction\b/.test(fn + "")
	    } catch (e) {
	        return false
	    }
	} : function (fn) {
	    return serialize.call(fn) === "[object Function]"
	}
	avalon.isFunction = isFunction

	avalon.isWindow = function (obj) {
	    if (!obj)
	        return false
	    // 利用IE678 window == document为true,document == window竟然为false的神奇特性
	    // 标准浏览器及IE9，IE10等使用 正则检测
	    return obj == obj.document && obj.document != obj //jshint ignore:line
	}

	function isWindow(obj) {
	    return rwindow.test(serialize.call(obj))
	}
	if (isWindow(window)) {
	    avalon.isWindow = isWindow
	}
	var enu
	for (enu in avalon({})) {
	    break
	}
	var enumerateBUG = enu !== "0" //IE6下为true, 其他为false
	/*判定是否是一个朴素的javascript对象（Object），不是DOM对象，不是BOM对象，不是自定义类的实例*/
	avalon.isPlainObject = function (obj, key) {
	    if (!obj || avalon.type(obj) !== "object" || obj.nodeType || avalon.isWindow(obj)) {
	        return false;
	    }
	    try { //IE内置对象没有constructor
	        if (obj.constructor && !ohasOwn.call(obj, "constructor") && !ohasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
	            return false;
	        }
	    } catch (e) { //IE8 9会在这里抛错
	        return false;
	    }
	    if (enumerateBUG) {
	        for (key in obj) {
	            return ohasOwn.call(obj, key)
	        }
	    }
	    for (key in obj) {
	    }
	    return key === void 0 || ohasOwn.call(obj, key)
	}
	if (rnative.test(Object.getPrototypeOf)) {
	    avalon.isPlainObject = function (obj) {
	        // 简单的 typeof obj === "object"检测，会致使用isPlainObject(window)在opera下通不过
	        return serialize.call(obj) === "[object Object]" && Object.getPrototypeOf(obj) === oproto
	    }
	}
	//与jQuery.extend方法，可用于浅拷贝，深拷贝
	avalon.mix = avalon.fn.mix = function () {
	    var options, name, src, copy, copyIsArray, clone,
	            target = arguments[0] || {},
	            i = 1,
	            length = arguments.length,
	            deep = false

	    // 如果第一个参数为布尔,判定是否深拷贝
	    if (typeof target === "boolean") {
	        deep = target
	        target = arguments[1] || {}
	        i++
	    }

	    //确保接受方为一个复杂的数据类型
	    if (typeof target !== "object" && !isFunction(target)) {
	        target = {}
	    }

	    //如果只有一个参数，那么新成员添加于mix所在的对象上
	    if (i === length) {
	        target = this
	        i--
	    }

	    for (; i < length; i++) {
	        //只处理非空参数
	        if ((options = arguments[i]) != null) {
	            for (name in options) {
	                src = target[name]
	                try {
	                    copy = options[name] //当options为VBS对象时报错
	                } catch (e) {
	                    continue
	                }

	                // 防止环引用
	                if (target === copy) {
	                    continue
	                }
	                if (deep && copy && (avalon.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {

	                    if (copyIsArray) {
	                        copyIsArray = false
	                        clone = src && Array.isArray(src) ? src : []

	                    } else {
	                        clone = src && avalon.isPlainObject(src) ? src : {}
	                    }

	                    target[name] = avalon.mix(deep, clone, copy)
	                } else if (copy !== void 0) {
	                    target[name] = copy
	                }
	            }
	        }
	    }
	    return target
	}

	function _number(a, len) { //用于模拟slice, splice的效果
	    a = Math.floor(a) || 0
	    return a < 0 ? Math.max(len + a, 0) : Math.min(a, len);
	}
	avalon.mix({
	    rword: rword,
	    subscribers: subscribers,
	    version: 1.55,
	    ui: {},
	    log: log,
	    slice: W3C ? function (nodes, start, end) {
	        return aslice.call(nodes, start, end)
	    } : function (nodes, start, end) {
	        var ret = []
	        var len = nodes.length
	        if (end === void 0)
	            end = len
	        if (typeof end === "number" && isFinite(end)) {
	            start = _number(start, len)
	            end = _number(end, len)
	            for (var i = start; i < end; ++i) {
	                ret[i - start] = nodes[i]
	            }
	        }
	        return ret
	    },
	    noop: noop,
	    /*如果不用Error对象封装一下，str在控制台下可能会乱码*/
	    error: function (str, e) {
	        throw (e || Error)(str)
	    },
	    /*将一个以空格或逗号隔开的字符串或数组,转换成一个键值都为1的对象*/
	    oneObject: oneObject,
	    /* avalon.range(10)
	     => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
	     avalon.range(1, 11)
	     => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	     avalon.range(0, 30, 5)
	     => [0, 5, 10, 15, 20, 25]
	     avalon.range(0, -10, -1)
	     => [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
	     avalon.range(0)
	     => []*/
	    range: function (start, end, step) { // 用于生成整数数组
	        step || (step = 1)
	        if (end == null) {
	            end = start || 0
	            start = 0
	        }
	        var index = -1,
	                length = Math.max(0, Math.ceil((end - start) / step)),
	                result = new Array(length)
	        while (++index < length) {
	            result[index] = start
	            start += step
	        }
	        return result
	    },
	    eventHooks: {},
	    /*绑定事件*/
	    bind: function (el, type, fn, phase) {
	        var hooks = avalon.eventHooks
	        var hook = hooks[type]
	        if (typeof hook === "object") {
	            type = hook.type || type
	            phase = hook.phase || !!phase
	            fn = hook.fn ? hook.fn(el, fn) : fn
	        }
	        var callback = W3C ? fn : function (e) {
	            fn.call(el, fixEvent(e));
	        }
	        if (W3C) {
	            el.addEventListener(type, callback, phase)
	        } else {
	            el.attachEvent("on" + type, callback)
	        }
	        return callback
	    },
	    /*卸载事件*/
	    unbind: function (el, type, fn, phase) {
	        var hooks = avalon.eventHooks
	        var hook = hooks[type]
	        var callback = fn || noop
	        if (typeof hook === "object") {
	            type = hook.type || type
	            phase = hook.phase || !!phase
	        }
	        if (W3C) {
	            el.removeEventListener(type, callback, phase)
	        } else {
	            el.detachEvent("on" + type, callback)
	        }
	    },
	    /*读写删除元素节点的样式*/
	    css: function (node, name, value) {
	        if (node instanceof avalon) {
	            node = node[0]
	        }
	        var prop = /[_-]/.test(name) ? camelize(name) : name,
	                fn
	        name = avalon.cssName(prop) || prop
	        if (value === void 0 || typeof value === "boolean") { //获取样式
	            fn = cssHooks[prop + ":get"] || cssHooks["@:get"]
	            if (name === "background") {
	                name = "backgroundColor"
	            }
	            var val = fn(node, name)
	            return value === true ? parseFloat(val) || 0 : val
	        } else if (value === "") { //请除样式
	            node.style[name] = ""
	        } else { //设置样式
	            if (value == null || value !== value) {
	                return
	            }
	            if (isFinite(value) && !avalon.cssNumber[prop]) {
	                value += "px"
	            }
	            fn = cssHooks[prop + ":set"] || cssHooks["@:set"]
	            fn(node, name, value)
	        }
	    },
	    /*遍历数组与对象,回调的第一个参数为索引或键名,第二个或元素或键值*/
	    each: function (obj, fn) {
	        if (obj) { //排除null, undefined
	            var i = 0
	            if (isArrayLike(obj)) {
	                for (var n = obj.length; i < n; i++) {
	                    if (fn(i, obj[i]) === false)
	                        break
	                }
	            } else {
	                for (i in obj) {
	                    if (obj.hasOwnProperty(i) && fn(i, obj[i]) === false) {
	                        break
	                    }
	                }
	            }
	        }
	    },
	    //收集元素的data-{{prefix}}-*属性，并转换为对象
	    getWidgetData: function (elem, prefix) {
	        var raw = avalon(elem).data()
	        var result = {}
	        for (var i in raw) {
	            if (i.indexOf(prefix) === 0) {
	                result[i.replace(prefix, "").replace(/\w/, function (a) {
	                    return a.toLowerCase()
	                })] = raw[i]
	            }
	        }
	        return result
	    },
	    Array: {
	        /*只有当前数组不存在此元素时只添加它*/
	        ensure: function (target, item) {
	            if (target.indexOf(item) === -1) {
	                return target.push(item)
	            }
	        },
	        /*移除数组中指定位置的元素，返回布尔表示成功与否*/
	        removeAt: function (target, index) {
	            return !!target.splice(index, 1).length
	        },
	        /*移除数组中第一个匹配传参的那个元素，返回布尔表示成功与否*/
	        remove: function (target, item) {
	            var index = target.indexOf(item)
	            if (~index)
	                return avalon.Array.removeAt(target, index)
	            return false
	        }
	    }
	})

	var bindingHandlers = avalon.bindingHandlers = {}
	var bindingExecutors = avalon.bindingExecutors = {}

	var directives = avalon.directives = {}
	avalon.directive = function (name, obj) {
	    bindingHandlers[name] = obj.init = (obj.init || noop)
	    bindingExecutors[name] = obj.update = (obj.update || noop)

	    return directives[name] = obj
	}
	/*判定是否类数组，如节点集合，纯数组，arguments与拥有非负整数的length属性的纯JS对象*/
	function isArrayLike(obj) {
	    if (!obj)
	        return false
	    var n = obj.length
	    if (n === (n >>> 0)) { //检测length属性是否为非负整数
	        var type = serialize.call(obj).slice(8, -1)
	        if (/(?:regexp|string|function|window|global)$/i.test(type))
	            return false
	        if (type === "Array")
	            return true
	        try {
	            if ({}.propertyIsEnumerable.call(obj, "length") === false) { //如果是原生对象
	                return /^\s?function/.test(obj.item || obj.callee)
	            }
	            return true
	        } catch (e) { //IE的NodeList直接抛错
	            return !obj.window //IE6-8 window
	        }
	    }
	    return false
	}


	// https://github.com/rsms/js-lru
	var Cache = new function() {// jshint ignore:line
	    function LRU(maxLength) {
	        this.size = 0
	        this.limit = maxLength
	        this.head = this.tail = void 0
	        this._keymap = {}
	    }

	    var p = LRU.prototype

	    p.put = function(key, value) {
	        var entry = {
	            key: key,
	            value: value
	        }
	        this._keymap[key] = entry
	        if (this.tail) {
	            this.tail.newer = entry
	            entry.older = this.tail
	        } else {
	            this.head = entry
	        }
	        this.tail = entry
	        if (this.size === this.limit) {
	            this.shift()
	        } else {
	            this.size++
	        }
	        return value
	    }

	    p.shift = function() {
	        var entry = this.head
	        if (entry) {
	            this.head = this.head.newer
	            this.head.older =
	                    entry.newer =
	                    entry.older =
	                    this._keymap[entry.key] = void 0
	             delete this._keymap[entry.key] //#1029
	        }
	    }
	    p.get = function(key) {
	        var entry = this._keymap[key]
	        if (entry === void 0)
	            return
	        if (entry === this.tail) {
	            return  entry.value
	        }
	        // HEAD--------------TAIL
	        //   <.older   .newer>
	        //  <--- add direction --
	        //   A  B  C  <D>  E
	        if (entry.newer) {
	            if (entry === this.head) {
	                this.head = entry.newer
	            }
	            entry.newer.older = entry.older // C <-- E.
	        }
	        if (entry.older) {
	            entry.older.newer = entry.newer // C. --> E
	        }
	        entry.newer = void 0 // D --x
	        entry.older = this.tail // D. --> E
	        if (this.tail) {
	            this.tail.newer = entry // E. <-- D
	        }
	        this.tail = entry
	        return entry.value
	    }
	    return LRU
	}// jshint ignore:line

	/*********************************************************************
	 *                         javascript 底层补丁                       *
	 **********************************************************************/
	if (!"司徒正美".trim) {
	    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
	    String.prototype.trim = function () {
	        return this.replace(rtrim, "")
	    }
	}
	var hasDontEnumBug = !({
	    'toString': null
	}).propertyIsEnumerable('toString'),
	        hasProtoEnumBug = (function () {
	        }).propertyIsEnumerable('prototype'),
	        dontEnums = [
	            "toString",
	            "toLocaleString",
	            "valueOf",
	            "hasOwnProperty",
	            "isPrototypeOf",
	            "propertyIsEnumerable",
	            "constructor"
	        ],
	        dontEnumsLength = dontEnums.length;
	if (!Object.keys) {
	    Object.keys = function (object) { //ecma262v5 15.2.3.14
	        var theKeys = []
	        var skipProto = hasProtoEnumBug && typeof object === "function"
	        if (typeof object === "string" || (object && object.callee)) {
	            for (var i = 0; i < object.length; ++i) {
	                theKeys.push(String(i))
	            }
	        } else {
	            for (var name in object) {
	                if (!(skipProto && name === "prototype") && ohasOwn.call(object, name)) {
	                    theKeys.push(String(name))
	                }
	            }
	        }

	        if (hasDontEnumBug) {
	            var ctor = object.constructor,
	                    skipConstructor = ctor && ctor.prototype === object
	            for (var j = 0; j < dontEnumsLength; j++) {
	                var dontEnum = dontEnums[j]
	                if (!(skipConstructor && dontEnum === "constructor") && ohasOwn.call(object, dontEnum)) {
	                    theKeys.push(dontEnum)
	                }
	            }
	        }
	        return theKeys
	    }
	}
	if (!Array.isArray) {
	    Array.isArray = function (a) {
	        return serialize.call(a) === "[object Array]"
	    }
	}

	if (!noop.bind) {
	    Function.prototype.bind = function (scope) {
	        if (arguments.length < 2 && scope === void 0)
	            return this
	        var fn = this,
	                argv = arguments
	        return function () {
	            var args = [],
	                    i
	            for (i = 1; i < argv.length; i++)
	                args.push(argv[i])
	            for (i = 0; i < arguments.length; i++)
	                args.push(arguments[i])
	            return fn.apply(scope, args)
	        }
	    }
	}

	function iterator(vars, body, ret) {
	    var fun = 'for(var ' + vars + 'i=0,n = this.length; i < n; i++){' + body.replace('_', '((i in this) && fn.call(scope,this[i],i,this))') + '}' + ret
	    /* jshint ignore:start */
	    return Function("fn,scope", fun)
	    /* jshint ignore:end */
	}
	if (!rnative.test([].map)) {
	    avalon.mix(ap, {
	        //定位操作，返回数组中第一个等于给定参数的元素的索引值。
	        indexOf: function (item, index) {
	            var n = this.length,
	                    i = ~~index
	            if (i < 0)
	                i += n
	            for (; i < n; i++)
	                if (this[i] === item)
	                    return i
	            return -1
	        },
	        //定位操作，同上，不过是从后遍历。
	        lastIndexOf: function (item, index) {
	            var n = this.length,
	                    i = index == null ? n - 1 : index
	            if (i < 0)
	                i = Math.max(0, n + i)
	            for (; i >= 0; i--)
	                if (this[i] === item)
	                    return i
	            return -1
	        },
	        //迭代操作，将数组的元素挨个儿传入一个函数中执行。Prototype.js的对应名字为each。
	        forEach: iterator("", '_', ""),
	        //迭代类 在数组中的每个项上运行一个函数，如果此函数的值为真，则此元素作为新数组的元素收集起来，并返回新数组
	        filter: iterator('r=[],j=0,', 'if(_)r[j++]=this[i]', 'return r'),
	        //收集操作，将数组的元素挨个儿传入一个函数中执行，然后把它们的返回值组成一个新数组返回。Prototype.js的对应名字为collect。
	        map: iterator('r=[],', 'r[i]=_', 'return r'),
	        //只要数组中有一个元素满足条件（放进给定函数返回true），那么它就返回true。Prototype.js的对应名字为any。
	        some: iterator("", 'if(_)return true', 'return false'),
	        //只有数组中的元素都满足条件（放进给定函数返回true），它才返回true。Prototype.js的对应名字为all。
	        every: iterator("", 'if(!_)return false', 'return true')
	    })
	}
	/*********************************************************************
	 *                           DOM 底层补丁                             *
	 **********************************************************************/

	function fixContains(root, el) {
	    try { //IE6-8,游离于DOM树外的文本节点，访问parentNode有时会抛错
	        while ((el = el.parentNode))
	            if (el === root)
	                return true
	        return false
	    } catch (e) {
	        return false
	    }
	}
	avalon.contains = fixContains
	//IE6-11的文档对象没有contains
	if (!DOC.contains) {
	    DOC.contains = function (b) {
	        return fixContains(DOC, b)
	    }
	}

	function outerHTML() {
	    return new XMLSerializer().serializeToString(this)
	}

	if (window.SVGElement) {
	    //safari5+是把contains方法放在Element.prototype上而不是Node.prototype
	    if (!DOC.createTextNode("x").contains) {
	        Node.prototype.contains = function (arg) {//IE6-8没有Node对象
	            return !!(this.compareDocumentPosition(arg) & 16)
	        }
	    }
	    var svgns = "http://www.w3.org/2000/svg"
	    var svg = DOC.createElementNS(svgns, "svg")
	    svg.innerHTML = '<circle cx="50" cy="50" r="40" fill="red" />'
	    if (!rsvg.test(svg.firstChild)) { // #409
	        function enumerateNode(node, targetNode) {// jshint ignore:line
	            if (node && node.childNodes) {
	                var nodes = node.childNodes
	                for (var i = 0, el; el = nodes[i++]; ) {
	                    if (el.tagName) {
	                        var svg = DOC.createElementNS(svgns,
	                                el.tagName.toLowerCase())
	                        ap.forEach.call(el.attributes, function (attr) {
	                            svg.setAttribute(attr.name, attr.value) //复制属性
	                        })// jshint ignore:line
	                        // 递归处理子节点
	                        enumerateNode(el, svg)
	                        targetNode.appendChild(svg)
	                    }
	                }
	            }
	        }
	        Object.defineProperties(SVGElement.prototype, {
	            "outerHTML": {//IE9-11,firefox不支持SVG元素的innerHTML,outerHTML属性
	                enumerable: true,
	                configurable: true,
	                get: outerHTML,
	                set: function (html) {
	                    var tagName = this.tagName.toLowerCase(),
	                            par = this.parentNode,
	                            frag = avalon.parseHTML(html)
	                    // 操作的svg，直接插入
	                    if (tagName === "svg") {
	                        par.insertBefore(frag, this)
	                        // svg节点的子节点类似
	                    } else {
	                        var newFrag = DOC.createDocumentFragment()
	                        enumerateNode(frag, newFrag)
	                        par.insertBefore(newFrag, this)
	                    }
	                    par.removeChild(this)
	                }
	            },
	            "innerHTML": {
	                enumerable: true,
	                configurable: true,
	                get: function () {
	                    var s = this.outerHTML
	                    var ropen = new RegExp("<" + this.nodeName + '\\b(?:(["\'])[^"]*?(\\1)|[^>])*>', "i")
	                    var rclose = new RegExp("<\/" + this.nodeName + ">$", "i")
	                    return s.replace(ropen, "").replace(rclose, "")
	                },
	                set: function (html) {
	                    if (avalon.clearHTML) {
	                        avalon.clearHTML(this)
	                        var frag = avalon.parseHTML(html)
	                        enumerateNode(frag, this)
	                    }
	                }
	            }
	        })
	    }
	}
	if (!root.outerHTML && window.HTMLElement) { //firefox 到11时才有outerHTML
	    HTMLElement.prototype.__defineGetter__("outerHTML", outerHTML);
	}


	//============================= event binding =======================
	var rmouseEvent = /^(?:mouse|contextmenu|drag)|click/
	function fixEvent(event) {
	    var ret = {}
	    for (var i in event) {
	        ret[i] = event[i]
	    }
	    var target = ret.target = event.srcElement
	    if (event.type.indexOf("key") === 0) {
	        ret.which = event.charCode != null ? event.charCode : event.keyCode
	    } else if (rmouseEvent.test(event.type)) {
	        var doc = target.ownerDocument || DOC
	        var box = doc.compatMode === "BackCompat" ? doc.body : doc.documentElement
	        ret.pageX = event.clientX + (box.scrollLeft >> 0) - (box.clientLeft >> 0)
	        ret.pageY = event.clientY + (box.scrollTop >> 0) - (box.clientTop >> 0)
	        ret.wheelDeltaY = ret.wheelDelta
	        ret.wheelDeltaX = 0
	    }
	    ret.timeStamp = new Date() - 0
	    ret.originalEvent = event
	    ret.preventDefault = function () { //阻止默认行为
	        event.returnValue = false
	    }
	    ret.stopPropagation = function () { //阻止事件在DOM树中的传播
	        event.cancelBubble = true
	    }
	    return ret
	}

	var eventHooks = avalon.eventHooks
	//针对firefox, chrome修正mouseenter, mouseleave
	if (!("onmouseenter" in root)) {
	    avalon.each({
	        mouseenter: "mouseover",
	        mouseleave: "mouseout"
	    }, function (origType, fixType) {
	        eventHooks[origType] = {
	            type: fixType,
	            fn: function (elem, fn) {
	                return function (e) {
	                    var t = e.relatedTarget
	                    if (!t || (t !== elem && !(elem.compareDocumentPosition(t) & 16))) {
	                        delete e.type
	                        e.type = origType
	                        return fn.call(elem, e)
	                    }
	                }
	            }
	        }
	    })
	}
	//针对IE9+, w3c修正animationend
	avalon.each({
	    AnimationEvent: "animationend",
	    WebKitAnimationEvent: "webkitAnimationEnd"
	}, function (construct, fixType) {
	    if (window[construct] && !eventHooks.animationend) {
	        eventHooks.animationend = {
	            type: fixType
	        }
	    }
	})
	//针对IE6-8修正input
	if (!("oninput" in DOC.createElement("input"))) {
	    eventHooks.input = {
	        type: "propertychange",
	        deel: function (elem, fn) {
	            return function (e) {
	                if (e.propertyName === "value") {
	                    e.type = "input"
	                    return fn.call(elem, e)
	                }
	            }
	        }
	    }
	}
	if (DOC.onmousewheel === void 0) {
	    /* IE6-11 chrome mousewheel wheelDetla 下 -120 上 120
	     firefox DOMMouseScroll detail 下3 上-3
	     firefox wheel detlaY 下3 上-3
	     IE9-11 wheel deltaY 下40 上-40
	     chrome wheel deltaY 下100 上-100 */
	    var fixWheelType = DOC.onwheel !== void 0 ? "wheel" : "DOMMouseScroll"
	    var fixWheelDelta = fixWheelType === "wheel" ? "deltaY" : "detail"
	    eventHooks.mousewheel = {
	        type: fixWheelType,
	        fn: function (elem, fn) {
	            return function (e) {
	                e.wheelDeltaY = e.wheelDelta = e[fixWheelDelta] > 0 ? -120 : 120
	                e.wheelDeltaX = 0
	                if (Object.defineProperty) {
	                    Object.defineProperty(e, "type", {
	                        value: "mousewheel"
	                    })
	                }
	                fn.call(elem, e)
	            }
	        }
	    }
	}



	/*********************************************************************
	 *                           配置系统                                 *
	 **********************************************************************/

	function kernel(settings) {
	    for (var p in settings) {
	        if (!ohasOwn.call(settings, p))
	            continue
	        var val = settings[p]
	        if (typeof kernel.plugins[p] === "function") {
	            kernel.plugins[p](val)
	        } else if (typeof kernel[p] === "object") {
	            avalon.mix(kernel[p], val)
	        } else {
	            kernel[p] = val
	        }
	    }
	    return this
	}
	var openTag, closeTag, rexpr, rexprg, rbind, rregexp = /[-.*+?^${}()|[\]\/\\]/g

	function escapeRegExp(target) {
	    //http://stevenlevithan.com/regex/xregexp/
	    //将字符串安全格式化为正则表达式的源码
	    return (target + "").replace(rregexp, "\\$&")
	}

	var plugins = {
	    interpolate: function (array) {
	        openTag = array[0]
	        closeTag = array[1]
	        if (openTag === closeTag) {
	            throw new SyntaxError("openTag!==closeTag")
	            var test = openTag + "test" + closeTag
	            cinerator.innerHTML = test
	            if (cinerator.innerHTML !== test && cinerator.innerHTML.indexOf("&lt;") > -1) {
	                throw new SyntaxError("此定界符不合法")
	            }
	            cinerator.innerHTML = ""
	        }
	         kernel.openTag = openTag
	            kernel.closeTag = closeTag
	        var o = escapeRegExp(openTag),
	                c = escapeRegExp(closeTag)
	        rexpr = new RegExp(o + "(.*?)" + c)
	        rexprg = new RegExp(o + "(.*?)" + c, "g")
	        rbind = new RegExp(o + ".*?" + c + "|\\sms-")
	    }
	}
	kernel.async =true
	kernel.debug = true
	kernel.plugins = plugins
	kernel.plugins['interpolate'](["{{", "}}"])
	kernel.paths = {}
	kernel.shim = {}
	kernel.maxRepeatSize = 100
	avalon.config = kernel
	function $watch(expr, binding) {
	    var $events = this.$events || (this.$events = {})

	    var queue = $events[expr] || ($events[expr] = [])
	    if (typeof binding === "function") {
	        var backup = binding
	        backup.uniqueNumber = Math.random()
	        binding = {
	            element: root,
	            type: "user-watcher",
	            handler: noop,
	            vmodels: [this],
	            expr: expr,
	            uniqueNumber: backup.uniqueNumber
	        }
	        binding.wildcard = /\*/.test(expr)
	    }

	    if (!binding.update) {
	        if (/\w\.*\B/.test(expr)) {
	            binding.getter = noop
	            var host = this
	            binding.update = function () {
	                var args = this.fireArgs || []
	                if (args[2])
	                    binding.handler.apply(host, args)
	                delete this.fireArgs
	            }
	            queue.sync = true
	            avalon.Array.ensure(queue, binding)
	        } else {
	            avalon.injectBinding(binding)
	        }
	        if (backup) {
	            binding.handler = backup
	        }
	    } else if (!binding.oneTime) {
	        avalon.Array.ensure(queue, binding)
	    }
	    return function () {
	        binding.update = binding.getter = binding.handler = noop
	        binding.element = DOC.createElement("a")
	    }
	}
	function $emit(key, args) {
	    var event = this.$events
	    if (event && event[key]) {
	        if (args) {
	            args[2] = key
	        }
	        var arr = event[key]
	        notifySubscribers(arr, args)
	        var parent = this.$up
	        if (parent) {
	            if (this.$pathname) {
	                $emit.call(parent, this.$pathname + "." + key, args)//以确切的值往上冒泡
	            }

	            $emit.call(parent, "*." + key, args)//以模糊的值往上冒泡
	        }
	    } else {
	        parent = this.$up
	       
	        if(this.$ups ){
	            for(var i in this.$ups){
	                $emit.call(this.$ups[i], i+"."+key, args)//以确切的值往上冒泡
	            }
	            return
	        }
	        if (parent) {
	            var p = this.$pathname
	            if (p === "")
	                p = "*"
	            var path = p + "." + key
	            arr = path.split(".")
	            if (arr.indexOf("*") === -1) {
	                $emit.call(parent, path, args)//以确切的值往上冒泡
	                arr[1] = "*"
	                $emit.call(parent, arr.join("."), args)//以模糊的值往上冒泡
	            } else {
	                $emit.call(parent, path, args)//以确切的值往上冒泡
	            }
	        }
	    }
	}


	function collectDependency(el, key) {
	    do {
	        if (el.$watch) {
	            var e = el.$events || (el.$events = {})
	            var array = e[key] || (e[key] = [])
	            dependencyDetection.collectDependency(array)
	            return
	        }
	        el = el.$up
	        if (el) {
	            key = el.$pathname + "." + key
	        } else {
	            break
	        }

	    } while (true)
	}


	function notifySubscribers(subs, args) {
	    if (!subs)
	        return
	    if (new Date() - beginTime > 444 && typeof subs[0] === "object") {
	        rejectDisposeQueue()
	    }
	    var users = [], renders = []
	    for (var i = 0, sub; sub = subs[i++]; ) {
	        if (sub.type === "user-watcher") {
	            users.push(sub)
	        } else {
	            renders.push(sub)
	        }

	    }
	    if (kernel.async) {
	        buffer.render()//1
	        for (i = 0; sub = renders[i++]; ) {
	            if (sub.update) {
	                var uuid = getUid(sub)
	                if (!buffer.queue[uuid]) {
	                    buffer.queue[uuid] = 1
	                    buffer.queue.push(sub)
	                }
	            }
	        }
	    } else {
	        for (i = 0; sub = renders[i++]; ) {
	            if (sub.update) {
	                sub.update()//最小化刷新DOM树
	            }
	        }
	    }
	    for (i = 0; sub = users[i++]; ) {
	        if (args && args[2] === sub.expr || sub.wildcard) {
	            sub.fireArgs = args
	        }
	        sub.update()
	    }
	}
	//avalon最核心的方法的两个方法之一（另一个是avalon.scan），返回一个ViewModel(VM)
	var VMODELS = avalon.vmodels = {} //所有vmodel都储存在这里
	avalon.define = function (source) {
	    var $id = source.$id
	    if (!$id) {
	        log("warning: vm必须指定$id")
	    }
	    var vmodel = modelFactory(source)
	    vmodel.$id = $id
	    return VMODELS[$id] = vmodel
	}

	//一些不需要被监听的属性
	var $$skipArray = oneObject("$id,$watch,$fire,$events,$model,$skipArray,$active,$pathname,$up,$track,$accessors,$ups")
	var defineProperty = Object.defineProperty
	var canHideOwn = true
	//如果浏览器不支持ecma262v5的Object.defineProperties或者存在BUG，比如IE8
	//标准浏览器使用__defineGetter__, __defineSetter__实现
	try {
	    defineProperty({}, "_", {
	        value: "x"
	    })
	    var defineProperties = Object.defineProperties
	} catch (e) {
	    canHideOwn = false
	}

	function modelFactory(source, options) {
	    options = options || {}
	    options.watch = true
	    return observeObject(source, options)
	}

	//监听对象属性值的变化(注意,数组元素不是数组的属性),通过对劫持当前对象的访问器实现
	//监听对象或数组的结构变化, 对对象的键值对进行增删重排, 或对数组的进行增删重排,都属于这范畴
	//   通过比较前后代理VM顺序实现
	function Component() {
	}

	function observeObject(source, options) {
	    if (!source || (source.$id && source.$accessors)) {
	        return source
	    }
	    //source为原对象,不能是元素节点或null
	    //options,可选,配置对象,里面有old, force, watch这三个属性
	    options = options || nullObject
	    var force = options.force || nullObject
	    var old = options.old
	    var oldAccessors = old && old.$accessors || nullObject
	    var $vmodel = new Component() //要返回的对象, 它在IE6-8下可能被偷龙转凤
	    var accessors = {} //监控属性
	    var hasOwn = {}
	    var skip = []
	    var simple = []
	    var $skipArray = {}
	    if (source.$skipArray) {
	        $skipArray = oneObject(source.$skipArray)
	        delete source.$skipArray
	    }
	    //处理计算属性
	    var computed = source.$computed
	    if (computed) {
	        delete source.$computed
	        for (var name in computed) {
	            hasOwn[name] = true;
	            (function (key, value) {
	                var old
	                accessors[key] = {
	                    get: function () {
	                        return old = value.get.call(this)
	                    },
	                    set: function (x) {
	                        if (typeof value.set === "function") {
	                            var older = old
	                            value.set.call(this, x)
	                            var newer = this[key]
	                            if (this.$fire && (newer !== older)) {
	                                this.$fire(key, newer, older)
	                            }
	                        }
	                    },
	                    enumerable: true,
	                    configurable: true
	                }
	            })(name, computed[name])// jshint ignore:line
	        }
	    }


	    for (name in source) {
	        var value = source[name]
	        if (!$$skipArray[name])
	            hasOwn[name] = true
	        if (typeof value === "function" || (value && value.nodeType) ||
	                (!force[name] && (name.charAt(0) === "$" || $$skipArray[name] || $skipArray[name]))) {
	            skip.push(name)
	        } else if (isComputed(value)) {
	            log("warning:计算属性建议放在$computed对象中统一定义");
	            (function (key, value) {
	                var old
	                accessors[key] = {
	                    get: function () {
	                        return old = value.get.call(this)
	                    },
	                    set: function (x) {
	                        if (typeof value.set === "function") {
	                            var older = old
	                            value.set.call(this, x)
	                            var newer = this[key]
	                            if (this.$fire && (newer !== older)) {
	                                this.$fire(key, newer, older)
	                            }
	                        }
	                    },
	                    enumerable: true,
	                    configurable: true
	                }
	            })(name, value)// jshint ignore:line
	        } else {
	            simple.push(name)
	            if (oldAccessors[name]) {
	                accessors[name] = oldAccessors[name]
	            } else {
	                accessors[name] = makeGetSet(name, value)
	            }
	        }
	    }


	    accessors["$model"] = $modelDescriptor
	    $vmodel = defineProperties($vmodel, accessors, source)
	    function trackBy(name) {
	        return hasOwn[name] === true
	    }
	    skip.forEach(function (name) {
	        $vmodel[name] = source[name]
	    })

	    /* jshint ignore:start */
	    hideProperty($vmodel, "$ups", null)
	    hideProperty($vmodel, "$id", "anonymous")
	    hideProperty($vmodel, "$up", old ? old.$up : null)
	    hideProperty($vmodel, "$track", Object.keys(hasOwn))
	    hideProperty($vmodel, "$active", false)
	    hideProperty($vmodel, "$pathname", old ? old.$pathname : "")
	    hideProperty($vmodel, "$accessors", accessors)
	    hideProperty($vmodel, "hasOwnProperty", trackBy)
	    if (options.watch) {
	        hideProperty($vmodel, "$watch", function () {
	            return $watch.apply($vmodel, arguments)
	        })
	        hideProperty($vmodel, "$fire", function (path, a) {
	            if(path.indexOf("all!") === 0 ){
	                var ee = path.slice(4)
	                for(var i in avalon.vmodels){
	                    var v = avalon.vmodels[i]
	                    v.$fire && v.$fire.apply(v, [ee, a])
	                }
	            }else{
	               $emit.call($vmodel, path, [a])
	            }
	        })
	    }
	    /* jshint ignore:end */
	    //必须设置了$active,$events
	    simple.forEach(function (name) {
	        var oldVal = old && old[name]
	        var val = $vmodel[name] = source[name]
	        if (val && typeof val === "object") {
	            val.$up = $vmodel
	            val.$pathname = name
	        }
	        $emit.call($vmodel, name, [val,oldVal])
	    })
	    for (name in computed) {
	        value = $vmodel[name]
	    }
	    $vmodel.$active = true
	    return $vmodel
	}
	/*
	 新的VM拥有如下私有属性
	 $id: vm.id
	 $events: 放置$watch回调与绑定对象
	 $watch: 增强版$watch
	 $fire: 触发$watch回调
	 $track:一个数组,里面包含用户定义的所有键名
	 $active:boolean,false时防止依赖收集
	 $model:返回一个纯净的JS对象
	 $accessors:放置所有读写器的数据描述对象
	 $up:返回其上级对象
	 $pathname:返回此对象在上级对象的名字,注意,数组元素的$pathname为空字符串
	 =============================
	 $skipArray:用于指定不可监听的属性,但VM生成是没有此属性的
	 */
	function isComputed(val) {//speed up!
	    if (val && typeof val === "object") {
	        for (var i in val) {
	            if (i !== "get" && i !== "set") {
	                return false
	            }
	        }
	        return  typeof val.get === "function"
	    }
	}
	function makeGetSet(key, value) {
	    var childVm
	    value = NaN
	    return {
	        get: function () {
	            if (this.$active) {
	                collectDependency(this, key)
	            }
	            return value
	        },
	        set: function (newVal) {
	            if (value === newVal)
	                return
	            var oldValue = value
	            childVm = observe(newVal, value)
	            if (childVm) {
	                value = childVm
	            } else {
	                childVm = void 0
	                value = newVal
	            }

	            if (Object(childVm) === childVm) {
	                childVm.$pathname = key
	                childVm.$up = this
	            }
	            if (this.$active) {
	                $emit.call(this, key, [value, oldValue])
	            }
	        },
	        enumerable: true,
	        configurable: true
	    }
	}

	function observe(obj, old, hasReturn, watch) {
	    if (Array.isArray(obj)) {
	        return observeArray(obj, old, watch)
	    } else if (avalon.isPlainObject(obj)) {
	        if (old && typeof old === 'object') {
	            var keys = getKeys(obj)
	            var keys2 = getKeys(old)
	            if (keys.join(";") === keys2.join(";")) {
	                for (var i in obj) {
	                    if (obj.hasOwnProperty(i)) {
	                        old[i] = obj[i]
	                    }
	                }
	                return old
	            }
	            old.$active = false
	        }
	        return observeObject(obj, {
	            old: old,
	            watch: watch
	        })
	    }
	    if (hasReturn) {
	        return obj
	    }
	}
	var getKeys = rnative.test(Object.key) ? Object.key : function (a) {
	    var ret = []
	    for (var i in a) {
	        if (a.hasOwnProperty(i) && !$$skipArray[i]) {
	            ret.push(i)
	        }
	    }
	    return ret
	}
	function observeArray(array, old, watch) {
	    if (old) {
	        var args = [0, old.length].concat(array)
	        old.splice.apply(old, args)
	        return old
	    } else {
	        for (var i in newProto) {
	            array[i] = newProto[i]
	        }
	        hideProperty(array, "$up", null)
	        hideProperty(array, "$pathname", "")
	        hideProperty(array, "$track", createTrack(array.length))

	        array._ = observeObject({
	            length: NaN
	        }, {
	            watch: true
	        })
	        array._.length = array.length
	        array._.$watch("length", function (a, b) {
	            $emit.call(array.$up, array.$pathname + ".length", [a, b])
	        })
	        if (watch) {
	            hideProperty(array, "$watch", function () {
	                return $watch.apply(array, arguments)
	            })
	        }

	        if (W3C) {
	            Object.defineProperty(array, "$model", $modelDescriptor)
	        } else {
	            array.$model = toJson(array)
	        }
	        for (var j = 0, n = array.length; j < n; j++) {
	            var el = array[j] = observe(array[j], 0, 1, 1)
	            if (Object(el) === el) {//#1077
	                el.$up = array
	            }
	        }

	        return array
	    }
	}

	function hideProperty(host, name, value) {
	    if (canHideOwn) {
	        Object.defineProperty(host, name, {
	            value: value,
	            writable: true,
	            enumerable: false,
	            configurable: true
	        })
	    } else {
	        host[name] = value
	    }
	}

	function toJson(val) {
	    var xtype = avalon.type(val)
	    if (xtype === "array") {
	        var array = []
	        for (var i = 0; i < val.length; i++) {
	            array[i] = toJson(val[i])
	        }
	        return array
	    } else if (xtype === "object") {
	        var obj = {}
	        for (i in val) {
	            if(i === "__proxy__" || i === "__data__" || i === "__const__")
	                continue
	            if (val.hasOwnProperty(i)) {
	                var value = val[i]
	                obj[i] = value && value.nodeType ? value :toJson(value)
	            }
	        }
	        return obj
	    }
	    return val
	}

	var $modelDescriptor = {
	    get: function () {
	        return toJson(this)
	    },
	    set: noop,
	    enumerable: false,
	    configurable: true
	}


	//===================修复浏览器对Object.defineProperties的支持=================
	if (!canHideOwn) {
	    if ("__defineGetter__" in avalon) {
	        defineProperty = function (obj, prop, desc) {
	            if ('value' in desc) {
	                obj[prop] = desc.value
	            }
	            if ("get" in desc) {
	                obj.__defineGetter__(prop, desc.get)
	            }
	            if ('set' in desc) {
	                obj.__defineSetter__(prop, desc.set)
	            }
	            return obj
	        }
	        defineProperties = function (obj, descs) {
	            for (var prop in descs) {
	                if (descs.hasOwnProperty(prop)) {
	                    defineProperty(obj, prop, descs[prop])
	                }
	            }
	            return obj
	        }
	    }
	    if (IEVersion) {
	        var VBClassPool = {}
	        window.execScript([// jshint ignore:line
	            "Function parseVB(code)",
	            "\tExecuteGlobal(code)",
	            "End Function" //转换一段文本为VB代码
	        ].join("\n"), "VBScript")
	        function VBMediator(instance, accessors, name, value) {// jshint ignore:line
	            var accessor = accessors[name]
	            if (arguments.length === 4) {
	                accessor.set.call(instance, value)
	            } else {
	                return accessor.get.call(instance)
	            }
	        }
	        defineProperties = function (name, accessors, properties) {
	            // jshint ignore:line
	            var buffer = []
	            buffer.push(
	                    "\r\n\tPrivate [__data__], [__proxy__]",
	                    "\tPublic Default Function [__const__](d" + expose + ", p" + expose + ")",
	                    "\t\tSet [__data__] = d" + expose + ": set [__proxy__] = p" + expose,
	                    "\t\tSet [__const__] = Me", //链式调用
	                    "\tEnd Function")
	            //添加普通属性,因为VBScript对象不能像JS那样随意增删属性，必须在这里预先定义好
	            var uniq = {}

	            //添加访问器属性 
	            for (name in accessors) {
	                uniq[name] = true
	                buffer.push(
	                        //由于不知对方会传入什么,因此set, let都用上
	                        "\tPublic Property Let [" + name + "](val" + expose + ")", //setter
	                        "\t\tCall [__proxy__](Me,[__data__], \"" + name + "\", val" + expose + ")",
	                        "\tEnd Property",
	                        "\tPublic Property Set [" + name + "](val" + expose + ")", //setter
	                        "\t\tCall [__proxy__](Me,[__data__], \"" + name + "\", val" + expose + ")",
	                        "\tEnd Property",
	                        "\tPublic Property Get [" + name + "]", //getter
	                        "\tOn Error Resume Next", //必须优先使用set语句,否则它会误将数组当字符串返回
	                        "\t\tSet[" + name + "] = [__proxy__](Me,[__data__],\"" + name + "\")",
	                        "\tIf Err.Number <> 0 Then",
	                        "\t\t[" + name + "] = [__proxy__](Me,[__data__],\"" + name + "\")",
	                        "\tEnd If",
	                        "\tOn Error Goto 0",
	                        "\tEnd Property")

	            }
	            for (name in properties) {
	                if (uniq[name] !== true) {
	                    uniq[name] = true
	                    buffer.push("\tPublic [" + name + "]")
	                }
	            }
	            for (name in $$skipArray) {
	                if (uniq[name] !== true) {
	                    uniq[name] = true
	                    buffer.push("\tPublic [" + name + "]")
	                }
	            }
	            buffer.push("\tPublic [" + 'hasOwnProperty' + "]")
	            buffer.push("End Class")
	            var body = buffer.join("\r\n")
	            var className = VBClassPool[body]
	            if (!className) {
	                className = generateID("VBClass")
	                window.parseVB("Class " + className + body)
	                window.parseVB([
	                    "Function " + className + "Factory(a, b)", //创建实例并传入两个关键的参数
	                    "\tDim o",
	                    "\tSet o = (New " + className + ")(a, b)",
	                    "\tSet " + className + "Factory = o",
	                    "End Function"
	                ].join("\r\n"))
	                VBClassPool[body] = className
	            }
	            var ret = window[className + "Factory"](accessors, VBMediator) //得到其产品
	            return ret //得到其产品
	        }
	    }
	}

	/*********************************************************************
	 *          监控数组（与ms-each, ms-repeat配合使用）                     *
	 **********************************************************************/

	var arrayMethods = ['push', 'pop', 'shift', 'unshift', 'splice']
	var arrayProto = Array.prototype
	var newProto = {
	    notify: function () {
	        $emit.call(this.$up, this.$pathname)
	    },
	    set: function (index, val) {
	        if (((index >>> 0) === index) && this[index] !== val) {
	            if (index > this.length) {
	                throw Error(index + "set方法的第一个参数不能大于原数组长度")
	            }
	            $emit.call(this.$up, this.$pathname + ".*", [val, this[index]])
	            this.splice(index, 1, val)
	        }
	    },
	    contains: function (el) { //判定是否包含
	        return this.indexOf(el) !== -1
	    },
	    ensure: function (el) {
	        if (!this.contains(el)) { //只有不存在才push
	            this.push(el)
	        }
	        return this
	    },
	    pushArray: function (arr) {
	        return this.push.apply(this, arr)
	    },
	    remove: function (el) { //移除第一个等于给定值的元素
	        return this.removeAt(this.indexOf(el))
	    },
	    removeAt: function (index) { //移除指定索引上的元素
	        if ((index >>> 0) === index) {
	            return this.splice(index, 1)
	        }
	        return []
	    },
	    size: function () { //取得数组长度，这个函数可以同步视图，length不能
	        return this._.length
	    },
	    removeAll: function (all) { //移除N个元素
	        if (Array.isArray(all)) {
	            for (var i = this.length - 1; i >= 0; i--) {
	                if (all.indexOf(this[i]) !== -1) {
	                    _splice.call(this.$track, i, 1)
	                    _splice.call(this, i, 1)
	                    
	                }
	            }
	        } else if (typeof all === "function") {
	            for (i = this.length - 1; i >= 0; i--) {
	                var el = this[i]
	                if (all(el, i)) {
	                     _splice.call(this.$track, i, 1)
	                    _splice.call(this, i, 1)
	                   
	                }
	            }
	        } else {
	            _splice.call(this.$track, 0, this.length)
	            _splice.call(this, 0, this.length)

	        }
	        if (!W3C) {
	            this.$model = toJson(this)
	        }
	        this.notify()
	        this._.length = this.length
	    },
	    clear: function () {
	        return this.removeAll()
	    }
	}
	var _splice = arrayProto.splice
	arrayMethods.forEach(function (method) {
	    var original = arrayProto[method]
	    newProto[method] = function () {
	        // 继续尝试劫持数组元素的属性
	        var args = []
	        for (var i = 0, n = arguments.length; i < n; i++) {
	            args[i] = observe(arguments[i], 0, 1, 1)
	        }
	        var result = original.apply(this, args)
	        addTrack(this.$track, method, args)
	        if (!W3C) {
	            this.$model = toJson(this)
	        }
	        this.notify()
	        this._.length = this.length
	        return result
	    }
	})

	"sort,reverse".replace(rword, function (method) {
	    newProto[method] = function () {
	        var oldArray = this.concat() //保持原来状态的旧数组
	        var newArray = this
	        var mask = Math.random()
	        var indexes = []
	        var hasSort = false
	        arrayProto[method].apply(newArray, arguments) //排序
	        for (var i = 0, n = oldArray.length; i < n; i++) {
	            var neo = newArray[i]
	            var old = oldArray[i]
	            if (neo === old) {
	                indexes.push(i)
	            } else {
	                var index = oldArray.indexOf(neo)
	                indexes.push(index)//得到新数组的每个元素在旧数组对应的位置
	                oldArray[index] = mask    //屏蔽已经找过的元素
	                hasSort = true
	            }
	        }
	        if (hasSort) {
	            sortByIndex(this.$track, indexes)
	            if (!W3C) {
	                this.$model = toJson(this)
	            }
	            this.notify()
	        }
	        return this
	    }
	})

	function sortByIndex(array, indexes) {
	    var map = {};
	    for (var i = 0, n = indexes.length; i < n; i++) {
	        map[i] = array[i]
	        var j = indexes[i]
	        if (j in map) {
	            array[i] = map[j]
	            delete map[j]
	        } else {
	            array[i] = array[j]
	        }
	    }
	}

	function createTrack(n) {
	    var ret = []
	    for (var i = 0; i < n; i++) {
	        ret[i] = generateID("$proxy$each")
	    }
	    return ret
	}

	function addTrack(track, method, args) {
	    switch (method) {
	        case 'push':
	        case 'unshift':
	            args = createTrack(args.length)
	            break
	        case 'splice':
	            if (args.length > 2) {
	                // 0, 5, a, b, c --> 0, 2, 0
	                // 0, 5, a, b, c, d, e, f, g--> 0, 0, 3
	                var del = args[1]
	                var add = args.length - 2
	                // args = [args[0], Math.max(del - add, 0)].concat(createTrack(Math.max(add - del, 0)))
	                args = [args[0], args[1]].concat(createTrack(args.length - 2))
	            }
	            break
	    }
	    Array.prototype[method].apply(track, args)
	}
	/*********************************************************************
	 *                           依赖调度系统                             *
	 **********************************************************************/
	//检测两个对象间的依赖关系
	var dependencyDetection = (function () {
	    var outerFrames = []
	    var currentFrame
	    return {
	        begin: function (binding) {
	            //accessorObject为一个拥有callback的对象
	            outerFrames.push(currentFrame)
	            currentFrame = binding
	        },
	        end: function () {
	            currentFrame = outerFrames.pop()
	        },
	        collectDependency: function (array) {
	            if (currentFrame) {
	                //被dependencyDetection.begin调用
	                currentFrame.callback(array)
	            }
	        }
	    };
	})()
	//将绑定对象注入到其依赖项的订阅数组中
	var roneval = /^on$/

	function returnRandom() {
	    return new Date() - 0
	}

	avalon.injectBinding = function (binding) {

	    binding.handler = binding.handler || directives[binding.type].update || noop
	    binding.update = function () {
	        var begin = false
	        if (!binding.getter) {
	            begin = true
	            dependencyDetection.begin({
	                callback: function (array) {
	                    injectDependency(array, binding)
	                }
	            })
	            binding.getter = parseExpr(binding.expr, binding.vmodels, binding)
	            binding.observers.forEach(function (a) {
	                a.v.$watch(a.p, binding)
	            })
	            delete binding.observers
	        }
	        try {
	            var args = binding.fireArgs, a, b
	            delete binding.fireArgs
	            if (!args) {
	                if (binding.type === "on") {
	                    a = binding.getter + ""
	                } else {
	                    a = binding.getter.apply(0, binding.args)
	                }
	            } else {
	                a = args[0]
	                b = args[1]

	            }
	            b = typeof b === "undefined" ? binding.oldValue : b
	            if (binding._filters) {
	                a = filters.$filter.apply(0, [a].concat(binding._filters))
	            }
	            if (binding.signature) {
	                var xtype = avalon.type(a)
	                if (xtype !== "array" && xtype !== "object") {
	                    throw Error("warning:" + binding.expr + "只能是对象或数组")
	                }
	                binding.xtype = xtype
	                var vtrack = getProxyIds(binding.proxies || [], xtype)
	                var mtrack = a.$track || (xtype === "array" ? createTrack(a.length) :
	                        Object.keys(a))
	                binding.track = mtrack
	                if (vtrack !== mtrack.join(";")) {
	                    binding.handler(a, b)
	                    binding.oldValue = 1
	                }
	            } else if (Array.isArray(a) ? a.length !== (b && b.length) : false) {
	                binding.handler(a, b)
	                binding.oldValue = a.concat()
	            } else if (!("oldValue" in binding) || a !== b) {
	                binding.handler(a, b)
	                binding.oldValue = a
	            }
	        } catch (e) {
	            delete binding.getter
	            log("warning:exception throwed in [avalon.injectBinding] ", e)
	            var node = binding.element
	            if (node && node.nodeType === 3) {
	                node.nodeValue = openTag + (binding.oneTime ? "::" : "") + binding.expr + closeTag
	            }
	        } finally {
	            begin && dependencyDetection.end()

	        }
	    }
	    binding.update()
	}


	//将依赖项(比它高层的访问器或构建视图刷新函数的绑定对象)注入到订阅者数组
	function injectDependency(list, binding) {
	    if (binding.oneTime)
	        return
	    if (list && avalon.Array.ensure(list, binding) && binding.element) {
	        injectDisposeQueue(binding, list)
	        if (new Date() - beginTime > 444) {
	            rejectDisposeQueue()
	        }
	    }
	}


	function getProxyIds(a, isArray) {
	    var ret = []
	    for (var i = 0, el; el = a[i++]; ) {
	        ret.push(isArray ? el.$id : el.$key)
	    }
	    return ret.join(";")
	}

	/*********************************************************************
	 *                          定时GC回收机制                             *
	 **********************************************************************/
	var disposeCount = 0
	var disposeQueue = avalon.$$subscribers = []
	var beginTime = new Date()
	var oldInfo = {}

	function getUid(data) { //IE9+,标准浏览器
	    if (!data.uniqueNumber) {
	        var elem = data.element
	        if (elem) {
	            if (elem.nodeType !== 1) {
	                //如果是注释节点,则data.pos不存在,当一个元素下有两个注释节点就会出问题
	                data.uniqueNumber = data.type + "-" + getUid(elem.parentNode) + "-" + (++disposeCount)
	            } else {
	                data.uniqueNumber = data.name + "-" + getUid(elem)
	            }
	        } else {
	            data.uniqueNumber = ++disposeCount
	        }
	    }
	    return data.uniqueNumber
	}

	//添加到回收列队中
	function injectDisposeQueue(data, list) {
	    var lists = data.lists || (data.lists = [])
	    var uuid = getUid(data)
	    avalon.Array.ensure(lists, list)
	    list.$uuid = list.$uuid || generateID()
	    if (!disposeQueue[uuid]) {
	        disposeQueue[uuid] = 1
	        disposeQueue.push(data)
	    }
	}

	function rejectDisposeQueue(data) {

	    var i = disposeQueue.length
	    var n = i
	    var allTypes = []
	    var iffishTypes = {}
	    var newInfo = {}
	    //对页面上所有绑定对象进行分门别类, 只检测个数发生变化的类型
	    while (data = disposeQueue[--i]) {
	        var type = data.type
	        if (newInfo[type]) {
	            newInfo[type]++
	        } else {
	            newInfo[type] = 1
	            allTypes.push(type)
	        }
	    }
	    var diff = false
	    allTypes.forEach(function (type) {
	        if (oldInfo[type] !== newInfo[type]) {
	            iffishTypes[type] = 1
	            diff = true
	        }
	    })
	    i = n
	    if (diff) {
	        while (data = disposeQueue[--i]) {
	            if (data.element === null) {
	                disposeQueue.splice(i, 1)
	                continue
	            }
	            if (iffishTypes[data.type] && shouldDispose(data.element)) { //如果它没有在DOM树
	                disposeQueue.splice(i, 1)
	                delete disposeQueue[data.uniqueNumber]
	                var lists = data.lists
	                for (var k = 0, list; list = lists[k++]; ) {
	                    avalon.Array.remove(lists, list)
	                    avalon.Array.remove(list, data)
	                }
	                disposeData(data)
	            }
	        }
	    }
	    oldInfo = newInfo
	    beginTime = new Date()
	}

	function disposeData(data) {
	    delete disposeQueue[data.uniqueNumber] // 先清除，不然无法回收了
	    data.element = null
	    data.rollback && data.rollback()
	    for (var key in data) {
	        data[key] = null
	    }
	}

	function shouldDispose(el) {
	    try {//IE下，如果文本节点脱离DOM树，访问parentNode会报错
	        var fireError = el.parentNode.nodeType
	    } catch (e) {
	        return true
	    }
	    if (el.ifRemove) {
	        // 如果节点被放到ifGroup，才移除
	        if (!root.contains(el.ifRemove) && (ifGroup === el.parentNode)) {
	            el.parentNode && el.parentNode.removeChild(el)
	            return true
	        }
	    }
	    return el.msRetain ? 0 : (el.nodeType === 1 ? !root.contains(el) : !avalon.contains(root, el))
	}



	/************************************************************************
	 *            HTML处理(parseHTML, innerHTML, clearHTML)                  *
	 ************************************************************************/
	// We have to close these tags to support XHTML
	var tagHooks = {
	    area: [1, "<map>", "</map>"],
	    param: [1, "<object>", "</object>"],
	    col: [2, "<table><colgroup>", "</colgroup></table>"],
	    legend: [1, "<fieldset>", "</fieldset>"],
	    option: [1, "<select multiple='multiple'>", "</select>"],
	    thead: [1, "<table>", "</table>"],
	    tr: [2, "<table>", "</table>"],
	    td: [3, "<table><tr>", "</tr></table>"],
	    g: [1, '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">', '</svg>'],
	    //IE6-8在用innerHTML生成节点时，不能直接创建no-scope元素与HTML5的新标签
	    _default: W3C ? [0, "", ""] : [1, "X<div>", "</div>"] //div可以不用闭合
	}
	tagHooks.th = tagHooks.td
	tagHooks.optgroup = tagHooks.option
	tagHooks.tbody = tagHooks.tfoot = tagHooks.colgroup = tagHooks.caption = tagHooks.thead
	String("circle,defs,ellipse,image,line,path,polygon,polyline,rect,symbol,text,use").replace(rword, function (tag) {
	    tagHooks[tag] = tagHooks.g //处理SVG
	})
	var rtagName = /<([\w:]+)/ //取得其tagName
	var rxhtml = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig
	var rcreate = W3C ? /[^\d\D]/ : /(<(?:script|link|style|meta|noscript))/ig
	var scriptTypes = oneObject(["", "text/javascript", "text/ecmascript", "application/ecmascript", "application/javascript"])
	var rnest = /<(?:tb|td|tf|th|tr|col|opt|leg|cap|area)/ //需要处理套嵌关系的标签
	var script = DOC.createElement("script")
	var rhtml = /<|&#?\w+;/
	avalon.parseHTML = function (html) {
	    var fragment = avalonFragment.cloneNode(false)
	    if (typeof html !== "string") {
	        return fragment
	    }
	    if (!rhtml.test(html)) {
	        fragment.appendChild(DOC.createTextNode(html))
	        return fragment
	    }
	    html = html.replace(rxhtml, "<$1></$2>").trim()
	    var tag = (rtagName.exec(html) || ["", ""])[1].toLowerCase(),
	        //取得其标签名
	        wrap = tagHooks[tag] || tagHooks._default,
	        wrapper = cinerator,
	        firstChild, neo
	    if (!W3C) { //fix IE
	        html = html.replace(rcreate, "<br class=msNoScope>$1") //在link style script等标签之前添加一个补丁
	    }
	    wrapper.innerHTML = wrap[1] + html + wrap[2]
	    var els = wrapper.getElementsByTagName("script")
	    if (els.length) { //使用innerHTML生成的script节点不会发出请求与执行text属性
	        for (var i = 0, el; el = els[i++];) {
	            if (scriptTypes[el.type]) {
	                //以偷龙转凤方式恢复执行脚本功能
	                neo = script.cloneNode(false) //FF不能省略参数
	                ap.forEach.call(el.attributes, function (attr) {
	                        if (attr && attr.specified) {
	                            neo[attr.name] = attr.value //复制其属性
	                            neo.setAttribute(attr.name, attr.value)
	                        }
	                    }) // jshint ignore:line
	                neo.text = el.text
	                el.parentNode.replaceChild(neo, el) //替换节点
	            }
	        }
	    }
	    if (!W3C) { //fix IE
	        var target = wrap[1] === "X<div>" ? wrapper.lastChild.firstChild : wrapper.lastChild
	        if (target && target.tagName === "TABLE" && tag !== "tbody") {
	            //IE6-7处理 <thead> --> <thead>,<tbody>
	            //<tfoot> --> <tfoot>,<tbody>
	            //<table> --> <table><tbody></table>
	            for (els = target.childNodes, i = 0; el = els[i++];) {
	                if (el.tagName === "TBODY" && !el.innerHTML) {
	                    target.removeChild(el)
	                    break
	                }
	            }
	        }
	        els = wrapper.getElementsByTagName("br")
	        var n = els.length
	        while (el = els[--n]) {
	            if (el.className === "msNoScope") {
	                el.parentNode.removeChild(el)
	            }
	        }
	        for (els = wrapper.all, i = 0; el = els[i++];) { //fix VML
	            if (isVML(el)) {
	                fixVML(el)
	            }
	        }
	    }
	    //移除我们为了符合套嵌关系而添加的标签
	    for (i = wrap[0]; i--; wrapper = wrapper.lastChild) {}
	    while (firstChild = wrapper.firstChild) { // 将wrapper上的节点转移到文档碎片上！
	        fragment.appendChild(firstChild)
	    }
	    return fragment
	}

	function isVML(src) {
	    var nodeName = src.nodeName
	    return nodeName.toLowerCase() === nodeName && src.scopeName && src.outerText === ""
	}

	function fixVML(node) {
	    if (node.currentStyle.behavior !== "url(#default#VML)") {
	        node.style.behavior = "url(#default#VML)"
	        node.style.display = "inline-block"
	        node.style.zoom = 1 //hasLayout
	    }
	}
	avalon.innerHTML = function (node, html) {
	    if (!W3C && (!rcreate.test(html) && !rnest.test(html))) {
	        try {
	            node.innerHTML = html
	            return
	        } catch (e) {}
	    }
	    var a = this.parseHTML(html)
	    this.clearHTML(node).appendChild(a)
	}
	avalon.clearHTML = function (node) {
	    node.textContent = ""
	    while (node.firstChild) {
	        node.removeChild(node.firstChild)
	    }
	    return node
	}

	/*********************************************************************
	 *                  avalon的原型方法定义区                            *
	 **********************************************************************/

	function hyphen(target) {
	    //转换为连字符线风格
	    return target.replace(/([a-z\d])([A-Z]+)/g, "$1-$2").toLowerCase()
	}

	function camelize(target) {
	    //提前判断，提高getStyle等的效率
	    if (!target || target.indexOf("-") < 0 && target.indexOf("_") < 0) {
	        return target
	    }
	    //转换为驼峰风格
	    return target.replace(/[-_][^-_]/g, function (match) {
	        return match.charAt(1).toUpperCase()
	    })
	}

	var fakeClassListMethods = {
	    _toString: function () {
	        var node = this.node
	        var cls = node.className
	        var str = typeof cls === "string" ? cls : cls.baseVal
	        return str.split(/\s+/).join(" ")
	    },
	    _contains: function (cls) {
	        return (" " + this + " ").indexOf(" " + cls + " ") > -1
	    },
	    _add: function (cls) {
	        if (!this.contains(cls)) {
	            this._set(this + " " + cls)
	        }
	    },
	    _remove: function (cls) {
	        this._set((" " + this + " ").replace(" " + cls + " ", " "))
	    },
	    __set: function (cls) {
	            cls = cls.trim()
	            var node = this.node
	            if (rsvg.test(node)) {
	                //SVG元素的className是一个对象 SVGAnimatedString { baseVal="", animVal=""}，只能通过set/getAttribute操作
	                node.setAttribute("class", cls)
	            } else {
	                node.className = cls
	            }
	        } //toggle存在版本差异，因此不使用它
	}

	function fakeClassList(node) {
	    if (!("classList" in node)) {
	        node.classList = {
	            node: node
	        }
	        for (var k in fakeClassListMethods) {
	            node.classList[k.slice(1)] = fakeClassListMethods[k]
	        }
	    }
	    return node.classList
	}


	"add,remove".replace(rword, function (method) {
	    avalon.fn[method + "Class"] = function (cls) {
	        var el = this[0]
	            //https://developer.mozilla.org/zh-CN/docs/Mozilla/Firefox/Releases/26
	        if (cls && typeof cls === "string" && el && el.nodeType === 1) {
	            cls.replace(/\S+/g, function (c) {
	                fakeClassList(el)[method](c)
	            })
	        }
	        return this
	    }
	})
	avalon.fn.mix({
	    hasClass: function (cls) {
	        var el = this[0] || {}
	        return el.nodeType === 1 && fakeClassList(el).contains(cls)
	    },
	    toggleClass: function (value, stateVal) {
	        var className, i = 0
	        var classNames = String(value).split(/\s+/)
	        var isBool = typeof stateVal === "boolean"
	        while ((className = classNames[i++])) {
	            var state = isBool ? stateVal : !this.hasClass(className)
	            this[state ? "addClass" : "removeClass"](className)
	        }
	        return this
	    },
	    attr: function (name, value) {
	        if (arguments.length === 2) {
	            this[0].setAttribute(name, value)
	            return this
	        } else {
	            return this[0].getAttribute(name)
	        }
	    },
	    data: function (name, value) {
	        name = "data-" + hyphen(name || "")
	        switch (arguments.length) {
	        case 2:
	            this.attr(name, value)
	            return this
	        case 1:
	            var val = this.attr(name)
	            return parseData(val)
	        case 0:
	            var ret = {}
	            ap.forEach.call(this[0].attributes, function (attr) {
	                if (attr) {
	                    name = attr.name
	                    if (!name.indexOf("data-")) {
	                        name = camelize(name.slice(5))
	                        ret[name] = parseData(attr.value)
	                    }
	                }
	            })
	            return ret
	        }
	    },
	    removeData: function (name) {
	        name = "data-" + hyphen(name)
	        this[0].removeAttribute(name)
	        return this
	    },
	    css: function (name, value) {
	        if (avalon.isPlainObject(name)) {
	            for (var i in name) {
	                avalon.css(this, i, name[i])
	            }
	        } else {
	            var ret = avalon.css(this, name, value)
	        }
	        return ret !== void 0 ? ret : this
	    },
	    position: function () {
	        var offsetParent, offset,
	            elem = this[0],
	            parentOffset = {
	                top: 0,
	                left: 0
	            }
	        if (!elem) {
	            return
	        }
	        if (this.css("position") === "fixed") {
	            offset = elem.getBoundingClientRect()
	        } else {
	            offsetParent = this.offsetParent() //得到真正的offsetParent
	            offset = this.offset() // 得到正确的offsetParent
	            if (offsetParent[0].tagName !== "HTML") {
	                parentOffset = offsetParent.offset()
	            }
	            parentOffset.top += avalon.css(offsetParent[0], "borderTopWidth", true)
	            parentOffset.left += avalon.css(offsetParent[0], "borderLeftWidth", true)

	            // Subtract offsetParent scroll positions
	            parentOffset.top -= offsetParent.scrollTop()
	            parentOffset.left -= offsetParent.scrollLeft()
	        }
	        return {
	            top: offset.top - parentOffset.top - avalon.css(elem, "marginTop", true),
	            left: offset.left - parentOffset.left - avalon.css(elem, "marginLeft", true)
	        }
	    },
	    offsetParent: function () {
	        var offsetParent = this[0].offsetParent
	        while (offsetParent && avalon.css(offsetParent, "position") === "static") {
	            offsetParent = offsetParent.offsetParent;
	        }
	        return avalon(offsetParent || root)
	    },
	    bind: function (type, fn, phase) {
	        if (this[0]) { //此方法不会链
	            return avalon.bind(this[0], type, fn, phase)
	        }
	    },
	    unbind: function (type, fn, phase) {
	        if (this[0]) {
	            avalon.unbind(this[0], type, fn, phase)
	        }
	        return this
	    },
	    val: function (value) {
	        var node = this[0]
	        if (node && node.nodeType === 1) {
	            var get = arguments.length === 0
	            var access = get ? ":get" : ":set"
	            var fn = valHooks[getValType(node) + access]
	            if (fn) {
	                var val = fn(node, value)
	            } else if (get) {
	                return (node.value || "").replace(/\r/g, "")
	            } else {
	                node.value = value
	            }
	        }
	        return get ? val : this
	    }
	})

	function parseData(data) {
	    try {
	        if (typeof data === "object")
	            return data
	        data = data === "true" ? true :
	            data === "false" ? false :
	            data === "null" ? null : +data + "" === data ? +data : rbrace.test(data) ? avalon.parseJSON(data) : data
	    } catch (e) {}
	    return data
	}
	var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	    rvalidchars = /^[\],:{}\s]*$/,
	    rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	    rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	    rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g
	avalon.parseJSON = window.JSON ? JSON.parse : function (data) {
	    if (typeof data === "string") {
	        data = data.trim();
	        if (data) {
	            if (rvalidchars.test(data.replace(rvalidescape, "@")
	                    .replace(rvalidtokens, "]")
	                    .replace(rvalidbraces, ""))) {
	                return (new Function("return " + data))() // jshint ignore:line
	            }
	        }
	        avalon.error("Invalid JSON: " + data)
	    }
	    return data
	}

	//生成avalon.fn.scrollLeft, avalon.fn.scrollTop方法
	avalon.each({
	    scrollLeft: "pageXOffset",
	    scrollTop: "pageYOffset"
	}, function (method, prop) {
	    avalon.fn[method] = function (val) {
	        var node = this[0] || {},
	            win = getWindow(node),
	            top = method === "scrollTop"
	        if (!arguments.length) {
	            return win ? (prop in win) ? win[prop] : root[method] : node[method]
	        } else {
	            if (win) {
	                win.scrollTo(!top ? val : avalon(win).scrollLeft(), top ? val : avalon(win).scrollTop())
	            } else {
	                node[method] = val
	            }
	        }
	    }
	})

	function getWindow(node) {
	    return node.window && node.document ? node : node.nodeType === 9 ? node.defaultView || node.parentWindow : false;
	}
	//=============================css相关=======================
	var cssHooks = avalon.cssHooks = {}
	var prefixes = ["", "-webkit-", "-o-", "-moz-", "-ms-"]
	var cssMap = {
	    "float": W3C ? "cssFloat" : "styleFloat"
	}
	avalon.cssNumber = oneObject("animationIterationCount,columnCount,order,flex,flexGrow,flexShrink,fillOpacity,fontWeight,lineHeight,opacity,orphans,widows,zIndex,zoom")

	avalon.cssName = function (name, host, camelCase) {
	    if (cssMap[name]) {
	        return cssMap[name]
	    }
	    host = host || root.style
	    for (var i = 0, n = prefixes.length; i < n; i++) {
	        camelCase = camelize(prefixes[i] + name)
	        if (camelCase in host) {
	            return (cssMap[name] = camelCase)
	        }
	    }
	    return null
	}
	cssHooks["@:set"] = function (node, name, value) {
	    try { //node.style.width = NaN;node.style.width = "xxxxxxx";node.style.width = undefine 在旧式IE下会抛异常
	        node.style[name] = value
	    } catch (e) {}
	}
	if (window.getComputedStyle) {
	    cssHooks["@:get"] = function (node, name) {
	        if (!node || !node.style) {
	            throw new Error("getComputedStyle要求传入一个节点 " + node)
	        }
	        var ret, styles = getComputedStyle(node, null)
	        if (styles) {
	            ret = name === "filter" ? styles.getPropertyValue(name) : styles[name]
	            if (ret === "") {
	                ret = node.style[name] //其他浏览器需要我们手动取内联样式
	            }
	        }
	        return ret
	    }
	    cssHooks["opacity:get"] = function (node) {
	        var ret = cssHooks["@:get"](node, "opacity")
	        return ret === "" ? "1" : ret
	    }
	} else {
	    var rnumnonpx = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i
	    var rposition = /^(top|right|bottom|left)$/
	    var ralpha = /alpha\([^)]*\)/i
	    var ie8 = !!window.XDomainRequest
	    var salpha = "DXImageTransform.Microsoft.Alpha"
	    var border = {
	        thin: ie8 ? '1px' : '2px',
	        medium: ie8 ? '3px' : '4px',
	        thick: ie8 ? '5px' : '6px'
	    }
	    cssHooks["@:get"] = function (node, name) {
	        //取得精确值，不过它有可能是带em,pc,mm,pt,%等单位
	        var currentStyle = node.currentStyle
	        var ret = currentStyle[name]
	        if ((rnumnonpx.test(ret) && !rposition.test(ret))) {
	            //①，保存原有的style.left, runtimeStyle.left,
	            var style = node.style,
	                left = style.left,
	                rsLeft = node.runtimeStyle.left
	                //②由于③处的style.left = xxx会影响到currentStyle.left，
	                //因此把它currentStyle.left放到runtimeStyle.left，
	                //runtimeStyle.left拥有最高优先级，不会style.left影响
	            node.runtimeStyle.left = currentStyle.left
	                //③将精确值赋给到style.left，然后通过IE的另一个私有属性 style.pixelLeft
	                //得到单位为px的结果；fontSize的分支见http://bugs.jquery.com/ticket/760
	            style.left = name === 'fontSize' ? '1em' : (ret || 0)
	            ret = style.pixelLeft + "px"
	                //④还原 style.left，runtimeStyle.left
	            style.left = left
	            node.runtimeStyle.left = rsLeft
	        }
	        if (ret === "medium") {
	            name = name.replace("Width", "Style")
	                //border width 默认值为medium，即使其为0"
	            if (currentStyle[name] === "none") {
	                ret = "0px"
	            }
	        }
	        return ret === "" ? "auto" : border[ret] || ret
	    }
	    cssHooks["opacity:set"] = function (node, name, value) {
	        var style = node.style
	        var opacity = isFinite(value) && value <= 1 ? "alpha(opacity=" + value * 100 + ")" : ""
	        var filter = style.filter || "";
	        style.zoom = 1
	            //不能使用以下方式设置透明度
	            //node.filters.alpha.opacity = value * 100
	        style.filter = (ralpha.test(filter) ?
	            filter.replace(ralpha, opacity) :
	            filter + " " + opacity).trim()
	        if (!style.filter) {
	            style.removeAttribute("filter")
	        }
	    }
	    cssHooks["opacity:get"] = function (node) {
	        //这是最快的获取IE透明值的方式，不需要动用正则了！
	        var alpha = node.filters.alpha || node.filters[salpha],
	            op = alpha && alpha.enabled ? alpha.opacity : 100
	        return (op / 100) + "" //确保返回的是字符串
	    }
	}

	"top,left".replace(rword, function (name) {
	    cssHooks[name + ":get"] = function (node) {
	        var computed = cssHooks["@:get"](node, name)
	        return /px$/.test(computed) ? computed :
	            avalon(node).position()[name] + "px"
	    }
	})

	var cssShow = {
	    position: "absolute",
	    visibility: "hidden",
	    display: "block"
	}

	var rdisplayswap = /^(none|table(?!-c[ea]).+)/

	function showHidden(node, array) {
	    //http://www.cnblogs.com/rubylouvre/archive/2012/10/27/2742529.html
	    if (node.offsetWidth <= 0) { //opera.offsetWidth可能小于0
	        if (rdisplayswap.test(cssHooks["@:get"](node, "display"))) {
	            var obj = {
	                node: node
	            }
	            for (var name in cssShow) {
	                obj[name] = node.style[name]
	                node.style[name] = cssShow[name]
	            }
	            array.push(obj)
	        }
	        var parent = node.parentNode
	        if (parent && parent.nodeType === 1) {
	            showHidden(parent, array)
	        }
	    }
	}
	"Width,Height".replace(rword, function (name) { //fix 481
	    var method = name.toLowerCase(),
	        clientProp = "client" + name,
	        scrollProp = "scroll" + name,
	        offsetProp = "offset" + name
	    cssHooks[method + ":get"] = function (node, which, override) {
	        var boxSizing = -4
	        if (typeof override === "number") {
	            boxSizing = override
	        }
	        which = name === "Width" ? ["Left", "Right"] : ["Top", "Bottom"]
	        var ret = node[offsetProp] // border-box 0
	        if (boxSizing === 2) { // margin-box 2
	            return ret + avalon.css(node, "margin" + which[0], true) + avalon.css(node, "margin" + which[1], true)
	        }
	        if (boxSizing < 0) { // padding-box  -2
	            ret = ret - avalon.css(node, "border" + which[0] + "Width", true) - avalon.css(node, "border" + which[1] + "Width", true)
	        }
	        if (boxSizing === -4) { // content-box -4
	            ret = ret - avalon.css(node, "padding" + which[0], true) - avalon.css(node, "padding" + which[1], true)
	        }
	        return ret
	    }
	    cssHooks[method + "&get"] = function (node) {
	        var hidden = [];
	        showHidden(node, hidden);
	        var val = cssHooks[method + ":get"](node)
	        for (var i = 0, obj; obj = hidden[i++];) {
	            node = obj.node
	            for (var n in obj) {
	                if (typeof obj[n] === "string") {
	                    node.style[n] = obj[n]
	                }
	            }
	        }
	        return val;
	    }
	    avalon.fn[method] = function (value) { //会忽视其display
	        var node = this[0]
	        if (arguments.length === 0) {
	            if (node.setTimeout) { //取得窗口尺寸
	                return node["inner" + name] || 
	                       node.document.documentElement[clientProp] ||
	                       node.document.body[clientProp] //IE6下前两个分别为undefined,0
	            }
	            if (node.nodeType === 9) { //取得页面尺寸
	                var doc = node.documentElement
	                    //FF chrome    html.scrollHeight< body.scrollHeight
	                    //IE 标准模式 : html.scrollHeight> body.scrollHeight
	                    //IE 怪异模式 : html.scrollHeight 最大等于可视窗口多一点？
	                return Math.max(node.body[scrollProp], doc[scrollProp], node.body[offsetProp], doc[offsetProp], doc[clientProp])
	            }
	            return cssHooks[method + "&get"](node)
	        } else {
	            return this.css(method, value)
	        }
	    }
	    avalon.fn["inner" + name] = function () {
	        return cssHooks[method + ":get"](this[0], void 0, -2)
	    }
	    avalon.fn["outer" + name] = function (includeMargin) {
	        return cssHooks[method + ":get"](this[0], void 0, includeMargin === true ? 2 : 0)
	    }
	})
	avalon.fn.offset = function () { //取得距离页面左右角的坐标
	    var node = this[0],
	        box = {
	            left: 0,
	            top: 0
	        }
	    if (!node || !node.tagName || !node.ownerDocument) {
	        return box
	    }
	    var doc = node.ownerDocument,
	        body = doc.body,
	        root = doc.documentElement,
	        win = doc.defaultView || doc.parentWindow
	    if (!avalon.contains(root, node)) {
	        return box
	    }
	    //http://hkom.blog1.fc2.com/?mode=m&no=750 body的偏移量是不包含margin的
	    //我们可以通过getBoundingClientRect来获得元素相对于client的rect.
	    //http://msdn.microsoft.com/en-us/library/ms536433.aspx
	    if (node.getBoundingClientRect) {
	        box = node.getBoundingClientRect() // BlackBerry 5, iOS 3 (original iPhone)
	    }
	    //chrome/IE6: body.scrollTop, firefox/other: root.scrollTop
	    var clientTop = root.clientTop || body.clientTop,
	        clientLeft = root.clientLeft || body.clientLeft,
	        scrollTop = Math.max(win.pageYOffset || 0, root.scrollTop, body.scrollTop),
	        scrollLeft = Math.max(win.pageXOffset || 0, root.scrollLeft, body.scrollLeft)
	        // 把滚动距离加到left,top中去。
	        // IE一些版本中会自动为HTML元素加上2px的border，我们需要去掉它
	        // http://msdn.microsoft.com/en-us/library/ms533564(VS.85).aspx
	    return {
	        top: box.top + scrollTop - clientTop,
	        left: box.left + scrollLeft - clientLeft
	    }
	}

	//==================================val相关============================

	function getValType(elem) {
	    var ret = elem.tagName.toLowerCase()
	    return ret === "input" && /checkbox|radio/.test(elem.type) ? "checked" : ret
	}
	var roption = /^<option(?:\s+\w+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*\s+value[\s=]/i
	var valHooks = {
	    "option:get": IEVersion ? function (node) {
	        //在IE11及W3C，如果没有指定value，那么node.value默认为node.text（存在trim作），但IE9-10则是取innerHTML(没trim操作)
	        //specified并不可靠，因此通过分析outerHTML判定用户有没有显示定义value
	        return roption.test(node.outerHTML) ? node.value : node.text.trim()
	    } : function (node) {
	        return node.value
	    },
	    "select:get": function (node, value) {
	        var option, options = node.options,
	            index = node.selectedIndex,
	            getter = valHooks["option:get"],
	            one = node.type === "select-one" || index < 0,
	            values = one ? null : [],
	            max = one ? index + 1 : options.length,
	            i = index < 0 ? max : one ? index : 0
	        for (; i < max; i++) {
	            option = options[i]
	                //旧式IE在reset后不会改变selected，需要改用i === index判定
	                //我们过滤所有disabled的option元素，但在safari5下，如果设置select为disable，那么其所有孩子都disable
	                //因此当一个元素为disable，需要检测其是否显式设置了disable及其父节点的disable情况
	            if ((option.selected || i === index) && !option.disabled) {
	                value = getter(option)
	                if (one) {
	                    return value
	                }
	                //收集所有selected值组成数组返回
	                values.push(value)
	            }
	        }
	        return values
	    },
	    "select:set": function (node, values, optionSet) {
	        values = [].concat(values) //强制转换为数组
	        var getter = valHooks["option:get"]
	        for (var i = 0, el; el = node.options[i++];) {
	            if ((el.selected = values.indexOf(getter(el)) > -1)) {
	                optionSet = true
	            }
	        }
	        if (!optionSet) {
	            node.selectedIndex = -1
	        }
	    }
	}

	var keyMap = {}
	var keys = ["break,case,catch,continue,debugger,default,delete,do,else,false",
	    "finally,for,function,if,in,instanceof,new,null,return,switch,this",
	    "throw,true,try,typeof,var,void,while,with", /* 关键字*/
	    "abstract,boolean,byte,char,class,const,double,enum,export,extends",
	    "final,float,goto,implements,import,int,interface,long,native",
	    "package,private,protected,public,short,static,super,synchronized",
	    "throws,transient,volatile", /*保留字*/
	    "arguments,let,yield,undefined"].join(",")
	keys.replace(/\w+/g, function (a) {
	    keyMap[a] = true
	})
	var ridentStart = /[a-z_$]/i
	var rwhiteSpace = /[\s\uFEFF\xA0]/
	function getIdent(input, lastIndex) {
	    var result = []
	    var subroutine = !!lastIndex
	    lastIndex = lastIndex || 0

	    //将表达式中的标识符抽取出来
	    var state = "unknown"
	    var variable = ""
	    for (var i = 0; i < input.length; i++) {
	        var c = input.charAt(i)
	        if (c === "'" || c === '"') {//字符串开始
	            if (state === "unknown") {
	                state = c
	            } else if (state === c) {//字符串结束
	                state = "unknown"
	            }
	        } else if (c === "\\") {
	            if (state === "'" || state === '"') {
	                i++
	            }
	        } else if (ridentStart.test(c)) {//碰到标识符
	            if (state === "unknown") {
	                state = "variable"
	                variable = c
	            } else if (state === "maybePath") {
	                variable = result.pop()
	                variable += "." + c
	                state = "variable"
	            } else if (state === "variable") {
	                variable += c
	            }
	        } else if (/\w/.test(c)) {
	            if (state === "variable") {
	                variable += c
	            }
	        } else if (c === ".") {
	            if (state === "variable") {
	                if (variable) {
	                    result.push(variable)
	                    variable = ""
	                    state = "maybePath"
	                }
	            }
	        } else if (c === "[") {
	            if (state === "variable" || state === "maybePath") {
	                if (variable) {//如果前面存在变量,收集它
	                    result.push(variable)
	                    variable = ""
	                }
	                var lastLength = result.length
	                var last = result[lastLength - 1]
	                var innerResult = getIdent(input.slice(i), i)
	                if (innerResult.length) {//如果括号中存在变量,那么这里添加通配符
	                    result[lastLength - 1] = last + ".*"
	                    result = innerResult.concat(result)
	                } else { //如果括号中的东西是确定的,直接转换为其子属性
	                    var content = input.slice(i + 1, innerResult.i)
	                    try {
	                        var text = (scpCompile(["return " + content]))()
	                        result[lastLength - 1] = last + "." + text
	                    } catch (e) {
	                    }
	                }
	                state = "maybePath"//]后面可能还接东西
	                i = innerResult.i
	            }
	        } else if (c === "]") {
	            if (subroutine) {
	                result.i = i + lastIndex
	                addVar(result, variable)
	                return result
	            }
	        } else if (rwhiteSpace.test(c) && c !== "\r" && c !== "\n") {
	            if (state === "variable") {
	                if (addVar(result, variable)) {
	                    state = "maybePath" // aaa . bbb 这样的情况
	                }
	                variable = ""
	            }
	        } else {
	            addVar(result, variable)
	            state = "unknown"
	            variable = ""
	        }
	    }
	    addVar(result, variable)
	    return result
	}
	function addVar(array, element) {
	    if (element && !keyMap[element]) {
	        array.push(element)
	        return true
	    }
	}
	function addAssign(vars, vmodel, name, binding) {
	    var ret = [],
	            prefix = " = " + name + "."
	    for (var i = vars.length, prop; prop = vars[--i]; ) {
	        var arr = prop.split("."), a
	        var first = arr[0]
	        while (a = arr.shift()) {
	            if (vmodel.hasOwnProperty(a)) {
	                ret.push(first + prefix + first)

	                binding.observers.push({
	                    v: vmodel,
	                    p: prop
	                })

	                vars.splice(i, 1)
	            }
	        }
	    }
	    return ret
	}
	var rproxy = /(\$proxy\$[a-z]+)\d+$/
	var variablePool = new Cache(218)
	//缓存求值函数，以便多次利用
	var evaluatorPool = new Cache(128)

	function getVars(expr) {
	    expr = expr.trim()
	    var ret = variablePool.get(expr)
	    if (ret) {
	        return ret.concat()
	    }
	    var array = getIdent(expr)
	    var uniq = {}
	    var result = []
	    for (var i = 0, el; el = array[i++]; ) {
	        if (!uniq[el]) {
	            uniq[el] = 1
	            result.push(el)
	        }
	    }
	    return variablePool.put(expr, result).concat()
	}

	function parseExpr(expr, vmodels, binding) {
	    var filters = binding.filters
	    if (typeof filters === "string" && filters.trim() && !binding._filters) {
	        binding._filters = parseFilter(filters.trim())
	    }

	    var vars = getVars(expr)

	    var expose = new Date() - 0
	    var assigns = []
	    var names = []
	    var args = []
	    binding.observers = []
	    for (var i = 0, sn = vmodels.length; i < sn; i++) {
	        if (vars.length) {
	            var name = "vm" + expose + "_" + i
	            names.push(name)
	            args.push(vmodels[i])
	            assigns.push.apply(assigns, addAssign(vars, vmodels[i], name, binding))
	        }
	    }
	    binding.args = args
	    var dataType = binding.type
	    var exprId = vmodels.map(function (el) {
	        return String(el.$id).replace(rproxy, "$1")
	    }) + expr + dataType
	    var getter = evaluatorPool.get(exprId) //直接从缓存，免得重复生成
	    if (getter) {
	        if (dataType === "duplex") {
	            var setter = evaluatorPool.get(exprId + "setter")
	            binding.setter = setter.apply(setter, binding.args)
	        }
	        return binding.getter = getter
	    }

	    if (!assigns.length) {
	        assigns.push("fix" + expose)
	    }

	    if (dataType === "duplex") {
	        var nameOne = {}
	        assigns.forEach(function (a) {
	            var arr = a.split("=")
	            nameOne[arr[0].trim()] = arr[1].trim()
	        })
	        expr = expr.replace(/[\$\w]+/, function (a) {
	            return nameOne[a] ? nameOne[a] : a
	        })
	        /* jshint ignore:start */
	        var fn2 = scpCompile(names.concat("'use strict';" +
	                "return function(vvv){" + expr + " = vvv\n}\n"))
	        /* jshint ignore:end */
	        evaluatorPool.put(exprId + "setter", fn2)
	        binding.setter = fn2.apply(fn2, binding.args)
	    }

	    if (dataType === "on") { //事件绑定
	        if (expr.indexOf("(") === -1) {
	            expr += ".call(this, $event)"
	        } else {
	            expr = expr.replace("(", ".call(this,")
	        }
	        names.push("$event")
	        expr = "\nreturn " + expr + ";" //IE全家 Function("return ")出错，需要Function("return ;")
	        var lastIndex = expr.lastIndexOf("\nreturn")
	        var header = expr.slice(0, lastIndex)
	        var footer = expr.slice(lastIndex)
	        expr = header + "\n" + footer
	    } else {
	        expr = "\nreturn " + expr + ";" //IE全家 Function("return ")出错，需要Function("return ;")
	    }
	    /* jshint ignore:start */
	    getter = scpCompile(names.concat("'use strict';\nvar " +
	            assigns.join(",\n") + expr))
	    /* jshint ignore:end */

	    return  evaluatorPool.put(exprId, getter)

	}
	//========

	function normalizeExpr(code) {
	    var hasExpr = rexpr.test(code) //比如ms-class="width{{w}}"的情况
	    if (hasExpr) {
	        var array = scanExpr(code)
	        if (array.length === 1) {
	            return array[0].expr
	        }
	        return array.map(function (el) {
	            return el.type ? "(" + el.expr + ")" : quote(el.expr)
	        }).join(" + ")
	    } else {
	        return code
	    }
	}

	avalon.normalizeExpr = normalizeExpr
	avalon.parseExprProxy = parseExpr

	var rthimRightParentheses = /\)\s*$/
	var rthimOtherParentheses = /\)\s*\|/g
	var rquoteFilterName = /\|\s*([$\w]+)/g
	var rpatchBracket = /"\s*\["/g
	var rthimLeftParentheses = /"\s*\(/g
	function parseFilter(filters) {
	    filters = filters
	            .replace(rthimRightParentheses, "")//处理最后的小括号
	            .replace(rthimOtherParentheses, function () {//处理其他小括号
	                return "],|"
	            })
	            .replace(rquoteFilterName, function (a, b) { //处理|及它后面的过滤器的名字
	                return "[" + quote(b)
	            })
	            .replace(rpatchBracket, function () {
	                return '"],["'
	            })
	            .replace(rthimLeftParentheses, function () {
	                return '",'
	            }) + "]"
	    /* jshint ignore:start */
	    return  scpCompile(["return [" + filters + "]"])()
	    /* jshint ignore:end */

	}
	/*********************************************************************
	 *                          编译系统                                  *
	 **********************************************************************/
	var meta = {
	    '\b': '\\b',
	    '\t': '\\t',
	    '\n': '\\n',
	    '\f': '\\f',
	    '\r': '\\r',
	    '"': '\\"',
	    '\\': '\\\\'
	}
	var quote = window.JSON && JSON.stringify || function(str) {
	    return '"' + str.replace(/[\\\"\x00-\x1f]/g, function(a) {
	        var c = meta[a];
	        return typeof c === 'string' ? c :
	                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	    }) + '"'
	}
	/*********************************************************************
	 *                           扫描系统                                 *
	 **********************************************************************/

	avalon.scan = function (elem, vmodel) {
	    elem = elem || root
	    var vmodels = vmodel ? [].concat(vmodel) : []
	    scanTag(elem, vmodels)
	}

	//http://www.w3.org/TR/html5/syntax.html#void-elements
	var stopScan = oneObject("area,base,basefont,br,col,command,embed,hr,img,input,link,meta,param,source,track,wbr,noscript,script,style,textarea".toUpperCase())

	function checkScan(elem, callback, innerHTML) {
	    var id = setTimeout(function () {
	        var currHTML = elem.innerHTML
	        clearTimeout(id)
	        if (currHTML === innerHTML) {
	            callback()
	        } else {
	            checkScan(elem, callback, currHTML)
	        }
	    })
	}


	function createSignalTower(elem, vmodel) {
	    var id = elem.getAttribute("avalonctrl") || vmodel.$id
	    elem.setAttribute("avalonctrl", id)
	    if (vmodel.$events) {
	        vmodel.$events.expr = elem.tagName + '[avalonctrl="' + id + '"]'
	    }
	}

	var getBindingCallback = function (elem, name, vmodels) {
	    var callback = elem.getAttribute(name)
	    if (callback) {
	        for (var i = 0, vm; vm = vmodels[i++]; ) {
	            if (vm.hasOwnProperty(callback) && typeof vm[callback] === "function") {
	                return vm[callback]
	            }
	        }
	    }
	}

	function executeBindings(bindings, vmodels) {
	    for (var i = 0, binding; binding = bindings[i++]; ) {
	        binding.vmodels = vmodels
	        directives[binding.type].init(binding)
	      
	        avalon.injectBinding(binding)
	        if (binding.getter && binding.element.nodeType === 1) { //移除数据绑定，防止被二次解析
	            //chrome使用removeAttributeNode移除不存在的特性节点时会报错 https://github.com/RubyLouvre/avalon/issues/99
	            binding.element.removeAttribute(binding.name)
	        }
	    }
	    bindings.length = 0
	}

	//https://github.com/RubyLouvre/avalon/issues/636
	var mergeTextNodes = IEVersion && window.MutationObserver ? function (elem) {
	    var node = elem.firstChild, text
	    while (node) {
	        var aaa = node.nextSibling
	        if (node.nodeType === 3) {
	            if (text) {
	                text.nodeValue += node.nodeValue
	                elem.removeChild(node)
	            } else {
	                text = node
	            }
	        } else {
	            text = null
	        }
	        node = aaa
	    }
	} : 0
	var roneTime = /^\s*::/
	var rmsAttr = /ms-(\w+)-?(.*)/

	var events = oneObject("animationend,blur,change,input,click,dblclick,focus,keydown,keypress,keyup,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,scan,scroll,submit")
	var obsoleteAttrs = oneObject("value,title,alt,checked,selected,disabled,readonly,enabled,href,src")
	function bindingSorter(a, b) {
	    return a.priority - b.priority
	}

	function scanAttr(elem, vmodels, match) {
	    var scanNode = true
	    if (vmodels.length) {
	        var attributes = getAttributes ? getAttributes(elem) : elem.attributes
	        var bindings = []
	        var uniq = {}
	        for (var i = 0, attr; attr = attributes[i++]; ) {
	            var name = attr.name
	            if (uniq[name]) {//IE8下ms-repeat,ms-with BUG
	                continue
	            }
	            uniq[name] = 1
	            if (attr.specified) {
	                if (match = name.match(rmsAttr)) {
	                    //如果是以指定前缀命名的
	                    var type = match[1]
	                    var param = match[2] || ""
	                    var value = attr.value
	                    if (events[type]) {
	                        param = type
	                        type = "on"
	                    } else if (obsoleteAttrs[type]) {
	                        param = type
	                        type = "attr"
	                        name = "ms-" + type + "-" + param
	                        log("warning!请改用" + name + "代替" + attr.name + "!")
	                    }
	                    if (directives[type]) {
	                        var newValue = value.replace(roneTime, "")
	                        var oneTime = value !== newValue
	                        var binding = {
	                            type: type,
	                            param: param,
	                            element: elem,
	                            name: name,
	                            expr: newValue,
	                            oneTime: oneTime,
	                            uniqueNumber: attr.name + "-" + getUid(elem),
	                            //chrome与firefox下Number(param)得到的值不一样 #855
	                            priority: (directives[type].priority || type.charCodeAt(0) * 10) + (Number(param.replace(/\D/g, "")) || 0)
	                        }
	                        if (type === "html" || type === "text") {

	                            var filters = getToken(value).filters
	                            binding.expr = binding.expr.replace(filters, "")

	                            binding.filters = filters.replace(rhasHtml, function () {
	                                binding.type = "html"
	                                binding.group = 1
	                                return ""
	                            }).trim() // jshint ignore:line
	                        } else if (type === "duplex") {
	                            var hasDuplex = name
	                        } else if (name === "ms-if-loop") {
	                            binding.priority += 100
	                        } else if (name === "ms-attr-value") {
	                            var hasAttrValue = name
	                        }
	                        bindings.push(binding)
	                    }
	                }
	            }
	        }
	        if (bindings.length) {
	            bindings.sort(bindingSorter)
	            //http://bugs.jquery.com/ticket/7071
	            //在IE下对VML读取type属性,会让此元素所有属性都变成<Failed>
	            if (hasDuplex && hasAttrValue && elem.nodeName === "INPUT" && elem.type === "text") {
	                log("warning!一个控件不能同时定义ms-attr-value与" + hasDuplex)
	            }
	            for (i = 0; binding = bindings[i]; i++) {
	                type = binding.type
	                if (rnoscanAttrBinding.test(type)) {
	                    return executeBindings(bindings.slice(0, i + 1), vmodels)
	                } else if (scanNode) {
	                    scanNode = !rnoscanNodeBinding.test(type)
	                }
	            }

	            executeBindings(bindings, vmodels)
	        }
	    }
	    if (scanNode && !stopScan[elem.tagName] && (isWidget(elem) ? elem.msResolved : 1)) {
	        mergeTextNodes && mergeTextNodes(elem)
	        scanNodeList(elem, vmodels) //扫描子孙元素

	    }
	}
	var rnoscanAttrBinding = /^if|widget|repeat$/
	var rnoscanNodeBinding = /^each|with|html|include$/
	//IE67下，在循环绑定中，一个节点如果是通过cloneNode得到，自定义属性的specified为false，无法进入里面的分支，
	//但如果我们去掉scanAttr中的attr.specified检测，一个元素会有80+个特性节点（因为它不区分固有属性与自定义属性），很容易卡死页面
	if (!W3C) {
	    var attrPool = new Cache(512)
	    var rattrs = /\s+([^=\s]+)(?:=("[^"]*"|'[^']*'|[^\s>]+))?/g,
	            rquote = /^['"]/,
	            rtag = /<\w+\b(?:(["'])[^"]*?(\1)|[^>])*>/i,
	            ramp = /&amp;/g
	//IE6-8解析HTML5新标签，会将它分解两个元素节点与一个文本节点
	//<body><section>ddd</section></body>
	//        window.onload = function() {
	//            var body = document.body
	//            for (var i = 0, el; el = body.children[i++]; ) {
	//                avalon.log(el.outerHTML)
	//            }
	//        }
	//依次输出<SECTION>, </SECTION>
	    var getAttributes = function (elem) {
	        var html = elem.outerHTML
	        //处理IE6-8解析HTML5新标签的情况，及<br>等半闭合标签outerHTML为空的情况
	        if (html.slice(0, 2) === "</" || !html.trim()) {
	            return []
	        }
	        var str = html.match(rtag)[0]
	        var attributes = [],
	                k, v
	        var ret = attrPool.get(str)
	        if (ret) {
	            return ret
	        }
	        while (k = rattrs.exec(str)) {
	            v = k[2]
	            if (v) {
	                v = (rquote.test(v) ? v.slice(1, -1) : v).replace(ramp, "&")
	            }
	            var name = k[1].toLowerCase()
	            match = name.match(rmsAttr)
	            var binding = {
	                name: name,
	                specified: true,
	                value: v || ""
	            }
	            attributes.push(binding)
	        }
	        return attrPool.put(str, attributes)
	    }
	}

	var rnoCollect = /^(ms-\S+|data-\S+|on[a-z]+|id|style|class|tabindex)$/
	function getOptionsFromTag(elem) {
	    var attributes = getAttributes ? getAttributes(elem) : elem.attributes
	    var ret = {}
	    for (var i = 0, attr; attr = attributes[i++]; ) {
	        if (attr.specified && !rnoCollect.test(attr.name)) {
	            ret[camelize(attr.name)] = parseData(attr.value)
	        }
	    }
	    return ret
	}
	function scanNodeList(parent, vmodels) {
	    var nodes = avalon.slice(parent.childNodes)
	    scanNodeArray(nodes, vmodels)
	}


	function scanNodeArray(nodes, vmodels) {
	    for (var i = 0, node; node = nodes[i++]; ) {
	        switch (node.nodeType) {
	            case 1:
	                var elem = node, fn
	                if (!elem.msResolved && elem.parentNode && elem.parentNode.nodeType === 1) {
	                    var library = isWidget(elem)
	                    if (library) {
	                        var widget = elem.localName ? elem.localName.replace(library + ":", "") : elem.nodeName
	                        var fullName = library + ":" + camelize(widget)
	                        componentQueue.push({
	                            library: library,
	                            element: elem,
	                            fullName: fullName,
	                            widget: widget,
	                            vmodels: vmodels,
	                            name: "widget"
	                        })
	                        if (avalon.components[fullName]) {
	                            avalon.component(fullName)
	                        }
	                    }
	                }
	                 scanTag(node, vmodels) //扫描元素节点
	                if (node.msHasEvent) {
	                    avalon.fireDom(node, "datasetchanged", {
	                        bubble: node.msHasEvent
	                    })
	                }

	                break
	            case 3:
	                if (rexpr.test(node.nodeValue)) {
	                    scanText(node, vmodels, i) //扫描文本节点
	                }
	                break
	        }

	    }
	}


	function scanTag(elem, vmodels, node) {
	    //扫描顺序  ms-skip(0) --> ms-important(1) --> ms-controller(2) --> ms-if(10) --> ms-repeat(100)
	    //--> ms-if-loop(110) --> ms-attr(970) ...--> ms-each(1400)-->ms-with(1500)--〉ms-duplex(2000)垫后
	    var a = elem.getAttribute("ms-skip")
	    //#360 在旧式IE中 Object标签在引入Flash等资源时,可能出现没有getAttributeNode,innerHTML的情形
	    if (!elem.getAttributeNode) {
	        return log("warning " + elem.tagName + " no getAttributeNode method")
	    }
	    var b = elem.getAttributeNode("ms-important")
	    var c = elem.getAttributeNode("ms-controller")
	    if (typeof a === "string") {
	        return
	    } else if (node = b || c) {
	        var newVmodel = avalon.vmodels[node.value]
	        if (!newVmodel) {
	            return
	        }
	        //ms-important不包含父VM，ms-controller相反
	        vmodels = node === b ? [newVmodel] : [newVmodel].concat(vmodels)
	        var name = node.name
	        elem.removeAttribute(name) //removeAttributeNode不会刷新[ms-controller]样式规则
	        avalon(elem).removeClass(name)
	        createSignalTower(elem, newVmodel)
	    }
	   
	    scanAttr(elem, vmodels) //扫描特性节点
	}



	var rhasHtml = /\|\s*html(?:\b|$)/,
	    r11a = /\|\|/g,
	    rlt = /&lt;/g,
	    rgt = /&gt;/g,
	    rstringLiteral = /(['"])(\\\1|.)+?\1/g

	function getToken(value) {
	    if (value.indexOf("|") > 0) {
	        var scapegoat = value.replace(rstringLiteral, function (_) {
	            return Array(_.length + 1).join("1") // jshint ignore:line
	        })
	        var index = scapegoat.replace(r11a, "\u1122\u3344").indexOf("|") //干掉所有短路或
	        if (index > -1) {
	            return {
	                type: "text",
	                filters: value.slice(index).trim(),
	                expr: value.slice(0, index)
	            }
	        }
	    }
	    return {
	        type: "text",
	        expr: value,
	        filters: ""
	    }
	}

	function scanExpr(str) {
	    var tokens = [],
	        value, start = 0,
	        stop
	    do {
	        stop = str.indexOf(openTag, start)
	        if (stop === -1) {
	            break
	        }
	        value = str.slice(start, stop)
	        if (value) { // {{ 左边的文本
	            tokens.push({
	                expr: value
	            })
	        }
	        start = stop + openTag.length
	        stop = str.indexOf(closeTag, start)
	        if (stop === -1) {
	            break
	        }
	        value = str.slice(start, stop)
	        if (value) { //处理{{ }}插值表达式
	            tokens.push(getToken(value, start))
	        }
	        start = stop + closeTag.length
	    } while (1)
	    value = str.slice(start)
	    if (value) { //}} 右边的文本
	        tokens.push({
	            expr: value
	        })
	    }
	    return tokens
	}

	function scanText(textNode, vmodels, index) {
	    var bindings = [],
	    tokens = scanExpr(textNode.data)
	    if (tokens.length) {
	        for (var i = 0, token; token = tokens[i++];) {
	            var node = DOC.createTextNode(token.expr) //将文本转换为文本节点，并替换原来的文本节点
	            if (token.type) {
	                token.expr = token.expr.replace(roneTime, function () {
	                        token.oneTime = true
	                        return ""
	                    }) // jshint ignore:line
	                token.element = node
	                token.filters = token.filters.replace(rhasHtml, function () {
	                        token.type = "html"
	                        return ""
	                    }) // jshint ignore:line
	                token.pos = index * 1000 + i
	                bindings.push(token) //收集带有插值表达式的文本
	            }
	            avalonFragment.appendChild(node)
	        }
	        textNode.parentNode.replaceChild(avalonFragment, textNode)
	        if (bindings.length)
	            executeBindings(bindings, vmodels)
	    }
	}



	//使用来自游戏界的双缓冲技术,减少对视图的冗余刷新
	var Buffer = function () {
	    this.queue = []
	}
	Buffer.prototype = {
	    render: function (isAnimate) {
	        if (!this.locked) {
	            this.locked = isAnimate ? root.offsetHeight + 10 : 1
	            var me = this
	            avalon.nextTick(function () {
	                me.flush()
	            })
	        }
	    },
	    flush: function () {
	        for (var i = 0, sub; sub = this.queue[i++]; ) {
	            sub.update && sub.update()
	        }
	        this.locked = 0
	        this.queue = []
	    }
	}

	var buffer = new Buffer()
	var componentQueue = []
	var widgetList = []
	var componentHooks = {
	    $construct: function () {
	        return avalon.mix.apply(null, arguments)
	    },
	    $ready: noop,
	    $init: noop,
	    $dispose: noop,
	    $container: null,
	    $childReady: noop,
	    $replace: false,
	    $extend: null,
	    $$template: function (str) {
	        return str
	    }
	}


	avalon.components = {}
	avalon.component = function (name, opts) {
	    if (opts) {
	        avalon.components[name] = avalon.mix({}, componentHooks, opts)
	    }
	    for (var i = 0, obj; obj = componentQueue[i]; i++) {
	        if (name === obj.fullName) {
	            componentQueue.splice(i, 1)
	            i--;

	            (function (host, hooks, elem, widget) {

	                var dependencies = 1
	                var library = host.library
	                var global = avalon.libraries[library] || componentHooks

	                //===========收集各种配置=======

	                var elemOpts = getOptionsFromTag(elem)
	                var vmOpts = getOptionsFromVM(host.vmodels, elemOpts.config || host.widget)
	                var $id = elemOpts.$id || elemOpts.identifier || generateID(widget)
	                delete elemOpts.config
	                delete elemOpts.$id
	                delete elemOpts.identifier
	                var componentDefinition = {}

	                var parentHooks = avalon.components[hooks.$extend]
	                if (parentHooks) {
	                    avalon.mix(true, componentDefinition, parentHooks)
	                    componentDefinition = parentHooks.$construct.call(elem, componentDefinition, {}, {})
	                } else {
	                    avalon.mix(true, componentDefinition, hooks)
	                }
	                componentDefinition = avalon.components[name].$construct.call(elem, componentDefinition, vmOpts, elemOpts)

	                componentDefinition.$refs = {}
	                componentDefinition.$id = $id

	                //==========构建VM=========
	                var keepSlot = componentDefinition.$slot
	                var keepReplace = componentDefinition.$replace
	                var keepContainer = componentDefinition.$container
	                var keepTemplate = componentDefinition.$template
	                delete componentDefinition.$slot
	                delete componentDefinition.$replace
	                delete componentDefinition.$container
	                delete componentDefinition.$construct

	                var vmodel = avalon.define(componentDefinition) || {}
	                elem.msResolved = 1
	                vmodel.$init(vmodel, elem)
	                global.$init(vmodel, elem)
	                var nodes = elem.childNodes
	                //收集插入点
	                var slots = {}, snode
	                for (var s = 0, el; el = nodes[s++]; ) {
	                    var type = el.nodeType === 1 && el.getAttribute("slot") || keepSlot
	                    if (type) {
	                        if (slots[type]) {
	                            slots[type].push(el)
	                        } else {
	                            slots[type] = [el]
	                        }
	                    }
	                }


	                if (vmodel.$$template) {
	                    avalon.clearHTML(elem)
	                    elem.innerHTML = vmodel.$$template(keepTemplate)
	                }
	                for (s in slots) {
	                    if (vmodel.hasOwnProperty(s)) {
	                        var ss = slots[s]
	                        if (ss.length) {
	                            var fragment = avalonFragment.cloneNode(true)
	                            for (var ns = 0; snode = ss[ns++]; ) {
	                                fragment.appendChild(snode)
	                            }
	                            vmodel[s] = fragment
	                        }
	                        slots[s] = null
	                    }
	                }
	                slots = null
	                var child = elem.firstChild
	                if (keepReplace) {
	                    child = elem.firstChild
	                    elem.parentNode.replaceChild(child, elem)
	                    child.msResolved = 1
	                    elem = host.element = child
	                }
	                if (keepContainer) {
	                    keepContainer.appendChild(elem)
	                }
	                avalon.fireDom(elem, "datasetchanged",
	                        {library: library, vm: vmodel, childReady: 1})
	                var children = 0
	                var removeFn = avalon.bind(elem, "datasetchanged", function (e) {
	                    if (e.childReady && e.library === library) {
	                        dependencies += e.childReady
	                        if (vmodel !== e.vm) {
	                            vmodel.$refs[e.vm.$id] = e.vm
	                            if (e.childReady === -1) {
	                                children++
	                                vmodel.$childReady(vmodel, elem, e)
	                            }
	                            e.stopPropagation()
	                        }
	                    }
	                    if (dependencies === 0) {
	                        var id1 = setTimeout(function () {
	                            clearTimeout(id1)
	                            
	                            vmodel.$ready(vmodel, elem, host.vmodels)
	                            global.$ready(vmodel, elem, host.vmodels)
	                        }, children ? Math.max(children * 17, 100) : 17)
	                        avalon.unbind(elem, "datasetchanged", removeFn)
	                        //==================
	                        host.rollback = function () {
	                            try {
	                                vmodel.$dispose(vmodel, elem)
	                                global.$dispose(vmodel, elem)
	                            } catch (e) {
	                            }
	                            delete avalon.vmodels[vmodel.$id]
	                        }
	                        injectDisposeQueue(host, widgetList)
	                        if (window.chrome) {
	                            elem.addEventListener("DOMNodeRemovedFromDocument", function () {
	                                setTimeout(rejectDisposeQueue)
	                            })
	                        }

	                    }
	                })
	                scanTag(elem, [vmodel].concat(host.vmodels))

	                avalon.vmodels[vmodel.$id] = vmodel
	                if (!elem.childNodes.length) {
	                    avalon.fireDom(elem, "datasetchanged", {library: library, vm: vmodel, childReady: -1})
	                } else {
	                    var id2 = setTimeout(function () {
	                        clearTimeout(id2)
	                        avalon.fireDom(elem, "datasetchanged", {library: library, vm: vmodel, childReady: -1})
	                    }, 17)
	                }


	            })(obj, avalon.components[name], obj.element, obj.widget)// jshint ignore:line


	        }
	    }
	}

	avalon.fireDom = function (elem, type, opts) {
	    if (DOC.createEvent) {
	        var hackEvent = DOC.createEvent("Events");
	        hackEvent.initEvent(type, true, true, opts)
	        avalon.mix(hackEvent, opts)

	        elem.dispatchEvent(hackEvent)
	    } else if (root.contains(elem)) {//IE6-8触发事件必须保证在DOM树中,否则报"SCRIPT16389: 未指明的错误"
	        hackEvent = DOC.createEventObject()
	        avalon.mix(hackEvent, opts)
	        elem.fireEvent("on" + type, hackEvent)
	    }
	}


	function getOptionsFromVM(vmodels, pre) {
	    if (pre) {
	        for (var i = 0, v; v = vmodels[i++]; ) {
	            if (v.hasOwnProperty(pre) && typeof v[pre] === "object") {
	                var vmOptions = v[pre]
	                return vmOptions.$model || vmOptions
	                break
	            }
	        }
	    }
	    return {}
	}



	avalon.libraries = []
	avalon.library = function (name, opts) {
	    if (DOC.namespaces) {
	        DOC.namespaces.add(name, 'http://www.w3.org/1999/xhtml');
	    }
	    avalon.libraries[name] = avalon.mix({
	        $init: noop,
	        $ready: noop,
	        $dispose: noop
	    }, opts || {})
	}

	avalon.library("ms")
	/*
	broswer  nodeName  scopeName  localName
	IE9     ONI:BUTTON oni        button
	IE10    ONI:BUTTON undefined  oni:button
	IE8     button     oni        undefined
	chrome  ONI:BUTTON undefined  oni:button

	*/
	function isWidget(el) { //如果为自定义标签,返回UI库的名字
	    if(el.scopeName && el.scopeName !== "HTML" ){
	        return el.scopeName
	    }
	    var fullName = el.nodeName.toLowerCase() 
	    var index = fullName.indexOf(":")
	    if (index > 0) {
	        return fullName.slice(0, index)
	    }
	}
	//各种MVVM框架在大型表格下的性能测试
	// https://github.com/RubyLouvre/avalon/issues/859


	var bools = ["autofocus,autoplay,async,allowTransparency,checked,controls",
	    "declare,disabled,defer,defaultChecked,defaultSelected",
	    "contentEditable,isMap,loop,multiple,noHref,noResize,noShade",
	    "open,readOnly,selected"
	].join(",")
	var boolMap = {}
	bools.replace(rword, function (name) {
	    boolMap[name.toLowerCase()] = name
	})

	var propMap = {//属性名映射
	    "accept-charset": "acceptCharset",
	    "char": "ch",
	    "charoff": "chOff",
	    "class": "className",
	    "for": "htmlFor",
	    "http-equiv": "httpEquiv"
	}

	var anomaly = ["accessKey,bgColor,cellPadding,cellSpacing,codeBase,codeType,colSpan",
	    "dateTime,defaultValue,frameBorder,longDesc,maxLength,marginWidth,marginHeight",
	    "rowSpan,tabIndex,useMap,vSpace,valueType,vAlign"
	].join(",")
	anomaly.replace(rword, function (name) {
	    propMap[name.toLowerCase()] = name
	})


	var attrDir = avalon.directive("attr", {
	    init: function (binding) {
	        //{{aaa}} --> aaa
	        //{{aaa}}/bbb.html --> (aaa) + "/bbb.html"
	        binding.expr = normalizeExpr(binding.expr.trim())
	        if (binding.type === "include") {
	            var elem = binding.element
	            effectBinding(elem, binding)
	            binding.includeRendered = getBindingCallback(elem, "data-include-rendered", binding.vmodels)
	            binding.includeLoaded = getBindingCallback(elem, "data-include-loaded", binding.vmodels)
	            var outer = binding.includeReplace = !!avalon(elem).data("includeReplace")
	            if (avalon(elem).data("includeCache")) {
	                binding.templateCache = {}
	            }
	            binding.start = DOC.createComment("ms-include")
	            binding.end = DOC.createComment("ms-include-end")
	            if (outer) {
	                binding.element = binding.end
	                binding._element = elem
	                elem.parentNode.insertBefore(binding.start, elem)
	                elem.parentNode.insertBefore(binding.end, elem.nextSibling)
	            } else {
	                elem.insertBefore(binding.start, elem.firstChild)
	                elem.appendChild(binding.end)
	            }
	        }
	    },
	    update: function (val) {
	        var elem = this.element
	        var attrName = this.param
	        if (attrName === "href" || attrName === "src") {
	            if (typeof val === "string" && !root.hasAttribute) {
	                val = val.replace(/&amp;/g, "&") //处理IE67自动转义的问题
	            }
	            elem[attrName] = val
	            if (window.chrome && elem.tagName === "EMBED") {
	                var parent = elem.parentNode //#525  chrome1-37下embed标签动态设置src不能发生请求
	                var comment = document.createComment("ms-src")
	                parent.replaceChild(comment, elem)
	                parent.replaceChild(elem, comment)
	            }
	        } else {

	            // ms-attr-class="xxx" vm.xxx="aaa bbb ccc"将元素的className设置为aaa bbb ccc
	            // ms-attr-class="xxx" vm.xxx=false  清空元素的所有类名
	            // ms-attr-name="yyy"  vm.yyy="ooo" 为元素设置name属性
	            var toRemove = (val === false) || (val === null) || (val === void 0)
	            if (!W3C && propMap[attrName]) { //旧式IE下需要进行名字映射
	                attrName = propMap[attrName]
	            }
	            var bool = boolMap[attrName]
	            if (typeof elem[bool] === "boolean") {
	                elem[bool] = !!val //布尔属性必须使用el.xxx = true|false方式设值
	                if (!val) { //如果为false, IE全系列下相当于setAttribute(xxx,''),会影响到样式,需要进一步处理
	                    toRemove = true
	                }
	            }
	            if (toRemove) {
	                return elem.removeAttribute(attrName)
	            }
	            //SVG只能使用setAttribute(xxx, yyy), VML只能使用elem.xxx = yyy ,HTML的固有属性必须elem.xxx = yyy
	            var isInnate = rsvg.test(elem) ? false : (DOC.namespaces && isVML(elem)) ? true : attrName in elem.cloneNode(false)
	            if (isInnate) {
	                elem[attrName] = val + ""
	            } else {
	                elem.setAttribute(attrName, val)
	            }
	        }
	    }
	})



	//这几个指令都可以使用插值表达式，如ms-src="aaa/{{b}}/{{c}}.html"
	"title,alt,src,value,css,include,href".replace(rword, function (name) {
	    directives[name] = attrDir
	})

	//根据VM的属性值或表达式的值切换类名，ms-class="xxx yyy zzz:flag"
	//http://www.cnblogs.com/rubylouvre/archive/2012/12/17/2818540.html
	avalon.directive("class", {
	    init: function (binding) {
	        var oldStyle = binding.param
	        var method = binding.type
	        if (!oldStyle || isFinite(oldStyle)) {
	            binding.param = "" //去掉数字
	            directives.effect.init(binding)
	        } else {
	            log('ms-' + method + '-xxx="yyy"这种用法已经过时,请使用ms-' + method + '="xxx:yyy"')
	            binding.expr = '[' + quote(oldStyle) + "," + binding.expr + "]"
	            binding.oldStyle = oldStyle
	        }
	        if (method === "hover" || method === "active") { //确保只绑定一次
	            if (!binding.hasBindEvent) {
	                var elem = binding.element
	                var $elem = avalon(elem)
	                var activate = "mouseenter" //在移出移入时切换类名
	                var abandon = "mouseleave"
	                if (method === "active") { //在聚焦失焦中切换类名
	                    elem.tabIndex = elem.tabIndex || -1
	                    activate = "mousedown"
	                    abandon = "mouseup"
	                    var fn0 = $elem.bind("mouseleave", function () {
	                        binding.toggleClass && $elem.removeClass(binding.newClass)
	                    })
	                }
	            }

	            var fn1 = $elem.bind(activate, function () {
	                binding.toggleClass && $elem.addClass(binding.newClass)
	            })
	            var fn2 = $elem.bind(abandon, function () {
	                binding.toggleClass && $elem.removeClass(binding.newClass)
	            })
	            binding.rollback = function () {
	                $elem.unbind("mouseleave", fn0)
	                $elem.unbind(activate, fn1)
	                $elem.unbind(abandon, fn2)
	            }
	            binding.hasBindEvent = true
	        }

	    },
	    update: function (arr) {
	        var binding = this
	        var $elem = avalon(this.element)
	        binding.newClass = arr[0]
	        binding.toggleClass = !!arr[1]
	        if (binding.oldClass && binding.newClass !== binding.oldClass) {
	            $elem.removeClass(binding.oldClass)
	        }
	        binding.oldClass = binding.newClass
	        if (binding.type === "class") {
	            if (binding.oldStyle) {
	                $elem.toggleClass(binding.oldStyle, !!arr[1])
	            } else {
	                $elem.toggleClass(binding.newClass, binding.toggleClass)
	            }
	        }
	    }
	})

	"hover,active".replace(rword, function (name) {
	    directives[name] = directives["class"]
	})


	//ms-controller绑定已经在scanTag 方法中实现
	avalon.directive("css", {
	    init: directives.attr.init,
	    update: function (val) {
	        avalon(this.element).css(this.param, val)
	    }
	})

	avalon.directive("data", {
	    priority: 100,
	    update: function (val) {
	        var elem = this.element
	        var key = "data-" + this.param
	        if (val && typeof val === "object") {
	            elem[key] = val
	        } else {
	            elem.setAttribute(key, String(val))
	        }
	    }
	})

	//双工绑定
	var rduplexType = /^(?:checkbox|radio)$/
	var rduplexParam = /^(?:radio|checked)$/
	var rnoduplexInput = /^(file|button|reset|submit|checkbox|radio|range)$/
	var duplexBinding = avalon.directive("duplex", {
	    priority: 2000,
	    init: function (binding, hasCast) {
	        var elem = binding.element
	        var vmodels = binding.vmodels
	        binding.changed = getBindingCallback(elem, "data-duplex-changed", vmodels) || noop
	        var params = []
	        var casting = oneObject("string,number,boolean,checked")
	        if (elem.type === "radio" && binding.param === "") {
	            binding.param = "checked"
	        }


	        binding.param.replace(rw20g, function (name) {
	            if (rduplexType.test(elem.type) && rduplexParam.test(name)) {
	                if (name === "radio")
	                    log("ms-duplex-radio已经更名为ms-duplex-checked")
	                name = "checked"
	                binding.isChecked = true
	                binding.xtype = "radio"
	            }
	            if (name === "bool") {
	                name = "boolean"
	                log("ms-duplex-bool已经更名为ms-duplex-boolean")
	            } else if (name === "text") {
	                name = "string"
	                log("ms-duplex-text已经更名为ms-duplex-string")
	            }
	            if (casting[name]) {
	                hasCast = true
	            }
	            avalon.Array.ensure(params, name)
	        })
	        if (!hasCast) {
	            params.push("string")
	        }
	        binding.param = params.join("-")
	        if (!binding.xtype) {
	            binding.xtype = elem.tagName === "SELECT" ? "select" :
	                    elem.type === "checkbox" ? "checkbox" :
	                    elem.type === "radio" ? "radio" :
	                    /^change/.test(elem.getAttribute("data-duplex-event")) ? "change" :
	                    "input"
	        }
	        //===================绑定事件======================
	        binding.bound = function (type, callback) {
	            if (elem.addEventListener) {
	                elem.addEventListener(type, callback, false)
	            } else {
	                elem.attachEvent("on" + type, callback)
	            }
	            var old = binding.rollback
	            binding.rollback = function () {
	                elem.avalonSetter = null
	                avalon.unbind(elem, type, callback)
	                old && old()
	            }
	        }
	        var composing = false
	        function callback(value) {
	            binding.changed.call(this, value, binding)
	        }
	        function compositionStart() {
	            composing = true
	        }
	        function compositionEnd() {
	            composing = false
	        }
	        var updateVModel = function () {
	            var val = elem.value //防止递归调用形成死循环
	            if (composing || val === binding.oldValue || binding.pipe === null) //处理中文输入法在minlengh下引发的BUG
	                return
	            var lastValue = binding.pipe(val, binding, "get")
	            try {
	                binding.setter(lastValue)
	                callback.call(elem, lastValue)
	            } catch (ex) {
	                log(ex)
	            }
	        }
	        switch (binding.xtype) {
	            case "radio":
	                binding.bound("click", function () {
	                    var lastValue = binding.pipe(elem.value, binding, "get")
	                    try {
	                        binding.setter(lastValue)
	                        callback.call(elem, lastValue)
	                    } catch (ex) {
	                        log(ex)
	                    }
	                })
	                break
	            case "checkbox":
	                binding.bound(W3C ? "change" : "click", function () {
	                    var method = elem.checked ? "ensure" : "remove"
	                    var array = binding.getter.apply(0, binding.vmodels)
	                    if (!Array.isArray(array)) {
	                        log("ms-duplex应用于checkbox上要对应一个数组")
	                        array = [array]
	                    }
	                    var val = binding.pipe(elem.value, binding, "get")
	                    avalon.Array[method](array, val)
	                    callback.call(elem, array)
	                })
	                break
	            case "change":
	                binding.bound("change", updateVModel)
	                break
	            case "input":
	                if (!IEVersion) { // W3C
	                    binding.bound("input", updateVModel)
	                    //非IE浏览器才用这个
	                    binding.bound("compositionstart", compositionStart)
	                    binding.bound("compositionend", compositionEnd)
	                    binding.bound("DOMAutoComplete", updateVModel)
	                } else { //onpropertychange事件无法区分是程序触发还是用户触发
	                    // IE下通过selectionchange事件监听IE9+点击input右边的X的清空行为，及粘贴，剪切，删除行为
	                    if (IEVersion > 8) {
	                        binding.bound("input", updateVModel) //IE9使用propertychange无法监听中文输入改动
	                    } else {
	                        binding.bound("propertychange", function (e) { //IE6-8下第一次修改时不会触发,需要使用keydown或selectionchange修正
	                            if (e.propertyName === "value") {
	                                updateVModel()
	                            }
	                        })
	                    }
	                    binding.bound("dragend", function () {
	                        setTimeout(function () {
	                            updateVModel()
	                        }, 17)
	                    })
	                    //http://www.cnblogs.com/rubylouvre/archive/2013/02/17/2914604.html
	                    //http://www.matts411.com/post/internet-explorer-9-oninput/
	                }
	                break
	            case "select":
	                binding.bound("change", function () {
	                    var val = avalon(elem).val() //字符串或字符串数组
	                    if (Array.isArray(val)) {
	                        val = val.map(function (v) {
	                            return binding.pipe(v, binding, "get")
	                        })
	                    } else {
	                        val = binding.pipe(val, binding, "get")
	                    }
	                    if (val + "" !== binding.oldValue) {
	                        try {
	                            binding.setter(val)
	                            callback.call(elem, val)
	                        } catch (ex) {
	                            log(ex)
	                        }
	                    }
	                })
	                binding.bound("datasetchanged", function (e) {
	                    if (e.bubble === "selectDuplex") {
	                        var value = binding._value
	                        var curValue = Array.isArray(value) ? value.map(String) : value + ""
	                        avalon(elem).val(curValue)
	                        elem.oldValue = curValue + ""
	                        callback.call(elem, curValue)
	                    }
	                })
	                break
	        }
	        if (binding.xtype === "input" && !rnoduplexInput.test(elem.type)) {
	            if (elem.type !== "hidden") {
	                binding.bound("focus", function () {
	                    elem.msFocus = true
	                })
	                binding.bound("blur", function () {
	                    elem.msFocus = false
	                })
	            }
	            elem.avalonSetter = updateVModel //#765
	            watchValueInTimer(function () {
	                if (elem.contains(elem)) {
	                    if (!this.msFocus && binding.oldValue !== elem.value) {
	                        updateVModel()
	                    }
	                } else if (!elem.msRetain) {
	                    return false
	                }
	            })
	        }

	    },
	    update: function (value) {
	        var elem = this.element, binding = this, curValue
	        if (!this.init) {
	            for (var i in avalon.vmodels) {
	                var v = avalon.vmodels[i]
	                v.$fire("avalon-ms-duplex-init", binding)
	            }
	            var cpipe = binding.pipe || (binding.pipe = pipe)
	            cpipe(null, binding, "init")
	            this.init = 1
	        }
	        switch (this.xtype) {
	            case "input":
	            case "change":
	                curValue = this.pipe(value, this, "set")  //fix #673
	                if (curValue !== this.oldValue) {
	                    var fixCaret = false
	                    if (elem.msFocus) {
	                        var pos = getCaret(elem)
	                        if (pos.start === pos.end) {
	                            pos = pos.start
	                            fixCaret = true
	                        }
	                    }
	                    elem.value = this.oldValue = curValue
	                    if (fixCaret) {
	                        setCaret(elem, pos, pos)
	                    }
	                }
	                break
	            case "radio":
	                curValue = binding.isChecked ? !!value : value + "" === elem.value
	                if (IEVersion === 6) {
	                    setTimeout(function () {
	                        //IE8 checkbox, radio是使用defaultChecked控制选中状态，
	                        //并且要先设置defaultChecked后设置checked
	                        //并且必须设置延迟
	                        elem.defaultChecked = curValue
	                        elem.checked = curValue
	                    }, 31)
	                } else {
	                    elem.checked = curValue
	                }
	                break
	            case "checkbox":
	                var array = [].concat(value) //强制转换为数组
	                curValue = this.pipe(elem.value, this, "get")
	                elem.checked = array.indexOf(curValue) > -1
	                break
	            case "select":
	                //必须变成字符串后才能比较
	                binding._value = value
	                if(!elem.msHasEvent){
	                    elem.msHasEvent = "selectDuplex"
	                    //必须等到其孩子准备好才触发
	                }else{
	                    avalon.fireDom(elem, "datasetchanged", {
	                        bubble: elem.msHasEvent
	                    })
	                }
	                break
	        }
	        if (binding.xtype !== "select") {
	            binding.changed.call(elem, curValue,binding)
	        }
	    }
	})

	if (IEVersion) {
	    avalon.bind(DOC, "selectionchange", function (e) {
	        var el = DOC.activeElement
	        if (el && typeof el.avalonSetter === "function") {
	            el.avalonSetter()
	        }
	    })
	}

	function fixNull(val) {
	    return val == null ? "" : val
	}
	avalon.duplexHooks = {
	    checked: {
	        get: function (val, binding) {
	            return !binding.oldValue
	        }
	    },
	    string: {
	        get: function (val) { //同步到VM
	            return val
	        },
	        set: fixNull
	    },
	    "boolean": {
	        get: function (val) {
	            return val === "true"
	        },
	        set: fixNull
	    },
	    number: {
	        get: function (val, binding) {
	            var number = parseFloat(val + "")
	            if (-val === -number) {
	                return number
	            }

	            var arr = /strong|medium|weak/.exec(binding.element.getAttribute("data-duplex-number")) || ["medium"]
	            switch (arr[0]) {
	                case "strong":
	                    return 0
	                case "medium":
	                    return val === "" ? "" : 0
	                case "weak":
	                    return val
	            }
	        },
	        set: fixNull
	    }
	}

	function pipe(val, binding, action) {
	    binding.param.replace(rw20g, function (name) {
	        var hook = avalon.duplexHooks[name]
	        if (hook && typeof hook[action] === "function") {
	            val = hook[action](val, binding)
	        }
	    })
	    return val
	}

	var TimerID, ribbon = []

	avalon.tick = function (fn) {
	    if (ribbon.push(fn) === 1) {
	        TimerID = setInterval(ticker, 60)
	    }
	}

	function ticker() {
	    for (var n = ribbon.length - 1; n >= 0; n--) {
	        var el = ribbon[n]
	        if (el() === false) {
	            ribbon.splice(n, 1)
	        }
	    }
	    if (!ribbon.length) {
	        clearInterval(TimerID)
	    }
	}

	var watchValueInTimer = noop
	new function () { // jshint ignore:line
	    try { //#272 IE9-IE11, firefox
	        var setters = {}
	        var aproto = HTMLInputElement.prototype
	        var bproto = HTMLTextAreaElement.prototype
	        function newSetter(value) { // jshint ignore:line
	            setters[this.tagName].call(this, value)
	            if (!this.msFocus && this.avalonSetter && this.oldValue !== value) {
	                this.avalonSetter()
	            }
	        }
	        var inputProto = HTMLInputElement.prototype
	        Object.getOwnPropertyNames(inputProto) //故意引发IE6-8等浏览器报错
	        setters["INPUT"] = Object.getOwnPropertyDescriptor(aproto, "value").set

	        Object.defineProperty(aproto, "value", {
	            set: newSetter
	        })
	        setters["TEXTAREA"] = Object.getOwnPropertyDescriptor(bproto, "value").set
	        Object.defineProperty(bproto, "value", {
	            set: newSetter
	        })
	    } catch (e) {
	        //在chrome 43中 ms-duplex终于不需要使用定时器实现双向绑定了
	        // http://updates.html5rocks.com/2015/04/DOM-attributes-now-on-the-prototype
	        // https://docs.google.com/document/d/1jwA8mtClwxI-QJuHT7872Z0pxpZz8PBkf2bGAbsUtqs/edit?pli=1
	        watchValueInTimer = avalon.tick
	    }
	} // jshint ignore:line
	function getCaret(ctrl, start, end) {
	    if (ctrl.setSelectionRange) {
	        start = ctrl.selectionStart
	        end = ctrl.selectionEnd
	    } else if (document.selection && document.selection.createRange) {
	        var range = document.selection.createRange()
	        start = 0 - range.duplicate().moveStart('character', -100000)
	        end = start + range.text.length
	    }
	    return {
	        start: start,
	        end: end
	    }
	}
	function setCaret(ctrl, begin, end) {
	    if (!ctrl.value || ctrl.readOnly)
	        return
	    if (ctrl.createTextRange) {//IE6-9
	        setTimeout(function () {
	            var range = ctrl.createTextRange()
	            range.collapse(true);
	            range.moveStart("character", begin)
	           // range.moveEnd("character", end) #1125
	            range.select()
	        }, 17)
	    } else {
	        ctrl.selectionStart = begin
	        ctrl.selectionEnd = end
	    }
	}
	avalon.directive("effect", {
	    priority: 5,
	    init: function (binding) {
	        var text = binding.expr,
	                className,
	                rightExpr
	        var colonIndex = text.replace(rexprg, function (a) {
	            return a.replace(/./g, "0")
	        }).indexOf(":") //取得第一个冒号的位置
	        if (colonIndex === -1) { // 比如 ms-class/effect="aaa bbb ccc" 的情况
	            className = text
	            rightExpr = true
	        } else { // 比如 ms-class/effect-1="ui-state-active:checked" 的情况
	            className = text.slice(0, colonIndex)
	            rightExpr = text.slice(colonIndex + 1)
	        }
	        if (!rexpr.test(text)) {
	            className = quote(className)
	        } else {
	            className = normalizeExpr(className)
	        }
	        binding.expr = "[" + className + "," + rightExpr + "]"
	    },
	    update: function (arr) {
	        var name = arr[0]
	        var elem = this.element
	        if (elem.getAttribute("data-effect-name") === name) {
	            return
	        } else {
	            elem.removeAttribute("data-effect-driver")
	        }
	        var inlineStyles = elem.style
	        var computedStyles = window.getComputedStyle ? window.getComputedStyle(elem) : null
	        var useAni = false
	        if (computedStyles && (supportTransition || supportAnimation)) {

	            //如果支持CSS动画
	            var duration = inlineStyles[transitionDuration] || computedStyles[transitionDuration]
	            if (duration && duration !== '0s') {
	                elem.setAttribute("data-effect-driver", "t")
	                useAni = true
	            }

	            if (!useAni) {

	                duration = inlineStyles[animationDuration] || computedStyles[animationDuration]
	                if (duration && duration !== '0s') {
	                    elem.setAttribute("data-effect-driver", "a")
	                    useAni = true
	                }

	            }
	        }

	        if (!useAni) {
	            if (avalon.effects[name]) {
	                elem.setAttribute("data-effect-driver", "j")
	                useAni = true
	            }
	        }
	        if (useAni) {
	            elem.setAttribute("data-effect-name", name)
	        }
	    }
	})

	avalon.effects = {}
	avalon.effect = function (name, callbacks) {
	    avalon.effects[name] = callbacks
	}



	var supportTransition = false
	var supportAnimation = false

	var transitionEndEvent
	var animationEndEvent
	var transitionDuration = avalon.cssName("transition-duration")
	var animationDuration = avalon.cssName("animation-duration")
	new function () {// jshint ignore:line
	    var checker = {
	        'TransitionEvent': 'transitionend',
	        'WebKitTransitionEvent': 'webkitTransitionEnd',
	        'OTransitionEvent': 'oTransitionEnd',
	        'otransitionEvent': 'otransitionEnd'
	    }
	    var tran
	    //有的浏览器同时支持私有实现与标准写法，比如webkit支持前两种，Opera支持1、3、4
	    for (var name in checker) {
	        if (window[name]) {
	            tran = checker[name]
	            break;
	        }
	        try {
	            var a = document.createEvent(name);
	            tran = checker[name]
	            break;
	        } catch (e) {
	        }
	    }
	    if (typeof tran === "string") {
	        supportTransition = true
	        transitionEndEvent = tran
	    }

	    //大致上有两种选择
	    //IE10+, Firefox 16+ & Opera 12.1+: animationend
	    //Chrome/Safari: webkitAnimationEnd
	    //http://blogs.msdn.com/b/davrous/archive/2011/12/06/introduction-to-css3-animat ions.aspx
	    //IE10也可以使用MSAnimationEnd监听，但是回调里的事件 type依然为animationend
	    //  el.addEventListener("MSAnimationEnd", function(e) {
	    //     alert(e.type)// animationend！！！
	    // })
	    checker = {
	        'AnimationEvent': 'animationend',
	        'WebKitAnimationEvent': 'webkitAnimationEnd'
	    }
	    var ani;
	    for (name in checker) {
	        if (window[name]) {
	            ani = checker[name];
	            break;
	        }
	    }
	    if (typeof ani === "string") {
	        supportTransition = true
	        animationEndEvent = ani
	    }

	}()

	var effectPool = []//重复利用动画实例
	function effectFactory(el, opts) {
	    if (!el || el.nodeType !== 1) {
	        return null
	    }
	    if (opts) {
	        var name = opts.effectName
	        var driver = opts.effectDriver
	    } else {
	        name = el.getAttribute("data-effect-name")
	        driver = el.getAttribute("data-effect-driver")
	    }
	    if (!name || !driver) {
	        return null
	    }

	    var instance = effectPool.pop() || new Effect()
	    instance.el = el
	    instance.driver = driver
	    instance.useCss = driver !== "j"
	    if (instance.useCss) {
	        opts && avalon(el).addClass(opts.effectClass)
	        instance.cssEvent = driver === "t" ? transitionEndEvent : animationEndEvent
	    }
	    instance.name = name
	    instance.callbacks = avalon.effects[name] || {}

	    return instance


	}

	function effectBinding(elem, binding) {
	    var name = elem.getAttribute("data-effect-name")
	    if (name) {
	        binding.effectName = name
	        binding.effectDriver = elem.getAttribute("data-effect-driver")
	        var stagger = +elem.getAttribute("data-effect-stagger")
	        binding.effectLeaveStagger = +elem.getAttribute("data-effect-leave-stagger") || stagger
	        binding.effectEnterStagger = +elem.getAttribute("data-effect-enter-stagger") || stagger
	        binding.effectClass = elem.className || NaN
	    }
	}
	function upperFirstChar(str) {
	    return str.replace(/^[\S]/g, function (m) {
	        return m.toUpperCase()
	    })
	}
	var effectBuffer = new Buffer()
	function Effect() {
	}// 动画实例,做成类的形式,是为了共用所有原型方法

	Effect.prototype = {
	    contrustor: Effect,
	    enterClass: function () {
	        return getEffectClass(this, "enter")
	    },
	    leaveClass: function () {
	        return getEffectClass(this, "leave")
	    },
	    // 共享一个函数
	    actionFun: function (name, before, after) {
	        if (document.hidden) {
	            return
	        }
	        var me = this
	        var el = me.el
	        var isLeave = name === "leave"
	        name = isLeave ? "leave" : "enter"
	        var oppositeName = isLeave ? "enter" : "leave"
	        callEffectHook(me, "abort" + upperFirstChar(oppositeName))
	        callEffectHook(me, "before" + upperFirstChar(name))
	        if (!isLeave)
	            before(el) //  这里可能做插入DOM树的操作,因此必须在修改类名前执行
	        var cssCallback = function (cancel) {
	            el.removeEventListener(me.cssEvent, me.cssCallback)
	            if (isLeave) {
	                before(el) //这里可能做移出DOM树操作,因此必须位于动画之后
	                avalon(el).removeClass(me.cssClass)
	            } else {
	                if (me.driver === "a") {
	                    avalon(el).removeClass(me.cssClass)
	                }
	            }
	            if (cancel !== true) {
	                callEffectHook(me, "after" + upperFirstChar(name))
	                after && after(el)
	            }
	            me.dispose()
	        }
	        if (me.useCss) {
	            if (me.cssCallback) { //如果leave动画还没有完成,立即完成
	                me.cssCallback(true)
	            }

	            me.cssClass = getEffectClass(me, name)
	            me.cssCallback = cssCallback

	            me.update = function () {
	                el.addEventListener(me.cssEvent, me.cssCallback)
	                if (!isLeave && me.driver === "t") {//transtion延迟触发
	                    avalon(el).removeClass(me.cssClass)
	                }
	            }
	            avalon(el).addClass(me.cssClass)//animation会立即触发

	            effectBuffer.render(true)
	            effectBuffer.queue.push(me)

	        } else {
	            callEffectHook(me, name, cssCallback)

	        }
	    },
	    enter: function (before, after) {
	        this.actionFun.apply(this, ["enter"].concat(avalon.slice(arguments)))

	    },
	    leave: function (before, after) {
	        this.actionFun.apply(this, ["leave"].concat(avalon.slice(arguments)))

	    },
	    dispose: function () {//销毁与回收到池子中
	        this.update = this.cssCallback = null
	        if (effectPool.unshift(this) > 100) {
	            effectPool.pop()
	        }
	    }


	}


	function getEffectClass(instance, type) {
	    var a = instance.callbacks[type + "Class"]
	    if (typeof a === "string")
	        return a
	    if (typeof a === "function")
	        return a()
	    return instance.name + "-" + type
	}


	function callEffectHook(effect, name, cb) {
	    var hook = effect.callbacks[name]
	    if (hook) {
	        hook.call(effect, effect.el, cb)
	    }
	}

	var applyEffect = function (el, dir/*[before, [after, [opts]]]*/) {
	    var args = aslice.call(arguments, 0)
	    if (typeof args[2] !== "function") {
	        args.splice(2, 0, noop)
	    }
	    if (typeof args[3] !== "function") {
	        args.splice(3, 0, noop)
	    }
	    var before = args[2]
	    var after = args[3]
	    var opts = args[4]
	    var effect = effectFactory(el, opts)
	    if (!effect) {
	        before()
	        after()
	        return false
	    } else {
	        var method = dir ? 'enter' : 'leave'
	        effect[method](before, after)
	    }
	}

	avalon.mix(avalon.effect, {
	    apply: applyEffect,
	    append: function (el, parent, after, opts) {
	        return applyEffect(el, 1, function () {
	            parent.appendChild(el)
	        }, after, opts)
	    },
	    before: function (el, target, after, opts) {
	        return applyEffect(el, 1, function () {
	            target.parentNode.insertBefore(el, target)
	        }, after, opts)
	    },
	    remove: function (el, parent, after, opts) {
	        return applyEffect(el, 0, function () {
	            if (el.parentNode === parent)
	                parent.removeChild(el)
	        }, after, opts)
	    }
	})


	avalon.directive("html", {
	    update: function (val) {
	        var binding = this
	        var elem = this.element
	        var isHtmlFilter = elem.nodeType !== 1
	        var parent = isHtmlFilter ? elem.parentNode : elem
	        if (!parent)
	            return
	        val = val == null ? "" : val

	        if (elem.nodeType === 3) {
	            var signature = generateID("html")
	            parent.insertBefore(DOC.createComment(signature), elem)
	            binding.element = DOC.createComment(signature + ":end")
	            parent.replaceChild(binding.element, elem)
	            elem = binding.element
	        }
	        if (typeof val !== "object") {//string, number, boolean
	            var fragment = avalon.parseHTML(String(val))
	        } else if (val.nodeType === 11) { //将val转换为文档碎片
	            fragment = val
	        } else if (val.nodeType === 1 || val.item) {
	            var nodes = val.nodeType === 1 ? val.childNodes : val.item
	            fragment = avalonFragment.cloneNode(true)
	            while (nodes[0]) {
	                fragment.appendChild(nodes[0])
	            }
	        }

	        nodes = avalon.slice(fragment.childNodes)
	        //插入占位符, 如果是过滤器,需要有节制地移除指定的数量,如果是html指令,直接清空
	        if (isHtmlFilter) {
	            var endValue = elem.nodeValue.slice(0, -4)
	            while (true) {
	                var node = elem.previousSibling
	                if (!node || node.nodeType === 8 && node.nodeValue === endValue) {
	                    break
	                } else {
	                    parent.removeChild(node)
	                }
	            }
	            parent.insertBefore(fragment, elem)
	        } else {
	            avalon.clearHTML(elem).appendChild(fragment)
	        }
	        scanNodeArray(nodes, binding.vmodels)
	    }
	})

	avalon.directive("if", {
	    priority: 10,
	    update: function (val) {
	        var binding = this
	        var elem = this.element
	        var stamp = binding.stamp = +new Date()
	        var par
	        var after = function () {
	            if (stamp !== binding.stamp)
	                return
	            binding.recoverNode = null
	        }
	        if (binding.recoverNode)
	            binding.recoverNode() // 还原现场，有移动节点的都需要还原现场
	        try {
	            if (!elem.parentNode)
	                return
	            par = elem.parentNode
	        } catch (e) {
	            return
	        }
	        if (val) { //插回DOM树
	            function alway() {// jshint ignore:line
	                if (elem.getAttribute(binding.name)) {
	                    elem.removeAttribute(binding.name)
	                    scanAttr(elem, binding.vmodels)
	                }
	                binding.rollback = null
	            }
	            if (elem.nodeType === 8) {
	                var keep = binding.keep
	                var hasEffect = avalon.effect.apply(keep, 1, function () {
	                    if (stamp !== binding.stamp)
	                        return
	                    elem.parentNode.replaceChild(keep, elem)
	                    elem = binding.element = keep //这时可能为null
	                    if (keep.getAttribute("_required")) {//#1044
	                        elem.required = true
	                        elem.removeAttribute("_required")
	                    }
	                    if (elem.querySelectorAll) {
	                        avalon.each(elem.querySelectorAll("[_required=true]"), function (el) {
	                            el.required = true
	                            el.removeAttribute("_required")
	                        })
	                    }
	                    alway()
	                }, after)
	                hasEffect = hasEffect === false
	            }
	            if (!hasEffect)
	                alway()
	        } else { //移出DOM树，并用注释节点占据原位置
	            if (elem.nodeType === 1) {
	                if (elem.required === true) {
	                    elem.required = false
	                    elem.setAttribute("_required", "true")
	                }
	                try {// 如果不支持querySelectorAll或:required,可以直接无视
	                    avalon.each(elem.querySelectorAll(":required"), function (el) {
	                        elem.required = false
	                        el.setAttribute("_required", "true")
	                    })
	                } catch (e) {
	                }

	                var node = binding.element = DOC.createComment("ms-if"),
	                        pos = elem.nextSibling
	                binding.recoverNode = function () {
	                    binding.recoverNode = null
	                    if (node.parentNode !== par) {
	                        par.insertBefore(node, pos)
	                        binding.keep = elem
	                    }
	                }

	                avalon.effect.apply(elem, 0, function () {
	                    binding.recoverNode = null
	                    if (stamp !== binding.stamp)
	                        return
	                    elem.parentNode.replaceChild(node, elem)
	                    binding.keep = elem //元素节点
	                    ifGroup.appendChild(elem)
	                    binding.rollback = function () {
	                        if (elem.parentNode === ifGroup) {
	                            ifGroup.removeChild(elem)
	                        }
	                    }
	                }, after)
	            }
	        }
	    }
	})



	//ms-important绑定已经在scanTag 方法中实现
	var rnoscripts = /<noscript.*?>(?:[\s\S]+?)<\/noscript>/img
	var rnoscriptText = /<noscript.*?>([\s\S]+?)<\/noscript>/im

	var getXHR = function () {
	    return new (window.XMLHttpRequest || ActiveXObject)("Microsoft.XMLHTTP") // jshint ignore:line
	}
	//将所有远程加载的模板,以字符串形式存放到这里
	var templatePool = avalon.templateCache = {}

	function getTemplateContainer(binding, id, text) {
	    var div = binding.templateCache && binding.templateCache[id]
	    if (div) {
	        var dom = DOC.createDocumentFragment(),
	                firstChild
	        while (firstChild = div.firstChild) {
	            dom.appendChild(firstChild)
	        }
	        return dom
	    }
	    return avalon.parseHTML(text)

	}
	function nodesToFrag(nodes) {
	    var frag = DOC.createDocumentFragment()
	    for (var i = 0, len = nodes.length; i < len; i++) {
	        frag.appendChild(nodes[i])
	    }
	    return frag
	}
	avalon.directive("include", {
	    init: directives.attr.init,
	    update: function (val) {
	        var binding = this
	        var elem = this.element
	        var vmodels = binding.vmodels
	        var rendered = binding.includeRendered
	        var effectClass = binding.effectName && binding.effectClass // 是否开启动画
	        var templateCache = binding.templateCache // 是否data-include-cache
	        var outer = binding.includeReplace // 是否data-include-replace
	        var loaded = binding.includeLoaded
	        var target = outer ? elem.parentNode : elem
	        var _ele = binding._element // data-include-replace binding.element === binding.end

	        binding.recoverNodes = binding.recoverNodes || avalon.noop
	        var scanTemplate = function (text) {
	            var _stamp = binding._stamp = +(new Date()) // 过滤掉频繁操作
	            if (loaded) {
	                var newText = loaded.apply(target, [text].concat(vmodels))
	                if (typeof newText === "string")
	                    text = newText
	            }
	            if (rendered) {
	                checkScan(target, function () {
	                    rendered.call(target)
	                }, NaN)
	            }
	            var lastID = binding.includeLastID || "_default" // 默认

	            binding.includeLastID = val
	            var leaveEl = templateCache && templateCache[lastID] || DOC.createElement(elem.tagName || binding._element.tagName) // 创建一个离场元素
	            if (effectClass) {
	                leaveEl.className = effectClass
	                target.insertBefore(leaveEl, binding.start) // 插入到start之前，防止被错误的移动
	            }
	                
	            // cache or animate，移动节点
	            (templateCache || {})[lastID] = leaveEl
	            var fragOnDom = binding.recoverNodes() // 恢复动画中的节点
	            if (fragOnDom) {
	                target.insertBefore(fragOnDom, binding.end)
	            }
	            while (true) {
	                var node = binding.start.nextSibling
	                if (node && node !== leaveEl && node !== binding.end) {
	                    leaveEl.appendChild(node)
	                } else {
	                    break
	                }
	            }
	            // 元素退场
	            avalon.effect.remove(leaveEl, target, function () {
	                if (templateCache) { // write cache
	                    if (_stamp === binding._stamp)
	                        ifGroup.appendChild(leaveEl)
	                }
	            }, binding)


	            var enterEl = target,
	                    before = avalon.noop,
	                    after = avalon.noop

	            var fragment = getTemplateContainer(binding, val, text)
	            var nodes = avalon.slice(fragment.childNodes)

	            if (outer && effectClass) {
	                enterEl = _ele
	                enterEl.innerHTML = "" // 清空
	                enterEl.setAttribute("ms-skip", "true")
	                target.insertBefore(enterEl, binding.end.nextSibling) // 插入到bingding.end之后避免被错误的移动
	                before = function () {
	                    enterEl.insertBefore(fragment, null) // 插入节点
	                }
	                after = function () {
	                    binding.recoverNodes = avalon.noop
	                    if (_stamp === binding._stamp) {
	                        fragment = nodesToFrag(nodes)
	                        target.insertBefore(fragment, binding.end) // 插入真实element
	                        scanNodeArray(nodes, vmodels)
	                    }
	                    if (enterEl.parentNode === target)
	                        target.removeChild(enterEl) // 移除入场动画元素
	                }
	                binding.recoverNodes = function () {
	                    binding.recoverNodes = avalon.noop
	                    return nodesToFrag(nodes)
	                }
	            } else {
	                before = function () {// 新添加元素的动画 
	                    target.insertBefore(fragment, binding.end)
	                    scanNodeArray(nodes, vmodels)
	                }
	            }

	            avalon.effect.apply(enterEl, "enter", before, after)
	        }

	        if (binding.param === "src") {
	            if (typeof templatePool[val] === "string") {
	                avalon.nextTick(function () {
	                    scanTemplate(templatePool[val])
	                })
	            } else if (Array.isArray(templatePool[val])) { //#805 防止在循环绑定中发出许多相同的请求
	                templatePool[val].push(scanTemplate)
	            } else {
	                var xhr = getXHR()
	                xhr.onreadystatechange = function () {
	                    if (xhr.readyState === 4) {
	                        var s = xhr.status
	                        if (s >= 200 && s < 300 || s === 304 || s === 1223) {
	                            var text = xhr.responseText
	                            for (var f = 0, fn; fn = templatePool[val][f++]; ) {
	                                fn(text)
	                            }
	                            templatePool[val] = text
	                        }else{
	                            log("ms-include load ["+ val +"] error")
	                        }
	                    }
	                }
	                templatePool[val] = [scanTemplate]
	                xhr.open("GET", val, true)
	                if ("withCredentials" in xhr) {
	                    xhr.withCredentials = true
	                }
	                xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
	                xhr.send(null)
	            }
	        } else {
	            //IE系列与够新的标准浏览器支持通过ID取得元素（firefox14+）
	            //http://tjvantoll.com/2012/07/19/dom-element-references-as-global-variables/
	            var el = val && val.nodeType === 1 ? val : DOC.getElementById(val)
	            if (el) {
	                if (el.tagName === "NOSCRIPT" && !(el.innerHTML || el.fixIE78)) { //IE7-8 innerText,innerHTML都无法取得其内容，IE6能取得其innerHTML
	                    xhr = getXHR() //IE9-11与chrome的innerHTML会得到转义的内容，它们的innerText可以
	                    xhr.open("GET", location, false)
	                    xhr.send(null)
	                    //http://bbs.csdn.net/topics/390349046?page=1#post-393492653
	                    var noscripts = DOC.getElementsByTagName("noscript")
	                    var array = (xhr.responseText || "").match(rnoscripts) || []
	                    var n = array.length
	                    for (var i = 0; i < n; i++) {
	                        var tag = noscripts[i]
	                        if (tag) { //IE6-8中noscript标签的innerHTML,innerText是只读的
	                            tag.style.display = "none" //http://haslayout.net/css/noscript-Ghost-Bug
	                            tag.fixIE78 = (array[i].match(rnoscriptText) || ["", "&nbsp;"])[1]
	                        }
	                    }
	                }
	                avalon.nextTick(function () {
	                    scanTemplate(el.fixIE78 || el.value || el.innerText || el.innerHTML)
	                })
	            }
	        }
	    }
	})

	var rdash = /\(([^)]*)\)/
	var onDir = avalon.directive("on", {
	    priority: 3000,
	    init: function (binding) {
	        var value = binding.expr
	        binding.type = "on"
	        var eventType = binding.param.replace(/-\d+$/, "") // ms-on-mousemove-10
	        if (typeof onDir[eventType + "Hook"] === "function") {
	            onDir[eventType + "Hook"](binding)
	        }
	        if (value.indexOf("(") > 0 && value.indexOf(")") > -1) {
	            var matched = (value.match(rdash) || ["", ""])[1].trim()
	            if (matched === "" || matched === "$event") { // aaa() aaa($event)当成aaa处理
	                value = value.replace(rdash, "")
	            }
	        }
	        binding.expr = value
	    },
	    update: function (callback) {
	        var binding = this
	        var elem = this.element
	        callback = function (e) {
	            var fn = binding.getter || noop
	            return fn.apply(this, binding.args.concat(e))
	        }
	        
	        var eventType = binding.param.replace(/-\d+$/, "") // ms-on-mousemove-10
	        if (eventType === "scan") {
	            callback.call(elem, {
	                type: eventType
	            })
	        } else if (typeof binding.specialBind === "function") {
	            binding.specialBind(elem, callback)
	        } else {
	            var removeFn = avalon.bind(elem, eventType, callback)
	        }
	        binding.rollback = function () {
	            if (typeof binding.specialUnbind === "function") {
	                binding.specialUnbind()
	            } else {
	                avalon.unbind(elem, eventType, removeFn)
	            }
	        }
	    }
	})
	avalon.directive("repeat", {
	    priority: 90,
	    init: function (binding) {
	        var type = binding.type
	        binding.cache = {} //用于存放代理VM
	        binding.enterCount = 0

	        var elem = binding.element
	        if (elem.nodeType === 1) {
	            elem.removeAttribute(binding.name)
	            effectBinding(elem, binding)
	            binding.param = binding.param || "el"
	            binding.sortedCallback = getBindingCallback(elem, "data-with-sorted", binding.vmodels)
	            var rendered = getBindingCallback(elem, "data-" + type + "-rendered", binding.vmodels)

	            var signature = generateID(type)
	            var start = DOC.createComment(signature + ":start")
	            var end = binding.element = DOC.createComment(signature + ":end")
	            binding.signature = signature
	            binding.start = start
	            binding.template = avalonFragment.cloneNode(false)
	            if (type === "repeat") {
	                var parent = elem.parentNode
	                parent.replaceChild(end, elem)
	                parent.insertBefore(start, end)
	                binding.template.appendChild(elem)
	            } else {
	                while (elem.firstChild) {
	                    binding.template.appendChild(elem.firstChild)
	                }
	                elem.appendChild(start)
	                elem.appendChild(end)
	                parent = elem
	            }
	            binding.element = end

	            if (rendered) {
	                var removeFn = avalon.bind(parent, "datasetchanged", function () {
	                    rendered.apply(parent, parent.args)
	                    avalon.unbind(parent, "datasetchanged", removeFn)
	                    parent.msRendered = rendered
	                })
	            }
	        }
	    },
	    update: function (value, oldValue) {
	        var binding = this
	        var xtype = this.xtype

	        this.enterCount += 1
	        var init = !oldValue
	        if (init) {
	            binding.$outer = {}
	            var check0 = "$key"
	            var check1 = "$val"
	            if (xtype === "array") {
	                check0 = "$first"
	                check1 = "$last"
	            }
	            for (var i = 0, v; v = binding.vmodels[i++]; ) {
	                if (v.hasOwnProperty(check0) && v.hasOwnProperty(check1)) {
	                    binding.$outer = v
	                    break
	                }
	            }
	        }
	        var track = this.track
	        if (binding.sortedCallback) { //如果有回调，则让它们排序
	            var keys2 = binding.sortedCallback.call(parent, track)
	            if (keys2 && Array.isArray(keys2)) {
	                track = keys2
	            }
	        }

	        var action = "move"
	        binding.$repeat = value
	        var fragments = []
	        var transation = init && avalonFragment.cloneNode(false)
	        var proxies = []
	        var param = this.param
	        var retain = avalon.mix({}, this.cache)
	        var elem = this.element
	        var length = track.length

	        var parent = elem.parentNode
	        for (i = 0; i < length; i++) {

	            var keyOrId = track[i] //array为随机数, object 为keyName
	            var proxy = retain[keyOrId]
	            if (!proxy) {
	                
	                proxy = getProxyVM(this)
	                proxy.$up = null
	                if (xtype === "array") {
	                    action = "add"
	                    proxy.$id = keyOrId
	                    var valueItem = value[i]
	                    proxy[param] = valueItem //index
	                    if(Object(valueItem) === valueItem){
	                        valueItem.$ups = valueItem.$ups || {}
	                        valueItem.$ups[param] = proxy
	                    }

	                } else {
	                    action = "append"
	                    proxy.$key = keyOrId
	                    proxy.$val = value[keyOrId] //key
	                }
	                this.cache[keyOrId] = proxy
	                var node = proxy.$anchor || (proxy.$anchor = elem.cloneNode(false))
	                node.nodeValue = this.signature
	                shimController(binding, transation, proxy, fragments, init && !binding.effectDriver)
	                decorateProxy(proxy, binding, xtype)
	            } else {
	//                if (xtype === "array") {
	//                    proxy[param] = value[i]
	//                }
	                fragments.push({})
	                retain[keyOrId] = true
	            }

	            //重写proxy
	            if (this.enterCount === 1) {// 防止多次进入,导致位置不对
	                proxy.$active = false
	                proxy.$oldIndex = proxy.$index
	                proxy.$active = true
	                proxy.$index = i

	            }

	            if (xtype === "array") {
	                proxy.$first = i === 0
	                proxy.$last = i === length - 1
	                // proxy[param] = value[i]
	            } else {
	                proxy.$val = toJson(value[keyOrId]) // 这里是处理vm.object = newObject的情况 
	            }
	            proxies.push(proxy)
	        }
	        this.proxies = proxies
	        if (init && !binding.effectDriver) {
	            parent.insertBefore(transation, elem)
	            fragments.forEach(function (fragment) {
	                scanNodeArray(fragment.nodes || [], fragment.vmodels)
	                //if(fragment.vmodels.length > 2)
	                fragment.nodes = fragment.vmodels = null
	            })// jshint ignore:line
	        } else {

	            var staggerIndex = binding.staggerIndex = 0
	            for (keyOrId in retain) {
	                if (retain[keyOrId] !== true) {

	                    action = "del"
	                    removeItem(retain[keyOrId].$anchor, binding)
	                    // avalon.log("删除", keyOrId)
	                    // 相当于delete binding.cache[key]
	                    proxyRecycler(this.cache, keyOrId, param)
	                    retain[keyOrId] = null
	                }
	            }

	            //  console.log(effectEnterStagger)
	            for (i = 0; i < length; i++) {
	                proxy = proxies[i]
	                keyOrId = xtype === "array" ? proxy.$id : proxy.$key
	                var pre = proxies[i - 1]
	                var preEl = pre ? pre.$anchor : binding.start
	                if (!retain[keyOrId]) {//如果还没有插入到DOM树
	                    (function (fragment, preElement) {
	                        var nodes = fragment.nodes
	                        var vmodels = fragment.vmodels
	                        if (nodes) {
	                            staggerIndex = mayStaggerAnimate(binding.effectEnterStagger, function () {
	                                parent.insertBefore(fragment.content, preElement.nextSibling)
	                                scanNodeArray(nodes, vmodels)
	                                animateRepeat(nodes, 1, binding)
	                            }, staggerIndex)
	                        }
	                        fragment.nodes = fragment.vmodels = null
	                    })(fragments[i], preEl)// jshint ignore:line
	                    // avalon.log("插入")

	                } else if (proxy.$index !== proxy.$oldIndex) {
	                    (function (proxy2, preElement) {
	                        staggerIndex = mayStaggerAnimate(binding.effectEnterStagger, function () {
	                            var curNode = removeItem(proxy2.$anchor)// 如果位置被挪动了
	                            var inserted = avalon.slice(curNode.childNodes)
	                            parent.insertBefore(curNode, preElement.nextSibling)
	                            animateRepeat(inserted, 1, binding)
	                        }, staggerIndex)
	                    })(proxy, preEl)// jshint ignore:line

	                    // avalon.log("移动", proxy.$oldIndex, "-->", proxy.$index)
	                }
	            }

	        }
	        if (!value.$track) {//如果是非监控对象,那么就将其$events清空,阻止其持续监听
	            for (keyOrId in this.cache) {
	                proxyRecycler(this.cache, keyOrId, param)
	            }

	        }

	        //repeat --> duplex
	        (function (args) {
	            parent.args = args
	            if (parent.msRendered) {//第一次事件触发,以后直接调用
	                parent.msRendered.apply(parent, args)
	            }
	        })(kernel.newWatch ? arguments : [action]);
	        var id = setTimeout(function () {
	            clearTimeout(id)
	            //触发上层的select回调及自己的rendered回调
	            avalon.fireDom(parent, "datasetchanged", {
	                bubble: parent.msHasEvent
	            })
	        })
	        this.enterCount -= 1

	    }

	})

	"with,each".replace(rword, function (name) {
	    directives[name] = avalon.mix({}, directives.repeat, {
	        priority: 1400
	    })
	})


	function animateRepeat(nodes, isEnter, binding) {
	    for (var i = 0, node; node = nodes[i++]; ) {
	        if (node.className === binding.effectClass) {
	            avalon.effect.apply(node, isEnter, noop, noop, binding)
	        }
	    }
	}

	function mayStaggerAnimate(staggerTime, callback, index) {
	    if (staggerTime) {
	        setTimeout(callback, (++index) * staggerTime)
	    } else {
	        callback()
	    }
	    return index
	}


	function removeItem(node, binding) {
	    var fragment = avalonFragment.cloneNode(false)
	    var last = node
	    var breakText = last.nodeValue
	    var staggerIndex = binding && Math.max(+binding.staggerIndex, 0)
	    var nodes = avalon.slice(last.parentNode.childNodes)
	    var index = nodes.indexOf(last)
	    while (true) {
	        var pre = nodes[--index] //node.previousSibling
	        if (!pre || String(pre.nodeValue).indexOf(breakText) === 0) {
	            break
	        }

	        if (binding && (pre.className === binding.effectClass)) {
	            node = pre;
	            (function (cur) {
	                binding.staggerIndex = mayStaggerAnimate(binding.effectLeaveStagger, function () {
	                    avalon.effect.apply(cur, 0, noop, function () {
	                        fragment.appendChild(cur)
	                    }, binding)
	                }, staggerIndex)
	            })(pre);// jshint ignore:line
	        } else {
	            fragment.insertBefore(pre, fragment.firstChild)
	        }
	    }
	    fragment.appendChild(last)
	    return fragment
	}


	function shimController(data, transation, proxy, fragments, init) {
	    var content = data.template.cloneNode(true)
	    var nodes = avalon.slice(content.childNodes)
	    content.appendChild(proxy.$anchor)
	    init && transation.appendChild(content)
	    var nv = [proxy].concat(data.vmodels)
	    var fragment = {
	        nodes: nodes,
	        vmodels: nv,
	        content: content
	    }
	    fragments.push(fragment)
	}
	// {}  -->  {xx: 0, yy: 1, zz: 2} add
	// {xx: 0, yy: 1, zz: 2}  -->  {xx: 0, yy: 1, zz: 2, uu: 3}
	// [xx: 0, yy: 1, zz: 2}  -->  {xx: 0, zz: 1, yy: 2}

	function getProxyVM(binding) {
	    var agent = binding.xtype === "object" ? withProxyAgent : eachProxyAgent
	    var proxy = agent(binding)
	    var node = proxy.$anchor || (proxy.$anchor = binding.element.cloneNode(false))
	    node.nodeValue = binding.signature
	    proxy.$outer = binding.$outer
	    return proxy
	}

	var eachProxyPool = []

	function eachProxyAgent(data, proxy) {
	    var itemName = data.param || "el"
	    for (var i = 0, n = eachProxyPool.length; i < n; i++) {
	        var candidate = eachProxyPool[i]
	        if (candidate && candidate.hasOwnProperty(itemName)) {
	            eachProxyPool.splice(i, 1)
	            proxy = candidate
	            break
	        }
	    }
	    if (!proxy) {
	        proxy = eachProxyFactory(itemName)
	    }
	    return proxy
	}

	function eachProxyFactory(itemName) {
	    var source = {
	        $outer: {},
	        $index: 0,
	        $oldIndex: 0,
	        $anchor: null,
	        //-----
	        $first: false,
	        $last: false,
	        $remove: avalon.noop
	    }
	    source[itemName] = NaN

	    var force = {
	        $last: 1,
	        $first: 1,
	        $index: 1
	    }
	    force[itemName] = 1
	    var proxy = modelFactory(source, {
	        force: force
	    })
	    proxy.$id = generateID("$proxy$each")
	    return proxy
	}

	function decorateProxy(proxy, binding, type) {
	    if (type === "array") {
	        proxy.$remove = function () {

	            binding.$repeat.removeAt(proxy.$index)
	        }
	        var param = binding.param


	        proxy.$watch(param, function (a) {
	            var index = proxy.$index
	            binding.$repeat[index] = a
	        })
	    } else {
	        proxy.$watch("$val", function fn(a) {
	            binding.$repeat[proxy.$key] = a
	        })
	    }
	}

	var withProxyPool = []

	function withProxyAgent() {
	    return withProxyPool.pop() || withProxyFactory()
	}

	function withProxyFactory() {
	    var proxy = modelFactory({
	        $key: "",
	        $val: NaN,
	        $index: 0,
	        $oldIndex: 0,
	        $outer: {},
	        $anchor: null
	    }, {
	        force: {
	            $key: 1,
	            $val: 1,
	            $index: 1
	        }
	    })
	    proxy.$id = generateID("$proxy$with")
	    return proxy
	}


	function proxyRecycler(cache, key, param) {
	    var proxy = cache[key]
	    if (proxy) {
	        var proxyPool = proxy.$id.indexOf("$proxy$each") === 0 ? eachProxyPool : withProxyPool
	        proxy.$outer = {}

	        for (var i in proxy.$events) {
	            var a = proxy.$events[i]
	            if (Array.isArray(a)) {
	                a.length = 0
	                if (i === param) {
	                    proxy[param] = NaN

	                } else if (i === "$val") {
	                    proxy.$val = NaN
	                }
	            }
	        }

	        if (proxyPool.unshift(proxy) > kernel.maxRepeatSize) {
	            proxyPool.pop()
	        }
	        delete cache[key]
	    }
	}
	/*********************************************************************
	 *                         各种指令                                  *
	 **********************************************************************/
	//ms-skip绑定已经在scanTag 方法中实现
	avalon.directive("text", {
	    update: function (value) {
	        var elem = this.element
	        value = value == null ? "" : value //不在页面上显示undefined null
	        if (elem.nodeType === 3) { //绑定在文本节点上
	            try { //IE对游离于DOM树外的节点赋值会报错
	                elem.data = value
	            } catch (e) {
	            }
	        } else { //绑定在特性节点上
	            if ("textContent" in elem) {
	                elem.textContent = value
	            } else {
	                elem.innerText = value
	            }
	        }
	    }
	})
	function parseDisplay(nodeName, val) {
	    //用于取得此类标签的默认display值
	    var key = "_" + nodeName
	    if (!parseDisplay[key]) {
	        var node = DOC.createElement(nodeName)
	        root.appendChild(node)
	        if (W3C) {
	            val = getComputedStyle(node, null).display
	        } else {
	            val = node.currentStyle.display
	        }
	        root.removeChild(node)
	        parseDisplay[key] = val
	    }
	    return parseDisplay[key]
	}

	avalon.parseDisplay = parseDisplay

	avalon.directive("visible", {
	    init: function (binding) {
	        effectBinding(binding.element, binding)
	    },
	    update: function (val) {
	        var binding = this, elem = this.element, stamp
	        var noEffect = !this.effectName
	        if (!this.stamp) {
	            stamp = this.stamp = +new Date
	            if (val) {
	                elem.style.display = binding.display || ""
	                if (avalon(elem).css("display") === "none") {
	                    elem.style.display = binding.display = parseDisplay(elem.nodeName)
	                }
	            } else {
	                elem.style.display = "none"
	            }
	            return
	        }
	        stamp = this.stamp = +new Date
	        if (val) {
	            avalon.effect.apply(elem, 1, function () {
	                if (stamp !== binding.stamp)
	                    return
	                var driver = elem.getAttribute("data-effect-driver") || "a"

	                if (noEffect) {//不用动画时走这里
	                    elem.style.display = binding.display || ""
	                }
	                // "a", "t"
	                if (driver === "a" || driver === "t") {
	                    if (avalon(elem).css("display") === "none") {
	                        elem.style.display = binding.display || parseDisplay(elem.nodeName)
	                    }
	                }
	            })
	        } else {
	            avalon.effect.apply(elem, 0, function () {
	                if (stamp !== binding.stamp)
	                    return
	                elem.style.display = "none"
	            })
	        }
	    }
	})

	/*********************************************************************
	 *                             自带过滤器                            *
	 **********************************************************************/
	var rscripts = /<script[^>]*>([\S\s]*?)<\/script\s*>/gim
	var ron = /\s+(on[^=\s]+)(?:=("[^"]*"|'[^']*'|[^\s>]+))?/g
	var ropen = /<\w+\b(?:(["'])[^"]*?(\1)|[^>])*>/ig
	var rsanitize = {
	    a: /\b(href)\=("javascript[^"]*"|'javascript[^']*')/ig,
	    img: /\b(src)\=("javascript[^"]*"|'javascript[^']*')/ig,
	    form: /\b(action)\=("javascript[^"]*"|'javascript[^']*')/ig
	}
	var rsurrogate = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g
	var rnoalphanumeric = /([^\#-~| |!])/g;

	function numberFormat(number, decimals, point, thousands) {
	    //form http://phpjs.org/functions/number_format/
	    //number	必需，要格式化的数字
	    //decimals	可选，规定多少个小数位。
	    //point	可选，规定用作小数点的字符串（默认为 . ）。
	    //thousands	可选，规定用作千位分隔符的字符串（默认为 , ），如果设置了该参数，那么所有其他参数都是必需的。
	    number = (number + '')
	            .replace(/[^0-9+\-Ee.]/g, '')
	    var n = !isFinite(+number) ? 0 : +number,
	            prec = !isFinite(+decimals) ? 3 : Math.abs(decimals),
	            sep = thousands || ",",
	            dec = point || ".",
	            s = '',
	            toFixedFix = function(n, prec) {
	                var k = Math.pow(10, prec)
	                return '' + (Math.round(n * k) / k)
	                        .toFixed(prec)
	            }
	    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
	    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
	            .split('.')
	    if (s[0].length > 3) {
	        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
	    }
	    if ((s[1] || '')
	            .length < prec) {
	        s[1] = s[1] || ''
	        s[1] += new Array(prec - s[1].length + 1)
	                .join('0')
	    }
	    return s.join(dec)
	}


	var filters = avalon.filters = {
	    uppercase: function(str) {
	        return str.toUpperCase()
	    },
	    lowercase: function(str) {
	        return str.toLowerCase()
	    },
	    truncate: function(str, length, truncation) {
	        //length，新字符串长度，truncation，新字符串的结尾的字段,返回新字符串
	        length = length || 30
	        truncation = typeof truncation === "string" ?  truncation : "..." 
	        return str.length > length ? str.slice(0, length - truncation.length) + truncation : String(str)
	    },
	    $filter: function(val) {
	        for (var i = 1, n = arguments.length; i < n; i++) {
	            var array = arguments[i]
	            var fn = avalon.filters[array[0]]
	            if (typeof fn === "function") {
	                var arr = [val].concat(array.slice(1))
	                val = fn.apply(null, arr)
	            }
	        }
	        return val
	    },
	    camelize: camelize,
	    //https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
	    //    <a href="javasc&NewLine;ript&colon;alert('XSS')">chrome</a> 
	    //    <a href="data:text/html;base64, PGltZyBzcmM9eCBvbmVycm9yPWFsZXJ0KDEpPg==">chrome</a>
	    //    <a href="jav	ascript:alert('XSS');">IE67chrome</a>
	    //    <a href="jav&#x09;ascript:alert('XSS');">IE67chrome</a>
	    //    <a href="jav&#x0A;ascript:alert('XSS');">IE67chrome</a>
	    sanitize: function(str) {
	        return str.replace(rscripts, "").replace(ropen, function(a, b) {
	            var match = a.toLowerCase().match(/<(\w+)\s/)
	            if (match) { //处理a标签的href属性，img标签的src属性，form标签的action属性
	                var reg = rsanitize[match[1]]
	                if (reg) {
	                    a = a.replace(reg, function(s, name, value) {
	                        var quote = value.charAt(0)
	                        return name + "=" + quote + "javascript:void(0)" + quote// jshint ignore:line
	                    })
	                }
	            }
	            return a.replace(ron, " ").replace(/\s+/g, " ") //移除onXXX事件
	        })
	    },
	    escape: function(str) {
	        //将字符串经过 str 转义得到适合在页面中显示的内容, 例如替换 < 为 &lt 
	        return String(str).
	                replace(/&/g, '&amp;').
	                replace(rsurrogate, function(value) {
	                    var hi = value.charCodeAt(0)
	                    var low = value.charCodeAt(1)
	                    return '&#' + (((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000) + ';'
	                }).
	                replace(rnoalphanumeric, function(value) {
	                    return '&#' + value.charCodeAt(0) + ';'
	                }).
	                replace(/</g, '&lt;').
	                replace(/>/g, '&gt;')
	    },
	    currency: function(amount, symbol, fractionSize) {
	        return (symbol || "\uFFE5") + numberFormat(amount, isFinite(fractionSize) ? fractionSize : 2)
	    },
	    number: numberFormat
	}
	/*
	 'yyyy': 4 digit representation of year (e.g. AD 1 => 0001, AD 2010 => 2010)
	 'yy': 2 digit representation of year, padded (00-99). (e.g. AD 2001 => 01, AD 2010 => 10)
	 'y': 1 digit representation of year, e.g. (AD 1 => 1, AD 199 => 199)
	 'MMMM': Month in year (January-December)
	 'MMM': Month in year (Jan-Dec)
	 'MM': Month in year, padded (01-12)
	 'M': Month in year (1-12)
	 'dd': Day in month, padded (01-31)
	 'd': Day in month (1-31)
	 'EEEE': Day in Week,(Sunday-Saturday)
	 'EEE': Day in Week, (Sun-Sat)
	 'HH': Hour in day, padded (00-23)
	 'H': Hour in day (0-23)
	 'hh': Hour in am/pm, padded (01-12)
	 'h': Hour in am/pm, (1-12)
	 'mm': Minute in hour, padded (00-59)
	 'm': Minute in hour (0-59)
	 'ss': Second in minute, padded (00-59)
	 's': Second in minute (0-59)
	 'a': am/pm marker
	 'Z': 4 digit (+sign) representation of the timezone offset (-1200-+1200)
	 format string can also be one of the following predefined localizable formats:
	 
	 'medium': equivalent to 'MMM d, y h:mm:ss a' for en_US locale (e.g. Sep 3, 2010 12:05:08 pm)
	 'short': equivalent to 'M/d/yy h:mm a' for en_US locale (e.g. 9/3/10 12:05 pm)
	 'fullDate': equivalent to 'EEEE, MMMM d,y' for en_US locale (e.g. Friday, September 3, 2010)
	 'longDate': equivalent to 'MMMM d, y' for en_US locale (e.g. September 3, 2010
	 'mediumDate': equivalent to 'MMM d, y' for en_US locale (e.g. Sep 3, 2010)
	 'shortDate': equivalent to 'M/d/yy' for en_US locale (e.g. 9/3/10)
	 'mediumTime': equivalent to 'h:mm:ss a' for en_US locale (e.g. 12:05:08 pm)
	 'shortTime': equivalent to 'h:mm a' for en_US locale (e.g. 12:05 pm)
	 */
	new function() {// jshint ignore:line
	    function toInt(str) {
	        return parseInt(str, 10) || 0
	    }

	    function padNumber(num, digits, trim) {
	        var neg = ""
	        if (num < 0) {
	            neg = '-'
	            num = -num
	        }
	        num = "" + num
	        while (num.length < digits)
	            num = "0" + num
	        if (trim)
	            num = num.substr(num.length - digits)
	        return neg + num
	    }

	    function dateGetter(name, size, offset, trim) {
	        return function(date) {
	            var value = date["get" + name]()
	            if (offset > 0 || value > -offset)
	                value += offset
	            if (value === 0 && offset === -12) {
	                value = 12
	            }
	            return padNumber(value, size, trim)
	        }
	    }

	    function dateStrGetter(name, shortForm) {
	        return function(date, formats) {
	            var value = date["get" + name]()
	            var get = (shortForm ? ("SHORT" + name) : name).toUpperCase()
	            return formats[get][value]
	        }
	    }

	    function timeZoneGetter(date) {
	        var zone = -1 * date.getTimezoneOffset()
	        var paddedZone = (zone >= 0) ? "+" : ""
	        paddedZone += padNumber(Math[zone > 0 ? "floor" : "ceil"](zone / 60), 2) + padNumber(Math.abs(zone % 60), 2)
	        return paddedZone
	    }
	    //取得上午下午

	    function ampmGetter(date, formats) {
	        return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1]
	    }
	    var DATE_FORMATS = {
	        yyyy: dateGetter("FullYear", 4),
	        yy: dateGetter("FullYear", 2, 0, true),
	        y: dateGetter("FullYear", 1),
	        MMMM: dateStrGetter("Month"),
	        MMM: dateStrGetter("Month", true),
	        MM: dateGetter("Month", 2, 1),
	        M: dateGetter("Month", 1, 1),
	        dd: dateGetter("Date", 2),
	        d: dateGetter("Date", 1),
	        HH: dateGetter("Hours", 2),
	        H: dateGetter("Hours", 1),
	        hh: dateGetter("Hours", 2, -12),
	        h: dateGetter("Hours", 1, -12),
	        mm: dateGetter("Minutes", 2),
	        m: dateGetter("Minutes", 1),
	        ss: dateGetter("Seconds", 2),
	        s: dateGetter("Seconds", 1),
	        sss: dateGetter("Milliseconds", 3),
	        EEEE: dateStrGetter("Day"),
	        EEE: dateStrGetter("Day", true),
	        a: ampmGetter,
	        Z: timeZoneGetter
	    }
	    var rdateFormat = /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/
	    var raspnetjson = /^\/Date\((\d+)\)\/$/
	    filters.date = function(date, format) {
	        var locate = filters.date.locate,
	                text = "",
	                parts = [],
	                fn, match
	        format = format || "mediumDate"
	        format = locate[format] || format
	        if (typeof date === "string") {
	            if (/^\d+$/.test(date)) {
	                date = toInt(date)
	            } else if (raspnetjson.test(date)) {
	                date = +RegExp.$1
	            } else {
	                var trimDate = date.trim()
	                var dateArray = [0, 0, 0, 0, 0, 0, 0]
	                var oDate = new Date(0)
	                //取得年月日
	                trimDate = trimDate.replace(/^(\d+)\D(\d+)\D(\d+)/, function(_, a, b, c) {
	                    var array = c.length === 4 ? [c, a, b] : [a, b, c]
	                    dateArray[0] = toInt(array[0])     //年
	                    dateArray[1] = toInt(array[1]) - 1 //月
	                    dateArray[2] = toInt(array[2])     //日
	                    return ""
	                })
	                var dateSetter = oDate.setFullYear
	                var timeSetter = oDate.setHours
	                trimDate = trimDate.replace(/[T\s](\d+):(\d+):?(\d+)?\.?(\d)?/, function(_, a, b, c, d) {
	                    dateArray[3] = toInt(a) //小时
	                    dateArray[4] = toInt(b) //分钟
	                    dateArray[5] = toInt(c) //秒
	                    if (d) {                //毫秒
	                        dateArray[6] = Math.round(parseFloat("0." + d) * 1000)
	                    }
	                    return ""
	                })
	                var tzHour = 0
	                var tzMin = 0
	                trimDate = trimDate.replace(/Z|([+-])(\d\d):?(\d\d)/, function(z, symbol, c, d) {
	                    dateSetter = oDate.setUTCFullYear
	                    timeSetter = oDate.setUTCHours
	                    if (symbol) {
	                        tzHour = toInt(symbol + c)
	                        tzMin = toInt(symbol + d)
	                    }
	                    return ""
	                })

	                dateArray[3] -= tzHour
	                dateArray[4] -= tzMin
	                dateSetter.apply(oDate, dateArray.slice(0, 3))
	                timeSetter.apply(oDate, dateArray.slice(3))
	                date = oDate
	            }
	        }
	        if (typeof date === "number") {
	            date = new Date(date)
	        }
	        if (avalon.type(date) !== "date") {
	            return
	        }
	        while (format) {
	            match = rdateFormat.exec(format)
	            if (match) {
	                parts = parts.concat(match.slice(1))
	                format = parts.pop()
	            } else {
	                parts.push(format)
	                format = null
	            }
	        }
	        parts.forEach(function(value) {
	            fn = DATE_FORMATS[value]
	            text += fn ? fn(date, locate) : value.replace(/(^'|'$)/g, "").replace(/''/g, "'")
	        })
	        return text
	    }
	    var locate = {
	        AMPMS: {
	            0: "上午",
	            1: "下午"
	        },
	        DAY: {
	            0: "星期日",
	            1: "星期一",
	            2: "星期二",
	            3: "星期三",
	            4: "星期四",
	            5: "星期五",
	            6: "星期六"
	        },
	        MONTH: {
	            0: "1月",
	            1: "2月",
	            2: "3月",
	            3: "4月",
	            4: "5月",
	            5: "6月",
	            6: "7月",
	            7: "8月",
	            8: "9月",
	            9: "10月",
	            10: "11月",
	            11: "12月"
	        },
	        SHORTDAY: {
	            "0": "周日",
	            "1": "周一",
	            "2": "周二",
	            "3": "周三",
	            "4": "周四",
	            "5": "周五",
	            "6": "周六"
	        },
	        fullDate: "y年M月d日EEEE",
	        longDate: "y年M月d日",
	        medium: "yyyy-M-d H:mm:ss",
	        mediumDate: "yyyy-M-d",
	        mediumTime: "H:mm:ss",
	        "short": "yy-M-d ah:mm",
	        shortDate: "yy-M-d",
	        shortTime: "ah:mm"
	    }
	    locate.SHORTMONTH = locate.MONTH
	    filters.date.locate = locate
	}// jshint ignore:line
	/*********************************************************************
	 *                           DOMReady                               *
	 **********************************************************************/

	var readyList = [],
	    isReady
	var fireReady = function (fn) {
	    isReady = true
	    var require = avalon.require
	    if (require && require.checkDeps) {
	        modules["domReady!"].state = 4
	        require.checkDeps()
	    }
	    while (fn = readyList.shift()) {
	        fn(avalon)
	    }
	}

	function doScrollCheck() {
	    try { //IE下通过doScrollCheck检测DOM树是否建完
	        root.doScroll("left")
	        fireReady()
	    } catch (e) {
	        setTimeout(doScrollCheck)
	    }
	}

	if (DOC.readyState === "complete") {
	    setTimeout(fireReady) //如果在domReady之外加载
	} else if (W3C) {
	    DOC.addEventListener("DOMContentLoaded", fireReady)
	} else {
	    DOC.attachEvent("onreadystatechange", function () {
	        if (DOC.readyState === "complete") {
	            fireReady()
	        }
	    })
	    try {
	        var isTop = window.frameElement === null
	    } catch (e) {}
	    if (root.doScroll && isTop && window.external) { //fix IE iframe BUG
	        doScrollCheck()
	    }
	}
	avalon.bind(window, "load", fireReady)

	avalon.ready = function (fn) {
	    if (!isReady) {
	        readyList.push(fn)
	    } else {
	        fn(avalon)
	    }
	}

	avalon.config({
	    loader: true
	})

	avalon.ready(function () {
	    avalon.scan(DOC.body)
	})


	// Register as a named AMD module, since avalon can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase avalon is used because AMD module names are
	// derived from file names, and Avalon is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of avalon, it will work.

	// Note that for maximum portability, libraries that are not avalon should
	// declare themselves as anonymous modules, and avoid setting a global if an
	// AMD loader is present. avalon is a special case. For more information, see
	// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	            return avalon
	        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	    }
	// Map over avalon in case of overwrite
	    var _avalon = window.avalon
	    avalon.noConflict = function(deep) {
	        if (deep && window.avalon === avalon) {
	            window.avalon = _avalon
	        }
	        return avalon
	    }
	// Expose avalon identifiers, even in AMD
	// and CommonJS for browser emulators
	    if (noGlobal === void 0) {
	        window.avalon = avalon
	    }
	    return avalon

	}));

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var avalon = __webpack_require__(3)

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

	function toggleRadios(element, vm, hasActive) {
	    var parent = element.parentNode
	    while (parent && parent.nodeType === 1) {
	        if (parent.getAttribute("data-toggle") === "buttons") {
	            if (!hasActive)
	                vm.active = !vm.active
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
	avalon(document).bind("click", delegate)

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



	module.exports = avalon
	// 文档 http://v4-alpha.getbootstrap.com/components/buttons/
	// 代码 https://github.com/twbs/bootstrap/blob/v4-dev/dist/js/umd/button.js

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* 
	 * 
	 *检测对focusin/focusout的支持,不支持进行修复
	 *
	 *http://www.cnblogs.com/snandy/archive/2011/07/19/2110393.html
	 */
	var avalon = __webpack_require__(1)
	function supportEvent(eventName, element) {
	    var isSupported;
	    eventName = 'on' + eventName
	    isSupported = eventName in element

	    if (!isSupported && element.setAttribute) {
	        element.setAttribute(eventName, '')
	        isSupported = typeof element[eventName] === 'function'
	        if (element[eventName] !== void 0) {
	            element[eventName] = void 0
	        }
	        element.removeAttribute(eventName)
	    }
	    return isSupported
	}
	var supportFocusin = !!(document.documentElement.uniqueID || window.VBArray || window.opera || window.chrome)
	if (!supportFocusin) {
	    var a = document.createElement('a') 
	    a.href = "#"
	    supportFocusin = supportEvent("focusin", a)
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

	module.exports = avalon


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var avalon = __webpack_require__(1)
	var $ = __webpack_require__(5)
	__webpack_require__(6)

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
	    $ready: function (vm, element) {
	        var root = avalon(element)
	        vm._element = element
	        element["ms-nav-vm"] = vm
	        normailizeMenu(element)
	        if (/(tabs|pills)/.test(vm.type)) {
	            root.addClass("nav-" + vm.type)
	        }
	        if (vm.stacked) {
	            root.addClass("nav-stacked")
	        }
	        vm.onInit(vm)
	    },
	    show: function (elem) {
	        console.log("show....")
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
	        console.log(elem)
	        if (elem.getAttribute("data-toggle")) {
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
	            //处理下拉菜单
	            avalon.each(active.children, function (el) {
	                if (avalon(el).hasClass("dropdown-menu")) {
	                    var ativeItem = $(ClassName.ACTIVE, el)[0]
	                    if (ativeItem) {
	                        avalon(ativeItem).removeClass(ClassName.ACTIVE)
	                    }
	                }
	            })

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
	        //打开菜单 
	        if (element.parentNode && avalon(element.parentNode).hasClass(ClassName.DROPDOWN_MENU)) {
	            var p = element.parentNode, dropdownElement
	            while (p) {
	                if (avalon(p).hasClass("dropdown")) {
	                    //  $(dropdownElement).find(Selector.DROPDOWN_TOGGLE).addClass(ClassName.ACTIVE);
	                    break
	                }
	            }



	            element.setAttribute('aria-expanded', true);
	        }

	        if (callback) {
	            callback();
	        }
	    }

	    // static


	})


	function normailizeMenu(elem) {
	    var items = $("li", elem)
	    items = items.filter(function (el) {
	        return el.parentNode === elem
	    }).forEach(function (el) {
	        avalon(el).addClass("nav-item")
	        var a = el.children[0]
	        if (a && a.nodeName === "A") {
	            avalon(a).addClass("nav-link")
	        }
	    })
	}

	function delegate(event) {
	    var tigger = event.target
	    while (tigger && tigger.nodeType === 1) {
	        if (avalon(tigger).hasClass("nav-link")) {
	            event.preventDefault()
	            if (avalon(tigger).hasClass("disabled"))
	                return
	            //   }
	            //  if (/^(tab|pill)$/.test(tigger.getAttribute("data-toggle"))) {

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

/***/ },
/* 5 */
/***/ function(module, exports) {

	

	var snack = /(?:[\w\-\\.#]+)+(?:\[\w+?=([\'"])?(?:\\\1|.)+?\1\])?|\*|>/ig,
	        exprClassName = /^(?:[\w\-_]+)?\.([\w\-_]+)/,
	        exprId = /^(?:[\w\-_]+)?#([\w\-_]+)/,
	        exprNodeName = /^([\w\*\-_]+)/,
	        na = [null, null];

	function _find(selector, context) {

	    /**
	     * 保持与JQ的调用接口一致
	     * 
	     */

	    context = context || document;

	    var simple = /^[\w\-_#]+$/.test(selector);
	     //如果存在多个选择符,并可以使用querySelectorAll
	    if (!simple && context.querySelectorAll) {
	        return realArray(context.querySelectorAll(selector));
	    }
	    //处理并联选择器
	    if (selector.indexOf(',') > -1) {
	        var split = selector.split(/,/g), ret = [], sIndex = 0, len = split.length;
	        for (; sIndex < len; ++sIndex) {
	            ret = ret.concat(_find(split[sIndex], context));
	        }
	        return unique(ret);
	    }

	    var parts = selector.match(snack),
	            part = parts.pop(),
	            id = (part.match(exprId) || na)[1],
	            className = !id && (part.match(exprClassName) || na)[1],
	            nodeName = !id && (part.match(exprNodeName) || na)[1],
	            collection;
	    //处理类选择器
	    if (className && !nodeName && context.getElementsByClassName) {

	        collection = realArray(context.getElementsByClassName(className));

	    } else {
	 //兼容类选择器
	        collection = !id && realArray(context.getElementsByTagName(nodeName || '*'));

	        if (className) {
	            collection = filterByAttr(collection, 'className', RegExp('(^|\\s)' + className + '(\\s|$)'));
	        }

	        if (id) {
	            var byId = context.getElementById(id);
	            return byId ? [byId] : [];
	        }
	    }

	    return parts[0] && collection[0] ? filterParents(parts, collection) : collection;

	}

	function realArray(c) {

	    /**
	     * 转换纯数组
	     */

	    try {
	        return Array.prototype.slice.call(c);
	    } catch (e) {
	        var ret = [], i = 0, len = c.length;
	        for (; i < len; ++i) {
	            ret[i] = c[i];
	        }
	        return ret;
	    }

	}

	function filterParents(selectorParts, collection, direct) {

	    /**
	     * 处理亲子选择器
	     */

	    var parentSelector = selectorParts.pop();

	    if (parentSelector === '>') {
	        return filterParents(selectorParts, collection, true);
	    }

	    var ret = [],
	            r = -1,
	            id = (parentSelector.match(exprId) || na)[1],
	            className = !id && (parentSelector.match(exprClassName) || na)[1],
	            nodeName = !id && (parentSelector.match(exprNodeName) || na)[1],
	            cIndex = -1,
	            node, parent,
	            matches;

	    nodeName = nodeName && nodeName.toLowerCase();

	    while ((node = collection[++cIndex])) {

	        parent = node.parentNode;

	        do {

	            matches = !nodeName || nodeName === '*' || nodeName === parent.nodeName.toLowerCase();
	            matches = matches && (!id || parent.id === id);
	            matches = matches && (!className || RegExp('(^|\\s)' + className + '(\\s|$)').test(parent.className));

	            if (direct || matches) {
	                break;
	            }

	        } while ((parent = parent.parentNode));

	        if (matches) {
	            ret[++r] = node;
	        }
	    }

	    return selectorParts[0] && ret[0] ? filterParents(selectorParts, ret) : ret;

	}


	var unique = (function () {
	    //去掉
	    var uid = +new Date();

	    var data = (function () {

	        var n = 1;

	        return function (elem) {

	            var cacheIndex = elem[uid],
	                    nextCacheIndex = n++;

	            if (!cacheIndex) {
	                elem[uid] = nextCacheIndex;
	                return true;
	            }

	            return false;

	        };

	    })();

	    return function (arr) {

	        var length = arr.length,
	                ret = [],
	                r = -1,
	                i = 0,
	                item;

	        for (; i < length; ++i) {
	            item = arr[i];
	            if (data(item)) {
	                ret[++r] = item;
	            }
	        }

	        uid += 1;

	        return ret;

	    };

	})();

	function filterByAttr(collection, attr, regex) {

	    var i = -1, node, r = -1, ret = [];

	    while ((node = collection[++i])) {
	        if (regex.test(node[attr])) {
	            ret[++r] = node;
	        }
	    }

	    return ret
	}


	module.exports = _find



	/*
	 用法类似JQ, 支持以下简单组合
	 #id
	 tag
	 tag > .className
	 tag > tag
	 #id > tag.className
	 .className tag
	 tag, tag, #id
	 tag#id.className
	 .className
	 span > * > b
	tag.className tag.class

	================

	不支持各种:伪类, []属性选择器, ~兄长选择器, +相邻选择器
	 */

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var avalon = __webpack_require__(1)
	var TransitionEndEvent = {
	    WebkitTransition: 'webkitTransitionEnd',
	    MozTransition: 'transitionend',
	    OTransition: 'oTransitionEnd',
	    transition: 'transitionend'
	};
	var el = document.createElement('bootstrap');

	for (var _name in TransitionEndEvent) {
	    if (el.style[_name] !== undefined) {
	        avalon.eventHooks.transitionend = {
	            type:TransitionEndEvent[_name]
	        }
	    }
	}


	module.exports = avalon


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(8);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(10)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../usr/local/lib/node_modules/css-loader/index.js!./bootstrap.css", function() {
				var newContent = require("!!./../../../../usr/local/lib/node_modules/css-loader/index.js!./bootstrap.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(9)();
	// imports


	// module
	exports.push([module.id, "/*!\n * Bootstrap v4.0.0-alpha (http://getbootstrap.com)\n * Copyright 2011-2015 Twitter, Inc.\n * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\n */\n/*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */\nhtml {\n  font-family: sans-serif;\n  -webkit-text-size-adjust: 100%;\n      -ms-text-size-adjust: 100%;\n}\n\nbody {\n  margin: 0;\n}\n\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmain,\nmenu,\nnav,\nsection,\nsummary {\n  display: block;\n}\n\naudio,\ncanvas,\nprogress,\nvideo {\n  display: inline-block;\n  vertical-align: baseline;\n}\n\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\n\n[hidden],\ntemplate {\n  display: none;\n}\n\na {\n  background-color: transparent;\n}\n\na:active {\n  outline: 0;\n}\n\na:hover {\n  outline: 0;\n}\n\nabbr[title] {\n  border-bottom: 1px dotted;\n}\n\nb,\nstrong {\n  font-weight: bold;\n}\n\ndfn {\n  font-style: italic;\n}\n\nh1 {\n  margin: .67em 0;\n  font-size: 2em;\n}\n\nmark {\n  color: #000;\n  background: #ff0;\n}\n\nsmall {\n  font-size: 80%;\n}\n\nsub,\nsup {\n  position: relative;\n  font-size: 75%;\n  line-height: 0;\n  vertical-align: baseline;\n}\n\nsup {\n  top: -.5em;\n}\n\nsub {\n  bottom: -.25em;\n}\n\nimg {\n  border: 0;\n}\n\nsvg:not(:root) {\n  overflow: hidden;\n}\n\nfigure {\n  margin: 1em 40px;\n}\n\nhr {\n  height: 0;\n  -webkit-box-sizing: content-box;\n          box-sizing: content-box;\n}\n\npre {\n  overflow: auto;\n}\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace, monospace;\n  font-size: 1em;\n}\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  margin: 0;\n  font: inherit;\n  color: inherit;\n}\n\nbutton {\n  overflow: visible;\n}\n\nbutton,\nselect {\n  text-transform: none;\n}\n\nbutton,\nhtml input[type=\"button\"], input[type=\"reset\"],\ninput[type=\"submit\"] {\n  -webkit-appearance: button;\n  cursor: pointer;\n}\n\nbutton[disabled],\nhtml input[disabled] {\n  cursor: default;\n}\n\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner {\n  padding: 0;\n  border: 0;\n}\n\ninput {\n  line-height: normal;\n}\n\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  padding: 0;\n}\n\ninput[type=\"number\"]::-webkit-inner-spin-button,\ninput[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\ninput[type=\"search\"] {\n  -webkit-box-sizing: content-box;\n          box-sizing: content-box;\n  -webkit-appearance: textfield;\n}\n\ninput[type=\"search\"]::-webkit-search-cancel-button,\ninput[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\nfieldset {\n  padding: .35em .625em .75em;\n  margin: 0 2px;\n  border: 1px solid #c0c0c0;\n}\n\nlegend {\n  padding: 0;\n  border: 0;\n}\n\ntextarea {\n  overflow: auto;\n}\n\noptgroup {\n  font-weight: bold;\n}\n\ntable {\n  border-spacing: 0;\n  border-collapse: collapse;\n}\n\ntd,\nth {\n  padding: 0;\n}\n\n@media print {\n  *,\n  *::before,\n  *::after {\n    text-shadow: none !important;\n    -webkit-box-shadow: none !important;\n            box-shadow: none !important;\n  }\n  a,\n  a:visited {\n    text-decoration: underline;\n  }\n  abbr[title]::after {\n    content: \" (\" attr(title) \")\";\n  }\n  pre,\n  blockquote {\n    border: 1px solid #999;\n\n    page-break-inside: avoid;\n  }\n  thead {\n    display: table-header-group;\n  }\n  tr,\n  img {\n    page-break-inside: avoid;\n  }\n  img {\n    max-width: 100% !important;\n  }\n  p,\n  h2,\n  h3 {\n    orphans: 3;\n    widows: 3;\n  }\n  h2,\n  h3 {\n    page-break-after: avoid;\n  }\n  .navbar {\n    display: none;\n  }\n  .btn > .caret,\n  .dropup > .btn > .caret {\n    border-top-color: #000 !important;\n  }\n  .label {\n    border: 1px solid #000;\n  }\n  .table {\n    border-collapse: collapse !important;\n  }\n  .table td,\n  .table th {\n    background-color: #fff !important;\n  }\n  .table-bordered th,\n  .table-bordered td {\n    border: 1px solid #ddd !important;\n  }\n}\n\nhtml {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n\n*,\n*::before,\n*::after {\n  -webkit-box-sizing: inherit;\n          box-sizing: inherit;\n}\n\n@-moz-viewport {\n  width: device-width;\n}\n\n@-ms-viewport {\n  width: device-width;\n}\n\n@-webkit-viewport {\n  width: device-width;\n}\n\n@viewport {\n  width: device-width;\n}\n\nhtml {\n  font-size: 16px;\n\n  -webkit-tap-highlight-color: transparent;\n}\n\nbody {\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: 1rem;\n  line-height: 1.5;\n  color: #373a3c;\n  background-color: #fff;\n}\n\nh1, h2, h3, h4, h5, h6 {\n  margin-top: 0;\n  margin-bottom: .5rem;\n}\n\np {\n  margin-top: 0;\n  margin-bottom: 1rem;\n}\n\nabbr[title],\nabbr[data-original-title] {\n  cursor: help;\n  border-bottom: 1px dotted #818a91;\n}\n\naddress {\n  margin-bottom: 1rem;\n  font-style: normal;\n  line-height: inherit;\n}\n\nol,\nul,\ndl {\n  margin-top: 0;\n  margin-bottom: 1rem;\n}\n\nol ol,\nul ul,\nol ul,\nul ol {\n  margin-bottom: 0;\n}\n\ndt {\n  font-weight: bold;\n}\n\ndd {\n  margin-bottom: .5rem;\n  margin-left: 0;\n}\n\nblockquote {\n  margin: 0 0 1rem;\n}\n\na {\n  color: #0275d8;\n  text-decoration: none;\n}\n\na:focus,\na:hover {\n  color: #014c8c;\n  text-decoration: underline;\n}\n\na:focus {\n  outline: thin dotted;\n  outline: 5px auto -webkit-focus-ring-color;\n  outline-offset: -2px;\n}\n\npre {\n  margin-top: 0;\n  margin-bottom: 1rem;\n}\n\nfigure {\n  margin: 0 0 1rem;\n}\n\nimg {\n  vertical-align: middle;\n}\n\n[role=\"button\"] {\n  cursor: pointer;\n}\n\ntable {\n  background-color: transparent;\n}\n\ncaption {\n  padding-top: .75rem;\n  padding-bottom: .75rem;\n  color: #818a91;\n  text-align: left;\n  caption-side: bottom;\n}\n\nth {\n  text-align: left;\n}\n\nlabel {\n  display: inline-block;\n  margin-bottom: .5rem;\n}\n\ninput,\nbutton,\nselect,\ntextarea {\n  margin: 0;\n  line-height: inherit;\n  border-radius: 0;\n}\n\ntextarea {\n  resize: vertical;\n}\n\nfieldset {\n  min-width: 0;\n  padding: 0;\n  margin: 0;\n  border: 0;\n}\n\nlegend {\n  display: block;\n  width: 100%;\n  padding: 0;\n  margin-bottom: .5rem;\n  font-size: 1.5rem;\n  line-height: inherit;\n}\n\ninput[type=\"search\"] {\n  -webkit-box-sizing: inherit;\n          box-sizing: inherit;\n  -webkit-appearance: none;\n}\n\noutput {\n  display: inline-block;\n}\n\nh1, h2, h3, h4, h5, h6,\n.h1, .h2, .h3, .h4, .h5, .h6 {\n  font-family: inherit;\n  font-weight: 500;\n  line-height: 1.1;\n  color: inherit;\n}\n\nh1, .h1,\nh2, .h2,\nh3, .h3 {\n  margin-bottom: .5rem;\n}\n\nh4, .h4,\nh5, .h5,\nh6, .h6 {\n  margin-bottom: .5rem;\n}\n\nh1, .h1 {\n  font-size: 2.5rem;\n}\n\nh2, .h2 {\n  font-size: 2rem;\n}\n\nh3, .h3 {\n  font-size: 1.75rem;\n}\n\nh4, .h4 {\n  font-size: 1.5rem;\n}\n\nh5, .h5 {\n  font-size: 1.25rem;\n}\n\nh6, .h6 {\n  font-size: 1rem;\n}\n\n.lead {\n  font-size: 1.25rem;\n  font-weight: 300;\n}\n\n.display-1 {\n  font-size: 6rem;\n  font-weight: 300;\n}\n\n.display-2 {\n  font-size: 5.5rem;\n  font-weight: 300;\n}\n\n.display-3 {\n  font-size: 4.5rem;\n  font-weight: 300;\n}\n\n.display-4 {\n  font-size: 3.5rem;\n  font-weight: 300;\n}\n\nhr {\n  margin-top: 1rem;\n  margin-bottom: 1rem;\n  border: 0;\n  border-top: 1px solid rgba(0, 0, 0, .1);\n}\n\nsmall,\n.small {\n  font-size: 80%;\n  font-weight: normal;\n}\n\nmark,\n.mark {\n  padding: .2em;\n  background-color: #fcf8e3;\n}\n\n.list-unstyled {\n  padding-left: 0;\n  list-style: none;\n}\n\n.list-inline {\n  padding-left: 0;\n  margin-left: -5px;\n  list-style: none;\n}\n\n.list-inline > li {\n  display: inline-block;\n  padding-right: 5px;\n  padding-left: 5px;\n}\n\n.dl-horizontal {\n  margin-right: -1.875rem;\n  margin-left: -1.875rem;\n}\n\n.dl-horizontal::after {\n  display: table;\n  clear: both;\n  content: \"\";\n}\n\n.initialism {\n  font-size: 90%;\n  text-transform: uppercase;\n}\n\n.blockquote {\n  padding: .5rem 1rem;\n  margin-bottom: 1rem;\n  font-size: 1.25rem;\n  border-left: .25rem solid #eceeef;\n}\n\n.blockquote p:last-child,\n.blockquote ul:last-child,\n.blockquote ol:last-child {\n  margin-bottom: 0;\n}\n\n.blockquote footer {\n  display: block;\n  font-size: 80%;\n  line-height: 1.5;\n  color: #818a91;\n}\n\n.blockquote footer::before {\n  content: \"\\2014   \\A0\";\n}\n\n.blockquote-reverse {\n  padding-right: 1rem;\n  padding-left: 0;\n  text-align: right;\n  border-right: .25rem solid #eceeef;\n  border-left: 0;\n}\n\n.blockquote-reverse footer::before {\n  content: \"\";\n}\n\n.blockquote-reverse footer::after {\n  content: \"\\A0   \\2014\";\n}\n\n.figure {\n  display: inline-block;\n}\n\n.figure > img {\n  margin-bottom: .5rem;\n  line-height: 1;\n}\n\n.figure-caption {\n  font-size: 90%;\n  color: #818a91;\n}\n\n.img-fluid, .figure > img, .carousel-inner > .carousel-item > img,\n.carousel-inner > .carousel-item > a > img {\n  display: block;\n  max-width: 100%;\n  height: auto;\n}\n\n.img-rounded {\n  border-radius: .3rem;\n}\n\n.img-thumbnail {\n  display: inline-block;\n  max-width: 100%;\n  height: auto;\n  padding: .25rem;\n  line-height: 1.5;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-radius: .25rem;\n  -webkit-transition: all .2s ease-in-out;\n       -o-transition: all .2s ease-in-out;\n          transition: all .2s ease-in-out;\n}\n\n.img-circle {\n  border-radius: 50%;\n}\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: Menlo, Monaco, Consolas, \"Courier New\", monospace;\n}\n\ncode {\n  padding: .2rem .4rem;\n  font-size: 90%;\n  color: #bd4147;\n  background-color: #f7f7f9;\n  border-radius: .25rem;\n}\n\nkbd {\n  padding: .2rem .4rem;\n  font-size: 90%;\n  color: #fff;\n  background-color: #333;\n  border-radius: .2rem;\n}\n\nkbd kbd {\n  padding: 0;\n  font-size: 100%;\n  font-weight: bold;\n}\n\npre {\n  display: block;\n  margin-top: 0;\n  margin-bottom: 1rem;\n  font-size: 90%;\n  line-height: 1.5;\n  color: #373a3c;\n}\n\npre code {\n  padding: 0;\n  font-size: inherit;\n  color: inherit;\n  background-color: transparent;\n  border-radius: 0;\n}\n\n.pre-scrollable {\n  max-height: 340px;\n  overflow-y: scroll;\n}\n\n.container {\n  padding-right: .9375rem;\n  padding-left: .9375rem;\n  margin-right: auto;\n  margin-left: auto;\n}\n\n.container::after {\n  display: table;\n  clear: both;\n  content: \"\";\n}\n\n@media (min-width: 544px) {\n  .container {\n    max-width: 576px;\n  }\n}\n\n@media (min-width: 768px) {\n  .container {\n    max-width: 720px;\n  }\n}\n\n@media (min-width: 992px) {\n  .container {\n    max-width: 940px;\n  }\n}\n\n@media (min-width: 1200px) {\n  .container {\n    max-width: 1140px;\n  }\n}\n\n.container-fluid {\n  padding-right: .9375rem;\n  padding-left: .9375rem;\n  margin-right: auto;\n  margin-left: auto;\n}\n\n.container-fluid::after {\n  display: table;\n  clear: both;\n  content: \"\";\n}\n\n.row {\n  margin-right: -.9375rem;\n  margin-left: -.9375rem;\n}\n\n.row::after {\n  display: table;\n  clear: both;\n  content: \"\";\n}\n\n.col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12 {\n  position: relative;\n  min-height: 1px;\n  padding-right: .9375rem;\n  padding-left: .9375rem;\n}\n\n.col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12 {\n  float: left;\n}\n\n.col-xs-1 {\n  width: 8.333333%;\n}\n\n.col-xs-2 {\n  width: 16.666667%;\n}\n\n.col-xs-3 {\n  width: 25%;\n}\n\n.col-xs-4 {\n  width: 33.333333%;\n}\n\n.col-xs-5 {\n  width: 41.666667%;\n}\n\n.col-xs-6 {\n  width: 50%;\n}\n\n.col-xs-7 {\n  width: 58.333333%;\n}\n\n.col-xs-8 {\n  width: 66.666667%;\n}\n\n.col-xs-9 {\n  width: 75%;\n}\n\n.col-xs-10 {\n  width: 83.333333%;\n}\n\n.col-xs-11 {\n  width: 91.666667%;\n}\n\n.col-xs-12 {\n  width: 100%;\n}\n\n.col-xs-pull-0 {\n  right: auto;\n}\n\n.col-xs-pull-1 {\n  right: 8.333333%;\n}\n\n.col-xs-pull-2 {\n  right: 16.666667%;\n}\n\n.col-xs-pull-3 {\n  right: 25%;\n}\n\n.col-xs-pull-4 {\n  right: 33.333333%;\n}\n\n.col-xs-pull-5 {\n  right: 41.666667%;\n}\n\n.col-xs-pull-6 {\n  right: 50%;\n}\n\n.col-xs-pull-7 {\n  right: 58.333333%;\n}\n\n.col-xs-pull-8 {\n  right: 66.666667%;\n}\n\n.col-xs-pull-9 {\n  right: 75%;\n}\n\n.col-xs-pull-10 {\n  right: 83.333333%;\n}\n\n.col-xs-pull-11 {\n  right: 91.666667%;\n}\n\n.col-xs-pull-12 {\n  right: 100%;\n}\n\n.col-xs-push-0 {\n  left: auto;\n}\n\n.col-xs-push-1 {\n  left: 8.333333%;\n}\n\n.col-xs-push-2 {\n  left: 16.666667%;\n}\n\n.col-xs-push-3 {\n  left: 25%;\n}\n\n.col-xs-push-4 {\n  left: 33.333333%;\n}\n\n.col-xs-push-5 {\n  left: 41.666667%;\n}\n\n.col-xs-push-6 {\n  left: 50%;\n}\n\n.col-xs-push-7 {\n  left: 58.333333%;\n}\n\n.col-xs-push-8 {\n  left: 66.666667%;\n}\n\n.col-xs-push-9 {\n  left: 75%;\n}\n\n.col-xs-push-10 {\n  left: 83.333333%;\n}\n\n.col-xs-push-11 {\n  left: 91.666667%;\n}\n\n.col-xs-push-12 {\n  left: 100%;\n}\n\n.col-xs-offset-0 {\n  margin-left: 0;\n}\n\n.col-xs-offset-1 {\n  margin-left: 8.333333%;\n}\n\n.col-xs-offset-2 {\n  margin-left: 16.666667%;\n}\n\n.col-xs-offset-3 {\n  margin-left: 25%;\n}\n\n.col-xs-offset-4 {\n  margin-left: 33.333333%;\n}\n\n.col-xs-offset-5 {\n  margin-left: 41.666667%;\n}\n\n.col-xs-offset-6 {\n  margin-left: 50%;\n}\n\n.col-xs-offset-7 {\n  margin-left: 58.333333%;\n}\n\n.col-xs-offset-8 {\n  margin-left: 66.666667%;\n}\n\n.col-xs-offset-9 {\n  margin-left: 75%;\n}\n\n.col-xs-offset-10 {\n  margin-left: 83.333333%;\n}\n\n.col-xs-offset-11 {\n  margin-left: 91.666667%;\n}\n\n.col-xs-offset-12 {\n  margin-left: 100%;\n}\n\n@media (min-width: 544px) {\n  .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12 {\n    float: left;\n  }\n  .col-sm-1 {\n    width: 8.333333%;\n  }\n  .col-sm-2 {\n    width: 16.666667%;\n  }\n  .col-sm-3 {\n    width: 25%;\n  }\n  .col-sm-4 {\n    width: 33.333333%;\n  }\n  .col-sm-5 {\n    width: 41.666667%;\n  }\n  .col-sm-6 {\n    width: 50%;\n  }\n  .col-sm-7 {\n    width: 58.333333%;\n  }\n  .col-sm-8 {\n    width: 66.666667%;\n  }\n  .col-sm-9 {\n    width: 75%;\n  }\n  .col-sm-10 {\n    width: 83.333333%;\n  }\n  .col-sm-11 {\n    width: 91.666667%;\n  }\n  .col-sm-12 {\n    width: 100%;\n  }\n  .col-sm-pull-0 {\n    right: auto;\n  }\n  .col-sm-pull-1 {\n    right: 8.333333%;\n  }\n  .col-sm-pull-2 {\n    right: 16.666667%;\n  }\n  .col-sm-pull-3 {\n    right: 25%;\n  }\n  .col-sm-pull-4 {\n    right: 33.333333%;\n  }\n  .col-sm-pull-5 {\n    right: 41.666667%;\n  }\n  .col-sm-pull-6 {\n    right: 50%;\n  }\n  .col-sm-pull-7 {\n    right: 58.333333%;\n  }\n  .col-sm-pull-8 {\n    right: 66.666667%;\n  }\n  .col-sm-pull-9 {\n    right: 75%;\n  }\n  .col-sm-pull-10 {\n    right: 83.333333%;\n  }\n  .col-sm-pull-11 {\n    right: 91.666667%;\n  }\n  .col-sm-pull-12 {\n    right: 100%;\n  }\n  .col-sm-push-0 {\n    left: auto;\n  }\n  .col-sm-push-1 {\n    left: 8.333333%;\n  }\n  .col-sm-push-2 {\n    left: 16.666667%;\n  }\n  .col-sm-push-3 {\n    left: 25%;\n  }\n  .col-sm-push-4 {\n    left: 33.333333%;\n  }\n  .col-sm-push-5 {\n    left: 41.666667%;\n  }\n  .col-sm-push-6 {\n    left: 50%;\n  }\n  .col-sm-push-7 {\n    left: 58.333333%;\n  }\n  .col-sm-push-8 {\n    left: 66.666667%;\n  }\n  .col-sm-push-9 {\n    left: 75%;\n  }\n  .col-sm-push-10 {\n    left: 83.333333%;\n  }\n  .col-sm-push-11 {\n    left: 91.666667%;\n  }\n  .col-sm-push-12 {\n    left: 100%;\n  }\n  .col-sm-offset-0 {\n    margin-left: 0;\n  }\n  .col-sm-offset-1 {\n    margin-left: 8.333333%;\n  }\n  .col-sm-offset-2 {\n    margin-left: 16.666667%;\n  }\n  .col-sm-offset-3 {\n    margin-left: 25%;\n  }\n  .col-sm-offset-4 {\n    margin-left: 33.333333%;\n  }\n  .col-sm-offset-5 {\n    margin-left: 41.666667%;\n  }\n  .col-sm-offset-6 {\n    margin-left: 50%;\n  }\n  .col-sm-offset-7 {\n    margin-left: 58.333333%;\n  }\n  .col-sm-offset-8 {\n    margin-left: 66.666667%;\n  }\n  .col-sm-offset-9 {\n    margin-left: 75%;\n  }\n  .col-sm-offset-10 {\n    margin-left: 83.333333%;\n  }\n  .col-sm-offset-11 {\n    margin-left: 91.666667%;\n  }\n  .col-sm-offset-12 {\n    margin-left: 100%;\n  }\n}\n\n@media (min-width: 768px) {\n  .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12 {\n    float: left;\n  }\n  .col-md-1 {\n    width: 8.333333%;\n  }\n  .col-md-2 {\n    width: 16.666667%;\n  }\n  .col-md-3 {\n    width: 25%;\n  }\n  .col-md-4 {\n    width: 33.333333%;\n  }\n  .col-md-5 {\n    width: 41.666667%;\n  }\n  .col-md-6 {\n    width: 50%;\n  }\n  .col-md-7 {\n    width: 58.333333%;\n  }\n  .col-md-8 {\n    width: 66.666667%;\n  }\n  .col-md-9 {\n    width: 75%;\n  }\n  .col-md-10 {\n    width: 83.333333%;\n  }\n  .col-md-11 {\n    width: 91.666667%;\n  }\n  .col-md-12 {\n    width: 100%;\n  }\n  .col-md-pull-0 {\n    right: auto;\n  }\n  .col-md-pull-1 {\n    right: 8.333333%;\n  }\n  .col-md-pull-2 {\n    right: 16.666667%;\n  }\n  .col-md-pull-3 {\n    right: 25%;\n  }\n  .col-md-pull-4 {\n    right: 33.333333%;\n  }\n  .col-md-pull-5 {\n    right: 41.666667%;\n  }\n  .col-md-pull-6 {\n    right: 50%;\n  }\n  .col-md-pull-7 {\n    right: 58.333333%;\n  }\n  .col-md-pull-8 {\n    right: 66.666667%;\n  }\n  .col-md-pull-9 {\n    right: 75%;\n  }\n  .col-md-pull-10 {\n    right: 83.333333%;\n  }\n  .col-md-pull-11 {\n    right: 91.666667%;\n  }\n  .col-md-pull-12 {\n    right: 100%;\n  }\n  .col-md-push-0 {\n    left: auto;\n  }\n  .col-md-push-1 {\n    left: 8.333333%;\n  }\n  .col-md-push-2 {\n    left: 16.666667%;\n  }\n  .col-md-push-3 {\n    left: 25%;\n  }\n  .col-md-push-4 {\n    left: 33.333333%;\n  }\n  .col-md-push-5 {\n    left: 41.666667%;\n  }\n  .col-md-push-6 {\n    left: 50%;\n  }\n  .col-md-push-7 {\n    left: 58.333333%;\n  }\n  .col-md-push-8 {\n    left: 66.666667%;\n  }\n  .col-md-push-9 {\n    left: 75%;\n  }\n  .col-md-push-10 {\n    left: 83.333333%;\n  }\n  .col-md-push-11 {\n    left: 91.666667%;\n  }\n  .col-md-push-12 {\n    left: 100%;\n  }\n  .col-md-offset-0 {\n    margin-left: 0;\n  }\n  .col-md-offset-1 {\n    margin-left: 8.333333%;\n  }\n  .col-md-offset-2 {\n    margin-left: 16.666667%;\n  }\n  .col-md-offset-3 {\n    margin-left: 25%;\n  }\n  .col-md-offset-4 {\n    margin-left: 33.333333%;\n  }\n  .col-md-offset-5 {\n    margin-left: 41.666667%;\n  }\n  .col-md-offset-6 {\n    margin-left: 50%;\n  }\n  .col-md-offset-7 {\n    margin-left: 58.333333%;\n  }\n  .col-md-offset-8 {\n    margin-left: 66.666667%;\n  }\n  .col-md-offset-9 {\n    margin-left: 75%;\n  }\n  .col-md-offset-10 {\n    margin-left: 83.333333%;\n  }\n  .col-md-offset-11 {\n    margin-left: 91.666667%;\n  }\n  .col-md-offset-12 {\n    margin-left: 100%;\n  }\n}\n\n@media (min-width: 992px) {\n  .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12 {\n    float: left;\n  }\n  .col-lg-1 {\n    width: 8.333333%;\n  }\n  .col-lg-2 {\n    width: 16.666667%;\n  }\n  .col-lg-3 {\n    width: 25%;\n  }\n  .col-lg-4 {\n    width: 33.333333%;\n  }\n  .col-lg-5 {\n    width: 41.666667%;\n  }\n  .col-lg-6 {\n    width: 50%;\n  }\n  .col-lg-7 {\n    width: 58.333333%;\n  }\n  .col-lg-8 {\n    width: 66.666667%;\n  }\n  .col-lg-9 {\n    width: 75%;\n  }\n  .col-lg-10 {\n    width: 83.333333%;\n  }\n  .col-lg-11 {\n    width: 91.666667%;\n  }\n  .col-lg-12 {\n    width: 100%;\n  }\n  .col-lg-pull-0 {\n    right: auto;\n  }\n  .col-lg-pull-1 {\n    right: 8.333333%;\n  }\n  .col-lg-pull-2 {\n    right: 16.666667%;\n  }\n  .col-lg-pull-3 {\n    right: 25%;\n  }\n  .col-lg-pull-4 {\n    right: 33.333333%;\n  }\n  .col-lg-pull-5 {\n    right: 41.666667%;\n  }\n  .col-lg-pull-6 {\n    right: 50%;\n  }\n  .col-lg-pull-7 {\n    right: 58.333333%;\n  }\n  .col-lg-pull-8 {\n    right: 66.666667%;\n  }\n  .col-lg-pull-9 {\n    right: 75%;\n  }\n  .col-lg-pull-10 {\n    right: 83.333333%;\n  }\n  .col-lg-pull-11 {\n    right: 91.666667%;\n  }\n  .col-lg-pull-12 {\n    right: 100%;\n  }\n  .col-lg-push-0 {\n    left: auto;\n  }\n  .col-lg-push-1 {\n    left: 8.333333%;\n  }\n  .col-lg-push-2 {\n    left: 16.666667%;\n  }\n  .col-lg-push-3 {\n    left: 25%;\n  }\n  .col-lg-push-4 {\n    left: 33.333333%;\n  }\n  .col-lg-push-5 {\n    left: 41.666667%;\n  }\n  .col-lg-push-6 {\n    left: 50%;\n  }\n  .col-lg-push-7 {\n    left: 58.333333%;\n  }\n  .col-lg-push-8 {\n    left: 66.666667%;\n  }\n  .col-lg-push-9 {\n    left: 75%;\n  }\n  .col-lg-push-10 {\n    left: 83.333333%;\n  }\n  .col-lg-push-11 {\n    left: 91.666667%;\n  }\n  .col-lg-push-12 {\n    left: 100%;\n  }\n  .col-lg-offset-0 {\n    margin-left: 0;\n  }\n  .col-lg-offset-1 {\n    margin-left: 8.333333%;\n  }\n  .col-lg-offset-2 {\n    margin-left: 16.666667%;\n  }\n  .col-lg-offset-3 {\n    margin-left: 25%;\n  }\n  .col-lg-offset-4 {\n    margin-left: 33.333333%;\n  }\n  .col-lg-offset-5 {\n    margin-left: 41.666667%;\n  }\n  .col-lg-offset-6 {\n    margin-left: 50%;\n  }\n  .col-lg-offset-7 {\n    margin-left: 58.333333%;\n  }\n  .col-lg-offset-8 {\n    margin-left: 66.666667%;\n  }\n  .col-lg-offset-9 {\n    margin-left: 75%;\n  }\n  .col-lg-offset-10 {\n    margin-left: 83.333333%;\n  }\n  .col-lg-offset-11 {\n    margin-left: 91.666667%;\n  }\n  .col-lg-offset-12 {\n    margin-left: 100%;\n  }\n}\n\n@media (min-width: 1200px) {\n  .col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12 {\n    float: left;\n  }\n  .col-xl-1 {\n    width: 8.333333%;\n  }\n  .col-xl-2 {\n    width: 16.666667%;\n  }\n  .col-xl-3 {\n    width: 25%;\n  }\n  .col-xl-4 {\n    width: 33.333333%;\n  }\n  .col-xl-5 {\n    width: 41.666667%;\n  }\n  .col-xl-6 {\n    width: 50%;\n  }\n  .col-xl-7 {\n    width: 58.333333%;\n  }\n  .col-xl-8 {\n    width: 66.666667%;\n  }\n  .col-xl-9 {\n    width: 75%;\n  }\n  .col-xl-10 {\n    width: 83.333333%;\n  }\n  .col-xl-11 {\n    width: 91.666667%;\n  }\n  .col-xl-12 {\n    width: 100%;\n  }\n  .col-xl-pull-0 {\n    right: auto;\n  }\n  .col-xl-pull-1 {\n    right: 8.333333%;\n  }\n  .col-xl-pull-2 {\n    right: 16.666667%;\n  }\n  .col-xl-pull-3 {\n    right: 25%;\n  }\n  .col-xl-pull-4 {\n    right: 33.333333%;\n  }\n  .col-xl-pull-5 {\n    right: 41.666667%;\n  }\n  .col-xl-pull-6 {\n    right: 50%;\n  }\n  .col-xl-pull-7 {\n    right: 58.333333%;\n  }\n  .col-xl-pull-8 {\n    right: 66.666667%;\n  }\n  .col-xl-pull-9 {\n    right: 75%;\n  }\n  .col-xl-pull-10 {\n    right: 83.333333%;\n  }\n  .col-xl-pull-11 {\n    right: 91.666667%;\n  }\n  .col-xl-pull-12 {\n    right: 100%;\n  }\n  .col-xl-push-0 {\n    left: auto;\n  }\n  .col-xl-push-1 {\n    left: 8.333333%;\n  }\n  .col-xl-push-2 {\n    left: 16.666667%;\n  }\n  .col-xl-push-3 {\n    left: 25%;\n  }\n  .col-xl-push-4 {\n    left: 33.333333%;\n  }\n  .col-xl-push-5 {\n    left: 41.666667%;\n  }\n  .col-xl-push-6 {\n    left: 50%;\n  }\n  .col-xl-push-7 {\n    left: 58.333333%;\n  }\n  .col-xl-push-8 {\n    left: 66.666667%;\n  }\n  .col-xl-push-9 {\n    left: 75%;\n  }\n  .col-xl-push-10 {\n    left: 83.333333%;\n  }\n  .col-xl-push-11 {\n    left: 91.666667%;\n  }\n  .col-xl-push-12 {\n    left: 100%;\n  }\n  .col-xl-offset-0 {\n    margin-left: 0;\n  }\n  .col-xl-offset-1 {\n    margin-left: 8.333333%;\n  }\n  .col-xl-offset-2 {\n    margin-left: 16.666667%;\n  }\n  .col-xl-offset-3 {\n    margin-left: 25%;\n  }\n  .col-xl-offset-4 {\n    margin-left: 33.333333%;\n  }\n  .col-xl-offset-5 {\n    margin-left: 41.666667%;\n  }\n  .col-xl-offset-6 {\n    margin-left: 50%;\n  }\n  .col-xl-offset-7 {\n    margin-left: 58.333333%;\n  }\n  .col-xl-offset-8 {\n    margin-left: 66.666667%;\n  }\n  .col-xl-offset-9 {\n    margin-left: 75%;\n  }\n  .col-xl-offset-10 {\n    margin-left: 83.333333%;\n  }\n  .col-xl-offset-11 {\n    margin-left: 91.666667%;\n  }\n  .col-xl-offset-12 {\n    margin-left: 100%;\n  }\n}\n\n.table {\n  width: 100%;\n  max-width: 100%;\n  margin-bottom: 1rem;\n}\n\n.table th,\n.table td {\n  padding: .75rem;\n  line-height: 1.5;\n  vertical-align: top;\n  border-top: 1px solid #eceeef;\n}\n\n.table thead th {\n  vertical-align: bottom;\n  border-bottom: 2px solid #eceeef;\n}\n\n.table tbody + tbody {\n  border-top: 2px solid #eceeef;\n}\n\n.table .table {\n  background-color: #fff;\n}\n\n.table-sm th,\n.table-sm td {\n  padding: .3rem;\n}\n\n.table-bordered {\n  border: 1px solid #eceeef;\n}\n\n.table-bordered th,\n.table-bordered td {\n  border: 1px solid #eceeef;\n}\n\n.table-bordered thead th,\n.table-bordered thead td {\n  border-bottom-width: 2px;\n}\n\n.table-striped tbody tr:nth-of-type(odd) {\n  background-color: #f9f9f9;\n}\n\n.table-hover tbody tr:hover {\n  background-color: #f5f5f5;\n}\n\n.table-active,\n.table-active > th,\n.table-active > td {\n  background-color: #f5f5f5;\n}\n\n.table-hover .table-active:hover {\n  background-color: #e8e8e8;\n}\n\n.table-hover .table-active:hover > td,\n.table-hover .table-active:hover > th {\n  background-color: #e8e8e8;\n}\n\n.table-success,\n.table-success > th,\n.table-success > td {\n  background-color: #dff0d8;\n}\n\n.table-hover .table-success:hover {\n  background-color: #d0e9c6;\n}\n\n.table-hover .table-success:hover > td,\n.table-hover .table-success:hover > th {\n  background-color: #d0e9c6;\n}\n\n.table-info,\n.table-info > th,\n.table-info > td {\n  background-color: #d9edf7;\n}\n\n.table-hover .table-info:hover {\n  background-color: #c4e3f3;\n}\n\n.table-hover .table-info:hover > td,\n.table-hover .table-info:hover > th {\n  background-color: #c4e3f3;\n}\n\n.table-warning,\n.table-warning > th,\n.table-warning > td {\n  background-color: #fcf8e3;\n}\n\n.table-hover .table-warning:hover {\n  background-color: #faf2cc;\n}\n\n.table-hover .table-warning:hover > td,\n.table-hover .table-warning:hover > th {\n  background-color: #faf2cc;\n}\n\n.table-danger,\n.table-danger > th,\n.table-danger > td {\n  background-color: #f2dede;\n}\n\n.table-hover .table-danger:hover {\n  background-color: #ebcccc;\n}\n\n.table-hover .table-danger:hover > td,\n.table-hover .table-danger:hover > th {\n  background-color: #ebcccc;\n}\n\n.table-responsive {\n  display: block;\n  width: 100%;\n  overflow-x: auto;\n}\n\n.thead-inverse th {\n  color: #fff;\n  background-color: #373a3c;\n}\n\n.thead-default th {\n  color: #55595c;\n  background-color: #eceeef;\n}\n\n.table-inverse {\n  color: #eceeef;\n  background-color: #373a3c;\n}\n\n.table-inverse.table-bordered {\n  border: 0;\n}\n\n.table-inverse th,\n.table-inverse td,\n.table-inverse thead th {\n  border-color: #55595c;\n}\n\n.table-reflow thead {\n  float: left;\n}\n\n.table-reflow tbody {\n  display: block;\n  white-space: nowrap;\n}\n\n.table-reflow th,\n.table-reflow td {\n  border-top: 1px solid #eceeef;\n  border-left: 1px solid #eceeef;\n}\n\n.table-reflow th:last-child,\n.table-reflow td:last-child {\n  border-right: 1px solid #eceeef;\n}\n\n.table-reflow thead:last-child tr:last-child th,\n.table-reflow thead:last-child tr:last-child td,\n.table-reflow tbody:last-child tr:last-child th,\n.table-reflow tbody:last-child tr:last-child td,\n.table-reflow tfoot:last-child tr:last-child th,\n.table-reflow tfoot:last-child tr:last-child td {\n  border-bottom: 1px solid #eceeef;\n}\n\n.table-reflow tr {\n  float: left;\n}\n\n.table-reflow tr th,\n.table-reflow tr td {\n  display: block !important;\n  border: 1px solid #eceeef;\n}\n\n.form-control {\n  display: block;\n  width: 100%;\n  padding: .375rem .75rem;\n  font-size: 1rem;\n  line-height: 1.5;\n  color: #55595c;\n  background-color: #fff;\n  background-image: none;\n  border: 1px solid #ccc;\n  border-radius: .25rem;\n}\n\n.form-control::-ms-expand {\n  background-color: transparent;\n  border: 0;\n}\n\n.form-control:focus {\n  border-color: #66afe9;\n  outline: none;\n}\n\n.form-control::-webkit-input-placeholder {\n  color: #999;\n  opacity: 1;\n}\n\n.form-control::-moz-placeholder {\n  color: #999;\n  opacity: 1;\n}\n\n.form-control:-ms-input-placeholder {\n  color: #999;\n  opacity: 1;\n}\n\n.form-control::placeholder {\n  color: #999;\n  opacity: 1;\n}\n\n.form-control:disabled,\n.form-control[readonly] {\n  background-color: #eceeef;\n  opacity: 1;\n}\n\n.form-control:disabled {\n  cursor: not-allowed;\n}\n\n.form-control-file,\n.form-control-range {\n  display: block;\n}\n\n.form-control-label {\n  padding: .375rem .75rem;\n  margin-bottom: 0;\n}\n\n@media screen and (-webkit-min-device-pixel-ratio: 0) {\n  input[type=\"date\"].form-control,\n  input[type=\"time\"].form-control,\n  input[type=\"datetime-local\"].form-control,\n  input[type=\"month\"].form-control {\n    line-height: 2.25rem;\n  }\n  input[type=\"date\"].input-sm,\n  .input-group-sm input[type=\"date\"].form-control,\n  input[type=\"time\"].input-sm,\n  .input-group-sm input[type=\"time\"].form-control,\n  input[type=\"datetime-local\"].input-sm,\n  .input-group-sm input[type=\"datetime-local\"].form-control,\n  input[type=\"month\"].input-sm,\n  .input-group-sm input[type=\"month\"].form-control {\n    line-height: 1.825rem;\n  }\n  input[type=\"date\"].input-lg,\n  .input-group-lg input[type=\"date\"].form-control,\n  input[type=\"time\"].input-lg,\n  .input-group-lg input[type=\"time\"].form-control,\n  input[type=\"datetime-local\"].input-lg,\n  .input-group-lg input[type=\"datetime-local\"].form-control,\n  input[type=\"month\"].input-lg,\n  .input-group-lg input[type=\"month\"].form-control {\n    line-height: 3.166667rem;\n  }\n}\n\n.form-control-static {\n  min-height: 2.25rem;\n  padding-top: .375rem;\n  padding-bottom: .375rem;\n  margin-bottom: 0;\n}\n\n.form-control-static.form-control-sm,\n.input-group-sm > .form-control-static.form-control,\n.input-group-sm > .form-control-static.input-group-addon,\n.input-group-sm > .input-group-btn > .form-control-static.btn,\n.form-control-static.form-control-lg, .input-group-lg > .form-control-static.form-control,\n.input-group-lg > .form-control-static.input-group-addon,\n.input-group-lg > .input-group-btn > .form-control-static.btn {\n  padding-right: 0;\n  padding-left: 0;\n}\n\n.form-control-sm, .input-group-sm > .form-control,\n.input-group-sm > .input-group-addon,\n.input-group-sm > .input-group-btn > .btn {\n  padding: .275rem .75rem;\n  font-size: .85rem;\n  line-height: 1.5;\n  border-radius: .2rem;\n}\n\n.form-control-lg, .input-group-lg > .form-control,\n.input-group-lg > .input-group-addon,\n.input-group-lg > .input-group-btn > .btn {\n  padding: .75rem 1.25rem;\n  font-size: 1.25rem;\n  line-height: 1.333333;\n  border-radius: .3rem;\n}\n\n.form-group {\n  margin-bottom: 1rem;\n}\n\n.radio,\n.checkbox {\n  position: relative;\n  display: block;\n  margin-bottom: .75rem;\n}\n\n.radio label,\n.checkbox label {\n  padding-left: 1.25rem;\n  margin-bottom: 0;\n  font-weight: normal;\n  cursor: pointer;\n}\n\n.radio label input:only-child,\n.checkbox label input:only-child {\n  position: static;\n}\n\n.radio input[type=\"radio\"],\n.radio-inline input[type=\"radio\"],\n.checkbox input[type=\"checkbox\"],\n.checkbox-inline input[type=\"checkbox\"] {\n  position: absolute;\n  margin-top: .25rem;\n  margin-left: -1.25rem;\n}\n\n.radio + .radio,\n.checkbox + .checkbox {\n  margin-top: -.25rem;\n}\n\n.radio-inline,\n.checkbox-inline {\n  position: relative;\n  display: inline-block;\n  padding-left: 1.25rem;\n  margin-bottom: 0;\n  font-weight: normal;\n  vertical-align: middle;\n  cursor: pointer;\n}\n\n.radio-inline + .radio-inline,\n.checkbox-inline + .checkbox-inline {\n  margin-top: 0;\n  margin-left: .75rem;\n}\n\ninput[type=\"radio\"]:disabled,\ninput[type=\"radio\"].disabled,\ninput[type=\"checkbox\"]:disabled,\ninput[type=\"checkbox\"].disabled {\n  cursor: not-allowed;\n}\n\n.radio-inline.disabled,\n.checkbox-inline.disabled {\n  cursor: not-allowed;\n}\n\n.radio.disabled label,\n.checkbox.disabled label {\n  cursor: not-allowed;\n}\n\n.form-control-success,\n.form-control-warning,\n.form-control-error {\n  padding-right: 2.25rem;\n  background-repeat: no-repeat;\n  background-position: center right .5625rem;\n  -webkit-background-size: 1.4625rem 1.4625rem;\n          background-size: 1.4625rem 1.4625rem;\n}\n\n.has-success .help-block,\n.has-success .form-control-label,\n.has-success .radio,\n.has-success .checkbox,\n.has-success .radio-inline,\n.has-success .checkbox-inline,\n.has-success.radio label,\n.has-success.checkbox label,\n.has-success.radio-inline label,\n.has-success.checkbox-inline label {\n  color: #5cb85c;\n}\n\n.has-success .form-control {\n  border-color: #5cb85c;\n}\n\n.has-success .input-group-addon {\n  color: #5cb85c;\n  background-color: #eaf6ea;\n  border-color: #5cb85c;\n}\n\n.has-success .form-control-feedback {\n  color: #5cb85c;\n}\n\n.has-success .form-control-success {\n  background-image: url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkNoZWNrIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDYxMiA3OTIiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDYxMiA3OTIiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxwYXRoIGZpbGw9IiM1Q0I4NUMiIGQ9Ik0yMzMuOCw2MTAuMWMtMTMuMywwLTI1LjktNi4yLTM0LTE2LjlMOTAuNSw0NDguOEM3Ni4zLDQzMCw4MCw0MDMuMyw5OC44LDM4OS4xYzE4LjgtMTQuMyw0NS41LTEwLjUsNTkuOCw4LjNsNzEuOSw5NWwyMjAuOS0yNTAuNWMxMi41LTIwLDM4LjgtMjYuMSw1OC44LTEzLjZjMjAsMTIuNCwyNi4xLDM4LjcsMTMuNiw1OC44TDI3MCw1OTBjLTcuNCwxMi0yMC4yLDE5LjQtMzQuMywyMC4xQzIzNS4xLDYxMC4xLDIzNC41LDYxMC4xLDIzMy44LDYxMC4xeiIvPjwvc3ZnPg==\");\n}\n\n.has-warning .help-block,\n.has-warning .form-control-label,\n.has-warning .radio,\n.has-warning .checkbox,\n.has-warning .radio-inline,\n.has-warning .checkbox-inline,\n.has-warning.radio label,\n.has-warning.checkbox label,\n.has-warning.radio-inline label,\n.has-warning.checkbox-inline label {\n  color: #f0ad4e;\n}\n\n.has-warning .form-control {\n  border-color: #f0ad4e;\n}\n\n.has-warning .input-group-addon {\n  color: #f0ad4e;\n  background-color: white;\n  border-color: #f0ad4e;\n}\n\n.has-warning .form-control-feedback {\n  color: #f0ad4e;\n}\n\n.has-warning .form-control-warning {\n  background-image: url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9Ildhcm5pbmciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNjEyIDc5MiIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgNjEyIDc5MiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZmlsbD0iI0YwQUQ0RSIgZD0iTTYwMyw2NDAuMmwtMjc4LjUtNTA5Yy0zLjgtNi42LTEwLjgtMTAuNi0xOC41LTEwLjZzLTE0LjcsNC4xLTE4LjUsMTAuNkw5LDY0MC4yYy0zLjcsNi41LTMuNiwxNC40LDAuMiwyMC44YzMuOCw2LjUsMTAuOCwxMC40LDE4LjMsMTAuNGg1NTcuMWM3LjUsMCwxNC41LTMuOSwxOC4zLTEwLjRDNjA2LjYsNjU0LjYsNjA2LjcsNjQ2LjYsNjAzLDY0MC4yeiBNMzM2LjYsNjEwLjJoLTYxLjJWNTQ5aDYxLjJWNjEwLjJ6IE0zMzYuNiw1MDMuMWgtNjEuMlYzMDQuMmg2MS4yVjUwMy4xeiIvPjwvc3ZnPg==\");\n}\n\n.has-error .help-block,\n.has-error .form-control-label,\n.has-error .radio,\n.has-error .checkbox,\n.has-error .radio-inline,\n.has-error .checkbox-inline,\n.has-error.radio label,\n.has-error.checkbox label,\n.has-error.radio-inline label,\n.has-error.checkbox-inline label {\n  color: #d9534f;\n}\n\n.has-error .form-control {\n  border-color: #d9534f;\n}\n\n.has-error .input-group-addon {\n  color: #d9534f;\n  background-color: #fdf7f7;\n  border-color: #d9534f;\n}\n\n.has-error .form-control-feedback {\n  color: #d9534f;\n}\n\n.has-error .form-control-error {\n  background-image: url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkNyb3NzIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDYxMiA3OTIiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDYxMiA3OTIiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxwYXRoIGZpbGw9IiNEOTUzNEYiIGQ9Ik00NDcsNTQ0LjRjLTE0LjQsMTQuNC0zNy42LDE0LjQtNTEuOSwwTDMwNiw0NTEuN2wtODkuMSw5Mi43Yy0xNC40LDE0LjQtMzcuNiwxNC40LTUxLjksMGMtMTQuNC0xNC40LTE0LjQtMzcuNiwwLTUxLjlsOTIuNC05Ni40TDE2NSwyOTkuNmMtMTQuNC0xNC40LTE0LjQtMzcuNiwwLTUxLjlzMzcuNi0xNC40LDUxLjksMGw4OS4yLDkyLjdsODkuMS05Mi43YzE0LjQtMTQuNCwzNy42LTE0LjQsNTEuOSwwYzE0LjQsMTQuNCwxNC40LDM3LjYsMCw1MS45TDM1NC43LDM5Nmw5Mi40LDk2LjRDNDYxLjQsNTA2LjgsNDYxLjQsNTMwLDQ0Nyw1NDQuNHoiLz48L3N2Zz4=\");\n}\n\n@media (min-width: 544px) {\n  .form-inline .form-group {\n    display: inline-block;\n    margin-bottom: 0;\n    vertical-align: middle;\n  }\n  .form-inline .form-control {\n    display: inline-block;\n    width: auto;\n    vertical-align: middle;\n  }\n  .form-inline .form-control-static {\n    display: inline-block;\n  }\n  .form-inline .input-group {\n    display: inline-table;\n    vertical-align: middle;\n  }\n  .form-inline .input-group .input-group-addon,\n  .form-inline .input-group .input-group-btn,\n  .form-inline .input-group .form-control {\n    width: auto;\n  }\n  .form-inline .input-group > .form-control {\n    width: 100%;\n  }\n  .form-inline .form-control-label {\n    margin-bottom: 0;\n    vertical-align: middle;\n  }\n  .form-inline .radio,\n  .form-inline .checkbox {\n    display: inline-block;\n    margin-top: 0;\n    margin-bottom: 0;\n    vertical-align: middle;\n  }\n  .form-inline .radio label,\n  .form-inline .checkbox label {\n    padding-left: 0;\n  }\n  .form-inline .radio input[type=\"radio\"],\n  .form-inline .checkbox input[type=\"checkbox\"] {\n    position: relative;\n    margin-left: 0;\n  }\n  .form-inline .has-feedback .form-control-feedback {\n    top: 0;\n  }\n}\n\n.btn {\n  display: inline-block;\n  padding: .375rem 1rem;\n  font-size: 1rem;\n  font-weight: normal;\n  line-height: 1.5;\n  text-align: center;\n  white-space: nowrap;\n  vertical-align: middle;\n  -ms-touch-action: manipulation;\n      touch-action: manipulation;\n  cursor: pointer;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  border: 1px solid transparent;\n  border-radius: .25rem;\n}\n\n.btn:focus,\n.btn.focus,\n.btn:active:focus,\n.btn:active.focus,\n.btn.active:focus,\n.btn.active.focus {\n  outline: thin dotted;\n  outline: 5px auto -webkit-focus-ring-color;\n  outline-offset: -2px;\n}\n\n.btn:focus,\n.btn:hover {\n  text-decoration: none;\n}\n\n.btn.focus {\n  text-decoration: none;\n}\n\n.btn:active,\n.btn.active {\n  background-image: none;\n  outline: 0;\n}\n\n.btn.disabled,\n.btn:disabled {\n  cursor: not-allowed;\n  opacity: .65;\n}\n\na.btn.disabled,\nfieldset[disabled] a.btn {\n  pointer-events: none;\n}\n\n.btn-primary {\n  color: #fff;\n  background-color: #0275d8;\n  border-color: #0275d8;\n}\n\n.btn-primary:hover {\n  color: #fff;\n  background-color: #025aa5;\n  border-color: #01549b;\n}\n\n.btn-primary:focus,\n.btn-primary.focus {\n  color: #fff;\n  background-color: #025aa5;\n  border-color: #01549b;\n}\n\n.btn-primary:active,\n.btn-primary.active,\n.open > .btn-primary.dropdown-toggle {\n  color: #fff;\n  background-color: #025aa5;\n  background-image: none;\n  border-color: #01549b;\n}\n\n.btn-primary:active:hover,\n.btn-primary:active:focus,\n.btn-primary:active.focus,\n.btn-primary.active:hover,\n.btn-primary.active:focus,\n.btn-primary.active.focus,\n.open > .btn-primary.dropdown-toggle:hover,\n.open > .btn-primary.dropdown-toggle:focus,\n.open > .btn-primary.dropdown-toggle.focus {\n  color: #fff;\n  background-color: #014682;\n  border-color: #01315a;\n}\n\n.btn-primary.disabled:focus,\n.btn-primary.disabled.focus,\n.btn-primary:disabled:focus,\n.btn-primary:disabled.focus {\n  background-color: #0275d8;\n  border-color: #0275d8;\n}\n\n.btn-primary.disabled:hover,\n.btn-primary:disabled:hover {\n  background-color: #0275d8;\n  border-color: #0275d8;\n}\n\n.btn-secondary {\n  color: #373a3c;\n  background-color: #fff;\n  border-color: #ccc;\n}\n\n.btn-secondary:hover {\n  color: #373a3c;\n  background-color: #e6e6e6;\n  border-color: #adadad;\n}\n\n.btn-secondary:focus,\n.btn-secondary.focus {\n  color: #373a3c;\n  background-color: #e6e6e6;\n  border-color: #adadad;\n}\n\n.btn-secondary:active,\n.btn-secondary.active,\n.open > .btn-secondary.dropdown-toggle {\n  color: #373a3c;\n  background-color: #e6e6e6;\n  background-image: none;\n  border-color: #adadad;\n}\n\n.btn-secondary:active:hover,\n.btn-secondary:active:focus,\n.btn-secondary:active.focus,\n.btn-secondary.active:hover,\n.btn-secondary.active:focus,\n.btn-secondary.active.focus,\n.open > .btn-secondary.dropdown-toggle:hover,\n.open > .btn-secondary.dropdown-toggle:focus,\n.open > .btn-secondary.dropdown-toggle.focus {\n  color: #373a3c;\n  background-color: #d4d4d4;\n  border-color: #8c8c8c;\n}\n\n.btn-secondary.disabled:focus,\n.btn-secondary.disabled.focus,\n.btn-secondary:disabled:focus,\n.btn-secondary:disabled.focus {\n  background-color: #fff;\n  border-color: #ccc;\n}\n\n.btn-secondary.disabled:hover,\n.btn-secondary:disabled:hover {\n  background-color: #fff;\n  border-color: #ccc;\n}\n\n.btn-info {\n  color: #fff;\n  background-color: #5bc0de;\n  border-color: #5bc0de;\n}\n\n.btn-info:hover {\n  color: #fff;\n  background-color: #31b0d5;\n  border-color: #2aabd2;\n}\n\n.btn-info:focus,\n.btn-info.focus {\n  color: #fff;\n  background-color: #31b0d5;\n  border-color: #2aabd2;\n}\n\n.btn-info:active,\n.btn-info.active,\n.open > .btn-info.dropdown-toggle {\n  color: #fff;\n  background-color: #31b0d5;\n  background-image: none;\n  border-color: #2aabd2;\n}\n\n.btn-info:active:hover,\n.btn-info:active:focus,\n.btn-info:active.focus,\n.btn-info.active:hover,\n.btn-info.active:focus,\n.btn-info.active.focus,\n.open > .btn-info.dropdown-toggle:hover,\n.open > .btn-info.dropdown-toggle:focus,\n.open > .btn-info.dropdown-toggle.focus {\n  color: #fff;\n  background-color: #269abc;\n  border-color: #1f7e9a;\n}\n\n.btn-info.disabled:focus,\n.btn-info.disabled.focus,\n.btn-info:disabled:focus,\n.btn-info:disabled.focus {\n  background-color: #5bc0de;\n  border-color: #5bc0de;\n}\n\n.btn-info.disabled:hover,\n.btn-info:disabled:hover {\n  background-color: #5bc0de;\n  border-color: #5bc0de;\n}\n\n.btn-success {\n  color: #fff;\n  background-color: #5cb85c;\n  border-color: #5cb85c;\n}\n\n.btn-success:hover {\n  color: #fff;\n  background-color: #449d44;\n  border-color: #419641;\n}\n\n.btn-success:focus,\n.btn-success.focus {\n  color: #fff;\n  background-color: #449d44;\n  border-color: #419641;\n}\n\n.btn-success:active,\n.btn-success.active,\n.open > .btn-success.dropdown-toggle {\n  color: #fff;\n  background-color: #449d44;\n  background-image: none;\n  border-color: #419641;\n}\n\n.btn-success:active:hover,\n.btn-success:active:focus,\n.btn-success:active.focus,\n.btn-success.active:hover,\n.btn-success.active:focus,\n.btn-success.active.focus,\n.open > .btn-success.dropdown-toggle:hover,\n.open > .btn-success.dropdown-toggle:focus,\n.open > .btn-success.dropdown-toggle.focus {\n  color: #fff;\n  background-color: #398439;\n  border-color: #2d672d;\n}\n\n.btn-success.disabled:focus,\n.btn-success.disabled.focus,\n.btn-success:disabled:focus,\n.btn-success:disabled.focus {\n  background-color: #5cb85c;\n  border-color: #5cb85c;\n}\n\n.btn-success.disabled:hover,\n.btn-success:disabled:hover {\n  background-color: #5cb85c;\n  border-color: #5cb85c;\n}\n\n.btn-warning {\n  color: #fff;\n  background-color: #f0ad4e;\n  border-color: #f0ad4e;\n}\n\n.btn-warning:hover {\n  color: #fff;\n  background-color: #ec971f;\n  border-color: #eb9316;\n}\n\n.btn-warning:focus,\n.btn-warning.focus {\n  color: #fff;\n  background-color: #ec971f;\n  border-color: #eb9316;\n}\n\n.btn-warning:active,\n.btn-warning.active,\n.open > .btn-warning.dropdown-toggle {\n  color: #fff;\n  background-color: #ec971f;\n  background-image: none;\n  border-color: #eb9316;\n}\n\n.btn-warning:active:hover,\n.btn-warning:active:focus,\n.btn-warning:active.focus,\n.btn-warning.active:hover,\n.btn-warning.active:focus,\n.btn-warning.active.focus,\n.open > .btn-warning.dropdown-toggle:hover,\n.open > .btn-warning.dropdown-toggle:focus,\n.open > .btn-warning.dropdown-toggle.focus {\n  color: #fff;\n  background-color: #d58512;\n  border-color: #b06d0f;\n}\n\n.btn-warning.disabled:focus,\n.btn-warning.disabled.focus,\n.btn-warning:disabled:focus,\n.btn-warning:disabled.focus {\n  background-color: #f0ad4e;\n  border-color: #f0ad4e;\n}\n\n.btn-warning.disabled:hover,\n.btn-warning:disabled:hover {\n  background-color: #f0ad4e;\n  border-color: #f0ad4e;\n}\n\n.btn-danger {\n  color: #fff;\n  background-color: #d9534f;\n  border-color: #d9534f;\n}\n\n.btn-danger:hover {\n  color: #fff;\n  background-color: #c9302c;\n  border-color: #c12e2a;\n}\n\n.btn-danger:focus,\n.btn-danger.focus {\n  color: #fff;\n  background-color: #c9302c;\n  border-color: #c12e2a;\n}\n\n.btn-danger:active,\n.btn-danger.active,\n.open > .btn-danger.dropdown-toggle {\n  color: #fff;\n  background-color: #c9302c;\n  background-image: none;\n  border-color: #c12e2a;\n}\n\n.btn-danger:active:hover,\n.btn-danger:active:focus,\n.btn-danger:active.focus,\n.btn-danger.active:hover,\n.btn-danger.active:focus,\n.btn-danger.active.focus,\n.open > .btn-danger.dropdown-toggle:hover,\n.open > .btn-danger.dropdown-toggle:focus,\n.open > .btn-danger.dropdown-toggle.focus {\n  color: #fff;\n  background-color: #ac2925;\n  border-color: #8b211e;\n}\n\n.btn-danger.disabled:focus,\n.btn-danger.disabled.focus,\n.btn-danger:disabled:focus,\n.btn-danger:disabled.focus {\n  background-color: #d9534f;\n  border-color: #d9534f;\n}\n\n.btn-danger.disabled:hover,\n.btn-danger:disabled:hover {\n  background-color: #d9534f;\n  border-color: #d9534f;\n}\n\n.btn-primary-outline {\n  color: #0275d8;\n  background-color: transparent;\n  background-image: none;\n  border-color: #0275d8;\n}\n\n.btn-primary-outline:focus,\n.btn-primary-outline.focus,\n.btn-primary-outline:active,\n.btn-primary-outline.active,\n.open > .btn-primary-outline.dropdown-toggle {\n  color: #fff;\n  background-color: #0275d8;\n  border-color: #0275d8;\n}\n\n.btn-primary-outline:hover {\n  color: #fff;\n  background-color: #0275d8;\n  border-color: #0275d8;\n}\n\n.btn-primary-outline.disabled:focus,\n.btn-primary-outline.disabled.focus,\n.btn-primary-outline:disabled:focus,\n.btn-primary-outline:disabled.focus {\n  border-color: #43a7fd;\n}\n\n.btn-primary-outline.disabled:hover,\n.btn-primary-outline:disabled:hover {\n  border-color: #43a7fd;\n}\n\n.btn-secondary-outline {\n  color: #ccc;\n  background-color: transparent;\n  background-image: none;\n  border-color: #ccc;\n}\n\n.btn-secondary-outline:focus,\n.btn-secondary-outline.focus,\n.btn-secondary-outline:active,\n.btn-secondary-outline.active,\n.open > .btn-secondary-outline.dropdown-toggle {\n  color: #fff;\n  background-color: #ccc;\n  border-color: #ccc;\n}\n\n.btn-secondary-outline:hover {\n  color: #fff;\n  background-color: #ccc;\n  border-color: #ccc;\n}\n\n.btn-secondary-outline.disabled:focus,\n.btn-secondary-outline.disabled.focus,\n.btn-secondary-outline:disabled:focus,\n.btn-secondary-outline:disabled.focus {\n  border-color: white;\n}\n\n.btn-secondary-outline.disabled:hover,\n.btn-secondary-outline:disabled:hover {\n  border-color: white;\n}\n\n.btn-info-outline {\n  color: #5bc0de;\n  background-color: transparent;\n  background-image: none;\n  border-color: #5bc0de;\n}\n\n.btn-info-outline:focus,\n.btn-info-outline.focus,\n.btn-info-outline:active,\n.btn-info-outline.active,\n.open > .btn-info-outline.dropdown-toggle {\n  color: #fff;\n  background-color: #5bc0de;\n  border-color: #5bc0de;\n}\n\n.btn-info-outline:hover {\n  color: #fff;\n  background-color: #5bc0de;\n  border-color: #5bc0de;\n}\n\n.btn-info-outline.disabled:focus,\n.btn-info-outline.disabled.focus,\n.btn-info-outline:disabled:focus,\n.btn-info-outline:disabled.focus {\n  border-color: #b0e1ef;\n}\n\n.btn-info-outline.disabled:hover,\n.btn-info-outline:disabled:hover {\n  border-color: #b0e1ef;\n}\n\n.btn-success-outline {\n  color: #5cb85c;\n  background-color: transparent;\n  background-image: none;\n  border-color: #5cb85c;\n}\n\n.btn-success-outline:focus,\n.btn-success-outline.focus,\n.btn-success-outline:active,\n.btn-success-outline.active,\n.open > .btn-success-outline.dropdown-toggle {\n  color: #fff;\n  background-color: #5cb85c;\n  border-color: #5cb85c;\n}\n\n.btn-success-outline:hover {\n  color: #fff;\n  background-color: #5cb85c;\n  border-color: #5cb85c;\n}\n\n.btn-success-outline.disabled:focus,\n.btn-success-outline.disabled.focus,\n.btn-success-outline:disabled:focus,\n.btn-success-outline:disabled.focus {\n  border-color: #a3d7a3;\n}\n\n.btn-success-outline.disabled:hover,\n.btn-success-outline:disabled:hover {\n  border-color: #a3d7a3;\n}\n\n.btn-warning-outline {\n  color: #f0ad4e;\n  background-color: transparent;\n  background-image: none;\n  border-color: #f0ad4e;\n}\n\n.btn-warning-outline:focus,\n.btn-warning-outline.focus,\n.btn-warning-outline:active,\n.btn-warning-outline.active,\n.open > .btn-warning-outline.dropdown-toggle {\n  color: #fff;\n  background-color: #f0ad4e;\n  border-color: #f0ad4e;\n}\n\n.btn-warning-outline:hover {\n  color: #fff;\n  background-color: #f0ad4e;\n  border-color: #f0ad4e;\n}\n\n.btn-warning-outline.disabled:focus,\n.btn-warning-outline.disabled.focus,\n.btn-warning-outline:disabled:focus,\n.btn-warning-outline:disabled.focus {\n  border-color: #f8d9ac;\n}\n\n.btn-warning-outline.disabled:hover,\n.btn-warning-outline:disabled:hover {\n  border-color: #f8d9ac;\n}\n\n.btn-danger-outline {\n  color: #d9534f;\n  background-color: transparent;\n  background-image: none;\n  border-color: #d9534f;\n}\n\n.btn-danger-outline:focus,\n.btn-danger-outline.focus,\n.btn-danger-outline:active,\n.btn-danger-outline.active,\n.open > .btn-danger-outline.dropdown-toggle {\n  color: #fff;\n  background-color: #d9534f;\n  border-color: #d9534f;\n}\n\n.btn-danger-outline:hover {\n  color: #fff;\n  background-color: #d9534f;\n  border-color: #d9534f;\n}\n\n.btn-danger-outline.disabled:focus,\n.btn-danger-outline.disabled.focus,\n.btn-danger-outline:disabled:focus,\n.btn-danger-outline:disabled.focus {\n  border-color: #eba5a3;\n}\n\n.btn-danger-outline.disabled:hover,\n.btn-danger-outline:disabled:hover {\n  border-color: #eba5a3;\n}\n\n.btn-link {\n  font-weight: normal;\n  color: #0275d8;\n  border-radius: 0;\n}\n\n.btn-link,\n.btn-link:active,\n.btn-link.active,\n.btn-link:disabled {\n  background-color: transparent;\n}\n\n.btn-link,\n.btn-link:focus,\n.btn-link:active {\n  border-color: transparent;\n}\n\n.btn-link:hover {\n  border-color: transparent;\n}\n\n.btn-link:focus,\n.btn-link:hover {\n  color: #014c8c;\n  text-decoration: underline;\n  background-color: transparent;\n}\n\n.btn-link:disabled:focus,\n.btn-link:disabled:hover {\n  color: #818a91;\n  text-decoration: none;\n}\n\n.btn-lg, .btn-group-lg > .btn {\n  padding: .75rem 1.25rem;\n  font-size: 1.25rem;\n  line-height: 1.333333;\n  border-radius: .3rem;\n}\n\n.btn-sm, .btn-group-sm > .btn {\n  padding: .25rem .75rem;\n  font-size: .85rem;\n  line-height: 1.5;\n  border-radius: .2rem;\n}\n\n.btn-block {\n  display: block;\n  width: 100%;\n}\n\n.btn-block + .btn-block {\n  margin-top: 5px;\n}\n\ninput[type=\"submit\"].btn-block,\ninput[type=\"reset\"].btn-block,\ninput[type=\"button\"].btn-block {\n  width: 100%;\n}\n\n.fade {\n  opacity: 0;\n  -webkit-transition: opacity .15s linear;\n       -o-transition: opacity .15s linear;\n          transition: opacity .15s linear;\n}\n\n.fade.in {\n  opacity: 1;\n}\n\n.collapse {\n  display: none;\n}\n\n.collapse.in {\n  display: block;\n}\n\n.collapsing {\n  position: relative;\n  height: 0;\n  overflow: hidden;\n  -webkit-transition-timing-function: ease;\n       -o-transition-timing-function: ease;\n          transition-timing-function: ease;\n  -webkit-transition-duration: .35s;\n       -o-transition-duration: .35s;\n          transition-duration: .35s;\n  -webkit-transition-property: height;\n       -o-transition-property: height;\n          transition-property: height;\n}\n\n.dropup,\n.dropdown {\n  position: relative;\n}\n\n.dropdown-toggle::after {\n  display: inline-block;\n  width: 0;\n  height: 0;\n  margin-left: .25rem;\n  vertical-align: middle;\n  content: \"\";\n  border-top: .3em solid;\n  border-right: .3em solid transparent;\n  border-left: .3em solid transparent;\n}\n\n.dropdown-toggle:focus {\n  outline: 0;\n}\n\n.dropup .dropdown-toggle::after {\n  border-top: 0;\n  border-bottom: .3em solid;\n}\n\n.dropdown-menu {\n  position: absolute;\n  top: 100%;\n  left: 0;\n  z-index: 1000;\n  display: none;\n  float: left;\n  min-width: 160px;\n  padding: 5px 0;\n  margin: 2px 0 0;\n  font-size: 1rem;\n  text-align: left;\n  list-style: none;\n  background-color: #fff;\n  -webkit-background-clip: padding-box;\n          background-clip: padding-box;\n  border: 1px solid rgba(0, 0, 0, .15);\n  border-radius: .25rem;\n}\n\n.dropdown-divider {\n  height: 1px;\n  margin: .5rem 0;\n  overflow: hidden;\n  background-color: #e5e5e5;\n}\n\n.dropdown-item {\n  display: block;\n  width: 100%;\n  padding: 3px 20px;\n  clear: both;\n  font-weight: normal;\n  line-height: 1.5;\n  color: #373a3c;\n  text-align: inherit;\n  white-space: nowrap;\n  background: none;\n  border: 0;\n}\n\n.dropdown-item:focus,\n.dropdown-item:hover {\n  color: #2b2d2f;\n  text-decoration: none;\n  background-color: #f5f5f5;\n}\n\n.dropdown-item.active,\n.dropdown-item.active:focus,\n.dropdown-item.active:hover {\n  color: #fff;\n  text-decoration: none;\n  background-color: #0275d8;\n  outline: 0;\n}\n\n.dropdown-item.disabled,\n.dropdown-item.disabled:focus,\n.dropdown-item.disabled:hover {\n  color: #818a91;\n}\n\n.dropdown-item.disabled:focus,\n.dropdown-item.disabled:hover {\n  text-decoration: none;\n  cursor: not-allowed;\n  background-color: transparent;\n  background-image: none;\n  filter: \"progid:DXImageTransform.Microsoft.gradient(enabled = false)\";\n}\n\n.open > .dropdown-menu {\n  display: block;\n}\n\n.open > a {\n  outline: 0;\n}\n\n.dropdown-menu-right {\n  right: 0;\n  left: auto;\n}\n\n.dropdown-menu-left {\n  right: auto;\n  left: 0;\n}\n\n.dropdown-header {\n  display: block;\n  padding: 3px 20px;\n  font-size: .85rem;\n  line-height: 1.5;\n  color: #818a91;\n  white-space: nowrap;\n}\n\n.dropdown-backdrop {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 990;\n}\n\n.pull-right > .dropdown-menu {\n  right: 0;\n  left: auto;\n}\n\n.dropup .caret,\n.navbar-fixed-bottom .dropdown .caret {\n  content: \"\";\n  border-top: 0;\n  border-bottom: .3em solid;\n}\n\n.dropup .dropdown-menu,\n.navbar-fixed-bottom .dropdown .dropdown-menu {\n  top: auto;\n  bottom: 100%;\n  margin-bottom: 2px;\n}\n\n.btn-group,\n.btn-group-vertical {\n  position: relative;\n  display: inline-block;\n  vertical-align: middle;\n}\n\n.btn-group > .btn,\n.btn-group-vertical > .btn {\n  position: relative;\n  float: left;\n}\n\n.btn-group > .btn:focus,\n.btn-group > .btn:active,\n.btn-group > .btn.active,\n.btn-group-vertical > .btn:focus,\n.btn-group-vertical > .btn:active,\n.btn-group-vertical > .btn.active {\n  z-index: 2;\n}\n\n.btn-group > .btn:hover,\n.btn-group-vertical > .btn:hover {\n  z-index: 2;\n}\n\n.btn-group .btn + .btn,\n.btn-group .btn + .btn-group,\n.btn-group .btn-group + .btn,\n.btn-group .btn-group + .btn-group {\n  margin-left: -1px;\n}\n\n.btn-toolbar {\n  margin-left: -5px;\n}\n\n.btn-toolbar::after {\n  display: table;\n  clear: both;\n  content: \"\";\n}\n\n.btn-toolbar .btn-group,\n.btn-toolbar .input-group {\n  float: left;\n}\n\n.btn-toolbar > .btn,\n.btn-toolbar > .btn-group,\n.btn-toolbar > .input-group {\n  margin-left: 5px;\n}\n\n.btn-group > .btn:not(:first-child):not(:last-child):not(.dropdown-toggle) {\n  border-radius: 0;\n}\n\n.btn-group > .btn:first-child {\n  margin-left: 0;\n}\n\n.btn-group > .btn:first-child:not(:last-child):not(.dropdown-toggle) {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n\n.btn-group > .btn:last-child:not(:first-child),\n.btn-group > .dropdown-toggle:not(:first-child) {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n\n.btn-group > .btn-group {\n  float: left;\n}\n\n.btn-group > .btn-group:not(:first-child):not(:last-child) > .btn {\n  border-radius: 0;\n}\n\n.btn-group > .btn-group:first-child:not(:last-child) > .btn:last-child,\n.btn-group > .btn-group:first-child:not(:last-child) > .dropdown-toggle {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n\n.btn-group > .btn-group:last-child:not(:first-child) > .btn:first-child {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n\n.btn-group .dropdown-toggle:active,\n.btn-group.open .dropdown-toggle {\n  outline: 0;\n}\n\n.btn-group > .btn + .dropdown-toggle {\n  padding-right: 8px;\n  padding-left: 8px;\n}\n\n.btn-group > .btn-lg + .dropdown-toggle, .btn-group-lg.btn-group > .btn + .dropdown-toggle {\n  padding-right: 12px;\n  padding-left: 12px;\n}\n\n.btn .caret {\n  margin-left: 0;\n}\n\n.btn-lg .caret, .btn-group-lg > .btn .caret {\n  border-width: .3em .3em 0;\n  border-bottom-width: 0;\n}\n\n.dropup .btn-lg .caret, .dropup .btn-group-lg > .btn .caret {\n  border-width: 0 .3em .3em;\n}\n\n.btn-group-vertical > .btn,\n.btn-group-vertical > .btn-group,\n.btn-group-vertical > .btn-group > .btn {\n  display: block;\n  float: none;\n  width: 100%;\n  max-width: 100%;\n}\n\n.btn-group-vertical > .btn-group::after {\n  display: table;\n  clear: both;\n  content: \"\";\n}\n\n.btn-group-vertical > .btn-group > .btn {\n  float: none;\n}\n\n.btn-group-vertical > .btn + .btn,\n.btn-group-vertical > .btn + .btn-group,\n.btn-group-vertical > .btn-group + .btn,\n.btn-group-vertical > .btn-group + .btn-group {\n  margin-top: -1px;\n  margin-left: 0;\n}\n\n.btn-group-vertical > .btn:not(:first-child):not(:last-child) {\n  border-radius: 0;\n}\n\n.btn-group-vertical > .btn:first-child:not(:last-child) {\n  border-top-right-radius: .25rem;\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0;\n}\n\n.btn-group-vertical > .btn:last-child:not(:first-child) {\n  border-top-left-radius: 0;\n  border-top-right-radius: 0;\n  border-bottom-left-radius: .25rem;\n}\n\n.btn-group-vertical > .btn-group:not(:first-child):not(:last-child) > .btn {\n  border-radius: 0;\n}\n\n.btn-group-vertical > .btn-group:first-child:not(:last-child) > .btn:last-child,\n.btn-group-vertical > .btn-group:first-child:not(:last-child) > .dropdown-toggle {\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0;\n}\n\n.btn-group-vertical > .btn-group:last-child:not(:first-child) > .btn:first-child {\n  border-top-left-radius: 0;\n  border-top-right-radius: 0;\n}\n\n[data-toggle=\"buttons\"] > .btn input[type=\"radio\"],\n[data-toggle=\"buttons\"] > .btn input[type=\"checkbox\"],\n[data-toggle=\"buttons\"] > .btn-group > .btn input[type=\"radio\"],\n[data-toggle=\"buttons\"] > .btn-group > .btn input[type=\"checkbox\"] {\n  position: absolute;\n  clip: rect(0, 0, 0, 0);\n  pointer-events: none;\n}\n\n.input-group {\n  position: relative;\n  display: table;\n  border-collapse: separate;\n}\n\n.input-group .form-control {\n  position: relative;\n  z-index: 2;\n  float: left;\n  width: 100%;\n  margin-bottom: 0;\n}\n\n.input-group-addon,\n.input-group-btn,\n.input-group .form-control {\n  display: table-cell;\n}\n\n.input-group-addon:not(:first-child):not(:last-child),\n.input-group-btn:not(:first-child):not(:last-child),\n.input-group .form-control:not(:first-child):not(:last-child) {\n  border-radius: 0;\n}\n\n.input-group-addon,\n.input-group-btn {\n  width: 1%;\n  white-space: nowrap;\n  vertical-align: middle;\n}\n\n.input-group-addon {\n  padding: .375rem .75rem;\n  font-size: 1rem;\n  font-weight: normal;\n  line-height: 1;\n  color: #55595c;\n  text-align: center;\n  background-color: #eceeef;\n  border: 1px solid #ccc;\n  border-radius: .25rem;\n}\n\n.input-group-addon.form-control-sm, .input-group-sm > .input-group-addon,\n.input-group-sm > .input-group-btn > .input-group-addon.btn {\n  padding: .275rem .75rem;\n  font-size: .85rem;\n  border-radius: .2rem;\n}\n\n.input-group-addon.form-control-lg, .input-group-lg > .input-group-addon,\n.input-group-lg > .input-group-btn > .input-group-addon.btn {\n  padding: .75rem 1.25rem;\n  font-size: 1.25rem;\n  border-radius: .3rem;\n}\n\n.input-group-addon input[type=\"radio\"],\n.input-group-addon input[type=\"checkbox\"] {\n  margin-top: 0;\n}\n\n.input-group .form-control:first-child,\n.input-group-addon:first-child,\n.input-group-btn:first-child > .btn,\n.input-group-btn:first-child > .btn-group > .btn,\n.input-group-btn:first-child > .dropdown-toggle,\n.input-group-btn:last-child > .btn:not(:last-child):not(.dropdown-toggle),\n.input-group-btn:last-child > .btn-group:not(:last-child) > .btn {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n\n.input-group-addon:first-child {\n  border-right: 0;\n}\n\n.input-group .form-control:last-child,\n.input-group-addon:last-child,\n.input-group-btn:last-child > .btn,\n.input-group-btn:last-child > .btn-group > .btn,\n.input-group-btn:last-child > .dropdown-toggle,\n.input-group-btn:first-child > .btn:not(:first-child),\n.input-group-btn:first-child > .btn-group:not(:first-child) > .btn {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n\n.input-group-addon:last-child {\n  border-left: 0;\n}\n\n.input-group-btn {\n  position: relative;\n  font-size: 0;\n  white-space: nowrap;\n}\n\n.input-group-btn > .btn {\n  position: relative;\n}\n\n.input-group-btn > .btn + .btn {\n  margin-left: -1px;\n}\n\n.input-group-btn > .btn:focus,\n.input-group-btn > .btn:active,\n.input-group-btn > .btn:hover {\n  z-index: 2;\n}\n\n.input-group-btn:first-child > .btn,\n.input-group-btn:first-child > .btn-group {\n  margin-right: -1px;\n}\n\n.input-group-btn:last-child > .btn,\n.input-group-btn:last-child > .btn-group {\n  z-index: 2;\n  margin-left: -1px;\n}\n\n.c-input {\n  position: relative;\n  display: inline;\n  padding-left: 1.5rem;\n  color: #555;\n  cursor: pointer;\n}\n\n.c-input > input {\n  position: absolute;\n  z-index: -1;\n  opacity: 0;\n}\n\n.c-input > input:checked ~ .c-indicator {\n  color: #fff;\n  background-color: #0074d9;\n}\n\n.c-input > input:focus ~ .c-indicator {\n  -webkit-box-shadow: 0 0 0 .075rem #fff, 0 0 0 .2rem #0074d9;\n          box-shadow: 0 0 0 .075rem #fff, 0 0 0 .2rem #0074d9;\n}\n\n.c-input > input:active ~ .c-indicator {\n  color: #fff;\n  background-color: #84c6ff;\n}\n\n.c-input + .c-input {\n  margin-left: 1rem;\n}\n\n.c-indicator {\n  position: absolute;\n  top: 0;\n  left: 0;\n  display: block;\n  width: 1rem;\n  height: 1rem;\n  font-size: 65%;\n  line-height: 1rem;\n  color: #eee;\n  text-align: center;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  background-color: #eee;\n  background-repeat: no-repeat;\n  background-position: center center;\n  -webkit-background-size: 50% 50%;\n          background-size: 50% 50%;\n}\n\n.c-checkbox .c-indicator {\n  border-radius: .25rem;\n}\n\n.c-checkbox input:checked ~ .c-indicator {\n  background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNy4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgOCA4IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA4IDgiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTYuNCwxTDUuNywxLjdMMi45LDQuNUwyLjEsMy43TDEuNCwzTDAsNC40bDAuNywwLjdsMS41LDEuNWwwLjcsMC43bDAuNy0wLjdsMy41LTMuNWwwLjctMC43TDYuNCwxTDYuNCwxeiINCgkvPg0KPC9zdmc+DQo=);\n}\n\n.c-checkbox input:indeterminate ~ .c-indicator {\n  background-color: #0074d9;\n  background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNy4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iOHB4IiBoZWlnaHQ9IjhweCIgdmlld0JveD0iMCAwIDggOCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgOCA4IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0wLDN2Mmg4VjNIMHoiLz4NCjwvc3ZnPg0K);\n}\n\n.c-radio .c-indicator {\n  border-radius: 50%;\n}\n\n.c-radio input:checked ~ .c-indicator {\n  background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNy4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgOCA4IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA4IDgiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTQsMUMyLjMsMSwxLDIuMywxLDRzMS4zLDMsMywzczMtMS4zLDMtM1M1LjcsMSw0LDF6Ii8+DQo8L3N2Zz4NCg==);\n}\n\n.c-inputs-stacked .c-input {\n  display: inline;\n}\n\n.c-inputs-stacked .c-input::after {\n  display: block;\n  margin-bottom: .25rem;\n  content: \"\";\n}\n\n.c-inputs-stacked .c-input + .c-input {\n  margin-left: 0;\n}\n\n.c-select {\n  display: inline-block;\n  max-width: 100%;\n  -webkit-appearance: none;\n  padding: .375rem 1.75rem .375rem .75rem;\n  padding-right: .75rem \\9;\n  vertical-align: middle;\n  background: #fff url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAUCAMAAACzvE1FAAAADFBMVEUzMzMzMzMzMzMzMzMKAG/3AAAAA3RSTlMAf4C/aSLHAAAAPElEQVR42q3NMQ4AIAgEQTn//2cLdRKppSGzBYwzVXvznNWs8C58CiussPJj8h6NwgorrKRdTvuV9v16Afn0AYFOB7aYAAAAAElFTkSuQmCC) no-repeat right .75rem center;\n  background-image: none \\9;\n  -webkit-background-size: 8px 10px;\n          background-size: 8px 10px;\n  border: 1px solid #ccc;\n\n     -moz-appearance: none;\n}\n\n.c-select:focus {\n  border-color: #51a7e8;\n  outline: none;\n}\n\n.c-select::-ms-expand {\n  opacity: 0;\n}\n\n.c-select-sm {\n  padding-top: 3px;\n  padding-bottom: 3px;\n  font-size: 12px;\n}\n\n.c-select-sm:not([multiple]) {\n  height: 26px;\n  min-height: 26px;\n}\n\n.file {\n  position: relative;\n  display: inline-block;\n  height: 2.5rem;\n  cursor: pointer;\n}\n\n.file input {\n  min-width: 14rem;\n  margin: 0;\n  filter: alpha(opacity=0);\n  opacity: 0;\n}\n\n.file-custom {\n  position: absolute;\n  top: 0;\n  right: 0;\n  left: 0;\n  z-index: 5;\n  height: 2.5rem;\n  padding: .5rem 1rem;\n  line-height: 1.5;\n  color: #555;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  background-color: #fff;\n  border: .075rem solid #ddd;\n  border-radius: .25rem;\n}\n\n.file-custom::after {\n  content: \"Choose file...\";\n}\n\n.file-custom::before {\n  position: absolute;\n  top: -.075rem;\n  right: -.075rem;\n  bottom: -.075rem;\n  z-index: 6;\n  display: block;\n  height: 2.5rem;\n  padding: .5rem 1rem;\n  line-height: 1.5;\n  color: #555;\n  content: \"Browse\";\n  background-color: #eee;\n  border: .075rem solid #ddd;\n  border-radius: 0 .25rem .25rem 0;\n}\n\n.nav {\n  padding-left: 0;\n  margin-bottom: 0;\n  list-style: none;\n}\n\n.nav-link {\n  display: inline-block;\n}\n\n.nav-link:focus,\n.nav-link:hover {\n  text-decoration: none;\n}\n\n.nav-link.disabled {\n  color: #818a91;\n}\n\n.nav-link.disabled,\n.nav-link.disabled:focus,\n.nav-link.disabled:hover {\n  color: #818a91;\n  cursor: not-allowed;\n  background-color: transparent;\n}\n\n.nav-inline .nav-link + .nav-link {\n  margin-left: 1rem;\n}\n\n.nav-tabs {\n  border-bottom: 1px solid #ddd;\n}\n\n.nav-tabs::after {\n  display: table;\n  clear: both;\n  content: \"\";\n}\n\n.nav-tabs .nav-item {\n  float: left;\n  margin-bottom: -1px;\n}\n\n.nav-tabs .nav-item + .nav-item {\n  margin-left: .2rem;\n}\n\n.nav-tabs .nav-link {\n  display: block;\n  padding: .5em 1em;\n  border: 1px solid transparent;\n  border-radius: .25rem .25rem 0 0;\n}\n\n.nav-tabs .nav-link:focus,\n.nav-tabs .nav-link:hover {\n  border-color: #eceeef #eceeef #ddd;\n}\n\n.nav-tabs .nav-link.disabled,\n.nav-tabs .nav-link.disabled:focus,\n.nav-tabs .nav-link.disabled:hover {\n  color: #818a91;\n  background-color: transparent;\n  border-color: transparent;\n}\n\n.nav-tabs .nav-link.active,\n.nav-tabs .nav-link.active:focus,\n.nav-tabs .nav-link.active:hover,\n.nav-tabs .nav-item.open .nav-link,\n.nav-tabs .nav-item.open .nav-link:focus,\n.nav-tabs .nav-item.open .nav-link:hover {\n  color: #55595c;\n  background-color: #fff;\n  border-color: #ddd #ddd transparent;\n}\n\n.nav-pills .nav-item {\n  float: left;\n}\n\n.nav-pills .nav-item + .nav-item {\n  margin-left: .2rem;\n}\n\n.nav-pills .nav-link {\n  display: block;\n  padding: .5em 1em;\n  border-radius: .25rem;\n}\n\n.nav-pills .nav-link.active,\n.nav-pills .nav-link.active:focus,\n.nav-pills .nav-link.active:hover,\n.nav-pills .nav-item.open .nav-link,\n.nav-pills .nav-item.open .nav-link:focus,\n.nav-pills .nav-item.open .nav-link:hover {\n  color: #fff;\n  cursor: default;\n  background-color: #0275d8;\n}\n\n.nav-stacked .nav-item {\n  display: block;\n  float: none;\n}\n\n.nav-stacked .nav-item + .nav-item {\n  margin-top: .2rem;\n  margin-left: 0;\n}\n\n.tab-content > .tab-pane {\n  display: none;\n}\n\n.tab-content > .active {\n  display: block;\n}\n\n.nav-tabs .dropdown-menu {\n  margin-top: -1px;\n  border-top-left-radius: 0;\n  border-top-right-radius: 0;\n}\n\n.navbar {\n  position: relative;\n  padding: .5rem 1rem;\n}\n\n.navbar::after {\n  display: table;\n  clear: both;\n  content: \"\";\n}\n\n@media (min-width: 544px) {\n  .navbar {\n    border-radius: .25rem;\n  }\n}\n\n.navbar-full {\n  z-index: 1000;\n}\n\n@media (min-width: 544px) {\n  .navbar-full {\n    border-radius: 0;\n  }\n}\n\n.navbar-fixed-top,\n.navbar-fixed-bottom {\n  position: fixed;\n  right: 0;\n  left: 0;\n  z-index: 1030;\n}\n\n@media (min-width: 544px) {\n  .navbar-fixed-top,\n  .navbar-fixed-bottom {\n    border-radius: 0;\n  }\n}\n\n.navbar-fixed-top {\n  top: 0;\n}\n\n.navbar-fixed-bottom {\n  bottom: 0;\n}\n\n.navbar-sticky-top {\n  position: -webkit-sticky;\n  position:         sticky;\n  top: 0;\n  z-index: 1030;\n  width: 100%;\n}\n\n@media (min-width: 544px) {\n  .navbar-sticky-top {\n    border-radius: 0;\n  }\n}\n\n.navbar-brand {\n  float: left;\n  padding-top: .25rem;\n  padding-bottom: .25rem;\n  margin-right: 1rem;\n  font-size: 1.25rem;\n}\n\n.navbar-brand:focus,\n.navbar-brand:hover {\n  text-decoration: none;\n}\n\n.navbar-brand > img {\n  display: block;\n}\n\n.navbar-divider {\n  float: left;\n  width: 1px;\n  padding-top: .425rem;\n  padding-bottom: .425rem;\n  margin-right: 1rem;\n  margin-left: 1rem;\n  overflow: hidden;\n}\n\n.navbar-divider::before {\n  content: \"\\A0\";\n}\n\n.navbar-toggler {\n  padding: .5rem .75rem;\n  font-size: 1.25rem;\n  line-height: 1;\n  background: none;\n  border: 1px solid transparent;\n  border-radius: .25rem;\n}\n\n.navbar-toggler:focus,\n.navbar-toggler:hover {\n  text-decoration: none;\n}\n\n@media (min-width: 544px) {\n  .navbar-toggleable-xs {\n    display: block !important;\n  }\n}\n\n@media (min-width: 768px) {\n  .navbar-toggleable-sm {\n    display: block !important;\n  }\n}\n\n@media (min-width: 992px) {\n  .navbar-toggleable-md {\n    display: block !important;\n  }\n}\n\n.navbar-nav .nav-item {\n  float: left;\n}\n\n.navbar-nav .nav-link {\n  display: block;\n  padding-top: .425rem;\n  padding-bottom: .425rem;\n}\n\n.navbar-nav .nav-link + .nav-link {\n  margin-left: 1rem;\n}\n\n.navbar-nav .nav-item + .nav-item {\n  margin-left: 1rem;\n}\n\n.navbar-light .navbar-brand {\n  color: rgba(0, 0, 0, .8);\n}\n\n.navbar-light .navbar-brand:focus,\n.navbar-light .navbar-brand:hover {\n  color: rgba(0, 0, 0, .8);\n}\n\n.navbar-light .navbar-nav .nav-link {\n  color: rgba(0, 0, 0, .3);\n}\n\n.navbar-light .navbar-nav .nav-link:focus,\n.navbar-light .navbar-nav .nav-link:hover {\n  color: rgba(0, 0, 0, .6);\n}\n\n.navbar-light .navbar-nav .open > .nav-link,\n.navbar-light .navbar-nav .open > .nav-link:focus,\n.navbar-light .navbar-nav .open > .nav-link:hover,\n.navbar-light .navbar-nav .active > .nav-link,\n.navbar-light .navbar-nav .active > .nav-link:focus,\n.navbar-light .navbar-nav .active > .nav-link:hover,\n.navbar-light .navbar-nav .nav-link.open,\n.navbar-light .navbar-nav .nav-link.open:focus,\n.navbar-light .navbar-nav .nav-link.open:hover,\n.navbar-light .navbar-nav .nav-link.active,\n.navbar-light .navbar-nav .nav-link.active:focus,\n.navbar-light .navbar-nav .nav-link.active:hover {\n  color: rgba(0, 0, 0, .8);\n}\n\n.navbar-light .navbar-divider {\n  background-color: rgba(0, 0, 0, .075);\n}\n\n.navbar-dark .navbar-brand {\n  color: white;\n}\n\n.navbar-dark .navbar-brand:focus,\n.navbar-dark .navbar-brand:hover {\n  color: white;\n}\n\n.navbar-dark .navbar-nav .nav-link {\n  color: rgba(255, 255, 255, .5);\n}\n\n.navbar-dark .navbar-nav .nav-link:focus,\n.navbar-dark .navbar-nav .nav-link:hover {\n  color: rgba(255, 255, 255, .75);\n}\n\n.navbar-dark .navbar-nav .open > .nav-link,\n.navbar-dark .navbar-nav .open > .nav-link:focus,\n.navbar-dark .navbar-nav .open > .nav-link:hover,\n.navbar-dark .navbar-nav .active > .nav-link,\n.navbar-dark .navbar-nav .active > .nav-link:focus,\n.navbar-dark .navbar-nav .active > .nav-link:hover,\n.navbar-dark .navbar-nav .nav-link.open,\n.navbar-dark .navbar-nav .nav-link.open:focus,\n.navbar-dark .navbar-nav .nav-link.open:hover,\n.navbar-dark .navbar-nav .nav-link.active,\n.navbar-dark .navbar-nav .nav-link.active:focus,\n.navbar-dark .navbar-nav .nav-link.active:hover {\n  color: white;\n}\n\n.navbar-dark .navbar-divider {\n  background-color: rgba(255, 255, 255, .075);\n}\n\n.card {\n  position: relative;\n  margin-bottom: .75rem;\n  background-color: #fff;\n  border: .0625rem solid #e5e5e5;\n  border-radius: .25rem;\n}\n\n.card-block {\n  padding: 1.25rem;\n}\n\n.card-title {\n  margin-bottom: .75rem;\n}\n\n.card-subtitle {\n  margin-top: -.375rem;\n  margin-bottom: 0;\n}\n\n.card-text:last-child {\n  margin-bottom: 0;\n}\n\n.card-link:hover {\n  text-decoration: none;\n}\n\n.card-link + .card-link {\n  margin-left: 1.25rem;\n}\n\n.card > .list-group:first-child .list-group-item:first-child {\n  border-radius: .25rem .25rem 0 0;\n}\n\n.card > .list-group:last-child .list-group-item:last-child {\n  border-radius: 0 0 .25rem .25rem;\n}\n\n.card-header {\n  padding: .75rem 1.25rem;\n  background-color: #f5f5f5;\n  border-bottom: .0625rem solid #e5e5e5;\n}\n\n.card-header:first-child {\n  border-radius: .1875rem .1875rem 0 0;\n}\n\n.card-footer {\n  padding: .75rem 1.25rem;\n  background-color: #f5f5f5;\n  border-top: .0625rem solid #e5e5e5;\n}\n\n.card-footer:last-child {\n  border-radius: 0 0 .1875rem .1875rem;\n}\n\n.card-primary {\n  background-color: #0275d8;\n  border-color: #0275d8;\n}\n\n.card-success {\n  background-color: #5cb85c;\n  border-color: #5cb85c;\n}\n\n.card-info {\n  background-color: #5bc0de;\n  border-color: #5bc0de;\n}\n\n.card-warning {\n  background-color: #f0ad4e;\n  border-color: #f0ad4e;\n}\n\n.card-danger {\n  background-color: #d9534f;\n  border-color: #d9534f;\n}\n\n.card-inverse .card-header,\n.card-inverse .card-footer {\n  border-bottom: .075rem solid rgba(255, 255, 255, .2);\n}\n\n.card-inverse .card-header,\n.card-inverse .card-footer,\n.card-inverse .card-title,\n.card-inverse .card-blockquote {\n  color: #fff;\n}\n\n.card-inverse .card-link,\n.card-inverse .card-text,\n.card-inverse .card-blockquote > footer {\n  color: rgba(255, 255, 255, .65);\n}\n\n.card-inverse .card-link:focus,\n.card-inverse .card-link:hover {\n  color: #fff;\n}\n\n.card-blockquote {\n  padding: 0;\n  margin-bottom: 0;\n  border-left: 0;\n}\n\n.card-img {\n  border-radius: .25rem;\n}\n\n.card-img-overlay {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  padding: 1.25rem;\n}\n\n.card-img-top {\n  border-radius: .25rem .25rem 0 0;\n}\n\n.card-img-bottom {\n  border-radius: 0 0 .25rem .25rem;\n}\n\n@media (min-width: 544px) {\n  .card-deck {\n    display: table;\n    table-layout: fixed;\n    border-spacing: 1.25rem 0;\n  }\n  .card-deck .card {\n    display: table-cell;\n    width: 1%;\n    vertical-align: top;\n  }\n  .card-deck-wrapper {\n    margin-right: -1.25rem;\n    margin-left: -1.25rem;\n  }\n}\n\n@media (min-width: 544px) {\n  .card-group {\n    display: table;\n    width: 100%;\n    table-layout: fixed;\n  }\n  .card-group .card {\n    display: table-cell;\n    vertical-align: top;\n  }\n  .card-group .card + .card {\n    margin-left: 0;\n    border-left: 0;\n  }\n  .card-group .card:first-child .card-img-top {\n    border-top-right-radius: 0;\n  }\n  .card-group .card:first-child .card-img-bottom {\n    border-bottom-right-radius: 0;\n  }\n  .card-group .card:last-child .card-img-top {\n    border-top-left-radius: 0;\n  }\n  .card-group .card:last-child .card-img-bottom {\n    border-bottom-left-radius: 0;\n  }\n  .card-group .card:not(:first-child):not(:last-child) {\n    border-radius: 0;\n  }\n  .card-group .card:not(:first-child):not(:last-child) .card-img-top,\n  .card-group .card:not(:first-child):not(:last-child) .card-img-bottom {\n    border-radius: 0;\n  }\n}\n\n@media (min-width: 544px) {\n  .card-columns {\n    -webkit-column-count: 3;\n       -moz-column-count: 3;\n            column-count: 3;\n    -webkit-column-gap: 1.25rem;\n       -moz-column-gap: 1.25rem;\n            column-gap: 1.25rem;\n  }\n  .card-columns .card {\n    display: inline-block;\n    width: 100%;\n  }\n}\n\n.breadcrumb {\n  padding: .75rem 1rem;\n  margin-bottom: 1rem;\n  list-style: none;\n  background-color: #eceeef;\n  border-radius: .25rem;\n}\n\n.breadcrumb::after {\n  display: table;\n  clear: both;\n  content: \"\";\n}\n\n.breadcrumb > li {\n  float: left;\n}\n\n.breadcrumb > li + li::before {\n  padding-right: .5rem;\n  padding-left: .5rem;\n  color: #818a91;\n  content: \"/\";\n}\n\n.breadcrumb > .active {\n  color: #818a91;\n}\n\n.pagination {\n  display: inline-block;\n  padding-left: 0;\n  margin-top: 1rem;\n  margin-bottom: 1rem;\n  border-radius: .25rem;\n}\n\n.pagination > li {\n  display: inline;\n}\n\n.pagination > li > a,\n.pagination > li > span {\n  position: relative;\n  float: left;\n  padding: .5rem .75rem;\n  margin-left: -1px;\n  line-height: 1.5;\n  color: #0275d8;\n  text-decoration: none;\n  background-color: #fff;\n  border: 1px solid #ddd;\n}\n\n.pagination > li:first-child > a,\n.pagination > li:first-child > span {\n  margin-left: 0;\n  border-top-left-radius: .25rem;\n  border-bottom-left-radius: .25rem;\n}\n\n.pagination > li:last-child > a,\n.pagination > li:last-child > span {\n  border-top-right-radius: .25rem;\n  border-bottom-right-radius: .25rem;\n}\n\n.pagination > li > a:focus,\n.pagination > li > a:hover,\n.pagination > li > span:focus,\n.pagination > li > span:hover {\n  color: #014c8c;\n  background-color: #eceeef;\n  border-color: #ddd;\n}\n\n.pagination > .active > a,\n.pagination > .active > a:focus,\n.pagination > .active > a:hover,\n.pagination > .active > span,\n.pagination > .active > span:focus,\n.pagination > .active > span:hover {\n  z-index: 2;\n  color: #fff;\n  cursor: default;\n  background-color: #0275d8;\n  border-color: #0275d8;\n}\n\n.pagination > .disabled > span,\n.pagination > .disabled > span:focus,\n.pagination > .disabled > span:hover,\n.pagination > .disabled > a,\n.pagination > .disabled > a:focus,\n.pagination > .disabled > a:hover {\n  color: #818a91;\n  cursor: not-allowed;\n  background-color: #fff;\n  border-color: #ddd;\n}\n\n.pagination-lg > li > a,\n.pagination-lg > li > span {\n  padding: .75rem 1.5rem;\n  font-size: 1.25rem;\n  line-height: 1.333333;\n}\n\n.pagination-lg > li:first-child > a,\n.pagination-lg > li:first-child > span {\n  border-top-left-radius: .3rem;\n  border-bottom-left-radius: .3rem;\n}\n\n.pagination-lg > li:last-child > a,\n.pagination-lg > li:last-child > span {\n  border-top-right-radius: .3rem;\n  border-bottom-right-radius: .3rem;\n}\n\n.pagination-sm > li > a,\n.pagination-sm > li > span {\n  padding: .275rem .75rem;\n  font-size: .85rem;\n  line-height: 1.5;\n}\n\n.pagination-sm > li:first-child > a,\n.pagination-sm > li:first-child > span {\n  border-top-left-radius: .2rem;\n  border-bottom-left-radius: .2rem;\n}\n\n.pagination-sm > li:last-child > a,\n.pagination-sm > li:last-child > span {\n  border-top-right-radius: .2rem;\n  border-bottom-right-radius: .2rem;\n}\n\n.pager {\n  padding-left: 0;\n  margin-top: 1rem;\n  margin-bottom: 1rem;\n  text-align: center;\n  list-style: none;\n}\n\n.pager::after {\n  display: table;\n  clear: both;\n  content: \"\";\n}\n\n.pager li {\n  display: inline;\n}\n\n.pager li > a,\n.pager li > span {\n  display: inline-block;\n  padding: 5px 14px;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-radius: 15px;\n}\n\n.pager li > a:focus,\n.pager li > a:hover {\n  text-decoration: none;\n  background-color: #eceeef;\n}\n\n.pager .disabled > a,\n.pager .disabled > a:focus,\n.pager .disabled > a:hover {\n  color: #818a91;\n  cursor: not-allowed;\n  background-color: #fff;\n}\n\n.pager .disabled > span {\n  color: #818a91;\n  cursor: not-allowed;\n  background-color: #fff;\n}\n\n.pager-next > a,\n.pager-next > span {\n  float: right;\n}\n\n.pager-prev > a,\n.pager-prev > span {\n  float: left;\n}\n\n.label {\n  display: inline-block;\n  padding: .25em .4em;\n  font-size: 75%;\n  font-weight: bold;\n  line-height: 1;\n  color: #fff;\n  text-align: center;\n  white-space: nowrap;\n  vertical-align: baseline;\n  border-radius: .25rem;\n}\n\n.label:empty {\n  display: none;\n}\n\n.btn .label {\n  position: relative;\n  top: -1px;\n}\n\na.label:focus,\na.label:hover {\n  color: #fff;\n  text-decoration: none;\n  cursor: pointer;\n}\n\n.label-pill {\n  padding-right: .6em;\n  padding-left: .6em;\n  border-radius: 1rem;\n}\n\n.label-default {\n  background-color: #818a91;\n}\n\n.label-default[href]:focus,\n.label-default[href]:hover {\n  background-color: #687077;\n}\n\n.label-primary {\n  background-color: #0275d8;\n}\n\n.label-primary[href]:focus,\n.label-primary[href]:hover {\n  background-color: #025aa5;\n}\n\n.label-success {\n  background-color: #5cb85c;\n}\n\n.label-success[href]:focus,\n.label-success[href]:hover {\n  background-color: #449d44;\n}\n\n.label-info {\n  background-color: #5bc0de;\n}\n\n.label-info[href]:focus,\n.label-info[href]:hover {\n  background-color: #31b0d5;\n}\n\n.label-warning {\n  background-color: #f0ad4e;\n}\n\n.label-warning[href]:focus,\n.label-warning[href]:hover {\n  background-color: #ec971f;\n}\n\n.label-danger {\n  background-color: #d9534f;\n}\n\n.label-danger[href]:focus,\n.label-danger[href]:hover {\n  background-color: #c9302c;\n}\n\n.jumbotron {\n  padding: 2rem 1rem;\n  margin-bottom: 2rem;\n  background-color: #eceeef;\n  border-radius: .3rem;\n}\n\n.jumbotron-hr {\n  border-top-color: #d0d5d8;\n}\n\n@media (min-width: 544px) {\n  .jumbotron {\n    padding: 4rem 2rem;\n  }\n}\n\n.jumbotron-fluid {\n  padding-right: 0;\n  padding-left: 0;\n  border-radius: 0;\n}\n\n.alert {\n  padding: 15px;\n  margin-bottom: 1rem;\n  border: 1px solid transparent;\n  border-radius: .25rem;\n}\n\n.alert > p,\n.alert > ul {\n  margin-bottom: 0;\n}\n\n.alert > p + p {\n  margin-top: 5px;\n}\n\n.alert-heading {\n  color: inherit;\n}\n\n.alert-link {\n  font-weight: bold;\n}\n\n.alert-dismissible {\n  padding-right: 35px;\n}\n\n.alert-dismissible .close {\n  position: relative;\n  top: -2px;\n  right: -21px;\n  color: inherit;\n}\n\n.alert-success {\n  color: #3c763d;\n  background-color: #dff0d8;\n  border-color: #d0e9c6;\n}\n\n.alert-success hr {\n  border-top-color: #c1e2b3;\n}\n\n.alert-success .alert-link {\n  color: #2b542c;\n}\n\n.alert-info {\n  color: #31708f;\n  background-color: #d9edf7;\n  border-color: #bcdff1;\n}\n\n.alert-info hr {\n  border-top-color: #a6d5ec;\n}\n\n.alert-info .alert-link {\n  color: #245269;\n}\n\n.alert-warning {\n  color: #8a6d3b;\n  background-color: #fcf8e3;\n  border-color: #faf2cc;\n}\n\n.alert-warning hr {\n  border-top-color: #f7ecb5;\n}\n\n.alert-warning .alert-link {\n  color: #66512c;\n}\n\n.alert-danger {\n  color: #a94442;\n  background-color: #f2dede;\n  border-color: #ebcccc;\n}\n\n.alert-danger hr {\n  border-top-color: #e4b9b9;\n}\n\n.alert-danger .alert-link {\n  color: #843534;\n}\n\n@-webkit-keyframes progress-bar-stripes {\n  from {\n    background-position: 1rem 0;\n  }\n  to {\n    background-position: 0 0;\n  }\n}\n\n@-o-keyframes progress-bar-stripes {\n  from {\n    background-position: 1rem 0;\n  }\n  to {\n    background-position: 0 0;\n  }\n}\n\n@keyframes progress-bar-stripes {\n  from {\n    background-position: 1rem 0;\n  }\n  to {\n    background-position: 0 0;\n  }\n}\n\n.progress {\n  display: block;\n  width: 100%;\n  height: 1rem;\n  margin-bottom: 1rem;\n}\n\n.progress[value] {\n  -webkit-appearance: none;\n  color: #0074d9;\n  border: 0;\n\n     -moz-appearance: none;\n          appearance: none;\n}\n\n.progress[value]::-webkit-progress-bar {\n  background-color: #eee;\n  border-radius: .25rem;\n}\n\n.progress[value]::-webkit-progress-value::before {\n  content: attr(value);\n}\n\n.progress[value]::-webkit-progress-value {\n  background-color: #0074d9;\n  border-top-left-radius: .25rem;\n  border-bottom-left-radius: .25rem;\n}\n\n.progress[value=\"100\"]::-webkit-progress-value {\n  border-top-right-radius: .25rem;\n  border-bottom-right-radius: .25rem;\n}\n\n@media screen and (min-width: 0 \\0) {\n  .progress {\n    background-color: #eee;\n    border-radius: .25rem;\n  }\n  .progress-bar {\n    display: inline-block;\n    height: 1rem;\n    text-indent: -999rem;\n    background-color: #0074d9;\n    border-top-left-radius: .25rem;\n    border-bottom-left-radius: .25rem;\n  }\n  .progress[width^=\"0\"] {\n    min-width: 2rem;\n    color: #818a91;\n    background-color: transparent;\n    background-image: none;\n  }\n  .progress[width=\"100%\"] {\n    border-top-right-radius: .25rem;\n    border-bottom-right-radius: .25rem;\n  }\n}\n\n.progress-striped[value]::-webkit-progress-value {\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\n  background-image:         linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\n  -webkit-background-size: 1rem 1rem;\n          background-size: 1rem 1rem;\n}\n\n.progress-striped[value]::-moz-progress-bar {\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\n  background-size: 1rem 1rem;\n}\n\n@media screen and (min-width: 0 \\0) {\n  .progress-bar-striped {\n    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\n    background-image:      -o-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\n    background-image:         linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\n    -webkit-background-size: 1rem 1rem;\n            background-size: 1rem 1rem;\n  }\n}\n\n.progress-animated[value]::-webkit-progress-value {\n  -webkit-animation: progress-bar-stripes 2s linear infinite;\n          animation: progress-bar-stripes 2s linear infinite;\n}\n\n.progress-animated[value]::-moz-progress-bar {\n  animation: progress-bar-stripes 2s linear infinite;\n}\n\n@media screen and (min-width: 0 \\0) {\n  .progress-animated .progress-bar-striped {\n    -webkit-animation: progress-bar-stripes 2s linear infinite;\n         -o-animation: progress-bar-stripes 2s linear infinite;\n            animation: progress-bar-stripes 2s linear infinite;\n  }\n}\n\n.progress-success[value]::-webkit-progress-value {\n  background-color: #5cb85c;\n}\n\n.progress-success[value]::-moz-progress-bar {\n  background-color: #5cb85c;\n}\n\n@media screen and (min-width: 0 \\0) {\n  .progress-success .progress-bar {\n    background-color: #5cb85c;\n  }\n}\n\n.progress-info[value]::-webkit-progress-value {\n  background-color: #5bc0de;\n}\n\n.progress-info[value]::-moz-progress-bar {\n  background-color: #5bc0de;\n}\n\n@media screen and (min-width: 0 \\0) {\n  .progress-info .progress-bar {\n    background-color: #5bc0de;\n  }\n}\n\n.progress-warning[value]::-webkit-progress-value {\n  background-color: #f0ad4e;\n}\n\n.progress-warning[value]::-moz-progress-bar {\n  background-color: #f0ad4e;\n}\n\n@media screen and (min-width: 0 \\0) {\n  .progress-warning .progress-bar {\n    background-color: #f0ad4e;\n  }\n}\n\n.progress-danger[value]::-webkit-progress-value {\n  background-color: #d9534f;\n}\n\n.progress-danger[value]::-moz-progress-bar {\n  background-color: #d9534f;\n}\n\n@media screen and (min-width: 0 \\0) {\n  .progress-danger .progress-bar {\n    background-color: #d9534f;\n  }\n}\n\n.media {\n  margin-top: 15px;\n}\n\n.media:first-child {\n  margin-top: 0;\n}\n\n.media,\n.media-body {\n  overflow: hidden;\n  zoom: 1;\n}\n\n.media-body {\n  width: 10000px;\n}\n\n.media-left,\n.media-right,\n.media-body {\n  display: table-cell;\n  vertical-align: top;\n}\n\n.media-middle {\n  vertical-align: middle;\n}\n\n.media-bottom {\n  vertical-align: bottom;\n}\n\n.media-object {\n  display: block;\n}\n\n.media-object.img-thumbnail {\n  max-width: none;\n}\n\n.media-right {\n  padding-left: 10px;\n}\n\n.media-left {\n  padding-right: 10px;\n}\n\n.media-heading {\n  margin-top: 0;\n  margin-bottom: 5px;\n}\n\n.media-list {\n  padding-left: 0;\n  list-style: none;\n}\n\n.list-group {\n  padding-left: 0;\n  margin-bottom: 0;\n}\n\n.list-group-item {\n  position: relative;\n  display: block;\n  padding: .75rem 1.25rem;\n  margin-bottom: -1px;\n  background-color: #fff;\n  border: 1px solid #ddd;\n}\n\n.list-group-item:first-child {\n  border-top-left-radius: .25rem;\n  border-top-right-radius: .25rem;\n}\n\n.list-group-item:last-child {\n  margin-bottom: 0;\n  border-bottom-right-radius: .25rem;\n  border-bottom-left-radius: .25rem;\n}\n\n.list-group-flush .list-group-item {\n  border-width: 1px 0;\n  border-radius: 0;\n}\n\na.list-group-item,\nbutton.list-group-item {\n  width: 100%;\n  color: #555;\n  text-align: inherit;\n}\n\na.list-group-item .list-group-item-heading,\nbutton.list-group-item .list-group-item-heading {\n  color: #333;\n}\n\na.list-group-item:focus,\na.list-group-item:hover,\nbutton.list-group-item:focus,\nbutton.list-group-item:hover {\n  color: #555;\n  text-decoration: none;\n  background-color: #f5f5f5;\n}\n\n.list-group-item.disabled,\n.list-group-item.disabled:focus,\n.list-group-item.disabled:hover {\n  color: #818a91;\n  cursor: not-allowed;\n  background-color: #eceeef;\n}\n\n.list-group-item.disabled .list-group-item-heading,\n.list-group-item.disabled:focus .list-group-item-heading,\n.list-group-item.disabled:hover .list-group-item-heading {\n  color: inherit;\n}\n\n.list-group-item.disabled .list-group-item-text,\n.list-group-item.disabled:focus .list-group-item-text,\n.list-group-item.disabled:hover .list-group-item-text {\n  color: #818a91;\n}\n\n.list-group-item.active,\n.list-group-item.active:focus,\n.list-group-item.active:hover {\n  z-index: 2;\n  color: #fff;\n  background-color: #0275d8;\n  border-color: #0275d8;\n}\n\n.list-group-item.active .list-group-item-heading,\n.list-group-item.active .list-group-item-heading > small,\n.list-group-item.active .list-group-item-heading > .small,\n.list-group-item.active:focus .list-group-item-heading,\n.list-group-item.active:focus .list-group-item-heading > small,\n.list-group-item.active:focus .list-group-item-heading > .small,\n.list-group-item.active:hover .list-group-item-heading,\n.list-group-item.active:hover .list-group-item-heading > small,\n.list-group-item.active:hover .list-group-item-heading > .small {\n  color: inherit;\n}\n\n.list-group-item.active .list-group-item-text,\n.list-group-item.active:focus .list-group-item-text,\n.list-group-item.active:hover .list-group-item-text {\n  color: #a8d6fe;\n}\n\n.list-group-item-success {\n  color: #3c763d;\n  background-color: #dff0d8;\n}\n\na.list-group-item-success,\nbutton.list-group-item-success {\n  color: #3c763d;\n}\n\na.list-group-item-success .list-group-item-heading,\nbutton.list-group-item-success .list-group-item-heading {\n  color: inherit;\n}\n\na.list-group-item-success:focus,\na.list-group-item-success:hover,\nbutton.list-group-item-success:focus,\nbutton.list-group-item-success:hover {\n  color: #3c763d;\n  background-color: #d0e9c6;\n}\n\na.list-group-item-success.active,\na.list-group-item-success.active:focus,\na.list-group-item-success.active:hover,\nbutton.list-group-item-success.active,\nbutton.list-group-item-success.active:focus,\nbutton.list-group-item-success.active:hover {\n  color: #fff;\n  background-color: #3c763d;\n  border-color: #3c763d;\n}\n\n.list-group-item-info {\n  color: #31708f;\n  background-color: #d9edf7;\n}\n\na.list-group-item-info,\nbutton.list-group-item-info {\n  color: #31708f;\n}\n\na.list-group-item-info .list-group-item-heading,\nbutton.list-group-item-info .list-group-item-heading {\n  color: inherit;\n}\n\na.list-group-item-info:focus,\na.list-group-item-info:hover,\nbutton.list-group-item-info:focus,\nbutton.list-group-item-info:hover {\n  color: #31708f;\n  background-color: #c4e3f3;\n}\n\na.list-group-item-info.active,\na.list-group-item-info.active:focus,\na.list-group-item-info.active:hover,\nbutton.list-group-item-info.active,\nbutton.list-group-item-info.active:focus,\nbutton.list-group-item-info.active:hover {\n  color: #fff;\n  background-color: #31708f;\n  border-color: #31708f;\n}\n\n.list-group-item-warning {\n  color: #8a6d3b;\n  background-color: #fcf8e3;\n}\n\na.list-group-item-warning,\nbutton.list-group-item-warning {\n  color: #8a6d3b;\n}\n\na.list-group-item-warning .list-group-item-heading,\nbutton.list-group-item-warning .list-group-item-heading {\n  color: inherit;\n}\n\na.list-group-item-warning:focus,\na.list-group-item-warning:hover,\nbutton.list-group-item-warning:focus,\nbutton.list-group-item-warning:hover {\n  color: #8a6d3b;\n  background-color: #faf2cc;\n}\n\na.list-group-item-warning.active,\na.list-group-item-warning.active:focus,\na.list-group-item-warning.active:hover,\nbutton.list-group-item-warning.active,\nbutton.list-group-item-warning.active:focus,\nbutton.list-group-item-warning.active:hover {\n  color: #fff;\n  background-color: #8a6d3b;\n  border-color: #8a6d3b;\n}\n\n.list-group-item-danger {\n  color: #a94442;\n  background-color: #f2dede;\n}\n\na.list-group-item-danger,\nbutton.list-group-item-danger {\n  color: #a94442;\n}\n\na.list-group-item-danger .list-group-item-heading,\nbutton.list-group-item-danger .list-group-item-heading {\n  color: inherit;\n}\n\na.list-group-item-danger:focus,\na.list-group-item-danger:hover,\nbutton.list-group-item-danger:focus,\nbutton.list-group-item-danger:hover {\n  color: #a94442;\n  background-color: #ebcccc;\n}\n\na.list-group-item-danger.active,\na.list-group-item-danger.active:focus,\na.list-group-item-danger.active:hover,\nbutton.list-group-item-danger.active,\nbutton.list-group-item-danger.active:focus,\nbutton.list-group-item-danger.active:hover {\n  color: #fff;\n  background-color: #a94442;\n  border-color: #a94442;\n}\n\n.list-group-item-heading {\n  margin-top: 0;\n  margin-bottom: 5px;\n}\n\n.list-group-item-text {\n  margin-bottom: 0;\n  line-height: 1.3;\n}\n\n.embed-responsive {\n  position: relative;\n  display: block;\n  height: 0;\n  padding: 0;\n  overflow: hidden;\n}\n\n.embed-responsive .embed-responsive-item,\n.embed-responsive iframe,\n.embed-responsive embed,\n.embed-responsive object,\n.embed-responsive video {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  border: 0;\n}\n\n.embed-responsive-21by9 {\n  padding-bottom: 42.857143%;\n}\n\n.embed-responsive-16by9 {\n  padding-bottom: 56.25%;\n}\n\n.embed-responsive-4by3 {\n  padding-bottom: 75%;\n}\n\n.close {\n  float: right;\n  font-size: 1.5rem;\n  font-weight: bold;\n  line-height: 1;\n  color: #000;\n  text-shadow: 0 1px 0 #fff;\n  opacity: .2;\n}\n\n.close:focus,\n.close:hover {\n  color: #000;\n  text-decoration: none;\n  cursor: pointer;\n  opacity: .5;\n}\n\nbutton.close {\n  -webkit-appearance: none;\n  padding: 0;\n  cursor: pointer;\n  background: transparent;\n  border: 0;\n}\n\n.modal-open {\n  overflow: hidden;\n}\n\n.modal {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1050;\n  display: none;\n  overflow: hidden;\n  -webkit-overflow-scrolling: touch;\n  outline: 0;\n}\n\n.modal.fade .modal-dialog {\n  -webkit-transition: -webkit-transform .3s ease-out;\n       -o-transition:      -o-transform .3s ease-out;\n          transition:         transform .3s ease-out;\n  -webkit-transform: translate(0, -25%);\n      -ms-transform: translate(0, -25%);\n       -o-transform: translate(0, -25%);\n          transform: translate(0, -25%);\n}\n\n.modal.in .modal-dialog {\n  -webkit-transform: translate(0, 0);\n      -ms-transform: translate(0, 0);\n       -o-transform: translate(0, 0);\n          transform: translate(0, 0);\n}\n\n.modal-open .modal {\n  overflow-x: hidden;\n  overflow-y: auto;\n}\n\n.modal-dialog {\n  position: relative;\n  width: auto;\n  margin: 10px;\n}\n\n.modal-content {\n  position: relative;\n  background-color: #fff;\n  -webkit-background-clip: padding-box;\n          background-clip: padding-box;\n  border: 1px solid rgba(0, 0, 0, .2);\n  border-radius: .3rem;\n  outline: 0;\n}\n\n.modal-backdrop {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1040;\n  background-color: #000;\n}\n\n.modal-backdrop.fade {\n  opacity: 0;\n}\n\n.modal-backdrop.in {\n  opacity: .5;\n}\n\n.modal-header {\n  padding: 15px;\n  border-bottom: 1px solid #e5e5e5;\n}\n\n.modal-header::after {\n  display: table;\n  clear: both;\n  content: \"\";\n}\n\n.modal-header .close {\n  margin-top: -2px;\n}\n\n.modal-title {\n  margin: 0;\n  line-height: 1.5;\n}\n\n.modal-body {\n  position: relative;\n  padding: 15px;\n}\n\n.modal-footer {\n  padding: 15px;\n  text-align: right;\n  border-top: 1px solid #e5e5e5;\n}\n\n.modal-footer::after {\n  display: table;\n  clear: both;\n  content: \"\";\n}\n\n.modal-footer .btn + .btn {\n  margin-bottom: 0;\n  margin-left: 5px;\n}\n\n.modal-footer .btn-group .btn + .btn {\n  margin-left: -1px;\n}\n\n.modal-footer .btn-block + .btn-block {\n  margin-left: 0;\n}\n\n.modal-scrollbar-measure {\n  position: absolute;\n  top: -9999px;\n  width: 50px;\n  height: 50px;\n  overflow: scroll;\n}\n\n@media (min-width: 544px) {\n  .modal-dialog {\n    width: 600px;\n    margin: 30px auto;\n  }\n  .modal-sm {\n    width: 300px;\n  }\n}\n\n@media (min-width: 768px) {\n  .modal-lg {\n    width: 900px;\n  }\n}\n\n.tooltip {\n  position: absolute;\n  z-index: 1070;\n  display: block;\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: .85rem;\n  font-style: normal;\n  font-weight: normal;\n  line-height: 1.5;\n  text-align: left;\n  text-align: start;\n  text-decoration: none;\n  text-shadow: none;\n  text-transform: none;\n  letter-spacing: normal;\n  word-break: normal;\n  word-spacing: normal;\n  word-wrap: normal;\n  white-space: normal;\n  opacity: 0;\n\n  line-break: auto;\n}\n\n.tooltip.in {\n  opacity: .9;\n}\n\n.tooltip.tooltip-top,\n.tooltip.bs-tether-element-attached-bottom {\n  padding: 5px 0;\n  margin-top: -3px;\n}\n\n.tooltip.tooltip-top .tooltip-arrow,\n.tooltip.bs-tether-element-attached-bottom .tooltip-arrow {\n  bottom: 0;\n  left: 50%;\n  margin-left: -5px;\n  border-width: 5px 5px 0;\n  border-top-color: #000;\n}\n\n.tooltip.tooltip-right,\n.tooltip.bs-tether-element-attached-left {\n  padding: 0 5px;\n  margin-left: 3px;\n}\n\n.tooltip.tooltip-right .tooltip-arrow,\n.tooltip.bs-tether-element-attached-left .tooltip-arrow {\n  top: 50%;\n  left: 0;\n  margin-top: -5px;\n  border-width: 5px 5px 5px 0;\n  border-right-color: #000;\n}\n\n.tooltip.tooltip-bottom,\n.tooltip.bs-tether-element-attached-top {\n  padding: 5px 0;\n  margin-top: 3px;\n}\n\n.tooltip.tooltip-bottom .tooltip-arrow,\n.tooltip.bs-tether-element-attached-top .tooltip-arrow {\n  top: 0;\n  left: 50%;\n  margin-left: -5px;\n  border-width: 0 5px 5px;\n  border-bottom-color: #000;\n}\n\n.tooltip.tooltip-left,\n.tooltip.bs-tether-element-attached-right {\n  padding: 0 5px;\n  margin-left: -3px;\n}\n\n.tooltip.tooltip-left .tooltip-arrow,\n.tooltip.bs-tether-element-attached-right .tooltip-arrow {\n  top: 50%;\n  right: 0;\n  margin-top: -5px;\n  border-width: 5px 0 5px 5px;\n  border-left-color: #000;\n}\n\n.tooltip-inner {\n  max-width: 200px;\n  padding: 3px 8px;\n  color: #fff;\n  text-align: center;\n  background-color: #000;\n  border-radius: .25rem;\n}\n\n.tooltip-arrow {\n  position: absolute;\n  width: 0;\n  height: 0;\n  border-color: transparent;\n  border-style: solid;\n}\n\n.popover {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 1060;\n  display: block;\n  max-width: 276px;\n  padding: 1px;\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: .85rem;\n  font-style: normal;\n  font-weight: normal;\n  line-height: 1.5;\n  text-align: left;\n  text-align: start;\n  text-decoration: none;\n  text-shadow: none;\n  text-transform: none;\n  letter-spacing: normal;\n  word-break: normal;\n  word-spacing: normal;\n  word-wrap: normal;\n  white-space: normal;\n  background-color: #fff;\n  -webkit-background-clip: padding-box;\n          background-clip: padding-box;\n  border: 1px solid rgba(0, 0, 0, .2);\n  border-radius: .3rem;\n\n  line-break: auto;\n}\n\n.popover.popover-top,\n.popover.bs-tether-element-attached-bottom {\n  margin-top: -10px;\n}\n\n.popover.popover-top .popover-arrow,\n.popover.bs-tether-element-attached-bottom .popover-arrow {\n  bottom: -11px;\n  left: 50%;\n  margin-left: -11px;\n  border-top-color: rgba(0, 0, 0, .25);\n  border-bottom-width: 0;\n}\n\n.popover.popover-top .popover-arrow::after,\n.popover.bs-tether-element-attached-bottom .popover-arrow::after {\n  bottom: 1px;\n  margin-left: -10px;\n  content: \"\";\n  border-top-color: #fff;\n  border-bottom-width: 0;\n}\n\n.popover.popover-right,\n.popover.bs-tether-element-attached-left {\n  margin-left: 10px;\n}\n\n.popover.popover-right .popover-arrow,\n.popover.bs-tether-element-attached-left .popover-arrow {\n  top: 50%;\n  left: -11px;\n  margin-top: -11px;\n  border-right-color: rgba(0, 0, 0, .25);\n  border-left-width: 0;\n}\n\n.popover.popover-right .popover-arrow::after,\n.popover.bs-tether-element-attached-left .popover-arrow::after {\n  bottom: -10px;\n  left: 1px;\n  content: \"\";\n  border-right-color: #fff;\n  border-left-width: 0;\n}\n\n.popover.popover-bottom,\n.popover.bs-tether-element-attached-top {\n  margin-top: 10px;\n}\n\n.popover.popover-bottom .popover-arrow,\n.popover.bs-tether-element-attached-top .popover-arrow {\n  top: -11px;\n  left: 50%;\n  margin-left: -11px;\n  border-top-width: 0;\n  border-bottom-color: rgba(0, 0, 0, .25);\n}\n\n.popover.popover-bottom .popover-arrow::after,\n.popover.bs-tether-element-attached-top .popover-arrow::after {\n  top: 1px;\n  margin-left: -10px;\n  content: \"\";\n  border-top-width: 0;\n  border-bottom-color: #fff;\n}\n\n.popover.popover-left,\n.popover.bs-tether-element-attached-right {\n  margin-left: -10px;\n}\n\n.popover.popover-left .popover-arrow,\n.popover.bs-tether-element-attached-right .popover-arrow {\n  top: 50%;\n  right: -11px;\n  margin-top: -11px;\n  border-right-width: 0;\n  border-left-color: rgba(0, 0, 0, .25);\n}\n\n.popover.popover-left .popover-arrow::after,\n.popover.bs-tether-element-attached-right .popover-arrow::after {\n  right: 1px;\n  bottom: -10px;\n  content: \"\";\n  border-right-width: 0;\n  border-left-color: #fff;\n}\n\n.popover-title {\n  padding: 8px 14px;\n  margin: 0;\n  font-size: 1rem;\n  background-color: #f7f7f7;\n  border-bottom: 1px solid #ebebeb;\n  border-radius: -.7rem -.7rem 0 0;\n}\n\n.popover-content {\n  padding: 9px 14px;\n}\n\n.popover-arrow,\n.popover-arrow::after {\n  position: absolute;\n  display: block;\n  width: 0;\n  height: 0;\n  border-color: transparent;\n  border-style: solid;\n}\n\n.popover-arrow {\n  border-width: 11px;\n}\n\n.popover-arrow::after {\n  content: \"\";\n  border-width: 10px;\n}\n\n.carousel {\n  position: relative;\n}\n\n.carousel-inner {\n  position: relative;\n  width: 100%;\n  overflow: hidden;\n}\n\n.carousel-inner > .carousel-item {\n  position: relative;\n  display: none;\n  -webkit-transition: .6s ease-in-out left;\n       -o-transition: .6s ease-in-out left;\n          transition: .6s ease-in-out left;\n}\n\n.carousel-inner > .carousel-item > img,\n.carousel-inner > .carousel-item > a > img {\n  line-height: 1;\n}\n\n@media all and (transform-3d), (-webkit-transform-3d) {\n  .carousel-inner > .carousel-item {\n    -webkit-transition: -webkit-transform .6s ease-in-out;\n         -o-transition:      -o-transform .6s ease-in-out;\n            transition:         transform .6s ease-in-out;\n\n    -webkit-backface-visibility: hidden;\n            backface-visibility: hidden;\n    -webkit-perspective: 1000px;\n            perspective: 1000px;\n  }\n  .carousel-inner > .carousel-item.next,\n  .carousel-inner > .carousel-item.active.right {\n    left: 0;\n    -webkit-transform: translate3d(100%, 0, 0);\n            transform: translate3d(100%, 0, 0);\n  }\n  .carousel-inner > .carousel-item.prev,\n  .carousel-inner > .carousel-item.active.left {\n    left: 0;\n    -webkit-transform: translate3d(-100%, 0, 0);\n            transform: translate3d(-100%, 0, 0);\n  }\n  .carousel-inner > .carousel-item.next.left,\n  .carousel-inner > .carousel-item.prev.right,\n  .carousel-inner > .carousel-item.active {\n    left: 0;\n    -webkit-transform: translate3d(0, 0, 0);\n            transform: translate3d(0, 0, 0);\n  }\n}\n\n.carousel-inner > .active,\n.carousel-inner > .next,\n.carousel-inner > .prev {\n  display: block;\n}\n\n.carousel-inner > .active {\n  left: 0;\n}\n\n.carousel-inner > .next,\n.carousel-inner > .prev {\n  position: absolute;\n  top: 0;\n  width: 100%;\n}\n\n.carousel-inner > .next {\n  left: 100%;\n}\n\n.carousel-inner > .prev {\n  left: -100%;\n}\n\n.carousel-inner > .next.left,\n.carousel-inner > .prev.right {\n  left: 0;\n}\n\n.carousel-inner > .active.left {\n  left: -100%;\n}\n\n.carousel-inner > .active.right {\n  left: 100%;\n}\n\n.carousel-control {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  width: 15%;\n  font-size: 20px;\n  color: #fff;\n  text-align: center;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, .6);\n  opacity: .5;\n}\n\n.carousel-control.left {\n  background-image: -webkit-gradient(linear, left top, right top, from(rgba(0, 0, 0, .5)), to(rgba(0, 0, 0, .0001)));\n  background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, .5) 0%, rgba(0, 0, 0, .0001) 100%);\n  background-image:      -o-linear-gradient(left, rgba(0, 0, 0, .5) 0%, rgba(0, 0, 0, .0001) 100%);\n  background-image:         linear-gradient(to right, rgba(0, 0, 0, .5) 0%, rgba(0, 0, 0, .0001) 100%);\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#80000000', endColorstr='#00000000', GradientType=1);\n  background-repeat: repeat-x;\n}\n\n.carousel-control.right {\n  right: 0;\n  left: auto;\n  background-image: -webkit-gradient(linear, left top, right top, from(rgba(0, 0, 0, .0001)), to(rgba(0, 0, 0, .5)));\n  background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, .0001) 0%, rgba(0, 0, 0, .5) 100%);\n  background-image:      -o-linear-gradient(left, rgba(0, 0, 0, .0001) 0%, rgba(0, 0, 0, .5) 100%);\n  background-image:         linear-gradient(to right, rgba(0, 0, 0, .0001) 0%, rgba(0, 0, 0, .5) 100%);\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00000000', endColorstr='#80000000', GradientType=1);\n  background-repeat: repeat-x;\n}\n\n.carousel-control:focus,\n.carousel-control:hover {\n  color: #fff;\n  text-decoration: none;\n  outline: 0;\n  opacity: .9;\n}\n\n.carousel-control .icon-prev,\n.carousel-control .icon-next {\n  position: absolute;\n  top: 50%;\n  z-index: 5;\n  display: inline-block;\n  width: 20px;\n  height: 20px;\n  margin-top: -10px;\n  font-family: serif;\n  line-height: 1;\n}\n\n.carousel-control .icon-prev {\n  left: 50%;\n  margin-left: -10px;\n}\n\n.carousel-control .icon-next {\n  right: 50%;\n  margin-right: -10px;\n}\n\n.carousel-control .icon-prev::before {\n  content: \"\\2039\";\n}\n\n.carousel-control .icon-next::before {\n  content: \"\\203A\";\n}\n\n.carousel-indicators {\n  position: absolute;\n  bottom: 10px;\n  left: 50%;\n  z-index: 15;\n  width: 60%;\n  padding-left: 0;\n  margin-left: -30%;\n  text-align: center;\n  list-style: none;\n}\n\n.carousel-indicators li {\n  display: inline-block;\n  width: 10px;\n  height: 10px;\n  margin: 1px;\n  text-indent: -999px;\n  cursor: pointer;\n  background-color: transparent;\n  border: 1px solid #fff;\n  border-radius: 10px;\n}\n\n.carousel-indicators .active {\n  width: 12px;\n  height: 12px;\n  margin: 0;\n  background-color: #fff;\n}\n\n.carousel-caption {\n  position: absolute;\n  right: 15%;\n  bottom: 20px;\n  left: 15%;\n  z-index: 10;\n  padding-top: 20px;\n  padding-bottom: 20px;\n  color: #fff;\n  text-align: center;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, .6);\n}\n\n.carousel-caption .btn {\n  text-shadow: none;\n}\n\n@media (min-width: 544px) {\n  .carousel-control .icon-prev,\n  .carousel-control .icon-next {\n    width: 30px;\n    height: 30px;\n    margin-top: -15px;\n    font-size: 30px;\n  }\n  .carousel-control .icon-prev {\n    margin-left: -15px;\n  }\n  .carousel-control .icon-next {\n    margin-right: -15px;\n  }\n  .carousel-caption {\n    right: 20%;\n    left: 20%;\n    padding-bottom: 30px;\n  }\n  .carousel-indicators {\n    bottom: 20px;\n  }\n}\n\n.clearfix::after {\n  display: table;\n  clear: both;\n  content: \"\";\n}\n\n.center-block {\n  display: block;\n  margin-right: auto;\n  margin-left: auto;\n}\n\n.pull-right {\n  float: right !important;\n}\n\n.pull-left {\n  float: left !important;\n}\n\n.sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  border: 0;\n}\n\n.sr-only-focusable:active,\n.sr-only-focusable:focus {\n  position: static;\n  width: auto;\n  height: auto;\n  margin: 0;\n  overflow: visible;\n  clip: auto;\n}\n\n[hidden] {\n  display: none !important;\n}\n\n.invisible {\n  visibility: hidden;\n}\n\n.text-hide {\n  font: \"0/0\" a;\n  color: transparent;\n  text-shadow: none;\n  background-color: transparent;\n  border: 0;\n}\n\n.text-left {\n  text-align: left !important;\n}\n\n.text-right {\n  text-align: right !important;\n}\n\n.text-center {\n  text-align: center !important;\n}\n\n.text-justify {\n  text-align: justify !important;\n}\n\n.text-nowrap {\n  white-space: nowrap !important;\n}\n\n.text-truncate {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.text-xs-left {\n  text-align: left;\n}\n\n.text-xs-right {\n  text-align: right;\n}\n\n.text-xs-center {\n  text-align: center;\n}\n\n@media (min-width: 544px) {\n  .text-sm-left {\n    text-align: left;\n  }\n  .text-sm-right {\n    text-align: right;\n  }\n  .text-sm-center {\n    text-align: center;\n  }\n}\n\n@media (min-width: 768px) {\n  .text-md-left {\n    text-align: left;\n  }\n  .text-md-right {\n    text-align: right;\n  }\n  .text-md-center {\n    text-align: center;\n  }\n}\n\n@media (min-width: 992px) {\n  .text-lg-left {\n    text-align: left;\n  }\n  .text-lg-right {\n    text-align: right;\n  }\n  .text-lg-center {\n    text-align: center;\n  }\n}\n\n@media (min-width: 1200px) {\n  .text-xl-left {\n    text-align: left;\n  }\n  .text-xl-right {\n    text-align: right;\n  }\n  .text-xl-center {\n    text-align: center;\n  }\n}\n\n.text-lowercase {\n  text-transform: lowercase;\n}\n\n.text-uppercase {\n  text-transform: uppercase;\n}\n\n.text-capitalize {\n  text-transform: capitalize;\n}\n\n.text-muted {\n  color: #818a91;\n}\n\n.text-primary {\n  color: #0275d8;\n}\n\na.text-primary:focus,\na.text-primary:hover {\n  color: #025aa5;\n}\n\n.text-success {\n  color: #5cb85c;\n}\n\na.text-success:focus,\na.text-success:hover {\n  color: #449d44;\n}\n\n.text-info {\n  color: #5bc0de;\n}\n\na.text-info:focus,\na.text-info:hover {\n  color: #31b0d5;\n}\n\n.text-warning {\n  color: #f0ad4e;\n}\n\na.text-warning:focus,\na.text-warning:hover {\n  color: #ec971f;\n}\n\n.text-danger {\n  color: #d9534f;\n}\n\na.text-danger:focus,\na.text-danger:hover {\n  color: #c9302c;\n}\n\n.bg-inverse {\n  color: #eceeef;\n  background-color: #373a3c;\n}\n\n.bg-faded {\n  background-color: #f7f7f9;\n}\n\n.bg-primary {\n  color: #fff;\n  background-color: #0275d8;\n}\n\na.bg-primary:focus,\na.bg-primary:hover {\n  background-color: #025aa5;\n}\n\n.bg-success {\n  color: #fff;\n  background-color: #5cb85c;\n}\n\na.bg-success:focus,\na.bg-success:hover {\n  background-color: #449d44;\n}\n\n.bg-info {\n  color: #fff;\n  background-color: #5bc0de;\n}\n\na.bg-info:focus,\na.bg-info:hover {\n  background-color: #31b0d5;\n}\n\n.bg-warning {\n  color: #fff;\n  background-color: #f0ad4e;\n}\n\na.bg-warning:focus,\na.bg-warning:hover {\n  background-color: #ec971f;\n}\n\n.bg-danger {\n  color: #fff;\n  background-color: #d9534f;\n}\n\na.bg-danger:focus,\na.bg-danger:hover {\n  background-color: #c9302c;\n}\n\n.m-a-0 {\n  margin: 0 !important;\n}\n\n.m-t-0 {\n  margin-top: 0 !important;\n}\n\n.m-r-0 {\n  margin-right: 0 !important;\n}\n\n.m-b-0 {\n  margin-bottom: 0 !important;\n}\n\n.m-l-0 {\n  margin-left: 0 !important;\n}\n\n.m-x-0 {\n  margin-right: 0 !important;\n  margin-left: 0 !important;\n}\n\n.m-y-0 {\n  margin-top: 0 !important;\n  margin-bottom: 0 !important;\n}\n\n.m-a {\n  margin: 1rem !important;\n}\n\n.m-t {\n  margin-top: 1rem !important;\n}\n\n.m-r {\n  margin-right: 1rem !important;\n}\n\n.m-b {\n  margin-bottom: 1rem !important;\n}\n\n.m-l {\n  margin-left: 1rem !important;\n}\n\n.m-x {\n  margin-right: 1rem !important;\n  margin-left: 1rem !important;\n}\n\n.m-y {\n  margin-top: 1rem !important;\n  margin-bottom: 1rem !important;\n}\n\n.m-x-auto {\n  margin-right: auto !important;\n  margin-left: auto !important;\n}\n\n.m-a-md {\n  margin: 1.5rem !important;\n}\n\n.m-t-md {\n  margin-top: 1.5rem !important;\n}\n\n.m-r-md {\n  margin-right: 1.5rem !important;\n}\n\n.m-b-md {\n  margin-bottom: 1.5rem !important;\n}\n\n.m-l-md {\n  margin-left: 1.5rem !important;\n}\n\n.m-x-md {\n  margin-right: 1.5rem !important;\n  margin-left: 1.5rem !important;\n}\n\n.m-y-md {\n  margin-top: 1.5rem !important;\n  margin-bottom: 1.5rem !important;\n}\n\n.m-a-lg {\n  margin: 3rem !important;\n}\n\n.m-t-lg {\n  margin-top: 3rem !important;\n}\n\n.m-r-lg {\n  margin-right: 3rem !important;\n}\n\n.m-b-lg {\n  margin-bottom: 3rem !important;\n}\n\n.m-l-lg {\n  margin-left: 3rem !important;\n}\n\n.m-x-lg {\n  margin-right: 3rem !important;\n  margin-left: 3rem !important;\n}\n\n.m-y-lg {\n  margin-top: 3rem !important;\n  margin-bottom: 3rem !important;\n}\n\n.p-a-0 {\n  padding: 0 !important;\n}\n\n.p-t-0 {\n  padding-top: 0 !important;\n}\n\n.p-r-0 {\n  padding-right: 0 !important;\n}\n\n.p-b-0 {\n  padding-bottom: 0 !important;\n}\n\n.p-l-0 {\n  padding-left: 0 !important;\n}\n\n.p-x-0 {\n  padding-right: 0 !important;\n  padding-left: 0 !important;\n}\n\n.p-y-0 {\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n}\n\n.p-a {\n  padding: 1rem !important;\n}\n\n.p-t {\n  padding-top: 1rem !important;\n}\n\n.p-r {\n  padding-right: 1rem !important;\n}\n\n.p-b {\n  padding-bottom: 1rem !important;\n}\n\n.p-l {\n  padding-left: 1rem !important;\n}\n\n.p-x {\n  padding-right: 1rem !important;\n  padding-left: 1rem !important;\n}\n\n.p-y {\n  padding-top: 1rem !important;\n  padding-bottom: 1rem !important;\n}\n\n.p-a-md {\n  padding: 1.5rem !important;\n}\n\n.p-t-md {\n  padding-top: 1.5rem !important;\n}\n\n.p-r-md {\n  padding-right: 1.5rem !important;\n}\n\n.p-b-md {\n  padding-bottom: 1.5rem !important;\n}\n\n.p-l-md {\n  padding-left: 1.5rem !important;\n}\n\n.p-x-md {\n  padding-right: 1.5rem !important;\n  padding-left: 1.5rem !important;\n}\n\n.p-y-md {\n  padding-top: 1.5rem !important;\n  padding-bottom: 1.5rem !important;\n}\n\n.p-a-lg {\n  padding: 3rem !important;\n}\n\n.p-t-lg {\n  padding-top: 3rem !important;\n}\n\n.p-r-lg {\n  padding-right: 3rem !important;\n}\n\n.p-b-lg {\n  padding-bottom: 3rem !important;\n}\n\n.p-l-lg {\n  padding-left: 3rem !important;\n}\n\n.p-x-lg {\n  padding-right: 3rem !important;\n  padding-left: 3rem !important;\n}\n\n.p-y-lg {\n  padding-top: 3rem !important;\n  padding-bottom: 3rem !important;\n}\n\n.pos-f-t {\n  position: fixed;\n  top: 0;\n  right: 0;\n  left: 0;\n  z-index: 1030;\n}\n\n.hidden-xs-up {\n  display: none !important;\n}\n\n@media (max-width: 543px) {\n  .hidden-xs-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 544px) {\n  .hidden-sm-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 767px) {\n  .hidden-sm-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 768px) {\n  .hidden-md-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 991px) {\n  .hidden-md-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 992px) {\n  .hidden-lg-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 1199px) {\n  .hidden-lg-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 1200px) {\n  .hidden-xl-up {\n    display: none !important;\n  }\n}\n\n.hidden-xl-down {\n  display: none !important;\n}\n\n.visible-print-block {\n  display: none !important;\n}\n\n@media print {\n  .visible-print-block {\n    display: block !important;\n  }\n}\n\n.visible-print-inline {\n  display: none !important;\n}\n\n@media print {\n  .visible-print-inline {\n    display: inline !important;\n  }\n}\n\n.visible-print-inline-block {\n  display: none !important;\n}\n\n@media print {\n  .visible-print-inline-block {\n    display: inline-block !important;\n  }\n}\n\n@media print {\n  .hidden-print {\n    display: none !important;\n  }\n}\n/*# sourceMappingURL=bootstrap.css.map */\n", ""]);

	// exports


/***/ },
/* 9 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);