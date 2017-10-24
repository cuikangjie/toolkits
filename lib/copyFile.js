const fs = require('fs')
/**
 * copy 文件
 * @param  {[type]} source [指定文件]
 * @param  {[type]} target [目标路径]
 * @return {[type]}        [description]
 */
const copyFile = (source, target) => new Promise((resolve, reject) => {
  let cbCalled = false;

  function done(err) {
    if (!cbCalled) {
      cbCalled = true;
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    }
  }

  const rd = fs.createReadStream(source);
  rd.on('error', err => done(err));
  const wr = fs.createWriteStream(target);
  wr.on('error', err => done(err));
  wr.on('close', err => done(err));
  rd.pipe(wr);
});
module.exports = copyFile
