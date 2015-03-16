var express = require('express');
var router = express.Router();
var models = require('../models');
var User = models.User;
var Client = models.Client;
var Activity = models.Activity;
var passport = require('passport');
var jwt = require('jwt-simple');

router.param('clientid', function (req, res, next, id) {
    Client.getById(id, function (err, client) {
        if (!err) {
			if(!client) {
				res.status(404).json({ message: 'client not found'});
			} else {
				if(client.owner == req.user._id) { // or req.user.isAdmin\
					req.target = client;
					next();
				} else {
					res.status(403).json()
				}
			}
        } else {
            res.status(500).json({ error: err });
		}
    });
});

require('./auth')(router)

/* GET client. */
router.route('/:clientid')
.get(function (req, res, next) {
	res.json(req.target);
})
.put(function(req, res, next) {
	Client.update(req.target._id, req.body, function(err, obj) {
		if(err)
			return res.status(500).json({error: err})
		else
			return res.json(obj)
	})
});

module.exports = router;
