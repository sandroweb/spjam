module.exports = function Player(game, xPos, yPos) {
	var self = this;
	var velocity = 0;
	var acceleration = 0.25;
	var maxspeed = 2.0;
	var dir = 1;

  var movieClipTextures = [];
  for (var i=1; i <= 10; i++)
  {
    var texture = PIXI.Texture.fromFrame("player-" + ("00" + i).substr(-2,2) + ".png");
    movieClipTextures.push(texture);
  };

  this.view = new PIXI.MovieClip(movieClipTextures);
  this.view.pivot = new PIXI.Point(this.view.width/2, this.view.height/2);
  this.view.position.x = xPos;
  this.view.position.y = yPos;
  this.view.animationSpeed = 0.1;
  game.stage.addChild(this.view);

	this.update = function(input, position)
	{
		view.position.x = position.x - 15;
		view.position.y = position.y - 37;
		self.view.position.x += dir * velocity;
	}

	this.moveLeft = function()
	{
    // invert sprite x
    if (dir==1) { self.view.scale.x *= -1; }

    self.view.play();
		dir = -1;
		velocity += acceleration;
	}

	this.moveRight = function()
	{
    // invert sprite x
    if (dir==-1) { self.view.scale.x *= -1; }

    self.view.play();
		dir = 1;
		velocity += acceleration;
	}

	this.doCollide = function(xpos,ypos,width,height)
	{
		if(self.view.position.x >= xpos && self.view.position.x < (xpos + width) && self.view.position.y - ypos < 100)
			return true;

		return false;
	}

}

