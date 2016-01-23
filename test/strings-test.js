'use strict'
/* global describe it */
var is = global.is || require('exam-is')
var Cute = require('../cute')

describe('Cute', function () {
  describe('.lower', function () {
    it('converts a string to lowercase', function () {
      is(Cute.lower('Hello'), 'hello')
    })
  })

  // TODO: Test everything!
})
