'use strict'

var is = global.is || require('exam/lib/is')
var dom = require('./helpers/dom-helper')
var Cute = require('../cute.test')

describe('Cute', function () {
  describe('.style', function () {
    it('sets style properties', function () {
      var element = {style: {fontSize: '12px'}}
      Cute.style(element, {fontSize: '16px', color: '#000'})
      is(element.style.fontSize, '16px')
      is(element.style.color, '#000')
    })
  })

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

    describe('.size', function () {
      it('gets or sets an element\'s size', function () {
        var element = {offsetWidth: 20, offsetHeight: 10, style: {}}
        var size = Cute.size(element)
        is.same(size, [20, 10])
        Cute.size(element, [200, 100])
        is(element.style.width, 200)
        is(element.style.height, 100)
      })

      it('returns zeroes for non-existent elements', function () {
        var size = Cute.size(null)
        is.same(size, [0, 0])
      })
    })

    describe('.position', function () {
      it('gets or sets an element\'s position', function () {
        var element = {offsetLeft: 20, offsetTop: 10, style: {}}
        var position = Cute.position(element)
        is.same(position, [20, 10])
        Cute.position(element, [200, 100])
        is(element.style.left, 200)
        is(element.style.top, 100)
      })

      it('returns zeroes for non-existent elements', function () {
        var position = Cute.position(null)
        is.same(position, [0, 0])
      })
    })

    describe('.viewport', function () {
      it('returns the dimensions of the viewport', function () {
        var viewport = Cute.viewport()
        is.same(viewport, [1024, 768])
        delete window.innerWidth
        delete window.innerHeight
        viewport = Cute.viewport()
        is.same(viewport, [0, 0])
      })
    })
  })
})
