var Tweenable = require('../vendor/shifty'),
    Game = require('../game'),
    ParticleSystem = require('../components/ParticleSystem.js'),
    Tweenable = require('../vendor/shifty');

module.exports = function EndCarBehavior(container, data) {
	var self = this,
      itemData = data,
      triggered = false;

  /////retrive position and size specs
  var size = data.width;
  var originX = data.x;
  var originY = data.y;

  /////retrive position and size specs
  var size = data.width;
  var originX = data.x;
  var originY = data.y;

  /////create visual
  this.view = new PIXI.DisplayObjectContainer();
  this.view.position.x = originX;
  this.view.position.y = originY - 27;

  var particles = null;
  var carSprite = new PIXI.Sprite(PIXI.Texture.fromImage("CarCrash.png"));
  carSprite.y = 13;
  this.view.addChild(carSprite);
  container.addChild(this.view);

  var fadeOutShape = new PIXI.Graphics();
  fadeOutShape.alpha = 0;

  emitter.on('switch.pressed', function() {

    if(game.level.numSwitches == 0) {

      particles = new ParticleSystem({
        "images":["motherShine.png"],
        "numParticles":50,
        "emissionsPerUpdate":1,
        "emissionsInterval":2,
        "alpha":1,
        "properties": {
          "randomSpawnX":1,
          "randomSpawnY":1,
          "life":30,
          "randomLife":100,
          "forceX":0,
          "forceY":0,
          "randomForceX":0.001,
          "randomForceY":0.01,
          "velocityX":0,
          "velocityY":-0.02,
          "randomVelocityX":0.2,
          "randomVelocityY":0.4,
          "scale":0.1,
          "growth":0.001,
          "randomScale":0.04,
          "alphaStart":0,
          "alphaFinish":0,
          "alphaRatio":0.2,
          "torque":0,
          "randomTorque":0
        }
      });

      particles.view.alpha = 0.5;
      particles.properties.centerX += self.view.width / 2;
      particles.properties.centerY += self.view.height / 2;

      self.view.addChild(particles.view);
    }

  });

	this.trigger = function() {
    if (!triggered) {
      fadeOutShape.beginFill(0x000);
      fadeOutShape.drawRect(0, 0, game.renderer.width, game.renderer.height);
      container.addChild(fadeOutShape);
      game.player.fadeOut();
      game.resources.portalSound.play();
      game.resources.forestSound.stop();
    }
    triggered = true;
  }

  var gameover = false;
  self.gameover = gameover;

	this.update = function(game)
	{
    if(self.gameover)
      return;

    if (particles) {
      particles.update();
    }

    if (triggered) {

      fadeOutShape.alpha += 0.01;
      if (fadeOutShape.alpha >= 0.7) {
        game.showEndStory();
        self.gameover = true;
      }

    } else {
      //console.log(game.player.doCollide(itemData.x,itemData.y, itemData.width,itemData.height),game.input.Key.isDown(38));
      if(game.player.doCollide(itemData.x,itemData.y, itemData.width,itemData.height))
        {
          if(game.level.numSwitches == 0) {
            self.trigger();
          }
        }
    }
  }
}
