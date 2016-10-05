var mongoose = require('mongoose');

var alarmsSchema = new mongoose.Schema({
  timestamp: String,
  MSEC: String,
  sequence_number: String,
  alarm_id: String,
  alarm_class: String,
  resource: String,
  logged_by: String,
  reference: String,
  prev_state: String,
  log_action: String,
  final_state: String,
  alarm_message: String,
  generation_time: String,
  point_id: String,
  _ENG: String,
  _VAL: String,
  tipo: String
});

var etSchema = new mongoose.Schema({
  timestamp: String,
  MSEC: String,
  point_id: String,
  _ENG: String,
  _VAL: String,
  tipo: String
})

var filenameSchema = new mongoose.Schema({
  filename : String
});

mongoose.model('Alarm', alarmsSchema);
mongoose.model('ET', etSchema);
mongoose.model('Filename', filenameSchema);
