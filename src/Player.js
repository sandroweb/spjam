module.exports = function Player(game, input, xPos, yPos) {
	var self = this;
	var speed = 0.6;
	 var view = new PIXI.Sprite(PIXI.Texture.fromImage("img/player.png"));
     view.position.x = xPos;
     view.position.y = yPos;
     game.stage.addChild(view);

	this.update = function()
	{

	}

	this.moveLeft = function()
	{
		if(view.x > view.width)
			view.x -= speed;
	}

	this.moveRight = function()
	{
		if(view.x < game.renderer.width)
			view.x += speed;
	}


}