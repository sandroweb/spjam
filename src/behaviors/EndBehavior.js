var Tweenable = require('../vendor/shifty');

module.exports = function EndBehavior(data) {
	var self = this,
    itemData = data;

  /////retrive position and size specs
  var size = data.width;
  var originX = data.x;
  var originY = data.y;


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
