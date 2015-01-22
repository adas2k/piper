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
  async.series([
    // checks key
    function(callback) {
      console.log(this.client);
      this.client.exists(key, function(err, doesExist){
        console.log('cb');
        // db error
        if(err)
          callback(err, null);

        if (!doesExist) {
          console.log('does not exist');
          callback(null, {doesExist: false});
        }

        callback(null, null);
      });
    }, 
    // checks hash key
    function(callback) {
      this.client.hexists(key, "data", function(err, doesExist) {
        // db error
        if(err)
          callback(err, null);

        if (!doesExist)
          callback(null, {doesExist: false});

        callback(null, null);
      });
    }, 
    // gets the actual data
    function(callback) {  
      this.client.hget(key, "data", function(err, data) {
        if(err)
          callback(err, null);

        if (data == null || data == undefined)
          callback(null, {doesExist: false});
        
        console.log(data);
        callback(null, {doesExist: false, data: data});
      });
    }
  ], 
  // returns the result
  function(err, result) {
    // discards null entries
    console.log (result);

    return cb(err, doesExist, result[2]);
  });
};

RedisDB.prototype.remove = function(key, cb) {
  client.del(sId, function(err, numRemoved) {
    if(err)
      return cb(true, null);

    if (!numRemoved)
      return cb(false, false);

    return cb(false, true);
  });
};

module.exports = RedisDB;