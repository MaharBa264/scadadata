var mongoose = require('mongoose');
var Alarm = mongoose.model('Alarm');
var ET = mongoose.model('ET');

exports.parseAndSave = function (stream, _type, cb) {
  'use strict';
  var readCount = 0;
  var writedCount = 0;
  var type = _type;
  stream.on('data', function (item) {
    readCount += 1;
    var _item = item;
    _item.tipo = type;
    if (type == 'AL') {
      Alarm
        .create(_item, function (err, itemSaved) {
          if (err) return;
          writedCount += 1;
        })
    } else {
      ET
        .create(_item, function (err, itemSaved) {
          if (err) return;
          writedCount += 1;
        })
    }
  })
    .on('end', function () {
      cb(readCount);
    })
};
