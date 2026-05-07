//notifications logic 
const mongoose = require("mongoose")
const { String } = require("yup")
const NotificationSchema = new mongoose.Schema({
    repo: { type: String, required: true },
  name: { type: String, required: true },// ex:frequent faliure ALERT
  
  //rule logic
  ruleType:{
    type :String,
    enum: ['consecutive_failures', 'high_failure_rate', 'slow_builds'],
    required: true
  },

  threshold : { type: Number, required: true },// 3faliures
 //notification setup

  channel: { type: String, enum: ['slack', 'email', 'webhook'], required: true },
  webhookUrl: { type: String }, // Target for alerts
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('AlertRule', AlertRuleSchema);