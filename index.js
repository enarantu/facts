var express = require('express');
var app = express()
var router = express.Router()

var path = require('path');
global.appDir = path.dirname(require.main.filename);
var views = require('./views/views')

app.use('/', views)


var http = require('http').Server(app);
var io = require('socket.io')(http);
http.listen(8080, 'localhost')