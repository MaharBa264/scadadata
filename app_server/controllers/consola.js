exports.newFileHeader = function () {
  console.log(
    `||============================================================================||
||============================================================================||
||                        NUEVO ARCHIVO DETECTADO                             ||
||                                                                            ||`);
};

exports.showFilename = function (filename) {
  console.log(
`|| El nombre del archivo es: ${filename}
||                                                                            ||`);
};

exports.creatingFilename = function (filename) {
  console.log(
`|| ${filename} No esta en la base, creando.`);
};

exports.showErrorSavingFilename = function (err) {
  console.log(
`|| Error al guardar el nombre de archivo en la base.                          ||
${err}`);
};

exports.startingParser = function (filename) {
  console.log(
`|| ${filename} creado. Iniciando parsear CSV...`);
};

exports.showProcessed = function (rc) {
  console.log(
`|| ${rc} filas procesadas.`);
};

exports.fileInDB = function (filename) {
  console.log(
`|| ${filename} ya esta en la base de datos.
||                                                                            ||`);
  console.log(
`|| Ignorando archivo.                                                         ||`);
};
