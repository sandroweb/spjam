module.exports = function Resources() {

  this.background = 'img/bg-default.jpg',
  this.btnPlay ='img/btn-play.png',
  this.btnNext ='img/btn-next.png',
  this.btnRestart ='img/btn-restart.png',
  this.textLevelEnd ='img/text-level-end.png',
  this.textGameOver ='img/text-game-over.png';

  // sprites
  this.textGameOver ='img/sprites/player.json';

  var self = this;

  this.getImages = function() {
    var i,
      url,
      arr = [];
    for (i in self) {
      url = self[i];
      if (typeof url === 'string') {
        arr.push(self[i]);
      }
    }
    return arr;
  }

};
