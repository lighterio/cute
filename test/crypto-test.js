'use strict'

var bench = global.bench || require('exam/lib/bench')
var is = global.is || require('exam/lib/is')
var crypto = require('crypto')
var Cute = require('../require')

describe('Cute', function () {
  var json = JSON.stringify(JSON.stringify(this.fn.toString()))

  describe('.md5', function () {
    var md5 = function (text) {
      return crypto.createHash('md5').update(text).digest('hex')
    }

    it('hashes strings', function () {
      is(Cute.md5('hello'), md5('hello'))
      is(Cute.md5('WTF!?'), md5('WTF!?'))
      is(Cute.md5(json), md5(json))
    })
  })

  bench('.md5', function () {
    var a, b

    it('Cute', function () {
      a = Cute.md5(json)
    })

    it('Node', function () {
      b = crypto.createHash('md5').update(json).digest('hex')
    })

    is(a, b)
  })
})
