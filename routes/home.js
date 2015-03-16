var express = require('express');
var router = express.Router();
var models = require('../models');
var User = models.User;
var Client = models.Client;

require('./auth')(router)

/* GET home page. */
router.get('/', function (req, res) {
    Client.listForUser(req.user._id, function(err, clients) {
        res.render('index', { user: req.user, clients: clients });
    });
});

module.exports = router;
