module.exports = function Player(game, input, xPos, yPos) {
	var self = this;

	 var view = new PIXI.Sprite(PIXI.Texture.fromImage("img/player.png"));
     view.position.x = xPos;
     view.position.y = yPos;
     game.stage.addChild(view);

	this.update = function()
	{
		
	}

	this.moveLeft = function()
	{
		
	}

	this.moveRight = function()
	{
		
	}


}