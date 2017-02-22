'use strict'

var is = global.is || require('exam/lib/is')
var Cute = require('../cute.test')

describe('Cute', function () {
  describe('.wait', function () {
    var o = {}

    it('sets a timeout', function (done) {
      Cute.wait(o, 't', function () {
        done()
      }, 1)
    })

    it('resets a timeout', function (done) {
      Cute.wait(o, 'r', Cute.no)
      Cute.wait(o, 'r', function () {
        done()
      }, 1)
    })

    it('clears a timeout', function (done) {
      Cute.wait(o, 'c', done)
      Cute.wait(o, 'c')
      done()
    })

    it('sets an interval', function (done) {
      var n = 0
      Cute.wait(o, 'i', function () {
        if (++n === 3) {
          Cute.wait(o, 'i')
          done()
        }
      }, 1, 1)
    })
  })

  describe('.t', function () {
    it('gets milliseconds', function () {
      var t = Cute.t()
      is.number(t)
    })
  })

  describe('.start', function () {
    it('marks a start time', function () {
      Cute.start('label')
      is.number(Cute._times['label'])
    })
  })

  describe('.end', function () {
    it('marks an end time', function () {
      Cute.end('label')
      is.number(Cute._times['label'])
    })
  })

  describe('.logTimes', function () {
    it('logs times', function () {
      mock(Cute, {
        log: mock.count()
      })
      Cute.logTimes()
      is(Cute.log.value, 1)
      unmock(Cute)
    })
  })
})
