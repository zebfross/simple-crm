var passport = require('passport')

module.exports = function(router) {

  router.all('*', function(req, res, next) {
  	if(req.cookies.access_token) {
  		req.body.access_token = req.cookies.access_token.replace(/\"/g, "")
  	}
  	next()
  }, passport.authenticate('bearer', {session: false}))
}
