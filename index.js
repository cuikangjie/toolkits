// tool  webpack
const build = require('./lib/build')
const watch = require('./lib/watch')
const cleanFile = require('./lib/cleanFile')
const copyFile = require('./lib/copyFile')
const format = require('./lib/formatTime')

module.exports = {
  tools:{
    build,
    watch,
    format,
    cleanFile
  }
}
