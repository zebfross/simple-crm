var assert = require('assert')
var should = require('should')
var sinon = require('sinon')

describe('Client Scripts', function() {
	var $ = {}
	$.fn = {}
	beforeEach(function() {
	})
	var Client = require('../../public/_source/javascripts/client')($)
	it('should be defined', function() {
		Client.should.be.a.function
	})
	describe('compress data', function() {
		it('should be defined', function() {
			Client.compressData.should.be.a.function
		})
		it('should compress data', function() {
			var data = [
				{
					"_id": "abc123",
					"name_last": "last name",
					"name_first": "first name",
					"rating": "rating",
					"city": "city",
					"state": "state"
				},
				{
					"_id": "abc123",
					"name_last": "last name",
					"name_first": "first name",
					"rating": "rating",
					"city": "city",
					"state": "state"
				},
				{
					"_id": "abc123",
					"name_last": "last name",
					"name_first": "first name",
					"rating": "rating",
					"city": "city",
					"state": "state"
				}
			]
			
			var  compressed = Client.compressData(data)
			
			compressed.length.should.equal(data.length)
			console.log(compressed)
			for(var c in compressed) {
				var obj = compressed[c]
				obj.length.should.equal(4)
				obj[0].should.equal("abc123")
				obj[1].should.equal("first name last name")
				obj[2].should.startWith("city")
				obj[3].should.equal("rating")
			}
		})
	})
})
