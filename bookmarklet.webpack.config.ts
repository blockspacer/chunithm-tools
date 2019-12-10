import * as Webpack from "webpack";
const VueLoaderPlugin = require("vue-loader/lib/plugin");

const config: Webpack.Configuration = {
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    output: {
        filename: "index.js"
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
            {
                test: /\.ts$/,
                loader: "ts-loader",
                options: {
                    appendTsSuffixTo: [/\.vue$/]
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ],
    resolve: {
        extensions: [".ts", ".js"]
    }
};

export default config;
