var http = require('http'),
    url = require('url');

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

var Issuer = function(){ };

Issuer.register = function(req, res, data) {
  var getIdentity = function(location, callback) {
    var options = url.parse(location);
    options['host'] = options.hostname;
    options['path'] = options.pathname;
    options['method'] = 'GET';
    retrieveBody(options, '', callback)
  }

  // get the identity and echo it back
  getIdentity(data.identity, function(err, response){
    var manifest = JSON.parse(response.body);
    res.send(manifest);
  })
}

exports.issuer = Issuer;
