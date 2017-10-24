const mkdirp = require('mkdirp')

/**
 * 创建文件夹
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
function mkdir(path) {
  return new Promise((resolve, reject) => {
    mkdirp(path, function (err) {
      if (err) reject()
      else resolve()
    });
  })
}

module.exports = mkdir
