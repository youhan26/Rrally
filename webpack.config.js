module.exports = {
    entry: './entry.js',
    output: {
        path: __dirname + '/bundle',
        filename: "[name].bundle.js",
        chunkFilename: "[id].bundle.js"
    },
    module: {
        loaders: [
            {test: /\.jsx?$/, loaders: ['jsx?harmony']}
            //{test: /\.css$/, loader: "style!css"}
        ]
    }
};