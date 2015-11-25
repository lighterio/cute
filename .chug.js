var chug = require('chug')
var figlet = require('figlet')
var pkg = require('./package')
var dir = __dirname

figlet.text('Cute v' + pkg.version, {font: 'Small'}, function (e, art) {
  var pattern = /^.*\/(projects|workspace|node_modules|lighterio)\/([\d\w-_]+)\//i
  var url = 'https://github.com/lighterio/$2/blob/master/'
  var urls = []

  // Concatenate and output all non-plugin scripts.
  chug('scripts')
    .each(function (asset) {
      asset.setContent(asset.getContent() + '\n')
      urls.push(asset.location.replace(pattern, url))
    })
    .concat()
    .each(function (asset) {
      asset.setContent(
        '/**' + art.replace(/ +$/, '').replace(/ *\n/g, '\n * ') + '\n' +
        ' * http://lighter.io/cute\n' +
        ' *\n' +
        ' * Source:\n' +
        ' *   ' + urls.join('\n *   ') + '\n' +
        ' */\n\n' +
        'var Cute = {version: \'' + pkg.version + '\'}\n\n' +
        '/* istanbul ignore next */\n' +
        '// +env:commonjs\n' +
        'if (typeof exports === \'object\') {\n' +
        '  module.exports = Cute\n' +
        '}\n' +
        '// -env:commonjs\n' +
        '// +env:amd\n' +
        'else if (typeof define === \'function\' && define.amd) {\n' +
        '  define(function () {\n' +
        '    return Cute\n' +
        '  });\n' +
        '}\n' +
        '// -env:amd\n' +
        'else {\n' +
        '  this.Cute = Cute\n' +
        '}\n' +
        '// -env:window\n\n' +
        asset.getContent())
    })
    .replace(/\/\/ (\+|-)/g, '//$1')
    .each(function (asset) {
      var content = asset.getContent()
      write(asset, content, 'ok', 'cute.js')
      write(asset, content, 'old', 'cute.compat.js')
    })
})

function write (asset, content, browser, file) {
  asset.setContent(content)
  asset
    .cull('browser', browser)
    .replace(/ +\n/g, '\n')
    .write(dir, file)
}
