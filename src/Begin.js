module.exports = function Begin(game) {

  var btn,
    images = ['img/btn.png'],
    loader = new PIXI.AssetLoader(images);

  function init() {
    btn = new PIXI.Sprite(PIXI.Texture.fromImage(images[0]));
    btn.buttonMode = true;
    btn.position.x = (game.renderer.width / 2) - (btn.width / 2);
    btn.position.y = (game.renderer.height / 2) - (btn.height / 2);
    btn.interactive = true;
    game.stage.addChild(btn);
    btn.click = function(data) {
      hide();
      game.loadLevel(1);
    };
  }

  function hide() {
    btn.visible = false;
  }

  loader.onComplete = init;
  loader.load();

};
