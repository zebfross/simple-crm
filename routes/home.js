var express = require('express');
var router = express.Router();
var models = require('../models');
var querystring = require('querystring')
var https = require('https')
var logger = require('../server/logger')
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
        var post_req = https.request(post_options, function(result) {
            logger.debug(`STATUS: ${result.statusCode}`);
            logger.debug(`HEADERS: ${JSON.stringify(result.headers)}`);
            result.setEncoding('utf8');
            result.on('data', (chunk) => {
                logger.debug(`BODY: ${chunk}`);
            });
            result.on('end', () => {
                logger.debug('');
            });
        });
            
        post_req.on('error', (e) => {
            logger.error(`problem with request: ${e.message}`);
        });

        // post the data
        post_req.write(post_data);
        post_req.end();

        req.flash("info", "Thank you for your feedback!")
        res.redirect("/home")

    })

router.get('/support', function(req, res) {
    res.render('pages/support', {github_api_token: process.env.github_api_token})
})

module.exports = router;
