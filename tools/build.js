const webpack = require('webpack');
const {
  nodeConfig,
  serverConfig,
  clientConfig
} = require('./webpack.config');

const format = require('./lib/format.js')

function build(config) {
  return new Promise((resolve, reject) => {
    let compiler = new webpack(config);

    const callback = (err, stats) => {
      if (err) {
        reject(err)
      }
      process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }) + '\n\n')
      resolve()
    };

    compiler.run(callback)
  })
}

async function run(){
  console.log(`${format(new Date())}  start build \n`);

  await build(serverConfig).then(() => {
    console.log('server build success ! \n\n');
  }).catch((err) => {
    console.log('server',err);
  })

  await build(clientConfig).then(() => {
    console.log('client build success !\n\n');
  }).catch((err) => {
    console.log('client',err);
  })

  await build(nodeConfig).then(() => {
    console.log('node build success !\n');
  }).catch((err) => {
    console.log('node',err);
  })

  console.log(`${format(new Date())}  Finished build`);
}

run()
