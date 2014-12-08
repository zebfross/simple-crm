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

var Client = function(props) {
	this.name_first = "";
	this.name_last = "";
	this.rating = 15;
	this.city = "";
	this.state = "";
	this.email = "";
	// may have other properties
	if(props) {
		for(var p in props) {
			this[p] = props[p];
		}
	}
};

Client.compressData = function(clients) {
	var data = [];
	for(var i in clients) {
		var client = clients[i];
		var row = [];
		row.push(client["_id"]);
		row.push((client["name_first"] || "") + " " + (client["name_last"] || ""));
		row.push((client["city"] || "") + ", " + (client["state"] || ""));
		row.push(client["rating"] || "");
		data.push(row);
	}
	return data;
};

Client.activeId = 0;

Client.getActive = function(done) {
	if(Client.activeId) {
		$.getJSON("/clients/" + Client.activeId, function(client) {
			done(null, client);
		})
		.error(function(err) {
			done(err, null);
		});
	} else {
		done(null, null);
	}
};

Client.save = function(obj, done) {
	if(obj._id) {
		Client._update(obj, done);
	} else {
		Client._create(obj, done);
	}
};

Client._create = function(obj, done) {
	$.post("/users/" + User.getCurrent()._id + "/clients", obj, function(client) {
		done(null, client);
	}, 'json')
	.error(function(err) {
		done(err, null);
	})
};

Client._update = function(obj, done) {
	$.ajax({
		url: "/clients/" + obj._id,
		type: "PUT",
		data: obj,
		success: function(client) {
			done(null, client);
		},
		error: function(err) {
			done(err, null);
		}
	});
};

if(isNode) {
	module.exports = function(jq) {
		if(jq)
			$ = jq;
		return Client;
	};
}