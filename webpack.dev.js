const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const glob = require("glob");
const webpack = require('webpack');
// 存储HtmlWebpackPlugin多实例
const htmlPluginArray= [];

/**
 * @method getEntry 获取处理入口配置和HtmlWebpackPlugin实例
 * @returns webpack entry
 */
function getEntry() {
  const entry = {};
  // 读取src目录所有page入口
  glob.sync('./src/pages/*/main.js')
      .forEach(function (filePath) {
          let name = filePath.match(/\/pages\/(.+)\/main.js/);
          name = name[1];
          entry[name] = filePath;
          // 处理HtmlWebpackPlugin实例
          htmlPluginArray.push(new HtmlWebpackPlugin({
            filename: `${name}.html`,
            inject: true,
            template: `./src/pages/${name}/index.html`,
            chunks: [name],
          }))
      });

  return entry;
};

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',

  // https://webpack.docschina.org/configuration/entry-context/#entry
  entry: getEntry(),

  // https://webpack.docschina.org/configuration/resolve/#resolvealias
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components/'),
      images: path.resolve(__dirname, 'src/images/'),
      css: path.resolve(__dirname, 'src/css/')
    },
  },

  // https://webpack.docschina.org/configuration/dev-server/
  devServer: {
    port: 8080,
    open: true
  },

  // https://webpack.docschina.org/concepts/loaders/
  module: {
    rules: [
      {
        test: /\.m?js$/i,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
         }
        }
      },
      {
        test: /\.(s[ac]ss|css)$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpg|jpeg|svg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: '/\.(woff|woff2|eot|ttf|otf)$/i',
        type: 'asset/resource'
      },
      {
        // https://webpack.js.org/guides/asset-modules/#replacing-inline-loader-syntax
        resourceQuery: /raw/,
        type: 'asset/source'
      },
      {
        // https://webpack.js.org/loaders/html-loader/#usage
        resourceQuery: /template/,
        loader: 'html-loader'
      }
    ]
  },

  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery'
    })
  ].concat(htmlPluginArray)
}
