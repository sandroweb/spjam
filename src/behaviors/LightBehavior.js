var Tools = require('../Tools.js');
var ParticleSystem = require('../components/ParticleSystem.js');

module.exports = function LightBehavior(container, data) {
  var self = this;
  this.name = "LightBehavior";

  /////retrive position and size specs
  var size = data.width;
  var originX = data.x;
  var originY = data.y;

  console.log("light: ", originX, originY);

  var movie = null;

  movie = new PIXI.MovieClip(Tools.getTextures("mother", 12, ".png"));
  movie.pivot = new PIXI.Point(movie.width/2, movie.height/2 + 25);
  movie.animationSpeed = 0.1;

  this.view = new PIXI.DisplayObjectContainer();
  this.view.position.x = originX;
  this.view.position.y = originY;

  this.view.addChild(movie);

  movie.play();

  var halo = PIXI.Sprite.fromFrame("halo.png");
  halo.anchor.x = 0.5;
  halo.anchor.y = 0.5;
  halo.scale.x = 10;
  halo.scale.y = 10;
  halo.alpha = 0.3;
  this.view.addChild(halo);

  light.position.x = originX;
  light.position.y = originY;

  var particles = new ParticleSystem(
  {
      "images":["motherShine.png"],
      "numParticles":100,
      "emissionsPerUpdate":1,
      "emissionsInterval":2,
      "alpha":1,
      "properties":
      {
        "randomSpawnX":1,
        "randomSpawnY":1,
        "life":30,
        "randomLife":100,
        "forceX":0,
        "forceY":0,
        "randomForceX":0.01,
        "randomForceY":0.01,
        "velocityX":0,
        "velocityY":0,
        "randomVelocityX":0.1,
        "randomVelocityY":0.1,
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

  container.addChild(particles.view);
  container.addChild(this.view);

  this.update = function()
  {
      self.view.position.x = light.position.x;
      self.view.position.y = light.position.y;

      particles.properties.centerX = self.view.position.x;
      particles.properties.centerY = self.view.position.y - 10;
      particles.update();
  }

}
