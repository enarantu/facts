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
var food = []
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
        player_requests.push(req)
    })

    socket.on('disconnect', function(){
        console.log('user disconnected', player_name);
        delete players[player_name]
    });
});


function serve_request(req){
    switch(req.type){
        case "update":
            players[req.name] = req.data
            break
        case "consume":
            for( let i = food.length - 1; i >= 0; i--){
                if( food[i].x === req.data.x && food[i].y === req.data.y){
                    food.splice(i, 1)
                }
            }
            break
        default:
            break
    }
    players[req.name] = req.data
}

function generate_food(arr){
    let xc = parseInt(Math.floor((Math.random() * 80)))*10
    let yc = parseInt(Math.floor((Math.random() * 60)))*10
    arr.push({x : xc, y : yc})
}

setInterval(function(){
    while(player_requests.length > 0){
        serve_request(player_requests.shift())
    }

    while(food.length < 10){
        generate_food(food)
    }

    io.sockets.emit('update', players, food);
}, 250);

http.listen(8080, 'localhost')