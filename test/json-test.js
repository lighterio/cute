'use strict'

var is = global.is || require('exam/lib/is')
var Cute = require('../require')

describe('Cute', function () {
  describe('.stringify', function () {
    var stringify = Cute.stringify
    var jsonable = function () {
      return 1
    }
    jsonable.toJSON = jsonable

    it('handles numbers', function () {
      var json = stringify(0)
      is(json, '0')
      var zero = new Number() // eslint-disable-line
      is(stringify(zero), '0')
    })

    it('handles strings', function () {
      var empty = new String() // eslint-disable-line
      is(stringify(empty), '""')
    })

    it('handles functions', function () {
      is(stringify(isNaN), undefined)
    })

    it('uses toJSON methods', function () {
      is(stringify(jsonable), '1')
      is(stringify([jsonable]), '[1]')
    })

    it('handles undefined alone and in an array', function () {
      is(stringify([undefined]), '[null]')
      is(stringify(undefined), undefined)
    })

    it('handles arrays of many types', function () {
      is(stringify([undefined, isNaN, null]), '[null,null,null]')
    })

    it('handles special characters', function () {
      is(stringify('\0\b\n\f\r\t'), '"\\u0000\\b\\n\\f\\r\\t"')
    })

    it('handles complex objects', function () {
      is(stringify({A: [jsonable, true, false, null, '\0\b\n\f\r\t']}),
        '{"A":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}')
    })

    it('handles complex objects', function () {
      is(stringify({A: [jsonable, true, false, null, '\0\b\n\f\r\t']}),
        '{"A":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}')
    })

    it('handles dates', function () {
      is(stringify(new Date(-8.64e15)), '"-271821-04-20T00:00:00.000Z"')
      is(stringify(new Date(8.64e15)), '"+275760-09-13T00:00:00.000Z"')
      is(stringify(new Date(-1)), '"1969-12-31T23:59:59.999Z"')
    })

    it('handles circular references', function () {
      var o = {}
      o.o = o
      is(stringify(o), '{"o":"[Circular 1]"}')
    })
  })

  describe('.attrify', function () {
    it('outputs a value for value attributes', function () {
      is(Cute.attrify({ok: true}), '{&quot;ok&quot;:true}')
    })
  })

  describe('.parse', function () {
    it('parses JSON', function () {
      is.same(Cute.parse('{"ok":true}'), {ok: true})
    })

    it('parses non-strict JSON', function () {
      is.same(Cute.parse('{ok:true}'), {ok: true})
    })

    it('returns an alternative value in case of error', function () {
      is(Cute.parse('{ok:', null), null)
    })
  })

  describe('.run', function () {
    it('runs JavaScript', function () {
      Cute.run('process.CUTE_RUN=1')
      is(process.CUTE_RUN, 1)
    })
  })
})

/*
// The milliseconds are optional in ES 5, but required in 5.1.
JSON.stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
// Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
// four-digit years instead of six-digit years. Credits: @Yaffle.
JSON.stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
// Safari <= 5.1.7 and Opera >= 10.53 incorrectly serialize millisecond
// values less than 1000. Credits: @Yaffle.
JSON.stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
*/
