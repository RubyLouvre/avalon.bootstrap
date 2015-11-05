bootstrap为原bootstrap 4的公共样式的SCSS

其他样式打散到各个组件中

组件的编写建议参考button dropdown flipswitch

组件内部尽量不要在视图中用ms-on-*绑定事件,而是使用avalon.bind实现事件代理
公用的属性有_element 

