var express = require('express');
var router = express.Router();
var api = require('../controllers/api.js');
var _api = require('../controllers/v1.js');
var V1Api = new _api();

// supported API versions
var apiVersionMap = {
  "v1": V1Api,
};

router.post('/api/:version/data', function(req, res) {
  // generate sId
  console.log('->' + req.body);
  var _api = checkAndSetApi(req.params.version, api, res);
  _api.create(req.body, function(err, data) {
    if(err)
      return res.status(err.statusCode).json(err.errorObject);

    return res.status(201).json(data);
  });
});


router.get('/api/:version/data/:id', function(req, res) {
  console.log('<-', req.params.id);
  var _api = checkAndSetApi(req.params.version, api, res);
  _api.get(req.params.id, function(err, data) {
    if (err)
      return res.status(err.statusCode).json(err.errorObject);

    return res.json(data);
  });
});

router.delete('/api/:version/data/:id', function(req, res) {
  console.log('X', req.params.id);
  var _api = checkAndSetApi(req.params.version, api, res);
  _api.removeRecord(req.params.id, function(err) {
    console.log('cb called');
    if (err) 
      return res.status(err.statusCode).json(err.errorObject);
    
    return res.status(200).end();      
  });

});


checkAndSetApi = function(apiVersion, api, res) {
  var _api = apiVersionMap[apiVersion];
  if (_api == null)
    return res.status(400).json({"status": "Bad Request", "message": "Unsupported API version"});

  api.setVersion(_api);
  return api;
}

module.exports = router;
