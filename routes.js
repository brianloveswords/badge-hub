var journey = require('journey'),
    router = new(journey.Router);

router.map(function(){
  /* root */
  this.root.bind(function(req, res) {
    res.send("Hub v0.1.0");
  });
  /* issuer/ */
  this.post(/issuer\/?/).bind(function(req, res, data) {
    res.send({
      route: "POST issuer/",
      data: data
    });
  });
  this.put(/issuer\/(.*)/).bind(function(req, res, id, data) {
    res.send({
      route: "PUT issuer/" + id,
      data: data
    });
  });

  /* issuer/badge */
  this.post(/issuer\/badge\/?/).bind(function(req, res, data) {
    res.send({
      route: "POST issuer/badge",
      data: data
    });
  });
  this.put(/issuer\/badge\/(.*)/).bind(function(req, res, id, data) {
    res.send({
      route: "PUT issuer/badge" + id,
      data: data
    });
  });
  this.del(/issuer\/badge\/(.*)/).bind(function(req, res, id) {
    res.send("DELETE issuer/badge/" + id);
  });
})

exports.router = router;