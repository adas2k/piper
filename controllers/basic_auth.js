var RedisDb = require('../db/redis_db.js');
var INVALID_CREDS_MSG = {"status": "Unauthorized", "message": 
"Invalid credentials"};
var AUTH_SCHEMA = "AUTH_SCHEMA";

function BasicAuth(dbController) {
  this.dbController = dbController;
}

BasicAuth.prototype.authenticate = function(req, res, next) {
  
  var auth = req.headers.authorization;
  if(!auth)
    return res.status(400).end();

  var data = auth.split(' ');
  if (data[0].toUpperCase() != 'BASIC')
    return res.status(400).end();

  if (!data[1])
    return res.status(400).end();

  if (data[1].length == 0)
    return res.status(401).json(INVALID_CREDS_MSG);

  auth = new Buffer(data[1], 'base64').toString();

  auth = auth.match(/^([^:]*):(.*)$/);
  if (!auth)
    return res.status(400).json(INVALID_CREDS_MSG);

  // find the credential
  this.dbController.get(AUTH_SCHEMA, auth[1], function(err, doesExist, data) {
    if (err)
      return res.status(500).end();
    if(!doesExist)
      return res.status(401).json(INVALID_CREDS_MSG);
    if (auth[2] !== data)
      return res.status(401).json(INVALID_CREDS_MSG);
    return next();
  });
};

var instance = null;

module.exports = {
  
  getAuthController: function() {
    if (instance == null)
      instance = new BasicAuth(RedisDb.getRedisDBClient(null, null));
    return instance;
  }
};