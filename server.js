var router = require('./routes').router,
    http = require('http');

http.createServer(function(request, response){
  var body = '';
  request.addListener('data', function(chunk) { body += chunk });
  request.addListener('end', function() {
    router.handle(request, body, function(result) {
      response.writeHead(result.status, result.headers);
      response.end(result.body);
    })
  })
}).listen(8080);
console.dir('Listening on port 8080…');
