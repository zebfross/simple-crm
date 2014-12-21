'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utils = require('./utils')
var Client = require('./client')

var supportedProps = ["comment", "owner", "client", "type"]

var ActivitySchema = new Schema({
    date_created: { type: Date, default: Date.now },
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    comment: String,
    type: String
}, { collection: 'crm_activities' });

ActivitySchema.statics.recent = function(id, skip, limit, done) {
	Activity.find({owner: id}, {}, {skip: skip, limit: limit}, done)
}

ActivitySchema.statics.save = function(props, done) {
	console.log("saving: " + JSON.stringify(props))
	props = utils.clean(props, supportedProps)
	console.log("cleaned props: " + JSON.stringify(props))
	var act = new Activity(props)
	// act.save(function(err, cli) {
		
	// })
	try {
	Client.findByIdAndUpdate(act.client, {date_last_contact: Date.now}, {}, function(err, cli) {
		console.log(JSON.stringify(err || cli))
			})	
	} catch (e) {
		console.log(e)
	}
	return act
}

var Activity = module.exports = mongoose.model('Activity', ActivitySchema);
