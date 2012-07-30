var Todo = require("./TodoModel")

module.exports = function(app){
  
  
  app.get('/', function(req, res, next){
    Todo.find({}, function(err, todos){
      if(err) return next(err);
      res.render('index', {todos:todos});
    });

  });
  

  
  app.get("/api/todos", function(req, res){
    Todo.find({}, function(err, todos){
      if(err) return next(err);
      res.json(todos);
    });
  });


  var saveTodo = function(todo, req, res){
    todo.save(function(err, todo){
      if(err) {
        return res.json(err, 400);
      } 
      res.json(todo);
    });    
  };
  
  app.post('/api/todos', function(req, res){
    var t = new Todo();
    t.title = req.body.title;
    saveTodo(t, req, res);
  });
  
  app.put('/api/todos/:id', function(req, res){
    Todo.findById(req.param("id"), function(err, todo){
      if(err || !todo) {
        return res.send(404);
      }
      if(req.body.title) {
        todo.title = req.body.title;
      }
      if(typeof req.body.completed === "boolean"){
        todo.completed = req.body.completed;
      }
      saveTodo(todo, req, res);
    })
  });
  
};