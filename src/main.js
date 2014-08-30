var Game = require('./Game');
var Level = require('./Level');

var game = new Game();
var level = new Level();
game.setLevel(level);
game.start();
