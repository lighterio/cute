/**
 * Event Handlers
 * @type {Object}
 */
Jymin.handlers = {}

/**
 * Listen for one or more events, optionally on a given element.
 *
 * @param  {String|HTMLElement} selectorOrElement  An optional selector or element.
 * @param  {String|Array}       eventTypes         A list of events to listen for.
 * @param  {Function}           listener           A function to execute when an event occurs.
 */
Jymin.on = function (selectorOrElement, eventTypes, listener) {
  if (!listener) {
    listener = eventTypes
    eventTypes = selectorOrElement
    selectorOrElement = document
  }
  var element = Jymin.isString(selectorOrElement) ? document : selectorOrElement
  Jymin.forEach(eventTypes, function (eventType) {
    var handlers = Jymin.handlers[eventType]
    if (!handlers) {
      handlers = Jymin.handlers[eventType] = []
      var fn = function (event) {
        event = event || window.event
        var element = event.target || event.srcElement
        Jymin.trigger(element, event)
      }
      if (element.addEventListener) {
        element.addEventListener(eventType, fn, false)
      } else if (element.attachEvent) {
        element.attachEvent('on' + eventType, fn)
      } else {
        element['on' + eventType] = fn
      }
    }
    handlers.push([selectorOrElement, listener])
  })
}

/**
 * Remove a listener for one event type.
 *
 * @param  {String|Array} eventType   An event to stop listening for.
 * @param  {Function}     listener    A listener function to remove.
 */
Jymin.off = function (eventType, listener) {
  var handlers = Jymin.handlers[eventType]
  var index = handlers.indexOf(listener)
  if (index > -1) {
    handlers.splice(index, 1)
  }
}

/**
 * Listen for one or more events just once, optionally on a given element.
 *
 * @param  {String|HTMLElement} selectorOrElement  An optional selector or element.
 * @param  {String|Array}       eventTypes         A list of events to listen for.
 * @param  {Function}           listener           A function to execute when an event occurs.
 */
Jymin.once = function (selectorOrElement, eventTypes, listener) {
  if (!listener) {
    listener = eventTypes
    eventTypes = selectorOrElement
    selectorOrElement = document
  }
  var fn = function (element, event, type) {
    listener(element, event, type)
    Jymin.off(type, fn)
  }
  Jymin.on(selectorOrElement, eventTypes, fn)
}

/**
 * Fake an event.
 *
 * @param  {HTMLElement}   element  An element to pretend the event occurred on.
 * @param  {String|Object} event    An event or event type to fake.
 */
Jymin.trigger = function (element, event) {
  if (!event) {
    event = element
    element = event.target || event.srcElement || document
  }
  if (Jymin.isString(event)) {
    event = {type: event}
  }
  element = element || 0
  var handlers = Jymin.handlers[event.type]
  while (element && !event._stopped) {
    Jymin.forEach(handlers, function (handler) {
      var selector = handler[0]
      var fn = handler[1]
      var isMatch
      if (Jymin.isString(selector)) {
        element._matches = element._matches ||
          element.matchesSelector ||
          element.msMatchesSelector ||
          element.webkitMatchesSelector ||
          element.mozMatchesSelector ||
          element.oMatchesSelector ||
          Jymin.matchesSelector
        isMatch = element._matches(selector)
      } else {
        isMatch = element = selector
      }
      if (isMatch) {
        fn(element, event, event.type)
      }
      return !event._stopped
    })
    if (element === document) {
      break
    }
    element = Jymin.getParent(element)
  }
}

/**
 * DOM element selector matching method for older browsers.
 *
 * @param  {String}  selector  A CSS selector to check against an element.
 * @return {boolean}           True if the element (this) matches the selector.
 */
Jymin.matchesSelector = function (selector) {
  var self = this
  var isMatch
  Jymin.all(selector, function (element) {
    if (element == self) {
      isMatch = 1
      return !isMatch
    }
  })
  return isMatch
}

/**
 * Prevent the default action for this event.
 *
 * @param  {Event} event  Event to prevent from doing its default action.
 */
Jymin.preventDefault = function (event) {
  Jymin.apply(event, 'preventDefault')
}

/**
 * Stop an event from bubbling or performing its default action.
 *
 * @param  {Event} event  Event to stop.
 */
Jymin.stopEvent = function (event) {
  event._stopped = 1
  Jymin.preventDefault(event)
}

/**
 * Focus on a specified element.
 *
 * @param  {HTMLElement} element  The element to focus on.
 */
Jymin.focusElement = function (element) {
  Jymin.apply(element, 'focus')
}
