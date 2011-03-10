var http = require('http'),
    settings = require('../settings')['testing'],
    journey = require('journey'),
    router = new(journey.Router),
    colors = require('colours');


var identity = exports.identity = {
  name: 'Fake Issuer',
  description: 'I issue fake badges and drink tigerblood',
  key: 'somekey'
}

router.map(function(){
  this.root.bind(function(req, res) {
    res.send("Fake Issuer v0.1.0");
  });
  this.get(/identity(\.json)?/).bind(function(req, res) {
    res.send(identity);
  })
})

var server = http.createServer(function(request, response){
  var body = '';
  request.addListener('data', function(chunk) { body += chunk });
  request.addListener('end', function() {
    router.handle(request, body, function(result) {
      response.writeHead(result.status, result.headers);
      response.end(result.body);
    });
  });
});

var getopt = {host: '127.0.0.1',port: settings.port,path: '/',method:'GET'};
var postopt = {host: '127.0.0.1',port: settings.port,path: '/',method:'POST'};
var putopt = {host: '127.0.0.1',port: settings.port,path: '/',method:'PUT'};
var delopt = {host: '127.0.0.1',port: settings.port,path: '/',method:'DELETE'};

var retrieveStatus = function(opt, data, callback) {
  var req = http.request(opt, function(response){
    response.on('error', function(e){ callback(e, null) });
    callback(null, response.statusCode);
  })
  req.write(data); req.end();
}
var retrieveBody = function(opt, data, callback) {
  var req = http.request(opt, function(response){
    var body = '';
    response.on('data', function(chunk) {
      body += chunk;
    }).on('end', function() {
      callback(null, {body: body, status: response.statusCode });
    }).on('error', function(e){
      callback(e, null);
    });
  })
  req.write(data); req.end();
}

exports.port = settings.port + 1;
exports.start = function(){
  var port = exports.port;
  console.log(colors.green + 'Listening' + colors.white + ' • '  + colors.blue + port + colors.reset + ' - ' + 'Fake Issuer');
  server.listen(port);
};
exports.stop = function(){
  server.close()
};

// callbacks will be (err, data)
exports.get = {
  root : function(callback){
    retrieveBody(getopt, '', callback);
  },
};
exports.post = {
  register : function(data, callback){
    postopt.path = '/issuer';
    retrieveBody(postopt, data, callback);
  },
  badge: function(data, callback) {
    postopt.path = '/issuer/badge';
    retrieveStatus(postopt, data, callback);
  },
};
exports.put = {
  update : function(data, callback){
    putopt.path = '/issuer/1';
    retrieveStatus(putopt, data, callback);
  },
  badge: function(data, callback) {
    putopt.path = '/issuer/badge/1';
    retrieveStatus(putopt, data, callback);
  }
};
exports.del = {
  badge: function(data, callback) {
    delopt.path = '/issuer/badge/1';
    retrieveStatus(delopt, data, callback);
  },
};


if (process.mainModule.filename == __filename) {
  exports.start();
}

