var express = require('express');
var router = express.Router();
var models = require('../models');
var User = models.User;
var Client = models.Client;
var Activity = models.Activity;
var passport = require('passport');
var jwt = require('jwt-simple');
var logger = require('../server/logger')

require('./auth')(router)

router.get('/new', function(req, res) {
    logger.info("client/new")
	return res.render('clients/new', {})
});

router.post('/', function(req, res) {
	Client.create(req.user._id, req.body, function(err, obj) {
		if(err) {
			throw err
		} else {
			res.render('clients/details', obj)
        }
    });
});

router.param('clientid', function (req, res, next, id) {
    Client.getById(id, function (err, client) {
        if (!err) {
			if(!client) {
				var err = new Error('Client not found.')
                err.status = 404
                next(err);
			} else {
				if(client.owner == req.user._id) { // TODO: or req.user.isAdmin
					req.target = client;
					next();
				} else {
					var err = new Error('Unauthorized')
                    err.status = 403
                    next(err)
				}
			}
        } else {
            logger.error(err)
            err.status = 500
            next(err)
		}
    });
});

/* GET client. */
router.route('/:clientid/details')
.get(function (req, res, next) {
    req.target.user = req.user
	res.render('clients/details', req.target)
});
router.route('/:clientid/update')
.get(function(req, res) {
    req.target.user = req.user;
    res.render('clients/edit', req.target)
})
.post(function(req, res, next) {
    logger.info(req.body)
	Client.update(req.target._id, req.body, function(err, obj) {
		if(err) {
			throw err
		} else {
			return res.redirect("/clients/" + req.target._id + '/details')
        }
	})
});

module.exports = router;
