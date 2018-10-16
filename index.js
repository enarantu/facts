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
var player_requests = []
var timestep = 0


function move(locations, direction){
    function moveU(locations){
        const n = locations.length
        locations.push( 
        { 
            x : locations[n-1].x, 
            y : locations[n-1].y - 10
        })
        locations.shift()
    }
    function moveD(locations){
        const n = locations.length
        locations.push( 
        { 
            x : locations[n-1].x, 
            y : locations[n-1].y + 10
        })
        locations.shift()

    }
    function moveR(locations){
        const n = locations.length
        locations.push( 
        { 
            x : locations[n-1].x + 10, 
            y : locations[n-1].y
        })
        locations.shift()

    }
    function moveL(locations){
        const n = locations.length
        locations.push( 
        { 
            x : locations[n-1].x - 10,
            y : locations[n-1].y
        })
        locations.shift()
    }
    switch(direction){
        case 'R':
            moveR(locations)
            break
        case 'L':
            moveL(locations)
            break
        case 'U':
            moveU(locations)
            break
        case 'D':
            moveD(locations)
            break
        default:
            console.log("unhandled direction", direction)
            break
    }
}

function serve_request(req){
    switch( req.request_type ){
        case 'dir-change':
            let n = players[req.player_name].length
            switch(req.dir){
                case 'U':
                    if(players[req.player_name][n-1].y - 10 !== players[req.player_name][n-2].y){
                        directions[req.player_name] = 'U'
                    }
                    break
                case 'D':
                    if(players[req.player_name][n-1].y + 10 !== players[req.player_name][n-2].y){
                        directions[req.player_name] = 'D'
                    }
                    break
                case 'R':
                    if(players[req.player_name][n-1].x + 10 !== players[req.player_name][n-2].x){
                        directions[req.player_name] = 'R'
                    }
                    break
                case 'L':
                    if(players[req.player_name][n-1].x - 10 !== players[req.player_name][n-2].x){
                        directions[req.player_name] = 'L'
                    }
                    break
                default:
                    console.log("recieved unhandled direction")
                    break
            }
            break
        default:
            break
    }
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
        reply = {}
        reply.timestep = timestep
        socket.emit('new-player', reply)
    });

    socket.on('request', function(req){
        player_requests.push(req)
    })

    socket.on('disconnect', function(){
        console.log('user disconnected', player_name);
        delete players[player_name]
        io.sockets.emit('update', players)
    });
});


setInterval(function(){
    while(player_requests.length > 0){
        serve_request(player_requests.shift())
    }
    Object.keys(players).forEach( player => {
        move(locations[player], directions[player])
    });
    io.sockets.emit('update', players); 
    timestep += 1
}, 250);

http.listen(8080, 'localhost')