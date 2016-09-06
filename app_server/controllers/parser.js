var Transform = require('stream').Transform;
var fs = require('fs');
var csv = require('csv-streamify');
var JSONStream = require('JSONStream');
var _ = require('lodash');
var mongoose = require('mongoose');
var Alarm = mongoose.model('Alarm');

exports.parse = function (path, cb) {

};

exports.stream = function (path) {
  var readableStream = fs.createReadStream(path);

  var COLUMNS = ['timestamp','MSEC','sequence_number','alarm_id','alarm_class','resource','logged_by','reference','prev_state','log_action','final_state','alarm_message','generation_time'];

  var csvToJson = csv({objectMode:true});

  var parser = new Transform({objectMode:true});
  var resultados = [];


  parser._transform = function (data, encoding, done) {
    resultados.push(_.zipObject(COLUMNS, data));
    this.push(_.zipObject(COLUMNS, data));
    done();
  }

  var jsonToStrings = JSONStream.stringify(false);

  readableStream
    .pipe(csvToJson)
    .pipe(parser)
    .pipe(jsonToStrings)

  readableStream.on('end', function () {
      var cuenta = 0;
      console.log(`finished to parse ${path}`);
      resultados.splice(0, 1);
      resultados.forEach(function (alarm) {
        Alarm
          .create(alarm, function (err) {
            if (err) {
              return console.log(err);
            }
            cuenta = cuenta + 1;
            console.log(cuenta + ' de ' + resultados.length);
            if (cuenta == resultados.length) {
              resultados = [];
              console.log(`${cuenta} registros guardados.`);
            }
          });
      });
      fs.unlink(path);
    });
}
