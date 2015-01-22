var crypto = require('crypto');

var errStatusMap = {
  400: "Bad Request", 
  401: "Unauthorized",
  404: "Not Found", 
  500: "Internal Server Error"
};

module.exports = {
  generateRandom: function() {
      var sha = crypto.createHash('sha256');
      sha.update(Math.random().toString());
      return sha.digest('hex');
  }, 

  createError: function(httpStatus, messageString) {
    var err = {};
    err.errorObject = {};
    err.statusCode = httpStatus;
    err.errorObject.status = errStatusMap[httpStatus];
    err.errorObject.message = messageString;
    return err;
  }
}