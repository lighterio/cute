var IO = 'io:'

// The ios server listens for GET and POST requests at /IO.
Cute.ioBase = '/IO?id='
Cute.ioUrl = Cute.ioBase
Cute.ioId = 0

// On disconnect, start retrying once a second, and back off to once a minute.
Cute.ioRetryMin = 1e3
Cute.ioRetryMax = 6e4
Cute.ioRetryBackoff = 2
Cute.ioRetryTimeout = Cute.ioRetryMin

// Until we connect, queue emissions.
Cute.ioQueue = []

// Keep a count of emissions so the server can de-duplicate.
Cute.ioNumber = 0

/**
 * Beam data up or down.
 *
 * @param  {Object}          name      The name of the data to send or receive.
 * @param  {Function|Object} fnOrData  The data handler or the data.
 */
Cute.io = function (name, fnOrData) {
  console.log('io')
  // Lazily initialize.
  if (!Cute.ioNumber) {
    Cute.ioInit()
  }
  if (Cute.isFunction(fnOrData)) {
    Cute.on(window, IO + name, fnOrData)
  } else if (name) {
    var data = fnOrData
    // +evn:debug
    Cute.log('[Beams] Emitting "' + name + '": ' + Cute.stringify(data) + '.')
    // -evn:debug
    Cute.ioQueue.push([++Cute.ioNumber, name, data])
    Cute.ioFlush()
  }
}

Cute.ioFlush = function () {
  if (Cute.ioQueue.length) {
    var queue = Cute.ioQueue
    Cute.ioQueue = []
    if (Cute.ioId) {
      send()
    }
  }
  // Try to emit data to the server.
  function send () {
    Cute.get(Cute.ioUrl + '&up', queue, function (data, status) {
      if (status === 200) {
        Cute.ioRetryTimeout = Cute.ioRetryMin
      } else {
        Cute.ioRetryTimeout = Math.min(Cute.ioRetryTimeout * Cute.ioRetryBackoff, Cute.ioRetryMax)
        setTimeout(send, Cute.ioRetryTimeout)
      }
    })
  }
}

/**
 * Lazily initialize.
 */
Cute.ioInit = function () {
  console.log('ioInit')
  Cute.ioNumber = 1

  // When we connect, set the client ID.
  Cute.io('connect', function (data) {
    Cute.ioId = data.id
    Cute.ioUrl = Cute.ioBase + Cute.ioId
    // +evn:debug
    Cute.log('[Beams] Set endpoint URL to "' + Cute.ioUrl + '".')
    // -evn:debug
    Cute.ioFlush()
  })

  // Allow the server to tell clients to refresh themselves.
  Cute.io('refresh', reload)

  // When the server shuts down, wait for it to come back, then refresh.
  Cute.io('exit', function () {
    Cute.io('ok', reload)
  })

  // When the page unloads, tell the server to remove this client.
  Cute.on(window, 'beforeunload', function () {
    Cute.io('unload')
  })

  function reload () {
    location.reload()
  }

  console.log('ioPoll')
  Cute.ioPoll()
}

/**
 * Poll for new messages.
 */
Cute.ioPoll = function () {
  // +evn:debug
  Cute.log('[Beams] Polling for messages at "' + Cute.ioUrl + '".')
  // -evn:debug
  console.trace('get')
  Cute.get(Cute.ioUrl + '&down', function (messages, status) {
    var delay = 0
    if (status === 200) {
      // Reset to the minimum retry delay.
      Cute.ioRetryTimeout = Cute.ioRetryMin

      // Trigger events for all messages received from the server.
      Cute.each(messages, function (pair) {
        Cute.emit(window, IO + pair[0], pair[1])
      })
    } else {
      // +evn:debug
      Cute.error('[Beams] Failed to connect to "' + Cute.ioUrl + '".')
      // -evn:debug

      // Signal that a io error occurred.
      Cute.emit(IO + 'error')

      // Try again later.
      delay = Cute.ioRetryTimeout * Cute.ioRetryBackoff
      if (delay > Cute.ioRetryMax) {
        delay = Cute.ioRetryMax
      }
    }
    Cute.wait(Cute.ioPoll, IO, Cute.ioPoll, delay)
  })
}
