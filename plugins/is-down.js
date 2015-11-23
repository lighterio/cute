// Possible event.which values.
Cute.LEFT_BUTTON = 1
Cute.MIDDLE_BUTTON = 2
Cute.RIGHT_BUTTON = 3

// Possible event.keyCode values.
Cute.ENTER_KEY = 13
Cute.SHIFT_KEY = 16
Cute.CTRL_KEY = 17
Cute.ALT_KEY = 18
Cute.COMMAND_KEY = 19
Cute.ESC_KEY = 27
Cute.SPACE_KEY = 32
Cute.LEFT_KEY = 37
Cute.UP_KEY = 38
Cute.RIGHT_KEY = 39
Cute.DOWN_KEY = 40

Cute.on('keydown,keyup', function (element, event, type) {
  Cute.on[event.keyCode] = (type !== 'keyup')
})

Cute.on('mousedown,mouseup', function (element, event, type) {
  Cute.on[event.which] = (type !== 'mouseup')
})
