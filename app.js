var express = require('express');
var router = express.Router();
var path = require('path');
var favicon = require('serve-favicon');
var winston = require('winston')
var winstonMongodb = require('winston-mongodb').MongoDB;
var expressWinston = require('express-winston');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('./server/auth');
var session = require('cookie-session')
var jwt = require('jwt-simple');
var flash = require('express-flash')
var exphbs = require('express-handlebars')
var helpers = require('./views/helpers')

var anonymous = require('./routes/anonymous')
var home = require('./routes/home')
var users = require('./routes/users')
var clients = require('./routes/clients')
var comments = require('./routes/comments')
var User = require('./models/user')
var config = require('./config/config')

var logger = require('./server/logger')

var app = express();

// view engine setup
//var hbs = exphbs.create({})
//hbs.extname = '.hbs'
//app.engine('handlebars', hbs.engine)

//app.set('views', path.join(__dirname, config.viewPath));
app.set('views', path.join(__dirname, 'views'))

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: helpers
}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));    

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
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
app.use( function( req, res, next ) {
    var _render = res.render;
    res.render = function( view, options, fn ) {
        if(req.user && !res.user) {
            if(options == null)
                options = {}
            options.user = req.user;
        }
        _render.call( this, view, options, fn );
    }
    next();
});

var mongodbUrl = config.db;
logger.info('Using MongoDB URL: %s', mongodbUrl);


mongoose.Promise = require('bluebird');
mongoose.connect(mongodbUrl, function(error) {
    if (error) {
        logger.error('Could not connect to DB: %s', error);
        process.exit(1);
    } else {
        logger.info('successfully connected to mongo');
    }
});

mongoose.connection.on('error', function(error) {
    logger.error('MongoDB connection error: %s', error);
});

app.use('/', anonymous)

app.get('/auth/google',
    passport.authenticate('google', { scope: 'profile' }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    function (req, res) {
        res.redirect('/home');
    });

app.get('/auth/facebook',
    passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function (req, res) {
        res.redirect('/home');
    });

app.use('/home', home)
app.use('/users', users)
app.use('/clients', clients)
app.use('/comments', comments)

app.get('/fail', function(req, res, next) {
    throw new Error('called fail method')
});

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
//if (config.name == 'debug') {
    logger.info("debug mode")
    app.use(function(err, req, res, next) {
        logger.info(err)
        res.status(err.status || 500);
        res.render('500', {
            message: JSON.stringify(err.message),
            error: JSON.stringify(err)
        });
    });
//}

// production error handler
// no stacktraces leaked to user
/*app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('500', {
        message: JSON.stringify(err.message),
        error: {}
    });
});*/

module.exports = app;
