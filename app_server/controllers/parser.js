var Transform = require('stream').Transform;
var fs = require('fs');
var csv = require('csv-streamify');
var JSONStream = require('JSONStream');
var _ = require('lodash');
var consola = require('./consola');
var mongoose = require('mongoose');
var Alarm = mongoose.model('Alarm');
var Filename = mongoose.model('Filename');
var Table = require('cli-table');

var table = new Table();

var arrayStreams = [];

// parse csv -> save to mongo
exports.stream = function (path, callback) {
  'use strict';
  // mostrar el encabezado
  //consola.newFileHeader();
  var TYPE= '';
  let splited = path.split('/');
  let filename = splited[splited.length - 1];
  switch (filename.substring(0, 2)) {
    case 'AL':
      TYPE = 'AL'
      break;
    case 'CD':
      TYPE = 'CD'
      break;
    case 'ET':
      TYPE = 'ET'
      break;
    default:
      console.log(`unknow type ${filename}`);
      return callback({'err':`No se puede parsear ${filename}. Formato de nombre desconocido.`});
  }
  // mostrar el nombre de archivo
  //consola.showFilename(filename)
  table.push({'NUEVO ARCHIVO': filename});

  //chequear que no se haya guardado este file
  Filename
    .find({filename: filename}, function (err, name) {
      // crea el filename si no esta en la base
      if (!name || name === null || name == '') {
        // mostrar que esta creando el filename
        //consola.creatingFilename(filename);
        Filename.create({filename: filename}, function (err, file) {
          if (err) {
            // muestra si hay error al guardar el filename
            //consola.showErrorSavingFilename(err)
            table.push({'Error al guardar': err});
            return callback(err);
          }
          // si no hay error, inicia el parser
          //consola.startingParser(filename)
          var csvToJson = csv({objectMode:true, columns: true, newline: '\r\n'});
          var readStream = fs.createReadStream(path);
          var itemParser = require('./item_parser');
          itemParser.parseAndSave(readStream.pipe(csvToJson), TYPE, function (rc) {
            // muestra el total de filas procesadas
            //consola.showProcessed(rc)
            table.push({'filas procesadas': rc});
            table.push({'Fin':'...'});
            fs.unlink(path);
            var table_enviar = table;
            table = new Table();
            callback(null, table_enviar);
          })
        });
      } else {
        // avisar que el filename ya esta en la base.
        //consola.fileInDB(filename)
        table.push({'Ya esta en la base':'Ignorando Archivo'});
        table.push({'Fin':'...'});
        fs.unlink(path);
        var table_enviar = table;
        table = new Table();
        return callback(null, table_enviar);
      }
    });

};
