var router = require('./routes').router,
    http = require('http'),
    colors = require('colours');
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

exports.start = function(){
  console.log(colors.green + 'Listening:' + colors.reset + ' Hub on on port ' + settings.port + '...');
  server.listen(settings.port)
};
exports.stop = function(){
  console.log(colors.red + 'Stopping:' + colors.reset + ' Hub on port ' + settings.port + '...');
  server.close()
};

if (process.mainModule.filename == __filename) {
  console.log(colors.yellow + 'Using environment: ' + environment + colors.reset);
  exports.start();
}
