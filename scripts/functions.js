/* global Cute */

/**
 * Apply arguments to an object method.
 *
 * @param  {Object}          object      An object with methods.
 * @param  {String}          methodName  A method name, which may exist on the object.
 * @param  {Arguments|Array} args        An arguments object or array to apply to the method.
 * @return {Object}                      The result returned by the object method.
 */
Cute.apply = function (object, methodName, args) {
  return ((object || 0)[methodName] || Cute.no).apply(object, args)
}
