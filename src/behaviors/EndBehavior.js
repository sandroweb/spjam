var Tweenable = require('../vendor/shifty'),
    Game = require('../game'),
    ParticleSystem = require('../components/ParticleSystem.js'),
    Tweenable = require('../vendor/shifty');

module.exports = function EndBehavior(container, data) {
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
  var portalOffSprite = new PIXI.Sprite(PIXI.Texture.fromImage("PortalOff.png"));
  var portalOnSprite = new PIXI.Sprite(PIXI.Texture.fromImage("portal.png"));
  portalOnSprite.alpha = 0;

  this.view.addChild(portalOffSprite);
  container.addChild(this.view);

  var fadeOutShape = new PIXI.Graphics();
  fadeOutShape.alpha = 0;

  var halo = PIXI.Sprite.fromFrame("halo.png");
  halo.anchor.x = 0.5;
  halo.anchor.y = 0.5;
  halo.scale.x = 5;
  halo.scale.y = 5;
  halo.position.x = 33;
  halo.position.y = 33;
  halo.alpha = 0.2;
  this.view.addChild(halo);
  halo.visible = false;

  emitter.on('switch.pressed', function() {

    if(game.level.numSwitches == 0) {

      particles = new ParticleSystem({
        "images":["PortalSpark.png"],
        "numParticles":50,
        "emissionsPerUpdate":1,
        "emissionsInterval":2,
        "alpha":1,
        "properties": {
          "randomSpawnX":1,
          "randomSpawnY":30,
          "life":30,
          "randomLife":100,
          "forceX":0,
          "forceY":0.01,
          "randomForceX":0.007,
          "randomForceY":0.01,
          "velocityX":-1,
          "velocityY":0,
          "randomVelocityX":0.2,
          "randomVelocityY":0.2,
          "scale":0.25,
          "growth":0.001,
          "randomScale":0.04,
          "alphaStart":0,
          "alphaFinish":0,
          "alphaRatio":0.2,
          "torque":0,
          "randomTorque":0
        }
      });

      halo.visible = true;
      halo.alpha = 0;

      particles.view.alpha = 0.25;
      particles.properties.centerX = 18;
      particles.properties.centerY = 33;

      self.view.addChild(particles.view);

      // Fade portal
      var interval = setInterval(function() {
        console.log("Interval...");
        if (portalOnSprite.alpha >= 1) {
          clearInterval(interval);
        } else {
          portalOnSprite.alpha += 0.02;
        }
      }, 1)

      self.view.addChild(portalOnSprite);
    }

  });

	this.trigger = function() {
    if (!triggered) {
      fadeOutShape.beginFill(0x000);
      fadeOutShape.drawRect(0, 0, game.renderer.width, game.renderer.height);
      game.stage.addChild(fadeOutShape);
      game.player.fadeOut();
      game.resources.portalSound.play();
      game.resources.forestSound.stop();
    }
    triggered = true;
  }

	this.update = function(game)
	{
    if (particles) {
      particles.update();
    }

    if (halo.visible)
    {
      halo.alpha += 0.01;
      if (halo.alpha > 0.2) halo.alpha = 0.2;
    }

    if (triggered) {

      fadeOutShape.alpha += 0.01;
      if (fadeOutShape.alpha >= 1) {
        game.level.dispose();
        game.nextLevel();
        game.stage.removeChild(fadeOutShape);
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
