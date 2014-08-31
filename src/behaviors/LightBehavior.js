var Tools = require('../Tools.js');

module.exports = function LightBehavior(data) {

  /////retrive position and size specs
  var size = data.width;
  var originX = data.x;
  var originY = data.y;

  light.x = originX;
  light.y = originY;

  var movie = null;

  movie = new PIXI.MovieClip(Tools.getTextures("mother", 12, ".png"));
  movie.pivot = new PIXI.Point(movie.width/2, movie.height/2 + 25);
  movie.animationSpeed = 0.1;

  this.view = new PIXI.DisplayObjectContainer();
  this.view.position.x = originX;
  this.view.position.y = originY;

  this.view.addChild(movie);
  
  movie.play();
  game.stage.addChild(this.view);

  this.update = function()
  {
    
  }

}
