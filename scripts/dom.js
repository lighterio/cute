/**
 * Get an element by its ID (if the argument is an ID).
 * If you pass in an element, it just returns it.
 * This can be used to ensure that you have an element.
 *
 * @param  {HTMLElement}        parent  Optional element to call getElementById on (default: document).
 * @param  {string|HTMLElement} idOrElement    ID of an element, or the element itself.
 * @return {HTMLElement}                       The matching element, or undefined.
 */
Cute.byId = function (parent, idOrElement) {
  if (!idOrElement) {
    idOrElement = parent
    parent = document
  }
  return Cute.isString(idOrElement) ? parent.getElementById(idOrElement) : idOrElement
}

/**
 * Get or set the parent of an element.
 *
 * @param  {HTMLElement} element    A element whose parent we want to get/set.
 * @param  {String}      parent     An optional parent to add the element to.
 * @param  {String}      before     An optional child to insert the element before.
 * @return {HTMLElement}            The parent of the element.
 */
Cute.parent = function (element, parent, before) {
  if (parent) {
    parent.insertBefore(element, before || null)
  } else {
    parent = element.parentNode
  }
  return parent
}

/**
 * Get an element's ancestors, optionally filtered by a selector.
 *
 * @param  {HTMLElement} element   An element to start from.
 * @param  {String}      selector  An optional selector to filter ancestors.
 * @return {Array}                 The array of ancestors.
 */
Cute.up = function (element, selector) {
  var ancestors = []
  while (element = Cute.parent(element)) { // jshint ignore:line
    ancestors.push(element)
  }
  ancestors = Cute.filter(ancestors, function (element) {
    return Cute.matches(element, selector)
  })
  return ancestors
}

/**
 * Get the children of a parent element.
 *
 * @param  {HTMLElement}    element  A parent element who might have children.
 * @return {HTMLCollection}          The collection of children.
 */
Cute.children = function (element) {
  return element.childNodes
}

/**
 * Get an element's index with respect to its parent.
 *
 * @param  {HTMLElement} element  An element with a parent, and potentially siblings.
 * @return {Number}               The element's index, or -1 if there's no matching element.
 */
Cute.index = function (element) {
  var index = -1
  while (element) {
    ++index
    element = element.previousSibling
  }
  return index
}

/**
 * Create an element, given a specified tag identifier.
 *
 * Identifiers are of the form:
 *   tagName#id.class1.class2?attr1=value1&attr2=value2
 *
 * Each part of the identifier is optional.
 *
 * @param  {HTMLElement|String} elementOrString  An element or a string used to create an element (default: div).
 * @param  {String}             innerHtml        An optional string of HTML to populate the element.
 * @return {HTMLElement}                         The existing or created element.
 */
Cute.create = function (elementOrString, innerHtml) {
  var element = elementOrString
  if (Cute.isString(elementOrString)) {
    var tagAndAttributes = elementOrString.split('?')
    var tagAndClass = tagAndAttributes[0].split('.')
    var className = tagAndClass.slice(1).join(' ')
    var tagAndId = tagAndClass[0].split('#')
    var tagName = tagAndId[0] || 'div'
    var id = tagAndId[1]
    var attributes = tagAndAttributes[1]
    var isSvg = /^(svg|g|path|circle|line)$/.test(tagName)
    var uri = 'http://www.w3.org/' + (isSvg ? '2000/svg' : '1999/xhtml')
    element = document.createElementNS(uri, tagName)
    if (id) {
      element.id = id
    }
    if (className) {
      element.className = className
    }
    // TODO: Do something less janky than using query string syntax (Maybe like Ltl?).
    if (attributes) {
      attributes = attributes.split('&')
      Cute.each(attributes, function (attribute) {
        var keyAndValue = attribute.split('=')
        var key = keyAndValue[0]
        var value = keyAndValue[1]
        element[key] = value
        Cute.attr(element, key, value)
      })
    }
    if (innerHtml) {
      Cute.html(element, innerHtml)
    }
  }
  return element
}

/**
 * Add an element to a parent element, creating it first if necessary.
 *
 * @param  {HTMLElement}        parent    An optional parent element (default: document).
 * @param  {HTMLElement|String} elementOrString  An element or a string used to create an element (default: div).
 * @param  {String}             innerHtml        An optional string of HTML to populate the element.
 * @return {HTMLElement}                         The element that was added.
 */
Cute.add = function (parent, elementOrString, innerHtml) {
  if (Cute.isString(parent)) {
    elementOrString = parent
    parent = document.body
  }
  var element = Cute.create(elementOrString, innerHtml)
  parent.appendChild(element)
  return element
}

/**
 * Insert a child element under a parent element, optionally before another element.
 *
 * @param  {HTMLElement}         parent    An optional parent element (default: document).
 * @param  {HTMLElement|String}  elementOrString  An element or a string used to create an element (default: div).
 * @param  {HTMLElement}         beforeSibling    An optional child to insert the element before.
 * @return {HTMLElement}                          The element that was inserted.
 */
Cute.insert = function (parent, elementOrString, beforeSibling) {
  if (Cute.isString(parent)) {
    beforeSibling = elementOrString
    elementOrString = parent
    parent = document.body
  }
  var element = Cute.create(elementOrString)
  if (parent) {
    // If the beforeSibling value is a number, get the (future) sibling at that index.
    if (Cute.isNumber(beforeSibling)) {
      beforeSibling = Cute.children(parent)[beforeSibling]
    }
    // Insert the element, optionally before an existing sibling.
    parent.insertBefore(element, beforeSibling || parent.firstChild || null)
  }
  return element
}

/**
 * Remove an element from its parent.
 *
 * @param  {HTMLElement} element  An element to remove.
 */
Cute.remove = function (element) {
  if (element) {
    // Remove the element from its parent, provided that it has a parent.
    var parent = Cute.parent(element)
    if (parent) {
      parent.removeChild(element)
    }
  }
}

/**
 * Get or set an element's inner HTML.
 *
 * @param  {HTMLElement} element  An element.
 * @param  {String}      html     An optional string of HTML to set as the innerHTML.
 * @return {String}               The element's HTML.
 */
Cute.html = function (element, html) {
  if (!Cute.isUndefined(html)) {
    element.innerHTML = html
  }
  return element.innerHTML
}

/**
 * Get an element's lowercase tag name.
 *
 * @param  {HTMLElement} element  An element.
 * @return {String}               The element's tag name.
 */
Cute.tag = function (element) {
  return Cute.lower(element.tagName)
}

/**
 * Get or set the text of an element.
 *
 * @param  {HTMLElement} element  An element.
 * @return {String}      text     A text string to set.
 */
Cute.text = function (element, text) {
  if (!Cute.isUndefined(text)) {
    Cute.html(element, '')
    Cute.addText(element, text)
  }
  return element.textContent || element.innerText
}

/**
 * Add text to an element.
 *
 * @param  {HTMLElement} element  An element.
 * @return {String}      text     A text string to add.
 */
Cute.addText = function (element, text) {
  Cute.add(element, document.createTextNode(text))
}

/**
 * Get, set, or delete an attribute of an element.
 *
 * @param  {HTMLElement} element  An element.
 * @param  {String}      name     An attribute name.
 * @param  {String}      value    A value to set the attribute to.
 * @return {String}               The value of the attribute.
 */
Cute.attr = function (element, name, value) {
  if (value === null) {
    element.removeAttribute(name)
  } else if (Cute.isUndefined(value)) {
    value = element.getAttribute(name)
  } else {
    var old = Cute.attr(element, name)
    if (value !== old) {
      element.setAttribute(name, value)
    }
  }
  return value
}

/**
 * Get, set, or delete a data attribute of an element.
 *
 * @param  {HTMLElement} element  An element.
 * @param  {String}      key      A data attribute key.
 * @param  {String}      value    A value to set the data attribute to.
 * @return {String}               The value of the attribute.
 */
Cute.data = function (element, key, value) {
  return Cute.attr(element, 'data-' + key, value)
}

/**
 * Add, remove or check classes on an element.
 *
 * @param  {HTMLElement} element     An element to change or read classes from.
 * @param  {String}      operations  Operations to perform on classes.
 * @return {Object}                  The map of classes, or truthy if the last queried class was found.
 */
Cute.classes = function (element, operations) {
  var map = {}
  var result = map
  var list = '' + element.className
  list.replace(/\S+/g, function (key) {
    map[key] = true
  })
  if (operations) {
    operations.replace(/(!\+-\?)?(\S+)/, function (match, op, key) {
      var value = map[key]
      if (op === '!') {
        value = !value
      } else if (op === '+') {
        value = true
      } else if (op === '-') {
        value = false
      } else if (op === '?') {
        result = value
      }
      map[key] = value
    })
    list = []
    Cute.each(map, function (value, key) {
      if (value) {
        list.push(key)
      }
    })
    element.className = list.join(' ')
  }
  return result
}

/**
 * Find elements matching a selector, and return or run a function on them.
 *
 * Selectors are not fully querySelector compatible.
 * Selectors only support commas, spaces, IDs, tags & classes.
 *
 * @param  {HTMLElement}    parent    An optional element under which to find elements.
 * @param  {String}         selector  A simple selector for finding elements.
 * @param  {Function}       fn        An optional function to run on matching elements.
 * @return {HTMLCollection}           The matching elements (if any).
 */
Cute.all = function (parent, selector, fn) {
  if (!selector || Cute.isFunction(selector)) {
    fn = selector
    selector = parent
    parent = document
  }
  if (!parent) {
    parent = document
  }
  var elements
  //+browser:old
  elements = []
  if (Cute.contains(selector, ',')) {
    Cute.each(selector, function (selector) {
      Cute.all(parent, selector, function (element) {
        elements.push(element)
      })
    })
  } else if (Cute.contains(selector, ' ')) {
    var pos = selector.indexOf(' ')
    var preSelector = selector.substr(0, pos)
    var postSelector = selector.substr(pos + 1)
    elements = []
    Cute.all(parent, preSelector, function (element) {
      var children = Cute.all(element, postSelector)
      Cute.merge(elements, children)
    })
  } else if (selector[0] === '#') {
    var id = selector.substr(1)
    var child = Cute.byId(parent.ownerDocument || document, id)
    if (child) {
      var up = Cute.parent(child)
      while (up) {
        if (up === parent) {
          elements = [child]
          break
        }
        up = Cute.parent(up)
      }
    }
  } else {
    selector = selector.split('.')
    var tagName = selector[0]
    var className = selector[1]
    var tagElements = parent.getElementsByTagName(tagName)
    Cute.each(tagElements, function (element) {
      if (!className || Cute.classes(element, className)) {
        elements.push(element)
      }
    })
  }
  //-browser:old
  //+browser:ok
  elements = parent.querySelectorAll(selector)
  //-browser:ok
  if (fn) {
    Cute.each(elements, fn)
  }
  return elements
}

/**
 * Find an element matching a selector, optionally run a function on it, and return it.
 *
 * @param  {HTMLElement} parent  An optional element under which to find an element.
 * @param  {String}      selector       A simple selector for finding an element.
 * @param  {Function}    fn             An optional function to run on a matching element.
 * @return {HTMLElement}                The matching element (if any).
 */
Cute.one = function (parent, selector, fn) {
  if (!selector || Cute.isFunction(selector)) {
    fn = selector
    selector = parent
    parent = document
  }
  var element
  //+browser:old
  element = Cute.all(parent, selector)[0]
  //-browser:old
  //+browser:ok
  element = parent.querySelector(selector)
  //-browser:ok
  if (element && fn) {
    fn(element)
  }
  return element
}

/**
 * Push new HTML into one or more selected elements.
 *
 * @param  {String} html     A string of HTML.
 * @param  {String} selector An optional selector (default: "body").
 */
Cute.pushHtml = function (html, selector) {
  var content = html
  selector = selector || 'body'

  if (selector === 'body') {
    content = (/<body\b.*?>(.*?)<\/body>/i.exec(html) || 0)[0] || html
  }

  // Set the HTML of an element.
  return Cute.all(selector, function (element) {

    Cute.startTime('virtual')
    var virtualDom = Cute.create('m', content)
    Cute.endTime('virtual')
    Cute.startTime('diff')
    Cute.diffDom(element, virtualDom)
    Cute.endTime('diff')
    Cute.isReady(element, 1)

    Cute.timer(function () {
      Cute.all(virtualDom, 'script', function (script) {
        script = Cute.html(script)
        Cute.execute(script)
      })
      Cute.all('script', Cute.remove)
    })

  })[0]
}

/**
 * Merge children from a virtual DOM.
 *
 * @param  {HTMLElement} domNode     The DOM node to merge into.
 * @param  {HTMLElement} newNode     The virtual DOM to merge from.
 */
Cute.diffDom = function (domNode, newNode, isTopLevel) {
  var domChild = domNode.firstChild || 0
  var newChild = newNode.firstChild || 0
  while (newChild) {
    var domTag = domChild.tagName
    var newTag = newChild.tagName
    var domNext = domChild.nextSibling || 0
    var newNext = newChild.nextSibling || 0
    if ((domTag !== newTag) || Cute.lower(newTag) === 'svg') {
      domNode.insertBefore(newChild, domChild || null)
      if (domChild) {
        domNode.removeChild(domChild)
      }
      domChild = domNext
    } else {
      if (newTag) {
        Cute.diffDom(domChild, newChild)
        Cute.diffAttributes(domChild, newChild)
      } else if (domChild && newChild) {
        domChild.textContent = newChild.textContent
      } else if (newChild) {
        domNode.appendChild(newChild)
      }
      domChild = domNext
    }
    newChild = newNext
  }
  while (domChild) {
    domNext = domChild.nextSibling
    domNode.removeChild(domChild)
    domChild = domNext
  }
}

/**
 * Merge attributes from a virtual DOM.
 *
 * @param  {HTMLElement} domNode  The DOM node to merge into.
 * @param  {HTMLElement} newNode  The virtual DOM to merge from.
 */
Cute.diffAttributes = function (domNode, newNode) {
  var map = {}
  Cute.each([domNode, newNode], function (element, index) {
    Cute.each(element.attributes, function (attribute) {
      if (attribute) {
        map[attribute.name] = index ? attribute.value : null
      }
    })
  })
  Cute.each(map, function (value, name) {
    Cute.attr(domNode, name, value)
  })
}
