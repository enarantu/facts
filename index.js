var path = require('path');
global.appDir = path.dirname(require.main.filename);
require('./views/game.js');
require('./views/index.js');