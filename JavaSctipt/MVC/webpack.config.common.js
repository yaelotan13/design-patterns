const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  node: {
    fs: 'empty',
  },
  entry: {
    login: './src/login/js/login.js',
    feed: ['./src/feed/js/utils/i18n.js', './src/feed/js/psql-blog/driver.js'],
  },
  output: {
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.html$/,
        loader: 'raw-loader',
      },
      {
        test: /\.(pdf|gif|png|jpe?g|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'static/',
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/',
          },
        }],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      hash: true,
      template: path.resolve(__dirname, 'src/', 'index.html'),
      chunks: ['login'],
      filename: 'index.html',
    }),
    new HTMLWebpackPlugin({
      hash: true,
      template: path.resolve(__dirname, 'src/feed', 'index.html'),
      chunks: ['feed'],
      filename: 'feed/index.html',
    }),
    new CopyWebpackPlugin([
      {
        from: './src/feed/user-uploads/',
        to: 'user-uploads/',
      },
    ]),
  ],
  stats: {
    colors: true,
  },
  devtool: 'source-map',
};
