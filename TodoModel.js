var mongoose     = require("mongoose");

var pub = require("./lib/RedisFactory").createClient();

var options = {strict:true};

var TodoSchema = new mongoose.Schema({
    title:{
      type:String, 
      required:true
    },
    completed:{
      type:Boolean, 
      default:false
    }   
}, options);

TodoSchema.post("save", function(todo){
  pub.publish("todo:save", JSON.stringify(todo.toJSON())) 
});


mongoose.connect("mongodb://localhost/realtime_todo_" + process.env.NODE_ENV || 'development');

module.exports =  mongoose.model("Todo", TodoSchema);


