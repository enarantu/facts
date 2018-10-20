module.exports = {
    index_view : function(req, res){
        res.sendFile(global.appDir + '/html/index.html');
    },
    bundle : function(req, res){
        res.sendFile(global.appDir + '/static/js/bundle.js');
    },
    bootstrap : function(req, res){
        res.sendFile(global.appDir + '/node_modules/bootstrap/dist/css/bootstrap.min.css')
    },
    game_css : function(req, res){
        res.sendFile(global.appDir + '/static/style/game.css')
    }
}
