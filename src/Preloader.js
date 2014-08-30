module.exports = function Preloader(game) {

  var content,
    self = this,
    bg,
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

    bg = new PIXI.Sprite.fromImage(images[0]);
    content.addChild(bg);

    text = new PIXI.Text('Carregando 0%', {
      font: '35px Trade Winds',
      fill: '#FF0000',
      align: 'center'
    });
    text.position.x = (game.renderer.width / 2) - (text.width / 2);
    text.position.y = game.renderer.height / 2;
    content.addChild(text);
  }

  this.progress = function(percent) {
    text.setText('Carregando ' + percent + '%');
    text.position.x = (game.renderer.width / 2) - (text.width / 2);
  }

  this.hide = function() {
    content.visible = false;
  }

  loader.load();

};
