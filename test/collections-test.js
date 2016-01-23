'use strict'
/* global describe it */
var is = global.is || require('exam-is')
var Cute = require('../cute')

describe('Cute', function () {
  describe('.each', function () {
    it('iterates over arrays', function () {
      var a = [1, 2, 3]
      Cute.each(a, function (v, i, a) {
        a[i] = v * v
      })
      is.same(a, [1, 4, 9])
    })

    it('iterates over objects', function () {
      var o = {a: 1, b: 2, c: 3}
      Cute.each(o, function (v, k, o) {
        o[k] = v * v
      })
      is.same(o, {a: 1, b: 4, c: 9})
    })

    it('iterates over characters', function () {
      var s = 'abc'
      Cute.each(s, function (v, i) {
        s += (i + 1)
      })
      is(s, 'abc123')
    })

    it('ignores falsy values', function () {
      Cute.each(null, is.fail)
    })

    it('exits array iteration on zero returns', function () {
      var a = [1, 2, 3]
      var n = 0
      Cute.each(a, function (v, i, a) {
        n += v
        return i - 1
      })
      is(n, 3)
    })

    it('exits object iteration on zero returns', function () {
      var o = {a: 1, b: 2, c: 3}
      var n = 0
      Cute.each(o, function (v, k, o) {
        n += v
        return v - 2
      })
      is(n, 3)
    })
  })

  describe('.decorate', function () {
    it('adds properties', function () {
      var a = [1, 2]
      var o = {a: true}
      Cute.decorate(o, a)
      is(o[0], 1)
      is(o[1], 2)
    })

    it('ignores empty objects', function () {
      var o = {a: true}
      Cute.decorate(null, o)
    })
  })

  describe('.prop', function () {
    it('returns values if defined', function () {
      var o = {a: false}
      var p = Cute.prop(o, 'a', true)
      is(p, false)
    })

    it('sets values if undefined', function () {
      var o = {}
      var v = Cute.prop(o, 'a', 2)
      is(o.a, 2)
      is(v, 2)
    })
  })

  describe('.filter', function () {
    it('returns a subset of an array', function () {
      var a = 'lighter'.split('')
      var s = Cute.filter(a, function (c) {
        return c > 'i'
      }).join('')
      is(s, 'ltr')
    })

    it('returns a subset of an object', function () {
      var o = {a: 0, b: 1, c: 2}
      var x = Cute.filter(o, function (n) {
        return n !== 1
      })
      is.same(x, {a: 0, c: 2})
    })
  })

  describe('.merge', function () {
    it('leaves one array alone', function () {
      var a = [1, 2, 3]
      a = Cute.merge(a)
      is.same(a, [1, 2, 3])
    })

    it('merges a second array into the first', function () {
      var a = [1, 2, 3]
      var b = [4, 5]
      Cute.merge(a, b)
      is.same(a, [1, 2, 3, 4, 5])
    })

    it('merges many arrays into the first', function () {
      var a = ['a', 'b', 'c']
      var b = ['easy', 'as']
      var c = [1, 2, 3]
      Cute.merge(a, b, c)
      is.same(a, ['a', 'b', 'c', 'easy', 'as', 1, 2, 3])
    })
  })
})
