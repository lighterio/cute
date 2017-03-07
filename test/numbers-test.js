'use strict'

var is = global.is || require('exam/lib/is')
var Cute = require('../require')

describe('Cute', function () {
  describe('.number', function () {
    it('returns a number no matter what', function () {
      is(Cute.number(0), 0)
      is(Cute.number(null), 0)
      is(Cute.number(undefined), 0)
      is(Cute.number(''), 0)
      is(Cute.number('one'), 0)
      is(Cute.number(false), 0)
      is(Cute.number(true), 1)
      is(Cute.number(123), 123)
      is(Cute.number('123'), 123)
      is(Cute.number(1.23), 1.23)
      is(Cute.number(-123), -123)
    })
  })

  describe('.repeat', function () {
    it('returns a repeated string', function () {
      is(Cute.repeat('x', 3), 'xxx')
    })
  })

  describe('.pad', function () {
    it('zero-pads numbers', function () {
      is(Cute.pad(0, 3), '000')
      is(Cute.pad(123, 3), '123')
      is(Cute.pad(1234, 3), '1234')
    })

    it('space-pads strings', function () {
      is(Cute.pad('ok', 4), 'ok  ')
    })
  })
})
