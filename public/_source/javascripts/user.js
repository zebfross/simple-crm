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

var User = function() {};
	
User.setCurrent = function(usr) {
	$.cookie('access_token', usr.token, {path: '/'});
	if(Modernizr.localstorage) {
		localStorage.setItem('user', JSON.stringify(usr));
	}
};

User.getCurrent = function() {
	var usr = null;
	if(Modernizr.localstorage) {
		usr = JSON.parse(localStorage.getItem('user'));
	}
	return usr;
};

User.login = function(username, password) {
	$.post("/users/login", {'username': username, 'password': password}, function(usr) {
		console.log(usr.token);
		User.setCurrent(usr);
		window.location = "/";
	}, 'json')
	.error(function(res) {
		alert(res);
	});
};

User.logout = function() {
	$.removeCookie('access_token');
	if(Modernizr.localstorage) {
		localStorage.removeItem('user');
	}
	window.location = "/pages/login.html";
};

User.register = function(obj) {
	$.post("/users/register", obj, function(resp) {}, 'json').always(function(usr) {
		usr = usr.responseJSON || usr;
		if(usr.error) {
			alert(usr.error);
		} else {
			confirm("Registration successful!  Please continue to login.");
			window.location = "/pages/login.html";
		}
	});
};

User.authenticate = function(done) {
	$.post("/users/authenticate", function(resp) {
		done(true);
	}).fail(function() {
		if(confirm("authentication failed")){
			done(false);
		}
		done(true);
	});
};

User.save = function(usr, done) {
	var curr = User.getCurrent();
	$.ajax({
		url: "/users/" + curr._id,
		data: usr,
		type: 'PUT',
		success: function(res) {
			User.setCurrent(res);
			done(null, res);
		},
		error: function(err) {
			done(err, null);
		}
	})
};

User.recentEvents = function(id, start, end, done) {
	if(arguments.length == 2) {
		done = start;
		start = new Date();
		end = new Date();
	}
	var data = {
		start: start.toLocaleDateString(),
		end: end.toLocaleDateString()
	};
	$.getJSON("/users/" + id + "/events", data, function(events) {
		done(null, events);
	})
	.error(function(err) {
		done(err, null);
	});
};

User.activity = function(id, skip, limit, done) {
	var data = {
		skip: skip,
		limit: limit
	};
	$.getJSON("/users/" + id + "/activity", data, function(activity) {
		done(null, activity);
	})
	.error(function(err) {
		done(err, null);
	});
};

User.clients = function(id, skip, limit, done) {
	var data = {
		skip: skip,
		limit: limit
	};
	$.getJSON("/users/" + id + "/clients", data, function(clients) {
		done(null, clients);
	})
	.error(function(err) {
		done(err, null);
	});
};

if(isNode) {
	module.exports = function(jq) {
		if(jq)
			$ = jq;
		return User;
	};
}