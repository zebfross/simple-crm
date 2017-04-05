var express = require('express');
var router = express.Router();
var models = require('../models');
var querystring = require('querystring')
var https = require('https')
var User = models.User;
var Client = models.Client;

require('./auth')(router)

/* GET home page. */
router.get('/', function (req, res) {
    Client.listForUser(req.user._id, function(err, clients) {
        res.render('index', { clients: clients });
    });
});

router.route("/feedback")
    .get(function(req, res) {
        res.render('feedback')
    })
    .post(function(req, res, next) {
        debugger;
        // Build the post string from an object
        var post_data = querystring.stringify({
            'from' : 'simplecrm@zebfross.com',
            'to': 'zeb@zebfross.com',
            'subject': req.body.title,
            'text' : req.body.message
        });

        // An object of options to indicate where to post to
        var post_options = {
            auth: 'api:' + process.env.mg_apikey,
            host: 'api.mailgun.net',
            protocol: 'https:',
            path: '/v3/mg.zebfross.com/messages',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(post_data)
            }
        };

        // Set up the request
        var post_req = https.request(post_options, function(res) {
            res.setEncoding('utf8');
            // TODO: error handling
        });

        // post the data
        post_req.write(post_data);
        post_req.end();

        req.flash("info", "Thank you for your feedback!")
        res.redirect("/home")

    })

module.exports = router;
