module.exports = function Begin(game) {
  window.game = game;

  var content,
    self = this,
    bg,
    btn;

  function init() {
    content = new PIXI.DisplayObjectContainer();
    content.visible = false;
    game.stage.addChild(content);

    bg = PIXI.Sprite.fromImage(game.resources.background);
    content.addChild(bg);

    btn = new PIXI.Sprite(PIXI.Texture.fromImage(game.resources.btnPlay));
    content.addChild(btn);
    btn.buttonMode = true;
    btn.interactive = true;
    btn.click = btn.tap = function(data) {
      game.resources.buttonClick.play()
      hide();
      game.loadLevel(1);
    };
  }

  function setPositions() {
    btn.position.x = (game.renderer.width / 2) - (btn.width / 2);
    btn.position.y = (game.renderer.height / 2) - (btn.height / 2);
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
