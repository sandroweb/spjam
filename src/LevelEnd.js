module.exports = function LevelEnd(game) {

  var content,
    self = this,
    bg,
    text,
    btn,
    images = ['img/bg-default.jpg', 'img/btn-next.png', 'img/text-level-end.png'];

  this.images = images;

  function init() {
    content = new PIXI.DisplayObjectContainer();
    content.visible = false;
    game.stage.addChild(content);

    bg = PIXI.Sprite.fromImage(images[0]);
    content.addChild(bg);

    text = PIXI.Sprite.fromImage(images[2]);
    content.addChild(text);

    btn = new PIXI.Sprite(PIXI.Texture.fromImage(images[1]));
    btn.buttonMode = true;
    btn.interactive = true;
    content.addChild(btn);
    btn.click = function(data) {
      hide();
      game.nextLevel();
    };
  }

  function setPositions() {
    text.position.x = (game.renderer.width / 2) - (text.width / 2);
    text.position.y = (game.renderer.height / 3);

    btn.position.x = (game.renderer.width / 2) - (btn.width / 2);
    btn.position.y = (game.renderer.height / 3) * 2;
  }

  this.show = function() {
    content.visible = true;
    setPositions();
  }

  function hide() {
    content.visible = false;
  }

  init();

};
