var express = require('express');
var router = express.Router();
var homeCtrl = require('../controllers/homeCtrl');
var _ = require('lodash');

/* GET home page. */
router.get('/', [
  _.partial(homeCtrl.definirTitulo, 'Datos Trafos'),
  _.partial(homeCtrl.imprimirPagina, 'index')
]);

router.get('/alarmlist', homeCtrl.getAlarms);
router.get('/cdlist/:type', homeCtrl.getCD);
router.get('/etlist/:type', homeCtrl.getCD);

router.get('/saveitems', homeCtrl.saveitems);

module.exports = router;
