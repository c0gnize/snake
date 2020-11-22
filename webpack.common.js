const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    modules: [path.resolve("./src"), "node_modules"],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ["ts-loader"],
        exclude: /node-modules/,
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "dts-css-modules-loader",
            options: {
              namedExport: true,
            },
          },
          {
            loader: "css-loader",
            options: {
              modules: true,
              camelCase: "only",
              localIdentName: "[local]",
              import: false,
              url: false,
            },
          },
        ],
      },
    ],
  },

  watchOptions: {
    ignored: /node_modules/,
    poll: true
  }
};
