var express = require('express')
var app = express()
var router = express.Router()

var path = require('path');
global.appDir = path.dirname(require.main.filename);
var views = require('./views/views')

app.use('/', views)

var http = require('http').Server(app);
var io = require('socket.io')(http);

var players = {}
var player_requests = []

io.on('connection', function(socket){
    var player_name
    socket.on('new-player', function(name){
        player_name = name
        players[name] = [
            {
                x :  150,
                y :  150
            },
            {
                x : 160,
                y : 150
            },
            {
                x : 170,
                y : 150
            }
        ]
        reply = {}
        reply.player_data = players[player_name]
        reply.others_data = Object.assign({}, players);
        delete reply.others_data.player_name;
        socket.emit('new-player', reply)
    });

    socket.on('request', function(req){
        player_requests.push({name : player_name, data : req})
    })

    socket.on('disconnect', function(){
        console.log('user disconnected', player_name);
        delete players[player_name]
        io.sockets.emit('update', players)
    });
});


function serve_request(req){
    players[req.name] = req.data
}

setInterval(function(){
    while(player_requests.length > 0){
        serve_request(player_requests.shift())
    }
    io.sockets.emit('update', players); 
}, 250);

http.listen(8080, 'localhost')