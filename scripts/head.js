/**
 * Get the head element from the document.
 */
Jymin.getHead = function () {
  var head = Jymin.all('head')[0];
  return head;
};

/**
 * Get the body element from the document.
 */
Jymin.getBody = function () {
  var body = Jymin.all('body')[0];
  return body;
};

/**
 * Insert an external JavaScript file.
 *
 * @param  {String}   src  A source URL of a script to insert.
 * @param  {function} fn   An optional function to run when the script loads.
 */
Jymin.insertScript = function (src, fn) {
  var head = Jymin.getHead();
  var script = Jymin.addElement(head, 'script');
  if (fn) {
    Jymin.bindReady(script, fn);
  }
  script.async = 1;
  script.src = src;
};

/**
 * Insert CSS text to the page.
 *
 * @param  {String} css  CSS text to be inserted.
 */
Jymin.insertCss = function (css) {
  var head = Jymin.getHead();
  var style = Jymin.addElement(head, 'style?type=text/css', css);
  (style.styleSheet || 0).cssText = css;
};
