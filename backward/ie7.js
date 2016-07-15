Cute.xhr = function () {
  return window.XMLHttpRequest ? new XMLHttpRequest()
    : window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP')
    : 0
}
