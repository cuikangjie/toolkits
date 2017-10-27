// tool  webpack
const build = require('./lib/build')
const watch = require('./lib/watch')
const cleanFile = require('./lib/cleanFile')
const copyFile = require('./lib/copyFile')
const format = require('./lib/formatTime')
const mkdir = require('./lib/mkdir')
const writeFile = require('./lib/writeFile')
const nodeStart = require('./pm2/index')
const server = require('./lib/server')
module.exports = {
  tools:{
    build,
    watch,
    server,
    format,
    cleanFile,
    copyFile,
    writeFile,
    mkdir,
    nodeStart
  }
}
