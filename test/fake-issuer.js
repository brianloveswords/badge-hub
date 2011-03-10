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
  var options = {
    host: '127.0.0.1',
    port: settings.port,
    path: '/'
  }
  exports.start = function(){ server.listen(settings.port + 100) };
  exports.stop = function(){ server.close() };
  
  // callbacks will be (err, data)
  exports.get = {
    root : function(callback){
      http.get(options, function(response){
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
  
}

