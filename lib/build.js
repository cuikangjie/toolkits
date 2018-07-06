const webpack = require('webpack');

/**
 * webpack 打包
 * @param  {[type]} config   [webpack.config]
 * @param  {[type]} callBack [回调]
 * @return {[type]}          [description]
 */

function build(config,callBack) {
  return new Promise((resolve, reject) => {

    let compiler = webpack(config);

    compiler.plugin('done', (stats) => {
      process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }) + '\n\n')
      callBack && callBack()
    });

    compiler.run((err, stats) => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}

module.exports = build
