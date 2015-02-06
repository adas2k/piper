function API() {};

API.setVersion = function(apiVersion) {
  API.api = apiVersion;
}

API.createData = function(data, cb) {
  API.api.createData(data, cb);
};

API.getData = function(key, options, cb) {
  API.api.getData(key, options, cb);
};

API.removeData = function(key, cb) {
  API.api.removeData(key, cb);
};

API.updateData = function(key, data, cb) {
  API.api.updateData(key, data, cb);
};

API.createUser = function(userData, cb) {
  API.api.createUser(userData, cb);
};

API.updateUser = function(userId, userData, cb) {

};

API.removeUser = function(userId, cb) {

};

API.getUser = function(userId, cb) {

};

API.createDevice = function(deviceData, cb) {

};

API.updateDevice = function(deviceId, deviceData, cb) {

};

API.removeDevice = function(deviceId, cb) {

};

API.getDevice = function(deviceId, cb) {

};

API.associateDeviceToUser = function(userId, deviceId, cb) {

};

API.disassociateDeviceToUser = function(userId, deviceId, cb) {

};

API.sendToDevice = function(deviceId, data, cb) {

};


module.exports = API;