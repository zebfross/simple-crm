'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlertSchema = new Schema({
    date_created: { type: Date, default: Date.now },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    title: String,
    url: String,
    dismissed: Boolean,
    type: String
}, { collection: 'crm_alerts' });

var User = module.exports = mongoose.model('Alert', AlertSchema);
