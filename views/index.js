module.exports = {
    index_view : function(req, res){
        res.sendFile(global.appDir + '/html/index.html');
    },
}
