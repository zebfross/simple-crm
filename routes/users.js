var express = require('express');
var router = express.Router();
var models = require('../models');
var User = models.User;
var Client = models.Client;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var jwt = require('jwt-simple');
var secret = 'ebb65a09-0f30-41db-b9ad-9a199a0db862';

passport.use(new LocalStrategy(
	function(username, password, done) {
		User.findOne({username: username}, function(err, usr) {
			if(err) {return done(err);}
			if(!usr) {
				return done(null, false, {message: 'Incorrect username.'});
			}
			usr.validPassword(password, function(err, valid) {
				if(err) {return done(err);}
				if(!valid) {
					return done(null, false, {message: 'Incorrect password.'});
				} else {
					var token = jwt.encode(username, secret);
					usr.token = token;
					return done(null, usr);
				}
			});
		});
	}
));

passport.use(new BearerStrategy(
  function(token, done) {
	var username = jwt.decode(token, secret);
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user);
    });
  }
));

router.param('userid', function (req, res, next, id) {
    User.findOne({id: id}, function (err, usr) {
        if (!err) {
			if(!usr) {
				res.status(404).json({ message: 'user not found'});
			} else {
				req.user = usr;
				next();
			}
        } else {
            res.status(500).json({ error: err });
		}
    });
});

/* GET user listing */
router.get('/', passport.authenticate('bearer', {session: false}), function (req, res) {
    User.find({}, {}, { skip: 0, limit: 10 }, function (err, users) {
        if (!err)
            res.json(users);
        else
            res.status(500).json({ error: err });
    });
});

router.get('/:id/clients', passport.authenticate('bearer', {session: false}), function (req, res) {
	var skip = req.query.skip || 0;
	var limit = req.query.limit || 10;
    Client.find({ owner: req.id }, {}, { skip: skip, limit: limit }, function (err, clients) {
        if (!err) {
            res.json(clients);
        } else {
            res.status(500).json({ error: err });
        }
    });
});

router.post('/login', passport.authenticate('local', {session: false}), function (req, res) {
	res.json(req.user);
});

router.post('/authenticate', passport.authenticate('bearer', {session: false}), function(req, res) {
	res.status(200).send("OK");
});

router.get('/unique', function(req, res) {
	User.findOne({username: req.query.username}, function(err, usr) {
		if(err || usr)
			res.json({valid: false});
		else
			res.json({valid: true});
	});
});

router.post('/', passport.authenticate('bearer', {session: false}), function (req, res) {
    var usr = new User(req.body);
    usr.register(function (err, _usr) {
		if(err) {return res.status(500).json({error: err});}
        res.json(_usr); 
    });
});

/* GET user. */
router.route('/:userid')
.all(passport.authenticate('bearer', {session: false}))
.get(function (req, res, next) {
	res.json(req.user);
	next();
})
.put(function(req, res, next) {
	var usr = new User(req.body)
});

module.exports = router;