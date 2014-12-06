'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReminderSchema = new Schema({
    date_created: { type: Date, default: Date.now },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    date_activated: Date,
    dismissed: Boolean
}, { collection: 'crm_reminders' });

var User = module.exports = mongoose.model('Reminder', ReminderSchema);
