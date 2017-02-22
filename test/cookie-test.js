'use strict'

var is = global.is || require('exam/lib/is')
var mock = global.mock || require('exam-mock')
var unmock = mock.unmock
var Cute = require('../cute.test')

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
      unmock(document)
    })

    it('parses a cookie by name', function () {
      mock(global, {
        document: {
          cookie: 'user: 1234; lang: en-US'
        }
      })
      var user = Cute.cookie('user')
      is(user, '1234')
      unmock(document)
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
      unmock(document)
    })

    it('unsets a cookie', function () {
      mock(global, {
        document: {
          cookie: 'user: 1234; lang: en-US'
        }
      })
      var lang = Cute.cookie('lang', null)
      lang = Cute.cookie('lang')
      is(lang, null)
      unmock(document)
    })

    it('sets a cookie with a options', function () {
      mock(global, {
        document: {
          cookie: ''
        }
      })
      var lang = Cute.cookie('lang', 'en-US', {
        path: '/',
        domain: 'lighter.io',
        secure: true,
        maxAge: 1e4
      })
      var soon = new Date(Date.now() + 1e4).toUTCString()
      lang = Cute.cookie('lang')
      is(lang, 'en-US')
      is(document.cookie, 'lang=en-US;path=/;domain=lighter.io;expires=' + soon + ';secure')
      unmock(document)
    })
  })
})
