// When not in debug mode, make the logging functions do nothing.
Cute.error = Cute.no
Cute.warn = Cute.no
Cute.info = Cute.no
Cute.log = Cute.no
Cute.trace = Cute.no

//+env:debug

/**
 * Log values to the console, if it's available.
 */
Cute.error = function () {
  Cute.ifConsole('error', arguments)
}

/**
 * Log values to the console, if it's available.
 */
Cute.warn = function () {
  Cute.ifConsole('warn', arguments)
}

/**
 * Log values to the console, if it's available.
 */
Cute.info = function () {
  Cute.ifConsole('info', arguments)
}

/**
 * Log values to the console, if it's available.
 */
Cute.log = function () {
  Cute.ifConsole('log', arguments)
}

/**
 * Log values to the console, if it's available.
 */
Cute.trace = function () {
  Cute.ifConsole('trace', arguments)
}

/**
 * Log values to the console, if it's available.
 */
Cute.ifConsole = function (method, args) {
  var console = window.console
  if (console && console[method]) {
    console[method].apply(console, args)
  }
}

//-env:debug
