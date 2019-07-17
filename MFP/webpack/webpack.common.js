const Path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    'MFP/mfp': Path.resolve(__dirname, '../src/js/mfp.js'),
    'MFP/stylesheets/screen': Path.resolve(__dirname, '../src/sass/screen.scss'),
    'demo/stylesheets/demo-blue':  Path.resolve(__dirname, '../src-demo/sass/demo-blue.scss'),
    'demo/stylesheets/demo-green':  Path.resolve(__dirname, '../src-demo/sass/demo-green.scss'),
    'demo/stylesheets/demo-red':  Path.resolve(__dirname, '../src-demo/sass/demo-red.scss'),
    'MFP/stylesheets/player-blue':  Path.resolve(__dirname, '../src/sass/player-blue.scss'),
    'MFP/stylesheets/player-green':  Path.resolve(__dirname, '../src/sass/player-green.scss'),
    'MFP/stylesheets/player-red':  Path.resolve(__dirname, '../src/sass/player-red.scss'),
    'MFP/trackreader/loadTrackType-srt': Path.resolve(__dirname, '../src/js/trackreader/loadTrackType-srt.js'),
    'MFP/trackreader/loadTrackType-stl': Path.resolve(__dirname, '../src/js/trackreader/loadTrackType-stl.js'),
    'MFP/trackreader/stl': Path.resolve(__dirname, '../src/js/trackreader/stl.scss'),
    'MFP/video-players/loadVideoPlayer-html5': Path.resolve(__dirname, '../src/js/video-players/loadVideoType-html5.js'),
    'MFP/video-players/loadVideoPlayer-vimeo': Path.resolve(__dirname, '../src/js/video-players/loadVideoType-vimeo.js'),
    'MFP/video-players/loadVideoPlayer-error': Path.resolve(__dirname, '../src/js/video-players/loadVideoType-error.js')
  },
  output: {
    path: Path.join(__dirname, '../dist'),
    filename: '[name].js'
  },
  plugins: [

    new CopyWebpackPlugin([
      { from: Path.resolve(__dirname, '../public'), to: '.' }
    ]),
    new CopyWebpackPlugin([
      { from: Path.resolve(__dirname, '../src-demo/*.html'), to: 'demo/' }
    ]),
    /*
    new HtmlWebpackPlugin({
      template: Path.resolve(__dirname, '../src/index.html'),
      inject: false
    }),
    */
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  resolve: {
    alias: {
      '~': Path.resolve(__dirname, '../src')
    }
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
              name: '[name].[ext]',
              outputPath: 'img/'
          }
        }
      },
      {
          test: /\.(eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
          include: [
            Path.resolve(__dirname, "../src/fonts")
          ],
          use: [{
              loader: 'file-loader',
              options: {
                  name: '[name].[ext]',
                  outputPath: 'MFP/fonts/'
              }
          }]
      },
      {
          test: /\.(eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
          include: [
            Path.resolve(__dirname, "../src-demo/fonts")
          ],
          use: [{
              loader: 'file-loader',
              options: {
                  name: '[name].[ext]',
                  outputPath: 'demo/fonts/'
              }
          }]
      },
      {
        test: /\.s?css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
                publicPath: '../',
            }
          },
          {loader:'css-loader'},
          {loader:'sass-loader'}
        ],
      }
    ]
  }
};
