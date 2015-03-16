var assert = require('assert')
var should = require('should')
var sinon = require('sinon')
var hbs = require('handlebars')
var helpers = require('../../views/helpers')

for (var i in helpers) {
    hbs.registerHelper(i, helpers[i]);
}

describe('Handlebars Helpers', function() {
    describe('format helper', function() {
        it('should format basic money', function() {
            var source = "<b>{{format money '$'}}</b>"
            var template = hbs.compile(source);
            var data = {"money":"100000"}
            var result = template(data)
            result.should.equal("<b>$100000</b>")
        })
    })
})
