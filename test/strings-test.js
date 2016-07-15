'use strict'

var is = global.is || require('exam-is')
var Cute = require('../cute.test')

describe('Cute', function () {
  describe('.lower', function () {
    it('converts a string to lowercase', function () {
      is(Cute.lower('Hello'), 'hello')
    })
  })

  // TODO: Test everything!
})
