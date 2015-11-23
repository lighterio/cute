/**
 * Get the contents of a specified type of tag within a string of HTML.
 *
 * @param  {String}   html    [description]
 * @param  {String}   tagName [description]
 * @param  {Function} fn      [description]
 * @return {Array}            [description]
 */
Cute.tagContents = function (html, tagName, fn) {
  var pattern = Cute.tagPatterns[tagName]
  if (!pattern) {
    var flags = /^(html|head|title|body)$/.test(tagName) ? 'i' : 'gi'
    pattern = new RegExp('<' + tagName + '.*?>([\\s\\S]*?)<\\/' + tagName + '>', flags)
    Cute.tagPatterns[tagName] = pattern
  }
  var contents = []
  html.replace(pattern, function (match, content) {
    contents.push(content)
    if (fn) {
      fn(content)
    }
  })
  return contents
}

Cute.tagPatterns = {}
