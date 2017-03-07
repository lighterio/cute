'use strict'

var is = global.is || require('exam/lib/is')
var Cute = require('../require')

describe('Cute', function () {
  describe('.tagContents', function () {
    it('gets tag contents', function () {
      var html = '<script>var a=1</script><script>alert(a)</script>'
      var scripts = Cute.tagContents(html, 'script')
      is.same(scripts, ['var a=1', 'alert(a)'])
    })

    it('returns an empty array if the tag is not present', function () {
      var html = '<p></p>'
      var scripts = Cute.tagContents(html, 'script')
      is.same(scripts, [])
    })

    it('runs a function on each piece of content', function (done) {
      var html = '<title>Hello</title>'
      Cute.tagContents(html, 'title', function (content) {
        is(content, 'Hello')
        done()
      })
    })
  })
})
