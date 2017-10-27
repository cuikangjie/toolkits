var path = require('path')
var express = require('express')
var webpack = require('webpack')

function server(option) {

  if(!option.config){
    console.log('webpack config is null !');
    return {}
  }
  var port = option.port || 8000
  var app = express()
  var compiler = webpack(option.config)

  var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: option.config.output.publicPath || '/',
    quiet: true
  })

  var hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: () => {}
  })

  compiler.plugin('done', (stats) => {
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')
    console.log('server  rebuild');
  });

  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
      console.log();
      hotMiddleware.publish({ action: 'reload' })
      cb()
    })
  })

  app.use(require('connect-history-api-fallback')())

  app.use(devMiddleware)

  app.use(hotMiddleware)

  var uri = 'http://localhost:' + port

  console.log('> Starting dev server...')
  devMiddleware.waitUntilValid(() => {
    console.log('> Listening at ' + uri + '\n')
  })

  return {
    app,
    start: () =>{
      return app.listen(port)
    }
  }
}

module.exports = server
