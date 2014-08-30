var Game = require('./Game'),
	Level = require('./Level'),
	Begin = require('./Begin'),
	game = new Game(),
	begin = new Begin(game),
	level = new Level(game);

game.setLevel(level);