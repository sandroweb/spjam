var Tweenable = require('../vendor/shifty');

module.exports = function SwitchBehavior(data) {
	var self = this,
    gridSize = data.height,
    moveX = data.properties.moveX * gridSize,
    moveY = data.properties.moveY * gridSize,
    lightOrig = false,
    lightDest = { x: data.properties.moveX * gridSize, y: data.properties.moveY * gridSize }
    itemData = data,
    moving = false,
    pressed = false;

  /////retrive position and size specs
  var originX = data.x;
  var originY = data.y;

  /////create visual
  self.view = new PIXI.Sprite(PIXI.Texture.fromImage("img/" + data.properties.img));
  self.view.position.x = originX;
  self.view.position.y = originY;
  game.stage.addChild(self.view);

  this.trigger = function() {
    // when pressing for the first time, the orinal light position is stored to revert.
    if (!pressed && !lightOrig) {
      lightOrig = JSON.parse(JSON.stringify(light.position));
    }

    var dest = (!pressed) ? lightDest : lightOrig;
    pressed = !pressed;

    var tweenable = new Tweenable();
    tweenable.tween({
      from: light.position,
      to:   dest,
      duration: 1000,
      easing: 'easeOutCubic',
      start: function () {
        moving = true;
      },
      finish: function () {
        moving = false;
      }
    });
  }

	this.update = function(game)
	{
		//console.log(game.player.doCollide(itemData.x,itemData.y, itemData.width,itemData.height),game.input.Key.isDown(38));
		if(game.player.doCollide(itemData.x,itemData.y, itemData.width,itemData.height) && game.input.Key.isDown(38) && !moving)
		{
			moving = true;
			self.trigger();
		}
	}
}
