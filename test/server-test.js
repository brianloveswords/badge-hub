var environment = process.env.ENV = 'testing';

var vows = require('vows'),
    assert = require('assert'),
    settings = require('../settings')[environment],
    server = require('../server'),
    issuer = require('./fake-issuer');

var ip = '127.0.0.1';
var port = settings.port;

server.start();
vows.describe("Issuer Methods").addBatch({
  'server can be prodded': {
    topic: function () {
      issuer.get.root(this.callback)
    },
    'which should respond with a version number' : function(err, body) {
      var matches = !!body.version.match(/\d\.\d\.\d/);
      assert.equal(matches, true);
    }
  },
  'issuer can register identity': {
    topic: function() {
      issuer.post.register('nothing', this.callback)
    },
    'which should respond with 201 Created' : function(err, status) {
      assert.equal(status, 201)
    }
  },
  // FIXME: make this and the previous test happen sequentially
  'issuer can update identity manifest': {
    topic: function() {
      issuer.put.update('nothing', this.callback)
    },
    'which should respond with 200 OK' : function(err, status) {
      assert.equal(status, 200)
    }
  },
  
}).export(module);





