/* 
 * 
 *检测对focusin/focusout的支持,不支持进行修复
 *
 *http://www.cnblogs.com/snandy/archive/2011/07/19/2110393.html
 */
var avalon = require("avalon")
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
