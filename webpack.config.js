var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin'); //css单独打包
var HtmlWebpackPlugin = require('html-webpack-plugin'); //生成html
var paths = require('path');

var publicPath = '/dist/'; //服务器路径
var path = paths.resolve(__dirname, '/dist/');
var plugins = [];

if (process.env.NODE_ENV === 'production') { // 生产环境
  require('raf').polyfill(global);
  path = paths.resolve(__dirname, './dist/');
  publicPath = './dist/';
  module.exports.devtool = '#source-map';
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: 'production',
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
  ]);
}
plugins.push(new ExtractTextPlugin({
  filename: 'build.css'
})); //css单独打包

plugins.push(new HtmlWebpackPlugin({  // 根据模板插入css/js等生成最终HTML
  filename: './index.html', // 生成的html存放路径，相对于 path
  hash: true, // 为静态资源生成hash值
}));

module.exports = {
  entry: {
    app: './src/App', //编译的入口文件
  },
  output: {
    publicPath, //编译好的文件，在服务器的路径
    path, //编译到当前目录
    filename: 'build.js' //编译后的文件名字
  },
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /^node_modules$/,
        use: [{
          loader: "babel-loader",
          options: {
            presets: [
              'es2015',
              "react",
              "stage-0",
              "stage-1", // 支持es7类定义静态属性
              "stage-2",
              "stage-3",
            ],
            compact: 'false',
            plugins: [
              [
                'syntax-dynamic-import',
                "transform-runtime", {
                  "polyfill": false,
                  "regenerator": true
                },
                'syntax-async-functions',
                'syntax-decorators',
              ],
              ["import", {
                libraryName: "antd-mobile",
                style: "css"
              }]
            ]
          }
        }]
      },
      /* 避免编译后antd-mobile样式失效 */
      {
        test: /\.css$/,
        loader: 'css?sourceMap&modules&localIdentName=[local]___[hash:base64:5]!!',
        exclude: /node_modules/
      },
      {
        test: /\.css$/, 
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!autoprefixer-loader!less-loader'
        })
      },
      {
        test: /\.scss$/,
        exclude: /^node_modules$/,
        loaders: ["style-loader", "css-loader?modules&localIdentName=[name]__[local]-[hash:base64:5]", "sass-loader"]
        // modules使样式作用范围为局部。name为文件名，local为所在文件夹名，hash为哈希值。
      },
      {
        test: /\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,
        exclude: /^node_modules$/,
        use: [{
          loader: "file-loader",
          options: {
            name: '[name].[ext]'
          }
        }]
        // loader: 'file-loader?name=[name].[ext]'
      },
      {
        test: /\.(png|jpg)$/,
        exclude: /^node_modules$/,
        use: [{
          loader: "url-loader",
          options: {
            limit: 20000,
            name: '[name].[ext]'
          }
        }]
        // loader: 'url?limit=20000&name=[name].[ext]' //注意后面那个limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图片
      },
      {
        test: /\.jsx$/,
        exclude: /^node_modules$/,
        use: [{
          loader: "babel-loader",
          options: {
            presets: [
              "es2015",
              "react",
              "stage-0",
              "stage-1", // 支持es7类定义静态属性
              "stage-2",
              "stage-3",
            ],
            plugins: ['syntax-dynamic-import']
          }
        }]
        // loaders: ['jsx', 'babel?presets[]=es2015,presets[]=react']
      }
    ]
  },
  plugins,
  resolve: {
    extensions: ['.js', '.jsx'], //后缀名自动补全
  },
  devtool: '#eval-source-map',
  devServer: {
    historyApiFallback: true, //不跳转
    inline: true //实时刷新
  }
};