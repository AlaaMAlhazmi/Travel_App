const path = require('path');
const common = require('./webpack.common');
const merge = require('webpack-merge');
const webpack = require('webpack')
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = merge(common, {
    mode: "development",
    devtool: false,
        devServer: {
        proxy: {
            "/tripApiInfo": "http://localhost:3000",
            "/hello": "http://localhost:3000"
        }
    },
    output: {
        path: path.resolve(__dirname,"dist"),
        filename: "main.js"
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            }
        ]
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: '[name].js.map',
            exclude: ['vendor.js']
        }),
    ]
});