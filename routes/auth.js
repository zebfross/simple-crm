var passport = require('passport')

module.exports = function(router) {

  router.all('*', function(req, res, next) {
    if(req.isAuthenticated()) {
      return next()
    } else {
      return res.redirect("/users/login")
    }
  })
}
