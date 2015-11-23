var focusedElement

Cute.on('a,button,input,select,textarea', 'focus', function (element) {
  var focusMethod = element.focus
  if (focusMethod) {
    focusedElement = element
    Cute.removeTimeout(focusMethod)
  }
})

Cute.on('a,button,input,select,textarea', 'blur', function (element) {
  var focusMethod = element.focus
  if (focusMethod) {
    Cute.timer(focusMethod, function () {
      if (focusedElement === element) {
        focusedElement = null
      }
    })
  }
})
