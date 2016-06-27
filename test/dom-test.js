'use strict'
/* global describe it */
var is = global.is || require('exam-is')
// var mock = global.mock || require('exam-mock')
// var unmock = mock.unmock
var dom = require('./helpers/dom-helper')
var Cute = require('../cute')
var assert = require('assert')

describe('Cute', function () {
  describe('.byId', function (done) {
    dom('<main id="content"/>', function () {
      it('gets an element by its ID', function () {
        var div = Cute.byId('content')
        is(div.tagName, 'MAIN')
      })

      it('returns an element if passed in', function () {
        var div = Cute.byId('content')
        var content = Cute.byId(div)
        is(div.id, content.id)
      })

      it('optionally uses a different parent', function () {
        var child = {}
        var parent = {
          getElementById: function (id) {
            is(id, 'child')
            return child
          }
        }
        var div = Cute.byId(parent, 'child')
        is(div, child)
      })
      done()
    })
  })

  describe('.parent', function (done) {
    dom('<nav><a id="a"/></nav><main><p id="p"/></main>', function () {
      it('gets a parent element', function () {
        var a = Cute.byId('a')
        var parent = Cute.parent(a)
        is(parent.tagName, 'NAV')
      })

      it('sets a parent element', function () {
        var a = Cute.byId('a')
        var p = Cute.byId('p')
        var main = Cute.parent(p)
        Cute.parent(a, main)
        var parent = Cute.parent(a)
        is(parent.tagName, 'MAIN')
      })
      done()
    })
  })

  describe('.up', function (done) {
    dom('<div><ul><li><a id="a"/></li></ul></div>', function () {
      it('gets parent elements', function () {
        var a = Cute.byId('a')
        var up = Cute.up(a, 'ul')[0]
        is(up.tagName, 'UL')
      })
      done()
    })
  })
})
