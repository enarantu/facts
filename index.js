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
var directions = {}

function moveU(player_name){
    const n = players[player_name].length
    players[player_name].push( 
    { 
        x : players[player_name][n-1].x, 
        y : players[player_name][n-1].y - 10
    })
    players[player_name].shift()
}
function moveD(player_name){
    const n = players[player_name].length
    players[player_name].push( 
    { 
        x : players[player_name][n-1].x, 
        y : players[player_name][n-1].y + 10
    })
    players[player_name].shift()

}
function moveR(player_name){
    const n = players[player_name].length
    players[player_name].push( 
    { 
        x : players[player_name][n-1].x + 10, 
        y : players[player_name][n-1].y
    })
    players[player_name].shift()

}
function moveL(player_name){
    const n = players[player_name].length
    players[player_name].push( 
    { 
        x : players[player_name][n-1].x - 10,
        y : players[player_name][n-1].y
    })
    players[player_name].shift()
}

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
            },
            {
                x : 180,
                y : 150
            }
        ]
        directions[name] = 'R'
    });

    socket.on('dir-change', function(dir){
        let n = players[player_name].length
        switch(dir){
            case 'U':
                if(players[player_name][n-1].y - 10 !== players[player_name][n-2].y){
                    directions[player_name] = 'U'
                }
                break
            case 'D':
                if(players[player_name][n-1].y + 10 !== players[player_name][n-2].y){
                    directions[player_name] = 'D'
                }
                break
            case 'R':
                if(players[player_name][n-1].x + 10 !== players[player_name][n-2].x){
                    directions[player_name] = 'R'
                }
                break
            case 'L':
                if(players[player_name][n-1].x - 10 !== players[player_name][n-2].x){
                    directions[player_name] = 'L'
                }
                break
            default:
                console.log("recieved unhandled direction")
                break
        }
    })

    socket.on('disconnect', function(){
        console.log('user disconnected', player_name);
        delete players[player_name]
        io.sockets.emit('update', players)
    });
});


setInterval(function(){
     Object.keys(players).forEach( player => {
        switch( directions[player]){
            case 'R':
                moveR(player)
                break
            case 'L':
                moveL(player)
                break
            case 'U':
                moveU(player)
                break
            case 'D':
                moveD(player)
                break
            default:
                console.log("unhandled direction", directions[player])
                break
        }
    });
    io.sockets.emit('update', players); 
}, 300);

http.listen(8080, 'localhost')