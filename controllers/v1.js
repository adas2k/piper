var DB = require('../db/db_api.js');
var RedisDb = require('../db/redis_db.js');
var utils = require('../controllers/utils.js');

function V1Api() {
  DB.setController(new RedisDb(null, null));
  this.db = DB;
}

V1Api.prototype.create = function(data, cb) {
  this.db.create(JSON.stringify(data), function(err, sId) {
    if(err)
      return cb(utils.createError(500, 'Db error'), null);

    return cb(null, {id: sId});
  });
};

V1Api.prototype.get = function(sId, cb) {
  this.db.get(sId, function (err, doesExist, data) {
    if(err)
      return cb(utils.createError(500, 'DB error'), null);
    if (!doesExist) {
      console.log('no data');
      return cb(utils.createError(404, 'Record not found'), null);
    }
    return cb(null, JSON.parse(data));

  });
};

V1Api.prototype.removeRecord = function(key, cb) {
  
  this.db.removeRecord(key, function(err, doesExist) {
    if(err)
      return cb(utils.createError(500, 'Db error'));

    if(!doesExist)
      return cb(utils.createError(404, 'Record not found'));

    return cb(null);
  });
};

module.exports = V1Api;