
var express = require('express');
var app = module.exports = express.createServer();

var port = 3000;

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('view options', {
      layout: false
  });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  
});

app.configure('test', function(){
  port = 4000;
});

require("./Sockets")(app);
require("./Routes")(app);


app.listen(port);

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
