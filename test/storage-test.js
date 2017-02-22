'use strict'

var is = global.is || require('exam/lib/is')
var Cute = require('../cute.test')

var key = 'greeting'
var hello = 'Hello!'
var hi = 'Hi!'

describe('Cute', function () {
  describe('.item', function () {
    var items = {}

    global.window = global.window || {}
    window.localStorage = window.localStorage || {
      getItem: function (key, value) {
        return items[key]
      },
      setItem: function (key, value) {
        items[key] = value
      },
      removeItem: function (key) {
        delete items[key]
      }
    }

    it('stores and gets an item', function () {
      var value = Cute.item(key, hi)
      is(value, hi)
      value = Cute.item(key)
      is(value, hi)
    })

    it('stores and removes an item', function () {
      var value = Cute.item(key, hello)
      is(value, hello)
      value = Cute.item(key, null)
      is(value, undefined)
      value = Cute.item(key)
      is(value, undefined)
    })
  })
})
