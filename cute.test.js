var fs = require('fs')

var Cute = global.Cute = exports
Cute.version = '0.0.1'

fs.readdirSync('scripts').forEach(function (name) {
  require('./scripts/' + name)
})
