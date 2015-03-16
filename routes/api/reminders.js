var express = require('express');
var router = express.Router();
var passport = require('passport')
var models = require('../models');
var Reminder = models.Reminder;

router.all('*', function(req, res, next) {
	if(req.cookies.access_token) {
		req.body.access_token = req.cookies.access_token.replace(/\"/g, "")
	}
	next()
}, passport.authenticate('bearer', {session: false}))

router.post("/", function(req, res) {
	Reminder.save(req.body, function(err, obj) {
		if(err)
			return res.status(500).json({error: err})
		else
			return res.json(obj)
	})
});

module.exports = router;