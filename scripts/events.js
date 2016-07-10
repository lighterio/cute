/* global Cute */

/**
 * Event Handlers
 * @type {Object}
 */
Cute.handlers = {}

/**
 * Listen for one or more events, optionally on a given element.
 *
 * @param  {String|HTMLElement} target    An optional selector or element.
 * @param  {String|Array}       types     A list of events to listen for.
 * @param  {Function}           listener  A callback function.
 */
Cute.on = function (target, types, listener) {
  if (!listener) {
    listener = types
    types = target
    target = document
  }
  var element = Cute.isString(target) ? document : target
  types = types.split(/\s+/)
  Cute.each(types, function (type) {
    var handlers = Cute.handlers[type]
    if (!handlers) {
      handlers = Cute.handlers[type] = []
      /* istanbul ignore next */
      if (element.addEventListener) {
        element.addEventListener(type, Cute.propagate)
      } else if (element.attachEvent) {
        element.attachEvent('on' + type, Cute.propagate)
      } else {
        element['on' + type] = Cute.propagate
      }
    }
    handlers.push({t: target, f: listener})
  })
}

/**
 * Remove a listener for one event type.
 *
 * @param  {String}    types     Types of event to stop listening for.
 * @param  {Function}  listener  A listener function to remove.
 */
Cute.off = function (types, listener) {
  types = types.split(/\s+/)
  Cute.each(types, function (type) {
    var handlers = Cute.handlers[type]
    Cute.each(handlers, function (item, index) {
      if (item && (item.f === listener)) {
        delete handlers[index]
      }
    })
  })
}

/**
 * Listen for one or more events, optionally on a given element, and ensure that the
 * listener will only be executed once.
 *
 * @param  {String|HTMLElement} target    An optional selector or element.
 * @param  {String|Array}       types     A list of events to listen for.
 * @param  {Function}           listener  A function to execute when an event occurs.
 */
Cute.once = function (target, types, listener) {
  var onceFn = function () {
    Cute.off(types, onceFn)
    listener.apply(target, arguments)
  }
  //alert(target.tagName, types, onceFn)
  Cute.on(target, types, onceFn)
}

/**
 * Simulate an event.
 *
 * @param  {HTMLElement} target  A target to start propagation from.
 * @param  {String}      event   A type of event.
 * @param  {Object}      data    Optional data to report with the event.
 */
Cute.emit = function (target, type, data) {
  Cute.propagate({
    type: type,
    target: target,
    data: data
  })
}

/**
 * Propagate an event from a target element up to the DOM root.
 *
 * @param  {Object} event   An event to propagate:
 *                          {
 *                            type: String,   // An event type (e.g.) "click".
 *                            target: Object, // The element where the event occurred.
 *                            data: Object    // Optional event data.
 *                          }
 */
Cute.propagate = function (event) {
  // Get the window-level event if an event isn't passed.
  event = event || window.event

  // Reference the event target.
  var eventTarget = event.target || event.srcElement || document

  // Extract the event type.
  var type = event.type

  // Propagate the event up through the target's DOM parents.
  var element = eventTarget
  var handlers = Cute.handlers[type]
  while (element && !event._stopped) {
    Cute.each(handlers, function (handler) {
      if (handler) {
        var target = handler.t
        var fn = handler.f
        var isMatch = Cute.isString(target)
          ? Cute.matches(element, target)
          : (element === target)
        if (isMatch) {
          fn(eventTarget, type, event)
        }
        return !event._stopped
      }
    })
    if (element === document) {
      break
    }
    element = Cute.parent(element)
  }
}

/**
 * Find out if an element matches a given selector.
 *
 * @param  {HTMLElement} element   An element to pretend the event occurred on.
 * @param  {String}      selector  A CSS selector to check against an element.
 * @return {boolean}               True if the element (this) matches the selector.
 */
Cute.matches = function (element, selector) {
  var matches =
    element.webkitMatchesSelector ||
    element.msMatchesSelector ||
    element.mozMatchesSelector ||
    element.oMatchesSelector ||
    element.matchesSelector ||
    element.matches || Cute.no
  var isMatch = matches.call(element, selector)
  return isMatch
}

/**
 * Prevent the default action for this event.
 *
 * @param  {Event} event  Event to prevent from doing its default action.
 */
Cute.prevent = function (event) {
  Cute.apply(event, 'preventDefault')
}

/**
 * Stop an event from bubbling or performing its default action.
 *
 * @param  {Event} event  Event to stop.
 */
Cute.stop = function (event) {
  event._stopped = 1
  Cute.prevent(event)
}

/**
 * Focus on a specified element.
 *
 * @param  {HTMLElement} element  The element to focus on.
 * @param  {Boolean}     blur     Whether to blur instead.
 */
Cute.focus = function (element, blur) {
  Cute.apply(element, blur ? 'blur' : 'focus')
}
