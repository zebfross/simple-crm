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
var userData = new Data("/users/");
	
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

User.login = function(username, password, done) {
  userData.post("login", {'username': username, 'password': password}, function(err, usr) {
    if(!err) {
      User.setCurrent(usr);
    }
    done(err, usr);
  });
};

User.logout = function() {
	$.removeCookie('access_token');
	if(Modernizr.localstorage) {
		localStorage.removeItem('user');
	}
	return true;
};

User.register = function(obj, done) {
  userData.post("", obj, function(err, usr) {
    done(err, usr);
  });
};

User.authenticate = function(done) {
  userData.post("authenticate", {}, function(err, usr) {
    done(!err);
  });
};

User.save = function(usr, done) {
	var curr = User.getCurrent();
  userData.put(curr._id, usr, function(err, usr) {
    if(!err) {
      User.setCurrent(usr);
    }
    done(err, usr);
  });
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
  userData.get("" + id + "/events", data, done);
};

User.activity = function(id, skip, limit, done) {
	var data = {
		skip: skip,
		limit: limit
	};
  userData.get("" + id + "/activity", data, done);
};

User.clients = function(id, skip, limit, done) {
	var data = {
		skip: skip,
		limit: limit
	};
  userData.get(id + "/clients", data, done);
};

if(isNode) {
	module.exports = function(jq) {
		if(jq)
			$ = jq;
		return User;
	};
}