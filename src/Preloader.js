module.exports = function Preloader(game) {

  var content,
    self = this,
    bg,
    bar,
    text,
    images = ['img/bg-default.jpg'],
    loader = new PIXI.AssetLoader(images);

  loader.addEventListener('onComplete', function() {
    init();
    game.load();
  });

  function init() {
    content = new PIXI.DisplayObjectContainer();
    game.stage.addChild(content);

    bg = PIXI.Sprite.fromImage(images[0]);
    content.addChild(bg);
  }

  this.progress = function(percent) {
    // console.log(percent);
  }

  this.hide = function() {
    content.visible = false;
  }

  loader.load();

};
