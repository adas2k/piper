function DB() {};

DB.setController = function(dbController) {
  DB.controller = dbController;
}

DB.create = function(schema, key, data, cb) {
  DB.controller.create(schema, key, data, cb);
};

DB.get = function(schema, key, cb) {
  DB.controller.get(schema, key, cb);
};

DB.removeRecord = function(schema, key, cb) {
  DB.controller.removeRecord(schema, key, cb);
};

DB.update = function(schema, key, data, cb) {
  DB.controller.update(schema, key, data, cb);
};

module.exports = DB;