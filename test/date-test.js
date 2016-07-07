'use strict'
/* global describe it */
var is = global.is || require('exam-is')
var mock = global.mock || require('exam-mock')
var unmock = mock.unmock
var Cute = require('../cute')
var offset = (new Date(0)).getTimezoneOffset() * 6e4

describe('Cute', function () {
  describe('.getDate', function () {
    it('returns the current date', function () {
      is.date(Cute.getDate())
    })

    it('returns a date', function () {
      var date = new Date()
      is(Cute.getDate(date), date)
    })

    it('constructs a date', function () {
      var date1 = Cute.getDate(1e12)
      var date2 = new Date(1e12)
      is(date1.getTime(), date2.getTime())
    })
  })

  describe('.getTime', function () {
    it('returns epoch milliseconds', function () {
      mock(Date, {
        now: function () {
          return 1e12
        }
      })
      var now = Date.now()
      var time = Cute.getTime()
      is(now, time)
      unmock(Date)
    })

    it('returns epoch milliseconds for a given date', function () {
      var then = new Date(1e12)
      var when = Cute.getTime(then)
      is(then.getTime(), when)
    })
  })

  describe('.getIsoDate', function () {
    it('returns an ISO date string', function () {
      var iso = Cute.getIsoDate()
      is.in(iso, /^[\d]{4}-[\d]{2}-[\d]{2}T[\d]{2}:[\d]{2}:[\d]{2}.[\d]{3}Z$/)
    })
  })

  describe('.formatDate', function () {
    var date = new Date('2016-06-25 20:32:00')

    it('returns the epoch date', function () {
      var epoch = new Date(0 + offset)
      is(Cute.formatDate(epoch, true, true), 'January 1, 1970 at 12:00am')
    })

    it('returns the current formatted date', function () {
      var now = new Date()
      is.in(Cute.formatDate(now), /^[\d]+\/[\d]+\/[\d]+$/)
    })

    it('returns a formatted date', function () {
      is(Cute.formatDate(date), '6/25/16')
    })

    it('returns a long formatted date', function () {
      is(Cute.formatDate(date, true), 'June 25, 2016')
    })

    it('returns a formatted date and time', function () {
      is(Cute.formatDate(date, false, true), '6/25/16 8:32pm')
    })

    it('returns a long formatted date and time', function () {
      is(Cute.formatDate(date, true, true), 'June 25, 2016 at 8:32pm')
    })

    it('can return a DD/MM/YY formatted date', function () {
      mock(Cute.i18n, {
        monthDay: 0
      })
      is(Cute.formatDate(date, false), '25/6/16')
      unmock(Cute.i18n)
    })
  })

  describe('.formatTime', function () {
    it('returns the current formatted time', function () {
      var time = Cute.formatTime()
      is.in(time, /^[\d]+:[\d]{2}[ap]m$/)
    })

    it('returns a formatted time', function () {
      is(Cute.formatTime('6/25/16 1:45 am'), '1:45am')
      is(Cute.formatTime('6/25/16 8:32 pm'), '8:32pm')
      is(Cute.formatTime('6/25/16 12:00 am'), '12:00am')
      is(Cute.formatTime('6/25/16 12:00 pm'), '12:00pm')
      is(Cute.formatTime('6/25/16 11:59 pm'), '11:59pm')
    })

    it('can return a 24-hour formatted time', function () {
      mock(Cute.i18n, {
        twelveHour: 0
      })
      is(Cute.formatTime('6/25/16 1:45 am'), '01:45')
      is(Cute.formatTime('6/25/16 8:32 pm'), '20:32')
      is(Cute.formatTime('6/25/16 12:00 am'), '00:00')
      is(Cute.formatTime('6/25/16 12:00 pm'), '12:00')
      is(Cute.formatTime('6/25/16 11:59 pm'), '23:59')
      unmock(Cute.i18n)
    })
  })
})
