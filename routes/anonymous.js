var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  res.render('pages/landing', {layout: 'web'});
});

router.get('/about', function(req, res) {
    res.render('pages/about', {layout: 'web'})
})

module.exports = router;
