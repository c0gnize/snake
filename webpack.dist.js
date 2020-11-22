const { merge } = require('webpack-merge');
const { resolve } = require('path');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'production',
  entry: 'index.tsx',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, './dist'),
  },
  plugins: [],
});
