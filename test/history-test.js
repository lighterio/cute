'use strict'

var is = global.is || require('exam-is')
var mock = global.mock || require('exam-mock')
var unmock = mock.unmock
var dom = require('./helpers/dom-helper')
var Cute = require('../cute.test')

describe('Cute', function () {
  describe('.go', function (done) {
    dom('<main id="content"/>', function () {
      var history = window.history

      before(function () {
        mock(history, {
          back: mock.count(),
          forward: mock.count(),
          pushState: mock.args(),
          replaceState: mock.args()
        })
      })

      after(function () {
        unmock(history)
      })

      it('goes back when the "href" is -1', function () {
        is(history.back.value, 0)
        Cute.go(-1)
        is(history.back.value, 1)
      })

      it('goes forward when the "href" is 1', function () {
        is(history.forward.value, 0)
        Cute.go(1)
        is(history.forward.value, 1)
      })

      it('pushes a new location', function () {
        is(history.pushState.value.length, 0)
        Cute.go('/test')
        is(history.pushState.value[0][2], '/test')
      })

      it('replaces the location if `inPlace` is truthy', function () {
        is(history.replaceState.value.length, 0)
        Cute.go('/test', 1)
        is(history.replaceState.value[0][2], '/test')
      })
      done()
    })
  })
})
