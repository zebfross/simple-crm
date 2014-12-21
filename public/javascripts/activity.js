var $;
var Modernizr;
var isNode = false;
// in a node environment
if(typeof $ === 'undefined' && typeof exports !== 'undefined' && this.exports !== exports) {
	isNode = true;
	$ = {}
	$.cookie = {}
	Modernizr = {}
}

var Activity = function() {};

Activity.create = function(obj, done) {
	$.post("/comments/", obj, function(comment) {
		done(null, comment);
	}, 'json')
	.error(function(err) {
		done(err, null);
	})
};

if(isNode) {
	module.exports = function(jq) {
		if(jq)
			$ = jq;
		return Activity;
	};
}