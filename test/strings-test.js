'use strict'

var is = global.is || require('exam/lib/is')
var Cute = require('../cute.test')

describe('Cute', function () {
  describe('.contains', function () {
    it('returns true if the string contains the given substring', function () {
      is(Cute.contains('Hello', 'el'), true)
      is(Cute.contains('Hello', 'le'), false)
    })
  })

  describe('.startsWith', function () {
    it('returns true if the string starts with the given substring', function () {
      is(Cute.startsWith('Hello', 'He'), true)
      is(Cute.startsWith('Hello', 'lo'), false)
    })
  })

  describe('.endsWith', function () {
    it('returns true if the string ends with the given substring', function () {
      is(Cute.endsWith('Hello', 'He'), false)
      is(Cute.endsWith('Hello', 'lo'), true)
    })
  })

  describe('.split', function () {
    it('splits a string by commas', function () {
      is.same(Cute.split('a,b'), ['a', 'b'])
    })
  })

  describe('.trim', function () {
    it('trims the whitespace from a string', function () {
      is(Cute.trim('\tBam!'), 'Bam!')
      is(Cute.trim(' ok '), 'ok')
      is(Cute.trim('Yes.'), 'Yes.')
      is(Cute.trim('No.\n'), 'No.')
    })
  })

  describe('.lower', function () {
    it('converts a string to lowercase', function () {
      is(Cute.lower('Hello'), 'hello')
    })
  })

  describe('.upper', function () {
    it('converts a string to uppercase', function () {
      is(Cute.upper('Hello'), 'HELLO')
    })
  })

  describe('.length', function () {
    it('measures the length of a string', function () {
      is(Cute.length('hi'), 2)
    })
  })

  describe('.encode', function () {
    it('returns an encoded string for URLs', function () {
      is(Cute.encode('Hello, World.'), 'Hello%2C%20World.')
    })
  })

  describe('.decode', function () {
    it('returns the decoded version of an encoded URL component', function () {
      is(Cute.decode('Hello%2C%20World.'), 'Hello, World.')
    })
  })
})
