'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

var Client = module.exports = mongoose.model('Client', ClientSchema);
