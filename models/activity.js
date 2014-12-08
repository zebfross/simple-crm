'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

var Activity = module.exports = mongoose.model('Activity', ActivitySchema);
