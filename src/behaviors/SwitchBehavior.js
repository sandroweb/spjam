var Tweenable = require('../vendor/shifty');
var ParticleSystem = require('../components/ParticleSystem.js');

module.exports = function SwitchBehavior(container, data) {
	var self = this,
    gridSize = data.properties.size || data.height,
    moveX = data.properties.moveX * gridSize,
    moveY = data.properties.moveY * gridSize,
    lightOrig = false,
    lightDest = { x: data.properties.moveX * gridSize, y: data.properties.moveY * gridSize },
    itemData = data,
    moving = false,
    pressed = false;

  /////retrive position and size specs
  var originX = data.x;
  var originY = data.y;
  var pressed = false;

  /////create visual
  var textureOff = PIXI.Texture.fromImage("switchOff.png");
  var textureOn = PIXI.Texture.fromImage("switchOn.png");

  self.view = new PIXI.Sprite(textureOff);
  self.view.position.x = originX;
  self.view.position.y = originY - 2;

  var particles = new ParticleSystem(
  {
      "images":["pixelShine.png"],
      "numParticles":30,
      "emissionsPerUpdate":1,
      "emissionsInterval":10,
      "alpha":1,
      "properties":
      {
        "randomSpawnX":3,
        "randomSpawnY":1,
        "life":40,
        "randomLife":5,
        "forceX":0,
        "forceY":-0.02,
        "randomForceX":0.0,
        "randomForceY":0.01,
        "velocityX":0,
        "velocityY":-0.1,
        "randomVelocityX":0.0,
        "randomVelocityY":0.0,
        "scale":2,
        "growth":-0.001,
        "randomScale":0.5,
        "alphaStart":1,
        "alphaFinish":0,
        "alphaRatio":0.2,
        "torque":0,
        "randomTorque":0
      }
  });

  container.addChild(this.view);
  container.addChild(particles.view);

  this.trigger = function() {
    // when pressing for the first time, the orinal light position is stored to revert.
    // if (!pressed && !lightOrig) {
    //   lightOrig = JSON.parse(JSON.stringify(light.position));
    // }

    // var dest = (!pressed) ? lightDest : lightOrig;
    // pressed = !pressed;

    if (!pressed)
    {
      self.view.texture = textureOn;
      pressed = true;
      game.resources.swicherSound.play();
      container.addChild(particles.view);
    }
    // else
    // {
    //   self.view.texture = textureOff;
    // }

    // var tweenable = new Tweenable();
    // tweenable.tween({
    //   from: light.position,
    //   to:   dest,
    //   duration: 1000,
    //   easing: 'easeOutCubic',
    //   start: function () {
    //     moving = true;
    //   },
    //   finish: function () {
    //     moving = false;
    //   }
    // });
  }

	this.update = function(game)
	{
    if (pressed)
    {
        particles.properties.centerX = self.view.position.x + 17;
        particles.properties.centerY = self.view.position.y + 25;
        particles.update(); 
    }
      
      
    

    if(pressed)
      return;

		//console.log(game.player.doCollide(itemData.x,itemData.y, itemData.width,itemData.height),game.input.Key.isDown(38));
		if(game.player.doCollide(itemData.x,itemData.y, itemData.width,itemData.height) && !moving)
		{
			moving = true;
      game.level.numSwitches --;
      emitter.emit('switch.pressed');
			self.trigger();
		}
	}
}
