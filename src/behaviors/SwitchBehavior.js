var Tweenable = require('../vendor/shifty');

module.exports = function SwitchBehavior(data) {
	var self = this,
    gridSize = data.height,
    moveX = data.properties.move * gridSize,
    originalMoveX = moveX,
    itemData = data,
    moving = false;

  this.trigger = function() {
    console.log("move light to " + moveX);
    var tweenable = new Tweenable();
    tweenable.tween({
      from: light.position,
      to:   { x: moveX },
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
