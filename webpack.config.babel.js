import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import {NoEmitOnErrorsPlugin} from 'webpack';

const entryPath = path.join(__dirname, 'example/app.jsx')
const outputPath = path.join(__dirname, 'dist')

// We will probably want to make separate configs for dev and prod, but for
// now, this fits our needs.
function buildConfig(config) {
  return {
    entry: [
      entryPath
    ],

    output: {
      path: outputPath,
      filename: '[name].js',
    },

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
            ]
          ]
        }
      }, {
        test: /\.sass$/,
        exclude: /node_modules/,
        loader: 'style-loader!css-loader!sass-loader'
      }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }, {
        test: /\.(woff|ttf|eot|svg|png|jpg)$/,
        loader: 'url-loader'
      }],
      noParse: [
        /[\/\\]libphonenumber\.js$/
      ]
    },

    resolve: {
      extensions: ['.js', '.jsx']
    },

    plugins: [
      new NoEmitOnErrorsPlugin(),
      new HtmlWebpackPlugin({
        template: 'example/index.html',
        inject: 'body'
      })
    ],

    watchOptions: {
      poll: 1000
    },

    ...config
  };
}

module.exports = function(env) {
  if (env && env.prod) {
    return buildConfig({
      externals: {
        react: {
          commonjs: 'react',
          commonjs2: 'react',
          amd: 'react',
          root: 'React'
        }
      }
    });
  }
  return buildConfig({});
};

