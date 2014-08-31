(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Begin.js":[function(require,module,exports){
var ParticleSystem = require('./components/ParticleSystem.js');

module.exports = function Begin(game) {
  window.game = game;

  var self = this;
  var view = new PIXI.DisplayObjectContainer();
  var overlap = null;
  var car = null;
  var logo = null;
  var logoDark = null;
  var btnStart = null;
  var particles = null;
  var count = 0;

  this.view = view;
  this.show = show;
  this.hide = hide;
  this.update = update;

  init();

  function init()
  {
    view.visible = false;
    game.stage.addChild(view);

    var bg = PIXI.Sprite.fromFrame("Scenario.png");
    view.addChild(bg);

    logoDark = PIXI.Sprite.fromFrame("DarkLightLogo.png");
    view.addChild(logoDark);
    logoDark.alpha = 0.5;
    logoDark.anchor.x = 0.5;
    logoDark.anchor.y = 0.5;
    logoDark.position.x = screenWidth/2;
    logoDark.position.y = screenHeight/2;

    var guardrailDark = PIXI.Sprite.fromFrame("GuardRail.png");
    view.addChild(guardrailDark);
    guardrailDark.position.y = 550;
    guardrailDark.alpha = 0.5;

    var front = new PIXI.DisplayObjectContainer();
    view.addChild(front);

    var forest = PIXI.Sprite.fromFrame("ForestLight.png");
    front.addChild(forest);
    forest.position.y = 102;

    logo = PIXI.Sprite.fromFrame("DarkLightLogo.png");
    front.addChild(logo);
    logo.anchor.x = 0.5;
    logo.anchor.y = 0.5;
    logo.position.x = logoDark.position.x;
    logo.position.y = logoDark.position.y;

    var guardrail = PIXI.Sprite.fromFrame("GuardRail.png");
    front.addChild(guardrail);
    guardrail.position.y = guardrailDark.position.y;

    overlap = createOverlap();
    view.addChild(overlap);
    overlap.position.x = screenWidth - 100;
    overlap.position.y = -100;

    front.mask = overlap;

    btnStart = PIXI.Sprite.fromFrame("Start.png");
    btnStart.anchor.x = 0.5;
    btnStart.anchor.y = 0.5;
    btnStart.setInteractive(true);
    btnStart.click = startGame;
    view.addChild(btnStart);
    btnStart.position.x = screenWidth/2;
    btnStart.position.y = screenHeight/2 + 130;

    car = PIXI.Sprite.fromFrame("Car.png");
    view.addChild(car);
    car.position.x = -3000;
    car.position.y = guardrailDark.position.y - 75;
    car.passed = false;

    particles = new ParticleSystem(
    {
        "images":["smoke.png"],
        "numParticles":500,
        "emissionsPerUpdate":3,
        "emissionsInterval":1,
        "alpha":1,
        "properties":
        {
          "randomSpawnX":20,
          "randomSpawnY":3,
          "life":20,
          "randomLife":100,
          "forceX":0,
          "forceY":-0.01,
          "randomForceX":0.01,
          "randomForceY":0.01,
          "velocityX":0,
          "velocityY":0,
          "randomVelocityX":0.1,
          "randomVelocityY":0.1,
          "scale":1,
          "growth":0.1,
          "randomScale":0.5,
          "alphaStart":0,
          "alphaFinish":0,
          "alphaRatio":0.2,
          "torque":0,
          "randomTorque":0
        }
    });
    view.addChild(particles.view);
    particles.view.alpha = 0.25;
  }

  function createOverlap()
  {
    var numShafts = 8;
    var openRate = 0.2;
    var radius = 2000;
    var graph = new PIXI.Graphics();

    graph.beginFill(0xFFFFFF);
    graph.moveTo(0, 0);

    for (var i = 0; i < numShafts; i++)
    {
      var a = Math.PI*2/numShafts*i;
      graph.lineTo(Math.cos(a - openRate)*radius, Math.sin(a - openRate)*radius);
      graph.lineTo(Math.cos(a + openRate)*radius, Math.sin(a + openRate)*radius);
      graph.lineTo(0, 0);
    }

    graph.endFill();
    return graph;

  }

  function show()
  {
    view.visible = true;
  }

  function hide()
  {
    view.visible = false;
  }

  function update()
  {
    if (!view.visible) return;
    overlap.rotation += 0.001;
    car.position.x += 20;
    car.scale.x = 1;
    if (car.position.x > 7000) {
      car.position.x = -3000;
      car.passed = false;
    }

    if (car.passed === false && car.position.x > -1400) {
      car.passed = true;
      game.resources.carPass.play();
    }

    particles.properties.centerX = car.position.x;
    particles.properties.centerY = car.position.y + 100;
    particles.update();

    logo.scale.x = 0.99 + Math.sin(count)*0.02;
    logo.scale.y = 0.99 + Math.cos(count*0.3)*0.02;

    logoDark.scale.x = 0.99 + Math.cos(count)*0.02;
    logoDark.scale.y = 0.99 + Math.sin(count*0.3)*0.02;

    btnStart.alpha = 0.75 + Math.cos(count*15)*0.25;

    count += 0.01;
  }

  function startGame()
  {
    game.resources.buttonClick.play()
    hide();
    game.loadLevel(1);
  }
};

},{"./components/ParticleSystem.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/components/ParticleSystem.js"}],"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Game.js":[function(require,module,exports){
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
    console.log('Game.js - this.restart()');
    var i = self.level.index;
    self.level.dispose();
    this.loadLevel(i);
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

    self.btnSoundOff.click = function(data) {
      self.btnSoundOn.visible = true;
      self.btnSoundOff.visible = false;
      Howler.mute();
    }

    self.btnSoundOn.click = function(data) {
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

    self.btnRestart.click = function(data) {
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
    console.log("show end story", gameRunning);

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

},{"./Begin":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Begin.js","./GameInput.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/GameInput.js","./GameOver":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/GameOver.js","./Level":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Level.js","./LevelEnd":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/LevelEnd.js","./Light":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Light.js","./Physics.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Physics.js","./Player.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Player.js","./Preloader":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Preloader.js","./Resources":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Resources.js","./Tools.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Tools.js","./vendor/shifty":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/vendor/shifty.js"}],"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/GameInput.js":[function(require,module,exports){
module.exports = function GameInput() {
	var Key = {
	  _pressed: {},

	  LEFT: 37,
	  UP: 38,
	  RIGHT: 39,
	  DOWN: 40,
	  A:65,
	  D:68,
	  
	  isDown: function(keyCode) {
	    return this._pressed[keyCode];
	  },
	  
	  onKeydown: function(event) {
	    this._pressed[event.keyCode] = true;
	  },
	  
	  onKeyup: function(event) {
	    delete this._pressed[event.keyCode];
	  },

	  isEmpty: function () {
    		for(var prop in this._pressed) {
        		if(this._pressed.hasOwnProperty(prop))
           		return false;
    		}

    		return true;
		}
	};

	this.Key = Key;

	window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
	window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
}
},{}],"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/GameOver.js":[function(require,module,exports){
module.exports = function GameOver(game) {

  var content,
    self = this,
    bg,
    text,
    count,
    death,
    btn;

  function init() {
    content = new PIXI.DisplayObjectContainer();
    content.visible = false;
    game.stage.addChild(content);

    bg = new PIXI.Graphics();
    bg.beginFill(0x000000);
    bg.drawRect(0, 0, screenWidth, screenHeight);
    bg.endFill();
    content.addChild(bg);

    death = PIXI.Sprite.fromFrame("DeathSilhuet2.png");
    death.anchor.x = 0.5;
    death.anchor.y = 0.5;
    death.scale.x = 1;
    death.scale.y = 1;
    content.addChild(death);
    death.position.x = screenWidth/2;
    death.position.y = screenHeight/2;
  }

  this.show = function() {
    content.visible = true;
    bg.alpha = 0;
    death.visible = false;
    death.alpha = 0;
    count = 0;
  }

  this.update = function()
  {
    if (!content.visible) return;

    bg.alpha += 0.01;
    if (bg.alpha > 1) bg.alpha = 1;

    if (bg.alpha == 1)
    {
      if (count == 0) game.resources.storm.play();

      if (count%15 == 0 && count < 80)
      {
        death.visible = !death.visible;
      }

      death.alpha = 1;

      count++;

      if (count >= 150) hide();
    }


  }

  function hide() {
    content.visible = false;

    // game.loadLevel(1);
    // game.level.dispose();
    // game.level.index = 0;
    // game.level = null;

    game.goToBeginning();
  }

  init();

};

},{}],"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Level.js":[function(require,module,exports){

var PlatformBehavior = require('./behaviors/PlatformBehavior.js');
var SwitchBehavior = require('./behaviors/SwitchBehavior.js');
var EndBehavior = require('./behaviors/EndBehavior.js');
var LightBehavior = require('./behaviors/LightBehavior.js');
var EndCarBehavior = require('./behaviors/EndCarBehavior.js');

module.exports = function Level(game, index) {
  var self = this;
  var numSwitches = 0;
  var tutorial = null;
  var count = 0;
  self.numSwitches = numSwitches;
  this.index = index;
  this.segments = [];
  this.levelobjects = [];
  this.playerPos = {};
  this.container = new PIXI.DisplayObjectContainer();

  this.view = new PIXI.DisplayObjectContainer();

  game.resources.forestSound.play();

  //
  // Level methods
  //

  this.dispose = function() {
    this.levelobjects = null;
    game.resources.forestSound.stop();
    game.stage.removeChild(self.container);
    game.stage.removeChild(self.view);
  }

  this.parse = function(data) {
    self.bg1 = PIXI.Sprite.fromFrame("backgroundForest.png");
    self.view.addChild(self.bg1);

    self.overlay = new PIXI.Graphics();
    self.overlay.beginFill(0x00fffa);
    self.overlay.drawRect(0, 0, screenWidth, screenHeight);
    self.overlay.endFill();
    self.overlay.alpha = 0.3;
    self.view.addChild(self.overlay);


    self.bg2 = PIXI.Sprite.fromFrame("backgroundForest.png");
    self.view.addChild(self.bg2);

    if (index == 1)
    {
      tutorial = PIXI.Sprite.fromFrame("controls.png");
      tutorial.anchor.x = 0.5;
      tutorial.anchor.y = 0.5;
      self.view.addChild(tutorial);
      tutorial.position.x = screenWidth/2;
      tutorial.position.y = screenHeight/2;
    }

    self.scenario = new PIXI.DisplayObjectContainer();
    self.view.addChild(self.scenario);

    self.foreground = new PIXI.DisplayObjectContainer();
    self.view.addChild(self.foreground);

    for (index = 0; index < data.layers[0].objects.length; ++index) {

      ////search for player start point
      if(data.layers[0].objects[index].type == "start")
      {
        self.playerPos = {x:data.layers[0].objects[index].x, y:data.layers[0].objects[index].y};
        continue;
      }

      if(data.layers[0].objects[index].type == "SwitchBehavior")
        self.numSwitches ++;

      ////setup behavior
      var BehaviourClass = require("./behaviors/" + data.layers[0].objects[index].type + ".js");

      var c = BehaviourClass == LightBehavior ? self.foreground : self.scenario;

      var behavior = new BehaviourClass(c, data.layers[0].objects[index]);
      self.levelobjects.push(behavior);

      if(data.layers[0].objects[index].type == "LightBehavior") {
        light.behavior = behavior;
        continue;
      }

      ////create shadow
      if(!data.layers[0].objects[index].properties.shadow) {
        continue;
      }

      /////retrive position and size specs
      var sizeX = data.layers[0].objects[index].width;
      var sizeY = data.layers[0].objects[index].height;
      var originX = data.layers[0].objects[index].x;
      var originY = data.layers[0].objects[index].y;

      var segmentA = {target:behavior.view,a:{x:originX,y:originY}, b:{x:originX + sizeX,y:originY}};
      var segmentB = {target:behavior.view,a:{x:originX+sizeX,y:originY}, b:{x:originX + sizeX,y:originY+sizeY}};
      var segmentC = {target:behavior.view,a:{x:originX+sizeX,y:originY+sizeY}, b:{x:originX,y:originY + sizeY}};
      var segmentD = {target:behavior.view,a:{x:originX,y:originY + sizeY}, b:{x:originX,y:originY}};

      this.segments.push(segmentA);
      this.segments.push(segmentB);
      this.segments.push(segmentC);
      this.segments.push(segmentD);
    }

    console.log("total switches in level: " + self.numSwitches);
  }


  this.update = function(game)
  {
    // WHY GOD?!?!?!!
    try {

      if (tutorial != null)
        {
          tutorial.alpha = 0.75 + Math.sin(count)*0.25;
          count += 0.1;
        }

        if (self.levelobjects) {
          for (index = 0; index < self.levelobjects.length; ++index) {
            self.levelobjects[index].update(game);
          }
        }
    } catch (e) {
    }
  }
};

},{"./behaviors/EndBehavior.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/behaviors/EndBehavior.js","./behaviors/EndCarBehavior.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/behaviors/EndCarBehavior.js","./behaviors/LightBehavior.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/behaviors/LightBehavior.js","./behaviors/PlatformBehavior.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/behaviors/PlatformBehavior.js","./behaviors/SwitchBehavior.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/behaviors/SwitchBehavior.js"}],"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/LevelEnd.js":[function(require,module,exports){
module.exports = function LevelEnd(game) {

  var content,
    self = this,
    bg,
    text,
    btn;

  function init() {
    content = new PIXI.DisplayObjectContainer();
    content.visible = false;
    game.stage.addChild(content);

    bg = PIXI.Sprite.fromImage(game.resources.background);
    content.addChild(bg);

    text = PIXI.Sprite.fromImage(game.resources.textLevelEnd);
    content.addChild(text);

    btn = new PIXI.Sprite(PIXI.Texture.fromImage(game.resources.btnNext));
    btn.buttonMode = true;
    btn.interactive = true;
    content.addChild(btn);
    btn.click = function(data) {
      hide();
      game.nextLevel();
    };
  }

  function setPositions() {
    text.position.x = (game.renderer.width / 2) - (text.width / 2);
    text.position.y = (game.renderer.height / 3);

    btn.position.x = (game.renderer.width / 2) - (btn.width / 2);
    btn.position.y = (game.renderer.height / 3) * 2;
  }

  this.show = function() {
    content.visible = true;
    setPositions();
  }

  function hide() {
    content.visible = false;
  }

  init();

};

},{}],"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Light.js":[function(require,module,exports){
module.exports = function Light(x, y) {
  this.position = {x: x, y: y};

  this.segments = [];
  this.fuzzyRadius = 10;

  this.setSegments = function(segments) {
    this.segments = segments;
  };

  this.getSightPolygons = function() {
    var polygons = [ light.getSightPolygon(this.position.x, this.position.y) ];

    for(var angle=0;angle<Math.PI*2;angle+=(Math.PI*2)/10){
      var dx = Math.cos(angle)*this.fuzzyRadius;
      var dy = Math.sin(angle)*this.fuzzyRadius;
      polygons.push(this.getSightPolygon(this.position.x+dx,this.position.y+dy));
    };

    return polygons;
  };

  this.getPolygonGraphics = function(polygon, fillStyle) {
    var g = new PIXI.Graphics();
    g.beginFill(0x000);
    g.moveTo(polygon[0].x, polygon[0].y);
    for(var i=1;i<polygon.length;i++){
      var intersect = polygon[i];
      g.lineTo(intersect.x, intersect.y);
    }
    g.endFill();
    return g;
  };

  this.getIntersection = function(ray, segment) {
    // RAY in parametric: Point + Delta*T1
    var r_px = ray.a.x;
    var r_py = ray.a.y;
    var r_dx = ray.b.x-ray.a.x;
    var r_dy = ray.b.y-ray.a.y;

    // SEGMENT in parametric: Point + Delta*T2
    var s_px = segment.a.x;
    var s_py = segment.a.y;
    var s_dx = segment.b.x-segment.a.x;
    var s_dy = segment.b.y-segment.a.y;

    // Are they parallel? If so, no intersect
    var r_mag = Math.sqrt(r_dx*r_dx+r_dy*r_dy);
    var s_mag = Math.sqrt(s_dx*s_dx+s_dy*s_dy);
    if(r_dx/r_mag==s_dx/s_mag && r_dy/r_mag==s_dy/s_mag){
      // Unit vectors are the same.
      return null;
    }

    // SOLVE FOR T1 & T2
    // r_px+r_dx*T1 = s_px+s_dx*T2 && r_py+r_dy*T1 = s_py+s_dy*T2
    // ==> T1 = (s_px+s_dx*T2-r_px)/r_dx = (s_py+s_dy*T2-r_py)/r_dy
    // ==> s_px*r_dy + s_dx*T2*r_dy - r_px*r_dy = s_py*r_dx + s_dy*T2*r_dx - r_py*r_dx
    // ==> T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx)
    var T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx);
    var T1 = (s_px+s_dx*T2-r_px)/r_dx;

    // Must be within parametic whatevers for RAY/SEGMENT
    if(T1<0) return null;
    if(T2<0 || T2>1) return null;

    // Return the POINT OF INTERSECTION
    return {
      x: r_px+r_dx*T1,
      y: r_py+r_dy*T1,
      param: T1
    };
  };

  this.getSightPolygon = function(sightX, sightY) {
    // Get all unique points
    var points = (function(segments){
      var a = [];
      segments.forEach(function(seg){
        a.push(seg.a,seg.b);
      });
      return a;
    })(this.segments);

    var uniquePoints = (function(points){
      var set = {};
      return points.filter(function(p){
        var key = p.x+","+p.y;
        if(key in set){
          return false;
        }else{
          set[key]=true;
          return true;
        }
      });
    })(points);

    // Get all angles
    var uniqueAngles = [];
    for(var j=0;j<uniquePoints.length;j++){
      var uniquePoint = uniquePoints[j];
      var angle = Math.atan2(uniquePoint.y-sightY,uniquePoint.x-sightX);
      uniquePoint.angle = angle;
      uniqueAngles.push(angle-0.00001,angle,angle+0.00001);
    }

    // RAYS IN ALL DIRECTIONS
    var intersects = [];
    for(var j=0;j<uniqueAngles.length;j++){
      var angle = uniqueAngles[j];

      // Calculate dx & dy from angle
      var dx = Math.cos(angle);
      var dy = Math.sin(angle);

      // Ray from center of screen to mouse
      var ray = {
        a:{x:sightX,y:sightY},
        b:{x:sightX+dx,y:sightY+dy}
      };

      // Find CLOSEST intersection
      var closestIntersect = null;
      for(var i=0;i<this.segments.length;i++){
        var intersect = this.getIntersection(ray,this.segments[i]);
        if(!intersect) continue;
        if(!closestIntersect || intersect.param<closestIntersect.param){
          closestIntersect=intersect;
        }
      }

      // Intersect angle
      if(!closestIntersect) continue;
      closestIntersect.angle = angle;

      // Add to list of intersects
      intersects.push(closestIntersect);
    }

    // Sort intersects by angle
    intersects = intersects.sort(function(a,b){
      return a.angle-b.angle;
    });

    // Polygon is intersects, in order of angle
    return intersects;
  }

}

},{}],"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Physics.js":[function(require,module,exports){
module.exports = function Physics()
{
	var self = this;
	var playerPosition = {x:0, y:0};
	var playerVelocity = {x:0, y:0};
	var axis = {x:0, y:0};

	this.process = process;
	this.playerPosition = playerPosition;
	this.playerVelocity = playerVelocity;

	function process(game, direction, vertices)
	{
		axis.x = direction;

		// var vertices = polygons[0];
		var walking = axis.x != 0;
		var offsetX = 20;
		var offsetY = 20;
		var velX = walking ? 4 : 0;
		var velY = 6;

		// var lineHA = {x:playerPosition.x - 1000, y:playerPosition.y};
		// var lineHB = {x:playerPosition.x + 1000, y:playerPosition.y};
		// var lineVA = {x:playerPosition.x, y:playerPosition.y - 1000};
		// var lineVB = {x:playerPosition.x, y:playerPosition.y + 1000};
		// var resultH = raycast(lineHA, lineHB, vertices);
		// var resultV = raycast(lineVA, lineVB, vertices);
		// var nearest = getNearestFaces(playerPosition, resultH.concat(resultV));
		// var isInside = pointInPolygon(playerPosition, vertices);

		// if (axis.x < 0 && nearest.ld - offsetX < velX)
		// {
		// 	velX = nearest.ld - offsetX;
		// }

		// if (axis.x > 0 && nearest.rd - offsetX < velX)
		// {
		// 	velX = nearest.rd - offsetX;
		// }

		// if (axis.y < 0 && nearest.td - offsetY < velY)
		// {
		// 	velY = nearest.td - offsetY;
		// }

		// if (axis.y > 0 && nearest.bd - offsetY < velY)
		// {
		// 	velY = nearest.bd - offsetY;
		// }


		var prevX = playerPosition.x;
		playerPosition.x += axis.x*velX;

		var lineHA = {x:playerPosition.x - 1000, y:playerPosition.y};
		var lineHB = {x:playerPosition.x + 1000, y:playerPosition.y};
		var resultH = raycast(lineHA, lineHB, vertices);
		var nearest = getNearestFaces(playerPosition, resultH);
		var isInside = pointInPolygon(playerPosition, vertices);

		if (isInside)
		{
			if (nearest.l)
			{
				if (playerPosition.x < nearest.l.point.x + offsetX)
				{
					playerPosition.x = nearest.l.point.x + offsetX;
					playerVelocity.x = 0;
				}
				else
				{
					playerVelocity.x = playerPosition.x - prevX;
				}

				// ctx.beginPath();
				// ctx.moveTo(playerPosition.x, playerPosition.y);
				// ctx.lineTo(nearest.l.point.x, playerPosition.y)
				// ctx.strokeStyle = "#FF0000";
				// ctx.stroke();
			}
			if (nearest.r)
			{
				if (playerPosition.x > nearest.r.point.x - offsetX)
				{
					playerPosition.x = nearest.r.point.x - offsetX;
					playerVelocity.x = 0;
				}
				else
				{
					playerVelocity.x = playerPosition.x - prevX;
				}

				// ctx.beginPath();
				// ctx.moveTo(playerPosition.x, playerPosition.y);
				// ctx.lineTo(nearest.r.point.x, playerPosition.y);
				// ctx.strokeStyle = "#FF0000";
				// ctx.stroke();
			}
		}
		else
		{
			playerPosition.x = prevX;

		}


		var prevY = playerPosition.y;

    // gravity
		playerPosition.y += 2;

		var lineVA = {x:playerPosition.x, y:playerPosition.y - 1000};
		var lineVB = {x:playerPosition.x, y:playerPosition.y + 1000};
		var resultV = raycast(lineVA, lineVB, vertices);
		var nearest = getNearestFaces(playerPosition, resultV);
		var isInside = pointInPolygon(playerPosition, vertices);


		if (isInside)
		{
			if (nearest.t)
			{
				if (playerPosition.y < nearest.t.point.y + offsetY) playerPosition.y = nearest.t.point.y + offsetY;

				// ctx.beginPath();
				// ctx.moveTo(playerPosition.x, playerPosition.y);
				// ctx.lineTo(playerPosition.x, nearest.t.point.y);
				// ctx.strokeStyle = "#FF0000";
				// ctx.stroke();
			}

			if (nearest.b)
			{
				if (playerPosition.y > nearest.b.point.y - offsetY) playerPosition.y = nearest.b.point.y - offsetY;

				// ctx.beginPath();
				// ctx.moveTo(playerPosition.x, playerPosition.y);
				// ctx.lineTo(playerPosition.x, nearest.b.point.y);
				// ctx.strokeStyle = "#FF0000";
				// ctx.stroke();
			}
		}
		else
		{
			playerPosition.y = prevY;
		}


		playerVelocity.y = playerPosition.y - prevY;

		if (playerPosition.y < 20) {
			playerPosition.y = 20;
			playerVelocity.y = 0;
		}

		if (playerPosition.x < 20) {
			playerPosition.x = 20;
			playerVelocity.x = 0;
		} else if (playerPosition.x > (game.renderer.width - 20)) {
			playerPosition.x = (game.renderer.width - 20);
			playerVelocity.x = 0;
		}
	}

	function getNearestFaces(pos, faces)
	{
		var result = {l:null, r:null, t:null, b:null, dl:100000, dr:100000, dt:100000, db:100000};

		for (var i = 0; i < faces.length; i++)
		{
			var r = faces[i];

			if (r.point.onLine1 && r.point.onLine2)
			{
				var d = lineDistance(pos, r.point);

				if (r.point.x < pos.x)
				{
					if (d < result.dl)
					{
						result.dl = d;
						result.l = r;
					}
				}

				if (r.point.x > pos.x)
				{
					if (d < result.dr)
					{
						result.dr = d;
						result.r = r;
					}
				}

				if (r.point.y < pos.y)
				{
					if (d < result.dt)
					{
						result.dt = d;
						result.t = r;
					}
				}

				if (r.point.y > pos.y)
				{
					if (d < result.db)
					{
						result.db = d;
						result.b = r;
					}
				}
			}
		}

		return result;
	}

	function raycast(startPoint, endPoint, vertices)
	{
		var len = vertices.length;
		var result = [];

		for (var i = 0; i < len; i++)
		{
			var a = vertices[i];
			var b = i >= (len - 1) ? vertices[0] : vertices[i+1];
			var r = checkLineIntersection(startPoint.x, startPoint.y, endPoint.x, endPoint.y, a.x, a.y, b.x, b.y);
			if (r.onLine1 && r.onLine2)
			{
				var face = {a:a, b:b, point:r};
				result.push(face);
			}
		}

		return result;
	}

	function lineDistance(point1, point2)
	{
		var xs = 0;
		var ys = 0;

		xs = point2.x - point1.x;
		xs = xs * xs;

		ys = point2.y - point1.y;
		ys = ys * ys;

		return Math.sqrt(xs + ys);
	}
}

//
function pointInPolygon(point, polygon)
{
	var points = polygon;
	var i, j, nvert = polygon.length;
	var c = false;

	for(i = 0, j = nvert - 1; i < nvert; j = i++) {
		if( ( ((points[i].y) >= point.y ) != (points[j].y >= point.y) ) &&
	    	(point.x <= (points[j].x - points[i].x) * (point.y - points[i].y) / (points[j].y - points[i].y) + points[i].x)
	  	) c = !c;
	}

  return c;
}

// method from jsfiddle: http://jsfiddle.net/justin_c_rounds/Gd2S2/light/
function checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null,
        onLine1: false,
        onLine2: false
    };
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator == 0) {
        return result;
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = line1StartX + (a * (line1EndX - line1StartX));
    result.y = line1StartY + (a * (line1EndY - line1StartY));
/*
        // it is worth noting that this should be the same as:
        x = line2StartX + (b * (line2EndX - line2StartX));
        y = line2StartX + (b * (line2EndY - line2StartY));
        */
    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a > 0 && a < 1) {
        result.onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b > 0 && b < 1) {
        result.onLine2 = true;
    }
    // if line1 and line2 are segments, they intersect if both of the above are true
    return result;
};

},{}],"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Player.js":[function(require,module,exports){
var Tools = require('./Tools.js');
var ParticleSystem = require('./components/ParticleSystem.js');

module.exports = function Player(container, xPos, yPos) {
	var self = this;
	var velocity = 0;
	var acceleration = 0.25;
	var maxspeed = 2.0;
	var dir = 1;
	var movie = null;
	var dead = false;

	movie = new PIXI.MovieClip(Tools.getTextures("boy", 7, ".png"));
	movie.pivot = new PIXI.Point(movie.width/2, movie.height/2);
	movie.animationSpeed = 0.2;

	this.view = new PIXI.DisplayObjectContainer();
	this.view.addChild(movie);
	this.view.position.x = xPos;
	this.view.position.y = yPos;

	var fading = false;

	movie.play();

	var particles = new ParticleSystem(
	  {
	      "images":["pixelShine.png"],
	      "numParticles":100,
	      "emissionsPerUpdate":0,
	      "emissionsInterval":0,
	      "alpha":1,
	      "properties":
	      {
	        "randomSpawnX":10,
	        "randomSpawnY":10,
	        "life":30,
	        "randomLife":100,
	        "forceX":0,
	        "forceY":0,
	        "randomForceX":0.1,
	        "randomForceY":0.1,
	        "velocityX":3,
	        "velocityY":0,
	        "randomVelocityX":2,
	        "randomVelocityY":2,
	        "scale":5,
	        "growth":0.01,
	        "randomScale":4.5,
	        "alphaStart":0,
	        "alphaFinish":0,
	        "alphaRatio":0.2,
	        "torque":0,
	        "randomTorque":0
	      }
	  });
	  particles.view.alpha = 0.5;

	  container.addChild(particles.view);
	  container.addChild(this.view);

	this.update = function(game, position, velocity)
	{
		self.view.position.x = position.x;
		self.view.position.y = position.y - 10;

		if (velocity.x > -0.01 && velocity.x < 0.01) velocity.x = 0;

		if (velocity.x < 0) movie.scale.x = -1;
		if (velocity.x > 0) movie.scale.x = 1;

		movie.rotation = velocity.x*0.1;

		particles.properties.centerX = self.view.position.x + 10;
		particles.properties.centerY = self.view.position.y;
		particles.update();

		if (fading && self.view.alpha > 0.02) self.view.alpha -= 0.02;
	}

	this.moveLeft = function()
	{
	}

	this.moveRight = function()
	{
	}

	this.fadeOut = function()
	{
		particles.emit(100);
		self.view.alpha = 0.5;
		fading = true;
	}

	this.doCollide = function(xpos,ypos,width,height)
	{
		//console.log("collide: " + self.view.position.x >= xpos + " " + self.view.position.x < (xpos + width) + " " + self.view.position.y - ypos < 100)
		if(self.view.position.x >= xpos && self.view.position.x < (xpos + width) && Math.abs(self.view.position.y - ypos) < 50)
			return true;

		return false;
	}

}


},{"./Tools.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Tools.js","./components/ParticleSystem.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/components/ParticleSystem.js"}],"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Preloader.js":[function(require,module,exports){
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

    bg = new PIXI.Graphics();
    bg.beginFill(0x000000);
    bg.drawRect(0, 0, screenWidth, screenHeight);
    bg.endFill();

    
    content.addChild(bg);

    self.text = new PIXI.Text('CARREGANDO 0%', {
      font: '18px Rokkitt',
      fill: '#666666',
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

},{}],"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Resources.js":[function(require,module,exports){
module.exports = function Resources() {

  Howler.iOSAutoEnable = false;
  // Howler.mute();

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
      // game.resources.soundLoop.play();
      name: 'soundLoop',
      urls: ['sounds/soundLoop.mp3'],
      autoPlay: false,
      loop: true,
      volume: 0
    },
    {
      // game.resources.buttonClick.play();
      name: 'buttonClick',
      urls: ['sounds/buttonClick2.mp3'],
      volume: .3
    },
    {
      // game.resources.portalSound.play();
      name: 'portalSound',
      urls: ['sounds/portal.mp3'],
      volume: .5
    },
    {
      // game.resources.forestSound.play();
      name: 'forestSound',
      urls: ['sounds/forest-night2.mp3'],
      volume: .7,
      loop: true
    },
    {
      // game.resources.motherSound.play();
      name: 'motherSound',
      urls: ['sounds/blimblim.mp3'],
      volume: .3
    },
    {
      // game.resources.swicherSound.play();
      name: 'swicherSound',
      urls: ['sounds/swicher2.mp3'],
      volume: .3
    },
    {
      // game.resources.carCrash.play();
      name: 'carCrash',
      urls: ['sounds/carCrash.mp3']
    },
    {
      // game.resources.carPass.play();
      name: 'carPass',
      urls: ['sounds/carPass2.mp3'],
      volume: .15
    },
    {
      // game.resources.storm.play();
      name: 'storm',
      urls: ['sounds/storm2.mp3'],
      volume: 1
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

},{}],"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Tools.js":[function(require,module,exports){


module.exports = 
{
	getTextures:  function(prefix, numFrames, sufix)
	{
		if (sufix == null) sufix = "";
		var textures = [];
		var i = numFrames;
		while (i > 0) 
		{
			var id = this.intToString(i, 2);
			var texture = PIXI.Texture.fromFrame(prefix+id+sufix);
			textures.push(texture);
			i--;
		}

		textures.reverse();
	    return textures;
	},

	intToString: function(value, length)
	{
		var str = value.toString();
		var strlen = str.length;
		var i = length - strlen;
		while (i--) str = "0" + str; 
		return str;
	},

	clamp: function(value, min, max)
	{
		if (value < min) return min;
		if (value > max) return max;
		return value;
	}
}
},{}],"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/behaviors/EndBehavior.js":[function(require,module,exports){
var Tweenable = require('../vendor/shifty'),
    Game = require('../game'),
    ParticleSystem = require('../components/ParticleSystem.js'),
    Tweenable = require('../vendor/shifty');

module.exports = function EndBehavior(container, data) {
	var self = this,
      itemData = data,
      triggered = false;

  /////retrive position and size specs
  var size = data.width;
  var originX = data.x;
  var originY = data.y;

  /////retrive position and size specs
  var size = data.width;
  var originX = data.x;
  var originY = data.y;

  /////create visual
  this.view = new PIXI.DisplayObjectContainer();
  this.view.position.x = originX;
  this.view.position.y = originY - 27;

  var particles = null;
  var portalOffSprite = new PIXI.Sprite(PIXI.Texture.fromImage("PortalOff.png"));
  var portalOnSprite = new PIXI.Sprite(PIXI.Texture.fromImage("portal.png"));
  portalOnSprite.alpha = 0;

  this.view.addChild(portalOffSprite);
  container.addChild(this.view);

  var fadeOutShape = new PIXI.Graphics();
  fadeOutShape.alpha = 0;

  var halo = PIXI.Sprite.fromFrame("halo.png");
  halo.anchor.x = 0.5;
  halo.anchor.y = 0.5;
  halo.scale.x = 5;
  halo.scale.y = 5;
  halo.position.x = 33;
  halo.position.y = 33;
  halo.alpha = 0.2;
  this.view.addChild(halo);
  halo.visible = false;

  emitter.on('switch.pressed', function() {

    if(game.level.numSwitches == 0) {

      particles = new ParticleSystem({
        "images":["PortalSpark.png"],
        "numParticles":50,
        "emissionsPerUpdate":1,
        "emissionsInterval":2,
        "alpha":1,
        "properties": {
          "randomSpawnX":1,
          "randomSpawnY":30,
          "life":30,
          "randomLife":100,
          "forceX":0,
          "forceY":0.01,
          "randomForceX":0.007,
          "randomForceY":0.01,
          "velocityX":-1,
          "velocityY":0,
          "randomVelocityX":0.2,
          "randomVelocityY":0.2,
          "scale":0.25,
          "growth":0.001,
          "randomScale":0.04,
          "alphaStart":0,
          "alphaFinish":0,
          "alphaRatio":0.2,
          "torque":0,
          "randomTorque":0
        }
      });

      halo.visible = true;
      halo.alpha = 0;

      particles.view.alpha = 0.25;
      particles.properties.centerX = 18;
      particles.properties.centerY = 33;

      self.view.addChild(particles.view);

      // Fade portal
      var interval = setInterval(function() {
        if (portalOnSprite.alpha >= 1) {
          clearInterval(interval);
        } else {
          portalOnSprite.alpha += 0.02;
        }
      }, 1)

      self.view.addChild(portalOnSprite);
    }

  });

	this.trigger = function() {
    if (!triggered) {
      fadeOutShape.beginFill(0x000);
      fadeOutShape.drawRect(0, 0, game.renderer.width, game.renderer.height);
      game.stage.addChild(fadeOutShape);
      game.player.fadeOut();
      game.resources.portalSound.play();
      game.resources.forestSound.stop();
    }
    triggered = true;
  }

	this.update = function(game)
	{
    if (particles) {
      particles.update();
    }

    if (halo.visible)
    {
      halo.alpha += 0.01;
      if (halo.alpha > 0.2) halo.alpha = 0.2;
    }

    if (triggered) {

      fadeOutShape.alpha += 0.01;
      if (fadeOutShape.alpha >= 1) {
        game.level.dispose();
        game.nextLevel();
        game.stage.removeChild(fadeOutShape);
      }

    } else {
      //console.log(game.player.doCollide(itemData.x,itemData.y, itemData.width,itemData.height),game.input.Key.isDown(38));
      if(game.player.doCollide(itemData.x,itemData.y, itemData.width,itemData.height))
        {
          if(game.level.numSwitches == 0) {
            self.trigger();
          }
        }
    }
  }
}

},{"../components/ParticleSystem.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/components/ParticleSystem.js","../game":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/game.js","../vendor/shifty":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/vendor/shifty.js"}],"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/behaviors/EndCarBehavior.js":[function(require,module,exports){
var Tweenable = require('../vendor/shifty'),
    Game = require('../game'),
    ParticleSystem = require('../components/ParticleSystem.js'),
    Tweenable = require('../vendor/shifty');

module.exports = function EndCarBehavior(container, data) {
	var self = this,
      itemData = data,
      triggered = false;

  /////retrive position and size specs
  var size = data.width;
  var originX = data.x;
  var originY = data.y;

  /////retrive position and size specs
  var size = data.width;
  var originX = data.x;
  var originY = data.y;

  /////create visual
  this.view = new PIXI.DisplayObjectContainer();
  this.view.position.x = originX;
  this.view.position.y = originY - 27;

  var particles = null;
  var carSprite = new PIXI.Sprite(PIXI.Texture.fromImage("CarCrash.png"));
  carSprite.y = 13;
  this.view.addChild(carSprite);
  container.addChild(this.view);

  var fadeOutShape = new PIXI.Graphics();
  fadeOutShape.alpha = 0;

  emitter.on('switch.pressed', function() {

    if(game.level.numSwitches == 0) {

      particles = new ParticleSystem({
        "images":["motherShine.png"],
        "numParticles":50,
        "emissionsPerUpdate":1,
        "emissionsInterval":2,
        "alpha":1,
        "properties": {
          "randomSpawnX":1,
          "randomSpawnY":1,
          "life":30,
          "randomLife":100,
          "forceX":0,
          "forceY":0,
          "randomForceX":0.001,
          "randomForceY":0.01,
          "velocityX":0,
          "velocityY":-0.02,
          "randomVelocityX":0.2,
          "randomVelocityY":0.4,
          "scale":0.1,
          "growth":0.001,
          "randomScale":0.04,
          "alphaStart":0,
          "alphaFinish":0,
          "alphaRatio":0.2,
          "torque":0,
          "randomTorque":0
        }
      });

      particles.view.alpha = 0.5;
      particles.properties.centerX += self.view.width / 2;
      particles.properties.centerY += self.view.height / 2;

      self.view.addChild(particles.view);
    }

  });

	this.trigger = function() {
    if (!triggered) {
      fadeOutShape.beginFill(0x000);
      fadeOutShape.drawRect(0, 0, game.renderer.width, game.renderer.height);
      container.addChild(fadeOutShape);
      game.player.fadeOut();
      game.resources.portalSound.play();
      game.resources.forestSound.stop();
    }
    triggered = true;
  }

  var gameover = false;
  self.gameover = gameover;

	this.update = function(game)
	{
    if(self.gameover)
      return;

    if (particles) {
      particles.update();
    }

    if (triggered) {

      fadeOutShape.alpha += 0.01;
      if (fadeOutShape.alpha >= 0.7) {
        game.showEndStory();
        self.gameover = true;
      }

    } else {
      //console.log(game.player.doCollide(itemData.x,itemData.y, itemData.width,itemData.height),game.input.Key.isDown(38));
      if(game.player.doCollide(itemData.x,itemData.y, itemData.width,itemData.height))
        {
          if(game.level.numSwitches == 0) {
            self.trigger();
          }
        }
    }
  }
}

},{"../components/ParticleSystem.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/components/ParticleSystem.js","../game":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/game.js","../vendor/shifty":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/vendor/shifty.js"}],"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/behaviors/LightBehavior.js":[function(require,module,exports){
var Tools = require('../Tools.js');
var ParticleSystem = require('../components/ParticleSystem.js');

module.exports = function LightBehavior(container, data) {
  var self = this;
  this.name = "LightBehavior";

  /////retrive position and size specs
  var size = data.width;
  var originX = data.x;
  var originY = data.y;

  var movie = null;

  movie = new PIXI.MovieClip(Tools.getTextures("mother", 12, ".png"));
  movie.pivot = new PIXI.Point(movie.width/2, movie.height/2 + 25);
  movie.animationSpeed = 0.2;

  this.view = new PIXI.DisplayObjectContainer();
  this.view.position.x = originX;
  this.view.position.y = originY;

  this.view.addChild(movie);

  movie.play();

  var halo = PIXI.Sprite.fromFrame("halo.png");
  halo.anchor.x = 0.5;
  halo.anchor.y = 0.5;
  halo.scale.x = 10;
  halo.scale.y = 10;
  halo.alpha = 0.3;
  this.view.addChild(halo);

  light.position.x = originX;
  light.position.y = originY;

  var particles = new ParticleSystem(
  {
      "images":["motherShine.png"],
      "numParticles":100,
      "emissionsPerUpdate":1,
      "emissionsInterval":2,
      "alpha":1,
      "properties":
      {
        "randomSpawnX":1,
        "randomSpawnY":1,
        "life":30,
        "randomLife":100,
        "forceX":0,
        "forceY":0,
        "randomForceX":0.01,
        "randomForceY":0.01,
        "velocityX":0,
        "velocityY":0,
        "randomVelocityX":0.1,
        "randomVelocityY":0.1,
        "scale":0.1,
        "growth":0.001,
        "randomScale":0.04,
        "alphaStart":0,
        "alphaFinish":0,
        "alphaRatio":0.2,
        "torque":0,
        "randomTorque":0
      }
  });
  particles.view.alpha = 0.5;

  container.addChild(particles.view);
  container.addChild(this.view);

  this.update = function()
  {
      self.view.position.x = light.position.x;
      self.view.position.y = light.position.y;

      particles.properties.centerX = self.view.position.x;
      particles.properties.centerY = self.view.position.y - 10;
      particles.update();

      var orientation = light.position.x - game.player.view.position.x;

      if (orientation < 0)
      {
        movie.scale.x = -1;
      }
      if (orientation > 0)
      {
        movie.scale.x = 1;
      }
  }

}

},{"../Tools.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Tools.js","../components/ParticleSystem.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/components/ParticleSystem.js"}],"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/behaviors/PlatformBehavior.js":[function(require,module,exports){
module.exports = function PlatformBehavior(container, properties) {

	var view = new PIXI.DisplayObjectContainer();
	view.position.x = properties.x;
	view.position.y = properties.y;

	container.addChild(view);

	setupSkin();

	function setupSkin()
	{
		var w = 40;
		var h = 40;
		var cols = Math.floor(properties.width/w);
		var rows = Math.floor(properties.height/h);
		var amount = cols*rows;
		var px = 0;
		var py = 0;
		

		for (var i = 0; i < amount; i++)
		{
			px = i%cols;
			py = Math.floor(i/cols);
			var textureName = py == 0 ? "tileWood01.png" : "tileWood02.png";
			var texture = PIXI.Texture.fromImage(textureName);
			var tile = new PIXI.Sprite(texture);
			tile.position.x = px*w;
			tile.position.y = py*h;
			view.addChild(tile);
		}	
	}

	

	this.update = function()
	{

	}

	this.view = view;
}

},{}],"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/behaviors/SwitchBehavior.js":[function(require,module,exports){
var Tweenable = require('../vendor/shifty');
var ParticleSystem = require('../components/ParticleSystem.js');

module.exports = function SwitchBehavior(container, data) {
	var self = this,
    gridSize = data.properties.size || data.height,
    moveX = data.properties.moveX * gridSize,
    moveY = data.properties.moveY * gridSize,
    lightOrig = false,
    lightDest = { x: data.properties.moveX * gridSize, y: data.properties.moveY * gridSize },
    itemData = data,
    moving = false,
    pressed = false;

  /////retrive position and size specs
  var originX = data.x;
  var originY = data.y;
  var pressed = false;

  /////create visual
  var textureOff = PIXI.Texture.fromImage("switchOff.png");
  var textureOn = PIXI.Texture.fromImage("switchOn.png");

  self.view = new PIXI.Sprite(textureOff);
  self.view.position.x = originX;
  self.view.position.y = originY - 2;

  var particles = new ParticleSystem(
  {
      "images":["pixelShine.png"],
      "numParticles":30,
      "emissionsPerUpdate":1,
      "emissionsInterval":10,
      "alpha":1,
      "properties":
      {
        "randomSpawnX":2,
        "randomSpawnY":1,
        "life":40,
        "randomLife":5,
        "forceX":0,
        "forceY":-0.02,
        "randomForceX":0.0,
        "randomForceY":0.01,
        "velocityX":0,
        "velocityY":-0.1,
        "randomVelocityX":0.0,
        "randomVelocityY":0.0,
        "scale":1,
        "growth":-0.001,
        "randomScale":0.5,
        "alphaStart":1,
        "alphaFinish":0,
        "alphaRatio":0.2,
        "torque":0,
        "randomTorque":0
      }
  });

  container.addChild(this.view);
  container.addChild(particles.view);
  particles.properties.centerY = self.view.position.y + 25;

  this.trigger = function() {
    // when pressing for the first time, the orinal light position is stored to revert.
    // if (!pressed && !lightOrig) {
    //   lightOrig = JSON.parse(JSON.stringify(light.position));
    // }

    // var dest = (!pressed) ? lightDest : lightOrig;
    // pressed = !pressed;

    if (!pressed)
    {
      self.view.texture = textureOn;
      self.view.position.y = originY + 12;
      particles.properties.centerY = self.view.position.y + 9;
      pressed = true;
      game.resources.swicherSound.play();
      container.addChild(particles.view);
    }
    // else
    // {
    //   self.view.texture = textureOff;
    // }

    // var tweenable = new Tweenable();
    // tweenable.tween({
    //   from: light.position,
    //   to:   dest,
    //   duration: 1000,
    //   easing: 'easeOutCubic',
    //   start: function () {
    //     moving = true;
    //   },
    //   finish: function () {
    //     moving = false;
    //   }
    // });
  }

	this.update = function(game)
	{
    if (pressed)
    {
        particles.properties.centerX = self.view.position.x + 15;
        particles.update(); 
    }
      
      
    

    if(pressed)
      return;

		//console.log(game.player.doCollide(itemData.x,itemData.y, itemData.width,itemData.height),game.input.Key.isDown(38));
		if(game.player.doCollide(itemData.x,itemData.y, itemData.width,itemData.height) && !moving)
		{
			moving = true;
      game.level.numSwitches --;
      emitter.emit('switch.pressed');
			self.trigger();
		}
	}
}

},{"../components/ParticleSystem.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/components/ParticleSystem.js","../vendor/shifty":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/vendor/shifty.js"}],"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/components/ParticleSystem.js":[function(require,module,exports){
module.exports = function ParticleSystem(particlesConfig)
{
	var view = null;
	var properties = null;
	var firstParticle = null;
	var lastParticle = null;
	var nextParticle = 0;
	var count = 0;
	var numParticles = 20;
	var images = [];
	var self = this;
	var paused = false;

	self.emissionsInterval = 1;
	self.emissionsPerUpdate = 1;

	Math.randomRange = function(min, max, rounded)
	{
		var diff = max - min;
		var result = min + diff*Math.random();
		if (rounded) result = Math.round(result);
		return result;
	}

	init();

	function init()
	{
		view = new PIXI.DisplayObjectContainer();
		properties = new ParticleProperties();
		setup(particlesConfig);
	}

	function setup(config)
	{
		clear();

		if (config.numParticles != null) numParticles = config.numParticles;
		if (config.images != null) images = config.images;
		if (config.emissionsInterval != null) self.emissionsInterval = config.emissionsInterval;
		if (config.emissionsPerUpdate != null) self.emissionsPerUpdate = config.emissionsPerUpdate;
		if (config.alpha != null) view.alpha = config.alpha;

		if (config.properties != null) {
			for (var field in config.properties) {
				properties[field] = config.properties[field];
			}
		}

		var j = 0;
		for (var i = 0; i < numParticles; i++) {
			var p = new Particle(images[j]);
			view.addChild(p.view);
			if (firstParticle == null) firstParticle = p;
			if (lastParticle != null) lastParticle.next = p;
			lastParticle = p;
			j++;
			if (j >= images.length) j = 0;
		}

		nextParticle = firstParticle;
	}

	function clear()
	{
		var p = firstParticle;
		while (p != null) {
			p.dispose();
			p = p.next;
		}

		firstParticle = null;
		lastParticle = null;
		nextParticle = null;
	}

	function update(timestamp)
	{
		if (count == 0 && !paused) emit(self.emissionsPerUpdate);
		count++;
		if (count == self.emissionsInterval) count = 0;

		var p = firstParticle;
		while (p != null) {
			if (p.living) {
				p.update(timestamp);
			}
			p = p.next;
		}
	}

	function emit(amount)
	{
		while (amount--) {
			var p = nextParticle;
			if (p == null) p = firstParticle;
			p.spawn(properties);
			nextParticle = p.next;
		}
	}

	function getCount()
	{
		return count;
	}

	function pauseEmissions()
	{
		paused = true;
	}

	function resumeEmissions()
	{
		paused = false;
	}

	function dispose()
	{
		clear();
		if (view && view.parent) view.parent.removeChild(view);
		view = null;
	}

	this.setup = setup;
	this.properties = properties;
	this.view = view;
	this.update = update;
	this.emit = emit;
	this.getCount = getCount;
	this.pauseEmissions = pauseEmissions;
	this.resumeEmissions = resumeEmissions;
	this.dispose = dispose;

}

	// INTERNAL CLASSES -----------------------------------------------------------------------

	Particle = function(image)
	{
		var view = null;
		var properties = null;
		var params = null;
		var self = this;

		init();

		function init()
		{
			view = PIXI.Sprite.fromFrame(image);
			view.anchor.x = 0.5;
			view.anchor.y = 0.5;
			properties = new ParticleProperties();
			view.visible = false;

			params = {};
			params.lifeCount = 0;
			params.lifeTotal = 0;
			params.alphaTime = 0.0;
			params.fadeInEvolution = 0.0;
			params.fadeOutEvolution = 0.0;
			params.stepToStartFadeOut = 0;

			properties = {};
		}

		this.living = false;
		this.next = null;
		this.view = view;
		this.properties = properties;
		this.params = params;
	}

	Particle.prototype.spawn = function(newProperties)
	{
		var self = this;
		var properties = this.properties;
		var params = this.params;
		var view = this.view;

		for (var field in newProperties) {
			properties[field] = newProperties[field];
		}

		this.living = true;

		params.lifeCount = properties.life + Math.round(Math.random()*properties.randomLife);
		params.lifeTotal = params.lifeCount;

		view.visible = true;
		view.position.x = properties.centerX + Math.randomRange(-properties.randomSpawnX, properties.randomSpawnX);
		view.position.y = properties.centerY + Math.randomRange(-properties.randomSpawnY, properties.randomSpawnY);
		view.scale.x = view.scale.y = properties.scale;
		view.alpha = properties.alphaStart;

		if (properties.randomVelocityX != 0) {
			properties.velocityX += Math.randomRange(-properties.randomVelocityX, properties.randomVelocityX);
		}

		if (properties.randomVelocityY != 0) {
			properties.velocityY += Math.randomRange(-properties.randomVelocityY, properties.randomVelocityY);
		}

		if (properties.randomForceX != 0) {
			properties.forceX += Math.randomRange(-properties.randomForceX, properties.randomForceX);
		}

		if (properties.randomForceY != 0) {
			properties.forceY += Math.randomRange(-properties.randomForceY, properties.randomForceY);
		}

		if (properties.randomScale != 0) {
			view.scale.x = view.scale.y = properties.scale + Math.randomRange(-properties.randomScale, properties.randomScale);
		}

		if (properties.randomTorque != 0) {
			properties.torque += Math.randomRange(-properties.randomTorque, properties.randomTorque);
		}

		params.alphaTime = Math.round(params.lifeCount*properties.alphaRatio);
		params.fadeInEvolution = (1.0 - properties.alphaStart)/params.alphaTime;
		params.fadeOutEvolution = (1.0 - properties.alphaFinish)/params.alphaTime;
		params.stepToStartFadeOut = params.alphaTime;
	}

	Particle.prototype.update = function(timestamp)
	{
		var self = this;
		var properties = this.properties;
		var params = this.params;
		var view = this.view;

		if (!self.living) return;

		view.position.x += properties.velocityX;
		view.position.y += properties.velocityY;
		view.rotation += properties.torque;
		properties.velocityX += properties.forceX;
		properties.velocityY += properties.forceY;

		if (params.lifeCount > params.lifeTotal - params.alphaTime) {
	    	view.alpha += params.fadeInEvolution;
	    	if (view.alpha > 1) view.alpha = 1;
	    }

	    if (params.lifeCount <= params.alphaTime) {
	    	view.alpha -= params.fadeOutEvolution;
	    	if (view.alpha < 0) view.alpha = 0;
	    }

	    if (properties.growth != 0) {
	    	view.scale.x = view.scale.y = (view.scale.x + properties.growth);
	    }

		params.lifeCount--;
		if (params.lifeCount <= 0) this.die();
	}

	Particle.prototype.die = function()
	{
		this.living = false;
		this.view.visible = false;
		this.view.alpha = 0;
	}

	Particle.prototype.dispose = function()
	{
		if (this.view == null) return;
		if (this.view.parent) this.view.parent.removeChild(this.view);

		this.living = false;
		this.next = null;
		this.view = null;
		this.properties = null;
		this.params = null;
	}

	//---------------------------------------------------------------------------------------------------------------------------

	ParticleProperties = function()
	{
		this.randomSpawnX = 0;
		this.randomSpawnY = 0;
		this.life = 60;
		this.randomLife = 0;
		this.centerX = 0;
		this.centerY = 0;
		this.forceX = 0;
		this.forceY = 0;
		this.randomForceX = 0;
		this.randomForceY = 0;
		this.velocityX = 0;
		this.velocityY = 0;
		this.randomVelocityX = 0;
		this.randomVelocityY = 0;
		this.scale = 1;
		this.growth = 0.0;
		this.randomScale = 0;
		this.alphaStart = 0;
		this.alphaFinish = 0;
		this.alphaRatio = 0.1;
		this.torque = 0;
		this.randomTorque = 0;
	}

},{}],"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/game.js":[function(require,module,exports){
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
    console.log('Game.js - this.restart()');
    var i = self.level.index;
    self.level.dispose();
    this.loadLevel(i);
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

    self.btnSoundOff.click = function(data) {
      self.btnSoundOn.visible = true;
      self.btnSoundOff.visible = false;
      Howler.mute();
    }

    self.btnSoundOn.click = function(data) {
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

    self.btnRestart.click = function(data) {
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
    console.log("show end story", gameRunning);

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

},{"./Begin":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Begin.js","./GameInput.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/GameInput.js","./GameOver":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/GameOver.js","./Level":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Level.js","./LevelEnd":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/LevelEnd.js","./Light":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Light.js","./Physics.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Physics.js","./Player.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Player.js","./Preloader":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Preloader.js","./Resources":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Resources.js","./Tools.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Tools.js","./vendor/shifty":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/vendor/shifty.js"}],"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/main.js":[function(require,module,exports){
var Game = require('./Game'),
    Tweenable = require('./vendor/shifty'),
    EventEmitter2 = require('./vendor/EventEmitter2').EventEmitter2,
    game;

// http://cubic-bezier.com/#.92,.34,.6,.8
Tweenable.setBezierFunction("customBezier", .92,.34,.6,.8);

// Event between objects
window.emitter = new EventEmitter2();

// Init
WebFontConfig = {
google: {
  families: ['Rokkitt']
},

active: function() {
  // do something
  game = Game.instance = new Game();
}
};
(function() {
var wf = document.createElement('script');
wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
    '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
wf.type = 'text/javascript';
wf.async = 'true';
var s = document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(wf, s);
})();

},{"./Game":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Game.js","./vendor/EventEmitter2":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/vendor/EventEmitter2.js","./vendor/shifty":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/vendor/shifty.js"}],"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/vendor/EventEmitter2.js":[function(require,module,exports){
/*!
 * EventEmitter2
 * https://github.com/hij1nx/EventEmitter2
 *
 * Copyright (c) 2013 hij1nx
 * Licensed under the MIT license.
 */
;!function(undefined) {

  var isArray = Array.isArray ? Array.isArray : function _isArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
  };
  var defaultMaxListeners = 10;

  function init() {
    this._events = {};
    if (this._conf) {
      configure.call(this, this._conf);
    }
  }

  function configure(conf) {
    if (conf) {

      this._conf = conf;

      conf.delimiter && (this.delimiter = conf.delimiter);
      conf.maxListeners && (this._events.maxListeners = conf.maxListeners);
      conf.wildcard && (this.wildcard = conf.wildcard);
      conf.newListener && (this.newListener = conf.newListener);

      if (this.wildcard) {
        this.listenerTree = {};
      }
    }
  }

  function EventEmitter(conf) {
    this._events = {};
    this.newListener = false;
    configure.call(this, conf);
  }

  //
  // Attention, function return type now is array, always !
  // It has zero elements if no any matches found and one or more
  // elements (leafs) if there are matches
  //
  function searchListenerTree(handlers, type, tree, i) {
    if (!tree) {
      return [];
    }
    var listeners=[], leaf, len, branch, xTree, xxTree, isolatedBranch, endReached,
        typeLength = type.length, currentType = type[i], nextType = type[i+1];
    if (i === typeLength && tree._listeners) {
      //
      // If at the end of the event(s) list and the tree has listeners
      // invoke those listeners.
      //
      if (typeof tree._listeners === 'function') {
        handlers && handlers.push(tree._listeners);
        return [tree];
      } else {
        for (leaf = 0, len = tree._listeners.length; leaf < len; leaf++) {
          handlers && handlers.push(tree._listeners[leaf]);
        }
        return [tree];
      }
    }

    if ((currentType === '*' || currentType === '**') || tree[currentType]) {
      //
      // If the event emitted is '*' at this part
      // or there is a concrete match at this patch
      //
      if (currentType === '*') {
        for (branch in tree) {
          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
            listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+1));
          }
        }
        return listeners;
      } else if(currentType === '**') {
        endReached = (i+1 === typeLength || (i+2 === typeLength && nextType === '*'));
        if(endReached && tree._listeners) {
          // The next element has a _listeners, add it to the handlers.
          listeners = listeners.concat(searchListenerTree(handlers, type, tree, typeLength));
        }

        for (branch in tree) {
          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
            if(branch === '*' || branch === '**') {
              if(tree[branch]._listeners && !endReached) {
                listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], typeLength));
              }
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
            } else if(branch === nextType) {
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+2));
            } else {
              // No match on this one, shift into the tree but not in the type array.
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
            }
          }
        }
        return listeners;
      }

      listeners = listeners.concat(searchListenerTree(handlers, type, tree[currentType], i+1));
    }

    xTree = tree['*'];
    if (xTree) {
      //
      // If the listener tree will allow any match for this part,
      // then recursively explore all branches of the tree
      //
      searchListenerTree(handlers, type, xTree, i+1);
    }

    xxTree = tree['**'];
    if(xxTree) {
      if(i < typeLength) {
        if(xxTree._listeners) {
          // If we have a listener on a '**', it will catch all, so add its handler.
          searchListenerTree(handlers, type, xxTree, typeLength);
        }

        // Build arrays of matching next branches and others.
        for(branch in xxTree) {
          if(branch !== '_listeners' && xxTree.hasOwnProperty(branch)) {
            if(branch === nextType) {
              // We know the next element will match, so jump twice.
              searchListenerTree(handlers, type, xxTree[branch], i+2);
            } else if(branch === currentType) {
              // Current node matches, move into the tree.
              searchListenerTree(handlers, type, xxTree[branch], i+1);
            } else {
              isolatedBranch = {};
              isolatedBranch[branch] = xxTree[branch];
              searchListenerTree(handlers, type, { '**': isolatedBranch }, i+1);
            }
          }
        }
      } else if(xxTree._listeners) {
        // We have reached the end and still on a '**'
        searchListenerTree(handlers, type, xxTree, typeLength);
      } else if(xxTree['*'] && xxTree['*']._listeners) {
        searchListenerTree(handlers, type, xxTree['*'], typeLength);
      }
    }

    return listeners;
  }

  function growListenerTree(type, listener) {

    type = typeof type === 'string' ? type.split(this.delimiter) : type.slice();

    //
    // Looks for two consecutive '**', if so, don't add the event at all.
    //
    for(var i = 0, len = type.length; i+1 < len; i++) {
      if(type[i] === '**' && type[i+1] === '**') {
        return;
      }
    }

    var tree = this.listenerTree;
    var name = type.shift();

    while (name) {

      if (!tree[name]) {
        tree[name] = {};
      }

      tree = tree[name];

      if (type.length === 0) {

        if (!tree._listeners) {
          tree._listeners = listener;
        }
        else if(typeof tree._listeners === 'function') {
          tree._listeners = [tree._listeners, listener];
        }
        else if (isArray(tree._listeners)) {

          tree._listeners.push(listener);

          if (!tree._listeners.warned) {

            var m = defaultMaxListeners;

            if (typeof this._events.maxListeners !== 'undefined') {
              m = this._events.maxListeners;
            }

            if (m > 0 && tree._listeners.length > m) {

              tree._listeners.warned = true;
              console.error('(node) warning: possible EventEmitter memory ' +
                            'leak detected. %d listeners added. ' +
                            'Use emitter.setMaxListeners() to increase limit.',
                            tree._listeners.length);
              console.trace();
            }
          }
        }
        return true;
      }
      name = type.shift();
    }
    return true;
  }

  // By default EventEmitters will print a warning if more than
  // 10 listeners are added to it. This is a useful default which
  // helps finding memory leaks.
  //
  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.

  EventEmitter.prototype.delimiter = '.';

  EventEmitter.prototype.setMaxListeners = function(n) {
    this._events || init.call(this);
    this._events.maxListeners = n;
    if (!this._conf) this._conf = {};
    this._conf.maxListeners = n;
  };

  EventEmitter.prototype.event = '';

  EventEmitter.prototype.once = function(event, fn) {
    this.many(event, 1, fn);
    return this;
  };

  EventEmitter.prototype.many = function(event, ttl, fn) {
    var self = this;

    if (typeof fn !== 'function') {
      throw new Error('many only accepts instances of Function');
    }

    function listener() {
      if (--ttl === 0) {
        self.off(event, listener);
      }
      fn.apply(this, arguments);
    }

    listener._origin = fn;

    this.on(event, listener);

    return self;
  };

  EventEmitter.prototype.emit = function() {

    this._events || init.call(this);

    var type = arguments[0];

    if (type === 'newListener' && !this.newListener) {
      if (!this._events.newListener) { return false; }
    }

    // Loop through the *_all* functions and invoke them.
    if (this._all) {
      var l = arguments.length;
      var args = new Array(l - 1);
      for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
      for (i = 0, l = this._all.length; i < l; i++) {
        this.event = type;
        this._all[i].apply(this, args);
      }
    }

    // If there is no 'error' event listener then throw.
    if (type === 'error') {

      if (!this._all &&
        !this._events.error &&
        !(this.wildcard && this.listenerTree.error)) {

        if (arguments[1] instanceof Error) {
          throw arguments[1]; // Unhandled 'error' event
        } else {
          throw new Error("Uncaught, unspecified 'error' event.");
        }
        return false;
      }
    }

    var handler;

    if(this.wildcard) {
      handler = [];
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
    }
    else {
      handler = this._events[type];
    }

    if (typeof handler === 'function') {
      this.event = type;
      if (arguments.length === 1) {
        handler.call(this);
      }
      else if (arguments.length > 1)
        switch (arguments.length) {
          case 2:
            handler.call(this, arguments[1]);
            break;
          case 3:
            handler.call(this, arguments[1], arguments[2]);
            break;
          // slower
          default:
            var l = arguments.length;
            var args = new Array(l - 1);
            for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
            handler.apply(this, args);
        }
      return true;
    }
    else if (handler) {
      var l = arguments.length;
      var args = new Array(l - 1);
      for (var i = 1; i < l; i++) args[i - 1] = arguments[i];

      var listeners = handler.slice();
      for (var i = 0, l = listeners.length; i < l; i++) {
        this.event = type;
        listeners[i].apply(this, args);
      }
      return (listeners.length > 0) || !!this._all;
    }
    else {
      return !!this._all;
    }

  };

  EventEmitter.prototype.on = function(type, listener) {

    if (typeof type === 'function') {
      this.onAny(type);
      return this;
    }

    if (typeof listener !== 'function') {
      throw new Error('on only accepts instances of Function');
    }
    this._events || init.call(this);

    // To avoid recursion in the case that type == "newListeners"! Before
    // adding it to the listeners, first emit "newListeners".
    this.emit('newListener', type, listener);

    if(this.wildcard) {
      growListenerTree.call(this, type, listener);
      return this;
    }

    if (!this._events[type]) {
      // Optimize the case of one listener. Don't need the extra array object.
      this._events[type] = listener;
    }
    else if(typeof this._events[type] === 'function') {
      // Adding the second element, need to change to array.
      this._events[type] = [this._events[type], listener];
    }
    else if (isArray(this._events[type])) {
      // If we've already got an array, just append.
      this._events[type].push(listener);

      // Check for listener leak
      if (!this._events[type].warned) {

        var m = defaultMaxListeners;

        if (typeof this._events.maxListeners !== 'undefined') {
          m = this._events.maxListeners;
        }

        if (m > 0 && this._events[type].length > m) {

          this._events[type].warned = true;
          console.error('(node) warning: possible EventEmitter memory ' +
                        'leak detected. %d listeners added. ' +
                        'Use emitter.setMaxListeners() to increase limit.',
                        this._events[type].length);
          console.trace();
        }
      }
    }
    return this;
  };

  EventEmitter.prototype.onAny = function(fn) {

    if (typeof fn !== 'function') {
      throw new Error('onAny only accepts instances of Function');
    }

    if(!this._all) {
      this._all = [];
    }

    // Add the function to the event listener collection.
    this._all.push(fn);
    return this;
  };

  EventEmitter.prototype.addListener = EventEmitter.prototype.on;

  EventEmitter.prototype.off = function(type, listener) {
    if (typeof listener !== 'function') {
      throw new Error('removeListener only takes instances of Function');
    }

    var handlers,leafs=[];

    if(this.wildcard) {
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);
    }
    else {
      // does not use listeners(), so no side effect of creating _events[type]
      if (!this._events[type]) return this;
      handlers = this._events[type];
      leafs.push({_listeners:handlers});
    }

    for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
      var leaf = leafs[iLeaf];
      handlers = leaf._listeners;
      if (isArray(handlers)) {

        var position = -1;

        for (var i = 0, length = handlers.length; i < length; i++) {
          if (handlers[i] === listener ||
            (handlers[i].listener && handlers[i].listener === listener) ||
            (handlers[i]._origin && handlers[i]._origin === listener)) {
            position = i;
            break;
          }
        }

        if (position < 0) {
          continue;
        }

        if(this.wildcard) {
          leaf._listeners.splice(position, 1);
        }
        else {
          this._events[type].splice(position, 1);
        }

        if (handlers.length === 0) {
          if(this.wildcard) {
            delete leaf._listeners;
          }
          else {
            delete this._events[type];
          }
        }
        return this;
      }
      else if (handlers === listener ||
        (handlers.listener && handlers.listener === listener) ||
        (handlers._origin && handlers._origin === listener)) {
        if(this.wildcard) {
          delete leaf._listeners;
        }
        else {
          delete this._events[type];
        }
      }
    }

    return this;
  };

  EventEmitter.prototype.offAny = function(fn) {
    var i = 0, l = 0, fns;
    if (fn && this._all && this._all.length > 0) {
      fns = this._all;
      for(i = 0, l = fns.length; i < l; i++) {
        if(fn === fns[i]) {
          fns.splice(i, 1);
          return this;
        }
      }
    } else {
      this._all = [];
    }
    return this;
  };

  EventEmitter.prototype.removeListener = EventEmitter.prototype.off;

  EventEmitter.prototype.removeAllListeners = function(type) {
    if (arguments.length === 0) {
      !this._events || init.call(this);
      return this;
    }

    if(this.wildcard) {
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      var leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);

      for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
        var leaf = leafs[iLeaf];
        leaf._listeners = null;
      }
    }
    else {
      if (!this._events[type]) return this;
      this._events[type] = null;
    }
    return this;
  };

  EventEmitter.prototype.listeners = function(type) {
    if(this.wildcard) {
      var handlers = [];
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      searchListenerTree.call(this, handlers, ns, this.listenerTree, 0);
      return handlers;
    }

    this._events || init.call(this);

    if (!this._events[type]) this._events[type] = [];
    if (!isArray(this._events[type])) {
      this._events[type] = [this._events[type]];
    }
    return this._events[type];
  };

  EventEmitter.prototype.listenersAny = function() {

    if(this._all) {
      return this._all;
    }
    else {
      return [];
    }

  };

  if (typeof define === 'function' && define.amd) {
     // AMD. Register as an anonymous module.
    define(function() {
      return EventEmitter;
    });
  } else if (typeof exports === 'object') {
    // CommonJS
    exports.EventEmitter2 = EventEmitter;
  }
  else {
    // Browser global.
    window.EventEmitter2 = EventEmitter;
  }
}();

},{}],"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/vendor/shifty.js":[function(require,module,exports){
/*! shifty - v1.2.1 - 2014-06-29 - http://jeremyckahn.github.io/shifty */
;(function (root) {

/*!
 * Shifty Core
 * By Jeremy Kahn - jeremyckahn@gmail.com
 */

// UglifyJS define hack.  Used for unit testing.  Contents of this if are
// compiled away.
if (typeof SHIFTY_DEBUG_NOW === 'undefined') {
  SHIFTY_DEBUG_NOW = function () {
    return +new Date();
  };
}

var Tweenable = (function () {

  'use strict';

  // Aliases that get defined later in this function
  var formula;

  // CONSTANTS
  var DEFAULT_SCHEDULE_FUNCTION;
  var DEFAULT_EASING = 'linear';
  var DEFAULT_DURATION = 500;
  var UPDATE_TIME = 1000 / 60;

  var _now = Date.now
       ? Date.now
       : function () {return +new Date();};

  var now = SHIFTY_DEBUG_NOW
       ? SHIFTY_DEBUG_NOW
       : _now;

  if (typeof window !== 'undefined') {
    // requestAnimationFrame() shim by Paul Irish (modified for Shifty)
    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    DEFAULT_SCHEDULE_FUNCTION = window.requestAnimationFrame
       || window.webkitRequestAnimationFrame
       || window.oRequestAnimationFrame
       || window.msRequestAnimationFrame
       || (window.mozCancelRequestAnimationFrame
       && window.mozRequestAnimationFrame)
       || setTimeout;
  } else {
    DEFAULT_SCHEDULE_FUNCTION = setTimeout;
  }

  function noop () {
    // NOOP!
  }

  /*!
   * Handy shortcut for doing a for-in loop. This is not a "normal" each
   * function, it is optimized for Shifty.  The iterator function only receives
   * the property name, not the value.
   * @param {Object} obj
   * @param {Function(string)} fn
   */
  function each (obj, fn) {
    var key;
    for (key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        fn(key);
      }
    }
  }

  /*!
   * Perform a shallow copy of Object properties.
   * @param {Object} targetObject The object to copy into
   * @param {Object} srcObject The object to copy from
   * @return {Object} A reference to the augmented `targetObj` Object
   */
  function shallowCopy (targetObj, srcObj) {
    each(srcObj, function (prop) {
      targetObj[prop] = srcObj[prop];
    });

    return targetObj;
  }

  /*!
   * Copies each property from src onto target, but only if the property to
   * copy to target is undefined.
   * @param {Object} target Missing properties in this Object are filled in
   * @param {Object} src
   */
  function defaults (target, src) {
    each(src, function (prop) {
      if (typeof target[prop] === 'undefined') {
        target[prop] = src[prop];
      }
    });
  }

  /*!
   * Calculates the interpolated tween values of an Object for a given
   * timestamp.
   * @param {Number} forPosition The position to compute the state for.
   * @param {Object} currentState Current state properties.
   * @param {Object} originalState: The original state properties the Object is
   * tweening from.
   * @param {Object} targetState: The destination state properties the Object
   * is tweening to.
   * @param {number} duration: The length of the tween in milliseconds.
   * @param {number} timestamp: The UNIX epoch time at which the tween began.
   * @param {Object} easing: This Object's keys must correspond to the keys in
   * targetState.
   */
  function tweenProps (forPosition, currentState, originalState, targetState,
    duration, timestamp, easing) {
    var normalizedPosition = (forPosition - timestamp) / duration;

    var prop;
    for (prop in currentState) {
      if (currentState.hasOwnProperty(prop)) {
        currentState[prop] = tweenProp(originalState[prop],
          targetState[prop], formula[easing[prop]], normalizedPosition);
      }
    }

    return currentState;
  }

  /*!
   * Tweens a single property.
   * @param {number} start The value that the tween started from.
   * @param {number} end The value that the tween should end at.
   * @param {Function} easingFunc The easing curve to apply to the tween.
   * @param {number} position The normalized position (between 0.0 and 1.0) to
   * calculate the midpoint of 'start' and 'end' against.
   * @return {number} The tweened value.
   */
  function tweenProp (start, end, easingFunc, position) {
    return start + (end - start) * easingFunc(position);
  }

  /*!
   * Applies a filter to Tweenable instance.
   * @param {Tweenable} tweenable The `Tweenable` instance to call the filter
   * upon.
   * @param {String} filterName The name of the filter to apply.
   */
  function applyFilter (tweenable, filterName) {
    var filters = Tweenable.prototype.filter;
    var args = tweenable._filterArgs;

    each(filters, function (name) {
      if (typeof filters[name][filterName] !== 'undefined') {
        filters[name][filterName].apply(tweenable, args);
      }
    });
  }

  var timeoutHandler_endTime;
  var timeoutHandler_currentTime;
  var timeoutHandler_isEnded;
  /*!
   * Handles the update logic for one step of a tween.
   * @param {Tweenable} tweenable
   * @param {number} timestamp
   * @param {number} duration
   * @param {Object} currentState
   * @param {Object} originalState
   * @param {Object} targetState
   * @param {Object} easing
   * @param {Function} step
   * @param {Function(Function,number)}} schedule
   */
  function timeoutHandler (tweenable, timestamp, duration, currentState,
    originalState, targetState, easing, step, schedule) {
    timeoutHandler_endTime = timestamp + duration;
    timeoutHandler_currentTime = Math.min(now(), timeoutHandler_endTime);
    timeoutHandler_isEnded = timeoutHandler_currentTime >= timeoutHandler_endTime;

    if (tweenable.isPlaying() && !timeoutHandler_isEnded) {
      schedule(tweenable._timeoutHandler, UPDATE_TIME);

      applyFilter(tweenable, 'beforeTween');
      tweenProps(timeoutHandler_currentTime, currentState, originalState,
        targetState, duration, timestamp, easing);
      applyFilter(tweenable, 'afterTween');

      step(currentState);
    } else if (timeoutHandler_isEnded) {
      step(targetState);
      tweenable.stop(true);
    }
  }


  /*!
   * Creates a usable easing Object from either a string or another easing
   * Object.  If `easing` is an Object, then this function clones it and fills
   * in the missing properties with "linear".
   * @param {Object} fromTweenParams
   * @param {Object|string} easing
   */
  function composeEasingObject (fromTweenParams, easing) {
    var composedEasing = {};

    if (typeof easing === 'string') {
      each(fromTweenParams, function (prop) {
        composedEasing[prop] = easing;
      });
    } else {
      each(fromTweenParams, function (prop) {
        if (!composedEasing[prop]) {
          composedEasing[prop] = easing[prop] || DEFAULT_EASING;
        }
      });
    }

    return composedEasing;
  }

  /**
   * Tweenable constructor.
   * @param {Object=} opt_initialState The values that the initial tween should start at if a "from" object is not provided to Tweenable#tween.
   * @param {Object=} opt_config See Tweenable.prototype.setConfig()
   * @constructor
   */
  function Tweenable (opt_initialState, opt_config) {
    this._currentState = opt_initialState || {};
    this._configured = false;
    this._scheduleFunction = DEFAULT_SCHEDULE_FUNCTION;

    // To prevent unnecessary calls to setConfig do not set default configuration here.
    // Only set default configuration immediately before tweening if none has been set.
    if (typeof opt_config !== 'undefined') {
      this.setConfig(opt_config);
    }
  }

  /**
   * Configure and start a tween.
   * @param {Object=} opt_config See Tweenable.prototype.setConfig()
   * @return {Tweenable}
   */
  Tweenable.prototype.tween = function (opt_config) {
    if (this._isTweening) {
      return this;
    }

    // Only set default config if no configuration has been set previously and none is provided now.
    if (opt_config !== undefined || !this._configured) {
      this.setConfig(opt_config);
    }

    this._start(this.get());
    return this.resume();
  };

  /**
   * Sets the tween configuration. `config` may have the following options:
   *
   * - __from__ (_Object=_): Starting position.  If omitted, the current state is used.
   * - __to__ (_Object=_): Ending position.
   * - __duration__ (_number=_): How many milliseconds to animate for.
   * - __start__ (_Function(Object)=_): Function to execute when the tween begins.  Receives the state of the tween as the only parameter.
   * - __step__ (_Function(Object)=_): Function to execute on every tick.  Receives the state of the tween as the only parameter.  This function is not called on the final step of the animation, but `finish` is.
   * - __finish__ (_Function(Object)=_): Function to execute upon tween completion.  Receives the state of the tween as the only parameter.
   * - __easing__ (_Object|string=_): Easing curve name(s) to use for the tween.
   * @param {Object} config
   * @return {Tweenable}
   */
  Tweenable.prototype.setConfig = function (config) {
    config = config || {};
    this._configured = true;

    // Init the internal state
    this._pausedAtTime = null;
    this._start = config.start || noop;
    this._step = config.step || noop;
    this._finish = config.finish || noop;
    this._duration = config.duration || DEFAULT_DURATION;
    this._currentState = config.from || this.get();
    this._originalState = this.get();
    this._targetState = config.to || this.get();
    this._timestamp = now();

    // Aliases used below
    var currentState = this._currentState;
    var targetState = this._targetState;

    // Ensure that there is always something to tween to.
    defaults(targetState, currentState);

    this._easing = composeEasingObject(
      currentState, config.easing || DEFAULT_EASING);

    this._filterArgs =
      [currentState, this._originalState, targetState, this._easing];

    applyFilter(this, 'tweenCreated');
    return this;
  };

  /**
   * Gets the current state.
   * @return {Object}
   */
  Tweenable.prototype.get = function () {
    return shallowCopy({}, this._currentState);
  };

  /**
   * Sets the current state.
   * @param {Object} state
   */
  Tweenable.prototype.set = function (state) {
    this._currentState = state;
  };

  /**
   * Pauses a tween.  Paused tweens can be resumed from the point at which they were paused.  This is different than [`stop()`](#stop), as that method causes a tween to start over when it is resumed.
   * @return {Tweenable}
   */
  Tweenable.prototype.pause = function () {
    this._pausedAtTime = now();
    this._isPaused = true;
    return this;
  };

  /**
   * Resumes a paused tween.
   * @return {Tweenable}
   */
  Tweenable.prototype.resume = function () {
    if (this._isPaused) {
      this._timestamp += now() - this._pausedAtTime;
    }

    this._isPaused = false;
    this._isTweening = true;

    var self = this;
    this._timeoutHandler = function () {
      timeoutHandler(self, self._timestamp, self._duration, self._currentState,
        self._originalState, self._targetState, self._easing, self._step,
        self._scheduleFunction);
    };

    this._timeoutHandler();

    return this;
  };

  /**
   * Stops and cancels a tween.
   * @param {boolean=} gotoEnd If false or omitted, the tween just stops at its current state, and the "finish" handler is not invoked.  If true, the tweened object's values are instantly set to the target values, and "finish" is invoked.
   * @return {Tweenable}
   */
  Tweenable.prototype.stop = function (gotoEnd) {
    this._isTweening = false;
    this._isPaused = false;
    this._timeoutHandler = noop;

    if (gotoEnd) {
      shallowCopy(this._currentState, this._targetState);
      applyFilter(this, 'afterTweenEnd');
      this._finish.call(this, this._currentState);
    }

    return this;
  };

  /**
   * Returns whether or not a tween is running.
   * @return {boolean}
   */
  Tweenable.prototype.isPlaying = function () {
    return this._isTweening && !this._isPaused;
  };

  /**
   * Sets a custom schedule function.
   *
   * If a custom function is not set the default one is used [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame) if available, otherwise [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/Window.setTimeout)).
   *
   * @param {Function(Function,number)} scheduleFunction The function to be called to schedule the next frame to be rendered
   */
  Tweenable.prototype.setScheduleFunction = function (scheduleFunction) {
    this._scheduleFunction = scheduleFunction;
  };

  /**
   * `delete`s all "own" properties.  Call this when the `Tweenable` instance is no longer needed to free memory.
   */
  Tweenable.prototype.dispose = function () {
    var prop;
    for (prop in this) {
      if (this.hasOwnProperty(prop)) {
        delete this[prop];
      }
    }
  };

  /*!
   * Filters are used for transforming the properties of a tween at various
   * points in a Tweenable's life cycle.  See the README for more info on this.
   */
  Tweenable.prototype.filter = {};

  /*!
   * This object contains all of the tweens available to Shifty.  It is extendible - simply attach properties to the Tweenable.prototype.formula Object following the same format at linear.
   *
   * `pos` should be a normalized `number` (between 0 and 1).
   */
  Tweenable.prototype.formula = {
    linear: function (pos) {
      return pos;
    }
  };

  formula = Tweenable.prototype.formula;

  shallowCopy(Tweenable, {
    'now': now
    ,'each': each
    ,'tweenProps': tweenProps
    ,'tweenProp': tweenProp
    ,'applyFilter': applyFilter
    ,'shallowCopy': shallowCopy
    ,'defaults': defaults
    ,'composeEasingObject': composeEasingObject
  });

  // `root` is provided in the intro/outro files.

  // A hook used for unit testing.
  if (typeof SHIFTY_DEBUG_NOW === 'function') {
    root.timeoutHandler = timeoutHandler;
  }

  // Bootstrap Tweenable appropriately for the environment.
  if (typeof exports === 'object') {
    // CommonJS
    module.exports = Tweenable;
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(function () {return Tweenable;});
  } else if (typeof root.Tweenable === 'undefined') {
    // Browser: Make `Tweenable` globally accessible.
    root.Tweenable = Tweenable;
  }

  return Tweenable;

} ());

/*!
 * All equations are adapted from Thomas Fuchs' [Scripty2](https://github.com/madrobby/scripty2/blob/master/src/effects/transitions/penner.js).
 *
 * Based on Easing Equations (c) 2003 [Robert Penner](http://www.robertpenner.com/), all rights reserved. This work is [subject to terms](http://www.robertpenner.com/easing_terms_of_use.html).
 */

/*!
 *  TERMS OF USE - EASING EQUATIONS
 *  Open source under the BSD License.
 *  Easing Equations (c) 2003 Robert Penner, all rights reserved.
 */

;(function () {

  Tweenable.shallowCopy(Tweenable.prototype.formula, {
    easeInQuad: function (pos) {
      return Math.pow(pos, 2);
    },

    easeOutQuad: function (pos) {
      return -(Math.pow((pos - 1), 2) - 1);
    },

    easeInOutQuad: function (pos) {
      if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(pos,2);}
      return -0.5 * ((pos -= 2) * pos - 2);
    },

    easeInCubic: function (pos) {
      return Math.pow(pos, 3);
    },

    easeOutCubic: function (pos) {
      return (Math.pow((pos - 1), 3) + 1);
    },

    easeInOutCubic: function (pos) {
      if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(pos,3);}
      return 0.5 * (Math.pow((pos - 2),3) + 2);
    },

    easeInQuart: function (pos) {
      return Math.pow(pos, 4);
    },

    easeOutQuart: function (pos) {
      return -(Math.pow((pos - 1), 4) - 1);
    },

    easeInOutQuart: function (pos) {
      if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(pos,4);}
      return -0.5 * ((pos -= 2) * Math.pow(pos,3) - 2);
    },

    easeInQuint: function (pos) {
      return Math.pow(pos, 5);
    },

    easeOutQuint: function (pos) {
      return (Math.pow((pos - 1), 5) + 1);
    },

    easeInOutQuint: function (pos) {
      if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(pos,5);}
      return 0.5 * (Math.pow((pos - 2),5) + 2);
    },

    easeInSine: function (pos) {
      return -Math.cos(pos * (Math.PI / 2)) + 1;
    },

    easeOutSine: function (pos) {
      return Math.sin(pos * (Math.PI / 2));
    },

    easeInOutSine: function (pos) {
      return (-0.5 * (Math.cos(Math.PI * pos) - 1));
    },

    easeInExpo: function (pos) {
      return (pos === 0) ? 0 : Math.pow(2, 10 * (pos - 1));
    },

    easeOutExpo: function (pos) {
      return (pos === 1) ? 1 : -Math.pow(2, -10 * pos) + 1;
    },

    easeInOutExpo: function (pos) {
      if (pos === 0) {return 0;}
      if (pos === 1) {return 1;}
      if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(2,10 * (pos - 1));}
      return 0.5 * (-Math.pow(2, -10 * --pos) + 2);
    },

    easeInCirc: function (pos) {
      return -(Math.sqrt(1 - (pos * pos)) - 1);
    },

    easeOutCirc: function (pos) {
      return Math.sqrt(1 - Math.pow((pos - 1), 2));
    },

    easeInOutCirc: function (pos) {
      if ((pos /= 0.5) < 1) {return -0.5 * (Math.sqrt(1 - pos * pos) - 1);}
      return 0.5 * (Math.sqrt(1 - (pos -= 2) * pos) + 1);
    },

    easeOutBounce: function (pos) {
      if ((pos) < (1 / 2.75)) {
        return (7.5625 * pos * pos);
      } else if (pos < (2 / 2.75)) {
        return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
      } else if (pos < (2.5 / 2.75)) {
        return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
      } else {
        return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
      }
    },

    easeInBack: function (pos) {
      var s = 1.70158;
      return (pos) * pos * ((s + 1) * pos - s);
    },

    easeOutBack: function (pos) {
      var s = 1.70158;
      return (pos = pos - 1) * pos * ((s + 1) * pos + s) + 1;
    },

    easeInOutBack: function (pos) {
      var s = 1.70158;
      if ((pos /= 0.5) < 1) {return 0.5 * (pos * pos * (((s *= (1.525)) + 1) * pos - s));}
      return 0.5 * ((pos -= 2) * pos * (((s *= (1.525)) + 1) * pos + s) + 2);
    },

    elastic: function (pos) {
      return -1 * Math.pow(4,-8 * pos) * Math.sin((pos * 6 - 1) * (2 * Math.PI) / 2) + 1;
    },

    swingFromTo: function (pos) {
      var s = 1.70158;
      return ((pos /= 0.5) < 1) ? 0.5 * (pos * pos * (((s *= (1.525)) + 1) * pos - s)) :
          0.5 * ((pos -= 2) * pos * (((s *= (1.525)) + 1) * pos + s) + 2);
    },

    swingFrom: function (pos) {
      var s = 1.70158;
      return pos * pos * ((s + 1) * pos - s);
    },

    swingTo: function (pos) {
      var s = 1.70158;
      return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
    },

    bounce: function (pos) {
      if (pos < (1 / 2.75)) {
        return (7.5625 * pos * pos);
      } else if (pos < (2 / 2.75)) {
        return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
      } else if (pos < (2.5 / 2.75)) {
        return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
      } else {
        return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
      }
    },

    bouncePast: function (pos) {
      if (pos < (1 / 2.75)) {
        return (7.5625 * pos * pos);
      } else if (pos < (2 / 2.75)) {
        return 2 - (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
      } else if (pos < (2.5 / 2.75)) {
        return 2 - (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
      } else {
        return 2 - (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
      }
    },

    easeFromTo: function (pos) {
      if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(pos,4);}
      return -0.5 * ((pos -= 2) * Math.pow(pos,3) - 2);
    },

    easeFrom: function (pos) {
      return Math.pow(pos,4);
    },

    easeTo: function (pos) {
      return Math.pow(pos,0.25);
    }
  });

}());

/*!
 * The Bezier magic in this file is adapted/copied almost wholesale from
 * [Scripty2](https://github.com/madrobby/scripty2/blob/master/src/effects/transitions/cubic-bezier.js),
 * which was adapted from Apple code (which probably came from
 * [here](http://opensource.apple.com/source/WebCore/WebCore-955.66/platform/graphics/UnitBezier.h)).
 * Special thanks to Apple and Thomas Fuchs for much of this code.
 */

/*!
 *  Copyright (c) 2006 Apple Computer, Inc. All rights reserved.
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions are met:
 *
 *  1. Redistributions of source code must retain the above copyright notice,
 *  this list of conditions and the following disclaimer.
 *
 *  2. Redistributions in binary form must reproduce the above copyright notice,
 *  this list of conditions and the following disclaimer in the documentation
 *  and/or other materials provided with the distribution.
 *
 *  3. Neither the name of the copyright holder(s) nor the names of any
 *  contributors may be used to endorse or promote products derived from
 *  this software without specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *  "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 *  THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 *  ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
 *  FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 *  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 *  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 *  ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 *  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
;(function () {
  // port of webkit cubic bezier handling by http://www.netzgesta.de/dev/
  function cubicBezierAtTime(t,p1x,p1y,p2x,p2y,duration) {
    var ax = 0,bx = 0,cx = 0,ay = 0,by = 0,cy = 0;
    function sampleCurveX(t) {return ((ax * t + bx) * t + cx) * t;}
    function sampleCurveY(t) {return ((ay * t + by) * t + cy) * t;}
    function sampleCurveDerivativeX(t) {return (3.0 * ax * t + 2.0 * bx) * t + cx;}
    function solveEpsilon(duration) {return 1.0 / (200.0 * duration);}
    function solve(x,epsilon) {return sampleCurveY(solveCurveX(x,epsilon));}
    function fabs(n) {if (n >= 0) {return n;}else {return 0 - n;}}
    function solveCurveX(x,epsilon) {
      var t0,t1,t2,x2,d2,i;
      for (t2 = x, i = 0; i < 8; i++) {x2 = sampleCurveX(t2) - x; if (fabs(x2) < epsilon) {return t2;} d2 = sampleCurveDerivativeX(t2); if (fabs(d2) < 1e-6) {break;} t2 = t2 - x2 / d2;}
      t0 = 0.0; t1 = 1.0; t2 = x; if (t2 < t0) {return t0;} if (t2 > t1) {return t1;}
      while (t0 < t1) {x2 = sampleCurveX(t2); if (fabs(x2 - x) < epsilon) {return t2;} if (x > x2) {t0 = t2;}else {t1 = t2;} t2 = (t1 - t0) * 0.5 + t0;}
      return t2; // Failure.
    }
    cx = 3.0 * p1x; bx = 3.0 * (p2x - p1x) - cx; ax = 1.0 - cx - bx; cy = 3.0 * p1y; by = 3.0 * (p2y - p1y) - cy; ay = 1.0 - cy - by;
    return solve(t, solveEpsilon(duration));
  }
  /*!
   *  getCubicBezierTransition(x1, y1, x2, y2) -> Function
   *
   *  Generates a transition easing function that is compatible
   *  with WebKit's CSS transitions `-webkit-transition-timing-function`
   *  CSS property.
   *
   *  The W3C has more information about
   *  <a href="http://www.w3.org/TR/css3-transitions/#transition-timing-function_tag">
   *  CSS3 transition timing functions</a>.
   *
   *  @param {number} x1
   *  @param {number} y1
   *  @param {number} x2
   *  @param {number} y2
   *  @return {function}
   */
  function getCubicBezierTransition (x1, y1, x2, y2) {
    return function (pos) {
      return cubicBezierAtTime(pos,x1,y1,x2,y2,1);
    };
  }
  // End ported code

  /**
   * Creates a Bezier easing function and attaches it to `Tweenable.prototype.formula`.  This function gives you total control over the easing curve.  Matthew Lein's [Ceaser](http://matthewlein.com/ceaser/) is a useful tool for visualizing the curves you can make with this function.
   *
   * @param {string} name The name of the easing curve.  Overwrites the old easing function on Tweenable.prototype.formula if it exists.
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @return {function} The easing function that was attached to Tweenable.prototype.formula.
   */
  Tweenable.setBezierFunction = function (name, x1, y1, x2, y2) {
    var cubicBezierTransition = getCubicBezierTransition(x1, y1, x2, y2);
    cubicBezierTransition.x1 = x1;
    cubicBezierTransition.y1 = y1;
    cubicBezierTransition.x2 = x2;
    cubicBezierTransition.y2 = y2;

    return Tweenable.prototype.formula[name] = cubicBezierTransition;
  };


  /**
   * `delete`s an easing function from `Tweenable.prototype.formula`.  Be careful with this method, as it `delete`s whatever easing formula matches `name` (which means you can delete default Shifty easing functions).
   *
   * @param {string} name The name of the easing function to delete.
   * @return {function}
   */
  Tweenable.unsetBezierFunction = function (name) {
    delete Tweenable.prototype.formula[name];
  };

})();

;(function () {

  function getInterpolatedValues (
    from, current, targetState, position, easing) {
    return Tweenable.tweenProps(
      position, current, from, targetState, 1, 0, easing);
  }

  // Fake a Tweenable and patch some internals.  This approach allows us to
  // skip uneccessary processing and object recreation, cutting down on garbage
  // collection pauses.
  var mockTweenable = new Tweenable();
  mockTweenable._filterArgs = [];

  /**
   * Compute the midpoint of two Objects.  This method effectively calculates a specific frame of animation that [Tweenable#tween](shifty.core.js.html#tween) does many times over the course of a tween.
   *
   * Example:
   *
   * ```
   *  var interpolatedValues = Tweenable.interpolate({
   *    width: '100px',
   *    opacity: 0,
   *    color: '#fff'
   *  }, {
   *    width: '200px',
   *    opacity: 1,
   *    color: '#000'
   *  }, 0.5);
   *
   *  console.log(interpolatedValues);
   *  // {opacity: 0.5, width: "150px", color: "rgb(127,127,127)"}
   * ```
   *
   * @param {Object} from The starting values to tween from.
   * @param {Object} targetState The ending values to tween to.
   * @param {number} position The normalized position value (between 0.0 and 1.0) to interpolate the values between `from` and `to` for.  `from` represents 0 and `to` represents `1`.
   * @param {string|Object} easing The easing curve(s) to calculate the midpoint against.  You can reference any easing function attached to `Tweenable.prototype.formula`.  If omitted, this defaults to "linear".
   * @return {Object}
   */
  Tweenable.interpolate = function (from, targetState, position, easing) {
    var current = Tweenable.shallowCopy({}, from);
    var easingObject = Tweenable.composeEasingObject(
      from, easing || 'linear');

    mockTweenable.set({});

    // Alias and reuse the _filterArgs array instead of recreating it.
    var filterArgs = mockTweenable._filterArgs;
    filterArgs.length = 0;
    filterArgs[0] = current;
    filterArgs[1] = from;
    filterArgs[2] = targetState;
    filterArgs[3] = easingObject;

    // Any defined value transformation must be applied
    Tweenable.applyFilter(mockTweenable, 'tweenCreated');
    Tweenable.applyFilter(mockTweenable, 'beforeTween');

    var interpolatedValues = getInterpolatedValues(
      from, current, targetState, position, easingObject);

    // Transform values back into their original format
    Tweenable.applyFilter(mockTweenable, 'afterTween');

    return interpolatedValues;
  };

}());

/**
 * Adds string interpolation support to Shifty.
 *
 * The Token extension allows Shifty to tween numbers inside of strings.  Among other things, this allows you to animate CSS properties.  For example, you can do this:
 *
 * ```
 * var tweenable = new Tweenable();
 * tweenable.tween({
 *   from: { transform: 'translateX(45px)'},
 *   to: { transform: 'translateX(90xp)'}
 * });
 * ```
 *
 * `translateX(45)` will be tweened to `translateX(90)`.  To demonstrate:
 *
 * ```
 * var tweenable = new Tweenable();
 * tweenable.tween({
 *   from: { transform: 'translateX(45px)'},
 *   to: { transform: 'translateX(90px)'},
 *   step: function (state) {
 *     console.log(state.transform);
 *   }
 * });
 * ```
 *
 * The above snippet will log something like this in the console:
 *
 * ```
 * translateX(60.3px)
 * ...
 * translateX(76.05px)
 * ...
 * translateX(90px)
 * ```
 *
 * Another use for this is animating colors:
 *
 * ```
 * var tweenable = new Tweenable();
 * tweenable.tween({
 *   from: { color: 'rgb(0,255,0)'},
 *   to: { color: 'rgb(255,0,255)'},
 *   step: function (state) {
 *     console.log(state.color);
 *   }
 * });
 * ```
 *
 * The above snippet will log something like this:
 *
 * ```
 * rgb(84,170,84)
 * ...
 * rgb(170,84,170)
 * ...
 * rgb(255,0,255)
 * ```
 *
 * This extension also supports hexadecimal colors, in both long (`#ff00ff`) and short (`#f0f`) forms.  Be aware that hexadecimal input values will be converted into the equivalent RGB output values.  This is done to optimize for performance.
 *
 * ```
 * var tweenable = new Tweenable();
 * tweenable.tween({
 *   from: { color: '#0f0'},
 *   to: { color: '#f0f'},
 *   step: function (state) {
 *     console.log(state.color);
 *   }
 * });
 * ```
 *
 * This snippet will generate the same output as the one before it because equivalent values were supplied (just in hexadecimal form rather than RGB):
 *
 * ```
 * rgb(84,170,84)
 * ...
 * rgb(170,84,170)
 * ...
 * rgb(255,0,255)
 * ```
 *
 * ## Easing support
 *
 * Easing works somewhat differently in the Token extension.  This is because some CSS properties have multiple values in them, and you might need to tween each value along its own easing curve.  A basic example:
 *
 * ```
 * var tweenable = new Tweenable();
 * tweenable.tween({
 *   from: { transform: 'translateX(0px) translateY(0px)'},
 *   to: { transform:   'translateX(100px) translateY(100px)'},
 *   easing: { transform: 'easeInQuad' },
 *   step: function (state) {
 *     console.log(state.transform);
 *   }
 * });
 * ```
 *
 * The above snippet create values like this:
 *
 * ```
 * translateX(11.560000000000002px) translateY(11.560000000000002px)
 * ...
 * translateX(46.24000000000001px) translateY(46.24000000000001px)
 * ...
 * translateX(100px) translateY(100px)
 * ```
 *
 * In this case, the values for `translateX` and `translateY` are always the same for each step of the tween, because they have the same start and end points and both use the same easing curve.  We can also tween `translateX` and `translateY` along independent curves:
 *
 * ```
 * var tweenable = new Tweenable();
 * tweenable.tween({
 *   from: { transform: 'translateX(0px) translateY(0px)'},
 *   to: { transform:   'translateX(100px) translateY(100px)'},
 *   easing: { transform: 'easeInQuad bounce' },
 *   step: function (state) {
 *     console.log(state.transform);
 *   }
 * });
 * ```
 *
 * The above snippet create values like this:
 *
 * ```
 * translateX(10.89px) translateY(82.355625px)
 * ...
 * translateX(44.89000000000001px) translateY(86.73062500000002px)
 * ...
 * translateX(100px) translateY(100px)
 * ```
 *
 * `translateX` and `translateY` are not in sync anymore, because `easeInQuad` was specified for `translateX` and `bounce` for `translateY`.  Mixing and matching easing curves can make for some interesting motion in your animations.
 *
 * The order of the space-separated easing curves correspond the token values they apply to.  If there are more token values than easing curves listed, the last easing curve listed is used.
 */
function token () {
  // Functionality for this extension runs implicitly if it is loaded.
} /*!*/

// token function is defined above only so that dox-foundation sees it as
// documentation and renders it.  It is never used, and is optimized away at
// build time.

;(function (Tweenable) {

  /*!
   * @typedef {{
   *   formatString: string
   *   chunkNames: Array.<string>
   * }}
   */
  var formatManifest;

  // CONSTANTS

  var R_FORMAT_CHUNKS = /([^\-0-9\.]+)/g;
  var R_UNFORMATTED_VALUES = /[0-9.\-]+/g;
  var R_RGB = new RegExp(
    'rgb\\(' + R_UNFORMATTED_VALUES.source +
    (/,\s*/.source) + R_UNFORMATTED_VALUES.source +
    (/,\s*/.source) + R_UNFORMATTED_VALUES.source + '\\)', 'g');
  var R_RGB_PREFIX = /^.*\(/;
  var R_HEX = /#([0-9]|[a-f]){3,6}/gi;
  var VALUE_PLACEHOLDER = 'VAL';

  // HELPERS

  var getFormatChunksFrom_accumulator = [];
  /*!
   * @param {Array.number} rawValues
   * @param {string} prefix
   *
   * @return {Array.<string>}
   */
  function getFormatChunksFrom (rawValues, prefix) {
    getFormatChunksFrom_accumulator.length = 0;

    var rawValuesLength = rawValues.length;
    var i;

    for (i = 0; i < rawValuesLength; i++) {
      getFormatChunksFrom_accumulator.push('_' + prefix + '_' + i);
    }

    return getFormatChunksFrom_accumulator;
  }

  /*!
   * @param {string} formattedString
   *
   * @return {string}
   */
  function getFormatStringFrom (formattedString) {
    var chunks = formattedString.match(R_FORMAT_CHUNKS);

    if (!chunks) {
      // chunks will be null if there were no tokens to parse in
      // formattedString (for example, if formattedString is '2').  Coerce
      // chunks to be useful here.
      chunks = ['', ''];
    } else if (chunks.length === 1) {
      chunks.unshift('');
    }

    return chunks.join(VALUE_PLACEHOLDER);
  }

  /*!
   * Convert all hex color values within a string to an rgb string.
   *
   * @param {Object} stateObject
   *
   * @return {Object} The modified obj
   */
  function sanitizeObjectForHexProps (stateObject) {
    Tweenable.each(stateObject, function (prop) {
      var currentProp = stateObject[prop];

      if (typeof currentProp === 'string' && currentProp.match(R_HEX)) {
        stateObject[prop] = sanitizeHexChunksToRGB(currentProp);
      }
    });
  }

  /*!
   * @param {string} str
   *
   * @return {string}
   */
  function  sanitizeHexChunksToRGB (str) {
    return filterStringChunks(R_HEX, str, convertHexToRGB);
  }

  /*!
   * @param {string} hexString
   *
   * @return {string}
   */
  function convertHexToRGB (hexString) {
    var rgbArr = hexToRGBArray(hexString);
    return 'rgb(' + rgbArr[0] + ',' + rgbArr[1] + ',' + rgbArr[2] + ')';
  }

  var hexToRGBArray_returnArray = [];
  /*!
   * Convert a hexadecimal string to an array with three items, one each for
   * the red, blue, and green decimal values.
   *
   * @param {string} hex A hexadecimal string.
   *
   * @returns {Array.<number>} The converted Array of RGB values if `hex` is a
   * valid string, or an Array of three 0's.
   */
  function hexToRGBArray (hex) {

    hex = hex.replace(/#/, '');

    // If the string is a shorthand three digit hex notation, normalize it to
    // the standard six digit notation
    if (hex.length === 3) {
      hex = hex.split('');
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    hexToRGBArray_returnArray[0] = hexToDec(hex.substr(0, 2));
    hexToRGBArray_returnArray[1] = hexToDec(hex.substr(2, 2));
    hexToRGBArray_returnArray[2] = hexToDec(hex.substr(4, 2));

    return hexToRGBArray_returnArray;
  }

  /*!
   * Convert a base-16 number to base-10.
   *
   * @param {Number|String} hex The value to convert
   *
   * @returns {Number} The base-10 equivalent of `hex`.
   */
  function hexToDec (hex) {
    return parseInt(hex, 16);
  }

  /*!
   * Runs a filter operation on all chunks of a string that match a RegExp
   *
   * @param {RegExp} pattern
   * @param {string} unfilteredString
   * @param {function(string)} filter
   *
   * @return {string}
   */
  function filterStringChunks (pattern, unfilteredString, filter) {
    var pattenMatches = unfilteredString.match(pattern);
    var filteredString = unfilteredString.replace(pattern, VALUE_PLACEHOLDER);

    if (pattenMatches) {
      var pattenMatchesLength = pattenMatches.length;
      var currentChunk;

      for (var i = 0; i < pattenMatchesLength; i++) {
        currentChunk = pattenMatches.shift();
        filteredString = filteredString.replace(
          VALUE_PLACEHOLDER, filter(currentChunk));
      }
    }

    return filteredString;
  }

  /*!
   * Check for floating point values within rgb strings and rounds them.
   *
   * @param {string} formattedString
   *
   * @return {string}
   */
  function sanitizeRGBChunks (formattedString) {
    return filterStringChunks(R_RGB, formattedString, sanitizeRGBChunk);
  }

  /*!
   * @param {string} rgbChunk
   *
   * @return {string}
   */
  function sanitizeRGBChunk (rgbChunk) {
    var numbers = rgbChunk.match(R_UNFORMATTED_VALUES);
    var numbersLength = numbers.length;
    var sanitizedString = rgbChunk.match(R_RGB_PREFIX)[0];

    for (var i = 0; i < numbersLength; i++) {
      sanitizedString += parseInt(numbers[i], 10) + ',';
    }

    sanitizedString = sanitizedString.slice(0, -1) + ')';

    return sanitizedString;
  }

  /*!
   * @param {Object} stateObject
   *
   * @return {Object} An Object of formatManifests that correspond to
   * the string properties of stateObject
   */
  function getFormatManifests (stateObject) {
    var manifestAccumulator = {};

    Tweenable.each(stateObject, function (prop) {
      var currentProp = stateObject[prop];

      if (typeof currentProp === 'string') {
        var rawValues = getValuesFrom(currentProp);

        manifestAccumulator[prop] = {
          'formatString': getFormatStringFrom(currentProp)
          ,'chunkNames': getFormatChunksFrom(rawValues, prop)
        };
      }
    });

    return manifestAccumulator;
  }

  /*!
   * @param {Object} stateObject
   * @param {Object} formatManifests
   */
  function expandFormattedProperties (stateObject, formatManifests) {
    Tweenable.each(formatManifests, function (prop) {
      var currentProp = stateObject[prop];
      var rawValues = getValuesFrom(currentProp);
      var rawValuesLength = rawValues.length;

      for (var i = 0; i < rawValuesLength; i++) {
        stateObject[formatManifests[prop].chunkNames[i]] = +rawValues[i];
      }

      delete stateObject[prop];
    });
  }

  /*!
   * @param {Object} stateObject
   * @param {Object} formatManifests
   */
  function collapseFormattedProperties (stateObject, formatManifests) {
    Tweenable.each(formatManifests, function (prop) {
      var currentProp = stateObject[prop];
      var formatChunks = extractPropertyChunks(
        stateObject, formatManifests[prop].chunkNames);
      var valuesList = getValuesList(
        formatChunks, formatManifests[prop].chunkNames);
      currentProp = getFormattedValues(
        formatManifests[prop].formatString, valuesList);
      stateObject[prop] = sanitizeRGBChunks(currentProp);
    });
  }

  /*!
   * @param {Object} stateObject
   * @param {Array.<string>} chunkNames
   *
   * @return {Object} The extracted value chunks.
   */
  function extractPropertyChunks (stateObject, chunkNames) {
    var extractedValues = {};
    var currentChunkName, chunkNamesLength = chunkNames.length;

    for (var i = 0; i < chunkNamesLength; i++) {
      currentChunkName = chunkNames[i];
      extractedValues[currentChunkName] = stateObject[currentChunkName];
      delete stateObject[currentChunkName];
    }

    return extractedValues;
  }

  var getValuesList_accumulator = [];
  /*!
   * @param {Object} stateObject
   * @param {Array.<string>} chunkNames
   *
   * @return {Array.<number>}
   */
  function getValuesList (stateObject, chunkNames) {
    getValuesList_accumulator.length = 0;
    var chunkNamesLength = chunkNames.length;

    for (var i = 0; i < chunkNamesLength; i++) {
      getValuesList_accumulator.push(stateObject[chunkNames[i]]);
    }

    return getValuesList_accumulator;
  }

  /*!
   * @param {string} formatString
   * @param {Array.<number>} rawValues
   *
   * @return {string}
   */
  function getFormattedValues (formatString, rawValues) {
    var formattedValueString = formatString;
    var rawValuesLength = rawValues.length;

    for (var i = 0; i < rawValuesLength; i++) {
      formattedValueString = formattedValueString.replace(
        VALUE_PLACEHOLDER, +rawValues[i].toFixed(4));
    }

    return formattedValueString;
  }

  /*!
   * Note: It's the duty of the caller to convert the Array elements of the
   * return value into numbers.  This is a performance optimization.
   *
   * @param {string} formattedString
   *
   * @return {Array.<string>|null}
   */
  function getValuesFrom (formattedString) {
    return formattedString.match(R_UNFORMATTED_VALUES);
  }

  /*!
   * @param {Object} easingObject
   * @param {Object} tokenData
   */
  function expandEasingObject (easingObject, tokenData) {
    Tweenable.each(tokenData, function (prop) {
      var currentProp = tokenData[prop];
      var chunkNames = currentProp.chunkNames;
      var chunkLength = chunkNames.length;
      var easingChunks = easingObject[prop].split(' ');
      var lastEasingChunk = easingChunks[easingChunks.length - 1];

      for (var i = 0; i < chunkLength; i++) {
        easingObject[chunkNames[i]] = easingChunks[i] || lastEasingChunk;
      }

      delete easingObject[prop];
    });
  }

  /*!
   * @param {Object} easingObject
   * @param {Object} tokenData
   */
  function collapseEasingObject (easingObject, tokenData) {
    Tweenable.each(tokenData, function (prop) {
      var currentProp = tokenData[prop];
      var chunkNames = currentProp.chunkNames;
      var chunkLength = chunkNames.length;
      var composedEasingString = '';

      for (var i = 0; i < chunkLength; i++) {
        composedEasingString += ' ' + easingObject[chunkNames[i]];
        delete easingObject[chunkNames[i]];
      }

      easingObject[prop] = composedEasingString.substr(1);
    });
  }

  Tweenable.prototype.filter.token = {
    'tweenCreated': function (currentState, fromState, toState, easingObject) {
      sanitizeObjectForHexProps(currentState);
      sanitizeObjectForHexProps(fromState);
      sanitizeObjectForHexProps(toState);
      this._tokenData = getFormatManifests(currentState);
    },

    'beforeTween': function (currentState, fromState, toState, easingObject) {
      expandEasingObject(easingObject, this._tokenData);
      expandFormattedProperties(currentState, this._tokenData);
      expandFormattedProperties(fromState, this._tokenData);
      expandFormattedProperties(toState, this._tokenData);
    },

    'afterTween': function (currentState, fromState, toState, easingObject) {
      collapseFormattedProperties(currentState, this._tokenData);
      collapseFormattedProperties(fromState, this._tokenData);
      collapseFormattedProperties(toState, this._tokenData);
      collapseEasingObject(easingObject, this._tokenData);
    }
  };

} (Tweenable));

}(this));

},{}]},{},["/Applications/XAMPP/xamppfiles/htdocs/spjam/src/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vc3JjL0JlZ2luLmpzIiwiL0FwcGxpY2F0aW9ucy9YQU1QUC94YW1wcGZpbGVzL2h0ZG9jcy9zcGphbS9zcmMvR2FtZS5qcyIsIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vc3JjL0dhbWVJbnB1dC5qcyIsIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vc3JjL0dhbWVPdmVyLmpzIiwiL0FwcGxpY2F0aW9ucy9YQU1QUC94YW1wcGZpbGVzL2h0ZG9jcy9zcGphbS9zcmMvTGV2ZWwuanMiLCIvQXBwbGljYXRpb25zL1hBTVBQL3hhbXBwZmlsZXMvaHRkb2NzL3NwamFtL3NyYy9MZXZlbEVuZC5qcyIsIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vc3JjL0xpZ2h0LmpzIiwiL0FwcGxpY2F0aW9ucy9YQU1QUC94YW1wcGZpbGVzL2h0ZG9jcy9zcGphbS9zcmMvUGh5c2ljcy5qcyIsIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vc3JjL1BsYXllci5qcyIsIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vc3JjL1ByZWxvYWRlci5qcyIsIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vc3JjL1Jlc291cmNlcy5qcyIsIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vc3JjL1Rvb2xzLmpzIiwiL0FwcGxpY2F0aW9ucy9YQU1QUC94YW1wcGZpbGVzL2h0ZG9jcy9zcGphbS9zcmMvYmVoYXZpb3JzL0VuZEJlaGF2aW9yLmpzIiwiL0FwcGxpY2F0aW9ucy9YQU1QUC94YW1wcGZpbGVzL2h0ZG9jcy9zcGphbS9zcmMvYmVoYXZpb3JzL0VuZENhckJlaGF2aW9yLmpzIiwiL0FwcGxpY2F0aW9ucy9YQU1QUC94YW1wcGZpbGVzL2h0ZG9jcy9zcGphbS9zcmMvYmVoYXZpb3JzL0xpZ2h0QmVoYXZpb3IuanMiLCIvQXBwbGljYXRpb25zL1hBTVBQL3hhbXBwZmlsZXMvaHRkb2NzL3NwamFtL3NyYy9iZWhhdmlvcnMvUGxhdGZvcm1CZWhhdmlvci5qcyIsIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vc3JjL2JlaGF2aW9ycy9Td2l0Y2hCZWhhdmlvci5qcyIsIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vc3JjL2NvbXBvbmVudHMvUGFydGljbGVTeXN0ZW0uanMiLCIvQXBwbGljYXRpb25zL1hBTVBQL3hhbXBwZmlsZXMvaHRkb2NzL3NwamFtL3NyYy9nYW1lLmpzIiwiL0FwcGxpY2F0aW9ucy9YQU1QUC94YW1wcGZpbGVzL2h0ZG9jcy9zcGphbS9zcmMvbWFpbi5qcyIsIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vc3JjL3ZlbmRvci9FdmVudEVtaXR0ZXIyLmpzIiwiL0FwcGxpY2F0aW9ucy9YQU1QUC94YW1wcGZpbGVzL2h0ZG9jcy9zcGphbS9zcmMvdmVuZG9yL3NoaWZ0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1aEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNWhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3akJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFBhcnRpY2xlU3lzdGVtID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL1BhcnRpY2xlU3lzdGVtLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gQmVnaW4oZ2FtZSkge1xuICB3aW5kb3cuZ2FtZSA9IGdhbWU7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgdmlldyA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcbiAgdmFyIG92ZXJsYXAgPSBudWxsO1xuICB2YXIgY2FyID0gbnVsbDtcbiAgdmFyIGxvZ28gPSBudWxsO1xuICB2YXIgbG9nb0RhcmsgPSBudWxsO1xuICB2YXIgYnRuU3RhcnQgPSBudWxsO1xuICB2YXIgcGFydGljbGVzID0gbnVsbDtcbiAgdmFyIGNvdW50ID0gMDtcblxuICB0aGlzLnZpZXcgPSB2aWV3O1xuICB0aGlzLnNob3cgPSBzaG93O1xuICB0aGlzLmhpZGUgPSBoaWRlO1xuICB0aGlzLnVwZGF0ZSA9IHVwZGF0ZTtcblxuICBpbml0KCk7XG5cbiAgZnVuY3Rpb24gaW5pdCgpXG4gIHtcbiAgICB2aWV3LnZpc2libGUgPSBmYWxzZTtcbiAgICBnYW1lLnN0YWdlLmFkZENoaWxkKHZpZXcpO1xuXG4gICAgdmFyIGJnID0gUElYSS5TcHJpdGUuZnJvbUZyYW1lKFwiU2NlbmFyaW8ucG5nXCIpO1xuICAgIHZpZXcuYWRkQ2hpbGQoYmcpO1xuXG4gICAgbG9nb0RhcmsgPSBQSVhJLlNwcml0ZS5mcm9tRnJhbWUoXCJEYXJrTGlnaHRMb2dvLnBuZ1wiKTtcbiAgICB2aWV3LmFkZENoaWxkKGxvZ29EYXJrKTtcbiAgICBsb2dvRGFyay5hbHBoYSA9IDAuNTtcbiAgICBsb2dvRGFyay5hbmNob3IueCA9IDAuNTtcbiAgICBsb2dvRGFyay5hbmNob3IueSA9IDAuNTtcbiAgICBsb2dvRGFyay5wb3NpdGlvbi54ID0gc2NyZWVuV2lkdGgvMjtcbiAgICBsb2dvRGFyay5wb3NpdGlvbi55ID0gc2NyZWVuSGVpZ2h0LzI7XG5cbiAgICB2YXIgZ3VhcmRyYWlsRGFyayA9IFBJWEkuU3ByaXRlLmZyb21GcmFtZShcIkd1YXJkUmFpbC5wbmdcIik7XG4gICAgdmlldy5hZGRDaGlsZChndWFyZHJhaWxEYXJrKTtcbiAgICBndWFyZHJhaWxEYXJrLnBvc2l0aW9uLnkgPSA1NTA7XG4gICAgZ3VhcmRyYWlsRGFyay5hbHBoYSA9IDAuNTtcblxuICAgIHZhciBmcm9udCA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcbiAgICB2aWV3LmFkZENoaWxkKGZyb250KTtcblxuICAgIHZhciBmb3Jlc3QgPSBQSVhJLlNwcml0ZS5mcm9tRnJhbWUoXCJGb3Jlc3RMaWdodC5wbmdcIik7XG4gICAgZnJvbnQuYWRkQ2hpbGQoZm9yZXN0KTtcbiAgICBmb3Jlc3QucG9zaXRpb24ueSA9IDEwMjtcblxuICAgIGxvZ28gPSBQSVhJLlNwcml0ZS5mcm9tRnJhbWUoXCJEYXJrTGlnaHRMb2dvLnBuZ1wiKTtcbiAgICBmcm9udC5hZGRDaGlsZChsb2dvKTtcbiAgICBsb2dvLmFuY2hvci54ID0gMC41O1xuICAgIGxvZ28uYW5jaG9yLnkgPSAwLjU7XG4gICAgbG9nby5wb3NpdGlvbi54ID0gbG9nb0RhcmsucG9zaXRpb24ueDtcbiAgICBsb2dvLnBvc2l0aW9uLnkgPSBsb2dvRGFyay5wb3NpdGlvbi55O1xuXG4gICAgdmFyIGd1YXJkcmFpbCA9IFBJWEkuU3ByaXRlLmZyb21GcmFtZShcIkd1YXJkUmFpbC5wbmdcIik7XG4gICAgZnJvbnQuYWRkQ2hpbGQoZ3VhcmRyYWlsKTtcbiAgICBndWFyZHJhaWwucG9zaXRpb24ueSA9IGd1YXJkcmFpbERhcmsucG9zaXRpb24ueTtcblxuICAgIG92ZXJsYXAgPSBjcmVhdGVPdmVybGFwKCk7XG4gICAgdmlldy5hZGRDaGlsZChvdmVybGFwKTtcbiAgICBvdmVybGFwLnBvc2l0aW9uLnggPSBzY3JlZW5XaWR0aCAtIDEwMDtcbiAgICBvdmVybGFwLnBvc2l0aW9uLnkgPSAtMTAwO1xuXG4gICAgZnJvbnQubWFzayA9IG92ZXJsYXA7XG5cbiAgICBidG5TdGFydCA9IFBJWEkuU3ByaXRlLmZyb21GcmFtZShcIlN0YXJ0LnBuZ1wiKTtcbiAgICBidG5TdGFydC5hbmNob3IueCA9IDAuNTtcbiAgICBidG5TdGFydC5hbmNob3IueSA9IDAuNTtcbiAgICBidG5TdGFydC5zZXRJbnRlcmFjdGl2ZSh0cnVlKTtcbiAgICBidG5TdGFydC5jbGljayA9IHN0YXJ0R2FtZTtcbiAgICB2aWV3LmFkZENoaWxkKGJ0blN0YXJ0KTtcbiAgICBidG5TdGFydC5wb3NpdGlvbi54ID0gc2NyZWVuV2lkdGgvMjtcbiAgICBidG5TdGFydC5wb3NpdGlvbi55ID0gc2NyZWVuSGVpZ2h0LzIgKyAxMzA7XG5cbiAgICBjYXIgPSBQSVhJLlNwcml0ZS5mcm9tRnJhbWUoXCJDYXIucG5nXCIpO1xuICAgIHZpZXcuYWRkQ2hpbGQoY2FyKTtcbiAgICBjYXIucG9zaXRpb24ueCA9IC0zMDAwO1xuICAgIGNhci5wb3NpdGlvbi55ID0gZ3VhcmRyYWlsRGFyay5wb3NpdGlvbi55IC0gNzU7XG4gICAgY2FyLnBhc3NlZCA9IGZhbHNlO1xuXG4gICAgcGFydGljbGVzID0gbmV3IFBhcnRpY2xlU3lzdGVtKFxuICAgIHtcbiAgICAgICAgXCJpbWFnZXNcIjpbXCJzbW9rZS5wbmdcIl0sXG4gICAgICAgIFwibnVtUGFydGljbGVzXCI6NTAwLFxuICAgICAgICBcImVtaXNzaW9uc1BlclVwZGF0ZVwiOjMsXG4gICAgICAgIFwiZW1pc3Npb25zSW50ZXJ2YWxcIjoxLFxuICAgICAgICBcImFscGhhXCI6MSxcbiAgICAgICAgXCJwcm9wZXJ0aWVzXCI6XG4gICAgICAgIHtcbiAgICAgICAgICBcInJhbmRvbVNwYXduWFwiOjIwLFxuICAgICAgICAgIFwicmFuZG9tU3Bhd25ZXCI6MyxcbiAgICAgICAgICBcImxpZmVcIjoyMCxcbiAgICAgICAgICBcInJhbmRvbUxpZmVcIjoxMDAsXG4gICAgICAgICAgXCJmb3JjZVhcIjowLFxuICAgICAgICAgIFwiZm9yY2VZXCI6LTAuMDEsXG4gICAgICAgICAgXCJyYW5kb21Gb3JjZVhcIjowLjAxLFxuICAgICAgICAgIFwicmFuZG9tRm9yY2VZXCI6MC4wMSxcbiAgICAgICAgICBcInZlbG9jaXR5WFwiOjAsXG4gICAgICAgICAgXCJ2ZWxvY2l0eVlcIjowLFxuICAgICAgICAgIFwicmFuZG9tVmVsb2NpdHlYXCI6MC4xLFxuICAgICAgICAgIFwicmFuZG9tVmVsb2NpdHlZXCI6MC4xLFxuICAgICAgICAgIFwic2NhbGVcIjoxLFxuICAgICAgICAgIFwiZ3Jvd3RoXCI6MC4xLFxuICAgICAgICAgIFwicmFuZG9tU2NhbGVcIjowLjUsXG4gICAgICAgICAgXCJhbHBoYVN0YXJ0XCI6MCxcbiAgICAgICAgICBcImFscGhhRmluaXNoXCI6MCxcbiAgICAgICAgICBcImFscGhhUmF0aW9cIjowLjIsXG4gICAgICAgICAgXCJ0b3JxdWVcIjowLFxuICAgICAgICAgIFwicmFuZG9tVG9ycXVlXCI6MFxuICAgICAgICB9XG4gICAgfSk7XG4gICAgdmlldy5hZGRDaGlsZChwYXJ0aWNsZXMudmlldyk7XG4gICAgcGFydGljbGVzLnZpZXcuYWxwaGEgPSAwLjI1O1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlT3ZlcmxhcCgpXG4gIHtcbiAgICB2YXIgbnVtU2hhZnRzID0gODtcbiAgICB2YXIgb3BlblJhdGUgPSAwLjI7XG4gICAgdmFyIHJhZGl1cyA9IDIwMDA7XG4gICAgdmFyIGdyYXBoID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcblxuICAgIGdyYXBoLmJlZ2luRmlsbCgweEZGRkZGRik7XG4gICAgZ3JhcGgubW92ZVRvKDAsIDApO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1TaGFmdHM7IGkrKylcbiAgICB7XG4gICAgICB2YXIgYSA9IE1hdGguUEkqMi9udW1TaGFmdHMqaTtcbiAgICAgIGdyYXBoLmxpbmVUbyhNYXRoLmNvcyhhIC0gb3BlblJhdGUpKnJhZGl1cywgTWF0aC5zaW4oYSAtIG9wZW5SYXRlKSpyYWRpdXMpO1xuICAgICAgZ3JhcGgubGluZVRvKE1hdGguY29zKGEgKyBvcGVuUmF0ZSkqcmFkaXVzLCBNYXRoLnNpbihhICsgb3BlblJhdGUpKnJhZGl1cyk7XG4gICAgICBncmFwaC5saW5lVG8oMCwgMCk7XG4gICAgfVxuXG4gICAgZ3JhcGguZW5kRmlsbCgpO1xuICAgIHJldHVybiBncmFwaDtcblxuICB9XG5cbiAgZnVuY3Rpb24gc2hvdygpXG4gIHtcbiAgICB2aWV3LnZpc2libGUgPSB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gaGlkZSgpXG4gIHtcbiAgICB2aWV3LnZpc2libGUgPSBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZSgpXG4gIHtcbiAgICBpZiAoIXZpZXcudmlzaWJsZSkgcmV0dXJuO1xuICAgIG92ZXJsYXAucm90YXRpb24gKz0gMC4wMDE7XG4gICAgY2FyLnBvc2l0aW9uLnggKz0gMjA7XG4gICAgY2FyLnNjYWxlLnggPSAxO1xuICAgIGlmIChjYXIucG9zaXRpb24ueCA+IDcwMDApIHtcbiAgICAgIGNhci5wb3NpdGlvbi54ID0gLTMwMDA7XG4gICAgICBjYXIucGFzc2VkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGNhci5wYXNzZWQgPT09IGZhbHNlICYmIGNhci5wb3NpdGlvbi54ID4gLTE0MDApIHtcbiAgICAgIGNhci5wYXNzZWQgPSB0cnVlO1xuICAgICAgZ2FtZS5yZXNvdXJjZXMuY2FyUGFzcy5wbGF5KCk7XG4gICAgfVxuXG4gICAgcGFydGljbGVzLnByb3BlcnRpZXMuY2VudGVyWCA9IGNhci5wb3NpdGlvbi54O1xuICAgIHBhcnRpY2xlcy5wcm9wZXJ0aWVzLmNlbnRlclkgPSBjYXIucG9zaXRpb24ueSArIDEwMDtcbiAgICBwYXJ0aWNsZXMudXBkYXRlKCk7XG5cbiAgICBsb2dvLnNjYWxlLnggPSAwLjk5ICsgTWF0aC5zaW4oY291bnQpKjAuMDI7XG4gICAgbG9nby5zY2FsZS55ID0gMC45OSArIE1hdGguY29zKGNvdW50KjAuMykqMC4wMjtcblxuICAgIGxvZ29EYXJrLnNjYWxlLnggPSAwLjk5ICsgTWF0aC5jb3MoY291bnQpKjAuMDI7XG4gICAgbG9nb0Rhcmsuc2NhbGUueSA9IDAuOTkgKyBNYXRoLnNpbihjb3VudCowLjMpKjAuMDI7XG5cbiAgICBidG5TdGFydC5hbHBoYSA9IDAuNzUgKyBNYXRoLmNvcyhjb3VudCoxNSkqMC4yNTtcblxuICAgIGNvdW50ICs9IDAuMDE7XG4gIH1cblxuICBmdW5jdGlvbiBzdGFydEdhbWUoKVxuICB7XG4gICAgZ2FtZS5yZXNvdXJjZXMuYnV0dG9uQ2xpY2sucGxheSgpXG4gICAgaGlkZSgpO1xuICAgIGdhbWUubG9hZExldmVsKDEpO1xuICB9XG59O1xuIiwidmFyIFJlc291cmNlcyA9IHJlcXVpcmUoJy4vUmVzb3VyY2VzJyksXG4gIFByZWxvYWRlciA9IHJlcXVpcmUoJy4vUHJlbG9hZGVyJyksXG4gIExldmVsID0gcmVxdWlyZSgnLi9MZXZlbCcpLFxuICBCZWdpbiA9IHJlcXVpcmUoJy4vQmVnaW4nKSxcbiAgTGV2ZWxFbmQgPSByZXF1aXJlKCcuL0xldmVsRW5kJyksXG4gIEdhbWVPdmVyID0gcmVxdWlyZSgnLi9HYW1lT3ZlcicpLFxuICBMaWdodCA9IHJlcXVpcmUoJy4vTGlnaHQnKSxcbiAgVHdlZW5hYmxlID0gcmVxdWlyZSgnLi92ZW5kb3Ivc2hpZnR5JyksXG4gIEdhbWVJbnB1dCA9IHJlcXVpcmUoJy4vR2FtZUlucHV0LmpzJyksXG4gIFBsYXllciA9IHJlcXVpcmUoJy4vUGxheWVyLmpzJyk7XG4gIFBoeXNpY3MgPSByZXF1aXJlKCcuL1BoeXNpY3MuanMnKTtcbiAgVG9vbHMgPSByZXF1aXJlKCcuL1Rvb2xzLmpzJyk7XG5cbndpbmRvdy5Ud2VlbmFibGUgPSBUd2VlbmFibGU7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gR2FtZSgpIHtcbiAgdGhpcy5yZXNvdXJjZXMgPSBuZXcgUmVzb3VyY2VzKCk7XG5cbiAgLy8gc3RhZ2UuY2xpY2sgPSBmdW5jdGlvbihlKSB7XG4gIC8vICAgbGlnaHQueCA9IGUub3JpZ2luYWxFdmVudC54O1xuICAvLyAgIGxpZ2h0LnkgPSBlLm9yaWdpbmFsRXZlbnQueTtcbiAgLy8gfVxuXG4gIHdpbmRvdy5zY3JlZW5XaWR0aCA9ICh0eXBlb2YoZWplY3RhKT09XCJ1bmRlZmluZWRcIikgPyA5NjAgOiA0ODA7XG4gIHdpbmRvdy5zY3JlZW5IZWlnaHQgPSAodHlwZW9mKGVqZWN0YSk9PVwidW5kZWZpbmVkXCIpID8gNjQwIDogMzIwO1xuXG4gIHRoaXMucmVuZGVyZXIgPSBuZXcgUElYSS5DYW52YXNSZW5kZXJlcihzY3JlZW5XaWR0aCwgc2NyZWVuSGVpZ2h0LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyksIGZhbHNlIC8qIHRyYW5zcGFyZW50ICovLCBmYWxzZSAvKiBhbnRpYWxpYXMgKi8pO1xuICB0aGlzLnJlbmRlcmVyLnZpZXcuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgdGhpcy5yZW5kZXJlci52aWV3LnN0eWxlLmJvcmRlciA9IFwiMXB4IHNvbGlkXCI7XG5cbiAgdGhpcy5zdGFnZSA9IG5ldyBQSVhJLlN0YWdlKDB4MDBmZmZhLCB0cnVlKTtcblxuICAvLy8vSW5wdXRcbiAgdmFyIGlucHV0ID0gbnVsbDtcblxuICAvLy8vL1BsYXllclxuICB2YXIgcGxheWVyID0gbnVsbDtcbiAgdmFyIHBoeXNpY3MgPSBudWxsO1xuICB2YXIgZGlyZWN0aW9uID0gMDtcbiAgdmFyIGdsb3cgPSBudWxsO1xuXG4gIC8vIExldmVsSW5kZXhcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgbGV2ZWwgPSBudWxsO1xuICB2YXIgbG9zdCA9IGZhbHNlO1xuICB2YXIgZ2FtZVJ1bm5pbmcgPSBmYWxzZTtcbiAgd2luZG93LmxpZ2h0ID0gbmV3IExpZ2h0KDUwLCA1MCk7XG5cbiAgc2VsZi5sZXZlbCA9IGxldmVsO1xuXG4gIHZhciBsYXN0TW91c2VDbGljayA9IDAsXG4gICAgICBtb3VzZUNsaWNrSW50ZXJ2YWwgPSAxMDAwOyAvLyAxIHNlY29uZCB0byBjbGljayBhZ2FpblxuXG4gIHRoaXMucmVuZGVyZXIudmlldy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAvLyBwcmV2ZW50IGNsaWNrIG9uIGZpcnN0IGxldmVsXG4gICAgLy8gaWYgKCFzZWxmLmxldmVsKSB7IHJldHVybjsgfVxuXG4gICAgdmFyIGNsaWNrVGltZSA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG5cbiAgICBpZiAobGFzdE1vdXNlQ2xpY2sgKyBtb3VzZUNsaWNrSW50ZXJ2YWwgPj0gY2xpY2tUaW1lKSB7XG4gICAgICAvLyBkaXNzYWxsb3dlZFxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxhc3RNb3VzZUNsaWNrID0gY2xpY2tUaW1lO1xuXG4gICAgLy8gbGlnaHQucG9zaXRpb24ueCA9IGUub2Zmc2V0WDtcbiAgICAvLyBsaWdodC5wb3NpdGlvbi55ID0gZS5vZmZzZXRZO1xuXG4gICAgaWYgKHNlbGYuYnRuU291bmRPbi52aXNpYmxlID09PSB0cnVlKSB7XG4gICAgICBpZiAoZS5vZmZzZXRYID49IHNlbGYuYnRuU291bmRPbi54ICYmIGUub2Zmc2V0WCA8IHNlbGYuYnRuU291bmRPbi54ICsgc2VsZi5idG5Tb3VuZE9uLndpZHRoXG4gICAgICAgICYmIGUub2Zmc2V0WSA+PSBzZWxmLmJ0blNvdW5kT24ueSAmJiBlLm9mZnNldFkgPCBzZWxmLmJ0blNvdW5kT24ueSArIHNlbGYuYnRuU291bmRPbi5oZWlnaHQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzZWxmLmJ0blNvdW5kT2ZmLnZpc2libGUgPT09IHRydWUpIHtcbiAgICAgIGlmIChlLm9mZnNldFggPj0gc2VsZi5idG5Tb3VuZE9mZi54ICYmIGUub2Zmc2V0WCA8IHNlbGYuYnRuU291bmRPZmYueCArIHNlbGYuYnRuU291bmRPZmYud2lkdGhcbiAgICAgICAgJiYgZS5vZmZzZXRZID49IHNlbGYuYnRuU291bmRPZmYueSAmJiBlLm9mZnNldFkgPCBzZWxmLmJ0blNvdW5kT2ZmLnkgKyBzZWxmLmJ0blNvdW5kT2ZmLmhlaWdodCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNlbGYuYnRuUmVzdGFydC52aXNpYmxlID09PSB0cnVlKSB7XG4gICAgICBpZiAoZS5vZmZzZXRYID49IHNlbGYuYnRuUmVzdGFydC54ICYmIGUub2Zmc2V0WCA8IHNlbGYuYnRuUmVzdGFydC54ICsgc2VsZi5idG5SZXN0YXJ0LndpZHRoXG4gICAgICAgICYmIGUub2Zmc2V0WSA+PSBzZWxmLmJ0blJlc3RhcnQueSAmJiBlLm9mZnNldFkgPCBzZWxmLmJ0blJlc3RhcnQueSArIHNlbGYuYnRuUmVzdGFydC5oZWlnaHQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzZWxmLmxldmVsICE9PSBudWxsKSB7XG4gICAgICBnYW1lLnJlc291cmNlcy5tb3RoZXJTb3VuZC5wbGF5KCk7XG4gICAgfVxuXG4gICAgdmFyIGRlc3QgPSB7IHg6ZS5vZmZzZXRYLCB5OmUub2Zmc2V0WSB9O1xuICAgIHZhciB0d2VlbmFibGUgPSBuZXcgVHdlZW5hYmxlKCk7XG4gICAgdHdlZW5hYmxlLnR3ZWVuKHtcbiAgICAgIGZyb206IGxpZ2h0LnBvc2l0aW9uLFxuICAgICAgdG86ICAgZGVzdCxcbiAgICAgIGR1cmF0aW9uOiBtb3VzZUNsaWNrSW50ZXJ2YWwsXG4gICAgICBlYXNpbmc6ICdlYXNlT3V0Q3ViaWMnLFxuICAgICAgc3RhcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbW92aW5nID0gdHJ1ZTtcbiAgICAgIH0sXG4gICAgICBmaW5pc2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbW92aW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pXG5cbiAgdmFyIGxpZ2h0R3JhcGhpY3MgPSBuZXcgUElYSS5HcmFwaGljcygpLFxuICBsaWdodENvbnRhaW5lciA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcblxuICB0aGlzLnJlc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZygnR2FtZS5qcyAtIHRoaXMucmVzdGFydCgpJyk7XG4gICAgdmFyIGkgPSBzZWxmLmxldmVsLmluZGV4O1xuICAgIHNlbGYubGV2ZWwuZGlzcG9zZSgpO1xuICAgIHRoaXMubG9hZExldmVsKGkpO1xuICB9XG5cbiAgdGhpcy5uZXh0TGV2ZWwgPSBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZygnR2FtZS5qcyAtIHRoaXMubmV4dExldmVsKCknKTtcbiAgICB0aGlzLmxvYWRMZXZlbCh0aGlzLmxldmVsLmluZGV4ICsgMSk7XG4gIH1cblxuICB0aGlzLnNldExldmVsID0gZnVuY3Rpb24obGV2ZWxEYXRhLCBsZXZlbEluZGV4KSB7XG4gICAgdmFyIGggPSBzZWxmLnJlbmRlcmVyLmhlaWdodCArIDgwLFxuICAgICAgICB3ID0gc2VsZi5yZW5kZXJlci53aWR0aCxcbiAgICAgICAgZnJhbWVCb3JkZXIgPSA1MDtcblxuICAgIHZhciBuZXdMZXZlbCA9IG5ldyBMZXZlbChzZWxmLCBsZXZlbEluZGV4KTtcblxuICAgIC8vIGFkZCBzdGFnZSBib3JkZXIgdG8gbGV2ZWwgc2VnbWVudHNcbiAgICBuZXdMZXZlbC5zZWdtZW50cy51bnNoaWZ0KCB7YTp7eDotZnJhbWVCb3JkZXIseTotZnJhbWVCb3JkZXJ9LCBiOnt4OncseTotZnJhbWVCb3JkZXJ9fSApO1xuICAgIG5ld0xldmVsLnNlZ21lbnRzLnVuc2hpZnQoIHthOnt4OncseTotZnJhbWVCb3JkZXJ9LCBiOnt4OncseTpofX0gKTtcbiAgICBuZXdMZXZlbC5zZWdtZW50cy51bnNoaWZ0KCB7YTp7eDp3LHk6aH0sIGI6e3g6LWZyYW1lQm9yZGVyLHk6aH19ICk7XG4gICAgbmV3TGV2ZWwuc2VnbWVudHMudW5zaGlmdCgge2E6e3g6LWZyYW1lQm9yZGVyLHk6aH0sIGI6e3g6LWZyYW1lQm9yZGVyLHk6LWZyYW1lQm9yZGVyfX0gKTtcblxuICAgIG5ld0xldmVsLnBhcnNlKGxldmVsRGF0YSk7XG5cbiAgICBzZWxmLmxldmVsID0gbmV3TGV2ZWw7XG4gICAgc2VsZi5zdGFnZS5hZGRDaGlsZEF0KHNlbGYubGV2ZWwudmlldywgMCk7XG5cbiAgICBsaWdodC5zZXRTZWdtZW50cyhuZXdMZXZlbC5zZWdtZW50cyk7XG5cbiAgICAvLyBhZGQgbGV2ZWwgY29udGFpbmVyIHRvIHN0YWdlLlxuICAgIGdhbWUuc3RhZ2UuYWRkQ2hpbGQobmV3TGV2ZWwuY29udGFpbmVyKTtcblxuICAgIC8vIHJlLWNyZWF0ZSB0aGUgcGxheWVyXG4gICAgcGxheWVyID0gbmV3IFBsYXllcihuZXdMZXZlbC5jb250YWluZXIsIG5ld0xldmVsLnBsYXllclBvcy54LG5ld0xldmVsLnBsYXllclBvcy55KTtcbiAgICBwaHlzaWNzLnBsYXllclBvc2l0aW9uLnggPSBwbGF5ZXIudmlldy5wb3NpdGlvbi54O1xuICAgIHBoeXNpY3MucGxheWVyUG9zaXRpb24ueSA9IHBsYXllci52aWV3LnBvc2l0aW9uLnk7XG5cbiAgICBjb25zb2xlLmxvZyhuZXdMZXZlbC5wbGF5ZXJQb3MueCArIFwiIFwiICsgbmV3TGV2ZWwucGxheWVyUG9zLnkpO1xuICAgIHNlbGYucGxheWVyID0gcGxheWVyO1xuXG4gICAgc2VsZi5sb29wKCk7XG4gICAgc2VsZi5zdGFnZS5hZGRDaGlsZChnbG93KTtcbiAgfTtcblxuICB0aGlzLmxvYWRMZXZlbCA9IGZ1bmN0aW9uKGxldmVsSW5kZXgpIHtcbiAgICBpZighaW5wdXQpXG4gICAge1xuICAgICAgaW5wdXQgPSBuZXcgR2FtZUlucHV0KCk7XG4gICAgICBzZWxmLmlucHV0ID0gaW5wdXQ7XG4gICAgfVxuXG4gICAgaWYgKCFwaHlzaWNzKXtcbiAgICAgIHBoeXNpY3MgPSBuZXcgUGh5c2ljcygpO1xuICAgIH1cblxuICAgIC8vIGxldmVsSW5kZXggPSAyO1xuICAgIGNvbnNvbGUubG9nKFwibGV2ZWwvbGV2ZWxcIiArIGxldmVsSW5kZXggKyBcIi5qc29uXCIpO1xuICAgIHZhciBwaXhpTG9hZGVyID0gbmV3IFBJWEkuSnNvbkxvYWRlcihcImxldmVsL2xldmVsXCIgKyBsZXZlbEluZGV4ICsgXCIuanNvblwiKTtcbiAgICBwaXhpTG9hZGVyLm9uKCdsb2FkZWQnLCBmdW5jdGlvbihldnQpIHtcbiAgICAgIC8vZGF0YSBpcyBpbiBldnQuY29udGVudC5qc29uXG4gICAgICBjb25zb2xlLmxvZyhcImpzb24gbG9hZGVkIVwiKTtcbiAgICAgIHNlbGYuc2V0TGV2ZWwoZXZ0LmNvbnRlbnQuanNvbiwgbGV2ZWxJbmRleCk7XG4gICAgICBnYW1lUnVubmluZyA9IHRydWU7XG4gICAgICBsb3N0ID0gZmFsc2U7XG4gICAgfSk7XG5cbiAgICBwaXhpTG9hZGVyLmxvYWQoKTtcbiAgfVxuXG4gIHZhciBsYXN0TGlnaHRYLCBsYXN0TGlnaHRZO1xuXG4gIHRoaXMudXBkYXRlTGlnaHRzID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gbm90aGluZyB0byB1cGRhdGUsIHNraXBcblxuICAgIGlmIChsaWdodC5wb3NpdGlvbi54ID09IGxhc3RMaWdodFggJiYgbGlnaHQucG9zaXRpb24ueSA9PSBsYXN0TGlnaHRZKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRklYTUVcbiAgICBpZiAobGlnaHQuc2VnbWVudHMubGVuZ3RoID09IDAgfHwgIXRoaXMubGV2ZWwgfHwgdGhpcy5sZXZlbC5zZWdtZW50cy5sZW5ndGggPT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxpZ2h0R3JhcGhpY3MuY2xlYXIoKTtcblxuICAgIC8vIHJlbW92ZSBwcmV2aW91cyBhZGRlZCBsaWdodCBpdGVtc1xuICAgIGlmIChsaWdodENvbnRhaW5lci5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICBsaWdodENvbnRhaW5lci5yZW1vdmVDaGlsZHJlbigpO1xuICAgIH1cblxuICAgIC8vIFNpZ2h0IFBvbHlnb25zXG4gICAgdmFyIHBvbHlnb25zID0gbGlnaHQuZ2V0U2lnaHRQb2x5Z29ucygpO1xuXG4gICAgLy8gRFJBVyBBUyBBIEdJQU5UIFBPTFlHT05cblxuICAgIHZhciB2ZXJ0aWNlcyA9IHBvbHlnb25zWzBdO1xuICAgIHdpbmRvdy5wb2x5Z29ucyA9IHBvbHlnb25zWzBdO1xuXG4gICAgLy8gbGlnaHRHcmFwaGljcy5jbGVhcigpO1xuICAgIC8vIGxpZ2h0R3JhcGhpY3MuYmVnaW5GaWxsKDB4RkZGRkZGKTtcbiAgICAvLyBsaWdodEdyYXBoaWNzLm1vdmVUbyh2ZXJ0aWNlc1swXS54LCB2ZXJ0aWNlc1swXS55KTtcbiAgICAvLyBmb3IgKHZhciBpID0gMTsgaTx2ZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xuICAgIC8vICAgdmFyIHYgPSB2ZXJ0aWNlc1tpXTtcbiAgICAvLyAgIGxpZ2h0R3JhcGhpY3MubGluZVRvKHYueCwgdi55KTtcbiAgICAvLyB9XG4gICAgLy8gbGlnaHRHcmFwaGljcy5lbmRGaWxsKCk7XG5cbiAgICBsaWdodEdyYXBoaWNzLmNsZWFyKCk7XG4gICAgbGlnaHRHcmFwaGljcy5iZWdpbkZpbGwoMHhGRkZGRkYpO1xuICAgIGxpZ2h0R3JhcGhpY3MubW92ZVRvKHZlcnRpY2VzWzBdLngsIHZlcnRpY2VzWzBdLnkpO1xuICAgIGZvciAodmFyIGkgPSAxOyBpPHZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdiA9IHZlcnRpY2VzW2ldO1xuICAgICAgbGlnaHRHcmFwaGljcy5saW5lVG8odi54LCB2LnkpO1xuICAgIH1cbiAgICBsaWdodEdyYXBoaWNzLmVuZEZpbGwoKTtcblxuICAgIC8vIG92ZXJsYXAuYWRkQ2hpbGQobGlnaHRHcmFwaGljcyk7XG4gICAgLy8gb3ZlcmxhcFNoYXBlLm1hc2sgPSBsaWdodEdyYXBoaWNzO1xuXG4gICAgc2VsZi5sZXZlbC5iZzIubWFzayA9IGxpZ2h0R3JhcGhpY3M7XG4gICAgLy8gb3ZlcmxheS5tYXNrID0gbGlnaHRHcmFwaGljcztcblxuICAgIGxhc3RMaWdodFggPSBsaWdodC5wb3NpdGlvbi54O1xuICAgIGxhc3RMaWdodFkgPSBsaWdodC5wb3NpdGlvbi55O1xuICB9O1xuXG4gIHRoaXMudXBkYXRlID0gZnVuY3Rpb24oKSB7XG5cbiAgICBpZiAoc2VsZi5idG5SZXN0YXJ0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChzZWxmLmxldmVsID09PSBudWxsKSB7XG4gICAgICAgIHNlbGYuYnRuUmVzdGFydC52aXNpYmxlID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLmJ0blJlc3RhcnQudmlzaWJsZSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNlbGYuYmVnaW4pIHNlbGYuYmVnaW4udXBkYXRlKCk7XG4gICAgaWYgKHNlbGYuZ2FtZW92ZXIpIHNlbGYuZ2FtZW92ZXIudXBkYXRlKCk7XG5cbiAgICBpZiAoIWdhbWVSdW5uaW5nKSByZXR1cm47XG4gICAgdGhpcy51cGRhdGVMaWdodHMoKTtcblxuICAgIC8vIGNvbnNvbGUubG9nKGlucHV0ICsgXCIgXCIgKyBpbnB1dC5LZXkpO1xuICAgIGlmKCFpbnB1dClcbiAgICAgIHJldHVybjtcblxuICAgIGlmIChpbnB1dC5LZXkuaXNEb3duKGlucHV0LktleS5MRUZUKSB8fCBpbnB1dC5LZXkuaXNEb3duKGlucHV0LktleS5BKSlcbiAgICB7XG4gICAgICBkaXJlY3Rpb24gLT0gMC4wOTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaW5wdXQuS2V5LmlzRG93bihpbnB1dC5LZXkuUklHSFQpIHx8IGlucHV0LktleS5pc0Rvd24oaW5wdXQuS2V5LkQpKVxuICAgIHtcbiAgICAgIGRpcmVjdGlvbiArPSAwLjA5O1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgZGlyZWN0aW9uICo9IDAuOTtcbiAgICB9XG5cbiAgICBkaXJlY3Rpb24gPSBUb29scy5jbGFtcChkaXJlY3Rpb24sIC0xLCAxKTtcblxuICAgIGlmIChzZWxmLmxldmVsKVxuICAgIHtcbiAgICAgIGlmKHBoeXNpY3MpXG4gICAgICAgIHBoeXNpY3MucHJvY2VzcyhnYW1lLCBkaXJlY3Rpb24sIHdpbmRvdy5wb2x5Z29ucyk7XG5cbiAgICAgIGlmKHBsYXllcilcbiAgICAgICAgcGxheWVyLnVwZGF0ZShnYW1lLCBwaHlzaWNzLnBsYXllclBvc2l0aW9uLCBwaHlzaWNzLnBsYXllclZlbG9jaXR5KTtcblxuICAgICAgIHNlbGYubGV2ZWwudXBkYXRlKHNlbGYpO1xuXG4gICAgICAgaWYgKCFsb3N0ICYmIHBoeXNpY3MucGxheWVyUG9zaXRpb24ueSA+IHNjcmVlbkhlaWdodCArIDQwKSB0aGlzLmxvc2VHYW1lKCk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBsb29wQm91bmRlZCA9ICBmYWxzZSA7XG4gIHRoaXMubG9vcCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChsb29wQm91bmRlZCl7IHJldHVybjsgfVxuICAgIGxvb3BCb3VuZGVkID0gdHJ1ZTtcbiAgICByZXF1ZXN0QW5pbUZyYW1lKHNlbGYucmVuZGVyTG9vcCk7XG4gIH07XG5cbiAgdGhpcy5yZW5kZXJMb29wID0gZnVuY3Rpb24oKSB7XG4gICAgc2VsZi51cGRhdGUoKTsgLy8gbG9naWNcbiAgICBzZWxmLnJlbmRlcmVyLnJlbmRlcihzZWxmLnN0YWdlKTtcbiAgICByZXF1ZXN0QW5pbUZyYW1lKHNlbGYucmVuZGVyTG9vcCk7XG4gIH1cblxuICB0aGlzLmxvYWRQaXhpID0gZnVuY3Rpb24oKSB7XG4gICAgc2VsZi5pdGVtc0xvYWRlZCA9IDAsXG4gICAgc2VsZi5waXhpRmlsZXMgPSBzZWxmLnJlc291cmNlcy5nZXRQSVhJRmlsZXMoKSxcbiAgICBzZWxmLnNvdW5kRmlsZXMgPSBzZWxmLnJlc291cmNlcy5zb3VuZHMsXG4gICAgc2VsZi50b3RhbEl0ZW1zID0gc2VsZi5waXhpRmlsZXMubGVuZ3RoICsgc2VsZi5zb3VuZEZpbGVzLmxlbmd0aDtcbiAgICAvLyBsb2FkZXJcbiAgICBsb2FkZXIgPSBuZXcgUElYSS5Bc3NldExvYWRlcihzZWxmLnBpeGlGaWxlcyk7XG4gICAgbG9hZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ29uQ29tcGxldGUnLCBmdW5jdGlvbigpIHtcbiAgICAgIHNlbGYubG9hZFNvdW5kKCk7XG4gICAgfSk7XG4gICAgbG9hZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ29uUHJvZ3Jlc3MnLCBmdW5jdGlvbihlKSB7XG4gICAgICBzZWxmLml0ZW1zTG9hZGVkICs9IDE7XG4gICAgICBzZWxmLnByZWxvYWRlci5wcm9ncmVzcyhzZWxmLml0ZW1zTG9hZGVkLCBzZWxmLnRvdGFsSXRlbXMpO1xuICAgICAgaWYgKHR5cGVvZihlamVjdGEpIT09XCJ1bmRlZmluZWRcIikgeyByZXR1cm47IH07XG4gICAgfSk7XG5cbiAgICBsb2FkZXIubG9hZCgpO1xuICB9XG5cbiAgdGhpcy5sb2FkU291bmQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaSxcbiAgICAgIHRvdGFsID0gc2VsZi5zb3VuZEZpbGVzLmxlbmd0aCxcbiAgICAgIG9iajtcbiAgICBmb3IgKGkgPSAwOyBpIDwgdG90YWw7ICsraSkge1xuICAgICAgb2JqID0gc2VsZi5zb3VuZEZpbGVzW2ldO1xuICAgICAgICBzZWxmLnJlc291cmNlc1tvYmoubmFtZV0gPSBuZXcgSG93bCh7XG4gICAgICAgICAgdXJsczogb2JqLnVybHMsXG4gICAgICAgICAgYXV0b3BsYXk6IG9iai5hdXRvUGxheSB8fCBmYWxzZSxcbiAgICAgICAgICBsb29wOiBvYmoubG9vcCB8fCBmYWxzZSxcbiAgICAgICAgICB2b2x1bWU6IG9iai52b2x1bWUgfHwgMSxcbiAgICAgICAgICBvbmxvYWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi5pdGVtc0xvYWRlZCsrO1xuICAgICAgICAgICAgaWYgKHNlbGYuaXRlbXNMb2FkZWQgPT0gc2VsZi50b3RhbEl0ZW1zKSB7XG4gICAgICAgICAgICAgIHNlbGYubG9hZGVkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICB0aGlzLmxvYWRlZCA9IGZ1bmN0aW9uKCkge1xuICAgIHNlbGYuYmVnaW4gPSBuZXcgQmVnaW4odGhpcyk7XG4gICAgc2VsZi5sZXZlbGVuZCA9IG5ldyBMZXZlbEVuZCh0aGlzKTtcbiAgICBzZWxmLmdhbWVvdmVyID0gbmV3IEdhbWVPdmVyKHRoaXMpO1xuICAgIHNlbGYucHJlbG9hZGVyLmhpZGUoKTtcbiAgICBzZWxmLmJlZ2luLnNob3coKTtcbiAgICBnYW1lLnJlc291cmNlcy5zb3VuZExvb3AuZmFkZUluKC40LCAyMDAwKTtcblxuICAgIGdsb3cgPSBQSVhJLlNwcml0ZS5mcm9tRnJhbWUoXCJnbG93LnBuZ1wiKTtcbiAgICBnbG93LnNjYWxlLnggPSAyO1xuICAgIGdsb3cuc2NhbGUueSA9IDI7XG4gICAgc2VsZi5zdGFnZS5hZGRDaGlsZChnbG93KTtcbiAgICBnbG93LmFscGhhID0gMC42NTtcblxuICAgIHNlbGYuYnRuU291bmRPZmYgPSBQSVhJLlNwcml0ZS5mcm9tRnJhbWUoJ3NvdW5kT24ucG5nJyk7XG4gICAgc2VsZi5idG5Tb3VuZE9mZi5zZXRJbnRlcmFjdGl2ZSh0cnVlKTtcbiAgICBzZWxmLmJ0blNvdW5kT2ZmLmJ1dHRvbk1vZGUgPSB0cnVlO1xuICAgIHNlbGYuYnRuU291bmRPZmYucG9zaXRpb24ueCA9IDEwO1xuICAgIHNlbGYuYnRuU291bmRPZmYucG9zaXRpb24ueSA9IDEwO1xuXG4gICAgc2VsZi5idG5Tb3VuZE9uID0gUElYSS5TcHJpdGUuZnJvbUZyYW1lKCdzb3VuZE9mZi5wbmcnKTtcbiAgICBzZWxmLmJ0blNvdW5kT24uc2V0SW50ZXJhY3RpdmUodHJ1ZSk7XG4gICAgc2VsZi5idG5Tb3VuZE9uLmJ1dHRvbk1vZGUgPSB0cnVlO1xuICAgIHNlbGYuYnRuU291bmRPbi5wb3NpdGlvbi54ID0gc2VsZi5idG5Tb3VuZE9mZi5wb3NpdGlvbi54O1xuICAgIHNlbGYuYnRuU291bmRPbi5wb3NpdGlvbi55ID0gc2VsZi5idG5Tb3VuZE9mZi5wb3NpdGlvbi55O1xuICAgIHNlbGYuYnRuU291bmRPbi52aXNpYmxlID0gZmFsc2U7XG5cbiAgICBzZWxmLnN0YWdlLmFkZENoaWxkKGdhbWUuYnRuU291bmRPZmYpO1xuICAgIHNlbGYuc3RhZ2UuYWRkQ2hpbGQoZ2FtZS5idG5Tb3VuZE9uKTtcblxuICAgIHNlbGYuYnRuU291bmRPZmYuY2xpY2sgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBzZWxmLmJ0blNvdW5kT24udmlzaWJsZSA9IHRydWU7XG4gICAgICBzZWxmLmJ0blNvdW5kT2ZmLnZpc2libGUgPSBmYWxzZTtcbiAgICAgIEhvd2xlci5tdXRlKCk7XG4gICAgfVxuXG4gICAgc2VsZi5idG5Tb3VuZE9uLmNsaWNrID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgc2VsZi5idG5Tb3VuZE9uLnZpc2libGUgPSBmYWxzZTtcbiAgICAgIHNlbGYuYnRuU291bmRPZmYudmlzaWJsZSA9IHRydWU7XG4gICAgICBIb3dsZXIudW5tdXRlKCk7XG4gICAgfVxuXG4gICAgc2VsZi5idG5SZXN0YXJ0ID0gUElYSS5TcHJpdGUuZnJvbUZyYW1lKCdyZXN0YXJ0LnBuZycpO1xuICAgIHNlbGYuYnRuUmVzdGFydC5zZXRJbnRlcmFjdGl2ZSh0cnVlKTtcbiAgICBzZWxmLmJ0blJlc3RhcnQuYnV0dG9uTW9kZSA9IHRydWU7XG4gICAgc2VsZi5zdGFnZS5hZGRDaGlsZChnYW1lLmJ0blJlc3RhcnQpO1xuICAgIHNlbGYuYnRuUmVzdGFydC5wb3NpdGlvbi54ID0gc2VsZi5yZW5kZXJlci53aWR0aCAtIDEwIC0gc2VsZi5idG5SZXN0YXJ0LndpZHRoO1xuICAgIHNlbGYuYnRuUmVzdGFydC5wb3NpdGlvbi55ID0gMTA7XG4gICAgc2VsZi5idG5SZXN0YXJ0LnZpc2libGUgPSBmYWxzZTtcblxuICAgIHNlbGYuYnRuUmVzdGFydC5jbGljayA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHNlbGYucmVzdGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMuc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaW1nc0FyciA9IFtdLCBpO1xuICAgIGxvc3QgPSBmYWxzZTtcbiAgICAvLyBzdGFydCBzY2VuZXNcbiAgICAvLyBzZWxmLnN0YWdlLmFkZENoaWxkKGxpZ2h0R3JhcGhpY3MpO1xuXG4gICAgLy8gc3RhcnQgc2NyZWVuc1xuXG4gICAgLy8gc3RhcnQgbG9vcFxuICAgIHNlbGYubG9vcCgpO1xuXG4gICAgLy9cbiAgICBzZWxmLnByZWxvYWRlciA9IG5ldyBQcmVsb2FkZXIodGhpcyk7XG5cbiAgICAvLyBGSVhNRVxuICAgIHNlbGYubG9hZFBpeGkoKTtcbiAgfTtcblxuICB0aGlzLmxvc2VHYW1lID0gZnVuY3Rpb24oKVxuICB7XG4gICAgaWYgKGxvc3QpIHJldHVybjtcbiAgICBsb3N0ID0gdHJ1ZTtcbiAgICBnYW1lUnVubmluZyA9IGZhbHNlO1xuICAgIHNlbGYuZ2FtZW92ZXIuc2hvdygpO1xuICB9XG5cbiAgdGhpcy5nb1RvQmVnaW5uaW5nID0gZnVuY3Rpb24oKVxuICB7XG4gICAgLy8gZ2FtZS5sb2FkTGV2ZWwoMSk7XG4gICAgZ2FtZS5sZXZlbC5kaXNwb3NlKCk7XG4gICAgZ2FtZS5sZXZlbC5pbmRleCA9IDA7XG4gICAgZ2FtZS5sZXZlbCA9IG51bGw7XG5cbiAgICBzZWxmLmJlZ2luLnNob3coKTtcbiAgfVxuXG4gIHZhciBwaHJhc2UxID0gbnVsbDtcbiAgdmFyIHBocmFzZTIgPSBudWxsO1xuICB2YXIgcGhyYXNlMyA9IG51bGw7XG4gIHRoaXMuc2hvd0VuZFN0b3J5ID0gZnVuY3Rpb24oKVxuICB7XG4gICAgY29uc29sZS5sb2coXCJzaG93IGVuZCBzdG9yeVwiLCBnYW1lUnVubmluZyk7XG5cbiAgICBpZighZ2FtZVJ1bm5pbmcpXG4gICAgICByZXR1cm47XG5cbiAgICBnYW1lUnVubmluZyA9IGZhbHNlO1xuXG4gICAgcGhyYXNlMSA9IG5ldyBQSVhJLlRleHQoJ0hNTU0uLi5NWSBIRUFELi4uV0hBVCBIQVBQRU5FRD8nLCB7XG4gICAgICBmb250OiAnMjJweCBSb2traXR0JyxcbiAgICAgIGZpbGw6ICcjRkZGRkZGJyxcbiAgICAgIGFsaWduOiAnY2VudGVyJ1xuICAgIH0pO1xuXG4gICAgcGhyYXNlMiA9IG5ldyBQSVhJLlRleHQoJ01PTT8uLi5NT00/ISBOTyEhIScsIHtcbiAgICAgIGZvbnQ6ICcyMnB4IFJva2tpdHQnLFxuICAgICAgZmlsbDogJyNGRkZGRkYnLFxuICAgICAgYWxpZ246ICdjZW50ZXInXG4gICAgfSk7XG5cbiAgICBwaHJhc2UzID0gbmV3IFBJWEkuVGV4dCgnQlVULi4uV0FJVC4uLlRIQVQgTElHSFQsIElUIFdBUyBZT1U/Jywge1xuICAgICAgZm9udDogJzIycHggUm9ra2l0dCcsXG4gICAgICBmaWxsOiAnI0ZGRkZGRicsXG4gICAgICBhbGlnbjogJ2NlbnRlcidcbiAgICB9KTtcblxuICAgIHBocmFzZTEuYWxwaGEgPSAwO1xuICAgIHBocmFzZTIuYWxwaGEgPSAwO1xuICAgIHBocmFzZTMuYWxwaGEgPSAwO1xuXG4gICAgcGhyYXNlMS5wb3NpdGlvbi54ID0gKHNlbGYucmVuZGVyZXIud2lkdGggLyAyKSAtIChwaHJhc2UxLndpZHRoIC8gMik7XG4gICAgcGhyYXNlMS5wb3NpdGlvbi55ID0gc2VsZi5yZW5kZXJlci5oZWlnaHQgLyAyIC0gNjA7XG4gICAgc2VsZi5zdGFnZS5hZGRDaGlsZChwaHJhc2UxKTtcblxuICAgIHBocmFzZTIucG9zaXRpb24ueCA9IChzZWxmLnJlbmRlcmVyLndpZHRoIC8gMikgLSAocGhyYXNlMi53aWR0aCAvIDIpO1xuICAgIHBocmFzZTIucG9zaXRpb24ueSA9IHNlbGYucmVuZGVyZXIuaGVpZ2h0IC8gMiAtIDEwO1xuICAgIHNlbGYuc3RhZ2UuYWRkQ2hpbGQocGhyYXNlMik7XG5cbiAgICBwaHJhc2UzLnBvc2l0aW9uLnggPSAoc2VsZi5yZW5kZXJlci53aWR0aCAvIDIpIC0gKHBocmFzZTMud2lkdGggLyAyKTtcbiAgICBwaHJhc2UzLnBvc2l0aW9uLnkgPSBzZWxmLnJlbmRlcmVyLmhlaWdodCAvIDIgKyA0MDtcbiAgICBzZWxmLnN0YWdlLmFkZENoaWxkKHBocmFzZTMpO1xuXG5cbiAgICB2YXIgdHdlZW5hYmxlID0gbmV3IFR3ZWVuYWJsZSgpO1xuICAgIHR3ZWVuYWJsZS50d2Vlbih7XG4gICAgICBmcm9tOiB7YWxwaGE6MH0sXG4gICAgICB0bzogICB7YWxwaGE6MX0sXG4gICAgICBkdXJhdGlvbjogNTAwLFxuICAgICAgZWFzaW5nOiAnZWFzZU91dEN1YmljJyxcbiAgICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB9LFxuICAgICAgc3RlcDogZnVuY3Rpb24oc3RhdGUpe1xuICAgICAgICBwaHJhc2UxLmFscGhhID0gc3RhdGUuYWxwaGE7XG4gICAgICB9LFxuICAgICAgZmluaXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgdHdlZW5hYmxlID0gbmV3IFR3ZWVuYWJsZSgpO1xuICAgIHR3ZWVuYWJsZS50d2Vlbih7XG4gICAgICBmcm9tOiB7YWxwaGE6MH0sXG4gICAgICB0bzogICB7YWxwaGE6MX0sXG4gICAgICBkdXJhdGlvbjogNTAwLFxuICAgICAgZWFzaW5nOiAnZWFzZU91dEN1YmljJyxcbiAgICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB9LFxuICAgICAgc3RlcDogZnVuY3Rpb24oc3RhdGUpe1xuICAgICAgICBwaHJhc2UyLmFscGhhID0gc3RhdGUuYWxwaGE7XG4gICAgICB9LFxuICAgICAgZmluaXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgdHdlZW5hYmxlID0gbmV3IFR3ZWVuYWJsZSgpO1xuICAgIHR3ZWVuYWJsZS50d2Vlbih7XG4gICAgICBmcm9tOiB7YWxwaGE6MH0sXG4gICAgICB0bzogICB7YWxwaGE6MX0sXG4gICAgICBkdXJhdGlvbjogNTAwLFxuICAgICAgZWFzaW5nOiAnZWFzZU91dEN1YmljJyxcbiAgICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB9LFxuICAgICAgc3RlcDogZnVuY3Rpb24oc3RhdGUpe1xuICAgICAgICBwaHJhc2UzLmFscGhhID0gc3RhdGUuYWxwaGE7XG4gICAgICB9LFxuICAgICAgZmluaXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICB9XG4gICAgfSk7XG5cblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHNlbGYuc3RhZ2UucmVtb3ZlQ2hpbGQocGhyYXNlMSk7XG4gICAgICBzZWxmLnN0YWdlLnJlbW92ZUNoaWxkKHBocmFzZTIpO1xuICAgICAgc2VsZi5zdGFnZS5yZW1vdmVDaGlsZChwaHJhc2UzKTtcbiAgICAgIHNlbGYuZ29Ub0JlZ2lubmluZygpO1xuICAgIH0sODAwMCk7XG5cbiAgICBzZWxmLmdhbWVSdW5uaW5nID0gZmFsc2U7XG4gIH1cblxuICB0aGlzLnN0YXJ0KCk7XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIEdhbWVJbnB1dCgpIHtcblx0dmFyIEtleSA9IHtcblx0ICBfcHJlc3NlZDoge30sXG5cblx0ICBMRUZUOiAzNyxcblx0ICBVUDogMzgsXG5cdCAgUklHSFQ6IDM5LFxuXHQgIERPV046IDQwLFxuXHQgIEE6NjUsXG5cdCAgRDo2OCxcblx0ICBcblx0ICBpc0Rvd246IGZ1bmN0aW9uKGtleUNvZGUpIHtcblx0ICAgIHJldHVybiB0aGlzLl9wcmVzc2VkW2tleUNvZGVdO1xuXHQgIH0sXG5cdCAgXG5cdCAgb25LZXlkb3duOiBmdW5jdGlvbihldmVudCkge1xuXHQgICAgdGhpcy5fcHJlc3NlZFtldmVudC5rZXlDb2RlXSA9IHRydWU7XG5cdCAgfSxcblx0ICBcblx0ICBvbktleXVwOiBmdW5jdGlvbihldmVudCkge1xuXHQgICAgZGVsZXRlIHRoaXMuX3ByZXNzZWRbZXZlbnQua2V5Q29kZV07XG5cdCAgfSxcblxuXHQgIGlzRW1wdHk6IGZ1bmN0aW9uICgpIHtcbiAgICBcdFx0Zm9yKHZhciBwcm9wIGluIHRoaXMuX3ByZXNzZWQpIHtcbiAgICAgICAgXHRcdGlmKHRoaXMuX3ByZXNzZWQuaGFzT3duUHJvcGVydHkocHJvcCkpXG4gICAgICAgICAgIFx0XHRyZXR1cm4gZmFsc2U7XG4gICAgXHRcdH1cblxuICAgIFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdH07XG5cblx0dGhpcy5LZXkgPSBLZXk7XG5cblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24oZXZlbnQpIHsgS2V5Lm9uS2V5dXAoZXZlbnQpOyB9LCBmYWxzZSk7XG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24oZXZlbnQpIHsgS2V5Lm9uS2V5ZG93bihldmVudCk7IH0sIGZhbHNlKTtcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIEdhbWVPdmVyKGdhbWUpIHtcblxuICB2YXIgY29udGVudCxcbiAgICBzZWxmID0gdGhpcyxcbiAgICBiZyxcbiAgICB0ZXh0LFxuICAgIGNvdW50LFxuICAgIGRlYXRoLFxuICAgIGJ0bjtcblxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIGNvbnRlbnQgPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG4gICAgY29udGVudC52aXNpYmxlID0gZmFsc2U7XG4gICAgZ2FtZS5zdGFnZS5hZGRDaGlsZChjb250ZW50KTtcblxuICAgIGJnID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcbiAgICBiZy5iZWdpbkZpbGwoMHgwMDAwMDApO1xuICAgIGJnLmRyYXdSZWN0KDAsIDAsIHNjcmVlbldpZHRoLCBzY3JlZW5IZWlnaHQpO1xuICAgIGJnLmVuZEZpbGwoKTtcbiAgICBjb250ZW50LmFkZENoaWxkKGJnKTtcblxuICAgIGRlYXRoID0gUElYSS5TcHJpdGUuZnJvbUZyYW1lKFwiRGVhdGhTaWxodWV0Mi5wbmdcIik7XG4gICAgZGVhdGguYW5jaG9yLnggPSAwLjU7XG4gICAgZGVhdGguYW5jaG9yLnkgPSAwLjU7XG4gICAgZGVhdGguc2NhbGUueCA9IDE7XG4gICAgZGVhdGguc2NhbGUueSA9IDE7XG4gICAgY29udGVudC5hZGRDaGlsZChkZWF0aCk7XG4gICAgZGVhdGgucG9zaXRpb24ueCA9IHNjcmVlbldpZHRoLzI7XG4gICAgZGVhdGgucG9zaXRpb24ueSA9IHNjcmVlbkhlaWdodC8yO1xuICB9XG5cbiAgdGhpcy5zaG93ID0gZnVuY3Rpb24oKSB7XG4gICAgY29udGVudC52aXNpYmxlID0gdHJ1ZTtcbiAgICBiZy5hbHBoYSA9IDA7XG4gICAgZGVhdGgudmlzaWJsZSA9IGZhbHNlO1xuICAgIGRlYXRoLmFscGhhID0gMDtcbiAgICBjb3VudCA9IDA7XG4gIH1cblxuICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKClcbiAge1xuICAgIGlmICghY29udGVudC52aXNpYmxlKSByZXR1cm47XG5cbiAgICBiZy5hbHBoYSArPSAwLjAxO1xuICAgIGlmIChiZy5hbHBoYSA+IDEpIGJnLmFscGhhID0gMTtcblxuICAgIGlmIChiZy5hbHBoYSA9PSAxKVxuICAgIHtcbiAgICAgIGlmIChjb3VudCA9PSAwKSBnYW1lLnJlc291cmNlcy5zdG9ybS5wbGF5KCk7XG5cbiAgICAgIGlmIChjb3VudCUxNSA9PSAwICYmIGNvdW50IDwgODApXG4gICAgICB7XG4gICAgICAgIGRlYXRoLnZpc2libGUgPSAhZGVhdGgudmlzaWJsZTtcbiAgICAgIH1cblxuICAgICAgZGVhdGguYWxwaGEgPSAxO1xuXG4gICAgICBjb3VudCsrO1xuXG4gICAgICBpZiAoY291bnQgPj0gMTUwKSBoaWRlKCk7XG4gICAgfVxuXG5cbiAgfVxuXG4gIGZ1bmN0aW9uIGhpZGUoKSB7XG4gICAgY29udGVudC52aXNpYmxlID0gZmFsc2U7XG5cbiAgICAvLyBnYW1lLmxvYWRMZXZlbCgxKTtcbiAgICAvLyBnYW1lLmxldmVsLmRpc3Bvc2UoKTtcbiAgICAvLyBnYW1lLmxldmVsLmluZGV4ID0gMDtcbiAgICAvLyBnYW1lLmxldmVsID0gbnVsbDtcblxuICAgIGdhbWUuZ29Ub0JlZ2lubmluZygpO1xuICB9XG5cbiAgaW5pdCgpO1xuXG59O1xuIiwiXG52YXIgUGxhdGZvcm1CZWhhdmlvciA9IHJlcXVpcmUoJy4vYmVoYXZpb3JzL1BsYXRmb3JtQmVoYXZpb3IuanMnKTtcbnZhciBTd2l0Y2hCZWhhdmlvciA9IHJlcXVpcmUoJy4vYmVoYXZpb3JzL1N3aXRjaEJlaGF2aW9yLmpzJyk7XG52YXIgRW5kQmVoYXZpb3IgPSByZXF1aXJlKCcuL2JlaGF2aW9ycy9FbmRCZWhhdmlvci5qcycpO1xudmFyIExpZ2h0QmVoYXZpb3IgPSByZXF1aXJlKCcuL2JlaGF2aW9ycy9MaWdodEJlaGF2aW9yLmpzJyk7XG52YXIgRW5kQ2FyQmVoYXZpb3IgPSByZXF1aXJlKCcuL2JlaGF2aW9ycy9FbmRDYXJCZWhhdmlvci5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIExldmVsKGdhbWUsIGluZGV4KSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIG51bVN3aXRjaGVzID0gMDtcbiAgdmFyIHR1dG9yaWFsID0gbnVsbDtcbiAgdmFyIGNvdW50ID0gMDtcbiAgc2VsZi5udW1Td2l0Y2hlcyA9IG51bVN3aXRjaGVzO1xuICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gIHRoaXMuc2VnbWVudHMgPSBbXTtcbiAgdGhpcy5sZXZlbG9iamVjdHMgPSBbXTtcbiAgdGhpcy5wbGF5ZXJQb3MgPSB7fTtcbiAgdGhpcy5jb250YWluZXIgPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG5cbiAgdGhpcy52aWV3ID0gbmV3IFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lcigpO1xuXG4gIGdhbWUucmVzb3VyY2VzLmZvcmVzdFNvdW5kLnBsYXkoKTtcblxuICAvL1xuICAvLyBMZXZlbCBtZXRob2RzXG4gIC8vXG5cbiAgdGhpcy5kaXNwb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5sZXZlbG9iamVjdHMgPSBudWxsO1xuICAgIGdhbWUucmVzb3VyY2VzLmZvcmVzdFNvdW5kLnN0b3AoKTtcbiAgICBnYW1lLnN0YWdlLnJlbW92ZUNoaWxkKHNlbGYuY29udGFpbmVyKTtcbiAgICBnYW1lLnN0YWdlLnJlbW92ZUNoaWxkKHNlbGYudmlldyk7XG4gIH1cblxuICB0aGlzLnBhcnNlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHNlbGYuYmcxID0gUElYSS5TcHJpdGUuZnJvbUZyYW1lKFwiYmFja2dyb3VuZEZvcmVzdC5wbmdcIik7XG4gICAgc2VsZi52aWV3LmFkZENoaWxkKHNlbGYuYmcxKTtcblxuICAgIHNlbGYub3ZlcmxheSA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG4gICAgc2VsZi5vdmVybGF5LmJlZ2luRmlsbCgweDAwZmZmYSk7XG4gICAgc2VsZi5vdmVybGF5LmRyYXdSZWN0KDAsIDAsIHNjcmVlbldpZHRoLCBzY3JlZW5IZWlnaHQpO1xuICAgIHNlbGYub3ZlcmxheS5lbmRGaWxsKCk7XG4gICAgc2VsZi5vdmVybGF5LmFscGhhID0gMC4zO1xuICAgIHNlbGYudmlldy5hZGRDaGlsZChzZWxmLm92ZXJsYXkpO1xuXG5cbiAgICBzZWxmLmJnMiA9IFBJWEkuU3ByaXRlLmZyb21GcmFtZShcImJhY2tncm91bmRGb3Jlc3QucG5nXCIpO1xuICAgIHNlbGYudmlldy5hZGRDaGlsZChzZWxmLmJnMik7XG5cbiAgICBpZiAoaW5kZXggPT0gMSlcbiAgICB7XG4gICAgICB0dXRvcmlhbCA9IFBJWEkuU3ByaXRlLmZyb21GcmFtZShcImNvbnRyb2xzLnBuZ1wiKTtcbiAgICAgIHR1dG9yaWFsLmFuY2hvci54ID0gMC41O1xuICAgICAgdHV0b3JpYWwuYW5jaG9yLnkgPSAwLjU7XG4gICAgICBzZWxmLnZpZXcuYWRkQ2hpbGQodHV0b3JpYWwpO1xuICAgICAgdHV0b3JpYWwucG9zaXRpb24ueCA9IHNjcmVlbldpZHRoLzI7XG4gICAgICB0dXRvcmlhbC5wb3NpdGlvbi55ID0gc2NyZWVuSGVpZ2h0LzI7XG4gICAgfVxuXG4gICAgc2VsZi5zY2VuYXJpbyA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcbiAgICBzZWxmLnZpZXcuYWRkQ2hpbGQoc2VsZi5zY2VuYXJpbyk7XG5cbiAgICBzZWxmLmZvcmVncm91bmQgPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG4gICAgc2VsZi52aWV3LmFkZENoaWxkKHNlbGYuZm9yZWdyb3VuZCk7XG5cbiAgICBmb3IgKGluZGV4ID0gMDsgaW5kZXggPCBkYXRhLmxheWVyc1swXS5vYmplY3RzLmxlbmd0aDsgKytpbmRleCkge1xuXG4gICAgICAvLy8vc2VhcmNoIGZvciBwbGF5ZXIgc3RhcnQgcG9pbnRcbiAgICAgIGlmKGRhdGEubGF5ZXJzWzBdLm9iamVjdHNbaW5kZXhdLnR5cGUgPT0gXCJzdGFydFwiKVxuICAgICAge1xuICAgICAgICBzZWxmLnBsYXllclBvcyA9IHt4OmRhdGEubGF5ZXJzWzBdLm9iamVjdHNbaW5kZXhdLngsIHk6ZGF0YS5sYXllcnNbMF0ub2JqZWN0c1tpbmRleF0ueX07XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZihkYXRhLmxheWVyc1swXS5vYmplY3RzW2luZGV4XS50eXBlID09IFwiU3dpdGNoQmVoYXZpb3JcIilcbiAgICAgICAgc2VsZi5udW1Td2l0Y2hlcyArKztcblxuICAgICAgLy8vL3NldHVwIGJlaGF2aW9yXG4gICAgICB2YXIgQmVoYXZpb3VyQ2xhc3MgPSByZXF1aXJlKFwiLi9iZWhhdmlvcnMvXCIgKyBkYXRhLmxheWVyc1swXS5vYmplY3RzW2luZGV4XS50eXBlICsgXCIuanNcIik7XG5cbiAgICAgIHZhciBjID0gQmVoYXZpb3VyQ2xhc3MgPT0gTGlnaHRCZWhhdmlvciA/IHNlbGYuZm9yZWdyb3VuZCA6IHNlbGYuc2NlbmFyaW87XG5cbiAgICAgIHZhciBiZWhhdmlvciA9IG5ldyBCZWhhdmlvdXJDbGFzcyhjLCBkYXRhLmxheWVyc1swXS5vYmplY3RzW2luZGV4XSk7XG4gICAgICBzZWxmLmxldmVsb2JqZWN0cy5wdXNoKGJlaGF2aW9yKTtcblxuICAgICAgaWYoZGF0YS5sYXllcnNbMF0ub2JqZWN0c1tpbmRleF0udHlwZSA9PSBcIkxpZ2h0QmVoYXZpb3JcIikge1xuICAgICAgICBsaWdodC5iZWhhdmlvciA9IGJlaGF2aW9yO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8vL2NyZWF0ZSBzaGFkb3dcbiAgICAgIGlmKCFkYXRhLmxheWVyc1swXS5vYmplY3RzW2luZGV4XS5wcm9wZXJ0aWVzLnNoYWRvdykge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8vLy9yZXRyaXZlIHBvc2l0aW9uIGFuZCBzaXplIHNwZWNzXG4gICAgICB2YXIgc2l6ZVggPSBkYXRhLmxheWVyc1swXS5vYmplY3RzW2luZGV4XS53aWR0aDtcbiAgICAgIHZhciBzaXplWSA9IGRhdGEubGF5ZXJzWzBdLm9iamVjdHNbaW5kZXhdLmhlaWdodDtcbiAgICAgIHZhciBvcmlnaW5YID0gZGF0YS5sYXllcnNbMF0ub2JqZWN0c1tpbmRleF0ueDtcbiAgICAgIHZhciBvcmlnaW5ZID0gZGF0YS5sYXllcnNbMF0ub2JqZWN0c1tpbmRleF0ueTtcblxuICAgICAgdmFyIHNlZ21lbnRBID0ge3RhcmdldDpiZWhhdmlvci52aWV3LGE6e3g6b3JpZ2luWCx5Om9yaWdpbll9LCBiOnt4Om9yaWdpblggKyBzaXplWCx5Om9yaWdpbll9fTtcbiAgICAgIHZhciBzZWdtZW50QiA9IHt0YXJnZXQ6YmVoYXZpb3IudmlldyxhOnt4Om9yaWdpblgrc2l6ZVgseTpvcmlnaW5ZfSwgYjp7eDpvcmlnaW5YICsgc2l6ZVgseTpvcmlnaW5ZK3NpemVZfX07XG4gICAgICB2YXIgc2VnbWVudEMgPSB7dGFyZ2V0OmJlaGF2aW9yLnZpZXcsYTp7eDpvcmlnaW5YK3NpemVYLHk6b3JpZ2luWStzaXplWX0sIGI6e3g6b3JpZ2luWCx5Om9yaWdpblkgKyBzaXplWX19O1xuICAgICAgdmFyIHNlZ21lbnREID0ge3RhcmdldDpiZWhhdmlvci52aWV3LGE6e3g6b3JpZ2luWCx5Om9yaWdpblkgKyBzaXplWX0sIGI6e3g6b3JpZ2luWCx5Om9yaWdpbll9fTtcblxuICAgICAgdGhpcy5zZWdtZW50cy5wdXNoKHNlZ21lbnRBKTtcbiAgICAgIHRoaXMuc2VnbWVudHMucHVzaChzZWdtZW50Qik7XG4gICAgICB0aGlzLnNlZ21lbnRzLnB1c2goc2VnbWVudEMpO1xuICAgICAgdGhpcy5zZWdtZW50cy5wdXNoKHNlZ21lbnREKTtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhcInRvdGFsIHN3aXRjaGVzIGluIGxldmVsOiBcIiArIHNlbGYubnVtU3dpdGNoZXMpO1xuICB9XG5cblxuICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKGdhbWUpXG4gIHtcbiAgICAvLyBXSFkgR09EPyE/IT8hIVxuICAgIHRyeSB7XG5cbiAgICAgIGlmICh0dXRvcmlhbCAhPSBudWxsKVxuICAgICAgICB7XG4gICAgICAgICAgdHV0b3JpYWwuYWxwaGEgPSAwLjc1ICsgTWF0aC5zaW4oY291bnQpKjAuMjU7XG4gICAgICAgICAgY291bnQgKz0gMC4xO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNlbGYubGV2ZWxvYmplY3RzKSB7XG4gICAgICAgICAgZm9yIChpbmRleCA9IDA7IGluZGV4IDwgc2VsZi5sZXZlbG9iamVjdHMubGVuZ3RoOyArK2luZGV4KSB7XG4gICAgICAgICAgICBzZWxmLmxldmVsb2JqZWN0c1tpbmRleF0udXBkYXRlKGdhbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICB9XG4gIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIExldmVsRW5kKGdhbWUpIHtcblxuICB2YXIgY29udGVudCxcbiAgICBzZWxmID0gdGhpcyxcbiAgICBiZyxcbiAgICB0ZXh0LFxuICAgIGJ0bjtcblxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIGNvbnRlbnQgPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG4gICAgY29udGVudC52aXNpYmxlID0gZmFsc2U7XG4gICAgZ2FtZS5zdGFnZS5hZGRDaGlsZChjb250ZW50KTtcblxuICAgIGJnID0gUElYSS5TcHJpdGUuZnJvbUltYWdlKGdhbWUucmVzb3VyY2VzLmJhY2tncm91bmQpO1xuICAgIGNvbnRlbnQuYWRkQ2hpbGQoYmcpO1xuXG4gICAgdGV4dCA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZShnYW1lLnJlc291cmNlcy50ZXh0TGV2ZWxFbmQpO1xuICAgIGNvbnRlbnQuYWRkQ2hpbGQodGV4dCk7XG5cbiAgICBidG4gPSBuZXcgUElYSS5TcHJpdGUoUElYSS5UZXh0dXJlLmZyb21JbWFnZShnYW1lLnJlc291cmNlcy5idG5OZXh0KSk7XG4gICAgYnRuLmJ1dHRvbk1vZGUgPSB0cnVlO1xuICAgIGJ0bi5pbnRlcmFjdGl2ZSA9IHRydWU7XG4gICAgY29udGVudC5hZGRDaGlsZChidG4pO1xuICAgIGJ0bi5jbGljayA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGhpZGUoKTtcbiAgICAgIGdhbWUubmV4dExldmVsKCk7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFBvc2l0aW9ucygpIHtcbiAgICB0ZXh0LnBvc2l0aW9uLnggPSAoZ2FtZS5yZW5kZXJlci53aWR0aCAvIDIpIC0gKHRleHQud2lkdGggLyAyKTtcbiAgICB0ZXh0LnBvc2l0aW9uLnkgPSAoZ2FtZS5yZW5kZXJlci5oZWlnaHQgLyAzKTtcblxuICAgIGJ0bi5wb3NpdGlvbi54ID0gKGdhbWUucmVuZGVyZXIud2lkdGggLyAyKSAtIChidG4ud2lkdGggLyAyKTtcbiAgICBidG4ucG9zaXRpb24ueSA9IChnYW1lLnJlbmRlcmVyLmhlaWdodCAvIDMpICogMjtcbiAgfVxuXG4gIHRoaXMuc2hvdyA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnRlbnQudmlzaWJsZSA9IHRydWU7XG4gICAgc2V0UG9zaXRpb25zKCk7XG4gIH1cblxuICBmdW5jdGlvbiBoaWRlKCkge1xuICAgIGNvbnRlbnQudmlzaWJsZSA9IGZhbHNlO1xuICB9XG5cbiAgaW5pdCgpO1xuXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBMaWdodCh4LCB5KSB7XG4gIHRoaXMucG9zaXRpb24gPSB7eDogeCwgeTogeX07XG5cbiAgdGhpcy5zZWdtZW50cyA9IFtdO1xuICB0aGlzLmZ1enp5UmFkaXVzID0gMTA7XG5cbiAgdGhpcy5zZXRTZWdtZW50cyA9IGZ1bmN0aW9uKHNlZ21lbnRzKSB7XG4gICAgdGhpcy5zZWdtZW50cyA9IHNlZ21lbnRzO1xuICB9O1xuXG4gIHRoaXMuZ2V0U2lnaHRQb2x5Z29ucyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwb2x5Z29ucyA9IFsgbGlnaHQuZ2V0U2lnaHRQb2x5Z29uKHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55KSBdO1xuXG4gICAgZm9yKHZhciBhbmdsZT0wO2FuZ2xlPE1hdGguUEkqMjthbmdsZSs9KE1hdGguUEkqMikvMTApe1xuICAgICAgdmFyIGR4ID0gTWF0aC5jb3MoYW5nbGUpKnRoaXMuZnV6enlSYWRpdXM7XG4gICAgICB2YXIgZHkgPSBNYXRoLnNpbihhbmdsZSkqdGhpcy5mdXp6eVJhZGl1cztcbiAgICAgIHBvbHlnb25zLnB1c2godGhpcy5nZXRTaWdodFBvbHlnb24odGhpcy5wb3NpdGlvbi54K2R4LHRoaXMucG9zaXRpb24ueStkeSkpO1xuICAgIH07XG5cbiAgICByZXR1cm4gcG9seWdvbnM7XG4gIH07XG5cbiAgdGhpcy5nZXRQb2x5Z29uR3JhcGhpY3MgPSBmdW5jdGlvbihwb2x5Z29uLCBmaWxsU3R5bGUpIHtcbiAgICB2YXIgZyA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG4gICAgZy5iZWdpbkZpbGwoMHgwMDApO1xuICAgIGcubW92ZVRvKHBvbHlnb25bMF0ueCwgcG9seWdvblswXS55KTtcbiAgICBmb3IodmFyIGk9MTtpPHBvbHlnb24ubGVuZ3RoO2krKyl7XG4gICAgICB2YXIgaW50ZXJzZWN0ID0gcG9seWdvbltpXTtcbiAgICAgIGcubGluZVRvKGludGVyc2VjdC54LCBpbnRlcnNlY3QueSk7XG4gICAgfVxuICAgIGcuZW5kRmlsbCgpO1xuICAgIHJldHVybiBnO1xuICB9O1xuXG4gIHRoaXMuZ2V0SW50ZXJzZWN0aW9uID0gZnVuY3Rpb24ocmF5LCBzZWdtZW50KSB7XG4gICAgLy8gUkFZIGluIHBhcmFtZXRyaWM6IFBvaW50ICsgRGVsdGEqVDFcbiAgICB2YXIgcl9weCA9IHJheS5hLng7XG4gICAgdmFyIHJfcHkgPSByYXkuYS55O1xuICAgIHZhciByX2R4ID0gcmF5LmIueC1yYXkuYS54O1xuICAgIHZhciByX2R5ID0gcmF5LmIueS1yYXkuYS55O1xuXG4gICAgLy8gU0VHTUVOVCBpbiBwYXJhbWV0cmljOiBQb2ludCArIERlbHRhKlQyXG4gICAgdmFyIHNfcHggPSBzZWdtZW50LmEueDtcbiAgICB2YXIgc19weSA9IHNlZ21lbnQuYS55O1xuICAgIHZhciBzX2R4ID0gc2VnbWVudC5iLngtc2VnbWVudC5hLng7XG4gICAgdmFyIHNfZHkgPSBzZWdtZW50LmIueS1zZWdtZW50LmEueTtcblxuICAgIC8vIEFyZSB0aGV5IHBhcmFsbGVsPyBJZiBzbywgbm8gaW50ZXJzZWN0XG4gICAgdmFyIHJfbWFnID0gTWF0aC5zcXJ0KHJfZHgqcl9keCtyX2R5KnJfZHkpO1xuICAgIHZhciBzX21hZyA9IE1hdGguc3FydChzX2R4KnNfZHgrc19keSpzX2R5KTtcbiAgICBpZihyX2R4L3JfbWFnPT1zX2R4L3NfbWFnICYmIHJfZHkvcl9tYWc9PXNfZHkvc19tYWcpe1xuICAgICAgLy8gVW5pdCB2ZWN0b3JzIGFyZSB0aGUgc2FtZS5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIFNPTFZFIEZPUiBUMSAmIFQyXG4gICAgLy8gcl9weCtyX2R4KlQxID0gc19weCtzX2R4KlQyICYmIHJfcHkrcl9keSpUMSA9IHNfcHkrc19keSpUMlxuICAgIC8vID09PiBUMSA9IChzX3B4K3NfZHgqVDItcl9weCkvcl9keCA9IChzX3B5K3NfZHkqVDItcl9weSkvcl9keVxuICAgIC8vID09PiBzX3B4KnJfZHkgKyBzX2R4KlQyKnJfZHkgLSByX3B4KnJfZHkgPSBzX3B5KnJfZHggKyBzX2R5KlQyKnJfZHggLSByX3B5KnJfZHhcbiAgICAvLyA9PT4gVDIgPSAocl9keCooc19weS1yX3B5KSArIHJfZHkqKHJfcHgtc19weCkpLyhzX2R4KnJfZHkgLSBzX2R5KnJfZHgpXG4gICAgdmFyIFQyID0gKHJfZHgqKHNfcHktcl9weSkgKyByX2R5KihyX3B4LXNfcHgpKS8oc19keCpyX2R5IC0gc19keSpyX2R4KTtcbiAgICB2YXIgVDEgPSAoc19weCtzX2R4KlQyLXJfcHgpL3JfZHg7XG5cbiAgICAvLyBNdXN0IGJlIHdpdGhpbiBwYXJhbWV0aWMgd2hhdGV2ZXJzIGZvciBSQVkvU0VHTUVOVFxuICAgIGlmKFQxPDApIHJldHVybiBudWxsO1xuICAgIGlmKFQyPDAgfHwgVDI+MSkgcmV0dXJuIG51bGw7XG5cbiAgICAvLyBSZXR1cm4gdGhlIFBPSU5UIE9GIElOVEVSU0VDVElPTlxuICAgIHJldHVybiB7XG4gICAgICB4OiByX3B4K3JfZHgqVDEsXG4gICAgICB5OiByX3B5K3JfZHkqVDEsXG4gICAgICBwYXJhbTogVDFcbiAgICB9O1xuICB9O1xuXG4gIHRoaXMuZ2V0U2lnaHRQb2x5Z29uID0gZnVuY3Rpb24oc2lnaHRYLCBzaWdodFkpIHtcbiAgICAvLyBHZXQgYWxsIHVuaXF1ZSBwb2ludHNcbiAgICB2YXIgcG9pbnRzID0gKGZ1bmN0aW9uKHNlZ21lbnRzKXtcbiAgICAgIHZhciBhID0gW107XG4gICAgICBzZWdtZW50cy5mb3JFYWNoKGZ1bmN0aW9uKHNlZyl7XG4gICAgICAgIGEucHVzaChzZWcuYSxzZWcuYik7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBhO1xuICAgIH0pKHRoaXMuc2VnbWVudHMpO1xuXG4gICAgdmFyIHVuaXF1ZVBvaW50cyA9IChmdW5jdGlvbihwb2ludHMpe1xuICAgICAgdmFyIHNldCA9IHt9O1xuICAgICAgcmV0dXJuIHBvaW50cy5maWx0ZXIoZnVuY3Rpb24ocCl7XG4gICAgICAgIHZhciBrZXkgPSBwLngrXCIsXCIrcC55O1xuICAgICAgICBpZihrZXkgaW4gc2V0KXtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIHNldFtrZXldPXRydWU7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pKHBvaW50cyk7XG5cbiAgICAvLyBHZXQgYWxsIGFuZ2xlc1xuICAgIHZhciB1bmlxdWVBbmdsZXMgPSBbXTtcbiAgICBmb3IodmFyIGo9MDtqPHVuaXF1ZVBvaW50cy5sZW5ndGg7aisrKXtcbiAgICAgIHZhciB1bmlxdWVQb2ludCA9IHVuaXF1ZVBvaW50c1tqXTtcbiAgICAgIHZhciBhbmdsZSA9IE1hdGguYXRhbjIodW5pcXVlUG9pbnQueS1zaWdodFksdW5pcXVlUG9pbnQueC1zaWdodFgpO1xuICAgICAgdW5pcXVlUG9pbnQuYW5nbGUgPSBhbmdsZTtcbiAgICAgIHVuaXF1ZUFuZ2xlcy5wdXNoKGFuZ2xlLTAuMDAwMDEsYW5nbGUsYW5nbGUrMC4wMDAwMSk7XG4gICAgfVxuXG4gICAgLy8gUkFZUyBJTiBBTEwgRElSRUNUSU9OU1xuICAgIHZhciBpbnRlcnNlY3RzID0gW107XG4gICAgZm9yKHZhciBqPTA7ajx1bmlxdWVBbmdsZXMubGVuZ3RoO2orKyl7XG4gICAgICB2YXIgYW5nbGUgPSB1bmlxdWVBbmdsZXNbal07XG5cbiAgICAgIC8vIENhbGN1bGF0ZSBkeCAmIGR5IGZyb20gYW5nbGVcbiAgICAgIHZhciBkeCA9IE1hdGguY29zKGFuZ2xlKTtcbiAgICAgIHZhciBkeSA9IE1hdGguc2luKGFuZ2xlKTtcblxuICAgICAgLy8gUmF5IGZyb20gY2VudGVyIG9mIHNjcmVlbiB0byBtb3VzZVxuICAgICAgdmFyIHJheSA9IHtcbiAgICAgICAgYTp7eDpzaWdodFgseTpzaWdodFl9LFxuICAgICAgICBiOnt4OnNpZ2h0WCtkeCx5OnNpZ2h0WStkeX1cbiAgICAgIH07XG5cbiAgICAgIC8vIEZpbmQgQ0xPU0VTVCBpbnRlcnNlY3Rpb25cbiAgICAgIHZhciBjbG9zZXN0SW50ZXJzZWN0ID0gbnVsbDtcbiAgICAgIGZvcih2YXIgaT0wO2k8dGhpcy5zZWdtZW50cy5sZW5ndGg7aSsrKXtcbiAgICAgICAgdmFyIGludGVyc2VjdCA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uKHJheSx0aGlzLnNlZ21lbnRzW2ldKTtcbiAgICAgICAgaWYoIWludGVyc2VjdCkgY29udGludWU7XG4gICAgICAgIGlmKCFjbG9zZXN0SW50ZXJzZWN0IHx8IGludGVyc2VjdC5wYXJhbTxjbG9zZXN0SW50ZXJzZWN0LnBhcmFtKXtcbiAgICAgICAgICBjbG9zZXN0SW50ZXJzZWN0PWludGVyc2VjdDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBJbnRlcnNlY3QgYW5nbGVcbiAgICAgIGlmKCFjbG9zZXN0SW50ZXJzZWN0KSBjb250aW51ZTtcbiAgICAgIGNsb3Nlc3RJbnRlcnNlY3QuYW5nbGUgPSBhbmdsZTtcblxuICAgICAgLy8gQWRkIHRvIGxpc3Qgb2YgaW50ZXJzZWN0c1xuICAgICAgaW50ZXJzZWN0cy5wdXNoKGNsb3Nlc3RJbnRlcnNlY3QpO1xuICAgIH1cblxuICAgIC8vIFNvcnQgaW50ZXJzZWN0cyBieSBhbmdsZVxuICAgIGludGVyc2VjdHMgPSBpbnRlcnNlY3RzLnNvcnQoZnVuY3Rpb24oYSxiKXtcbiAgICAgIHJldHVybiBhLmFuZ2xlLWIuYW5nbGU7XG4gICAgfSk7XG5cbiAgICAvLyBQb2x5Z29uIGlzIGludGVyc2VjdHMsIGluIG9yZGVyIG9mIGFuZ2xlXG4gICAgcmV0dXJuIGludGVyc2VjdHM7XG4gIH1cblxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBQaHlzaWNzKClcbntcblx0dmFyIHNlbGYgPSB0aGlzO1xuXHR2YXIgcGxheWVyUG9zaXRpb24gPSB7eDowLCB5OjB9O1xuXHR2YXIgcGxheWVyVmVsb2NpdHkgPSB7eDowLCB5OjB9O1xuXHR2YXIgYXhpcyA9IHt4OjAsIHk6MH07XG5cblx0dGhpcy5wcm9jZXNzID0gcHJvY2Vzcztcblx0dGhpcy5wbGF5ZXJQb3NpdGlvbiA9IHBsYXllclBvc2l0aW9uO1xuXHR0aGlzLnBsYXllclZlbG9jaXR5ID0gcGxheWVyVmVsb2NpdHk7XG5cblx0ZnVuY3Rpb24gcHJvY2VzcyhnYW1lLCBkaXJlY3Rpb24sIHZlcnRpY2VzKVxuXHR7XG5cdFx0YXhpcy54ID0gZGlyZWN0aW9uO1xuXG5cdFx0Ly8gdmFyIHZlcnRpY2VzID0gcG9seWdvbnNbMF07XG5cdFx0dmFyIHdhbGtpbmcgPSBheGlzLnggIT0gMDtcblx0XHR2YXIgb2Zmc2V0WCA9IDIwO1xuXHRcdHZhciBvZmZzZXRZID0gMjA7XG5cdFx0dmFyIHZlbFggPSB3YWxraW5nID8gNCA6IDA7XG5cdFx0dmFyIHZlbFkgPSA2O1xuXG5cdFx0Ly8gdmFyIGxpbmVIQSA9IHt4OnBsYXllclBvc2l0aW9uLnggLSAxMDAwLCB5OnBsYXllclBvc2l0aW9uLnl9O1xuXHRcdC8vIHZhciBsaW5lSEIgPSB7eDpwbGF5ZXJQb3NpdGlvbi54ICsgMTAwMCwgeTpwbGF5ZXJQb3NpdGlvbi55fTtcblx0XHQvLyB2YXIgbGluZVZBID0ge3g6cGxheWVyUG9zaXRpb24ueCwgeTpwbGF5ZXJQb3NpdGlvbi55IC0gMTAwMH07XG5cdFx0Ly8gdmFyIGxpbmVWQiA9IHt4OnBsYXllclBvc2l0aW9uLngsIHk6cGxheWVyUG9zaXRpb24ueSArIDEwMDB9O1xuXHRcdC8vIHZhciByZXN1bHRIID0gcmF5Y2FzdChsaW5lSEEsIGxpbmVIQiwgdmVydGljZXMpO1xuXHRcdC8vIHZhciByZXN1bHRWID0gcmF5Y2FzdChsaW5lVkEsIGxpbmVWQiwgdmVydGljZXMpO1xuXHRcdC8vIHZhciBuZWFyZXN0ID0gZ2V0TmVhcmVzdEZhY2VzKHBsYXllclBvc2l0aW9uLCByZXN1bHRILmNvbmNhdChyZXN1bHRWKSk7XG5cdFx0Ly8gdmFyIGlzSW5zaWRlID0gcG9pbnRJblBvbHlnb24ocGxheWVyUG9zaXRpb24sIHZlcnRpY2VzKTtcblxuXHRcdC8vIGlmIChheGlzLnggPCAwICYmIG5lYXJlc3QubGQgLSBvZmZzZXRYIDwgdmVsWClcblx0XHQvLyB7XG5cdFx0Ly8gXHR2ZWxYID0gbmVhcmVzdC5sZCAtIG9mZnNldFg7XG5cdFx0Ly8gfVxuXG5cdFx0Ly8gaWYgKGF4aXMueCA+IDAgJiYgbmVhcmVzdC5yZCAtIG9mZnNldFggPCB2ZWxYKVxuXHRcdC8vIHtcblx0XHQvLyBcdHZlbFggPSBuZWFyZXN0LnJkIC0gb2Zmc2V0WDtcblx0XHQvLyB9XG5cblx0XHQvLyBpZiAoYXhpcy55IDwgMCAmJiBuZWFyZXN0LnRkIC0gb2Zmc2V0WSA8IHZlbFkpXG5cdFx0Ly8ge1xuXHRcdC8vIFx0dmVsWSA9IG5lYXJlc3QudGQgLSBvZmZzZXRZO1xuXHRcdC8vIH1cblxuXHRcdC8vIGlmIChheGlzLnkgPiAwICYmIG5lYXJlc3QuYmQgLSBvZmZzZXRZIDwgdmVsWSlcblx0XHQvLyB7XG5cdFx0Ly8gXHR2ZWxZID0gbmVhcmVzdC5iZCAtIG9mZnNldFk7XG5cdFx0Ly8gfVxuXG5cblx0XHR2YXIgcHJldlggPSBwbGF5ZXJQb3NpdGlvbi54O1xuXHRcdHBsYXllclBvc2l0aW9uLnggKz0gYXhpcy54KnZlbFg7XG5cblx0XHR2YXIgbGluZUhBID0ge3g6cGxheWVyUG9zaXRpb24ueCAtIDEwMDAsIHk6cGxheWVyUG9zaXRpb24ueX07XG5cdFx0dmFyIGxpbmVIQiA9IHt4OnBsYXllclBvc2l0aW9uLnggKyAxMDAwLCB5OnBsYXllclBvc2l0aW9uLnl9O1xuXHRcdHZhciByZXN1bHRIID0gcmF5Y2FzdChsaW5lSEEsIGxpbmVIQiwgdmVydGljZXMpO1xuXHRcdHZhciBuZWFyZXN0ID0gZ2V0TmVhcmVzdEZhY2VzKHBsYXllclBvc2l0aW9uLCByZXN1bHRIKTtcblx0XHR2YXIgaXNJbnNpZGUgPSBwb2ludEluUG9seWdvbihwbGF5ZXJQb3NpdGlvbiwgdmVydGljZXMpO1xuXG5cdFx0aWYgKGlzSW5zaWRlKVxuXHRcdHtcblx0XHRcdGlmIChuZWFyZXN0LmwpXG5cdFx0XHR7XG5cdFx0XHRcdGlmIChwbGF5ZXJQb3NpdGlvbi54IDwgbmVhcmVzdC5sLnBvaW50LnggKyBvZmZzZXRYKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cGxheWVyUG9zaXRpb24ueCA9IG5lYXJlc3QubC5wb2ludC54ICsgb2Zmc2V0WDtcblx0XHRcdFx0XHRwbGF5ZXJWZWxvY2l0eS54ID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRwbGF5ZXJWZWxvY2l0eS54ID0gcGxheWVyUG9zaXRpb24ueCAtIHByZXZYO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gY3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0XHQvLyBjdHgubW92ZVRvKHBsYXllclBvc2l0aW9uLngsIHBsYXllclBvc2l0aW9uLnkpO1xuXHRcdFx0XHQvLyBjdHgubGluZVRvKG5lYXJlc3QubC5wb2ludC54LCBwbGF5ZXJQb3NpdGlvbi55KVxuXHRcdFx0XHQvLyBjdHguc3Ryb2tlU3R5bGUgPSBcIiNGRjAwMDBcIjtcblx0XHRcdFx0Ly8gY3R4LnN0cm9rZSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKG5lYXJlc3Qucilcblx0XHRcdHtcblx0XHRcdFx0aWYgKHBsYXllclBvc2l0aW9uLnggPiBuZWFyZXN0LnIucG9pbnQueCAtIG9mZnNldFgpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRwbGF5ZXJQb3NpdGlvbi54ID0gbmVhcmVzdC5yLnBvaW50LnggLSBvZmZzZXRYO1xuXHRcdFx0XHRcdHBsYXllclZlbG9jaXR5LnggPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHBsYXllclZlbG9jaXR5LnggPSBwbGF5ZXJQb3NpdGlvbi54IC0gcHJldlg7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRcdC8vIGN0eC5tb3ZlVG8ocGxheWVyUG9zaXRpb24ueCwgcGxheWVyUG9zaXRpb24ueSk7XG5cdFx0XHRcdC8vIGN0eC5saW5lVG8obmVhcmVzdC5yLnBvaW50LngsIHBsYXllclBvc2l0aW9uLnkpO1xuXHRcdFx0XHQvLyBjdHguc3Ryb2tlU3R5bGUgPSBcIiNGRjAwMDBcIjtcblx0XHRcdFx0Ly8gY3R4LnN0cm9rZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0cGxheWVyUG9zaXRpb24ueCA9IHByZXZYO1xuXG5cdFx0fVxuXG5cblx0XHR2YXIgcHJldlkgPSBwbGF5ZXJQb3NpdGlvbi55O1xuXG4gICAgLy8gZ3Jhdml0eVxuXHRcdHBsYXllclBvc2l0aW9uLnkgKz0gMjtcblxuXHRcdHZhciBsaW5lVkEgPSB7eDpwbGF5ZXJQb3NpdGlvbi54LCB5OnBsYXllclBvc2l0aW9uLnkgLSAxMDAwfTtcblx0XHR2YXIgbGluZVZCID0ge3g6cGxheWVyUG9zaXRpb24ueCwgeTpwbGF5ZXJQb3NpdGlvbi55ICsgMTAwMH07XG5cdFx0dmFyIHJlc3VsdFYgPSByYXljYXN0KGxpbmVWQSwgbGluZVZCLCB2ZXJ0aWNlcyk7XG5cdFx0dmFyIG5lYXJlc3QgPSBnZXROZWFyZXN0RmFjZXMocGxheWVyUG9zaXRpb24sIHJlc3VsdFYpO1xuXHRcdHZhciBpc0luc2lkZSA9IHBvaW50SW5Qb2x5Z29uKHBsYXllclBvc2l0aW9uLCB2ZXJ0aWNlcyk7XG5cblxuXHRcdGlmIChpc0luc2lkZSlcblx0XHR7XG5cdFx0XHRpZiAobmVhcmVzdC50KVxuXHRcdFx0e1xuXHRcdFx0XHRpZiAocGxheWVyUG9zaXRpb24ueSA8IG5lYXJlc3QudC5wb2ludC55ICsgb2Zmc2V0WSkgcGxheWVyUG9zaXRpb24ueSA9IG5lYXJlc3QudC5wb2ludC55ICsgb2Zmc2V0WTtcblxuXHRcdFx0XHQvLyBjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRcdC8vIGN0eC5tb3ZlVG8ocGxheWVyUG9zaXRpb24ueCwgcGxheWVyUG9zaXRpb24ueSk7XG5cdFx0XHRcdC8vIGN0eC5saW5lVG8ocGxheWVyUG9zaXRpb24ueCwgbmVhcmVzdC50LnBvaW50LnkpO1xuXHRcdFx0XHQvLyBjdHguc3Ryb2tlU3R5bGUgPSBcIiNGRjAwMDBcIjtcblx0XHRcdFx0Ly8gY3R4LnN0cm9rZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAobmVhcmVzdC5iKVxuXHRcdFx0e1xuXHRcdFx0XHRpZiAocGxheWVyUG9zaXRpb24ueSA+IG5lYXJlc3QuYi5wb2ludC55IC0gb2Zmc2V0WSkgcGxheWVyUG9zaXRpb24ueSA9IG5lYXJlc3QuYi5wb2ludC55IC0gb2Zmc2V0WTtcblxuXHRcdFx0XHQvLyBjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRcdC8vIGN0eC5tb3ZlVG8ocGxheWVyUG9zaXRpb24ueCwgcGxheWVyUG9zaXRpb24ueSk7XG5cdFx0XHRcdC8vIGN0eC5saW5lVG8ocGxheWVyUG9zaXRpb24ueCwgbmVhcmVzdC5iLnBvaW50LnkpO1xuXHRcdFx0XHQvLyBjdHguc3Ryb2tlU3R5bGUgPSBcIiNGRjAwMDBcIjtcblx0XHRcdFx0Ly8gY3R4LnN0cm9rZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0cGxheWVyUG9zaXRpb24ueSA9IHByZXZZO1xuXHRcdH1cblxuXG5cdFx0cGxheWVyVmVsb2NpdHkueSA9IHBsYXllclBvc2l0aW9uLnkgLSBwcmV2WTtcblxuXHRcdGlmIChwbGF5ZXJQb3NpdGlvbi55IDwgMjApIHtcblx0XHRcdHBsYXllclBvc2l0aW9uLnkgPSAyMDtcblx0XHRcdHBsYXllclZlbG9jaXR5LnkgPSAwO1xuXHRcdH1cblxuXHRcdGlmIChwbGF5ZXJQb3NpdGlvbi54IDwgMjApIHtcblx0XHRcdHBsYXllclBvc2l0aW9uLnggPSAyMDtcblx0XHRcdHBsYXllclZlbG9jaXR5LnggPSAwO1xuXHRcdH0gZWxzZSBpZiAocGxheWVyUG9zaXRpb24ueCA+IChnYW1lLnJlbmRlcmVyLndpZHRoIC0gMjApKSB7XG5cdFx0XHRwbGF5ZXJQb3NpdGlvbi54ID0gKGdhbWUucmVuZGVyZXIud2lkdGggLSAyMCk7XG5cdFx0XHRwbGF5ZXJWZWxvY2l0eS54ID0gMDtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBnZXROZWFyZXN0RmFjZXMocG9zLCBmYWNlcylcblx0e1xuXHRcdHZhciByZXN1bHQgPSB7bDpudWxsLCByOm51bGwsIHQ6bnVsbCwgYjpudWxsLCBkbDoxMDAwMDAsIGRyOjEwMDAwMCwgZHQ6MTAwMDAwLCBkYjoxMDAwMDB9O1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBmYWNlcy5sZW5ndGg7IGkrKylcblx0XHR7XG5cdFx0XHR2YXIgciA9IGZhY2VzW2ldO1xuXG5cdFx0XHRpZiAoci5wb2ludC5vbkxpbmUxICYmIHIucG9pbnQub25MaW5lMilcblx0XHRcdHtcblx0XHRcdFx0dmFyIGQgPSBsaW5lRGlzdGFuY2UocG9zLCByLnBvaW50KTtcblxuXHRcdFx0XHRpZiAoci5wb2ludC54IDwgcG9zLngpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZiAoZCA8IHJlc3VsdC5kbClcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRyZXN1bHQuZGwgPSBkO1xuXHRcdFx0XHRcdFx0cmVzdWx0LmwgPSByO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChyLnBvaW50LnggPiBwb3MueClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGlmIChkIDwgcmVzdWx0LmRyKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHJlc3VsdC5kciA9IGQ7XG5cdFx0XHRcdFx0XHRyZXN1bHQuciA9IHI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHIucG9pbnQueSA8IHBvcy55KVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aWYgKGQgPCByZXN1bHQuZHQpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0cmVzdWx0LmR0ID0gZDtcblx0XHRcdFx0XHRcdHJlc3VsdC50ID0gcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoci5wb2ludC55ID4gcG9zLnkpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZiAoZCA8IHJlc3VsdC5kYilcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRyZXN1bHQuZGIgPSBkO1xuXHRcdFx0XHRcdFx0cmVzdWx0LmIgPSByO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cblxuXHRmdW5jdGlvbiByYXljYXN0KHN0YXJ0UG9pbnQsIGVuZFBvaW50LCB2ZXJ0aWNlcylcblx0e1xuXHRcdHZhciBsZW4gPSB2ZXJ0aWNlcy5sZW5ndGg7XG5cdFx0dmFyIHJlc3VsdCA9IFtdO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKylcblx0XHR7XG5cdFx0XHR2YXIgYSA9IHZlcnRpY2VzW2ldO1xuXHRcdFx0dmFyIGIgPSBpID49IChsZW4gLSAxKSA/IHZlcnRpY2VzWzBdIDogdmVydGljZXNbaSsxXTtcblx0XHRcdHZhciByID0gY2hlY2tMaW5lSW50ZXJzZWN0aW9uKHN0YXJ0UG9pbnQueCwgc3RhcnRQb2ludC55LCBlbmRQb2ludC54LCBlbmRQb2ludC55LCBhLngsIGEueSwgYi54LCBiLnkpO1xuXHRcdFx0aWYgKHIub25MaW5lMSAmJiByLm9uTGluZTIpXG5cdFx0XHR7XG5cdFx0XHRcdHZhciBmYWNlID0ge2E6YSwgYjpiLCBwb2ludDpyfTtcblx0XHRcdFx0cmVzdWx0LnB1c2goZmFjZSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXG5cdGZ1bmN0aW9uIGxpbmVEaXN0YW5jZShwb2ludDEsIHBvaW50Milcblx0e1xuXHRcdHZhciB4cyA9IDA7XG5cdFx0dmFyIHlzID0gMDtcblxuXHRcdHhzID0gcG9pbnQyLnggLSBwb2ludDEueDtcblx0XHR4cyA9IHhzICogeHM7XG5cblx0XHR5cyA9IHBvaW50Mi55IC0gcG9pbnQxLnk7XG5cdFx0eXMgPSB5cyAqIHlzO1xuXG5cdFx0cmV0dXJuIE1hdGguc3FydCh4cyArIHlzKTtcblx0fVxufVxuXG4vL1xuZnVuY3Rpb24gcG9pbnRJblBvbHlnb24ocG9pbnQsIHBvbHlnb24pXG57XG5cdHZhciBwb2ludHMgPSBwb2x5Z29uO1xuXHR2YXIgaSwgaiwgbnZlcnQgPSBwb2x5Z29uLmxlbmd0aDtcblx0dmFyIGMgPSBmYWxzZTtcblxuXHRmb3IoaSA9IDAsIGogPSBudmVydCAtIDE7IGkgPCBudmVydDsgaiA9IGkrKykge1xuXHRcdGlmKCAoICgocG9pbnRzW2ldLnkpID49IHBvaW50LnkgKSAhPSAocG9pbnRzW2pdLnkgPj0gcG9pbnQueSkgKSAmJlxuXHQgICAgXHQocG9pbnQueCA8PSAocG9pbnRzW2pdLnggLSBwb2ludHNbaV0ueCkgKiAocG9pbnQueSAtIHBvaW50c1tpXS55KSAvIChwb2ludHNbal0ueSAtIHBvaW50c1tpXS55KSArIHBvaW50c1tpXS54KVxuXHQgIFx0KSBjID0gIWM7XG5cdH1cblxuICByZXR1cm4gYztcbn1cblxuLy8gbWV0aG9kIGZyb20ganNmaWRkbGU6IGh0dHA6Ly9qc2ZpZGRsZS5uZXQvanVzdGluX2Nfcm91bmRzL0dkMlMyL2xpZ2h0L1xuZnVuY3Rpb24gY2hlY2tMaW5lSW50ZXJzZWN0aW9uKGxpbmUxU3RhcnRYLCBsaW5lMVN0YXJ0WSwgbGluZTFFbmRYLCBsaW5lMUVuZFksIGxpbmUyU3RhcnRYLCBsaW5lMlN0YXJ0WSwgbGluZTJFbmRYLCBsaW5lMkVuZFkpIHtcbiAgICAvLyBpZiB0aGUgbGluZXMgaW50ZXJzZWN0LCB0aGUgcmVzdWx0IGNvbnRhaW5zIHRoZSB4IGFuZCB5IG9mIHRoZSBpbnRlcnNlY3Rpb24gKHRyZWF0aW5nIHRoZSBsaW5lcyBhcyBpbmZpbml0ZSkgYW5kIGJvb2xlYW5zIGZvciB3aGV0aGVyIGxpbmUgc2VnbWVudCAxIG9yIGxpbmUgc2VnbWVudCAyIGNvbnRhaW4gdGhlIHBvaW50XG4gICAgdmFyIGRlbm9taW5hdG9yLCBhLCBiLCBudW1lcmF0b3IxLCBudW1lcmF0b3IyLCByZXN1bHQgPSB7XG4gICAgICAgIHg6IG51bGwsXG4gICAgICAgIHk6IG51bGwsXG4gICAgICAgIG9uTGluZTE6IGZhbHNlLFxuICAgICAgICBvbkxpbmUyOiBmYWxzZVxuICAgIH07XG4gICAgZGVub21pbmF0b3IgPSAoKGxpbmUyRW5kWSAtIGxpbmUyU3RhcnRZKSAqIChsaW5lMUVuZFggLSBsaW5lMVN0YXJ0WCkpIC0gKChsaW5lMkVuZFggLSBsaW5lMlN0YXJ0WCkgKiAobGluZTFFbmRZIC0gbGluZTFTdGFydFkpKTtcbiAgICBpZiAoZGVub21pbmF0b3IgPT0gMCkge1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBhID0gbGluZTFTdGFydFkgLSBsaW5lMlN0YXJ0WTtcbiAgICBiID0gbGluZTFTdGFydFggLSBsaW5lMlN0YXJ0WDtcbiAgICBudW1lcmF0b3IxID0gKChsaW5lMkVuZFggLSBsaW5lMlN0YXJ0WCkgKiBhKSAtICgobGluZTJFbmRZIC0gbGluZTJTdGFydFkpICogYik7XG4gICAgbnVtZXJhdG9yMiA9ICgobGluZTFFbmRYIC0gbGluZTFTdGFydFgpICogYSkgLSAoKGxpbmUxRW5kWSAtIGxpbmUxU3RhcnRZKSAqIGIpO1xuICAgIGEgPSBudW1lcmF0b3IxIC8gZGVub21pbmF0b3I7XG4gICAgYiA9IG51bWVyYXRvcjIgLyBkZW5vbWluYXRvcjtcblxuICAgIC8vIGlmIHdlIGNhc3QgdGhlc2UgbGluZXMgaW5maW5pdGVseSBpbiBib3RoIGRpcmVjdGlvbnMsIHRoZXkgaW50ZXJzZWN0IGhlcmU6XG4gICAgcmVzdWx0LnggPSBsaW5lMVN0YXJ0WCArIChhICogKGxpbmUxRW5kWCAtIGxpbmUxU3RhcnRYKSk7XG4gICAgcmVzdWx0LnkgPSBsaW5lMVN0YXJ0WSArIChhICogKGxpbmUxRW5kWSAtIGxpbmUxU3RhcnRZKSk7XG4vKlxuICAgICAgICAvLyBpdCBpcyB3b3J0aCBub3RpbmcgdGhhdCB0aGlzIHNob3VsZCBiZSB0aGUgc2FtZSBhczpcbiAgICAgICAgeCA9IGxpbmUyU3RhcnRYICsgKGIgKiAobGluZTJFbmRYIC0gbGluZTJTdGFydFgpKTtcbiAgICAgICAgeSA9IGxpbmUyU3RhcnRYICsgKGIgKiAobGluZTJFbmRZIC0gbGluZTJTdGFydFkpKTtcbiAgICAgICAgKi9cbiAgICAvLyBpZiBsaW5lMSBpcyBhIHNlZ21lbnQgYW5kIGxpbmUyIGlzIGluZmluaXRlLCB0aGV5IGludGVyc2VjdCBpZjpcbiAgICBpZiAoYSA+IDAgJiYgYSA8IDEpIHtcbiAgICAgICAgcmVzdWx0Lm9uTGluZTEgPSB0cnVlO1xuICAgIH1cbiAgICAvLyBpZiBsaW5lMiBpcyBhIHNlZ21lbnQgYW5kIGxpbmUxIGlzIGluZmluaXRlLCB0aGV5IGludGVyc2VjdCBpZjpcbiAgICBpZiAoYiA+IDAgJiYgYiA8IDEpIHtcbiAgICAgICAgcmVzdWx0Lm9uTGluZTIgPSB0cnVlO1xuICAgIH1cbiAgICAvLyBpZiBsaW5lMSBhbmQgbGluZTIgYXJlIHNlZ21lbnRzLCB0aGV5IGludGVyc2VjdCBpZiBib3RoIG9mIHRoZSBhYm92ZSBhcmUgdHJ1ZVxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuIiwidmFyIFRvb2xzID0gcmVxdWlyZSgnLi9Ub29scy5qcycpO1xudmFyIFBhcnRpY2xlU3lzdGVtID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL1BhcnRpY2xlU3lzdGVtLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gUGxheWVyKGNvbnRhaW5lciwgeFBvcywgeVBvcykge1xuXHR2YXIgc2VsZiA9IHRoaXM7XG5cdHZhciB2ZWxvY2l0eSA9IDA7XG5cdHZhciBhY2NlbGVyYXRpb24gPSAwLjI1O1xuXHR2YXIgbWF4c3BlZWQgPSAyLjA7XG5cdHZhciBkaXIgPSAxO1xuXHR2YXIgbW92aWUgPSBudWxsO1xuXHR2YXIgZGVhZCA9IGZhbHNlO1xuXG5cdG1vdmllID0gbmV3IFBJWEkuTW92aWVDbGlwKFRvb2xzLmdldFRleHR1cmVzKFwiYm95XCIsIDcsIFwiLnBuZ1wiKSk7XG5cdG1vdmllLnBpdm90ID0gbmV3IFBJWEkuUG9pbnQobW92aWUud2lkdGgvMiwgbW92aWUuaGVpZ2h0LzIpO1xuXHRtb3ZpZS5hbmltYXRpb25TcGVlZCA9IDAuMjtcblxuXHR0aGlzLnZpZXcgPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG5cdHRoaXMudmlldy5hZGRDaGlsZChtb3ZpZSk7XG5cdHRoaXMudmlldy5wb3NpdGlvbi54ID0geFBvcztcblx0dGhpcy52aWV3LnBvc2l0aW9uLnkgPSB5UG9zO1xuXG5cdHZhciBmYWRpbmcgPSBmYWxzZTtcblxuXHRtb3ZpZS5wbGF5KCk7XG5cblx0dmFyIHBhcnRpY2xlcyA9IG5ldyBQYXJ0aWNsZVN5c3RlbShcblx0ICB7XG5cdCAgICAgIFwiaW1hZ2VzXCI6W1wicGl4ZWxTaGluZS5wbmdcIl0sXG5cdCAgICAgIFwibnVtUGFydGljbGVzXCI6MTAwLFxuXHQgICAgICBcImVtaXNzaW9uc1BlclVwZGF0ZVwiOjAsXG5cdCAgICAgIFwiZW1pc3Npb25zSW50ZXJ2YWxcIjowLFxuXHQgICAgICBcImFscGhhXCI6MSxcblx0ICAgICAgXCJwcm9wZXJ0aWVzXCI6XG5cdCAgICAgIHtcblx0ICAgICAgICBcInJhbmRvbVNwYXduWFwiOjEwLFxuXHQgICAgICAgIFwicmFuZG9tU3Bhd25ZXCI6MTAsXG5cdCAgICAgICAgXCJsaWZlXCI6MzAsXG5cdCAgICAgICAgXCJyYW5kb21MaWZlXCI6MTAwLFxuXHQgICAgICAgIFwiZm9yY2VYXCI6MCxcblx0ICAgICAgICBcImZvcmNlWVwiOjAsXG5cdCAgICAgICAgXCJyYW5kb21Gb3JjZVhcIjowLjEsXG5cdCAgICAgICAgXCJyYW5kb21Gb3JjZVlcIjowLjEsXG5cdCAgICAgICAgXCJ2ZWxvY2l0eVhcIjozLFxuXHQgICAgICAgIFwidmVsb2NpdHlZXCI6MCxcblx0ICAgICAgICBcInJhbmRvbVZlbG9jaXR5WFwiOjIsXG5cdCAgICAgICAgXCJyYW5kb21WZWxvY2l0eVlcIjoyLFxuXHQgICAgICAgIFwic2NhbGVcIjo1LFxuXHQgICAgICAgIFwiZ3Jvd3RoXCI6MC4wMSxcblx0ICAgICAgICBcInJhbmRvbVNjYWxlXCI6NC41LFxuXHQgICAgICAgIFwiYWxwaGFTdGFydFwiOjAsXG5cdCAgICAgICAgXCJhbHBoYUZpbmlzaFwiOjAsXG5cdCAgICAgICAgXCJhbHBoYVJhdGlvXCI6MC4yLFxuXHQgICAgICAgIFwidG9ycXVlXCI6MCxcblx0ICAgICAgICBcInJhbmRvbVRvcnF1ZVwiOjBcblx0ICAgICAgfVxuXHQgIH0pO1xuXHQgIHBhcnRpY2xlcy52aWV3LmFscGhhID0gMC41O1xuXG5cdCAgY29udGFpbmVyLmFkZENoaWxkKHBhcnRpY2xlcy52aWV3KTtcblx0ICBjb250YWluZXIuYWRkQ2hpbGQodGhpcy52aWV3KTtcblxuXHR0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKGdhbWUsIHBvc2l0aW9uLCB2ZWxvY2l0eSlcblx0e1xuXHRcdHNlbGYudmlldy5wb3NpdGlvbi54ID0gcG9zaXRpb24ueDtcblx0XHRzZWxmLnZpZXcucG9zaXRpb24ueSA9IHBvc2l0aW9uLnkgLSAxMDtcblxuXHRcdGlmICh2ZWxvY2l0eS54ID4gLTAuMDEgJiYgdmVsb2NpdHkueCA8IDAuMDEpIHZlbG9jaXR5LnggPSAwO1xuXG5cdFx0aWYgKHZlbG9jaXR5LnggPCAwKSBtb3ZpZS5zY2FsZS54ID0gLTE7XG5cdFx0aWYgKHZlbG9jaXR5LnggPiAwKSBtb3ZpZS5zY2FsZS54ID0gMTtcblxuXHRcdG1vdmllLnJvdGF0aW9uID0gdmVsb2NpdHkueCowLjE7XG5cblx0XHRwYXJ0aWNsZXMucHJvcGVydGllcy5jZW50ZXJYID0gc2VsZi52aWV3LnBvc2l0aW9uLnggKyAxMDtcblx0XHRwYXJ0aWNsZXMucHJvcGVydGllcy5jZW50ZXJZID0gc2VsZi52aWV3LnBvc2l0aW9uLnk7XG5cdFx0cGFydGljbGVzLnVwZGF0ZSgpO1xuXG5cdFx0aWYgKGZhZGluZyAmJiBzZWxmLnZpZXcuYWxwaGEgPiAwLjAyKSBzZWxmLnZpZXcuYWxwaGEgLT0gMC4wMjtcblx0fVxuXG5cdHRoaXMubW92ZUxlZnQgPSBmdW5jdGlvbigpXG5cdHtcblx0fVxuXG5cdHRoaXMubW92ZVJpZ2h0ID0gZnVuY3Rpb24oKVxuXHR7XG5cdH1cblxuXHR0aGlzLmZhZGVPdXQgPSBmdW5jdGlvbigpXG5cdHtcblx0XHRwYXJ0aWNsZXMuZW1pdCgxMDApO1xuXHRcdHNlbGYudmlldy5hbHBoYSA9IDAuNTtcblx0XHRmYWRpbmcgPSB0cnVlO1xuXHR9XG5cblx0dGhpcy5kb0NvbGxpZGUgPSBmdW5jdGlvbih4cG9zLHlwb3Msd2lkdGgsaGVpZ2h0KVxuXHR7XG5cdFx0Ly9jb25zb2xlLmxvZyhcImNvbGxpZGU6IFwiICsgc2VsZi52aWV3LnBvc2l0aW9uLnggPj0geHBvcyArIFwiIFwiICsgc2VsZi52aWV3LnBvc2l0aW9uLnggPCAoeHBvcyArIHdpZHRoKSArIFwiIFwiICsgc2VsZi52aWV3LnBvc2l0aW9uLnkgLSB5cG9zIDwgMTAwKVxuXHRcdGlmKHNlbGYudmlldy5wb3NpdGlvbi54ID49IHhwb3MgJiYgc2VsZi52aWV3LnBvc2l0aW9uLnggPCAoeHBvcyArIHdpZHRoKSAmJiBNYXRoLmFicyhzZWxmLnZpZXcucG9zaXRpb24ueSAtIHlwb3MpIDwgNTApXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG59XG5cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gUHJlbG9hZGVyKGdhbWUpIHtcblxuICB2YXIgY29udGVudCxcbiAgICBzZWxmID0gdGhpcyxcbiAgICBiZztcblxuICBzZWxmLnRleHQ7XG5cbiAgdGhpcy5wcm9ncmVzcyA9IGZ1bmN0aW9uKGxvYWRlZEl0ZW1zLCB0b3RhbEl0ZW1zKSB7XG4gICAgdmFyIHBlcmNlbnQgPSBNYXRoLnJvdW5kKGxvYWRlZEl0ZW1zICogMTAwIC8gdG90YWxJdGVtcyk7XG4gICAgaWYgKGxvYWRlZEl0ZW1zID4gMCkge1xuICAgICAgaWYgKGxvYWRlZEl0ZW1zID09IDEpIHtcbiAgICAgICAgc2VsZi5pbml0KCk7XG4gICAgICB9XG4gICAgICBzZWxmLnRleHQuc2V0VGV4dCgnQ0FSUkVHQU5ETyAnICsgcGVyY2VudCArICclJyk7XG4gICAgICBzZWxmLnRleHQucG9zaXRpb24ueCA9IChnYW1lLnJlbmRlcmVyLndpZHRoIC8gMikgLSAoc2VsZi50ZXh0LndpZHRoIC8gMik7XG4gICAgfVxuICB9XG5cbiAgdGhpcy5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgY29udGVudCA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcbiAgICBnYW1lLnN0YWdlLmFkZENoaWxkKGNvbnRlbnQpO1xuXG4gICAgYmcgPSBuZXcgUElYSS5HcmFwaGljcygpO1xuICAgIGJnLmJlZ2luRmlsbCgweDAwMDAwMCk7XG4gICAgYmcuZHJhd1JlY3QoMCwgMCwgc2NyZWVuV2lkdGgsIHNjcmVlbkhlaWdodCk7XG4gICAgYmcuZW5kRmlsbCgpO1xuXG4gICAgXG4gICAgY29udGVudC5hZGRDaGlsZChiZyk7XG5cbiAgICBzZWxmLnRleHQgPSBuZXcgUElYSS5UZXh0KCdDQVJSRUdBTkRPIDAlJywge1xuICAgICAgZm9udDogJzE4cHggUm9ra2l0dCcsXG4gICAgICBmaWxsOiAnIzY2NjY2NicsXG4gICAgICBhbGlnbjogJ2NlbnRlcidcbiAgICB9KTtcbiAgICBzZWxmLnRleHQucG9zaXRpb24ueCA9IChnYW1lLnJlbmRlcmVyLndpZHRoIC8gMikgLSAoc2VsZi50ZXh0LndpZHRoIC8gMik7XG4gICAgc2VsZi50ZXh0LnBvc2l0aW9uLnkgPSBnYW1lLnJlbmRlcmVyLmhlaWdodCAvIDI7XG4gICAgY29udGVudC5hZGRDaGlsZChzZWxmLnRleHQpO1xuICB9XG5cbiAgdGhpcy5oaWRlID0gZnVuY3Rpb24oKSB7XG4gICAgY29udGVudC52aXNpYmxlID0gZmFsc2U7XG4gIH1cblxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gUmVzb3VyY2VzKCkge1xuXG4gIEhvd2xlci5pT1NBdXRvRW5hYmxlID0gZmFsc2U7XG4gIC8vIEhvd2xlci5tdXRlKCk7XG5cbiAgLy8gaW1hZ2VzXG4gIHRoaXMuYmFja2dyb3VuZCA9ICdpbWcvYmctZGVmYXVsdC5qcGcnO1xuICB0aGlzLmJ0blBsYXkgPSdpbWcvYnRuLXBsYXkucG5nJztcbiAgdGhpcy5idG5OZXh0ID0naW1nL2J0bi1uZXh0LnBuZyc7XG4gIHRoaXMuYnRuUmVzdGFydCA9J2ltZy9idG4tcmVzdGFydC5wbmcnO1xuICB0aGlzLnRleHRMZXZlbEVuZCA9J2ltZy90ZXh0LWxldmVsLWVuZC5wbmcnO1xuICB0aGlzLnRleHRHYW1lT3ZlciA9J2ltZy90ZXh0LWdhbWUtb3Zlci5wbmcnO1xuXG4gIC8vIHNwcml0ZXNcbiAgdGhpcy50ZXh0R2FtZU92ZXIgPSdpbWcvc3ByaXRlcy9wbGF5ZXIuanNvbic7XG4gIHRoaXMudGV4dHVyZXMgPSdpbWcvdGV4dHVyZXMuanNvbic7XG5cbiAgLy8gc291bmRzXG4gIHRoaXMuc291bmRzID0gW1xuICAgIHtcbiAgICAgIC8vIGdhbWUucmVzb3VyY2VzLnNvdW5kTG9vcC5wbGF5KCk7XG4gICAgICBuYW1lOiAnc291bmRMb29wJyxcbiAgICAgIHVybHM6IFsnc291bmRzL3NvdW5kTG9vcC5tcDMnXSxcbiAgICAgIGF1dG9QbGF5OiBmYWxzZSxcbiAgICAgIGxvb3A6IHRydWUsXG4gICAgICB2b2x1bWU6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgIC8vIGdhbWUucmVzb3VyY2VzLmJ1dHRvbkNsaWNrLnBsYXkoKTtcbiAgICAgIG5hbWU6ICdidXR0b25DbGljaycsXG4gICAgICB1cmxzOiBbJ3NvdW5kcy9idXR0b25DbGljazIubXAzJ10sXG4gICAgICB2b2x1bWU6IC4zXG4gICAgfSxcbiAgICB7XG4gICAgICAvLyBnYW1lLnJlc291cmNlcy5wb3J0YWxTb3VuZC5wbGF5KCk7XG4gICAgICBuYW1lOiAncG9ydGFsU291bmQnLFxuICAgICAgdXJsczogWydzb3VuZHMvcG9ydGFsLm1wMyddLFxuICAgICAgdm9sdW1lOiAuNVxuICAgIH0sXG4gICAge1xuICAgICAgLy8gZ2FtZS5yZXNvdXJjZXMuZm9yZXN0U291bmQucGxheSgpO1xuICAgICAgbmFtZTogJ2ZvcmVzdFNvdW5kJyxcbiAgICAgIHVybHM6IFsnc291bmRzL2ZvcmVzdC1uaWdodDIubXAzJ10sXG4gICAgICB2b2x1bWU6IC43LFxuICAgICAgbG9vcDogdHJ1ZVxuICAgIH0sXG4gICAge1xuICAgICAgLy8gZ2FtZS5yZXNvdXJjZXMubW90aGVyU291bmQucGxheSgpO1xuICAgICAgbmFtZTogJ21vdGhlclNvdW5kJyxcbiAgICAgIHVybHM6IFsnc291bmRzL2JsaW1ibGltLm1wMyddLFxuICAgICAgdm9sdW1lOiAuM1xuICAgIH0sXG4gICAge1xuICAgICAgLy8gZ2FtZS5yZXNvdXJjZXMuc3dpY2hlclNvdW5kLnBsYXkoKTtcbiAgICAgIG5hbWU6ICdzd2ljaGVyU291bmQnLFxuICAgICAgdXJsczogWydzb3VuZHMvc3dpY2hlcjIubXAzJ10sXG4gICAgICB2b2x1bWU6IC4zXG4gICAgfSxcbiAgICB7XG4gICAgICAvLyBnYW1lLnJlc291cmNlcy5jYXJDcmFzaC5wbGF5KCk7XG4gICAgICBuYW1lOiAnY2FyQ3Jhc2gnLFxuICAgICAgdXJsczogWydzb3VuZHMvY2FyQ3Jhc2gubXAzJ11cbiAgICB9LFxuICAgIHtcbiAgICAgIC8vIGdhbWUucmVzb3VyY2VzLmNhclBhc3MucGxheSgpO1xuICAgICAgbmFtZTogJ2NhclBhc3MnLFxuICAgICAgdXJsczogWydzb3VuZHMvY2FyUGFzczIubXAzJ10sXG4gICAgICB2b2x1bWU6IC4xNVxuICAgIH0sXG4gICAge1xuICAgICAgLy8gZ2FtZS5yZXNvdXJjZXMuc3Rvcm0ucGxheSgpO1xuICAgICAgbmFtZTogJ3N0b3JtJyxcbiAgICAgIHVybHM6IFsnc291bmRzL3N0b3JtMi5tcDMnXSxcbiAgICAgIHZvbHVtZTogMVxuICAgIH1cbiAgXTtcblxuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdGhpcy5nZXRQSVhJRmlsZXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaSxcbiAgICAgIHVybCxcbiAgICAgIHVybFRvSWYsXG4gICAgICBhcnIgPSBbXTtcbiAgICBmb3IgKGkgaW4gc2VsZikge1xuICAgICAgdXJsID0gc2VsZltpXTtcbiAgICAgIGlmICh0eXBlb2YgdXJsID09PSAnc3RyaW5nJykge1xuICAgICAgICB1cmxUb0lmID0gdXJsLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmICh1cmxUb0lmLmxhc3RJbmRleE9mKCcuanBnJykgPiAwXG4gICAgICAgICAgfHwgdXJsVG9JZi5sYXN0SW5kZXhPZignLmpwZWcnKSA+IDBcbiAgICAgICAgICB8fCB1cmxUb0lmLmxhc3RJbmRleE9mKCcucG5nJykgPiAwXG4gICAgICAgICAgfHwgdXJsVG9JZi5sYXN0SW5kZXhPZignLmdpZicpID4gMFxuICAgICAgICAgIHx8IHVybFRvSWYubGFzdEluZGV4T2YoJy5qc29uJykgPiAwXG4gICAgICAgICAgfHwgdXJsVG9JZi5sYXN0SW5kZXhPZignLmF0bGFzJykgPiAwXG4gICAgICAgICAgfHwgdXJsVG9JZi5sYXN0SW5kZXhPZignLmFuaW0nKSA+IDBcbiAgICAgICAgICB8fCB1cmxUb0lmLmxhc3RJbmRleE9mKCcueG1sJykgPiAwXG4gICAgICAgICAgfHwgdXJsVG9JZi5sYXN0SW5kZXhPZignLmZudCcpID4gMCkge1xuICAgICAgICAgIGFyci5wdXNoKHNlbGZbaV0pOyAgXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuXG59O1xuIiwiXG5cbm1vZHVsZS5leHBvcnRzID0gXG57XG5cdGdldFRleHR1cmVzOiAgZnVuY3Rpb24ocHJlZml4LCBudW1GcmFtZXMsIHN1Zml4KVxuXHR7XG5cdFx0aWYgKHN1Zml4ID09IG51bGwpIHN1Zml4ID0gXCJcIjtcblx0XHR2YXIgdGV4dHVyZXMgPSBbXTtcblx0XHR2YXIgaSA9IG51bUZyYW1lcztcblx0XHR3aGlsZSAoaSA+IDApIFxuXHRcdHtcblx0XHRcdHZhciBpZCA9IHRoaXMuaW50VG9TdHJpbmcoaSwgMik7XG5cdFx0XHR2YXIgdGV4dHVyZSA9IFBJWEkuVGV4dHVyZS5mcm9tRnJhbWUocHJlZml4K2lkK3N1Zml4KTtcblx0XHRcdHRleHR1cmVzLnB1c2godGV4dHVyZSk7XG5cdFx0XHRpLS07XG5cdFx0fVxuXG5cdFx0dGV4dHVyZXMucmV2ZXJzZSgpO1xuXHQgICAgcmV0dXJuIHRleHR1cmVzO1xuXHR9LFxuXG5cdGludFRvU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSwgbGVuZ3RoKVxuXHR7XG5cdFx0dmFyIHN0ciA9IHZhbHVlLnRvU3RyaW5nKCk7XG5cdFx0dmFyIHN0cmxlbiA9IHN0ci5sZW5ndGg7XG5cdFx0dmFyIGkgPSBsZW5ndGggLSBzdHJsZW47XG5cdFx0d2hpbGUgKGktLSkgc3RyID0gXCIwXCIgKyBzdHI7IFxuXHRcdHJldHVybiBzdHI7XG5cdH0sXG5cblx0Y2xhbXA6IGZ1bmN0aW9uKHZhbHVlLCBtaW4sIG1heClcblx0e1xuXHRcdGlmICh2YWx1ZSA8IG1pbikgcmV0dXJuIG1pbjtcblx0XHRpZiAodmFsdWUgPiBtYXgpIHJldHVybiBtYXg7XG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9XG59IiwidmFyIFR3ZWVuYWJsZSA9IHJlcXVpcmUoJy4uL3ZlbmRvci9zaGlmdHknKSxcbiAgICBHYW1lID0gcmVxdWlyZSgnLi4vZ2FtZScpLFxuICAgIFBhcnRpY2xlU3lzdGVtID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9QYXJ0aWNsZVN5c3RlbS5qcycpLFxuICAgIFR3ZWVuYWJsZSA9IHJlcXVpcmUoJy4uL3ZlbmRvci9zaGlmdHknKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBFbmRCZWhhdmlvcihjb250YWluZXIsIGRhdGEpIHtcblx0dmFyIHNlbGYgPSB0aGlzLFxuICAgICAgaXRlbURhdGEgPSBkYXRhLFxuICAgICAgdHJpZ2dlcmVkID0gZmFsc2U7XG5cbiAgLy8vLy9yZXRyaXZlIHBvc2l0aW9uIGFuZCBzaXplIHNwZWNzXG4gIHZhciBzaXplID0gZGF0YS53aWR0aDtcbiAgdmFyIG9yaWdpblggPSBkYXRhLng7XG4gIHZhciBvcmlnaW5ZID0gZGF0YS55O1xuXG4gIC8vLy8vcmV0cml2ZSBwb3NpdGlvbiBhbmQgc2l6ZSBzcGVjc1xuICB2YXIgc2l6ZSA9IGRhdGEud2lkdGg7XG4gIHZhciBvcmlnaW5YID0gZGF0YS54O1xuICB2YXIgb3JpZ2luWSA9IGRhdGEueTtcblxuICAvLy8vL2NyZWF0ZSB2aXN1YWxcbiAgdGhpcy52aWV3ID0gbmV3IFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lcigpO1xuICB0aGlzLnZpZXcucG9zaXRpb24ueCA9IG9yaWdpblg7XG4gIHRoaXMudmlldy5wb3NpdGlvbi55ID0gb3JpZ2luWSAtIDI3O1xuXG4gIHZhciBwYXJ0aWNsZXMgPSBudWxsO1xuICB2YXIgcG9ydGFsT2ZmU3ByaXRlID0gbmV3IFBJWEkuU3ByaXRlKFBJWEkuVGV4dHVyZS5mcm9tSW1hZ2UoXCJQb3J0YWxPZmYucG5nXCIpKTtcbiAgdmFyIHBvcnRhbE9uU3ByaXRlID0gbmV3IFBJWEkuU3ByaXRlKFBJWEkuVGV4dHVyZS5mcm9tSW1hZ2UoXCJwb3J0YWwucG5nXCIpKTtcbiAgcG9ydGFsT25TcHJpdGUuYWxwaGEgPSAwO1xuXG4gIHRoaXMudmlldy5hZGRDaGlsZChwb3J0YWxPZmZTcHJpdGUpO1xuICBjb250YWluZXIuYWRkQ2hpbGQodGhpcy52aWV3KTtcblxuICB2YXIgZmFkZU91dFNoYXBlID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcbiAgZmFkZU91dFNoYXBlLmFscGhhID0gMDtcblxuICB2YXIgaGFsbyA9IFBJWEkuU3ByaXRlLmZyb21GcmFtZShcImhhbG8ucG5nXCIpO1xuICBoYWxvLmFuY2hvci54ID0gMC41O1xuICBoYWxvLmFuY2hvci55ID0gMC41O1xuICBoYWxvLnNjYWxlLnggPSA1O1xuICBoYWxvLnNjYWxlLnkgPSA1O1xuICBoYWxvLnBvc2l0aW9uLnggPSAzMztcbiAgaGFsby5wb3NpdGlvbi55ID0gMzM7XG4gIGhhbG8uYWxwaGEgPSAwLjI7XG4gIHRoaXMudmlldy5hZGRDaGlsZChoYWxvKTtcbiAgaGFsby52aXNpYmxlID0gZmFsc2U7XG5cbiAgZW1pdHRlci5vbignc3dpdGNoLnByZXNzZWQnLCBmdW5jdGlvbigpIHtcblxuICAgIGlmKGdhbWUubGV2ZWwubnVtU3dpdGNoZXMgPT0gMCkge1xuXG4gICAgICBwYXJ0aWNsZXMgPSBuZXcgUGFydGljbGVTeXN0ZW0oe1xuICAgICAgICBcImltYWdlc1wiOltcIlBvcnRhbFNwYXJrLnBuZ1wiXSxcbiAgICAgICAgXCJudW1QYXJ0aWNsZXNcIjo1MCxcbiAgICAgICAgXCJlbWlzc2lvbnNQZXJVcGRhdGVcIjoxLFxuICAgICAgICBcImVtaXNzaW9uc0ludGVydmFsXCI6MixcbiAgICAgICAgXCJhbHBoYVwiOjEsXG4gICAgICAgIFwicHJvcGVydGllc1wiOiB7XG4gICAgICAgICAgXCJyYW5kb21TcGF3blhcIjoxLFxuICAgICAgICAgIFwicmFuZG9tU3Bhd25ZXCI6MzAsXG4gICAgICAgICAgXCJsaWZlXCI6MzAsXG4gICAgICAgICAgXCJyYW5kb21MaWZlXCI6MTAwLFxuICAgICAgICAgIFwiZm9yY2VYXCI6MCxcbiAgICAgICAgICBcImZvcmNlWVwiOjAuMDEsXG4gICAgICAgICAgXCJyYW5kb21Gb3JjZVhcIjowLjAwNyxcbiAgICAgICAgICBcInJhbmRvbUZvcmNlWVwiOjAuMDEsXG4gICAgICAgICAgXCJ2ZWxvY2l0eVhcIjotMSxcbiAgICAgICAgICBcInZlbG9jaXR5WVwiOjAsXG4gICAgICAgICAgXCJyYW5kb21WZWxvY2l0eVhcIjowLjIsXG4gICAgICAgICAgXCJyYW5kb21WZWxvY2l0eVlcIjowLjIsXG4gICAgICAgICAgXCJzY2FsZVwiOjAuMjUsXG4gICAgICAgICAgXCJncm93dGhcIjowLjAwMSxcbiAgICAgICAgICBcInJhbmRvbVNjYWxlXCI6MC4wNCxcbiAgICAgICAgICBcImFscGhhU3RhcnRcIjowLFxuICAgICAgICAgIFwiYWxwaGFGaW5pc2hcIjowLFxuICAgICAgICAgIFwiYWxwaGFSYXRpb1wiOjAuMixcbiAgICAgICAgICBcInRvcnF1ZVwiOjAsXG4gICAgICAgICAgXCJyYW5kb21Ub3JxdWVcIjowXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBoYWxvLnZpc2libGUgPSB0cnVlO1xuICAgICAgaGFsby5hbHBoYSA9IDA7XG5cbiAgICAgIHBhcnRpY2xlcy52aWV3LmFscGhhID0gMC4yNTtcbiAgICAgIHBhcnRpY2xlcy5wcm9wZXJ0aWVzLmNlbnRlclggPSAxODtcbiAgICAgIHBhcnRpY2xlcy5wcm9wZXJ0aWVzLmNlbnRlclkgPSAzMztcblxuICAgICAgc2VsZi52aWV3LmFkZENoaWxkKHBhcnRpY2xlcy52aWV3KTtcblxuICAgICAgLy8gRmFkZSBwb3J0YWxcbiAgICAgIHZhciBpbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAocG9ydGFsT25TcHJpdGUuYWxwaGEgPj0gMSkge1xuICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBvcnRhbE9uU3ByaXRlLmFscGhhICs9IDAuMDI7XG4gICAgICAgIH1cbiAgICAgIH0sIDEpXG5cbiAgICAgIHNlbGYudmlldy5hZGRDaGlsZChwb3J0YWxPblNwcml0ZSk7XG4gICAgfVxuXG4gIH0pO1xuXG5cdHRoaXMudHJpZ2dlciA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghdHJpZ2dlcmVkKSB7XG4gICAgICBmYWRlT3V0U2hhcGUuYmVnaW5GaWxsKDB4MDAwKTtcbiAgICAgIGZhZGVPdXRTaGFwZS5kcmF3UmVjdCgwLCAwLCBnYW1lLnJlbmRlcmVyLndpZHRoLCBnYW1lLnJlbmRlcmVyLmhlaWdodCk7XG4gICAgICBnYW1lLnN0YWdlLmFkZENoaWxkKGZhZGVPdXRTaGFwZSk7XG4gICAgICBnYW1lLnBsYXllci5mYWRlT3V0KCk7XG4gICAgICBnYW1lLnJlc291cmNlcy5wb3J0YWxTb3VuZC5wbGF5KCk7XG4gICAgICBnYW1lLnJlc291cmNlcy5mb3Jlc3RTb3VuZC5zdG9wKCk7XG4gICAgfVxuICAgIHRyaWdnZXJlZCA9IHRydWU7XG4gIH1cblxuXHR0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKGdhbWUpXG5cdHtcbiAgICBpZiAocGFydGljbGVzKSB7XG4gICAgICBwYXJ0aWNsZXMudXBkYXRlKCk7XG4gICAgfVxuXG4gICAgaWYgKGhhbG8udmlzaWJsZSlcbiAgICB7XG4gICAgICBoYWxvLmFscGhhICs9IDAuMDE7XG4gICAgICBpZiAoaGFsby5hbHBoYSA+IDAuMikgaGFsby5hbHBoYSA9IDAuMjtcbiAgICB9XG5cbiAgICBpZiAodHJpZ2dlcmVkKSB7XG5cbiAgICAgIGZhZGVPdXRTaGFwZS5hbHBoYSArPSAwLjAxO1xuICAgICAgaWYgKGZhZGVPdXRTaGFwZS5hbHBoYSA+PSAxKSB7XG4gICAgICAgIGdhbWUubGV2ZWwuZGlzcG9zZSgpO1xuICAgICAgICBnYW1lLm5leHRMZXZlbCgpO1xuICAgICAgICBnYW1lLnN0YWdlLnJlbW92ZUNoaWxkKGZhZGVPdXRTaGFwZSk7XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy9jb25zb2xlLmxvZyhnYW1lLnBsYXllci5kb0NvbGxpZGUoaXRlbURhdGEueCxpdGVtRGF0YS55LCBpdGVtRGF0YS53aWR0aCxpdGVtRGF0YS5oZWlnaHQpLGdhbWUuaW5wdXQuS2V5LmlzRG93bigzOCkpO1xuICAgICAgaWYoZ2FtZS5wbGF5ZXIuZG9Db2xsaWRlKGl0ZW1EYXRhLngsaXRlbURhdGEueSwgaXRlbURhdGEud2lkdGgsaXRlbURhdGEuaGVpZ2h0KSlcbiAgICAgICAge1xuICAgICAgICAgIGlmKGdhbWUubGV2ZWwubnVtU3dpdGNoZXMgPT0gMCkge1xuICAgICAgICAgICAgc2VsZi50cmlnZ2VyKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJ2YXIgVHdlZW5hYmxlID0gcmVxdWlyZSgnLi4vdmVuZG9yL3NoaWZ0eScpLFxuICAgIEdhbWUgPSByZXF1aXJlKCcuLi9nYW1lJyksXG4gICAgUGFydGljbGVTeXN0ZW0gPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL1BhcnRpY2xlU3lzdGVtLmpzJyksXG4gICAgVHdlZW5hYmxlID0gcmVxdWlyZSgnLi4vdmVuZG9yL3NoaWZ0eScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIEVuZENhckJlaGF2aW9yKGNvbnRhaW5lciwgZGF0YSkge1xuXHR2YXIgc2VsZiA9IHRoaXMsXG4gICAgICBpdGVtRGF0YSA9IGRhdGEsXG4gICAgICB0cmlnZ2VyZWQgPSBmYWxzZTtcblxuICAvLy8vL3JldHJpdmUgcG9zaXRpb24gYW5kIHNpemUgc3BlY3NcbiAgdmFyIHNpemUgPSBkYXRhLndpZHRoO1xuICB2YXIgb3JpZ2luWCA9IGRhdGEueDtcbiAgdmFyIG9yaWdpblkgPSBkYXRhLnk7XG5cbiAgLy8vLy9yZXRyaXZlIHBvc2l0aW9uIGFuZCBzaXplIHNwZWNzXG4gIHZhciBzaXplID0gZGF0YS53aWR0aDtcbiAgdmFyIG9yaWdpblggPSBkYXRhLng7XG4gIHZhciBvcmlnaW5ZID0gZGF0YS55O1xuXG4gIC8vLy8vY3JlYXRlIHZpc3VhbFxuICB0aGlzLnZpZXcgPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG4gIHRoaXMudmlldy5wb3NpdGlvbi54ID0gb3JpZ2luWDtcbiAgdGhpcy52aWV3LnBvc2l0aW9uLnkgPSBvcmlnaW5ZIC0gMjc7XG5cbiAgdmFyIHBhcnRpY2xlcyA9IG51bGw7XG4gIHZhciBjYXJTcHJpdGUgPSBuZXcgUElYSS5TcHJpdGUoUElYSS5UZXh0dXJlLmZyb21JbWFnZShcIkNhckNyYXNoLnBuZ1wiKSk7XG4gIGNhclNwcml0ZS55ID0gMTM7XG4gIHRoaXMudmlldy5hZGRDaGlsZChjYXJTcHJpdGUpO1xuICBjb250YWluZXIuYWRkQ2hpbGQodGhpcy52aWV3KTtcblxuICB2YXIgZmFkZU91dFNoYXBlID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcbiAgZmFkZU91dFNoYXBlLmFscGhhID0gMDtcblxuICBlbWl0dGVyLm9uKCdzd2l0Y2gucHJlc3NlZCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgaWYoZ2FtZS5sZXZlbC5udW1Td2l0Y2hlcyA9PSAwKSB7XG5cbiAgICAgIHBhcnRpY2xlcyA9IG5ldyBQYXJ0aWNsZVN5c3RlbSh7XG4gICAgICAgIFwiaW1hZ2VzXCI6W1wibW90aGVyU2hpbmUucG5nXCJdLFxuICAgICAgICBcIm51bVBhcnRpY2xlc1wiOjUwLFxuICAgICAgICBcImVtaXNzaW9uc1BlclVwZGF0ZVwiOjEsXG4gICAgICAgIFwiZW1pc3Npb25zSW50ZXJ2YWxcIjoyLFxuICAgICAgICBcImFscGhhXCI6MSxcbiAgICAgICAgXCJwcm9wZXJ0aWVzXCI6IHtcbiAgICAgICAgICBcInJhbmRvbVNwYXduWFwiOjEsXG4gICAgICAgICAgXCJyYW5kb21TcGF3bllcIjoxLFxuICAgICAgICAgIFwibGlmZVwiOjMwLFxuICAgICAgICAgIFwicmFuZG9tTGlmZVwiOjEwMCxcbiAgICAgICAgICBcImZvcmNlWFwiOjAsXG4gICAgICAgICAgXCJmb3JjZVlcIjowLFxuICAgICAgICAgIFwicmFuZG9tRm9yY2VYXCI6MC4wMDEsXG4gICAgICAgICAgXCJyYW5kb21Gb3JjZVlcIjowLjAxLFxuICAgICAgICAgIFwidmVsb2NpdHlYXCI6MCxcbiAgICAgICAgICBcInZlbG9jaXR5WVwiOi0wLjAyLFxuICAgICAgICAgIFwicmFuZG9tVmVsb2NpdHlYXCI6MC4yLFxuICAgICAgICAgIFwicmFuZG9tVmVsb2NpdHlZXCI6MC40LFxuICAgICAgICAgIFwic2NhbGVcIjowLjEsXG4gICAgICAgICAgXCJncm93dGhcIjowLjAwMSxcbiAgICAgICAgICBcInJhbmRvbVNjYWxlXCI6MC4wNCxcbiAgICAgICAgICBcImFscGhhU3RhcnRcIjowLFxuICAgICAgICAgIFwiYWxwaGFGaW5pc2hcIjowLFxuICAgICAgICAgIFwiYWxwaGFSYXRpb1wiOjAuMixcbiAgICAgICAgICBcInRvcnF1ZVwiOjAsXG4gICAgICAgICAgXCJyYW5kb21Ub3JxdWVcIjowXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBwYXJ0aWNsZXMudmlldy5hbHBoYSA9IDAuNTtcbiAgICAgIHBhcnRpY2xlcy5wcm9wZXJ0aWVzLmNlbnRlclggKz0gc2VsZi52aWV3LndpZHRoIC8gMjtcbiAgICAgIHBhcnRpY2xlcy5wcm9wZXJ0aWVzLmNlbnRlclkgKz0gc2VsZi52aWV3LmhlaWdodCAvIDI7XG5cbiAgICAgIHNlbGYudmlldy5hZGRDaGlsZChwYXJ0aWNsZXMudmlldyk7XG4gICAgfVxuXG4gIH0pO1xuXG5cdHRoaXMudHJpZ2dlciA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghdHJpZ2dlcmVkKSB7XG4gICAgICBmYWRlT3V0U2hhcGUuYmVnaW5GaWxsKDB4MDAwKTtcbiAgICAgIGZhZGVPdXRTaGFwZS5kcmF3UmVjdCgwLCAwLCBnYW1lLnJlbmRlcmVyLndpZHRoLCBnYW1lLnJlbmRlcmVyLmhlaWdodCk7XG4gICAgICBjb250YWluZXIuYWRkQ2hpbGQoZmFkZU91dFNoYXBlKTtcbiAgICAgIGdhbWUucGxheWVyLmZhZGVPdXQoKTtcbiAgICAgIGdhbWUucmVzb3VyY2VzLnBvcnRhbFNvdW5kLnBsYXkoKTtcbiAgICAgIGdhbWUucmVzb3VyY2VzLmZvcmVzdFNvdW5kLnN0b3AoKTtcbiAgICB9XG4gICAgdHJpZ2dlcmVkID0gdHJ1ZTtcbiAgfVxuXG4gIHZhciBnYW1lb3ZlciA9IGZhbHNlO1xuICBzZWxmLmdhbWVvdmVyID0gZ2FtZW92ZXI7XG5cblx0dGhpcy51cGRhdGUgPSBmdW5jdGlvbihnYW1lKVxuXHR7XG4gICAgaWYoc2VsZi5nYW1lb3ZlcilcbiAgICAgIHJldHVybjtcblxuICAgIGlmIChwYXJ0aWNsZXMpIHtcbiAgICAgIHBhcnRpY2xlcy51cGRhdGUoKTtcbiAgICB9XG5cbiAgICBpZiAodHJpZ2dlcmVkKSB7XG5cbiAgICAgIGZhZGVPdXRTaGFwZS5hbHBoYSArPSAwLjAxO1xuICAgICAgaWYgKGZhZGVPdXRTaGFwZS5hbHBoYSA+PSAwLjcpIHtcbiAgICAgICAgZ2FtZS5zaG93RW5kU3RvcnkoKTtcbiAgICAgICAgc2VsZi5nYW1lb3ZlciA9IHRydWU7XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy9jb25zb2xlLmxvZyhnYW1lLnBsYXllci5kb0NvbGxpZGUoaXRlbURhdGEueCxpdGVtRGF0YS55LCBpdGVtRGF0YS53aWR0aCxpdGVtRGF0YS5oZWlnaHQpLGdhbWUuaW5wdXQuS2V5LmlzRG93bigzOCkpO1xuICAgICAgaWYoZ2FtZS5wbGF5ZXIuZG9Db2xsaWRlKGl0ZW1EYXRhLngsaXRlbURhdGEueSwgaXRlbURhdGEud2lkdGgsaXRlbURhdGEuaGVpZ2h0KSlcbiAgICAgICAge1xuICAgICAgICAgIGlmKGdhbWUubGV2ZWwubnVtU3dpdGNoZXMgPT0gMCkge1xuICAgICAgICAgICAgc2VsZi50cmlnZ2VyKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJ2YXIgVG9vbHMgPSByZXF1aXJlKCcuLi9Ub29scy5qcycpO1xudmFyIFBhcnRpY2xlU3lzdGVtID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9QYXJ0aWNsZVN5c3RlbS5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIExpZ2h0QmVoYXZpb3IoY29udGFpbmVyLCBkYXRhKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5uYW1lID0gXCJMaWdodEJlaGF2aW9yXCI7XG5cbiAgLy8vLy9yZXRyaXZlIHBvc2l0aW9uIGFuZCBzaXplIHNwZWNzXG4gIHZhciBzaXplID0gZGF0YS53aWR0aDtcbiAgdmFyIG9yaWdpblggPSBkYXRhLng7XG4gIHZhciBvcmlnaW5ZID0gZGF0YS55O1xuXG4gIHZhciBtb3ZpZSA9IG51bGw7XG5cbiAgbW92aWUgPSBuZXcgUElYSS5Nb3ZpZUNsaXAoVG9vbHMuZ2V0VGV4dHVyZXMoXCJtb3RoZXJcIiwgMTIsIFwiLnBuZ1wiKSk7XG4gIG1vdmllLnBpdm90ID0gbmV3IFBJWEkuUG9pbnQobW92aWUud2lkdGgvMiwgbW92aWUuaGVpZ2h0LzIgKyAyNSk7XG4gIG1vdmllLmFuaW1hdGlvblNwZWVkID0gMC4yO1xuXG4gIHRoaXMudmlldyA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcbiAgdGhpcy52aWV3LnBvc2l0aW9uLnggPSBvcmlnaW5YO1xuICB0aGlzLnZpZXcucG9zaXRpb24ueSA9IG9yaWdpblk7XG5cbiAgdGhpcy52aWV3LmFkZENoaWxkKG1vdmllKTtcblxuICBtb3ZpZS5wbGF5KCk7XG5cbiAgdmFyIGhhbG8gPSBQSVhJLlNwcml0ZS5mcm9tRnJhbWUoXCJoYWxvLnBuZ1wiKTtcbiAgaGFsby5hbmNob3IueCA9IDAuNTtcbiAgaGFsby5hbmNob3IueSA9IDAuNTtcbiAgaGFsby5zY2FsZS54ID0gMTA7XG4gIGhhbG8uc2NhbGUueSA9IDEwO1xuICBoYWxvLmFscGhhID0gMC4zO1xuICB0aGlzLnZpZXcuYWRkQ2hpbGQoaGFsbyk7XG5cbiAgbGlnaHQucG9zaXRpb24ueCA9IG9yaWdpblg7XG4gIGxpZ2h0LnBvc2l0aW9uLnkgPSBvcmlnaW5ZO1xuXG4gIHZhciBwYXJ0aWNsZXMgPSBuZXcgUGFydGljbGVTeXN0ZW0oXG4gIHtcbiAgICAgIFwiaW1hZ2VzXCI6W1wibW90aGVyU2hpbmUucG5nXCJdLFxuICAgICAgXCJudW1QYXJ0aWNsZXNcIjoxMDAsXG4gICAgICBcImVtaXNzaW9uc1BlclVwZGF0ZVwiOjEsXG4gICAgICBcImVtaXNzaW9uc0ludGVydmFsXCI6MixcbiAgICAgIFwiYWxwaGFcIjoxLFxuICAgICAgXCJwcm9wZXJ0aWVzXCI6XG4gICAgICB7XG4gICAgICAgIFwicmFuZG9tU3Bhd25YXCI6MSxcbiAgICAgICAgXCJyYW5kb21TcGF3bllcIjoxLFxuICAgICAgICBcImxpZmVcIjozMCxcbiAgICAgICAgXCJyYW5kb21MaWZlXCI6MTAwLFxuICAgICAgICBcImZvcmNlWFwiOjAsXG4gICAgICAgIFwiZm9yY2VZXCI6MCxcbiAgICAgICAgXCJyYW5kb21Gb3JjZVhcIjowLjAxLFxuICAgICAgICBcInJhbmRvbUZvcmNlWVwiOjAuMDEsXG4gICAgICAgIFwidmVsb2NpdHlYXCI6MCxcbiAgICAgICAgXCJ2ZWxvY2l0eVlcIjowLFxuICAgICAgICBcInJhbmRvbVZlbG9jaXR5WFwiOjAuMSxcbiAgICAgICAgXCJyYW5kb21WZWxvY2l0eVlcIjowLjEsXG4gICAgICAgIFwic2NhbGVcIjowLjEsXG4gICAgICAgIFwiZ3Jvd3RoXCI6MC4wMDEsXG4gICAgICAgIFwicmFuZG9tU2NhbGVcIjowLjA0LFxuICAgICAgICBcImFscGhhU3RhcnRcIjowLFxuICAgICAgICBcImFscGhhRmluaXNoXCI6MCxcbiAgICAgICAgXCJhbHBoYVJhdGlvXCI6MC4yLFxuICAgICAgICBcInRvcnF1ZVwiOjAsXG4gICAgICAgIFwicmFuZG9tVG9ycXVlXCI6MFxuICAgICAgfVxuICB9KTtcbiAgcGFydGljbGVzLnZpZXcuYWxwaGEgPSAwLjU7XG5cbiAgY29udGFpbmVyLmFkZENoaWxkKHBhcnRpY2xlcy52aWV3KTtcbiAgY29udGFpbmVyLmFkZENoaWxkKHRoaXMudmlldyk7XG5cbiAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbigpXG4gIHtcbiAgICAgIHNlbGYudmlldy5wb3NpdGlvbi54ID0gbGlnaHQucG9zaXRpb24ueDtcbiAgICAgIHNlbGYudmlldy5wb3NpdGlvbi55ID0gbGlnaHQucG9zaXRpb24ueTtcblxuICAgICAgcGFydGljbGVzLnByb3BlcnRpZXMuY2VudGVyWCA9IHNlbGYudmlldy5wb3NpdGlvbi54O1xuICAgICAgcGFydGljbGVzLnByb3BlcnRpZXMuY2VudGVyWSA9IHNlbGYudmlldy5wb3NpdGlvbi55IC0gMTA7XG4gICAgICBwYXJ0aWNsZXMudXBkYXRlKCk7XG5cbiAgICAgIHZhciBvcmllbnRhdGlvbiA9IGxpZ2h0LnBvc2l0aW9uLnggLSBnYW1lLnBsYXllci52aWV3LnBvc2l0aW9uLng7XG5cbiAgICAgIGlmIChvcmllbnRhdGlvbiA8IDApXG4gICAgICB7XG4gICAgICAgIG1vdmllLnNjYWxlLnggPSAtMTtcbiAgICAgIH1cbiAgICAgIGlmIChvcmllbnRhdGlvbiA+IDApXG4gICAgICB7XG4gICAgICAgIG1vdmllLnNjYWxlLnggPSAxO1xuICAgICAgfVxuICB9XG5cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gUGxhdGZvcm1CZWhhdmlvcihjb250YWluZXIsIHByb3BlcnRpZXMpIHtcblxuXHR2YXIgdmlldyA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcblx0dmlldy5wb3NpdGlvbi54ID0gcHJvcGVydGllcy54O1xuXHR2aWV3LnBvc2l0aW9uLnkgPSBwcm9wZXJ0aWVzLnk7XG5cblx0Y29udGFpbmVyLmFkZENoaWxkKHZpZXcpO1xuXG5cdHNldHVwU2tpbigpO1xuXG5cdGZ1bmN0aW9uIHNldHVwU2tpbigpXG5cdHtcblx0XHR2YXIgdyA9IDQwO1xuXHRcdHZhciBoID0gNDA7XG5cdFx0dmFyIGNvbHMgPSBNYXRoLmZsb29yKHByb3BlcnRpZXMud2lkdGgvdyk7XG5cdFx0dmFyIHJvd3MgPSBNYXRoLmZsb29yKHByb3BlcnRpZXMuaGVpZ2h0L2gpO1xuXHRcdHZhciBhbW91bnQgPSBjb2xzKnJvd3M7XG5cdFx0dmFyIHB4ID0gMDtcblx0XHR2YXIgcHkgPSAwO1xuXHRcdFxuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhbW91bnQ7IGkrKylcblx0XHR7XG5cdFx0XHRweCA9IGklY29scztcblx0XHRcdHB5ID0gTWF0aC5mbG9vcihpL2NvbHMpO1xuXHRcdFx0dmFyIHRleHR1cmVOYW1lID0gcHkgPT0gMCA/IFwidGlsZVdvb2QwMS5wbmdcIiA6IFwidGlsZVdvb2QwMi5wbmdcIjtcblx0XHRcdHZhciB0ZXh0dXJlID0gUElYSS5UZXh0dXJlLmZyb21JbWFnZSh0ZXh0dXJlTmFtZSk7XG5cdFx0XHR2YXIgdGlsZSA9IG5ldyBQSVhJLlNwcml0ZSh0ZXh0dXJlKTtcblx0XHRcdHRpbGUucG9zaXRpb24ueCA9IHB4Knc7XG5cdFx0XHR0aWxlLnBvc2l0aW9uLnkgPSBweSpoO1xuXHRcdFx0dmlldy5hZGRDaGlsZCh0aWxlKTtcblx0XHR9XHRcblx0fVxuXG5cdFxuXG5cdHRoaXMudXBkYXRlID0gZnVuY3Rpb24oKVxuXHR7XG5cblx0fVxuXG5cdHRoaXMudmlldyA9IHZpZXc7XG59XG4iLCJ2YXIgVHdlZW5hYmxlID0gcmVxdWlyZSgnLi4vdmVuZG9yL3NoaWZ0eScpO1xudmFyIFBhcnRpY2xlU3lzdGVtID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9QYXJ0aWNsZVN5c3RlbS5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIFN3aXRjaEJlaGF2aW9yKGNvbnRhaW5lciwgZGF0YSkge1xuXHR2YXIgc2VsZiA9IHRoaXMsXG4gICAgZ3JpZFNpemUgPSBkYXRhLnByb3BlcnRpZXMuc2l6ZSB8fCBkYXRhLmhlaWdodCxcbiAgICBtb3ZlWCA9IGRhdGEucHJvcGVydGllcy5tb3ZlWCAqIGdyaWRTaXplLFxuICAgIG1vdmVZID0gZGF0YS5wcm9wZXJ0aWVzLm1vdmVZICogZ3JpZFNpemUsXG4gICAgbGlnaHRPcmlnID0gZmFsc2UsXG4gICAgbGlnaHREZXN0ID0geyB4OiBkYXRhLnByb3BlcnRpZXMubW92ZVggKiBncmlkU2l6ZSwgeTogZGF0YS5wcm9wZXJ0aWVzLm1vdmVZICogZ3JpZFNpemUgfSxcbiAgICBpdGVtRGF0YSA9IGRhdGEsXG4gICAgbW92aW5nID0gZmFsc2UsXG4gICAgcHJlc3NlZCA9IGZhbHNlO1xuXG4gIC8vLy8vcmV0cml2ZSBwb3NpdGlvbiBhbmQgc2l6ZSBzcGVjc1xuICB2YXIgb3JpZ2luWCA9IGRhdGEueDtcbiAgdmFyIG9yaWdpblkgPSBkYXRhLnk7XG4gIHZhciBwcmVzc2VkID0gZmFsc2U7XG5cbiAgLy8vLy9jcmVhdGUgdmlzdWFsXG4gIHZhciB0ZXh0dXJlT2ZmID0gUElYSS5UZXh0dXJlLmZyb21JbWFnZShcInN3aXRjaE9mZi5wbmdcIik7XG4gIHZhciB0ZXh0dXJlT24gPSBQSVhJLlRleHR1cmUuZnJvbUltYWdlKFwic3dpdGNoT24ucG5nXCIpO1xuXG4gIHNlbGYudmlldyA9IG5ldyBQSVhJLlNwcml0ZSh0ZXh0dXJlT2ZmKTtcbiAgc2VsZi52aWV3LnBvc2l0aW9uLnggPSBvcmlnaW5YO1xuICBzZWxmLnZpZXcucG9zaXRpb24ueSA9IG9yaWdpblkgLSAyO1xuXG4gIHZhciBwYXJ0aWNsZXMgPSBuZXcgUGFydGljbGVTeXN0ZW0oXG4gIHtcbiAgICAgIFwiaW1hZ2VzXCI6W1wicGl4ZWxTaGluZS5wbmdcIl0sXG4gICAgICBcIm51bVBhcnRpY2xlc1wiOjMwLFxuICAgICAgXCJlbWlzc2lvbnNQZXJVcGRhdGVcIjoxLFxuICAgICAgXCJlbWlzc2lvbnNJbnRlcnZhbFwiOjEwLFxuICAgICAgXCJhbHBoYVwiOjEsXG4gICAgICBcInByb3BlcnRpZXNcIjpcbiAgICAgIHtcbiAgICAgICAgXCJyYW5kb21TcGF3blhcIjoyLFxuICAgICAgICBcInJhbmRvbVNwYXduWVwiOjEsXG4gICAgICAgIFwibGlmZVwiOjQwLFxuICAgICAgICBcInJhbmRvbUxpZmVcIjo1LFxuICAgICAgICBcImZvcmNlWFwiOjAsXG4gICAgICAgIFwiZm9yY2VZXCI6LTAuMDIsXG4gICAgICAgIFwicmFuZG9tRm9yY2VYXCI6MC4wLFxuICAgICAgICBcInJhbmRvbUZvcmNlWVwiOjAuMDEsXG4gICAgICAgIFwidmVsb2NpdHlYXCI6MCxcbiAgICAgICAgXCJ2ZWxvY2l0eVlcIjotMC4xLFxuICAgICAgICBcInJhbmRvbVZlbG9jaXR5WFwiOjAuMCxcbiAgICAgICAgXCJyYW5kb21WZWxvY2l0eVlcIjowLjAsXG4gICAgICAgIFwic2NhbGVcIjoxLFxuICAgICAgICBcImdyb3d0aFwiOi0wLjAwMSxcbiAgICAgICAgXCJyYW5kb21TY2FsZVwiOjAuNSxcbiAgICAgICAgXCJhbHBoYVN0YXJ0XCI6MSxcbiAgICAgICAgXCJhbHBoYUZpbmlzaFwiOjAsXG4gICAgICAgIFwiYWxwaGFSYXRpb1wiOjAuMixcbiAgICAgICAgXCJ0b3JxdWVcIjowLFxuICAgICAgICBcInJhbmRvbVRvcnF1ZVwiOjBcbiAgICAgIH1cbiAgfSk7XG5cbiAgY29udGFpbmVyLmFkZENoaWxkKHRoaXMudmlldyk7XG4gIGNvbnRhaW5lci5hZGRDaGlsZChwYXJ0aWNsZXMudmlldyk7XG4gIHBhcnRpY2xlcy5wcm9wZXJ0aWVzLmNlbnRlclkgPSBzZWxmLnZpZXcucG9zaXRpb24ueSArIDI1O1xuXG4gIHRoaXMudHJpZ2dlciA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIHdoZW4gcHJlc3NpbmcgZm9yIHRoZSBmaXJzdCB0aW1lLCB0aGUgb3JpbmFsIGxpZ2h0IHBvc2l0aW9uIGlzIHN0b3JlZCB0byByZXZlcnQuXG4gICAgLy8gaWYgKCFwcmVzc2VkICYmICFsaWdodE9yaWcpIHtcbiAgICAvLyAgIGxpZ2h0T3JpZyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkobGlnaHQucG9zaXRpb24pKTtcbiAgICAvLyB9XG5cbiAgICAvLyB2YXIgZGVzdCA9ICghcHJlc3NlZCkgPyBsaWdodERlc3QgOiBsaWdodE9yaWc7XG4gICAgLy8gcHJlc3NlZCA9ICFwcmVzc2VkO1xuXG4gICAgaWYgKCFwcmVzc2VkKVxuICAgIHtcbiAgICAgIHNlbGYudmlldy50ZXh0dXJlID0gdGV4dHVyZU9uO1xuICAgICAgc2VsZi52aWV3LnBvc2l0aW9uLnkgPSBvcmlnaW5ZICsgMTI7XG4gICAgICBwYXJ0aWNsZXMucHJvcGVydGllcy5jZW50ZXJZID0gc2VsZi52aWV3LnBvc2l0aW9uLnkgKyA5O1xuICAgICAgcHJlc3NlZCA9IHRydWU7XG4gICAgICBnYW1lLnJlc291cmNlcy5zd2ljaGVyU291bmQucGxheSgpO1xuICAgICAgY29udGFpbmVyLmFkZENoaWxkKHBhcnRpY2xlcy52aWV3KTtcbiAgICB9XG4gICAgLy8gZWxzZVxuICAgIC8vIHtcbiAgICAvLyAgIHNlbGYudmlldy50ZXh0dXJlID0gdGV4dHVyZU9mZjtcbiAgICAvLyB9XG5cbiAgICAvLyB2YXIgdHdlZW5hYmxlID0gbmV3IFR3ZWVuYWJsZSgpO1xuICAgIC8vIHR3ZWVuYWJsZS50d2Vlbih7XG4gICAgLy8gICBmcm9tOiBsaWdodC5wb3NpdGlvbixcbiAgICAvLyAgIHRvOiAgIGRlc3QsXG4gICAgLy8gICBkdXJhdGlvbjogMTAwMCxcbiAgICAvLyAgIGVhc2luZzogJ2Vhc2VPdXRDdWJpYycsXG4gICAgLy8gICBzdGFydDogZnVuY3Rpb24gKCkge1xuICAgIC8vICAgICBtb3ZpbmcgPSB0cnVlO1xuICAgIC8vICAgfSxcbiAgICAvLyAgIGZpbmlzaDogZnVuY3Rpb24gKCkge1xuICAgIC8vICAgICBtb3ZpbmcgPSBmYWxzZTtcbiAgICAvLyAgIH1cbiAgICAvLyB9KTtcbiAgfVxuXG5cdHRoaXMudXBkYXRlID0gZnVuY3Rpb24oZ2FtZSlcblx0e1xuICAgIGlmIChwcmVzc2VkKVxuICAgIHtcbiAgICAgICAgcGFydGljbGVzLnByb3BlcnRpZXMuY2VudGVyWCA9IHNlbGYudmlldy5wb3NpdGlvbi54ICsgMTU7XG4gICAgICAgIHBhcnRpY2xlcy51cGRhdGUoKTsgXG4gICAgfVxuICAgICAgXG4gICAgICBcbiAgICBcblxuICAgIGlmKHByZXNzZWQpXG4gICAgICByZXR1cm47XG5cblx0XHQvL2NvbnNvbGUubG9nKGdhbWUucGxheWVyLmRvQ29sbGlkZShpdGVtRGF0YS54LGl0ZW1EYXRhLnksIGl0ZW1EYXRhLndpZHRoLGl0ZW1EYXRhLmhlaWdodCksZ2FtZS5pbnB1dC5LZXkuaXNEb3duKDM4KSk7XG5cdFx0aWYoZ2FtZS5wbGF5ZXIuZG9Db2xsaWRlKGl0ZW1EYXRhLngsaXRlbURhdGEueSwgaXRlbURhdGEud2lkdGgsaXRlbURhdGEuaGVpZ2h0KSAmJiAhbW92aW5nKVxuXHRcdHtcblx0XHRcdG1vdmluZyA9IHRydWU7XG4gICAgICBnYW1lLmxldmVsLm51bVN3aXRjaGVzIC0tO1xuICAgICAgZW1pdHRlci5lbWl0KCdzd2l0Y2gucHJlc3NlZCcpO1xuXHRcdFx0c2VsZi50cmlnZ2VyKCk7XG5cdFx0fVxuXHR9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIFBhcnRpY2xlU3lzdGVtKHBhcnRpY2xlc0NvbmZpZylcbntcblx0dmFyIHZpZXcgPSBudWxsO1xuXHR2YXIgcHJvcGVydGllcyA9IG51bGw7XG5cdHZhciBmaXJzdFBhcnRpY2xlID0gbnVsbDtcblx0dmFyIGxhc3RQYXJ0aWNsZSA9IG51bGw7XG5cdHZhciBuZXh0UGFydGljbGUgPSAwO1xuXHR2YXIgY291bnQgPSAwO1xuXHR2YXIgbnVtUGFydGljbGVzID0gMjA7XG5cdHZhciBpbWFnZXMgPSBbXTtcblx0dmFyIHNlbGYgPSB0aGlzO1xuXHR2YXIgcGF1c2VkID0gZmFsc2U7XG5cblx0c2VsZi5lbWlzc2lvbnNJbnRlcnZhbCA9IDE7XG5cdHNlbGYuZW1pc3Npb25zUGVyVXBkYXRlID0gMTtcblxuXHRNYXRoLnJhbmRvbVJhbmdlID0gZnVuY3Rpb24obWluLCBtYXgsIHJvdW5kZWQpXG5cdHtcblx0XHR2YXIgZGlmZiA9IG1heCAtIG1pbjtcblx0XHR2YXIgcmVzdWx0ID0gbWluICsgZGlmZipNYXRoLnJhbmRvbSgpO1xuXHRcdGlmIChyb3VuZGVkKSByZXN1bHQgPSBNYXRoLnJvdW5kKHJlc3VsdCk7XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXG5cdGluaXQoKTtcblxuXHRmdW5jdGlvbiBpbml0KClcblx0e1xuXHRcdHZpZXcgPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG5cdFx0cHJvcGVydGllcyA9IG5ldyBQYXJ0aWNsZVByb3BlcnRpZXMoKTtcblx0XHRzZXR1cChwYXJ0aWNsZXNDb25maWcpO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0dXAoY29uZmlnKVxuXHR7XG5cdFx0Y2xlYXIoKTtcblxuXHRcdGlmIChjb25maWcubnVtUGFydGljbGVzICE9IG51bGwpIG51bVBhcnRpY2xlcyA9IGNvbmZpZy5udW1QYXJ0aWNsZXM7XG5cdFx0aWYgKGNvbmZpZy5pbWFnZXMgIT0gbnVsbCkgaW1hZ2VzID0gY29uZmlnLmltYWdlcztcblx0XHRpZiAoY29uZmlnLmVtaXNzaW9uc0ludGVydmFsICE9IG51bGwpIHNlbGYuZW1pc3Npb25zSW50ZXJ2YWwgPSBjb25maWcuZW1pc3Npb25zSW50ZXJ2YWw7XG5cdFx0aWYgKGNvbmZpZy5lbWlzc2lvbnNQZXJVcGRhdGUgIT0gbnVsbCkgc2VsZi5lbWlzc2lvbnNQZXJVcGRhdGUgPSBjb25maWcuZW1pc3Npb25zUGVyVXBkYXRlO1xuXHRcdGlmIChjb25maWcuYWxwaGEgIT0gbnVsbCkgdmlldy5hbHBoYSA9IGNvbmZpZy5hbHBoYTtcblxuXHRcdGlmIChjb25maWcucHJvcGVydGllcyAhPSBudWxsKSB7XG5cdFx0XHRmb3IgKHZhciBmaWVsZCBpbiBjb25maWcucHJvcGVydGllcykge1xuXHRcdFx0XHRwcm9wZXJ0aWVzW2ZpZWxkXSA9IGNvbmZpZy5wcm9wZXJ0aWVzW2ZpZWxkXTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR2YXIgaiA9IDA7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBudW1QYXJ0aWNsZXM7IGkrKykge1xuXHRcdFx0dmFyIHAgPSBuZXcgUGFydGljbGUoaW1hZ2VzW2pdKTtcblx0XHRcdHZpZXcuYWRkQ2hpbGQocC52aWV3KTtcblx0XHRcdGlmIChmaXJzdFBhcnRpY2xlID09IG51bGwpIGZpcnN0UGFydGljbGUgPSBwO1xuXHRcdFx0aWYgKGxhc3RQYXJ0aWNsZSAhPSBudWxsKSBsYXN0UGFydGljbGUubmV4dCA9IHA7XG5cdFx0XHRsYXN0UGFydGljbGUgPSBwO1xuXHRcdFx0aisrO1xuXHRcdFx0aWYgKGogPj0gaW1hZ2VzLmxlbmd0aCkgaiA9IDA7XG5cdFx0fVxuXG5cdFx0bmV4dFBhcnRpY2xlID0gZmlyc3RQYXJ0aWNsZTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNsZWFyKClcblx0e1xuXHRcdHZhciBwID0gZmlyc3RQYXJ0aWNsZTtcblx0XHR3aGlsZSAocCAhPSBudWxsKSB7XG5cdFx0XHRwLmRpc3Bvc2UoKTtcblx0XHRcdHAgPSBwLm5leHQ7XG5cdFx0fVxuXG5cdFx0Zmlyc3RQYXJ0aWNsZSA9IG51bGw7XG5cdFx0bGFzdFBhcnRpY2xlID0gbnVsbDtcblx0XHRuZXh0UGFydGljbGUgPSBudWxsO1xuXHR9XG5cblx0ZnVuY3Rpb24gdXBkYXRlKHRpbWVzdGFtcClcblx0e1xuXHRcdGlmIChjb3VudCA9PSAwICYmICFwYXVzZWQpIGVtaXQoc2VsZi5lbWlzc2lvbnNQZXJVcGRhdGUpO1xuXHRcdGNvdW50Kys7XG5cdFx0aWYgKGNvdW50ID09IHNlbGYuZW1pc3Npb25zSW50ZXJ2YWwpIGNvdW50ID0gMDtcblxuXHRcdHZhciBwID0gZmlyc3RQYXJ0aWNsZTtcblx0XHR3aGlsZSAocCAhPSBudWxsKSB7XG5cdFx0XHRpZiAocC5saXZpbmcpIHtcblx0XHRcdFx0cC51cGRhdGUodGltZXN0YW1wKTtcblx0XHRcdH1cblx0XHRcdHAgPSBwLm5leHQ7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gZW1pdChhbW91bnQpXG5cdHtcblx0XHR3aGlsZSAoYW1vdW50LS0pIHtcblx0XHRcdHZhciBwID0gbmV4dFBhcnRpY2xlO1xuXHRcdFx0aWYgKHAgPT0gbnVsbCkgcCA9IGZpcnN0UGFydGljbGU7XG5cdFx0XHRwLnNwYXduKHByb3BlcnRpZXMpO1xuXHRcdFx0bmV4dFBhcnRpY2xlID0gcC5uZXh0O1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGdldENvdW50KClcblx0e1xuXHRcdHJldHVybiBjb3VudDtcblx0fVxuXG5cdGZ1bmN0aW9uIHBhdXNlRW1pc3Npb25zKClcblx0e1xuXHRcdHBhdXNlZCA9IHRydWU7XG5cdH1cblxuXHRmdW5jdGlvbiByZXN1bWVFbWlzc2lvbnMoKVxuXHR7XG5cdFx0cGF1c2VkID0gZmFsc2U7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNwb3NlKClcblx0e1xuXHRcdGNsZWFyKCk7XG5cdFx0aWYgKHZpZXcgJiYgdmlldy5wYXJlbnQpIHZpZXcucGFyZW50LnJlbW92ZUNoaWxkKHZpZXcpO1xuXHRcdHZpZXcgPSBudWxsO1xuXHR9XG5cblx0dGhpcy5zZXR1cCA9IHNldHVwO1xuXHR0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzO1xuXHR0aGlzLnZpZXcgPSB2aWV3O1xuXHR0aGlzLnVwZGF0ZSA9IHVwZGF0ZTtcblx0dGhpcy5lbWl0ID0gZW1pdDtcblx0dGhpcy5nZXRDb3VudCA9IGdldENvdW50O1xuXHR0aGlzLnBhdXNlRW1pc3Npb25zID0gcGF1c2VFbWlzc2lvbnM7XG5cdHRoaXMucmVzdW1lRW1pc3Npb25zID0gcmVzdW1lRW1pc3Npb25zO1xuXHR0aGlzLmRpc3Bvc2UgPSBkaXNwb3NlO1xuXG59XG5cblx0Ly8gSU5URVJOQUwgQ0xBU1NFUyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdFBhcnRpY2xlID0gZnVuY3Rpb24oaW1hZ2UpXG5cdHtcblx0XHR2YXIgdmlldyA9IG51bGw7XG5cdFx0dmFyIHByb3BlcnRpZXMgPSBudWxsO1xuXHRcdHZhciBwYXJhbXMgPSBudWxsO1xuXHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdGluaXQoKTtcblxuXHRcdGZ1bmN0aW9uIGluaXQoKVxuXHRcdHtcblx0XHRcdHZpZXcgPSBQSVhJLlNwcml0ZS5mcm9tRnJhbWUoaW1hZ2UpO1xuXHRcdFx0dmlldy5hbmNob3IueCA9IDAuNTtcblx0XHRcdHZpZXcuYW5jaG9yLnkgPSAwLjU7XG5cdFx0XHRwcm9wZXJ0aWVzID0gbmV3IFBhcnRpY2xlUHJvcGVydGllcygpO1xuXHRcdFx0dmlldy52aXNpYmxlID0gZmFsc2U7XG5cblx0XHRcdHBhcmFtcyA9IHt9O1xuXHRcdFx0cGFyYW1zLmxpZmVDb3VudCA9IDA7XG5cdFx0XHRwYXJhbXMubGlmZVRvdGFsID0gMDtcblx0XHRcdHBhcmFtcy5hbHBoYVRpbWUgPSAwLjA7XG5cdFx0XHRwYXJhbXMuZmFkZUluRXZvbHV0aW9uID0gMC4wO1xuXHRcdFx0cGFyYW1zLmZhZGVPdXRFdm9sdXRpb24gPSAwLjA7XG5cdFx0XHRwYXJhbXMuc3RlcFRvU3RhcnRGYWRlT3V0ID0gMDtcblxuXHRcdFx0cHJvcGVydGllcyA9IHt9O1xuXHRcdH1cblxuXHRcdHRoaXMubGl2aW5nID0gZmFsc2U7XG5cdFx0dGhpcy5uZXh0ID0gbnVsbDtcblx0XHR0aGlzLnZpZXcgPSB2aWV3O1xuXHRcdHRoaXMucHJvcGVydGllcyA9IHByb3BlcnRpZXM7XG5cdFx0dGhpcy5wYXJhbXMgPSBwYXJhbXM7XG5cdH1cblxuXHRQYXJ0aWNsZS5wcm90b3R5cGUuc3Bhd24gPSBmdW5jdGlvbihuZXdQcm9wZXJ0aWVzKVxuXHR7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdHZhciBwcm9wZXJ0aWVzID0gdGhpcy5wcm9wZXJ0aWVzO1xuXHRcdHZhciBwYXJhbXMgPSB0aGlzLnBhcmFtcztcblx0XHR2YXIgdmlldyA9IHRoaXMudmlldztcblxuXHRcdGZvciAodmFyIGZpZWxkIGluIG5ld1Byb3BlcnRpZXMpIHtcblx0XHRcdHByb3BlcnRpZXNbZmllbGRdID0gbmV3UHJvcGVydGllc1tmaWVsZF07XG5cdFx0fVxuXG5cdFx0dGhpcy5saXZpbmcgPSB0cnVlO1xuXG5cdFx0cGFyYW1zLmxpZmVDb3VudCA9IHByb3BlcnRpZXMubGlmZSArIE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSpwcm9wZXJ0aWVzLnJhbmRvbUxpZmUpO1xuXHRcdHBhcmFtcy5saWZlVG90YWwgPSBwYXJhbXMubGlmZUNvdW50O1xuXG5cdFx0dmlldy52aXNpYmxlID0gdHJ1ZTtcblx0XHR2aWV3LnBvc2l0aW9uLnggPSBwcm9wZXJ0aWVzLmNlbnRlclggKyBNYXRoLnJhbmRvbVJhbmdlKC1wcm9wZXJ0aWVzLnJhbmRvbVNwYXduWCwgcHJvcGVydGllcy5yYW5kb21TcGF3blgpO1xuXHRcdHZpZXcucG9zaXRpb24ueSA9IHByb3BlcnRpZXMuY2VudGVyWSArIE1hdGgucmFuZG9tUmFuZ2UoLXByb3BlcnRpZXMucmFuZG9tU3Bhd25ZLCBwcm9wZXJ0aWVzLnJhbmRvbVNwYXduWSk7XG5cdFx0dmlldy5zY2FsZS54ID0gdmlldy5zY2FsZS55ID0gcHJvcGVydGllcy5zY2FsZTtcblx0XHR2aWV3LmFscGhhID0gcHJvcGVydGllcy5hbHBoYVN0YXJ0O1xuXG5cdFx0aWYgKHByb3BlcnRpZXMucmFuZG9tVmVsb2NpdHlYICE9IDApIHtcblx0XHRcdHByb3BlcnRpZXMudmVsb2NpdHlYICs9IE1hdGgucmFuZG9tUmFuZ2UoLXByb3BlcnRpZXMucmFuZG9tVmVsb2NpdHlYLCBwcm9wZXJ0aWVzLnJhbmRvbVZlbG9jaXR5WCk7XG5cdFx0fVxuXG5cdFx0aWYgKHByb3BlcnRpZXMucmFuZG9tVmVsb2NpdHlZICE9IDApIHtcblx0XHRcdHByb3BlcnRpZXMudmVsb2NpdHlZICs9IE1hdGgucmFuZG9tUmFuZ2UoLXByb3BlcnRpZXMucmFuZG9tVmVsb2NpdHlZLCBwcm9wZXJ0aWVzLnJhbmRvbVZlbG9jaXR5WSk7XG5cdFx0fVxuXG5cdFx0aWYgKHByb3BlcnRpZXMucmFuZG9tRm9yY2VYICE9IDApIHtcblx0XHRcdHByb3BlcnRpZXMuZm9yY2VYICs9IE1hdGgucmFuZG9tUmFuZ2UoLXByb3BlcnRpZXMucmFuZG9tRm9yY2VYLCBwcm9wZXJ0aWVzLnJhbmRvbUZvcmNlWCk7XG5cdFx0fVxuXG5cdFx0aWYgKHByb3BlcnRpZXMucmFuZG9tRm9yY2VZICE9IDApIHtcblx0XHRcdHByb3BlcnRpZXMuZm9yY2VZICs9IE1hdGgucmFuZG9tUmFuZ2UoLXByb3BlcnRpZXMucmFuZG9tRm9yY2VZLCBwcm9wZXJ0aWVzLnJhbmRvbUZvcmNlWSk7XG5cdFx0fVxuXG5cdFx0aWYgKHByb3BlcnRpZXMucmFuZG9tU2NhbGUgIT0gMCkge1xuXHRcdFx0dmlldy5zY2FsZS54ID0gdmlldy5zY2FsZS55ID0gcHJvcGVydGllcy5zY2FsZSArIE1hdGgucmFuZG9tUmFuZ2UoLXByb3BlcnRpZXMucmFuZG9tU2NhbGUsIHByb3BlcnRpZXMucmFuZG9tU2NhbGUpO1xuXHRcdH1cblxuXHRcdGlmIChwcm9wZXJ0aWVzLnJhbmRvbVRvcnF1ZSAhPSAwKSB7XG5cdFx0XHRwcm9wZXJ0aWVzLnRvcnF1ZSArPSBNYXRoLnJhbmRvbVJhbmdlKC1wcm9wZXJ0aWVzLnJhbmRvbVRvcnF1ZSwgcHJvcGVydGllcy5yYW5kb21Ub3JxdWUpO1xuXHRcdH1cblxuXHRcdHBhcmFtcy5hbHBoYVRpbWUgPSBNYXRoLnJvdW5kKHBhcmFtcy5saWZlQ291bnQqcHJvcGVydGllcy5hbHBoYVJhdGlvKTtcblx0XHRwYXJhbXMuZmFkZUluRXZvbHV0aW9uID0gKDEuMCAtIHByb3BlcnRpZXMuYWxwaGFTdGFydCkvcGFyYW1zLmFscGhhVGltZTtcblx0XHRwYXJhbXMuZmFkZU91dEV2b2x1dGlvbiA9ICgxLjAgLSBwcm9wZXJ0aWVzLmFscGhhRmluaXNoKS9wYXJhbXMuYWxwaGFUaW1lO1xuXHRcdHBhcmFtcy5zdGVwVG9TdGFydEZhZGVPdXQgPSBwYXJhbXMuYWxwaGFUaW1lO1xuXHR9XG5cblx0UGFydGljbGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKHRpbWVzdGFtcClcblx0e1xuXHRcdHZhciBzZWxmID0gdGhpcztcblx0XHR2YXIgcHJvcGVydGllcyA9IHRoaXMucHJvcGVydGllcztcblx0XHR2YXIgcGFyYW1zID0gdGhpcy5wYXJhbXM7XG5cdFx0dmFyIHZpZXcgPSB0aGlzLnZpZXc7XG5cblx0XHRpZiAoIXNlbGYubGl2aW5nKSByZXR1cm47XG5cblx0XHR2aWV3LnBvc2l0aW9uLnggKz0gcHJvcGVydGllcy52ZWxvY2l0eVg7XG5cdFx0dmlldy5wb3NpdGlvbi55ICs9IHByb3BlcnRpZXMudmVsb2NpdHlZO1xuXHRcdHZpZXcucm90YXRpb24gKz0gcHJvcGVydGllcy50b3JxdWU7XG5cdFx0cHJvcGVydGllcy52ZWxvY2l0eVggKz0gcHJvcGVydGllcy5mb3JjZVg7XG5cdFx0cHJvcGVydGllcy52ZWxvY2l0eVkgKz0gcHJvcGVydGllcy5mb3JjZVk7XG5cblx0XHRpZiAocGFyYW1zLmxpZmVDb3VudCA+IHBhcmFtcy5saWZlVG90YWwgLSBwYXJhbXMuYWxwaGFUaW1lKSB7XG5cdCAgICBcdHZpZXcuYWxwaGEgKz0gcGFyYW1zLmZhZGVJbkV2b2x1dGlvbjtcblx0ICAgIFx0aWYgKHZpZXcuYWxwaGEgPiAxKSB2aWV3LmFscGhhID0gMTtcblx0ICAgIH1cblxuXHQgICAgaWYgKHBhcmFtcy5saWZlQ291bnQgPD0gcGFyYW1zLmFscGhhVGltZSkge1xuXHQgICAgXHR2aWV3LmFscGhhIC09IHBhcmFtcy5mYWRlT3V0RXZvbHV0aW9uO1xuXHQgICAgXHRpZiAodmlldy5hbHBoYSA8IDApIHZpZXcuYWxwaGEgPSAwO1xuXHQgICAgfVxuXG5cdCAgICBpZiAocHJvcGVydGllcy5ncm93dGggIT0gMCkge1xuXHQgICAgXHR2aWV3LnNjYWxlLnggPSB2aWV3LnNjYWxlLnkgPSAodmlldy5zY2FsZS54ICsgcHJvcGVydGllcy5ncm93dGgpO1xuXHQgICAgfVxuXG5cdFx0cGFyYW1zLmxpZmVDb3VudC0tO1xuXHRcdGlmIChwYXJhbXMubGlmZUNvdW50IDw9IDApIHRoaXMuZGllKCk7XG5cdH1cblxuXHRQYXJ0aWNsZS5wcm90b3R5cGUuZGllID0gZnVuY3Rpb24oKVxuXHR7XG5cdFx0dGhpcy5saXZpbmcgPSBmYWxzZTtcblx0XHR0aGlzLnZpZXcudmlzaWJsZSA9IGZhbHNlO1xuXHRcdHRoaXMudmlldy5hbHBoYSA9IDA7XG5cdH1cblxuXHRQYXJ0aWNsZS5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uKClcblx0e1xuXHRcdGlmICh0aGlzLnZpZXcgPT0gbnVsbCkgcmV0dXJuO1xuXHRcdGlmICh0aGlzLnZpZXcucGFyZW50KSB0aGlzLnZpZXcucGFyZW50LnJlbW92ZUNoaWxkKHRoaXMudmlldyk7XG5cblx0XHR0aGlzLmxpdmluZyA9IGZhbHNlO1xuXHRcdHRoaXMubmV4dCA9IG51bGw7XG5cdFx0dGhpcy52aWV3ID0gbnVsbDtcblx0XHR0aGlzLnByb3BlcnRpZXMgPSBudWxsO1xuXHRcdHRoaXMucGFyYW1zID0gbnVsbDtcblx0fVxuXG5cdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0UGFydGljbGVQcm9wZXJ0aWVzID0gZnVuY3Rpb24oKVxuXHR7XG5cdFx0dGhpcy5yYW5kb21TcGF3blggPSAwO1xuXHRcdHRoaXMucmFuZG9tU3Bhd25ZID0gMDtcblx0XHR0aGlzLmxpZmUgPSA2MDtcblx0XHR0aGlzLnJhbmRvbUxpZmUgPSAwO1xuXHRcdHRoaXMuY2VudGVyWCA9IDA7XG5cdFx0dGhpcy5jZW50ZXJZID0gMDtcblx0XHR0aGlzLmZvcmNlWCA9IDA7XG5cdFx0dGhpcy5mb3JjZVkgPSAwO1xuXHRcdHRoaXMucmFuZG9tRm9yY2VYID0gMDtcblx0XHR0aGlzLnJhbmRvbUZvcmNlWSA9IDA7XG5cdFx0dGhpcy52ZWxvY2l0eVggPSAwO1xuXHRcdHRoaXMudmVsb2NpdHlZID0gMDtcblx0XHR0aGlzLnJhbmRvbVZlbG9jaXR5WCA9IDA7XG5cdFx0dGhpcy5yYW5kb21WZWxvY2l0eVkgPSAwO1xuXHRcdHRoaXMuc2NhbGUgPSAxO1xuXHRcdHRoaXMuZ3Jvd3RoID0gMC4wO1xuXHRcdHRoaXMucmFuZG9tU2NhbGUgPSAwO1xuXHRcdHRoaXMuYWxwaGFTdGFydCA9IDA7XG5cdFx0dGhpcy5hbHBoYUZpbmlzaCA9IDA7XG5cdFx0dGhpcy5hbHBoYVJhdGlvID0gMC4xO1xuXHRcdHRoaXMudG9ycXVlID0gMDtcblx0XHR0aGlzLnJhbmRvbVRvcnF1ZSA9IDA7XG5cdH1cbiIsInZhciBSZXNvdXJjZXMgPSByZXF1aXJlKCcuL1Jlc291cmNlcycpLFxuICBQcmVsb2FkZXIgPSByZXF1aXJlKCcuL1ByZWxvYWRlcicpLFxuICBMZXZlbCA9IHJlcXVpcmUoJy4vTGV2ZWwnKSxcbiAgQmVnaW4gPSByZXF1aXJlKCcuL0JlZ2luJyksXG4gIExldmVsRW5kID0gcmVxdWlyZSgnLi9MZXZlbEVuZCcpLFxuICBHYW1lT3ZlciA9IHJlcXVpcmUoJy4vR2FtZU92ZXInKSxcbiAgTGlnaHQgPSByZXF1aXJlKCcuL0xpZ2h0JyksXG4gIFR3ZWVuYWJsZSA9IHJlcXVpcmUoJy4vdmVuZG9yL3NoaWZ0eScpLFxuICBHYW1lSW5wdXQgPSByZXF1aXJlKCcuL0dhbWVJbnB1dC5qcycpLFxuICBQbGF5ZXIgPSByZXF1aXJlKCcuL1BsYXllci5qcycpO1xuICBQaHlzaWNzID0gcmVxdWlyZSgnLi9QaHlzaWNzLmpzJyk7XG4gIFRvb2xzID0gcmVxdWlyZSgnLi9Ub29scy5qcycpO1xuXG53aW5kb3cuVHdlZW5hYmxlID0gVHdlZW5hYmxlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIEdhbWUoKSB7XG4gIHRoaXMucmVzb3VyY2VzID0gbmV3IFJlc291cmNlcygpO1xuXG4gIC8vIHN0YWdlLmNsaWNrID0gZnVuY3Rpb24oZSkge1xuICAvLyAgIGxpZ2h0LnggPSBlLm9yaWdpbmFsRXZlbnQueDtcbiAgLy8gICBsaWdodC55ID0gZS5vcmlnaW5hbEV2ZW50Lnk7XG4gIC8vIH1cblxuICB3aW5kb3cuc2NyZWVuV2lkdGggPSAodHlwZW9mKGVqZWN0YSk9PVwidW5kZWZpbmVkXCIpID8gOTYwIDogNDgwO1xuICB3aW5kb3cuc2NyZWVuSGVpZ2h0ID0gKHR5cGVvZihlamVjdGEpPT1cInVuZGVmaW5lZFwiKSA/IDY0MCA6IDMyMDtcblxuICB0aGlzLnJlbmRlcmVyID0gbmV3IFBJWEkuQ2FudmFzUmVuZGVyZXIoc2NyZWVuV2lkdGgsIHNjcmVlbkhlaWdodCwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpLCBmYWxzZSAvKiB0cmFuc3BhcmVudCAqLywgZmFsc2UgLyogYW50aWFsaWFzICovKTtcbiAgdGhpcy5yZW5kZXJlci52aWV3LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gIHRoaXMucmVuZGVyZXIudmlldy5zdHlsZS5ib3JkZXIgPSBcIjFweCBzb2xpZFwiO1xuXG4gIHRoaXMuc3RhZ2UgPSBuZXcgUElYSS5TdGFnZSgweDAwZmZmYSwgdHJ1ZSk7XG5cbiAgLy8vL0lucHV0XG4gIHZhciBpbnB1dCA9IG51bGw7XG5cbiAgLy8vLy9QbGF5ZXJcbiAgdmFyIHBsYXllciA9IG51bGw7XG4gIHZhciBwaHlzaWNzID0gbnVsbDtcbiAgdmFyIGRpcmVjdGlvbiA9IDA7XG4gIHZhciBnbG93ID0gbnVsbDtcblxuICAvLyBMZXZlbEluZGV4XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGxldmVsID0gbnVsbDtcbiAgdmFyIGxvc3QgPSBmYWxzZTtcbiAgdmFyIGdhbWVSdW5uaW5nID0gZmFsc2U7XG4gIHdpbmRvdy5saWdodCA9IG5ldyBMaWdodCg1MCwgNTApO1xuXG4gIHNlbGYubGV2ZWwgPSBsZXZlbDtcblxuICB2YXIgbGFzdE1vdXNlQ2xpY2sgPSAwLFxuICAgICAgbW91c2VDbGlja0ludGVydmFsID0gMTAwMDsgLy8gMSBzZWNvbmQgdG8gY2xpY2sgYWdhaW5cblxuICB0aGlzLnJlbmRlcmVyLnZpZXcuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBmdW5jdGlvbihlKSB7XG4gICAgLy8gcHJldmVudCBjbGljayBvbiBmaXJzdCBsZXZlbFxuICAgIC8vIGlmICghc2VsZi5sZXZlbCkgeyByZXR1cm47IH1cblxuICAgIHZhciBjbGlja1RpbWUgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuXG4gICAgaWYgKGxhc3RNb3VzZUNsaWNrICsgbW91c2VDbGlja0ludGVydmFsID49IGNsaWNrVGltZSkge1xuICAgICAgLy8gZGlzc2FsbG93ZWRcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsYXN0TW91c2VDbGljayA9IGNsaWNrVGltZTtcblxuICAgIC8vIGxpZ2h0LnBvc2l0aW9uLnggPSBlLm9mZnNldFg7XG4gICAgLy8gbGlnaHQucG9zaXRpb24ueSA9IGUub2Zmc2V0WTtcblxuICAgIGlmIChzZWxmLmJ0blNvdW5kT24udmlzaWJsZSA9PT0gdHJ1ZSkge1xuICAgICAgaWYgKGUub2Zmc2V0WCA+PSBzZWxmLmJ0blNvdW5kT24ueCAmJiBlLm9mZnNldFggPCBzZWxmLmJ0blNvdW5kT24ueCArIHNlbGYuYnRuU291bmRPbi53aWR0aFxuICAgICAgICAmJiBlLm9mZnNldFkgPj0gc2VsZi5idG5Tb3VuZE9uLnkgJiYgZS5vZmZzZXRZIDwgc2VsZi5idG5Tb3VuZE9uLnkgKyBzZWxmLmJ0blNvdW5kT24uaGVpZ2h0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2VsZi5idG5Tb3VuZE9mZi52aXNpYmxlID09PSB0cnVlKSB7XG4gICAgICBpZiAoZS5vZmZzZXRYID49IHNlbGYuYnRuU291bmRPZmYueCAmJiBlLm9mZnNldFggPCBzZWxmLmJ0blNvdW5kT2ZmLnggKyBzZWxmLmJ0blNvdW5kT2ZmLndpZHRoXG4gICAgICAgICYmIGUub2Zmc2V0WSA+PSBzZWxmLmJ0blNvdW5kT2ZmLnkgJiYgZS5vZmZzZXRZIDwgc2VsZi5idG5Tb3VuZE9mZi55ICsgc2VsZi5idG5Tb3VuZE9mZi5oZWlnaHQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzZWxmLmJ0blJlc3RhcnQudmlzaWJsZSA9PT0gdHJ1ZSkge1xuICAgICAgaWYgKGUub2Zmc2V0WCA+PSBzZWxmLmJ0blJlc3RhcnQueCAmJiBlLm9mZnNldFggPCBzZWxmLmJ0blJlc3RhcnQueCArIHNlbGYuYnRuUmVzdGFydC53aWR0aFxuICAgICAgICAmJiBlLm9mZnNldFkgPj0gc2VsZi5idG5SZXN0YXJ0LnkgJiYgZS5vZmZzZXRZIDwgc2VsZi5idG5SZXN0YXJ0LnkgKyBzZWxmLmJ0blJlc3RhcnQuaGVpZ2h0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2VsZi5sZXZlbCAhPT0gbnVsbCkge1xuICAgICAgZ2FtZS5yZXNvdXJjZXMubW90aGVyU291bmQucGxheSgpO1xuICAgIH1cblxuICAgIHZhciBkZXN0ID0geyB4OmUub2Zmc2V0WCwgeTplLm9mZnNldFkgfTtcbiAgICB2YXIgdHdlZW5hYmxlID0gbmV3IFR3ZWVuYWJsZSgpO1xuICAgIHR3ZWVuYWJsZS50d2Vlbih7XG4gICAgICBmcm9tOiBsaWdodC5wb3NpdGlvbixcbiAgICAgIHRvOiAgIGRlc3QsXG4gICAgICBkdXJhdGlvbjogbW91c2VDbGlja0ludGVydmFsLFxuICAgICAgZWFzaW5nOiAnZWFzZU91dEN1YmljJyxcbiAgICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG1vdmluZyA9IHRydWU7XG4gICAgICB9LFxuICAgICAgZmluaXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG1vdmluZyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9KVxuXG4gIHZhciBsaWdodEdyYXBoaWNzID0gbmV3IFBJWEkuR3JhcGhpY3MoKSxcbiAgbGlnaHRDb250YWluZXIgPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG5cbiAgdGhpcy5yZXN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coJ0dhbWUuanMgLSB0aGlzLnJlc3RhcnQoKScpO1xuICAgIHZhciBpID0gc2VsZi5sZXZlbC5pbmRleDtcbiAgICBzZWxmLmxldmVsLmRpc3Bvc2UoKTtcbiAgICB0aGlzLmxvYWRMZXZlbChpKTtcbiAgfVxuXG4gIHRoaXMubmV4dExldmVsID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coJ0dhbWUuanMgLSB0aGlzLm5leHRMZXZlbCgpJyk7XG4gICAgdGhpcy5sb2FkTGV2ZWwodGhpcy5sZXZlbC5pbmRleCArIDEpO1xuICB9XG5cbiAgdGhpcy5zZXRMZXZlbCA9IGZ1bmN0aW9uKGxldmVsRGF0YSwgbGV2ZWxJbmRleCkge1xuICAgIHZhciBoID0gc2VsZi5yZW5kZXJlci5oZWlnaHQgKyA4MCxcbiAgICAgICAgdyA9IHNlbGYucmVuZGVyZXIud2lkdGgsXG4gICAgICAgIGZyYW1lQm9yZGVyID0gNTA7XG5cbiAgICB2YXIgbmV3TGV2ZWwgPSBuZXcgTGV2ZWwoc2VsZiwgbGV2ZWxJbmRleCk7XG5cbiAgICAvLyBhZGQgc3RhZ2UgYm9yZGVyIHRvIGxldmVsIHNlZ21lbnRzXG4gICAgbmV3TGV2ZWwuc2VnbWVudHMudW5zaGlmdCgge2E6e3g6LWZyYW1lQm9yZGVyLHk6LWZyYW1lQm9yZGVyfSwgYjp7eDp3LHk6LWZyYW1lQm9yZGVyfX0gKTtcbiAgICBuZXdMZXZlbC5zZWdtZW50cy51bnNoaWZ0KCB7YTp7eDp3LHk6LWZyYW1lQm9yZGVyfSwgYjp7eDp3LHk6aH19ICk7XG4gICAgbmV3TGV2ZWwuc2VnbWVudHMudW5zaGlmdCgge2E6e3g6dyx5Omh9LCBiOnt4Oi1mcmFtZUJvcmRlcix5Omh9fSApO1xuICAgIG5ld0xldmVsLnNlZ21lbnRzLnVuc2hpZnQoIHthOnt4Oi1mcmFtZUJvcmRlcix5Omh9LCBiOnt4Oi1mcmFtZUJvcmRlcix5Oi1mcmFtZUJvcmRlcn19ICk7XG5cbiAgICBuZXdMZXZlbC5wYXJzZShsZXZlbERhdGEpO1xuXG4gICAgc2VsZi5sZXZlbCA9IG5ld0xldmVsO1xuICAgIHNlbGYuc3RhZ2UuYWRkQ2hpbGRBdChzZWxmLmxldmVsLnZpZXcsIDApO1xuXG4gICAgbGlnaHQuc2V0U2VnbWVudHMobmV3TGV2ZWwuc2VnbWVudHMpO1xuXG4gICAgLy8gYWRkIGxldmVsIGNvbnRhaW5lciB0byBzdGFnZS5cbiAgICBnYW1lLnN0YWdlLmFkZENoaWxkKG5ld0xldmVsLmNvbnRhaW5lcik7XG5cbiAgICAvLyByZS1jcmVhdGUgdGhlIHBsYXllclxuICAgIHBsYXllciA9IG5ldyBQbGF5ZXIobmV3TGV2ZWwuY29udGFpbmVyLCBuZXdMZXZlbC5wbGF5ZXJQb3MueCxuZXdMZXZlbC5wbGF5ZXJQb3MueSk7XG4gICAgcGh5c2ljcy5wbGF5ZXJQb3NpdGlvbi54ID0gcGxheWVyLnZpZXcucG9zaXRpb24ueDtcbiAgICBwaHlzaWNzLnBsYXllclBvc2l0aW9uLnkgPSBwbGF5ZXIudmlldy5wb3NpdGlvbi55O1xuXG4gICAgY29uc29sZS5sb2cobmV3TGV2ZWwucGxheWVyUG9zLnggKyBcIiBcIiArIG5ld0xldmVsLnBsYXllclBvcy55KTtcbiAgICBzZWxmLnBsYXllciA9IHBsYXllcjtcblxuICAgIHNlbGYubG9vcCgpO1xuICAgIHNlbGYuc3RhZ2UuYWRkQ2hpbGQoZ2xvdyk7XG4gIH07XG5cbiAgdGhpcy5sb2FkTGV2ZWwgPSBmdW5jdGlvbihsZXZlbEluZGV4KSB7XG4gICAgaWYoIWlucHV0KVxuICAgIHtcbiAgICAgIGlucHV0ID0gbmV3IEdhbWVJbnB1dCgpO1xuICAgICAgc2VsZi5pbnB1dCA9IGlucHV0O1xuICAgIH1cblxuICAgIGlmICghcGh5c2ljcyl7XG4gICAgICBwaHlzaWNzID0gbmV3IFBoeXNpY3MoKTtcbiAgICB9XG5cbiAgICAvLyBsZXZlbEluZGV4ID0gMjtcbiAgICBjb25zb2xlLmxvZyhcImxldmVsL2xldmVsXCIgKyBsZXZlbEluZGV4ICsgXCIuanNvblwiKTtcbiAgICB2YXIgcGl4aUxvYWRlciA9IG5ldyBQSVhJLkpzb25Mb2FkZXIoXCJsZXZlbC9sZXZlbFwiICsgbGV2ZWxJbmRleCArIFwiLmpzb25cIik7XG4gICAgcGl4aUxvYWRlci5vbignbG9hZGVkJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAvL2RhdGEgaXMgaW4gZXZ0LmNvbnRlbnQuanNvblxuICAgICAgY29uc29sZS5sb2coXCJqc29uIGxvYWRlZCFcIik7XG4gICAgICBzZWxmLnNldExldmVsKGV2dC5jb250ZW50Lmpzb24sIGxldmVsSW5kZXgpO1xuICAgICAgZ2FtZVJ1bm5pbmcgPSB0cnVlO1xuICAgICAgbG9zdCA9IGZhbHNlO1xuICAgIH0pO1xuXG4gICAgcGl4aUxvYWRlci5sb2FkKCk7XG4gIH1cblxuICB2YXIgbGFzdExpZ2h0WCwgbGFzdExpZ2h0WTtcblxuICB0aGlzLnVwZGF0ZUxpZ2h0cyA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIG5vdGhpbmcgdG8gdXBkYXRlLCBza2lwXG5cbiAgICBpZiAobGlnaHQucG9zaXRpb24ueCA9PSBsYXN0TGlnaHRYICYmIGxpZ2h0LnBvc2l0aW9uLnkgPT0gbGFzdExpZ2h0WSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEZJWE1FXG4gICAgaWYgKGxpZ2h0LnNlZ21lbnRzLmxlbmd0aCA9PSAwIHx8ICF0aGlzLmxldmVsIHx8IHRoaXMubGV2ZWwuc2VnbWVudHMubGVuZ3RoID09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsaWdodEdyYXBoaWNzLmNsZWFyKCk7XG5cbiAgICAvLyByZW1vdmUgcHJldmlvdXMgYWRkZWQgbGlnaHQgaXRlbXNcbiAgICBpZiAobGlnaHRDb250YWluZXIuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgbGlnaHRDb250YWluZXIucmVtb3ZlQ2hpbGRyZW4oKTtcbiAgICB9XG5cbiAgICAvLyBTaWdodCBQb2x5Z29uc1xuICAgIHZhciBwb2x5Z29ucyA9IGxpZ2h0LmdldFNpZ2h0UG9seWdvbnMoKTtcblxuICAgIC8vIERSQVcgQVMgQSBHSUFOVCBQT0xZR09OXG5cbiAgICB2YXIgdmVydGljZXMgPSBwb2x5Z29uc1swXTtcbiAgICB3aW5kb3cucG9seWdvbnMgPSBwb2x5Z29uc1swXTtcblxuICAgIC8vIGxpZ2h0R3JhcGhpY3MuY2xlYXIoKTtcbiAgICAvLyBsaWdodEdyYXBoaWNzLmJlZ2luRmlsbCgweEZGRkZGRik7XG4gICAgLy8gbGlnaHRHcmFwaGljcy5tb3ZlVG8odmVydGljZXNbMF0ueCwgdmVydGljZXNbMF0ueSk7XG4gICAgLy8gZm9yICh2YXIgaSA9IDE7IGk8dmVydGljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAvLyAgIHZhciB2ID0gdmVydGljZXNbaV07XG4gICAgLy8gICBsaWdodEdyYXBoaWNzLmxpbmVUbyh2LngsIHYueSk7XG4gICAgLy8gfVxuICAgIC8vIGxpZ2h0R3JhcGhpY3MuZW5kRmlsbCgpO1xuXG4gICAgbGlnaHRHcmFwaGljcy5jbGVhcigpO1xuICAgIGxpZ2h0R3JhcGhpY3MuYmVnaW5GaWxsKDB4RkZGRkZGKTtcbiAgICBsaWdodEdyYXBoaWNzLm1vdmVUbyh2ZXJ0aWNlc1swXS54LCB2ZXJ0aWNlc1swXS55KTtcbiAgICBmb3IgKHZhciBpID0gMTsgaTx2ZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHYgPSB2ZXJ0aWNlc1tpXTtcbiAgICAgIGxpZ2h0R3JhcGhpY3MubGluZVRvKHYueCwgdi55KTtcbiAgICB9XG4gICAgbGlnaHRHcmFwaGljcy5lbmRGaWxsKCk7XG5cbiAgICAvLyBvdmVybGFwLmFkZENoaWxkKGxpZ2h0R3JhcGhpY3MpO1xuICAgIC8vIG92ZXJsYXBTaGFwZS5tYXNrID0gbGlnaHRHcmFwaGljcztcblxuICAgIHNlbGYubGV2ZWwuYmcyLm1hc2sgPSBsaWdodEdyYXBoaWNzO1xuICAgIC8vIG92ZXJsYXkubWFzayA9IGxpZ2h0R3JhcGhpY3M7XG5cbiAgICBsYXN0TGlnaHRYID0gbGlnaHQucG9zaXRpb24ueDtcbiAgICBsYXN0TGlnaHRZID0gbGlnaHQucG9zaXRpb24ueTtcbiAgfTtcblxuICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgaWYgKHNlbGYuYnRuUmVzdGFydCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoc2VsZi5sZXZlbCA9PT0gbnVsbCkge1xuICAgICAgICBzZWxmLmJ0blJlc3RhcnQudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi5idG5SZXN0YXJ0LnZpc2libGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzZWxmLmJlZ2luKSBzZWxmLmJlZ2luLnVwZGF0ZSgpO1xuICAgIGlmIChzZWxmLmdhbWVvdmVyKSBzZWxmLmdhbWVvdmVyLnVwZGF0ZSgpO1xuXG4gICAgaWYgKCFnYW1lUnVubmluZykgcmV0dXJuO1xuICAgIHRoaXMudXBkYXRlTGlnaHRzKCk7XG5cbiAgICAvLyBjb25zb2xlLmxvZyhpbnB1dCArIFwiIFwiICsgaW5wdXQuS2V5KTtcbiAgICBpZighaW5wdXQpXG4gICAgICByZXR1cm47XG5cbiAgICBpZiAoaW5wdXQuS2V5LmlzRG93bihpbnB1dC5LZXkuTEVGVCkgfHwgaW5wdXQuS2V5LmlzRG93bihpbnB1dC5LZXkuQSkpXG4gICAge1xuICAgICAgZGlyZWN0aW9uIC09IDAuMDk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlucHV0LktleS5pc0Rvd24oaW5wdXQuS2V5LlJJR0hUKSB8fCBpbnB1dC5LZXkuaXNEb3duKGlucHV0LktleS5EKSlcbiAgICB7XG4gICAgICBkaXJlY3Rpb24gKz0gMC4wOTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgIGRpcmVjdGlvbiAqPSAwLjk7XG4gICAgfVxuXG4gICAgZGlyZWN0aW9uID0gVG9vbHMuY2xhbXAoZGlyZWN0aW9uLCAtMSwgMSk7XG5cbiAgICBpZiAoc2VsZi5sZXZlbClcbiAgICB7XG4gICAgICBpZihwaHlzaWNzKVxuICAgICAgICBwaHlzaWNzLnByb2Nlc3MoZ2FtZSwgZGlyZWN0aW9uLCB3aW5kb3cucG9seWdvbnMpO1xuXG4gICAgICBpZihwbGF5ZXIpXG4gICAgICAgIHBsYXllci51cGRhdGUoZ2FtZSwgcGh5c2ljcy5wbGF5ZXJQb3NpdGlvbiwgcGh5c2ljcy5wbGF5ZXJWZWxvY2l0eSk7XG5cbiAgICAgICBzZWxmLmxldmVsLnVwZGF0ZShzZWxmKTtcblxuICAgICAgIGlmICghbG9zdCAmJiBwaHlzaWNzLnBsYXllclBvc2l0aW9uLnkgPiBzY3JlZW5IZWlnaHQgKyA0MCkgdGhpcy5sb3NlR2FtZSgpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgbG9vcEJvdW5kZWQgPSAgZmFsc2UgO1xuICB0aGlzLmxvb3AgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAobG9vcEJvdW5kZWQpeyByZXR1cm47IH1cbiAgICBsb29wQm91bmRlZCA9IHRydWU7XG4gICAgcmVxdWVzdEFuaW1GcmFtZShzZWxmLnJlbmRlckxvb3ApO1xuICB9O1xuXG4gIHRoaXMucmVuZGVyTG9vcCA9IGZ1bmN0aW9uKCkge1xuICAgIHNlbGYudXBkYXRlKCk7IC8vIGxvZ2ljXG4gICAgc2VsZi5yZW5kZXJlci5yZW5kZXIoc2VsZi5zdGFnZSk7XG4gICAgcmVxdWVzdEFuaW1GcmFtZShzZWxmLnJlbmRlckxvb3ApO1xuICB9XG5cbiAgdGhpcy5sb2FkUGl4aSA9IGZ1bmN0aW9uKCkge1xuICAgIHNlbGYuaXRlbXNMb2FkZWQgPSAwLFxuICAgIHNlbGYucGl4aUZpbGVzID0gc2VsZi5yZXNvdXJjZXMuZ2V0UElYSUZpbGVzKCksXG4gICAgc2VsZi5zb3VuZEZpbGVzID0gc2VsZi5yZXNvdXJjZXMuc291bmRzLFxuICAgIHNlbGYudG90YWxJdGVtcyA9IHNlbGYucGl4aUZpbGVzLmxlbmd0aCArIHNlbGYuc291bmRGaWxlcy5sZW5ndGg7XG4gICAgLy8gbG9hZGVyXG4gICAgbG9hZGVyID0gbmV3IFBJWEkuQXNzZXRMb2FkZXIoc2VsZi5waXhpRmlsZXMpO1xuICAgIGxvYWRlci5hZGRFdmVudExpc3RlbmVyKCdvbkNvbXBsZXRlJywgZnVuY3Rpb24oKSB7XG4gICAgICBzZWxmLmxvYWRTb3VuZCgpO1xuICAgIH0pO1xuICAgIGxvYWRlci5hZGRFdmVudExpc3RlbmVyKCdvblByb2dyZXNzJywgZnVuY3Rpb24oZSkge1xuICAgICAgc2VsZi5pdGVtc0xvYWRlZCArPSAxO1xuICAgICAgc2VsZi5wcmVsb2FkZXIucHJvZ3Jlc3Moc2VsZi5pdGVtc0xvYWRlZCwgc2VsZi50b3RhbEl0ZW1zKTtcbiAgICAgIGlmICh0eXBlb2YoZWplY3RhKSE9PVwidW5kZWZpbmVkXCIpIHsgcmV0dXJuOyB9O1xuICAgIH0pO1xuXG4gICAgbG9hZGVyLmxvYWQoKTtcbiAgfVxuXG4gIHRoaXMubG9hZFNvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGksXG4gICAgICB0b3RhbCA9IHNlbGYuc291bmRGaWxlcy5sZW5ndGgsXG4gICAgICBvYmo7XG4gICAgZm9yIChpID0gMDsgaSA8IHRvdGFsOyArK2kpIHtcbiAgICAgIG9iaiA9IHNlbGYuc291bmRGaWxlc1tpXTtcbiAgICAgICAgc2VsZi5yZXNvdXJjZXNbb2JqLm5hbWVdID0gbmV3IEhvd2woe1xuICAgICAgICAgIHVybHM6IG9iai51cmxzLFxuICAgICAgICAgIGF1dG9wbGF5OiBvYmouYXV0b1BsYXkgfHwgZmFsc2UsXG4gICAgICAgICAgbG9vcDogb2JqLmxvb3AgfHwgZmFsc2UsXG4gICAgICAgICAgdm9sdW1lOiBvYmoudm9sdW1lIHx8IDEsXG4gICAgICAgICAgb25sb2FkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNlbGYuaXRlbXNMb2FkZWQrKztcbiAgICAgICAgICAgIGlmIChzZWxmLml0ZW1zTG9hZGVkID09IHNlbGYudG90YWxJdGVtcykge1xuICAgICAgICAgICAgICBzZWxmLmxvYWRlZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgdGhpcy5sb2FkZWQgPSBmdW5jdGlvbigpIHtcbiAgICBzZWxmLmJlZ2luID0gbmV3IEJlZ2luKHRoaXMpO1xuICAgIHNlbGYubGV2ZWxlbmQgPSBuZXcgTGV2ZWxFbmQodGhpcyk7XG4gICAgc2VsZi5nYW1lb3ZlciA9IG5ldyBHYW1lT3Zlcih0aGlzKTtcbiAgICBzZWxmLnByZWxvYWRlci5oaWRlKCk7XG4gICAgc2VsZi5iZWdpbi5zaG93KCk7XG4gICAgZ2FtZS5yZXNvdXJjZXMuc291bmRMb29wLmZhZGVJbiguNCwgMjAwMCk7XG5cbiAgICBnbG93ID0gUElYSS5TcHJpdGUuZnJvbUZyYW1lKFwiZ2xvdy5wbmdcIik7XG4gICAgZ2xvdy5zY2FsZS54ID0gMjtcbiAgICBnbG93LnNjYWxlLnkgPSAyO1xuICAgIHNlbGYuc3RhZ2UuYWRkQ2hpbGQoZ2xvdyk7XG4gICAgZ2xvdy5hbHBoYSA9IDAuNjU7XG5cbiAgICBzZWxmLmJ0blNvdW5kT2ZmID0gUElYSS5TcHJpdGUuZnJvbUZyYW1lKCdzb3VuZE9uLnBuZycpO1xuICAgIHNlbGYuYnRuU291bmRPZmYuc2V0SW50ZXJhY3RpdmUodHJ1ZSk7XG4gICAgc2VsZi5idG5Tb3VuZE9mZi5idXR0b25Nb2RlID0gdHJ1ZTtcbiAgICBzZWxmLmJ0blNvdW5kT2ZmLnBvc2l0aW9uLnggPSAxMDtcbiAgICBzZWxmLmJ0blNvdW5kT2ZmLnBvc2l0aW9uLnkgPSAxMDtcblxuICAgIHNlbGYuYnRuU291bmRPbiA9IFBJWEkuU3ByaXRlLmZyb21GcmFtZSgnc291bmRPZmYucG5nJyk7XG4gICAgc2VsZi5idG5Tb3VuZE9uLnNldEludGVyYWN0aXZlKHRydWUpO1xuICAgIHNlbGYuYnRuU291bmRPbi5idXR0b25Nb2RlID0gdHJ1ZTtcbiAgICBzZWxmLmJ0blNvdW5kT24ucG9zaXRpb24ueCA9IHNlbGYuYnRuU291bmRPZmYucG9zaXRpb24ueDtcbiAgICBzZWxmLmJ0blNvdW5kT24ucG9zaXRpb24ueSA9IHNlbGYuYnRuU291bmRPZmYucG9zaXRpb24ueTtcbiAgICBzZWxmLmJ0blNvdW5kT24udmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgc2VsZi5zdGFnZS5hZGRDaGlsZChnYW1lLmJ0blNvdW5kT2ZmKTtcbiAgICBzZWxmLnN0YWdlLmFkZENoaWxkKGdhbWUuYnRuU291bmRPbik7XG5cbiAgICBzZWxmLmJ0blNvdW5kT2ZmLmNsaWNrID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgc2VsZi5idG5Tb3VuZE9uLnZpc2libGUgPSB0cnVlO1xuICAgICAgc2VsZi5idG5Tb3VuZE9mZi52aXNpYmxlID0gZmFsc2U7XG4gICAgICBIb3dsZXIubXV0ZSgpO1xuICAgIH1cblxuICAgIHNlbGYuYnRuU291bmRPbi5jbGljayA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHNlbGYuYnRuU291bmRPbi52aXNpYmxlID0gZmFsc2U7XG4gICAgICBzZWxmLmJ0blNvdW5kT2ZmLnZpc2libGUgPSB0cnVlO1xuICAgICAgSG93bGVyLnVubXV0ZSgpO1xuICAgIH1cblxuICAgIHNlbGYuYnRuUmVzdGFydCA9IFBJWEkuU3ByaXRlLmZyb21GcmFtZSgncmVzdGFydC5wbmcnKTtcbiAgICBzZWxmLmJ0blJlc3RhcnQuc2V0SW50ZXJhY3RpdmUodHJ1ZSk7XG4gICAgc2VsZi5idG5SZXN0YXJ0LmJ1dHRvbk1vZGUgPSB0cnVlO1xuICAgIHNlbGYuc3RhZ2UuYWRkQ2hpbGQoZ2FtZS5idG5SZXN0YXJ0KTtcbiAgICBzZWxmLmJ0blJlc3RhcnQucG9zaXRpb24ueCA9IHNlbGYucmVuZGVyZXIud2lkdGggLSAxMCAtIHNlbGYuYnRuUmVzdGFydC53aWR0aDtcbiAgICBzZWxmLmJ0blJlc3RhcnQucG9zaXRpb24ueSA9IDEwO1xuICAgIHNlbGYuYnRuUmVzdGFydC52aXNpYmxlID0gZmFsc2U7XG5cbiAgICBzZWxmLmJ0blJlc3RhcnQuY2xpY2sgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBzZWxmLnJlc3RhcnQoKTtcbiAgICB9XG4gIH1cblxuICB0aGlzLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGltZ3NBcnIgPSBbXSwgaTtcbiAgICBsb3N0ID0gZmFsc2U7XG4gICAgLy8gc3RhcnQgc2NlbmVzXG4gICAgLy8gc2VsZi5zdGFnZS5hZGRDaGlsZChsaWdodEdyYXBoaWNzKTtcblxuICAgIC8vIHN0YXJ0IHNjcmVlbnNcblxuICAgIC8vIHN0YXJ0IGxvb3BcbiAgICBzZWxmLmxvb3AoKTtcblxuICAgIC8vXG4gICAgc2VsZi5wcmVsb2FkZXIgPSBuZXcgUHJlbG9hZGVyKHRoaXMpO1xuXG4gICAgLy8gRklYTUVcbiAgICBzZWxmLmxvYWRQaXhpKCk7XG4gIH07XG5cbiAgdGhpcy5sb3NlR2FtZSA9IGZ1bmN0aW9uKClcbiAge1xuICAgIGlmIChsb3N0KSByZXR1cm47XG4gICAgbG9zdCA9IHRydWU7XG4gICAgZ2FtZVJ1bm5pbmcgPSBmYWxzZTtcbiAgICBzZWxmLmdhbWVvdmVyLnNob3coKTtcbiAgfVxuXG4gIHRoaXMuZ29Ub0JlZ2lubmluZyA9IGZ1bmN0aW9uKClcbiAge1xuICAgIC8vIGdhbWUubG9hZExldmVsKDEpO1xuICAgIGdhbWUubGV2ZWwuZGlzcG9zZSgpO1xuICAgIGdhbWUubGV2ZWwuaW5kZXggPSAwO1xuICAgIGdhbWUubGV2ZWwgPSBudWxsO1xuXG4gICAgc2VsZi5iZWdpbi5zaG93KCk7XG4gIH1cblxuICB2YXIgcGhyYXNlMSA9IG51bGw7XG4gIHZhciBwaHJhc2UyID0gbnVsbDtcbiAgdmFyIHBocmFzZTMgPSBudWxsO1xuICB0aGlzLnNob3dFbmRTdG9yeSA9IGZ1bmN0aW9uKClcbiAge1xuICAgIGNvbnNvbGUubG9nKFwic2hvdyBlbmQgc3RvcnlcIiwgZ2FtZVJ1bm5pbmcpO1xuXG4gICAgaWYoIWdhbWVSdW5uaW5nKVxuICAgICAgcmV0dXJuO1xuXG4gICAgZ2FtZVJ1bm5pbmcgPSBmYWxzZTtcblxuICAgIHBocmFzZTEgPSBuZXcgUElYSS5UZXh0KCdITU1NLi4uTVkgSEVBRC4uLldIQVQgSEFQUEVORUQ/Jywge1xuICAgICAgZm9udDogJzIycHggUm9ra2l0dCcsXG4gICAgICBmaWxsOiAnI0ZGRkZGRicsXG4gICAgICBhbGlnbjogJ2NlbnRlcidcbiAgICB9KTtcblxuICAgIHBocmFzZTIgPSBuZXcgUElYSS5UZXh0KCdNT00/Li4uTU9NPyEgTk8hISEnLCB7XG4gICAgICBmb250OiAnMjJweCBSb2traXR0JyxcbiAgICAgIGZpbGw6ICcjRkZGRkZGJyxcbiAgICAgIGFsaWduOiAnY2VudGVyJ1xuICAgIH0pO1xuXG4gICAgcGhyYXNlMyA9IG5ldyBQSVhJLlRleHQoJ0JVVC4uLldBSVQuLi5USEFUIExJR0hULCBJVCBXQVMgWU9VPycsIHtcbiAgICAgIGZvbnQ6ICcyMnB4IFJva2tpdHQnLFxuICAgICAgZmlsbDogJyNGRkZGRkYnLFxuICAgICAgYWxpZ246ICdjZW50ZXInXG4gICAgfSk7XG5cbiAgICBwaHJhc2UxLmFscGhhID0gMDtcbiAgICBwaHJhc2UyLmFscGhhID0gMDtcbiAgICBwaHJhc2UzLmFscGhhID0gMDtcblxuICAgIHBocmFzZTEucG9zaXRpb24ueCA9IChzZWxmLnJlbmRlcmVyLndpZHRoIC8gMikgLSAocGhyYXNlMS53aWR0aCAvIDIpO1xuICAgIHBocmFzZTEucG9zaXRpb24ueSA9IHNlbGYucmVuZGVyZXIuaGVpZ2h0IC8gMiAtIDYwO1xuICAgIHNlbGYuc3RhZ2UuYWRkQ2hpbGQocGhyYXNlMSk7XG5cbiAgICBwaHJhc2UyLnBvc2l0aW9uLnggPSAoc2VsZi5yZW5kZXJlci53aWR0aCAvIDIpIC0gKHBocmFzZTIud2lkdGggLyAyKTtcbiAgICBwaHJhc2UyLnBvc2l0aW9uLnkgPSBzZWxmLnJlbmRlcmVyLmhlaWdodCAvIDIgLSAxMDtcbiAgICBzZWxmLnN0YWdlLmFkZENoaWxkKHBocmFzZTIpO1xuXG4gICAgcGhyYXNlMy5wb3NpdGlvbi54ID0gKHNlbGYucmVuZGVyZXIud2lkdGggLyAyKSAtIChwaHJhc2UzLndpZHRoIC8gMik7XG4gICAgcGhyYXNlMy5wb3NpdGlvbi55ID0gc2VsZi5yZW5kZXJlci5oZWlnaHQgLyAyICsgNDA7XG4gICAgc2VsZi5zdGFnZS5hZGRDaGlsZChwaHJhc2UzKTtcblxuXG4gICAgdmFyIHR3ZWVuYWJsZSA9IG5ldyBUd2VlbmFibGUoKTtcbiAgICB0d2VlbmFibGUudHdlZW4oe1xuICAgICAgZnJvbToge2FscGhhOjB9LFxuICAgICAgdG86ICAge2FscGhhOjF9LFxuICAgICAgZHVyYXRpb246IDUwMCxcbiAgICAgIGVhc2luZzogJ2Vhc2VPdXRDdWJpYycsXG4gICAgICBzdGFydDogZnVuY3Rpb24gKCkge1xuICAgICAgfSxcbiAgICAgIHN0ZXA6IGZ1bmN0aW9uKHN0YXRlKXtcbiAgICAgICAgcGhyYXNlMS5hbHBoYSA9IHN0YXRlLmFscGhhO1xuICAgICAgfSxcbiAgICAgIGZpbmlzaDogZnVuY3Rpb24gKCkge1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIHR3ZWVuYWJsZSA9IG5ldyBUd2VlbmFibGUoKTtcbiAgICB0d2VlbmFibGUudHdlZW4oe1xuICAgICAgZnJvbToge2FscGhhOjB9LFxuICAgICAgdG86ICAge2FscGhhOjF9LFxuICAgICAgZHVyYXRpb246IDUwMCxcbiAgICAgIGVhc2luZzogJ2Vhc2VPdXRDdWJpYycsXG4gICAgICBzdGFydDogZnVuY3Rpb24gKCkge1xuICAgICAgfSxcbiAgICAgIHN0ZXA6IGZ1bmN0aW9uKHN0YXRlKXtcbiAgICAgICAgcGhyYXNlMi5hbHBoYSA9IHN0YXRlLmFscGhhO1xuICAgICAgfSxcbiAgICAgIGZpbmlzaDogZnVuY3Rpb24gKCkge1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIHR3ZWVuYWJsZSA9IG5ldyBUd2VlbmFibGUoKTtcbiAgICB0d2VlbmFibGUudHdlZW4oe1xuICAgICAgZnJvbToge2FscGhhOjB9LFxuICAgICAgdG86ICAge2FscGhhOjF9LFxuICAgICAgZHVyYXRpb246IDUwMCxcbiAgICAgIGVhc2luZzogJ2Vhc2VPdXRDdWJpYycsXG4gICAgICBzdGFydDogZnVuY3Rpb24gKCkge1xuICAgICAgfSxcbiAgICAgIHN0ZXA6IGZ1bmN0aW9uKHN0YXRlKXtcbiAgICAgICAgcGhyYXNlMy5hbHBoYSA9IHN0YXRlLmFscGhhO1xuICAgICAgfSxcbiAgICAgIGZpbmlzaDogZnVuY3Rpb24gKCkge1xuICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICBzZWxmLnN0YWdlLnJlbW92ZUNoaWxkKHBocmFzZTEpO1xuICAgICAgc2VsZi5zdGFnZS5yZW1vdmVDaGlsZChwaHJhc2UyKTtcbiAgICAgIHNlbGYuc3RhZ2UucmVtb3ZlQ2hpbGQocGhyYXNlMyk7XG4gICAgICBzZWxmLmdvVG9CZWdpbm5pbmcoKTtcbiAgICB9LDgwMDApO1xuXG4gICAgc2VsZi5nYW1lUnVubmluZyA9IGZhbHNlO1xuICB9XG5cbiAgdGhpcy5zdGFydCgpO1xufVxuIiwidmFyIEdhbWUgPSByZXF1aXJlKCcuL0dhbWUnKSxcbiAgICBUd2VlbmFibGUgPSByZXF1aXJlKCcuL3ZlbmRvci9zaGlmdHknKSxcbiAgICBFdmVudEVtaXR0ZXIyID0gcmVxdWlyZSgnLi92ZW5kb3IvRXZlbnRFbWl0dGVyMicpLkV2ZW50RW1pdHRlcjIsXG4gICAgZ2FtZTtcblxuLy8gaHR0cDovL2N1YmljLWJlemllci5jb20vIy45MiwuMzQsLjYsLjhcblR3ZWVuYWJsZS5zZXRCZXppZXJGdW5jdGlvbihcImN1c3RvbUJlemllclwiLCAuOTIsLjM0LC42LC44KTtcblxuLy8gRXZlbnQgYmV0d2VlbiBvYmplY3RzXG53aW5kb3cuZW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIyKCk7XG5cbi8vIEluaXRcbldlYkZvbnRDb25maWcgPSB7XG5nb29nbGU6IHtcbiAgZmFtaWxpZXM6IFsnUm9ra2l0dCddXG59LFxuXG5hY3RpdmU6IGZ1bmN0aW9uKCkge1xuICAvLyBkbyBzb21ldGhpbmdcbiAgZ2FtZSA9IEdhbWUuaW5zdGFuY2UgPSBuZXcgR2FtZSgpO1xufVxufTtcbihmdW5jdGlvbigpIHtcbnZhciB3ZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xud2Yuc3JjID0gKCdodHRwczonID09IGRvY3VtZW50LmxvY2F0aW9uLnByb3RvY29sID8gJ2h0dHBzJyA6ICdodHRwJykgK1xuICAgICc6Ly9hamF4Lmdvb2dsZWFwaXMuY29tL2FqYXgvbGlicy93ZWJmb250LzEvd2ViZm9udC5qcyc7XG53Zi50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG53Zi5hc3luYyA9ICd0cnVlJztcbnZhciBzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdO1xucy5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh3Ziwgcyk7XG59KSgpO1xuIiwiLyohXG4gKiBFdmVudEVtaXR0ZXIyXG4gKiBodHRwczovL2dpdGh1Yi5jb20vaGlqMW54L0V2ZW50RW1pdHRlcjJcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMgaGlqMW54XG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKi9cbjshZnVuY3Rpb24odW5kZWZpbmVkKSB7XG5cbiAgdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5ID8gQXJyYXkuaXNBcnJheSA6IGZ1bmN0aW9uIF9pc0FycmF5KG9iaikge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiO1xuICB9O1xuICB2YXIgZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgaWYgKHRoaXMuX2NvbmYpIHtcbiAgICAgIGNvbmZpZ3VyZS5jYWxsKHRoaXMsIHRoaXMuX2NvbmYpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbmZpZ3VyZShjb25mKSB7XG4gICAgaWYgKGNvbmYpIHtcblxuICAgICAgdGhpcy5fY29uZiA9IGNvbmY7XG5cbiAgICAgIGNvbmYuZGVsaW1pdGVyICYmICh0aGlzLmRlbGltaXRlciA9IGNvbmYuZGVsaW1pdGVyKTtcbiAgICAgIGNvbmYubWF4TGlzdGVuZXJzICYmICh0aGlzLl9ldmVudHMubWF4TGlzdGVuZXJzID0gY29uZi5tYXhMaXN0ZW5lcnMpO1xuICAgICAgY29uZi53aWxkY2FyZCAmJiAodGhpcy53aWxkY2FyZCA9IGNvbmYud2lsZGNhcmQpO1xuICAgICAgY29uZi5uZXdMaXN0ZW5lciAmJiAodGhpcy5uZXdMaXN0ZW5lciA9IGNvbmYubmV3TGlzdGVuZXIpO1xuXG4gICAgICBpZiAodGhpcy53aWxkY2FyZCkge1xuICAgICAgICB0aGlzLmxpc3RlbmVyVHJlZSA9IHt9O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIEV2ZW50RW1pdHRlcihjb25mKSB7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgdGhpcy5uZXdMaXN0ZW5lciA9IGZhbHNlO1xuICAgIGNvbmZpZ3VyZS5jYWxsKHRoaXMsIGNvbmYpO1xuICB9XG5cbiAgLy9cbiAgLy8gQXR0ZW50aW9uLCBmdW5jdGlvbiByZXR1cm4gdHlwZSBub3cgaXMgYXJyYXksIGFsd2F5cyAhXG4gIC8vIEl0IGhhcyB6ZXJvIGVsZW1lbnRzIGlmIG5vIGFueSBtYXRjaGVzIGZvdW5kIGFuZCBvbmUgb3IgbW9yZVxuICAvLyBlbGVtZW50cyAobGVhZnMpIGlmIHRoZXJlIGFyZSBtYXRjaGVzXG4gIC8vXG4gIGZ1bmN0aW9uIHNlYXJjaExpc3RlbmVyVHJlZShoYW5kbGVycywgdHlwZSwgdHJlZSwgaSkge1xuICAgIGlmICghdHJlZSkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICB2YXIgbGlzdGVuZXJzPVtdLCBsZWFmLCBsZW4sIGJyYW5jaCwgeFRyZWUsIHh4VHJlZSwgaXNvbGF0ZWRCcmFuY2gsIGVuZFJlYWNoZWQsXG4gICAgICAgIHR5cGVMZW5ndGggPSB0eXBlLmxlbmd0aCwgY3VycmVudFR5cGUgPSB0eXBlW2ldLCBuZXh0VHlwZSA9IHR5cGVbaSsxXTtcbiAgICBpZiAoaSA9PT0gdHlwZUxlbmd0aCAmJiB0cmVlLl9saXN0ZW5lcnMpIHtcbiAgICAgIC8vXG4gICAgICAvLyBJZiBhdCB0aGUgZW5kIG9mIHRoZSBldmVudChzKSBsaXN0IGFuZCB0aGUgdHJlZSBoYXMgbGlzdGVuZXJzXG4gICAgICAvLyBpbnZva2UgdGhvc2UgbGlzdGVuZXJzLlxuICAgICAgLy9cbiAgICAgIGlmICh0eXBlb2YgdHJlZS5fbGlzdGVuZXJzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGhhbmRsZXJzICYmIGhhbmRsZXJzLnB1c2godHJlZS5fbGlzdGVuZXJzKTtcbiAgICAgICAgcmV0dXJuIFt0cmVlXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAobGVhZiA9IDAsIGxlbiA9IHRyZWUuX2xpc3RlbmVycy5sZW5ndGg7IGxlYWYgPCBsZW47IGxlYWYrKykge1xuICAgICAgICAgIGhhbmRsZXJzICYmIGhhbmRsZXJzLnB1c2godHJlZS5fbGlzdGVuZXJzW2xlYWZdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3RyZWVdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICgoY3VycmVudFR5cGUgPT09ICcqJyB8fCBjdXJyZW50VHlwZSA9PT0gJyoqJykgfHwgdHJlZVtjdXJyZW50VHlwZV0pIHtcbiAgICAgIC8vXG4gICAgICAvLyBJZiB0aGUgZXZlbnQgZW1pdHRlZCBpcyAnKicgYXQgdGhpcyBwYXJ0XG4gICAgICAvLyBvciB0aGVyZSBpcyBhIGNvbmNyZXRlIG1hdGNoIGF0IHRoaXMgcGF0Y2hcbiAgICAgIC8vXG4gICAgICBpZiAoY3VycmVudFR5cGUgPT09ICcqJykge1xuICAgICAgICBmb3IgKGJyYW5jaCBpbiB0cmVlKSB7XG4gICAgICAgICAgaWYgKGJyYW5jaCAhPT0gJ19saXN0ZW5lcnMnICYmIHRyZWUuaGFzT3duUHJvcGVydHkoYnJhbmNoKSkge1xuICAgICAgICAgICAgbGlzdGVuZXJzID0gbGlzdGVuZXJzLmNvbmNhdChzZWFyY2hMaXN0ZW5lclRyZWUoaGFuZGxlcnMsIHR5cGUsIHRyZWVbYnJhbmNoXSwgaSsxKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsaXN0ZW5lcnM7XG4gICAgICB9IGVsc2UgaWYoY3VycmVudFR5cGUgPT09ICcqKicpIHtcbiAgICAgICAgZW5kUmVhY2hlZCA9IChpKzEgPT09IHR5cGVMZW5ndGggfHwgKGkrMiA9PT0gdHlwZUxlbmd0aCAmJiBuZXh0VHlwZSA9PT0gJyonKSk7XG4gICAgICAgIGlmKGVuZFJlYWNoZWQgJiYgdHJlZS5fbGlzdGVuZXJzKSB7XG4gICAgICAgICAgLy8gVGhlIG5leHQgZWxlbWVudCBoYXMgYSBfbGlzdGVuZXJzLCBhZGQgaXQgdG8gdGhlIGhhbmRsZXJzLlxuICAgICAgICAgIGxpc3RlbmVycyA9IGxpc3RlbmVycy5jb25jYXQoc2VhcmNoTGlzdGVuZXJUcmVlKGhhbmRsZXJzLCB0eXBlLCB0cmVlLCB0eXBlTGVuZ3RoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGJyYW5jaCBpbiB0cmVlKSB7XG4gICAgICAgICAgaWYgKGJyYW5jaCAhPT0gJ19saXN0ZW5lcnMnICYmIHRyZWUuaGFzT3duUHJvcGVydHkoYnJhbmNoKSkge1xuICAgICAgICAgICAgaWYoYnJhbmNoID09PSAnKicgfHwgYnJhbmNoID09PSAnKionKSB7XG4gICAgICAgICAgICAgIGlmKHRyZWVbYnJhbmNoXS5fbGlzdGVuZXJzICYmICFlbmRSZWFjaGVkKSB7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXJzID0gbGlzdGVuZXJzLmNvbmNhdChzZWFyY2hMaXN0ZW5lclRyZWUoaGFuZGxlcnMsIHR5cGUsIHRyZWVbYnJhbmNoXSwgdHlwZUxlbmd0aCkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGxpc3RlbmVycyA9IGxpc3RlbmVycy5jb25jYXQoc2VhcmNoTGlzdGVuZXJUcmVlKGhhbmRsZXJzLCB0eXBlLCB0cmVlW2JyYW5jaF0sIGkpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZihicmFuY2ggPT09IG5leHRUeXBlKSB7XG4gICAgICAgICAgICAgIGxpc3RlbmVycyA9IGxpc3RlbmVycy5jb25jYXQoc2VhcmNoTGlzdGVuZXJUcmVlKGhhbmRsZXJzLCB0eXBlLCB0cmVlW2JyYW5jaF0sIGkrMikpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gTm8gbWF0Y2ggb24gdGhpcyBvbmUsIHNoaWZ0IGludG8gdGhlIHRyZWUgYnV0IG5vdCBpbiB0aGUgdHlwZSBhcnJheS5cbiAgICAgICAgICAgICAgbGlzdGVuZXJzID0gbGlzdGVuZXJzLmNvbmNhdChzZWFyY2hMaXN0ZW5lclRyZWUoaGFuZGxlcnMsIHR5cGUsIHRyZWVbYnJhbmNoXSwgaSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGlzdGVuZXJzO1xuICAgICAgfVxuXG4gICAgICBsaXN0ZW5lcnMgPSBsaXN0ZW5lcnMuY29uY2F0KHNlYXJjaExpc3RlbmVyVHJlZShoYW5kbGVycywgdHlwZSwgdHJlZVtjdXJyZW50VHlwZV0sIGkrMSkpO1xuICAgIH1cblxuICAgIHhUcmVlID0gdHJlZVsnKiddO1xuICAgIGlmICh4VHJlZSkge1xuICAgICAgLy9cbiAgICAgIC8vIElmIHRoZSBsaXN0ZW5lciB0cmVlIHdpbGwgYWxsb3cgYW55IG1hdGNoIGZvciB0aGlzIHBhcnQsXG4gICAgICAvLyB0aGVuIHJlY3Vyc2l2ZWx5IGV4cGxvcmUgYWxsIGJyYW5jaGVzIG9mIHRoZSB0cmVlXG4gICAgICAvL1xuICAgICAgc2VhcmNoTGlzdGVuZXJUcmVlKGhhbmRsZXJzLCB0eXBlLCB4VHJlZSwgaSsxKTtcbiAgICB9XG5cbiAgICB4eFRyZWUgPSB0cmVlWycqKiddO1xuICAgIGlmKHh4VHJlZSkge1xuICAgICAgaWYoaSA8IHR5cGVMZW5ndGgpIHtcbiAgICAgICAgaWYoeHhUcmVlLl9saXN0ZW5lcnMpIHtcbiAgICAgICAgICAvLyBJZiB3ZSBoYXZlIGEgbGlzdGVuZXIgb24gYSAnKionLCBpdCB3aWxsIGNhdGNoIGFsbCwgc28gYWRkIGl0cyBoYW5kbGVyLlxuICAgICAgICAgIHNlYXJjaExpc3RlbmVyVHJlZShoYW5kbGVycywgdHlwZSwgeHhUcmVlLCB0eXBlTGVuZ3RoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJ1aWxkIGFycmF5cyBvZiBtYXRjaGluZyBuZXh0IGJyYW5jaGVzIGFuZCBvdGhlcnMuXG4gICAgICAgIGZvcihicmFuY2ggaW4geHhUcmVlKSB7XG4gICAgICAgICAgaWYoYnJhbmNoICE9PSAnX2xpc3RlbmVycycgJiYgeHhUcmVlLmhhc093blByb3BlcnR5KGJyYW5jaCkpIHtcbiAgICAgICAgICAgIGlmKGJyYW5jaCA9PT0gbmV4dFR5cGUpIHtcbiAgICAgICAgICAgICAgLy8gV2Uga25vdyB0aGUgbmV4dCBlbGVtZW50IHdpbGwgbWF0Y2gsIHNvIGp1bXAgdHdpY2UuXG4gICAgICAgICAgICAgIHNlYXJjaExpc3RlbmVyVHJlZShoYW5kbGVycywgdHlwZSwgeHhUcmVlW2JyYW5jaF0sIGkrMik7XG4gICAgICAgICAgICB9IGVsc2UgaWYoYnJhbmNoID09PSBjdXJyZW50VHlwZSkge1xuICAgICAgICAgICAgICAvLyBDdXJyZW50IG5vZGUgbWF0Y2hlcywgbW92ZSBpbnRvIHRoZSB0cmVlLlxuICAgICAgICAgICAgICBzZWFyY2hMaXN0ZW5lclRyZWUoaGFuZGxlcnMsIHR5cGUsIHh4VHJlZVticmFuY2hdLCBpKzEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaXNvbGF0ZWRCcmFuY2ggPSB7fTtcbiAgICAgICAgICAgICAgaXNvbGF0ZWRCcmFuY2hbYnJhbmNoXSA9IHh4VHJlZVticmFuY2hdO1xuICAgICAgICAgICAgICBzZWFyY2hMaXN0ZW5lclRyZWUoaGFuZGxlcnMsIHR5cGUsIHsgJyoqJzogaXNvbGF0ZWRCcmFuY2ggfSwgaSsxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZih4eFRyZWUuX2xpc3RlbmVycykge1xuICAgICAgICAvLyBXZSBoYXZlIHJlYWNoZWQgdGhlIGVuZCBhbmQgc3RpbGwgb24gYSAnKionXG4gICAgICAgIHNlYXJjaExpc3RlbmVyVHJlZShoYW5kbGVycywgdHlwZSwgeHhUcmVlLCB0eXBlTGVuZ3RoKTtcbiAgICAgIH0gZWxzZSBpZih4eFRyZWVbJyonXSAmJiB4eFRyZWVbJyonXS5fbGlzdGVuZXJzKSB7XG4gICAgICAgIHNlYXJjaExpc3RlbmVyVHJlZShoYW5kbGVycywgdHlwZSwgeHhUcmVlWycqJ10sIHR5cGVMZW5ndGgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBsaXN0ZW5lcnM7XG4gIH1cblxuICBmdW5jdGlvbiBncm93TGlzdGVuZXJUcmVlKHR5cGUsIGxpc3RlbmVyKSB7XG5cbiAgICB0eXBlID0gdHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnID8gdHlwZS5zcGxpdCh0aGlzLmRlbGltaXRlcikgOiB0eXBlLnNsaWNlKCk7XG5cbiAgICAvL1xuICAgIC8vIExvb2tzIGZvciB0d28gY29uc2VjdXRpdmUgJyoqJywgaWYgc28sIGRvbid0IGFkZCB0aGUgZXZlbnQgYXQgYWxsLlxuICAgIC8vXG4gICAgZm9yKHZhciBpID0gMCwgbGVuID0gdHlwZS5sZW5ndGg7IGkrMSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZih0eXBlW2ldID09PSAnKionICYmIHR5cGVbaSsxXSA9PT0gJyoqJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHRyZWUgPSB0aGlzLmxpc3RlbmVyVHJlZTtcbiAgICB2YXIgbmFtZSA9IHR5cGUuc2hpZnQoKTtcblxuICAgIHdoaWxlIChuYW1lKSB7XG5cbiAgICAgIGlmICghdHJlZVtuYW1lXSkge1xuICAgICAgICB0cmVlW25hbWVdID0ge307XG4gICAgICB9XG5cbiAgICAgIHRyZWUgPSB0cmVlW25hbWVdO1xuXG4gICAgICBpZiAodHlwZS5sZW5ndGggPT09IDApIHtcblxuICAgICAgICBpZiAoIXRyZWUuX2xpc3RlbmVycykge1xuICAgICAgICAgIHRyZWUuX2xpc3RlbmVycyA9IGxpc3RlbmVyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYodHlwZW9mIHRyZWUuX2xpc3RlbmVycyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHRyZWUuX2xpc3RlbmVycyA9IFt0cmVlLl9saXN0ZW5lcnMsIGxpc3RlbmVyXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpc0FycmF5KHRyZWUuX2xpc3RlbmVycykpIHtcblxuICAgICAgICAgIHRyZWUuX2xpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcblxuICAgICAgICAgIGlmICghdHJlZS5fbGlzdGVuZXJzLndhcm5lZCkge1xuXG4gICAgICAgICAgICB2YXIgbSA9IGRlZmF1bHRNYXhMaXN0ZW5lcnM7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5fZXZlbnRzLm1heExpc3RlbmVycyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgbSA9IHRoaXMuX2V2ZW50cy5tYXhMaXN0ZW5lcnM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChtID4gMCAmJiB0cmVlLl9saXN0ZW5lcnMubGVuZ3RoID4gbSkge1xuXG4gICAgICAgICAgICAgIHRyZWUuX2xpc3RlbmVycy53YXJuZWQgPSB0cnVlO1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmVlLl9saXN0ZW5lcnMubGVuZ3RoKTtcbiAgICAgICAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIG5hbWUgPSB0eXBlLnNoaWZ0KCk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhblxuICAvLyAxMCBsaXN0ZW5lcnMgYXJlIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2hcbiAgLy8gaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG4gIC8vXG4gIC8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuICAvLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cblxuICBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmRlbGltaXRlciA9ICcuJztcblxuICBFdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgICB0aGlzLl9ldmVudHMgfHwgaW5pdC5jYWxsKHRoaXMpO1xuICAgIHRoaXMuX2V2ZW50cy5tYXhMaXN0ZW5lcnMgPSBuO1xuICAgIGlmICghdGhpcy5fY29uZikgdGhpcy5fY29uZiA9IHt9O1xuICAgIHRoaXMuX2NvbmYubWF4TGlzdGVuZXJzID0gbjtcbiAgfTtcblxuICBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmV2ZW50ID0gJyc7XG5cbiAgRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24oZXZlbnQsIGZuKSB7XG4gICAgdGhpcy5tYW55KGV2ZW50LCAxLCBmbik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5tYW55ID0gZnVuY3Rpb24oZXZlbnQsIHR0bCwgZm4pIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hbnkgb25seSBhY2NlcHRzIGluc3RhbmNlcyBvZiBGdW5jdGlvbicpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RlbmVyKCkge1xuICAgICAgaWYgKC0tdHRsID09PSAwKSB7XG4gICAgICAgIHNlbGYub2ZmKGV2ZW50LCBsaXN0ZW5lcik7XG4gICAgICB9XG4gICAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIGxpc3RlbmVyLl9vcmlnaW4gPSBmbjtcblxuICAgIHRoaXMub24oZXZlbnQsIGxpc3RlbmVyKTtcblxuICAgIHJldHVybiBzZWxmO1xuICB9O1xuXG4gIEV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgdGhpcy5fZXZlbnRzIHx8IGluaXQuY2FsbCh0aGlzKTtcblxuICAgIHZhciB0eXBlID0gYXJndW1lbnRzWzBdO1xuXG4gICAgaWYgKHR5cGUgPT09ICduZXdMaXN0ZW5lcicgJiYgIXRoaXMubmV3TGlzdGVuZXIpIHtcbiAgICAgIGlmICghdGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIH1cblxuICAgIC8vIExvb3AgdGhyb3VnaCB0aGUgKl9hbGwqIGZ1bmN0aW9ucyBhbmQgaW52b2tlIHRoZW0uXG4gICAgaWYgKHRoaXMuX2FsbCkge1xuICAgICAgdmFyIGwgPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkobCAtIDEpO1xuICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBsOyBpKyspIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgZm9yIChpID0gMCwgbCA9IHRoaXMuX2FsbC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdGhpcy5ldmVudCA9IHR5cGU7XG4gICAgICAgIHRoaXMuX2FsbFtpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gICAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcblxuICAgICAgaWYgKCF0aGlzLl9hbGwgJiZcbiAgICAgICAgIXRoaXMuX2V2ZW50cy5lcnJvciAmJlxuICAgICAgICAhKHRoaXMud2lsZGNhcmQgJiYgdGhpcy5saXN0ZW5lclRyZWUuZXJyb3IpKSB7XG5cbiAgICAgICAgaWYgKGFyZ3VtZW50c1sxXSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgdGhyb3cgYXJndW1lbnRzWzFdOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuY2F1Z2h0LCB1bnNwZWNpZmllZCAnZXJyb3InIGV2ZW50LlwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGhhbmRsZXI7XG5cbiAgICBpZih0aGlzLndpbGRjYXJkKSB7XG4gICAgICBoYW5kbGVyID0gW107XG4gICAgICB2YXIgbnMgPSB0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycgPyB0eXBlLnNwbGl0KHRoaXMuZGVsaW1pdGVyKSA6IHR5cGUuc2xpY2UoKTtcbiAgICAgIHNlYXJjaExpc3RlbmVyVHJlZS5jYWxsKHRoaXMsIGhhbmRsZXIsIG5zLCB0aGlzLmxpc3RlbmVyVHJlZSwgMCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGhhbmRsZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMuZXZlbnQgPSB0eXBlO1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpXG4gICAgICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIC8vIHNsb3dlclxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB2YXIgbCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgICAgICB2YXIgYXJncyA9IG5ldyBBcnJheShsIC0gMSk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGw7IGkrKykgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaGFuZGxlcikge1xuICAgICAgdmFyIGwgPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkobCAtIDEpO1xuICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBsOyBpKyspIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuXG4gICAgICB2YXIgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBsaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHRoaXMuZXZlbnQgPSB0eXBlO1xuICAgICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gKGxpc3RlbmVycy5sZW5ndGggPiAwKSB8fCAhIXRoaXMuX2FsbDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gISF0aGlzLl9hbGw7XG4gICAgfVxuXG4gIH07XG5cbiAgRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG5cbiAgICBpZiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMub25BbnkodHlwZSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ29uIG9ubHkgYWNjZXB0cyBpbnN0YW5jZXMgb2YgRnVuY3Rpb24nKTtcbiAgICB9XG4gICAgdGhpcy5fZXZlbnRzIHx8IGluaXQuY2FsbCh0aGlzKTtcblxuICAgIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT0gXCJuZXdMaXN0ZW5lcnNcIiEgQmVmb3JlXG4gICAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lcnNcIi5cbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gICAgaWYodGhpcy53aWxkY2FyZCkge1xuICAgICAgZ3Jvd0xpc3RlbmVyVHJlZS5jYWxsKHRoaXMsIHR5cGUsIGxpc3RlbmVyKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKSB7XG4gICAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICAgIH1cbiAgICBlbHNlIGlmKHR5cGVvZiB0aGlzLl9ldmVudHNbdHlwZV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuICAgIH1cbiAgICBlbHNlIGlmIChpc0FycmF5KHRoaXMuX2V2ZW50c1t0eXBlXSkpIHtcbiAgICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcblxuICAgICAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgICAgIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuXG4gICAgICAgIHZhciBtID0gZGVmYXVsdE1heExpc3RlbmVycztcblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuX2V2ZW50cy5tYXhMaXN0ZW5lcnMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgbSA9IHRoaXMuX2V2ZW50cy5tYXhMaXN0ZW5lcnM7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcblxuICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBFdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uQW55ID0gZnVuY3Rpb24oZm4pIHtcblxuICAgIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignb25Bbnkgb25seSBhY2NlcHRzIGluc3RhbmNlcyBvZiBGdW5jdGlvbicpO1xuICAgIH1cblxuICAgIGlmKCF0aGlzLl9hbGwpIHtcbiAgICAgIHRoaXMuX2FsbCA9IFtdO1xuICAgIH1cblxuICAgIC8vIEFkZCB0aGUgZnVuY3Rpb24gdG8gdGhlIGV2ZW50IGxpc3RlbmVyIGNvbGxlY3Rpb24uXG4gICAgdGhpcy5fYWxsLnB1c2goZm4pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uO1xuXG4gIEV2ZW50RW1pdHRlci5wcm90b3R5cGUub2ZmID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlbW92ZUxpc3RlbmVyIG9ubHkgdGFrZXMgaW5zdGFuY2VzIG9mIEZ1bmN0aW9uJyk7XG4gICAgfVxuXG4gICAgdmFyIGhhbmRsZXJzLGxlYWZzPVtdO1xuXG4gICAgaWYodGhpcy53aWxkY2FyZCkge1xuICAgICAgdmFyIG5zID0gdHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnID8gdHlwZS5zcGxpdCh0aGlzLmRlbGltaXRlcikgOiB0eXBlLnNsaWNlKCk7XG4gICAgICBsZWFmcyA9IHNlYXJjaExpc3RlbmVyVHJlZS5jYWxsKHRoaXMsIG51bGwsIG5zLCB0aGlzLmxpc3RlbmVyVHJlZSwgMCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgLy8gZG9lcyBub3QgdXNlIGxpc3RlbmVycygpLCBzbyBubyBzaWRlIGVmZmVjdCBvZiBjcmVhdGluZyBfZXZlbnRzW3R5cGVdXG4gICAgICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSkgcmV0dXJuIHRoaXM7XG4gICAgICBoYW5kbGVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICAgIGxlYWZzLnB1c2goe19saXN0ZW5lcnM6aGFuZGxlcnN9KTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpTGVhZj0wOyBpTGVhZjxsZWFmcy5sZW5ndGg7IGlMZWFmKyspIHtcbiAgICAgIHZhciBsZWFmID0gbGVhZnNbaUxlYWZdO1xuICAgICAgaGFuZGxlcnMgPSBsZWFmLl9saXN0ZW5lcnM7XG4gICAgICBpZiAoaXNBcnJheShoYW5kbGVycykpIHtcblxuICAgICAgICB2YXIgcG9zaXRpb24gPSAtMTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gaGFuZGxlcnMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoaGFuZGxlcnNbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgICAoaGFuZGxlcnNbaV0ubGlzdGVuZXIgJiYgaGFuZGxlcnNbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSB8fFxuICAgICAgICAgICAgKGhhbmRsZXJzW2ldLl9vcmlnaW4gJiYgaGFuZGxlcnNbaV0uX29yaWdpbiA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocG9zaXRpb24gPCAwKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZih0aGlzLndpbGRjYXJkKSB7XG4gICAgICAgICAgbGVhZi5fbGlzdGVuZXJzLnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGFuZGxlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgaWYodGhpcy53aWxkY2FyZCkge1xuICAgICAgICAgICAgZGVsZXRlIGxlYWYuX2xpc3RlbmVycztcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGhhbmRsZXJzID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAoaGFuZGxlcnMubGlzdGVuZXIgJiYgaGFuZGxlcnMubGlzdGVuZXIgPT09IGxpc3RlbmVyKSB8fFxuICAgICAgICAoaGFuZGxlcnMuX29yaWdpbiAmJiBoYW5kbGVycy5fb3JpZ2luID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgaWYodGhpcy53aWxkY2FyZCkge1xuICAgICAgICAgIGRlbGV0ZSBsZWFmLl9saXN0ZW5lcnM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEV2ZW50RW1pdHRlci5wcm90b3R5cGUub2ZmQW55ID0gZnVuY3Rpb24oZm4pIHtcbiAgICB2YXIgaSA9IDAsIGwgPSAwLCBmbnM7XG4gICAgaWYgKGZuICYmIHRoaXMuX2FsbCAmJiB0aGlzLl9hbGwubGVuZ3RoID4gMCkge1xuICAgICAgZm5zID0gdGhpcy5fYWxsO1xuICAgICAgZm9yKGkgPSAwLCBsID0gZm5zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZihmbiA9PT0gZm5zW2ldKSB7XG4gICAgICAgICAgZm5zLnNwbGljZShpLCAxKTtcbiAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9hbGwgPSBbXTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUub2ZmO1xuXG4gIEV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAhdGhpcy5fZXZlbnRzIHx8IGluaXQuY2FsbCh0aGlzKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGlmKHRoaXMud2lsZGNhcmQpIHtcbiAgICAgIHZhciBucyA9IHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJyA/IHR5cGUuc3BsaXQodGhpcy5kZWxpbWl0ZXIpIDogdHlwZS5zbGljZSgpO1xuICAgICAgdmFyIGxlYWZzID0gc2VhcmNoTGlzdGVuZXJUcmVlLmNhbGwodGhpcywgbnVsbCwgbnMsIHRoaXMubGlzdGVuZXJUcmVlLCAwKTtcblxuICAgICAgZm9yICh2YXIgaUxlYWY9MDsgaUxlYWY8bGVhZnMubGVuZ3RoOyBpTGVhZisrKSB7XG4gICAgICAgIHZhciBsZWFmID0gbGVhZnNbaUxlYWZdO1xuICAgICAgICBsZWFmLl9saXN0ZW5lcnMgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKSByZXR1cm4gdGhpcztcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICAgIGlmKHRoaXMud2lsZGNhcmQpIHtcbiAgICAgIHZhciBoYW5kbGVycyA9IFtdO1xuICAgICAgdmFyIG5zID0gdHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnID8gdHlwZS5zcGxpdCh0aGlzLmRlbGltaXRlcikgOiB0eXBlLnNsaWNlKCk7XG4gICAgICBzZWFyY2hMaXN0ZW5lclRyZWUuY2FsbCh0aGlzLCBoYW5kbGVycywgbnMsIHRoaXMubGlzdGVuZXJUcmVlLCAwKTtcbiAgICAgIHJldHVybiBoYW5kbGVycztcbiAgICB9XG5cbiAgICB0aGlzLl9ldmVudHMgfHwgaW5pdC5jYWxsKHRoaXMpO1xuXG4gICAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFtdO1xuICAgIGlmICghaXNBcnJheSh0aGlzLl9ldmVudHNbdHlwZV0pKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgfTtcblxuICBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyc0FueSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgaWYodGhpcy5fYWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5fYWxsO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgfTtcblxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gRXZlbnRFbWl0dGVyO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIC8vIENvbW1vbkpTXG4gICAgZXhwb3J0cy5FdmVudEVtaXR0ZXIyID0gRXZlbnRFbWl0dGVyO1xuICB9XG4gIGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFsLlxuICAgIHdpbmRvdy5FdmVudEVtaXR0ZXIyID0gRXZlbnRFbWl0dGVyO1xuICB9XG59KCk7XG4iLCIvKiEgc2hpZnR5IC0gdjEuMi4xIC0gMjAxNC0wNi0yOSAtIGh0dHA6Ly9qZXJlbXlja2Fobi5naXRodWIuaW8vc2hpZnR5ICovXG47KGZ1bmN0aW9uIChyb290KSB7XG5cbi8qIVxuICogU2hpZnR5IENvcmVcbiAqIEJ5IEplcmVteSBLYWhuIC0gamVyZW15Y2thaG5AZ21haWwuY29tXG4gKi9cblxuLy8gVWdsaWZ5SlMgZGVmaW5lIGhhY2suICBVc2VkIGZvciB1bml0IHRlc3RpbmcuICBDb250ZW50cyBvZiB0aGlzIGlmIGFyZVxuLy8gY29tcGlsZWQgYXdheS5cbmlmICh0eXBlb2YgU0hJRlRZX0RFQlVHX05PVyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgU0hJRlRZX0RFQlVHX05PVyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gK25ldyBEYXRlKCk7XG4gIH07XG59XG5cbnZhciBUd2VlbmFibGUgPSAoZnVuY3Rpb24gKCkge1xuXG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBBbGlhc2VzIHRoYXQgZ2V0IGRlZmluZWQgbGF0ZXIgaW4gdGhpcyBmdW5jdGlvblxuICB2YXIgZm9ybXVsYTtcblxuICAvLyBDT05TVEFOVFNcbiAgdmFyIERFRkFVTFRfU0NIRURVTEVfRlVOQ1RJT047XG4gIHZhciBERUZBVUxUX0VBU0lORyA9ICdsaW5lYXInO1xuICB2YXIgREVGQVVMVF9EVVJBVElPTiA9IDUwMDtcbiAgdmFyIFVQREFURV9USU1FID0gMTAwMCAvIDYwO1xuXG4gIHZhciBfbm93ID0gRGF0ZS5ub3dcbiAgICAgICA/IERhdGUubm93XG4gICAgICAgOiBmdW5jdGlvbiAoKSB7cmV0dXJuICtuZXcgRGF0ZSgpO307XG5cbiAgdmFyIG5vdyA9IFNISUZUWV9ERUJVR19OT1dcbiAgICAgICA/IFNISUZUWV9ERUJVR19OT1dcbiAgICAgICA6IF9ub3c7XG5cbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCkgc2hpbSBieSBQYXVsIElyaXNoIChtb2RpZmllZCBmb3IgU2hpZnR5KVxuICAgIC8vIGh0dHA6Ly9wYXVsaXJpc2guY29tLzIwMTEvcmVxdWVzdGFuaW1hdGlvbmZyYW1lLWZvci1zbWFydC1hbmltYXRpbmcvXG4gICAgREVGQVVMVF9TQ0hFRFVMRV9GVU5DVElPTiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgICAgICB8fCB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gICAgICAgfHwgd2luZG93Lm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgICAgICB8fCB3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgICAgICB8fCAod2luZG93Lm1vekNhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZVxuICAgICAgICYmIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUpXG4gICAgICAgfHwgc2V0VGltZW91dDtcbiAgfSBlbHNlIHtcbiAgICBERUZBVUxUX1NDSEVEVUxFX0ZVTkNUSU9OID0gc2V0VGltZW91dDtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vb3AgKCkge1xuICAgIC8vIE5PT1AhXG4gIH1cblxuICAvKiFcbiAgICogSGFuZHkgc2hvcnRjdXQgZm9yIGRvaW5nIGEgZm9yLWluIGxvb3AuIFRoaXMgaXMgbm90IGEgXCJub3JtYWxcIiBlYWNoXG4gICAqIGZ1bmN0aW9uLCBpdCBpcyBvcHRpbWl6ZWQgZm9yIFNoaWZ0eS4gIFRoZSBpdGVyYXRvciBmdW5jdGlvbiBvbmx5IHJlY2VpdmVzXG4gICAqIHRoZSBwcm9wZXJ0eSBuYW1lLCBub3QgdGhlIHZhbHVlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb24oc3RyaW5nKX0gZm5cbiAgICovXG4gIGZ1bmN0aW9uIGVhY2ggKG9iaiwgZm4pIHtcbiAgICB2YXIga2V5O1xuICAgIGZvciAoa2V5IGluIG9iaikge1xuICAgICAgaWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xuICAgICAgICBmbihrZXkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qIVxuICAgKiBQZXJmb3JtIGEgc2hhbGxvdyBjb3B5IG9mIE9iamVjdCBwcm9wZXJ0aWVzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0T2JqZWN0IFRoZSBvYmplY3QgdG8gY29weSBpbnRvXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzcmNPYmplY3QgVGhlIG9iamVjdCB0byBjb3B5IGZyb21cbiAgICogQHJldHVybiB7T2JqZWN0fSBBIHJlZmVyZW5jZSB0byB0aGUgYXVnbWVudGVkIGB0YXJnZXRPYmpgIE9iamVjdFxuICAgKi9cbiAgZnVuY3Rpb24gc2hhbGxvd0NvcHkgKHRhcmdldE9iaiwgc3JjT2JqKSB7XG4gICAgZWFjaChzcmNPYmosIGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgICB0YXJnZXRPYmpbcHJvcF0gPSBzcmNPYmpbcHJvcF07XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGFyZ2V0T2JqO1xuICB9XG5cbiAgLyohXG4gICAqIENvcGllcyBlYWNoIHByb3BlcnR5IGZyb20gc3JjIG9udG8gdGFyZ2V0LCBidXQgb25seSBpZiB0aGUgcHJvcGVydHkgdG9cbiAgICogY29weSB0byB0YXJnZXQgaXMgdW5kZWZpbmVkLlxuICAgKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0IE1pc3NpbmcgcHJvcGVydGllcyBpbiB0aGlzIE9iamVjdCBhcmUgZmlsbGVkIGluXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzcmNcbiAgICovXG4gIGZ1bmN0aW9uIGRlZmF1bHRzICh0YXJnZXQsIHNyYykge1xuICAgIGVhY2goc3JjLCBmdW5jdGlvbiAocHJvcCkge1xuICAgICAgaWYgKHR5cGVvZiB0YXJnZXRbcHJvcF0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRhcmdldFtwcm9wXSA9IHNyY1twcm9wXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qIVxuICAgKiBDYWxjdWxhdGVzIHRoZSBpbnRlcnBvbGF0ZWQgdHdlZW4gdmFsdWVzIG9mIGFuIE9iamVjdCBmb3IgYSBnaXZlblxuICAgKiB0aW1lc3RhbXAuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBmb3JQb3NpdGlvbiBUaGUgcG9zaXRpb24gdG8gY29tcHV0ZSB0aGUgc3RhdGUgZm9yLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY3VycmVudFN0YXRlIEN1cnJlbnQgc3RhdGUgcHJvcGVydGllcy5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9yaWdpbmFsU3RhdGU6IFRoZSBvcmlnaW5hbCBzdGF0ZSBwcm9wZXJ0aWVzIHRoZSBPYmplY3QgaXNcbiAgICogdHdlZW5pbmcgZnJvbS5cbiAgICogQHBhcmFtIHtPYmplY3R9IHRhcmdldFN0YXRlOiBUaGUgZGVzdGluYXRpb24gc3RhdGUgcHJvcGVydGllcyB0aGUgT2JqZWN0XG4gICAqIGlzIHR3ZWVuaW5nIHRvLlxuICAgKiBAcGFyYW0ge251bWJlcn0gZHVyYXRpb246IFRoZSBsZW5ndGggb2YgdGhlIHR3ZWVuIGluIG1pbGxpc2Vjb25kcy5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHRpbWVzdGFtcDogVGhlIFVOSVggZXBvY2ggdGltZSBhdCB3aGljaCB0aGUgdHdlZW4gYmVnYW4uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlYXNpbmc6IFRoaXMgT2JqZWN0J3Mga2V5cyBtdXN0IGNvcnJlc3BvbmQgdG8gdGhlIGtleXMgaW5cbiAgICogdGFyZ2V0U3RhdGUuXG4gICAqL1xuICBmdW5jdGlvbiB0d2VlblByb3BzIChmb3JQb3NpdGlvbiwgY3VycmVudFN0YXRlLCBvcmlnaW5hbFN0YXRlLCB0YXJnZXRTdGF0ZSxcbiAgICBkdXJhdGlvbiwgdGltZXN0YW1wLCBlYXNpbmcpIHtcbiAgICB2YXIgbm9ybWFsaXplZFBvc2l0aW9uID0gKGZvclBvc2l0aW9uIC0gdGltZXN0YW1wKSAvIGR1cmF0aW9uO1xuXG4gICAgdmFyIHByb3A7XG4gICAgZm9yIChwcm9wIGluIGN1cnJlbnRTdGF0ZSkge1xuICAgICAgaWYgKGN1cnJlbnRTdGF0ZS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICBjdXJyZW50U3RhdGVbcHJvcF0gPSB0d2VlblByb3Aob3JpZ2luYWxTdGF0ZVtwcm9wXSxcbiAgICAgICAgICB0YXJnZXRTdGF0ZVtwcm9wXSwgZm9ybXVsYVtlYXNpbmdbcHJvcF1dLCBub3JtYWxpemVkUG9zaXRpb24pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjdXJyZW50U3RhdGU7XG4gIH1cblxuICAvKiFcbiAgICogVHdlZW5zIGEgc2luZ2xlIHByb3BlcnR5LlxuICAgKiBAcGFyYW0ge251bWJlcn0gc3RhcnQgVGhlIHZhbHVlIHRoYXQgdGhlIHR3ZWVuIHN0YXJ0ZWQgZnJvbS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGVuZCBUaGUgdmFsdWUgdGhhdCB0aGUgdHdlZW4gc2hvdWxkIGVuZCBhdC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZWFzaW5nRnVuYyBUaGUgZWFzaW5nIGN1cnZlIHRvIGFwcGx5IHRvIHRoZSB0d2Vlbi5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHBvc2l0aW9uIFRoZSBub3JtYWxpemVkIHBvc2l0aW9uIChiZXR3ZWVuIDAuMCBhbmQgMS4wKSB0b1xuICAgKiBjYWxjdWxhdGUgdGhlIG1pZHBvaW50IG9mICdzdGFydCcgYW5kICdlbmQnIGFnYWluc3QuXG4gICAqIEByZXR1cm4ge251bWJlcn0gVGhlIHR3ZWVuZWQgdmFsdWUuXG4gICAqL1xuICBmdW5jdGlvbiB0d2VlblByb3AgKHN0YXJ0LCBlbmQsIGVhc2luZ0Z1bmMsIHBvc2l0aW9uKSB7XG4gICAgcmV0dXJuIHN0YXJ0ICsgKGVuZCAtIHN0YXJ0KSAqIGVhc2luZ0Z1bmMocG9zaXRpb24pO1xuICB9XG5cbiAgLyohXG4gICAqIEFwcGxpZXMgYSBmaWx0ZXIgdG8gVHdlZW5hYmxlIGluc3RhbmNlLlxuICAgKiBAcGFyYW0ge1R3ZWVuYWJsZX0gdHdlZW5hYmxlIFRoZSBgVHdlZW5hYmxlYCBpbnN0YW5jZSB0byBjYWxsIHRoZSBmaWx0ZXJcbiAgICogdXBvbi5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGZpbHRlck5hbWUgVGhlIG5hbWUgb2YgdGhlIGZpbHRlciB0byBhcHBseS5cbiAgICovXG4gIGZ1bmN0aW9uIGFwcGx5RmlsdGVyICh0d2VlbmFibGUsIGZpbHRlck5hbWUpIHtcbiAgICB2YXIgZmlsdGVycyA9IFR3ZWVuYWJsZS5wcm90b3R5cGUuZmlsdGVyO1xuICAgIHZhciBhcmdzID0gdHdlZW5hYmxlLl9maWx0ZXJBcmdzO1xuXG4gICAgZWFjaChmaWx0ZXJzLCBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgaWYgKHR5cGVvZiBmaWx0ZXJzW25hbWVdW2ZpbHRlck5hbWVdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBmaWx0ZXJzW25hbWVdW2ZpbHRlck5hbWVdLmFwcGx5KHR3ZWVuYWJsZSwgYXJncyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB2YXIgdGltZW91dEhhbmRsZXJfZW5kVGltZTtcbiAgdmFyIHRpbWVvdXRIYW5kbGVyX2N1cnJlbnRUaW1lO1xuICB2YXIgdGltZW91dEhhbmRsZXJfaXNFbmRlZDtcbiAgLyohXG4gICAqIEhhbmRsZXMgdGhlIHVwZGF0ZSBsb2dpYyBmb3Igb25lIHN0ZXAgb2YgYSB0d2Vlbi5cbiAgICogQHBhcmFtIHtUd2VlbmFibGV9IHR3ZWVuYWJsZVxuICAgKiBAcGFyYW0ge251bWJlcn0gdGltZXN0YW1wXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBkdXJhdGlvblxuICAgKiBAcGFyYW0ge09iamVjdH0gY3VycmVudFN0YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcmlnaW5hbFN0YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXRTdGF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gZWFzaW5nXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IHN0ZXBcbiAgICogQHBhcmFtIHtGdW5jdGlvbihGdW5jdGlvbixudW1iZXIpfX0gc2NoZWR1bGVcbiAgICovXG4gIGZ1bmN0aW9uIHRpbWVvdXRIYW5kbGVyICh0d2VlbmFibGUsIHRpbWVzdGFtcCwgZHVyYXRpb24sIGN1cnJlbnRTdGF0ZSxcbiAgICBvcmlnaW5hbFN0YXRlLCB0YXJnZXRTdGF0ZSwgZWFzaW5nLCBzdGVwLCBzY2hlZHVsZSkge1xuICAgIHRpbWVvdXRIYW5kbGVyX2VuZFRpbWUgPSB0aW1lc3RhbXAgKyBkdXJhdGlvbjtcbiAgICB0aW1lb3V0SGFuZGxlcl9jdXJyZW50VGltZSA9IE1hdGgubWluKG5vdygpLCB0aW1lb3V0SGFuZGxlcl9lbmRUaW1lKTtcbiAgICB0aW1lb3V0SGFuZGxlcl9pc0VuZGVkID0gdGltZW91dEhhbmRsZXJfY3VycmVudFRpbWUgPj0gdGltZW91dEhhbmRsZXJfZW5kVGltZTtcblxuICAgIGlmICh0d2VlbmFibGUuaXNQbGF5aW5nKCkgJiYgIXRpbWVvdXRIYW5kbGVyX2lzRW5kZWQpIHtcbiAgICAgIHNjaGVkdWxlKHR3ZWVuYWJsZS5fdGltZW91dEhhbmRsZXIsIFVQREFURV9USU1FKTtcblxuICAgICAgYXBwbHlGaWx0ZXIodHdlZW5hYmxlLCAnYmVmb3JlVHdlZW4nKTtcbiAgICAgIHR3ZWVuUHJvcHModGltZW91dEhhbmRsZXJfY3VycmVudFRpbWUsIGN1cnJlbnRTdGF0ZSwgb3JpZ2luYWxTdGF0ZSxcbiAgICAgICAgdGFyZ2V0U3RhdGUsIGR1cmF0aW9uLCB0aW1lc3RhbXAsIGVhc2luZyk7XG4gICAgICBhcHBseUZpbHRlcih0d2VlbmFibGUsICdhZnRlclR3ZWVuJyk7XG5cbiAgICAgIHN0ZXAoY3VycmVudFN0YXRlKTtcbiAgICB9IGVsc2UgaWYgKHRpbWVvdXRIYW5kbGVyX2lzRW5kZWQpIHtcbiAgICAgIHN0ZXAodGFyZ2V0U3RhdGUpO1xuICAgICAgdHdlZW5hYmxlLnN0b3AodHJ1ZSk7XG4gICAgfVxuICB9XG5cblxuICAvKiFcbiAgICogQ3JlYXRlcyBhIHVzYWJsZSBlYXNpbmcgT2JqZWN0IGZyb20gZWl0aGVyIGEgc3RyaW5nIG9yIGFub3RoZXIgZWFzaW5nXG4gICAqIE9iamVjdC4gIElmIGBlYXNpbmdgIGlzIGFuIE9iamVjdCwgdGhlbiB0aGlzIGZ1bmN0aW9uIGNsb25lcyBpdCBhbmQgZmlsbHNcbiAgICogaW4gdGhlIG1pc3NpbmcgcHJvcGVydGllcyB3aXRoIFwibGluZWFyXCIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBmcm9tVHdlZW5QYXJhbXNcbiAgICogQHBhcmFtIHtPYmplY3R8c3RyaW5nfSBlYXNpbmdcbiAgICovXG4gIGZ1bmN0aW9uIGNvbXBvc2VFYXNpbmdPYmplY3QgKGZyb21Ud2VlblBhcmFtcywgZWFzaW5nKSB7XG4gICAgdmFyIGNvbXBvc2VkRWFzaW5nID0ge307XG5cbiAgICBpZiAodHlwZW9mIGVhc2luZyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVhY2goZnJvbVR3ZWVuUGFyYW1zLCBmdW5jdGlvbiAocHJvcCkge1xuICAgICAgICBjb21wb3NlZEVhc2luZ1twcm9wXSA9IGVhc2luZztcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBlYWNoKGZyb21Ud2VlblBhcmFtcywgZnVuY3Rpb24gKHByb3ApIHtcbiAgICAgICAgaWYgKCFjb21wb3NlZEVhc2luZ1twcm9wXSkge1xuICAgICAgICAgIGNvbXBvc2VkRWFzaW5nW3Byb3BdID0gZWFzaW5nW3Byb3BdIHx8IERFRkFVTFRfRUFTSU5HO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29tcG9zZWRFYXNpbmc7XG4gIH1cblxuICAvKipcbiAgICogVHdlZW5hYmxlIGNvbnN0cnVjdG9yLlxuICAgKiBAcGFyYW0ge09iamVjdD19IG9wdF9pbml0aWFsU3RhdGUgVGhlIHZhbHVlcyB0aGF0IHRoZSBpbml0aWFsIHR3ZWVuIHNob3VsZCBzdGFydCBhdCBpZiBhIFwiZnJvbVwiIG9iamVjdCBpcyBub3QgcHJvdmlkZWQgdG8gVHdlZW5hYmxlI3R3ZWVuLlxuICAgKiBAcGFyYW0ge09iamVjdD19IG9wdF9jb25maWcgU2VlIFR3ZWVuYWJsZS5wcm90b3R5cGUuc2V0Q29uZmlnKClcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBmdW5jdGlvbiBUd2VlbmFibGUgKG9wdF9pbml0aWFsU3RhdGUsIG9wdF9jb25maWcpIHtcbiAgICB0aGlzLl9jdXJyZW50U3RhdGUgPSBvcHRfaW5pdGlhbFN0YXRlIHx8IHt9O1xuICAgIHRoaXMuX2NvbmZpZ3VyZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9zY2hlZHVsZUZ1bmN0aW9uID0gREVGQVVMVF9TQ0hFRFVMRV9GVU5DVElPTjtcblxuICAgIC8vIFRvIHByZXZlbnQgdW5uZWNlc3NhcnkgY2FsbHMgdG8gc2V0Q29uZmlnIGRvIG5vdCBzZXQgZGVmYXVsdCBjb25maWd1cmF0aW9uIGhlcmUuXG4gICAgLy8gT25seSBzZXQgZGVmYXVsdCBjb25maWd1cmF0aW9uIGltbWVkaWF0ZWx5IGJlZm9yZSB0d2VlbmluZyBpZiBub25lIGhhcyBiZWVuIHNldC5cbiAgICBpZiAodHlwZW9mIG9wdF9jb25maWcgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzLnNldENvbmZpZyhvcHRfY29uZmlnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ29uZmlndXJlIGFuZCBzdGFydCBhIHR3ZWVuLlxuICAgKiBAcGFyYW0ge09iamVjdD19IG9wdF9jb25maWcgU2VlIFR3ZWVuYWJsZS5wcm90b3R5cGUuc2V0Q29uZmlnKClcbiAgICogQHJldHVybiB7VHdlZW5hYmxlfVxuICAgKi9cbiAgVHdlZW5hYmxlLnByb3RvdHlwZS50d2VlbiA9IGZ1bmN0aW9uIChvcHRfY29uZmlnKSB7XG4gICAgaWYgKHRoaXMuX2lzVHdlZW5pbmcpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8vIE9ubHkgc2V0IGRlZmF1bHQgY29uZmlnIGlmIG5vIGNvbmZpZ3VyYXRpb24gaGFzIGJlZW4gc2V0IHByZXZpb3VzbHkgYW5kIG5vbmUgaXMgcHJvdmlkZWQgbm93LlxuICAgIGlmIChvcHRfY29uZmlnICE9PSB1bmRlZmluZWQgfHwgIXRoaXMuX2NvbmZpZ3VyZWQpIHtcbiAgICAgIHRoaXMuc2V0Q29uZmlnKG9wdF9jb25maWcpO1xuICAgIH1cblxuICAgIHRoaXMuX3N0YXJ0KHRoaXMuZ2V0KCkpO1xuICAgIHJldHVybiB0aGlzLnJlc3VtZSgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB0d2VlbiBjb25maWd1cmF0aW9uLiBgY29uZmlnYCBtYXkgaGF2ZSB0aGUgZm9sbG93aW5nIG9wdGlvbnM6XG4gICAqXG4gICAqIC0gX19mcm9tX18gKF9PYmplY3Q9Xyk6IFN0YXJ0aW5nIHBvc2l0aW9uLiAgSWYgb21pdHRlZCwgdGhlIGN1cnJlbnQgc3RhdGUgaXMgdXNlZC5cbiAgICogLSBfX3RvX18gKF9PYmplY3Q9Xyk6IEVuZGluZyBwb3NpdGlvbi5cbiAgICogLSBfX2R1cmF0aW9uX18gKF9udW1iZXI9Xyk6IEhvdyBtYW55IG1pbGxpc2Vjb25kcyB0byBhbmltYXRlIGZvci5cbiAgICogLSBfX3N0YXJ0X18gKF9GdW5jdGlvbihPYmplY3QpPV8pOiBGdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gdGhlIHR3ZWVuIGJlZ2lucy4gIFJlY2VpdmVzIHRoZSBzdGF0ZSBvZiB0aGUgdHdlZW4gYXMgdGhlIG9ubHkgcGFyYW1ldGVyLlxuICAgKiAtIF9fc3RlcF9fIChfRnVuY3Rpb24oT2JqZWN0KT1fKTogRnVuY3Rpb24gdG8gZXhlY3V0ZSBvbiBldmVyeSB0aWNrLiAgUmVjZWl2ZXMgdGhlIHN0YXRlIG9mIHRoZSB0d2VlbiBhcyB0aGUgb25seSBwYXJhbWV0ZXIuICBUaGlzIGZ1bmN0aW9uIGlzIG5vdCBjYWxsZWQgb24gdGhlIGZpbmFsIHN0ZXAgb2YgdGhlIGFuaW1hdGlvbiwgYnV0IGBmaW5pc2hgIGlzLlxuICAgKiAtIF9fZmluaXNoX18gKF9GdW5jdGlvbihPYmplY3QpPV8pOiBGdW5jdGlvbiB0byBleGVjdXRlIHVwb24gdHdlZW4gY29tcGxldGlvbi4gIFJlY2VpdmVzIHRoZSBzdGF0ZSBvZiB0aGUgdHdlZW4gYXMgdGhlIG9ubHkgcGFyYW1ldGVyLlxuICAgKiAtIF9fZWFzaW5nX18gKF9PYmplY3R8c3RyaW5nPV8pOiBFYXNpbmcgY3VydmUgbmFtZShzKSB0byB1c2UgZm9yIHRoZSB0d2Vlbi5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xuICAgKiBAcmV0dXJuIHtUd2VlbmFibGV9XG4gICAqL1xuICBUd2VlbmFibGUucHJvdG90eXBlLnNldENvbmZpZyA9IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICBjb25maWcgPSBjb25maWcgfHwge307XG4gICAgdGhpcy5fY29uZmlndXJlZCA9IHRydWU7XG5cbiAgICAvLyBJbml0IHRoZSBpbnRlcm5hbCBzdGF0ZVxuICAgIHRoaXMuX3BhdXNlZEF0VGltZSA9IG51bGw7XG4gICAgdGhpcy5fc3RhcnQgPSBjb25maWcuc3RhcnQgfHwgbm9vcDtcbiAgICB0aGlzLl9zdGVwID0gY29uZmlnLnN0ZXAgfHwgbm9vcDtcbiAgICB0aGlzLl9maW5pc2ggPSBjb25maWcuZmluaXNoIHx8IG5vb3A7XG4gICAgdGhpcy5fZHVyYXRpb24gPSBjb25maWcuZHVyYXRpb24gfHwgREVGQVVMVF9EVVJBVElPTjtcbiAgICB0aGlzLl9jdXJyZW50U3RhdGUgPSBjb25maWcuZnJvbSB8fCB0aGlzLmdldCgpO1xuICAgIHRoaXMuX29yaWdpbmFsU3RhdGUgPSB0aGlzLmdldCgpO1xuICAgIHRoaXMuX3RhcmdldFN0YXRlID0gY29uZmlnLnRvIHx8IHRoaXMuZ2V0KCk7XG4gICAgdGhpcy5fdGltZXN0YW1wID0gbm93KCk7XG5cbiAgICAvLyBBbGlhc2VzIHVzZWQgYmVsb3dcbiAgICB2YXIgY3VycmVudFN0YXRlID0gdGhpcy5fY3VycmVudFN0YXRlO1xuICAgIHZhciB0YXJnZXRTdGF0ZSA9IHRoaXMuX3RhcmdldFN0YXRlO1xuXG4gICAgLy8gRW5zdXJlIHRoYXQgdGhlcmUgaXMgYWx3YXlzIHNvbWV0aGluZyB0byB0d2VlbiB0by5cbiAgICBkZWZhdWx0cyh0YXJnZXRTdGF0ZSwgY3VycmVudFN0YXRlKTtcblxuICAgIHRoaXMuX2Vhc2luZyA9IGNvbXBvc2VFYXNpbmdPYmplY3QoXG4gICAgICBjdXJyZW50U3RhdGUsIGNvbmZpZy5lYXNpbmcgfHwgREVGQVVMVF9FQVNJTkcpO1xuXG4gICAgdGhpcy5fZmlsdGVyQXJncyA9XG4gICAgICBbY3VycmVudFN0YXRlLCB0aGlzLl9vcmlnaW5hbFN0YXRlLCB0YXJnZXRTdGF0ZSwgdGhpcy5fZWFzaW5nXTtcblxuICAgIGFwcGx5RmlsdGVyKHRoaXMsICd0d2VlbkNyZWF0ZWQnKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogR2V0cyB0aGUgY3VycmVudCBzdGF0ZS5cbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cbiAgVHdlZW5hYmxlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHNoYWxsb3dDb3B5KHt9LCB0aGlzLl9jdXJyZW50U3RhdGUpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBjdXJyZW50IHN0YXRlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVcbiAgICovXG4gIFR3ZWVuYWJsZS5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgdGhpcy5fY3VycmVudFN0YXRlID0gc3RhdGU7XG4gIH07XG5cbiAgLyoqXG4gICAqIFBhdXNlcyBhIHR3ZWVuLiAgUGF1c2VkIHR3ZWVucyBjYW4gYmUgcmVzdW1lZCBmcm9tIHRoZSBwb2ludCBhdCB3aGljaCB0aGV5IHdlcmUgcGF1c2VkLiAgVGhpcyBpcyBkaWZmZXJlbnQgdGhhbiBbYHN0b3AoKWBdKCNzdG9wKSwgYXMgdGhhdCBtZXRob2QgY2F1c2VzIGEgdHdlZW4gdG8gc3RhcnQgb3ZlciB3aGVuIGl0IGlzIHJlc3VtZWQuXG4gICAqIEByZXR1cm4ge1R3ZWVuYWJsZX1cbiAgICovXG4gIFR3ZWVuYWJsZS5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fcGF1c2VkQXRUaW1lID0gbm93KCk7XG4gICAgdGhpcy5faXNQYXVzZWQgPSB0cnVlO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXN1bWVzIGEgcGF1c2VkIHR3ZWVuLlxuICAgKiBAcmV0dXJuIHtUd2VlbmFibGV9XG4gICAqL1xuICBUd2VlbmFibGUucHJvdG90eXBlLnJlc3VtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5faXNQYXVzZWQpIHtcbiAgICAgIHRoaXMuX3RpbWVzdGFtcCArPSBub3coKSAtIHRoaXMuX3BhdXNlZEF0VGltZTtcbiAgICB9XG5cbiAgICB0aGlzLl9pc1BhdXNlZCA9IGZhbHNlO1xuICAgIHRoaXMuX2lzVHdlZW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuX3RpbWVvdXRIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGltZW91dEhhbmRsZXIoc2VsZiwgc2VsZi5fdGltZXN0YW1wLCBzZWxmLl9kdXJhdGlvbiwgc2VsZi5fY3VycmVudFN0YXRlLFxuICAgICAgICBzZWxmLl9vcmlnaW5hbFN0YXRlLCBzZWxmLl90YXJnZXRTdGF0ZSwgc2VsZi5fZWFzaW5nLCBzZWxmLl9zdGVwLFxuICAgICAgICBzZWxmLl9zY2hlZHVsZUZ1bmN0aW9uKTtcbiAgICB9O1xuXG4gICAgdGhpcy5fdGltZW91dEhhbmRsZXIoKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTdG9wcyBhbmQgY2FuY2VscyBhIHR3ZWVuLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBnb3RvRW5kIElmIGZhbHNlIG9yIG9taXR0ZWQsIHRoZSB0d2VlbiBqdXN0IHN0b3BzIGF0IGl0cyBjdXJyZW50IHN0YXRlLCBhbmQgdGhlIFwiZmluaXNoXCIgaGFuZGxlciBpcyBub3QgaW52b2tlZC4gIElmIHRydWUsIHRoZSB0d2VlbmVkIG9iamVjdCdzIHZhbHVlcyBhcmUgaW5zdGFudGx5IHNldCB0byB0aGUgdGFyZ2V0IHZhbHVlcywgYW5kIFwiZmluaXNoXCIgaXMgaW52b2tlZC5cbiAgICogQHJldHVybiB7VHdlZW5hYmxlfVxuICAgKi9cbiAgVHdlZW5hYmxlLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKGdvdG9FbmQpIHtcbiAgICB0aGlzLl9pc1R3ZWVuaW5nID0gZmFsc2U7XG4gICAgdGhpcy5faXNQYXVzZWQgPSBmYWxzZTtcbiAgICB0aGlzLl90aW1lb3V0SGFuZGxlciA9IG5vb3A7XG5cbiAgICBpZiAoZ290b0VuZCkge1xuICAgICAgc2hhbGxvd0NvcHkodGhpcy5fY3VycmVudFN0YXRlLCB0aGlzLl90YXJnZXRTdGF0ZSk7XG4gICAgICBhcHBseUZpbHRlcih0aGlzLCAnYWZ0ZXJUd2VlbkVuZCcpO1xuICAgICAgdGhpcy5fZmluaXNoLmNhbGwodGhpcywgdGhpcy5fY3VycmVudFN0YXRlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCBhIHR3ZWVuIGlzIHJ1bm5pbmcuXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBUd2VlbmFibGUucHJvdG90eXBlLmlzUGxheWluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5faXNUd2VlbmluZyAmJiAhdGhpcy5faXNQYXVzZWQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNldHMgYSBjdXN0b20gc2NoZWR1bGUgZnVuY3Rpb24uXG4gICAqXG4gICAqIElmIGEgY3VzdG9tIGZ1bmN0aW9uIGlzIG5vdCBzZXQgdGhlIGRlZmF1bHQgb25lIGlzIHVzZWQgW2ByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkgaWYgYXZhaWxhYmxlLCBvdGhlcndpc2UgW2BzZXRUaW1lb3V0YF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dpbmRvdy5zZXRUaW1lb3V0KSkuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb24oRnVuY3Rpb24sbnVtYmVyKX0gc2NoZWR1bGVGdW5jdGlvbiBUaGUgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIHRvIHNjaGVkdWxlIHRoZSBuZXh0IGZyYW1lIHRvIGJlIHJlbmRlcmVkXG4gICAqL1xuICBUd2VlbmFibGUucHJvdG90eXBlLnNldFNjaGVkdWxlRnVuY3Rpb24gPSBmdW5jdGlvbiAoc2NoZWR1bGVGdW5jdGlvbikge1xuICAgIHRoaXMuX3NjaGVkdWxlRnVuY3Rpb24gPSBzY2hlZHVsZUZ1bmN0aW9uO1xuICB9O1xuXG4gIC8qKlxuICAgKiBgZGVsZXRlYHMgYWxsIFwib3duXCIgcHJvcGVydGllcy4gIENhbGwgdGhpcyB3aGVuIHRoZSBgVHdlZW5hYmxlYCBpbnN0YW5jZSBpcyBubyBsb25nZXIgbmVlZGVkIHRvIGZyZWUgbWVtb3J5LlxuICAgKi9cbiAgVHdlZW5hYmxlLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9wO1xuICAgIGZvciAocHJvcCBpbiB0aGlzKSB7XG4gICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICBkZWxldGUgdGhpc1twcm9wXTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyohXG4gICAqIEZpbHRlcnMgYXJlIHVzZWQgZm9yIHRyYW5zZm9ybWluZyB0aGUgcHJvcGVydGllcyBvZiBhIHR3ZWVuIGF0IHZhcmlvdXNcbiAgICogcG9pbnRzIGluIGEgVHdlZW5hYmxlJ3MgbGlmZSBjeWNsZS4gIFNlZSB0aGUgUkVBRE1FIGZvciBtb3JlIGluZm8gb24gdGhpcy5cbiAgICovXG4gIFR3ZWVuYWJsZS5wcm90b3R5cGUuZmlsdGVyID0ge307XG5cbiAgLyohXG4gICAqIFRoaXMgb2JqZWN0IGNvbnRhaW5zIGFsbCBvZiB0aGUgdHdlZW5zIGF2YWlsYWJsZSB0byBTaGlmdHkuICBJdCBpcyBleHRlbmRpYmxlIC0gc2ltcGx5IGF0dGFjaCBwcm9wZXJ0aWVzIHRvIHRoZSBUd2VlbmFibGUucHJvdG90eXBlLmZvcm11bGEgT2JqZWN0IGZvbGxvd2luZyB0aGUgc2FtZSBmb3JtYXQgYXQgbGluZWFyLlxuICAgKlxuICAgKiBgcG9zYCBzaG91bGQgYmUgYSBub3JtYWxpemVkIGBudW1iZXJgIChiZXR3ZWVuIDAgYW5kIDEpLlxuICAgKi9cbiAgVHdlZW5hYmxlLnByb3RvdHlwZS5mb3JtdWxhID0ge1xuICAgIGxpbmVhcjogZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIHBvcztcbiAgICB9XG4gIH07XG5cbiAgZm9ybXVsYSA9IFR3ZWVuYWJsZS5wcm90b3R5cGUuZm9ybXVsYTtcblxuICBzaGFsbG93Q29weShUd2VlbmFibGUsIHtcbiAgICAnbm93Jzogbm93XG4gICAgLCdlYWNoJzogZWFjaFxuICAgICwndHdlZW5Qcm9wcyc6IHR3ZWVuUHJvcHNcbiAgICAsJ3R3ZWVuUHJvcCc6IHR3ZWVuUHJvcFxuICAgICwnYXBwbHlGaWx0ZXInOiBhcHBseUZpbHRlclxuICAgICwnc2hhbGxvd0NvcHknOiBzaGFsbG93Q29weVxuICAgICwnZGVmYXVsdHMnOiBkZWZhdWx0c1xuICAgICwnY29tcG9zZUVhc2luZ09iamVjdCc6IGNvbXBvc2VFYXNpbmdPYmplY3RcbiAgfSk7XG5cbiAgLy8gYHJvb3RgIGlzIHByb3ZpZGVkIGluIHRoZSBpbnRyby9vdXRybyBmaWxlcy5cblxuICAvLyBBIGhvb2sgdXNlZCBmb3IgdW5pdCB0ZXN0aW5nLlxuICBpZiAodHlwZW9mIFNISUZUWV9ERUJVR19OT1cgPT09ICdmdW5jdGlvbicpIHtcbiAgICByb290LnRpbWVvdXRIYW5kbGVyID0gdGltZW91dEhhbmRsZXI7XG4gIH1cblxuICAvLyBCb290c3RyYXAgVHdlZW5hYmxlIGFwcHJvcHJpYXRlbHkgZm9yIHRoZSBlbnZpcm9ubWVudC5cbiAgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIC8vIENvbW1vbkpTXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBUd2VlbmFibGU7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gQU1EXG4gICAgZGVmaW5lKGZ1bmN0aW9uICgpIHtyZXR1cm4gVHdlZW5hYmxlO30pO1xuICB9IGVsc2UgaWYgKHR5cGVvZiByb290LlR3ZWVuYWJsZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBCcm93c2VyOiBNYWtlIGBUd2VlbmFibGVgIGdsb2JhbGx5IGFjY2Vzc2libGUuXG4gICAgcm9vdC5Ud2VlbmFibGUgPSBUd2VlbmFibGU7XG4gIH1cblxuICByZXR1cm4gVHdlZW5hYmxlO1xuXG59ICgpKTtcblxuLyohXG4gKiBBbGwgZXF1YXRpb25zIGFyZSBhZGFwdGVkIGZyb20gVGhvbWFzIEZ1Y2hzJyBbU2NyaXB0eTJdKGh0dHBzOi8vZ2l0aHViLmNvbS9tYWRyb2JieS9zY3JpcHR5Mi9ibG9iL21hc3Rlci9zcmMvZWZmZWN0cy90cmFuc2l0aW9ucy9wZW5uZXIuanMpLlxuICpcbiAqIEJhc2VkIG9uIEVhc2luZyBFcXVhdGlvbnMgKGMpIDIwMDMgW1JvYmVydCBQZW5uZXJdKGh0dHA6Ly93d3cucm9iZXJ0cGVubmVyLmNvbS8pLCBhbGwgcmlnaHRzIHJlc2VydmVkLiBUaGlzIHdvcmsgaXMgW3N1YmplY3QgdG8gdGVybXNdKGh0dHA6Ly93d3cucm9iZXJ0cGVubmVyLmNvbS9lYXNpbmdfdGVybXNfb2ZfdXNlLmh0bWwpLlxuICovXG5cbi8qIVxuICogIFRFUk1TIE9GIFVTRSAtIEVBU0lORyBFUVVBVElPTlNcbiAqICBPcGVuIHNvdXJjZSB1bmRlciB0aGUgQlNEIExpY2Vuc2UuXG4gKiAgRWFzaW5nIEVxdWF0aW9ucyAoYykgMjAwMyBSb2JlcnQgUGVubmVyLCBhbGwgcmlnaHRzIHJlc2VydmVkLlxuICovXG5cbjsoZnVuY3Rpb24gKCkge1xuXG4gIFR3ZWVuYWJsZS5zaGFsbG93Q29weShUd2VlbmFibGUucHJvdG90eXBlLmZvcm11bGEsIHtcbiAgICBlYXNlSW5RdWFkOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gTWF0aC5wb3cocG9zLCAyKTtcbiAgICB9LFxuXG4gICAgZWFzZU91dFF1YWQ6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiAtKE1hdGgucG93KChwb3MgLSAxKSwgMikgLSAxKTtcbiAgICB9LFxuXG4gICAgZWFzZUluT3V0UXVhZDogZnVuY3Rpb24gKHBvcykge1xuICAgICAgaWYgKChwb3MgLz0gMC41KSA8IDEpIHtyZXR1cm4gMC41ICogTWF0aC5wb3cocG9zLDIpO31cbiAgICAgIHJldHVybiAtMC41ICogKChwb3MgLT0gMikgKiBwb3MgLSAyKTtcbiAgICB9LFxuXG4gICAgZWFzZUluQ3ViaWM6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiBNYXRoLnBvdyhwb3MsIDMpO1xuICAgIH0sXG5cbiAgICBlYXNlT3V0Q3ViaWM6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiAoTWF0aC5wb3coKHBvcyAtIDEpLCAzKSArIDEpO1xuICAgIH0sXG5cbiAgICBlYXNlSW5PdXRDdWJpYzogZnVuY3Rpb24gKHBvcykge1xuICAgICAgaWYgKChwb3MgLz0gMC41KSA8IDEpIHtyZXR1cm4gMC41ICogTWF0aC5wb3cocG9zLDMpO31cbiAgICAgIHJldHVybiAwLjUgKiAoTWF0aC5wb3coKHBvcyAtIDIpLDMpICsgMik7XG4gICAgfSxcblxuICAgIGVhc2VJblF1YXJ0OiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gTWF0aC5wb3cocG9zLCA0KTtcbiAgICB9LFxuXG4gICAgZWFzZU91dFF1YXJ0OiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gLShNYXRoLnBvdygocG9zIC0gMSksIDQpIC0gMSk7XG4gICAgfSxcblxuICAgIGVhc2VJbk91dFF1YXJ0OiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICBpZiAoKHBvcyAvPSAwLjUpIDwgMSkge3JldHVybiAwLjUgKiBNYXRoLnBvdyhwb3MsNCk7fVxuICAgICAgcmV0dXJuIC0wLjUgKiAoKHBvcyAtPSAyKSAqIE1hdGgucG93KHBvcywzKSAtIDIpO1xuICAgIH0sXG5cbiAgICBlYXNlSW5RdWludDogZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIE1hdGgucG93KHBvcywgNSk7XG4gICAgfSxcblxuICAgIGVhc2VPdXRRdWludDogZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIChNYXRoLnBvdygocG9zIC0gMSksIDUpICsgMSk7XG4gICAgfSxcblxuICAgIGVhc2VJbk91dFF1aW50OiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICBpZiAoKHBvcyAvPSAwLjUpIDwgMSkge3JldHVybiAwLjUgKiBNYXRoLnBvdyhwb3MsNSk7fVxuICAgICAgcmV0dXJuIDAuNSAqIChNYXRoLnBvdygocG9zIC0gMiksNSkgKyAyKTtcbiAgICB9LFxuXG4gICAgZWFzZUluU2luZTogZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIC1NYXRoLmNvcyhwb3MgKiAoTWF0aC5QSSAvIDIpKSArIDE7XG4gICAgfSxcblxuICAgIGVhc2VPdXRTaW5lOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gTWF0aC5zaW4ocG9zICogKE1hdGguUEkgLyAyKSk7XG4gICAgfSxcblxuICAgIGVhc2VJbk91dFNpbmU6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiAoLTAuNSAqIChNYXRoLmNvcyhNYXRoLlBJICogcG9zKSAtIDEpKTtcbiAgICB9LFxuXG4gICAgZWFzZUluRXhwbzogZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIChwb3MgPT09IDApID8gMCA6IE1hdGgucG93KDIsIDEwICogKHBvcyAtIDEpKTtcbiAgICB9LFxuXG4gICAgZWFzZU91dEV4cG86IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiAocG9zID09PSAxKSA/IDEgOiAtTWF0aC5wb3coMiwgLTEwICogcG9zKSArIDE7XG4gICAgfSxcblxuICAgIGVhc2VJbk91dEV4cG86IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIGlmIChwb3MgPT09IDApIHtyZXR1cm4gMDt9XG4gICAgICBpZiAocG9zID09PSAxKSB7cmV0dXJuIDE7fVxuICAgICAgaWYgKChwb3MgLz0gMC41KSA8IDEpIHtyZXR1cm4gMC41ICogTWF0aC5wb3coMiwxMCAqIChwb3MgLSAxKSk7fVxuICAgICAgcmV0dXJuIDAuNSAqICgtTWF0aC5wb3coMiwgLTEwICogLS1wb3MpICsgMik7XG4gICAgfSxcblxuICAgIGVhc2VJbkNpcmM6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiAtKE1hdGguc3FydCgxIC0gKHBvcyAqIHBvcykpIC0gMSk7XG4gICAgfSxcblxuICAgIGVhc2VPdXRDaXJjOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gTWF0aC5zcXJ0KDEgLSBNYXRoLnBvdygocG9zIC0gMSksIDIpKTtcbiAgICB9LFxuXG4gICAgZWFzZUluT3V0Q2lyYzogZnVuY3Rpb24gKHBvcykge1xuICAgICAgaWYgKChwb3MgLz0gMC41KSA8IDEpIHtyZXR1cm4gLTAuNSAqIChNYXRoLnNxcnQoMSAtIHBvcyAqIHBvcykgLSAxKTt9XG4gICAgICByZXR1cm4gMC41ICogKE1hdGguc3FydCgxIC0gKHBvcyAtPSAyKSAqIHBvcykgKyAxKTtcbiAgICB9LFxuXG4gICAgZWFzZU91dEJvdW5jZTogZnVuY3Rpb24gKHBvcykge1xuICAgICAgaWYgKChwb3MpIDwgKDEgLyAyLjc1KSkge1xuICAgICAgICByZXR1cm4gKDcuNTYyNSAqIHBvcyAqIHBvcyk7XG4gICAgICB9IGVsc2UgaWYgKHBvcyA8ICgyIC8gMi43NSkpIHtcbiAgICAgICAgcmV0dXJuICg3LjU2MjUgKiAocG9zIC09ICgxLjUgLyAyLjc1KSkgKiBwb3MgKyAwLjc1KTtcbiAgICAgIH0gZWxzZSBpZiAocG9zIDwgKDIuNSAvIDIuNzUpKSB7XG4gICAgICAgIHJldHVybiAoNy41NjI1ICogKHBvcyAtPSAoMi4yNSAvIDIuNzUpKSAqIHBvcyArIDAuOTM3NSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gKDcuNTYyNSAqIChwb3MgLT0gKDIuNjI1IC8gMi43NSkpICogcG9zICsgMC45ODQzNzUpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBlYXNlSW5CYWNrOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICB2YXIgcyA9IDEuNzAxNTg7XG4gICAgICByZXR1cm4gKHBvcykgKiBwb3MgKiAoKHMgKyAxKSAqIHBvcyAtIHMpO1xuICAgIH0sXG5cbiAgICBlYXNlT3V0QmFjazogZnVuY3Rpb24gKHBvcykge1xuICAgICAgdmFyIHMgPSAxLjcwMTU4O1xuICAgICAgcmV0dXJuIChwb3MgPSBwb3MgLSAxKSAqIHBvcyAqICgocyArIDEpICogcG9zICsgcykgKyAxO1xuICAgIH0sXG5cbiAgICBlYXNlSW5PdXRCYWNrOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICB2YXIgcyA9IDEuNzAxNTg7XG4gICAgICBpZiAoKHBvcyAvPSAwLjUpIDwgMSkge3JldHVybiAwLjUgKiAocG9zICogcG9zICogKCgocyAqPSAoMS41MjUpKSArIDEpICogcG9zIC0gcykpO31cbiAgICAgIHJldHVybiAwLjUgKiAoKHBvcyAtPSAyKSAqIHBvcyAqICgoKHMgKj0gKDEuNTI1KSkgKyAxKSAqIHBvcyArIHMpICsgMik7XG4gICAgfSxcblxuICAgIGVsYXN0aWM6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiAtMSAqIE1hdGgucG93KDQsLTggKiBwb3MpICogTWF0aC5zaW4oKHBvcyAqIDYgLSAxKSAqICgyICogTWF0aC5QSSkgLyAyKSArIDE7XG4gICAgfSxcblxuICAgIHN3aW5nRnJvbVRvOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICB2YXIgcyA9IDEuNzAxNTg7XG4gICAgICByZXR1cm4gKChwb3MgLz0gMC41KSA8IDEpID8gMC41ICogKHBvcyAqIHBvcyAqICgoKHMgKj0gKDEuNTI1KSkgKyAxKSAqIHBvcyAtIHMpKSA6XG4gICAgICAgICAgMC41ICogKChwb3MgLT0gMikgKiBwb3MgKiAoKChzICo9ICgxLjUyNSkpICsgMSkgKiBwb3MgKyBzKSArIDIpO1xuICAgIH0sXG5cbiAgICBzd2luZ0Zyb206IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHZhciBzID0gMS43MDE1ODtcbiAgICAgIHJldHVybiBwb3MgKiBwb3MgKiAoKHMgKyAxKSAqIHBvcyAtIHMpO1xuICAgIH0sXG5cbiAgICBzd2luZ1RvOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICB2YXIgcyA9IDEuNzAxNTg7XG4gICAgICByZXR1cm4gKHBvcyAtPSAxKSAqIHBvcyAqICgocyArIDEpICogcG9zICsgcykgKyAxO1xuICAgIH0sXG5cbiAgICBib3VuY2U6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIGlmIChwb3MgPCAoMSAvIDIuNzUpKSB7XG4gICAgICAgIHJldHVybiAoNy41NjI1ICogcG9zICogcG9zKTtcbiAgICAgIH0gZWxzZSBpZiAocG9zIDwgKDIgLyAyLjc1KSkge1xuICAgICAgICByZXR1cm4gKDcuNTYyNSAqIChwb3MgLT0gKDEuNSAvIDIuNzUpKSAqIHBvcyArIDAuNzUpO1xuICAgICAgfSBlbHNlIGlmIChwb3MgPCAoMi41IC8gMi43NSkpIHtcbiAgICAgICAgcmV0dXJuICg3LjU2MjUgKiAocG9zIC09ICgyLjI1IC8gMi43NSkpICogcG9zICsgMC45Mzc1KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAoNy41NjI1ICogKHBvcyAtPSAoMi42MjUgLyAyLjc1KSkgKiBwb3MgKyAwLjk4NDM3NSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGJvdW5jZVBhc3Q6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIGlmIChwb3MgPCAoMSAvIDIuNzUpKSB7XG4gICAgICAgIHJldHVybiAoNy41NjI1ICogcG9zICogcG9zKTtcbiAgICAgIH0gZWxzZSBpZiAocG9zIDwgKDIgLyAyLjc1KSkge1xuICAgICAgICByZXR1cm4gMiAtICg3LjU2MjUgKiAocG9zIC09ICgxLjUgLyAyLjc1KSkgKiBwb3MgKyAwLjc1KTtcbiAgICAgIH0gZWxzZSBpZiAocG9zIDwgKDIuNSAvIDIuNzUpKSB7XG4gICAgICAgIHJldHVybiAyIC0gKDcuNTYyNSAqIChwb3MgLT0gKDIuMjUgLyAyLjc1KSkgKiBwb3MgKyAwLjkzNzUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIDIgLSAoNy41NjI1ICogKHBvcyAtPSAoMi42MjUgLyAyLjc1KSkgKiBwb3MgKyAwLjk4NDM3NSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGVhc2VGcm9tVG86IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIGlmICgocG9zIC89IDAuNSkgPCAxKSB7cmV0dXJuIDAuNSAqIE1hdGgucG93KHBvcyw0KTt9XG4gICAgICByZXR1cm4gLTAuNSAqICgocG9zIC09IDIpICogTWF0aC5wb3cocG9zLDMpIC0gMik7XG4gICAgfSxcblxuICAgIGVhc2VGcm9tOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gTWF0aC5wb3cocG9zLDQpO1xuICAgIH0sXG5cbiAgICBlYXNlVG86IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiBNYXRoLnBvdyhwb3MsMC4yNSk7XG4gICAgfVxuICB9KTtcblxufSgpKTtcblxuLyohXG4gKiBUaGUgQmV6aWVyIG1hZ2ljIGluIHRoaXMgZmlsZSBpcyBhZGFwdGVkL2NvcGllZCBhbG1vc3Qgd2hvbGVzYWxlIGZyb21cbiAqIFtTY3JpcHR5Ml0oaHR0cHM6Ly9naXRodWIuY29tL21hZHJvYmJ5L3NjcmlwdHkyL2Jsb2IvbWFzdGVyL3NyYy9lZmZlY3RzL3RyYW5zaXRpb25zL2N1YmljLWJlemllci5qcyksXG4gKiB3aGljaCB3YXMgYWRhcHRlZCBmcm9tIEFwcGxlIGNvZGUgKHdoaWNoIHByb2JhYmx5IGNhbWUgZnJvbVxuICogW2hlcmVdKGh0dHA6Ly9vcGVuc291cmNlLmFwcGxlLmNvbS9zb3VyY2UvV2ViQ29yZS9XZWJDb3JlLTk1NS42Ni9wbGF0Zm9ybS9ncmFwaGljcy9Vbml0QmV6aWVyLmgpKS5cbiAqIFNwZWNpYWwgdGhhbmtzIHRvIEFwcGxlIGFuZCBUaG9tYXMgRnVjaHMgZm9yIG11Y2ggb2YgdGhpcyBjb2RlLlxuICovXG5cbi8qIVxuICogIENvcHlyaWdodCAoYykgMjAwNiBBcHBsZSBDb21wdXRlciwgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqICBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXRcbiAqICBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcbiAqXG4gKiAgMS4gUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLFxuICogIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG4gKlxuICogIDIuIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSxcbiAqICB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZSBkb2N1bWVudGF0aW9uXG4gKiAgYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG4gKlxuICogIDMuIE5laXRoZXIgdGhlIG5hbWUgb2YgdGhlIGNvcHlyaWdodCBob2xkZXIocykgbm9yIHRoZSBuYW1lcyBvZiBhbnlcbiAqICBjb250cmlidXRvcnMgbWF5IGJlIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlIHByb2R1Y3RzIGRlcml2ZWQgZnJvbVxuICogIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpYyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXG4gKlxuICogIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlNcbiAqICBcIkFTIElTXCIgQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sXG4gKiAgVEhFIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFXG4gKiAgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgT1dORVIgT1IgQ09OVFJJQlVUT1JTIEJFIExJQUJMRVxuICogIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVNcbiAqICAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7XG4gKiAgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OXG4gKiAgQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlRcbiAqICAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJU1xuICogIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuICovXG47KGZ1bmN0aW9uICgpIHtcbiAgLy8gcG9ydCBvZiB3ZWJraXQgY3ViaWMgYmV6aWVyIGhhbmRsaW5nIGJ5IGh0dHA6Ly93d3cubmV0emdlc3RhLmRlL2Rldi9cbiAgZnVuY3Rpb24gY3ViaWNCZXppZXJBdFRpbWUodCxwMXgscDF5LHAyeCxwMnksZHVyYXRpb24pIHtcbiAgICB2YXIgYXggPSAwLGJ4ID0gMCxjeCA9IDAsYXkgPSAwLGJ5ID0gMCxjeSA9IDA7XG4gICAgZnVuY3Rpb24gc2FtcGxlQ3VydmVYKHQpIHtyZXR1cm4gKChheCAqIHQgKyBieCkgKiB0ICsgY3gpICogdDt9XG4gICAgZnVuY3Rpb24gc2FtcGxlQ3VydmVZKHQpIHtyZXR1cm4gKChheSAqIHQgKyBieSkgKiB0ICsgY3kpICogdDt9XG4gICAgZnVuY3Rpb24gc2FtcGxlQ3VydmVEZXJpdmF0aXZlWCh0KSB7cmV0dXJuICgzLjAgKiBheCAqIHQgKyAyLjAgKiBieCkgKiB0ICsgY3g7fVxuICAgIGZ1bmN0aW9uIHNvbHZlRXBzaWxvbihkdXJhdGlvbikge3JldHVybiAxLjAgLyAoMjAwLjAgKiBkdXJhdGlvbik7fVxuICAgIGZ1bmN0aW9uIHNvbHZlKHgsZXBzaWxvbikge3JldHVybiBzYW1wbGVDdXJ2ZVkoc29sdmVDdXJ2ZVgoeCxlcHNpbG9uKSk7fVxuICAgIGZ1bmN0aW9uIGZhYnMobikge2lmIChuID49IDApIHtyZXR1cm4gbjt9ZWxzZSB7cmV0dXJuIDAgLSBuO319XG4gICAgZnVuY3Rpb24gc29sdmVDdXJ2ZVgoeCxlcHNpbG9uKSB7XG4gICAgICB2YXIgdDAsdDEsdDIseDIsZDIsaTtcbiAgICAgIGZvciAodDIgPSB4LCBpID0gMDsgaSA8IDg7IGkrKykge3gyID0gc2FtcGxlQ3VydmVYKHQyKSAtIHg7IGlmIChmYWJzKHgyKSA8IGVwc2lsb24pIHtyZXR1cm4gdDI7fSBkMiA9IHNhbXBsZUN1cnZlRGVyaXZhdGl2ZVgodDIpOyBpZiAoZmFicyhkMikgPCAxZS02KSB7YnJlYWs7fSB0MiA9IHQyIC0geDIgLyBkMjt9XG4gICAgICB0MCA9IDAuMDsgdDEgPSAxLjA7IHQyID0geDsgaWYgKHQyIDwgdDApIHtyZXR1cm4gdDA7fSBpZiAodDIgPiB0MSkge3JldHVybiB0MTt9XG4gICAgICB3aGlsZSAodDAgPCB0MSkge3gyID0gc2FtcGxlQ3VydmVYKHQyKTsgaWYgKGZhYnMoeDIgLSB4KSA8IGVwc2lsb24pIHtyZXR1cm4gdDI7fSBpZiAoeCA+IHgyKSB7dDAgPSB0Mjt9ZWxzZSB7dDEgPSB0Mjt9IHQyID0gKHQxIC0gdDApICogMC41ICsgdDA7fVxuICAgICAgcmV0dXJuIHQyOyAvLyBGYWlsdXJlLlxuICAgIH1cbiAgICBjeCA9IDMuMCAqIHAxeDsgYnggPSAzLjAgKiAocDJ4IC0gcDF4KSAtIGN4OyBheCA9IDEuMCAtIGN4IC0gYng7IGN5ID0gMy4wICogcDF5OyBieSA9IDMuMCAqIChwMnkgLSBwMXkpIC0gY3k7IGF5ID0gMS4wIC0gY3kgLSBieTtcbiAgICByZXR1cm4gc29sdmUodCwgc29sdmVFcHNpbG9uKGR1cmF0aW9uKSk7XG4gIH1cbiAgLyohXG4gICAqICBnZXRDdWJpY0JlemllclRyYW5zaXRpb24oeDEsIHkxLCB4MiwgeTIpIC0+IEZ1bmN0aW9uXG4gICAqXG4gICAqICBHZW5lcmF0ZXMgYSB0cmFuc2l0aW9uIGVhc2luZyBmdW5jdGlvbiB0aGF0IGlzIGNvbXBhdGlibGVcbiAgICogIHdpdGggV2ViS2l0J3MgQ1NTIHRyYW5zaXRpb25zIGAtd2Via2l0LXRyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uYFxuICAgKiAgQ1NTIHByb3BlcnR5LlxuICAgKlxuICAgKiAgVGhlIFczQyBoYXMgbW9yZSBpbmZvcm1hdGlvbiBhYm91dFxuICAgKiAgPGEgaHJlZj1cImh0dHA6Ly93d3cudzMub3JnL1RSL2NzczMtdHJhbnNpdGlvbnMvI3RyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uX3RhZ1wiPlxuICAgKiAgQ1NTMyB0cmFuc2l0aW9uIHRpbWluZyBmdW5jdGlvbnM8L2E+LlxuICAgKlxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHgxXG4gICAqICBAcGFyYW0ge251bWJlcn0geTFcbiAgICogIEBwYXJhbSB7bnVtYmVyfSB4MlxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHkyXG4gICAqICBAcmV0dXJuIHtmdW5jdGlvbn1cbiAgICovXG4gIGZ1bmN0aW9uIGdldEN1YmljQmV6aWVyVHJhbnNpdGlvbiAoeDEsIHkxLCB4MiwgeTIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIGN1YmljQmV6aWVyQXRUaW1lKHBvcyx4MSx5MSx4Mix5MiwxKTtcbiAgICB9O1xuICB9XG4gIC8vIEVuZCBwb3J0ZWQgY29kZVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgQmV6aWVyIGVhc2luZyBmdW5jdGlvbiBhbmQgYXR0YWNoZXMgaXQgdG8gYFR3ZWVuYWJsZS5wcm90b3R5cGUuZm9ybXVsYWAuICBUaGlzIGZ1bmN0aW9uIGdpdmVzIHlvdSB0b3RhbCBjb250cm9sIG92ZXIgdGhlIGVhc2luZyBjdXJ2ZS4gIE1hdHRoZXcgTGVpbidzIFtDZWFzZXJdKGh0dHA6Ly9tYXR0aGV3bGVpbi5jb20vY2Vhc2VyLykgaXMgYSB1c2VmdWwgdG9vbCBmb3IgdmlzdWFsaXppbmcgdGhlIGN1cnZlcyB5b3UgY2FuIG1ha2Ugd2l0aCB0aGlzIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgZWFzaW5nIGN1cnZlLiAgT3ZlcndyaXRlcyB0aGUgb2xkIGVhc2luZyBmdW5jdGlvbiBvbiBUd2VlbmFibGUucHJvdG90eXBlLmZvcm11bGEgaWYgaXQgZXhpc3RzLlxuICAgKiBAcGFyYW0ge251bWJlcn0geDFcbiAgICogQHBhcmFtIHtudW1iZXJ9IHkxXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB4MlxuICAgKiBAcGFyYW0ge251bWJlcn0geTJcbiAgICogQHJldHVybiB7ZnVuY3Rpb259IFRoZSBlYXNpbmcgZnVuY3Rpb24gdGhhdCB3YXMgYXR0YWNoZWQgdG8gVHdlZW5hYmxlLnByb3RvdHlwZS5mb3JtdWxhLlxuICAgKi9cbiAgVHdlZW5hYmxlLnNldEJlemllckZ1bmN0aW9uID0gZnVuY3Rpb24gKG5hbWUsIHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgdmFyIGN1YmljQmV6aWVyVHJhbnNpdGlvbiA9IGdldEN1YmljQmV6aWVyVHJhbnNpdGlvbih4MSwgeTEsIHgyLCB5Mik7XG4gICAgY3ViaWNCZXppZXJUcmFuc2l0aW9uLngxID0geDE7XG4gICAgY3ViaWNCZXppZXJUcmFuc2l0aW9uLnkxID0geTE7XG4gICAgY3ViaWNCZXppZXJUcmFuc2l0aW9uLngyID0geDI7XG4gICAgY3ViaWNCZXppZXJUcmFuc2l0aW9uLnkyID0geTI7XG5cbiAgICByZXR1cm4gVHdlZW5hYmxlLnByb3RvdHlwZS5mb3JtdWxhW25hbWVdID0gY3ViaWNCZXppZXJUcmFuc2l0aW9uO1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIGBkZWxldGVgcyBhbiBlYXNpbmcgZnVuY3Rpb24gZnJvbSBgVHdlZW5hYmxlLnByb3RvdHlwZS5mb3JtdWxhYC4gIEJlIGNhcmVmdWwgd2l0aCB0aGlzIG1ldGhvZCwgYXMgaXQgYGRlbGV0ZWBzIHdoYXRldmVyIGVhc2luZyBmb3JtdWxhIG1hdGNoZXMgYG5hbWVgICh3aGljaCBtZWFucyB5b3UgY2FuIGRlbGV0ZSBkZWZhdWx0IFNoaWZ0eSBlYXNpbmcgZnVuY3Rpb25zKS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIGVhc2luZyBmdW5jdGlvbiB0byBkZWxldGUuXG4gICAqIEByZXR1cm4ge2Z1bmN0aW9ufVxuICAgKi9cbiAgVHdlZW5hYmxlLnVuc2V0QmV6aWVyRnVuY3Rpb24gPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIGRlbGV0ZSBUd2VlbmFibGUucHJvdG90eXBlLmZvcm11bGFbbmFtZV07XG4gIH07XG5cbn0pKCk7XG5cbjsoZnVuY3Rpb24gKCkge1xuXG4gIGZ1bmN0aW9uIGdldEludGVycG9sYXRlZFZhbHVlcyAoXG4gICAgZnJvbSwgY3VycmVudCwgdGFyZ2V0U3RhdGUsIHBvc2l0aW9uLCBlYXNpbmcpIHtcbiAgICByZXR1cm4gVHdlZW5hYmxlLnR3ZWVuUHJvcHMoXG4gICAgICBwb3NpdGlvbiwgY3VycmVudCwgZnJvbSwgdGFyZ2V0U3RhdGUsIDEsIDAsIGVhc2luZyk7XG4gIH1cblxuICAvLyBGYWtlIGEgVHdlZW5hYmxlIGFuZCBwYXRjaCBzb21lIGludGVybmFscy4gIFRoaXMgYXBwcm9hY2ggYWxsb3dzIHVzIHRvXG4gIC8vIHNraXAgdW5lY2Nlc3NhcnkgcHJvY2Vzc2luZyBhbmQgb2JqZWN0IHJlY3JlYXRpb24sIGN1dHRpbmcgZG93biBvbiBnYXJiYWdlXG4gIC8vIGNvbGxlY3Rpb24gcGF1c2VzLlxuICB2YXIgbW9ja1R3ZWVuYWJsZSA9IG5ldyBUd2VlbmFibGUoKTtcbiAgbW9ja1R3ZWVuYWJsZS5fZmlsdGVyQXJncyA9IFtdO1xuXG4gIC8qKlxuICAgKiBDb21wdXRlIHRoZSBtaWRwb2ludCBvZiB0d28gT2JqZWN0cy4gIFRoaXMgbWV0aG9kIGVmZmVjdGl2ZWx5IGNhbGN1bGF0ZXMgYSBzcGVjaWZpYyBmcmFtZSBvZiBhbmltYXRpb24gdGhhdCBbVHdlZW5hYmxlI3R3ZWVuXShzaGlmdHkuY29yZS5qcy5odG1sI3R3ZWVuKSBkb2VzIG1hbnkgdGltZXMgb3ZlciB0aGUgY291cnNlIG9mIGEgdHdlZW4uXG4gICAqXG4gICAqIEV4YW1wbGU6XG4gICAqXG4gICAqIGBgYFxuICAgKiAgdmFyIGludGVycG9sYXRlZFZhbHVlcyA9IFR3ZWVuYWJsZS5pbnRlcnBvbGF0ZSh7XG4gICAqICAgIHdpZHRoOiAnMTAwcHgnLFxuICAgKiAgICBvcGFjaXR5OiAwLFxuICAgKiAgICBjb2xvcjogJyNmZmYnXG4gICAqICB9LCB7XG4gICAqICAgIHdpZHRoOiAnMjAwcHgnLFxuICAgKiAgICBvcGFjaXR5OiAxLFxuICAgKiAgICBjb2xvcjogJyMwMDAnXG4gICAqICB9LCAwLjUpO1xuICAgKlxuICAgKiAgY29uc29sZS5sb2coaW50ZXJwb2xhdGVkVmFsdWVzKTtcbiAgICogIC8vIHtvcGFjaXR5OiAwLjUsIHdpZHRoOiBcIjE1MHB4XCIsIGNvbG9yOiBcInJnYigxMjcsMTI3LDEyNylcIn1cbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBmcm9tIFRoZSBzdGFydGluZyB2YWx1ZXMgdG8gdHdlZW4gZnJvbS5cbiAgICogQHBhcmFtIHtPYmplY3R9IHRhcmdldFN0YXRlIFRoZSBlbmRpbmcgdmFsdWVzIHRvIHR3ZWVuIHRvLlxuICAgKiBAcGFyYW0ge251bWJlcn0gcG9zaXRpb24gVGhlIG5vcm1hbGl6ZWQgcG9zaXRpb24gdmFsdWUgKGJldHdlZW4gMC4wIGFuZCAxLjApIHRvIGludGVycG9sYXRlIHRoZSB2YWx1ZXMgYmV0d2VlbiBgZnJvbWAgYW5kIGB0b2AgZm9yLiAgYGZyb21gIHJlcHJlc2VudHMgMCBhbmQgYHRvYCByZXByZXNlbnRzIGAxYC5cbiAgICogQHBhcmFtIHtzdHJpbmd8T2JqZWN0fSBlYXNpbmcgVGhlIGVhc2luZyBjdXJ2ZShzKSB0byBjYWxjdWxhdGUgdGhlIG1pZHBvaW50IGFnYWluc3QuICBZb3UgY2FuIHJlZmVyZW5jZSBhbnkgZWFzaW5nIGZ1bmN0aW9uIGF0dGFjaGVkIHRvIGBUd2VlbmFibGUucHJvdG90eXBlLmZvcm11bGFgLiAgSWYgb21pdHRlZCwgdGhpcyBkZWZhdWx0cyB0byBcImxpbmVhclwiLlxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuICBUd2VlbmFibGUuaW50ZXJwb2xhdGUgPSBmdW5jdGlvbiAoZnJvbSwgdGFyZ2V0U3RhdGUsIHBvc2l0aW9uLCBlYXNpbmcpIHtcbiAgICB2YXIgY3VycmVudCA9IFR3ZWVuYWJsZS5zaGFsbG93Q29weSh7fSwgZnJvbSk7XG4gICAgdmFyIGVhc2luZ09iamVjdCA9IFR3ZWVuYWJsZS5jb21wb3NlRWFzaW5nT2JqZWN0KFxuICAgICAgZnJvbSwgZWFzaW5nIHx8ICdsaW5lYXInKTtcblxuICAgIG1vY2tUd2VlbmFibGUuc2V0KHt9KTtcblxuICAgIC8vIEFsaWFzIGFuZCByZXVzZSB0aGUgX2ZpbHRlckFyZ3MgYXJyYXkgaW5zdGVhZCBvZiByZWNyZWF0aW5nIGl0LlxuICAgIHZhciBmaWx0ZXJBcmdzID0gbW9ja1R3ZWVuYWJsZS5fZmlsdGVyQXJncztcbiAgICBmaWx0ZXJBcmdzLmxlbmd0aCA9IDA7XG4gICAgZmlsdGVyQXJnc1swXSA9IGN1cnJlbnQ7XG4gICAgZmlsdGVyQXJnc1sxXSA9IGZyb207XG4gICAgZmlsdGVyQXJnc1syXSA9IHRhcmdldFN0YXRlO1xuICAgIGZpbHRlckFyZ3NbM10gPSBlYXNpbmdPYmplY3Q7XG5cbiAgICAvLyBBbnkgZGVmaW5lZCB2YWx1ZSB0cmFuc2Zvcm1hdGlvbiBtdXN0IGJlIGFwcGxpZWRcbiAgICBUd2VlbmFibGUuYXBwbHlGaWx0ZXIobW9ja1R3ZWVuYWJsZSwgJ3R3ZWVuQ3JlYXRlZCcpO1xuICAgIFR3ZWVuYWJsZS5hcHBseUZpbHRlcihtb2NrVHdlZW5hYmxlLCAnYmVmb3JlVHdlZW4nKTtcblxuICAgIHZhciBpbnRlcnBvbGF0ZWRWYWx1ZXMgPSBnZXRJbnRlcnBvbGF0ZWRWYWx1ZXMoXG4gICAgICBmcm9tLCBjdXJyZW50LCB0YXJnZXRTdGF0ZSwgcG9zaXRpb24sIGVhc2luZ09iamVjdCk7XG5cbiAgICAvLyBUcmFuc2Zvcm0gdmFsdWVzIGJhY2sgaW50byB0aGVpciBvcmlnaW5hbCBmb3JtYXRcbiAgICBUd2VlbmFibGUuYXBwbHlGaWx0ZXIobW9ja1R3ZWVuYWJsZSwgJ2FmdGVyVHdlZW4nKTtcblxuICAgIHJldHVybiBpbnRlcnBvbGF0ZWRWYWx1ZXM7XG4gIH07XG5cbn0oKSk7XG5cbi8qKlxuICogQWRkcyBzdHJpbmcgaW50ZXJwb2xhdGlvbiBzdXBwb3J0IHRvIFNoaWZ0eS5cbiAqXG4gKiBUaGUgVG9rZW4gZXh0ZW5zaW9uIGFsbG93cyBTaGlmdHkgdG8gdHdlZW4gbnVtYmVycyBpbnNpZGUgb2Ygc3RyaW5ncy4gIEFtb25nIG90aGVyIHRoaW5ncywgdGhpcyBhbGxvd3MgeW91IHRvIGFuaW1hdGUgQ1NTIHByb3BlcnRpZXMuICBGb3IgZXhhbXBsZSwgeW91IGNhbiBkbyB0aGlzOlxuICpcbiAqIGBgYFxuICogdmFyIHR3ZWVuYWJsZSA9IG5ldyBUd2VlbmFibGUoKTtcbiAqIHR3ZWVuYWJsZS50d2Vlbih7XG4gKiAgIGZyb206IHsgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCg0NXB4KSd9LFxuICogICB0bzogeyB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDkweHApJ31cbiAqIH0pO1xuICogYGBgXG4gKlxuICogYHRyYW5zbGF0ZVgoNDUpYCB3aWxsIGJlIHR3ZWVuZWQgdG8gYHRyYW5zbGF0ZVgoOTApYC4gIFRvIGRlbW9uc3RyYXRlOlxuICpcbiAqIGBgYFxuICogdmFyIHR3ZWVuYWJsZSA9IG5ldyBUd2VlbmFibGUoKTtcbiAqIHR3ZWVuYWJsZS50d2Vlbih7XG4gKiAgIGZyb206IHsgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCg0NXB4KSd9LFxuICogICB0bzogeyB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDkwcHgpJ30sXG4gKiAgIHN0ZXA6IGZ1bmN0aW9uIChzdGF0ZSkge1xuICogICAgIGNvbnNvbGUubG9nKHN0YXRlLnRyYW5zZm9ybSk7XG4gKiAgIH1cbiAqIH0pO1xuICogYGBgXG4gKlxuICogVGhlIGFib3ZlIHNuaXBwZXQgd2lsbCBsb2cgc29tZXRoaW5nIGxpa2UgdGhpcyBpbiB0aGUgY29uc29sZTpcbiAqXG4gKiBgYGBcbiAqIHRyYW5zbGF0ZVgoNjAuM3B4KVxuICogLi4uXG4gKiB0cmFuc2xhdGVYKDc2LjA1cHgpXG4gKiAuLi5cbiAqIHRyYW5zbGF0ZVgoOTBweClcbiAqIGBgYFxuICpcbiAqIEFub3RoZXIgdXNlIGZvciB0aGlzIGlzIGFuaW1hdGluZyBjb2xvcnM6XG4gKlxuICogYGBgXG4gKiB2YXIgdHdlZW5hYmxlID0gbmV3IFR3ZWVuYWJsZSgpO1xuICogdHdlZW5hYmxlLnR3ZWVuKHtcbiAqICAgZnJvbTogeyBjb2xvcjogJ3JnYigwLDI1NSwwKSd9LFxuICogICB0bzogeyBjb2xvcjogJ3JnYigyNTUsMCwyNTUpJ30sXG4gKiAgIHN0ZXA6IGZ1bmN0aW9uIChzdGF0ZSkge1xuICogICAgIGNvbnNvbGUubG9nKHN0YXRlLmNvbG9yKTtcbiAqICAgfVxuICogfSk7XG4gKiBgYGBcbiAqXG4gKiBUaGUgYWJvdmUgc25pcHBldCB3aWxsIGxvZyBzb21ldGhpbmcgbGlrZSB0aGlzOlxuICpcbiAqIGBgYFxuICogcmdiKDg0LDE3MCw4NClcbiAqIC4uLlxuICogcmdiKDE3MCw4NCwxNzApXG4gKiAuLi5cbiAqIHJnYigyNTUsMCwyNTUpXG4gKiBgYGBcbiAqXG4gKiBUaGlzIGV4dGVuc2lvbiBhbHNvIHN1cHBvcnRzIGhleGFkZWNpbWFsIGNvbG9ycywgaW4gYm90aCBsb25nIChgI2ZmMDBmZmApIGFuZCBzaG9ydCAoYCNmMGZgKSBmb3Jtcy4gIEJlIGF3YXJlIHRoYXQgaGV4YWRlY2ltYWwgaW5wdXQgdmFsdWVzIHdpbGwgYmUgY29udmVydGVkIGludG8gdGhlIGVxdWl2YWxlbnQgUkdCIG91dHB1dCB2YWx1ZXMuICBUaGlzIGlzIGRvbmUgdG8gb3B0aW1pemUgZm9yIHBlcmZvcm1hbmNlLlxuICpcbiAqIGBgYFxuICogdmFyIHR3ZWVuYWJsZSA9IG5ldyBUd2VlbmFibGUoKTtcbiAqIHR3ZWVuYWJsZS50d2Vlbih7XG4gKiAgIGZyb206IHsgY29sb3I6ICcjMGYwJ30sXG4gKiAgIHRvOiB7IGNvbG9yOiAnI2YwZid9LFxuICogICBzdGVwOiBmdW5jdGlvbiAoc3RhdGUpIHtcbiAqICAgICBjb25zb2xlLmxvZyhzdGF0ZS5jb2xvcik7XG4gKiAgIH1cbiAqIH0pO1xuICogYGBgXG4gKlxuICogVGhpcyBzbmlwcGV0IHdpbGwgZ2VuZXJhdGUgdGhlIHNhbWUgb3V0cHV0IGFzIHRoZSBvbmUgYmVmb3JlIGl0IGJlY2F1c2UgZXF1aXZhbGVudCB2YWx1ZXMgd2VyZSBzdXBwbGllZCAoanVzdCBpbiBoZXhhZGVjaW1hbCBmb3JtIHJhdGhlciB0aGFuIFJHQik6XG4gKlxuICogYGBgXG4gKiByZ2IoODQsMTcwLDg0KVxuICogLi4uXG4gKiByZ2IoMTcwLDg0LDE3MClcbiAqIC4uLlxuICogcmdiKDI1NSwwLDI1NSlcbiAqIGBgYFxuICpcbiAqICMjIEVhc2luZyBzdXBwb3J0XG4gKlxuICogRWFzaW5nIHdvcmtzIHNvbWV3aGF0IGRpZmZlcmVudGx5IGluIHRoZSBUb2tlbiBleHRlbnNpb24uICBUaGlzIGlzIGJlY2F1c2Ugc29tZSBDU1MgcHJvcGVydGllcyBoYXZlIG11bHRpcGxlIHZhbHVlcyBpbiB0aGVtLCBhbmQgeW91IG1pZ2h0IG5lZWQgdG8gdHdlZW4gZWFjaCB2YWx1ZSBhbG9uZyBpdHMgb3duIGVhc2luZyBjdXJ2ZS4gIEEgYmFzaWMgZXhhbXBsZTpcbiAqXG4gKiBgYGBcbiAqIHZhciB0d2VlbmFibGUgPSBuZXcgVHdlZW5hYmxlKCk7XG4gKiB0d2VlbmFibGUudHdlZW4oe1xuICogICBmcm9tOiB7IHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMHB4KSB0cmFuc2xhdGVZKDBweCknfSxcbiAqICAgdG86IHsgdHJhbnNmb3JtOiAgICd0cmFuc2xhdGVYKDEwMHB4KSB0cmFuc2xhdGVZKDEwMHB4KSd9LFxuICogICBlYXNpbmc6IHsgdHJhbnNmb3JtOiAnZWFzZUluUXVhZCcgfSxcbiAqICAgc3RlcDogZnVuY3Rpb24gKHN0YXRlKSB7XG4gKiAgICAgY29uc29sZS5sb2coc3RhdGUudHJhbnNmb3JtKTtcbiAqICAgfVxuICogfSk7XG4gKiBgYGBcbiAqXG4gKiBUaGUgYWJvdmUgc25pcHBldCBjcmVhdGUgdmFsdWVzIGxpa2UgdGhpczpcbiAqXG4gKiBgYGBcbiAqIHRyYW5zbGF0ZVgoMTEuNTYwMDAwMDAwMDAwMDAycHgpIHRyYW5zbGF0ZVkoMTEuNTYwMDAwMDAwMDAwMDAycHgpXG4gKiAuLi5cbiAqIHRyYW5zbGF0ZVgoNDYuMjQwMDAwMDAwMDAwMDFweCkgdHJhbnNsYXRlWSg0Ni4yNDAwMDAwMDAwMDAwMXB4KVxuICogLi4uXG4gKiB0cmFuc2xhdGVYKDEwMHB4KSB0cmFuc2xhdGVZKDEwMHB4KVxuICogYGBgXG4gKlxuICogSW4gdGhpcyBjYXNlLCB0aGUgdmFsdWVzIGZvciBgdHJhbnNsYXRlWGAgYW5kIGB0cmFuc2xhdGVZYCBhcmUgYWx3YXlzIHRoZSBzYW1lIGZvciBlYWNoIHN0ZXAgb2YgdGhlIHR3ZWVuLCBiZWNhdXNlIHRoZXkgaGF2ZSB0aGUgc2FtZSBzdGFydCBhbmQgZW5kIHBvaW50cyBhbmQgYm90aCB1c2UgdGhlIHNhbWUgZWFzaW5nIGN1cnZlLiAgV2UgY2FuIGFsc28gdHdlZW4gYHRyYW5zbGF0ZVhgIGFuZCBgdHJhbnNsYXRlWWAgYWxvbmcgaW5kZXBlbmRlbnQgY3VydmVzOlxuICpcbiAqIGBgYFxuICogdmFyIHR3ZWVuYWJsZSA9IG5ldyBUd2VlbmFibGUoKTtcbiAqIHR3ZWVuYWJsZS50d2Vlbih7XG4gKiAgIGZyb206IHsgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgwcHgpIHRyYW5zbGF0ZVkoMHB4KSd9LFxuICogICB0bzogeyB0cmFuc2Zvcm06ICAgJ3RyYW5zbGF0ZVgoMTAwcHgpIHRyYW5zbGF0ZVkoMTAwcHgpJ30sXG4gKiAgIGVhc2luZzogeyB0cmFuc2Zvcm06ICdlYXNlSW5RdWFkIGJvdW5jZScgfSxcbiAqICAgc3RlcDogZnVuY3Rpb24gKHN0YXRlKSB7XG4gKiAgICAgY29uc29sZS5sb2coc3RhdGUudHJhbnNmb3JtKTtcbiAqICAgfVxuICogfSk7XG4gKiBgYGBcbiAqXG4gKiBUaGUgYWJvdmUgc25pcHBldCBjcmVhdGUgdmFsdWVzIGxpa2UgdGhpczpcbiAqXG4gKiBgYGBcbiAqIHRyYW5zbGF0ZVgoMTAuODlweCkgdHJhbnNsYXRlWSg4Mi4zNTU2MjVweClcbiAqIC4uLlxuICogdHJhbnNsYXRlWCg0NC44OTAwMDAwMDAwMDAwMXB4KSB0cmFuc2xhdGVZKDg2LjczMDYyNTAwMDAwMDAycHgpXG4gKiAuLi5cbiAqIHRyYW5zbGF0ZVgoMTAwcHgpIHRyYW5zbGF0ZVkoMTAwcHgpXG4gKiBgYGBcbiAqXG4gKiBgdHJhbnNsYXRlWGAgYW5kIGB0cmFuc2xhdGVZYCBhcmUgbm90IGluIHN5bmMgYW55bW9yZSwgYmVjYXVzZSBgZWFzZUluUXVhZGAgd2FzIHNwZWNpZmllZCBmb3IgYHRyYW5zbGF0ZVhgIGFuZCBgYm91bmNlYCBmb3IgYHRyYW5zbGF0ZVlgLiAgTWl4aW5nIGFuZCBtYXRjaGluZyBlYXNpbmcgY3VydmVzIGNhbiBtYWtlIGZvciBzb21lIGludGVyZXN0aW5nIG1vdGlvbiBpbiB5b3VyIGFuaW1hdGlvbnMuXG4gKlxuICogVGhlIG9yZGVyIG9mIHRoZSBzcGFjZS1zZXBhcmF0ZWQgZWFzaW5nIGN1cnZlcyBjb3JyZXNwb25kIHRoZSB0b2tlbiB2YWx1ZXMgdGhleSBhcHBseSB0by4gIElmIHRoZXJlIGFyZSBtb3JlIHRva2VuIHZhbHVlcyB0aGFuIGVhc2luZyBjdXJ2ZXMgbGlzdGVkLCB0aGUgbGFzdCBlYXNpbmcgY3VydmUgbGlzdGVkIGlzIHVzZWQuXG4gKi9cbmZ1bmN0aW9uIHRva2VuICgpIHtcbiAgLy8gRnVuY3Rpb25hbGl0eSBmb3IgdGhpcyBleHRlbnNpb24gcnVucyBpbXBsaWNpdGx5IGlmIGl0IGlzIGxvYWRlZC5cbn0gLyohKi9cblxuLy8gdG9rZW4gZnVuY3Rpb24gaXMgZGVmaW5lZCBhYm92ZSBvbmx5IHNvIHRoYXQgZG94LWZvdW5kYXRpb24gc2VlcyBpdCBhc1xuLy8gZG9jdW1lbnRhdGlvbiBhbmQgcmVuZGVycyBpdC4gIEl0IGlzIG5ldmVyIHVzZWQsIGFuZCBpcyBvcHRpbWl6ZWQgYXdheSBhdFxuLy8gYnVpbGQgdGltZS5cblxuOyhmdW5jdGlvbiAoVHdlZW5hYmxlKSB7XG5cbiAgLyohXG4gICAqIEB0eXBlZGVmIHt7XG4gICAqICAgZm9ybWF0U3RyaW5nOiBzdHJpbmdcbiAgICogICBjaHVua05hbWVzOiBBcnJheS48c3RyaW5nPlxuICAgKiB9fVxuICAgKi9cbiAgdmFyIGZvcm1hdE1hbmlmZXN0O1xuXG4gIC8vIENPTlNUQU5UU1xuXG4gIHZhciBSX0ZPUk1BVF9DSFVOS1MgPSAvKFteXFwtMC05XFwuXSspL2c7XG4gIHZhciBSX1VORk9STUFUVEVEX1ZBTFVFUyA9IC9bMC05LlxcLV0rL2c7XG4gIHZhciBSX1JHQiA9IG5ldyBSZWdFeHAoXG4gICAgJ3JnYlxcXFwoJyArIFJfVU5GT1JNQVRURURfVkFMVUVTLnNvdXJjZSArXG4gICAgKC8sXFxzKi8uc291cmNlKSArIFJfVU5GT1JNQVRURURfVkFMVUVTLnNvdXJjZSArXG4gICAgKC8sXFxzKi8uc291cmNlKSArIFJfVU5GT1JNQVRURURfVkFMVUVTLnNvdXJjZSArICdcXFxcKScsICdnJyk7XG4gIHZhciBSX1JHQl9QUkVGSVggPSAvXi4qXFwoLztcbiAgdmFyIFJfSEVYID0gLyMoWzAtOV18W2EtZl0pezMsNn0vZ2k7XG4gIHZhciBWQUxVRV9QTEFDRUhPTERFUiA9ICdWQUwnO1xuXG4gIC8vIEhFTFBFUlNcblxuICB2YXIgZ2V0Rm9ybWF0Q2h1bmtzRnJvbV9hY2N1bXVsYXRvciA9IFtdO1xuICAvKiFcbiAgICogQHBhcmFtIHtBcnJheS5udW1iZXJ9IHJhd1ZhbHVlc1xuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJlZml4XG4gICAqXG4gICAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmc+fVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0Rm9ybWF0Q2h1bmtzRnJvbSAocmF3VmFsdWVzLCBwcmVmaXgpIHtcbiAgICBnZXRGb3JtYXRDaHVua3NGcm9tX2FjY3VtdWxhdG9yLmxlbmd0aCA9IDA7XG5cbiAgICB2YXIgcmF3VmFsdWVzTGVuZ3RoID0gcmF3VmFsdWVzLmxlbmd0aDtcbiAgICB2YXIgaTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCByYXdWYWx1ZXNMZW5ndGg7IGkrKykge1xuICAgICAgZ2V0Rm9ybWF0Q2h1bmtzRnJvbV9hY2N1bXVsYXRvci5wdXNoKCdfJyArIHByZWZpeCArICdfJyArIGkpO1xuICAgIH1cblxuICAgIHJldHVybiBnZXRGb3JtYXRDaHVua3NGcm9tX2FjY3VtdWxhdG9yO1xuICB9XG5cbiAgLyohXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtYXR0ZWRTdHJpbmdcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0Rm9ybWF0U3RyaW5nRnJvbSAoZm9ybWF0dGVkU3RyaW5nKSB7XG4gICAgdmFyIGNodW5rcyA9IGZvcm1hdHRlZFN0cmluZy5tYXRjaChSX0ZPUk1BVF9DSFVOS1MpO1xuXG4gICAgaWYgKCFjaHVua3MpIHtcbiAgICAgIC8vIGNodW5rcyB3aWxsIGJlIG51bGwgaWYgdGhlcmUgd2VyZSBubyB0b2tlbnMgdG8gcGFyc2UgaW5cbiAgICAgIC8vIGZvcm1hdHRlZFN0cmluZyAoZm9yIGV4YW1wbGUsIGlmIGZvcm1hdHRlZFN0cmluZyBpcyAnMicpLiAgQ29lcmNlXG4gICAgICAvLyBjaHVua3MgdG8gYmUgdXNlZnVsIGhlcmUuXG4gICAgICBjaHVua3MgPSBbJycsICcnXTtcbiAgICB9IGVsc2UgaWYgKGNodW5rcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGNodW5rcy51bnNoaWZ0KCcnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2h1bmtzLmpvaW4oVkFMVUVfUExBQ0VIT0xERVIpO1xuICB9XG5cbiAgLyohXG4gICAqIENvbnZlcnQgYWxsIGhleCBjb2xvciB2YWx1ZXMgd2l0aGluIGEgc3RyaW5nIHRvIGFuIHJnYiBzdHJpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZU9iamVjdFxuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBtb2RpZmllZCBvYmpcbiAgICovXG4gIGZ1bmN0aW9uIHNhbml0aXplT2JqZWN0Rm9ySGV4UHJvcHMgKHN0YXRlT2JqZWN0KSB7XG4gICAgVHdlZW5hYmxlLmVhY2goc3RhdGVPYmplY3QsIGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgICB2YXIgY3VycmVudFByb3AgPSBzdGF0ZU9iamVjdFtwcm9wXTtcblxuICAgICAgaWYgKHR5cGVvZiBjdXJyZW50UHJvcCA9PT0gJ3N0cmluZycgJiYgY3VycmVudFByb3AubWF0Y2goUl9IRVgpKSB7XG4gICAgICAgIHN0YXRlT2JqZWN0W3Byb3BdID0gc2FuaXRpemVIZXhDaHVua3NUb1JHQihjdXJyZW50UHJvcCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiFcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiAgc2FuaXRpemVIZXhDaHVua3NUb1JHQiAoc3RyKSB7XG4gICAgcmV0dXJuIGZpbHRlclN0cmluZ0NodW5rcyhSX0hFWCwgc3RyLCBjb252ZXJ0SGV4VG9SR0IpO1xuICB9XG5cbiAgLyohXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBoZXhTdHJpbmdcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gY29udmVydEhleFRvUkdCIChoZXhTdHJpbmcpIHtcbiAgICB2YXIgcmdiQXJyID0gaGV4VG9SR0JBcnJheShoZXhTdHJpbmcpO1xuICAgIHJldHVybiAncmdiKCcgKyByZ2JBcnJbMF0gKyAnLCcgKyByZ2JBcnJbMV0gKyAnLCcgKyByZ2JBcnJbMl0gKyAnKSc7XG4gIH1cblxuICB2YXIgaGV4VG9SR0JBcnJheV9yZXR1cm5BcnJheSA9IFtdO1xuICAvKiFcbiAgICogQ29udmVydCBhIGhleGFkZWNpbWFsIHN0cmluZyB0byBhbiBhcnJheSB3aXRoIHRocmVlIGl0ZW1zLCBvbmUgZWFjaCBmb3JcbiAgICogdGhlIHJlZCwgYmx1ZSwgYW5kIGdyZWVuIGRlY2ltYWwgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaGV4IEEgaGV4YWRlY2ltYWwgc3RyaW5nLlxuICAgKlxuICAgKiBAcmV0dXJucyB7QXJyYXkuPG51bWJlcj59IFRoZSBjb252ZXJ0ZWQgQXJyYXkgb2YgUkdCIHZhbHVlcyBpZiBgaGV4YCBpcyBhXG4gICAqIHZhbGlkIHN0cmluZywgb3IgYW4gQXJyYXkgb2YgdGhyZWUgMCdzLlxuICAgKi9cbiAgZnVuY3Rpb24gaGV4VG9SR0JBcnJheSAoaGV4KSB7XG5cbiAgICBoZXggPSBoZXgucmVwbGFjZSgvIy8sICcnKTtcblxuICAgIC8vIElmIHRoZSBzdHJpbmcgaXMgYSBzaG9ydGhhbmQgdGhyZWUgZGlnaXQgaGV4IG5vdGF0aW9uLCBub3JtYWxpemUgaXQgdG9cbiAgICAvLyB0aGUgc3RhbmRhcmQgc2l4IGRpZ2l0IG5vdGF0aW9uXG4gICAgaWYgKGhleC5sZW5ndGggPT09IDMpIHtcbiAgICAgIGhleCA9IGhleC5zcGxpdCgnJyk7XG4gICAgICBoZXggPSBoZXhbMF0gKyBoZXhbMF0gKyBoZXhbMV0gKyBoZXhbMV0gKyBoZXhbMl0gKyBoZXhbMl07XG4gICAgfVxuXG4gICAgaGV4VG9SR0JBcnJheV9yZXR1cm5BcnJheVswXSA9IGhleFRvRGVjKGhleC5zdWJzdHIoMCwgMikpO1xuICAgIGhleFRvUkdCQXJyYXlfcmV0dXJuQXJyYXlbMV0gPSBoZXhUb0RlYyhoZXguc3Vic3RyKDIsIDIpKTtcbiAgICBoZXhUb1JHQkFycmF5X3JldHVybkFycmF5WzJdID0gaGV4VG9EZWMoaGV4LnN1YnN0cig0LCAyKSk7XG5cbiAgICByZXR1cm4gaGV4VG9SR0JBcnJheV9yZXR1cm5BcnJheTtcbiAgfVxuXG4gIC8qIVxuICAgKiBDb252ZXJ0IGEgYmFzZS0xNiBudW1iZXIgdG8gYmFzZS0xMC5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ8U3RyaW5nfSBoZXggVGhlIHZhbHVlIHRvIGNvbnZlcnRcbiAgICpcbiAgICogQHJldHVybnMge051bWJlcn0gVGhlIGJhc2UtMTAgZXF1aXZhbGVudCBvZiBgaGV4YC5cbiAgICovXG4gIGZ1bmN0aW9uIGhleFRvRGVjIChoZXgpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQoaGV4LCAxNik7XG4gIH1cblxuICAvKiFcbiAgICogUnVucyBhIGZpbHRlciBvcGVyYXRpb24gb24gYWxsIGNodW5rcyBvZiBhIHN0cmluZyB0aGF0IG1hdGNoIGEgUmVnRXhwXG4gICAqXG4gICAqIEBwYXJhbSB7UmVnRXhwfSBwYXR0ZXJuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1bmZpbHRlcmVkU3RyaW5nXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oc3RyaW5nKX0gZmlsdGVyXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIGZpbHRlclN0cmluZ0NodW5rcyAocGF0dGVybiwgdW5maWx0ZXJlZFN0cmluZywgZmlsdGVyKSB7XG4gICAgdmFyIHBhdHRlbk1hdGNoZXMgPSB1bmZpbHRlcmVkU3RyaW5nLm1hdGNoKHBhdHRlcm4pO1xuICAgIHZhciBmaWx0ZXJlZFN0cmluZyA9IHVuZmlsdGVyZWRTdHJpbmcucmVwbGFjZShwYXR0ZXJuLCBWQUxVRV9QTEFDRUhPTERFUik7XG5cbiAgICBpZiAocGF0dGVuTWF0Y2hlcykge1xuICAgICAgdmFyIHBhdHRlbk1hdGNoZXNMZW5ndGggPSBwYXR0ZW5NYXRjaGVzLmxlbmd0aDtcbiAgICAgIHZhciBjdXJyZW50Q2h1bms7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGF0dGVuTWF0Y2hlc0xlbmd0aDsgaSsrKSB7XG4gICAgICAgIGN1cnJlbnRDaHVuayA9IHBhdHRlbk1hdGNoZXMuc2hpZnQoKTtcbiAgICAgICAgZmlsdGVyZWRTdHJpbmcgPSBmaWx0ZXJlZFN0cmluZy5yZXBsYWNlKFxuICAgICAgICAgIFZBTFVFX1BMQUNFSE9MREVSLCBmaWx0ZXIoY3VycmVudENodW5rKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpbHRlcmVkU3RyaW5nO1xuICB9XG5cbiAgLyohXG4gICAqIENoZWNrIGZvciBmbG9hdGluZyBwb2ludCB2YWx1ZXMgd2l0aGluIHJnYiBzdHJpbmdzIGFuZCByb3VuZHMgdGhlbS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZvcm1hdHRlZFN0cmluZ1xuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBzYW5pdGl6ZVJHQkNodW5rcyAoZm9ybWF0dGVkU3RyaW5nKSB7XG4gICAgcmV0dXJuIGZpbHRlclN0cmluZ0NodW5rcyhSX1JHQiwgZm9ybWF0dGVkU3RyaW5nLCBzYW5pdGl6ZVJHQkNodW5rKTtcbiAgfVxuXG4gIC8qIVxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmdiQ2h1bmtcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gc2FuaXRpemVSR0JDaHVuayAocmdiQ2h1bmspIHtcbiAgICB2YXIgbnVtYmVycyA9IHJnYkNodW5rLm1hdGNoKFJfVU5GT1JNQVRURURfVkFMVUVTKTtcbiAgICB2YXIgbnVtYmVyc0xlbmd0aCA9IG51bWJlcnMubGVuZ3RoO1xuICAgIHZhciBzYW5pdGl6ZWRTdHJpbmcgPSByZ2JDaHVuay5tYXRjaChSX1JHQl9QUkVGSVgpWzBdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1iZXJzTGVuZ3RoOyBpKyspIHtcbiAgICAgIHNhbml0aXplZFN0cmluZyArPSBwYXJzZUludChudW1iZXJzW2ldLCAxMCkgKyAnLCc7XG4gICAgfVxuXG4gICAgc2FuaXRpemVkU3RyaW5nID0gc2FuaXRpemVkU3RyaW5nLnNsaWNlKDAsIC0xKSArICcpJztcblxuICAgIHJldHVybiBzYW5pdGl6ZWRTdHJpbmc7XG4gIH1cblxuICAvKiFcbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlT2JqZWN0XG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH0gQW4gT2JqZWN0IG9mIGZvcm1hdE1hbmlmZXN0cyB0aGF0IGNvcnJlc3BvbmQgdG9cbiAgICogdGhlIHN0cmluZyBwcm9wZXJ0aWVzIG9mIHN0YXRlT2JqZWN0XG4gICAqL1xuICBmdW5jdGlvbiBnZXRGb3JtYXRNYW5pZmVzdHMgKHN0YXRlT2JqZWN0KSB7XG4gICAgdmFyIG1hbmlmZXN0QWNjdW11bGF0b3IgPSB7fTtcblxuICAgIFR3ZWVuYWJsZS5lYWNoKHN0YXRlT2JqZWN0LCBmdW5jdGlvbiAocHJvcCkge1xuICAgICAgdmFyIGN1cnJlbnRQcm9wID0gc3RhdGVPYmplY3RbcHJvcF07XG5cbiAgICAgIGlmICh0eXBlb2YgY3VycmVudFByb3AgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHZhciByYXdWYWx1ZXMgPSBnZXRWYWx1ZXNGcm9tKGN1cnJlbnRQcm9wKTtcblxuICAgICAgICBtYW5pZmVzdEFjY3VtdWxhdG9yW3Byb3BdID0ge1xuICAgICAgICAgICdmb3JtYXRTdHJpbmcnOiBnZXRGb3JtYXRTdHJpbmdGcm9tKGN1cnJlbnRQcm9wKVxuICAgICAgICAgICwnY2h1bmtOYW1lcyc6IGdldEZvcm1hdENodW5rc0Zyb20ocmF3VmFsdWVzLCBwcm9wKVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG1hbmlmZXN0QWNjdW11bGF0b3I7XG4gIH1cblxuICAvKiFcbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlT2JqZWN0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBmb3JtYXRNYW5pZmVzdHNcbiAgICovXG4gIGZ1bmN0aW9uIGV4cGFuZEZvcm1hdHRlZFByb3BlcnRpZXMgKHN0YXRlT2JqZWN0LCBmb3JtYXRNYW5pZmVzdHMpIHtcbiAgICBUd2VlbmFibGUuZWFjaChmb3JtYXRNYW5pZmVzdHMsIGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgICB2YXIgY3VycmVudFByb3AgPSBzdGF0ZU9iamVjdFtwcm9wXTtcbiAgICAgIHZhciByYXdWYWx1ZXMgPSBnZXRWYWx1ZXNGcm9tKGN1cnJlbnRQcm9wKTtcbiAgICAgIHZhciByYXdWYWx1ZXNMZW5ndGggPSByYXdWYWx1ZXMubGVuZ3RoO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJhd1ZhbHVlc0xlbmd0aDsgaSsrKSB7XG4gICAgICAgIHN0YXRlT2JqZWN0W2Zvcm1hdE1hbmlmZXN0c1twcm9wXS5jaHVua05hbWVzW2ldXSA9ICtyYXdWYWx1ZXNbaV07XG4gICAgICB9XG5cbiAgICAgIGRlbGV0ZSBzdGF0ZU9iamVjdFtwcm9wXTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qIVxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVPYmplY3RcbiAgICogQHBhcmFtIHtPYmplY3R9IGZvcm1hdE1hbmlmZXN0c1xuICAgKi9cbiAgZnVuY3Rpb24gY29sbGFwc2VGb3JtYXR0ZWRQcm9wZXJ0aWVzIChzdGF0ZU9iamVjdCwgZm9ybWF0TWFuaWZlc3RzKSB7XG4gICAgVHdlZW5hYmxlLmVhY2goZm9ybWF0TWFuaWZlc3RzLCBmdW5jdGlvbiAocHJvcCkge1xuICAgICAgdmFyIGN1cnJlbnRQcm9wID0gc3RhdGVPYmplY3RbcHJvcF07XG4gICAgICB2YXIgZm9ybWF0Q2h1bmtzID0gZXh0cmFjdFByb3BlcnR5Q2h1bmtzKFxuICAgICAgICBzdGF0ZU9iamVjdCwgZm9ybWF0TWFuaWZlc3RzW3Byb3BdLmNodW5rTmFtZXMpO1xuICAgICAgdmFyIHZhbHVlc0xpc3QgPSBnZXRWYWx1ZXNMaXN0KFxuICAgICAgICBmb3JtYXRDaHVua3MsIGZvcm1hdE1hbmlmZXN0c1twcm9wXS5jaHVua05hbWVzKTtcbiAgICAgIGN1cnJlbnRQcm9wID0gZ2V0Rm9ybWF0dGVkVmFsdWVzKFxuICAgICAgICBmb3JtYXRNYW5pZmVzdHNbcHJvcF0uZm9ybWF0U3RyaW5nLCB2YWx1ZXNMaXN0KTtcbiAgICAgIHN0YXRlT2JqZWN0W3Byb3BdID0gc2FuaXRpemVSR0JDaHVua3MoY3VycmVudFByb3ApO1xuICAgIH0pO1xuICB9XG5cbiAgLyohXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZU9iamVjdFxuICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBjaHVua05hbWVzXG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGV4dHJhY3RlZCB2YWx1ZSBjaHVua3MuXG4gICAqL1xuICBmdW5jdGlvbiBleHRyYWN0UHJvcGVydHlDaHVua3MgKHN0YXRlT2JqZWN0LCBjaHVua05hbWVzKSB7XG4gICAgdmFyIGV4dHJhY3RlZFZhbHVlcyA9IHt9O1xuICAgIHZhciBjdXJyZW50Q2h1bmtOYW1lLCBjaHVua05hbWVzTGVuZ3RoID0gY2h1bmtOYW1lcy5sZW5ndGg7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNodW5rTmFtZXNMZW5ndGg7IGkrKykge1xuICAgICAgY3VycmVudENodW5rTmFtZSA9IGNodW5rTmFtZXNbaV07XG4gICAgICBleHRyYWN0ZWRWYWx1ZXNbY3VycmVudENodW5rTmFtZV0gPSBzdGF0ZU9iamVjdFtjdXJyZW50Q2h1bmtOYW1lXTtcbiAgICAgIGRlbGV0ZSBzdGF0ZU9iamVjdFtjdXJyZW50Q2h1bmtOYW1lXTtcbiAgICB9XG5cbiAgICByZXR1cm4gZXh0cmFjdGVkVmFsdWVzO1xuICB9XG5cbiAgdmFyIGdldFZhbHVlc0xpc3RfYWNjdW11bGF0b3IgPSBbXTtcbiAgLyohXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZU9iamVjdFxuICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBjaHVua05hbWVzXG4gICAqXG4gICAqIEByZXR1cm4ge0FycmF5LjxudW1iZXI+fVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0VmFsdWVzTGlzdCAoc3RhdGVPYmplY3QsIGNodW5rTmFtZXMpIHtcbiAgICBnZXRWYWx1ZXNMaXN0X2FjY3VtdWxhdG9yLmxlbmd0aCA9IDA7XG4gICAgdmFyIGNodW5rTmFtZXNMZW5ndGggPSBjaHVua05hbWVzLmxlbmd0aDtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2h1bmtOYW1lc0xlbmd0aDsgaSsrKSB7XG4gICAgICBnZXRWYWx1ZXNMaXN0X2FjY3VtdWxhdG9yLnB1c2goc3RhdGVPYmplY3RbY2h1bmtOYW1lc1tpXV0pO1xuICAgIH1cblxuICAgIHJldHVybiBnZXRWYWx1ZXNMaXN0X2FjY3VtdWxhdG9yO1xuICB9XG5cbiAgLyohXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtYXRTdHJpbmdcbiAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gcmF3VmFsdWVzXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIGdldEZvcm1hdHRlZFZhbHVlcyAoZm9ybWF0U3RyaW5nLCByYXdWYWx1ZXMpIHtcbiAgICB2YXIgZm9ybWF0dGVkVmFsdWVTdHJpbmcgPSBmb3JtYXRTdHJpbmc7XG4gICAgdmFyIHJhd1ZhbHVlc0xlbmd0aCA9IHJhd1ZhbHVlcy5sZW5ndGg7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJhd1ZhbHVlc0xlbmd0aDsgaSsrKSB7XG4gICAgICBmb3JtYXR0ZWRWYWx1ZVN0cmluZyA9IGZvcm1hdHRlZFZhbHVlU3RyaW5nLnJlcGxhY2UoXG4gICAgICAgIFZBTFVFX1BMQUNFSE9MREVSLCArcmF3VmFsdWVzW2ldLnRvRml4ZWQoNCkpO1xuICAgIH1cblxuICAgIHJldHVybiBmb3JtYXR0ZWRWYWx1ZVN0cmluZztcbiAgfVxuXG4gIC8qIVxuICAgKiBOb3RlOiBJdCdzIHRoZSBkdXR5IG9mIHRoZSBjYWxsZXIgdG8gY29udmVydCB0aGUgQXJyYXkgZWxlbWVudHMgb2YgdGhlXG4gICAqIHJldHVybiB2YWx1ZSBpbnRvIG51bWJlcnMuICBUaGlzIGlzIGEgcGVyZm9ybWFuY2Ugb3B0aW1pemF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZm9ybWF0dGVkU3RyaW5nXG4gICAqXG4gICAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmc+fG51bGx9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRWYWx1ZXNGcm9tIChmb3JtYXR0ZWRTdHJpbmcpIHtcbiAgICByZXR1cm4gZm9ybWF0dGVkU3RyaW5nLm1hdGNoKFJfVU5GT1JNQVRURURfVkFMVUVTKTtcbiAgfVxuXG4gIC8qIVxuICAgKiBAcGFyYW0ge09iamVjdH0gZWFzaW5nT2JqZWN0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0b2tlbkRhdGFcbiAgICovXG4gIGZ1bmN0aW9uIGV4cGFuZEVhc2luZ09iamVjdCAoZWFzaW5nT2JqZWN0LCB0b2tlbkRhdGEpIHtcbiAgICBUd2VlbmFibGUuZWFjaCh0b2tlbkRhdGEsIGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgICB2YXIgY3VycmVudFByb3AgPSB0b2tlbkRhdGFbcHJvcF07XG4gICAgICB2YXIgY2h1bmtOYW1lcyA9IGN1cnJlbnRQcm9wLmNodW5rTmFtZXM7XG4gICAgICB2YXIgY2h1bmtMZW5ndGggPSBjaHVua05hbWVzLmxlbmd0aDtcbiAgICAgIHZhciBlYXNpbmdDaHVua3MgPSBlYXNpbmdPYmplY3RbcHJvcF0uc3BsaXQoJyAnKTtcbiAgICAgIHZhciBsYXN0RWFzaW5nQ2h1bmsgPSBlYXNpbmdDaHVua3NbZWFzaW5nQ2h1bmtzLmxlbmd0aCAtIDFdO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNodW5rTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZWFzaW5nT2JqZWN0W2NodW5rTmFtZXNbaV1dID0gZWFzaW5nQ2h1bmtzW2ldIHx8IGxhc3RFYXNpbmdDaHVuaztcbiAgICAgIH1cblxuICAgICAgZGVsZXRlIGVhc2luZ09iamVjdFtwcm9wXTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qIVxuICAgKiBAcGFyYW0ge09iamVjdH0gZWFzaW5nT2JqZWN0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0b2tlbkRhdGFcbiAgICovXG4gIGZ1bmN0aW9uIGNvbGxhcHNlRWFzaW5nT2JqZWN0IChlYXNpbmdPYmplY3QsIHRva2VuRGF0YSkge1xuICAgIFR3ZWVuYWJsZS5lYWNoKHRva2VuRGF0YSwgZnVuY3Rpb24gKHByb3ApIHtcbiAgICAgIHZhciBjdXJyZW50UHJvcCA9IHRva2VuRGF0YVtwcm9wXTtcbiAgICAgIHZhciBjaHVua05hbWVzID0gY3VycmVudFByb3AuY2h1bmtOYW1lcztcbiAgICAgIHZhciBjaHVua0xlbmd0aCA9IGNodW5rTmFtZXMubGVuZ3RoO1xuICAgICAgdmFyIGNvbXBvc2VkRWFzaW5nU3RyaW5nID0gJyc7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2h1bmtMZW5ndGg7IGkrKykge1xuICAgICAgICBjb21wb3NlZEVhc2luZ1N0cmluZyArPSAnICcgKyBlYXNpbmdPYmplY3RbY2h1bmtOYW1lc1tpXV07XG4gICAgICAgIGRlbGV0ZSBlYXNpbmdPYmplY3RbY2h1bmtOYW1lc1tpXV07XG4gICAgICB9XG5cbiAgICAgIGVhc2luZ09iamVjdFtwcm9wXSA9IGNvbXBvc2VkRWFzaW5nU3RyaW5nLnN1YnN0cigxKTtcbiAgICB9KTtcbiAgfVxuXG4gIFR3ZWVuYWJsZS5wcm90b3R5cGUuZmlsdGVyLnRva2VuID0ge1xuICAgICd0d2VlbkNyZWF0ZWQnOiBmdW5jdGlvbiAoY3VycmVudFN0YXRlLCBmcm9tU3RhdGUsIHRvU3RhdGUsIGVhc2luZ09iamVjdCkge1xuICAgICAgc2FuaXRpemVPYmplY3RGb3JIZXhQcm9wcyhjdXJyZW50U3RhdGUpO1xuICAgICAgc2FuaXRpemVPYmplY3RGb3JIZXhQcm9wcyhmcm9tU3RhdGUpO1xuICAgICAgc2FuaXRpemVPYmplY3RGb3JIZXhQcm9wcyh0b1N0YXRlKTtcbiAgICAgIHRoaXMuX3Rva2VuRGF0YSA9IGdldEZvcm1hdE1hbmlmZXN0cyhjdXJyZW50U3RhdGUpO1xuICAgIH0sXG5cbiAgICAnYmVmb3JlVHdlZW4nOiBmdW5jdGlvbiAoY3VycmVudFN0YXRlLCBmcm9tU3RhdGUsIHRvU3RhdGUsIGVhc2luZ09iamVjdCkge1xuICAgICAgZXhwYW5kRWFzaW5nT2JqZWN0KGVhc2luZ09iamVjdCwgdGhpcy5fdG9rZW5EYXRhKTtcbiAgICAgIGV4cGFuZEZvcm1hdHRlZFByb3BlcnRpZXMoY3VycmVudFN0YXRlLCB0aGlzLl90b2tlbkRhdGEpO1xuICAgICAgZXhwYW5kRm9ybWF0dGVkUHJvcGVydGllcyhmcm9tU3RhdGUsIHRoaXMuX3Rva2VuRGF0YSk7XG4gICAgICBleHBhbmRGb3JtYXR0ZWRQcm9wZXJ0aWVzKHRvU3RhdGUsIHRoaXMuX3Rva2VuRGF0YSk7XG4gICAgfSxcblxuICAgICdhZnRlclR3ZWVuJzogZnVuY3Rpb24gKGN1cnJlbnRTdGF0ZSwgZnJvbVN0YXRlLCB0b1N0YXRlLCBlYXNpbmdPYmplY3QpIHtcbiAgICAgIGNvbGxhcHNlRm9ybWF0dGVkUHJvcGVydGllcyhjdXJyZW50U3RhdGUsIHRoaXMuX3Rva2VuRGF0YSk7XG4gICAgICBjb2xsYXBzZUZvcm1hdHRlZFByb3BlcnRpZXMoZnJvbVN0YXRlLCB0aGlzLl90b2tlbkRhdGEpO1xuICAgICAgY29sbGFwc2VGb3JtYXR0ZWRQcm9wZXJ0aWVzKHRvU3RhdGUsIHRoaXMuX3Rva2VuRGF0YSk7XG4gICAgICBjb2xsYXBzZUVhc2luZ09iamVjdChlYXNpbmdPYmplY3QsIHRoaXMuX3Rva2VuRGF0YSk7XG4gICAgfVxuICB9O1xuXG59IChUd2VlbmFibGUpKTtcblxufSh0aGlzKSk7XG4iXX0=
