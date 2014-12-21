var express = require('express');
var router = express.Router();

require('./auth')(router)

/* GET home page. */
router.get('/', function (req, res) {
  console.log("got here /home")
  if(req.headers["X-Requested-With"] == "XMLHttpRequest") {
    res.json({});
  } else {
    res.render('index', { title: 'Express' });
  }
});

module.exports = router;