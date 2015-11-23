/**
 * Get the head element from the document.
 */
Cute.getHead = function () {
  var head = Cute.all('head')[0]
  return head
}

/**
 * Get the body element from the document.
 */
Cute.getBody = function () {
  var body = Cute.all('body')[0]
  return body
}

/**
 * Insert an external JavaScript file.
 *
 * @param  {String}   src  A source URL of a script to insert.
 * @param  {function} fn   An optional function to run when the script loads.
 */
Cute.js = function (src, fn) {
  var head = Cute.getHead()
  var script = Cute.add(head, 'script')
  if (fn) {
    Cute.ready(script, fn)
  }
  script.async = 1
  script.src = src
}

/**
 * Insert CSS text to the page.
 *
 * @param  {String} css  CSS text to be inserted.
 */
Cute.css = function (css) {

  // Allow CSS pixel sizes to be scaled using a window property.
  var zoom = window._zoom
  if (zoom && zoom > 1) {
    css = Cute.zoomCss(css)
  }

  // Insert CSS into the document head.
  var head = Cute.getHead()
  var style = Cute.add(head, 'style?type=text/css', css)
  var sheet = style.styleSheet
  if (sheet) {
    sheet.cssText = css
  }
}

/**
 * Scale CSS pixel sizes using a window property.
 *
 * @param  {String} css  CSS text to be zoomed.
 */
Cute.zoomCss = function (css) {
  var zoom = window._zoom || 1
  return css.replace(/([\.\d]+)px\b/g, function (match, n) {
    return Math.floor(n * zoom) + 'px'
  })
}
