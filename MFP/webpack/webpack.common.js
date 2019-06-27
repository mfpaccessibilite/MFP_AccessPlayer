const Path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    mfp: Path.resolve(__dirname, '../src/js/mfp.js'),
    'stylesheets/screen': Path.resolve(__dirname, '../src/sass/screen.scss'),
    'stylesheets/demo-blue':  Path.resolve(__dirname, '../src/sass/demo-blue.scss'),
    'stylesheets/player-blue':  Path.resolve(__dirname, '../src/sass/player-blue.scss'),
    'stylesheets/player-green':  Path.resolve(__dirname, '../src/sass/player-green.scss'),
    'stylesheets/player-red':  Path.resolve(__dirname, '../src/sass/player-red.scss'),
    'trackreader/loadTrackType-srt': Path.resolve(__dirname, '../src/js/trackreader/loadTrackType-srt.js'),
    'trackreader/loadTrackType-stl': Path.resolve(__dirname, '../src/js/trackreader/loadTrackType-stl.js'),
    'trackreader/stl': Path.resolve(__dirname, '../src/js/trackreader/stl.scss'),
    'video-players/loadVideoPlayer-html5': Path.resolve(__dirname, '../src/js/video-players/loadVideoType-html5.js'),
    'video-players/loadVideoPlayer-vimeo': Path.resolve(__dirname, '../src/js/video-players/loadVideoType-vimeo.js'),
    'video-players/loadVideoPlayer-error': Path.resolve(__dirname, '../src/js/video-players/loadVideoType-error.js')
  },
  output: {
    path: Path.join(__dirname, '../dist'),
    filename: '[name].js'
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: Path.resolve(__dirname, '../public'), to: '.' }
    ]),
    new HtmlWebpackPlugin({
      template: Path.resolve(__dirname, '../src/index.html'),
      inject: false
    }),
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
          use: [{
              loader: 'file-loader',
              options: {
                  name: '[name].[ext]',
                  outputPath: 'fonts/'
              }
          }]
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
};
