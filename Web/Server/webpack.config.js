import path from "node:path";

module.exports = {
  entry: "./src/index.ts",
  watch: true,
  output: {
    path: path.resolve("./dist"),
    filename: "server.js",
  },
  resolve: {
    extension: [ "js", "ts", "jsx", "tsx" ]
  },
  module: {
    rule: [
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
  mode: "production"
}