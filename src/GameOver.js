module.exports = function GameOver(game) {

  var content,
    self = this,
    bg,
    text,
    count,
    death,
    btn;

  function init() {
    content = new PIXI.DisplayObjectContainer();
    content.visible = false;
    game.stage.addChild(content);

    bg = new PIXI.Graphics();
    bg.beginFill(0x000000);
    bg.drawRect(0, 0, screenWidth, screenHeight);
    bg.endFill();
    content.addChild(bg);

    death = PIXI.Sprite.fromFrame("DeathSilhuet2.png");
    death.anchor.x = 0.5;
    death.anchor.y = 0.5;
    death.scale.x = 1;
    death.scale.y = 1;
    content.addChild(death);
    death.position.x = screenWidth/2;
    death.position.y = screenHeight/2;
  }

  this.show = function() {
    content.visible = true;
    bg.alpha = 0;
    death.visible = false;
    death.alpha = 0;
    count = 0;
  }

  this.update = function()
  {
    if (!content.visible) return;

    bg.alpha += 0.01;
    if (bg.alpha > 1) bg.alpha = 1;

    if (bg.alpha == 1)
    {
      if (count == 0) game.resources.storm.play();

      if (count%15 == 0 && count < 80)
      {
        death.visible = !death.visible;
      }

      death.alpha = 1;

      count++;

      if (count >= 150) hide();
    }


  }

  function hide() {
    content.visible = false;

    // game.loadLevel(1);
    // game.level.dispose();
    // game.level.index = 0;
    // game.level = null;

    game.goToBeginning();
  }

  init();

};
