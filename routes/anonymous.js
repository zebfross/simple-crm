var express = require('express');
var router = express.Router();
//var tesseract = require('node-tesseract')

/* GET home page. */
router.get('/', function (req, res) {
  res.render('pages/landing', {layout: 'web'});
});

router.get('/about', function(req, res) {
    res.render('pages/about', {layout: 'web'})
})

/*router.get('/ocr', function(req, res) {
  var options = {
    l: 'eng'
  }
  tesseract.process(__dirname + '/../public/images/ocr1.png', options, function(err, text) {
    var model = {}
    if(err) {
      model.error = err
    } else {
      model.text = text
    }
    res.render('pages/ocr', model)
  });
})*/

module.exports = router;
