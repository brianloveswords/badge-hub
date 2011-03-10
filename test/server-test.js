var environment = process.env.ENV = 'testing';

var vows = require('vows'),
    assert = require('assert'),
    settings = require('../settings')[environment],
    server = require('../server'),
    issuer = require('./fake-issuer');

var ip = '127.0.0.1';
var port = settings.port;

server.start(); issuer.start();
vows.describe("Basic Server Functions").addBatch({
  'when server is prodded': {
    topic: function () {
      return 'lol';
    },

    'respond with version number' : function( topic ){
      assert.equal( topic, 'lol' );
    }
  }
}).run();
server.stop(); issuer.stop();


