var environment = process.env.ENV = 'testing';

var vows = require('vows'),
    assert = require('assert'),
    settings = require('../settings')[environment],
    server = require('../server'),
    issuer = require('./fake-issuer');

var ip = '127.0.0.1';
var port = settings.port;

server.start();
vows.describe("Basic Server Functions").addBatch({
  'server can be prodded': {
    topic: function () {
      issuer.get.root(this.callback)
    },
    'which should respond with a version number' : function(err, body){
      var matches = !!body.version.match(/\d\.\d\.\d/);
      assert.equal(true, matches);
    }
  }
}).export(module);





