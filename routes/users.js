var express = require('express');
var router = express.Router();
var models = require('../models');
var User = models.User;
var Client = models.Client;
var Activity = models.Activity;
var passport = require('passport');
var jwt = require('jwt-simple');

router.param('userid', function (req, res, next, id) {
	console.log(id)
    User.findById(id, function (err, usr) {
        if (!err) {
			if(!usr) {
				res.status(404).json({ message: 'user not found'});
			} else {
				req.target = usr;
				next();
			}
        } else {
            res.status(500).json({ error: err });
		}
    });
});

router.post('/login', passport.authenticate('local', {session: false}), function (req, res) {
	res.json(req.user);
});

router.get('/unique', function(req, res) {
	User.findOne({username: req.query.username}, function(err, usr) {
		if(err || usr)
			res.json({valid: false});
		else
			res.json({valid: true});
	});
});

router.post("/", function (req, res) {
    User.register(req.body, function (err, _usr) {
		if(err) {return res.status(500).json({error: err});}
        res.json(_usr); 
    });
});

router.all('*', function(req, res, next) {
	if(req.cookies.access_token) {
		req.body.access_token = req.cookies.access_token.replace(/\"/g, "")
		console.log(req.body.access_token)
	}
	next()
}, passport.authenticate('bearer', {session: false}))

router.route('/:id/clients')
.get(function (req, res) {
	var skip = req.query.skip || 0;
	var limit = req.query.limit || -1;
	var query = {skip: skip}
	if(limit > 0)
		query.limit = limit
    Client.find({ owner: req.params.id }, {}, query, function (err, clients) {
        if (!err) {
            res.json(clients)
        } else {
            res.status(500).json({ error: err })
        }
    });
})
.post(function(req, res) {
	Client.create(req.params.id, req.body, function(err, _client) {
		if(err)
			return res.status(500).json({message:err})
		else
			return res.json(_client)
	})
})

router.get('/:userid/events', function(req, res) {
	console.log("/userid/events")
	var start = req.query.start
	var end = req.query.end
	console.log(req.query);
	User.events(req.target._id, req.target.days_between_contact, start, end, function(err, events) {
		if(err)
			return res.json({message: err})
		else
			return res.json(events)
	})
})

router.get('/:id/activity', function(req, res) {
	var limit = req.query.limit || 10
	var step = req.query.skip || 0
	Activity.recent(req.params.id, skip, limit, function(err, list) {
		if(err)
			res.status(500).json({message: err})
		else
			res.json(list)
	})
})

router.post('/authenticate', function(req, res) {
	res.status(200).send("OK");
});

/* GET user listing */
router.route('/')
.get(function (req, res) {
    User.find({}, {}, { skip: 0, limit: 10 }, function (err, users) {
        if (!err)
            res.json(users);
        else
            res.status(500).json({ error: err });
    });
})

/* GET user. */
router.route('/:userid')
.get(function (req, res, next) {
	res.json(req.target);
})
.put(function(req, res, next) {
	User.update(req.target._id, req.body, function(err, usr) {
		if(err)
			return res.status(500).json({error: err})
		else
			return res.json(usr)
	})
});

module.exports = router;