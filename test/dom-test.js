'use strict'
/* global describe it */
var is = global.is || require('exam-is')
// var mock = global.mock || require('exam-mock')
// var unmock = mock.unmock
var dom = require('./helpers/dom-helper')
var Cute = require('../cute')

describe('Cute', function () {
  describe('.id', function (done) {
    dom('<main id="content"/>', function () {
      it('gets an element by its ID', function () {
        var div = Cute.id('content')
        is(div.tagName, 'MAIN')
      })

      it('returns an element if passed in', function () {
        var div = Cute.id('content')
        var content = Cute.id(div)
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
        var div = Cute.id(parent, 'child')
        is(div, child)
      })
      done()
    })
  })

  describe('.parent', function (done) {
    dom('<nav><a id="a"/></nav><main><p id="p"/></main>', function () {
      it('gets a parent element', function () {
        var a = Cute.id('a')
        var parent = Cute.parent(a)
        is(parent.tagName, 'NAV')
      })

      it('sets a parent element', function () {
        var a = Cute.id('a')
        var p = Cute.id('p')
        var main = Cute.parent(p)
        Cute.parent(a, main)
        var parent = Cute.parent(a)
        is(parent.tagName, 'MAIN')
        // Reset.
        Cute.parent(a, p)
      })
      done()
    })
  })

  describe('.up', function (done) {
    dom('<div><ul><li><a id="a"/></li></ul></div>', function () {
      it('gets ancestors', function () {
        var a = Cute.id('a')
        var up = Cute.up(a, 'ul')[0]
        is(up.tagName, 'UL')
      })
      done()
    })
  })

  describe('.children', function (done) {
    dom('<ul><li>A</li><li>B</li></ul>', function () {
      it('gets child nodes', function () {
        var list = Cute.one('ul')
        is(list.tagName, 'UL')
        var items = Cute.children(list)
        is(items.length, 2)
      })
      done()
    })
  })

  describe('.index', function (done) {
    dom('<ul><li id="a">A</li><li id="b">B</li><li id="c">C</li></ul>', function () {
      it('gets indexes of child nodes', function () {
        var a = Cute.id('a')
        var b = Cute.id('b')
        var c = Cute.id('c')
        var i = Cute.index(a)
        var j = Cute.index(b)
        var k = Cute.index(c)
        is(i, 0)
        is(j, 1)
        is(k, 2)
      })
      done()
    })
  })

  describe('.create', function (done) {
    dom('', function () {
      it('creates an element', function () {
        var div = Cute.create('div')
        is(div.tagName, 'DIV')
        Cute.remove(div)
      })

      it('creates a DIV by default', function () {
        var div = Cute.create('#a.b')
        is(div.id, 'a')
        is(div.className, 'b')
        Cute.remove(div)
      })

      it('creates SVGs', function () {
        var svg = Cute.create('svg')
        is(svg.tagName, 'svg')
        Cute.remove(svg)
      })

      it('creates attributes', function () {
        var a = Cute.create('a?href=http://lighter.io/')
        is(a.href, 'http://lighter.io/')
        Cute.remove(a)
      })

      it('returns an element', function () {
        var div = Cute.create('div?id=ok')
        var same = Cute.create(div)
        is(same.id, 'ok')
        Cute.remove(div)
        Cute.remove(same)
      })
      done()
    })
  })

  describe('.add', function (done) {
    dom('<body/>', function () {
      it('adds an element', function () {
        var div = Cute.add('div')
        is(div.tagName, 'DIV')
        is(div.parentNode.tagName, 'BODY')
        Cute.remove(div)
      })

      it('adds an element to a parent element', function () {
        var parent = Cute.add('div')
        var child = Cute.add(parent, 'div')
        is(child.parentNode.tagName, 'DIV')
        Cute.remove(parent)
        Cute.remove(child)
      })

      it('adds an element before a child', function () {
        var a = Cute.add('a', 0)
        var b = Cute.add('b', a)
        var c = Cute.children(document.body)
        is(c[0].tagName, 'B')
        is(c[1].tagName, 'A')
        Cute.remove(a)
        Cute.remove(b)
      })
      done()
    })
  })

  describe('.html', function (done) {
    dom('<p>Hi!</p>', function () {
      it('gets the innerHTML of an element', function () {
        var p = Cute.one('p')
        var html = Cute.html(p)
        is(html, 'Hi!')
      })

      it('sets the innerHTML of an element', function () {
        var div = Cute.add('div')
        Cute.html(div, 'Hello!')
        is(div.innerHTML, 'Hello!')
        Cute.remove(div)
      })
      done()
    })
  })

  describe('.tag', function (done) {
    dom('<p id="ok">OK</p>', function () {
      it('gets the lowercase tagName of an element', function () {
        var p = Cute.id('ok')
        var tag = Cute.tag(p)
        is(tag, 'p')
      })
      done()
    })
  })

  describe('.text', function (done) {
    dom('<p id="ok">OK</p>', function () {
      it('gets the text of an element', function () {
        var p = Cute.id('ok')
        var text = Cute.text(p)
        is(text, 'OK')
      })

      it('sets the text of an element', function () {
        var p = Cute.id('ok')
        Cute.text(p, 'Hello')
        var text = Cute.text(p)
        is(text, 'Hello')
        Cute.text(p, 'OK')
      })

      it('works when .textContent is unavailable', function () {
        var p = {innerText: 'Inner text.'}
        var text = Cute.text(p)
        is(text, 'Inner text.')
      })
      done()
    })
  })
})
