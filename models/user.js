'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
    username: String,
    password: String,
    display_name: String,
    email: String,
    clients: [{ type: Schema.Types.ObjectId, ref: 'Client' }],
    alerts: [{ type: Schema.Types.ObjectId, ref: 'Alert' }],
    reminders: [{type: Schema.Types.ObjectId, ref: 'Reminder'}]
}, { collection: 'crm_users' });

UserSchema.method('validPassword', function(_password, done) {
	bcrypt.compare(_password, this.get('password'), done);
});

UserSchema.method('hash', function(done) {
	var _this = this;
	bcrypt.hash(_this.get('password'), null, null, function(err, hash) {
		if(err) {return done(err, null);}
		_this.set('password', hash);
		done();
	});
});

UserSchema.method('register', function(done) {
	var _this = this
	_this.hash(function() {
		_this.save(done)
	})
})

UserSchema.virtual('token').get(function() {
	return this._token;
}).set(function(val) {
	this._token = val;
});

UserSchema.set('toObject', {getters: true, virtuals: true});
UserSchema.set('toJSON', {getters: true, virtuals: true})

var User = module.exports = mongoose.model('User', UserSchema);
