'use strict'
/* global describe it */
var is = global.is || require('exam-is')
var mock = global.mock || require('exam-mock')
var unmock = mock.unmock
var Cute = require('../cute')

describe('Cute', function () {
  describe('.cookie', function () {
    it('parses all cookies', function () {
      mock(global, {
        document: {
          cookie: 'user=1234; lang=en-US'
        }
      })
      var cookie = Cute.cookie()
      is.same(cookie, {
        user: '1234',
        lang: 'en-US'
      })
      unmock()
    })

    it('parses a cookie by name', function () {
      mock(global, {
        document: {
          cookie: 'user: 1234; lang: en-US'
        }
      })
      var user = Cute.cookie('user')
      is(user, '1234')
      unmock()
    })

    it('sets a cookie', function () {
      mock(global, {
        document: {
          cookie: 'user: 1234; lang: en-US'
        }
      })
      var lang = Cute.cookie('lang', 'fr-FR')
      is(lang, 'fr-FR')
      lang = Cute.cookie('lang')
      is(lang, 'fr-FR')
      unmock()
    })
  })
})
