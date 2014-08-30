var Game = require('./Game'),
	Begin = require('./Begin'),
	game = new Game(),
	begin = new Begin(game);

game.start();
