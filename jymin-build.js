#!/usr/bin/env node

var dir = process.cwd();
var pkg = require(dir + '/package.json');
var version = pkg.version;
var key = pkg.name;
var title = key.replace(/^\w/, function (letter) {
  return letter.toUpperCase();
});

require('figlet').text(title + ' Client v' + version, {font: 'Standard'}, function (err, figlet) {

  figlet = figlet.replace(/\n/g, '\n *');

  var source = require('chug')([
    dir + '/node_modules/jymin/scripts',
    dir + '/scripts/' + key + '-jymin.js'
  ]);

  source.concat(key + '.js')
    .each(function (asset) {
      asset.setContent((
        "/**\n" +
        " *" + figlet + "\n" +
        " *\n" +
        " * http://lighter.io/" + key + "\n" +
        " */\n\n\n" +
        asset.getContent() + "\n").replace(/[\t ]*\n/g, '\n'));
    })
    .wrap()
    .write(dir, key + '-client.js')
    .replace(/Jymin\.([$_a-zA-Z0-9]+)(\s*=)?/g, function (match, name, equals) {
      return equals ? 'var ' + name + ' =' : name;
    })
    .minify()
    .write(dir, key + '-client.min.js', 'minified');

});
