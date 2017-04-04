var config = require('../config/config')
var mongoose = require('mongoose')
var logger = require('../server/logger')
var hat = require('hat')

var TokenSchema = mongoose.Schema({
    token: { type: String, index: true },
    userId: String
}, { strict: true })

TokenSchema.static('consume', function (token, callback) {
    logger.debug('token.consume finding token ' + token)
    this.findOne({ token: token }, function (err, result) {
        if (err || result == undefined) {
            logger.error("token.consume", err)
            callback(err, null)
        } else {
            logger.debug('token.consume finding user ' + JSON.stringify(result))
            User.findOne({ id: result.userId }, function (err, user) {
                callback(err, user)
            })
        }
    })
})

TokenSchema.static('issue', function (user, done) {
    var token = new Token({ token: hat(), userId: user.id })
    token.save(function (err, result) {
        if (err) { return done(err); }
        return done(null, token.token);
    });
}, { strict: true })

var Token = module.exports = mongoose.model(config.db_prefix + 'Token', TokenSchema)