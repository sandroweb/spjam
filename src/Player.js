var Tools = require('./Tools.js');

module.exports = function Player(container, xPos, yPos) {
	var self = this;
	var velocity = 0;
	var acceleration = 0.25;
	var maxspeed = 2.0;
	var dir = 1;
	var movie = null;

	movie = new PIXI.MovieClip(Tools.getTextures("boy", 7, ".png"));
	movie.pivot = new PIXI.Point(movie.width/2, movie.height/2);
	movie.animationSpeed = 0.1;

	this.view = new PIXI.DisplayObjectContainer();
	this.view.addChild(movie);

	this.view.position.x = xPos;
	this.view.position.y = yPos;
	this.view.animationSpeed = 0.1;
	container.addChild(this.view);

	movie.play();

	this.update = function(input, position, velocity)
	{
		self.view.position.x = position.x;
		self.view.position.y = position.y - 10;

		if (velocity.x > -0.01 && velocity.x < 0.01) velocity.x = 0;

		if (velocity.x < 0) movie.scale.x = -1;
		if (velocity.x > 0) movie.scale.x = 1;

		movie.rotation = velocity.x*0.1;
	}

	this.moveLeft = function()
	{
	}

	this.moveRight = function()
	{
	}

	this.doCollide = function(xpos,ypos,width,height)
	{
		if(self.view.position.x >= xpos && self.view.position.x < (xpos + width) && self.view.position.y - ypos < 100)
			return true;

		return false;
	}

}

