/**
 * Empty handler.
 * @type {function}
 */
Cute.no = function () {}

/**
 * Default AJAX success handler function.
 * @type {function}
 */
Cute.ok = Cute.no

/**
 * Default AJAX failure handler function.
 * @type {function}
 */
Cute.fail = Cute.no

/**
 * Get an XMLHttpRequest object (or ActiveX object in old IE).
 *
 * @return {XMLHttpRequest}   The request object.
 */
Cute.xhr = function () {
  var xhr
  //+browser:old
  xhr = window.XMLHttpRequest ? new XMLHttpRequest() :
    window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : // jshint ignore:line
    false
  //-browser:old
  //+browser:ok
  xhr = new XMLHttpRequest()
  //-browser:ok
  return xhr
}

/**
 * Get an XMLHttpRequest upload object.
 *
 * @return {XMLHttpRequestUpload}   The request upload object.
 */
Cute.upload = function () {
  var xhr = Cute.xhr()
  return xhr ? xhr.upload : false
}

/**
 * Make an AJAX request, and handle it with success or failure.
 *
 * @param  {string}   url   A URL from which to request a response.
 * @param  {string}   data  An optional query, which if provided, makes the request a POST.
 * @param  {function} ok    An optional function to run upon success.
 * @param  {function} fail  An optional function to run upon failure.
 */
Cute.get = function (url, data, ok, fail) {
  // If the optional data argument is omitted, zero it.
  if (Cute.isFunction(data)) {
    fail = ok
    ok = data
    data = 0
  }
  var request = Cute.xhr()
  if (request) {
    ok = ok || Cute.ok
    fail = fail || Cute.fail
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        var status = request.status
        var isSuccess = (status === 200)
        var fn = isSuccess ? (ok || Cute.ok) : (fail || Cute.fail)
        var data = Cute.parse(request.responseText) || {}
        fn(data, request, status)
      }
    }
    request.open(data ? 'POST' : 'GET', url, true)
    if (data) {
      request.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
      if (Cute.isObject(data)) {
        data = 'json=' + Cute.escape(Cute.stringify(data))
      }
    }
    request.send(data || null)
  }
}
