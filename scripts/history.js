/* global Cute */

/**
 * Push, replace or pop a history item.
 *
 * @param  {String}  href   An href, if not popping.
 * @param  {Boolean} isNew  Whether the URL should be pushed as a new entry.
 */
Cute.history = function (href, isNew) {
  var history = window.history
  if (history) {
    if (href) {
      try {
        var method = isNew ? 'push' : 'replace'
        history[method + 'State'](null, null, href)
      } catch (ignore) {
        // TODO: Create a hash-based history push for old browsers.
      }
    } else {
      history.back()
    }
  }
}
