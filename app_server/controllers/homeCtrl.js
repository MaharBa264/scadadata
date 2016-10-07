var fs = require('fs');
var path = require('path');
//var Transform = require('stream').Transform;
//var csv = require('csv-streamify');
//var JSONStream = require('JSONStream');
//var _ = require('lodash');
var async = require('async');
var parser = require('./parser');
var mongoose = require('mongoose');
var dateFormat = require('dateformat');
var Alarm = mongoose.model('Alarm');
var ET = mongoose.model('ET');

exports.definirTitulo = function (titulo, req, res, next) {
  res.locals.title = titulo;
  next();
};

exports.imprimirPagina = function (vista, req, res, next) {
  res.render(vista);
};

var actualPage = 0;
var perPage = 100;

exports.getAlarms = function (req, res, next) {
  res.locals.path = req.path;
  if (!req.query.page) {
      actualPage = 0;
  } else {
      if (req.query.page == 'prev') {
      actualPage -= 1;
      if (actualPage < 0) {
        actualPage = 0;
      }
    } else {
      actualPage += 1;
    }
  }
  res.locals.actualPage = actualPage;
  var page = Math.max(0, actualPage);
  var COLUMNS = ['timestamp', 'alarm_id', 'alarm_class', 'resource', 'alarm_message', 'generation_time'];
  //['generation_time', 'alarm_message', 'final_state', 'log_action', 'prev_state', 'timestamp'];
  res.locals.columns = COLUMNS;
  var _select = COLUMNS.toString().replace(/,/g, ' ');
  Alarm
    .find({'tipo': 'AL'})
    .select(_select)
    .limit(perPage)
    .skip(perPage * page)
    .exec(function (err, alarms) {
      if (err) return;
      var _alarms = [];
      alarms.forEach(function (alarm, index) {
        alarm.timestamp = dateFormat(new Date(alarm.timestamp), 'dd-mmm-yyyy h:MM:ss.TT');
        alarm.generation_time = dateFormat(new Date(alarm.generation_time), 'dd-mmm-yyyy h:MM:ss.TT');
        _alarms.push(alarm);
      });
      res.locals.items = alarms;
      res.render('alarmList');
    })
};

exports.getCD = function (req, res, next) {
  res.locals.path = req.path;
  var tipo = req.params.type;
  if (!req.query.page) {
      actualPage = 0;
  } else {
      if (req.query.page == 'prev') {
      actualPage -= 1;
      if (actualPage < 0) {
        actualPage = 0;
      }
    } else {
      actualPage += 1;
    }
  }
  res.locals.actualPage = actualPage;
  var page = Math.max(0, actualPage);
  var COLUMNS = ['timestamp', 'point_id', '_VAL'];
  //['timestamp', 'MSEC', 'point_id', '_ENG', '_VAL', 'tipo'];
  res.locals.columns = COLUMNS;
  var _select = COLUMNS.toString().replace(/,/g, ' ');
  ET
    .find({'tipo': tipo})
    .select(_select)
    .limit(perPage)
    .skip(perPage * page)
    .sort({'timestamp': 'asc'})
    .exec(function (err, cds) {
      if (err) return;
      res.locals.items = cds;
      res.render('alarmList');
    })
};

exports.saveitems = function (req, res, next) {
  var dirToWatch = path.join(__dirname, '..', '..', 'app_client', 'public', 'files');
  var counter = 0;
  fs.readdir(dirToWatch, function (err, files) {
    async.forEachSeries(files, function (file, task_cb) {
      var _file = dirToWatch + '/' + file;
      parser.stream(_file, function (err, table) {
        if (err) return task_cb(err);
        counter += 1;
        console.log(table.toString());
        task_cb();
      })
    }, function (err) {
      if (err) next();
      res.render('summary', {
        title: 'Resumen',
        cant_items: counter
      });
    })
  })
};
