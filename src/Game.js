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
  Physics = require('./Physics.js');
  Tools = require('./Tools.js');

window.Tweenable = Tweenable;
window.tweenable = new Tweenable();

module.exports = function Game() {
  this.resources = new Resources();

  // stage.click = function(e) {
  //   light.x = e.originalEvent.x;
  //   light.y = e.originalEvent.y;
  // }

  window.screenWidth = (typeof(ejecta)=="undefined") ? 960 : 480;
  window.screenHeight = (typeof(ejecta)=="undefined") ? 640 : 320;

  this.renderer = new PIXI.CanvasRenderer(screenWidth, screenHeight, document.getElementById('canvas'), false /* transparent */, false /* antialias */);
  this.renderer.view.style.display = "block";
  this.renderer.view.style.border = "1px solid";

  this.stage = new PIXI.Stage(0x00fffa, true);

  ////Input
  var input = null;

  /////Player
  var player = null;
  var physics = null;
  var direction = 0;

  // LevelIndex
  var self = this;
  var level = null;
  var lost = false;
  var gameRunning = false;
  window.light = new Light(50, 50);

  this.renderer.view.addEventListener("mousedown", function(e) {
    // light.position.x = e.offsetX;
    // light.position.y = e.offsetY;

    var dest = {x:e.offsetX, y:e.offsetY};
    var tweenable = new Tweenable();
    tweenable.tween({
      from: light.position,
      to:   dest,
      duration: 1000,
      easing: 'easeOutCubic',
      start: function () {
        moving = true;
      },
      finish: function () {
        moving = false;
      }
    });
  })

  var lightGraphics = new PIXI.Graphics(),
  lightContainer = new PIXI.DisplayObjectContainer();

  this.restart = function() {
    console.log('Game.js - this.restart()');
  }

  this.nextLevel = function() {
    console.log('Game.js - this.nextLevel()');
    this.loadLevel(this.level.index + 1);
  }

  this.setLevel = function(levelData, levelIndex) {
    var h = self.renderer.height + 80,
        w = self.renderer.width,
        frameBorder = 50;

    var newLevel = new Level(self, levelIndex);

    // add stage border to level segments
    newLevel.segments.unshift( {a:{x:-frameBorder,y:-frameBorder}, b:{x:w,y:-frameBorder}} );
    newLevel.segments.unshift( {a:{x:w,y:-frameBorder}, b:{x:w,y:h}} );
    newLevel.segments.unshift( {a:{x:w,y:h}, b:{x:-frameBorder,y:h}} );
    newLevel.segments.unshift( {a:{x:-frameBorder,y:h}, b:{x:-frameBorder,y:-frameBorder}} );

    newLevel.parse(levelData);

    self.level = newLevel;
    self.stage.addChildAt(self.level.view, 0);

    light.setSegments(newLevel.segments);

    // add level container to stage.
    game.stage.addChild(newLevel.container);

    // re-create the player
    player = new Player(newLevel.container, newLevel.playerPos.x,newLevel.playerPos.y);
    physics.playerPosition.x = player.view.position.x;
    physics.playerPosition.y = player.view.position.y;

    console.log(newLevel.playerPos.x + " " + newLevel.playerPos.y);
    self.player = player;

    self.loop();
  };

  this.loadLevel = function(levelIndex) {
    if(!input)
    {
      input = new GameInput();
      self.input = input;
    }

    if (!physics){
      physics = new Physics();
    }

    levelIndex = 2;
    console.log("level/level" + levelIndex + ".json");
    var pixiLoader = new PIXI.JsonLoader("level/level" + levelIndex + ".json");
    pixiLoader.on('loaded', function(evt) {
      //data is in evt.content.json
      console.log("json loaded!");
      self.setLevel(evt.content.json, levelIndex);
      gameRunning = true;
      lost = false;
    });

    pixiLoader.load();
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

    var vertices = polygons[0];
    window.polygons = polygons[0];

    // lightGraphics.clear();
    // lightGraphics.beginFill(0xFFFFFF);
    // lightGraphics.moveTo(vertices[0].x, vertices[0].y);
    // for (var i = 1; i<vertices.length; i++) {
    //   var v = vertices[i];
    //   lightGraphics.lineTo(v.x, v.y);
    // }
    // lightGraphics.endFill();

    lightGraphics.clear();
    lightGraphics.beginFill(0xFFFFFF);
    lightGraphics.moveTo(vertices[0].x, vertices[0].y);
    for (var i = 1; i<vertices.length; i++) {
      var v = vertices[i];
      lightGraphics.lineTo(v.x, v.y);
    }
    lightGraphics.endFill();

    // overlap.addChild(lightGraphics);
    // overlapShape.mask = lightGraphics;

    self.level.bg2.mask = lightGraphics;
    // overlay.mask = lightGraphics;

    // for(var i=1;i<polygons.length;i++){
    //   lightContainer.addChild( light.getPolygonGraphics(polygons[i]) );
    // }
    // lightContainer.addChild( light.getPolygonGraphics(polygons[0]) );
    // window.polygons = polygons[0];

    lastLightX = light.position.x;
    lastLightY = light.position.y;
  };

  this.update = function() {

    if (self.begin) self.begin.update();
    if (self.gameover) self.gameover.update();

    if (!gameRunning) return;
    this.updateLights();

    // console.log(input + " " + input.Key);
    if(!input)
      return;

    if (input.Key.isDown(input.Key.LEFT)) 
    {
      direction -= 0.01;
    }
    else if (input.Key.isDown(input.Key.RIGHT)) 
    {
      direction += 0.01;
    }
    else
    {
      direction *= 0.9;
    }

    direction = Tools.clamp(direction, -1, 1);

    if (self.level)
    {
      if(physics)
        physics.process(direction, window.polygons);

      if(player)
        player.update(input, physics.playerPosition, physics.playerVelocity);

       self.level.update(self);

       if (!lost && physics.playerPosition.y > screenHeight + 40) this.loseGame();
    }
  };

  this.loop = function() {
    requestAnimFrame(animate);

    function animate() {
      self.update(); // logic
      self.renderer.render(self.stage);
      requestAnimFrame( animate );
    }
  };

  this.loadPixi = function() {
    self.itemsLoaded = 0,
    self.pixiFiles = self.resources.getPIXIFiles(),
    self.soundFiles = self.resources.sounds,
    self.totalItems = self.pixiFiles.length + self.soundFiles.length;
    // loader
    loader = new PIXI.AssetLoader(self.pixiFiles);
    loader.addEventListener('onComplete', function() {
      self.loadSound();
    });
    loader.addEventListener('onProgress', function(e) {
      self.itemsLoaded += 1;
      self.preloader.progress(self.itemsLoaded, self.totalItems);
      if (typeof(ejecta)!=="undefined") { return; };
    });

    loader.load();
  }

  this.loadSound = function() {
    var i,
      total = self.soundFiles.length,
      obj;
    for (i = 0; i < total; ++i) {
      obj = self.soundFiles[i];
        self.resources[obj.name] = new Howl({
          urls: obj.urls,
          autoplay: obj.autoPlay || false,
          loop: obj.loop || false,
          volume: obj.volume || 1,
          onload: function() {
            self.itemsLoaded++;
            if (self.itemsLoaded == self.totalItems) {
              self.loaded();
            }
          }
        });
    }
  }

  this.loaded = function() {
    self.begin = new Begin(this);
    self.levelend = new LevelEnd(this);
    self.gameover = new GameOver(this);
    self.preloader.hide();
    self.begin.show();
    game.resources.soundLoop.fadeIn(.4, 2000);
  }

  this.start = function() {
    var imgsArr = [], i;
    lost = false;
    // start scenes
    // self.stage.addChild(lightGraphics);

    // start screens

    // start loop
    self.loop();

    //
    self.preloader = new Preloader(this);

    // FIXME
    self.loadPixi();
  };

  this.loseGame = function()
  {
    if (lost) return;
    lost = true;
    gameRunning = false;
    self.gameover.show();
  }

  this.goToBeginning = function()
  {
    self.begin.show();
  }

  this.start();
}
