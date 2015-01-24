var assert = require('assert');
var chai = require("chai");
var request = require('supertest');  
var should = require('should'); 
var supertestChai = require('supertest-chai');
var unsupportedApiMessage = "Unsupported API version";
var errStatusMap = {
  400: "Bad Request", 
  401: "Unauthorized",
  404: "Not Found", 
  500: "Internal Server Error"
};

chai.should();
chai.use(supertestChai.httpAsserts);

describe('API Testing', function() {
  var url = 'http://localhost:3000';
  var apiV1 = 'v1';
  var apiV0 = 'v0';
  var data = {
    "test": 1234, 
  };

  before(function(done) {
    done();
  });

  describe('create', function() {
    var _id = "";
    it('should return 201: Created', function(done) {
      request(url)  
        .post('/api/' + apiV1 + '/data')
        .send(data)
        .end(function (err, res) {
          if(err)
            throw err
          res.should.be.json;
          res.should.have.status(201);
          res.body.should.have.property('id');
          _id = res.body.id;
          done();
        });
    });

    after(function(done) {
      request(url)
        .delete('/api/' + apiV1 + '/data/' + _id)
        .end(function (err, res) {
          if (err)
            throw err;

          res.should.have.status(200);
          done();
        });
    });

   });

  describe('get', function() {
    var id = "";
    before(function(done) {
      request(url)  
        .post('/api/' + apiV1 + '/data')
        .send(data)
        .end(function (err, res) {
          if(err)
            throw err;
          res.should.be.json;
          res.should.have.status(201);
          res.body.should.have.property('id');
          id = res.body.id;
          done();
      });
    });
    it('should return 200: OK and JSON data: ' + JSON.stringify(data), function(done) {
      request(url)
        .get('/api/' + apiV1 + '/data/' + id)
        .end(function (err, res) {
          if (err)
            throw err; 

          res.should.be.json;
          res.should.have.status(200);
          res.body.should.have.property('test');
          res.body.test.should.equal(1234);
          done();
        });
    });
    after(function(done) {
      request(url)
        .delete('/api/' + apiV1 + '/data/' + id)
        .end(function (err, res) {
          if (err)
            throw err;

          res.should.have.status(200);
          done();
        });
    });

    it('should return 404: Not found', function(done) {
      request(url)
        .get('/api/' + apiV1 + '/data/123456')
        .end(function(err, res) {
          if (err)
            throw err;

          res.should.have.status(404);
          done();
        });
    });
  });

  describe('remove', function (done) {
    var id = "";
    before(function(done) {
      request(url)  
        .post('/api/' + apiV1 + '/data')
        .send(data)
        .end(function (err, res) {
          if(err)
            throw err;
          res.should.be.json;
          res.should.have.status(201);
          res.body.should.have.property('id');
          id = res.body.id;
          done();
      });
    });

    it('should return 200: Ok', function(done) {
      request(url)
        .delete('/api/' + apiV1 + '/data/' + id)
        .end(function(err, res) {
          if (err)
            throw err;

          res.should.have.status(200);
          done();
        });
    });

    after(function(done) {
     request(url)
      .get('/api/' + apiV1 + '/data/' + id)
      .end(function(err, res) {
        if (err)
          throw err;

        res.should.have.status(404);
        done();
      });
    });
  });
describe('API version test', function(done) {
  it('should return  status 400 - CRUD requests', function(done) {
    request(url)
      .post('/api/v0/data')
      .send(data)
      .end(function (err, res) {
        if(err)
          throw err;
        res.should.be.json;
        res.should.have.status(400);
        res.body.should.have.property('status');
        res.body.should.have.property('message');
        res.body.status.should.equal(errStatusMap[400]);
        res.body.message.should.equal(unsupportedApiMessage);
        done();
      });
  });
});

});

