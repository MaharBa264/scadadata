var mongoose = require('mongoose');

var alarmsSchema = new mongoose.Schema({
  timestamp: {type: String},
  MSEC: String,
  sequence_number: {type: String, unique: 'sequence_number duplicado'},
  alarm_id: String,
  alarm_class: String,
  resource: String,
  logged_by: String,
  reference: String,
  prev_state: String,
  log_action: String,
  final_state: String,
  alarm_message: String,
  generation_time: String
});

mongoose.model('Alarm', alarmsSchema);
