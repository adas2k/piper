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

// Data Escrow API endpoints
router.post('/api/:version/data', auth.authenticate, checkAndSetApi, function(req, res) {
  // generate sId
  console.log('->' + req.body);
  api.createData(req.body, function(err, data) {
    if(err)
      return res.status(err.statusCode).json(err.errorObject);

    if ((data.eTag != null || data.eTag != undefined) && data.eTag.length > 0)
      res.header('ETag', data.eTag);

    delete data.eTag;
    return res.status(201).json(data);
  });
});


router.get('/api/:version/data/:id', auth.authenticate, checkAndSetApi, function(req, res) {
  console.log('<-', req.params.id);
  var options = {};
  options.eTag = req.headers['if-none-match'];
  console.log(req.headers);
  console.log('etag = ' + options.eTag);
  api.getData(req.params.id, options, function(err, data) {
    if (err)
      return res.status(err.statusCode).json(err.errorObject);

    if (data==null && options.eTag)
      return res.status(304).end();

    if(data.eTag)
      res.header('ETag', data.eTag)

    return res.json(data.data);
  });
});

router.delete('/api/:version/data/:id', auth.authenticate, checkAndSetApi, function(req, res) {
  console.log('X', req.params.id);
  api.removeData(req.params.id, function(err) {
    if (err) 
      return res.status(err.statusCode).json(err.errorObject);
    
    return res.status(200).end();      
  });
});

// User Endpoints
router.post('/api/:version/user', auth.authenticate, checkAndSetApi, function(req, res) {
  api.createUser(req.body, function(err, data) {
    if (err)
      return res.status(err.statusCode).json(err.errorObject);

    return res.status(201).json(data);
  });
});

router.get('/api/:version/user/:id', auth.authenticate, checkAndSetApi, function(req, res) {
  console.log('<-', req.params.id);
  api.getUser(req.params.id, function(err, data) {
    if (err)
      return res.status(err.statusCode).json(err.errorObject);

    return res.json(data);
  });
});

router.delete('/api/:version/user/:id', auth.authenticate, checkAndSetApi, function(req, res) {
  console.log('X', req.params.id);
  api.removeUser(req.params.id, function(err) {
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
