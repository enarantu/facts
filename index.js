var express = require('express')
var app = express()
var router = express.Router()

var path = require('path');
global.appDir = path.dirname(require.main.filename);
var views = require('./views/views')

app.use('/', views)

var http = require('http').Server(app);
var io = require('socket.io')(http);



var server_data =
var player_requests = []

io.on('connection', function(socket){
    let id
    socket.on('new-player', function(name){
        blocks = [
            {
                x :  140,
                y :  140
            },
            {
                x : 160,
                y : 140
            },
            {
                x : 180,
                y : 140
            }
        ]
        id = server_data.add_player(name, blocks)
        socket.emit('new-player', blocks, id)
    });

    socket.on('request', function(req){
        player_requests.push(req)
    })

    socket.on('disconnect', function(){
        console.log('user disconnected', id)
        server_data.remove_player(id)
    });
});


function serve_request(req){
    switch(req.type){
        case "update":
            server_data.set_data(req.id, req.blocks)
            break
        case "consume":
            server_data.consume(req.block)
            break
        case "over":
            server_data.remove_player(req.id)
            break
        default:
            break
    }
}

setInterval(function(){
    while(player_requests.length > 0){
        serve_request(player_requests.shift())
    }
    server_data.refill()
    let update_data = server_data.get_data()
    io.sockets.emit('update', update_data.players, update_data.foods, update_data.powers);
}, 100);

http.listen(8080, 'localhost')