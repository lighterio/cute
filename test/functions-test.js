'use strict'

var is = global.is || require('exam/lib/is')
var Cute = require('../cute.test')

describe('Cute', function () {
  describe('.apply', function () {
    var object = {
      exists: function () {
        return true
      }
    }

    it('calls a method on an object', function () {
      var ok = Cute.apply(object, 'exists')
      is(ok, true)
    })

    it('ignores undefined methods', function () {
      var ok = Cute.apply(object, 'ignores')
      is(ok, undefined)
    })

    it('ignores undefined objects', function () {
      var ok = Cute.apply(undefined, 'ignores')
      is(ok, undefined)
    })
  })
})
