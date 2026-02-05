import path from "path";
import webpack from "webpack";

const __dirname = path.resolve();

export default (env, argv) => ({
	mode: argv.mode === "production" ? "production" : "development",

	// This is necessary because Figma's 'eval' works differently than normal eval
	devtool: argv.mode === "production" ? false : "inline-source-map",
	entry: {
		code: "./src/code.ts", // This is the entry point for our plugin code.
	},
	module: {
		rules: [
			// Converts TypeScript code to JavaScript
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
			{
				test: /\.test.ts$/,
				exclude: /node_modules/,
				collectCoverageFrom: ["**/*.{js,jsx}", "!**/node_modules/**"],
				use: {
					loader: "babel-loader",
					options: {
						targets: "defaults",
						presets: [["@babel/preset-env"]],
					},
				},
			},
		],
	},
	// Webpack tries these extensions for you if you omit the extension like "import './file'"
	resolve: {
		extensions: [".ts", ".js"],
	},
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, "dist"),
	},
});
