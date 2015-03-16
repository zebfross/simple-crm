
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
var session = require('cookie-session')
var jwt = require('jwt-simple');
var flash = require('express-flash')
var hbs = require('express3-handlebars')
var helpers = require('./views/helpers')
var User = require('./models/user')

var anonymous = require('./routes/anonymous')
var home = require('./routes/home')
var users = require('./routes/users')
var clients = require('./routes/clients')
var comments = require('./routes/comments')

var init = function(config) {

    var app = express();

    // view engine setup
    app.engine('hbs', hbs({
        defaultLayout: 'main',
        extname: 'hbs',
        helpers: helpers
    }))
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'hbs');

    // uncomment after placing your favicon in /public
    //app.use(favicon(__dirname + '/public/favicon.ico'));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(cookieParser());
    app.use(require('stylus').middleware(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(session({
        keys: ['atoe23!***-_HNT2223O><P', 'schhbvmwAOEU><P@#%798tsh']
    }));
    app.use(passport.initialize());
    app.use(passport.session())
    app.use(flash())

    var mongodbUrl = config.db;
    console.log('Using MongoDB URL: %s', mongodbUrl);

    mongoose.connect(mongodbUrl, function(error) {
        if (error) {
            console.error('Could not connect to DB: %s', error);
            process.exit(1);
        } else {
            console.log('successfully connected to mongo');
        }
    });

    mongoose.connection.on('error', function(error) {
        console.error('MongoDB connection error: %s', error);
    });

    passport.serializeUser(function(user, done) {
        //console.log("serialized: " + user)
        //done(null, user.id)
        done(null, user)
    });

    passport.deserializeUser(function(user, done) {
        /*console.log("deserializing: " + user)
        User.findById(user, function(err, usr) {
          console.log("error: " + err)
          console.log("user: " + usr)
          done(null, usr)
        })*/
        done(null, user)
    });

    passport.use(new LocalStrategy(
        function(username, password, done) {
            User.findOne({
                username: username
            }, function(err, usr) {
                if (err) {
                    return done(err);
                }
                if (!usr) {
                    return done(null, false, {
                        message: 'Incorrect username.'
                    });
                }
                User.validPassword(usr.password, password, function(err, valid) {
                    if (err) {
                        return done(err);
                    }
                    if (!valid) {
                        return done(null, false, {
                            message: 'Incorrect password.'
                        });
                    } else {
                        var token = jwt.encode({
                            username: username
                        }, config.secret);
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
            User.findOne({
                username: usr.username
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false);
                }
                return done(null, user);
            });
        }
    ));

    app.use('/', anonymous)
    app.use('/home', home)
    app.use('/users', users)
    app.use('/clients', clients)
    app.use('/comments', comments)

    // catch 404
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        res.render("404", {})
    });

    // error handlers

    /*    app.use(function(err, req, res, next) {
            if(err.status = 404) {
                res.render("404")
            } else if(err.status = 403) {
                res.render("403")
            }
            next(err);
        });*/

    // development error handler
    // will print stacktrace
    if (config.name == 'debug') {
        console.log("debug mode")
        app.use(function(err, req, res, next) {
            console.log(err)
            res.status(err.status || 500);
            res.render('500', {
                message: JSON.stringify(err.message),
                error: JSON.stringify(err)
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('500', {
            message: JSON.stringify(err.message),
            error: {}
        });
    });
    return app;
};

var config = require('./config/config');

var env = process.env['env'] || "debug";
env = env.toLowerCase();

var envConfig;
console.log("env: " + env)
if (env == 'debug')
    envConfig = config['debug'];
else if (env == 'release')
    envConfig = config['release'];
else if (env == 'test')
    envConfig = config['test'];

var app = init(envConfig);
module.exports = app;
