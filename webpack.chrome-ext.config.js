const webpack = require('webpack');
const path = require('path');
const loaders = require('./webpack.loaders');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const webpackAlias = require('./webpack-alias.js');

const use = `css-loader?sourceMap&localIdentName=[local]
___[hash:base64:5]!sass-loader?outputStyle=expanded`.replace(/\n/, '');

loaders.push({
    test: /\.scss$/,
    loader: ExtractTextPlugin
        .extract({
            fallback: 'style-loader',
            use,
        }),
    exclude: ['node_modules'],
});

module.exports = {
    entry: [
        './src/index.jsx',
        './styles/index.scss',
    ],
    output: {
        publicPath: './',
        path: path.join(__dirname, 'chrome-extension/public'),
        filename: 'script.js',
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: webpackAlias,
    },
    module: {
        loaders,
    },
    plugins: [
        new WebpackCleanupPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"',
            },
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                screw_ie8: true,
                drop_console: true,
                drop_debugger: true,
            },
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new ExtractTextPlugin({
            filename: 'style.css',
            allChunks: true,
        }),
        new HtmlWebpackPlugin({
            template: './src/template.html',
            files: {
                css: ['style.css'],
                js: ['bundle.js'],
            },
        }),
    ],
};
