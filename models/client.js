'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Activity = require('./activity')
var utils = require('./utils')

var supportedProps = ["name_first", "name_last", "phones", "address1", "address2", "city", "state", "zip", "notes", "birthday", "anniversary", "rating", "email"]

var ClientSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    name_first: String,
    name_last: String,
    email: String,
    phones: [{
            type: String,
            number: String
        }],
    address1: String,
    address2: String,
    city: String,
    state: String,
    zip: String,
    notes: String,
    birthday: Date,
    anniversary: Date,
	date_created: {type: Date, default: Date.now },
    date_last_contact: { type: Date, default: Date.now },
    archived: Boolean,
    rating: Number,
    activity: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
    recent_activity: [{
            date_created: Date,
            comment: String,
            type: String
    }]
}, { collection: 'crm_clients' });

ClientSchema.statics.create = function(owner, props, done) {
	props = utils.clean(props, supportedProps)
	props.owner = owner
	var client = new Client(props)
	client.save(done)
	return client
}

ClientSchema.statics.update = function(id, props, done) {
	props = utils.clean(props, supportedProps)
	Client.where({_id: id}).findOneAndUpdate(props, done)
}

ClientSchema.statics.getById = function(id, done) {
    Client.findById(id, function (err, client) {
		if (!err) {
			Activity.find({client: client._id}, {}, {}, function(err, activities) {
				client.activities = activities
				done(null, client)
			})
		} else {
			done(err, null)
		}
	})
}

var Client = module.exports = mongoose.model('Client', ClientSchema);
