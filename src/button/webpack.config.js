var webpack = require("webpack");
var path = require("path");
module.exports = {
    entry: "./index",
    output: {path: path.join(__dirname, "dist"), filename: "bundle.js"},
    module: {
        loaders: [
            {test: /\.css$/, loader: 'style-loader!css-loader'}
        ]
    },
    resolve: {
        extensions: ['.js',"",".css"],
        alias: {
            avalon: '../vendor/avalon.shim',
            "bootstrap.css": '../bootstrap/bootstrap.css'
        }
    }
}

