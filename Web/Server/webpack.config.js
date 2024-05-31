const path = require("node:path")

module.exports = {
  // watch: true,
  entry: "./src/index.ts",
  output: {
    path: path.resolve("./dist"),
    filename: "server.js",
  },
  resolve: {
    extensions: [ ".js", ".ts", ".jsx", ".tsx" ],
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
  stats: {
    errorDetails: true
  },
  mode: "production"
}