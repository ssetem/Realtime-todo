var request = require("request");
var Todo    = require("../TodoModel");

var io = require("socket.io-client");

var createSocket = function(cb){
  var client =  io.connect("http://localhost:4000", {
    transports: ['websocket'],
    'force new connection': true
  });
  client.on("connect", function(){
    cb(client);
  })
}

describe("WebApi", function(){
  
  var cachedTodoId = null;
  
  before(function(done){
    require("../App");
    Todo.collection.remove(done);  
  });

  it("GET /", function(done){
    request.get("http://localhost:4000/", function(err, res, body){
      res.statusCode.should.equal(200)
      done();
    });
  });

  
  it("POST /api/todos  (Validation Error)", function(done){
    request.post(
      "http://localhost:4000/api/todos", 
      {json:true}, 
      function(err, res, body){
        body.message.should.equal("Validation failed");
        res.statusCode.should.equal(400)
        done();
    });
    
  });
  
  
  it("POST /api/todos  (Success)", function(done){
    var options = {
      uri:"http://localhost:4000/api/todos", 
      json:{
        title:"Got to do something!"
      }
    };
          
    createSocket(function(socket){
      socket.on("todo:save", function(t){
        var todo = JSON.parse(t);
        todo._id.should.equal(cachedTodoId);
        todo.title.should.equal("Got to do something!");
        todo.completed.should.be.false;          
        done();        
      })
      
      request.post(options, function(err, res, body){
        res.statusCode.should.equal(200);
        body.title.should.equal("Got to do something!");
        cachedTodoId = body._id;
      });
      
    });

  });
  
  
  it("GET /api/todos", function(done){
    request.get('http://localhost:4000/api/todos', {json:true}, function(err, res, body){
      res.statusCode.should.equal(200);
      body.length.should.equal(1);
      body[0].title.should.equal("Got to do something!");
      done();
    });
  });
  
  it("PUT /api/todos  (404)", function(done){
    var options = {
      uri:"http://localhost:4000/api/todos/12908374askdjfhasldhf", 
      json:true
    };
    request.put(options, function(err, res, body){
      res.statusCode.should.equal(404);
      done();
    });
    
  });
  
  it("PUT /api/todos  (Success)", function(done){
    var options = {
      uri:"http://localhost:4000/api/todos/"+cachedTodoId, 
      json:{completed:true, title:"Updated todo!"}
    };
    
    createSocket(function(socket){
      socket.on("todo:save", function(t){
        var todo = JSON.parse(t);
        todo._id.should.equal(cachedTodoId);
        todo.title.should.equal("Updated todo!");
        todo.completed.should.be.true;          
        done();        
      })
      
      request.put(options, function(err, res, body){
        res.statusCode.should.equal(200);
        body.completed.should.be.true;
        body.title.should.equal("Updated todo!");
        done();
      });
      
    });
    

    
  });
  
});
