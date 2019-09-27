const express = require('express')
const app     = express()

const bodyParser = require('body-parser')
const expressSanitizer = require('express-sanitizer')
const methodOverride = require('method-override')
const path = require('path')
const dotenv = require('dotenv').config()
let port = process.env.PORT || 3000;

const uristring = process.env.MONGODB_URI || 'mongodb://localhost/todolistejs';
const mongoose = require('mongoose')
mongoose.connect(uristring, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify : false});

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(expressSanitizer());

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

let todoSchema = new mongoose.Schema({
  text: String,
});

let Todo = mongoose.model('Todo', todoSchema);

app.get('/', function(req, res){
  res.redirect('/index');
});

app.get('/index', function(req, res){
  Todo.find({}, function(err, result){
    if (err) return handleError(err);
    res.render('index', {todos: result})
  })
});


app.post('/index', (req, res) => {
 req.body.todo.text = req.sanitize(req.body.todo.text);
 let newTask = req.body.todo;
 Todo.create(newTask, (err, newTodo) => {
    if (err) return handleError(err);
    res.redirect('/index');
  });
});

app.get('/:id/edit', (req, res) => {
 Todo.findById(req.params.id, (err, todo) => {
    if (err) return handleError(err);
    res.render('edit', {todo: todo});
 });
});

app.put('/tasks/update/:id', (req, res) => {
 Todo.findByIdAndUpdate(req.params.id, req.body.todo, (err, todo) => {
    if (err) return handleError(err);
    res.redirect('/');
 });
});

app.delete('/deleteTask/:id', (req, res) => {
    Todo.findByIdAndRemove(req.params.id, (err, todo) => {
        if (err) return handleError(err);
        res.redirect('/');
 }); 
});


app.listen(port, () => console.log(`app listening on port ${port}!`))