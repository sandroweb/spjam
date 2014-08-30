module.exports = function Begin(game) {

  var content,
    self = this,
    bg,
    btn,
    images = ['img/bg-default.jpg', 'img/btn-play.png'];

  this.images = images;

  function init() {
    content = new PIXI.DisplayObjectContainer();
    content.visible = false;
    game.stage.addChild(content);

    bg = PIXI.Sprite.fromImage(images[0]);
    content.addChild(bg);

    btn = new PIXI.Sprite(PIXI.Texture.fromImage(images[1]));
    btn.buttonMode = true;
    btn.position.x = (game.renderer.width / 2) - (btn.width / 2);
    btn.position.y = (game.renderer.height / 2) - (btn.height / 2);
    btn.interactive = true;
    content.addChild(btn);
    btn.click = function(data) {
      hide();
      game.loadLevel(1);
    };
  }

  this.show = function() {
    content.visible = true;
  }

  function hide() {
    content.visible = false;
  }

  init();

};
