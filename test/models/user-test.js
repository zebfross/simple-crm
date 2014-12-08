var proxyquire = require('proxyquire')
var mongooseMock = require('mongoose-mock')
var assert = require('assert')
var bcrypt = require('bcrypt-nodejs')
var should = require('should')
var mongoose = require('mongoose')
var sinon = require('sinon')

describe('User', function() {
	var User
	beforeEach(function() {
		User = proxyquire('../../models/user', {'mongoose': mongooseMock})
	})
	// describe('validPassword', function() {
		// it('should be a valid password', function(done) {
			// var usr = {username: 'bogus-test', password: 'myPassw0rd'}
			// User.hash(usr.password, function(err, hash) {
				// User.validPassword(hash, usr.password, function(err, valid) {
					// (err === null).should.be.true;
					// valid.should.be.ok
					// done()
				// })
			// })
			// done()
		// })
	// })
	// describe('register', function() {
		// it('should call Mongoose save', function() {
			// var _usr = {username: 'bogus-test', password: 'myPassw0rd'}
			// var cb = sinon.spy()
			// var user = User.register(_usr, cb)
			// cb.should.be.calledOnce
			// user.save.should.be.calledOnce
		// })
	// })
})
