'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utils = require('./utils')
var Client = require('./client')
var logger = require('../server/logger')

var supportedProps = ["comment", "client", "activity_type"]

var ActivitySchema = new Schema({
    date_created: { type: Date, default: Date.now },
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    comment: String,
    activity_type: String
}, { collection: 'crm_activities' });

ActivitySchema.statics.recent = function(id, skip, limit, done) {
	Activity.find({owner: id}, {}, {skip: skip, limit: limit}, done)
}

ActivitySchema.statics.save = function(props, done) {
	logger.info("saving: " + JSON.stringify(props))
	props = utils.clean(props, supportedProps)
	logger.info("cleaned props: " + JSON.stringify(props))
	var act = new Activity(props)
	act.save(function(err, a) {
    	Client.findOneAndUpdate({_id: act.client}, {date_last_contact: Date.now()}, function(err, cli) {
    		done(err, a)
		})
	})
	return act
}

var Activity = module.exports = mongoose.model('Activity', ActivitySchema);
