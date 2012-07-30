var Todo         = require("../TodoModel");
var mongoose     = require("mongoose");
var should       = require("should");
var RedisFactory = require("../lib/RedisFactory");


describe("TodoModel", function(){
  
  it("should have reference to Todo", function(){
    Todo.should.exist
  });
  
  var sub;
  
  before(function(done){
    sub = RedisFactory.createClient()
    sub.psubscribe("todo:*");
    Todo.collection.remove(done);  
  });
  
  it("Should add a todo", function(done){    
    var task = new Todo();
    task.completed.should.be.false;
    task.title = "Make a cup of tea";
    
    task.save(function(err, t){
      should.not.exist(err);
      t.should.exist;
      sub.once("pmessage", function(pattern, key, obString){
        key.should.equal("todo:save");
        JSON.stringify(t.toJSON()).should.equal(obString)        
        done();        
      });

    });
  });
  
  it("should list tasks", function(done){
    Todo.find({}, function(err, todos){
      todos.should.have.length(1);
      todos[0].title.should.equal("Make a cup of tea");
      todos[0].completed.should.be.false;
      done();
    });
  });
  
  it("should update and complete task", function(done){
    
    Todo.findOne({}, function(err, todo){
      todo.should.exist;
      todo.completed = true;
      todo.save(function(err, updatedTodo){
        updatedTodo.completed.should.be.true;
        sub.once("pmessage", function(pattern, key, obString){
          key.should.equal("todo:save");
          JSON.stringify(updatedTodo.toJSON()).should.equal(obString)        
          done();        
        });
      });
    });
    
  });
  
  

  
});
