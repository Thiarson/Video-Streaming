const path = require("node:path")
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
  // watch: true,
  entry: "./api/index.ts",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "server.js",
  },
  resolve: {
    extensions: [ ".js", ".ts", ".jsx", ".tsx" ],
    alias: {
      "browser": path.resolve(__dirname, "api/browser")
    },
    fallback: {
      "fs": false,
      "path": require.resolve("path-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer/"),
      "util": require.resolve("util/"),
      "assert": require.resolve("assert/"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "url": require.resolve("url/"),
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ["ts-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      }
    ]
  },
  plugins: [
    new NodePolyfillPlugin()
  ],
  stats: {
    errorDetails: true
  },
  devtool: "source-map",
  mode: "development"
}