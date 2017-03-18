'use strict';

const path = require('path');
const webpack = require('webpack');

const src = path.join(__dirname, 'src');
const dst = path.join(__dirname, 'build');

const config = {
  target: 'web',

  entry: path.join(src, 'index.js'),

  output: {
    path: dst,
    publicPath: '',
    filename: '[name].js',
    pathInfo: true
  },

  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['stage-2', 'es2015', 'react'],
        plugins: [
          'react-require',
          [
            'babel-root-import',
            {'rootPathSuffix': 'src'}
          ]
        ]
      }
    }, {
      test: /\.sass$/,
      exclude: /node_modules/,
      loader: 'style!css!sass'
    }, {
      test: /\.css$/,
      loader: 'style!css'
    }, {
      test: /\.(woff|ttf|eot|svg|png|jpg)$/,
      loader: 'url'
    }],
    noParse: [
      /[\/\\]libphonenumber\.js$/
    ]
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  plugins: [
    new webpack.NoErrorsPlugin()
  ],

  watchOptions: {
    poll: 1000
  }
};

module.exports = config;

