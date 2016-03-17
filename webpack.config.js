var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var path = require('path');

/**
 * This is the Webpack configuration file for local development.
 * For more information, see: http://webpack.github.io/docs/configuration.html
 */

module.exports = {

  entry: {
    popup: './src/popup',
    inject: './src/inject',
    vendors: ['classnames', 'immutable', 'react', 'react-dom']
  },

  output: {
    path: path.join(__dirname, 'chrome/'),
    filename: '[name]-bundle.js'
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
    new webpack.NoErrorsPlugin()
  ],

  // Transform source code using Babel
  module: {
    include: [
      path.resolve(__dirname, 'src')
    ],

    preLoaders: [
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules|vendor/,
      //   loader: 'eslint-loader'
      // }
    ],
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!postcss-loader!less-loader'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules|vendor/,
        loader: 'babel'
      }
    ]
  },

  postcss: [
    autoprefixer({
      browsers: ['last 2 versions']
    })
  ],

  // Automatically transform files with these extensions
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};
