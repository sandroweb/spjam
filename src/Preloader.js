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

      if (typeof(ejecta)==="undefined") {
        self.text.setText('CARREGANDO ' + percent + '%');
        self.text.position.x = (game.renderer.width / 2) - (self.text.width / 2);
      }
    }
  }

  this.init = function() {
    content = new PIXI.DisplayObjectContainer();
    game.stage.addChild(content);

    bg = new PIXI.Graphics();
    bg.beginFill(0x000000);
    bg.drawRect(0, 0, screenWidth, screenHeight);
    bg.endFill();

    content.addChild(bg);

    if (typeof(ejecta)==="undefined") {
      self.text = new PIXI.Text('CARREGANDO 0%', {
        font: '18px Rokkitt',
        fill: '#666666',
        align: 'center'
      });
      self.text.position.x = (game.renderer.width / 2) - (self.text.width / 2);
      self.text.position.y = game.renderer.height / 2;
      content.addChild(self.text);
    }

  }

  this.hide = function() {
    content.visible = false;
  }

};
