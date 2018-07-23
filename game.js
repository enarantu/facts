var app = require('express')();


module.exports = function(app) {

    app.get('/game', function(req, res){
    res.sendFile(__dirname + '/game.html');
    });

}