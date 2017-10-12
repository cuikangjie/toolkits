const pkg = require('../package.json')

/**
 * pm2 配置文件
 * @type {Object}
 */
module.exports = {
  "name"        : pkg.name,
  "script"      : "./app.js",
  "watch"       : false,
  "output ":"./logs/out.log",
  "env": {
      "NODE_ENV": "production"
  }
}
