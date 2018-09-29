module.exports = {
    game_view :function(req, res){
        res.sendFile(global.appDir + '/html/game.html');
    },
}

