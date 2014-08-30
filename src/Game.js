var Resources = require('./Resources'),
  Preloader = require('./Preloader'),
  Level = require('./Level'),
  Begin = require('./Begin'),
  LevelEnd = require('./LevelEnd'),
  GameOver = require('./GameOver'),
  Gameplay = require('./Gameplay'),
  Light = require('./Light'),
  Tweenable = require('./vendor/shifty'),
  GameInput = require('./GameInput.js'),
  Player = require('./Player.js');

window.Tweenable = Tweenable;
window.tweenable = new Tweenable();

module.exports = function Game() {

  this.resources = new Resources();

  // stage.click = function(e) {
  //   light.x = e.originalEvent.x;
  //   light.y = e.originalEvent.y;
  // }

  var screenWidth = (typeof(ejecta)=="undefined") ? 640 : 320;
  var screenHeight = (typeof(ejecta)=="undefined") ? 960 : 480;

  this.renderer = new PIXI.CanvasRenderer(screenWidth, screenHeight, document.getElementById('canvas'), false /* transparent */, true /* antialias */);
  this.renderer.view.style.display = "block";
  this.renderer.view.style.border = "1px solid";

  this.stage = new PIXI.Stage(0xFFFFFF, true);;

  ////Input
  var input = null;

  /////Player
  var player = null;

  // LevelIndex
  var levelIndex = 0;
  var self = this;
  var level = null;
  window.light = new Light(50, 50);

  var lightGraphics = new PIXI.Graphics(),
      lightContainer = new PIXI.DisplayObjectContainer();

  var begin,
    levelend,
    gameover,
    preloader,
    loader;

  this.restart = function() {
    alert('Game.js - this.restart()');
  }

  this.nextLevel = function() {
    alert('Game.js - this.nextLevel()');
  }

  this.setLevel = function(levelData) {
    var h = self.renderer.height,
        w = self.renderer.width;

    var newLevel = new Level(self);

    // add stage border to level segments
    newLevel.segments.unshift( {a:{x:0,y:0}, b:{x:w,y:0}} );
    newLevel.segments.unshift( {a:{x:w,y:0}, b:{x:w,y:h}} );
    newLevel.segments.unshift( {a:{x:w,y:h}, b:{x:0,y:h}} );
    newLevel.segments.unshift( {a:{x:0,y:h}, b:{x:0,y:0}} );

    newLevel.parse(levelData);

    self.level = newLevel;

    light.setSegments(newLevel.segments);

    self.loop();
  };

  this.loadLevel = function(levelIndex) {
    if(!input)
    {
      input = new GameInput();
    }

    if(!player){
      player = new Player(self, 100,880);
      self.player = player;
    }

    console.log("level/level" + levelIndex + ".json");
    var loader = new PIXI.JsonLoader("level/level" + levelIndex + ".json");
    loader.on('loaded', function(evt) {
      //data is in evt.content.json
      console.log("json loaded!");

      self.setLevel(evt.content.json);
    });

    loader.load();
  }

  var lastLightX, lastLightY;

  this.updateLights = function() {
    // nothing to update, skip
    if (light.position.x == lastLightX && light.position.y == lastLightY) {
      return;
    }

    // FIXME
    if (light.segments.lenght == 0 || !this.level || this.level.segments.length == 0) {
      return;
    }

    lightGraphics.clear();

    // remove previous added light items
    if (lightContainer.children.length > 0) {
      lightContainer.removeChildren();
    }

    // Sight Polygons
    var polygons = light.getSightPolygons();

    // DRAW AS A GIANT POLYGON
    for(var i=1;i<polygons.length;i++){
      lightContainer.addChild( light.getPolygonGraphics(polygons[i]) );
    }
    lightContainer.addChild( light.getPolygonGraphics(polygons[0]) );

    // // Masked Foreground
    // ctx.globalCompositeOperation = "source-in";
    // ctx.drawImage(foreground,0,0);
    // ctx.globalCompositeOperation = "source-over";

    // Draw dots
    lightGraphics.beginFill(0xfff, 0.5);
    lightGraphics.arc(light.position.x, light.position.y, 2, 0, 2*Math.PI, false);
    lightGraphics.endFill();

    for(var angle=0;angle<Math.PI*2;angle+=(Math.PI*2)/10){
      var dx = Math.cos(angle)*light.fuzzyRadius;
      var dy = Math.sin(angle)*light.fuzzyRadius;
      lightGraphics.beginFill(0xfff, 0.5);
      lightGraphics.arc(light.position.x+dx, light.position.y+dy, 2, 0, 2*Math.PI, false);
      lightGraphics.endFill();
    }

    lastLightX = light.position.x;
    lastLightY = light.position.y;
  };

  this.update = function() {
    this.updateLights();

    // console.log(input + " " + input.Key);
    if(!input)
      return;

    if(player)
      player.update(input);

    if(self.level)
      self.level.update(player);

    if (input.Key.isDown(input.Key.LEFT)) player.moveLeft();
    if (input.Key.isDown(input.Key.RIGHT)) player.moveRight();
  };

  this.loop = function() {
    requestAnimFrame(animate);

    function animate() {
      self.update(); // logic
      self.renderer.render(self.stage);
      requestAnimFrame( animate );
    }
  };

  this.start = function() {
    var imgsArr = [], i;

    // start scenes
    self.stage.addChild(lightGraphics);
    self.stage.addChild(lightContainer);

    // start screens
    begin = new Begin(this);
    levelend = new LevelEnd(this);
    gameover = new GameOver(this);
    preloader = new Preloader(this);

    // start loop
    self.loop();

    // FIXME
    // self.load();
  };

  this.load = function() {
    // loader
    loader = new PIXI.AssetLoader(self.resources.getImages());
    loader.addEventListener('onComplete', function() {
      preloader.hide();
      begin.show();
    });
    loader.addEventListener('onProgress', function(e) {
      preloader.progress((e.content.assetURLs.length - e.content.loadCount) * 100 / e.content.assetURLs.length);
      if (typeof(ejecta)!=="undefined") { return; };
    });
    loader.load();
  }

  this.start();
}
