/**
 * Scroll a page to a position or element.
 *
 * @param  {Integer|String|Object} to         A name, ID, element or Top/Left.
 * @param  {String}                direction  Default: "Top".
 */
Cute.scroll = function (to, direction) {
  direction = direction || 'Top'
  if (Cute.isString(to)) {
    to = Cute.one('a[name=' + to + '],#' + to)
  }
  if (to && Cute.isObject(to)) {
    var element = to
    to = 0
    while (element) {
      to += element['offset' + direction] || 0
      element = element.offsetParent
    }
  }
  var body = Cute.body()
  var key = 'scroll' + direction
  if (Cute.isNumber(to)) {
    body[key] = document.documentElement[key] = to
  }
  return body[key]
}

/**
 * Set style properties on a given element.
 *
 * @param  {DOMElement} element  Element to set style properties on.
 * @param  {Object}     styles   Optional style property map.
 * @return {Object}              Style property of the element.
 */
Cute.style = function (element, styles) {
  var style = (element || 0).style || 0
  Cute.each(styles, function (value, key) {
    style[key] = value
  })
  return style
}

/**
 * Get or set the width and height of an element.
 *
 * @param  {DOMElement} element  Element to measure or resize.
 * @param  {Array}      size     Optional width and height.
 * @return {Array}               Width and height.
 */
Cute.size = function (element, size) {
  element = element || 0
  var width = element.offsetWidth || size[0]
  var height = element.offsetHeight || size[1]
  Cute.style(element, {width: width, height: height})
  return [width, height]
}

/**
 * Get or set the left and top of an element.
 *
 * @param  {DOMElement} element  Element to measure or resize.
 * @param  {Array}      size     Optional left and top.
 * @return {Array}               Left and top.
 */
Cute.move = function (element, size) {
  element = element || 0
  var left = element.offsetLeft || size[0]
  var top = element.offsetTop || size[1]
  Cute.style(element, {left: left, top: top})
  return [left, top]
}

/**
 * Get the width and height of the viewport as an array.
 *
 * @return {Array} [width, height]
 */
Cute.viewport = function () {
  function dim (key) {
    return Math.max(document.documentElement['client' + key], window['inner' + key] || 0)
  }
  return [dim('Width'), dim('Height')]
}
