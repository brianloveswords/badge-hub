var http = require('http'),
    settings = require('../settings')['testing'],
    journey = require('journey'),
    router = new(journey.Router);

router.map(function(){
  this.root.bind(function(req, res) {
    res.send("Fake Issuer v0.1.0");
  });
  this.get(/id\/?/).bind(function(req, res, data) {
    res.send(data);
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

if (process.mainModule.filename == __filename) {
  console.log('Fake Issuer listening on port ' + (settings.port + 100) + '…');
  server.listen(settings.port + 100);
} else {
  var getopt = {host: '127.0.0.1',port: settings.port,path: '/'};
  var postopt = {host: '127.0.0.1',port: settings.port,path: '/',method:'POST'};
  var putopt = {host: '127.0.0.1',port: settings.port,path: '/',method:'PUT'};
  var delopt = {host: '127.0.0.1',port: settings.port,path: '/',method:'DELETE'};
  
  exports.start = function(){ server.listen(settings.port + 100) };
  exports.stop = function(){ server.close() };
  
  // callbacks will be (err, data)
  exports.get = {
    root : function(callback){
      http.get(getopt, function(response){
        var body = '';
        response.on('data', function(chunk) {
          body += chunk;
        }).on('end', function() {
          callback(null, JSON.parse(body));
        }).on('error', function(e){
          callback(e, null);
        });
      })
    }
  }
  exports.post = {
    register : function(data, callback){
      postopt.path = '/issuer';
      var req = http.request(postopt, function(response){
        var body = '';
        response.on('error', function(e){
          callback(e, null);
        });
        callback(null, response.statusCode);
      })
      req.write(data);
      req.end();
    }
  }
  
  exports.put = {
    update : function(data, callback){
      putopt.path = '/issuer/1';
      var req = http.request(putopt, function(response){
        var body = '';
        response.on('error', function(e){
          callback(e, null);
        });
        callback(null, response.statusCode);
      })
      req.write(data);
      req.end();
    }
  }
}

