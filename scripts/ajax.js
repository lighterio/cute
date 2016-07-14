/* global Cute window XMLHttpRequest ActiveXObject */

/**
 * Get an XMLHttpRequest object (or ActiveX object in old IE).
 *
 * @return {XMLHttpRequest}  The request object.
 */
Cute.xhr = function () {
  var xhr
  // +browser:old
  xhr = window.XMLHttpRequest ? new XMLHttpRequest()
    : window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP')
    : 0
  // -browser:old
  // +browser:ok
  xhr = new XMLHttpRequest()
  // -browser:ok
  return xhr
}

/**
 * Get an XMLHttpRequest upload object.
 *
 * @return {XMLHttpRequestUpload}  The request upload object.
 */
Cute.upload = function () {
  return Cute.xhr().upload
}

/**
 * Make an AJAX request, and handle it with success or failure.
 *
 * @param  {String}   url   A URL from which to request a response.
 * @param  {String}   data  An optional query, which if provided, makes the request a POST.
 * @param  {Function} fn    An optional function which takes (data, status) arguments.
 */
Cute.get = function (url, data, fn) {
  // If the optional data argument is omitted, zero it.
  if (Cute.isFunction(data)) {
    fn = data
    data = 0
  }
  var request = Cute.xhr()
  // +browser:old
  if (!request) {
    return 0
  }
  // -browser:old
  request.onreadystatechange = function (event) {
    if (request.readyState === 4) {
      var status = request.status
      var text = request.responseText
      var data = Cute.parse(text, 0)
      fn(data, status)
    }
  }
  var method = data ? 'POST' : 'GET'
  request.open(method, url, true)
  if (data) {
    request.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
    if (Cute.isObject(data)) {
      data = 'json=' + Cute.escape(Cute.stringify(data))
    }
  }
  request.send(data || null)
  return request
}
