var winston = require('winston');
var winstonMongodb = require('winston-mongodb').MongoDB;
var config = require('../config/config')

    // Connection URL
logger = new (winston.Logger)({
    transports: [
        new (winstonMongodb)({ level: 'warn', db: config.db })
    ],
    exceptionHandlers: [
        new (winston.transports.Console)({ json: true, timestamp: true })
    ],
    exitOnError: false
});

logger.add(winston.transports.Console, {level: 'silly'})

module.exports = logger