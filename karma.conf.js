const path = require('path');
const webpack = require('webpack');

module.exports = (config) => {
  config.set({
    basePath: '',

    frameworks: ['mocha', 'sinon', 'chai'],

    files: [
      'test/react/components/*',
    ],

    webpack: {
      externals: {
        sinon: true,
      },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            loader: 'babel-loader',
            include: [
              path.join(__dirname, 'src'),
              path.join(__dirname, 'test'),
            ],
            query: {
              babelrc: false,
              presets: ['stage-2', 'es2015', 'react'],
              plugins: [
                'react-require',
                [
                  'babel-root-import',
                  {'rootPathSuffix': 'src'}
                ],
                'transform-class-properties'
              ]
            },
          }, {
            test: /\.sass$/,
            exclude: /node_modules/,
            loader: 'style-loader!css-loader!postcss-loader!sass-loader'
          }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
          }, {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'url-loader?limit=10000&mimetype=application/font-woff'
          }, {
            test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'file-loader'
          }, {
            test: /\.(svg|png|jpg)$/,
            loader: 'url-loader'
          },
        ],
      },
      resolve: {
        alias: {
          formatron: path.resolve(__dirname, 'src'),
          react: path.resolve(__dirname, 'node_modules', 'react'),
          'react-dom': path.resolve(__dirname, 'node_modules', 'react-dom'),
        },
        extensions: ['.js', '.jsx'],
      },
    },

    webpackMiddleware: {
      progress: true,
      stats: true,
      debug: true,
      quiet: true,
    },

    preprocessors: {
      'test/**/*': ['webpack'],
    },

    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: false,

    browsers: ['Chrome'],

    singleRun: true,

    concurrency: Infinity,
  });
};
