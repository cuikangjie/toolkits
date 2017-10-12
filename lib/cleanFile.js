const rimraf = require('rimraf')

/**
 * 删除指定目录下的文件
 * @param  {[type]} pattern [目录]
 * @param  {[type]} ignore  [忽略的文件 数组格式]
 * @return {[type]}         [description]
 */

const clean = (pattern,ignore) =>{
  return new Promise((resolve,reject) =>{
    rimraf(pattern, {glob: {nosort: true,dot: true,ignore: ignore || []}}, (err, result) => {
      err ? reject(err) : resolve(result)
    })
  })
}
