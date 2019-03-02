const path = require("path");

module.exports = {
    mode: "development",
    entry: "src/index.js",
    output: {
        path: __dirname+'/static',
        filename: "[name].[chunkhash:8].js"
    },
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: "eslint-loader"
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.(scss|sass)$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        })
    ]
};