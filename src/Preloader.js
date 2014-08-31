module.exports = function Preloader(game) {

  var content,
    self = this,
    bg;

  self.text;

  this.progress = function(loadedItems, totalItems) {
    var percent = Math.round(loadedItems * 100 / totalItems);
    if (loadedItems > 0) {
      if (loadedItems == 1) {
        self.init();
      }
      self.text.setText('CARREGANDO ' + percent + '%');
      self.text.position.x = (game.renderer.width / 2) - (self.text.width / 2);
    }
  }

  this.init = function() {
    content = new PIXI.DisplayObjectContainer();
    game.stage.addChild(content);

    bg = new PIXI.Sprite.fromImage(game.resources.background);
    content.addChild(bg);

    self.text = new PIXI.Text('CARREGANDO 0%', {
      font: '38px Rokkitt',
      fill: '#FF0000',
      align: 'center'
    });
    self.text.position.x = (game.renderer.width / 2) - (self.text.width / 2);
    self.text.position.y = game.renderer.height / 2;
    content.addChild(self.text);
  }

  this.hide = function() {
    content.visible = false;
  }

};
