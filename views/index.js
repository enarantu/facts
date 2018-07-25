var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var cookie = require('cookie');
var escapeHtml = require('escape-html');
var url = require('url');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/mult.html');
});


io.on('connection', function(client){
  console.log('User connected');

  client.on('submit', function(name){
    io.sockets.emit('submit', name);
    console.log('Name: '+ name);
  })
});

io.emit('some event', {for: 'everyone'});

http.listen(3000, function(){
  console.log('Listening on port 3000');
})