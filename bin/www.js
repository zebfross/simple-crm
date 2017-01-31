#!/usr/bin/env node
var debug = require('debug')('SimpleCrm');
var app = require('../app');
var http = require('http');
var https = require('https');

app.set('port', process.env.PORT || 3000);

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
/*https.createServer(app).listen(443, function() {
	console.log('Express server listening on port ' + server.address().port);
});*/
