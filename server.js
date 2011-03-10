var router = require('./routes').router,
    http = require('http');
var environment = (process.env.ENV || 'development'),
    settings = require('./settings')[environment]

// should die if invalid settings
if (!settings) {
  console.log('Invalid environment: ' + environment);
  process.exit();
}

var server = http.createServer(function(request, response){
  var body = '';
  request.addListener('data', function(chunk) { body += chunk });
  request.addListener('end', function() {
    router.handle(request, body, function(result) {
      response.writeHead(result.status, result.headers);
      response.end(result.body);
    })
  })
})


if (process.mainModule.filename == __filename) {
  console.dir(process);
  console.log('Using environment "' + environment + '"');
  console.log('Listening on port ' + settings.port + '…');
  server.listen(settings.port);
} else {
  exports.server = server;
}
