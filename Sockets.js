var socketio = require("socket.io");
var RedisFactory = require("./lib/RedisFactory");


module.exports = function(app){
  
  var io = socketio.listen(app);
    
  io.on("connection", function(socket){
        
    var sub = RedisFactory.createClient();
  
    sub.psubscribe("todo:*");
    
    sub.on("pmessage", function(pattern, key, ob){
      socket.emit(key, ob)    
    });
    
    socket.on("disconnect", function(){
      sub.quit();
    })
  });
  
};