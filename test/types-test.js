'use strict'

var is = global.is || require('exam/lib/is')
var Cute = require('../require')

describe('Cute', function () {
  describe('.isBoolean', function () {
    it('returns true if the value is a boolean', function () {
      is(Cute.isBoolean(new Boolean()), true)
      is(Cute.isBoolean(true), true)
      is(Cute.isBoolean(false), true)
      is(Cute.isBoolean(1), false)
    })
  })
})
