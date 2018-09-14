var path = require('path');
global.appDir = path.dirname(require.main.filename);
console.log(global.appDir)
require('./views/game.js');
require('./views/index.js');