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

io.on('connection', function(socket){
    var player_name
    socket.on('new-player', function(name){
        player_name = name
        players[name] = {
            x :  150,
            y :  150
        }
        console.log("new-player", player_name, players)
        io.sockets.emit('update', players)
    });
    socket.on('movement', function(dir){
        switch (dir){
            case "U":
                players[player_name].y -= 10
                break
            case "D":
                players[player_name].y += 10
                break
            case "R":
                players[player_name].x += 10
                break
            case "L":
                players[player_name].x -= 10
                break
        }
        io.sockets.emit('update',players)
    })
    socket.on('disconnect', function(){
        console.log('user disconnected', player_name);
        delete players[player_name]
        io.sockets.emit('update', players)
    });
});

http.listen(8080, 'localhost')