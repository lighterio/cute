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

  describe('.nodes', function (done) {
    dom('<ul><li>A</li><li>B</li></ul>', function () {
      it('gets child nodes', function () {
        var list = Cute.one('ul')
        is(list.tagName, 'UL')
        var items = Cute.nodes(list)
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
        var c = Cute.nodes(document.body)
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

  describe('.attr', function (done) {
    dom('<a name="top"/>', function () {
      it('gets the value of an attribute', function () {
        var a = Cute.one('a')
        var name = Cute.attr(a, 'name')
        is(name, 'top')
      })

      it('sets the value of an attribute', function () {
        var a = Cute.one('a')
        var name = Cute.attr(a, 'name')
        is(name, 'top')
        name = Cute.attr(a, 'name', 'main')
        is(name, 'main')
        name = Cute.attr(a, 'name')
        is(name, 'main')
        Cute.attr(a, 'name', 'top')
        name = Cute.attr(a, 'name')
        is(name, 'top')
      })

      it('removes an attribute', function () {
        var a = Cute.one('a')
        Cute.attr(a, 'title', 'Lord of Winterfell and Warden of the North')
        var title = Cute.attr(a, 'title')
        is(title, 'Lord of Winterfell and Warden of the North')
        Cute.attr(a, 'title', null)
        title = Cute.attr(a, 'title')
        is(title, null)
      })
      done()
    })
  })

  describe('.classes', function (done) {
    dom('<a class="more link">Read more...</a>', function () {
      it('returns class truthiness', function () {
        var a = Cute.one('a.more')
        var isLink = Cute.classes(a, 'link')
        var isHidden = Cute.classes(a, 'hidden')
        is(isHidden, 0)
        is(isLink, 1)
      })

      it('returns a map of classes', function () {
        var a = Cute.one('a.more')
        var map = Cute.classes(a)
        is.same(map, {more: 1, link: 1})
      })

      it('adds and removes classes with "+" and "-"', function () {
        var a = Cute.one('a.more')
        is.notIn(a.className, 'hidden')
        Cute.classes(a, '+hidden')
        is.in(a.className, 'hidden')
        Cute.classes(a, '-hidden')
        is.notIn(a.className, 'hidden')
      })

      it('toggles classes with "!"', function () {
        var a = Cute.one('a.more')
        is.notIn(a.className, 'hidden')
        Cute.classes(a, '!hidden')
        is.in(a.className, 'hidden')
        Cute.classes(a, '!hidden')
        is.notIn(a.className, 'hidden')
      })
      done()
    })
  })

  describe('.all', function (done) {
    dom('<a name="a1"></a><p><a name="a2"></a></p>', function () {
      it('returns all matching elements', function () {
        var list = Cute.all('a')
        is(list.length, 2)
      })

      it('returns matching elements under a parent', function () {
        var parent = Cute.one('p')
        var list = Cute.all(parent, 'a')
        is(list.length, 1)
      })

      it('calls callbacks on matching elements', function () {
        var names = []
        Cute.all('a', function (link) {
          names.push(link.name)
        })
        is.same(names, ['a1', 'a2'])
      })
      done()
    })
  })

  describe('.one', function (done) {
    dom('<a name="a1"></a><p><a name="a2"></a></p>', function () {
      it('returns one matching element', function () {
        var link = Cute.one('a')
        is(link.name, 'a1')
      })

      it('returns a matching element under a parent', function () {
        var parent = Cute.one('p')
        var link = Cute.one(parent, 'a')
        is(link.name, 'a2')
      })

      it('calls a callback on a matching elements', function () {
        var names = []
        Cute.one('a', function (link) {
          names.push(link.name)
        })
        is.same(names, ['a1'])
      })
      done()
    })
  })

  describe('.update', function (done) {
    dom('<p><b>B</b><i>I</i></p><ul><li>1</li></ul>' +
      '<a name="top">Top</a>', function () {
      it('adds and removes same-type elements', function () {
        var original = Cute.one('ul')
        var virtual = Cute.create('ul')
        Cute.html(virtual, '<li>1</li><li>2</li>')
        Cute.update(original, virtual)
        var items = Cute.html(original)
        is(items, '<li>1</li><li>2</li>')

        virtual = Cute.create('ul')
        Cute.html(virtual, '')
        Cute.update(original, virtual)
        items = Cute.html(original)
        is(items, '')

        virtual = Cute.create('ul')
        Cute.html(virtual, '<li>1</li>')
        Cute.update(original, virtual)
        items = Cute.html(original)
        is(items, '<li>1</li>')
      })

      it('adds and removes different type elements', function () {
        var original = Cute.one('p')
        var virtual = Cute.create('p')
        Cute.html(virtual, '<i>I</i><b>B</b>')
        Cute.update(original, virtual)
        var content = Cute.html(original)
        is(content, '<i>I</i><b>B</b>')

        virtual = Cute.create('p')
        Cute.html(virtual, '<b>B</b><i>I</i>')
        Cute.update(original, virtual)
        content = Cute.html(original)
        is(content, '<b>B</b><i>I</i>')
      })

      it('adds and removes attributes', function () {
        var link = Cute.one('a')
        var virtual = Cute.create('a')
        Cute.text(virtual, 'Top')
        Cute.update(link, virtual)
        is.falsy(link.name)

        virtual = Cute.create('a?name=top')
        Cute.update(link, virtual)
        is(link.name, 'top')
      })

      it('adds and removes text', function () {
        var link = Cute.one('a')
        var virtual = Cute.create('a')
        Cute.update(link, virtual)
        is.falsy(link.name)

        virtual = Cute.create('a?name=top')
        Cute.text(virtual, 'Top')
        Cute.update(link, virtual)
        is(link.name, 'top')
      })
      done()
    })
  })
})
