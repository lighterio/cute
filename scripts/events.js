/**
 * Event Handlers
 * @type {Object}
 */
Cute.handlers = {}

/**
 * Listen for one or more events, optionally on a given element.
 *
 * @param  {String|HTMLElement} selectorOrElement  An optional selector or element.
 * @param  {String|Array}       eventTypes         A list of events to listen for.
 * @param  {Function}           listener           A function to execute when an event occurs.
 */
Cute.on = function (selectorOrElement, eventTypes, listener) {
  if (!listener) {
    listener = eventTypes
    eventTypes = selectorOrElement
    selectorOrElement = document
  }
  var element = Cute.isString(selectorOrElement) ? document : selectorOrElement
  Cute.each(eventTypes, function (eventType) {
    var handlers = Cute.handlers[eventType]
    if (!handlers) {
      handlers = Cute.handlers[eventType] = []
      if (element.addEventListener) {
        element.addEventListener(eventType, Cute.emit, false)
      } else if (element.attachEvent) {
        element.attachEvent('on' + eventType, Cute.emit)
      } else {
        element['on' + eventType] = Cute.emit
      }
    }
    handlers.push([selectorOrElement, listener])
  })
}

/**
 * Remove a listener for one event type.
 *
 * @param  {String|Array} eventType  An event to stop listening for.
 * @param  {Function}     listener   A listener function to remove.
 */
Cute.off = function (eventType, listener) {
  var handlers = Cute.handlers[eventType]
  handlers = Cute.each(handlers, function (item) {
    return item[1] !== listener
  })
  Cute.handlers[eventType] = handlers
}

/**
 * Listen for one or more events just once, optionally on a given element.
 *
 * @param  {String|HTMLElement} selectorOrElement  An optional selector or element.
 * @param  {String|Array}       eventTypes         A list of events to listen for.
 * @param  {Function}           listener           A function to execute when an event occurs.
 */
Cute.once = function (selectorOrElement, eventTypes, listener) {
  if (!listener) {
    listener = eventTypes
    eventTypes = selectorOrElement
    selectorOrElement = document
  }
  var fn = function (element, event, type) {
    listener(element, event, type)
    Cute.off(type, fn)
  }
  Cute.on(selectorOrElement, eventTypes, fn)
}

/**
 * Simulate an event, or propagate an event up the DOM.
 *
 * @param  {String|Object} event   An event or event type to propagate.
 * @param  {HTMLElement}   target  An optional target to start propagation from.
 * @param  {Object}        data    Optional data to report with the event.
 */
Cute.emit = function (event, target, data) {

  // Get the window-level event if an event isn't passed.
  event = event || window.event

  // Construct an event object if necessary.
  if (Cute.isString(event)) {
    event = {type: event}
  }

  // Reference an element if possible.
  var element = event.target = target || event.target || event.srcElement || document

  // Extract the event type.
  var type = event.type

  var handlers = Cute.handlers[type]
  while (element && !event._stopped) {
    Cute.each(handlers, function (handler) {
      var selector = handler[0]
      var fn = handler[1]
      var isMatch = Cute.isString(selector) ?
        Cute.matches(element, selector) :
        (element === selector)
      if (isMatch) {
        fn(data || element, event, type)
      }
      return !event._stopped
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
Cute.matches = function (element, selector, type) {
  var self = this
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
