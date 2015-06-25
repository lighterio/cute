Jymin.handlers = {}

Jymin.on = function (selectorOrElement, eventTypes, listener) {
  if (!listener) {
    listener = eventTypes
    eventTypes = selectorOrElement
    selectorOrElement = document
  }
  Jymin.forEach(eventTypes, function (eventType) {
    var handlers = Jymin.handlers[eventType]
    if (!handlers) {
      handlers = Jymin.handlers[eventType] = []
      document['on' + eventType] = function (event) {
        event = event || window.event
        var element = event.target || event.srcElement
        Jymin.trigger(element, event)
      }
    }
    handlers.push([selectorOrElement, listener])
  })
}

Jymin.off = function (eventType, listener) {
  var handlers = Jymin.handlers[eventType]
  var index = handlers.indexOf(listener)
  if (index > -1) {
    handlers.splice(index, 1)
  }
}

Jymin.once = function (selectorOrElement, eventTypes, listener) {
  var fn = function (element, event, type) {
    listener(element, event, type)
    Jymin.off(type, fn)
  }
  Jymin.on(selectorOrElement, eventTypes, fn)
}

Jymin.trigger = function (element, event) {
  if (!event) {
    event = element
    element = document
  }
  if (Jymin.isString(event)) {
    event = {type: event}
  }
  var handlers = Jymin.handlers[event.type]
  var matches = element.matches ? 'matches' : 'matchesSelector'
  while (element && !event._stopped) {
    Jymin.forEach(handlers, function (handler) {
      var selector = handler[0]
      var fn = handler[1]
      var match = element[matches] && Jymin.isString(selector)
      if (match ? element[matches](selector) : (element === selector)) {
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
