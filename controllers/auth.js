function Auth() {};

Auth.setAuthController = function(auth) {
  Auth.controller = auth;
}

Auth.authenticate = function(req, res, next) {
  Auth.controller.authenticate(req, res, next);
};


module.exports = Auth;