var Resources = require('./Resources'),
  Preloader = require('./Preloader'),
  Level = require('./Level'),
  Begin = require('./Begin'),
  LevelEnd = require('./LevelEnd'),
  GameOver = require('./GameOver'),
  Light = require('./Light'),
  Tweenable = require('./vendor/shifty'),
  GameInput = require('./GameInput.js'),
  Player = require('./Player.js');
  Physics = require('./Physics.js');
  Tools = require('./Tools.js');

window.Tweenable = Tweenable;

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
  var glow = null;

  // LevelIndex
  var self = this;
  var level = null;
  var lost = false;
  var gameRunning = false;
  window.light = new Light(50, 50);

  self.level = level;

  var lastMouseClick = 0,
      mouseClickInterval = 1000; // 1 second to click again

  this.renderer.view.addEventListener("mousedown", function(e) {
    // prevent click on first level
    // if (!self.level) { return; }

    var clickTime = (new Date()).getTime();

    if (lastMouseClick + mouseClickInterval >= clickTime) {
      // dissallowed
      return;
    }

    lastMouseClick = clickTime;

    // light.position.x = e.offsetX;
    // light.position.y = e.offsetY;

    if (self.btnSoundOn.visible === true) {
      if (e.offsetX >= self.btnSoundOn.x && e.offsetX < self.btnSoundOn.x + self.btnSoundOn.width
        && e.offsetY >= self.btnSoundOn.y && e.offsetY < self.btnSoundOn.y + self.btnSoundOn.height) {
        return;
      }
    }

    if (self.btnSoundOff.visible === true) {
      if (e.offsetX >= self.btnSoundOff.x && e.offsetX < self.btnSoundOff.x + self.btnSoundOff.width
        && e.offsetY >= self.btnSoundOff.y && e.offsetY < self.btnSoundOff.y + self.btnSoundOff.height) {
        return;
      }
    }

    if (self.btnRestart.visible === true) {
      if (e.offsetX >= self.btnRestart.x && e.offsetX < self.btnRestart.x + self.btnRestart.width
        && e.offsetY >= self.btnRestart.y && e.offsetY < self.btnRestart.y + self.btnRestart.height) {
        return;
      }
    }

    if (self.level !== null) {
      game.resources.motherSound.play();
    }

    var dest = { x:e.offsetX, y:e.offsetY };
    var tweenable = new Tweenable();
    tweenable.tween({
      from: light.position,
      to:   dest,
      duration: mouseClickInterval,
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
    var i = self.level.index;
    self.level.dispose();
    this.loadLevel(i);
  }

  this.nextLevel = function() {
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

    // console.log(newLevel.playerPos.x + " " + newLevel.playerPos.y);
    self.player = player;

    self.loop();
    self.stage.addChild(glow);
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

    // levelIndex = 2;
    // console.log("level/level" + levelIndex + ".json");
    var pixiLoader = new PIXI.JsonLoader("level/level" + levelIndex + ".json");
    pixiLoader.on('loaded', function(evt) {
      //data is in evt.content.json
      // console.log("json loaded!");
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
    if (light.segments.length == 0 || !this.level || this.level.segments.length == 0) {
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

    lastLightX = light.position.x;
    lastLightY = light.position.y;
  };

  this.update = function() {

    if (self.btnRestart !== undefined) {
      if (self.level === null) {
        self.btnRestart.visible = false;
      } else {
        self.btnRestart.visible = true;
      }
    }

    if (self.begin) self.begin.update();
    if (self.gameover) self.gameover.update();

    if (!gameRunning) return;
    this.updateLights();

    // console.log(input + " " + input.Key);
    if(!input)
      return;

    if (input.Key.isDown(input.Key.LEFT) || input.Key.isDown(input.Key.A))
    {
      direction -= 0.09;
    }
    else if (input.Key.isDown(input.Key.RIGHT) || input.Key.isDown(input.Key.D))
    {
      direction += 0.09;
    }
    else
    {
      direction *= 0.9;
    }

    direction = Tools.clamp(direction, -1, 1);

    if (self.level)
    {
      if(physics)
        physics.process(game, direction, window.polygons);

      if(player)
        player.update(game, physics.playerPosition, physics.playerVelocity);

       self.level.update(self);

       if (!lost && physics.playerPosition.y > screenHeight + 40) this.loseGame();
    }
  };

  var loopBounded =  false ;
  this.loop = function() {
    if (loopBounded){ return; }
    loopBounded = true;
    requestAnimFrame(self.renderLoop);
  };

  this.renderLoop = function() {
    self.update(); // logic
    self.renderer.render(self.stage);
    requestAnimFrame(self.renderLoop);
  }

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
    var i = (self.itemsLoaded - self.pixiFiles.length),
      obj = self.soundFiles[i];
    self.resources[obj.name] = new Howl({
      urls: obj.urls,
      autoplay: obj.autoPlay || false,
      loop: obj.loop || false,
      volume: obj.volume || 1,
      onload: function() {
        self.itemsLoaded++;
        self.preloader.progress(self.itemsLoaded, self.totalItems);
        if (self.itemsLoaded == self.totalItems) {
          self.loaded();
        } else {
          self.loadSound();
        }
      }
    });
  }

  this.loaded = function() {
    self.begin = new Begin(this);
    self.levelend = new LevelEnd(this);
    self.gameover = new GameOver(this);
    self.preloader.hide();
    self.begin.show();
    game.resources.soundLoop.fadeIn(.4, 2000);

    glow = PIXI.Sprite.fromFrame("glow.png");
    glow.scale.x = 2;
    glow.scale.y = 2;
    self.stage.addChild(glow);
    glow.alpha = 0.65;

    self.btnSoundOff = PIXI.Sprite.fromFrame('soundOn.png');
    self.btnSoundOff.setInteractive(true);
    self.btnSoundOff.buttonMode = true;
    self.btnSoundOff.position.x = 10;
    self.btnSoundOff.position.y = 10;

    self.btnSoundOn = PIXI.Sprite.fromFrame('soundOff.png');
    self.btnSoundOn.setInteractive(true);
    self.btnSoundOn.buttonMode = true;
    self.btnSoundOn.position.x = self.btnSoundOff.position.x;
    self.btnSoundOn.position.y = self.btnSoundOff.position.y;
    self.btnSoundOn.visible = false;

    self.stage.addChild(game.btnSoundOff);
    self.stage.addChild(game.btnSoundOn);

    self.btnSoundOff.click = self.btnSoundOff.tap = function(data) {
      self.btnSoundOn.visible = true;
      self.btnSoundOff.visible = false;
      Howler.mute();
    }

    self.btnSoundOn.click = self.btnSoundOn.tap = function(data) {
      self.btnSoundOn.visible = false;
      self.btnSoundOff.visible = true;
      Howler.unmute();
    }

    self.btnRestart = PIXI.Sprite.fromFrame('restart.png');
    self.btnRestart.setInteractive(true);
    self.btnRestart.buttonMode = true;
    self.stage.addChild(game.btnRestart);
    self.btnRestart.position.x = self.renderer.width - 10 - self.btnRestart.width;
    self.btnRestart.position.y = 10;
    self.btnRestart.visible = false;

    self.btnRestart.click = self.btnRestart.tap = function(data) {
      self.restart();
    }
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
    // game.loadLevel(1);
    game.level.dispose();
    game.level.index = 0;
    game.level = null;

    self.begin.show();
  }

  var phrase1 = null;
  var phrase2 = null;
  var phrase3 = null;
  this.showEndStory = function()
  {
    // console.log("show end story", gameRunning);

    if(!gameRunning)
      return;

    gameRunning = false;

    phrase1 = new PIXI.Text('HMMM...MY HEAD...WHAT HAPPENED?', {
      font: '22px Rokkitt',
      fill: '#FFFFFF',
      align: 'center'
    });

    phrase2 = new PIXI.Text('MOM?...MOM?! NO!!!', {
      font: '22px Rokkitt',
      fill: '#FFFFFF',
      align: 'center'
    });

    phrase3 = new PIXI.Text('BUT...WAIT...THAT LIGHT, IT WAS YOU?', {
      font: '22px Rokkitt',
      fill: '#FFFFFF',
      align: 'center'
    });

    phrase1.alpha = 0;
    phrase2.alpha = 0;
    phrase3.alpha = 0;

    phrase1.position.x = (self.renderer.width / 2) - (phrase1.width / 2);
    phrase1.position.y = self.renderer.height / 2 - 60;
    self.stage.addChild(phrase1);

    phrase2.position.x = (self.renderer.width / 2) - (phrase2.width / 2);
    phrase2.position.y = self.renderer.height / 2 - 10;
    self.stage.addChild(phrase2);

    phrase3.position.x = (self.renderer.width / 2) - (phrase3.width / 2);
    phrase3.position.y = self.renderer.height / 2 + 40;
    self.stage.addChild(phrase3);


    var tweenable = new Tweenable();
    tweenable.tween({
      from: {alpha:0},
      to:   {alpha:1},
      duration: 500,
      easing: 'easeOutCubic',
      start: function () {
      },
      step: function(state){
        phrase1.alpha = state.alpha;
      },
      finish: function () {
      }
    });

    var tweenable = new Tweenable();
    tweenable.tween({
      from: {alpha:0},
      to:   {alpha:1},
      duration: 500,
      easing: 'easeOutCubic',
      start: function () {
      },
      step: function(state){
        phrase2.alpha = state.alpha;
      },
      finish: function () {
      }
    });

    var tweenable = new Tweenable();
    tweenable.tween({
      from: {alpha:0},
      to:   {alpha:1},
      duration: 500,
      easing: 'easeOutCubic',
      start: function () {
      },
      step: function(state){
        phrase3.alpha = state.alpha;
      },
      finish: function () {
      }
    });


    setTimeout(function(){
      self.stage.removeChild(phrase1);
      self.stage.removeChild(phrase2);
      self.stage.removeChild(phrase3);
      self.goToBeginning();
    },8000);

    self.gameRunning = false;
  }

  this.start();
}
