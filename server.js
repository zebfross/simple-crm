var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 50800;

var router = express.Router();

router.get('/', function(req, res) {
	res.json({ message: 'hello, world!!!'});
});

app.use('/', router);

app.listen(port);
console.log('magic happens on port ' + port);
