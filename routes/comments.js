var express = require('express');
var router = express.Router();
var passport = require('passport')
var models = require('../models');
var Activity = models.Activity;

router.all('*', function(req, res, next) {
	if(req.cookies.access_token) {
		req.body.access_token = req.cookies.access_token.replace(/\"/g, "")
	}
	next()
}, passport.authenticate('bearer', {session: false}))

router.post("/", function(req, res) {
	console.log("post to /comments")
	Activity.save(req.body, function(err, obj) {
		if(err) {
			console.log("error: " + err)
			return res.status(500).json({error: err})
		} else {
			return res.json(obj)
		}
	})
});

module.exports = router;