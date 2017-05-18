import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';

const outputPath = path.join(__dirname, 'dist')

// We will probably want to make separate configs for dev and prod, but for
// now, this fits our needs.
function buildConfig(config) {
  return {
    module: {
      loaders: [{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['stage-2', 'es2015', 'react'],
          plugins: [
            'react-require',
            [
              'babel-root-import',
              {'rootPathSuffix': 'src'}
            ],
            'transform-class-properties'
          ]
        }
      }, {
        test: /\.sass$/,
        exclude: /node_modules/,
        loader: 'style-loader!css-loader!postcss-loader!sass-loader'
      }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }, {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff"
      }, {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      }, {
        test: /\.(svg|png|jpg)$/,
        loader: 'url-loader'
      }],
      noParse: [
        /[\/\\]libphonenumber\.js$/
      ]
    },

    resolve: {
      extensions: ['.js', '.jsx']
    },

    watchOptions: {
      poll: 1000
    },

    ...config
  };
}

const prodConfig = buildConfig({
  entry: [
    path.join(__dirname, 'src', 'index.js')
  ],

  output: {
    library: 'formatron',
    libraryTarget: 'umd',
    path: outputPath,
    filename: 'formatron.js',
  },

  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
      umd: 'react'
    },
    immutable: {
      root: 'Immutable',
      commonjs2: 'immutable',
      commonjs: 'immutable',
      amd: 'immutable',
      umd: 'immutable'
    },
    moment: {
      root: 'moment',
      commonjs2: 'moment',
      commonjs: 'moment',
      amd: 'moment',
      umd: 'moment'
    }
  }
});

const exampleConfig = buildConfig({
  entry: [
    path.join(__dirname, 'example', 'app.jsx')
  ],

  output: {
    path: outputPath,
    filename: '[name].js'
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'example/index.html',
      inject: 'body'
    })
  ],

  resolve: {
    alias: {
      formatron: path.resolve(__dirname, 'src'),
      react: path.resolve(__dirname, 'node_modules', 'react'),
      'react-dom': path.resolve(__dirname, 'node_modules', 'react-dom'),
    },
    extensions: ['.js', '.jsx'],
  }
});

module.exports = function(env) {
  if (env && env.prod) {
    return prodConfig;
  }
  return [exampleConfig];
};
