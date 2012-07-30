RedisFactory = require("../lib/RedisFactory");


describe("RedisFactory", function(){
  
  it("Select correct db", function(done){
    var client = RedisFactory.createClient(function(){
      client.selected_db.should.equal(2);
      done();
    });
  });
  
});