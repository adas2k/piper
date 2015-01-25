var async = require('async');
var redis = require('redis');
var utils = require('../controllers/utils.js');

function RedisDB(host, port) {
  this.client = redis.createClient();
  this.client.on("error", function(err) {
    console.log('Error occured: ' + err);
  });
}

RedisDB.prototype.create = function(schema, key, data, cb) {
  this.client.hset(schema, key, data);
  if (cb == null || cb == undefined)
    return;
  return cb(null);
};

RedisDB.prototype.get = function(schema, key, cb) {
  var client = this.client;
  async.series([
    // checks key
    function(callback) {  
      client.exists(schema, function(err, doesExist){
        // db error
        if(err)
          return callback(err, null);

        if (!doesExist) 
          return callback(null, {doesExist: false});

        return callback(null, null);
      });
    }, 
    // checks hash key
    function(callback) {
      client.hexists(schema, key, function(err, doesExist) {
        // db error
        if(err)
          return callback(err, null);

        if (!doesExist)
          return callback(null, {doesExist: false});

        return callback(null, null);
      });
    }, 
    // gets the actual data
    function(callback) {    
      client.hget(schema, key, function(err, data) {
        if(err)
          return callback(err, null);

        if (data == null || data == undefined)
          return callback(null, {doesExist: false});
        
        return callback(null, {doesExist: true, data: data});
      });
    }
  ], 
  // returns the result
  function(err, result) {
    // discards null entries
    for(var i=0; i<result.length; i++) {
      if(result[i] != null) {
        if (!result[i].doesExist) 
          return cb(err, false, null);

        return cb(err, true, result[i].data);
      }
    }
  });
};

RedisDB.prototype.removeRecord = function(schema, key, cb) {
  this.client.hdel(schema, key, function(err, numRemoved) {
    if(err)
      return cb(true, null);

    if (!numRemoved)
      return cb(false, false);

    return cb(false, true);
  });
};
var instance = null;

module.exports = {
  
  getRedisDBClient: function(host, port) {
    if (instance == null)
      instance = new RedisDB(host, port);
    return instance;
  }
};