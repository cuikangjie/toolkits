var pm2 = require('pm2');
const config = require(`./config`)

/**
 * 启动pm2
 * @param  {[type]} err [description]
 * @return {[type]}     [description]
 */
pm2.connect(function(err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }
  pm2.start(config, function(err, apps) {
    pm2.disconnect();
    if (err) throw err
  });
});
