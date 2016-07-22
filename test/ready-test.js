'use strict'

// var is = global.is || require('exam-is')
var dom = require('./helpers/dom-helper')
var Cute = require('../cute.test')

describe('Cute', function () {
  describe('.ready', function () {
    it('runs a function when the DOM is loaded', function (done) {
      dom('<p></p>', function () {
        document.readyState = 'waiting'
        Cute.ready(document, done)
        document.readyState = 'complete'
        Cute.emit(document, 'DOMContentLoaded')
      })
    })

    it('defaults to using the document', function (done) {
      dom('<p></p>', function () {
        Cute.ready(done)
        Cute.emit(document, 'DOMContentLoaded')
      })
    })

    it('only runs once', function (done) {
      dom('<p></p>', function () {
        Cute.ready(done)
        Cute.emit(document, 'DOMContentLoaded')
        Cute.emit(document, 'readystatechange')
      })
    })

    it('only runs if the element is truly ready', function (done) {
      dom('<p></p>', function () {
        var p = Cute.one('p')
        p.testReady = false
        Cute.ready(p, function () {
          p.testReady = true
        })
        Cute.emit(p, 'readystatechange')
        is(p.testReady, false)
        p.readyState = 'complete'
        Cute.emit(p, 'readystatechange')
        is(p.testReady, true)
        done()
      })
    })
  })
})
