'use strict'

var is = global.is || require('exam/lib/is')
// var mock = global.mock || require('exam-mock')
// var unmock = mock.unmock
var dom = require('./helpers/dom-helper')
var Cute = require('../require')

describe('Cute', function () {
  describe('.value', function (done) {
    dom('<input name="i" value="iv1"/>' +
      '<input type="hidden" name="h" value="hv1"/>' +
      '<textarea name="t">tv1</textarea>' +
      '<input type="radio" name="r" value="rv1" checked>' +
      '<input type="radio" name="r" value="rv2">' +
      '<input type="checkbox" name="c" value="cv1" checked>' +
      '<input type="checkbox" name="x" value="xv1" checked>' +
      '<input type="checkbox" name="x" value="xv2">' +
      '<select name="s">' +
      '  <option selected>sv1</option>' +
      '  <option>sv2</option>' +
      '</select>' +
      '<select name="m" multiple>' +
      '  <option selected>mv1</option>' +
      '  <option>mv2</option>' +
      '</select>', function () {
      it('returns undefined if the input is undefined', function () {
        var input = Cute.one('input[name=nope]')
        var value = Cute.value(input)
        is(value, undefined)
        Cute.value(input, 'value')
        value = Cute.value(input)
        is(value, undefined)
      })

      it('gets and sets text input values', function () {
        var input = Cute.one('input[name=i]')
        var value = Cute.value(input)
        is(value, 'iv1')
        Cute.value(input, 'iv2')
        value = Cute.value(input)
        is(value, 'iv2')
        Cute.value(input, 'iv1')
      })

      it('gets and sets hidden input values', function () {
        var input = Cute.one('input[name=h]')
        var value = Cute.value(input)
        is(value, 'hv1')
        Cute.value(input, 'hv2')
        value = Cute.value(input)
        is(value, 'hv2')
        Cute.value(input, 'hv1')
      })

      it('gets and sets textarea values', function () {
        var input = Cute.one('textarea[name=t]')
        var value = Cute.value(input)
        is(value, 'tv1')
        Cute.value(input, 'tv2')
        value = Cute.value(input)
        is(value, 'tv2')
        Cute.value(input, 'tv1')
      })

      it('gets and sets radio button values', function () {
        var input = Cute.one('input[name=r]')
        var value = Cute.value(input)
        is(value, 'rv1')
        Cute.value(input, 'rv2')
        value = Cute.value(input)
        is(value, 'rv2')
        Cute.value(input, 'rv1')
      })

      it('gets and sets a checkbox value', function () {
        var input = Cute.one('input[name=c]')
        var value = Cute.value(input)
        is(value, 'cv1')
        Cute.value(input, undefined)
        value = Cute.value(input)
        is(value, undefined)
        Cute.value(input, 'cv1')
      })

      it('gets and sets multiple checkbox values', function () {
        var input = Cute.one('input[name=x]')
        var value = Cute.value(input)
        is.same(value, ['xv1'])
        Cute.value(input, 'xv2')
        value = Cute.value(input)
        is.same(value, ['xv2'])
        Cute.value(input, ['xv1', 'xv2'])
        value = Cute.value(input)
        is.same(value, ['xv1', 'xv2'])
        Cute.value(input, 'xv1')
      })

      it('gets and sets a select box value', function () {
        var input = Cute.one('select[name=s]')
        var value = Cute.value(input)
        is(value, 'sv1')
        Cute.value(input, 'sv2')
        value = Cute.value(input)
        is(value, 'sv2')
        Cute.value(input, 'sv1')
      })

      it('gets and sets multiple select box values', function () {
        var input = Cute.one('select[name=m]')
        var value = Cute.value(input)
        is.same(value, ['mv1'])
        Cute.value(input, 'mv2')
        value = Cute.value(input)
        is.same(value, ['mv2'])
        Cute.value(input, ['mv1', 'mv2'])
        value = Cute.value(input)
        is.same(value, ['mv1', 'mv2'])
        Cute.value(input, 'mv1')
      })
      done()
    })
  })
})
