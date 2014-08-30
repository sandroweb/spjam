module.exports = function Player(game, xPos, yPos) {
	var self = this;
	var velocity = 0;
	var acceleration = 0.1;
	var maxspeed = 3.0;
	var dir = 1;

	 var view = new PIXI.Sprite(PIXI.Texture.fromImage("img/player.png"));
     view.position.x = xPos;
     view.position.y = yPos;
     game.stage.addChild(view);

     self.view = view;

	this.update = function(input)
	{
		view.position.x += dir * velocity;

		///no key pressed
		if(input.Key.isEmpty()){
			velocity -= acceleration;
			if(velocity < 0)
				velocity = 0;
		}

		if(velocity > maxspeed)
			velocity = maxspeed;
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
		if(view.position.x >= xpos && view.position.x < (xpos + width) && view.position.y - ypos < 100)
			return true;

		return false;
	}

}