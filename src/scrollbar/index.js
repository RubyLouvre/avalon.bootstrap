var avalon = require("avalon")

require("./scrollbar")

require("bootstrap.css")

avalon.define({
    $id: "test",
    ee: "111",
    onScrolling: function () {
        avalon.log("正在滚动")
    },
    onScrollTop: function () {
        avalon.log("滚动到顶部")
    },
    onScrollEnd: function () {
        avalon.log("滚动结束")
    }
})