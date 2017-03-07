'use strict'

var is = global.is || require('exam/lib/is')
var Cute = require('../require')

describe('Cute', function () {
  global.window = global.window || {console: {}}
  var console = window.console

  before(function () {
    mock(console, {
      error: mock.args(),
      warn: mock.args(),
      info: mock.args(),
      log: mock.args(),
      trace: mock.args()
    })
  })

  after(function () {
    unmock(console)
  })

  describe('.error', function () {
    it('calls console.error', function () {
      Cute.error('!')
      is.same(console.error.value, [{0: '!'}])
    })
  })

  describe('.warn', function () {
    it('calls console.warn', function () {
      Cute.warn('!')
      is.same(console.warn.value, [{0: '!'}])
    })
  })

  describe('.info', function () {
    it('calls console.info', function () {
      Cute.info('!')
      is.same(console.info.value, [{0: '!'}])
    })
  })

  describe('.log', function () {
    it('calls console.log', function () {
      Cute.log('!')
      is.same(console.log.value, [{0: '!'}])
    })
  })

  describe('.trace', function () {
    it('calls console.trace', function () {
      Cute.trace('!')
      is.same(console.trace.value, [{0: '!'}])
    })
  })
})
