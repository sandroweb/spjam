var Game = require('./Game');
var Level = require('./Level');

var game = new Game();
game.level = new Level();
game.loop();
