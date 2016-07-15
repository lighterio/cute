'use strict'

var is = global.is || require('exam-is')
var Cute = require('../cute.test')

describe('Cute', function () {
  describe('.colors', function () {
    it('returns an array of colors', function () {
      var colors = Cute.colors()
      is.array(colors)
    })

    it('returns from cache the 2nd time', function () {
      var cached = Cute.colors()
      var colors = Cute.colors()
      is(colors, cached)
    })
  })
})
