var proxyquire = require('proxyquire')
var mongooseMock = require('mongoose-mock')
var assert = require('assert')
var bcrypt = require('bcrypt-nodejs')
var should = require('should')
var mongoose = require('mongoose')
var models = require('../models')
var sinon = require('sinon')

describe('User', function() {
	var User = proxyquire('../models/user', {'mongoose': mongooseMock})
	
	describe('validPassword', function() {
		it('should be a valid password', function(done) {
			var usr = new User({username: 'bogus-test', password: 'myPassw0rd'})
			usr.hash(function() {
				usr.validPassword('myPassw0rd', function(err, valid) {
					(err === null).should.be.true;
					valid.should.be.ok
					done()
				})
			})
		})
	})
	describe('register', function() {
		it('should call Mongoose save', function(done) {
			var _usr = {username: 'bogus-test', password: 'myPassw0rd'}
			var usr = new User(_usr)
			usr.register(function(err, ret) {
				(err === null).should.be.ok
				assert(usr.save.calledOnce);
				//ret.should.be.equal(_usr)
				done()
			})
		})
	})
})
