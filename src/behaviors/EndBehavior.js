var Tweenable = require('../vendor/shifty'),
    Game = require('../game');

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
  self.view = new PIXI.Sprite(PIXI.Texture.fromImage("portal.png"));
  self.view.position.x = originX;
  self.view.position.y = originY - 27;
  container.addChild(self.view);

  var fadeOutShape = new PIXI.Graphics();
  fadeOutShape.alpha = 0;

	this.trigger = function() {
    if (!triggered) {
      fadeOutShape.beginFill(0x000);
      fadeOutShape.drawRect(0, 0, game.renderer.width, game.renderer.height);
      game.stage.addChild(fadeOutShape);
      game.player.fadeOut();
      game.resources.portalSound.play();
    }
    triggered = true;
  }

	this.update = function(game)
	{
    if (triggered) {

      console.log("Triggered... increasing alpha...");
      fadeOutShape.alpha += 0.01;
      if (fadeOutShape.alpha >= 1) {
        game.level.dispose();
        game.nextLevel();
        game.stage.removeChild(fadeOutShape);
        game.stage.removeChild(game.level.container);
        game.stage.removeChild(game.level.view);
      }

    } else {
      //console.log(game.player.doCollide(itemData.x,itemData.y, itemData.width,itemData.height),game.input.Key.isDown(38));
      if(game.player.doCollide(itemData.x,itemData.y, itemData.width,itemData.height))
        {
          console.log("switches: " + game.level.numSwitches)
          if(game.level.numSwitches == 0)
            self.trigger();
        }
    }
  }
}
