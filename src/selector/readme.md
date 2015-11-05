一个简单的选择器引擎

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