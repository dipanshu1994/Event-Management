var express = require('express');
var http = require('http');
var app = express();
const server = http.createServer(app);

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017:/eventManager');


app.set('views','views');
app.set('view engine', 'ejs');
app.enable('trust proxy');

var api		= require('./routes/api');
app.use('/',api);

app.listen(3000, function () {
  console.log("App Started on PORT 3000");
});