'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema
var utils = require('./utils')

var supportedProps = ["owner", "client", "title", "description", "dismissed"]

var ReminderSchema = new Schema({
    date_created: { type: Date, default: Date.now },
	title: String,
	description: String,
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
	client: {type: Schema.Types.ObjectId, ref: 'Client'},
    date_activated: Date,
    dismissed: Boolean
}, { collection: 'crm_reminders' });

ReminderSchema.statics.create = function(props, done) {
	props = utils.clean(props, supportedProps)
	var reminder = new Reminder(props)
	reminder.save(done)
	return reminder
}

ReminderSchema.statics.update = function(id, props, done) {
	props = utils.clean(props, supportedProps)
	Reminder.findByIdAndUpdate(id, props, done)
	return props
}

var User = module.exports = mongoose.model('Reminder', ReminderSchema);
