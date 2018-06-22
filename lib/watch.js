const webpack = require('webpack');
/**
 * webpack watching dev
 * @param  {[type]} config        [webpack.config]
 * @param  {[type]} callBack      [回调]
 * @param  {[type]} watchCallBack [watch回调 例如删除指定目录的文件]
 * @return {[type]}               [description]
 */
function run(config, callBack, watchCallBack) {
  return new Promise((resolve, reject) => {
    let compiler = webpack(config);

    let watching = compiler.watch({
      aggregateTimeout: 300,
      poll: 1000,
      ignored: ["node_modules", "*.md", "*.json", 'pm2', 'build/'],
    }, (err, stats) => {
      if (err) {
        console.log(err);
        reject(err)
      }
      resolve()
    });

    compiler.plugin("watch-run", function (compilation, next) {
      watchCallBack&&watchCallBack()
      next();
    });

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
  })
}

module.exports = run
