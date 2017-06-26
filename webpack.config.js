const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: {
		app: './src/app.js',
		other: './src/other.js'
	},
	output: {
		// path: 'C:\\Dev\\createJs\\dist',
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.sass$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'sass-loader']
				})
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			},
			{
				test: /\.pug$/,
				use: ['html-loader', 'pug-html-loader']
			}
		]
	},
	devServer: {
		contentBase: path.resolve(__dirname, 'dist'),
		compress: true,
		port: 9000,
		stats: 'errors-only',
		// open: true
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'createJs',
			// minify: {
			// 	collapseWhitespace: true
			// },
			hash: true,
			excludeChunks: ['other'],
			// filename: './../index.pug',
			template: './src/index.pug'
		}),
		new HtmlWebpackPlugin({
			title: 'createJs',
			hash: true,
			chunk: ['other'],
			filename: 'other.html',
			template: './src/other.pug'
		}),
		new ExtractTextPlugin("app.css")
	]
};