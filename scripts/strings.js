

/**
 * Return true if the string contains the given substring.
 */
Cute.contains = function (string, substring) {
  return Cute.string(string).indexOf(substring) > -1
}

/**
 * Return true if the string starts with the given substring.
 */
Cute.startsWith = function (string, substring) {
  return Cute.string(string).indexOf(substring) === 0; // eslint-disable-line
}

/**
 * Trim the whitespace from a string.
 */
Cute.trim = function (string) {
  return Cute.string(string).replace(/^\s+|\s+$/g, '')
}

/**
 * Split a string by commas.
 */
Cute.split = function (string) {
  return Cute.string(string).split(',')
}

/**
 * Return a lowercase string.
 */
Cute.lower = function (string) {
  return Cute.string(string).toLowerCase()
}

/**
 * Return an uppercase string.
 */
Cute.upper = function (string) {
  return Cute.string(string).toUpperCase()
}

/**
 * Return an escaped value for URLs.
 */
Cute.escape = function (value) {
  return encodeURIComponent(Cute.string(value))
}

/**
 * Return an unescaped value from an escaped URL.
 */
Cute.unescape = function (value) {
  return decodeURIComponent(Cute.string(value))
}
