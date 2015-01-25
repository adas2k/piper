var express = require('express');
var router = express.Router();
var api = require('../controllers/api.js');
var _api = require('../controllers/v1.js');
var utils = require('../controllers/utils.js');
var V1Api = new _api();
var auth = require('../controllers/auth.js');
var basicAuth = require('../controllers/basic_auth.js');
auth.setAuthController(basicAuth.getAuthController());

// supported API versions
var apiVersionMap = {
  "v1": V1Api,
};

router.post('/api/:version/data', auth.authenticate, checkAndSetApi, function(req, res) {
  // generate sId
  console.log('->' + req.body);
  api.create(req.body, function(err, data) {
    if(err)
      return res.status(err.statusCode).json(err.errorObject);

    return res.status(201).json(data);
  });
});


router.get('/api/:version/data/:id', auth.authenticate, checkAndSetApi, function(req, res) {
  console.log('<-', req.params.id);
  api.get(req.params.id, function(err, data) {
    if (err)
      return res.status(err.statusCode).json(err.errorObject);

    return res.json(data);
  });
});

router.delete('/api/:version/data/:id', auth.authenticate, checkAndSetApi, function(req, res) {
  console.log('X', req.params.id);
  api.removeRecord(req.params.id, function(err) {
    if (err) 
      return res.status(err.statusCode).json(err.errorObject);
    
    return res.status(200).end();      
  });

});

// middleware to check API version
function checkAndSetApi(req, res, next) {
  var _api = apiVersionMap[req.params.version];
  if (_api == null) {
    return res.status(400).json({"status": "Bad Request", "message": "Unsupported API version"});
  }
  api.setVersion(_api);
  return next();
}

module.exports = router;
