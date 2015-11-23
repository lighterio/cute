/**
 * Get or set the value of a form element.
 *
 * @param  {HTMLElement} input     A form element.
 * @param  {String}      newValue  An optional new value for the element.
 * @return {String|Array}          A value or values to set on the form element.
 */
Cute.value = function (input, newValue) {
  var type = input.type[0]
  var value = input.value
  var checked = input.checked
  var options = input.options
  var setNew = !Cute.isUndefined(newValue)
  if (type === 'c' || type === 'r') {
    if (setNew) {
      input.checked = newValue ? true : false
    } else {
      value = checked ? value : null
    }
  } else if (options) {
    if (setNew) {
      var selected = {}
      if (input.multiple) {
        newValue = Cute.isArray(newValue) ? newValue : [newValue]
        Cute.each(newValue, function (optionValue) {
          selected[optionValue] = 1
        })
      } else {
        selected[newValue] = 1
      }
      Cute.each(options, function (option) {
        option.selected = !!selected[option.value]
      })
    } else {
      value = Cute.value(options[input.selectedIndex])
    }
  } else if (setNew) {
    input.value = newValue
  }
  return value
}
