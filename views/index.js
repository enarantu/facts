var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var game = require('./game')(app);

app.get('/', function(req, res){
  res.sendFile(appDir + '/html/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
