var mongoose = require('mongoose');

var dbUri = 'mongodb://localhost:27017/Scada';

if (process.env.NODE_ENV == 'production') {
  dbUri = 'mongodb://heroku_hnmnnm2b:ftf1o2v2m5k9riiu9nttmsgfq7@ds139705.mlab.com:39705/heroku_hnmnnm2b';
}

mongoose.connect(dbUri);

require('./alarms');
