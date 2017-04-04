var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var RememberMeStrategy = require('passport-remember-me').Strategy;
var config = require('../config/config');
var User = require('../models').User
var Token = require('../models').Token
var logger = require('./logger')

passport.serializeUser(function (user, done) {
    logger.debug("storing user id: " + user.id)
    done(null, user.id);
});

passport.deserializeUser(function (user, done) {
    logger.debug("looking for user id: " + user)
    User.findById(user, function (err, result) {
        logger.debug("user: " + JSON.stringify(result))
        done(null, result);
    })
});

// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Google profile), and
//   invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: process.env.Google_CRM_Client_Id,
    clientSecret: process.env.Google_CRM_Client_Secret,
    callbackURL: config.host + "/auth/google/callback"
},
    function (accessToken, refreshToken, profile, cb) {
        User.findOrCreate(profile, function (err, user) {
            return cb(err, user);
        });
    }
));

passport.use(new FacebookStrategy({
    clientID: process.env.Facebook_CRM_Client_Id,
    clientSecret: process.env.Facebook_CRM_Client_Secret,
    callbackURL: config.host + "/auth/facebook/callback"
},
    function (accessToken, refreshToken, profile, cb) {
        logger.debug("facebook profile: " + JSON.stringify(profile))
        User.findOrCreateFromSocialProfile(profile, function (err, user) {
            return cb(err, user);
        });
    }
));

passport.use(new RememberMeStrategy(
    function (token, done) {
        logger.debug("token: " + token)
        Token.consume(token, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            return done(null, user);
        });
    },
    Token.issue
));

module.exports = passport;