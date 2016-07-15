'use strict'

var is = global.is || require('exam-is')
var Cute = require('../cute.test')

describe('Cute', function () {
  describe('.stringify', function () {
    var stringify = Cute.stringify

    it('handles numbers', function () {
      var json = stringify(0)
      is(json, '0')
      var zero = new Number() // eslint-disable-line
      json = stringify(zero)
      is(json, '0')
    })

    it('handles strings', function () {
      var empty = new String() // eslint-disable-line
      var json = stringify(empty)
      is(json, '""')
    })

    it('handles functions', function () {
      var json = stringify(isNaN)
      is(json, undefined)
    })

    it('handles undefined', function () {
      var json = stringify(undefined)
      is(json, undefined)
      json = stringify()
      is(json, undefined)
    })
  })
})
/*
// Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
// respectively, if the value is omitted entirely.
JSON.stringify() === undef &&
// FF 3.1b1, 2 throw an error if the given value is not a number,
// string, array, object, Boolean, or `null` literal. This applies to
// objects with custom `toJSON` methods as well, unless they are nested
// inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
// methods entirely.
JSON.stringify(value) === "1" &&
JSON.stringify([value]) == "[1]" &&
// Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
// `"[null]"`.
JSON.stringify([undef]) == "[null]" &&
// YUI 3.0.0b1 fails to serialize `null` literals.
JSON.stringify(null) == "null" &&
// FF 3.1b1, 2 halts serialization if an array contains a function:
// `[1, true, isNaN, 1]` serializes as "[1,true,],". These versions
// of Firefox also allow trailing commas in JSON objects and arrays.
// FF 3.1b3 elides non-JSON values from objects and arrays, unless they
// define custom `toJSON` methods.
JSON.stringify([undef, isNaN, null]) == "[null,null,null]" &&
// Simple serialization test. FF 3.1b1 uses Unicode escape sequences
// where character escape codes are expected (e.g., `\b` => `\u0008`).
JSON.stringify({ "A": [value, true, false, null, "\0\b\n\f\r\t"] }) == '{"A":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}' &&
// FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
JSON.stringify(null, value) === "1" &&
JSON.stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
// JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
// serialize extended years.
JSON.stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
// The milliseconds are optional in ES 5, but required in 5.1.
JSON.stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
// Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
// four-digit years instead of six-digit years. Credits: @Yaffle.
JSON.stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
// Safari <= 5.1.7 and Opera >= 10.53 incorrectly serialize millisecond
// values less than 1000. Credits: @Yaffle.
JSON.stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
*/
