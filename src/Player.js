module.exports = function Player(game, xPos, yPos) {
	var self = this;
	var velocity = 0;
	var acceleration = 0.25;
	var maxspeed = 2.0;
	var dir = 1;

	 var view = new PIXI.Sprite(PIXI.Texture.fromImage("img/player.png"));
     view.position.x = xPos;
     view.position.y = yPos;
     game.stage.addChild(view);

     self.view = view;

	this.update = function(input, position)
	{
		view.position.x = position.x - 15;
		view.position.y = position.y - 37;
	}

	this.moveLeft = function()
	{
		dir = -1;
		velocity += acceleration;
	}

	this.moveRight = function()
	{
		dir = 1;
		velocity += acceleration;
	}

	this.doCollide = function(xpos,ypos,width,height)
	{
		if(view.position.x + view.width/2 >= xpos && view.position.x < (xpos + width) && view.position.y - ypos < 100)
			return true;

		return false;
	}

}