var express = require('express');
var router = express.Router();
var passport = require('passport')
var models = require('../models');
var Activity = models.Activity;

require('./auth')(router)

router.post("/", function(req, res) {
	console.log("post to /comments")
	req.body.owner = req.user._id
	Activity.save(req.body, function(err, obj) {
		if(err) {
			console.log("error: " + err)
		}
		return res.redirect("/clients/" + req.body.client + "/details")
	})
});

module.exports = router;
