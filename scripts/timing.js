

/**
 * Set or clear a timeout or interval. If set, save it for possible clearing.
 * The timer can either be added to the setTimer method itself, or it can
 * be added to an object provided (such as an HTMLElement).
 *
 * @param {Object|String} objectOrString  An object to bind a timer to, or a name to call it.
 * @param {Function}      fn              A function to run if the timer is reached.
 * @param {Integer}       delay           An optional delay in milliseconds.
 */
Cute.timer = function (objectOrString, fn, delay, isInterval) {
  var useString = Cute.isString(objectOrString)
  var object = useString ? Cute.timer : objectOrString
  var key = useString ? objectOrString : '_timeout'
  clearTimeout(object[key])
  if (fn) {
    if (Cute.isUndefined(delay)) {
      delay = 9
    }
    object[key] = (isInterval ? setInterval : setTimeout)(fn, delay)
  }
}

Cute.times = {}

Cute.now = function () {
  var perf = window.performance
  return perf && perf.now ? perf.now() : Date.now()
}

Cute.start = function (label) {
  Cute.times[label] = Cute.now()
}

Cute.end = function (label) {
  Cute.times[label] = Cute.now() - Cute.times[label]
}

Cute.beamTimes = function (label) {
  var times = []
  Cute.each(Cute.times, function (value, key) {
    times.push(key + ' ' + value.toFixed(3) + 'ms')
  })
  Beams.log(times.join(', '))
}
