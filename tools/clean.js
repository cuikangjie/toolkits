const { cleanDir } = require('./lib/fs');

const format = require('./lib/format.js')

async function clean() {
  console.log(`${format(new Date())}  start remove`);
  await Promise.all([
    cleanDir('build/*', {
      nosort: true,
      dot: true,
      ignore: ['build/.git'],
    }),
  ]);
  console.log(`${format(new Date())}  Finished remove`);
}

clean()
