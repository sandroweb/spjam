var Tools = require('./Tools.js');
var ParticleSystem = require('./components/ParticleSystem.js');

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

	var fading = false;

	movie.play();

	var particles = new ParticleSystem(
	  {
	      "images":["pixelShine.png"],
	      "numParticles":200,
	      "emissionsPerUpdate":0,
	      "emissionsInterval":0,
	      "alpha":1,
	      "properties":
	      {
	        "randomSpawnX":10,
	        "randomSpawnY":10,
	        "life":30,
	        "randomLife":100,
	        "forceX":0,
	        "forceY":0,
	        "randomForceX":0.05,
	        "randomForceY":0.05,
	        "velocityX":0,
	        "velocityY":0,
	        "randomVelocityX":1,
	        "randomVelocityY":1,
	        "scale":1,
	        "growth":0.001,
	        "randomScale":0.4,
	        "alphaStart":0,
	        "alphaFinish":0,
	        "alphaRatio":0.2,
	        "torque":0,
	        "randomTorque":0
	      }
	  });
	  particles.view.alpha = 0.5;

	  container.addChild(particles.view);
	  container.addChild(this.view);

	this.update = function(input, position, velocity)
	{
		self.view.position.x = position.x;
		self.view.position.y = position.y - 10;

		if (velocity.x > -0.01 && velocity.x < 0.01) velocity.x = 0;

		if (velocity.x < 0) movie.scale.x = -1;
		if (velocity.x > 0) movie.scale.x = 1;

		movie.rotation = velocity.x*0.1;

		particles.properties.centerX = self.view.position.x + 10;
		particles.properties.centerY = self.view.position.y;
		particles.update();

		if (fading && self.view.alpha > 0.02) self.view.alpha -= 0.02;
	}

	this.moveLeft = function()
	{
	}

	this.moveRight = function()
	{
	}

	this.fadeOut = function()
	{
		particles.emit(200);
		self.view.alpha = 0.5;
		fading = true;
	}

	this.doCollide = function(xpos,ypos,width,height)
	{
		if(self.view.position.x >= xpos && self.view.position.x < (xpos + width) && self.view.position.y - ypos < 100)
			return true;

		return false;
	}

}

