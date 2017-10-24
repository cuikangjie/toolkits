const fs = require('fs')
/**
 * 写入文件
 * @param  {[type]} file     [description]
 * @param  {[type]} contents [description]
 * @return {[type]}          [description]
 */
const writeFile = (file, contents) => new Promise((resolve, reject) => {
  fs.writeFile(file, contents, 'utf8', err => (err ? reject(err) : resolve()));
});

module.exports = writeFile
