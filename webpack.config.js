module.exports = {
    entry: {
        basic: './entry-basic.js',
        business: './entry-business.js'
    },
    output: {
        path: __dirname + '/bundle',
        filename: "[name].bundle.js",
        chunkFilename: "[id].bundle.js"
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: "style!css"}
        ]
    }
};