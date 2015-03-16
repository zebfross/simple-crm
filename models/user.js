'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var Client = require('./client')
var Reminder = require('./reminder')
var utils = require('./utils')

var supportedProps = ["username","password","display_name","email","days_between_contact"]

var UserSchema = new Schema({
    username: String,
    password: String,
    display_name: String,
    email: String,
	days_between_contact: {type: Number, default: 60},
    clients: [{ type: Schema.Types.ObjectId, ref: 'Client' }],
    alerts: [{ type: Schema.Types.ObjectId, ref: 'Alert' }],
    reminders: [{type: Schema.Types.ObjectId, ref: 'Reminder'}]
}, { collection: 'crm_users' });

UserSchema.statics.validPassword = function(orig, _password, done) {
	bcrypt.compare(_password, orig, done);
}

UserSchema.statics.hash = function(pass, done) {
	if(!pass) {
		done(null, null)
	} else {
		bcrypt.hash(pass, null, null, function(err, hash) {
			if(err) {return done(err, null);}
			done(null, hash);
		})
	}
}

UserSchema.statics.register = function(props, done) {
	props = utils.clean(props, supportedProps)
	var usr = new User(props);
	User.hash(props.password, function(err, hash) {
		usr.password = hash;
		usr.save(done)
	})
	return usr
}

UserSchema.statics.update = function(id, props, done) {
	props = utils.clean(props, supportedProps)
	User.hash(props.password, function(err, hash) {
		if(hash)
			props.password = hash
		else
			delete props.password
		User.findOneAndUpdate({_id: id}, props, done)
	})
}

UserSchema.statics.events = function(id, days_between_contact, start, end, done) {
	var contactStart = start
	var contactEnd = end
	contactStart.setDate(start.getDate() - days_between_contact)
	contactEnd.setDate(start.getDate() - days_between_contact)
	Client
	.where({owner: id})
	.where({$or: [
		{birthday: {$gte: start, $lte: end}},
		{anniversary: {$gte: start, $lte: end}},
		{date_last_contact: {$gte: contactStart, $lte: contactEnd}}
	]})
	.exec(function(err, clients) {
		if(err) {
			done(err, null)
		} else {
			Reminder.where({dismissed: false, owner: id}).sort("date_activated 1").find(function(err, reminders) {
				if(err) {
					console.log("error retrieving reminders: " + err)
					done(null, clients)
				} else {
					// TODO: merge these two lists into lists with similar objects
					done(null, clients.concat(reminders))
				}
			})
		}
	})
}

UserSchema.virtual('token').get(function() {
	return this._token;
}).set(function(val) {
	this._token = val;
});

UserSchema.set('toObject', {getters: true, virtuals: true});
UserSchema.set('toJSON', {getters: true, virtuals: true})

var User = module.exports = mongoose.model('User', UserSchema);
