'use strict'

var is = global.is || require('exam/lib/is')
var jsdom = require('jsdom')
var Cute = require('../cute.test')
var http = require('http')
var port = 15492
var host = 'http://127.0.0.1:' + port

// Create the HTTP server that IO requests will go through.
var client
var server = http.createServer(function (request, response) {
  var url = request.url
  var method = request.method
  if (method === 'GET') {
    if (/=&/.test(url)) {
      response.setHeader('Content-Type', 'application/json')
      response.end('[["connect",{"id":"abc"},1]]')
    } else {
      client = response
    }
  } else {
    request.on('data', function (chunk) {
      response.setHeader('Content-Type', 'application/json')
      response.end('"OK"')
      client.setHeader('Content-Type', 'application/json')
      client.end('[["pong",{},2]]')
    })
  }
}).listen(port)

describe('Cute', function (done) {
  var base = Cute._ioBase
  var url = host + base
  Cute._ioUrl = url
  Cute._ioBase = url

  // Kill the HTTP server.
  after(function () {
    server.close()
  })

  var html = '<html><head></head><body></body></html>'
  jsdom.env(html, function (e, window) {
    domTests(window)
    done()
  })
})

function domTests (window) {
  global.window = window
  global.XMLHttpRequest = window.XMLHttpRequest
  global.location = window.location
  global.document = window.document

  describe('._ioFlush', function () {
    it('does nothing if nothing is queued', function (done) {
      mock(Cute, {
        get: function () {
          is.fail()
        }
      })
      Cute._ioFlush('ok', 123)
      unmock(Cute)
      setTimeout(done, 2)
    })
  })

  describe('.io', function () {
    it('connects', function (done) {
      Cute.io('connect', function (data) {
        is(data.id, 'abc')
        done()
      })
    })

    it('sends and receives', function (done) {
      Cute.io('pong', function () {
        done()
      })
      Cute._ioPoll()
      Cute.io('ping')
    })

    it('ignores repeat inits', function () {
      Cute.io()
    })

    it('supports retries', function (done) {
      Cute._ioRetryTimeout = 1
      var n = 0
      mock(Cute, {
        get: function (url, data, fn) {
          if (fn) {
            if (!n++) {
              fn('Server Error', 500)
            } else {
              fn('"OK"', 200)
              unmock(Cute)
              done()
            }
          }
        }
      })
      Cute.io('tryThis', true)
    })
  })

  describe('._ioInit', function () {
    it('listens for reload', function (done) {
      Cute.io()
      mock(window.location, {
        reload: function () {
          unmock(window.location)
          done()
        }
      })
      Cute.emit(window, 'io:reload')
    })

    it('binds to beforeunload', function (done) {
      Cute.io()
      mock(Cute, {
        io: function (name) {
          is(name, 'unload')
          unmock(Cute)
          done()
        }
      })
      Cute.emit(window, 'beforeunload')
    })
  })

  describe('._ioPoll', function () {
    it('supports retries', function (done) {
      Cute._ioRetryTimeout = 1
      var n = 0
      mock(Cute, {
        get: function (url, fn) {
          if (!n++) {
            fn('Server Error', 500)
          } else {
            fn('"OK"', 200)
            unmock(Cute)
            done()
          }
        }
      })
      Cute._ioPoll()
    })
  })
}
