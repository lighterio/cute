'use strict'

var is = global.is || require('exam-is')
var dom = require('./helpers/dom-helper')
var Cute = require('../cute.test')

describe('Cute', function () {
  describe('.scroll', function (done) {
    var block = 'position:absolute;display:block;'
    dom('<div id="d" style="position:relative">' +
      '<img id="i" style="' + block + 'top:1px;left:2px"/>' +
      '<a id="a" name="a" style="' + block + 'top:3px;left:4px"></a>' +
      '</div>', function () {
      function offset (id, top, left, parent) {
        var element = Cute.id(id)
        element.offsetTop = top
        element.offsetLeft = left
        element.offsetParent = parent
      }

      var body = document.body
      var d = Cute.id('d')
      offset('d', 5, 5)
      offset('i', 1, 2, d)
      offset('a', 3, 4, d)
      Cute.id('a').id = undefined

      it('returns the current scroll position', function () {
        body.scrollTop = 1
        body.scrollLeft = 2
        var top = Cute.scroll()
        is(top, 1)
        var left = Cute.scroll(undefined, 'Left')
        is(left, 2)
      })

      it('scrolls to a named anchor', function () {
        Cute.scroll('a')
        is(body.scrollTop, 8)
      })

      it('scrolls to an id', function () {
        Cute.scroll('i')
        is(body.scrollTop, 6)
      })

      it('scrolls to an element', function () {
        Cute.scroll(d)
        is(body.scrollTop, 5)
      })

      it('scrolls to a position', function () {
        Cute.scroll(7, 'Left')
        Cute.scroll(8, 'Top')
        is(body.scrollLeft, 7)
        is(body.scrollTop, 8)
      })

      it('scrolls to nowhere', function () {
        Cute.scroll({})
        is(body.scrollTop, 0)
      })

      done()
    })
  })
})
