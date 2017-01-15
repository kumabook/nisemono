const webpack = require('webpack');
const path    = require('path');
module.exports = {
  devtool: 'source-map',
  entry: './',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'nisemono.js',
    publicPath: 'nisemono.js',
  },
  resolve: {
    extensions: ['.js'],
  },
  plugins: [
    new webpack.ProvidePlugin({
      'nisemono': 'nisemono',
      'window.nisemono': 'nisemono'
    })
  ],
};
