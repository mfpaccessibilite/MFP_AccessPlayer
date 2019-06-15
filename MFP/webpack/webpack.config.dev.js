const Path = require('path');
const Webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-eval-source-map',
  output: {
    chunkFilename: 'js/[name].chunk.js'
  },
  entry:{
    'demo-blue':  Path.resolve(__dirname, '../src/sass/demo-blue.scss'),
    'player-blue':  Path.resolve(__dirname, '../src/sass/player-blue.scss')
  },
  devServer: {
    inline: true
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new MiniCssExtractPlugin({
      filename: 'stylesheets/[name].css'
    }),
    new HtmlWebpackPlugin({
      template: Path.resolve(__dirname, '../src/index.html'),
      inject: false,
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        include: Path.resolve(__dirname, '../src'),
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          emitWarning: true,
        }
      },
      {
        test: /\.(js)$/,
        include: Path.resolve(__dirname, '../src'),
        loader: 'babel-loader'
      },
      {
        test: /\.s?css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
                publicPath: '/',
            }
          },
          {loader:'css-loader'},
          {loader:'sass-loader'}
        ],
      }
    ]
  }
});
