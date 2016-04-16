module.exports = {
    // entry: './entry.js',
    entry: {
        story: "./config/story.js",
        utils: './config/utils.js'
    },
    output: {
        path: __dirname + '/bundle',
        filename: "[name].bundle.js",
        chunkFilename: "[id].bundle.js"
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {test: /\.js|jsx$/, loaders: ['jsx-loader']}
        ]
    }
};