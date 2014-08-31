module.exports = function Resources() {

  Howler.iOSAutoEnable = false;

  // images
  this.background = 'img/bg-default.jpg';
  this.btnPlay ='img/btn-play.png';
  this.btnNext ='img/btn-next.png';
  this.btnRestart ='img/btn-restart.png';
  this.textLevelEnd ='img/text-level-end.png';
  this.textGameOver ='img/text-game-over.png';

  // sprites
  this.textGameOver ='img/sprites/player.json';
  this.textures ='img/textures.json';

  // sounds
  this.sounds = [
    {
      // game.resources.carCrashSound.play();
      name: 'carCrashSound',
      urls: ['sounds/237375__squareal__car-crash_01.mp3']
    },
    {
      // game.resources.carCrash2Sound.play();
      name: 'carCrash2Sound',
      urls: ['sounds/92019__fatlane__1004-crash_01.mp3']
    }
  ];

  var self = this;

  this.getPIXIFiles = function() {
    var i,
      url,
      urlToIf,
      arr = [];
    for (i in self) {
      url = self[i];
      if (typeof url === 'string') {
        urlToIf = url.toLowerCase();
        if (urlToIf.lastIndexOf('.jpg') > 0
          || urlToIf.lastIndexOf('.jpeg') > 0
          || urlToIf.lastIndexOf('.png') > 0
          || urlToIf.lastIndexOf('.gif') > 0
          || urlToIf.lastIndexOf('.json') > 0
          || urlToIf.lastIndexOf('.atlas') > 0
          || urlToIf.lastIndexOf('.anim') > 0
          || urlToIf.lastIndexOf('.xml') > 0
          || urlToIf.lastIndexOf('.fnt') > 0) {
          arr.push(self[i]);  
        }
      }
    }
    return arr;
  }

};
