var express = require('express');
var router = express.Router();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var jwt = require('jwt-simple');
var User = require('./models/user')

var routes = require('./routes/index')
var users = require('./routes/users')
var clients = require('./routes/clients')

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
	
	passport.use(new LocalStrategy(
		function(username, password, done) {
			User.findOne({username: username}, function(err, usr) {
				if(err) {return done(err);}
				if(!usr) {
					return done(null, false, {message: 'Incorrect username.'});
				}
				User.validPassword(usr.password, password, function(err, valid) {
					if(err) {return done(err);}
					if(!valid) {
						return done(null, false, {message: 'Incorrect password.'});
					} else {
						var token = jwt.encode({username: username}, config.secret);
						usr.token = token;
						return done(null, usr);
					}
				});
			});
		}
	));

	passport.use(new BearerStrategy(
	  function(token, done) {
		var usr = jwt.decode(token, config.secret)
		User.findOne({ username: usr.username }, function (err, user) {
		  if (err) { return done(err); }
		  if (!user) { return done(null, false); }
		  return done(null, user);
		});
	  }
	));

    app.use('/', routes)
    app.use('/users', users)
	app.use('/clients', clients)
    
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

app.set('port', process.env.PORT || 3000);

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
/*https.createServer(app).listen(443, function() {
	console.log('Express server listening on port ' + server.address().port);
});*/

