var async = require('async');
var redis = require('redis');
var utils = require('../controllers/utils.js');

var STORE_HASH_KEY = "data";

function RedisDB(host, port) {
  this.client = redis.createClient();
  this.client.on("error", function(err) {
    console.log('Error occured: ' + err);
  });
}

RedisDB.prototype.create = function(data, cb) {
  var sId = utils.generateRandom();
  this.client.hset(sId, STORE_HASH_KEY, data);
  if (cb == null || cb == undefined)
    return;
  return cb(null, sId);
};

RedisDB.prototype.get = function(key, cb) {
  var client = this.client;
  async.series([
    // checks key
    function(callback) {  
      client.exists(key, function(err, doesExist){
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
      client.hexists(key, "data", function(err, doesExist) {
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
      client.hget(key, "data", function(err, data) {
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

RedisDB.prototype.removeRecord = function(key, cb) {
  this.client.del(key, function(err, numRemoved) {
    console.log('hello');
    if(err)
      return cb(true, null);

    if (!numRemoved)
      return cb(false, false);

    return cb(false, true);
  });
};

module.exports = RedisDB;