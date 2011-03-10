var environment = process.env.ENV = 'testing';

var vows = require('vows'),
    assert = require('assert'),
    settings = require('../settings')[environment],
    server = require('../server'),
    issuer = require('./fake-issuer');

var ip = '127.0.0.1';
var port = settings.port;

/* most of the heavy lifting is done by fake-issuer */
[ server, issuer ].forEach(function($){ $.start() });
vows.describe("Issuer Methods").addBatch({
  'Server can be prodded': {
    topic: function () {
      issuer.get.root(this.callback)
    },
    'which should respond with a version number' : function(err, res) {
      var version = JSON.parse(res.body).version;
      var matches = !!version.match(/\d\.\d\.\d/);
      assert.equal(matches, true);
    }
  },
  
  'An issuer can' : {
    'register its identity': {
      topic: function() {
        issuer.post.register('location=http://127.0.0.1:' + issuer.port + '/identity.json', this.callback)
      },
      'and get back its own manifest' : function(err, res) {
        assert.equal(res.body, JSON.stringify(issuer.identity));
      },
      'then update its identity': {
        topic: function() {
          issuer.put.update('nothing', this.callback)
        },
        'and get back 200 OK' : function(err, status) {
          assert.equal(status, 200)
        },
      },
      'issue a badge': {
        topic: function() {
          issuer.post.badge('nothing', this.callback)
        },
        'and get back 201 Created' : function(err, status) {
          assert.equal(status, 201)
        },
        'update that badge': {
          topic: function() {
            issuer.put.badge('nothing', this.callback)
          },
          'and get back 200 OK' : function(err, status) {
            assert.equal(status, 200)
          },
          'then delete that badge': {
            topic: function() {
              issuer.del.badge('', this.callback)
            },
            'and get back 200 OK' : function(err, status) {
              assert.equal(status, 200)
            },
          },
        },
      },
    },
  },
}).export(module);





