/* global Cute */

/**
 * If the argument is numeric, return a number, otherwise return zero.
 *
 * @param  {Object} number  An object to convert to a number, if necessary.
 * @return {Number}         The number, or zero.
 */
Cute.ensureNumber = function (number) {
  return isNaN(number *= 1) ? 0 : number
}

/**
 * Left-pad a number with zeros if it's shorter than the desired length.
 *
 * @param  {Number} number  A number to pad.
 * @param  {Number} length  A length to pad to.
 * @return {String}         The zero-padded number.
 */
Cute.zeroFill = function (number, length) {
  number = '' + number
  // Repurpose the lenth variable to count how much padding we need.
  length = Math.max(length - number.length, 0)
  return (new Array(length + 1)).join('0') + number
}
