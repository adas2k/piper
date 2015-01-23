function DB() {};

DB.setController = function(dbController) {
  DB.controller = dbController;
}

DB.create = function(data, cb) {
  DB.controller.create(data, cb);
};

DB.get = function(key, cb) {
  DB.controller.get(key, cb);
};

DB.removeRecord = function(key, cb) {
  DB.controller.removeRecord(key, cb);
};

DB.update = function(key, data, cb) {
  DB.controller.update(key, data, cb);
};

module.exports = DB;