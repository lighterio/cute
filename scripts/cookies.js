/* global Cute */

/**
 * Read cookies, and optionally get or set one.
 *
 * @param  {String} name     An optional cookie name to get or set. If not provided, return a map.
 * @param  {Object} value    A value to be set as a string, or null if the cookie is to be deleted.
 * @param  {Object} options  Optional cookie settings, including "ttl", "expires", "path", "domain" and "secure".
 * @return {Object}          A cookie, or a map of cookie names and values.
 */
Cute.cookie = function (name, value, options) {
  // Build a map of key-value pairs of all cookies.
  var result = {}
  var list = Cute.trim(document.cookie)
  if (list) {
    var cookies = list.split(/\s*;\s*/)
    Cute.each(cookies, function (cookie) {
      var pair = cookie.split(/\s*=\s*/)
      result[Cute.unescape(pair[0])] = Cute.unescape(pair[1])
    })
  }

  // If a cookie is named, get or set it.
  if (name) {
    // If no value is provided, return the existing value.
    if (Cute.isUndefined(value)) {
      result = result[name]

    // If a value is provided, set the cookie to that value.
    } else {
      options = options || {}
      var pair = Cute.escape(name) + '=' + Cute.unescape(value)

      var path = options.path
      var domain = options.domain
      var secure = options.secure

      // If the value is null, expire it as of one millisecond ago.
      var ttl = (value === null) ? -1 : options.ttl
      var expires = ttl ? new Date(Date.now() + ttl) : 0

      document.cookie = pair +
        (path ? ';path=' + path : '') +
        (domain ? ';domain=' + domain : '') +
        (expires ? ';expires=' + expires.toUTCString() : '') +
        (secure ? ';secure' : '')

      result = value
    }
  }
  return result
}
