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

var User = module.exports = mongoose.model('Activity', ActivitySchema);
