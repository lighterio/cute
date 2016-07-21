'use strict'

var is = global.is || require('exam-is')
var dom = require('./helpers/dom-helper')
var Cute = require('../cute.test')
var http = require('http')
var port = 65284

http.createServer(function (request, response) {
  response.setHeader('Content-type', 'text/javascript')
  response.end('window.ok = true')
  alert('ok')
}).listen(port)

describe('Cute', function (done) {
  dom('<html><head><title>Title</title><body>Body</body></html>', function () {
    describe('.head', function () {
      it('gets the <head> tag', function () {
        var head = Cute.head()
        is(head.tagName, 'HEAD')
      })
    })

    describe('.body', function () {
      it('gets the <body> tag', function () {
        var body = Cute.body()
        is(body.tagName, 'BODY')
      })
    })

    describe('.js', function () {
      it('adds a <script> tag', function () {
        Cute.js('test.js')
        var script = Cute.one('script')
        is(script.tagName, 'SCRIPT')
        is(script.src, 'test.js')
        is(script.async, true)
        Cute.remove(script)
      })

      it('runs a ready function', function (done) {
        Cute.js('test.js', function () {
          Cute.one('script', Cute.remove)
          done()
        })
        Cute.one('script', function (script) {
          script.readyState = 'complete'
          Cute.emit(script, 'readystatechange')
        })
      })
    })

    describe('.css', function () {
      it('adds a <style> block', function () {
        Cute.css('body{margin:0}')
        var style = Cute.one('style')
        is(style.tagName, 'STYLE')
        is(style.innerHTML, 'body{margin:0}')
        Cute.remove(style)
      })

      it('populates the styleSheet property if it exists', function () {
        var sheet = {}
        mock(Cute, {
          add: function () {
            return {styleSheet: sheet}
          }
        })
        Cute.css('body{margin:0}')
        is(sheet.cssText, 'body{margin:0}')
        unmock(Cute)
      })
    })

    describe('.zoom', function () {
      it('defaults to no zooming', function () {
        var css = Cute.zoom('body{margin:2px}')
        is(css, 'body{margin:2px}')
      })

      it('changes CSS pixel sizes', function () {
        window._zoom = 2
        var css = Cute.zoom('body{margin:2px;width:800px}')
        is(css, 'body{margin:4px;width:1600px}')
      })
    })
    done()
  })
})
