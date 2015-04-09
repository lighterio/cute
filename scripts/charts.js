/**
 * Get an XMLHttpRequest object (or ActiveX object in old IE).
 *
 * @return {XMLHttpRequest}   The request object.
 */
Jymin.getChartColors = function () {
  var colors = Jymin.getChartColors._cache;
  if (!colors) {
    var map = {};
    var string =
      '03f290c00fc00dfb0f00605090307bf0f7409f9f7a07fdf0' +
      'f97686f09f8074872d8a0f05a200a7633bcf230bd90b1908' +
      '014c89f7a0ff045faf78304a9dcb9798eb80402df70fcfd6' +
      '6000899f574be6f0f7f640536685a4a54afdfb609fe5b666';
    colors = [];
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 63; j++) {
        var background = string.substr(j * 3 + i, 3);
        var border = background.replace(/[1-9a-f]/g, function (n) {
          return Math.ceil(new Number('0x' + n) / 1.7);
        });
        if (!map[border]) {
          map[border] = 1;
          colors.push({background: background, border: border});
        }
      }
    }
    Jymin.getChartColors._cache = colors;
  }
  console.log(colors.length);
  return colors;
};
