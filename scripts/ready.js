/**
 * Execute a function when the page loads or new content is added.
 *
 * @param  {Function}  listener  A function which will receive a ready element.
 */
Jymin.onReady = function (object, listener) {
  if (!listener) {
    listener = object
    object = document
  }

  // If the object is alreay ready, run the function now.
  if (object._isReady) {
    listener(object)
  }

  // Create a function that replaces itself so it will only run once.
  var fn = function () {
    if (Jymin.isReady(object)) {
      Jymin.ready(object)
      listener(object)
      listener = Jymin.doNothing
    }
  }

  // Bind using multiple methods for a variety of browsers.
  Jymin.on(object, 'readystatechange,DOMContentLoaded', fn)
  Jymin.on(object === document ? window : object, 'load', fn)

  // Bind to the Jymin-triggered ready event.
  Jymin.on(object, '_ready', fn)
}

/**
 * Declare an object to be ready, and run events that have been bound to it.
 *
 * @param  {Any} object  An HTMLElement or other object.
 */
Jymin.ready = function (object) {
  if (!object._ready) {
    object._ready = 1
    Jymin.trigger(object, '_ready')
  }
}

/**
 * Check if a document, iframe, script or AJAX response is ready.
 *
 * @param  {Object}  object  The object to check for readiness.
 * @return {Boolean}         Whether the object is currently ready.
 */
Jymin.isReady = function (object) {
  // AJAX requests have readyState 4 when loaded.
  // All documents will reach readyState=="complete".
  // In IE, scripts can reach readyState=="loaded" or readyState=="complete".
  return object._ready || /(4|complete|scriptloaded)$/.test('' + object.tagName + object.readyState)
}
