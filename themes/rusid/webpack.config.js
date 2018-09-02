const webpack = require('webpack'); //to access built-in plugins
const path = require('path');

// Webpack plugins
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

// Настройка для SVGO-loader
let svgoConfig = JSON.stringify({
  plugins: [{
    removeTitle: true
  }, {
    removeUselessStrokeAndFill: true
  }, {
    removeAttrs: {
      attrs: '(stroke|fill)'
    },
  }, {
    convertColors: {
      shorthex: false
    }
  }, {
    convertPathData: true
  }]
});

module.exports = {
  
  context: path.join(__dirname, "src"),

  entry: {
      commons: './commons'
  },

  output: {
    path: path.join(__dirname, "source", "assets"),
    filename: 'js/[name].js'
  },

  module: {
    rules: [
      { // Javascript
        test: /\.js$/,
        include: [
          path.join(__dirname, "src"),
          path.join(__dirname, "node_modules", "svg-sprite-loader", "lib", "plugin.js")
        ],
        use: "babel-loader"
      },
      {
        test: /\.(sc|sa|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: '../'
            }
          },
          {
            loader: 'css-loader',
            options: {
              // modules: true
            }
          },
          { loader: 'sass-loader' }
        ]
      },
      { // Картинки 
        test: /\.(png|jpg|svg|gif)$/,
        exclude: [
          path.join(__dirname, "src", "icons"),
          path.join(__dirname, "src", "images", "favicons")
        ],
        use: [
          'file-loader?name=images/[name].[ext]',
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75
              }
            }
          },
        ],
      },
      { // Копируем шрифты
        test: /\.(ttf|eot|woff|woff2)$/,
        use: 'file?name=assets/fonts/[path][name].[ext]'
      }, {
        test: /\.svg$/,
        include: path.join(__dirname, "src", "icons"),
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              spriteFilename: 'icons/icons-sprite.svg'
            }

          }, {
            loader: 'svgo-loader?' + svgoConfig
          }
        ]
      },
      {
        test: /\.(png|xml|ico)$/,
        include: path.join(__dirname, "src", "images", "favicons"),
        loader: 'file-loader?name=images/favicons/[name].[ext]'
      },
      {
        test: /\.json$/,
        include: path.join(__dirname, "src", "images", "favicons"),
        loader: 'file-loader?name=images/favicons/[name].[ext]|raw-loader'
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorOptions: { discardComments: { removeAll: true } },
      })
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      // NODE_ENV: JSON.stringify(NODE_ENV),
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default'],
      // In case you imported plugins individually, you must also require them here:
      Util: "exports-loader?Util!bootstrap/js/dist/util",
      Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
      Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
      Button: "exports-loader?Button!bootstrap/js/dist/button",
      Carousel: "exports-loader?Carousel!bootstrap/js/dist/carousel",
      Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
      Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
      Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
      Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
      Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
      Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip"
  }),
    new webpack.ProgressPlugin(),
    new SpriteLoaderPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "css/[name].css",
      chunkFilename: "[id].css"
    })
  ]
};