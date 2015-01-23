function API() {};

API.setVersion = function(apiVersion) {
  API.api = apiVersion;
}

API.create = function(data, cb) {
  API.api.create(data, cb);
};

API.get = function(key, cb) {
  API.api.get(key, cb);
};

API.removeRecord = function(key, cb) {
  API.api.removeRecord(key, cb);
};

API.update = function(key, data, cb) {
  API.api.update(key, data, cb);
};

module.exports = API;