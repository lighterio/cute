/**
 * Check whether a value is undefined.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is undefined.
 */
Cute.isUndefined = function (value) {
  return typeof value === 'undefined'
}

/**
 * Check whether a value is a boolean.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is a boolean.
 */
Cute.isBoolean = function (value) {
  return typeof value === 'boolean'
}

/**
 * Check whether a value is a number.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is a number.
 */
Cute.isNumber = function (value) {
  return typeof value === 'number'
}

/**
 * Check whether a value is a string.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is a string.
 */
Cute.isString = function (value) {
  return typeof value === 'string'
}

/**
 * Check whether a value is a function.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is a function.
 */
Cute.isFunction = function (value) {
  return typeof value === 'function'
}

/**
 * Check whether a value is an object.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is an object.
 */
Cute.isObject = function (value) {
  return typeof value === 'object'
}

/**
 * Check whether a value is null.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is null.
 */
Cute.isNull = function (value) {
  return value === null
}

/**
 * Check whether a value is an array.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is an array.
 */
Cute.isArray = function (value) {
  return value instanceof Array
}

/**
 * Check whether a value is a date.
 *
 * @param  {Any}     value  A value to check.
 * @return {boolean}        True if the value is a date.
 */
Cute.isDate = function (value) {
  return value instanceof Date
}
