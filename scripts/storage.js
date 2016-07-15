

/**
 * Get or set an item in local storage.
 *
 * @param  {String} key    A key to fetch an object by.
 * @param  {Any}    value  A value to be stringified and stored.
 * @return {Any}           The object that was fetched and deserialized
 */
Cute.persist = function (key, value) {
  var storage = window.localStorage
  if (storage) {
    if (Cute.isUndefined(value)) {
      value = Cute.parse(storage.getItem(key))
    } else {
      storage.setItem(key, Cute.stringify(value))
    }
  }
  return value
}
