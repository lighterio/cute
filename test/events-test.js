'use strict'

var is = global.is || require('exam/lib/is')
var mock = global.mock || require('exam-mock')
// var unmock = mock.unmock
var dom = require('./helpers/dom-helper')
var Cute = require('../cute.test')

describe('Cute', function () {
  describe('.on', function (done) {
    dom('<a id="yes" href="#">Yes</a><a id="no" href="#">No</a>', function () {
      it('binds a handler to an element', function (done) {
        var link = Cute.id('yes')
        var handle = function (link) {
          is(link.id, 'yes')
          setTimeout(function () {
            Cute.off('click', handle)
            done()
          }, 1)
        }
        Cute.on(link, 'click', handle)
        link.click()
      })

      it('binds a handler to a selector', function (done) {
        var link = Cute.id('yes')
        var handle = function (link) {
          is(link.id, 'yes')
          setTimeout(function () {
            Cute.off('click', handle)
            done()
          }, 1)
        }
        Cute.on('a', 'click', handle)
        link.click()
      })

      it('binds to the document by default', function (done) {
        var link = Cute.id('yes')
        var handle = function (link) {
          is(link.id, 'yes')
          setTimeout(function () {
            Cute.off('click', handle)
            done()
          }, 1)
        }
        Cute.on('click', handle)
        link.click()
      })

      it('binds using any method available', function () {
        var a = {addEventListener: mock.args()}
        var b = {attachEvent: mock.args()}
        var c = {}
        var f = function () {}

        Cute.on(a, 'load', f)
        delete Cute._handlers.load

        Cute.on(b, 'load', f)
        delete Cute._handlers.load

        Cute.on(c, 'load', f)
        delete Cute._handlers.load

        is.same(a.addEventListener.value, [{0: 'load', 1: Cute._propagate}])
        is.same(b.attachEvent.value, [{0: 'onload', 1: Cute._propagate}])
        is(c.onload, Cute._propagate)
      })
      done()
    })
  })

  describe('.once', function (done) {
    dom('<a id="yes" href="#">Yes</a><a id="no" href="#">No</a>', function () {
      it('binds a handler to a selector', function (done) {
        var calls = 0
        var link = Cute.id('yes')
        var handle = function (link) {
          is(link.id, 'yes')
          calls++
        }
        Cute.once('a', 'click', handle)
        Cute.emit(link, 'click')
        Cute.emit(link, 'click')
        Cute.off('click', handle)
        is(calls, 1)
        done()
      })
      done()
    })
  })

  describe('._propagate', function () {
    it('works with window.event if an event is not passed', function () {
      global.window.event = {
        type: 'load'
      }
      Cute._propagate()
    })
  })

  describe('.prevent', function () {
    it('prevents the default action of an event', function () {
      var prevented = false
      Cute.prevent({
        preventDefault: function () {
          prevented = true
        }
      })
      is(prevented, true)
    })
  })

  describe('.stop', function (done) {
    dom('<a id="yes" href="#">Yes</a>', function () {
      it('stops an event from propagating', function () {
        var calls = 0
        var link = Cute.id('yes')
        var handle = function (link, event, type) {
          is(type, 'click')
          Cute.stop(event)
          calls++
        }
        Cute.on('a', 'click', handle)
        Cute.on('click', handle)
        Cute.emit(link, 'click')
        is(calls, 1)
        Cute.off('click', handle)
      })
      done()
    })
  })

  describe('.focus', function () {
    it('calls an element\'s focus method', function () {
      var element = {
        focus: mock.count()
      }
      Cute.focus(element)
      is(element.focus.value, 1)
    })
  })
})
