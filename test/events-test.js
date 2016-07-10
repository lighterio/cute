'use strict'
/* global describe it */
var is = global.is || require('exam-is')
// var mock = global.mock || require('exam-mock')
// var unmock = mock.unmock
var dom = require('./helpers/dom-helper')
var Cute = require('../cute')

describe('Cute', function () {
  describe('.on', function (done) {
    dom('<a id="link" href="#">OK</a>', function () {
      it('binds a handler to an element', function (done) {
        var handle = function (link) {
          is(link.id, 'link')
          setTimeout(function () {
            Cute.off('click', handle)
            done()
          }, 1)
        }
        Cute.on('a', 'click', handle)
        Cute.id('link').click()
      })

      it('binds to the document by default', function (done) {
        var handle = function (link) {
          is(link.id, 'link')
          setTimeout(function () {
            Cute.off('click', handle)
            done()
          }, 1)
        }
        Cute.on('click', handle)
        Cute.id('link').click()
      })
      done()
    })
  })

  describe.skip('.once', function (done) {
    dom('<button>OK</button>', function () {
      it('binds a handler to be executed once', function (done) {
        var button = Cute.one('button')
        var calls = 0
        var handle = function () {
          calls++
        }
        Cute.once(button, 'click', handle)
        button.click()
        button.click()
        setTimeout(function () {
          is(calls, 1)
          done()
        }, 1)
      })
      done()
    })
  })
})
