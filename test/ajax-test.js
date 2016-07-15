'use strict'

var is = global.is || require('exam-is')
var jsdom = require('jsdom')
var Cute = require('../cute.test')
var http = require('http')
var port = 15478
var host = 'http://127.0.0.1:' + port

// Create the HTTP server that AJAX requests will go through.
var server = http.createServer(function (request, response) {
  var url = request.url
  var status = /error/.test(url) ? 500 : 200
  var data = '{"method":"' + request.method + '"}'
  response.writeHead(status, {'Content-Type': 'application/json'})
  response.end(data)
}).listen(port)

describe('Cute', function (done) {
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

  describe('.no', function () {
    it('causes no errors', function () {
      Cute.no()
    })
  })

  describe('._xhr', function () {
    it('returns an XMLHttpRequest object', function () {
      var request = Cute._xhr()
      is(request.constructor.name, 'XMLHttpRequest')
    })
  })

  describe('.upload', function () {
    it('returns an XMLHttpRequestUpload object', function () {
      var upload = Cute.upload()
      is(upload.constructor.name, 'XMLHttpRequestUpload')
    })
  })

  describe('.get', function () {
    it('gets JSON', function (done) {
      Cute.get(host + '/ok.json', function (json, status) {
        is(json.method, 'GET')
        is(status, 200)
        done()
      })
    })

    it('can post JSON', function (done) {
      Cute.get(host + '/post.json', {data: true}, function (json, status) {
        // TODO: Figure out why the response isn't parsing.
        is(json.method, 'POST')
        is(status, 200)
        done()
      })
    })

    it('can post a query string', function (done) {
      Cute.get(host + '/post.json', 'data=true', function (json, status) {
        is(json.method, 'POST')
        is(status, 200)
        done()
      })
    })

    it('can get an error', function (done) {
      Cute.get(host + '/error.json', function (json, status) {
        is(json.method, 'GET')
        is(status, 500)
        done()
      })
    })
  })
}
