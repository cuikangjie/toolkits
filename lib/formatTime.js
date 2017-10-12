/**
 * 时间格式
 * @param  {[type]} time [description]
 * @return {[type]}      [ 时分秒]
 */
module.exports = function(time) {
  return time.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
}
