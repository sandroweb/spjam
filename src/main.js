var Game = require('./Game');

var game = new Game();
var level = new Level();
game.setLevel(level);
game.start();
