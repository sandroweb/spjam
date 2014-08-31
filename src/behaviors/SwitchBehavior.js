var Tweenable = require('../vendor/shifty');

module.exports = function SwitchBehavior(data) {
	var self = this,
    gridSize = data.height,
    moveX = data.properties.moveX * gridSize,
    moveY = data.properties.moveY * gridSize,
    originalMoveX = moveX,
    originalMoveY = moveY,
    itemData = data,
    moving = false;

  /////retrive position and size specs
  var size = data.width;
  var originX = data.x;
  var originY = data.y;

  /////create visual
  self.view = new PIXI.Sprite(PIXI.Texture.fromImage("img/" + data.properties.img));
  self.view.position.x = originX;
  self.view.position.y = originY;
  game.stage.addChild(self.view);

  this.trigger = function() {
    console.log("move light to " + moveX);
    var tweenable = new Tweenable();
    tweenable.tween({
      from: light.position,
      to:   { x: moveX, y: moveY },
      duration: 1000,
      easing: 'easeOutCubic',
      start: function () { console.log('Off I go!'); },
      finish: function () {
        // infinite
        //self.trigger();
        moving = false;
      }
    });

    // future trigger will invert movement.
    originalMoveX *= -1;
    moveX += originalMoveX;

    originalMoveY *= -1;
    moveY += originalMoveY;
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
