const webpack = require('webpack');
const path = require('path')
const glob = require('glob')
const nodeExternals = require('webpack-node-externals')
const vueConfig = require('./vue-loader.config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const merge = require('webpack-merge')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
const CopyWebpackPlugin = require('copy-webpack-plugin')


let isProd = false
if (process.argv.includes('--release')) {
  isProd = true
}

const resolve = file => path.resolve(__dirname, file)

const base = {
  devtool: isProd ?
    false :
    '#cheap-module-source-map',
  output: {
    path: resolve('../build/chunks'),
    publicPath: '/chunks/',
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js'
  },
  resolve: {
    alias: {
      'public': resolve('../public')
    }
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.css$/,
        use: isProd ?
          ExtractTextPlugin.extract({
            use: 'css-loader?minimize',
            fallback: 'vue-style-loader'
          }) :
          ['vue-style-loader', 'css-loader']
      }
    ]
  },
  performance: {
    maxEntrypointSize: 300000,
    hints: isProd ? 'warning' : false
  },
  plugins: isProd ?
    [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          drop_debugger: true,
          drop_console: true
        }
      }),
      new ExtractTextPlugin({
        filename: 'common.[chunkhash].css'
      })
    ] :
    [
      // new FriendlyErrorsPlugin()
    ]
}

// vue client
const clientConfig = merge(base, {
  entry: {
    app: resolve('../src/views/client.js')
  },
  resolve: {
    alias: {}
  },
  plugins: [
    // strip dev-only code in Vue source
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': !isProd ? '"development"' : '"production"',
      '__isClient__': true
    }),
    // extract vendor chunks for better caching
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        // a module is extracted into the vendor chunk if...
        return (
          // it's inside node_modules
          /node_modules/.test(module.context) &&
          // and not a CSS file (due to extract-text-webpack-plugin limitation)
          !/\.css$/.test(module.request)
        )
      }
    }),
    // extract webpack runtime & manifest to avoid vendor chunk hash changing
    // on every build.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    }),
    new VueSSRClientPlugin({
      filename: 'client.json'
    }),
    // ... isProd ? [new BundleAnalyzerPlugin()] : []
  ]
})


// vue server
const serverConfig = merge(base, {
  target: 'node',
  devtool: '#source-map',
  entry: resolve('../src/views/server.js'),
  output: {
    path: resolve('../build/server'),
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  },

  resolve: {
    alias: {

    }
  },
  externals: nodeExternals({
    // do not externalize CSS files in case we need to import it from a dep
    whitelist: /\.css$/
  }),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': !isProd ? '"development"' : '"production"',
      '__DEV__': !isProd,
      '__isClient__': false
    }),
    new VueSSRServerPlugin({
      filename: 'server.json'
    })
  ]
})


// node
let nodeConfig = {
  entry: {
    app: ["babel-polyfill", path.resolve(__dirname, '../src/app.js')]
  },
  target: 'node',
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    modules: ['node_modules', 'src']
  },
 externals: ["./server/server.json", './chunks/client.json',nodeExternals({importType:'commonjs',whitelist:[]})],
  node: {
    console: true,
    global: true,
    process: true,
    Buffer: true,
    __filename: false,
    __dirname: false,
    setImmediate: true
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'stage-2']
      },
      exclude: /node_modules/
    }]
  },
  plugins: [
    ...(!isProd ? [] : [
      new webpack.optimize.UglifyJsPlugin(),
    ]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': !isProd ? '"development"' : '"production"',
      __DEV__: !isProd
    }),
    new CopyWebpackPlugin([{
            from: path.join(__dirname, "../src/template/index.html"),
            to: path.join(__dirname, "../build/template/index.html"),
            force: true

        }]),
  ]
};
if (isProd) {
  nodeConfig.entry.start = path.resolve(__dirname, '../pm2/index.js')
}
// console.log(nodeConfig);

module.exports = {
  nodeConfig,
  serverConfig,
  clientConfig
}
