const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const htmlPluginsArray = [];
const glob = require('glob');
const webpack = require('webpack');

const buildPath = path.resolve(__dirname, 'dist');

/**
 * @method getEntry 获取处理入口配置和HtmlWebpackPlugin实例
 * @return entry 入口配置
 */
function getEntry() {
  const entry = {};
  // 读取src目录所有page入口
  glob.sync('./src/pages/*/main.js')
    .forEach(function(filePath) {
      let name = filePath.match(/\/pages\/(.+)\/main.js/);
      name = name[1];
      entry[name] = filePath;
      // 动态添加HtmlWebpackPlugin实例
      htmlPluginsArray.push(new HtmlWebpackPlugin({
        filename: `${name}.html`,
        inject: true,
        template: `./src/pages/${name}/index.html`,
        chunks: [name]
      }));
    });

    return entry;
}

module.exports = {

  // https://webpack.js.org/configuration/mode/
  mode: 'production',

  // This option controls if and how source maps are generated.
  // https://webpack.js.org/configuration/devtool/
  devtool: 'source-map',

  // https://webpack.js.org/concepts/entry-points/#multi-page-application
  entry: getEntry(),

  // https://webpack.docschina.org/configuration/resolve/#resolvealias
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components/'),
      images: path.resolve(__dirname, 'src/images/'),
      css: path.resolve(__dirname, 'src/css/')
    },
  },

  // how to write the compiled files to disk
  // https://webpack.js.org/concepts/output/
  output: {
    filename: '[name].[contenthash:8].js',
    path: buildPath,
    assetModuleFilename: 'images/[hash][ext][query]',
    clean: true
  },

  // https://webpack.js.org/concepts/loaders/
  module: {
    rules: [
      {
        // https://webpack.js.org/loaders/babel-loader/#root
        test: /\.m?js$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        // https://webpack.js.org/loaders/css-loader/#root
        test: /\.(s[ac]ss|css)$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        // https://webpack.js.org/guides/asset-modules/#resource-assets
        test: /\.(png|jpe?g|gif|svg)$/i,
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

  // https://webpack.js.org/concepts/plugins/
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[id].[contenthash:8].css'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery'
    })
  ].concat(htmlPluginsArray),

  // https://webpack.js.org/configuration/optimization/
  optimization: {
    runtimeChunk: 'single',
    minimize: true,
    minimizer: [
      // https://webpack.js.org/plugins/terser-webpack-plugin/
      new TerserPlugin({
        parallel: true
      }),
      // https://webpack.js.org/plugins/mini-css-extract-plugin/#minimizing-for-production
      new CssMinimizerPlugin()
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        }
      },
    },
  }
}
