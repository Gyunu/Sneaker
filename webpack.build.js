var webpack = require('webpack');
module.exports = {
	context: __dirname,
		entry: "./src/sidewalk.ts",
		devtool: "source-map",
		output: {
			path: __dirname + "/dist/js",
			filename: "sidewalk.js"
		},
		resolve: {
			extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
		},
		module: {
			loaders: [
				{ test: /\.tsx?$/, loader: 'ts-loader' }
			]
		}
};
