

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