var redis = require("redis");

var DBS = {
    "development":1
  , "test":2
}

module.exports = {
  
  createClient:function(cb){
    var client = redis.createClient();
    client.select(DBS[process.env.NODE_ENV || "development"], cb);
    return client;
  }
  
};