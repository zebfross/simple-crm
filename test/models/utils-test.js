var assert = require('assert')
var should = require('should')
var sinon = require('sinon')
var utils = require('../../models/utils.js')

describe('Utils', function() {
	describe('clean', function() {
		it('should be defined', function() {
			utils.clean.should.be.a.function
		})
		it('should remove some properties', function() {
			var supportedProps = ["a", "d", "f"]
			var obj = {
				"a": "abc",
				"b": "def",
				"c": "aoetu",
				"d": "ahoenhs",
				"e": "shtnsh",
				"f": [74, 34, 80],
				"g": [1, 5, 7]
			}
			var res = utils.clean(obj, supportedProps)
			var count = 0;
			for(var p in res) {
				supportedProps.indexOf(p).should.be.greaterThan(-1)
				count += 1;
			}
			count.should.be.equal(3)
		})
	})
})
