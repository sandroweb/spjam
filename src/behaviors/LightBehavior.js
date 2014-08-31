module.exports = function LightBehavior(data) {

  /////retrive position and size specs
  var size = data.width;
  var originX = data.x;
  var originY = data.y;

  light.x = originX;
  light.y = originY;

  var movieClipTextures = [];
  for (var i=1; i <= 10; i++)
  {
    var texture = PIXI.Texture.fromFrame("player-" + ("00" + i).substr(-2,2) + ".png");
    movieClipTextures.push(texture);
  };

  this.view = new PIXI.MovieClip(movieClipTextures);
  this.view.position.x = originX;
  this.view.position.y = originY;
  this.view.animationSpeed = 0.1;
  this.view.loop = true;
  this.view.play();
  game.stage.addChild(this.view);

  this.update = function()
  {
  }

}
