/**      _                 _                ___  _  _    _
 *      | |_   _ _ __ ___ (_)_ __   __   __/ _ \| || |  / |
 *   _  | | | | | '_ ` _ \| | '_ \  \ \ / / | | | || |_ | |
 *  | |_| | |_| | | | | | | | | | |  \ V /| |_| |__   _|| |
 *   \___/ \__, |_| |_| |_|_|_| |_|   \_/  \___(_) |_|(_)_|
 *         |___/
 *
 * http://lighter.io/jymin
 *
 * If you're seeing this in production, you really should minify.
 *
 * Source files:
 *   https://github.com/lighterio/jymin/blob/master/scripts/ajax.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/arrays.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/cookies.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/dates.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/dom.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/emitter.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/events.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/forms.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/history.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/json.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/logging.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/numbers.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/objects.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/storage.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/strings.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/types.js
 *   https://github.com/lighterio/jymin/blob/master/scripts/url.js
 */


var Jymin = window.Jymin = {version: '0.4.1'};

/**
 * Empty handler.
 * @type {function}
 */
var doNothing = function () {};

/**
 * Default AJAX success handler function.
 * @type {function}
 */
var responseSuccessFn = doNothing;

/**
 * Default AJAX failure handler function.
 * @type {function}
 */
var responseFailureFn = doNothing;

/**
 * Get an XMLHttpRequest object (or ActiveX object in old IE).
 *
 * @return {XMLHttpRequest}   The request object.
 */
var getXhr = function () {
  var Xhr = window.XMLHttpRequest;
  var ActiveX = window.ActiveXObject;
  return Xhr ? new Xhr() : (ActiveX ? new ActiveX('Microsoft.XMLHTTP') : false);
};

/**
 * Get an XMLHttpRequest upload object.
 *
 * @return {XMLHttpRequestUpload}   The request upload object.
 */
var getUpload = function () {
  var xhr = getXhr();
  return xhr ? xhr.upload : false;
};

/**
 * Make an AJAX request, and handle it with success or failure.
 *
 * @param  {string}   url        A URL from which to request a response.
 * @param  {string}   body       An optional query, which if provided, makes the request a POST.
 * @param  {function} onSuccess  An optional function to run upon success.
 * @param  {function} onFailure  An optional function to run upon failure.
 * @return {boolean}             True if AJAX is supported.
 */
var getResponse = function (url, body, onSuccess, onFailure) {
  // If the optional body argument is omitted, shuffle it out.
  if (isFunction(body)) {
    onFailure = onSuccess;
    onSuccess = body;
    body = 0;
  }
  var request = getXhr();
  if (request) {
    onFailure = onFailure || responseFailureFn;
    onSuccess = onSuccess || responseSuccessFn;
    request.onreadystatechange = function() {
      if (request.readyState == 4) {
        //+env:debug
        log('[Jymin] Received response from "' + url + '". (' + getResponse._waiting + ' in progress).');
        //-env:debug
        --getResponse._waiting;
        var status = request.status;
        var isSuccess = (status == 200);
        var fn = isSuccess ?
          onSuccess || responseSuccessFn :
          onFailure || responseFailureFn;
        var data = parse(request.responseText) || {};
        data._status = status;
        data._request = request;
        fn(data);
      }
    };
    request.open(body ? 'POST' : 'GET', url, true);
    request.setRequestHeader('x-requested-with', 'XMLHttpRequest');
    if (body) {
      request.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    }

    // Record the original request URL.
    request._url = url;

    // If it's a post, record the post body.
    if (body) {
      request._body = body;
    }

    // Record the time the request was made.
    request._time = getTime();

    // Allow applications to back off when too many requests are in progress.
    getResponse._waiting = (getResponse._waiting || 0) + 1;

    //+env:debug
    log('[Jymin] Sending request to "' + url + '". (' + getResponse._waiting + ' in progress).');
    //-env:debug
    request.send(body || null);

  }
  return true;
};
/**
 * Iterate over an array-like collection, and call a function on each value, with
 * the arguments: (value, index, array). Iteration stops if the function returns false.
 *
 * @param  {Array|Object|string}  array  A collection, expected to have indexed items and a length.
 * @param  {Function}             fn     A function to call on each item.
 * @return {Number}                      The number of items iterated over without breaking.
 */
var forEach = function (array, fn) {
  if (array) {
    for (var index = 0, length = getLength(array); index < length; index++) {
      var result = fn(array[index], index, array);
      if (result === false) {
        break;
      }
    }
    return index;
  }
};

/**
 * Iterate over an array-like collection, and call a function on each value, with
 * the arguments: (index, value, array). Iteration stops if the function returns false.
 *
 * @param  {Array|Object|string}     array  A collection, expected to have indexed items and a length.
 * @param  {Function}  fn                   A function to call on each item.
 * @return {Number}                         The number of items iterated over without breaking.
 */
var each = function (array, fn) {
  if (array) {
    for (var index = 0, length = getLength(array); index < length; index++) {
      var result = fn(index, array[index], array);
      if (result === false) {
        break;
      }
    }
    return index;
  }
};

/**
 * Get the length of an Array/Object/string/etc.
 *
 * @param {Array|Object|string}  array  A collection, expected to have a length.
 * @return {Number}                     The length of the collection.
 */
var getLength = function (array) {
  return (array || 0).length || 0;
};

/**
 * Get the first item in an Array/Object/string/etc.
 * @param {Array|Object|string}  array  A collection, expected to have index items.
 * @return {Object}                     The first item in the collection.
 */
var getFirst = function (array) {
  return (array || 0)[0];
};

/**
 * Get the last item in an Array/Object/string/etc.
 *
 * @param {Array|Object|string}  array  A collection, expected to have indexed items and a length.
 * @return {Object}                     The last item in the collection.
 */
var getLast = function (array) {
  return (array || 0)[getLength(array) - 1];
};

/**
 * Check for the existence of more than one collection items.
 *
 * @param {Array|Object|string}   array  A collection, expected to have a length.
 * @return {boolean}                     True if the collection has more than one item.
 */
var hasMany = function (array) {
  return getLength(array) > 1;
};

/**
 * Push an item into an array.
 *
 * @param  {Array}  array  An array to push an item into.
 * @param  {Object} item   An item to push.
 * @return {Object}        The item that was pushed.
 */
var push = function (array, item) {
  if (isArray(array)) {
    array.push(item);
  }
  return item;
};

/**
 * Pop an item off an array.
 *
 * @param  {Array}  array  An array to pop an item from.
 * @return {Object}        The item that was popped.
 */
var pop = function (array) {
  if (isArray(array)) {
    return array.pop();
  }
};

/**
 * Merge one or more arrays into an array.
 *
 * @param  {Array}     array  An array to merge into.
 * @params {Array...}         Items to merge into the array.
 * @return {Array}            The first array argument, with new items merged in.
 */
var merge = function (array) {
  forEach(arguments, function (items, index) {
    if (index) {
      forEach(items, function (item) {
        push(array, item);
      });
    }
  });
  return array;
};

/**
 * Push padding values onto an array up to a specified length.
 *
 * @return number:
 * @param  {Array}  array        An array to pad.
 * @param  {Number} padToLength  A desired length for the array, after padding.
 * @param  {Object} paddingValue A value to use as padding.
 * @return {Number}              The number of padding values that were added.
 */
var padArray = function (array, padToLength, paddingValue) {
  var countAdded = 0;
  if (isArray(array)) {
    var startingLength = getLength(array);
    if (startingLength < length) {
      paddingValue = isUndefined(paddingValue) ? '' : paddingValue;
      for (var index = startingLength; index < length; index++) {
        push(array, paddingValue);
        countAdded++;
      }
    }
  }
  return countAdded;
};
/**
 * Get all cookies from the document, and return a map.
 *
 * @return {Object}  The map of cookie names and values.
 */
var getAllCookies = function () {
  var obj = {};
  var documentCookie = trim(document.cookie);
  if (documentCookie) {
    var cookies = documentCookie.split(/\s*;\s*/);
    forEach(cookies, function (cookie) {
      var pair = cookie.split(/\s*=\s*/);
      obj[unescape(pair[0])] = unescape(pair[1]);
    });
  }
  return obj;
};

/**
 * Get a cookie by its name.
 *
 * @param  {String} name  A cookie name.
 * @return {String}       The cookie value.
 */
var getCookie = function (name) {
  return getAllCookies()[name];
};

/**
 * Set or overwrite a cookie value.
 *
 * @param {String} name     A cookie name, whose value is to be set.
 * @param {Object} value    A value to be set as a string.
 * @param {Object} options  Optional cookie options, including "maxage", "expires", "path", "domain" and "secure".
 */
var setCookie = function (name, value, options) {
  options = options || {};
  var str = escape(name) + '=' + unescape(value);
  if (null === value) {
    options.maxage = -1;
  }
  if (options.maxage) {
    options.expires = new Date(+new Date() + options.maxage);
  }
  document.cookie = str +
    (options.path ? ';path=' + options.path : '') +
    (options.domain ? ';domain=' + options.domain : '') +
    (options.expires ? ';expires=' + options.expires.toUTCString() : '') +
    (options.secure ? ';secure' : '');
};

/**
 * Delete a cookie by name.
 *
 * @param {String} name  A cookie name, whose value is to be deleted.
 */
var deleteCookie = function (name) {
  setCookie(name, null);
};
/**
 * Get Unix epoch milliseconds from a date.
 *
 * @param {Date}    date  Date object (default: now).
 * @return {Number}       Epoch milliseconds.
 */
var getTime = function (date) {
  return (date || new Date()).getTime();
};

/**
 * Get an ISO-standard date string (even in super duper old browsers).
 *
 * @param {Date}    date  Date object (default: now).
 * @return {String}       ISO date string.
 */
var getIsoDate = function (date) {
  date = date || new Date();
  if (date.toISOString) {
    date = date.toISOString();
  }
  else {
    // Build an ISO date string manually in really old browsers.
    var utcPattern = /^.*?(\d+) (\w+) (\d+) ([\d:]+).*?$/;
    date = date.toUTCString().replace(utcPattern, function (a, d, m, y, t) {
      m = zeroFill(date.getMonth(), 2);
      t += '.' + zeroFill(date.getMilliseconds(), 3);
      return y + '-' + m + '-' + d + 'T' + t + 'Z';
    });
  }
  return date;
};

/**
 * Take a date and return something like: "August 26, 2014 at 7:42pm".
 *
 * @param  {Object}   date  Date object or constructor argument.
 * @return {String}         Long formatted date string.
 */
var formatLongDate = function (date) {
  var MONTHS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  isDate(date) ? 0 : (date = new Date(+date || date));
  var m = MONTHS[date.getMonth()];
  var isAm = true;
  var h = +date.getHours();
  var minutes = date.getMinutes();
  minutes = minutes > 9 ? minutes : "0" + minutes;
  h > 12 ? (isAm = false, h -= 12) : (h === 0 ? h = 12 : 0);
  return m + " " + date.getDate() + ", " + date.getFullYear() + " at " + h +
    ":" + minutes + (isAm ? "am" : "pm");
}

/**
 * Take a date, and return something like: "8/26/14 7:42pm".
 *
 * @param  {Object}   date  Date object or constructor argument.
 * @return {String}         Short formatted date string.
 */
var formatShortDate = function (date) {
  isDate(date) ? 0 : (date = new Date(+date || date));
  var m = date.getMonth() + 1;
  var isAm = true;
  var h = +date.getHours();
  var minutes = date.getMinutes();
  minutes = minutes > 9 ? minutes : "0" + minutes;
  h > 12 ? (isAm = false, h -= 12) : (h === 0 ? h = 12 : 0);
  return m + "/" + date.getDate() + "/" + date.getFullYear() % 100 + " " + h +
    ":" + minutes + (isAm ? "am" : "pm");
}
/**
 * Get an element by its ID (if the argument is an ID).
 * If you pass in an element, it just returns it.
 * This can be used to ensure that you have an element.
 *
 * @param  {HTMLElement}        parentElement  Optional element to call getElementById on (default: document).
 * @param  {string|HTMLElement} idOrElement    ID of an element, or the element itself.
 * @return {HTMLElement}                       The matching element, or undefined.
 */
var getElement = function (parentElement, idOrElement) {
  if (!hasMany(arguments)) {
    idOrElement = parentElement;
    parentElement = document;
  }
  return isString(idOrElement) ? parentElement.getElementById(idOrElement) : idOrElement;
};

/**
 * Get elements that have a specified tag name.
 *
 * @param  {HTMLElement}    parentElement  Optional element to call getElementsByTagName on (default: document).
 * @param  {String}         tagName        Optional name of tag to search for (default: *).
 * @return {HTMLCollection}                Collection of matching elements.
 */
var getElementsByTagName = function (parentElement, tagName) {
  if (!hasMany(arguments)) {
    tagName = parentElement;
    parentElement = document;
  }
  return parentElement.getElementsByTagName(tagName || '*');
};

/**
 * Get elements that have a specified tag and class.
 *
 * @param  {HTMLElement}    parentElement  Optional element to call getElementsByTagName on (default: document).
 * @param  {String}         tagAndClass    Optional tag and class to search for, separated by a period (default: *).
 * @return {HTMLCollection}                Collection of matching elements.
 */
var getElementsByTagAndClass = function (parentElement, tagAndClass) {
  if (!hasMany(arguments)) {
    tagAndClass = parentElement;
    parentElement = document;
  }
  tagAndClass = tagAndClass.split('.');
  var tagName = (tagAndClass[0] || '*').toUpperCase();
  var className = tagAndClass[1];
  var anyTag = (tagName == '*');
  var elements;
  if (className) {
    elements = [];
    if (parentElement.getElementsByClassName) {
      forEach(parentElement.getElementsByClassName(className), function(element) {
        if (anyTag || (element.tagName == tagName)) {
          elements.push(element);
        }
      });
    }
    else {
      forEach(getElementsByTagName(parentElement, tagName), function(element) {
        if (hasClass(element, className)) {
          elements.push(element);
        }
      });
    }
  }
  else {
    elements = getElementsByTagName(parentElement, tagName);
  }
  return elements;
};

/**
 * Get the parent of an element, or an ancestor with a specified tag name.
 *
 * @param  {HTMLElement} element  A element whose parent elements are being searched.
 * @param  {string}      tagName  An optional ancestor tag to search up the tree.
 * @return {HTMLElement}          The parent or matching ancestor.
 */
var getParent = function (element, tagName) {
  element = element.parentNode;
  // If a tag name is specified, keep walking up.
  if (tagName && element && element.tagName != tagName) {
    element = getParent(element, tagName);
  }
  return element;
};

/**
 * Get the children of a parent element.
 *
 * @param  {HTMLElement}    element  A parent element who might have children.
 * @return {HTMLCollection}          The collection of children.
 */
var getChildren = function (element) {
  return element.childNodes;
};

/**
 * Get an element's index with respect to its parent.
 *
 * @param  {HTMLElement} element  An element with a parent, and potentially siblings.
 * @return {Number}               The element's index, or -1 if there's no matching element.
 */
var getIndex = function (element) {
  var index = -1;
  while (element) {
    ++index;
    element = element.previousSibling;
  }
  return index;
};

/**
 * Get an element's first child.
 *
 * @param  {HTMLElement} element  An element.
 * @return {[type]}               The element's first child.
 */
var getFirstChild = function (element) {
  return element.firstChild;
};

/**
 * Get an element's previous sibling.
 *
 * @param  {HTMLElement} element  An element.
 * @return {HTMLElement}          The element's previous sibling.
 */
var getPreviousSibling = function (element) {
  return element.previousSibling;
};

/**
 * Get an element's next sibling.
 *
 * @param  {HTMLElement} element  An element.
 * @return {HTMLElement}          The element's next sibling.
 */
var getNextSibling = function (element) {
  return element.nextSibling;
};

/**
 * Create a cloneable element with a specified tag name.
 *
 * @param  {String}      tagName  An optional tag name (default: div).
 * @return {HTMLElement}          The newly-created DOM Element with the specified tag name.
 */
var createTag = function (tagName) {
  tagName = tagName || 'div';
  var isSvg = /^(svg|g|path|circle|line)$/.test(tagName);
  var uri = 'http://www.w3.org/' + (isSvg ? '2000/svg' : '1999/xhtml');
  return document.createElementNS(uri, tagName);
};

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
var createElement = function (elementOrString, innerHtml) {
  var element = elementOrString;
  if (isString(elementOrString)) {
    elementOrString = elementOrString || '';
    var tagAndAttributes = elementOrString.split('?');
    var tagAndClass = tagAndAttributes[0].split('.');
    var className = tagAndClass.slice(1).join(' ');
    var tagAndId = tagAndClass[0].split('#');
    var tagName = tagAndId[0];
    var id = tagAndId[1];
    var attributes = tagAndAttributes[1];
    var cachedElement = createTag[tagName] || (createTag[tagName] = createTag(tagName));
    var element = cachedElement.cloneNode(true);
    if (id) {
      element.id = id;
    }
    if (className) {
      element.className = className;
    }
    // TODO: Do something less janky than using query string syntax (Maybe like Ltl?).
    if (attributes) {
      attributes = attributes.split('&');
      forEach(attributes, function (attribute) {
        var keyAndValue = attribute.split('=');
        var key = unescape(keyAndValue[0]);
        var value = unescape(keyAndValue[1]);
        element[key] = value;
        element.setAttribute(key, value);
      });
    }
    if (innerHtml) {
      setHtml(element, innerHtml);
    }
  }
  return element;
};

/**
 * Add an element to a parent element, creating it first if necessary.
 *
 * @param  {HTMLElement}        parentElement    An optional parent element (default: document).
 * @param  {HTMLElement|String} elementOrString  An element or a string used to create an element (default: div).
 * @return {HTMLElement}                         The element that was added.
 */
var addElement = function (parentElement, elementOrString) {
  if (isString(parentElement)) {
    elementOrString = parentElement;
    parentElement = document;
  }
  var element = createElement(elementOrString);
  parentElement.appendChild(element);
  return element;
};

/**
 * Insert a child element under a parent element, optionally before another element.
 *
 * @param  {HTMLElement}         parentElement    An optional parent element (default: document).
 * @param  {HTMLElement|String}  elementOrString  An element or a string used to create an element (default: div).
 * @param  {HTMLElement}         beforeSibling    An optional child to insert the element before.
 * @return {HTMLElement}                          The element that was inserted.
 */
var insertElement = function (parentElement, elementOrString, beforeSibling) {
  if (isString(parentElement)) {
    beforeSibling = elementOrString;
    elementOrString = parentElement;
    parentElement = document;
  }
  var element = createElement(childElement);
  if (parentElement) {
    // If the beforeSibling value is a number, get the (future) sibling at that index.
    if (isNumber(beforeSibling)) {
      beforeSibling = getChildren(parentElement)[beforeSibling];
    }
    // Insert the element, optionally before an existing sibling.
    parentElement.insertBefore(element, beforeSibling || getFirstChild(parentElement) || null);
  }
  return element;
};

/**
 * Wrap an element with another element.
 *
 * @param  {HTMLElement}        innerElement  An element to wrap with another element.
 * @param  {HTMLElement|String} outerElement  An element or a string used to create an element (default: div).
 * @return {HTMLElement}                      The element that was created as a wrapper.
 */
var wrapElement = function (innerElement, outerElement) {
  var parentElement = getParent(innerElement);
  outerElement = insertElement(parentElement, outerElement, innerElement);
  insertElement(outerElement, innerElement);
  return outerElement;
};

/**
 * Remove an element from its parent.
 *
 * @param  {HTMLElement} element  An element to remove.
 */
var removeElement = function (element) {
  if (element) {
    // Remove the element from its parent, provided that it has a parent.
    var parentElement = getParent(element);
    if (parentElement) {
      parentElement.removeChild(element);
    }
  }
};

/**
 * Remove children from an element.
 *
 * @param  {HTMLElement} element  An element whose children should all be removed.
 */
var clearElement = function (element) {
  setHtml(element, '');
};

/**
 * Get an element's inner HTML.
 *
 * @param  {HTMLElement} element  An element.
 * @return {String}               The element's HTML.
 */
var getHtml = function (element) {
  return element.innerHTML;
};

/**
 * Set an element's inner HTML.
 *
 * @param  {HTMLElement} element  An element.
 * @param  {String}      html     A string of HTML to set as the innerHTML.
 */
var setHtml = function (element, html) {
  element.innerHTML = html;
};

/**
 * Get an element's text.
 *
 * @param  {HTMLElement} element  An element.
 * @return {String}               The element's text content.
 */
var getText = function (element) {
  return element.textContent || element.innerText;
};

/**
 * Get an attribute from an element.
 *
 * @param  {HTMLElement} element        An element.
 * @param  {String}      attributeName  An attribute's name.
 * @return {String}                     The value of the attribute.
 */
var getAttribute = function (element, attributeName) {
  return element.getAttribute(attributeName);
};

/**
 * Set an attribute on an element.
 *
 * @param  {HTMLElement} element        An element.
 * @param  {String}      attributeName  An attribute name.
 * @param  {String}      value          A value to set the attribute to.
 */
var setAttribute = function (element, attributeName, value) {
  element.setAttribute(attributeName, value);
};

/**
 * Get a data attribute from an element.
 *
 * @param  {HTMLElement} element  An element.
 * @param  {String}      dataKey  A data attribute's key.
 * @return {String}               The value of the data attribute.
 */
var getData = function (element, dataKey) {
  return getAttribute(element, 'data-' + dataKey);
};

/**
 * Set a data attribute on an element.
 *
 * @param  {HTMLElement} element  An element.
 * @param  {String}      dataKey  A data attribute key.
 * @param  {String}      value    A value to set the data attribute to.
 */
var setData = function (element, dataKey, value) {
  setAttribute(element, 'data-' + dataKey, value);
};

/**
 * Get an element's class name.
 *
 * @param  {HTMLElement} element  An element.
 * @return {String}               The element's class name.
 */
var getClass = function (element) {
  var className = element.className || '';
  return className.baseVal || className;
};

/**
 * Get an element's class name as an array of classes.
 *
 * @param  {HTMLElement} element  An element.
 * @return {Array}                The element's class name classes.
 */
var getClasses = function (element) {
  return getClass(element).split(/\s+/);
};

/**
 * Set an element's class name.
 *
 * @param  {HTMLElement} element  An element.
 * @return {String}               One or more space-delimited classes to set.
 */
var setClass = function (element, className) {
  element.className = className;
};

/**
 * Find out whether an element has a specified class.
 *
 * @param  {HTMLElement} element    An element.
 * @param  {String}      className  A class to search for.
 * @return {boolean}                True if the class was found.
 */
var hasClass = function (element, className) {
  var classes = getClasses(element);
  return classes.indexOf(className) > -1;
};

/**
 * Add a class to a given element.
 *
 * @param  {HTMLElement} element  An element.
 * @param  {String}               A class to add if it's not already there.
 */
var addClass = function (element, className) {
  if (!hasClass(element, className)) {
    element.className += ' ' + className;
  }
};

/**
 * Remove a class from a given element, assuming no duplication.
 *
 * @param  {HTMLElement} element  An element.
 * @return {String}               A class to remove.
 */
var removeClass = function (element, className) {
  var classes = getClasses(element);
  var index = classes.indexOf(className);
  if (index > -1) {
    classes.splice(index, 1);
  }
  classes.join(' ');
  setClass(element, classes);
};

/**
 * Turn a class on or off on a given element.
 *
 * @param  {HTMLElement} element    An element.
 * @param  {String}      className  A class to add or remove.
 * @param  {boolean}     flipOn     Whether to add, rather than removing.
 */
var flipClass = function (element, className, flipOn) {
  var method = flipOn ? addClass : removeClass;
  method(element, className);
};

/**
 * Turn a class on if it's off, or off if it's on.
 *
 * @param  {HTMLElement} element    An element.
 * @param  {String}      className  A class to toggle.
 * @return {boolean}                True if the class was turned on.
 */
var toggleClass = function (element, className) {
  var flipOn = !hasClass(element, className);
  flipClass(element, className, flipOn);
  return flipOn;
};

/**
 * Insert an external JavaScript file.
 *
 * @param  {HTMLElement} element  An element.
 * @param  {HTMLElement} element  An element.
 * @param  {String}      src      A source URL of a script to insert.
 * @param  {function}    fn       An optional function to run when the script loads.
 */
var insertScript = function (src, fn) {
  var head = getElementsByTagName('head')[0];
  var script = addElement(head, 'script');
  if (fn) {
    script.onload = fn;
    script.onreadystatechange = function() {
      if (isLoaded(script)) {
        fn();
      }
    };
  }
  script.src = src;
};

/**
 * Find elements matching a selector, and return or run a function on them.
 *
 * Selectors are not fully querySelector compatible.
 * Selectors only support commas, spaces, IDs, tags & classes.
 *
 * @param  {HTMLElement} parentElement  An optional element under which to find elements.
 * @param  {String}      selector       A simple selector for finding elements.
 * @return {function}    fn             An optional function to run on matching elements.
 */
var all = function (parentElement, selector, fn) {
  if (!selector || isFunction(selector)) {
    fn = selector;
    selector = parentElement;
    parentElement = document;
  }
  var elements;
  if (contains(selector, ',')) {
    elements = [];
    var selectors = splitByCommas(selector);
    forEach(selectors, function (piece) {
      var more = all(parentElement, piece);
      if (getLength(more)) {
        merge(elements, more);
      }
    });
  }
  else if (contains(selector, ' ')) {
    var pos = selector.indexOf(' ');
    var preSelector = selector.substr(0, pos);
    var postSelector = selector.substr(pos + 1);
    elements = [];
    all(parentElement, preSelector, function (element) {
      var children = all(element, postSelector);
      merge(elements, children);
    });
  }
  else if (selector[0] == '#') {
    var id = selector.substr(1);
    var child = getElement(parentElement.ownerDocument || document, id);
    if (child) {
      var parent = getParent(child);
      while (parent) {
        if (parent === parentElement) {
          elements = [child];
          break;
        }
        parent = getParent(parent);
      }
    }
  }
  else {
    elements = getElementsByTagAndClass(parentElement, selector);
  }
  if (fn) {
    forEach(elements, fn);
  }
  return elements || [];
};

/**
 * Find an element matching a selector, optionally run a function on it, and return it.
 *
 * @param  {HTMLElement} parentElement  An optional element under which to find an element.
 * @param  {String}      selector       A simple selector for finding an element.
 * @return {function}    fn             An optional function to run on a matching element.
 */
var one = function (parentElement, selector, fn) {
  return all(parentElement, selector, fn)[0];
};
/**
 * An Emitter is an EventEmitter-style object.
 */
var Emitter = function () {
  // Lazily apply the prototype so that Emitter can minify out if not used.
  // TODO: Find out if this is still necessary with UglifyJS.
  Emitter.prototype = EmitterPrototype;
};

/**
 * Expose Emitter methods which can be applied lazily.
 */
var EmitterPrototype = {

  _on: function (event, fn) {
    var self = this;
    var events = self._events || (self._events = {});
    var listeners = events[event] || (events[event] = []);
    listeners.push(fn);
    return self;
  },

  _once: function (event, fn) {
    var self = this;
    function f() {
      fn.apply(self, arguments);
      self._removeListener(event, f);
    }
    self._on(event, f);
    return self;
  },

  _emit: function (event) {
    var self = this;
    var listeners = self._listeners(event);
    var args = Array.prototype.slice.call(arguments, 1);
    forEach(listeners, function (listener) {
      listener.apply(self, args);
    });
    return self;
  },

  _listeners: function (event) {
    var self = this;
    var events = self._events || 0;
    var listeners = events[event] || [];
    return listeners;
  },

  _removeListener: function (event, fn) {
    var self = this;
    var listeners = self._listeners(event);
    var i = listeners.indexOf(fn);
    if (i > -1) {
      listeners.splice(i, 1);
    }
    return self;
  },

  _removeAllListeners: function (event, fn) {
    var self = this;
    var events = self._events || {};
    if (event) {
      delete events[event];
    }
    else {
      for (event in events) {
        delete events[event];
      }
    }
    return self;
  }

};
var CLICK = 'click';
var MOUSEDOWN = 'mousedown';
var MOUSEUP = 'mouseup';
var KEYDOWN = 'keydown';
var KEYUP = 'keyup';
var KEYPRESS = 'keypress';

/**
 * Bind a handler to listen for a particular event on an element.
 */
var bind = function (
  element,            // DOMElement|string: Element or ID of element to bind to.
  eventName,          // string|Array:      Name of event (e.g. "click", "mouseover", "keyup").
  eventHandler,       // function:          Function to run when the event is triggered. `eventHandler(element, event, target, customData)`
  customData          // object|:           Custom data to pass through to the event handler when it's triggered.
) {
  // Allow multiple events to be bound at once using a space-delimited string.
  var isEventArray = isArray(eventNames);
  if (isEventArray || contains(eventName, ' ')) {
    var eventNames = isEventArray ? eventName : splitBySpaces(eventName);
    forEach(eventNames, function (singleEventName) {
      bind(element, singleEventName, eventHandler, customData);
    });
    return;
  }

  // Ensure that we have an element, not just an ID.
  element = getElement(element);
  if (element) {

    // Invoke the event handler with the event information and the target element.
    var callback = function(event) {
      // Fall back to window.event for IE.
      event = event || window.event;
      // Fall back to srcElement for IE.
      var target = event.target || event.srcElement;
      // Defeat Safari text node bug.
      if (target.nodeType == 3) {
        target = getParent(target);
      }
      var relatedTarget = event.relatedTarget || event.toElement;
      if (eventName == 'mouseout') {
        while (relatedTarget = getParent(relatedTarget)) { // jshint ignore:line
          if (relatedTarget == target) {
            return;
          }
        }
      }
      var result = eventHandler(element, event, target, customData);
      if (result === false) {
        preventDefault(event);
      }
    };

    // Bind using whatever method we can use.
    if (element.addEventListener) {
      element.addEventListener(eventName, callback, true);
    }
    else if (element.attachEvent) {
      element.attachEvent('on' + eventName, callback);
    }
    else {
      element['on' + eventName] = callback;
    }

    var handlers = (element._handlers = element._handlers || {});
    var queue = (handlers[eventName] = handlers[eventName] || []);
    push(queue, eventHandler);
  }
};

/**
 * Bind an event handler on an element that delegates to specified child elements.
 */
var on = function (
  element,
  selector, // Supports "tag.class,tag.class" but does not support nesting.
  eventName,
  eventHandler,
  customData
) {
  if (isFunction(selector)) {
    customData = eventName;
    eventHandler = selector;
    eventName = element;
    selector = '';
    element = document;
  }
  else if (isFunction(eventName)) {
    customData = eventHandler;
    eventHandler = eventName;
    eventName = selector;
    selector = element;
    element = document;
  }
  var parts = selector.split(',');
  onHandler = function(element, event, target, customData) {
    forEach(parts, function (part) {
      var found = false;
      if ('#' + target.id == part) {
        found = true;
      }
      else {
        var tagAndClass = part.split('.');
        var tagName = tagAndClass[0].toUpperCase();
        var className = tagAndClass[1];
        if (!tagName || (target.tagName == tagName)) {
          if (!className || hasClass(target, className)) {
            found = true;
          }
        }
      }
      if (found) {
        var result = eventHandler(target, event, element, customData);
        if (result === false) {
          preventDefault(event);
        }
      }
    });
    // Bubble up to find a selector match because we didn't find one this time.
    target = getParent(target);
    if (target) {
      onHandler(element, event, target, customData);
    }
  };
  bind(element, eventName, onHandler, customData);
};

/**
 * Trigger an element event.
 */
var trigger = function (
  element,   // object:        Element to trigger an event on.
  event,     // object|String: Event to trigger.
  target,    // object|:       Fake target.
  customData // object|:       Custom data to pass to handlers.
) {
  if (isString(event)) {
    event = {type: event};
  }
  if (!target) {
    customData = target;
    target = element;
  }
  event._triggered = true;

  var handlers = element._handlers;
  if (handlers) {
    var queue = handlers[event.type];
    forEach(queue, function (handler) {
      handler(element, event, target, customData);
    });
  }
  if (!event.cancelBubble) {
    element = getParent(element);
    if (element) {
      trigger(element, event, target, customData);
    }
  }
};

/**
 * Stop event bubbling.
 */
var stopPropagation = function (
  event // object: Event to be canceled.
) {
  if (event) {
    event.cancelBubble = true;
    if (event.stopPropagation) {
      event.stopPropagation();
    }
  }
  //+env:debug
  else {
    error('[Jymin] Called stopPropagation on a non-event.', event);
  }
  //-env:debug
};

/**
 * Prevent the default action for this event.
 * @param  {Object} event  Event to prevent from doing its default action.
 */
var preventDefault = function (event) {
  if (event) {
    if (event.preventDefault) {
      event.preventDefault();
    }
  }
  //+env:debug
  else {
    error('[Jymin] Called preventDefault on a non-event.', event);
  }
  //-env:debug
};

/**
 * Bind an event handler for both the focus and blur events.
 */
var bindFocusChange = function (element, eventHandler, customData) {
  bind(element, 'focus', eventHandler, true, customData);
  bind(element, 'blur', eventHandler, false, customData);
};

/**
 * Bind an event handler for both the mouseenter and mouseleave events.
 */
var bindHover = function (element, eventHandler, customData) {
  var ieVersion = getBrowserVersionOrZero('msie');
  var HOVER_OVER = 'mouse' + (ieVersion ? 'enter' : 'over');
  var HOVER_OUT = 'mouse' + (ieVersion ? 'leave' : 'out');
  bind(element, HOVER_OVER, eventHandler, true, customData);
  bind(element, HOVER_OUT, eventHandler, false, customData);
};

/**
 * Bind an event handler for both the mouseenter and mouseleave events.
 */
var onHover = function (element, tagAndClass, eventHandler, customData) {
  on(element, tagAndClass, 'mouseover', eventHandler, true, customData);
  on(element, tagAndClass, 'mouseout', eventHandler, false, customData);
};

/**
 * Bind an event handler for both the mouseenter and mouseleave events.
 */
var bindClick = function (element, eventHandler, customData) {
  bind(element, 'click', eventHandler, customData);
};

/**
 * Bind a callback to be run after window onload.
 */
var bindWindowLoad = function (callback, windowObject) {
  // Default to the run after the window we're in.
  windowObject = windowObject || window;
  // If the window is already loaded, run the callback now.
  if (isLoaded(windowObject.document)) {
    callback();
  }
  // Otherwise, defer the callback.
  else {
    bind(windowObject, 'load', callback);
  }
};

/**
 * Return true if the object is loaded (signaled by its readyState being "loaded" or "complete").
 * This can be useful for the documents, iframes and scripts.
 */
var isLoaded = function (object) {
  var state = object.readyState;
  // In all browsers, documents will reach readyState=="complete".
  // In IE, scripts can reach readyState=="loaded" or readyState=="complete".
  // In non-IE browsers, we can bind to script.onload instead of checking script.readyState.
  return state == 'complete' || (object.tagName == 'script' && state == 'loaded');
};

/**
 * Focus on a specified element.
 */
var focusElement = function (element, delay) {
  var focus = function () {
    element = getElement(element);
    if (element) {
      var focusMethod = element.focus;
      if (isFunction(focusMethod)) {
        focusMethod.call(element);
      }
      else {
        //+env:debug
        error('[Jymin] Element does not exist, or has no focus method', element);
        //-env:debug
      }
    }
  };
  if (isUndefined(delay)) {
    focus();
  }
  else {
    setTimeout(focus, delay);
  }
};

/**
 * Stop events from triggering a handler more than once in rapid succession.
 */
var doOnce = function (method, args, delay) {
  clearTimeout(method.t);
  method.t = setTimeout(function () {
    clearTimeout(method.t);
    method.call(args);
  }, delay || 9);
};

/**
 * Set or reset a timeout, and save it for possible cancellation.
 */
var addTimeout = function (elementOrString, callback, delay) {
  var usingString = isString(elementOrString);
  var object = usingString ? addTimeout : elementOrString;
  var key = usingString ? elementOrString : '_timeout';
  clearTimeout(object[key]);
  if (callback) {
    if (isUndefined(delay)) {
      delay = 9;
    }
    object[key] = setTimeout(callback, delay);
  }
};

/**
 * Remove a timeout from an element or from the addTimeout method.
 */
var removeTimeout = function (elementOrString) {
  addTimeout(elementOrString, false);
};
/**
 * Get the type of a form element.
 */
var getType = function (input) {
  return ensureString(input.type)[0];
};

/**
 * Get the value of a form element.
 */
var getValue = function (
  input
) {
  input = getElement(input);
  if (input) {
    var type = getType(input);
    var value = input.value;
    var checked = input.checked;
    var options = input.options;
    if (type == 'c' || type == 'r') {
      value = checked ? value : null;
    }
    else if (input.multiple) {
      value = [];
      forEach(options, function (option) {
        if (option.selected) {
          push(value, option.value);
        }
      });
    }
    else if (options) {
      value = getValue(options[input.selectedIndex]);
    }
    return value;
  }
};

/**
 * Set the value of a form element.
 */
var setValue = function (
  input,
  value
) {
  input = getElement(input);
  if (input) {
    var type = getType(input);
    var options = input.options;
    if (type == 'c' || type == 'r') {
      input.checked = value ? true : false;
    }
    else if (options) {
      var selected = {};
      if (input.multiple) {
        if (!isArray(value)) {
          value = splitByCommas(value);
        }
        forEach(value, function (val) {
          selected[val] = true;
        });
      }
      else {
        selected[value] = true;
      }
      value = isArray(value) ? value : [value];
      forEach(options, function (option) {
        option.selected = !!selected[option.value];
      });
    }
    else {
      input.value = value;
    }
  }
};
/**
 * Return a history object.
 */
var getHistory = function () {
  var history = window.history || {};
  forEach(['push', 'replace'], function (key) {
    var fn = history[key + 'State'];
    history[key] = function (href) {
      if (fn) {
        fn.apply(history, [null, null, href]);
      } else {
        // TODO: Create a backward compatible history push.
      }
    };
  });
  return history;
};

/**
 * Push an item into the history.
 */
var historyPush = function (href) {
  getHistory().push(href);
};

/**
 * Replace the current item in the history.
 */
var historyReplace = function (href) {
  getHistory().replace(href);
};

/**
 * Go back.
 */
var historyPop = function (href) {
  getHistory().back();
};

/**
 * Listen for a history change.
 */
var onHistoryPop = function (callback) {
  bind(window, 'popstate', callback);
};
// JavaScript reserved words.
var reservedWordPattern = /^(break|case|catch|continue|debugger|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|this|throw|try|typeof|var|void|while|with)$/;

/**
 * Create JSON that doesn't necessarily have to be strict.
 */
var stringify = function (data, strict, stack) {
  if (isString(data)) {
    data = '"' + data.replace(/\n\r"/g, function (c) {
      return c == '\n' ? '\\n' : c == '\r' ? '\\r' : '\\"';
    }) + '"';
  }
  else if (isFunction(data)) {
    data = data.toString();
    if (strict) {
      data = stringify(data);
    }
  }
  else if (isDate(data)) {
    data = 'new Date(' + getTime(data) + ')';
    if (strict) {
      data = stringify(data);
    }
  }
  else if (data && isObject(data)) {
    stack = stack || [];
    var isCircular = false;
    forEach(stack, function (item, index) {
      if (item == data) {
        isCircular = true;
      }
    });
    if (isCircular) {
      return null;
    }
    push(stack, data);
    var parts = [];
    var before, after;
    if (isArray(data)) {
      before = '[';
      after = ']';
      forEach(data, function (value) {
        push(parts, stringify(value, strict, stack));
      });
    }
    else {
      before = '{';
      after = '}';
      forIn(data, function (key, value) {
        if (strict || reservedWordPattern.test(key) || /(^\d|[^\w$])/.test(key)) {
          key = '"' + key + '"';
        }
        push(parts, key + ':' + stringify(value, strict, stack));
      });
    }
    pop(stack);
    data = before + parts.join(',') + after;
  }
  else {
    data = '' + data;
  }
  return data;
};

/**
 * Parse JavaScript and return a value.
 */
var parse = function (value) {
  try {
    var evil = window.eval; // jshint ignore:line
    evil('eval.J=' + value);
    return evil.J;
  }
  catch (e) {
    //+env:debug
    error('[Jymin] Could not parse JS: ' + value);
    //-env:debug
  }
};

/**
 * Execute JavaScript.
 */
var execute = function (text) {
  parse('0;' + text);
};

/**
 * Parse a value and return a boolean no matter what.
 */
var parseBoolean = function (value, alternative) {
  value = parse(value);
  return isBoolean(value) ? value : (alternative || false);
};

/**
 * Parse a value and return a number no matter what.
 */
var parseNumber = function (value, alternative) {
  value = parse(value);
  return isNumber(value) ? value : (alternative || 0);
};

/**
 * Parse a value and return a string no matter what.
 */
var parseString = function (value, alternative) {
  value = parse(value);
  return isString(value) ? value : (alternative || '');
};

/**
 * Parse a value and return an object no matter what.
 */
var parseObject = function (value, alternative) {
  value = parse(value);
  return isObject(value) ? value : (alternative || {});
};

/**
 * Parse a value and return a number no matter what.
 */
var parseArray = function (value, alternative) {
  value = parse(value);
  return isObject(value) ? value : (alternative || []);
};
/**
 * Log values to the console, if it's available.
 */
var error = function () {
  ifConsole('error', arguments);
};

/**
 * Log values to the console, if it's available.
 */
var warn = function () {
  ifConsole('warn', arguments);
};

/**
 * Log values to the console, if it's available.
 */
var info = function () {
  ifConsole('info', arguments);
};

/**
 * Log values to the console, if it's available.
 */
var log = function () {
  ifConsole('log', arguments);
};

/**
 * Log values to the console, if it's available.
 */
var trace = function () {
  ifConsole('trace', arguments);
};

/**
 * Log values to the console, if it's available.
 */
var ifConsole = function (method, args) {
  var console = window.console;
  if (console && console[method]) {
    console[method].apply(console, args);
  }
};
/**
 * If the argument is numeric, return a number, otherwise return zero.
 * @param Object n
 */
var ensureNumber = function (
  number,
  defaultNumber
) {
  defaultNumber = defaultNumber || 0;
  number *= 1;
  return isNaN(number) ? defaultNumber : number;
};

/**
 * Left-pad a number with zeros if it's shorter than the desired length.
 */
var zeroFill = function (
  number,
  length
) {
  number = ensureString(number);
  // Repurpose the lenth variable to count how much padding we need.
  length = Math.max(length - number.length, 0);
  return (new Array(length + 1)).join('0') + number;
};
/**
 * Iterate over an object's keys, and call a function on each key value pair.
 */
var forIn = function (object, callback) {
  if (object) {
    for (var key in object) {
      var result = callback(key, object[key], object);
      if (result === false) {
        break;
      }
    }
  }
};

/**
 * Iterate over an object's keys, and call a function on each (value, key) pair.
 */
var forOf = function (object, callback) {
  if (object) {
    for (var key in object) {
      var result = callback(object[key], key, object);
      if (result === false) {
        break;
      }
    }
  }
};

/**
 * Decorate an object with properties from another object.
 */
var decorateObject = function (object, decorations) {
  if (object && decorations) {
    forIn(decorations, function (key, value) {
      object[key] = value;
    });
  }
  return object;
};

/**
 * Ensure that a property exists by creating it if it doesn't.
 */
var ensureProperty = function (object, property, defaultValue) {
  var value = object[property];
  if (!value) {
    value = object[property] = defaultValue;
  }
  return value;
};
/**
 * Get the local storage object.
 *
 * @return {Object}  The local storage object.
 */
var getStorage = function () {
  return window.localStorage;
};

/**
 * Fetch an item from local storage.
 *
 * @param  {string} key  A key to fetch an object by
 * @return {Object}      The object that was fetched and deserialized
 */
var fetch = function (key) {
  var storage = getStorage();
  return storage ? parse(storage.getItem(key)) : 0;
};

/**
 * Store an item in local storage.
 *
 * @param  {string} key    A key to store and fetch an object by
 * @param  {Object} value  A value to be stringified and stored
 */
var store = function (key, value) {
  var storage = getStorage();
  if (storage) {
    storage.setItem(key, stringify(value));
  }
};
/**
 * Ensure a value is a string.
 */
var ensureString = function (
  value
) {
  return isString(value) ? value : '' + value;
};

/**
 * Return true if the string contains the given substring.
 */
var contains = function (
  string,
  substring
) {
  return ensureString(string).indexOf(substring) > -1;
};

/**
 * Return true if the string starts with the given substring.
 */
var startsWith = function (
  string,
  substring
) {
  return ensureString(string).indexOf(substring) == 0; // jshint ignore:line
};

/**
 * Trim the whitespace from a string.
 */
var trim = function (
  string
) {
  return ensureString(string).replace(/^\s+|\s+$/g, '');
};

/**
 * Split a string by commas.
 */
var splitByCommas = function (
  string
) {
  return ensureString(string).split(',');
};

/**
 * Split a string by spaces.
 */
var splitBySpaces = function (
  string
) {
  return ensureString(string).split(' ');
};

/**
 * Return a string, with asterisks replaced by values from a replacements array.
 */
var decorateString = function (
  string,
  replacements
) {
  string = ensureString(string);
  forEach(replacements, function(replacement) {
    string = string.replace('*', replacement);
  });
  return string;
};

/**
 * Perform a RegExp match, and call a callback on the result;
  */
var match = function (
  string,
  pattern,
  callback
) {
  var result = string.match(pattern);
  if (result) {
    callback.apply(string, result);
  }
};

/**
 * Reduce a string to its alphabetic characters.
 */
var extractLetters = function (
  string
) {
  return ensureString(string).replace(/[^a-z]/ig, '');
};

/**
 * Reduce a string to its numeric characters.
 */
var extractNumbers = function (
  string
) {
  return ensureString(string).replace(/[^0-9]/g, '');
};

/**
 * Returns a lowercase string.
 */
var lower = function (
  object
) {
  return ensureString(object).toLowerCase();
};

/**
 * Returns an uppercase string.
 */
var upper = function (
  object
) {
  return ensureString(object).toUpperCase();
};

/**
 * Return an escaped value for URLs.
 */
var escape = function (value) {
  return encodeURIComponent(value);
};

/**
 * Return an unescaped value from an escaped URL.
 */
var unescape = function (value) {
  return decodeURIComponent(value);
};

/**
 * Returns a query string generated by serializing an object and joined using a delimiter (defaults to '&')
 */
var buildQueryString = function (
  object
) {
  var queryParams = [];
  forIn(object, function(key, value) {
    queryParams.push(escape(key) + '=' + escape(value));
  });
  return queryParams.join('&');
};

/**
 * Return the browser version if the browser name matches or zero if it doesn't.
 */
var getBrowserVersionOrZero = function (
  browserName
) {
  match = new RegExp(browserName + '[ /](\\d+(\\.\\d+)?)', 'i').exec(navigator.userAgent);
  return match ? +match[1] : 0;
};
/**
 * Return true if a variable is a given type.
 */
var isType = function (
  value, // mixed:  The variable to check.
  type   // string: The type we're checking for.
) {
  return typeof value == type;
};

/**
 * Return true if a variable is undefined.
 */
var isUndefined = function (
  value // mixed:  The variable to check.
) {
  return isType(value, 'undefined');
};

/**
 * Return true if a variable is boolean.
 */
var isBoolean = function (
  value // mixed:  The variable to check.
) {
  return isType(value, 'boolean');
};

/**
 * Return true if a variable is a number.
 */
var isNumber = function (
  value // mixed:  The variable to check.
) {
  return isType(value, 'number');
};

/**
 * Return true if a variable is a string.
 */
var isString = function (
  value // mixed:  The variable to check.
) {
  return isType(value, 'string');
};

/**
 * Return true if a variable is a function.
 */
var isFunction = function (
  value // mixed:  The variable to check.
) {
  return isType(value, 'function');
};

/**
 * Return true if a variable is an object.
 */
var isObject = function (
  value // mixed:  The variable to check.
) {
  return isType(value, 'object');
};

/**
 * Return true if a variable is an instance of a class.
 */
var isInstance = function (
  value,     // mixed:  The variable to check.
  protoClass // Class|: The class we'ere checking for.
) {
  return value instanceof (protoClass || Object);
};

/**
 * Return true if a variable is an array.
 */
var isArray = function (
  value // mixed:  The variable to check.
) {
  return isInstance(value, Array);
};

/**
 * Return true if a variable is a date.
 */
var isDate = function (
  value // mixed:  The variable to check.
) {
  return isInstance(value, Date);
};
/**
 * Get the current location host.
 */
var getHost = function () {
  return location.host;
};

/**
 * Get the base of the current URL.
 */
var getBaseUrl = function () {
  return location.protocol + '//' + getHost();
};

/**
 * Get the query parameters from a URL.
 */
var getQueryParams = function (
  url
) {
  url = url || location.href;
  var query = url.substr(url.indexOf('?') + 1).split('#')[0];
  var pairs = query.split('&');
  query = {};
  forEach(pairs, function (pair) {
    var eqPos = pair.indexOf('=');
    var name = pair.substr(0, eqPos);
    var value = pair.substr(eqPos + 1);
    query[name] = value;
  });
  return query;
};

/**
 * Get the query parameters from the hash of a URL.
 */
var getHashParams = function (
  hash
) {
  hash = (hash || location.hash).replace(/^#/, '');
  return hash ? getQueryParams(hash) : {};
};
