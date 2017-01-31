var express = require('express');
var router = express.Router();
var passport = require('passport')
var models = require('../models');
var Activity = models.Activity;
var email = require('emailjs')
var logger = require('../server/logger')
var server = email.server.connect({
	user: "zeb+zebfross.com",
	password: "fEz5_leARs",
	host: "just51.justhost.com",
	ssl: true
})

router.post("/incoming-email", function(req, res) {
	logger.info("post to /incoming-email")
	var msg = JSON.stringify(req.body)
	server.send({
		text: msg,
		from: "Zeb Fross <kingzebulon@gmail.com",
		to: "Zeb Fross <zebfross@hotmail.com>",
		subject: "Testing Email!"
	}, function(err, message) {
		if(err) {
			throw err
		} else {
			res.send(message)
		}
	})
});

require('./auth')(router)

router.post("/", function(req, res) {
	logger.info("post to /comments")
	req.body.owner = req.user._id
	Activity.save(req.body, function(err, obj) {
		if(err) {
			logger.info("error: " + err)
		}
		return res.redirect("/clients/" + req.body.client + "/details")
	})
});

module.exports = router;
