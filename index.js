var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var countdown = 5000;
setInterval(function() {  
  countdown--;
  io.sockets.emit('timer', { countdown: countdown });
}, 1000);


io.on('connection', function(socket){
  console.log('a user connected');
  countdown = 1000;
  socket.on('chat message', function(msg){
  	
  	io.sockets.emit('timer', {countdown: countdown});
  	io.emit('chat message',msg);
  	console.log('message: ' + msg);
  });
});

io.emit('some event', { for: 'everyone' });

http.listen(3000, function(){
  console.log('listening on *:3000');
});
    