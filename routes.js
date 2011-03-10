var environment = (process.env.ENV || 'development');
var hub = require('./hub'),
    journey = require('journey'),
    router = new(journey.Router);

router.map(function(){
  /* root */
  this.root.bind(function(req, res) {
    res.send({version: '0.1.0'});
  });

  /* issuer/badge */
  this.post(/issuer\/badge\/?/).bind(function(req, res, data) {
    res.send({
      route: "POST issuer/badge",
      data: data
    });
  });
  this.put(/issuer\/badge\/(\d+)/).bind(function(req, res, id, data) {
    res.send({
      route: "PUT issuer/badge" + id,
      data: data
    });
  });
  this.del(/issuer\/badge\/(\d+)/).bind(function(req, res, id) {
    res.send("DELETE issuer/badge/" + id);
  });
  
  // issuer: register
  this.post(/issuer\/?/).bind( hub.issuer.register );
  
  // issuer: update
  this.put(/issuer\/(\d+)/).bind(function(req, res, id, data) {
    res.send({
      route: "PUT issuer/" + id,
      data: data
    });
  });
})

exports.router = router;
