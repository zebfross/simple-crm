var proxyquire = require('proxyquire')
var mongooseMock = require('mongoose-mock')
var assert = require('assert')
var bcrypt = require('bcrypt-nodejs')
var should = require('should')
var mongoose = require('mongoose')
var sinon = require('sinon')

describe('Client', function() {
	var Client
	beforeEach(function() {
		Client = proxyquire('../../models/client', {'mongoose': mongooseMock})
	})
	describe('create', function() {
		it('should call Mongoose save', function() {
			var client = {name_first: 'bogus-test', name_last: 'test-bogus'}
			var cb = sinon.spy()
			var ret = Client.create(client, cb)
			cb.should.be.calledOnce
			ret.save.should.be.calledOnce
		})
	})
	describe('update', function() {
		it('should call Mongoose findOneAndUpdate', function() {
			var client = {name_first: 'bogus-test', name_last: 'test-bogus'}
			var cb = sinon.spy()
			//TODO: test update
		})
	})
})
