const webpack = require('webpack');
const {
  nodeConfig,
  serverConfig,
  clientConfig
} = require('./webpack.config');
const path = require('path');
const cp = require('child_process')
const rimraf = require('rimraf')

const clean = (pattern) =>{
  return new Promise((resolve,reject) =>{
    rimraf(pattern, {glob: {nosort: true,dot: true,ignore: ['build/.git']}}, (err, result) => {
      err ? reject(err) : resolve(result)
    })
  })
}

// 启动服务
let server,flag = false;
// 回调重启服务
const restart = () => {
  if (server) {
    server.kill('SIGTERM');
  }
  server = cp.spawn('node', ['./build/app.js']);
  server.stdout.on('data', (data) => {
    const time = new Date().toTimeString();
    process.stdout.write(time.replace(/.*(\d{2}:\d{2}:\d{2}).*/, '[$1] '));
    process.stdout.write(data);
  });
  server.stderr.on('data', x => {
    process.stderr.write(x)
  });
}

process.on('exit', () => {
  if (server) {
    server.kill('SIGTERM');
  }
});


function watch(config, callBack, watchCallBack) {
  return new Promise((resolve, reject) => {
    let compiler = new webpack(config);

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

const run = async ()=>{
  await watch(clientConfig,()=>{
    console.log('build client success');
  },async ()=>{
    // 删除文件
    await clean('build/chunks/*')
  })
  await watch(serverConfig,()=>{
    console.log('build server success');
  })
  await watch(nodeConfig,()=>{
    flag = true
    console.log('build node success');
  })
}
clean('build/*').then((value) => {
  run()
})
