var DB = require('../db/db_api.js');
var RedisDb = require('../db/redis_db.js');
var utils = require('../controllers/utils.js');
var DATA_SCHEMA_NAME = "DATA_SCHEMA";
var USER_SCHEMA_NAME = "USER_SCHEMA";

function V1Api() {
  // use default port for now
  DB.setController(RedisDb.getRedisDBClient(null, null));
  this.db = DB;

  this.createRequest = function(schemaName, data, cb) {
    var id = utils.generateRandom();
    var retData = {};
    this.db.create(schemaName, id, data, function(err) {
      if (err)
        return cb(utils.createError(500, 'Db error'), null);

      retData.id = id;
      retData.eTag = utils.calculateHash(data);
      return cb(null, retData);
    });
  };

  this.getRequest = function(schemaName, key, options, cb) {
    var retData = {};
    this.db.get(schemaName, key, function (err, doesExist, data) {
      if(err)
        return cb(utils.createError(500, 'DB error'), null);
      if (!doesExist) 
        return cb(utils.createError(404, 'Record not found'), null);
      if (options.eTag != null || options.eTag != undefined) {
        console.log('etag exists')
        var tmpData = JSON.parse(data);
        var hash = utils.calculateHash(tmpData);
        // eTag is equal
        if (hash === options.eTag)
          return cb(null, null);
        retData.eTag = hash;
      }
      retData.data = JSON.parse(data);

      return cb(null, retData);
    });
  };

  this.removeRecord = function(schemaName, key, cb) {
    this.db.removeRecord(schemaName, key, function(err, doesExist) {
      if(err)
        return cb(utils.createError(500, 'Db error'));

      if(!doesExist)
        return cb(utils.createError(404, 'Record not found'));

      return cb(null);
    });
  };
}

// Data escrow APIs
V1Api.prototype.createData = function(data, cb) {
  this.createRequest(DATA_SCHEMA_NAME, JSON.stringify(data), cb);
};

V1Api.prototype.getData = function(key, options, cb) {
  this.getRequest(DATA_SCHEMA_NAME, key, options, cb);
};

V1Api.prototype.removeData = function(key, cb) {
  this.removeRecord(DATA_SCHEMA_NAME, key, cb);
};


// User APIs
V1Api.prototype.createUser = function(userData, cb) {
  this.createRequest(USER_SCHEMA_NAME, JSON.stringify(userData), cb);
};

V1Api.prototype.getUser = function(userId, cb) {
  this.getRequest(USER_SCHEMA_NAME, key, cb);
};

V1Api.prototype.removeUser = function(key, cb) {
  this.removeRecord(USER_SCHEMA_NAME, key, cb);
};

module.exports = V1Api;