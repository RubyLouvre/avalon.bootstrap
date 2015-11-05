require("avalon")
require("./flipswitch")
require("bootstrap.css")
require("!style!css!sass!./flipswitch.scss");

var vm = avalon.define({
    $id: "test",
    size: ""
})
vm.$watch("size", function(a){
    var flip = avalon.vmodels.size
    if(flip){
        flip.size = a
    }
})