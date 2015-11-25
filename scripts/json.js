/* global Cute */

/**
 * Create a circular-safe JSON string.
 */
Cute.safeStringify = function (data, quote, stack) {
  if (Cute.isString(data)) {
    data = quote + data.replace(/\n\r"'/g, function (c) {
      return c === '\n' ? '\\n' : c === '\r' ? '\\r' : c === quote ? '\\' + c : c === '"' ? '&quot;' : "'"
    }) + quote
  } else if (Cute.isFunction(data) || Cute.isUndefined(data)) {
    return null
  } else if (data && Cute.isObject(data)) {
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
        parts.push(Cute.safeStringify(value, quote, stack))
      })
    } else {
      before = '{'
      after = '}'
      Cute.each(data, function (value, key) {
        parts.push(Cute.stringify(key) + ':' + Cute.safeStringify(value, stack))
      })
    }
    stack.pop()
    data = before + parts.join(',') + after
  } else {
    data = '' + data
  }
  return data
}

/**
 * Create a JSON string.
 */
// +browser:old
Cute.stringify = Cute.safeStringify
// -browser:old
// +browser:ok
Cute.stringify = JSON.stringify
// -browser:ok

/**
 * Create a JSON-ish string.
 */
Cute.attrify = function (data) {
  return Cute.safeStringify(data, "'")
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
  } catch (e) {
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
Cute.execute = function (text) {
  Cute.parse('0;' + text)
}

/**
 * Parse a value and return a boolean no matter what.
 */
Cute.parseBoolean = function (value, alternative) {
  value = Cute.parse(value)
  return Cute.isBoolean(value) ? value : (alternative || false)
}

/**
 * Parse a value and return a number no matter what.
 */
Cute.parseNumber = function (value, alternative) {
  value = Cute.parse(value)
  return Cute.isNumber(value) ? value : (alternative || 0)
}

/**
 * Parse a value and return a string no matter what.
 */
Cute.parseString = function (value, alternative) {
  value = Cute.parse(value)
  return Cute.isString(value) ? value : ('' + alternative)
}

/**
 * Parse a value and return an object no matter what.
 */
Cute.parseObject = function (value, alternative) {
  value = Cute.parse(value)
  return Cute.isObject(value) ? value : (alternative || {})
}

/**
 * Parse a value and return a number no matter what.
 */
Cute.parseArray = function (value, alternative) {
  value = Cute.parse(value)
  return Cute.isObject(value) ? value : (alternative || [])
}
