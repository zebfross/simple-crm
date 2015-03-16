
var express = require('express');
var router = express.Router();
var models = require('../models');
var User = models.User;
var Client = models.Client;
var Activity = models.Activity;
var passport = require('passport');
var jwt = require('jwt-simple');
var flash = require('express-flash')

router.param('userid', function(req, res, next, id) {
    console.log(id)
    User.findById(id, function(err, usr) {
        if (!err) {
            if (!usr) {
                var err = new Error()
				err.status = 404
				next(err)
            } else {
                req.target = usr;
                next();
            }
        } else {
            err.status = 500
			next(err)
        }
    });
});

router.get('/login', function(req, res) {
    res.render("pages/login", {layout: 'web'})
});

router.get('/logout', function(req, res) {
    req.logout()
    res.redirect('/users/login')
})

router.get('/register', function(req, res) {
    res.render('pages/register', {layout: 'web'})
})

router.post("/", function(req, res, next) {
    User.register(req.body, function(err, _usr) {
        if (err) {
            err.status = 500
			next(err)
        } else {
        	res.redirect('/home')
		}
    });
});

router.post('/login', passport.authenticate('local', {
    session: true,
    failureRedirect: "/users/login",
    failureFlash: "Invalid username or password."
}), function(req, res) {
    res.redirect("/home")
});

require('./auth')(router)

router.route('/:userid/clients')
    .get(function(req, res, next) {
        var skip = req.query.skip || 0;
        var limit = req.query.limit || -1;
        var query = {
            skip: skip
        }
        if (limit > 0)
            query.limit = limit
        Client.find({
            owner: req.params.id
        }, {}, query, function(err, clients) {
            if (!err) {
				res.render('clients/list', {user: req.user, clients: clients})
            } else {
                var err = new Error()
				err.status = 500
				next(err)
            }
        });
    })

router.get('/:userid/events', function(req, res) {
    var start = req.query.start
    var end = req.query.end
    console.log(req.query);
    User.events(req.target._id, req.target.days_between_contact, start, end, function(err, events) {
        if (err) {
			var err = new Error()
			err.status = 500
			next(err)
        } else {
            return res.render('events/list', events)
    	}
	})
})

router.get('/:id/activity', function(req, res) {
    var limit = req.query.limit || 10
    var step = req.query.skip || 0
    Activity.recent(req.params.id, skip, limit, function(err, list) {
        if (err) {
			var err = new Error()
			err.status = 500
			next(err)
    	} else {
            return res.render('activities/list', list)
    	}
	})
})

router.post('/authenticate', function(req, res) {
    res.status(200).send("OK");
});

/* GET user listing */
router.route('/')
    .get(function(req, res) {
        User.find({}, {}, {
            skip: 0,
            limit: 10
        }, function(err, users) {
            if (!err) {
                res.json(users);
            } else {
                res.status(500).json({
                    error: err
                });
			}
        });
    })

/* GET user. */
router.get('/:userid/details', function(req, res, next) {
    res.render('users/details', req.user)
});
router.route('/:userid/update')
    .post(function(req, res, next) {
        User.update(req.target._id, req.body, function(err, usr) {
            if (err) {
                var err = new Error()
    			err.status = 500
    			next(err)
            } else {
                res.render('users/details', {user: usr})
    		}
        })
    })
    .get(function(req, res, next) {
        req.target.user = req.user
        res.render('users/edit', req.target)
    });

module.exports = router;
