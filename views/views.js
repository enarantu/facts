var express = require('express');
var router = express.Router();

var index = require('./index');
var game = require('./game')


router.route('/').get(index.index_view);
router.route('/game').get(game.game_view);
router.route('/bundle.js').get(index.bundle)

module.exports = router;