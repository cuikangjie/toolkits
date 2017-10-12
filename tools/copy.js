const path = require('path') ;
const { writeFile, copyFile, makeDir, copyDir, cleanDir } = require('./lib/fs')
const  pkg = require('../package.json') ;
const format = require('./lib/format.js')

async function copy() {

  console.log(`${format(new Date())}  start copy`);

  await Promise.all([
    writeFile('build/package.json', JSON.stringify({
      private: true,
      engines: pkg.engines,
      name: pkg.name,
      dependencies:  pkg.dependencies,
      scripts: {
        start: 'node ./start.js && pm2 list',
      },
    }, null, 2)),

    copyFile('yarn.lock', 'build/yarn.lock'),
  ]);

  
  console.log(`${format(new Date())}  Finished copy`);
}

copy();
