var avalon = require("avalon")
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
