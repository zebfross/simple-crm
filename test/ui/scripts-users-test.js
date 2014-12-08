var assert = require('assert')
var should = require('should')
var sinon = require('sinon')

describe('User Scripts', function() {
	var $ = {}
	$.fn = {}
	beforeEach(function() {
		$.cookie = sinon.spy()
		$.removeCookie = sinon.spy()
	})
	var User = require('../../public/_source/javascripts/user')($)
	it('should be defined', function() {
		User.should.be.a.function
	})
	describe('setCurrent', function() {
		var usr = {'username': 'username', 'token':'token'}
		it('should be defined', function() {
			User.setCurrent.should.be.a.function
		})
		it('should set token', function() {
			User.setCurrent(usr)
			$.cookie.calledOnce.should.be.true
			$.cookie.calledWith('access_token', usr.token, {path: '/'}).should.be.true
		})
		it('should set user', function() {
			User.setCurrent(usr)
			//TODO: make sure calls local storage
		})
	})
	describe('getCurrent', function() {
		it('should be defined', function() {
			User.getCurrent.should.be.a.function
		})
		it('should get user', function() {
			User.getCurrent()
			//TODO: make sure calls local storage
		})
	})
})
