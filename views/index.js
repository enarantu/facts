module.exports = {
    index_view : function(req, res){
        res.sendFile(global.appDir + '/html/index.html');
    },
    bundle : function(req, res){
        res.sendFile(global.appDir + '/static/js/bundle.js');
    }
}
