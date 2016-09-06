var fs = require('fs');
var Transform = require('stream').Transform;
var csv = require('csv-streamify');
var JSONStream = require('JSONStream');
var _ = require('lodash');

exports.definirTitulo = function (titulo, req, res, next) {
  res.locals.title = titulo;
  next();
};

exports.imprimirPagina = function (vista, req, res, next) {
  res.render(vista);
};

exports.getAlarms = function (req, res, next) {
  res.send('enviar lista de alarmas');
};

exports.streamAlarms = function (req, res, next) {
  var COLUMNS = ['timestamp','MSEC','sequence_number','alarm_id','alarm_class','resource','logged_by','reference','prev_state','log_action','final_state','alarm_message','generation_time']
  var parser = new Transform({objectMode: true});
  parser.header = null;
  parser._rawHeader = [];
  parser._transform = function (data, encoding, done) {
    if (!this.header) {
      this._rawHeader.push(data);
      if (data[0] === 'timestamp') {
        this.header = this._rawHeader;
        //this.push({header: this.header});
      }
    } else {
      this.push(_.zipObject(COLUMNS, data));
    }
    done();
  }

  var csvToJson = csv({objectMode: true});
  var jsonToStrings = JSONStream.stringify(false);


  var filename = __dirname + '/../../app_client/public/files' + '/alarms.CSV';
  var readStream = fs.createReadStream(filename);


  readStream.on('open', function () {
    readStream
      .pipe(csvToJson)
      .pipe(parser)
      .pipe(jsonToStrings)
      .on('data', function (doc) {
        console.log(doc);
      })
      .on('end', function (doc) {
        res.send('datos logueados');
      })
  })
};
