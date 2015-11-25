/* global Cute */

/**
 * Return true if the string contains the given substring.
 */
Cute.contains = function (string, substring) {
  return ('' + string).indexOf(substring) > -1
}

/**
 * Return true if the string starts with the given substring.
 */
Cute.startsWith = function (string, substring) {
  return ('' + string).indexOf(substring) === 0; // jshint ignore:line
}

/**
 * Trim the whitespace from a string.
 */
Cute.trim = function (string) {
  return ('' + string).replace(/^\s+|\s+$/g, '')
}

/**
 * Split a string by commas.
 */
Cute.split = function (string) {
  return ('' + string).split(',')
}

/**
 * Return a lowercase string.
 */
Cute.lower = function (object) {
  return ('' + object).toLowerCase()
}

/**
 * Return an uppercase string.
 */
Cute.upper = function (object) {
  return ('' + object).toUpperCase()
}

/**
 * Return an escaped value for URLs.
 */
Cute.escape = function (value) {
  return encodeURIComponent('' + value)
}

/**
 * Return an unescaped value from an escaped URL.
 */
Cute.unescape = function (value) {
  return decodeURIComponent('' + value)
}
