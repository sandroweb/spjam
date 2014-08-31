var Tweenable = require('../vendor/shifty');

module.exports = function EndBehavior(data) {
	var self = this,
    itemData = data;

	this.trigger = function() {
		console.log("END LEVEL");
	}

	this.update = function(game)
	{
		//console.log(game.player.doCollide(itemData.x,itemData.y, itemData.width,itemData.height),game.input.Key.isDown(38));
		if(game.player.doCollide(itemData.x,itemData.y, itemData.width,itemData.height))
		{
			self.trigger();
		}
	}
}
