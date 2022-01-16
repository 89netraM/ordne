const path = require("path");
const HtmlPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = {
	entry: path.resolve(__dirname, "./src/index.tsx"),
	mode: "development",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader"
			},
			{
				test: /\.s?css$/,
				use: [
					"style-loader",
					"css-loader",
					"sass-loader"
				]
			},
		]
	},
	resolve: {
		extensions: [ ".ts", ".tsx", ".js", ".jsx" ],
	},
	plugins: [
		new HtmlPlugin({
			template: path.resolve(__dirname, "index.html"),
			title: "Ordne",
			base: "./"
		}),
		new WorkboxPlugin.GenerateSW({
			clientsClaim: true,
			skipWaiting: true,
		}),
		new CopyPlugin({
			patterns: [
				{ from: "./static", to: "./static" }
			]
		}),
	],
	output: {
		filename: "index.js",
		path: path.resolve(__dirname, "dist")
	},
	devServer: {
		port: 9090,
		host: "0.0.0.0"
	}
};
