/**
 * Create a circular-safe JSON (or JSON-like) string.
 *
 * @param  {Any}    data   Data to stringify.
 * @param  {String} quote  Double quote or single quote.
 * @param  {Array}  stack
 * @return {String}
 */
Cute.stringify = function (data, quote, stack) {
  quote = quote || '"'
  if (data && Cute.isFunction(data.toJSON)) {
    return Cute.string(data.toJSON())
  }
  if (Cute.isString(data)) {
    data = quote + data.replace(/\n\r"'/g, function (c) {
      return c === '\n' ? '\\n'
        : c === '\r' ? '\\r'
        : c === quote ? '\\' + c
        : c === '"' ? '&quot;' : "'"
    }) + quote
  } else if (Cute.isFunction(data) || Cute.isUndefined(data)) {
    return stack ? null : undefined
  } else if (data && Cute.isObject(data) && !(data instanceof Boolean) && !(data instanceof Number)) {
    stack = stack || []
    var isCircular
    Cute.each(stack, function (item) {
      if (item === data) {
        isCircular = 1
      }
    })
    if (isCircular) {
      return null
    }
    stack.push(data)
    var parts = []
    var before, after
    if (Cute.isArray(data)) {
      before = '['
      after = ']'
      Cute.each(data, function (value) {
        parts.push(Cute.stringify(value, quote, stack))
      })
    } else {
      before = '{'
      after = '}'
      Cute.each(data, function (value, key) {
        parts.push(Cute.stringify(key, quote) + ':' + Cute.stringify(value, quote, stack))
      })
    }
    stack.pop()
    data = before + parts.join(',') + after
  } else {
    data = Cute.string(data)
  }
  return data
}

/**
 * Create a JSON-ish string.
 */
Cute.attrify = function (data) {
  return Cute.stringify(data, "'")
}

/**
 * Parse JavaScript and return a value.
 */
Cute.parse = function (value, alternative) {
  try {
    /* eslint-disable */
    eval('eval.J=' + value)
    /* eslint-enable */
    value = eval.J
  } catch (ignore) {
    // +env:debug
    Cute.error('[Cute] Could not parse JS: ' + value)
    // -env:debug
    value = alternative
  }
  return value
}

/**
 * Execute JavaScript.
 */
Cute.execute = function (js) {
  Cute.parse('0;' + js)
}
