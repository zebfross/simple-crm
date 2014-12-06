var express = require('express');
var router = express.Router();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('jwt-simple');
var secret = 'ebb65a09-0f30-41db-b9ad-9a199a0db862';

var routes = require('./routes/index');
var users = require('./routes/users');

var init = function (config) {

    var app = express();
    
    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    
    // uncomment after placing your favicon in /public
    //app.use(favicon(__dirname + '/public/favicon.ico'));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(require('stylus').middleware(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'public')));  
	app.use(passport.initialize());
    
    var mongodbUrl = config.db;
    console.log('Using MongoDB URL: %s', mongodbUrl);

    mongoose.connect(mongodbUrl, function (error) {
        if (error) {
            console.error('Could not connect to DB: %s', error);
            process.exit(1);
        } else {
            console.log('successfully connected to mongo');
        }
    });

    mongoose.connection.on('error', function (error) {
        console.error('MongoDB connection error: %s', error);
    });

	router.param('token', function (req, res, next, token) {
		var username = jwt.decode(token, secret);
		console.log("username: " + username);
		User.findOne({username: username}, function (err, usr) {
			if (!err && usr) {
				req.currUser = usr;
				next();
			}
		});
	});

    app.use('/', routes);
    app.use('/users', users);
    
	// Handle 404
	app.use(function(req, res) {
	  res.status(404);
	  res.redirect('/pages/404.html');
	});
	// Handle 500
	app.use(function(error, req, res, next) {
		res.status(500);
		res.redirect('/pages/500.html');
	});
    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
    
    // error handlers
    
    // development error handler
    // will print stacktrace
    if (process.env['env'] === 'Debug') {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }
    
    // production error handler
    // no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
    return app;
};

var config = require('./config/config');

var env = process.env['env'] || "debug";
env = env.toLowerCase();

var envConfig;
if (env == 'debug')
    envConfig = config['debug'];
else if (env == 'release')
    envConfig = config['release'];
else if (env == 'test')
    envConfig = config['test'];

var app = init(envConfig);
module.exports = app;
