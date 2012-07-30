window.App = {};
_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};

App.Todo = Backbone.Model.extend({
  idAttribute:"_id",
  urlRoot:"/api/todos"
});

App.todos = new (Backbone.Collection.extend({
  url:"/api/todos",
  model:App.Todo
}));


var socket = io.connect('http://localhost:3000');
socket.on('todo:save', function (data) {
  var t = JSON.parse(data);
  var todo = App.todos.get(t._id);
  if(todo){
    todo.set(t)
  } else {
    App.todos.add(t)
  }
});

App.TodoView = Backbone.View.extend({
  tagName:"li",
  events:{
    "change input":"completed"
  },
  completed:function(e){
    this.model.set("completed", $(this.el).find("input").is(":checked")).save()
  },
  initialize:function(model){
    this.model = model;
    this.template = _.template($("#todo_template").html());
    this.model.on("change", this.render, this);
  },
  
  render:function(){
    $(this.el).html(this.template({model:this.model.toJSON()}));
    return this;
  }
  
});

App.NewTodoView = Backbone.View.extend({
  el:$("#newTodoForm"),
  events:{
    "submit":"submit"
  },
  
  initialize:function(){
    this.input = $(this.el).find("input");
  },

  
  submit:function(e){
    e.preventDefault();
    
    var todoText = this.input.val();
    if(todoText.length > 0) {
      App.todos.create({title:todoText});
      this.input.val("");
    }
  }
  
})

App.TodoListView = Backbone.View.extend({
  
  el:$("#todoList"),
  
  initialize:function(){
    App.todos.on("reset", this.addAll, this);
    App.todos.on("add", this.add, this);
  }, 
  
  addAll:function(){
    var _this = this;
    App.todos.each(function(todo){
      _this.add(todo);
    });
  },
  
  add:function(todo){
    var view = new App.TodoView(todo);    
    $(this.el).prepend(view.render().el);
  }
  
});

$(function(){
  
  new App.TodoListView();
  new App.NewTodoView();
 
  App.todos.reset(window.todoData);
  
});