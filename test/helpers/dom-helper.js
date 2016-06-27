'use strict'
var jsdom = require('jsdom')

module.exports = function domHelper (html, fn) {
  jsdom.env(html, ['../../cute.js'], function (error, window) {
    if (error) {
      throw error
    }
    global.window = window
    global.document = window.document
    global.location = window.location
    fn()
  })
}
