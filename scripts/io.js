// The ios server listens for GET and POST requests at /IO.
Cute._io = 'io:'
Cute._ioBase = '/IO?id='
Cute._ioUrl = Cute._ioBase
Cute._ioId = 0

// On disconnect, start retrying once a second, and back off to once a minute.
Cute._ioRetryMin = 1e3
Cute._ioRetryMax = 6e4
Cute._ioRetryBackoff = 2
Cute._ioRetryTimeout = Cute._ioRetryMin

// Until we connect, queue emissions.
Cute._ioQueue = []

// Keep a count of emissions so the server can de-duplicate.
Cute._ioNumber = 0

/**
 * Beam data up or down.
 *
 * @param  {Object}          name      The name of the data to send or receive.
 * @param  {Function|Object} fnOrData  The data handler or the data.
 */
Cute.io = function (name, fnOrData) {
  // Lazily initialize.
  if (!Cute._ioNumber) {
    Cute._ioInit()
  }
  if (Cute.isFunction(fnOrData)) {
    Cute.on(window, Cute._io + name, fnOrData)
  } else if (name) {
    var data = fnOrData
    // +evn:debug
    Cute.log('[Beams] Emitting "' + name + '": ' + Cute.stringify(data) + '.')
    // -evn:debug
    Cute._ioQueue.push([name, data, ++Cute._ioNumber])
    Cute._ioFlush()
  }
}

Cute._ioFlush = function () {
  if (Cute._ioId && Cute._ioQueue.length) {
    var queue = Cute._ioQueue
    Cute._ioQueue = []
    send()
  }
  // Try to emit data to the server.
  function send () {
    Cute.get(Cute._ioUrl + '&up', queue, function (data, status) {
      if (status === 200) {
        Cute._ioRetryTimeout = Cute._ioRetryMin
      } else {
        setTimeout(send, Cute._ioDelay())
      }
    })
  }
}

/**
 * Lazily initialize.
 */
Cute._ioInit = function () {
  Cute._ioNumber = 1

  // When we connect, set the client ID.
  Cute.io('connect', function (data) {
    Cute._ioId = data.id
    Cute._ioUrl = Cute._ioBase + Cute._ioId
    // +evn:debug
    Cute.log('[Beams] Set endpoint URL to "' + Cute._ioUrl + '".')
    // -evn:debug
    Cute._ioFlush()
  })

  // Allow the server to tell clients to reload themselves.
  Cute.io('reload', function () {
    location.reload()
  })

  // When the page unloads, tell the server to remove this client.
  Cute.on(window, 'beforeunload', function () {
    Cute.io('unload')
  })

  Cute._ioPoll()
}

/**
 * Poll for new messages.
 */
Cute._ioPoll = function () {
  // +evn:debug
  Cute.log('[Beams] Polling for messages at "' + Cute._ioUrl + '".')
  // -evn:debug
  Cute.get(Cute._ioUrl + '&down', function (messages, status) {
    var delay = 0
    if (status === 200) {
      // Reset to the minimum retry delay.
      Cute._ioRetryTimeout = Cute._ioRetryMin

      // Trigger events for all messages received from the server.
      for (var i = 0, l = messages.length; i < l; i++) {
        var item = messages[i]
        Cute.emit(window, Cute._io + item[0], item[1])
      }
      // Cute.each(messages, function (item) {
      // })
    } else {
      // +evn:debug
      Cute.error('[Beams] Failed to connect to "' + Cute._ioUrl + '".')
      // -evn:debug

      // Signal that a io error occurred.
      Cute.emit(Cute._io + 'error')

      // Try again later.
      delay = Cute._ioDelay()
    }
    Cute.wait(Cute._ioPoll, Cute._io, Cute._ioPoll, delay)
  })
}

Cute._ioDelay = function (reset) {
  Cute._ioRetryTimeout = Math.min(Cute._ioRetryTimeout * Cute._ioRetryBackoff, Cute._ioRetryMax)
  return Cute._ioRetryTimeout
}
