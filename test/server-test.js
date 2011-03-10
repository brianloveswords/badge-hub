var vows = require('vows'),
    assert = require('assert'),
    settings = require('../settings')['testing'],
    server = require('../server').server;

server.listen(settings.port);
vows.describe("Basic Server Functions").addBatch({
  'when server is loaded': {
    topic: function () {  return 'lol'; },

    'server responds' : function( topic ){
      assert.equal( topic, 'lol' );
    }
  }
}).run();
server.close();


