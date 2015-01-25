var DB = require('../db/db_api.js');
var RedisDb = require('../db/redis_db.js');
var utils = require('../controllers/utils.js');
var DATA_SCHEMA_NAME = "DATA_SCHEMA";

function V1Api() {
  // use default port for now
  DB.setController(RedisDb.getRedisDBClient(null, null));
  this.db = DB;
}

V1Api.prototype.create = function(data, cb) {
  var sId = utils.generateRandom();
  this.db.create(DATA_SCHEMA_NAME, sId, JSON.stringify(data), function(err) {
    if(err)
      return cb(utils.createError(500, 'Db error'), null);

    return cb(null, {id: sId});
  });
};

V1Api.prototype.get = function(key, cb) {
  this.db.get(DATA_SCHEMA_NAME, key, function (err, doesExist, data) {
    if(err)
      return cb(utils.createError(500, 'DB error'), null);
    if (!doesExist) 
      return cb(utils.createError(404, 'Record not found'), null);
    
    return cb(null, JSON.parse(data));

  });
};

V1Api.prototype.removeRecord = function(key, cb) {
  this.db.removeRecord(DATA_SCHEMA_NAME, key, function(err, doesExist) {
    if(err)
      return cb(utils.createError(500, 'Db error'));

    if(!doesExist)
      return cb(utils.createError(404, 'Record not found'));

    return cb(null);
  });
};

module.exports = V1Api;