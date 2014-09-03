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
    btnStart.click = btnStart.tap = startGame;
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
  // LevelEnd = require('./LevelEnd'),
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
    // self.levelend = new LevelEnd(this);
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

},{"./Begin":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Begin.js","./GameInput.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/GameInput.js","./GameOver":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/GameOver.js","./Level":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Level.js","./Light":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Light.js","./Physics.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Physics.js","./Player.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Player.js","./Preloader":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Preloader.js","./Resources":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Resources.js","./Tools.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Tools.js","./vendor/shifty":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/vendor/shifty.js"}],"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/GameInput.js":[function(require,module,exports){
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

    self.noise = PIXI.Sprite.fromFrame("noise.png");
    self.noise.scale.x = 2;
    self.noise.scale.y = 2;
    self.view.addChild(self.noise);

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
      self.noise.alpha = 0.1;
      self.noise.position.x = Math.random()*900 - 900;
      self.noise.position.y = Math.random()*600 - 600;

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

},{"./behaviors/EndBehavior.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/behaviors/EndBehavior.js","./behaviors/EndCarBehavior.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/behaviors/EndCarBehavior.js","./behaviors/LightBehavior.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/behaviors/LightBehavior.js","./behaviors/PlatformBehavior.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/behaviors/PlatformBehavior.js","./behaviors/SwitchBehavior.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/behaviors/SwitchBehavior.js"}],"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Light.js":[function(require,module,exports){
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

},{}],"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Resources.js":[function(require,module,exports){
module.exports = function Resources() {

  Howler.iOSAutoEnable = false;
  // Howler.mute();

  // images
  // this.background = 'img/bg-default.jpg';
  // this.btnPlay ='img/btn-play.png';
  // this.btnNext ='img/btn-next.png';
  // this.btnRestart ='img/btn-restart.png';
  // this.textLevelEnd ='img/text-level-end.png';
  // this.textGameOver ='img/text-game-over.png';

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
  // LevelEnd = require('./LevelEnd'),
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
    // self.levelend = new LevelEnd(this);
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

},{"./Begin":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Begin.js","./GameInput.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/GameInput.js","./GameOver":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/GameOver.js","./Level":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Level.js","./Light":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Light.js","./Physics.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Physics.js","./Player.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Player.js","./Preloader":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Preloader.js","./Resources":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Resources.js","./Tools.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Tools.js","./vendor/shifty":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/vendor/shifty.js"}],"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/main.js":[function(require,module,exports){
var Game = require('./Game'),
    Tweenable = require('./vendor/shifty'),
    EventEmitter2 = require('./vendor/EventEmitter2').EventEmitter2,
    game;

// http://cubic-bezier.com/#.92,.34,.6,.8
Tweenable.setBezierFunction("customBezier", .92,.34,.6,.8);

// Event between objects
window.emitter = new EventEmitter2();

console.log("One");

// Init
if (typeof(ejecta)!=="undefined") {
  game = Game.instance = new Game();

} else {

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

}

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vc3JjL0JlZ2luLmpzIiwiL0FwcGxpY2F0aW9ucy9YQU1QUC94YW1wcGZpbGVzL2h0ZG9jcy9zcGphbS9zcmMvR2FtZS5qcyIsIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vc3JjL0dhbWVJbnB1dC5qcyIsIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vc3JjL0dhbWVPdmVyLmpzIiwiL0FwcGxpY2F0aW9ucy9YQU1QUC94YW1wcGZpbGVzL2h0ZG9jcy9zcGphbS9zcmMvTGV2ZWwuanMiLCIvQXBwbGljYXRpb25zL1hBTVBQL3hhbXBwZmlsZXMvaHRkb2NzL3NwamFtL3NyYy9MaWdodC5qcyIsIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vc3JjL1BoeXNpY3MuanMiLCIvQXBwbGljYXRpb25zL1hBTVBQL3hhbXBwZmlsZXMvaHRkb2NzL3NwamFtL3NyYy9QbGF5ZXIuanMiLCIvQXBwbGljYXRpb25zL1hBTVBQL3hhbXBwZmlsZXMvaHRkb2NzL3NwamFtL3NyYy9QcmVsb2FkZXIuanMiLCIvQXBwbGljYXRpb25zL1hBTVBQL3hhbXBwZmlsZXMvaHRkb2NzL3NwamFtL3NyYy9SZXNvdXJjZXMuanMiLCIvQXBwbGljYXRpb25zL1hBTVBQL3hhbXBwZmlsZXMvaHRkb2NzL3NwamFtL3NyYy9Ub29scy5qcyIsIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vc3JjL2JlaGF2aW9ycy9FbmRCZWhhdmlvci5qcyIsIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vc3JjL2JlaGF2aW9ycy9FbmRDYXJCZWhhdmlvci5qcyIsIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vc3JjL2JlaGF2aW9ycy9MaWdodEJlaGF2aW9yLmpzIiwiL0FwcGxpY2F0aW9ucy9YQU1QUC94YW1wcGZpbGVzL2h0ZG9jcy9zcGphbS9zcmMvYmVoYXZpb3JzL1BsYXRmb3JtQmVoYXZpb3IuanMiLCIvQXBwbGljYXRpb25zL1hBTVBQL3hhbXBwZmlsZXMvaHRkb2NzL3NwamFtL3NyYy9iZWhhdmlvcnMvU3dpdGNoQmVoYXZpb3IuanMiLCIvQXBwbGljYXRpb25zL1hBTVBQL3hhbXBwZmlsZXMvaHRkb2NzL3NwamFtL3NyYy9jb21wb25lbnRzL1BhcnRpY2xlU3lzdGVtLmpzIiwiL0FwcGxpY2F0aW9ucy9YQU1QUC94YW1wcGZpbGVzL2h0ZG9jcy9zcGphbS9zcmMvZ2FtZS5qcyIsIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vc3JjL21haW4uanMiLCIvQXBwbGljYXRpb25zL1hBTVBQL3hhbXBwZmlsZXMvaHRkb2NzL3NwamFtL3NyYy92ZW5kb3IvRXZlbnRFbWl0dGVyMi5qcyIsIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vc3JjL3ZlbmRvci9zaGlmdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDemhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDemhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3akJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFBhcnRpY2xlU3lzdGVtID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL1BhcnRpY2xlU3lzdGVtLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gQmVnaW4oZ2FtZSkge1xuICB3aW5kb3cuZ2FtZSA9IGdhbWU7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgdmlldyA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcbiAgdmFyIG92ZXJsYXAgPSBudWxsO1xuICB2YXIgY2FyID0gbnVsbDtcbiAgdmFyIGxvZ28gPSBudWxsO1xuICB2YXIgbG9nb0RhcmsgPSBudWxsO1xuICB2YXIgYnRuU3RhcnQgPSBudWxsO1xuICB2YXIgcGFydGljbGVzID0gbnVsbDtcbiAgdmFyIGNvdW50ID0gMDtcblxuICB0aGlzLnZpZXcgPSB2aWV3O1xuICB0aGlzLnNob3cgPSBzaG93O1xuICB0aGlzLmhpZGUgPSBoaWRlO1xuICB0aGlzLnVwZGF0ZSA9IHVwZGF0ZTtcblxuICBpbml0KCk7XG5cbiAgZnVuY3Rpb24gaW5pdCgpXG4gIHtcbiAgICB2aWV3LnZpc2libGUgPSBmYWxzZTtcbiAgICBnYW1lLnN0YWdlLmFkZENoaWxkKHZpZXcpO1xuXG4gICAgdmFyIGJnID0gUElYSS5TcHJpdGUuZnJvbUZyYW1lKFwiU2NlbmFyaW8ucG5nXCIpO1xuICAgIHZpZXcuYWRkQ2hpbGQoYmcpO1xuXG4gICAgbG9nb0RhcmsgPSBQSVhJLlNwcml0ZS5mcm9tRnJhbWUoXCJEYXJrTGlnaHRMb2dvLnBuZ1wiKTtcbiAgICB2aWV3LmFkZENoaWxkKGxvZ29EYXJrKTtcbiAgICBsb2dvRGFyay5hbHBoYSA9IDAuNTtcbiAgICBsb2dvRGFyay5hbmNob3IueCA9IDAuNTtcbiAgICBsb2dvRGFyay5hbmNob3IueSA9IDAuNTtcbiAgICBsb2dvRGFyay5wb3NpdGlvbi54ID0gc2NyZWVuV2lkdGgvMjtcbiAgICBsb2dvRGFyay5wb3NpdGlvbi55ID0gc2NyZWVuSGVpZ2h0LzI7XG5cbiAgICB2YXIgZ3VhcmRyYWlsRGFyayA9IFBJWEkuU3ByaXRlLmZyb21GcmFtZShcIkd1YXJkUmFpbC5wbmdcIik7XG4gICAgdmlldy5hZGRDaGlsZChndWFyZHJhaWxEYXJrKTtcbiAgICBndWFyZHJhaWxEYXJrLnBvc2l0aW9uLnkgPSA1NTA7XG4gICAgZ3VhcmRyYWlsRGFyay5hbHBoYSA9IDAuNTtcblxuICAgIHZhciBmcm9udCA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcbiAgICB2aWV3LmFkZENoaWxkKGZyb250KTtcblxuICAgIHZhciBmb3Jlc3QgPSBQSVhJLlNwcml0ZS5mcm9tRnJhbWUoXCJGb3Jlc3RMaWdodC5wbmdcIik7XG4gICAgZnJvbnQuYWRkQ2hpbGQoZm9yZXN0KTtcbiAgICBmb3Jlc3QucG9zaXRpb24ueSA9IDEwMjtcblxuICAgIGxvZ28gPSBQSVhJLlNwcml0ZS5mcm9tRnJhbWUoXCJEYXJrTGlnaHRMb2dvLnBuZ1wiKTtcbiAgICBmcm9udC5hZGRDaGlsZChsb2dvKTtcbiAgICBsb2dvLmFuY2hvci54ID0gMC41O1xuICAgIGxvZ28uYW5jaG9yLnkgPSAwLjU7XG4gICAgbG9nby5wb3NpdGlvbi54ID0gbG9nb0RhcmsucG9zaXRpb24ueDtcbiAgICBsb2dvLnBvc2l0aW9uLnkgPSBsb2dvRGFyay5wb3NpdGlvbi55O1xuXG4gICAgdmFyIGd1YXJkcmFpbCA9IFBJWEkuU3ByaXRlLmZyb21GcmFtZShcIkd1YXJkUmFpbC5wbmdcIik7XG4gICAgZnJvbnQuYWRkQ2hpbGQoZ3VhcmRyYWlsKTtcbiAgICBndWFyZHJhaWwucG9zaXRpb24ueSA9IGd1YXJkcmFpbERhcmsucG9zaXRpb24ueTtcblxuICAgIG92ZXJsYXAgPSBjcmVhdGVPdmVybGFwKCk7XG4gICAgdmlldy5hZGRDaGlsZChvdmVybGFwKTtcbiAgICBvdmVybGFwLnBvc2l0aW9uLnggPSBzY3JlZW5XaWR0aCAtIDEwMDtcbiAgICBvdmVybGFwLnBvc2l0aW9uLnkgPSAtMTAwO1xuXG4gICAgZnJvbnQubWFzayA9IG92ZXJsYXA7XG5cbiAgICBidG5TdGFydCA9IFBJWEkuU3ByaXRlLmZyb21GcmFtZShcIlN0YXJ0LnBuZ1wiKTtcbiAgICBidG5TdGFydC5hbmNob3IueCA9IDAuNTtcbiAgICBidG5TdGFydC5hbmNob3IueSA9IDAuNTtcbiAgICBidG5TdGFydC5zZXRJbnRlcmFjdGl2ZSh0cnVlKTtcbiAgICBidG5TdGFydC5jbGljayA9IGJ0blN0YXJ0LnRhcCA9IHN0YXJ0R2FtZTtcbiAgICB2aWV3LmFkZENoaWxkKGJ0blN0YXJ0KTtcbiAgICBidG5TdGFydC5wb3NpdGlvbi54ID0gc2NyZWVuV2lkdGgvMjtcbiAgICBidG5TdGFydC5wb3NpdGlvbi55ID0gc2NyZWVuSGVpZ2h0LzIgKyAxMzA7XG5cbiAgICBjYXIgPSBQSVhJLlNwcml0ZS5mcm9tRnJhbWUoXCJDYXIucG5nXCIpO1xuICAgIHZpZXcuYWRkQ2hpbGQoY2FyKTtcbiAgICBjYXIucG9zaXRpb24ueCA9IC0zMDAwO1xuICAgIGNhci5wb3NpdGlvbi55ID0gZ3VhcmRyYWlsRGFyay5wb3NpdGlvbi55IC0gNzU7XG4gICAgY2FyLnBhc3NlZCA9IGZhbHNlO1xuXG4gICAgcGFydGljbGVzID0gbmV3IFBhcnRpY2xlU3lzdGVtKFxuICAgIHtcbiAgICAgICAgXCJpbWFnZXNcIjpbXCJzbW9rZS5wbmdcIl0sXG4gICAgICAgIFwibnVtUGFydGljbGVzXCI6NTAwLFxuICAgICAgICBcImVtaXNzaW9uc1BlclVwZGF0ZVwiOjMsXG4gICAgICAgIFwiZW1pc3Npb25zSW50ZXJ2YWxcIjoxLFxuICAgICAgICBcImFscGhhXCI6MSxcbiAgICAgICAgXCJwcm9wZXJ0aWVzXCI6XG4gICAgICAgIHtcbiAgICAgICAgICBcInJhbmRvbVNwYXduWFwiOjIwLFxuICAgICAgICAgIFwicmFuZG9tU3Bhd25ZXCI6MyxcbiAgICAgICAgICBcImxpZmVcIjoyMCxcbiAgICAgICAgICBcInJhbmRvbUxpZmVcIjoxMDAsXG4gICAgICAgICAgXCJmb3JjZVhcIjowLFxuICAgICAgICAgIFwiZm9yY2VZXCI6LTAuMDEsXG4gICAgICAgICAgXCJyYW5kb21Gb3JjZVhcIjowLjAxLFxuICAgICAgICAgIFwicmFuZG9tRm9yY2VZXCI6MC4wMSxcbiAgICAgICAgICBcInZlbG9jaXR5WFwiOjAsXG4gICAgICAgICAgXCJ2ZWxvY2l0eVlcIjowLFxuICAgICAgICAgIFwicmFuZG9tVmVsb2NpdHlYXCI6MC4xLFxuICAgICAgICAgIFwicmFuZG9tVmVsb2NpdHlZXCI6MC4xLFxuICAgICAgICAgIFwic2NhbGVcIjoxLFxuICAgICAgICAgIFwiZ3Jvd3RoXCI6MC4xLFxuICAgICAgICAgIFwicmFuZG9tU2NhbGVcIjowLjUsXG4gICAgICAgICAgXCJhbHBoYVN0YXJ0XCI6MCxcbiAgICAgICAgICBcImFscGhhRmluaXNoXCI6MCxcbiAgICAgICAgICBcImFscGhhUmF0aW9cIjowLjIsXG4gICAgICAgICAgXCJ0b3JxdWVcIjowLFxuICAgICAgICAgIFwicmFuZG9tVG9ycXVlXCI6MFxuICAgICAgICB9XG4gICAgfSk7XG4gICAgdmlldy5hZGRDaGlsZChwYXJ0aWNsZXMudmlldyk7XG4gICAgcGFydGljbGVzLnZpZXcuYWxwaGEgPSAwLjI1O1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlT3ZlcmxhcCgpXG4gIHtcbiAgICB2YXIgbnVtU2hhZnRzID0gODtcbiAgICB2YXIgb3BlblJhdGUgPSAwLjI7XG4gICAgdmFyIHJhZGl1cyA9IDIwMDA7XG4gICAgdmFyIGdyYXBoID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcblxuICAgIGdyYXBoLmJlZ2luRmlsbCgweEZGRkZGRik7XG4gICAgZ3JhcGgubW92ZVRvKDAsIDApO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1TaGFmdHM7IGkrKylcbiAgICB7XG4gICAgICB2YXIgYSA9IE1hdGguUEkqMi9udW1TaGFmdHMqaTtcbiAgICAgIGdyYXBoLmxpbmVUbyhNYXRoLmNvcyhhIC0gb3BlblJhdGUpKnJhZGl1cywgTWF0aC5zaW4oYSAtIG9wZW5SYXRlKSpyYWRpdXMpO1xuICAgICAgZ3JhcGgubGluZVRvKE1hdGguY29zKGEgKyBvcGVuUmF0ZSkqcmFkaXVzLCBNYXRoLnNpbihhICsgb3BlblJhdGUpKnJhZGl1cyk7XG4gICAgICBncmFwaC5saW5lVG8oMCwgMCk7XG4gICAgfVxuXG4gICAgZ3JhcGguZW5kRmlsbCgpO1xuICAgIHJldHVybiBncmFwaDtcblxuICB9XG5cbiAgZnVuY3Rpb24gc2hvdygpXG4gIHtcbiAgICB2aWV3LnZpc2libGUgPSB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gaGlkZSgpXG4gIHtcbiAgICB2aWV3LnZpc2libGUgPSBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZSgpXG4gIHtcbiAgICBpZiAoIXZpZXcudmlzaWJsZSkgcmV0dXJuO1xuICAgIG92ZXJsYXAucm90YXRpb24gKz0gMC4wMDE7XG4gICAgY2FyLnBvc2l0aW9uLnggKz0gMjA7XG4gICAgY2FyLnNjYWxlLnggPSAxO1xuICAgIGlmIChjYXIucG9zaXRpb24ueCA+IDcwMDApIHtcbiAgICAgIGNhci5wb3NpdGlvbi54ID0gLTMwMDA7XG4gICAgICBjYXIucGFzc2VkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGNhci5wYXNzZWQgPT09IGZhbHNlICYmIGNhci5wb3NpdGlvbi54ID4gLTE0MDApIHtcbiAgICAgIGNhci5wYXNzZWQgPSB0cnVlO1xuICAgICAgZ2FtZS5yZXNvdXJjZXMuY2FyUGFzcy5wbGF5KCk7XG4gICAgfVxuXG4gICAgcGFydGljbGVzLnByb3BlcnRpZXMuY2VudGVyWCA9IGNhci5wb3NpdGlvbi54O1xuICAgIHBhcnRpY2xlcy5wcm9wZXJ0aWVzLmNlbnRlclkgPSBjYXIucG9zaXRpb24ueSArIDEwMDtcbiAgICBwYXJ0aWNsZXMudXBkYXRlKCk7XG5cbiAgICBsb2dvLnNjYWxlLnggPSAwLjk5ICsgTWF0aC5zaW4oY291bnQpKjAuMDI7XG4gICAgbG9nby5zY2FsZS55ID0gMC45OSArIE1hdGguY29zKGNvdW50KjAuMykqMC4wMjtcblxuICAgIGxvZ29EYXJrLnNjYWxlLnggPSAwLjk5ICsgTWF0aC5jb3MoY291bnQpKjAuMDI7XG4gICAgbG9nb0Rhcmsuc2NhbGUueSA9IDAuOTkgKyBNYXRoLnNpbihjb3VudCowLjMpKjAuMDI7XG5cbiAgICBidG5TdGFydC5hbHBoYSA9IDAuNzUgKyBNYXRoLmNvcyhjb3VudCoxNSkqMC4yNTtcblxuICAgIGNvdW50ICs9IDAuMDE7XG4gIH1cblxuICBmdW5jdGlvbiBzdGFydEdhbWUoKVxuICB7XG4gICAgZ2FtZS5yZXNvdXJjZXMuYnV0dG9uQ2xpY2sucGxheSgpXG4gICAgaGlkZSgpO1xuICAgIGdhbWUubG9hZExldmVsKDEpO1xuICB9XG59O1xuIiwidmFyIFJlc291cmNlcyA9IHJlcXVpcmUoJy4vUmVzb3VyY2VzJyksXG4gIFByZWxvYWRlciA9IHJlcXVpcmUoJy4vUHJlbG9hZGVyJyksXG4gIExldmVsID0gcmVxdWlyZSgnLi9MZXZlbCcpLFxuICBCZWdpbiA9IHJlcXVpcmUoJy4vQmVnaW4nKSxcbiAgLy8gTGV2ZWxFbmQgPSByZXF1aXJlKCcuL0xldmVsRW5kJyksXG4gIEdhbWVPdmVyID0gcmVxdWlyZSgnLi9HYW1lT3ZlcicpLFxuICBMaWdodCA9IHJlcXVpcmUoJy4vTGlnaHQnKSxcbiAgVHdlZW5hYmxlID0gcmVxdWlyZSgnLi92ZW5kb3Ivc2hpZnR5JyksXG4gIEdhbWVJbnB1dCA9IHJlcXVpcmUoJy4vR2FtZUlucHV0LmpzJyksXG4gIFBsYXllciA9IHJlcXVpcmUoJy4vUGxheWVyLmpzJyk7XG4gIFBoeXNpY3MgPSByZXF1aXJlKCcuL1BoeXNpY3MuanMnKTtcbiAgVG9vbHMgPSByZXF1aXJlKCcuL1Rvb2xzLmpzJyk7XG5cbndpbmRvdy5Ud2VlbmFibGUgPSBUd2VlbmFibGU7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gR2FtZSgpIHtcbiAgdGhpcy5yZXNvdXJjZXMgPSBuZXcgUmVzb3VyY2VzKCk7XG5cbiAgLy8gc3RhZ2UuY2xpY2sgPSBmdW5jdGlvbihlKSB7XG4gIC8vICAgbGlnaHQueCA9IGUub3JpZ2luYWxFdmVudC54O1xuICAvLyAgIGxpZ2h0LnkgPSBlLm9yaWdpbmFsRXZlbnQueTtcbiAgLy8gfVxuXG4gIHdpbmRvdy5zY3JlZW5XaWR0aCA9ICh0eXBlb2YoZWplY3RhKT09XCJ1bmRlZmluZWRcIikgPyA5NjAgOiA0ODA7XG4gIHdpbmRvdy5zY3JlZW5IZWlnaHQgPSAodHlwZW9mKGVqZWN0YSk9PVwidW5kZWZpbmVkXCIpID8gNjQwIDogMzIwO1xuXG4gIHRoaXMucmVuZGVyZXIgPSBuZXcgUElYSS5DYW52YXNSZW5kZXJlcihzY3JlZW5XaWR0aCwgc2NyZWVuSGVpZ2h0LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyksIGZhbHNlIC8qIHRyYW5zcGFyZW50ICovLCBmYWxzZSAvKiBhbnRpYWxpYXMgKi8pO1xuICB0aGlzLnJlbmRlcmVyLnZpZXcuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgdGhpcy5yZW5kZXJlci52aWV3LnN0eWxlLmJvcmRlciA9IFwiMXB4IHNvbGlkXCI7XG5cbiAgdGhpcy5zdGFnZSA9IG5ldyBQSVhJLlN0YWdlKDB4MDBmZmZhLCB0cnVlKTtcblxuICAvLy8vSW5wdXRcbiAgdmFyIGlucHV0ID0gbnVsbDtcblxuICAvLy8vL1BsYXllclxuICB2YXIgcGxheWVyID0gbnVsbDtcbiAgdmFyIHBoeXNpY3MgPSBudWxsO1xuICB2YXIgZGlyZWN0aW9uID0gMDtcbiAgdmFyIGdsb3cgPSBudWxsO1xuXG4gIC8vIExldmVsSW5kZXhcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgbGV2ZWwgPSBudWxsO1xuICB2YXIgbG9zdCA9IGZhbHNlO1xuICB2YXIgZ2FtZVJ1bm5pbmcgPSBmYWxzZTtcbiAgd2luZG93LmxpZ2h0ID0gbmV3IExpZ2h0KDUwLCA1MCk7XG5cbiAgc2VsZi5sZXZlbCA9IGxldmVsO1xuXG4gIHZhciBsYXN0TW91c2VDbGljayA9IDAsXG4gICAgICBtb3VzZUNsaWNrSW50ZXJ2YWwgPSAxMDAwOyAvLyAxIHNlY29uZCB0byBjbGljayBhZ2FpblxuXG4gIHRoaXMucmVuZGVyZXIudmlldy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAvLyBwcmV2ZW50IGNsaWNrIG9uIGZpcnN0IGxldmVsXG4gICAgLy8gaWYgKCFzZWxmLmxldmVsKSB7IHJldHVybjsgfVxuXG4gICAgdmFyIGNsaWNrVGltZSA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG5cbiAgICBpZiAobGFzdE1vdXNlQ2xpY2sgKyBtb3VzZUNsaWNrSW50ZXJ2YWwgPj0gY2xpY2tUaW1lKSB7XG4gICAgICAvLyBkaXNzYWxsb3dlZFxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxhc3RNb3VzZUNsaWNrID0gY2xpY2tUaW1lO1xuXG4gICAgLy8gbGlnaHQucG9zaXRpb24ueCA9IGUub2Zmc2V0WDtcbiAgICAvLyBsaWdodC5wb3NpdGlvbi55ID0gZS5vZmZzZXRZO1xuXG4gICAgaWYgKHNlbGYuYnRuU291bmRPbi52aXNpYmxlID09PSB0cnVlKSB7XG4gICAgICBpZiAoZS5vZmZzZXRYID49IHNlbGYuYnRuU291bmRPbi54ICYmIGUub2Zmc2V0WCA8IHNlbGYuYnRuU291bmRPbi54ICsgc2VsZi5idG5Tb3VuZE9uLndpZHRoXG4gICAgICAgICYmIGUub2Zmc2V0WSA+PSBzZWxmLmJ0blNvdW5kT24ueSAmJiBlLm9mZnNldFkgPCBzZWxmLmJ0blNvdW5kT24ueSArIHNlbGYuYnRuU291bmRPbi5oZWlnaHQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzZWxmLmJ0blNvdW5kT2ZmLnZpc2libGUgPT09IHRydWUpIHtcbiAgICAgIGlmIChlLm9mZnNldFggPj0gc2VsZi5idG5Tb3VuZE9mZi54ICYmIGUub2Zmc2V0WCA8IHNlbGYuYnRuU291bmRPZmYueCArIHNlbGYuYnRuU291bmRPZmYud2lkdGhcbiAgICAgICAgJiYgZS5vZmZzZXRZID49IHNlbGYuYnRuU291bmRPZmYueSAmJiBlLm9mZnNldFkgPCBzZWxmLmJ0blNvdW5kT2ZmLnkgKyBzZWxmLmJ0blNvdW5kT2ZmLmhlaWdodCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNlbGYuYnRuUmVzdGFydC52aXNpYmxlID09PSB0cnVlKSB7XG4gICAgICBpZiAoZS5vZmZzZXRYID49IHNlbGYuYnRuUmVzdGFydC54ICYmIGUub2Zmc2V0WCA8IHNlbGYuYnRuUmVzdGFydC54ICsgc2VsZi5idG5SZXN0YXJ0LndpZHRoXG4gICAgICAgICYmIGUub2Zmc2V0WSA+PSBzZWxmLmJ0blJlc3RhcnQueSAmJiBlLm9mZnNldFkgPCBzZWxmLmJ0blJlc3RhcnQueSArIHNlbGYuYnRuUmVzdGFydC5oZWlnaHQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzZWxmLmxldmVsICE9PSBudWxsKSB7XG4gICAgICBnYW1lLnJlc291cmNlcy5tb3RoZXJTb3VuZC5wbGF5KCk7XG4gICAgfVxuXG4gICAgdmFyIGRlc3QgPSB7IHg6ZS5vZmZzZXRYLCB5OmUub2Zmc2V0WSB9O1xuICAgIHZhciB0d2VlbmFibGUgPSBuZXcgVHdlZW5hYmxlKCk7XG4gICAgdHdlZW5hYmxlLnR3ZWVuKHtcbiAgICAgIGZyb206IGxpZ2h0LnBvc2l0aW9uLFxuICAgICAgdG86ICAgZGVzdCxcbiAgICAgIGR1cmF0aW9uOiBtb3VzZUNsaWNrSW50ZXJ2YWwsXG4gICAgICBlYXNpbmc6ICdlYXNlT3V0Q3ViaWMnLFxuICAgICAgc3RhcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbW92aW5nID0gdHJ1ZTtcbiAgICAgIH0sXG4gICAgICBmaW5pc2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbW92aW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pXG5cbiAgdmFyIGxpZ2h0R3JhcGhpY3MgPSBuZXcgUElYSS5HcmFwaGljcygpLFxuICBsaWdodENvbnRhaW5lciA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcblxuICB0aGlzLnJlc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaSA9IHNlbGYubGV2ZWwuaW5kZXg7XG4gICAgc2VsZi5sZXZlbC5kaXNwb3NlKCk7XG4gICAgdGhpcy5sb2FkTGV2ZWwoaSk7XG4gIH1cblxuICB0aGlzLm5leHRMZXZlbCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubG9hZExldmVsKHRoaXMubGV2ZWwuaW5kZXggKyAxKTtcbiAgfVxuXG4gIHRoaXMuc2V0TGV2ZWwgPSBmdW5jdGlvbihsZXZlbERhdGEsIGxldmVsSW5kZXgpIHtcbiAgICB2YXIgaCA9IHNlbGYucmVuZGVyZXIuaGVpZ2h0ICsgODAsXG4gICAgICAgIHcgPSBzZWxmLnJlbmRlcmVyLndpZHRoLFxuICAgICAgICBmcmFtZUJvcmRlciA9IDUwO1xuXG4gICAgdmFyIG5ld0xldmVsID0gbmV3IExldmVsKHNlbGYsIGxldmVsSW5kZXgpO1xuXG4gICAgLy8gYWRkIHN0YWdlIGJvcmRlciB0byBsZXZlbCBzZWdtZW50c1xuICAgIG5ld0xldmVsLnNlZ21lbnRzLnVuc2hpZnQoIHthOnt4Oi1mcmFtZUJvcmRlcix5Oi1mcmFtZUJvcmRlcn0sIGI6e3g6dyx5Oi1mcmFtZUJvcmRlcn19ICk7XG4gICAgbmV3TGV2ZWwuc2VnbWVudHMudW5zaGlmdCgge2E6e3g6dyx5Oi1mcmFtZUJvcmRlcn0sIGI6e3g6dyx5Omh9fSApO1xuICAgIG5ld0xldmVsLnNlZ21lbnRzLnVuc2hpZnQoIHthOnt4OncseTpofSwgYjp7eDotZnJhbWVCb3JkZXIseTpofX0gKTtcbiAgICBuZXdMZXZlbC5zZWdtZW50cy51bnNoaWZ0KCB7YTp7eDotZnJhbWVCb3JkZXIseTpofSwgYjp7eDotZnJhbWVCb3JkZXIseTotZnJhbWVCb3JkZXJ9fSApO1xuXG4gICAgbmV3TGV2ZWwucGFyc2UobGV2ZWxEYXRhKTtcblxuICAgIHNlbGYubGV2ZWwgPSBuZXdMZXZlbDtcbiAgICBzZWxmLnN0YWdlLmFkZENoaWxkQXQoc2VsZi5sZXZlbC52aWV3LCAwKTtcblxuICAgIGxpZ2h0LnNldFNlZ21lbnRzKG5ld0xldmVsLnNlZ21lbnRzKTtcblxuICAgIC8vIGFkZCBsZXZlbCBjb250YWluZXIgdG8gc3RhZ2UuXG4gICAgZ2FtZS5zdGFnZS5hZGRDaGlsZChuZXdMZXZlbC5jb250YWluZXIpO1xuXG4gICAgLy8gcmUtY3JlYXRlIHRoZSBwbGF5ZXJcbiAgICBwbGF5ZXIgPSBuZXcgUGxheWVyKG5ld0xldmVsLmNvbnRhaW5lciwgbmV3TGV2ZWwucGxheWVyUG9zLngsbmV3TGV2ZWwucGxheWVyUG9zLnkpO1xuICAgIHBoeXNpY3MucGxheWVyUG9zaXRpb24ueCA9IHBsYXllci52aWV3LnBvc2l0aW9uLng7XG4gICAgcGh5c2ljcy5wbGF5ZXJQb3NpdGlvbi55ID0gcGxheWVyLnZpZXcucG9zaXRpb24ueTtcblxuICAgIC8vIGNvbnNvbGUubG9nKG5ld0xldmVsLnBsYXllclBvcy54ICsgXCIgXCIgKyBuZXdMZXZlbC5wbGF5ZXJQb3MueSk7XG4gICAgc2VsZi5wbGF5ZXIgPSBwbGF5ZXI7XG5cbiAgICBzZWxmLmxvb3AoKTtcbiAgICBzZWxmLnN0YWdlLmFkZENoaWxkKGdsb3cpO1xuICB9O1xuXG4gIHRoaXMubG9hZExldmVsID0gZnVuY3Rpb24obGV2ZWxJbmRleCkge1xuICAgIGlmKCFpbnB1dClcbiAgICB7XG4gICAgICBpbnB1dCA9IG5ldyBHYW1lSW5wdXQoKTtcbiAgICAgIHNlbGYuaW5wdXQgPSBpbnB1dDtcbiAgICB9XG5cbiAgICBpZiAoIXBoeXNpY3Mpe1xuICAgICAgcGh5c2ljcyA9IG5ldyBQaHlzaWNzKCk7XG4gICAgfVxuXG4gICAgLy8gbGV2ZWxJbmRleCA9IDI7XG4gICAgLy8gY29uc29sZS5sb2coXCJsZXZlbC9sZXZlbFwiICsgbGV2ZWxJbmRleCArIFwiLmpzb25cIik7XG4gICAgdmFyIHBpeGlMb2FkZXIgPSBuZXcgUElYSS5Kc29uTG9hZGVyKFwibGV2ZWwvbGV2ZWxcIiArIGxldmVsSW5kZXggKyBcIi5qc29uXCIpO1xuICAgIHBpeGlMb2FkZXIub24oJ2xvYWRlZCcsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgLy9kYXRhIGlzIGluIGV2dC5jb250ZW50Lmpzb25cbiAgICAgIC8vIGNvbnNvbGUubG9nKFwianNvbiBsb2FkZWQhXCIpO1xuICAgICAgc2VsZi5zZXRMZXZlbChldnQuY29udGVudC5qc29uLCBsZXZlbEluZGV4KTtcbiAgICAgIGdhbWVSdW5uaW5nID0gdHJ1ZTtcbiAgICAgIGxvc3QgPSBmYWxzZTtcbiAgICB9KTtcblxuICAgIHBpeGlMb2FkZXIubG9hZCgpO1xuICB9XG5cbiAgdmFyIGxhc3RMaWdodFgsIGxhc3RMaWdodFk7XG5cbiAgdGhpcy51cGRhdGVMaWdodHMgPSBmdW5jdGlvbigpIHtcbiAgICAvLyBub3RoaW5nIHRvIHVwZGF0ZSwgc2tpcFxuXG4gICAgaWYgKGxpZ2h0LnBvc2l0aW9uLnggPT0gbGFzdExpZ2h0WCAmJiBsaWdodC5wb3NpdGlvbi55ID09IGxhc3RMaWdodFkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBGSVhNRVxuICAgIGlmIChsaWdodC5zZWdtZW50cy5sZW5ndGggPT0gMCB8fCAhdGhpcy5sZXZlbCB8fCB0aGlzLmxldmVsLnNlZ21lbnRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGlnaHRHcmFwaGljcy5jbGVhcigpO1xuXG4gICAgLy8gcmVtb3ZlIHByZXZpb3VzIGFkZGVkIGxpZ2h0IGl0ZW1zXG4gICAgaWYgKGxpZ2h0Q29udGFpbmVyLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgIGxpZ2h0Q29udGFpbmVyLnJlbW92ZUNoaWxkcmVuKCk7XG4gICAgfVxuXG4gICAgLy8gU2lnaHQgUG9seWdvbnNcbiAgICB2YXIgcG9seWdvbnMgPSBsaWdodC5nZXRTaWdodFBvbHlnb25zKCk7XG5cbiAgICAvLyBEUkFXIEFTIEEgR0lBTlQgUE9MWUdPTlxuXG4gICAgdmFyIHZlcnRpY2VzID0gcG9seWdvbnNbMF07XG4gICAgd2luZG93LnBvbHlnb25zID0gcG9seWdvbnNbMF07XG5cbiAgICAvLyBsaWdodEdyYXBoaWNzLmNsZWFyKCk7XG4gICAgLy8gbGlnaHRHcmFwaGljcy5iZWdpbkZpbGwoMHhGRkZGRkYpO1xuICAgIC8vIGxpZ2h0R3JhcGhpY3MubW92ZVRvKHZlcnRpY2VzWzBdLngsIHZlcnRpY2VzWzBdLnkpO1xuICAgIC8vIGZvciAodmFyIGkgPSAxOyBpPHZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgLy8gICB2YXIgdiA9IHZlcnRpY2VzW2ldO1xuICAgIC8vICAgbGlnaHRHcmFwaGljcy5saW5lVG8odi54LCB2LnkpO1xuICAgIC8vIH1cbiAgICAvLyBsaWdodEdyYXBoaWNzLmVuZEZpbGwoKTtcblxuICAgIGxpZ2h0R3JhcGhpY3MuY2xlYXIoKTtcbiAgICBsaWdodEdyYXBoaWNzLmJlZ2luRmlsbCgweEZGRkZGRik7XG4gICAgbGlnaHRHcmFwaGljcy5tb3ZlVG8odmVydGljZXNbMF0ueCwgdmVydGljZXNbMF0ueSk7XG4gICAgZm9yICh2YXIgaSA9IDE7IGk8dmVydGljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB2ID0gdmVydGljZXNbaV07XG4gICAgICBsaWdodEdyYXBoaWNzLmxpbmVUbyh2LngsIHYueSk7XG4gICAgfVxuICAgIGxpZ2h0R3JhcGhpY3MuZW5kRmlsbCgpO1xuXG4gICAgLy8gb3ZlcmxhcC5hZGRDaGlsZChsaWdodEdyYXBoaWNzKTtcbiAgICAvLyBvdmVybGFwU2hhcGUubWFzayA9IGxpZ2h0R3JhcGhpY3M7XG5cbiAgICBzZWxmLmxldmVsLmJnMi5tYXNrID0gbGlnaHRHcmFwaGljcztcbiAgICAvLyBvdmVybGF5Lm1hc2sgPSBsaWdodEdyYXBoaWNzO1xuXG4gICAgbGFzdExpZ2h0WCA9IGxpZ2h0LnBvc2l0aW9uLng7XG4gICAgbGFzdExpZ2h0WSA9IGxpZ2h0LnBvc2l0aW9uLnk7XG4gIH07XG5cbiAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbigpIHtcblxuICAgIGlmIChzZWxmLmJ0blJlc3RhcnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHNlbGYubGV2ZWwgPT09IG51bGwpIHtcbiAgICAgICAgc2VsZi5idG5SZXN0YXJ0LnZpc2libGUgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGYuYnRuUmVzdGFydC52aXNpYmxlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2VsZi5iZWdpbikgc2VsZi5iZWdpbi51cGRhdGUoKTtcbiAgICBpZiAoc2VsZi5nYW1lb3Zlcikgc2VsZi5nYW1lb3Zlci51cGRhdGUoKTtcblxuICAgIGlmICghZ2FtZVJ1bm5pbmcpIHJldHVybjtcbiAgICB0aGlzLnVwZGF0ZUxpZ2h0cygpO1xuXG4gICAgLy8gY29uc29sZS5sb2coaW5wdXQgKyBcIiBcIiArIGlucHV0LktleSk7XG4gICAgaWYoIWlucHV0KVxuICAgICAgcmV0dXJuO1xuXG4gICAgaWYgKGlucHV0LktleS5pc0Rvd24oaW5wdXQuS2V5LkxFRlQpIHx8IGlucHV0LktleS5pc0Rvd24oaW5wdXQuS2V5LkEpKVxuICAgIHtcbiAgICAgIGRpcmVjdGlvbiAtPSAwLjA5O1xuICAgIH1cbiAgICBlbHNlIGlmIChpbnB1dC5LZXkuaXNEb3duKGlucHV0LktleS5SSUdIVCkgfHwgaW5wdXQuS2V5LmlzRG93bihpbnB1dC5LZXkuRCkpXG4gICAge1xuICAgICAgZGlyZWN0aW9uICs9IDAuMDk7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICBkaXJlY3Rpb24gKj0gMC45O1xuICAgIH1cblxuICAgIGRpcmVjdGlvbiA9IFRvb2xzLmNsYW1wKGRpcmVjdGlvbiwgLTEsIDEpO1xuXG4gICAgaWYgKHNlbGYubGV2ZWwpXG4gICAge1xuICAgICAgaWYocGh5c2ljcylcbiAgICAgICAgcGh5c2ljcy5wcm9jZXNzKGdhbWUsIGRpcmVjdGlvbiwgd2luZG93LnBvbHlnb25zKTtcblxuICAgICAgaWYocGxheWVyKVxuICAgICAgICBwbGF5ZXIudXBkYXRlKGdhbWUsIHBoeXNpY3MucGxheWVyUG9zaXRpb24sIHBoeXNpY3MucGxheWVyVmVsb2NpdHkpO1xuXG4gICAgICAgc2VsZi5sZXZlbC51cGRhdGUoc2VsZik7XG5cbiAgICAgICBpZiAoIWxvc3QgJiYgcGh5c2ljcy5wbGF5ZXJQb3NpdGlvbi55ID4gc2NyZWVuSGVpZ2h0ICsgNDApIHRoaXMubG9zZUdhbWUoKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGxvb3BCb3VuZGVkID0gIGZhbHNlIDtcbiAgdGhpcy5sb29wID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKGxvb3BCb3VuZGVkKXsgcmV0dXJuOyB9XG4gICAgbG9vcEJvdW5kZWQgPSB0cnVlO1xuICAgIHJlcXVlc3RBbmltRnJhbWUoc2VsZi5yZW5kZXJMb29wKTtcbiAgfTtcblxuICB0aGlzLnJlbmRlckxvb3AgPSBmdW5jdGlvbigpIHtcbiAgICBzZWxmLnVwZGF0ZSgpOyAvLyBsb2dpY1xuICAgIHNlbGYucmVuZGVyZXIucmVuZGVyKHNlbGYuc3RhZ2UpO1xuICAgIHJlcXVlc3RBbmltRnJhbWUoc2VsZi5yZW5kZXJMb29wKTtcbiAgfVxuXG4gIHRoaXMubG9hZFBpeGkgPSBmdW5jdGlvbigpIHtcbiAgICBzZWxmLml0ZW1zTG9hZGVkID0gMCxcbiAgICBzZWxmLnBpeGlGaWxlcyA9IHNlbGYucmVzb3VyY2VzLmdldFBJWElGaWxlcygpLFxuICAgIHNlbGYuc291bmRGaWxlcyA9IHNlbGYucmVzb3VyY2VzLnNvdW5kcyxcbiAgICBzZWxmLnRvdGFsSXRlbXMgPSBzZWxmLnBpeGlGaWxlcy5sZW5ndGggKyBzZWxmLnNvdW5kRmlsZXMubGVuZ3RoO1xuICAgIC8vIGxvYWRlclxuICAgIGxvYWRlciA9IG5ldyBQSVhJLkFzc2V0TG9hZGVyKHNlbGYucGl4aUZpbGVzKTtcbiAgICBsb2FkZXIuYWRkRXZlbnRMaXN0ZW5lcignb25Db21wbGV0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgc2VsZi5sb2FkU291bmQoKTtcbiAgICB9KTtcbiAgICBsb2FkZXIuYWRkRXZlbnRMaXN0ZW5lcignb25Qcm9ncmVzcycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIHNlbGYuaXRlbXNMb2FkZWQgKz0gMTtcbiAgICAgIHNlbGYucHJlbG9hZGVyLnByb2dyZXNzKHNlbGYuaXRlbXNMb2FkZWQsIHNlbGYudG90YWxJdGVtcyk7XG4gICAgICBpZiAodHlwZW9mKGVqZWN0YSkhPT1cInVuZGVmaW5lZFwiKSB7IHJldHVybjsgfTtcbiAgICB9KTtcblxuICAgIGxvYWRlci5sb2FkKCk7XG4gIH1cblxuICB0aGlzLmxvYWRTb3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpID0gKHNlbGYuaXRlbXNMb2FkZWQgLSBzZWxmLnBpeGlGaWxlcy5sZW5ndGgpLFxuICAgICAgb2JqID0gc2VsZi5zb3VuZEZpbGVzW2ldO1xuICAgIHNlbGYucmVzb3VyY2VzW29iai5uYW1lXSA9IG5ldyBIb3dsKHtcbiAgICAgIHVybHM6IG9iai51cmxzLFxuICAgICAgYXV0b3BsYXk6IG9iai5hdXRvUGxheSB8fCBmYWxzZSxcbiAgICAgIGxvb3A6IG9iai5sb29wIHx8IGZhbHNlLFxuICAgICAgdm9sdW1lOiBvYmoudm9sdW1lIHx8IDEsXG4gICAgICBvbmxvYWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBzZWxmLml0ZW1zTG9hZGVkKys7XG4gICAgICAgIHNlbGYucHJlbG9hZGVyLnByb2dyZXNzKHNlbGYuaXRlbXNMb2FkZWQsIHNlbGYudG90YWxJdGVtcyk7XG4gICAgICAgIGlmIChzZWxmLml0ZW1zTG9hZGVkID09IHNlbGYudG90YWxJdGVtcykge1xuICAgICAgICAgIHNlbGYubG9hZGVkKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi5sb2FkU291bmQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdGhpcy5sb2FkZWQgPSBmdW5jdGlvbigpIHtcbiAgICBzZWxmLmJlZ2luID0gbmV3IEJlZ2luKHRoaXMpO1xuICAgIC8vIHNlbGYubGV2ZWxlbmQgPSBuZXcgTGV2ZWxFbmQodGhpcyk7XG4gICAgc2VsZi5nYW1lb3ZlciA9IG5ldyBHYW1lT3Zlcih0aGlzKTtcbiAgICBzZWxmLnByZWxvYWRlci5oaWRlKCk7XG4gICAgc2VsZi5iZWdpbi5zaG93KCk7XG4gICAgZ2FtZS5yZXNvdXJjZXMuc291bmRMb29wLmZhZGVJbiguNCwgMjAwMCk7XG5cbiAgICBnbG93ID0gUElYSS5TcHJpdGUuZnJvbUZyYW1lKFwiZ2xvdy5wbmdcIik7XG4gICAgZ2xvdy5zY2FsZS54ID0gMjtcbiAgICBnbG93LnNjYWxlLnkgPSAyO1xuICAgIHNlbGYuc3RhZ2UuYWRkQ2hpbGQoZ2xvdyk7XG4gICAgZ2xvdy5hbHBoYSA9IDAuNjU7XG5cbiAgICBzZWxmLmJ0blNvdW5kT2ZmID0gUElYSS5TcHJpdGUuZnJvbUZyYW1lKCdzb3VuZE9uLnBuZycpO1xuICAgIHNlbGYuYnRuU291bmRPZmYuc2V0SW50ZXJhY3RpdmUodHJ1ZSk7XG4gICAgc2VsZi5idG5Tb3VuZE9mZi5idXR0b25Nb2RlID0gdHJ1ZTtcbiAgICBzZWxmLmJ0blNvdW5kT2ZmLnBvc2l0aW9uLnggPSAxMDtcbiAgICBzZWxmLmJ0blNvdW5kT2ZmLnBvc2l0aW9uLnkgPSAxMDtcblxuICAgIHNlbGYuYnRuU291bmRPbiA9IFBJWEkuU3ByaXRlLmZyb21GcmFtZSgnc291bmRPZmYucG5nJyk7XG4gICAgc2VsZi5idG5Tb3VuZE9uLnNldEludGVyYWN0aXZlKHRydWUpO1xuICAgIHNlbGYuYnRuU291bmRPbi5idXR0b25Nb2RlID0gdHJ1ZTtcbiAgICBzZWxmLmJ0blNvdW5kT24ucG9zaXRpb24ueCA9IHNlbGYuYnRuU291bmRPZmYucG9zaXRpb24ueDtcbiAgICBzZWxmLmJ0blNvdW5kT24ucG9zaXRpb24ueSA9IHNlbGYuYnRuU291bmRPZmYucG9zaXRpb24ueTtcbiAgICBzZWxmLmJ0blNvdW5kT24udmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgc2VsZi5zdGFnZS5hZGRDaGlsZChnYW1lLmJ0blNvdW5kT2ZmKTtcbiAgICBzZWxmLnN0YWdlLmFkZENoaWxkKGdhbWUuYnRuU291bmRPbik7XG5cbiAgICBzZWxmLmJ0blNvdW5kT2ZmLmNsaWNrID0gc2VsZi5idG5Tb3VuZE9mZi50YXAgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBzZWxmLmJ0blNvdW5kT24udmlzaWJsZSA9IHRydWU7XG4gICAgICBzZWxmLmJ0blNvdW5kT2ZmLnZpc2libGUgPSBmYWxzZTtcbiAgICAgIEhvd2xlci5tdXRlKCk7XG4gICAgfVxuXG4gICAgc2VsZi5idG5Tb3VuZE9uLmNsaWNrID0gc2VsZi5idG5Tb3VuZE9uLnRhcCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHNlbGYuYnRuU291bmRPbi52aXNpYmxlID0gZmFsc2U7XG4gICAgICBzZWxmLmJ0blNvdW5kT2ZmLnZpc2libGUgPSB0cnVlO1xuICAgICAgSG93bGVyLnVubXV0ZSgpO1xuICAgIH1cblxuICAgIHNlbGYuYnRuUmVzdGFydCA9IFBJWEkuU3ByaXRlLmZyb21GcmFtZSgncmVzdGFydC5wbmcnKTtcbiAgICBzZWxmLmJ0blJlc3RhcnQuc2V0SW50ZXJhY3RpdmUodHJ1ZSk7XG4gICAgc2VsZi5idG5SZXN0YXJ0LmJ1dHRvbk1vZGUgPSB0cnVlO1xuICAgIHNlbGYuc3RhZ2UuYWRkQ2hpbGQoZ2FtZS5idG5SZXN0YXJ0KTtcbiAgICBzZWxmLmJ0blJlc3RhcnQucG9zaXRpb24ueCA9IHNlbGYucmVuZGVyZXIud2lkdGggLSAxMCAtIHNlbGYuYnRuUmVzdGFydC53aWR0aDtcbiAgICBzZWxmLmJ0blJlc3RhcnQucG9zaXRpb24ueSA9IDEwO1xuICAgIHNlbGYuYnRuUmVzdGFydC52aXNpYmxlID0gZmFsc2U7XG5cbiAgICBzZWxmLmJ0blJlc3RhcnQuY2xpY2sgPSBzZWxmLmJ0blJlc3RhcnQudGFwID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgc2VsZi5yZXN0YXJ0KCk7XG4gICAgfVxuICB9XG5cbiAgdGhpcy5zdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpbWdzQXJyID0gW10sIGk7XG4gICAgbG9zdCA9IGZhbHNlO1xuICAgIC8vIHN0YXJ0IHNjZW5lc1xuICAgIC8vIHNlbGYuc3RhZ2UuYWRkQ2hpbGQobGlnaHRHcmFwaGljcyk7XG5cbiAgICAvLyBzdGFydCBzY3JlZW5zXG5cbiAgICAvLyBzdGFydCBsb29wXG4gICAgc2VsZi5sb29wKCk7XG5cbiAgICAvL1xuICAgIHNlbGYucHJlbG9hZGVyID0gbmV3IFByZWxvYWRlcih0aGlzKTtcblxuICAgIC8vIEZJWE1FXG4gICAgc2VsZi5sb2FkUGl4aSgpO1xuICB9O1xuXG4gIHRoaXMubG9zZUdhbWUgPSBmdW5jdGlvbigpXG4gIHtcbiAgICBpZiAobG9zdCkgcmV0dXJuO1xuICAgIGxvc3QgPSB0cnVlO1xuICAgIGdhbWVSdW5uaW5nID0gZmFsc2U7XG4gICAgc2VsZi5nYW1lb3Zlci5zaG93KCk7XG4gIH1cblxuICB0aGlzLmdvVG9CZWdpbm5pbmcgPSBmdW5jdGlvbigpXG4gIHtcbiAgICAvLyBnYW1lLmxvYWRMZXZlbCgxKTtcbiAgICBnYW1lLmxldmVsLmRpc3Bvc2UoKTtcbiAgICBnYW1lLmxldmVsLmluZGV4ID0gMDtcbiAgICBnYW1lLmxldmVsID0gbnVsbDtcblxuICAgIHNlbGYuYmVnaW4uc2hvdygpO1xuICB9XG5cbiAgdmFyIHBocmFzZTEgPSBudWxsO1xuICB2YXIgcGhyYXNlMiA9IG51bGw7XG4gIHZhciBwaHJhc2UzID0gbnVsbDtcbiAgdGhpcy5zaG93RW5kU3RvcnkgPSBmdW5jdGlvbigpXG4gIHtcbiAgICAvLyBjb25zb2xlLmxvZyhcInNob3cgZW5kIHN0b3J5XCIsIGdhbWVSdW5uaW5nKTtcblxuICAgIGlmKCFnYW1lUnVubmluZylcbiAgICAgIHJldHVybjtcblxuICAgIGdhbWVSdW5uaW5nID0gZmFsc2U7XG5cbiAgICBwaHJhc2UxID0gbmV3IFBJWEkuVGV4dCgnSE1NTS4uLk1ZIEhFQUQuLi5XSEFUIEhBUFBFTkVEPycsIHtcbiAgICAgIGZvbnQ6ICcyMnB4IFJva2tpdHQnLFxuICAgICAgZmlsbDogJyNGRkZGRkYnLFxuICAgICAgYWxpZ246ICdjZW50ZXInXG4gICAgfSk7XG5cbiAgICBwaHJhc2UyID0gbmV3IFBJWEkuVGV4dCgnTU9NPy4uLk1PTT8hIE5PISEhJywge1xuICAgICAgZm9udDogJzIycHggUm9ra2l0dCcsXG4gICAgICBmaWxsOiAnI0ZGRkZGRicsXG4gICAgICBhbGlnbjogJ2NlbnRlcidcbiAgICB9KTtcblxuICAgIHBocmFzZTMgPSBuZXcgUElYSS5UZXh0KCdCVVQuLi5XQUlULi4uVEhBVCBMSUdIVCwgSVQgV0FTIFlPVT8nLCB7XG4gICAgICBmb250OiAnMjJweCBSb2traXR0JyxcbiAgICAgIGZpbGw6ICcjRkZGRkZGJyxcbiAgICAgIGFsaWduOiAnY2VudGVyJ1xuICAgIH0pO1xuXG4gICAgcGhyYXNlMS5hbHBoYSA9IDA7XG4gICAgcGhyYXNlMi5hbHBoYSA9IDA7XG4gICAgcGhyYXNlMy5hbHBoYSA9IDA7XG5cbiAgICBwaHJhc2UxLnBvc2l0aW9uLnggPSAoc2VsZi5yZW5kZXJlci53aWR0aCAvIDIpIC0gKHBocmFzZTEud2lkdGggLyAyKTtcbiAgICBwaHJhc2UxLnBvc2l0aW9uLnkgPSBzZWxmLnJlbmRlcmVyLmhlaWdodCAvIDIgLSA2MDtcbiAgICBzZWxmLnN0YWdlLmFkZENoaWxkKHBocmFzZTEpO1xuXG4gICAgcGhyYXNlMi5wb3NpdGlvbi54ID0gKHNlbGYucmVuZGVyZXIud2lkdGggLyAyKSAtIChwaHJhc2UyLndpZHRoIC8gMik7XG4gICAgcGhyYXNlMi5wb3NpdGlvbi55ID0gc2VsZi5yZW5kZXJlci5oZWlnaHQgLyAyIC0gMTA7XG4gICAgc2VsZi5zdGFnZS5hZGRDaGlsZChwaHJhc2UyKTtcblxuICAgIHBocmFzZTMucG9zaXRpb24ueCA9IChzZWxmLnJlbmRlcmVyLndpZHRoIC8gMikgLSAocGhyYXNlMy53aWR0aCAvIDIpO1xuICAgIHBocmFzZTMucG9zaXRpb24ueSA9IHNlbGYucmVuZGVyZXIuaGVpZ2h0IC8gMiArIDQwO1xuICAgIHNlbGYuc3RhZ2UuYWRkQ2hpbGQocGhyYXNlMyk7XG5cblxuICAgIHZhciB0d2VlbmFibGUgPSBuZXcgVHdlZW5hYmxlKCk7XG4gICAgdHdlZW5hYmxlLnR3ZWVuKHtcbiAgICAgIGZyb206IHthbHBoYTowfSxcbiAgICAgIHRvOiAgIHthbHBoYToxfSxcbiAgICAgIGR1cmF0aW9uOiA1MDAsXG4gICAgICBlYXNpbmc6ICdlYXNlT3V0Q3ViaWMnLFxuICAgICAgc3RhcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIH0sXG4gICAgICBzdGVwOiBmdW5jdGlvbihzdGF0ZSl7XG4gICAgICAgIHBocmFzZTEuYWxwaGEgPSBzdGF0ZS5hbHBoYTtcbiAgICAgIH0sXG4gICAgICBmaW5pc2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciB0d2VlbmFibGUgPSBuZXcgVHdlZW5hYmxlKCk7XG4gICAgdHdlZW5hYmxlLnR3ZWVuKHtcbiAgICAgIGZyb206IHthbHBoYTowfSxcbiAgICAgIHRvOiAgIHthbHBoYToxfSxcbiAgICAgIGR1cmF0aW9uOiA1MDAsXG4gICAgICBlYXNpbmc6ICdlYXNlT3V0Q3ViaWMnLFxuICAgICAgc3RhcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIH0sXG4gICAgICBzdGVwOiBmdW5jdGlvbihzdGF0ZSl7XG4gICAgICAgIHBocmFzZTIuYWxwaGEgPSBzdGF0ZS5hbHBoYTtcbiAgICAgIH0sXG4gICAgICBmaW5pc2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciB0d2VlbmFibGUgPSBuZXcgVHdlZW5hYmxlKCk7XG4gICAgdHdlZW5hYmxlLnR3ZWVuKHtcbiAgICAgIGZyb206IHthbHBoYTowfSxcbiAgICAgIHRvOiAgIHthbHBoYToxfSxcbiAgICAgIGR1cmF0aW9uOiA1MDAsXG4gICAgICBlYXNpbmc6ICdlYXNlT3V0Q3ViaWMnLFxuICAgICAgc3RhcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIH0sXG4gICAgICBzdGVwOiBmdW5jdGlvbihzdGF0ZSl7XG4gICAgICAgIHBocmFzZTMuYWxwaGEgPSBzdGF0ZS5hbHBoYTtcbiAgICAgIH0sXG4gICAgICBmaW5pc2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgc2VsZi5zdGFnZS5yZW1vdmVDaGlsZChwaHJhc2UxKTtcbiAgICAgIHNlbGYuc3RhZ2UucmVtb3ZlQ2hpbGQocGhyYXNlMik7XG4gICAgICBzZWxmLnN0YWdlLnJlbW92ZUNoaWxkKHBocmFzZTMpO1xuICAgICAgc2VsZi5nb1RvQmVnaW5uaW5nKCk7XG4gICAgfSw4MDAwKTtcblxuICAgIHNlbGYuZ2FtZVJ1bm5pbmcgPSBmYWxzZTtcbiAgfVxuXG4gIHRoaXMuc3RhcnQoKTtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gR2FtZUlucHV0KCkge1xuXHR2YXIgS2V5ID0ge1xuXHQgIF9wcmVzc2VkOiB7fSxcblxuXHQgIExFRlQ6IDM3LFxuXHQgIFVQOiAzOCxcblx0ICBSSUdIVDogMzksXG5cdCAgRE9XTjogNDAsXG5cdCAgQTo2NSxcblx0ICBEOjY4LFxuXHQgIFxuXHQgIGlzRG93bjogZnVuY3Rpb24oa2V5Q29kZSkge1xuXHQgICAgcmV0dXJuIHRoaXMuX3ByZXNzZWRba2V5Q29kZV07XG5cdCAgfSxcblx0ICBcblx0ICBvbktleWRvd246IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdCAgICB0aGlzLl9wcmVzc2VkW2V2ZW50LmtleUNvZGVdID0gdHJ1ZTtcblx0ICB9LFxuXHQgIFxuXHQgIG9uS2V5dXA6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdCAgICBkZWxldGUgdGhpcy5fcHJlc3NlZFtldmVudC5rZXlDb2RlXTtcblx0ICB9LFxuXG5cdCAgaXNFbXB0eTogZnVuY3Rpb24gKCkge1xuICAgIFx0XHRmb3IodmFyIHByb3AgaW4gdGhpcy5fcHJlc3NlZCkge1xuICAgICAgICBcdFx0aWYodGhpcy5fcHJlc3NlZC5oYXNPd25Qcm9wZXJ0eShwcm9wKSlcbiAgICAgICAgICAgXHRcdHJldHVybiBmYWxzZTtcbiAgICBcdFx0fVxuXG4gICAgXHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fTtcblxuXHR0aGlzLktleSA9IEtleTtcblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBmdW5jdGlvbihldmVudCkgeyBLZXkub25LZXl1cChldmVudCk7IH0sIGZhbHNlKTtcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbihldmVudCkgeyBLZXkub25LZXlkb3duKGV2ZW50KTsgfSwgZmFsc2UpO1xufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gR2FtZU92ZXIoZ2FtZSkge1xuXG4gIHZhciBjb250ZW50LFxuICAgIHNlbGYgPSB0aGlzLFxuICAgIGJnLFxuICAgIHRleHQsXG4gICAgY291bnQsXG4gICAgZGVhdGgsXG4gICAgYnRuO1xuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgY29udGVudCA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcbiAgICBjb250ZW50LnZpc2libGUgPSBmYWxzZTtcbiAgICBnYW1lLnN0YWdlLmFkZENoaWxkKGNvbnRlbnQpO1xuXG4gICAgYmcgPSBuZXcgUElYSS5HcmFwaGljcygpO1xuICAgIGJnLmJlZ2luRmlsbCgweDAwMDAwMCk7XG4gICAgYmcuZHJhd1JlY3QoMCwgMCwgc2NyZWVuV2lkdGgsIHNjcmVlbkhlaWdodCk7XG4gICAgYmcuZW5kRmlsbCgpO1xuICAgIGNvbnRlbnQuYWRkQ2hpbGQoYmcpO1xuXG4gICAgZGVhdGggPSBQSVhJLlNwcml0ZS5mcm9tRnJhbWUoXCJEZWF0aFNpbGh1ZXQyLnBuZ1wiKTtcbiAgICBkZWF0aC5hbmNob3IueCA9IDAuNTtcbiAgICBkZWF0aC5hbmNob3IueSA9IDAuNTtcbiAgICBkZWF0aC5zY2FsZS54ID0gMTtcbiAgICBkZWF0aC5zY2FsZS55ID0gMTtcbiAgICBjb250ZW50LmFkZENoaWxkKGRlYXRoKTtcbiAgICBkZWF0aC5wb3NpdGlvbi54ID0gc2NyZWVuV2lkdGgvMjtcbiAgICBkZWF0aC5wb3NpdGlvbi55ID0gc2NyZWVuSGVpZ2h0LzI7XG4gIH1cblxuICB0aGlzLnNob3cgPSBmdW5jdGlvbigpIHtcbiAgICBjb250ZW50LnZpc2libGUgPSB0cnVlO1xuICAgIGJnLmFscGhhID0gMDtcbiAgICBkZWF0aC52aXNpYmxlID0gZmFsc2U7XG4gICAgZGVhdGguYWxwaGEgPSAwO1xuICAgIGNvdW50ID0gMDtcbiAgfVxuXG4gIHRoaXMudXBkYXRlID0gZnVuY3Rpb24oKVxuICB7XG4gICAgaWYgKCFjb250ZW50LnZpc2libGUpIHJldHVybjtcblxuICAgIGJnLmFscGhhICs9IDAuMDE7XG4gICAgaWYgKGJnLmFscGhhID4gMSkgYmcuYWxwaGEgPSAxO1xuXG4gICAgaWYgKGJnLmFscGhhID09IDEpXG4gICAge1xuICAgICAgaWYgKGNvdW50ID09IDApIGdhbWUucmVzb3VyY2VzLnN0b3JtLnBsYXkoKTtcblxuICAgICAgaWYgKGNvdW50JTE1ID09IDAgJiYgY291bnQgPCA4MClcbiAgICAgIHtcbiAgICAgICAgZGVhdGgudmlzaWJsZSA9ICFkZWF0aC52aXNpYmxlO1xuICAgICAgfVxuXG4gICAgICBkZWF0aC5hbHBoYSA9IDE7XG5cbiAgICAgIGNvdW50Kys7XG5cbiAgICAgIGlmIChjb3VudCA+PSAxNTApIGhpZGUoKTtcbiAgICB9XG5cblxuICB9XG5cbiAgZnVuY3Rpb24gaGlkZSgpIHtcbiAgICBjb250ZW50LnZpc2libGUgPSBmYWxzZTtcblxuICAgIC8vIGdhbWUubG9hZExldmVsKDEpO1xuICAgIC8vIGdhbWUubGV2ZWwuZGlzcG9zZSgpO1xuICAgIC8vIGdhbWUubGV2ZWwuaW5kZXggPSAwO1xuICAgIC8vIGdhbWUubGV2ZWwgPSBudWxsO1xuXG4gICAgZ2FtZS5nb1RvQmVnaW5uaW5nKCk7XG4gIH1cblxuICBpbml0KCk7XG5cbn07XG4iLCJcbnZhciBQbGF0Zm9ybUJlaGF2aW9yID0gcmVxdWlyZSgnLi9iZWhhdmlvcnMvUGxhdGZvcm1CZWhhdmlvci5qcycpO1xudmFyIFN3aXRjaEJlaGF2aW9yID0gcmVxdWlyZSgnLi9iZWhhdmlvcnMvU3dpdGNoQmVoYXZpb3IuanMnKTtcbnZhciBFbmRCZWhhdmlvciA9IHJlcXVpcmUoJy4vYmVoYXZpb3JzL0VuZEJlaGF2aW9yLmpzJyk7XG52YXIgTGlnaHRCZWhhdmlvciA9IHJlcXVpcmUoJy4vYmVoYXZpb3JzL0xpZ2h0QmVoYXZpb3IuanMnKTtcbnZhciBFbmRDYXJCZWhhdmlvciA9IHJlcXVpcmUoJy4vYmVoYXZpb3JzL0VuZENhckJlaGF2aW9yLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gTGV2ZWwoZ2FtZSwgaW5kZXgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgbnVtU3dpdGNoZXMgPSAwO1xuICB2YXIgdHV0b3JpYWwgPSBudWxsO1xuICB2YXIgY291bnQgPSAwO1xuICBzZWxmLm51bVN3aXRjaGVzID0gbnVtU3dpdGNoZXM7XG4gIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgdGhpcy5zZWdtZW50cyA9IFtdO1xuICB0aGlzLmxldmVsb2JqZWN0cyA9IFtdO1xuICB0aGlzLnBsYXllclBvcyA9IHt9O1xuICB0aGlzLmNvbnRhaW5lciA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcblxuICB0aGlzLnZpZXcgPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG5cbiAgZ2FtZS5yZXNvdXJjZXMuZm9yZXN0U291bmQucGxheSgpO1xuXG4gIC8vXG4gIC8vIExldmVsIG1ldGhvZHNcbiAgLy9cblxuICB0aGlzLmRpc3Bvc2UgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxldmVsb2JqZWN0cyA9IG51bGw7XG4gICAgZ2FtZS5yZXNvdXJjZXMuZm9yZXN0U291bmQuc3RvcCgpO1xuICAgIGdhbWUuc3RhZ2UucmVtb3ZlQ2hpbGQoc2VsZi5jb250YWluZXIpO1xuICAgIGdhbWUuc3RhZ2UucmVtb3ZlQ2hpbGQoc2VsZi52aWV3KTtcbiAgfVxuXG4gIHRoaXMucGFyc2UgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgc2VsZi5iZzEgPSBQSVhJLlNwcml0ZS5mcm9tRnJhbWUoXCJiYWNrZ3JvdW5kRm9yZXN0LnBuZ1wiKTtcbiAgICBzZWxmLnZpZXcuYWRkQ2hpbGQoc2VsZi5iZzEpO1xuXG4gICAgc2VsZi5ub2lzZSA9IFBJWEkuU3ByaXRlLmZyb21GcmFtZShcIm5vaXNlLnBuZ1wiKTtcbiAgICBzZWxmLm5vaXNlLnNjYWxlLnggPSAyO1xuICAgIHNlbGYubm9pc2Uuc2NhbGUueSA9IDI7XG4gICAgc2VsZi52aWV3LmFkZENoaWxkKHNlbGYubm9pc2UpO1xuXG4gICAgc2VsZi5vdmVybGF5ID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcbiAgICBzZWxmLm92ZXJsYXkuYmVnaW5GaWxsKDB4MDBmZmZhKTtcbiAgICBzZWxmLm92ZXJsYXkuZHJhd1JlY3QoMCwgMCwgc2NyZWVuV2lkdGgsIHNjcmVlbkhlaWdodCk7XG4gICAgc2VsZi5vdmVybGF5LmVuZEZpbGwoKTtcbiAgICBzZWxmLm92ZXJsYXkuYWxwaGEgPSAwLjM7XG4gICAgc2VsZi52aWV3LmFkZENoaWxkKHNlbGYub3ZlcmxheSk7XG5cblxuICAgIHNlbGYuYmcyID0gUElYSS5TcHJpdGUuZnJvbUZyYW1lKFwiYmFja2dyb3VuZEZvcmVzdC5wbmdcIik7XG4gICAgc2VsZi52aWV3LmFkZENoaWxkKHNlbGYuYmcyKTtcblxuICAgIGlmIChpbmRleCA9PSAxKVxuICAgIHtcbiAgICAgIHR1dG9yaWFsID0gUElYSS5TcHJpdGUuZnJvbUZyYW1lKFwiY29udHJvbHMucG5nXCIpO1xuICAgICAgdHV0b3JpYWwuYW5jaG9yLnggPSAwLjU7XG4gICAgICB0dXRvcmlhbC5hbmNob3IueSA9IDAuNTtcbiAgICAgIHNlbGYudmlldy5hZGRDaGlsZCh0dXRvcmlhbCk7XG4gICAgICB0dXRvcmlhbC5wb3NpdGlvbi54ID0gc2NyZWVuV2lkdGgvMjtcbiAgICAgIHR1dG9yaWFsLnBvc2l0aW9uLnkgPSBzY3JlZW5IZWlnaHQvMjtcbiAgICB9XG5cbiAgICBzZWxmLnNjZW5hcmlvID0gbmV3IFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lcigpO1xuICAgIHNlbGYudmlldy5hZGRDaGlsZChzZWxmLnNjZW5hcmlvKTtcblxuICAgIHNlbGYuZm9yZWdyb3VuZCA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcbiAgICBzZWxmLnZpZXcuYWRkQ2hpbGQoc2VsZi5mb3JlZ3JvdW5kKTtcblxuICAgIGZvciAoaW5kZXggPSAwOyBpbmRleCA8IGRhdGEubGF5ZXJzWzBdLm9iamVjdHMubGVuZ3RoOyArK2luZGV4KSB7XG5cbiAgICAgIC8vLy9zZWFyY2ggZm9yIHBsYXllciBzdGFydCBwb2ludFxuICAgICAgaWYoZGF0YS5sYXllcnNbMF0ub2JqZWN0c1tpbmRleF0udHlwZSA9PSBcInN0YXJ0XCIpXG4gICAgICB7XG4gICAgICAgIHNlbGYucGxheWVyUG9zID0ge3g6ZGF0YS5sYXllcnNbMF0ub2JqZWN0c1tpbmRleF0ueCwgeTpkYXRhLmxheWVyc1swXS5vYmplY3RzW2luZGV4XS55fTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmKGRhdGEubGF5ZXJzWzBdLm9iamVjdHNbaW5kZXhdLnR5cGUgPT0gXCJTd2l0Y2hCZWhhdmlvclwiKVxuICAgICAgICBzZWxmLm51bVN3aXRjaGVzICsrO1xuXG4gICAgICAvLy8vc2V0dXAgYmVoYXZpb3JcbiAgICAgIHZhciBCZWhhdmlvdXJDbGFzcyA9IHJlcXVpcmUoXCIuL2JlaGF2aW9ycy9cIiArIGRhdGEubGF5ZXJzWzBdLm9iamVjdHNbaW5kZXhdLnR5cGUgKyBcIi5qc1wiKTtcblxuICAgICAgdmFyIGMgPSBCZWhhdmlvdXJDbGFzcyA9PSBMaWdodEJlaGF2aW9yID8gc2VsZi5mb3JlZ3JvdW5kIDogc2VsZi5zY2VuYXJpbztcblxuICAgICAgdmFyIGJlaGF2aW9yID0gbmV3IEJlaGF2aW91ckNsYXNzKGMsIGRhdGEubGF5ZXJzWzBdLm9iamVjdHNbaW5kZXhdKTtcbiAgICAgIHNlbGYubGV2ZWxvYmplY3RzLnB1c2goYmVoYXZpb3IpO1xuXG4gICAgICBpZihkYXRhLmxheWVyc1swXS5vYmplY3RzW2luZGV4XS50eXBlID09IFwiTGlnaHRCZWhhdmlvclwiKSB7XG4gICAgICAgIGxpZ2h0LmJlaGF2aW9yID0gYmVoYXZpb3I7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLy8vY3JlYXRlIHNoYWRvd1xuICAgICAgaWYoIWRhdGEubGF5ZXJzWzBdLm9iamVjdHNbaW5kZXhdLnByb3BlcnRpZXMuc2hhZG93KSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLy8vL3JldHJpdmUgcG9zaXRpb24gYW5kIHNpemUgc3BlY3NcbiAgICAgIHZhciBzaXplWCA9IGRhdGEubGF5ZXJzWzBdLm9iamVjdHNbaW5kZXhdLndpZHRoO1xuICAgICAgdmFyIHNpemVZID0gZGF0YS5sYXllcnNbMF0ub2JqZWN0c1tpbmRleF0uaGVpZ2h0O1xuICAgICAgdmFyIG9yaWdpblggPSBkYXRhLmxheWVyc1swXS5vYmplY3RzW2luZGV4XS54O1xuICAgICAgdmFyIG9yaWdpblkgPSBkYXRhLmxheWVyc1swXS5vYmplY3RzW2luZGV4XS55O1xuXG4gICAgICB2YXIgc2VnbWVudEEgPSB7dGFyZ2V0OmJlaGF2aW9yLnZpZXcsYTp7eDpvcmlnaW5YLHk6b3JpZ2luWX0sIGI6e3g6b3JpZ2luWCArIHNpemVYLHk6b3JpZ2luWX19O1xuICAgICAgdmFyIHNlZ21lbnRCID0ge3RhcmdldDpiZWhhdmlvci52aWV3LGE6e3g6b3JpZ2luWCtzaXplWCx5Om9yaWdpbll9LCBiOnt4Om9yaWdpblggKyBzaXplWCx5Om9yaWdpblkrc2l6ZVl9fTtcbiAgICAgIHZhciBzZWdtZW50QyA9IHt0YXJnZXQ6YmVoYXZpb3IudmlldyxhOnt4Om9yaWdpblgrc2l6ZVgseTpvcmlnaW5ZK3NpemVZfSwgYjp7eDpvcmlnaW5YLHk6b3JpZ2luWSArIHNpemVZfX07XG4gICAgICB2YXIgc2VnbWVudEQgPSB7dGFyZ2V0OmJlaGF2aW9yLnZpZXcsYTp7eDpvcmlnaW5YLHk6b3JpZ2luWSArIHNpemVZfSwgYjp7eDpvcmlnaW5YLHk6b3JpZ2luWX19O1xuXG4gICAgICB0aGlzLnNlZ21lbnRzLnB1c2goc2VnbWVudEEpO1xuICAgICAgdGhpcy5zZWdtZW50cy5wdXNoKHNlZ21lbnRCKTtcbiAgICAgIHRoaXMuc2VnbWVudHMucHVzaChzZWdtZW50Qyk7XG4gICAgICB0aGlzLnNlZ21lbnRzLnB1c2goc2VnbWVudEQpO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKFwidG90YWwgc3dpdGNoZXMgaW4gbGV2ZWw6IFwiICsgc2VsZi5udW1Td2l0Y2hlcyk7XG4gIH1cblxuXG4gIHRoaXMudXBkYXRlID0gZnVuY3Rpb24oZ2FtZSlcbiAge1xuICAgIC8vIFdIWSBHT0Q/IT8hPyEhXG4gICAgdHJ5IHtcbiAgICAgIHNlbGYubm9pc2UuYWxwaGEgPSAwLjE7XG4gICAgICBzZWxmLm5vaXNlLnBvc2l0aW9uLnggPSBNYXRoLnJhbmRvbSgpKjkwMCAtIDkwMDtcbiAgICAgIHNlbGYubm9pc2UucG9zaXRpb24ueSA9IE1hdGgucmFuZG9tKCkqNjAwIC0gNjAwO1xuXG4gICAgICBpZiAodHV0b3JpYWwgIT0gbnVsbClcbiAgICAgICAge1xuICAgICAgICAgIHR1dG9yaWFsLmFscGhhID0gMC43NSArIE1hdGguc2luKGNvdW50KSowLjI1O1xuICAgICAgICAgIGNvdW50ICs9IDAuMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZWxmLmxldmVsb2JqZWN0cykge1xuICAgICAgICAgIGZvciAoaW5kZXggPSAwOyBpbmRleCA8IHNlbGYubGV2ZWxvYmplY3RzLmxlbmd0aDsgKytpbmRleCkge1xuICAgICAgICAgICAgc2VsZi5sZXZlbG9iamVjdHNbaW5kZXhdLnVwZGF0ZShnYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgfVxuICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBMaWdodCh4LCB5KSB7XG4gIHRoaXMucG9zaXRpb24gPSB7eDogeCwgeTogeX07XG5cbiAgdGhpcy5zZWdtZW50cyA9IFtdO1xuICB0aGlzLmZ1enp5UmFkaXVzID0gMTA7XG5cbiAgdGhpcy5zZXRTZWdtZW50cyA9IGZ1bmN0aW9uKHNlZ21lbnRzKSB7XG4gICAgdGhpcy5zZWdtZW50cyA9IHNlZ21lbnRzO1xuICB9O1xuXG4gIHRoaXMuZ2V0U2lnaHRQb2x5Z29ucyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwb2x5Z29ucyA9IFsgbGlnaHQuZ2V0U2lnaHRQb2x5Z29uKHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55KSBdO1xuXG4gICAgZm9yKHZhciBhbmdsZT0wO2FuZ2xlPE1hdGguUEkqMjthbmdsZSs9KE1hdGguUEkqMikvMTApe1xuICAgICAgdmFyIGR4ID0gTWF0aC5jb3MoYW5nbGUpKnRoaXMuZnV6enlSYWRpdXM7XG4gICAgICB2YXIgZHkgPSBNYXRoLnNpbihhbmdsZSkqdGhpcy5mdXp6eVJhZGl1cztcbiAgICAgIHBvbHlnb25zLnB1c2godGhpcy5nZXRTaWdodFBvbHlnb24odGhpcy5wb3NpdGlvbi54K2R4LHRoaXMucG9zaXRpb24ueStkeSkpO1xuICAgIH07XG5cbiAgICByZXR1cm4gcG9seWdvbnM7XG4gIH07XG5cbiAgdGhpcy5nZXRQb2x5Z29uR3JhcGhpY3MgPSBmdW5jdGlvbihwb2x5Z29uLCBmaWxsU3R5bGUpIHtcbiAgICB2YXIgZyA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG4gICAgZy5iZWdpbkZpbGwoMHgwMDApO1xuICAgIGcubW92ZVRvKHBvbHlnb25bMF0ueCwgcG9seWdvblswXS55KTtcbiAgICBmb3IodmFyIGk9MTtpPHBvbHlnb24ubGVuZ3RoO2krKyl7XG4gICAgICB2YXIgaW50ZXJzZWN0ID0gcG9seWdvbltpXTtcbiAgICAgIGcubGluZVRvKGludGVyc2VjdC54LCBpbnRlcnNlY3QueSk7XG4gICAgfVxuICAgIGcuZW5kRmlsbCgpO1xuICAgIHJldHVybiBnO1xuICB9O1xuXG4gIHRoaXMuZ2V0SW50ZXJzZWN0aW9uID0gZnVuY3Rpb24ocmF5LCBzZWdtZW50KSB7XG4gICAgLy8gUkFZIGluIHBhcmFtZXRyaWM6IFBvaW50ICsgRGVsdGEqVDFcbiAgICB2YXIgcl9weCA9IHJheS5hLng7XG4gICAgdmFyIHJfcHkgPSByYXkuYS55O1xuICAgIHZhciByX2R4ID0gcmF5LmIueC1yYXkuYS54O1xuICAgIHZhciByX2R5ID0gcmF5LmIueS1yYXkuYS55O1xuXG4gICAgLy8gU0VHTUVOVCBpbiBwYXJhbWV0cmljOiBQb2ludCArIERlbHRhKlQyXG4gICAgdmFyIHNfcHggPSBzZWdtZW50LmEueDtcbiAgICB2YXIgc19weSA9IHNlZ21lbnQuYS55O1xuICAgIHZhciBzX2R4ID0gc2VnbWVudC5iLngtc2VnbWVudC5hLng7XG4gICAgdmFyIHNfZHkgPSBzZWdtZW50LmIueS1zZWdtZW50LmEueTtcblxuICAgIC8vIEFyZSB0aGV5IHBhcmFsbGVsPyBJZiBzbywgbm8gaW50ZXJzZWN0XG4gICAgdmFyIHJfbWFnID0gTWF0aC5zcXJ0KHJfZHgqcl9keCtyX2R5KnJfZHkpO1xuICAgIHZhciBzX21hZyA9IE1hdGguc3FydChzX2R4KnNfZHgrc19keSpzX2R5KTtcbiAgICBpZihyX2R4L3JfbWFnPT1zX2R4L3NfbWFnICYmIHJfZHkvcl9tYWc9PXNfZHkvc19tYWcpe1xuICAgICAgLy8gVW5pdCB2ZWN0b3JzIGFyZSB0aGUgc2FtZS5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIFNPTFZFIEZPUiBUMSAmIFQyXG4gICAgLy8gcl9weCtyX2R4KlQxID0gc19weCtzX2R4KlQyICYmIHJfcHkrcl9keSpUMSA9IHNfcHkrc19keSpUMlxuICAgIC8vID09PiBUMSA9IChzX3B4K3NfZHgqVDItcl9weCkvcl9keCA9IChzX3B5K3NfZHkqVDItcl9weSkvcl9keVxuICAgIC8vID09PiBzX3B4KnJfZHkgKyBzX2R4KlQyKnJfZHkgLSByX3B4KnJfZHkgPSBzX3B5KnJfZHggKyBzX2R5KlQyKnJfZHggLSByX3B5KnJfZHhcbiAgICAvLyA9PT4gVDIgPSAocl9keCooc19weS1yX3B5KSArIHJfZHkqKHJfcHgtc19weCkpLyhzX2R4KnJfZHkgLSBzX2R5KnJfZHgpXG4gICAgdmFyIFQyID0gKHJfZHgqKHNfcHktcl9weSkgKyByX2R5KihyX3B4LXNfcHgpKS8oc19keCpyX2R5IC0gc19keSpyX2R4KTtcbiAgICB2YXIgVDEgPSAoc19weCtzX2R4KlQyLXJfcHgpL3JfZHg7XG5cbiAgICAvLyBNdXN0IGJlIHdpdGhpbiBwYXJhbWV0aWMgd2hhdGV2ZXJzIGZvciBSQVkvU0VHTUVOVFxuICAgIGlmKFQxPDApIHJldHVybiBudWxsO1xuICAgIGlmKFQyPDAgfHwgVDI+MSkgcmV0dXJuIG51bGw7XG5cbiAgICAvLyBSZXR1cm4gdGhlIFBPSU5UIE9GIElOVEVSU0VDVElPTlxuICAgIHJldHVybiB7XG4gICAgICB4OiByX3B4K3JfZHgqVDEsXG4gICAgICB5OiByX3B5K3JfZHkqVDEsXG4gICAgICBwYXJhbTogVDFcbiAgICB9O1xuICB9O1xuXG4gIHRoaXMuZ2V0U2lnaHRQb2x5Z29uID0gZnVuY3Rpb24oc2lnaHRYLCBzaWdodFkpIHtcbiAgICAvLyBHZXQgYWxsIHVuaXF1ZSBwb2ludHNcbiAgICB2YXIgcG9pbnRzID0gKGZ1bmN0aW9uKHNlZ21lbnRzKXtcbiAgICAgIHZhciBhID0gW107XG4gICAgICBzZWdtZW50cy5mb3JFYWNoKGZ1bmN0aW9uKHNlZyl7XG4gICAgICAgIGEucHVzaChzZWcuYSxzZWcuYik7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBhO1xuICAgIH0pKHRoaXMuc2VnbWVudHMpO1xuXG4gICAgdmFyIHVuaXF1ZVBvaW50cyA9IChmdW5jdGlvbihwb2ludHMpe1xuICAgICAgdmFyIHNldCA9IHt9O1xuICAgICAgcmV0dXJuIHBvaW50cy5maWx0ZXIoZnVuY3Rpb24ocCl7XG4gICAgICAgIHZhciBrZXkgPSBwLngrXCIsXCIrcC55O1xuICAgICAgICBpZihrZXkgaW4gc2V0KXtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIHNldFtrZXldPXRydWU7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pKHBvaW50cyk7XG5cbiAgICAvLyBHZXQgYWxsIGFuZ2xlc1xuICAgIHZhciB1bmlxdWVBbmdsZXMgPSBbXTtcbiAgICBmb3IodmFyIGo9MDtqPHVuaXF1ZVBvaW50cy5sZW5ndGg7aisrKXtcbiAgICAgIHZhciB1bmlxdWVQb2ludCA9IHVuaXF1ZVBvaW50c1tqXTtcbiAgICAgIHZhciBhbmdsZSA9IE1hdGguYXRhbjIodW5pcXVlUG9pbnQueS1zaWdodFksdW5pcXVlUG9pbnQueC1zaWdodFgpO1xuICAgICAgdW5pcXVlUG9pbnQuYW5nbGUgPSBhbmdsZTtcbiAgICAgIHVuaXF1ZUFuZ2xlcy5wdXNoKGFuZ2xlLTAuMDAwMDEsYW5nbGUsYW5nbGUrMC4wMDAwMSk7XG4gICAgfVxuXG4gICAgLy8gUkFZUyBJTiBBTEwgRElSRUNUSU9OU1xuICAgIHZhciBpbnRlcnNlY3RzID0gW107XG4gICAgZm9yKHZhciBqPTA7ajx1bmlxdWVBbmdsZXMubGVuZ3RoO2orKyl7XG4gICAgICB2YXIgYW5nbGUgPSB1bmlxdWVBbmdsZXNbal07XG5cbiAgICAgIC8vIENhbGN1bGF0ZSBkeCAmIGR5IGZyb20gYW5nbGVcbiAgICAgIHZhciBkeCA9IE1hdGguY29zKGFuZ2xlKTtcbiAgICAgIHZhciBkeSA9IE1hdGguc2luKGFuZ2xlKTtcblxuICAgICAgLy8gUmF5IGZyb20gY2VudGVyIG9mIHNjcmVlbiB0byBtb3VzZVxuICAgICAgdmFyIHJheSA9IHtcbiAgICAgICAgYTp7eDpzaWdodFgseTpzaWdodFl9LFxuICAgICAgICBiOnt4OnNpZ2h0WCtkeCx5OnNpZ2h0WStkeX1cbiAgICAgIH07XG5cbiAgICAgIC8vIEZpbmQgQ0xPU0VTVCBpbnRlcnNlY3Rpb25cbiAgICAgIHZhciBjbG9zZXN0SW50ZXJzZWN0ID0gbnVsbDtcbiAgICAgIGZvcih2YXIgaT0wO2k8dGhpcy5zZWdtZW50cy5sZW5ndGg7aSsrKXtcbiAgICAgICAgdmFyIGludGVyc2VjdCA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uKHJheSx0aGlzLnNlZ21lbnRzW2ldKTtcbiAgICAgICAgaWYoIWludGVyc2VjdCkgY29udGludWU7XG4gICAgICAgIGlmKCFjbG9zZXN0SW50ZXJzZWN0IHx8IGludGVyc2VjdC5wYXJhbTxjbG9zZXN0SW50ZXJzZWN0LnBhcmFtKXtcbiAgICAgICAgICBjbG9zZXN0SW50ZXJzZWN0PWludGVyc2VjdDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBJbnRlcnNlY3QgYW5nbGVcbiAgICAgIGlmKCFjbG9zZXN0SW50ZXJzZWN0KSBjb250aW51ZTtcbiAgICAgIGNsb3Nlc3RJbnRlcnNlY3QuYW5nbGUgPSBhbmdsZTtcblxuICAgICAgLy8gQWRkIHRvIGxpc3Qgb2YgaW50ZXJzZWN0c1xuICAgICAgaW50ZXJzZWN0cy5wdXNoKGNsb3Nlc3RJbnRlcnNlY3QpO1xuICAgIH1cblxuICAgIC8vIFNvcnQgaW50ZXJzZWN0cyBieSBhbmdsZVxuICAgIGludGVyc2VjdHMgPSBpbnRlcnNlY3RzLnNvcnQoZnVuY3Rpb24oYSxiKXtcbiAgICAgIHJldHVybiBhLmFuZ2xlLWIuYW5nbGU7XG4gICAgfSk7XG5cbiAgICAvLyBQb2x5Z29uIGlzIGludGVyc2VjdHMsIGluIG9yZGVyIG9mIGFuZ2xlXG4gICAgcmV0dXJuIGludGVyc2VjdHM7XG4gIH1cblxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBQaHlzaWNzKClcbntcblx0dmFyIHNlbGYgPSB0aGlzO1xuXHR2YXIgcGxheWVyUG9zaXRpb24gPSB7eDowLCB5OjB9O1xuXHR2YXIgcGxheWVyVmVsb2NpdHkgPSB7eDowLCB5OjB9O1xuXHR2YXIgYXhpcyA9IHt4OjAsIHk6MH07XG5cblx0dGhpcy5wcm9jZXNzID0gcHJvY2Vzcztcblx0dGhpcy5wbGF5ZXJQb3NpdGlvbiA9IHBsYXllclBvc2l0aW9uO1xuXHR0aGlzLnBsYXllclZlbG9jaXR5ID0gcGxheWVyVmVsb2NpdHk7XG5cblx0ZnVuY3Rpb24gcHJvY2VzcyhnYW1lLCBkaXJlY3Rpb24sIHZlcnRpY2VzKVxuXHR7XG5cdFx0YXhpcy54ID0gZGlyZWN0aW9uO1xuXG5cdFx0Ly8gdmFyIHZlcnRpY2VzID0gcG9seWdvbnNbMF07XG5cdFx0dmFyIHdhbGtpbmcgPSBheGlzLnggIT0gMDtcblx0XHR2YXIgb2Zmc2V0WCA9IDIwO1xuXHRcdHZhciBvZmZzZXRZID0gMjA7XG5cdFx0dmFyIHZlbFggPSB3YWxraW5nID8gNCA6IDA7XG5cdFx0dmFyIHZlbFkgPSA2O1xuXG5cdFx0Ly8gdmFyIGxpbmVIQSA9IHt4OnBsYXllclBvc2l0aW9uLnggLSAxMDAwLCB5OnBsYXllclBvc2l0aW9uLnl9O1xuXHRcdC8vIHZhciBsaW5lSEIgPSB7eDpwbGF5ZXJQb3NpdGlvbi54ICsgMTAwMCwgeTpwbGF5ZXJQb3NpdGlvbi55fTtcblx0XHQvLyB2YXIgbGluZVZBID0ge3g6cGxheWVyUG9zaXRpb24ueCwgeTpwbGF5ZXJQb3NpdGlvbi55IC0gMTAwMH07XG5cdFx0Ly8gdmFyIGxpbmVWQiA9IHt4OnBsYXllclBvc2l0aW9uLngsIHk6cGxheWVyUG9zaXRpb24ueSArIDEwMDB9O1xuXHRcdC8vIHZhciByZXN1bHRIID0gcmF5Y2FzdChsaW5lSEEsIGxpbmVIQiwgdmVydGljZXMpO1xuXHRcdC8vIHZhciByZXN1bHRWID0gcmF5Y2FzdChsaW5lVkEsIGxpbmVWQiwgdmVydGljZXMpO1xuXHRcdC8vIHZhciBuZWFyZXN0ID0gZ2V0TmVhcmVzdEZhY2VzKHBsYXllclBvc2l0aW9uLCByZXN1bHRILmNvbmNhdChyZXN1bHRWKSk7XG5cdFx0Ly8gdmFyIGlzSW5zaWRlID0gcG9pbnRJblBvbHlnb24ocGxheWVyUG9zaXRpb24sIHZlcnRpY2VzKTtcblxuXHRcdC8vIGlmIChheGlzLnggPCAwICYmIG5lYXJlc3QubGQgLSBvZmZzZXRYIDwgdmVsWClcblx0XHQvLyB7XG5cdFx0Ly8gXHR2ZWxYID0gbmVhcmVzdC5sZCAtIG9mZnNldFg7XG5cdFx0Ly8gfVxuXG5cdFx0Ly8gaWYgKGF4aXMueCA+IDAgJiYgbmVhcmVzdC5yZCAtIG9mZnNldFggPCB2ZWxYKVxuXHRcdC8vIHtcblx0XHQvLyBcdHZlbFggPSBuZWFyZXN0LnJkIC0gb2Zmc2V0WDtcblx0XHQvLyB9XG5cblx0XHQvLyBpZiAoYXhpcy55IDwgMCAmJiBuZWFyZXN0LnRkIC0gb2Zmc2V0WSA8IHZlbFkpXG5cdFx0Ly8ge1xuXHRcdC8vIFx0dmVsWSA9IG5lYXJlc3QudGQgLSBvZmZzZXRZO1xuXHRcdC8vIH1cblxuXHRcdC8vIGlmIChheGlzLnkgPiAwICYmIG5lYXJlc3QuYmQgLSBvZmZzZXRZIDwgdmVsWSlcblx0XHQvLyB7XG5cdFx0Ly8gXHR2ZWxZID0gbmVhcmVzdC5iZCAtIG9mZnNldFk7XG5cdFx0Ly8gfVxuXG5cblx0XHR2YXIgcHJldlggPSBwbGF5ZXJQb3NpdGlvbi54O1xuXHRcdHBsYXllclBvc2l0aW9uLnggKz0gYXhpcy54KnZlbFg7XG5cblx0XHR2YXIgbGluZUhBID0ge3g6cGxheWVyUG9zaXRpb24ueCAtIDEwMDAsIHk6cGxheWVyUG9zaXRpb24ueX07XG5cdFx0dmFyIGxpbmVIQiA9IHt4OnBsYXllclBvc2l0aW9uLnggKyAxMDAwLCB5OnBsYXllclBvc2l0aW9uLnl9O1xuXHRcdHZhciByZXN1bHRIID0gcmF5Y2FzdChsaW5lSEEsIGxpbmVIQiwgdmVydGljZXMpO1xuXHRcdHZhciBuZWFyZXN0ID0gZ2V0TmVhcmVzdEZhY2VzKHBsYXllclBvc2l0aW9uLCByZXN1bHRIKTtcblx0XHR2YXIgaXNJbnNpZGUgPSBwb2ludEluUG9seWdvbihwbGF5ZXJQb3NpdGlvbiwgdmVydGljZXMpO1xuXG5cdFx0aWYgKGlzSW5zaWRlKVxuXHRcdHtcblx0XHRcdGlmIChuZWFyZXN0LmwpXG5cdFx0XHR7XG5cdFx0XHRcdGlmIChwbGF5ZXJQb3NpdGlvbi54IDwgbmVhcmVzdC5sLnBvaW50LnggKyBvZmZzZXRYKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cGxheWVyUG9zaXRpb24ueCA9IG5lYXJlc3QubC5wb2ludC54ICsgb2Zmc2V0WDtcblx0XHRcdFx0XHRwbGF5ZXJWZWxvY2l0eS54ID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRwbGF5ZXJWZWxvY2l0eS54ID0gcGxheWVyUG9zaXRpb24ueCAtIHByZXZYO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gY3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0XHQvLyBjdHgubW92ZVRvKHBsYXllclBvc2l0aW9uLngsIHBsYXllclBvc2l0aW9uLnkpO1xuXHRcdFx0XHQvLyBjdHgubGluZVRvKG5lYXJlc3QubC5wb2ludC54LCBwbGF5ZXJQb3NpdGlvbi55KVxuXHRcdFx0XHQvLyBjdHguc3Ryb2tlU3R5bGUgPSBcIiNGRjAwMDBcIjtcblx0XHRcdFx0Ly8gY3R4LnN0cm9rZSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKG5lYXJlc3Qucilcblx0XHRcdHtcblx0XHRcdFx0aWYgKHBsYXllclBvc2l0aW9uLnggPiBuZWFyZXN0LnIucG9pbnQueCAtIG9mZnNldFgpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRwbGF5ZXJQb3NpdGlvbi54ID0gbmVhcmVzdC5yLnBvaW50LnggLSBvZmZzZXRYO1xuXHRcdFx0XHRcdHBsYXllclZlbG9jaXR5LnggPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHBsYXllclZlbG9jaXR5LnggPSBwbGF5ZXJQb3NpdGlvbi54IC0gcHJldlg7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRcdC8vIGN0eC5tb3ZlVG8ocGxheWVyUG9zaXRpb24ueCwgcGxheWVyUG9zaXRpb24ueSk7XG5cdFx0XHRcdC8vIGN0eC5saW5lVG8obmVhcmVzdC5yLnBvaW50LngsIHBsYXllclBvc2l0aW9uLnkpO1xuXHRcdFx0XHQvLyBjdHguc3Ryb2tlU3R5bGUgPSBcIiNGRjAwMDBcIjtcblx0XHRcdFx0Ly8gY3R4LnN0cm9rZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0cGxheWVyUG9zaXRpb24ueCA9IHByZXZYO1xuXG5cdFx0fVxuXG5cblx0XHR2YXIgcHJldlkgPSBwbGF5ZXJQb3NpdGlvbi55O1xuXG4gICAgLy8gZ3Jhdml0eVxuXHRcdHBsYXllclBvc2l0aW9uLnkgKz0gMjtcblxuXHRcdHZhciBsaW5lVkEgPSB7eDpwbGF5ZXJQb3NpdGlvbi54LCB5OnBsYXllclBvc2l0aW9uLnkgLSAxMDAwfTtcblx0XHR2YXIgbGluZVZCID0ge3g6cGxheWVyUG9zaXRpb24ueCwgeTpwbGF5ZXJQb3NpdGlvbi55ICsgMTAwMH07XG5cdFx0dmFyIHJlc3VsdFYgPSByYXljYXN0KGxpbmVWQSwgbGluZVZCLCB2ZXJ0aWNlcyk7XG5cdFx0dmFyIG5lYXJlc3QgPSBnZXROZWFyZXN0RmFjZXMocGxheWVyUG9zaXRpb24sIHJlc3VsdFYpO1xuXHRcdHZhciBpc0luc2lkZSA9IHBvaW50SW5Qb2x5Z29uKHBsYXllclBvc2l0aW9uLCB2ZXJ0aWNlcyk7XG5cblxuXHRcdGlmIChpc0luc2lkZSlcblx0XHR7XG5cdFx0XHRpZiAobmVhcmVzdC50KVxuXHRcdFx0e1xuXHRcdFx0XHRpZiAocGxheWVyUG9zaXRpb24ueSA8IG5lYXJlc3QudC5wb2ludC55ICsgb2Zmc2V0WSkgcGxheWVyUG9zaXRpb24ueSA9IG5lYXJlc3QudC5wb2ludC55ICsgb2Zmc2V0WTtcblxuXHRcdFx0XHQvLyBjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRcdC8vIGN0eC5tb3ZlVG8ocGxheWVyUG9zaXRpb24ueCwgcGxheWVyUG9zaXRpb24ueSk7XG5cdFx0XHRcdC8vIGN0eC5saW5lVG8ocGxheWVyUG9zaXRpb24ueCwgbmVhcmVzdC50LnBvaW50LnkpO1xuXHRcdFx0XHQvLyBjdHguc3Ryb2tlU3R5bGUgPSBcIiNGRjAwMDBcIjtcblx0XHRcdFx0Ly8gY3R4LnN0cm9rZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAobmVhcmVzdC5iKVxuXHRcdFx0e1xuXHRcdFx0XHRpZiAocGxheWVyUG9zaXRpb24ueSA+IG5lYXJlc3QuYi5wb2ludC55IC0gb2Zmc2V0WSkgcGxheWVyUG9zaXRpb24ueSA9IG5lYXJlc3QuYi5wb2ludC55IC0gb2Zmc2V0WTtcblxuXHRcdFx0XHQvLyBjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRcdC8vIGN0eC5tb3ZlVG8ocGxheWVyUG9zaXRpb24ueCwgcGxheWVyUG9zaXRpb24ueSk7XG5cdFx0XHRcdC8vIGN0eC5saW5lVG8ocGxheWVyUG9zaXRpb24ueCwgbmVhcmVzdC5iLnBvaW50LnkpO1xuXHRcdFx0XHQvLyBjdHguc3Ryb2tlU3R5bGUgPSBcIiNGRjAwMDBcIjtcblx0XHRcdFx0Ly8gY3R4LnN0cm9rZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0cGxheWVyUG9zaXRpb24ueSA9IHByZXZZO1xuXHRcdH1cblxuXG5cdFx0cGxheWVyVmVsb2NpdHkueSA9IHBsYXllclBvc2l0aW9uLnkgLSBwcmV2WTtcblxuXHRcdGlmIChwbGF5ZXJQb3NpdGlvbi55IDwgMjApIHtcblx0XHRcdHBsYXllclBvc2l0aW9uLnkgPSAyMDtcblx0XHRcdHBsYXllclZlbG9jaXR5LnkgPSAwO1xuXHRcdH1cblxuXHRcdGlmIChwbGF5ZXJQb3NpdGlvbi54IDwgMjApIHtcblx0XHRcdHBsYXllclBvc2l0aW9uLnggPSAyMDtcblx0XHRcdHBsYXllclZlbG9jaXR5LnggPSAwO1xuXHRcdH0gZWxzZSBpZiAocGxheWVyUG9zaXRpb24ueCA+IChnYW1lLnJlbmRlcmVyLndpZHRoIC0gMjApKSB7XG5cdFx0XHRwbGF5ZXJQb3NpdGlvbi54ID0gKGdhbWUucmVuZGVyZXIud2lkdGggLSAyMCk7XG5cdFx0XHRwbGF5ZXJWZWxvY2l0eS54ID0gMDtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBnZXROZWFyZXN0RmFjZXMocG9zLCBmYWNlcylcblx0e1xuXHRcdHZhciByZXN1bHQgPSB7bDpudWxsLCByOm51bGwsIHQ6bnVsbCwgYjpudWxsLCBkbDoxMDAwMDAsIGRyOjEwMDAwMCwgZHQ6MTAwMDAwLCBkYjoxMDAwMDB9O1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBmYWNlcy5sZW5ndGg7IGkrKylcblx0XHR7XG5cdFx0XHR2YXIgciA9IGZhY2VzW2ldO1xuXG5cdFx0XHRpZiAoci5wb2ludC5vbkxpbmUxICYmIHIucG9pbnQub25MaW5lMilcblx0XHRcdHtcblx0XHRcdFx0dmFyIGQgPSBsaW5lRGlzdGFuY2UocG9zLCByLnBvaW50KTtcblxuXHRcdFx0XHRpZiAoci5wb2ludC54IDwgcG9zLngpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZiAoZCA8IHJlc3VsdC5kbClcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRyZXN1bHQuZGwgPSBkO1xuXHRcdFx0XHRcdFx0cmVzdWx0LmwgPSByO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChyLnBvaW50LnggPiBwb3MueClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGlmIChkIDwgcmVzdWx0LmRyKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHJlc3VsdC5kciA9IGQ7XG5cdFx0XHRcdFx0XHRyZXN1bHQuciA9IHI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHIucG9pbnQueSA8IHBvcy55KVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aWYgKGQgPCByZXN1bHQuZHQpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0cmVzdWx0LmR0ID0gZDtcblx0XHRcdFx0XHRcdHJlc3VsdC50ID0gcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoci5wb2ludC55ID4gcG9zLnkpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZiAoZCA8IHJlc3VsdC5kYilcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRyZXN1bHQuZGIgPSBkO1xuXHRcdFx0XHRcdFx0cmVzdWx0LmIgPSByO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cblxuXHRmdW5jdGlvbiByYXljYXN0KHN0YXJ0UG9pbnQsIGVuZFBvaW50LCB2ZXJ0aWNlcylcblx0e1xuXHRcdHZhciBsZW4gPSB2ZXJ0aWNlcy5sZW5ndGg7XG5cdFx0dmFyIHJlc3VsdCA9IFtdO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKylcblx0XHR7XG5cdFx0XHR2YXIgYSA9IHZlcnRpY2VzW2ldO1xuXHRcdFx0dmFyIGIgPSBpID49IChsZW4gLSAxKSA/IHZlcnRpY2VzWzBdIDogdmVydGljZXNbaSsxXTtcblx0XHRcdHZhciByID0gY2hlY2tMaW5lSW50ZXJzZWN0aW9uKHN0YXJ0UG9pbnQueCwgc3RhcnRQb2ludC55LCBlbmRQb2ludC54LCBlbmRQb2ludC55LCBhLngsIGEueSwgYi54LCBiLnkpO1xuXHRcdFx0aWYgKHIub25MaW5lMSAmJiByLm9uTGluZTIpXG5cdFx0XHR7XG5cdFx0XHRcdHZhciBmYWNlID0ge2E6YSwgYjpiLCBwb2ludDpyfTtcblx0XHRcdFx0cmVzdWx0LnB1c2goZmFjZSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXG5cdGZ1bmN0aW9uIGxpbmVEaXN0YW5jZShwb2ludDEsIHBvaW50Milcblx0e1xuXHRcdHZhciB4cyA9IDA7XG5cdFx0dmFyIHlzID0gMDtcblxuXHRcdHhzID0gcG9pbnQyLnggLSBwb2ludDEueDtcblx0XHR4cyA9IHhzICogeHM7XG5cblx0XHR5cyA9IHBvaW50Mi55IC0gcG9pbnQxLnk7XG5cdFx0eXMgPSB5cyAqIHlzO1xuXG5cdFx0cmV0dXJuIE1hdGguc3FydCh4cyArIHlzKTtcblx0fVxufVxuXG4vL1xuZnVuY3Rpb24gcG9pbnRJblBvbHlnb24ocG9pbnQsIHBvbHlnb24pXG57XG5cdHZhciBwb2ludHMgPSBwb2x5Z29uO1xuXHR2YXIgaSwgaiwgbnZlcnQgPSBwb2x5Z29uLmxlbmd0aDtcblx0dmFyIGMgPSBmYWxzZTtcblxuXHRmb3IoaSA9IDAsIGogPSBudmVydCAtIDE7IGkgPCBudmVydDsgaiA9IGkrKykge1xuXHRcdGlmKCAoICgocG9pbnRzW2ldLnkpID49IHBvaW50LnkgKSAhPSAocG9pbnRzW2pdLnkgPj0gcG9pbnQueSkgKSAmJlxuXHQgICAgXHQocG9pbnQueCA8PSAocG9pbnRzW2pdLnggLSBwb2ludHNbaV0ueCkgKiAocG9pbnQueSAtIHBvaW50c1tpXS55KSAvIChwb2ludHNbal0ueSAtIHBvaW50c1tpXS55KSArIHBvaW50c1tpXS54KVxuXHQgIFx0KSBjID0gIWM7XG5cdH1cblxuICByZXR1cm4gYztcbn1cblxuLy8gbWV0aG9kIGZyb20ganNmaWRkbGU6IGh0dHA6Ly9qc2ZpZGRsZS5uZXQvanVzdGluX2Nfcm91bmRzL0dkMlMyL2xpZ2h0L1xuZnVuY3Rpb24gY2hlY2tMaW5lSW50ZXJzZWN0aW9uKGxpbmUxU3RhcnRYLCBsaW5lMVN0YXJ0WSwgbGluZTFFbmRYLCBsaW5lMUVuZFksIGxpbmUyU3RhcnRYLCBsaW5lMlN0YXJ0WSwgbGluZTJFbmRYLCBsaW5lMkVuZFkpIHtcbiAgICAvLyBpZiB0aGUgbGluZXMgaW50ZXJzZWN0LCB0aGUgcmVzdWx0IGNvbnRhaW5zIHRoZSB4IGFuZCB5IG9mIHRoZSBpbnRlcnNlY3Rpb24gKHRyZWF0aW5nIHRoZSBsaW5lcyBhcyBpbmZpbml0ZSkgYW5kIGJvb2xlYW5zIGZvciB3aGV0aGVyIGxpbmUgc2VnbWVudCAxIG9yIGxpbmUgc2VnbWVudCAyIGNvbnRhaW4gdGhlIHBvaW50XG4gICAgdmFyIGRlbm9taW5hdG9yLCBhLCBiLCBudW1lcmF0b3IxLCBudW1lcmF0b3IyLCByZXN1bHQgPSB7XG4gICAgICAgIHg6IG51bGwsXG4gICAgICAgIHk6IG51bGwsXG4gICAgICAgIG9uTGluZTE6IGZhbHNlLFxuICAgICAgICBvbkxpbmUyOiBmYWxzZVxuICAgIH07XG4gICAgZGVub21pbmF0b3IgPSAoKGxpbmUyRW5kWSAtIGxpbmUyU3RhcnRZKSAqIChsaW5lMUVuZFggLSBsaW5lMVN0YXJ0WCkpIC0gKChsaW5lMkVuZFggLSBsaW5lMlN0YXJ0WCkgKiAobGluZTFFbmRZIC0gbGluZTFTdGFydFkpKTtcbiAgICBpZiAoZGVub21pbmF0b3IgPT0gMCkge1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBhID0gbGluZTFTdGFydFkgLSBsaW5lMlN0YXJ0WTtcbiAgICBiID0gbGluZTFTdGFydFggLSBsaW5lMlN0YXJ0WDtcbiAgICBudW1lcmF0b3IxID0gKChsaW5lMkVuZFggLSBsaW5lMlN0YXJ0WCkgKiBhKSAtICgobGluZTJFbmRZIC0gbGluZTJTdGFydFkpICogYik7XG4gICAgbnVtZXJhdG9yMiA9ICgobGluZTFFbmRYIC0gbGluZTFTdGFydFgpICogYSkgLSAoKGxpbmUxRW5kWSAtIGxpbmUxU3RhcnRZKSAqIGIpO1xuICAgIGEgPSBudW1lcmF0b3IxIC8gZGVub21pbmF0b3I7XG4gICAgYiA9IG51bWVyYXRvcjIgLyBkZW5vbWluYXRvcjtcblxuICAgIC8vIGlmIHdlIGNhc3QgdGhlc2UgbGluZXMgaW5maW5pdGVseSBpbiBib3RoIGRpcmVjdGlvbnMsIHRoZXkgaW50ZXJzZWN0IGhlcmU6XG4gICAgcmVzdWx0LnggPSBsaW5lMVN0YXJ0WCArIChhICogKGxpbmUxRW5kWCAtIGxpbmUxU3RhcnRYKSk7XG4gICAgcmVzdWx0LnkgPSBsaW5lMVN0YXJ0WSArIChhICogKGxpbmUxRW5kWSAtIGxpbmUxU3RhcnRZKSk7XG4vKlxuICAgICAgICAvLyBpdCBpcyB3b3J0aCBub3RpbmcgdGhhdCB0aGlzIHNob3VsZCBiZSB0aGUgc2FtZSBhczpcbiAgICAgICAgeCA9IGxpbmUyU3RhcnRYICsgKGIgKiAobGluZTJFbmRYIC0gbGluZTJTdGFydFgpKTtcbiAgICAgICAgeSA9IGxpbmUyU3RhcnRYICsgKGIgKiAobGluZTJFbmRZIC0gbGluZTJTdGFydFkpKTtcbiAgICAgICAgKi9cbiAgICAvLyBpZiBsaW5lMSBpcyBhIHNlZ21lbnQgYW5kIGxpbmUyIGlzIGluZmluaXRlLCB0aGV5IGludGVyc2VjdCBpZjpcbiAgICBpZiAoYSA+IDAgJiYgYSA8IDEpIHtcbiAgICAgICAgcmVzdWx0Lm9uTGluZTEgPSB0cnVlO1xuICAgIH1cbiAgICAvLyBpZiBsaW5lMiBpcyBhIHNlZ21lbnQgYW5kIGxpbmUxIGlzIGluZmluaXRlLCB0aGV5IGludGVyc2VjdCBpZjpcbiAgICBpZiAoYiA+IDAgJiYgYiA8IDEpIHtcbiAgICAgICAgcmVzdWx0Lm9uTGluZTIgPSB0cnVlO1xuICAgIH1cbiAgICAvLyBpZiBsaW5lMSBhbmQgbGluZTIgYXJlIHNlZ21lbnRzLCB0aGV5IGludGVyc2VjdCBpZiBib3RoIG9mIHRoZSBhYm92ZSBhcmUgdHJ1ZVxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuIiwidmFyIFRvb2xzID0gcmVxdWlyZSgnLi9Ub29scy5qcycpO1xudmFyIFBhcnRpY2xlU3lzdGVtID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL1BhcnRpY2xlU3lzdGVtLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gUGxheWVyKGNvbnRhaW5lciwgeFBvcywgeVBvcykge1xuXHR2YXIgc2VsZiA9IHRoaXM7XG5cdHZhciB2ZWxvY2l0eSA9IDA7XG5cdHZhciBhY2NlbGVyYXRpb24gPSAwLjI1O1xuXHR2YXIgbWF4c3BlZWQgPSAyLjA7XG5cdHZhciBkaXIgPSAxO1xuXHR2YXIgbW92aWUgPSBudWxsO1xuXHR2YXIgZGVhZCA9IGZhbHNlO1xuXG5cdG1vdmllID0gbmV3IFBJWEkuTW92aWVDbGlwKFRvb2xzLmdldFRleHR1cmVzKFwiYm95XCIsIDcsIFwiLnBuZ1wiKSk7XG5cdG1vdmllLnBpdm90ID0gbmV3IFBJWEkuUG9pbnQobW92aWUud2lkdGgvMiwgbW92aWUuaGVpZ2h0LzIpO1xuXHRtb3ZpZS5hbmltYXRpb25TcGVlZCA9IDAuMjtcblxuXHR0aGlzLnZpZXcgPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG5cdHRoaXMudmlldy5hZGRDaGlsZChtb3ZpZSk7XG5cdHRoaXMudmlldy5wb3NpdGlvbi54ID0geFBvcztcblx0dGhpcy52aWV3LnBvc2l0aW9uLnkgPSB5UG9zO1xuXG5cdHZhciBmYWRpbmcgPSBmYWxzZTtcblxuXHRtb3ZpZS5wbGF5KCk7XG5cblx0dmFyIHBhcnRpY2xlcyA9IG5ldyBQYXJ0aWNsZVN5c3RlbShcblx0ICB7XG5cdCAgICAgIFwiaW1hZ2VzXCI6W1wicGl4ZWxTaGluZS5wbmdcIl0sXG5cdCAgICAgIFwibnVtUGFydGljbGVzXCI6MTAwLFxuXHQgICAgICBcImVtaXNzaW9uc1BlclVwZGF0ZVwiOjAsXG5cdCAgICAgIFwiZW1pc3Npb25zSW50ZXJ2YWxcIjowLFxuXHQgICAgICBcImFscGhhXCI6MSxcblx0ICAgICAgXCJwcm9wZXJ0aWVzXCI6XG5cdCAgICAgIHtcblx0ICAgICAgICBcInJhbmRvbVNwYXduWFwiOjEwLFxuXHQgICAgICAgIFwicmFuZG9tU3Bhd25ZXCI6MTAsXG5cdCAgICAgICAgXCJsaWZlXCI6MzAsXG5cdCAgICAgICAgXCJyYW5kb21MaWZlXCI6MTAwLFxuXHQgICAgICAgIFwiZm9yY2VYXCI6MCxcblx0ICAgICAgICBcImZvcmNlWVwiOjAsXG5cdCAgICAgICAgXCJyYW5kb21Gb3JjZVhcIjowLjEsXG5cdCAgICAgICAgXCJyYW5kb21Gb3JjZVlcIjowLjEsXG5cdCAgICAgICAgXCJ2ZWxvY2l0eVhcIjozLFxuXHQgICAgICAgIFwidmVsb2NpdHlZXCI6MCxcblx0ICAgICAgICBcInJhbmRvbVZlbG9jaXR5WFwiOjIsXG5cdCAgICAgICAgXCJyYW5kb21WZWxvY2l0eVlcIjoyLFxuXHQgICAgICAgIFwic2NhbGVcIjo1LFxuXHQgICAgICAgIFwiZ3Jvd3RoXCI6MC4wMSxcblx0ICAgICAgICBcInJhbmRvbVNjYWxlXCI6NC41LFxuXHQgICAgICAgIFwiYWxwaGFTdGFydFwiOjAsXG5cdCAgICAgICAgXCJhbHBoYUZpbmlzaFwiOjAsXG5cdCAgICAgICAgXCJhbHBoYVJhdGlvXCI6MC4yLFxuXHQgICAgICAgIFwidG9ycXVlXCI6MCxcblx0ICAgICAgICBcInJhbmRvbVRvcnF1ZVwiOjBcblx0ICAgICAgfVxuXHQgIH0pO1xuXHQgIHBhcnRpY2xlcy52aWV3LmFscGhhID0gMC41O1xuXG5cdCAgY29udGFpbmVyLmFkZENoaWxkKHBhcnRpY2xlcy52aWV3KTtcblx0ICBjb250YWluZXIuYWRkQ2hpbGQodGhpcy52aWV3KTtcblxuXHR0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKGdhbWUsIHBvc2l0aW9uLCB2ZWxvY2l0eSlcblx0e1xuXHRcdHNlbGYudmlldy5wb3NpdGlvbi54ID0gcG9zaXRpb24ueDtcblx0XHRzZWxmLnZpZXcucG9zaXRpb24ueSA9IHBvc2l0aW9uLnkgLSAxMDtcblxuXHRcdGlmICh2ZWxvY2l0eS54ID4gLTAuMDEgJiYgdmVsb2NpdHkueCA8IDAuMDEpIHZlbG9jaXR5LnggPSAwO1xuXG5cdFx0aWYgKHZlbG9jaXR5LnggPCAwKSBtb3ZpZS5zY2FsZS54ID0gLTE7XG5cdFx0aWYgKHZlbG9jaXR5LnggPiAwKSBtb3ZpZS5zY2FsZS54ID0gMTtcblxuXHRcdG1vdmllLnJvdGF0aW9uID0gdmVsb2NpdHkueCowLjE7XG5cblx0XHRwYXJ0aWNsZXMucHJvcGVydGllcy5jZW50ZXJYID0gc2VsZi52aWV3LnBvc2l0aW9uLnggKyAxMDtcblx0XHRwYXJ0aWNsZXMucHJvcGVydGllcy5jZW50ZXJZID0gc2VsZi52aWV3LnBvc2l0aW9uLnk7XG5cdFx0cGFydGljbGVzLnVwZGF0ZSgpO1xuXG5cdFx0aWYgKGZhZGluZyAmJiBzZWxmLnZpZXcuYWxwaGEgPiAwLjAyKSBzZWxmLnZpZXcuYWxwaGEgLT0gMC4wMjtcblx0fVxuXG5cdHRoaXMubW92ZUxlZnQgPSBmdW5jdGlvbigpXG5cdHtcblx0fVxuXG5cdHRoaXMubW92ZVJpZ2h0ID0gZnVuY3Rpb24oKVxuXHR7XG5cdH1cblxuXHR0aGlzLmZhZGVPdXQgPSBmdW5jdGlvbigpXG5cdHtcblx0XHRwYXJ0aWNsZXMuZW1pdCgxMDApO1xuXHRcdHNlbGYudmlldy5hbHBoYSA9IDAuNTtcblx0XHRmYWRpbmcgPSB0cnVlO1xuXHR9XG5cblx0dGhpcy5kb0NvbGxpZGUgPSBmdW5jdGlvbih4cG9zLHlwb3Msd2lkdGgsaGVpZ2h0KVxuXHR7XG5cdFx0Ly9jb25zb2xlLmxvZyhcImNvbGxpZGU6IFwiICsgc2VsZi52aWV3LnBvc2l0aW9uLnggPj0geHBvcyArIFwiIFwiICsgc2VsZi52aWV3LnBvc2l0aW9uLnggPCAoeHBvcyArIHdpZHRoKSArIFwiIFwiICsgc2VsZi52aWV3LnBvc2l0aW9uLnkgLSB5cG9zIDwgMTAwKVxuXHRcdGlmKHNlbGYudmlldy5wb3NpdGlvbi54ID49IHhwb3MgJiYgc2VsZi52aWV3LnBvc2l0aW9uLnggPCAoeHBvcyArIHdpZHRoKSAmJiBNYXRoLmFicyhzZWxmLnZpZXcucG9zaXRpb24ueSAtIHlwb3MpIDwgNTApXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG59XG5cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gUHJlbG9hZGVyKGdhbWUpIHtcblxuICB2YXIgY29udGVudCxcbiAgICBzZWxmID0gdGhpcyxcbiAgICBiZztcblxuICBzZWxmLnRleHQ7XG5cbiAgdGhpcy5wcm9ncmVzcyA9IGZ1bmN0aW9uKGxvYWRlZEl0ZW1zLCB0b3RhbEl0ZW1zKSB7XG4gICAgdmFyIHBlcmNlbnQgPSBNYXRoLnJvdW5kKGxvYWRlZEl0ZW1zICogMTAwIC8gdG90YWxJdGVtcyk7XG4gICAgaWYgKGxvYWRlZEl0ZW1zID4gMCkge1xuICAgICAgaWYgKGxvYWRlZEl0ZW1zID09IDEpIHtcbiAgICAgICAgc2VsZi5pbml0KCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YoZWplY3RhKT09PVwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgc2VsZi50ZXh0LnNldFRleHQoJ0NBUlJFR0FORE8gJyArIHBlcmNlbnQgKyAnJScpO1xuICAgICAgICBzZWxmLnRleHQucG9zaXRpb24ueCA9IChnYW1lLnJlbmRlcmVyLndpZHRoIC8gMikgLSAoc2VsZi50ZXh0LndpZHRoIC8gMik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhpcy5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgY29udGVudCA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcbiAgICBnYW1lLnN0YWdlLmFkZENoaWxkKGNvbnRlbnQpO1xuXG4gICAgYmcgPSBuZXcgUElYSS5HcmFwaGljcygpO1xuICAgIGJnLmJlZ2luRmlsbCgweDAwMDAwMCk7XG4gICAgYmcuZHJhd1JlY3QoMCwgMCwgc2NyZWVuV2lkdGgsIHNjcmVlbkhlaWdodCk7XG4gICAgYmcuZW5kRmlsbCgpO1xuXG4gICAgY29udGVudC5hZGRDaGlsZChiZyk7XG5cbiAgICBpZiAodHlwZW9mKGVqZWN0YSk9PT1cInVuZGVmaW5lZFwiKSB7XG4gICAgICBzZWxmLnRleHQgPSBuZXcgUElYSS5UZXh0KCdDQVJSRUdBTkRPIDAlJywge1xuICAgICAgICBmb250OiAnMThweCBSb2traXR0JyxcbiAgICAgICAgZmlsbDogJyM2NjY2NjYnLFxuICAgICAgICBhbGlnbjogJ2NlbnRlcidcbiAgICAgIH0pO1xuICAgICAgc2VsZi50ZXh0LnBvc2l0aW9uLnggPSAoZ2FtZS5yZW5kZXJlci53aWR0aCAvIDIpIC0gKHNlbGYudGV4dC53aWR0aCAvIDIpO1xuICAgICAgc2VsZi50ZXh0LnBvc2l0aW9uLnkgPSBnYW1lLnJlbmRlcmVyLmhlaWdodCAvIDI7XG4gICAgICBjb250ZW50LmFkZENoaWxkKHNlbGYudGV4dCk7XG4gICAgfVxuXG4gIH1cblxuICB0aGlzLmhpZGUgPSBmdW5jdGlvbigpIHtcbiAgICBjb250ZW50LnZpc2libGUgPSBmYWxzZTtcbiAgfVxuXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBSZXNvdXJjZXMoKSB7XG5cbiAgSG93bGVyLmlPU0F1dG9FbmFibGUgPSBmYWxzZTtcbiAgLy8gSG93bGVyLm11dGUoKTtcblxuICAvLyBpbWFnZXNcbiAgLy8gdGhpcy5iYWNrZ3JvdW5kID0gJ2ltZy9iZy1kZWZhdWx0LmpwZyc7XG4gIC8vIHRoaXMuYnRuUGxheSA9J2ltZy9idG4tcGxheS5wbmcnO1xuICAvLyB0aGlzLmJ0bk5leHQgPSdpbWcvYnRuLW5leHQucG5nJztcbiAgLy8gdGhpcy5idG5SZXN0YXJ0ID0naW1nL2J0bi1yZXN0YXJ0LnBuZyc7XG4gIC8vIHRoaXMudGV4dExldmVsRW5kID0naW1nL3RleHQtbGV2ZWwtZW5kLnBuZyc7XG4gIC8vIHRoaXMudGV4dEdhbWVPdmVyID0naW1nL3RleHQtZ2FtZS1vdmVyLnBuZyc7XG5cbiAgLy8gc3ByaXRlc1xuICB0aGlzLnRleHRHYW1lT3ZlciA9J2ltZy9zcHJpdGVzL3BsYXllci5qc29uJztcbiAgdGhpcy50ZXh0dXJlcyA9J2ltZy90ZXh0dXJlcy5qc29uJztcblxuICAvLyBzb3VuZHNcbiAgdGhpcy5zb3VuZHMgPSBbXG4gICAge1xuICAgICAgLy8gZ2FtZS5yZXNvdXJjZXMuc291bmRMb29wLnBsYXkoKTtcbiAgICAgIG5hbWU6ICdzb3VuZExvb3AnLFxuICAgICAgdXJsczogWydzb3VuZHMvc291bmRMb29wLm1wMyddLFxuICAgICAgYXV0b1BsYXk6IGZhbHNlLFxuICAgICAgbG9vcDogdHJ1ZSxcbiAgICAgIHZvbHVtZTogMFxuICAgIH0sXG4gICAge1xuICAgICAgLy8gZ2FtZS5yZXNvdXJjZXMuYnV0dG9uQ2xpY2sucGxheSgpO1xuICAgICAgbmFtZTogJ2J1dHRvbkNsaWNrJyxcbiAgICAgIHVybHM6IFsnc291bmRzL2J1dHRvbkNsaWNrMi5tcDMnXSxcbiAgICAgIHZvbHVtZTogLjNcbiAgICB9LFxuICAgIHtcbiAgICAgIC8vIGdhbWUucmVzb3VyY2VzLnBvcnRhbFNvdW5kLnBsYXkoKTtcbiAgICAgIG5hbWU6ICdwb3J0YWxTb3VuZCcsXG4gICAgICB1cmxzOiBbJ3NvdW5kcy9wb3J0YWwubXAzJ10sXG4gICAgICB2b2x1bWU6IC41XG4gICAgfSxcbiAgICB7XG4gICAgICAvLyBnYW1lLnJlc291cmNlcy5mb3Jlc3RTb3VuZC5wbGF5KCk7XG4gICAgICBuYW1lOiAnZm9yZXN0U291bmQnLFxuICAgICAgdXJsczogWydzb3VuZHMvZm9yZXN0LW5pZ2h0Mi5tcDMnXSxcbiAgICAgIHZvbHVtZTogLjcsXG4gICAgICBsb29wOiB0cnVlXG4gICAgfSxcbiAgICB7XG4gICAgICAvLyBnYW1lLnJlc291cmNlcy5tb3RoZXJTb3VuZC5wbGF5KCk7XG4gICAgICBuYW1lOiAnbW90aGVyU291bmQnLFxuICAgICAgdXJsczogWydzb3VuZHMvYmxpbWJsaW0ubXAzJ10sXG4gICAgICB2b2x1bWU6IC4zXG4gICAgfSxcbiAgICB7XG4gICAgICAvLyBnYW1lLnJlc291cmNlcy5zd2ljaGVyU291bmQucGxheSgpO1xuICAgICAgbmFtZTogJ3N3aWNoZXJTb3VuZCcsXG4gICAgICB1cmxzOiBbJ3NvdW5kcy9zd2ljaGVyMi5tcDMnXSxcbiAgICAgIHZvbHVtZTogLjNcbiAgICB9LFxuICAgIHtcbiAgICAgIC8vIGdhbWUucmVzb3VyY2VzLmNhckNyYXNoLnBsYXkoKTtcbiAgICAgIG5hbWU6ICdjYXJDcmFzaCcsXG4gICAgICB1cmxzOiBbJ3NvdW5kcy9jYXJDcmFzaC5tcDMnXVxuICAgIH0sXG4gICAge1xuICAgICAgLy8gZ2FtZS5yZXNvdXJjZXMuY2FyUGFzcy5wbGF5KCk7XG4gICAgICBuYW1lOiAnY2FyUGFzcycsXG4gICAgICB1cmxzOiBbJ3NvdW5kcy9jYXJQYXNzMi5tcDMnXSxcbiAgICAgIHZvbHVtZTogLjE1XG4gICAgfSxcbiAgICB7XG4gICAgICAvLyBnYW1lLnJlc291cmNlcy5zdG9ybS5wbGF5KCk7XG4gICAgICBuYW1lOiAnc3Rvcm0nLFxuICAgICAgdXJsczogWydzb3VuZHMvc3Rvcm0yLm1wMyddLFxuICAgICAgdm9sdW1lOiAxXG4gICAgfVxuICBdO1xuXG4gIHZhciBzZWxmID0gdGhpcztcblxuICB0aGlzLmdldFBJWElGaWxlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpLFxuICAgICAgdXJsLFxuICAgICAgdXJsVG9JZixcbiAgICAgIGFyciA9IFtdO1xuICAgIGZvciAoaSBpbiBzZWxmKSB7XG4gICAgICB1cmwgPSBzZWxmW2ldO1xuICAgICAgaWYgKHR5cGVvZiB1cmwgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHVybFRvSWYgPSB1cmwudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKHVybFRvSWYubGFzdEluZGV4T2YoJy5qcGcnKSA+IDBcbiAgICAgICAgICB8fCB1cmxUb0lmLmxhc3RJbmRleE9mKCcuanBlZycpID4gMFxuICAgICAgICAgIHx8IHVybFRvSWYubGFzdEluZGV4T2YoJy5wbmcnKSA+IDBcbiAgICAgICAgICB8fCB1cmxUb0lmLmxhc3RJbmRleE9mKCcuZ2lmJykgPiAwXG4gICAgICAgICAgfHwgdXJsVG9JZi5sYXN0SW5kZXhPZignLmpzb24nKSA+IDBcbiAgICAgICAgICB8fCB1cmxUb0lmLmxhc3RJbmRleE9mKCcuYXRsYXMnKSA+IDBcbiAgICAgICAgICB8fCB1cmxUb0lmLmxhc3RJbmRleE9mKCcuYW5pbScpID4gMFxuICAgICAgICAgIHx8IHVybFRvSWYubGFzdEluZGV4T2YoJy54bWwnKSA+IDBcbiAgICAgICAgICB8fCB1cmxUb0lmLmxhc3RJbmRleE9mKCcuZm50JykgPiAwKSB7XG4gICAgICAgICAgYXJyLnB1c2goc2VsZltpXSk7ICBcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyO1xuICB9XG5cbn07XG4iLCJcblxubW9kdWxlLmV4cG9ydHMgPSBcbntcblx0Z2V0VGV4dHVyZXM6ICBmdW5jdGlvbihwcmVmaXgsIG51bUZyYW1lcywgc3VmaXgpXG5cdHtcblx0XHRpZiAoc3VmaXggPT0gbnVsbCkgc3VmaXggPSBcIlwiO1xuXHRcdHZhciB0ZXh0dXJlcyA9IFtdO1xuXHRcdHZhciBpID0gbnVtRnJhbWVzO1xuXHRcdHdoaWxlIChpID4gMCkgXG5cdFx0e1xuXHRcdFx0dmFyIGlkID0gdGhpcy5pbnRUb1N0cmluZyhpLCAyKTtcblx0XHRcdHZhciB0ZXh0dXJlID0gUElYSS5UZXh0dXJlLmZyb21GcmFtZShwcmVmaXgraWQrc3VmaXgpO1xuXHRcdFx0dGV4dHVyZXMucHVzaCh0ZXh0dXJlKTtcblx0XHRcdGktLTtcblx0XHR9XG5cblx0XHR0ZXh0dXJlcy5yZXZlcnNlKCk7XG5cdCAgICByZXR1cm4gdGV4dHVyZXM7XG5cdH0sXG5cblx0aW50VG9TdHJpbmc6IGZ1bmN0aW9uKHZhbHVlLCBsZW5ndGgpXG5cdHtcblx0XHR2YXIgc3RyID0gdmFsdWUudG9TdHJpbmcoKTtcblx0XHR2YXIgc3RybGVuID0gc3RyLmxlbmd0aDtcblx0XHR2YXIgaSA9IGxlbmd0aCAtIHN0cmxlbjtcblx0XHR3aGlsZSAoaS0tKSBzdHIgPSBcIjBcIiArIHN0cjsgXG5cdFx0cmV0dXJuIHN0cjtcblx0fSxcblxuXHRjbGFtcDogZnVuY3Rpb24odmFsdWUsIG1pbiwgbWF4KVxuXHR7XG5cdFx0aWYgKHZhbHVlIDwgbWluKSByZXR1cm4gbWluO1xuXHRcdGlmICh2YWx1ZSA+IG1heCkgcmV0dXJuIG1heDtcblx0XHRyZXR1cm4gdmFsdWU7XG5cdH1cbn0iLCJ2YXIgVHdlZW5hYmxlID0gcmVxdWlyZSgnLi4vdmVuZG9yL3NoaWZ0eScpLFxuICAgIEdhbWUgPSByZXF1aXJlKCcuLi9nYW1lJyksXG4gICAgUGFydGljbGVTeXN0ZW0gPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL1BhcnRpY2xlU3lzdGVtLmpzJyksXG4gICAgVHdlZW5hYmxlID0gcmVxdWlyZSgnLi4vdmVuZG9yL3NoaWZ0eScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIEVuZEJlaGF2aW9yKGNvbnRhaW5lciwgZGF0YSkge1xuXHR2YXIgc2VsZiA9IHRoaXMsXG4gICAgICBpdGVtRGF0YSA9IGRhdGEsXG4gICAgICB0cmlnZ2VyZWQgPSBmYWxzZTtcblxuICAvLy8vL3JldHJpdmUgcG9zaXRpb24gYW5kIHNpemUgc3BlY3NcbiAgdmFyIHNpemUgPSBkYXRhLndpZHRoO1xuICB2YXIgb3JpZ2luWCA9IGRhdGEueDtcbiAgdmFyIG9yaWdpblkgPSBkYXRhLnk7XG5cbiAgLy8vLy9yZXRyaXZlIHBvc2l0aW9uIGFuZCBzaXplIHNwZWNzXG4gIHZhciBzaXplID0gZGF0YS53aWR0aDtcbiAgdmFyIG9yaWdpblggPSBkYXRhLng7XG4gIHZhciBvcmlnaW5ZID0gZGF0YS55O1xuXG4gIC8vLy8vY3JlYXRlIHZpc3VhbFxuICB0aGlzLnZpZXcgPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG4gIHRoaXMudmlldy5wb3NpdGlvbi54ID0gb3JpZ2luWDtcbiAgdGhpcy52aWV3LnBvc2l0aW9uLnkgPSBvcmlnaW5ZIC0gMjc7XG5cbiAgdmFyIHBhcnRpY2xlcyA9IG51bGw7XG4gIHZhciBwb3J0YWxPZmZTcHJpdGUgPSBuZXcgUElYSS5TcHJpdGUoUElYSS5UZXh0dXJlLmZyb21JbWFnZShcIlBvcnRhbE9mZi5wbmdcIikpO1xuICB2YXIgcG9ydGFsT25TcHJpdGUgPSBuZXcgUElYSS5TcHJpdGUoUElYSS5UZXh0dXJlLmZyb21JbWFnZShcInBvcnRhbC5wbmdcIikpO1xuICBwb3J0YWxPblNwcml0ZS5hbHBoYSA9IDA7XG5cbiAgdGhpcy52aWV3LmFkZENoaWxkKHBvcnRhbE9mZlNwcml0ZSk7XG4gIGNvbnRhaW5lci5hZGRDaGlsZCh0aGlzLnZpZXcpO1xuXG4gIHZhciBmYWRlT3V0U2hhcGUgPSBuZXcgUElYSS5HcmFwaGljcygpO1xuICBmYWRlT3V0U2hhcGUuYWxwaGEgPSAwO1xuXG4gIHZhciBoYWxvID0gUElYSS5TcHJpdGUuZnJvbUZyYW1lKFwiaGFsby5wbmdcIik7XG4gIGhhbG8uYW5jaG9yLnggPSAwLjU7XG4gIGhhbG8uYW5jaG9yLnkgPSAwLjU7XG4gIGhhbG8uc2NhbGUueCA9IDU7XG4gIGhhbG8uc2NhbGUueSA9IDU7XG4gIGhhbG8ucG9zaXRpb24ueCA9IDMzO1xuICBoYWxvLnBvc2l0aW9uLnkgPSAzMztcbiAgaGFsby5hbHBoYSA9IDAuMjtcbiAgdGhpcy52aWV3LmFkZENoaWxkKGhhbG8pO1xuICBoYWxvLnZpc2libGUgPSBmYWxzZTtcblxuICBlbWl0dGVyLm9uKCdzd2l0Y2gucHJlc3NlZCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgaWYoZ2FtZS5sZXZlbC5udW1Td2l0Y2hlcyA9PSAwKSB7XG5cbiAgICAgIHBhcnRpY2xlcyA9IG5ldyBQYXJ0aWNsZVN5c3RlbSh7XG4gICAgICAgIFwiaW1hZ2VzXCI6W1wiUG9ydGFsU3BhcmsucG5nXCJdLFxuICAgICAgICBcIm51bVBhcnRpY2xlc1wiOjUwLFxuICAgICAgICBcImVtaXNzaW9uc1BlclVwZGF0ZVwiOjEsXG4gICAgICAgIFwiZW1pc3Npb25zSW50ZXJ2YWxcIjoyLFxuICAgICAgICBcImFscGhhXCI6MSxcbiAgICAgICAgXCJwcm9wZXJ0aWVzXCI6IHtcbiAgICAgICAgICBcInJhbmRvbVNwYXduWFwiOjEsXG4gICAgICAgICAgXCJyYW5kb21TcGF3bllcIjozMCxcbiAgICAgICAgICBcImxpZmVcIjozMCxcbiAgICAgICAgICBcInJhbmRvbUxpZmVcIjoxMDAsXG4gICAgICAgICAgXCJmb3JjZVhcIjowLFxuICAgICAgICAgIFwiZm9yY2VZXCI6MC4wMSxcbiAgICAgICAgICBcInJhbmRvbUZvcmNlWFwiOjAuMDA3LFxuICAgICAgICAgIFwicmFuZG9tRm9yY2VZXCI6MC4wMSxcbiAgICAgICAgICBcInZlbG9jaXR5WFwiOi0xLFxuICAgICAgICAgIFwidmVsb2NpdHlZXCI6MCxcbiAgICAgICAgICBcInJhbmRvbVZlbG9jaXR5WFwiOjAuMixcbiAgICAgICAgICBcInJhbmRvbVZlbG9jaXR5WVwiOjAuMixcbiAgICAgICAgICBcInNjYWxlXCI6MC4yNSxcbiAgICAgICAgICBcImdyb3d0aFwiOjAuMDAxLFxuICAgICAgICAgIFwicmFuZG9tU2NhbGVcIjowLjA0LFxuICAgICAgICAgIFwiYWxwaGFTdGFydFwiOjAsXG4gICAgICAgICAgXCJhbHBoYUZpbmlzaFwiOjAsXG4gICAgICAgICAgXCJhbHBoYVJhdGlvXCI6MC4yLFxuICAgICAgICAgIFwidG9ycXVlXCI6MCxcbiAgICAgICAgICBcInJhbmRvbVRvcnF1ZVwiOjBcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGhhbG8udmlzaWJsZSA9IHRydWU7XG4gICAgICBoYWxvLmFscGhhID0gMDtcblxuICAgICAgcGFydGljbGVzLnZpZXcuYWxwaGEgPSAwLjI1O1xuICAgICAgcGFydGljbGVzLnByb3BlcnRpZXMuY2VudGVyWCA9IDE4O1xuICAgICAgcGFydGljbGVzLnByb3BlcnRpZXMuY2VudGVyWSA9IDMzO1xuXG4gICAgICBzZWxmLnZpZXcuYWRkQ2hpbGQocGFydGljbGVzLnZpZXcpO1xuXG4gICAgICAvLyBGYWRlIHBvcnRhbFxuICAgICAgdmFyIGludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChwb3J0YWxPblNwcml0ZS5hbHBoYSA+PSAxKSB7XG4gICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcG9ydGFsT25TcHJpdGUuYWxwaGEgKz0gMC4wMjtcbiAgICAgICAgfVxuICAgICAgfSwgMSlcblxuICAgICAgc2VsZi52aWV3LmFkZENoaWxkKHBvcnRhbE9uU3ByaXRlKTtcbiAgICB9XG5cbiAgfSk7XG5cblx0dGhpcy50cmlnZ2VyID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCF0cmlnZ2VyZWQpIHtcbiAgICAgIGZhZGVPdXRTaGFwZS5iZWdpbkZpbGwoMHgwMDApO1xuICAgICAgZmFkZU91dFNoYXBlLmRyYXdSZWN0KDAsIDAsIGdhbWUucmVuZGVyZXIud2lkdGgsIGdhbWUucmVuZGVyZXIuaGVpZ2h0KTtcbiAgICAgIGdhbWUuc3RhZ2UuYWRkQ2hpbGQoZmFkZU91dFNoYXBlKTtcbiAgICAgIGdhbWUucGxheWVyLmZhZGVPdXQoKTtcbiAgICAgIGdhbWUucmVzb3VyY2VzLnBvcnRhbFNvdW5kLnBsYXkoKTtcbiAgICAgIGdhbWUucmVzb3VyY2VzLmZvcmVzdFNvdW5kLnN0b3AoKTtcbiAgICB9XG4gICAgdHJpZ2dlcmVkID0gdHJ1ZTtcbiAgfVxuXG5cdHRoaXMudXBkYXRlID0gZnVuY3Rpb24oZ2FtZSlcblx0e1xuICAgIGlmIChwYXJ0aWNsZXMpIHtcbiAgICAgIHBhcnRpY2xlcy51cGRhdGUoKTtcbiAgICB9XG5cbiAgICBpZiAoaGFsby52aXNpYmxlKVxuICAgIHtcbiAgICAgIGhhbG8uYWxwaGEgKz0gMC4wMTtcbiAgICAgIGlmIChoYWxvLmFscGhhID4gMC4yKSBoYWxvLmFscGhhID0gMC4yO1xuICAgIH1cblxuICAgIGlmICh0cmlnZ2VyZWQpIHtcblxuICAgICAgZmFkZU91dFNoYXBlLmFscGhhICs9IDAuMDE7XG4gICAgICBpZiAoZmFkZU91dFNoYXBlLmFscGhhID49IDEpIHtcbiAgICAgICAgZ2FtZS5sZXZlbC5kaXNwb3NlKCk7XG4gICAgICAgIGdhbWUubmV4dExldmVsKCk7XG4gICAgICAgIGdhbWUuc3RhZ2UucmVtb3ZlQ2hpbGQoZmFkZU91dFNoYXBlKTtcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICAvL2NvbnNvbGUubG9nKGdhbWUucGxheWVyLmRvQ29sbGlkZShpdGVtRGF0YS54LGl0ZW1EYXRhLnksIGl0ZW1EYXRhLndpZHRoLGl0ZW1EYXRhLmhlaWdodCksZ2FtZS5pbnB1dC5LZXkuaXNEb3duKDM4KSk7XG4gICAgICBpZihnYW1lLnBsYXllci5kb0NvbGxpZGUoaXRlbURhdGEueCxpdGVtRGF0YS55LCBpdGVtRGF0YS53aWR0aCxpdGVtRGF0YS5oZWlnaHQpKVxuICAgICAgICB7XG4gICAgICAgICAgaWYoZ2FtZS5sZXZlbC5udW1Td2l0Y2hlcyA9PSAwKSB7XG4gICAgICAgICAgICBzZWxmLnRyaWdnZXIoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsInZhciBUd2VlbmFibGUgPSByZXF1aXJlKCcuLi92ZW5kb3Ivc2hpZnR5JyksXG4gICAgR2FtZSA9IHJlcXVpcmUoJy4uL2dhbWUnKSxcbiAgICBQYXJ0aWNsZVN5c3RlbSA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvUGFydGljbGVTeXN0ZW0uanMnKSxcbiAgICBUd2VlbmFibGUgPSByZXF1aXJlKCcuLi92ZW5kb3Ivc2hpZnR5Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gRW5kQ2FyQmVoYXZpb3IoY29udGFpbmVyLCBkYXRhKSB7XG5cdHZhciBzZWxmID0gdGhpcyxcbiAgICAgIGl0ZW1EYXRhID0gZGF0YSxcbiAgICAgIHRyaWdnZXJlZCA9IGZhbHNlO1xuXG4gIC8vLy8vcmV0cml2ZSBwb3NpdGlvbiBhbmQgc2l6ZSBzcGVjc1xuICB2YXIgc2l6ZSA9IGRhdGEud2lkdGg7XG4gIHZhciBvcmlnaW5YID0gZGF0YS54O1xuICB2YXIgb3JpZ2luWSA9IGRhdGEueTtcblxuICAvLy8vL3JldHJpdmUgcG9zaXRpb24gYW5kIHNpemUgc3BlY3NcbiAgdmFyIHNpemUgPSBkYXRhLndpZHRoO1xuICB2YXIgb3JpZ2luWCA9IGRhdGEueDtcbiAgdmFyIG9yaWdpblkgPSBkYXRhLnk7XG5cbiAgLy8vLy9jcmVhdGUgdmlzdWFsXG4gIHRoaXMudmlldyA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcbiAgdGhpcy52aWV3LnBvc2l0aW9uLnggPSBvcmlnaW5YO1xuICB0aGlzLnZpZXcucG9zaXRpb24ueSA9IG9yaWdpblkgLSAyNztcblxuICB2YXIgcGFydGljbGVzID0gbnVsbDtcbiAgdmFyIGNhclNwcml0ZSA9IG5ldyBQSVhJLlNwcml0ZShQSVhJLlRleHR1cmUuZnJvbUltYWdlKFwiQ2FyQ3Jhc2gucG5nXCIpKTtcbiAgY2FyU3ByaXRlLnkgPSAxMztcbiAgdGhpcy52aWV3LmFkZENoaWxkKGNhclNwcml0ZSk7XG4gIGNvbnRhaW5lci5hZGRDaGlsZCh0aGlzLnZpZXcpO1xuXG4gIHZhciBmYWRlT3V0U2hhcGUgPSBuZXcgUElYSS5HcmFwaGljcygpO1xuICBmYWRlT3V0U2hhcGUuYWxwaGEgPSAwO1xuXG4gIGVtaXR0ZXIub24oJ3N3aXRjaC5wcmVzc2VkJywgZnVuY3Rpb24oKSB7XG5cbiAgICBpZihnYW1lLmxldmVsLm51bVN3aXRjaGVzID09IDApIHtcblxuICAgICAgcGFydGljbGVzID0gbmV3IFBhcnRpY2xlU3lzdGVtKHtcbiAgICAgICAgXCJpbWFnZXNcIjpbXCJtb3RoZXJTaGluZS5wbmdcIl0sXG4gICAgICAgIFwibnVtUGFydGljbGVzXCI6NTAsXG4gICAgICAgIFwiZW1pc3Npb25zUGVyVXBkYXRlXCI6MSxcbiAgICAgICAgXCJlbWlzc2lvbnNJbnRlcnZhbFwiOjIsXG4gICAgICAgIFwiYWxwaGFcIjoxLFxuICAgICAgICBcInByb3BlcnRpZXNcIjoge1xuICAgICAgICAgIFwicmFuZG9tU3Bhd25YXCI6MSxcbiAgICAgICAgICBcInJhbmRvbVNwYXduWVwiOjEsXG4gICAgICAgICAgXCJsaWZlXCI6MzAsXG4gICAgICAgICAgXCJyYW5kb21MaWZlXCI6MTAwLFxuICAgICAgICAgIFwiZm9yY2VYXCI6MCxcbiAgICAgICAgICBcImZvcmNlWVwiOjAsXG4gICAgICAgICAgXCJyYW5kb21Gb3JjZVhcIjowLjAwMSxcbiAgICAgICAgICBcInJhbmRvbUZvcmNlWVwiOjAuMDEsXG4gICAgICAgICAgXCJ2ZWxvY2l0eVhcIjowLFxuICAgICAgICAgIFwidmVsb2NpdHlZXCI6LTAuMDIsXG4gICAgICAgICAgXCJyYW5kb21WZWxvY2l0eVhcIjowLjIsXG4gICAgICAgICAgXCJyYW5kb21WZWxvY2l0eVlcIjowLjQsXG4gICAgICAgICAgXCJzY2FsZVwiOjAuMSxcbiAgICAgICAgICBcImdyb3d0aFwiOjAuMDAxLFxuICAgICAgICAgIFwicmFuZG9tU2NhbGVcIjowLjA0LFxuICAgICAgICAgIFwiYWxwaGFTdGFydFwiOjAsXG4gICAgICAgICAgXCJhbHBoYUZpbmlzaFwiOjAsXG4gICAgICAgICAgXCJhbHBoYVJhdGlvXCI6MC4yLFxuICAgICAgICAgIFwidG9ycXVlXCI6MCxcbiAgICAgICAgICBcInJhbmRvbVRvcnF1ZVwiOjBcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHBhcnRpY2xlcy52aWV3LmFscGhhID0gMC41O1xuICAgICAgcGFydGljbGVzLnByb3BlcnRpZXMuY2VudGVyWCArPSBzZWxmLnZpZXcud2lkdGggLyAyO1xuICAgICAgcGFydGljbGVzLnByb3BlcnRpZXMuY2VudGVyWSArPSBzZWxmLnZpZXcuaGVpZ2h0IC8gMjtcblxuICAgICAgc2VsZi52aWV3LmFkZENoaWxkKHBhcnRpY2xlcy52aWV3KTtcbiAgICB9XG5cbiAgfSk7XG5cblx0dGhpcy50cmlnZ2VyID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCF0cmlnZ2VyZWQpIHtcbiAgICAgIGZhZGVPdXRTaGFwZS5iZWdpbkZpbGwoMHgwMDApO1xuICAgICAgZmFkZU91dFNoYXBlLmRyYXdSZWN0KDAsIDAsIGdhbWUucmVuZGVyZXIud2lkdGgsIGdhbWUucmVuZGVyZXIuaGVpZ2h0KTtcbiAgICAgIGNvbnRhaW5lci5hZGRDaGlsZChmYWRlT3V0U2hhcGUpO1xuICAgICAgZ2FtZS5wbGF5ZXIuZmFkZU91dCgpO1xuICAgICAgZ2FtZS5yZXNvdXJjZXMucG9ydGFsU291bmQucGxheSgpO1xuICAgICAgZ2FtZS5yZXNvdXJjZXMuZm9yZXN0U291bmQuc3RvcCgpO1xuICAgIH1cbiAgICB0cmlnZ2VyZWQgPSB0cnVlO1xuICB9XG5cbiAgdmFyIGdhbWVvdmVyID0gZmFsc2U7XG4gIHNlbGYuZ2FtZW92ZXIgPSBnYW1lb3ZlcjtcblxuXHR0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKGdhbWUpXG5cdHtcbiAgICBpZihzZWxmLmdhbWVvdmVyKVxuICAgICAgcmV0dXJuO1xuXG4gICAgaWYgKHBhcnRpY2xlcykge1xuICAgICAgcGFydGljbGVzLnVwZGF0ZSgpO1xuICAgIH1cblxuICAgIGlmICh0cmlnZ2VyZWQpIHtcblxuICAgICAgZmFkZU91dFNoYXBlLmFscGhhICs9IDAuMDE7XG4gICAgICBpZiAoZmFkZU91dFNoYXBlLmFscGhhID49IDAuNykge1xuICAgICAgICBnYW1lLnNob3dFbmRTdG9yeSgpO1xuICAgICAgICBzZWxmLmdhbWVvdmVyID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICAvL2NvbnNvbGUubG9nKGdhbWUucGxheWVyLmRvQ29sbGlkZShpdGVtRGF0YS54LGl0ZW1EYXRhLnksIGl0ZW1EYXRhLndpZHRoLGl0ZW1EYXRhLmhlaWdodCksZ2FtZS5pbnB1dC5LZXkuaXNEb3duKDM4KSk7XG4gICAgICBpZihnYW1lLnBsYXllci5kb0NvbGxpZGUoaXRlbURhdGEueCxpdGVtRGF0YS55LCBpdGVtRGF0YS53aWR0aCxpdGVtRGF0YS5oZWlnaHQpKVxuICAgICAgICB7XG4gICAgICAgICAgaWYoZ2FtZS5sZXZlbC5udW1Td2l0Y2hlcyA9PSAwKSB7XG4gICAgICAgICAgICBzZWxmLnRyaWdnZXIoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsInZhciBUb29scyA9IHJlcXVpcmUoJy4uL1Rvb2xzLmpzJyk7XG52YXIgUGFydGljbGVTeXN0ZW0gPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL1BhcnRpY2xlU3lzdGVtLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gTGlnaHRCZWhhdmlvcihjb250YWluZXIsIGRhdGEpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLm5hbWUgPSBcIkxpZ2h0QmVoYXZpb3JcIjtcblxuICAvLy8vL3JldHJpdmUgcG9zaXRpb24gYW5kIHNpemUgc3BlY3NcbiAgdmFyIHNpemUgPSBkYXRhLndpZHRoO1xuICB2YXIgb3JpZ2luWCA9IGRhdGEueDtcbiAgdmFyIG9yaWdpblkgPSBkYXRhLnk7XG5cbiAgdmFyIG1vdmllID0gbnVsbDtcblxuICBtb3ZpZSA9IG5ldyBQSVhJLk1vdmllQ2xpcChUb29scy5nZXRUZXh0dXJlcyhcIm1vdGhlclwiLCAxMiwgXCIucG5nXCIpKTtcbiAgbW92aWUucGl2b3QgPSBuZXcgUElYSS5Qb2ludChtb3ZpZS53aWR0aC8yLCBtb3ZpZS5oZWlnaHQvMiArIDI1KTtcbiAgbW92aWUuYW5pbWF0aW9uU3BlZWQgPSAwLjI7XG5cbiAgdGhpcy52aWV3ID0gbmV3IFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lcigpO1xuICB0aGlzLnZpZXcucG9zaXRpb24ueCA9IG9yaWdpblg7XG4gIHRoaXMudmlldy5wb3NpdGlvbi55ID0gb3JpZ2luWTtcblxuICB0aGlzLnZpZXcuYWRkQ2hpbGQobW92aWUpO1xuXG4gIG1vdmllLnBsYXkoKTtcblxuICB2YXIgaGFsbyA9IFBJWEkuU3ByaXRlLmZyb21GcmFtZShcImhhbG8ucG5nXCIpO1xuICBoYWxvLmFuY2hvci54ID0gMC41O1xuICBoYWxvLmFuY2hvci55ID0gMC41O1xuICBoYWxvLnNjYWxlLnggPSAxMDtcbiAgaGFsby5zY2FsZS55ID0gMTA7XG4gIGhhbG8uYWxwaGEgPSAwLjM7XG4gIHRoaXMudmlldy5hZGRDaGlsZChoYWxvKTtcblxuICBsaWdodC5wb3NpdGlvbi54ID0gb3JpZ2luWDtcbiAgbGlnaHQucG9zaXRpb24ueSA9IG9yaWdpblk7XG5cbiAgdmFyIHBhcnRpY2xlcyA9IG5ldyBQYXJ0aWNsZVN5c3RlbShcbiAge1xuICAgICAgXCJpbWFnZXNcIjpbXCJtb3RoZXJTaGluZS5wbmdcIl0sXG4gICAgICBcIm51bVBhcnRpY2xlc1wiOjEwMCxcbiAgICAgIFwiZW1pc3Npb25zUGVyVXBkYXRlXCI6MSxcbiAgICAgIFwiZW1pc3Npb25zSW50ZXJ2YWxcIjoyLFxuICAgICAgXCJhbHBoYVwiOjEsXG4gICAgICBcInByb3BlcnRpZXNcIjpcbiAgICAgIHtcbiAgICAgICAgXCJyYW5kb21TcGF3blhcIjoxLFxuICAgICAgICBcInJhbmRvbVNwYXduWVwiOjEsXG4gICAgICAgIFwibGlmZVwiOjMwLFxuICAgICAgICBcInJhbmRvbUxpZmVcIjoxMDAsXG4gICAgICAgIFwiZm9yY2VYXCI6MCxcbiAgICAgICAgXCJmb3JjZVlcIjowLFxuICAgICAgICBcInJhbmRvbUZvcmNlWFwiOjAuMDEsXG4gICAgICAgIFwicmFuZG9tRm9yY2VZXCI6MC4wMSxcbiAgICAgICAgXCJ2ZWxvY2l0eVhcIjowLFxuICAgICAgICBcInZlbG9jaXR5WVwiOjAsXG4gICAgICAgIFwicmFuZG9tVmVsb2NpdHlYXCI6MC4xLFxuICAgICAgICBcInJhbmRvbVZlbG9jaXR5WVwiOjAuMSxcbiAgICAgICAgXCJzY2FsZVwiOjAuMSxcbiAgICAgICAgXCJncm93dGhcIjowLjAwMSxcbiAgICAgICAgXCJyYW5kb21TY2FsZVwiOjAuMDQsXG4gICAgICAgIFwiYWxwaGFTdGFydFwiOjAsXG4gICAgICAgIFwiYWxwaGFGaW5pc2hcIjowLFxuICAgICAgICBcImFscGhhUmF0aW9cIjowLjIsXG4gICAgICAgIFwidG9ycXVlXCI6MCxcbiAgICAgICAgXCJyYW5kb21Ub3JxdWVcIjowXG4gICAgICB9XG4gIH0pO1xuICBwYXJ0aWNsZXMudmlldy5hbHBoYSA9IDAuNTtcblxuICBjb250YWluZXIuYWRkQ2hpbGQocGFydGljbGVzLnZpZXcpO1xuICBjb250YWluZXIuYWRkQ2hpbGQodGhpcy52aWV3KTtcblxuICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKClcbiAge1xuICAgICAgc2VsZi52aWV3LnBvc2l0aW9uLnggPSBsaWdodC5wb3NpdGlvbi54O1xuICAgICAgc2VsZi52aWV3LnBvc2l0aW9uLnkgPSBsaWdodC5wb3NpdGlvbi55O1xuXG4gICAgICBwYXJ0aWNsZXMucHJvcGVydGllcy5jZW50ZXJYID0gc2VsZi52aWV3LnBvc2l0aW9uLng7XG4gICAgICBwYXJ0aWNsZXMucHJvcGVydGllcy5jZW50ZXJZID0gc2VsZi52aWV3LnBvc2l0aW9uLnkgLSAxMDtcbiAgICAgIHBhcnRpY2xlcy51cGRhdGUoKTtcblxuICAgICAgdmFyIG9yaWVudGF0aW9uID0gbGlnaHQucG9zaXRpb24ueCAtIGdhbWUucGxheWVyLnZpZXcucG9zaXRpb24ueDtcblxuICAgICAgaWYgKG9yaWVudGF0aW9uIDwgMClcbiAgICAgIHtcbiAgICAgICAgbW92aWUuc2NhbGUueCA9IC0xO1xuICAgICAgfVxuICAgICAgaWYgKG9yaWVudGF0aW9uID4gMClcbiAgICAgIHtcbiAgICAgICAgbW92aWUuc2NhbGUueCA9IDE7XG4gICAgICB9XG4gIH1cblxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBQbGF0Zm9ybUJlaGF2aW9yKGNvbnRhaW5lciwgcHJvcGVydGllcykge1xuXG5cdHZhciB2aWV3ID0gbmV3IFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lcigpO1xuXHR2aWV3LnBvc2l0aW9uLnggPSBwcm9wZXJ0aWVzLng7XG5cdHZpZXcucG9zaXRpb24ueSA9IHByb3BlcnRpZXMueTtcblxuXHRjb250YWluZXIuYWRkQ2hpbGQodmlldyk7XG5cblx0c2V0dXBTa2luKCk7XG5cblx0ZnVuY3Rpb24gc2V0dXBTa2luKClcblx0e1xuXHRcdHZhciB3ID0gNDA7XG5cdFx0dmFyIGggPSA0MDtcblx0XHR2YXIgY29scyA9IE1hdGguZmxvb3IocHJvcGVydGllcy53aWR0aC93KTtcblx0XHR2YXIgcm93cyA9IE1hdGguZmxvb3IocHJvcGVydGllcy5oZWlnaHQvaCk7XG5cdFx0dmFyIGFtb3VudCA9IGNvbHMqcm93cztcblx0XHR2YXIgcHggPSAwO1xuXHRcdHZhciBweSA9IDA7XG5cdFx0XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFtb3VudDsgaSsrKVxuXHRcdHtcblx0XHRcdHB4ID0gaSVjb2xzO1xuXHRcdFx0cHkgPSBNYXRoLmZsb29yKGkvY29scyk7XG5cdFx0XHR2YXIgdGV4dHVyZU5hbWUgPSBweSA9PSAwID8gXCJ0aWxlV29vZDAxLnBuZ1wiIDogXCJ0aWxlV29vZDAyLnBuZ1wiO1xuXHRcdFx0dmFyIHRleHR1cmUgPSBQSVhJLlRleHR1cmUuZnJvbUltYWdlKHRleHR1cmVOYW1lKTtcblx0XHRcdHZhciB0aWxlID0gbmV3IFBJWEkuU3ByaXRlKHRleHR1cmUpO1xuXHRcdFx0dGlsZS5wb3NpdGlvbi54ID0gcHgqdztcblx0XHRcdHRpbGUucG9zaXRpb24ueSA9IHB5Kmg7XG5cdFx0XHR2aWV3LmFkZENoaWxkKHRpbGUpO1xuXHRcdH1cdFxuXHR9XG5cblx0XG5cblx0dGhpcy51cGRhdGUgPSBmdW5jdGlvbigpXG5cdHtcblxuXHR9XG5cblx0dGhpcy52aWV3ID0gdmlldztcbn1cbiIsInZhciBUd2VlbmFibGUgPSByZXF1aXJlKCcuLi92ZW5kb3Ivc2hpZnR5Jyk7XG52YXIgUGFydGljbGVTeXN0ZW0gPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL1BhcnRpY2xlU3lzdGVtLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gU3dpdGNoQmVoYXZpb3IoY29udGFpbmVyLCBkYXRhKSB7XG5cdHZhciBzZWxmID0gdGhpcyxcbiAgICBncmlkU2l6ZSA9IGRhdGEucHJvcGVydGllcy5zaXplIHx8IGRhdGEuaGVpZ2h0LFxuICAgIG1vdmVYID0gZGF0YS5wcm9wZXJ0aWVzLm1vdmVYICogZ3JpZFNpemUsXG4gICAgbW92ZVkgPSBkYXRhLnByb3BlcnRpZXMubW92ZVkgKiBncmlkU2l6ZSxcbiAgICBsaWdodE9yaWcgPSBmYWxzZSxcbiAgICBsaWdodERlc3QgPSB7IHg6IGRhdGEucHJvcGVydGllcy5tb3ZlWCAqIGdyaWRTaXplLCB5OiBkYXRhLnByb3BlcnRpZXMubW92ZVkgKiBncmlkU2l6ZSB9LFxuICAgIGl0ZW1EYXRhID0gZGF0YSxcbiAgICBtb3ZpbmcgPSBmYWxzZSxcbiAgICBwcmVzc2VkID0gZmFsc2U7XG5cbiAgLy8vLy9yZXRyaXZlIHBvc2l0aW9uIGFuZCBzaXplIHNwZWNzXG4gIHZhciBvcmlnaW5YID0gZGF0YS54O1xuICB2YXIgb3JpZ2luWSA9IGRhdGEueTtcbiAgdmFyIHByZXNzZWQgPSBmYWxzZTtcblxuICAvLy8vL2NyZWF0ZSB2aXN1YWxcbiAgdmFyIHRleHR1cmVPZmYgPSBQSVhJLlRleHR1cmUuZnJvbUltYWdlKFwic3dpdGNoT2ZmLnBuZ1wiKTtcbiAgdmFyIHRleHR1cmVPbiA9IFBJWEkuVGV4dHVyZS5mcm9tSW1hZ2UoXCJzd2l0Y2hPbi5wbmdcIik7XG5cbiAgc2VsZi52aWV3ID0gbmV3IFBJWEkuU3ByaXRlKHRleHR1cmVPZmYpO1xuICBzZWxmLnZpZXcucG9zaXRpb24ueCA9IG9yaWdpblg7XG4gIHNlbGYudmlldy5wb3NpdGlvbi55ID0gb3JpZ2luWSAtIDI7XG5cbiAgdmFyIHBhcnRpY2xlcyA9IG5ldyBQYXJ0aWNsZVN5c3RlbShcbiAge1xuICAgICAgXCJpbWFnZXNcIjpbXCJwaXhlbFNoaW5lLnBuZ1wiXSxcbiAgICAgIFwibnVtUGFydGljbGVzXCI6MzAsXG4gICAgICBcImVtaXNzaW9uc1BlclVwZGF0ZVwiOjEsXG4gICAgICBcImVtaXNzaW9uc0ludGVydmFsXCI6MTAsXG4gICAgICBcImFscGhhXCI6MSxcbiAgICAgIFwicHJvcGVydGllc1wiOlxuICAgICAge1xuICAgICAgICBcInJhbmRvbVNwYXduWFwiOjIsXG4gICAgICAgIFwicmFuZG9tU3Bhd25ZXCI6MSxcbiAgICAgICAgXCJsaWZlXCI6NDAsXG4gICAgICAgIFwicmFuZG9tTGlmZVwiOjUsXG4gICAgICAgIFwiZm9yY2VYXCI6MCxcbiAgICAgICAgXCJmb3JjZVlcIjotMC4wMixcbiAgICAgICAgXCJyYW5kb21Gb3JjZVhcIjowLjAsXG4gICAgICAgIFwicmFuZG9tRm9yY2VZXCI6MC4wMSxcbiAgICAgICAgXCJ2ZWxvY2l0eVhcIjowLFxuICAgICAgICBcInZlbG9jaXR5WVwiOi0wLjEsXG4gICAgICAgIFwicmFuZG9tVmVsb2NpdHlYXCI6MC4wLFxuICAgICAgICBcInJhbmRvbVZlbG9jaXR5WVwiOjAuMCxcbiAgICAgICAgXCJzY2FsZVwiOjEsXG4gICAgICAgIFwiZ3Jvd3RoXCI6LTAuMDAxLFxuICAgICAgICBcInJhbmRvbVNjYWxlXCI6MC41LFxuICAgICAgICBcImFscGhhU3RhcnRcIjoxLFxuICAgICAgICBcImFscGhhRmluaXNoXCI6MCxcbiAgICAgICAgXCJhbHBoYVJhdGlvXCI6MC4yLFxuICAgICAgICBcInRvcnF1ZVwiOjAsXG4gICAgICAgIFwicmFuZG9tVG9ycXVlXCI6MFxuICAgICAgfVxuICB9KTtcblxuICBjb250YWluZXIuYWRkQ2hpbGQodGhpcy52aWV3KTtcbiAgY29udGFpbmVyLmFkZENoaWxkKHBhcnRpY2xlcy52aWV3KTtcbiAgcGFydGljbGVzLnByb3BlcnRpZXMuY2VudGVyWSA9IHNlbGYudmlldy5wb3NpdGlvbi55ICsgMjU7XG5cbiAgdGhpcy50cmlnZ2VyID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gd2hlbiBwcmVzc2luZyBmb3IgdGhlIGZpcnN0IHRpbWUsIHRoZSBvcmluYWwgbGlnaHQgcG9zaXRpb24gaXMgc3RvcmVkIHRvIHJldmVydC5cbiAgICAvLyBpZiAoIXByZXNzZWQgJiYgIWxpZ2h0T3JpZykge1xuICAgIC8vICAgbGlnaHRPcmlnID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShsaWdodC5wb3NpdGlvbikpO1xuICAgIC8vIH1cblxuICAgIC8vIHZhciBkZXN0ID0gKCFwcmVzc2VkKSA/IGxpZ2h0RGVzdCA6IGxpZ2h0T3JpZztcbiAgICAvLyBwcmVzc2VkID0gIXByZXNzZWQ7XG5cbiAgICBpZiAoIXByZXNzZWQpXG4gICAge1xuICAgICAgc2VsZi52aWV3LnRleHR1cmUgPSB0ZXh0dXJlT247XG4gICAgICBzZWxmLnZpZXcucG9zaXRpb24ueSA9IG9yaWdpblkgKyAxMjtcbiAgICAgIHBhcnRpY2xlcy5wcm9wZXJ0aWVzLmNlbnRlclkgPSBzZWxmLnZpZXcucG9zaXRpb24ueSArIDk7XG4gICAgICBwcmVzc2VkID0gdHJ1ZTtcbiAgICAgIGdhbWUucmVzb3VyY2VzLnN3aWNoZXJTb3VuZC5wbGF5KCk7XG4gICAgICBjb250YWluZXIuYWRkQ2hpbGQocGFydGljbGVzLnZpZXcpO1xuICAgIH1cbiAgICAvLyBlbHNlXG4gICAgLy8ge1xuICAgIC8vICAgc2VsZi52aWV3LnRleHR1cmUgPSB0ZXh0dXJlT2ZmO1xuICAgIC8vIH1cblxuICAgIC8vIHZhciB0d2VlbmFibGUgPSBuZXcgVHdlZW5hYmxlKCk7XG4gICAgLy8gdHdlZW5hYmxlLnR3ZWVuKHtcbiAgICAvLyAgIGZyb206IGxpZ2h0LnBvc2l0aW9uLFxuICAgIC8vICAgdG86ICAgZGVzdCxcbiAgICAvLyAgIGR1cmF0aW9uOiAxMDAwLFxuICAgIC8vICAgZWFzaW5nOiAnZWFzZU91dEN1YmljJyxcbiAgICAvLyAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gICAgIG1vdmluZyA9IHRydWU7XG4gICAgLy8gICB9LFxuICAgIC8vICAgZmluaXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gICAgIG1vdmluZyA9IGZhbHNlO1xuICAgIC8vICAgfVxuICAgIC8vIH0pO1xuICB9XG5cblx0dGhpcy51cGRhdGUgPSBmdW5jdGlvbihnYW1lKVxuXHR7XG4gICAgaWYgKHByZXNzZWQpXG4gICAge1xuICAgICAgICBwYXJ0aWNsZXMucHJvcGVydGllcy5jZW50ZXJYID0gc2VsZi52aWV3LnBvc2l0aW9uLnggKyAxNTtcbiAgICAgICAgcGFydGljbGVzLnVwZGF0ZSgpOyBcbiAgICB9XG4gICAgICBcbiAgICAgIFxuICAgIFxuXG4gICAgaWYocHJlc3NlZClcbiAgICAgIHJldHVybjtcblxuXHRcdC8vY29uc29sZS5sb2coZ2FtZS5wbGF5ZXIuZG9Db2xsaWRlKGl0ZW1EYXRhLngsaXRlbURhdGEueSwgaXRlbURhdGEud2lkdGgsaXRlbURhdGEuaGVpZ2h0KSxnYW1lLmlucHV0LktleS5pc0Rvd24oMzgpKTtcblx0XHRpZihnYW1lLnBsYXllci5kb0NvbGxpZGUoaXRlbURhdGEueCxpdGVtRGF0YS55LCBpdGVtRGF0YS53aWR0aCxpdGVtRGF0YS5oZWlnaHQpICYmICFtb3ZpbmcpXG5cdFx0e1xuXHRcdFx0bW92aW5nID0gdHJ1ZTtcbiAgICAgIGdhbWUubGV2ZWwubnVtU3dpdGNoZXMgLS07XG4gICAgICBlbWl0dGVyLmVtaXQoJ3N3aXRjaC5wcmVzc2VkJyk7XG5cdFx0XHRzZWxmLnRyaWdnZXIoKTtcblx0XHR9XG5cdH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gUGFydGljbGVTeXN0ZW0ocGFydGljbGVzQ29uZmlnKVxue1xuXHR2YXIgdmlldyA9IG51bGw7XG5cdHZhciBwcm9wZXJ0aWVzID0gbnVsbDtcblx0dmFyIGZpcnN0UGFydGljbGUgPSBudWxsO1xuXHR2YXIgbGFzdFBhcnRpY2xlID0gbnVsbDtcblx0dmFyIG5leHRQYXJ0aWNsZSA9IDA7XG5cdHZhciBjb3VudCA9IDA7XG5cdHZhciBudW1QYXJ0aWNsZXMgPSAyMDtcblx0dmFyIGltYWdlcyA9IFtdO1xuXHR2YXIgc2VsZiA9IHRoaXM7XG5cdHZhciBwYXVzZWQgPSBmYWxzZTtcblxuXHRzZWxmLmVtaXNzaW9uc0ludGVydmFsID0gMTtcblx0c2VsZi5lbWlzc2lvbnNQZXJVcGRhdGUgPSAxO1xuXG5cdE1hdGgucmFuZG9tUmFuZ2UgPSBmdW5jdGlvbihtaW4sIG1heCwgcm91bmRlZClcblx0e1xuXHRcdHZhciBkaWZmID0gbWF4IC0gbWluO1xuXHRcdHZhciByZXN1bHQgPSBtaW4gKyBkaWZmKk1hdGgucmFuZG9tKCk7XG5cdFx0aWYgKHJvdW5kZWQpIHJlc3VsdCA9IE1hdGgucm91bmQocmVzdWx0KTtcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0aW5pdCgpO1xuXG5cdGZ1bmN0aW9uIGluaXQoKVxuXHR7XG5cdFx0dmlldyA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcblx0XHRwcm9wZXJ0aWVzID0gbmV3IFBhcnRpY2xlUHJvcGVydGllcygpO1xuXHRcdHNldHVwKHBhcnRpY2xlc0NvbmZpZyk7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXR1cChjb25maWcpXG5cdHtcblx0XHRjbGVhcigpO1xuXG5cdFx0aWYgKGNvbmZpZy5udW1QYXJ0aWNsZXMgIT0gbnVsbCkgbnVtUGFydGljbGVzID0gY29uZmlnLm51bVBhcnRpY2xlcztcblx0XHRpZiAoY29uZmlnLmltYWdlcyAhPSBudWxsKSBpbWFnZXMgPSBjb25maWcuaW1hZ2VzO1xuXHRcdGlmIChjb25maWcuZW1pc3Npb25zSW50ZXJ2YWwgIT0gbnVsbCkgc2VsZi5lbWlzc2lvbnNJbnRlcnZhbCA9IGNvbmZpZy5lbWlzc2lvbnNJbnRlcnZhbDtcblx0XHRpZiAoY29uZmlnLmVtaXNzaW9uc1BlclVwZGF0ZSAhPSBudWxsKSBzZWxmLmVtaXNzaW9uc1BlclVwZGF0ZSA9IGNvbmZpZy5lbWlzc2lvbnNQZXJVcGRhdGU7XG5cdFx0aWYgKGNvbmZpZy5hbHBoYSAhPSBudWxsKSB2aWV3LmFscGhhID0gY29uZmlnLmFscGhhO1xuXG5cdFx0aWYgKGNvbmZpZy5wcm9wZXJ0aWVzICE9IG51bGwpIHtcblx0XHRcdGZvciAodmFyIGZpZWxkIGluIGNvbmZpZy5wcm9wZXJ0aWVzKSB7XG5cdFx0XHRcdHByb3BlcnRpZXNbZmllbGRdID0gY29uZmlnLnByb3BlcnRpZXNbZmllbGRdO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHZhciBqID0gMDtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG51bVBhcnRpY2xlczsgaSsrKSB7XG5cdFx0XHR2YXIgcCA9IG5ldyBQYXJ0aWNsZShpbWFnZXNbal0pO1xuXHRcdFx0dmlldy5hZGRDaGlsZChwLnZpZXcpO1xuXHRcdFx0aWYgKGZpcnN0UGFydGljbGUgPT0gbnVsbCkgZmlyc3RQYXJ0aWNsZSA9IHA7XG5cdFx0XHRpZiAobGFzdFBhcnRpY2xlICE9IG51bGwpIGxhc3RQYXJ0aWNsZS5uZXh0ID0gcDtcblx0XHRcdGxhc3RQYXJ0aWNsZSA9IHA7XG5cdFx0XHRqKys7XG5cdFx0XHRpZiAoaiA+PSBpbWFnZXMubGVuZ3RoKSBqID0gMDtcblx0XHR9XG5cblx0XHRuZXh0UGFydGljbGUgPSBmaXJzdFBhcnRpY2xlO1xuXHR9XG5cblx0ZnVuY3Rpb24gY2xlYXIoKVxuXHR7XG5cdFx0dmFyIHAgPSBmaXJzdFBhcnRpY2xlO1xuXHRcdHdoaWxlIChwICE9IG51bGwpIHtcblx0XHRcdHAuZGlzcG9zZSgpO1xuXHRcdFx0cCA9IHAubmV4dDtcblx0XHR9XG5cblx0XHRmaXJzdFBhcnRpY2xlID0gbnVsbDtcblx0XHRsYXN0UGFydGljbGUgPSBudWxsO1xuXHRcdG5leHRQYXJ0aWNsZSA9IG51bGw7XG5cdH1cblxuXHRmdW5jdGlvbiB1cGRhdGUodGltZXN0YW1wKVxuXHR7XG5cdFx0aWYgKGNvdW50ID09IDAgJiYgIXBhdXNlZCkgZW1pdChzZWxmLmVtaXNzaW9uc1BlclVwZGF0ZSk7XG5cdFx0Y291bnQrKztcblx0XHRpZiAoY291bnQgPT0gc2VsZi5lbWlzc2lvbnNJbnRlcnZhbCkgY291bnQgPSAwO1xuXG5cdFx0dmFyIHAgPSBmaXJzdFBhcnRpY2xlO1xuXHRcdHdoaWxlIChwICE9IG51bGwpIHtcblx0XHRcdGlmIChwLmxpdmluZykge1xuXHRcdFx0XHRwLnVwZGF0ZSh0aW1lc3RhbXApO1xuXHRcdFx0fVxuXHRcdFx0cCA9IHAubmV4dDtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBlbWl0KGFtb3VudClcblx0e1xuXHRcdHdoaWxlIChhbW91bnQtLSkge1xuXHRcdFx0dmFyIHAgPSBuZXh0UGFydGljbGU7XG5cdFx0XHRpZiAocCA9PSBudWxsKSBwID0gZmlyc3RQYXJ0aWNsZTtcblx0XHRcdHAuc3Bhd24ocHJvcGVydGllcyk7XG5cdFx0XHRuZXh0UGFydGljbGUgPSBwLm5leHQ7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gZ2V0Q291bnQoKVxuXHR7XG5cdFx0cmV0dXJuIGNvdW50O1xuXHR9XG5cblx0ZnVuY3Rpb24gcGF1c2VFbWlzc2lvbnMoKVxuXHR7XG5cdFx0cGF1c2VkID0gdHJ1ZTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJlc3VtZUVtaXNzaW9ucygpXG5cdHtcblx0XHRwYXVzZWQgPSBmYWxzZTtcblx0fVxuXG5cdGZ1bmN0aW9uIGRpc3Bvc2UoKVxuXHR7XG5cdFx0Y2xlYXIoKTtcblx0XHRpZiAodmlldyAmJiB2aWV3LnBhcmVudCkgdmlldy5wYXJlbnQucmVtb3ZlQ2hpbGQodmlldyk7XG5cdFx0dmlldyA9IG51bGw7XG5cdH1cblxuXHR0aGlzLnNldHVwID0gc2V0dXA7XG5cdHRoaXMucHJvcGVydGllcyA9IHByb3BlcnRpZXM7XG5cdHRoaXMudmlldyA9IHZpZXc7XG5cdHRoaXMudXBkYXRlID0gdXBkYXRlO1xuXHR0aGlzLmVtaXQgPSBlbWl0O1xuXHR0aGlzLmdldENvdW50ID0gZ2V0Q291bnQ7XG5cdHRoaXMucGF1c2VFbWlzc2lvbnMgPSBwYXVzZUVtaXNzaW9ucztcblx0dGhpcy5yZXN1bWVFbWlzc2lvbnMgPSByZXN1bWVFbWlzc2lvbnM7XG5cdHRoaXMuZGlzcG9zZSA9IGRpc3Bvc2U7XG5cbn1cblxuXHQvLyBJTlRFUk5BTCBDTEFTU0VTIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0UGFydGljbGUgPSBmdW5jdGlvbihpbWFnZSlcblx0e1xuXHRcdHZhciB2aWV3ID0gbnVsbDtcblx0XHR2YXIgcHJvcGVydGllcyA9IG51bGw7XG5cdFx0dmFyIHBhcmFtcyA9IG51bGw7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0aW5pdCgpO1xuXG5cdFx0ZnVuY3Rpb24gaW5pdCgpXG5cdFx0e1xuXHRcdFx0dmlldyA9IFBJWEkuU3ByaXRlLmZyb21GcmFtZShpbWFnZSk7XG5cdFx0XHR2aWV3LmFuY2hvci54ID0gMC41O1xuXHRcdFx0dmlldy5hbmNob3IueSA9IDAuNTtcblx0XHRcdHByb3BlcnRpZXMgPSBuZXcgUGFydGljbGVQcm9wZXJ0aWVzKCk7XG5cdFx0XHR2aWV3LnZpc2libGUgPSBmYWxzZTtcblxuXHRcdFx0cGFyYW1zID0ge307XG5cdFx0XHRwYXJhbXMubGlmZUNvdW50ID0gMDtcblx0XHRcdHBhcmFtcy5saWZlVG90YWwgPSAwO1xuXHRcdFx0cGFyYW1zLmFscGhhVGltZSA9IDAuMDtcblx0XHRcdHBhcmFtcy5mYWRlSW5Fdm9sdXRpb24gPSAwLjA7XG5cdFx0XHRwYXJhbXMuZmFkZU91dEV2b2x1dGlvbiA9IDAuMDtcblx0XHRcdHBhcmFtcy5zdGVwVG9TdGFydEZhZGVPdXQgPSAwO1xuXG5cdFx0XHRwcm9wZXJ0aWVzID0ge307XG5cdFx0fVxuXG5cdFx0dGhpcy5saXZpbmcgPSBmYWxzZTtcblx0XHR0aGlzLm5leHQgPSBudWxsO1xuXHRcdHRoaXMudmlldyA9IHZpZXc7XG5cdFx0dGhpcy5wcm9wZXJ0aWVzID0gcHJvcGVydGllcztcblx0XHR0aGlzLnBhcmFtcyA9IHBhcmFtcztcblx0fVxuXG5cdFBhcnRpY2xlLnByb3RvdHlwZS5zcGF3biA9IGZ1bmN0aW9uKG5ld1Byb3BlcnRpZXMpXG5cdHtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0dmFyIHByb3BlcnRpZXMgPSB0aGlzLnByb3BlcnRpZXM7XG5cdFx0dmFyIHBhcmFtcyA9IHRoaXMucGFyYW1zO1xuXHRcdHZhciB2aWV3ID0gdGhpcy52aWV3O1xuXG5cdFx0Zm9yICh2YXIgZmllbGQgaW4gbmV3UHJvcGVydGllcykge1xuXHRcdFx0cHJvcGVydGllc1tmaWVsZF0gPSBuZXdQcm9wZXJ0aWVzW2ZpZWxkXTtcblx0XHR9XG5cblx0XHR0aGlzLmxpdmluZyA9IHRydWU7XG5cblx0XHRwYXJhbXMubGlmZUNvdW50ID0gcHJvcGVydGllcy5saWZlICsgTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKnByb3BlcnRpZXMucmFuZG9tTGlmZSk7XG5cdFx0cGFyYW1zLmxpZmVUb3RhbCA9IHBhcmFtcy5saWZlQ291bnQ7XG5cblx0XHR2aWV3LnZpc2libGUgPSB0cnVlO1xuXHRcdHZpZXcucG9zaXRpb24ueCA9IHByb3BlcnRpZXMuY2VudGVyWCArIE1hdGgucmFuZG9tUmFuZ2UoLXByb3BlcnRpZXMucmFuZG9tU3Bhd25YLCBwcm9wZXJ0aWVzLnJhbmRvbVNwYXduWCk7XG5cdFx0dmlldy5wb3NpdGlvbi55ID0gcHJvcGVydGllcy5jZW50ZXJZICsgTWF0aC5yYW5kb21SYW5nZSgtcHJvcGVydGllcy5yYW5kb21TcGF3blksIHByb3BlcnRpZXMucmFuZG9tU3Bhd25ZKTtcblx0XHR2aWV3LnNjYWxlLnggPSB2aWV3LnNjYWxlLnkgPSBwcm9wZXJ0aWVzLnNjYWxlO1xuXHRcdHZpZXcuYWxwaGEgPSBwcm9wZXJ0aWVzLmFscGhhU3RhcnQ7XG5cblx0XHRpZiAocHJvcGVydGllcy5yYW5kb21WZWxvY2l0eVggIT0gMCkge1xuXHRcdFx0cHJvcGVydGllcy52ZWxvY2l0eVggKz0gTWF0aC5yYW5kb21SYW5nZSgtcHJvcGVydGllcy5yYW5kb21WZWxvY2l0eVgsIHByb3BlcnRpZXMucmFuZG9tVmVsb2NpdHlYKTtcblx0XHR9XG5cblx0XHRpZiAocHJvcGVydGllcy5yYW5kb21WZWxvY2l0eVkgIT0gMCkge1xuXHRcdFx0cHJvcGVydGllcy52ZWxvY2l0eVkgKz0gTWF0aC5yYW5kb21SYW5nZSgtcHJvcGVydGllcy5yYW5kb21WZWxvY2l0eVksIHByb3BlcnRpZXMucmFuZG9tVmVsb2NpdHlZKTtcblx0XHR9XG5cblx0XHRpZiAocHJvcGVydGllcy5yYW5kb21Gb3JjZVggIT0gMCkge1xuXHRcdFx0cHJvcGVydGllcy5mb3JjZVggKz0gTWF0aC5yYW5kb21SYW5nZSgtcHJvcGVydGllcy5yYW5kb21Gb3JjZVgsIHByb3BlcnRpZXMucmFuZG9tRm9yY2VYKTtcblx0XHR9XG5cblx0XHRpZiAocHJvcGVydGllcy5yYW5kb21Gb3JjZVkgIT0gMCkge1xuXHRcdFx0cHJvcGVydGllcy5mb3JjZVkgKz0gTWF0aC5yYW5kb21SYW5nZSgtcHJvcGVydGllcy5yYW5kb21Gb3JjZVksIHByb3BlcnRpZXMucmFuZG9tRm9yY2VZKTtcblx0XHR9XG5cblx0XHRpZiAocHJvcGVydGllcy5yYW5kb21TY2FsZSAhPSAwKSB7XG5cdFx0XHR2aWV3LnNjYWxlLnggPSB2aWV3LnNjYWxlLnkgPSBwcm9wZXJ0aWVzLnNjYWxlICsgTWF0aC5yYW5kb21SYW5nZSgtcHJvcGVydGllcy5yYW5kb21TY2FsZSwgcHJvcGVydGllcy5yYW5kb21TY2FsZSk7XG5cdFx0fVxuXG5cdFx0aWYgKHByb3BlcnRpZXMucmFuZG9tVG9ycXVlICE9IDApIHtcblx0XHRcdHByb3BlcnRpZXMudG9ycXVlICs9IE1hdGgucmFuZG9tUmFuZ2UoLXByb3BlcnRpZXMucmFuZG9tVG9ycXVlLCBwcm9wZXJ0aWVzLnJhbmRvbVRvcnF1ZSk7XG5cdFx0fVxuXG5cdFx0cGFyYW1zLmFscGhhVGltZSA9IE1hdGgucm91bmQocGFyYW1zLmxpZmVDb3VudCpwcm9wZXJ0aWVzLmFscGhhUmF0aW8pO1xuXHRcdHBhcmFtcy5mYWRlSW5Fdm9sdXRpb24gPSAoMS4wIC0gcHJvcGVydGllcy5hbHBoYVN0YXJ0KS9wYXJhbXMuYWxwaGFUaW1lO1xuXHRcdHBhcmFtcy5mYWRlT3V0RXZvbHV0aW9uID0gKDEuMCAtIHByb3BlcnRpZXMuYWxwaGFGaW5pc2gpL3BhcmFtcy5hbHBoYVRpbWU7XG5cdFx0cGFyYW1zLnN0ZXBUb1N0YXJ0RmFkZU91dCA9IHBhcmFtcy5hbHBoYVRpbWU7XG5cdH1cblxuXHRQYXJ0aWNsZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24odGltZXN0YW1wKVxuXHR7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdHZhciBwcm9wZXJ0aWVzID0gdGhpcy5wcm9wZXJ0aWVzO1xuXHRcdHZhciBwYXJhbXMgPSB0aGlzLnBhcmFtcztcblx0XHR2YXIgdmlldyA9IHRoaXMudmlldztcblxuXHRcdGlmICghc2VsZi5saXZpbmcpIHJldHVybjtcblxuXHRcdHZpZXcucG9zaXRpb24ueCArPSBwcm9wZXJ0aWVzLnZlbG9jaXR5WDtcblx0XHR2aWV3LnBvc2l0aW9uLnkgKz0gcHJvcGVydGllcy52ZWxvY2l0eVk7XG5cdFx0dmlldy5yb3RhdGlvbiArPSBwcm9wZXJ0aWVzLnRvcnF1ZTtcblx0XHRwcm9wZXJ0aWVzLnZlbG9jaXR5WCArPSBwcm9wZXJ0aWVzLmZvcmNlWDtcblx0XHRwcm9wZXJ0aWVzLnZlbG9jaXR5WSArPSBwcm9wZXJ0aWVzLmZvcmNlWTtcblxuXHRcdGlmIChwYXJhbXMubGlmZUNvdW50ID4gcGFyYW1zLmxpZmVUb3RhbCAtIHBhcmFtcy5hbHBoYVRpbWUpIHtcblx0ICAgIFx0dmlldy5hbHBoYSArPSBwYXJhbXMuZmFkZUluRXZvbHV0aW9uO1xuXHQgICAgXHRpZiAodmlldy5hbHBoYSA+IDEpIHZpZXcuYWxwaGEgPSAxO1xuXHQgICAgfVxuXG5cdCAgICBpZiAocGFyYW1zLmxpZmVDb3VudCA8PSBwYXJhbXMuYWxwaGFUaW1lKSB7XG5cdCAgICBcdHZpZXcuYWxwaGEgLT0gcGFyYW1zLmZhZGVPdXRFdm9sdXRpb247XG5cdCAgICBcdGlmICh2aWV3LmFscGhhIDwgMCkgdmlldy5hbHBoYSA9IDA7XG5cdCAgICB9XG5cblx0ICAgIGlmIChwcm9wZXJ0aWVzLmdyb3d0aCAhPSAwKSB7XG5cdCAgICBcdHZpZXcuc2NhbGUueCA9IHZpZXcuc2NhbGUueSA9ICh2aWV3LnNjYWxlLnggKyBwcm9wZXJ0aWVzLmdyb3d0aCk7XG5cdCAgICB9XG5cblx0XHRwYXJhbXMubGlmZUNvdW50LS07XG5cdFx0aWYgKHBhcmFtcy5saWZlQ291bnQgPD0gMCkgdGhpcy5kaWUoKTtcblx0fVxuXG5cdFBhcnRpY2xlLnByb3RvdHlwZS5kaWUgPSBmdW5jdGlvbigpXG5cdHtcblx0XHR0aGlzLmxpdmluZyA9IGZhbHNlO1xuXHRcdHRoaXMudmlldy52aXNpYmxlID0gZmFsc2U7XG5cdFx0dGhpcy52aWV3LmFscGhhID0gMDtcblx0fVxuXG5cdFBhcnRpY2xlLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24oKVxuXHR7XG5cdFx0aWYgKHRoaXMudmlldyA9PSBudWxsKSByZXR1cm47XG5cdFx0aWYgKHRoaXMudmlldy5wYXJlbnQpIHRoaXMudmlldy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcy52aWV3KTtcblxuXHRcdHRoaXMubGl2aW5nID0gZmFsc2U7XG5cdFx0dGhpcy5uZXh0ID0gbnVsbDtcblx0XHR0aGlzLnZpZXcgPSBudWxsO1xuXHRcdHRoaXMucHJvcGVydGllcyA9IG51bGw7XG5cdFx0dGhpcy5wYXJhbXMgPSBudWxsO1xuXHR9XG5cblx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHRQYXJ0aWNsZVByb3BlcnRpZXMgPSBmdW5jdGlvbigpXG5cdHtcblx0XHR0aGlzLnJhbmRvbVNwYXduWCA9IDA7XG5cdFx0dGhpcy5yYW5kb21TcGF3blkgPSAwO1xuXHRcdHRoaXMubGlmZSA9IDYwO1xuXHRcdHRoaXMucmFuZG9tTGlmZSA9IDA7XG5cdFx0dGhpcy5jZW50ZXJYID0gMDtcblx0XHR0aGlzLmNlbnRlclkgPSAwO1xuXHRcdHRoaXMuZm9yY2VYID0gMDtcblx0XHR0aGlzLmZvcmNlWSA9IDA7XG5cdFx0dGhpcy5yYW5kb21Gb3JjZVggPSAwO1xuXHRcdHRoaXMucmFuZG9tRm9yY2VZID0gMDtcblx0XHR0aGlzLnZlbG9jaXR5WCA9IDA7XG5cdFx0dGhpcy52ZWxvY2l0eVkgPSAwO1xuXHRcdHRoaXMucmFuZG9tVmVsb2NpdHlYID0gMDtcblx0XHR0aGlzLnJhbmRvbVZlbG9jaXR5WSA9IDA7XG5cdFx0dGhpcy5zY2FsZSA9IDE7XG5cdFx0dGhpcy5ncm93dGggPSAwLjA7XG5cdFx0dGhpcy5yYW5kb21TY2FsZSA9IDA7XG5cdFx0dGhpcy5hbHBoYVN0YXJ0ID0gMDtcblx0XHR0aGlzLmFscGhhRmluaXNoID0gMDtcblx0XHR0aGlzLmFscGhhUmF0aW8gPSAwLjE7XG5cdFx0dGhpcy50b3JxdWUgPSAwO1xuXHRcdHRoaXMucmFuZG9tVG9ycXVlID0gMDtcblx0fVxuIiwidmFyIFJlc291cmNlcyA9IHJlcXVpcmUoJy4vUmVzb3VyY2VzJyksXG4gIFByZWxvYWRlciA9IHJlcXVpcmUoJy4vUHJlbG9hZGVyJyksXG4gIExldmVsID0gcmVxdWlyZSgnLi9MZXZlbCcpLFxuICBCZWdpbiA9IHJlcXVpcmUoJy4vQmVnaW4nKSxcbiAgLy8gTGV2ZWxFbmQgPSByZXF1aXJlKCcuL0xldmVsRW5kJyksXG4gIEdhbWVPdmVyID0gcmVxdWlyZSgnLi9HYW1lT3ZlcicpLFxuICBMaWdodCA9IHJlcXVpcmUoJy4vTGlnaHQnKSxcbiAgVHdlZW5hYmxlID0gcmVxdWlyZSgnLi92ZW5kb3Ivc2hpZnR5JyksXG4gIEdhbWVJbnB1dCA9IHJlcXVpcmUoJy4vR2FtZUlucHV0LmpzJyksXG4gIFBsYXllciA9IHJlcXVpcmUoJy4vUGxheWVyLmpzJyk7XG4gIFBoeXNpY3MgPSByZXF1aXJlKCcuL1BoeXNpY3MuanMnKTtcbiAgVG9vbHMgPSByZXF1aXJlKCcuL1Rvb2xzLmpzJyk7XG5cbndpbmRvdy5Ud2VlbmFibGUgPSBUd2VlbmFibGU7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gR2FtZSgpIHtcbiAgdGhpcy5yZXNvdXJjZXMgPSBuZXcgUmVzb3VyY2VzKCk7XG5cbiAgLy8gc3RhZ2UuY2xpY2sgPSBmdW5jdGlvbihlKSB7XG4gIC8vICAgbGlnaHQueCA9IGUub3JpZ2luYWxFdmVudC54O1xuICAvLyAgIGxpZ2h0LnkgPSBlLm9yaWdpbmFsRXZlbnQueTtcbiAgLy8gfVxuXG4gIHdpbmRvdy5zY3JlZW5XaWR0aCA9ICh0eXBlb2YoZWplY3RhKT09XCJ1bmRlZmluZWRcIikgPyA5NjAgOiA0ODA7XG4gIHdpbmRvdy5zY3JlZW5IZWlnaHQgPSAodHlwZW9mKGVqZWN0YSk9PVwidW5kZWZpbmVkXCIpID8gNjQwIDogMzIwO1xuXG4gIHRoaXMucmVuZGVyZXIgPSBuZXcgUElYSS5DYW52YXNSZW5kZXJlcihzY3JlZW5XaWR0aCwgc2NyZWVuSGVpZ2h0LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyksIGZhbHNlIC8qIHRyYW5zcGFyZW50ICovLCBmYWxzZSAvKiBhbnRpYWxpYXMgKi8pO1xuICB0aGlzLnJlbmRlcmVyLnZpZXcuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgdGhpcy5yZW5kZXJlci52aWV3LnN0eWxlLmJvcmRlciA9IFwiMXB4IHNvbGlkXCI7XG5cbiAgdGhpcy5zdGFnZSA9IG5ldyBQSVhJLlN0YWdlKDB4MDBmZmZhLCB0cnVlKTtcblxuICAvLy8vSW5wdXRcbiAgdmFyIGlucHV0ID0gbnVsbDtcblxuICAvLy8vL1BsYXllclxuICB2YXIgcGxheWVyID0gbnVsbDtcbiAgdmFyIHBoeXNpY3MgPSBudWxsO1xuICB2YXIgZGlyZWN0aW9uID0gMDtcbiAgdmFyIGdsb3cgPSBudWxsO1xuXG4gIC8vIExldmVsSW5kZXhcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgbGV2ZWwgPSBudWxsO1xuICB2YXIgbG9zdCA9IGZhbHNlO1xuICB2YXIgZ2FtZVJ1bm5pbmcgPSBmYWxzZTtcbiAgd2luZG93LmxpZ2h0ID0gbmV3IExpZ2h0KDUwLCA1MCk7XG5cbiAgc2VsZi5sZXZlbCA9IGxldmVsO1xuXG4gIHZhciBsYXN0TW91c2VDbGljayA9IDAsXG4gICAgICBtb3VzZUNsaWNrSW50ZXJ2YWwgPSAxMDAwOyAvLyAxIHNlY29uZCB0byBjbGljayBhZ2FpblxuXG4gIHRoaXMucmVuZGVyZXIudmlldy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAvLyBwcmV2ZW50IGNsaWNrIG9uIGZpcnN0IGxldmVsXG4gICAgLy8gaWYgKCFzZWxmLmxldmVsKSB7IHJldHVybjsgfVxuXG4gICAgdmFyIGNsaWNrVGltZSA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG5cbiAgICBpZiAobGFzdE1vdXNlQ2xpY2sgKyBtb3VzZUNsaWNrSW50ZXJ2YWwgPj0gY2xpY2tUaW1lKSB7XG4gICAgICAvLyBkaXNzYWxsb3dlZFxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxhc3RNb3VzZUNsaWNrID0gY2xpY2tUaW1lO1xuXG4gICAgLy8gbGlnaHQucG9zaXRpb24ueCA9IGUub2Zmc2V0WDtcbiAgICAvLyBsaWdodC5wb3NpdGlvbi55ID0gZS5vZmZzZXRZO1xuXG4gICAgaWYgKHNlbGYuYnRuU291bmRPbi52aXNpYmxlID09PSB0cnVlKSB7XG4gICAgICBpZiAoZS5vZmZzZXRYID49IHNlbGYuYnRuU291bmRPbi54ICYmIGUub2Zmc2V0WCA8IHNlbGYuYnRuU291bmRPbi54ICsgc2VsZi5idG5Tb3VuZE9uLndpZHRoXG4gICAgICAgICYmIGUub2Zmc2V0WSA+PSBzZWxmLmJ0blNvdW5kT24ueSAmJiBlLm9mZnNldFkgPCBzZWxmLmJ0blNvdW5kT24ueSArIHNlbGYuYnRuU291bmRPbi5oZWlnaHQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzZWxmLmJ0blNvdW5kT2ZmLnZpc2libGUgPT09IHRydWUpIHtcbiAgICAgIGlmIChlLm9mZnNldFggPj0gc2VsZi5idG5Tb3VuZE9mZi54ICYmIGUub2Zmc2V0WCA8IHNlbGYuYnRuU291bmRPZmYueCArIHNlbGYuYnRuU291bmRPZmYud2lkdGhcbiAgICAgICAgJiYgZS5vZmZzZXRZID49IHNlbGYuYnRuU291bmRPZmYueSAmJiBlLm9mZnNldFkgPCBzZWxmLmJ0blNvdW5kT2ZmLnkgKyBzZWxmLmJ0blNvdW5kT2ZmLmhlaWdodCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNlbGYuYnRuUmVzdGFydC52aXNpYmxlID09PSB0cnVlKSB7XG4gICAgICBpZiAoZS5vZmZzZXRYID49IHNlbGYuYnRuUmVzdGFydC54ICYmIGUub2Zmc2V0WCA8IHNlbGYuYnRuUmVzdGFydC54ICsgc2VsZi5idG5SZXN0YXJ0LndpZHRoXG4gICAgICAgICYmIGUub2Zmc2V0WSA+PSBzZWxmLmJ0blJlc3RhcnQueSAmJiBlLm9mZnNldFkgPCBzZWxmLmJ0blJlc3RhcnQueSArIHNlbGYuYnRuUmVzdGFydC5oZWlnaHQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzZWxmLmxldmVsICE9PSBudWxsKSB7XG4gICAgICBnYW1lLnJlc291cmNlcy5tb3RoZXJTb3VuZC5wbGF5KCk7XG4gICAgfVxuXG4gICAgdmFyIGRlc3QgPSB7IHg6ZS5vZmZzZXRYLCB5OmUub2Zmc2V0WSB9O1xuICAgIHZhciB0d2VlbmFibGUgPSBuZXcgVHdlZW5hYmxlKCk7XG4gICAgdHdlZW5hYmxlLnR3ZWVuKHtcbiAgICAgIGZyb206IGxpZ2h0LnBvc2l0aW9uLFxuICAgICAgdG86ICAgZGVzdCxcbiAgICAgIGR1cmF0aW9uOiBtb3VzZUNsaWNrSW50ZXJ2YWwsXG4gICAgICBlYXNpbmc6ICdlYXNlT3V0Q3ViaWMnLFxuICAgICAgc3RhcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbW92aW5nID0gdHJ1ZTtcbiAgICAgIH0sXG4gICAgICBmaW5pc2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbW92aW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pXG5cbiAgdmFyIGxpZ2h0R3JhcGhpY3MgPSBuZXcgUElYSS5HcmFwaGljcygpLFxuICBsaWdodENvbnRhaW5lciA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcblxuICB0aGlzLnJlc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaSA9IHNlbGYubGV2ZWwuaW5kZXg7XG4gICAgc2VsZi5sZXZlbC5kaXNwb3NlKCk7XG4gICAgdGhpcy5sb2FkTGV2ZWwoaSk7XG4gIH1cblxuICB0aGlzLm5leHRMZXZlbCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubG9hZExldmVsKHRoaXMubGV2ZWwuaW5kZXggKyAxKTtcbiAgfVxuXG4gIHRoaXMuc2V0TGV2ZWwgPSBmdW5jdGlvbihsZXZlbERhdGEsIGxldmVsSW5kZXgpIHtcbiAgICB2YXIgaCA9IHNlbGYucmVuZGVyZXIuaGVpZ2h0ICsgODAsXG4gICAgICAgIHcgPSBzZWxmLnJlbmRlcmVyLndpZHRoLFxuICAgICAgICBmcmFtZUJvcmRlciA9IDUwO1xuXG4gICAgdmFyIG5ld0xldmVsID0gbmV3IExldmVsKHNlbGYsIGxldmVsSW5kZXgpO1xuXG4gICAgLy8gYWRkIHN0YWdlIGJvcmRlciB0byBsZXZlbCBzZWdtZW50c1xuICAgIG5ld0xldmVsLnNlZ21lbnRzLnVuc2hpZnQoIHthOnt4Oi1mcmFtZUJvcmRlcix5Oi1mcmFtZUJvcmRlcn0sIGI6e3g6dyx5Oi1mcmFtZUJvcmRlcn19ICk7XG4gICAgbmV3TGV2ZWwuc2VnbWVudHMudW5zaGlmdCgge2E6e3g6dyx5Oi1mcmFtZUJvcmRlcn0sIGI6e3g6dyx5Omh9fSApO1xuICAgIG5ld0xldmVsLnNlZ21lbnRzLnVuc2hpZnQoIHthOnt4OncseTpofSwgYjp7eDotZnJhbWVCb3JkZXIseTpofX0gKTtcbiAgICBuZXdMZXZlbC5zZWdtZW50cy51bnNoaWZ0KCB7YTp7eDotZnJhbWVCb3JkZXIseTpofSwgYjp7eDotZnJhbWVCb3JkZXIseTotZnJhbWVCb3JkZXJ9fSApO1xuXG4gICAgbmV3TGV2ZWwucGFyc2UobGV2ZWxEYXRhKTtcblxuICAgIHNlbGYubGV2ZWwgPSBuZXdMZXZlbDtcbiAgICBzZWxmLnN0YWdlLmFkZENoaWxkQXQoc2VsZi5sZXZlbC52aWV3LCAwKTtcblxuICAgIGxpZ2h0LnNldFNlZ21lbnRzKG5ld0xldmVsLnNlZ21lbnRzKTtcblxuICAgIC8vIGFkZCBsZXZlbCBjb250YWluZXIgdG8gc3RhZ2UuXG4gICAgZ2FtZS5zdGFnZS5hZGRDaGlsZChuZXdMZXZlbC5jb250YWluZXIpO1xuXG4gICAgLy8gcmUtY3JlYXRlIHRoZSBwbGF5ZXJcbiAgICBwbGF5ZXIgPSBuZXcgUGxheWVyKG5ld0xldmVsLmNvbnRhaW5lciwgbmV3TGV2ZWwucGxheWVyUG9zLngsbmV3TGV2ZWwucGxheWVyUG9zLnkpO1xuICAgIHBoeXNpY3MucGxheWVyUG9zaXRpb24ueCA9IHBsYXllci52aWV3LnBvc2l0aW9uLng7XG4gICAgcGh5c2ljcy5wbGF5ZXJQb3NpdGlvbi55ID0gcGxheWVyLnZpZXcucG9zaXRpb24ueTtcblxuICAgIC8vIGNvbnNvbGUubG9nKG5ld0xldmVsLnBsYXllclBvcy54ICsgXCIgXCIgKyBuZXdMZXZlbC5wbGF5ZXJQb3MueSk7XG4gICAgc2VsZi5wbGF5ZXIgPSBwbGF5ZXI7XG5cbiAgICBzZWxmLmxvb3AoKTtcbiAgICBzZWxmLnN0YWdlLmFkZENoaWxkKGdsb3cpO1xuICB9O1xuXG4gIHRoaXMubG9hZExldmVsID0gZnVuY3Rpb24obGV2ZWxJbmRleCkge1xuICAgIGlmKCFpbnB1dClcbiAgICB7XG4gICAgICBpbnB1dCA9IG5ldyBHYW1lSW5wdXQoKTtcbiAgICAgIHNlbGYuaW5wdXQgPSBpbnB1dDtcbiAgICB9XG5cbiAgICBpZiAoIXBoeXNpY3Mpe1xuICAgICAgcGh5c2ljcyA9IG5ldyBQaHlzaWNzKCk7XG4gICAgfVxuXG4gICAgLy8gbGV2ZWxJbmRleCA9IDI7XG4gICAgLy8gY29uc29sZS5sb2coXCJsZXZlbC9sZXZlbFwiICsgbGV2ZWxJbmRleCArIFwiLmpzb25cIik7XG4gICAgdmFyIHBpeGlMb2FkZXIgPSBuZXcgUElYSS5Kc29uTG9hZGVyKFwibGV2ZWwvbGV2ZWxcIiArIGxldmVsSW5kZXggKyBcIi5qc29uXCIpO1xuICAgIHBpeGlMb2FkZXIub24oJ2xvYWRlZCcsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgLy9kYXRhIGlzIGluIGV2dC5jb250ZW50Lmpzb25cbiAgICAgIC8vIGNvbnNvbGUubG9nKFwianNvbiBsb2FkZWQhXCIpO1xuICAgICAgc2VsZi5zZXRMZXZlbChldnQuY29udGVudC5qc29uLCBsZXZlbEluZGV4KTtcbiAgICAgIGdhbWVSdW5uaW5nID0gdHJ1ZTtcbiAgICAgIGxvc3QgPSBmYWxzZTtcbiAgICB9KTtcblxuICAgIHBpeGlMb2FkZXIubG9hZCgpO1xuICB9XG5cbiAgdmFyIGxhc3RMaWdodFgsIGxhc3RMaWdodFk7XG5cbiAgdGhpcy51cGRhdGVMaWdodHMgPSBmdW5jdGlvbigpIHtcbiAgICAvLyBub3RoaW5nIHRvIHVwZGF0ZSwgc2tpcFxuXG4gICAgaWYgKGxpZ2h0LnBvc2l0aW9uLnggPT0gbGFzdExpZ2h0WCAmJiBsaWdodC5wb3NpdGlvbi55ID09IGxhc3RMaWdodFkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBGSVhNRVxuICAgIGlmIChsaWdodC5zZWdtZW50cy5sZW5ndGggPT0gMCB8fCAhdGhpcy5sZXZlbCB8fCB0aGlzLmxldmVsLnNlZ21lbnRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGlnaHRHcmFwaGljcy5jbGVhcigpO1xuXG4gICAgLy8gcmVtb3ZlIHByZXZpb3VzIGFkZGVkIGxpZ2h0IGl0ZW1zXG4gICAgaWYgKGxpZ2h0Q29udGFpbmVyLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgIGxpZ2h0Q29udGFpbmVyLnJlbW92ZUNoaWxkcmVuKCk7XG4gICAgfVxuXG4gICAgLy8gU2lnaHQgUG9seWdvbnNcbiAgICB2YXIgcG9seWdvbnMgPSBsaWdodC5nZXRTaWdodFBvbHlnb25zKCk7XG5cbiAgICAvLyBEUkFXIEFTIEEgR0lBTlQgUE9MWUdPTlxuXG4gICAgdmFyIHZlcnRpY2VzID0gcG9seWdvbnNbMF07XG4gICAgd2luZG93LnBvbHlnb25zID0gcG9seWdvbnNbMF07XG5cbiAgICAvLyBsaWdodEdyYXBoaWNzLmNsZWFyKCk7XG4gICAgLy8gbGlnaHRHcmFwaGljcy5iZWdpbkZpbGwoMHhGRkZGRkYpO1xuICAgIC8vIGxpZ2h0R3JhcGhpY3MubW92ZVRvKHZlcnRpY2VzWzBdLngsIHZlcnRpY2VzWzBdLnkpO1xuICAgIC8vIGZvciAodmFyIGkgPSAxOyBpPHZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgLy8gICB2YXIgdiA9IHZlcnRpY2VzW2ldO1xuICAgIC8vICAgbGlnaHRHcmFwaGljcy5saW5lVG8odi54LCB2LnkpO1xuICAgIC8vIH1cbiAgICAvLyBsaWdodEdyYXBoaWNzLmVuZEZpbGwoKTtcblxuICAgIGxpZ2h0R3JhcGhpY3MuY2xlYXIoKTtcbiAgICBsaWdodEdyYXBoaWNzLmJlZ2luRmlsbCgweEZGRkZGRik7XG4gICAgbGlnaHRHcmFwaGljcy5tb3ZlVG8odmVydGljZXNbMF0ueCwgdmVydGljZXNbMF0ueSk7XG4gICAgZm9yICh2YXIgaSA9IDE7IGk8dmVydGljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB2ID0gdmVydGljZXNbaV07XG4gICAgICBsaWdodEdyYXBoaWNzLmxpbmVUbyh2LngsIHYueSk7XG4gICAgfVxuICAgIGxpZ2h0R3JhcGhpY3MuZW5kRmlsbCgpO1xuXG4gICAgLy8gb3ZlcmxhcC5hZGRDaGlsZChsaWdodEdyYXBoaWNzKTtcbiAgICAvLyBvdmVybGFwU2hhcGUubWFzayA9IGxpZ2h0R3JhcGhpY3M7XG5cbiAgICBzZWxmLmxldmVsLmJnMi5tYXNrID0gbGlnaHRHcmFwaGljcztcbiAgICAvLyBvdmVybGF5Lm1hc2sgPSBsaWdodEdyYXBoaWNzO1xuXG4gICAgbGFzdExpZ2h0WCA9IGxpZ2h0LnBvc2l0aW9uLng7XG4gICAgbGFzdExpZ2h0WSA9IGxpZ2h0LnBvc2l0aW9uLnk7XG4gIH07XG5cbiAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbigpIHtcblxuICAgIGlmIChzZWxmLmJ0blJlc3RhcnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHNlbGYubGV2ZWwgPT09IG51bGwpIHtcbiAgICAgICAgc2VsZi5idG5SZXN0YXJ0LnZpc2libGUgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGYuYnRuUmVzdGFydC52aXNpYmxlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2VsZi5iZWdpbikgc2VsZi5iZWdpbi51cGRhdGUoKTtcbiAgICBpZiAoc2VsZi5nYW1lb3Zlcikgc2VsZi5nYW1lb3Zlci51cGRhdGUoKTtcblxuICAgIGlmICghZ2FtZVJ1bm5pbmcpIHJldHVybjtcbiAgICB0aGlzLnVwZGF0ZUxpZ2h0cygpO1xuXG4gICAgLy8gY29uc29sZS5sb2coaW5wdXQgKyBcIiBcIiArIGlucHV0LktleSk7XG4gICAgaWYoIWlucHV0KVxuICAgICAgcmV0dXJuO1xuXG4gICAgaWYgKGlucHV0LktleS5pc0Rvd24oaW5wdXQuS2V5LkxFRlQpIHx8IGlucHV0LktleS5pc0Rvd24oaW5wdXQuS2V5LkEpKVxuICAgIHtcbiAgICAgIGRpcmVjdGlvbiAtPSAwLjA5O1xuICAgIH1cbiAgICBlbHNlIGlmIChpbnB1dC5LZXkuaXNEb3duKGlucHV0LktleS5SSUdIVCkgfHwgaW5wdXQuS2V5LmlzRG93bihpbnB1dC5LZXkuRCkpXG4gICAge1xuICAgICAgZGlyZWN0aW9uICs9IDAuMDk7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICBkaXJlY3Rpb24gKj0gMC45O1xuICAgIH1cblxuICAgIGRpcmVjdGlvbiA9IFRvb2xzLmNsYW1wKGRpcmVjdGlvbiwgLTEsIDEpO1xuXG4gICAgaWYgKHNlbGYubGV2ZWwpXG4gICAge1xuICAgICAgaWYocGh5c2ljcylcbiAgICAgICAgcGh5c2ljcy5wcm9jZXNzKGdhbWUsIGRpcmVjdGlvbiwgd2luZG93LnBvbHlnb25zKTtcblxuICAgICAgaWYocGxheWVyKVxuICAgICAgICBwbGF5ZXIudXBkYXRlKGdhbWUsIHBoeXNpY3MucGxheWVyUG9zaXRpb24sIHBoeXNpY3MucGxheWVyVmVsb2NpdHkpO1xuXG4gICAgICAgc2VsZi5sZXZlbC51cGRhdGUoc2VsZik7XG5cbiAgICAgICBpZiAoIWxvc3QgJiYgcGh5c2ljcy5wbGF5ZXJQb3NpdGlvbi55ID4gc2NyZWVuSGVpZ2h0ICsgNDApIHRoaXMubG9zZUdhbWUoKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGxvb3BCb3VuZGVkID0gIGZhbHNlIDtcbiAgdGhpcy5sb29wID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKGxvb3BCb3VuZGVkKXsgcmV0dXJuOyB9XG4gICAgbG9vcEJvdW5kZWQgPSB0cnVlO1xuICAgIHJlcXVlc3RBbmltRnJhbWUoc2VsZi5yZW5kZXJMb29wKTtcbiAgfTtcblxuICB0aGlzLnJlbmRlckxvb3AgPSBmdW5jdGlvbigpIHtcbiAgICBzZWxmLnVwZGF0ZSgpOyAvLyBsb2dpY1xuICAgIHNlbGYucmVuZGVyZXIucmVuZGVyKHNlbGYuc3RhZ2UpO1xuICAgIHJlcXVlc3RBbmltRnJhbWUoc2VsZi5yZW5kZXJMb29wKTtcbiAgfVxuXG4gIHRoaXMubG9hZFBpeGkgPSBmdW5jdGlvbigpIHtcbiAgICBzZWxmLml0ZW1zTG9hZGVkID0gMCxcbiAgICBzZWxmLnBpeGlGaWxlcyA9IHNlbGYucmVzb3VyY2VzLmdldFBJWElGaWxlcygpLFxuICAgIHNlbGYuc291bmRGaWxlcyA9IHNlbGYucmVzb3VyY2VzLnNvdW5kcyxcbiAgICBzZWxmLnRvdGFsSXRlbXMgPSBzZWxmLnBpeGlGaWxlcy5sZW5ndGggKyBzZWxmLnNvdW5kRmlsZXMubGVuZ3RoO1xuICAgIC8vIGxvYWRlclxuICAgIGxvYWRlciA9IG5ldyBQSVhJLkFzc2V0TG9hZGVyKHNlbGYucGl4aUZpbGVzKTtcbiAgICBsb2FkZXIuYWRkRXZlbnRMaXN0ZW5lcignb25Db21wbGV0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgc2VsZi5sb2FkU291bmQoKTtcbiAgICB9KTtcbiAgICBsb2FkZXIuYWRkRXZlbnRMaXN0ZW5lcignb25Qcm9ncmVzcycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIHNlbGYuaXRlbXNMb2FkZWQgKz0gMTtcbiAgICAgIHNlbGYucHJlbG9hZGVyLnByb2dyZXNzKHNlbGYuaXRlbXNMb2FkZWQsIHNlbGYudG90YWxJdGVtcyk7XG4gICAgICBpZiAodHlwZW9mKGVqZWN0YSkhPT1cInVuZGVmaW5lZFwiKSB7IHJldHVybjsgfTtcbiAgICB9KTtcblxuICAgIGxvYWRlci5sb2FkKCk7XG4gIH1cblxuICB0aGlzLmxvYWRTb3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpID0gKHNlbGYuaXRlbXNMb2FkZWQgLSBzZWxmLnBpeGlGaWxlcy5sZW5ndGgpLFxuICAgICAgb2JqID0gc2VsZi5zb3VuZEZpbGVzW2ldO1xuICAgIHNlbGYucmVzb3VyY2VzW29iai5uYW1lXSA9IG5ldyBIb3dsKHtcbiAgICAgIHVybHM6IG9iai51cmxzLFxuICAgICAgYXV0b3BsYXk6IG9iai5hdXRvUGxheSB8fCBmYWxzZSxcbiAgICAgIGxvb3A6IG9iai5sb29wIHx8IGZhbHNlLFxuICAgICAgdm9sdW1lOiBvYmoudm9sdW1lIHx8IDEsXG4gICAgICBvbmxvYWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBzZWxmLml0ZW1zTG9hZGVkKys7XG4gICAgICAgIHNlbGYucHJlbG9hZGVyLnByb2dyZXNzKHNlbGYuaXRlbXNMb2FkZWQsIHNlbGYudG90YWxJdGVtcyk7XG4gICAgICAgIGlmIChzZWxmLml0ZW1zTG9hZGVkID09IHNlbGYudG90YWxJdGVtcykge1xuICAgICAgICAgIHNlbGYubG9hZGVkKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi5sb2FkU291bmQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdGhpcy5sb2FkZWQgPSBmdW5jdGlvbigpIHtcbiAgICBzZWxmLmJlZ2luID0gbmV3IEJlZ2luKHRoaXMpO1xuICAgIC8vIHNlbGYubGV2ZWxlbmQgPSBuZXcgTGV2ZWxFbmQodGhpcyk7XG4gICAgc2VsZi5nYW1lb3ZlciA9IG5ldyBHYW1lT3Zlcih0aGlzKTtcbiAgICBzZWxmLnByZWxvYWRlci5oaWRlKCk7XG4gICAgc2VsZi5iZWdpbi5zaG93KCk7XG4gICAgZ2FtZS5yZXNvdXJjZXMuc291bmRMb29wLmZhZGVJbiguNCwgMjAwMCk7XG5cbiAgICBnbG93ID0gUElYSS5TcHJpdGUuZnJvbUZyYW1lKFwiZ2xvdy5wbmdcIik7XG4gICAgZ2xvdy5zY2FsZS54ID0gMjtcbiAgICBnbG93LnNjYWxlLnkgPSAyO1xuICAgIHNlbGYuc3RhZ2UuYWRkQ2hpbGQoZ2xvdyk7XG4gICAgZ2xvdy5hbHBoYSA9IDAuNjU7XG5cbiAgICBzZWxmLmJ0blNvdW5kT2ZmID0gUElYSS5TcHJpdGUuZnJvbUZyYW1lKCdzb3VuZE9uLnBuZycpO1xuICAgIHNlbGYuYnRuU291bmRPZmYuc2V0SW50ZXJhY3RpdmUodHJ1ZSk7XG4gICAgc2VsZi5idG5Tb3VuZE9mZi5idXR0b25Nb2RlID0gdHJ1ZTtcbiAgICBzZWxmLmJ0blNvdW5kT2ZmLnBvc2l0aW9uLnggPSAxMDtcbiAgICBzZWxmLmJ0blNvdW5kT2ZmLnBvc2l0aW9uLnkgPSAxMDtcblxuICAgIHNlbGYuYnRuU291bmRPbiA9IFBJWEkuU3ByaXRlLmZyb21GcmFtZSgnc291bmRPZmYucG5nJyk7XG4gICAgc2VsZi5idG5Tb3VuZE9uLnNldEludGVyYWN0aXZlKHRydWUpO1xuICAgIHNlbGYuYnRuU291bmRPbi5idXR0b25Nb2RlID0gdHJ1ZTtcbiAgICBzZWxmLmJ0blNvdW5kT24ucG9zaXRpb24ueCA9IHNlbGYuYnRuU291bmRPZmYucG9zaXRpb24ueDtcbiAgICBzZWxmLmJ0blNvdW5kT24ucG9zaXRpb24ueSA9IHNlbGYuYnRuU291bmRPZmYucG9zaXRpb24ueTtcbiAgICBzZWxmLmJ0blNvdW5kT24udmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgc2VsZi5zdGFnZS5hZGRDaGlsZChnYW1lLmJ0blNvdW5kT2ZmKTtcbiAgICBzZWxmLnN0YWdlLmFkZENoaWxkKGdhbWUuYnRuU291bmRPbik7XG5cbiAgICBzZWxmLmJ0blNvdW5kT2ZmLmNsaWNrID0gc2VsZi5idG5Tb3VuZE9mZi50YXAgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBzZWxmLmJ0blNvdW5kT24udmlzaWJsZSA9IHRydWU7XG4gICAgICBzZWxmLmJ0blNvdW5kT2ZmLnZpc2libGUgPSBmYWxzZTtcbiAgICAgIEhvd2xlci5tdXRlKCk7XG4gICAgfVxuXG4gICAgc2VsZi5idG5Tb3VuZE9uLmNsaWNrID0gc2VsZi5idG5Tb3VuZE9uLnRhcCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHNlbGYuYnRuU291bmRPbi52aXNpYmxlID0gZmFsc2U7XG4gICAgICBzZWxmLmJ0blNvdW5kT2ZmLnZpc2libGUgPSB0cnVlO1xuICAgICAgSG93bGVyLnVubXV0ZSgpO1xuICAgIH1cblxuICAgIHNlbGYuYnRuUmVzdGFydCA9IFBJWEkuU3ByaXRlLmZyb21GcmFtZSgncmVzdGFydC5wbmcnKTtcbiAgICBzZWxmLmJ0blJlc3RhcnQuc2V0SW50ZXJhY3RpdmUodHJ1ZSk7XG4gICAgc2VsZi5idG5SZXN0YXJ0LmJ1dHRvbk1vZGUgPSB0cnVlO1xuICAgIHNlbGYuc3RhZ2UuYWRkQ2hpbGQoZ2FtZS5idG5SZXN0YXJ0KTtcbiAgICBzZWxmLmJ0blJlc3RhcnQucG9zaXRpb24ueCA9IHNlbGYucmVuZGVyZXIud2lkdGggLSAxMCAtIHNlbGYuYnRuUmVzdGFydC53aWR0aDtcbiAgICBzZWxmLmJ0blJlc3RhcnQucG9zaXRpb24ueSA9IDEwO1xuICAgIHNlbGYuYnRuUmVzdGFydC52aXNpYmxlID0gZmFsc2U7XG5cbiAgICBzZWxmLmJ0blJlc3RhcnQuY2xpY2sgPSBzZWxmLmJ0blJlc3RhcnQudGFwID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgc2VsZi5yZXN0YXJ0KCk7XG4gICAgfVxuICB9XG5cbiAgdGhpcy5zdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpbWdzQXJyID0gW10sIGk7XG4gICAgbG9zdCA9IGZhbHNlO1xuICAgIC8vIHN0YXJ0IHNjZW5lc1xuICAgIC8vIHNlbGYuc3RhZ2UuYWRkQ2hpbGQobGlnaHRHcmFwaGljcyk7XG5cbiAgICAvLyBzdGFydCBzY3JlZW5zXG5cbiAgICAvLyBzdGFydCBsb29wXG4gICAgc2VsZi5sb29wKCk7XG5cbiAgICAvL1xuICAgIHNlbGYucHJlbG9hZGVyID0gbmV3IFByZWxvYWRlcih0aGlzKTtcblxuICAgIC8vIEZJWE1FXG4gICAgc2VsZi5sb2FkUGl4aSgpO1xuICB9O1xuXG4gIHRoaXMubG9zZUdhbWUgPSBmdW5jdGlvbigpXG4gIHtcbiAgICBpZiAobG9zdCkgcmV0dXJuO1xuICAgIGxvc3QgPSB0cnVlO1xuICAgIGdhbWVSdW5uaW5nID0gZmFsc2U7XG4gICAgc2VsZi5nYW1lb3Zlci5zaG93KCk7XG4gIH1cblxuICB0aGlzLmdvVG9CZWdpbm5pbmcgPSBmdW5jdGlvbigpXG4gIHtcbiAgICAvLyBnYW1lLmxvYWRMZXZlbCgxKTtcbiAgICBnYW1lLmxldmVsLmRpc3Bvc2UoKTtcbiAgICBnYW1lLmxldmVsLmluZGV4ID0gMDtcbiAgICBnYW1lLmxldmVsID0gbnVsbDtcblxuICAgIHNlbGYuYmVnaW4uc2hvdygpO1xuICB9XG5cbiAgdmFyIHBocmFzZTEgPSBudWxsO1xuICB2YXIgcGhyYXNlMiA9IG51bGw7XG4gIHZhciBwaHJhc2UzID0gbnVsbDtcbiAgdGhpcy5zaG93RW5kU3RvcnkgPSBmdW5jdGlvbigpXG4gIHtcbiAgICAvLyBjb25zb2xlLmxvZyhcInNob3cgZW5kIHN0b3J5XCIsIGdhbWVSdW5uaW5nKTtcblxuICAgIGlmKCFnYW1lUnVubmluZylcbiAgICAgIHJldHVybjtcblxuICAgIGdhbWVSdW5uaW5nID0gZmFsc2U7XG5cbiAgICBwaHJhc2UxID0gbmV3IFBJWEkuVGV4dCgnSE1NTS4uLk1ZIEhFQUQuLi5XSEFUIEhBUFBFTkVEPycsIHtcbiAgICAgIGZvbnQ6ICcyMnB4IFJva2tpdHQnLFxuICAgICAgZmlsbDogJyNGRkZGRkYnLFxuICAgICAgYWxpZ246ICdjZW50ZXInXG4gICAgfSk7XG5cbiAgICBwaHJhc2UyID0gbmV3IFBJWEkuVGV4dCgnTU9NPy4uLk1PTT8hIE5PISEhJywge1xuICAgICAgZm9udDogJzIycHggUm9ra2l0dCcsXG4gICAgICBmaWxsOiAnI0ZGRkZGRicsXG4gICAgICBhbGlnbjogJ2NlbnRlcidcbiAgICB9KTtcblxuICAgIHBocmFzZTMgPSBuZXcgUElYSS5UZXh0KCdCVVQuLi5XQUlULi4uVEhBVCBMSUdIVCwgSVQgV0FTIFlPVT8nLCB7XG4gICAgICBmb250OiAnMjJweCBSb2traXR0JyxcbiAgICAgIGZpbGw6ICcjRkZGRkZGJyxcbiAgICAgIGFsaWduOiAnY2VudGVyJ1xuICAgIH0pO1xuXG4gICAgcGhyYXNlMS5hbHBoYSA9IDA7XG4gICAgcGhyYXNlMi5hbHBoYSA9IDA7XG4gICAgcGhyYXNlMy5hbHBoYSA9IDA7XG5cbiAgICBwaHJhc2UxLnBvc2l0aW9uLnggPSAoc2VsZi5yZW5kZXJlci53aWR0aCAvIDIpIC0gKHBocmFzZTEud2lkdGggLyAyKTtcbiAgICBwaHJhc2UxLnBvc2l0aW9uLnkgPSBzZWxmLnJlbmRlcmVyLmhlaWdodCAvIDIgLSA2MDtcbiAgICBzZWxmLnN0YWdlLmFkZENoaWxkKHBocmFzZTEpO1xuXG4gICAgcGhyYXNlMi5wb3NpdGlvbi54ID0gKHNlbGYucmVuZGVyZXIud2lkdGggLyAyKSAtIChwaHJhc2UyLndpZHRoIC8gMik7XG4gICAgcGhyYXNlMi5wb3NpdGlvbi55ID0gc2VsZi5yZW5kZXJlci5oZWlnaHQgLyAyIC0gMTA7XG4gICAgc2VsZi5zdGFnZS5hZGRDaGlsZChwaHJhc2UyKTtcblxuICAgIHBocmFzZTMucG9zaXRpb24ueCA9IChzZWxmLnJlbmRlcmVyLndpZHRoIC8gMikgLSAocGhyYXNlMy53aWR0aCAvIDIpO1xuICAgIHBocmFzZTMucG9zaXRpb24ueSA9IHNlbGYucmVuZGVyZXIuaGVpZ2h0IC8gMiArIDQwO1xuICAgIHNlbGYuc3RhZ2UuYWRkQ2hpbGQocGhyYXNlMyk7XG5cblxuICAgIHZhciB0d2VlbmFibGUgPSBuZXcgVHdlZW5hYmxlKCk7XG4gICAgdHdlZW5hYmxlLnR3ZWVuKHtcbiAgICAgIGZyb206IHthbHBoYTowfSxcbiAgICAgIHRvOiAgIHthbHBoYToxfSxcbiAgICAgIGR1cmF0aW9uOiA1MDAsXG4gICAgICBlYXNpbmc6ICdlYXNlT3V0Q3ViaWMnLFxuICAgICAgc3RhcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIH0sXG4gICAgICBzdGVwOiBmdW5jdGlvbihzdGF0ZSl7XG4gICAgICAgIHBocmFzZTEuYWxwaGEgPSBzdGF0ZS5hbHBoYTtcbiAgICAgIH0sXG4gICAgICBmaW5pc2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciB0d2VlbmFibGUgPSBuZXcgVHdlZW5hYmxlKCk7XG4gICAgdHdlZW5hYmxlLnR3ZWVuKHtcbiAgICAgIGZyb206IHthbHBoYTowfSxcbiAgICAgIHRvOiAgIHthbHBoYToxfSxcbiAgICAgIGR1cmF0aW9uOiA1MDAsXG4gICAgICBlYXNpbmc6ICdlYXNlT3V0Q3ViaWMnLFxuICAgICAgc3RhcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIH0sXG4gICAgICBzdGVwOiBmdW5jdGlvbihzdGF0ZSl7XG4gICAgICAgIHBocmFzZTIuYWxwaGEgPSBzdGF0ZS5hbHBoYTtcbiAgICAgIH0sXG4gICAgICBmaW5pc2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciB0d2VlbmFibGUgPSBuZXcgVHdlZW5hYmxlKCk7XG4gICAgdHdlZW5hYmxlLnR3ZWVuKHtcbiAgICAgIGZyb206IHthbHBoYTowfSxcbiAgICAgIHRvOiAgIHthbHBoYToxfSxcbiAgICAgIGR1cmF0aW9uOiA1MDAsXG4gICAgICBlYXNpbmc6ICdlYXNlT3V0Q3ViaWMnLFxuICAgICAgc3RhcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIH0sXG4gICAgICBzdGVwOiBmdW5jdGlvbihzdGF0ZSl7XG4gICAgICAgIHBocmFzZTMuYWxwaGEgPSBzdGF0ZS5hbHBoYTtcbiAgICAgIH0sXG4gICAgICBmaW5pc2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgc2VsZi5zdGFnZS5yZW1vdmVDaGlsZChwaHJhc2UxKTtcbiAgICAgIHNlbGYuc3RhZ2UucmVtb3ZlQ2hpbGQocGhyYXNlMik7XG4gICAgICBzZWxmLnN0YWdlLnJlbW92ZUNoaWxkKHBocmFzZTMpO1xuICAgICAgc2VsZi5nb1RvQmVnaW5uaW5nKCk7XG4gICAgfSw4MDAwKTtcblxuICAgIHNlbGYuZ2FtZVJ1bm5pbmcgPSBmYWxzZTtcbiAgfVxuXG4gIHRoaXMuc3RhcnQoKTtcbn1cbiIsInZhciBHYW1lID0gcmVxdWlyZSgnLi9HYW1lJyksXG4gICAgVHdlZW5hYmxlID0gcmVxdWlyZSgnLi92ZW5kb3Ivc2hpZnR5JyksXG4gICAgRXZlbnRFbWl0dGVyMiA9IHJlcXVpcmUoJy4vdmVuZG9yL0V2ZW50RW1pdHRlcjInKS5FdmVudEVtaXR0ZXIyLFxuICAgIGdhbWU7XG5cbi8vIGh0dHA6Ly9jdWJpYy1iZXppZXIuY29tLyMuOTIsLjM0LC42LC44XG5Ud2VlbmFibGUuc2V0QmV6aWVyRnVuY3Rpb24oXCJjdXN0b21CZXppZXJcIiwgLjkyLC4zNCwuNiwuOCk7XG5cbi8vIEV2ZW50IGJldHdlZW4gb2JqZWN0c1xud2luZG93LmVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyMigpO1xuXG5jb25zb2xlLmxvZyhcIk9uZVwiKTtcblxuLy8gSW5pdFxuaWYgKHR5cGVvZihlamVjdGEpIT09XCJ1bmRlZmluZWRcIikge1xuICBnYW1lID0gR2FtZS5pbnN0YW5jZSA9IG5ldyBHYW1lKCk7XG5cbn0gZWxzZSB7XG5cbldlYkZvbnRDb25maWcgPSB7XG4gIGdvb2dsZToge1xuICAgIGZhbWlsaWVzOiBbJ1Jva2tpdHQnXVxuICB9LFxuXG4gIGFjdGl2ZTogZnVuY3Rpb24oKSB7XG4gICAgLy8gZG8gc29tZXRoaW5nXG4gICAgZ2FtZSA9IEdhbWUuaW5zdGFuY2UgPSBuZXcgR2FtZSgpO1xuICB9XG4gIH07XG4gIChmdW5jdGlvbigpIHtcbiAgdmFyIHdmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gIHdmLnNyYyA9ICgnaHR0cHM6JyA9PSBkb2N1bWVudC5sb2NhdGlvbi5wcm90b2NvbCA/ICdodHRwcycgOiAnaHR0cCcpICtcbiAgICAgICc6Ly9hamF4Lmdvb2dsZWFwaXMuY29tL2FqYXgvbGlicy93ZWJmb250LzEvd2ViZm9udC5qcyc7XG4gIHdmLnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcbiAgd2YuYXN5bmMgPSAndHJ1ZSc7XG4gIHZhciBzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdO1xuICBzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHdmLCBzKTtcbn0pKCk7XG5cbn1cbiIsIi8qIVxuICogRXZlbnRFbWl0dGVyMlxuICogaHR0cHM6Ly9naXRodWIuY29tL2hpajFueC9FdmVudEVtaXR0ZXIyXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDEzIGhpajFueFxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICovXG47IWZ1bmN0aW9uKHVuZGVmaW5lZCkge1xuXG4gIHZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSA/IEFycmF5LmlzQXJyYXkgOiBmdW5jdGlvbiBfaXNBcnJheShvYmopIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09IFwiW29iamVjdCBBcnJheV1cIjtcbiAgfTtcbiAgdmFyIGRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGlmICh0aGlzLl9jb25mKSB7XG4gICAgICBjb25maWd1cmUuY2FsbCh0aGlzLCB0aGlzLl9jb25mKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjb25maWd1cmUoY29uZikge1xuICAgIGlmIChjb25mKSB7XG5cbiAgICAgIHRoaXMuX2NvbmYgPSBjb25mO1xuXG4gICAgICBjb25mLmRlbGltaXRlciAmJiAodGhpcy5kZWxpbWl0ZXIgPSBjb25mLmRlbGltaXRlcik7XG4gICAgICBjb25mLm1heExpc3RlbmVycyAmJiAodGhpcy5fZXZlbnRzLm1heExpc3RlbmVycyA9IGNvbmYubWF4TGlzdGVuZXJzKTtcbiAgICAgIGNvbmYud2lsZGNhcmQgJiYgKHRoaXMud2lsZGNhcmQgPSBjb25mLndpbGRjYXJkKTtcbiAgICAgIGNvbmYubmV3TGlzdGVuZXIgJiYgKHRoaXMubmV3TGlzdGVuZXIgPSBjb25mLm5ld0xpc3RlbmVyKTtcblxuICAgICAgaWYgKHRoaXMud2lsZGNhcmQpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lclRyZWUgPSB7fTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBFdmVudEVtaXR0ZXIoY29uZikge1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHRoaXMubmV3TGlzdGVuZXIgPSBmYWxzZTtcbiAgICBjb25maWd1cmUuY2FsbCh0aGlzLCBjb25mKTtcbiAgfVxuXG4gIC8vXG4gIC8vIEF0dGVudGlvbiwgZnVuY3Rpb24gcmV0dXJuIHR5cGUgbm93IGlzIGFycmF5LCBhbHdheXMgIVxuICAvLyBJdCBoYXMgemVybyBlbGVtZW50cyBpZiBubyBhbnkgbWF0Y2hlcyBmb3VuZCBhbmQgb25lIG9yIG1vcmVcbiAgLy8gZWxlbWVudHMgKGxlYWZzKSBpZiB0aGVyZSBhcmUgbWF0Y2hlc1xuICAvL1xuICBmdW5jdGlvbiBzZWFyY2hMaXN0ZW5lclRyZWUoaGFuZGxlcnMsIHR5cGUsIHRyZWUsIGkpIHtcbiAgICBpZiAoIXRyZWUpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgdmFyIGxpc3RlbmVycz1bXSwgbGVhZiwgbGVuLCBicmFuY2gsIHhUcmVlLCB4eFRyZWUsIGlzb2xhdGVkQnJhbmNoLCBlbmRSZWFjaGVkLFxuICAgICAgICB0eXBlTGVuZ3RoID0gdHlwZS5sZW5ndGgsIGN1cnJlbnRUeXBlID0gdHlwZVtpXSwgbmV4dFR5cGUgPSB0eXBlW2krMV07XG4gICAgaWYgKGkgPT09IHR5cGVMZW5ndGggJiYgdHJlZS5fbGlzdGVuZXJzKSB7XG4gICAgICAvL1xuICAgICAgLy8gSWYgYXQgdGhlIGVuZCBvZiB0aGUgZXZlbnQocykgbGlzdCBhbmQgdGhlIHRyZWUgaGFzIGxpc3RlbmVyc1xuICAgICAgLy8gaW52b2tlIHRob3NlIGxpc3RlbmVycy5cbiAgICAgIC8vXG4gICAgICBpZiAodHlwZW9mIHRyZWUuX2xpc3RlbmVycyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBoYW5kbGVycyAmJiBoYW5kbGVycy5wdXNoKHRyZWUuX2xpc3RlbmVycyk7XG4gICAgICAgIHJldHVybiBbdHJlZV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGxlYWYgPSAwLCBsZW4gPSB0cmVlLl9saXN0ZW5lcnMubGVuZ3RoOyBsZWFmIDwgbGVuOyBsZWFmKyspIHtcbiAgICAgICAgICBoYW5kbGVycyAmJiBoYW5kbGVycy5wdXNoKHRyZWUuX2xpc3RlbmVyc1tsZWFmXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFt0cmVlXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoKGN1cnJlbnRUeXBlID09PSAnKicgfHwgY3VycmVudFR5cGUgPT09ICcqKicpIHx8IHRyZWVbY3VycmVudFR5cGVdKSB7XG4gICAgICAvL1xuICAgICAgLy8gSWYgdGhlIGV2ZW50IGVtaXR0ZWQgaXMgJyonIGF0IHRoaXMgcGFydFxuICAgICAgLy8gb3IgdGhlcmUgaXMgYSBjb25jcmV0ZSBtYXRjaCBhdCB0aGlzIHBhdGNoXG4gICAgICAvL1xuICAgICAgaWYgKGN1cnJlbnRUeXBlID09PSAnKicpIHtcbiAgICAgICAgZm9yIChicmFuY2ggaW4gdHJlZSkge1xuICAgICAgICAgIGlmIChicmFuY2ggIT09ICdfbGlzdGVuZXJzJyAmJiB0cmVlLmhhc093blByb3BlcnR5KGJyYW5jaCkpIHtcbiAgICAgICAgICAgIGxpc3RlbmVycyA9IGxpc3RlbmVycy5jb25jYXQoc2VhcmNoTGlzdGVuZXJUcmVlKGhhbmRsZXJzLCB0eXBlLCB0cmVlW2JyYW5jaF0sIGkrMSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGlzdGVuZXJzO1xuICAgICAgfSBlbHNlIGlmKGN1cnJlbnRUeXBlID09PSAnKionKSB7XG4gICAgICAgIGVuZFJlYWNoZWQgPSAoaSsxID09PSB0eXBlTGVuZ3RoIHx8IChpKzIgPT09IHR5cGVMZW5ndGggJiYgbmV4dFR5cGUgPT09ICcqJykpO1xuICAgICAgICBpZihlbmRSZWFjaGVkICYmIHRyZWUuX2xpc3RlbmVycykge1xuICAgICAgICAgIC8vIFRoZSBuZXh0IGVsZW1lbnQgaGFzIGEgX2xpc3RlbmVycywgYWRkIGl0IHRvIHRoZSBoYW5kbGVycy5cbiAgICAgICAgICBsaXN0ZW5lcnMgPSBsaXN0ZW5lcnMuY29uY2F0KHNlYXJjaExpc3RlbmVyVHJlZShoYW5kbGVycywgdHlwZSwgdHJlZSwgdHlwZUxlbmd0aCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChicmFuY2ggaW4gdHJlZSkge1xuICAgICAgICAgIGlmIChicmFuY2ggIT09ICdfbGlzdGVuZXJzJyAmJiB0cmVlLmhhc093blByb3BlcnR5KGJyYW5jaCkpIHtcbiAgICAgICAgICAgIGlmKGJyYW5jaCA9PT0gJyonIHx8IGJyYW5jaCA9PT0gJyoqJykge1xuICAgICAgICAgICAgICBpZih0cmVlW2JyYW5jaF0uX2xpc3RlbmVycyAmJiAhZW5kUmVhY2hlZCkge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVycyA9IGxpc3RlbmVycy5jb25jYXQoc2VhcmNoTGlzdGVuZXJUcmVlKGhhbmRsZXJzLCB0eXBlLCB0cmVlW2JyYW5jaF0sIHR5cGVMZW5ndGgpKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBsaXN0ZW5lcnMgPSBsaXN0ZW5lcnMuY29uY2F0KHNlYXJjaExpc3RlbmVyVHJlZShoYW5kbGVycywgdHlwZSwgdHJlZVticmFuY2hdLCBpKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYoYnJhbmNoID09PSBuZXh0VHlwZSkge1xuICAgICAgICAgICAgICBsaXN0ZW5lcnMgPSBsaXN0ZW5lcnMuY29uY2F0KHNlYXJjaExpc3RlbmVyVHJlZShoYW5kbGVycywgdHlwZSwgdHJlZVticmFuY2hdLCBpKzIpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIE5vIG1hdGNoIG9uIHRoaXMgb25lLCBzaGlmdCBpbnRvIHRoZSB0cmVlIGJ1dCBub3QgaW4gdGhlIHR5cGUgYXJyYXkuXG4gICAgICAgICAgICAgIGxpc3RlbmVycyA9IGxpc3RlbmVycy5jb25jYXQoc2VhcmNoTGlzdGVuZXJUcmVlKGhhbmRsZXJzLCB0eXBlLCB0cmVlW2JyYW5jaF0sIGkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxpc3RlbmVycztcbiAgICAgIH1cblxuICAgICAgbGlzdGVuZXJzID0gbGlzdGVuZXJzLmNvbmNhdChzZWFyY2hMaXN0ZW5lclRyZWUoaGFuZGxlcnMsIHR5cGUsIHRyZWVbY3VycmVudFR5cGVdLCBpKzEpKTtcbiAgICB9XG5cbiAgICB4VHJlZSA9IHRyZWVbJyonXTtcbiAgICBpZiAoeFRyZWUpIHtcbiAgICAgIC8vXG4gICAgICAvLyBJZiB0aGUgbGlzdGVuZXIgdHJlZSB3aWxsIGFsbG93IGFueSBtYXRjaCBmb3IgdGhpcyBwYXJ0LFxuICAgICAgLy8gdGhlbiByZWN1cnNpdmVseSBleHBsb3JlIGFsbCBicmFuY2hlcyBvZiB0aGUgdHJlZVxuICAgICAgLy9cbiAgICAgIHNlYXJjaExpc3RlbmVyVHJlZShoYW5kbGVycywgdHlwZSwgeFRyZWUsIGkrMSk7XG4gICAgfVxuXG4gICAgeHhUcmVlID0gdHJlZVsnKionXTtcbiAgICBpZih4eFRyZWUpIHtcbiAgICAgIGlmKGkgPCB0eXBlTGVuZ3RoKSB7XG4gICAgICAgIGlmKHh4VHJlZS5fbGlzdGVuZXJzKSB7XG4gICAgICAgICAgLy8gSWYgd2UgaGF2ZSBhIGxpc3RlbmVyIG9uIGEgJyoqJywgaXQgd2lsbCBjYXRjaCBhbGwsIHNvIGFkZCBpdHMgaGFuZGxlci5cbiAgICAgICAgICBzZWFyY2hMaXN0ZW5lclRyZWUoaGFuZGxlcnMsIHR5cGUsIHh4VHJlZSwgdHlwZUxlbmd0aCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCdWlsZCBhcnJheXMgb2YgbWF0Y2hpbmcgbmV4dCBicmFuY2hlcyBhbmQgb3RoZXJzLlxuICAgICAgICBmb3IoYnJhbmNoIGluIHh4VHJlZSkge1xuICAgICAgICAgIGlmKGJyYW5jaCAhPT0gJ19saXN0ZW5lcnMnICYmIHh4VHJlZS5oYXNPd25Qcm9wZXJ0eShicmFuY2gpKSB7XG4gICAgICAgICAgICBpZihicmFuY2ggPT09IG5leHRUeXBlKSB7XG4gICAgICAgICAgICAgIC8vIFdlIGtub3cgdGhlIG5leHQgZWxlbWVudCB3aWxsIG1hdGNoLCBzbyBqdW1wIHR3aWNlLlxuICAgICAgICAgICAgICBzZWFyY2hMaXN0ZW5lclRyZWUoaGFuZGxlcnMsIHR5cGUsIHh4VHJlZVticmFuY2hdLCBpKzIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmKGJyYW5jaCA9PT0gY3VycmVudFR5cGUpIHtcbiAgICAgICAgICAgICAgLy8gQ3VycmVudCBub2RlIG1hdGNoZXMsIG1vdmUgaW50byB0aGUgdHJlZS5cbiAgICAgICAgICAgICAgc2VhcmNoTGlzdGVuZXJUcmVlKGhhbmRsZXJzLCB0eXBlLCB4eFRyZWVbYnJhbmNoXSwgaSsxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlzb2xhdGVkQnJhbmNoID0ge307XG4gICAgICAgICAgICAgIGlzb2xhdGVkQnJhbmNoW2JyYW5jaF0gPSB4eFRyZWVbYnJhbmNoXTtcbiAgICAgICAgICAgICAgc2VhcmNoTGlzdGVuZXJUcmVlKGhhbmRsZXJzLCB0eXBlLCB7ICcqKic6IGlzb2xhdGVkQnJhbmNoIH0sIGkrMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYoeHhUcmVlLl9saXN0ZW5lcnMpIHtcbiAgICAgICAgLy8gV2UgaGF2ZSByZWFjaGVkIHRoZSBlbmQgYW5kIHN0aWxsIG9uIGEgJyoqJ1xuICAgICAgICBzZWFyY2hMaXN0ZW5lclRyZWUoaGFuZGxlcnMsIHR5cGUsIHh4VHJlZSwgdHlwZUxlbmd0aCk7XG4gICAgICB9IGVsc2UgaWYoeHhUcmVlWycqJ10gJiYgeHhUcmVlWycqJ10uX2xpc3RlbmVycykge1xuICAgICAgICBzZWFyY2hMaXN0ZW5lclRyZWUoaGFuZGxlcnMsIHR5cGUsIHh4VHJlZVsnKiddLCB0eXBlTGVuZ3RoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbGlzdGVuZXJzO1xuICB9XG5cbiAgZnVuY3Rpb24gZ3Jvd0xpc3RlbmVyVHJlZSh0eXBlLCBsaXN0ZW5lcikge1xuXG4gICAgdHlwZSA9IHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJyA/IHR5cGUuc3BsaXQodGhpcy5kZWxpbWl0ZXIpIDogdHlwZS5zbGljZSgpO1xuXG4gICAgLy9cbiAgICAvLyBMb29rcyBmb3IgdHdvIGNvbnNlY3V0aXZlICcqKicsIGlmIHNvLCBkb24ndCBhZGQgdGhlIGV2ZW50IGF0IGFsbC5cbiAgICAvL1xuICAgIGZvcih2YXIgaSA9IDAsIGxlbiA9IHR5cGUubGVuZ3RoOyBpKzEgPCBsZW47IGkrKykge1xuICAgICAgaWYodHlwZVtpXSA9PT0gJyoqJyAmJiB0eXBlW2krMV0gPT09ICcqKicpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciB0cmVlID0gdGhpcy5saXN0ZW5lclRyZWU7XG4gICAgdmFyIG5hbWUgPSB0eXBlLnNoaWZ0KCk7XG5cbiAgICB3aGlsZSAobmFtZSkge1xuXG4gICAgICBpZiAoIXRyZWVbbmFtZV0pIHtcbiAgICAgICAgdHJlZVtuYW1lXSA9IHt9O1xuICAgICAgfVxuXG4gICAgICB0cmVlID0gdHJlZVtuYW1lXTtcblxuICAgICAgaWYgKHR5cGUubGVuZ3RoID09PSAwKSB7XG5cbiAgICAgICAgaWYgKCF0cmVlLl9saXN0ZW5lcnMpIHtcbiAgICAgICAgICB0cmVlLl9saXN0ZW5lcnMgPSBsaXN0ZW5lcjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKHR5cGVvZiB0cmVlLl9saXN0ZW5lcnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB0cmVlLl9saXN0ZW5lcnMgPSBbdHJlZS5fbGlzdGVuZXJzLCBsaXN0ZW5lcl07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaXNBcnJheSh0cmVlLl9saXN0ZW5lcnMpKSB7XG5cbiAgICAgICAgICB0cmVlLl9saXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG5cbiAgICAgICAgICBpZiAoIXRyZWUuX2xpc3RlbmVycy53YXJuZWQpIHtcblxuICAgICAgICAgICAgdmFyIG0gPSBkZWZhdWx0TWF4TGlzdGVuZXJzO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuX2V2ZW50cy5tYXhMaXN0ZW5lcnMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgIG0gPSB0aGlzLl9ldmVudHMubWF4TGlzdGVuZXJzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobSA+IDAgJiYgdHJlZS5fbGlzdGVuZXJzLmxlbmd0aCA+IG0pIHtcblxuICAgICAgICAgICAgICB0cmVlLl9saXN0ZW5lcnMud2FybmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJlZS5fbGlzdGVuZXJzLmxlbmd0aCk7XG4gICAgICAgICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBuYW1lID0gdHlwZS5zaGlmdCgpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW5cbiAgLy8gMTAgbGlzdGVuZXJzIGFyZSBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoXG4gIC8vIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuICAvL1xuICAvLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3NcbiAgLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5cbiAgRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5kZWxpbWl0ZXIgPSAnLic7XG5cbiAgRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gICAgdGhpcy5fZXZlbnRzIHx8IGluaXQuY2FsbCh0aGlzKTtcbiAgICB0aGlzLl9ldmVudHMubWF4TGlzdGVuZXJzID0gbjtcbiAgICBpZiAoIXRoaXMuX2NvbmYpIHRoaXMuX2NvbmYgPSB7fTtcbiAgICB0aGlzLl9jb25mLm1heExpc3RlbmVycyA9IG47XG4gIH07XG5cbiAgRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5ldmVudCA9ICcnO1xuXG4gIEV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKGV2ZW50LCBmbikge1xuICAgIHRoaXMubWFueShldmVudCwgMSwgZm4pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEV2ZW50RW1pdHRlci5wcm90b3R5cGUubWFueSA9IGZ1bmN0aW9uKGV2ZW50LCB0dGwsIGZuKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYW55IG9ubHkgYWNjZXB0cyBpbnN0YW5jZXMgb2YgRnVuY3Rpb24nKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0ZW5lcigpIHtcbiAgICAgIGlmICgtLXR0bCA9PT0gMCkge1xuICAgICAgICBzZWxmLm9mZihldmVudCwgbGlzdGVuZXIpO1xuICAgICAgfVxuICAgICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICBsaXN0ZW5lci5fb3JpZ2luID0gZm47XG5cbiAgICB0aGlzLm9uKGV2ZW50LCBsaXN0ZW5lcik7XG5cbiAgICByZXR1cm4gc2VsZjtcbiAgfTtcblxuICBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbigpIHtcblxuICAgIHRoaXMuX2V2ZW50cyB8fCBpbml0LmNhbGwodGhpcyk7XG5cbiAgICB2YXIgdHlwZSA9IGFyZ3VtZW50c1swXTtcblxuICAgIGlmICh0eXBlID09PSAnbmV3TGlzdGVuZXInICYmICF0aGlzLm5ld0xpc3RlbmVyKSB7XG4gICAgICBpZiAoIXRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcikgeyByZXR1cm4gZmFsc2U7IH1cbiAgICB9XG5cbiAgICAvLyBMb29wIHRocm91Z2ggdGhlICpfYWxsKiBmdW5jdGlvbnMgYW5kIGludm9rZSB0aGVtLlxuICAgIGlmICh0aGlzLl9hbGwpIHtcbiAgICAgIHZhciBsID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGwgLSAxKTtcbiAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgbDsgaSsrKSBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgIGZvciAoaSA9IDAsIGwgPSB0aGlzLl9hbGwubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHRoaXMuZXZlbnQgPSB0eXBlO1xuICAgICAgICB0aGlzLl9hbGxbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICAgIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG5cbiAgICAgIGlmICghdGhpcy5fYWxsICYmXG4gICAgICAgICF0aGlzLl9ldmVudHMuZXJyb3IgJiZcbiAgICAgICAgISh0aGlzLndpbGRjYXJkICYmIHRoaXMubGlzdGVuZXJUcmVlLmVycm9yKSkge1xuXG4gICAgICAgIGlmIChhcmd1bWVudHNbMV0gaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgIHRocm93IGFyZ3VtZW50c1sxXTsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmNhdWdodCwgdW5zcGVjaWZpZWQgJ2Vycm9yJyBldmVudC5cIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBoYW5kbGVyO1xuXG4gICAgaWYodGhpcy53aWxkY2FyZCkge1xuICAgICAgaGFuZGxlciA9IFtdO1xuICAgICAgdmFyIG5zID0gdHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnID8gdHlwZS5zcGxpdCh0aGlzLmRlbGltaXRlcikgOiB0eXBlLnNsaWNlKCk7XG4gICAgICBzZWFyY2hMaXN0ZW5lclRyZWUuY2FsbCh0aGlzLCBoYW5kbGVyLCBucywgdGhpcy5saXN0ZW5lclRyZWUsIDApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBoYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLmV2ZW50ID0gdHlwZTtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKVxuICAgICAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAvLyBzbG93ZXJcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdmFyIGwgPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkobCAtIDEpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBsOyBpKyspIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGVsc2UgaWYgKGhhbmRsZXIpIHtcbiAgICAgIHZhciBsID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGwgLSAxKTtcbiAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgbDsgaSsrKSBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgICAgdmFyIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gbGlzdGVuZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICB0aGlzLmV2ZW50ID0gdHlwZTtcbiAgICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIChsaXN0ZW5lcnMubGVuZ3RoID4gMCkgfHwgISF0aGlzLl9hbGw7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuICEhdGhpcy5fYWxsO1xuICAgIH1cblxuICB9O1xuXG4gIEV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuXG4gICAgaWYgKHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLm9uQW55KHR5cGUpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdvbiBvbmx5IGFjY2VwdHMgaW5zdGFuY2VzIG9mIEZ1bmN0aW9uJyk7XG4gICAgfVxuICAgIHRoaXMuX2V2ZW50cyB8fCBpbml0LmNhbGwodGhpcyk7XG5cbiAgICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09IFwibmV3TGlzdGVuZXJzXCIhIEJlZm9yZVxuICAgIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJzXCIuXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICAgIGlmKHRoaXMud2lsZGNhcmQpIHtcbiAgICAgIGdyb3dMaXN0ZW5lclRyZWUuY2FsbCh0aGlzLCB0eXBlLCBsaXN0ZW5lcik7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSkge1xuICAgICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgICB9XG4gICAgZWxzZSBpZih0eXBlb2YgdGhpcy5fZXZlbnRzW3R5cGVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNBcnJheSh0aGlzLl9ldmVudHNbdHlwZV0pKSB7XG4gICAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG5cbiAgICAgIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gICAgICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcblxuICAgICAgICB2YXIgbSA9IGRlZmF1bHRNYXhMaXN0ZW5lcnM7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLl9ldmVudHMubWF4TGlzdGVuZXJzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIG0gPSB0aGlzLl9ldmVudHMubWF4TGlzdGVuZXJzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG5cbiAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbkFueSA9IGZ1bmN0aW9uKGZuKSB7XG5cbiAgICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ29uQW55IG9ubHkgYWNjZXB0cyBpbnN0YW5jZXMgb2YgRnVuY3Rpb24nKTtcbiAgICB9XG5cbiAgICBpZighdGhpcy5fYWxsKSB7XG4gICAgICB0aGlzLl9hbGwgPSBbXTtcbiAgICB9XG5cbiAgICAvLyBBZGQgdGhlIGZ1bmN0aW9uIHRvIHRoZSBldmVudCBsaXN0ZW5lciBjb2xsZWN0aW9uLlxuICAgIHRoaXMuX2FsbC5wdXNoKGZuKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbjtcblxuICBFdmVudEVtaXR0ZXIucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdyZW1vdmVMaXN0ZW5lciBvbmx5IHRha2VzIGluc3RhbmNlcyBvZiBGdW5jdGlvbicpO1xuICAgIH1cblxuICAgIHZhciBoYW5kbGVycyxsZWFmcz1bXTtcblxuICAgIGlmKHRoaXMud2lsZGNhcmQpIHtcbiAgICAgIHZhciBucyA9IHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJyA/IHR5cGUuc3BsaXQodGhpcy5kZWxpbWl0ZXIpIDogdHlwZS5zbGljZSgpO1xuICAgICAgbGVhZnMgPSBzZWFyY2hMaXN0ZW5lclRyZWUuY2FsbCh0aGlzLCBudWxsLCBucywgdGhpcy5saXN0ZW5lclRyZWUsIDApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIC8vIGRvZXMgbm90IHVzZSBsaXN0ZW5lcnMoKSwgc28gbm8gc2lkZSBlZmZlY3Qgb2YgY3JlYXRpbmcgX2V2ZW50c1t0eXBlXVxuICAgICAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pIHJldHVybiB0aGlzO1xuICAgICAgaGFuZGxlcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgICBsZWFmcy5wdXNoKHtfbGlzdGVuZXJzOmhhbmRsZXJzfSk7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaUxlYWY9MDsgaUxlYWY8bGVhZnMubGVuZ3RoOyBpTGVhZisrKSB7XG4gICAgICB2YXIgbGVhZiA9IGxlYWZzW2lMZWFmXTtcbiAgICAgIGhhbmRsZXJzID0gbGVhZi5fbGlzdGVuZXJzO1xuICAgICAgaWYgKGlzQXJyYXkoaGFuZGxlcnMpKSB7XG5cbiAgICAgICAgdmFyIHBvc2l0aW9uID0gLTE7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGhhbmRsZXJzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGhhbmRsZXJzW2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgICAgKGhhbmRsZXJzW2ldLmxpc3RlbmVyICYmIGhhbmRsZXJzW2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikgfHxcbiAgICAgICAgICAgIChoYW5kbGVyc1tpXS5fb3JpZ2luICYmIGhhbmRsZXJzW2ldLl9vcmlnaW4gPT09IGxpc3RlbmVyKSkge1xuICAgICAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBvc2l0aW9uIDwgMCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYodGhpcy53aWxkY2FyZCkge1xuICAgICAgICAgIGxlYWYuX2xpc3RlbmVycy5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhbmRsZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIGlmKHRoaXMud2lsZGNhcmQpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBsZWFmLl9saXN0ZW5lcnM7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChoYW5kbGVycyA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgKGhhbmRsZXJzLmxpc3RlbmVyICYmIGhhbmRsZXJzLmxpc3RlbmVyID09PSBsaXN0ZW5lcikgfHxcbiAgICAgICAgKGhhbmRsZXJzLl9vcmlnaW4gJiYgaGFuZGxlcnMuX29yaWdpbiA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIGlmKHRoaXMud2lsZGNhcmQpIHtcbiAgICAgICAgICBkZWxldGUgbGVhZi5fbGlzdGVuZXJzO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBFdmVudEVtaXR0ZXIucHJvdG90eXBlLm9mZkFueSA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgdmFyIGkgPSAwLCBsID0gMCwgZm5zO1xuICAgIGlmIChmbiAmJiB0aGlzLl9hbGwgJiYgdGhpcy5fYWxsLmxlbmd0aCA+IDApIHtcbiAgICAgIGZucyA9IHRoaXMuX2FsbDtcbiAgICAgIGZvcihpID0gMCwgbCA9IGZucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYoZm4gPT09IGZuc1tpXSkge1xuICAgICAgICAgIGZucy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYWxsID0gW107XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLm9mZjtcblxuICBFdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgIXRoaXMuX2V2ZW50cyB8fCBpbml0LmNhbGwodGhpcyk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBpZih0aGlzLndpbGRjYXJkKSB7XG4gICAgICB2YXIgbnMgPSB0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycgPyB0eXBlLnNwbGl0KHRoaXMuZGVsaW1pdGVyKSA6IHR5cGUuc2xpY2UoKTtcbiAgICAgIHZhciBsZWFmcyA9IHNlYXJjaExpc3RlbmVyVHJlZS5jYWxsKHRoaXMsIG51bGwsIG5zLCB0aGlzLmxpc3RlbmVyVHJlZSwgMCk7XG5cbiAgICAgIGZvciAodmFyIGlMZWFmPTA7IGlMZWFmPGxlYWZzLmxlbmd0aDsgaUxlYWYrKykge1xuICAgICAgICB2YXIgbGVhZiA9IGxlYWZzW2lMZWFmXTtcbiAgICAgICAgbGVhZi5fbGlzdGVuZXJzID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSkgcmV0dXJuIHRoaXM7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICBpZih0aGlzLndpbGRjYXJkKSB7XG4gICAgICB2YXIgaGFuZGxlcnMgPSBbXTtcbiAgICAgIHZhciBucyA9IHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJyA/IHR5cGUuc3BsaXQodGhpcy5kZWxpbWl0ZXIpIDogdHlwZS5zbGljZSgpO1xuICAgICAgc2VhcmNoTGlzdGVuZXJUcmVlLmNhbGwodGhpcywgaGFuZGxlcnMsIG5zLCB0aGlzLmxpc3RlbmVyVHJlZSwgMCk7XG4gICAgICByZXR1cm4gaGFuZGxlcnM7XG4gICAgfVxuXG4gICAgdGhpcy5fZXZlbnRzIHx8IGluaXQuY2FsbCh0aGlzKTtcblxuICAgIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKSB0aGlzLl9ldmVudHNbdHlwZV0gPSBbXTtcbiAgICBpZiAoIWlzQXJyYXkodGhpcy5fZXZlbnRzW3R5cGVdKSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9ldmVudHNbdHlwZV07XG4gIH07XG5cbiAgRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnNBbnkgPSBmdW5jdGlvbigpIHtcblxuICAgIGlmKHRoaXMuX2FsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2FsbDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gIH07XG5cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgZGVmaW5lKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIEV2ZW50RW1pdHRlcjtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAvLyBDb21tb25KU1xuICAgIGV4cG9ydHMuRXZlbnRFbWl0dGVyMiA9IEV2ZW50RW1pdHRlcjtcbiAgfVxuICBlbHNlIHtcbiAgICAvLyBCcm93c2VyIGdsb2JhbC5cbiAgICB3aW5kb3cuRXZlbnRFbWl0dGVyMiA9IEV2ZW50RW1pdHRlcjtcbiAgfVxufSgpO1xuIiwiLyohIHNoaWZ0eSAtIHYxLjIuMSAtIDIwMTQtMDYtMjkgLSBodHRwOi8vamVyZW15Y2thaG4uZ2l0aHViLmlvL3NoaWZ0eSAqL1xuOyhmdW5jdGlvbiAocm9vdCkge1xuXG4vKiFcbiAqIFNoaWZ0eSBDb3JlXG4gKiBCeSBKZXJlbXkgS2FobiAtIGplcmVteWNrYWhuQGdtYWlsLmNvbVxuICovXG5cbi8vIFVnbGlmeUpTIGRlZmluZSBoYWNrLiAgVXNlZCBmb3IgdW5pdCB0ZXN0aW5nLiAgQ29udGVudHMgb2YgdGhpcyBpZiBhcmVcbi8vIGNvbXBpbGVkIGF3YXkuXG5pZiAodHlwZW9mIFNISUZUWV9ERUJVR19OT1cgPT09ICd1bmRlZmluZWQnKSB7XG4gIFNISUZUWV9ERUJVR19OT1cgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICtuZXcgRGF0ZSgpO1xuICB9O1xufVxuXG52YXIgVHdlZW5hYmxlID0gKGZ1bmN0aW9uICgpIHtcblxuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gQWxpYXNlcyB0aGF0IGdldCBkZWZpbmVkIGxhdGVyIGluIHRoaXMgZnVuY3Rpb25cbiAgdmFyIGZvcm11bGE7XG5cbiAgLy8gQ09OU1RBTlRTXG4gIHZhciBERUZBVUxUX1NDSEVEVUxFX0ZVTkNUSU9OO1xuICB2YXIgREVGQVVMVF9FQVNJTkcgPSAnbGluZWFyJztcbiAgdmFyIERFRkFVTFRfRFVSQVRJT04gPSA1MDA7XG4gIHZhciBVUERBVEVfVElNRSA9IDEwMDAgLyA2MDtcblxuICB2YXIgX25vdyA9IERhdGUubm93XG4gICAgICAgPyBEYXRlLm5vd1xuICAgICAgIDogZnVuY3Rpb24gKCkge3JldHVybiArbmV3IERhdGUoKTt9O1xuXG4gIHZhciBub3cgPSBTSElGVFlfREVCVUdfTk9XXG4gICAgICAgPyBTSElGVFlfREVCVUdfTk9XXG4gICAgICAgOiBfbm93O1xuXG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgIC8vIHJlcXVlc3RBbmltYXRpb25GcmFtZSgpIHNoaW0gYnkgUGF1bCBJcmlzaCAobW9kaWZpZWQgZm9yIFNoaWZ0eSlcbiAgICAvLyBodHRwOi8vcGF1bGlyaXNoLmNvbS8yMDExL3JlcXVlc3RhbmltYXRpb25mcmFtZS1mb3Itc21hcnQtYW5pbWF0aW5nL1xuICAgIERFRkFVTFRfU0NIRURVTEVfRlVOQ1RJT04gPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gICAgICAgfHwgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZVxuICAgICAgIHx8IHdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gICAgICAgfHwgd2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gICAgICAgfHwgKHdpbmRvdy5tb3pDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgICAgICAmJiB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lKVxuICAgICAgIHx8IHNldFRpbWVvdXQ7XG4gIH0gZWxzZSB7XG4gICAgREVGQVVMVF9TQ0hFRFVMRV9GVU5DVElPTiA9IHNldFRpbWVvdXQ7XG4gIH1cblxuICBmdW5jdGlvbiBub29wICgpIHtcbiAgICAvLyBOT09QIVxuICB9XG5cbiAgLyohXG4gICAqIEhhbmR5IHNob3J0Y3V0IGZvciBkb2luZyBhIGZvci1pbiBsb29wLiBUaGlzIGlzIG5vdCBhIFwibm9ybWFsXCIgZWFjaFxuICAgKiBmdW5jdGlvbiwgaXQgaXMgb3B0aW1pemVkIGZvciBTaGlmdHkuICBUaGUgaXRlcmF0b3IgZnVuY3Rpb24gb25seSByZWNlaXZlc1xuICAgKiB0aGUgcHJvcGVydHkgbmFtZSwgbm90IHRoZSB2YWx1ZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9ialxuICAgKiBAcGFyYW0ge0Z1bmN0aW9uKHN0cmluZyl9IGZuXG4gICAqL1xuICBmdW5jdGlvbiBlYWNoIChvYmosIGZuKSB7XG4gICAgdmFyIGtleTtcbiAgICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgICAgZm4oa2V5KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiFcbiAgICogUGVyZm9ybSBhIHNoYWxsb3cgY29weSBvZiBPYmplY3QgcHJvcGVydGllcy5cbiAgICogQHBhcmFtIHtPYmplY3R9IHRhcmdldE9iamVjdCBUaGUgb2JqZWN0IHRvIGNvcHkgaW50b1xuICAgKiBAcGFyYW0ge09iamVjdH0gc3JjT2JqZWN0IFRoZSBvYmplY3QgdG8gY29weSBmcm9tXG4gICAqIEByZXR1cm4ge09iamVjdH0gQSByZWZlcmVuY2UgdG8gdGhlIGF1Z21lbnRlZCBgdGFyZ2V0T2JqYCBPYmplY3RcbiAgICovXG4gIGZ1bmN0aW9uIHNoYWxsb3dDb3B5ICh0YXJnZXRPYmosIHNyY09iaikge1xuICAgIGVhY2goc3JjT2JqLCBmdW5jdGlvbiAocHJvcCkge1xuICAgICAgdGFyZ2V0T2JqW3Byb3BdID0gc3JjT2JqW3Byb3BdO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRhcmdldE9iajtcbiAgfVxuXG4gIC8qIVxuICAgKiBDb3BpZXMgZWFjaCBwcm9wZXJ0eSBmcm9tIHNyYyBvbnRvIHRhcmdldCwgYnV0IG9ubHkgaWYgdGhlIHByb3BlcnR5IHRvXG4gICAqIGNvcHkgdG8gdGFyZ2V0IGlzIHVuZGVmaW5lZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IHRhcmdldCBNaXNzaW5nIHByb3BlcnRpZXMgaW4gdGhpcyBPYmplY3QgYXJlIGZpbGxlZCBpblxuICAgKiBAcGFyYW0ge09iamVjdH0gc3JjXG4gICAqL1xuICBmdW5jdGlvbiBkZWZhdWx0cyAodGFyZ2V0LCBzcmMpIHtcbiAgICBlYWNoKHNyYywgZnVuY3Rpb24gKHByb3ApIHtcbiAgICAgIGlmICh0eXBlb2YgdGFyZ2V0W3Byb3BdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0YXJnZXRbcHJvcF0gPSBzcmNbcHJvcF07XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiFcbiAgICogQ2FsY3VsYXRlcyB0aGUgaW50ZXJwb2xhdGVkIHR3ZWVuIHZhbHVlcyBvZiBhbiBPYmplY3QgZm9yIGEgZ2l2ZW5cbiAgICogdGltZXN0YW1wLlxuICAgKiBAcGFyYW0ge051bWJlcn0gZm9yUG9zaXRpb24gVGhlIHBvc2l0aW9uIHRvIGNvbXB1dGUgdGhlIHN0YXRlIGZvci5cbiAgICogQHBhcmFtIHtPYmplY3R9IGN1cnJlbnRTdGF0ZSBDdXJyZW50IHN0YXRlIHByb3BlcnRpZXMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcmlnaW5hbFN0YXRlOiBUaGUgb3JpZ2luYWwgc3RhdGUgcHJvcGVydGllcyB0aGUgT2JqZWN0IGlzXG4gICAqIHR3ZWVuaW5nIGZyb20uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXRTdGF0ZTogVGhlIGRlc3RpbmF0aW9uIHN0YXRlIHByb3BlcnRpZXMgdGhlIE9iamVjdFxuICAgKiBpcyB0d2VlbmluZyB0by5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGR1cmF0aW9uOiBUaGUgbGVuZ3RoIG9mIHRoZSB0d2VlbiBpbiBtaWxsaXNlY29uZHMuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lc3RhbXA6IFRoZSBVTklYIGVwb2NoIHRpbWUgYXQgd2hpY2ggdGhlIHR3ZWVuIGJlZ2FuLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZWFzaW5nOiBUaGlzIE9iamVjdCdzIGtleXMgbXVzdCBjb3JyZXNwb25kIHRvIHRoZSBrZXlzIGluXG4gICAqIHRhcmdldFN0YXRlLlxuICAgKi9cbiAgZnVuY3Rpb24gdHdlZW5Qcm9wcyAoZm9yUG9zaXRpb24sIGN1cnJlbnRTdGF0ZSwgb3JpZ2luYWxTdGF0ZSwgdGFyZ2V0U3RhdGUsXG4gICAgZHVyYXRpb24sIHRpbWVzdGFtcCwgZWFzaW5nKSB7XG4gICAgdmFyIG5vcm1hbGl6ZWRQb3NpdGlvbiA9IChmb3JQb3NpdGlvbiAtIHRpbWVzdGFtcCkgLyBkdXJhdGlvbjtcblxuICAgIHZhciBwcm9wO1xuICAgIGZvciAocHJvcCBpbiBjdXJyZW50U3RhdGUpIHtcbiAgICAgIGlmIChjdXJyZW50U3RhdGUuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgY3VycmVudFN0YXRlW3Byb3BdID0gdHdlZW5Qcm9wKG9yaWdpbmFsU3RhdGVbcHJvcF0sXG4gICAgICAgICAgdGFyZ2V0U3RhdGVbcHJvcF0sIGZvcm11bGFbZWFzaW5nW3Byb3BdXSwgbm9ybWFsaXplZFBvc2l0aW9uKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY3VycmVudFN0YXRlO1xuICB9XG5cbiAgLyohXG4gICAqIFR3ZWVucyBhIHNpbmdsZSBwcm9wZXJ0eS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0IFRoZSB2YWx1ZSB0aGF0IHRoZSB0d2VlbiBzdGFydGVkIGZyb20uXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBlbmQgVGhlIHZhbHVlIHRoYXQgdGhlIHR3ZWVuIHNob3VsZCBlbmQgYXQuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGVhc2luZ0Z1bmMgVGhlIGVhc2luZyBjdXJ2ZSB0byBhcHBseSB0byB0aGUgdHdlZW4uXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvbiBUaGUgbm9ybWFsaXplZCBwb3NpdGlvbiAoYmV0d2VlbiAwLjAgYW5kIDEuMCkgdG9cbiAgICogY2FsY3VsYXRlIHRoZSBtaWRwb2ludCBvZiAnc3RhcnQnIGFuZCAnZW5kJyBhZ2FpbnN0LlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSB0d2VlbmVkIHZhbHVlLlxuICAgKi9cbiAgZnVuY3Rpb24gdHdlZW5Qcm9wIChzdGFydCwgZW5kLCBlYXNpbmdGdW5jLCBwb3NpdGlvbikge1xuICAgIHJldHVybiBzdGFydCArIChlbmQgLSBzdGFydCkgKiBlYXNpbmdGdW5jKHBvc2l0aW9uKTtcbiAgfVxuXG4gIC8qIVxuICAgKiBBcHBsaWVzIGEgZmlsdGVyIHRvIFR3ZWVuYWJsZSBpbnN0YW5jZS5cbiAgICogQHBhcmFtIHtUd2VlbmFibGV9IHR3ZWVuYWJsZSBUaGUgYFR3ZWVuYWJsZWAgaW5zdGFuY2UgdG8gY2FsbCB0aGUgZmlsdGVyXG4gICAqIHVwb24uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBmaWx0ZXJOYW1lIFRoZSBuYW1lIG9mIHRoZSBmaWx0ZXIgdG8gYXBwbHkuXG4gICAqL1xuICBmdW5jdGlvbiBhcHBseUZpbHRlciAodHdlZW5hYmxlLCBmaWx0ZXJOYW1lKSB7XG4gICAgdmFyIGZpbHRlcnMgPSBUd2VlbmFibGUucHJvdG90eXBlLmZpbHRlcjtcbiAgICB2YXIgYXJncyA9IHR3ZWVuYWJsZS5fZmlsdGVyQXJncztcblxuICAgIGVhY2goZmlsdGVycywgZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgZmlsdGVyc1tuYW1lXVtmaWx0ZXJOYW1lXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZmlsdGVyc1tuYW1lXVtmaWx0ZXJOYW1lXS5hcHBseSh0d2VlbmFibGUsIGFyZ3MpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdmFyIHRpbWVvdXRIYW5kbGVyX2VuZFRpbWU7XG4gIHZhciB0aW1lb3V0SGFuZGxlcl9jdXJyZW50VGltZTtcbiAgdmFyIHRpbWVvdXRIYW5kbGVyX2lzRW5kZWQ7XG4gIC8qIVxuICAgKiBIYW5kbGVzIHRoZSB1cGRhdGUgbG9naWMgZm9yIG9uZSBzdGVwIG9mIGEgdHdlZW4uXG4gICAqIEBwYXJhbSB7VHdlZW5hYmxlfSB0d2VlbmFibGVcbiAgICogQHBhcmFtIHtudW1iZXJ9IHRpbWVzdGFtcFxuICAgKiBAcGFyYW0ge251bWJlcn0gZHVyYXRpb25cbiAgICogQHBhcmFtIHtPYmplY3R9IGN1cnJlbnRTdGF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gb3JpZ2luYWxTdGF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0U3RhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IGVhc2luZ1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdGVwXG4gICAqIEBwYXJhbSB7RnVuY3Rpb24oRnVuY3Rpb24sbnVtYmVyKX19IHNjaGVkdWxlXG4gICAqL1xuICBmdW5jdGlvbiB0aW1lb3V0SGFuZGxlciAodHdlZW5hYmxlLCB0aW1lc3RhbXAsIGR1cmF0aW9uLCBjdXJyZW50U3RhdGUsXG4gICAgb3JpZ2luYWxTdGF0ZSwgdGFyZ2V0U3RhdGUsIGVhc2luZywgc3RlcCwgc2NoZWR1bGUpIHtcbiAgICB0aW1lb3V0SGFuZGxlcl9lbmRUaW1lID0gdGltZXN0YW1wICsgZHVyYXRpb247XG4gICAgdGltZW91dEhhbmRsZXJfY3VycmVudFRpbWUgPSBNYXRoLm1pbihub3coKSwgdGltZW91dEhhbmRsZXJfZW5kVGltZSk7XG4gICAgdGltZW91dEhhbmRsZXJfaXNFbmRlZCA9IHRpbWVvdXRIYW5kbGVyX2N1cnJlbnRUaW1lID49IHRpbWVvdXRIYW5kbGVyX2VuZFRpbWU7XG5cbiAgICBpZiAodHdlZW5hYmxlLmlzUGxheWluZygpICYmICF0aW1lb3V0SGFuZGxlcl9pc0VuZGVkKSB7XG4gICAgICBzY2hlZHVsZSh0d2VlbmFibGUuX3RpbWVvdXRIYW5kbGVyLCBVUERBVEVfVElNRSk7XG5cbiAgICAgIGFwcGx5RmlsdGVyKHR3ZWVuYWJsZSwgJ2JlZm9yZVR3ZWVuJyk7XG4gICAgICB0d2VlblByb3BzKHRpbWVvdXRIYW5kbGVyX2N1cnJlbnRUaW1lLCBjdXJyZW50U3RhdGUsIG9yaWdpbmFsU3RhdGUsXG4gICAgICAgIHRhcmdldFN0YXRlLCBkdXJhdGlvbiwgdGltZXN0YW1wLCBlYXNpbmcpO1xuICAgICAgYXBwbHlGaWx0ZXIodHdlZW5hYmxlLCAnYWZ0ZXJUd2VlbicpO1xuXG4gICAgICBzdGVwKGN1cnJlbnRTdGF0ZSk7XG4gICAgfSBlbHNlIGlmICh0aW1lb3V0SGFuZGxlcl9pc0VuZGVkKSB7XG4gICAgICBzdGVwKHRhcmdldFN0YXRlKTtcbiAgICAgIHR3ZWVuYWJsZS5zdG9wKHRydWUpO1xuICAgIH1cbiAgfVxuXG5cbiAgLyohXG4gICAqIENyZWF0ZXMgYSB1c2FibGUgZWFzaW5nIE9iamVjdCBmcm9tIGVpdGhlciBhIHN0cmluZyBvciBhbm90aGVyIGVhc2luZ1xuICAgKiBPYmplY3QuICBJZiBgZWFzaW5nYCBpcyBhbiBPYmplY3QsIHRoZW4gdGhpcyBmdW5jdGlvbiBjbG9uZXMgaXQgYW5kIGZpbGxzXG4gICAqIGluIHRoZSBtaXNzaW5nIHByb3BlcnRpZXMgd2l0aCBcImxpbmVhclwiLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZnJvbVR3ZWVuUGFyYW1zXG4gICAqIEBwYXJhbSB7T2JqZWN0fHN0cmluZ30gZWFzaW5nXG4gICAqL1xuICBmdW5jdGlvbiBjb21wb3NlRWFzaW5nT2JqZWN0IChmcm9tVHdlZW5QYXJhbXMsIGVhc2luZykge1xuICAgIHZhciBjb21wb3NlZEVhc2luZyA9IHt9O1xuXG4gICAgaWYgKHR5cGVvZiBlYXNpbmcgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlYWNoKGZyb21Ud2VlblBhcmFtcywgZnVuY3Rpb24gKHByb3ApIHtcbiAgICAgICAgY29tcG9zZWRFYXNpbmdbcHJvcF0gPSBlYXNpbmc7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWFjaChmcm9tVHdlZW5QYXJhbXMsIGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgICAgIGlmICghY29tcG9zZWRFYXNpbmdbcHJvcF0pIHtcbiAgICAgICAgICBjb21wb3NlZEVhc2luZ1twcm9wXSA9IGVhc2luZ1twcm9wXSB8fCBERUZBVUxUX0VBU0lORztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbXBvc2VkRWFzaW5nO1xuICB9XG5cbiAgLyoqXG4gICAqIFR3ZWVuYWJsZSBjb25zdHJ1Y3Rvci5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBvcHRfaW5pdGlhbFN0YXRlIFRoZSB2YWx1ZXMgdGhhdCB0aGUgaW5pdGlhbCB0d2VlbiBzaG91bGQgc3RhcnQgYXQgaWYgYSBcImZyb21cIiBvYmplY3QgaXMgbm90IHByb3ZpZGVkIHRvIFR3ZWVuYWJsZSN0d2Vlbi5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBvcHRfY29uZmlnIFNlZSBUd2VlbmFibGUucHJvdG90eXBlLnNldENvbmZpZygpXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgZnVuY3Rpb24gVHdlZW5hYmxlIChvcHRfaW5pdGlhbFN0YXRlLCBvcHRfY29uZmlnKSB7XG4gICAgdGhpcy5fY3VycmVudFN0YXRlID0gb3B0X2luaXRpYWxTdGF0ZSB8fCB7fTtcbiAgICB0aGlzLl9jb25maWd1cmVkID0gZmFsc2U7XG4gICAgdGhpcy5fc2NoZWR1bGVGdW5jdGlvbiA9IERFRkFVTFRfU0NIRURVTEVfRlVOQ1RJT047XG5cbiAgICAvLyBUbyBwcmV2ZW50IHVubmVjZXNzYXJ5IGNhbGxzIHRvIHNldENvbmZpZyBkbyBub3Qgc2V0IGRlZmF1bHQgY29uZmlndXJhdGlvbiBoZXJlLlxuICAgIC8vIE9ubHkgc2V0IGRlZmF1bHQgY29uZmlndXJhdGlvbiBpbW1lZGlhdGVseSBiZWZvcmUgdHdlZW5pbmcgaWYgbm9uZSBoYXMgYmVlbiBzZXQuXG4gICAgaWYgKHR5cGVvZiBvcHRfY29uZmlnICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy5zZXRDb25maWcob3B0X2NvbmZpZyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZSBhbmQgc3RhcnQgYSB0d2Vlbi5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBvcHRfY29uZmlnIFNlZSBUd2VlbmFibGUucHJvdG90eXBlLnNldENvbmZpZygpXG4gICAqIEByZXR1cm4ge1R3ZWVuYWJsZX1cbiAgICovXG4gIFR3ZWVuYWJsZS5wcm90b3R5cGUudHdlZW4gPSBmdW5jdGlvbiAob3B0X2NvbmZpZykge1xuICAgIGlmICh0aGlzLl9pc1R3ZWVuaW5nKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvLyBPbmx5IHNldCBkZWZhdWx0IGNvbmZpZyBpZiBubyBjb25maWd1cmF0aW9uIGhhcyBiZWVuIHNldCBwcmV2aW91c2x5IGFuZCBub25lIGlzIHByb3ZpZGVkIG5vdy5cbiAgICBpZiAob3B0X2NvbmZpZyAhPT0gdW5kZWZpbmVkIHx8ICF0aGlzLl9jb25maWd1cmVkKSB7XG4gICAgICB0aGlzLnNldENvbmZpZyhvcHRfY29uZmlnKTtcbiAgICB9XG5cbiAgICB0aGlzLl9zdGFydCh0aGlzLmdldCgpKTtcbiAgICByZXR1cm4gdGhpcy5yZXN1bWUoKTtcbiAgfTtcblxuICAvKipcbiAgICogU2V0cyB0aGUgdHdlZW4gY29uZmlndXJhdGlvbi4gYGNvbmZpZ2AgbWF5IGhhdmUgdGhlIGZvbGxvd2luZyBvcHRpb25zOlxuICAgKlxuICAgKiAtIF9fZnJvbV9fIChfT2JqZWN0PV8pOiBTdGFydGluZyBwb3NpdGlvbi4gIElmIG9taXR0ZWQsIHRoZSBjdXJyZW50IHN0YXRlIGlzIHVzZWQuXG4gICAqIC0gX190b19fIChfT2JqZWN0PV8pOiBFbmRpbmcgcG9zaXRpb24uXG4gICAqIC0gX19kdXJhdGlvbl9fIChfbnVtYmVyPV8pOiBIb3cgbWFueSBtaWxsaXNlY29uZHMgdG8gYW5pbWF0ZSBmb3IuXG4gICAqIC0gX19zdGFydF9fIChfRnVuY3Rpb24oT2JqZWN0KT1fKTogRnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRoZSB0d2VlbiBiZWdpbnMuICBSZWNlaXZlcyB0aGUgc3RhdGUgb2YgdGhlIHR3ZWVuIGFzIHRoZSBvbmx5IHBhcmFtZXRlci5cbiAgICogLSBfX3N0ZXBfXyAoX0Z1bmN0aW9uKE9iamVjdCk9Xyk6IEZ1bmN0aW9uIHRvIGV4ZWN1dGUgb24gZXZlcnkgdGljay4gIFJlY2VpdmVzIHRoZSBzdGF0ZSBvZiB0aGUgdHdlZW4gYXMgdGhlIG9ubHkgcGFyYW1ldGVyLiAgVGhpcyBmdW5jdGlvbiBpcyBub3QgY2FsbGVkIG9uIHRoZSBmaW5hbCBzdGVwIG9mIHRoZSBhbmltYXRpb24sIGJ1dCBgZmluaXNoYCBpcy5cbiAgICogLSBfX2ZpbmlzaF9fIChfRnVuY3Rpb24oT2JqZWN0KT1fKTogRnVuY3Rpb24gdG8gZXhlY3V0ZSB1cG9uIHR3ZWVuIGNvbXBsZXRpb24uICBSZWNlaXZlcyB0aGUgc3RhdGUgb2YgdGhlIHR3ZWVuIGFzIHRoZSBvbmx5IHBhcmFtZXRlci5cbiAgICogLSBfX2Vhc2luZ19fIChfT2JqZWN0fHN0cmluZz1fKTogRWFzaW5nIGN1cnZlIG5hbWUocykgdG8gdXNlIGZvciB0aGUgdHdlZW4uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcbiAgICogQHJldHVybiB7VHdlZW5hYmxlfVxuICAgKi9cbiAgVHdlZW5hYmxlLnByb3RvdHlwZS5zZXRDb25maWcgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgY29uZmlnID0gY29uZmlnIHx8IHt9O1xuICAgIHRoaXMuX2NvbmZpZ3VyZWQgPSB0cnVlO1xuXG4gICAgLy8gSW5pdCB0aGUgaW50ZXJuYWwgc3RhdGVcbiAgICB0aGlzLl9wYXVzZWRBdFRpbWUgPSBudWxsO1xuICAgIHRoaXMuX3N0YXJ0ID0gY29uZmlnLnN0YXJ0IHx8IG5vb3A7XG4gICAgdGhpcy5fc3RlcCA9IGNvbmZpZy5zdGVwIHx8IG5vb3A7XG4gICAgdGhpcy5fZmluaXNoID0gY29uZmlnLmZpbmlzaCB8fCBub29wO1xuICAgIHRoaXMuX2R1cmF0aW9uID0gY29uZmlnLmR1cmF0aW9uIHx8IERFRkFVTFRfRFVSQVRJT047XG4gICAgdGhpcy5fY3VycmVudFN0YXRlID0gY29uZmlnLmZyb20gfHwgdGhpcy5nZXQoKTtcbiAgICB0aGlzLl9vcmlnaW5hbFN0YXRlID0gdGhpcy5nZXQoKTtcbiAgICB0aGlzLl90YXJnZXRTdGF0ZSA9IGNvbmZpZy50byB8fCB0aGlzLmdldCgpO1xuICAgIHRoaXMuX3RpbWVzdGFtcCA9IG5vdygpO1xuXG4gICAgLy8gQWxpYXNlcyB1c2VkIGJlbG93XG4gICAgdmFyIGN1cnJlbnRTdGF0ZSA9IHRoaXMuX2N1cnJlbnRTdGF0ZTtcbiAgICB2YXIgdGFyZ2V0U3RhdGUgPSB0aGlzLl90YXJnZXRTdGF0ZTtcblxuICAgIC8vIEVuc3VyZSB0aGF0IHRoZXJlIGlzIGFsd2F5cyBzb21ldGhpbmcgdG8gdHdlZW4gdG8uXG4gICAgZGVmYXVsdHModGFyZ2V0U3RhdGUsIGN1cnJlbnRTdGF0ZSk7XG5cbiAgICB0aGlzLl9lYXNpbmcgPSBjb21wb3NlRWFzaW5nT2JqZWN0KFxuICAgICAgY3VycmVudFN0YXRlLCBjb25maWcuZWFzaW5nIHx8IERFRkFVTFRfRUFTSU5HKTtcblxuICAgIHRoaXMuX2ZpbHRlckFyZ3MgPVxuICAgICAgW2N1cnJlbnRTdGF0ZSwgdGhpcy5fb3JpZ2luYWxTdGF0ZSwgdGFyZ2V0U3RhdGUsIHRoaXMuX2Vhc2luZ107XG5cbiAgICBhcHBseUZpbHRlcih0aGlzLCAndHdlZW5DcmVhdGVkJyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGN1cnJlbnQgc3RhdGUuXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIFR3ZWVuYWJsZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBzaGFsbG93Q29weSh7fSwgdGhpcy5fY3VycmVudFN0YXRlKTtcbiAgfTtcblxuICAvKipcbiAgICogU2V0cyB0aGUgY3VycmVudCBzdGF0ZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlXG4gICAqL1xuICBUd2VlbmFibGUucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIHRoaXMuX2N1cnJlbnRTdGF0ZSA9IHN0YXRlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBQYXVzZXMgYSB0d2Vlbi4gIFBhdXNlZCB0d2VlbnMgY2FuIGJlIHJlc3VtZWQgZnJvbSB0aGUgcG9pbnQgYXQgd2hpY2ggdGhleSB3ZXJlIHBhdXNlZC4gIFRoaXMgaXMgZGlmZmVyZW50IHRoYW4gW2BzdG9wKClgXSgjc3RvcCksIGFzIHRoYXQgbWV0aG9kIGNhdXNlcyBhIHR3ZWVuIHRvIHN0YXJ0IG92ZXIgd2hlbiBpdCBpcyByZXN1bWVkLlxuICAgKiBAcmV0dXJuIHtUd2VlbmFibGV9XG4gICAqL1xuICBUd2VlbmFibGUucHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX3BhdXNlZEF0VGltZSA9IG5vdygpO1xuICAgIHRoaXMuX2lzUGF1c2VkID0gdHJ1ZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogUmVzdW1lcyBhIHBhdXNlZCB0d2Vlbi5cbiAgICogQHJldHVybiB7VHdlZW5hYmxlfVxuICAgKi9cbiAgVHdlZW5hYmxlLnByb3RvdHlwZS5yZXN1bWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuX2lzUGF1c2VkKSB7XG4gICAgICB0aGlzLl90aW1lc3RhbXAgKz0gbm93KCkgLSB0aGlzLl9wYXVzZWRBdFRpbWU7XG4gICAgfVxuXG4gICAgdGhpcy5faXNQYXVzZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9pc1R3ZWVuaW5nID0gdHJ1ZTtcblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB0aGlzLl90aW1lb3V0SGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRpbWVvdXRIYW5kbGVyKHNlbGYsIHNlbGYuX3RpbWVzdGFtcCwgc2VsZi5fZHVyYXRpb24sIHNlbGYuX2N1cnJlbnRTdGF0ZSxcbiAgICAgICAgc2VsZi5fb3JpZ2luYWxTdGF0ZSwgc2VsZi5fdGFyZ2V0U3RhdGUsIHNlbGYuX2Vhc2luZywgc2VsZi5fc3RlcCxcbiAgICAgICAgc2VsZi5fc2NoZWR1bGVGdW5jdGlvbik7XG4gICAgfTtcblxuICAgIHRoaXMuX3RpbWVvdXRIYW5kbGVyKCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogU3RvcHMgYW5kIGNhbmNlbHMgYSB0d2Vlbi5cbiAgICogQHBhcmFtIHtib29sZWFuPX0gZ290b0VuZCBJZiBmYWxzZSBvciBvbWl0dGVkLCB0aGUgdHdlZW4ganVzdCBzdG9wcyBhdCBpdHMgY3VycmVudCBzdGF0ZSwgYW5kIHRoZSBcImZpbmlzaFwiIGhhbmRsZXIgaXMgbm90IGludm9rZWQuICBJZiB0cnVlLCB0aGUgdHdlZW5lZCBvYmplY3QncyB2YWx1ZXMgYXJlIGluc3RhbnRseSBzZXQgdG8gdGhlIHRhcmdldCB2YWx1ZXMsIGFuZCBcImZpbmlzaFwiIGlzIGludm9rZWQuXG4gICAqIEByZXR1cm4ge1R3ZWVuYWJsZX1cbiAgICovXG4gIFR3ZWVuYWJsZS5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uIChnb3RvRW5kKSB7XG4gICAgdGhpcy5faXNUd2VlbmluZyA9IGZhbHNlO1xuICAgIHRoaXMuX2lzUGF1c2VkID0gZmFsc2U7XG4gICAgdGhpcy5fdGltZW91dEhhbmRsZXIgPSBub29wO1xuXG4gICAgaWYgKGdvdG9FbmQpIHtcbiAgICAgIHNoYWxsb3dDb3B5KHRoaXMuX2N1cnJlbnRTdGF0ZSwgdGhpcy5fdGFyZ2V0U3RhdGUpO1xuICAgICAgYXBwbHlGaWx0ZXIodGhpcywgJ2FmdGVyVHdlZW5FbmQnKTtcbiAgICAgIHRoaXMuX2ZpbmlzaC5jYWxsKHRoaXMsIHRoaXMuX2N1cnJlbnRTdGF0ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgd2hldGhlciBvciBub3QgYSB0d2VlbiBpcyBydW5uaW5nLlxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgVHdlZW5hYmxlLnByb3RvdHlwZS5pc1BsYXlpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lzVHdlZW5pbmcgJiYgIXRoaXMuX2lzUGF1c2VkO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZXRzIGEgY3VzdG9tIHNjaGVkdWxlIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBJZiBhIGN1c3RvbSBmdW5jdGlvbiBpcyBub3Qgc2V0IHRoZSBkZWZhdWx0IG9uZSBpcyB1c2VkIFtgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL3dpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIGlmIGF2YWlsYWJsZSwgb3RoZXJ3aXNlIFtgc2V0VGltZW91dGBdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XaW5kb3cuc2V0VGltZW91dCkpLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9uKEZ1bmN0aW9uLG51bWJlcil9IHNjaGVkdWxlRnVuY3Rpb24gVGhlIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB0byBzY2hlZHVsZSB0aGUgbmV4dCBmcmFtZSB0byBiZSByZW5kZXJlZFxuICAgKi9cbiAgVHdlZW5hYmxlLnByb3RvdHlwZS5zZXRTY2hlZHVsZUZ1bmN0aW9uID0gZnVuY3Rpb24gKHNjaGVkdWxlRnVuY3Rpb24pIHtcbiAgICB0aGlzLl9zY2hlZHVsZUZ1bmN0aW9uID0gc2NoZWR1bGVGdW5jdGlvbjtcbiAgfTtcblxuICAvKipcbiAgICogYGRlbGV0ZWBzIGFsbCBcIm93blwiIHByb3BlcnRpZXMuICBDYWxsIHRoaXMgd2hlbiB0aGUgYFR3ZWVuYWJsZWAgaW5zdGFuY2UgaXMgbm8gbG9uZ2VyIG5lZWRlZCB0byBmcmVlIG1lbW9yeS5cbiAgICovXG4gIFR3ZWVuYWJsZS5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJvcDtcbiAgICBmb3IgKHByb3AgaW4gdGhpcykge1xuICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgZGVsZXRlIHRoaXNbcHJvcF07XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qIVxuICAgKiBGaWx0ZXJzIGFyZSB1c2VkIGZvciB0cmFuc2Zvcm1pbmcgdGhlIHByb3BlcnRpZXMgb2YgYSB0d2VlbiBhdCB2YXJpb3VzXG4gICAqIHBvaW50cyBpbiBhIFR3ZWVuYWJsZSdzIGxpZmUgY3ljbGUuICBTZWUgdGhlIFJFQURNRSBmb3IgbW9yZSBpbmZvIG9uIHRoaXMuXG4gICAqL1xuICBUd2VlbmFibGUucHJvdG90eXBlLmZpbHRlciA9IHt9O1xuXG4gIC8qIVxuICAgKiBUaGlzIG9iamVjdCBjb250YWlucyBhbGwgb2YgdGhlIHR3ZWVucyBhdmFpbGFibGUgdG8gU2hpZnR5LiAgSXQgaXMgZXh0ZW5kaWJsZSAtIHNpbXBseSBhdHRhY2ggcHJvcGVydGllcyB0byB0aGUgVHdlZW5hYmxlLnByb3RvdHlwZS5mb3JtdWxhIE9iamVjdCBmb2xsb3dpbmcgdGhlIHNhbWUgZm9ybWF0IGF0IGxpbmVhci5cbiAgICpcbiAgICogYHBvc2Agc2hvdWxkIGJlIGEgbm9ybWFsaXplZCBgbnVtYmVyYCAoYmV0d2VlbiAwIGFuZCAxKS5cbiAgICovXG4gIFR3ZWVuYWJsZS5wcm90b3R5cGUuZm9ybXVsYSA9IHtcbiAgICBsaW5lYXI6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiBwb3M7XG4gICAgfVxuICB9O1xuXG4gIGZvcm11bGEgPSBUd2VlbmFibGUucHJvdG90eXBlLmZvcm11bGE7XG5cbiAgc2hhbGxvd0NvcHkoVHdlZW5hYmxlLCB7XG4gICAgJ25vdyc6IG5vd1xuICAgICwnZWFjaCc6IGVhY2hcbiAgICAsJ3R3ZWVuUHJvcHMnOiB0d2VlblByb3BzXG4gICAgLCd0d2VlblByb3AnOiB0d2VlblByb3BcbiAgICAsJ2FwcGx5RmlsdGVyJzogYXBwbHlGaWx0ZXJcbiAgICAsJ3NoYWxsb3dDb3B5Jzogc2hhbGxvd0NvcHlcbiAgICAsJ2RlZmF1bHRzJzogZGVmYXVsdHNcbiAgICAsJ2NvbXBvc2VFYXNpbmdPYmplY3QnOiBjb21wb3NlRWFzaW5nT2JqZWN0XG4gIH0pO1xuXG4gIC8vIGByb290YCBpcyBwcm92aWRlZCBpbiB0aGUgaW50cm8vb3V0cm8gZmlsZXMuXG5cbiAgLy8gQSBob29rIHVzZWQgZm9yIHVuaXQgdGVzdGluZy5cbiAgaWYgKHR5cGVvZiBTSElGVFlfREVCVUdfTk9XID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcm9vdC50aW1lb3V0SGFuZGxlciA9IHRpbWVvdXRIYW5kbGVyO1xuICB9XG5cbiAgLy8gQm9vdHN0cmFwIFR3ZWVuYWJsZSBhcHByb3ByaWF0ZWx5IGZvciB0aGUgZW52aXJvbm1lbnQuXG4gIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAvLyBDb21tb25KU1xuICAgIG1vZHVsZS5leHBvcnRzID0gVHdlZW5hYmxlO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIEFNRFxuICAgIGRlZmluZShmdW5jdGlvbiAoKSB7cmV0dXJuIFR3ZWVuYWJsZTt9KTtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygcm9vdC5Ud2VlbmFibGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gQnJvd3NlcjogTWFrZSBgVHdlZW5hYmxlYCBnbG9iYWxseSBhY2Nlc3NpYmxlLlxuICAgIHJvb3QuVHdlZW5hYmxlID0gVHdlZW5hYmxlO1xuICB9XG5cbiAgcmV0dXJuIFR3ZWVuYWJsZTtcblxufSAoKSk7XG5cbi8qIVxuICogQWxsIGVxdWF0aW9ucyBhcmUgYWRhcHRlZCBmcm9tIFRob21hcyBGdWNocycgW1NjcmlwdHkyXShodHRwczovL2dpdGh1Yi5jb20vbWFkcm9iYnkvc2NyaXB0eTIvYmxvYi9tYXN0ZXIvc3JjL2VmZmVjdHMvdHJhbnNpdGlvbnMvcGVubmVyLmpzKS5cbiAqXG4gKiBCYXNlZCBvbiBFYXNpbmcgRXF1YXRpb25zIChjKSAyMDAzIFtSb2JlcnQgUGVubmVyXShodHRwOi8vd3d3LnJvYmVydHBlbm5lci5jb20vKSwgYWxsIHJpZ2h0cyByZXNlcnZlZC4gVGhpcyB3b3JrIGlzIFtzdWJqZWN0IHRvIHRlcm1zXShodHRwOi8vd3d3LnJvYmVydHBlbm5lci5jb20vZWFzaW5nX3Rlcm1zX29mX3VzZS5odG1sKS5cbiAqL1xuXG4vKiFcbiAqICBURVJNUyBPRiBVU0UgLSBFQVNJTkcgRVFVQVRJT05TXG4gKiAgT3BlbiBzb3VyY2UgdW5kZXIgdGhlIEJTRCBMaWNlbnNlLlxuICogIEVhc2luZyBFcXVhdGlvbnMgKGMpIDIwMDMgUm9iZXJ0IFBlbm5lciwgYWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqL1xuXG47KGZ1bmN0aW9uICgpIHtcblxuICBUd2VlbmFibGUuc2hhbGxvd0NvcHkoVHdlZW5hYmxlLnByb3RvdHlwZS5mb3JtdWxhLCB7XG4gICAgZWFzZUluUXVhZDogZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIE1hdGgucG93KHBvcywgMik7XG4gICAgfSxcblxuICAgIGVhc2VPdXRRdWFkOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gLShNYXRoLnBvdygocG9zIC0gMSksIDIpIC0gMSk7XG4gICAgfSxcblxuICAgIGVhc2VJbk91dFF1YWQ6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIGlmICgocG9zIC89IDAuNSkgPCAxKSB7cmV0dXJuIDAuNSAqIE1hdGgucG93KHBvcywyKTt9XG4gICAgICByZXR1cm4gLTAuNSAqICgocG9zIC09IDIpICogcG9zIC0gMik7XG4gICAgfSxcblxuICAgIGVhc2VJbkN1YmljOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gTWF0aC5wb3cocG9zLCAzKTtcbiAgICB9LFxuXG4gICAgZWFzZU91dEN1YmljOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gKE1hdGgucG93KChwb3MgLSAxKSwgMykgKyAxKTtcbiAgICB9LFxuXG4gICAgZWFzZUluT3V0Q3ViaWM6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIGlmICgocG9zIC89IDAuNSkgPCAxKSB7cmV0dXJuIDAuNSAqIE1hdGgucG93KHBvcywzKTt9XG4gICAgICByZXR1cm4gMC41ICogKE1hdGgucG93KChwb3MgLSAyKSwzKSArIDIpO1xuICAgIH0sXG5cbiAgICBlYXNlSW5RdWFydDogZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIE1hdGgucG93KHBvcywgNCk7XG4gICAgfSxcblxuICAgIGVhc2VPdXRRdWFydDogZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIC0oTWF0aC5wb3coKHBvcyAtIDEpLCA0KSAtIDEpO1xuICAgIH0sXG5cbiAgICBlYXNlSW5PdXRRdWFydDogZnVuY3Rpb24gKHBvcykge1xuICAgICAgaWYgKChwb3MgLz0gMC41KSA8IDEpIHtyZXR1cm4gMC41ICogTWF0aC5wb3cocG9zLDQpO31cbiAgICAgIHJldHVybiAtMC41ICogKChwb3MgLT0gMikgKiBNYXRoLnBvdyhwb3MsMykgLSAyKTtcbiAgICB9LFxuXG4gICAgZWFzZUluUXVpbnQ6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiBNYXRoLnBvdyhwb3MsIDUpO1xuICAgIH0sXG5cbiAgICBlYXNlT3V0UXVpbnQ6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiAoTWF0aC5wb3coKHBvcyAtIDEpLCA1KSArIDEpO1xuICAgIH0sXG5cbiAgICBlYXNlSW5PdXRRdWludDogZnVuY3Rpb24gKHBvcykge1xuICAgICAgaWYgKChwb3MgLz0gMC41KSA8IDEpIHtyZXR1cm4gMC41ICogTWF0aC5wb3cocG9zLDUpO31cbiAgICAgIHJldHVybiAwLjUgKiAoTWF0aC5wb3coKHBvcyAtIDIpLDUpICsgMik7XG4gICAgfSxcblxuICAgIGVhc2VJblNpbmU6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiAtTWF0aC5jb3MocG9zICogKE1hdGguUEkgLyAyKSkgKyAxO1xuICAgIH0sXG5cbiAgICBlYXNlT3V0U2luZTogZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIE1hdGguc2luKHBvcyAqIChNYXRoLlBJIC8gMikpO1xuICAgIH0sXG5cbiAgICBlYXNlSW5PdXRTaW5lOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gKC0wLjUgKiAoTWF0aC5jb3MoTWF0aC5QSSAqIHBvcykgLSAxKSk7XG4gICAgfSxcblxuICAgIGVhc2VJbkV4cG86IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiAocG9zID09PSAwKSA/IDAgOiBNYXRoLnBvdygyLCAxMCAqIChwb3MgLSAxKSk7XG4gICAgfSxcblxuICAgIGVhc2VPdXRFeHBvOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gKHBvcyA9PT0gMSkgPyAxIDogLU1hdGgucG93KDIsIC0xMCAqIHBvcykgKyAxO1xuICAgIH0sXG5cbiAgICBlYXNlSW5PdXRFeHBvOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICBpZiAocG9zID09PSAwKSB7cmV0dXJuIDA7fVxuICAgICAgaWYgKHBvcyA9PT0gMSkge3JldHVybiAxO31cbiAgICAgIGlmICgocG9zIC89IDAuNSkgPCAxKSB7cmV0dXJuIDAuNSAqIE1hdGgucG93KDIsMTAgKiAocG9zIC0gMSkpO31cbiAgICAgIHJldHVybiAwLjUgKiAoLU1hdGgucG93KDIsIC0xMCAqIC0tcG9zKSArIDIpO1xuICAgIH0sXG5cbiAgICBlYXNlSW5DaXJjOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gLShNYXRoLnNxcnQoMSAtIChwb3MgKiBwb3MpKSAtIDEpO1xuICAgIH0sXG5cbiAgICBlYXNlT3V0Q2lyYzogZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIE1hdGguc3FydCgxIC0gTWF0aC5wb3coKHBvcyAtIDEpLCAyKSk7XG4gICAgfSxcblxuICAgIGVhc2VJbk91dENpcmM6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIGlmICgocG9zIC89IDAuNSkgPCAxKSB7cmV0dXJuIC0wLjUgKiAoTWF0aC5zcXJ0KDEgLSBwb3MgKiBwb3MpIC0gMSk7fVxuICAgICAgcmV0dXJuIDAuNSAqIChNYXRoLnNxcnQoMSAtIChwb3MgLT0gMikgKiBwb3MpICsgMSk7XG4gICAgfSxcblxuICAgIGVhc2VPdXRCb3VuY2U6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIGlmICgocG9zKSA8ICgxIC8gMi43NSkpIHtcbiAgICAgICAgcmV0dXJuICg3LjU2MjUgKiBwb3MgKiBwb3MpO1xuICAgICAgfSBlbHNlIGlmIChwb3MgPCAoMiAvIDIuNzUpKSB7XG4gICAgICAgIHJldHVybiAoNy41NjI1ICogKHBvcyAtPSAoMS41IC8gMi43NSkpICogcG9zICsgMC43NSk7XG4gICAgICB9IGVsc2UgaWYgKHBvcyA8ICgyLjUgLyAyLjc1KSkge1xuICAgICAgICByZXR1cm4gKDcuNTYyNSAqIChwb3MgLT0gKDIuMjUgLyAyLjc1KSkgKiBwb3MgKyAwLjkzNzUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuICg3LjU2MjUgKiAocG9zIC09ICgyLjYyNSAvIDIuNzUpKSAqIHBvcyArIDAuOTg0Mzc1KTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZWFzZUluQmFjazogZnVuY3Rpb24gKHBvcykge1xuICAgICAgdmFyIHMgPSAxLjcwMTU4O1xuICAgICAgcmV0dXJuIChwb3MpICogcG9zICogKChzICsgMSkgKiBwb3MgLSBzKTtcbiAgICB9LFxuXG4gICAgZWFzZU91dEJhY2s6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHZhciBzID0gMS43MDE1ODtcbiAgICAgIHJldHVybiAocG9zID0gcG9zIC0gMSkgKiBwb3MgKiAoKHMgKyAxKSAqIHBvcyArIHMpICsgMTtcbiAgICB9LFxuXG4gICAgZWFzZUluT3V0QmFjazogZnVuY3Rpb24gKHBvcykge1xuICAgICAgdmFyIHMgPSAxLjcwMTU4O1xuICAgICAgaWYgKChwb3MgLz0gMC41KSA8IDEpIHtyZXR1cm4gMC41ICogKHBvcyAqIHBvcyAqICgoKHMgKj0gKDEuNTI1KSkgKyAxKSAqIHBvcyAtIHMpKTt9XG4gICAgICByZXR1cm4gMC41ICogKChwb3MgLT0gMikgKiBwb3MgKiAoKChzICo9ICgxLjUyNSkpICsgMSkgKiBwb3MgKyBzKSArIDIpO1xuICAgIH0sXG5cbiAgICBlbGFzdGljOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gLTEgKiBNYXRoLnBvdyg0LC04ICogcG9zKSAqIE1hdGguc2luKChwb3MgKiA2IC0gMSkgKiAoMiAqIE1hdGguUEkpIC8gMikgKyAxO1xuICAgIH0sXG5cbiAgICBzd2luZ0Zyb21UbzogZnVuY3Rpb24gKHBvcykge1xuICAgICAgdmFyIHMgPSAxLjcwMTU4O1xuICAgICAgcmV0dXJuICgocG9zIC89IDAuNSkgPCAxKSA/IDAuNSAqIChwb3MgKiBwb3MgKiAoKChzICo9ICgxLjUyNSkpICsgMSkgKiBwb3MgLSBzKSkgOlxuICAgICAgICAgIDAuNSAqICgocG9zIC09IDIpICogcG9zICogKCgocyAqPSAoMS41MjUpKSArIDEpICogcG9zICsgcykgKyAyKTtcbiAgICB9LFxuXG4gICAgc3dpbmdGcm9tOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICB2YXIgcyA9IDEuNzAxNTg7XG4gICAgICByZXR1cm4gcG9zICogcG9zICogKChzICsgMSkgKiBwb3MgLSBzKTtcbiAgICB9LFxuXG4gICAgc3dpbmdUbzogZnVuY3Rpb24gKHBvcykge1xuICAgICAgdmFyIHMgPSAxLjcwMTU4O1xuICAgICAgcmV0dXJuIChwb3MgLT0gMSkgKiBwb3MgKiAoKHMgKyAxKSAqIHBvcyArIHMpICsgMTtcbiAgICB9LFxuXG4gICAgYm91bmNlOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICBpZiAocG9zIDwgKDEgLyAyLjc1KSkge1xuICAgICAgICByZXR1cm4gKDcuNTYyNSAqIHBvcyAqIHBvcyk7XG4gICAgICB9IGVsc2UgaWYgKHBvcyA8ICgyIC8gMi43NSkpIHtcbiAgICAgICAgcmV0dXJuICg3LjU2MjUgKiAocG9zIC09ICgxLjUgLyAyLjc1KSkgKiBwb3MgKyAwLjc1KTtcbiAgICAgIH0gZWxzZSBpZiAocG9zIDwgKDIuNSAvIDIuNzUpKSB7XG4gICAgICAgIHJldHVybiAoNy41NjI1ICogKHBvcyAtPSAoMi4yNSAvIDIuNzUpKSAqIHBvcyArIDAuOTM3NSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gKDcuNTYyNSAqIChwb3MgLT0gKDIuNjI1IC8gMi43NSkpICogcG9zICsgMC45ODQzNzUpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBib3VuY2VQYXN0OiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICBpZiAocG9zIDwgKDEgLyAyLjc1KSkge1xuICAgICAgICByZXR1cm4gKDcuNTYyNSAqIHBvcyAqIHBvcyk7XG4gICAgICB9IGVsc2UgaWYgKHBvcyA8ICgyIC8gMi43NSkpIHtcbiAgICAgICAgcmV0dXJuIDIgLSAoNy41NjI1ICogKHBvcyAtPSAoMS41IC8gMi43NSkpICogcG9zICsgMC43NSk7XG4gICAgICB9IGVsc2UgaWYgKHBvcyA8ICgyLjUgLyAyLjc1KSkge1xuICAgICAgICByZXR1cm4gMiAtICg3LjU2MjUgKiAocG9zIC09ICgyLjI1IC8gMi43NSkpICogcG9zICsgMC45Mzc1KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAyIC0gKDcuNTYyNSAqIChwb3MgLT0gKDIuNjI1IC8gMi43NSkpICogcG9zICsgMC45ODQzNzUpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBlYXNlRnJvbVRvOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICBpZiAoKHBvcyAvPSAwLjUpIDwgMSkge3JldHVybiAwLjUgKiBNYXRoLnBvdyhwb3MsNCk7fVxuICAgICAgcmV0dXJuIC0wLjUgKiAoKHBvcyAtPSAyKSAqIE1hdGgucG93KHBvcywzKSAtIDIpO1xuICAgIH0sXG5cbiAgICBlYXNlRnJvbTogZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIE1hdGgucG93KHBvcyw0KTtcbiAgICB9LFxuXG4gICAgZWFzZVRvOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gTWF0aC5wb3cocG9zLDAuMjUpO1xuICAgIH1cbiAgfSk7XG5cbn0oKSk7XG5cbi8qIVxuICogVGhlIEJlemllciBtYWdpYyBpbiB0aGlzIGZpbGUgaXMgYWRhcHRlZC9jb3BpZWQgYWxtb3N0IHdob2xlc2FsZSBmcm9tXG4gKiBbU2NyaXB0eTJdKGh0dHBzOi8vZ2l0aHViLmNvbS9tYWRyb2JieS9zY3JpcHR5Mi9ibG9iL21hc3Rlci9zcmMvZWZmZWN0cy90cmFuc2l0aW9ucy9jdWJpYy1iZXppZXIuanMpLFxuICogd2hpY2ggd2FzIGFkYXB0ZWQgZnJvbSBBcHBsZSBjb2RlICh3aGljaCBwcm9iYWJseSBjYW1lIGZyb21cbiAqIFtoZXJlXShodHRwOi8vb3BlbnNvdXJjZS5hcHBsZS5jb20vc291cmNlL1dlYkNvcmUvV2ViQ29yZS05NTUuNjYvcGxhdGZvcm0vZ3JhcGhpY3MvVW5pdEJlemllci5oKSkuXG4gKiBTcGVjaWFsIHRoYW5rcyB0byBBcHBsZSBhbmQgVGhvbWFzIEZ1Y2hzIGZvciBtdWNoIG9mIHRoaXMgY29kZS5cbiAqL1xuXG4vKiFcbiAqICBDb3B5cmlnaHQgKGMpIDIwMDYgQXBwbGUgQ29tcHV0ZXIsIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiAgUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0XG4gKiAgbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG4gKlxuICogIDEuIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSxcbiAqICB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuICpcbiAqICAyLiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsXG4gKiAgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvblxuICogIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuICpcbiAqICAzLiBOZWl0aGVyIHRoZSBuYW1lIG9mIHRoZSBjb3B5cmlnaHQgaG9sZGVyKHMpIG5vciB0aGUgbmFtZXMgb2YgYW55XG4gKiAgY29udHJpYnV0b3JzIG1heSBiZSB1c2VkIHRvIGVuZG9yc2Ugb3IgcHJvbW90ZSBwcm9kdWN0cyBkZXJpdmVkIGZyb21cbiAqICB0aGlzIHNvZnR3YXJlIHdpdGhvdXQgc3BlY2lmaWMgcHJpb3Igd3JpdHRlbiBwZXJtaXNzaW9uLlxuICpcbiAqICBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTXG4gKiAgXCJBUyBJU1wiIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLFxuICogIFRIRSBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRVxuICogIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUIE9XTkVSIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEVcbiAqICBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTXG4gKiAgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTO1xuICogIExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTlxuICogIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUXG4gKiAgKElOQ0xVRElORyBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVNcbiAqICBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbiAqL1xuOyhmdW5jdGlvbiAoKSB7XG4gIC8vIHBvcnQgb2Ygd2Via2l0IGN1YmljIGJlemllciBoYW5kbGluZyBieSBodHRwOi8vd3d3Lm5ldHpnZXN0YS5kZS9kZXYvXG4gIGZ1bmN0aW9uIGN1YmljQmV6aWVyQXRUaW1lKHQscDF4LHAxeSxwMngscDJ5LGR1cmF0aW9uKSB7XG4gICAgdmFyIGF4ID0gMCxieCA9IDAsY3ggPSAwLGF5ID0gMCxieSA9IDAsY3kgPSAwO1xuICAgIGZ1bmN0aW9uIHNhbXBsZUN1cnZlWCh0KSB7cmV0dXJuICgoYXggKiB0ICsgYngpICogdCArIGN4KSAqIHQ7fVxuICAgIGZ1bmN0aW9uIHNhbXBsZUN1cnZlWSh0KSB7cmV0dXJuICgoYXkgKiB0ICsgYnkpICogdCArIGN5KSAqIHQ7fVxuICAgIGZ1bmN0aW9uIHNhbXBsZUN1cnZlRGVyaXZhdGl2ZVgodCkge3JldHVybiAoMy4wICogYXggKiB0ICsgMi4wICogYngpICogdCArIGN4O31cbiAgICBmdW5jdGlvbiBzb2x2ZUVwc2lsb24oZHVyYXRpb24pIHtyZXR1cm4gMS4wIC8gKDIwMC4wICogZHVyYXRpb24pO31cbiAgICBmdW5jdGlvbiBzb2x2ZSh4LGVwc2lsb24pIHtyZXR1cm4gc2FtcGxlQ3VydmVZKHNvbHZlQ3VydmVYKHgsZXBzaWxvbikpO31cbiAgICBmdW5jdGlvbiBmYWJzKG4pIHtpZiAobiA+PSAwKSB7cmV0dXJuIG47fWVsc2Uge3JldHVybiAwIC0gbjt9fVxuICAgIGZ1bmN0aW9uIHNvbHZlQ3VydmVYKHgsZXBzaWxvbikge1xuICAgICAgdmFyIHQwLHQxLHQyLHgyLGQyLGk7XG4gICAgICBmb3IgKHQyID0geCwgaSA9IDA7IGkgPCA4OyBpKyspIHt4MiA9IHNhbXBsZUN1cnZlWCh0MikgLSB4OyBpZiAoZmFicyh4MikgPCBlcHNpbG9uKSB7cmV0dXJuIHQyO30gZDIgPSBzYW1wbGVDdXJ2ZURlcml2YXRpdmVYKHQyKTsgaWYgKGZhYnMoZDIpIDwgMWUtNikge2JyZWFrO30gdDIgPSB0MiAtIHgyIC8gZDI7fVxuICAgICAgdDAgPSAwLjA7IHQxID0gMS4wOyB0MiA9IHg7IGlmICh0MiA8IHQwKSB7cmV0dXJuIHQwO30gaWYgKHQyID4gdDEpIHtyZXR1cm4gdDE7fVxuICAgICAgd2hpbGUgKHQwIDwgdDEpIHt4MiA9IHNhbXBsZUN1cnZlWCh0Mik7IGlmIChmYWJzKHgyIC0geCkgPCBlcHNpbG9uKSB7cmV0dXJuIHQyO30gaWYgKHggPiB4Mikge3QwID0gdDI7fWVsc2Uge3QxID0gdDI7fSB0MiA9ICh0MSAtIHQwKSAqIDAuNSArIHQwO31cbiAgICAgIHJldHVybiB0MjsgLy8gRmFpbHVyZS5cbiAgICB9XG4gICAgY3ggPSAzLjAgKiBwMXg7IGJ4ID0gMy4wICogKHAyeCAtIHAxeCkgLSBjeDsgYXggPSAxLjAgLSBjeCAtIGJ4OyBjeSA9IDMuMCAqIHAxeTsgYnkgPSAzLjAgKiAocDJ5IC0gcDF5KSAtIGN5OyBheSA9IDEuMCAtIGN5IC0gYnk7XG4gICAgcmV0dXJuIHNvbHZlKHQsIHNvbHZlRXBzaWxvbihkdXJhdGlvbikpO1xuICB9XG4gIC8qIVxuICAgKiAgZ2V0Q3ViaWNCZXppZXJUcmFuc2l0aW9uKHgxLCB5MSwgeDIsIHkyKSAtPiBGdW5jdGlvblxuICAgKlxuICAgKiAgR2VuZXJhdGVzIGEgdHJhbnNpdGlvbiBlYXNpbmcgZnVuY3Rpb24gdGhhdCBpcyBjb21wYXRpYmxlXG4gICAqICB3aXRoIFdlYktpdCdzIENTUyB0cmFuc2l0aW9ucyBgLXdlYmtpdC10cmFuc2l0aW9uLXRpbWluZy1mdW5jdGlvbmBcbiAgICogIENTUyBwcm9wZXJ0eS5cbiAgICpcbiAgICogIFRoZSBXM0MgaGFzIG1vcmUgaW5mb3JtYXRpb24gYWJvdXRcbiAgICogIDxhIGhyZWY9XCJodHRwOi8vd3d3LnczLm9yZy9UUi9jc3MzLXRyYW5zaXRpb25zLyN0cmFuc2l0aW9uLXRpbWluZy1mdW5jdGlvbl90YWdcIj5cbiAgICogIENTUzMgdHJhbnNpdGlvbiB0aW1pbmcgZnVuY3Rpb25zPC9hPi5cbiAgICpcbiAgICogIEBwYXJhbSB7bnVtYmVyfSB4MVxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHkxXG4gICAqICBAcGFyYW0ge251bWJlcn0geDJcbiAgICogIEBwYXJhbSB7bnVtYmVyfSB5MlxuICAgKiAgQHJldHVybiB7ZnVuY3Rpb259XG4gICAqL1xuICBmdW5jdGlvbiBnZXRDdWJpY0JlemllclRyYW5zaXRpb24gKHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiBjdWJpY0JlemllckF0VGltZShwb3MseDEseTEseDIseTIsMSk7XG4gICAgfTtcbiAgfVxuICAvLyBFbmQgcG9ydGVkIGNvZGVcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIEJlemllciBlYXNpbmcgZnVuY3Rpb24gYW5kIGF0dGFjaGVzIGl0IHRvIGBUd2VlbmFibGUucHJvdG90eXBlLmZvcm11bGFgLiAgVGhpcyBmdW5jdGlvbiBnaXZlcyB5b3UgdG90YWwgY29udHJvbCBvdmVyIHRoZSBlYXNpbmcgY3VydmUuICBNYXR0aGV3IExlaW4ncyBbQ2Vhc2VyXShodHRwOi8vbWF0dGhld2xlaW4uY29tL2NlYXNlci8pIGlzIGEgdXNlZnVsIHRvb2wgZm9yIHZpc3VhbGl6aW5nIHRoZSBjdXJ2ZXMgeW91IGNhbiBtYWtlIHdpdGggdGhpcyBmdW5jdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIGVhc2luZyBjdXJ2ZS4gIE92ZXJ3cml0ZXMgdGhlIG9sZCBlYXNpbmcgZnVuY3Rpb24gb24gVHdlZW5hYmxlLnByb3RvdHlwZS5mb3JtdWxhIGlmIGl0IGV4aXN0cy5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHgxXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB5MVxuICAgKiBAcGFyYW0ge251bWJlcn0geDJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHkyXG4gICAqIEByZXR1cm4ge2Z1bmN0aW9ufSBUaGUgZWFzaW5nIGZ1bmN0aW9uIHRoYXQgd2FzIGF0dGFjaGVkIHRvIFR3ZWVuYWJsZS5wcm90b3R5cGUuZm9ybXVsYS5cbiAgICovXG4gIFR3ZWVuYWJsZS5zZXRCZXppZXJGdW5jdGlvbiA9IGZ1bmN0aW9uIChuYW1lLCB4MSwgeTEsIHgyLCB5Mikge1xuICAgIHZhciBjdWJpY0JlemllclRyYW5zaXRpb24gPSBnZXRDdWJpY0JlemllclRyYW5zaXRpb24oeDEsIHkxLCB4MiwgeTIpO1xuICAgIGN1YmljQmV6aWVyVHJhbnNpdGlvbi54MSA9IHgxO1xuICAgIGN1YmljQmV6aWVyVHJhbnNpdGlvbi55MSA9IHkxO1xuICAgIGN1YmljQmV6aWVyVHJhbnNpdGlvbi54MiA9IHgyO1xuICAgIGN1YmljQmV6aWVyVHJhbnNpdGlvbi55MiA9IHkyO1xuXG4gICAgcmV0dXJuIFR3ZWVuYWJsZS5wcm90b3R5cGUuZm9ybXVsYVtuYW1lXSA9IGN1YmljQmV6aWVyVHJhbnNpdGlvbjtcbiAgfTtcblxuXG4gIC8qKlxuICAgKiBgZGVsZXRlYHMgYW4gZWFzaW5nIGZ1bmN0aW9uIGZyb20gYFR3ZWVuYWJsZS5wcm90b3R5cGUuZm9ybXVsYWAuICBCZSBjYXJlZnVsIHdpdGggdGhpcyBtZXRob2QsIGFzIGl0IGBkZWxldGVgcyB3aGF0ZXZlciBlYXNpbmcgZm9ybXVsYSBtYXRjaGVzIGBuYW1lYCAod2hpY2ggbWVhbnMgeW91IGNhbiBkZWxldGUgZGVmYXVsdCBTaGlmdHkgZWFzaW5nIGZ1bmN0aW9ucykuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBlYXNpbmcgZnVuY3Rpb24gdG8gZGVsZXRlLlxuICAgKiBAcmV0dXJuIHtmdW5jdGlvbn1cbiAgICovXG4gIFR3ZWVuYWJsZS51bnNldEJlemllckZ1bmN0aW9uID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBkZWxldGUgVHdlZW5hYmxlLnByb3RvdHlwZS5mb3JtdWxhW25hbWVdO1xuICB9O1xuXG59KSgpO1xuXG47KGZ1bmN0aW9uICgpIHtcblxuICBmdW5jdGlvbiBnZXRJbnRlcnBvbGF0ZWRWYWx1ZXMgKFxuICAgIGZyb20sIGN1cnJlbnQsIHRhcmdldFN0YXRlLCBwb3NpdGlvbiwgZWFzaW5nKSB7XG4gICAgcmV0dXJuIFR3ZWVuYWJsZS50d2VlblByb3BzKFxuICAgICAgcG9zaXRpb24sIGN1cnJlbnQsIGZyb20sIHRhcmdldFN0YXRlLCAxLCAwLCBlYXNpbmcpO1xuICB9XG5cbiAgLy8gRmFrZSBhIFR3ZWVuYWJsZSBhbmQgcGF0Y2ggc29tZSBpbnRlcm5hbHMuICBUaGlzIGFwcHJvYWNoIGFsbG93cyB1cyB0b1xuICAvLyBza2lwIHVuZWNjZXNzYXJ5IHByb2Nlc3NpbmcgYW5kIG9iamVjdCByZWNyZWF0aW9uLCBjdXR0aW5nIGRvd24gb24gZ2FyYmFnZVxuICAvLyBjb2xsZWN0aW9uIHBhdXNlcy5cbiAgdmFyIG1vY2tUd2VlbmFibGUgPSBuZXcgVHdlZW5hYmxlKCk7XG4gIG1vY2tUd2VlbmFibGUuX2ZpbHRlckFyZ3MgPSBbXTtcblxuICAvKipcbiAgICogQ29tcHV0ZSB0aGUgbWlkcG9pbnQgb2YgdHdvIE9iamVjdHMuICBUaGlzIG1ldGhvZCBlZmZlY3RpdmVseSBjYWxjdWxhdGVzIGEgc3BlY2lmaWMgZnJhbWUgb2YgYW5pbWF0aW9uIHRoYXQgW1R3ZWVuYWJsZSN0d2Vlbl0oc2hpZnR5LmNvcmUuanMuaHRtbCN0d2VlbikgZG9lcyBtYW55IHRpbWVzIG92ZXIgdGhlIGNvdXJzZSBvZiBhIHR3ZWVuLlxuICAgKlxuICAgKiBFeGFtcGxlOlxuICAgKlxuICAgKiBgYGBcbiAgICogIHZhciBpbnRlcnBvbGF0ZWRWYWx1ZXMgPSBUd2VlbmFibGUuaW50ZXJwb2xhdGUoe1xuICAgKiAgICB3aWR0aDogJzEwMHB4JyxcbiAgICogICAgb3BhY2l0eTogMCxcbiAgICogICAgY29sb3I6ICcjZmZmJ1xuICAgKiAgfSwge1xuICAgKiAgICB3aWR0aDogJzIwMHB4JyxcbiAgICogICAgb3BhY2l0eTogMSxcbiAgICogICAgY29sb3I6ICcjMDAwJ1xuICAgKiAgfSwgMC41KTtcbiAgICpcbiAgICogIGNvbnNvbGUubG9nKGludGVycG9sYXRlZFZhbHVlcyk7XG4gICAqICAvLyB7b3BhY2l0eTogMC41LCB3aWR0aDogXCIxNTBweFwiLCBjb2xvcjogXCJyZ2IoMTI3LDEyNywxMjcpXCJ9XG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZnJvbSBUaGUgc3RhcnRpbmcgdmFsdWVzIHRvIHR3ZWVuIGZyb20uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXRTdGF0ZSBUaGUgZW5kaW5nIHZhbHVlcyB0byB0d2VlbiB0by5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHBvc2l0aW9uIFRoZSBub3JtYWxpemVkIHBvc2l0aW9uIHZhbHVlIChiZXR3ZWVuIDAuMCBhbmQgMS4wKSB0byBpbnRlcnBvbGF0ZSB0aGUgdmFsdWVzIGJldHdlZW4gYGZyb21gIGFuZCBgdG9gIGZvci4gIGBmcm9tYCByZXByZXNlbnRzIDAgYW5kIGB0b2AgcmVwcmVzZW50cyBgMWAuXG4gICAqIEBwYXJhbSB7c3RyaW5nfE9iamVjdH0gZWFzaW5nIFRoZSBlYXNpbmcgY3VydmUocykgdG8gY2FsY3VsYXRlIHRoZSBtaWRwb2ludCBhZ2FpbnN0LiAgWW91IGNhbiByZWZlcmVuY2UgYW55IGVhc2luZyBmdW5jdGlvbiBhdHRhY2hlZCB0byBgVHdlZW5hYmxlLnByb3RvdHlwZS5mb3JtdWxhYC4gIElmIG9taXR0ZWQsIHRoaXMgZGVmYXVsdHMgdG8gXCJsaW5lYXJcIi5cbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cbiAgVHdlZW5hYmxlLmludGVycG9sYXRlID0gZnVuY3Rpb24gKGZyb20sIHRhcmdldFN0YXRlLCBwb3NpdGlvbiwgZWFzaW5nKSB7XG4gICAgdmFyIGN1cnJlbnQgPSBUd2VlbmFibGUuc2hhbGxvd0NvcHkoe30sIGZyb20pO1xuICAgIHZhciBlYXNpbmdPYmplY3QgPSBUd2VlbmFibGUuY29tcG9zZUVhc2luZ09iamVjdChcbiAgICAgIGZyb20sIGVhc2luZyB8fCAnbGluZWFyJyk7XG5cbiAgICBtb2NrVHdlZW5hYmxlLnNldCh7fSk7XG5cbiAgICAvLyBBbGlhcyBhbmQgcmV1c2UgdGhlIF9maWx0ZXJBcmdzIGFycmF5IGluc3RlYWQgb2YgcmVjcmVhdGluZyBpdC5cbiAgICB2YXIgZmlsdGVyQXJncyA9IG1vY2tUd2VlbmFibGUuX2ZpbHRlckFyZ3M7XG4gICAgZmlsdGVyQXJncy5sZW5ndGggPSAwO1xuICAgIGZpbHRlckFyZ3NbMF0gPSBjdXJyZW50O1xuICAgIGZpbHRlckFyZ3NbMV0gPSBmcm9tO1xuICAgIGZpbHRlckFyZ3NbMl0gPSB0YXJnZXRTdGF0ZTtcbiAgICBmaWx0ZXJBcmdzWzNdID0gZWFzaW5nT2JqZWN0O1xuXG4gICAgLy8gQW55IGRlZmluZWQgdmFsdWUgdHJhbnNmb3JtYXRpb24gbXVzdCBiZSBhcHBsaWVkXG4gICAgVHdlZW5hYmxlLmFwcGx5RmlsdGVyKG1vY2tUd2VlbmFibGUsICd0d2VlbkNyZWF0ZWQnKTtcbiAgICBUd2VlbmFibGUuYXBwbHlGaWx0ZXIobW9ja1R3ZWVuYWJsZSwgJ2JlZm9yZVR3ZWVuJyk7XG5cbiAgICB2YXIgaW50ZXJwb2xhdGVkVmFsdWVzID0gZ2V0SW50ZXJwb2xhdGVkVmFsdWVzKFxuICAgICAgZnJvbSwgY3VycmVudCwgdGFyZ2V0U3RhdGUsIHBvc2l0aW9uLCBlYXNpbmdPYmplY3QpO1xuXG4gICAgLy8gVHJhbnNmb3JtIHZhbHVlcyBiYWNrIGludG8gdGhlaXIgb3JpZ2luYWwgZm9ybWF0XG4gICAgVHdlZW5hYmxlLmFwcGx5RmlsdGVyKG1vY2tUd2VlbmFibGUsICdhZnRlclR3ZWVuJyk7XG5cbiAgICByZXR1cm4gaW50ZXJwb2xhdGVkVmFsdWVzO1xuICB9O1xuXG59KCkpO1xuXG4vKipcbiAqIEFkZHMgc3RyaW5nIGludGVycG9sYXRpb24gc3VwcG9ydCB0byBTaGlmdHkuXG4gKlxuICogVGhlIFRva2VuIGV4dGVuc2lvbiBhbGxvd3MgU2hpZnR5IHRvIHR3ZWVuIG51bWJlcnMgaW5zaWRlIG9mIHN0cmluZ3MuICBBbW9uZyBvdGhlciB0aGluZ3MsIHRoaXMgYWxsb3dzIHlvdSB0byBhbmltYXRlIENTUyBwcm9wZXJ0aWVzLiAgRm9yIGV4YW1wbGUsIHlvdSBjYW4gZG8gdGhpczpcbiAqXG4gKiBgYGBcbiAqIHZhciB0d2VlbmFibGUgPSBuZXcgVHdlZW5hYmxlKCk7XG4gKiB0d2VlbmFibGUudHdlZW4oe1xuICogICBmcm9tOiB7IHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoNDVweCknfSxcbiAqICAgdG86IHsgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCg5MHhwKSd9XG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqIGB0cmFuc2xhdGVYKDQ1KWAgd2lsbCBiZSB0d2VlbmVkIHRvIGB0cmFuc2xhdGVYKDkwKWAuICBUbyBkZW1vbnN0cmF0ZTpcbiAqXG4gKiBgYGBcbiAqIHZhciB0d2VlbmFibGUgPSBuZXcgVHdlZW5hYmxlKCk7XG4gKiB0d2VlbmFibGUudHdlZW4oe1xuICogICBmcm9tOiB7IHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoNDVweCknfSxcbiAqICAgdG86IHsgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCg5MHB4KSd9LFxuICogICBzdGVwOiBmdW5jdGlvbiAoc3RhdGUpIHtcbiAqICAgICBjb25zb2xlLmxvZyhzdGF0ZS50cmFuc2Zvcm0pO1xuICogICB9XG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqIFRoZSBhYm92ZSBzbmlwcGV0IHdpbGwgbG9nIHNvbWV0aGluZyBsaWtlIHRoaXMgaW4gdGhlIGNvbnNvbGU6XG4gKlxuICogYGBgXG4gKiB0cmFuc2xhdGVYKDYwLjNweClcbiAqIC4uLlxuICogdHJhbnNsYXRlWCg3Ni4wNXB4KVxuICogLi4uXG4gKiB0cmFuc2xhdGVYKDkwcHgpXG4gKiBgYGBcbiAqXG4gKiBBbm90aGVyIHVzZSBmb3IgdGhpcyBpcyBhbmltYXRpbmcgY29sb3JzOlxuICpcbiAqIGBgYFxuICogdmFyIHR3ZWVuYWJsZSA9IG5ldyBUd2VlbmFibGUoKTtcbiAqIHR3ZWVuYWJsZS50d2Vlbih7XG4gKiAgIGZyb206IHsgY29sb3I6ICdyZ2IoMCwyNTUsMCknfSxcbiAqICAgdG86IHsgY29sb3I6ICdyZ2IoMjU1LDAsMjU1KSd9LFxuICogICBzdGVwOiBmdW5jdGlvbiAoc3RhdGUpIHtcbiAqICAgICBjb25zb2xlLmxvZyhzdGF0ZS5jb2xvcik7XG4gKiAgIH1cbiAqIH0pO1xuICogYGBgXG4gKlxuICogVGhlIGFib3ZlIHNuaXBwZXQgd2lsbCBsb2cgc29tZXRoaW5nIGxpa2UgdGhpczpcbiAqXG4gKiBgYGBcbiAqIHJnYig4NCwxNzAsODQpXG4gKiAuLi5cbiAqIHJnYigxNzAsODQsMTcwKVxuICogLi4uXG4gKiByZ2IoMjU1LDAsMjU1KVxuICogYGBgXG4gKlxuICogVGhpcyBleHRlbnNpb24gYWxzbyBzdXBwb3J0cyBoZXhhZGVjaW1hbCBjb2xvcnMsIGluIGJvdGggbG9uZyAoYCNmZjAwZmZgKSBhbmQgc2hvcnQgKGAjZjBmYCkgZm9ybXMuICBCZSBhd2FyZSB0aGF0IGhleGFkZWNpbWFsIGlucHV0IHZhbHVlcyB3aWxsIGJlIGNvbnZlcnRlZCBpbnRvIHRoZSBlcXVpdmFsZW50IFJHQiBvdXRwdXQgdmFsdWVzLiAgVGhpcyBpcyBkb25lIHRvIG9wdGltaXplIGZvciBwZXJmb3JtYW5jZS5cbiAqXG4gKiBgYGBcbiAqIHZhciB0d2VlbmFibGUgPSBuZXcgVHdlZW5hYmxlKCk7XG4gKiB0d2VlbmFibGUudHdlZW4oe1xuICogICBmcm9tOiB7IGNvbG9yOiAnIzBmMCd9LFxuICogICB0bzogeyBjb2xvcjogJyNmMGYnfSxcbiAqICAgc3RlcDogZnVuY3Rpb24gKHN0YXRlKSB7XG4gKiAgICAgY29uc29sZS5sb2coc3RhdGUuY29sb3IpO1xuICogICB9XG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqIFRoaXMgc25pcHBldCB3aWxsIGdlbmVyYXRlIHRoZSBzYW1lIG91dHB1dCBhcyB0aGUgb25lIGJlZm9yZSBpdCBiZWNhdXNlIGVxdWl2YWxlbnQgdmFsdWVzIHdlcmUgc3VwcGxpZWQgKGp1c3QgaW4gaGV4YWRlY2ltYWwgZm9ybSByYXRoZXIgdGhhbiBSR0IpOlxuICpcbiAqIGBgYFxuICogcmdiKDg0LDE3MCw4NClcbiAqIC4uLlxuICogcmdiKDE3MCw4NCwxNzApXG4gKiAuLi5cbiAqIHJnYigyNTUsMCwyNTUpXG4gKiBgYGBcbiAqXG4gKiAjIyBFYXNpbmcgc3VwcG9ydFxuICpcbiAqIEVhc2luZyB3b3JrcyBzb21ld2hhdCBkaWZmZXJlbnRseSBpbiB0aGUgVG9rZW4gZXh0ZW5zaW9uLiAgVGhpcyBpcyBiZWNhdXNlIHNvbWUgQ1NTIHByb3BlcnRpZXMgaGF2ZSBtdWx0aXBsZSB2YWx1ZXMgaW4gdGhlbSwgYW5kIHlvdSBtaWdodCBuZWVkIHRvIHR3ZWVuIGVhY2ggdmFsdWUgYWxvbmcgaXRzIG93biBlYXNpbmcgY3VydmUuICBBIGJhc2ljIGV4YW1wbGU6XG4gKlxuICogYGBgXG4gKiB2YXIgdHdlZW5hYmxlID0gbmV3IFR3ZWVuYWJsZSgpO1xuICogdHdlZW5hYmxlLnR3ZWVuKHtcbiAqICAgZnJvbTogeyB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDBweCkgdHJhbnNsYXRlWSgwcHgpJ30sXG4gKiAgIHRvOiB7IHRyYW5zZm9ybTogICAndHJhbnNsYXRlWCgxMDBweCkgdHJhbnNsYXRlWSgxMDBweCknfSxcbiAqICAgZWFzaW5nOiB7IHRyYW5zZm9ybTogJ2Vhc2VJblF1YWQnIH0sXG4gKiAgIHN0ZXA6IGZ1bmN0aW9uIChzdGF0ZSkge1xuICogICAgIGNvbnNvbGUubG9nKHN0YXRlLnRyYW5zZm9ybSk7XG4gKiAgIH1cbiAqIH0pO1xuICogYGBgXG4gKlxuICogVGhlIGFib3ZlIHNuaXBwZXQgY3JlYXRlIHZhbHVlcyBsaWtlIHRoaXM6XG4gKlxuICogYGBgXG4gKiB0cmFuc2xhdGVYKDExLjU2MDAwMDAwMDAwMDAwMnB4KSB0cmFuc2xhdGVZKDExLjU2MDAwMDAwMDAwMDAwMnB4KVxuICogLi4uXG4gKiB0cmFuc2xhdGVYKDQ2LjI0MDAwMDAwMDAwMDAxcHgpIHRyYW5zbGF0ZVkoNDYuMjQwMDAwMDAwMDAwMDFweClcbiAqIC4uLlxuICogdHJhbnNsYXRlWCgxMDBweCkgdHJhbnNsYXRlWSgxMDBweClcbiAqIGBgYFxuICpcbiAqIEluIHRoaXMgY2FzZSwgdGhlIHZhbHVlcyBmb3IgYHRyYW5zbGF0ZVhgIGFuZCBgdHJhbnNsYXRlWWAgYXJlIGFsd2F5cyB0aGUgc2FtZSBmb3IgZWFjaCBzdGVwIG9mIHRoZSB0d2VlbiwgYmVjYXVzZSB0aGV5IGhhdmUgdGhlIHNhbWUgc3RhcnQgYW5kIGVuZCBwb2ludHMgYW5kIGJvdGggdXNlIHRoZSBzYW1lIGVhc2luZyBjdXJ2ZS4gIFdlIGNhbiBhbHNvIHR3ZWVuIGB0cmFuc2xhdGVYYCBhbmQgYHRyYW5zbGF0ZVlgIGFsb25nIGluZGVwZW5kZW50IGN1cnZlczpcbiAqXG4gKiBgYGBcbiAqIHZhciB0d2VlbmFibGUgPSBuZXcgVHdlZW5hYmxlKCk7XG4gKiB0d2VlbmFibGUudHdlZW4oe1xuICogICBmcm9tOiB7IHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMHB4KSB0cmFuc2xhdGVZKDBweCknfSxcbiAqICAgdG86IHsgdHJhbnNmb3JtOiAgICd0cmFuc2xhdGVYKDEwMHB4KSB0cmFuc2xhdGVZKDEwMHB4KSd9LFxuICogICBlYXNpbmc6IHsgdHJhbnNmb3JtOiAnZWFzZUluUXVhZCBib3VuY2UnIH0sXG4gKiAgIHN0ZXA6IGZ1bmN0aW9uIChzdGF0ZSkge1xuICogICAgIGNvbnNvbGUubG9nKHN0YXRlLnRyYW5zZm9ybSk7XG4gKiAgIH1cbiAqIH0pO1xuICogYGBgXG4gKlxuICogVGhlIGFib3ZlIHNuaXBwZXQgY3JlYXRlIHZhbHVlcyBsaWtlIHRoaXM6XG4gKlxuICogYGBgXG4gKiB0cmFuc2xhdGVYKDEwLjg5cHgpIHRyYW5zbGF0ZVkoODIuMzU1NjI1cHgpXG4gKiAuLi5cbiAqIHRyYW5zbGF0ZVgoNDQuODkwMDAwMDAwMDAwMDFweCkgdHJhbnNsYXRlWSg4Ni43MzA2MjUwMDAwMDAwMnB4KVxuICogLi4uXG4gKiB0cmFuc2xhdGVYKDEwMHB4KSB0cmFuc2xhdGVZKDEwMHB4KVxuICogYGBgXG4gKlxuICogYHRyYW5zbGF0ZVhgIGFuZCBgdHJhbnNsYXRlWWAgYXJlIG5vdCBpbiBzeW5jIGFueW1vcmUsIGJlY2F1c2UgYGVhc2VJblF1YWRgIHdhcyBzcGVjaWZpZWQgZm9yIGB0cmFuc2xhdGVYYCBhbmQgYGJvdW5jZWAgZm9yIGB0cmFuc2xhdGVZYC4gIE1peGluZyBhbmQgbWF0Y2hpbmcgZWFzaW5nIGN1cnZlcyBjYW4gbWFrZSBmb3Igc29tZSBpbnRlcmVzdGluZyBtb3Rpb24gaW4geW91ciBhbmltYXRpb25zLlxuICpcbiAqIFRoZSBvcmRlciBvZiB0aGUgc3BhY2Utc2VwYXJhdGVkIGVhc2luZyBjdXJ2ZXMgY29ycmVzcG9uZCB0aGUgdG9rZW4gdmFsdWVzIHRoZXkgYXBwbHkgdG8uICBJZiB0aGVyZSBhcmUgbW9yZSB0b2tlbiB2YWx1ZXMgdGhhbiBlYXNpbmcgY3VydmVzIGxpc3RlZCwgdGhlIGxhc3QgZWFzaW5nIGN1cnZlIGxpc3RlZCBpcyB1c2VkLlxuICovXG5mdW5jdGlvbiB0b2tlbiAoKSB7XG4gIC8vIEZ1bmN0aW9uYWxpdHkgZm9yIHRoaXMgZXh0ZW5zaW9uIHJ1bnMgaW1wbGljaXRseSBpZiBpdCBpcyBsb2FkZWQuXG59IC8qISovXG5cbi8vIHRva2VuIGZ1bmN0aW9uIGlzIGRlZmluZWQgYWJvdmUgb25seSBzbyB0aGF0IGRveC1mb3VuZGF0aW9uIHNlZXMgaXQgYXNcbi8vIGRvY3VtZW50YXRpb24gYW5kIHJlbmRlcnMgaXQuICBJdCBpcyBuZXZlciB1c2VkLCBhbmQgaXMgb3B0aW1pemVkIGF3YXkgYXRcbi8vIGJ1aWxkIHRpbWUuXG5cbjsoZnVuY3Rpb24gKFR3ZWVuYWJsZSkge1xuXG4gIC8qIVxuICAgKiBAdHlwZWRlZiB7e1xuICAgKiAgIGZvcm1hdFN0cmluZzogc3RyaW5nXG4gICAqICAgY2h1bmtOYW1lczogQXJyYXkuPHN0cmluZz5cbiAgICogfX1cbiAgICovXG4gIHZhciBmb3JtYXRNYW5pZmVzdDtcblxuICAvLyBDT05TVEFOVFNcblxuICB2YXIgUl9GT1JNQVRfQ0hVTktTID0gLyhbXlxcLTAtOVxcLl0rKS9nO1xuICB2YXIgUl9VTkZPUk1BVFRFRF9WQUxVRVMgPSAvWzAtOS5cXC1dKy9nO1xuICB2YXIgUl9SR0IgPSBuZXcgUmVnRXhwKFxuICAgICdyZ2JcXFxcKCcgKyBSX1VORk9STUFUVEVEX1ZBTFVFUy5zb3VyY2UgK1xuICAgICgvLFxccyovLnNvdXJjZSkgKyBSX1VORk9STUFUVEVEX1ZBTFVFUy5zb3VyY2UgK1xuICAgICgvLFxccyovLnNvdXJjZSkgKyBSX1VORk9STUFUVEVEX1ZBTFVFUy5zb3VyY2UgKyAnXFxcXCknLCAnZycpO1xuICB2YXIgUl9SR0JfUFJFRklYID0gL14uKlxcKC87XG4gIHZhciBSX0hFWCA9IC8jKFswLTldfFthLWZdKXszLDZ9L2dpO1xuICB2YXIgVkFMVUVfUExBQ0VIT0xERVIgPSAnVkFMJztcblxuICAvLyBIRUxQRVJTXG5cbiAgdmFyIGdldEZvcm1hdENodW5rc0Zyb21fYWNjdW11bGF0b3IgPSBbXTtcbiAgLyohXG4gICAqIEBwYXJhbSB7QXJyYXkubnVtYmVyfSByYXdWYWx1ZXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHByZWZpeFxuICAgKlxuICAgKiBAcmV0dXJuIHtBcnJheS48c3RyaW5nPn1cbiAgICovXG4gIGZ1bmN0aW9uIGdldEZvcm1hdENodW5rc0Zyb20gKHJhd1ZhbHVlcywgcHJlZml4KSB7XG4gICAgZ2V0Rm9ybWF0Q2h1bmtzRnJvbV9hY2N1bXVsYXRvci5sZW5ndGggPSAwO1xuXG4gICAgdmFyIHJhd1ZhbHVlc0xlbmd0aCA9IHJhd1ZhbHVlcy5sZW5ndGg7XG4gICAgdmFyIGk7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgcmF3VmFsdWVzTGVuZ3RoOyBpKyspIHtcbiAgICAgIGdldEZvcm1hdENodW5rc0Zyb21fYWNjdW11bGF0b3IucHVzaCgnXycgKyBwcmVmaXggKyAnXycgKyBpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZ2V0Rm9ybWF0Q2h1bmtzRnJvbV9hY2N1bXVsYXRvcjtcbiAgfVxuXG4gIC8qIVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZm9ybWF0dGVkU3RyaW5nXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIGdldEZvcm1hdFN0cmluZ0Zyb20gKGZvcm1hdHRlZFN0cmluZykge1xuICAgIHZhciBjaHVua3MgPSBmb3JtYXR0ZWRTdHJpbmcubWF0Y2goUl9GT1JNQVRfQ0hVTktTKTtcblxuICAgIGlmICghY2h1bmtzKSB7XG4gICAgICAvLyBjaHVua3Mgd2lsbCBiZSBudWxsIGlmIHRoZXJlIHdlcmUgbm8gdG9rZW5zIHRvIHBhcnNlIGluXG4gICAgICAvLyBmb3JtYXR0ZWRTdHJpbmcgKGZvciBleGFtcGxlLCBpZiBmb3JtYXR0ZWRTdHJpbmcgaXMgJzInKS4gIENvZXJjZVxuICAgICAgLy8gY2h1bmtzIHRvIGJlIHVzZWZ1bCBoZXJlLlxuICAgICAgY2h1bmtzID0gWycnLCAnJ107XG4gICAgfSBlbHNlIGlmIChjaHVua3MubGVuZ3RoID09PSAxKSB7XG4gICAgICBjaHVua3MudW5zaGlmdCgnJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNodW5rcy5qb2luKFZBTFVFX1BMQUNFSE9MREVSKTtcbiAgfVxuXG4gIC8qIVxuICAgKiBDb252ZXJ0IGFsbCBoZXggY29sb3IgdmFsdWVzIHdpdGhpbiBhIHN0cmluZyB0byBhbiByZ2Igc3RyaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVPYmplY3RcbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgbW9kaWZpZWQgb2JqXG4gICAqL1xuICBmdW5jdGlvbiBzYW5pdGl6ZU9iamVjdEZvckhleFByb3BzIChzdGF0ZU9iamVjdCkge1xuICAgIFR3ZWVuYWJsZS5lYWNoKHN0YXRlT2JqZWN0LCBmdW5jdGlvbiAocHJvcCkge1xuICAgICAgdmFyIGN1cnJlbnRQcm9wID0gc3RhdGVPYmplY3RbcHJvcF07XG5cbiAgICAgIGlmICh0eXBlb2YgY3VycmVudFByb3AgPT09ICdzdHJpbmcnICYmIGN1cnJlbnRQcm9wLm1hdGNoKFJfSEVYKSkge1xuICAgICAgICBzdGF0ZU9iamVjdFtwcm9wXSA9IHNhbml0aXplSGV4Q2h1bmtzVG9SR0IoY3VycmVudFByb3ApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyohXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gIHNhbml0aXplSGV4Q2h1bmtzVG9SR0IgKHN0cikge1xuICAgIHJldHVybiBmaWx0ZXJTdHJpbmdDaHVua3MoUl9IRVgsIHN0ciwgY29udmVydEhleFRvUkdCKTtcbiAgfVxuXG4gIC8qIVxuICAgKiBAcGFyYW0ge3N0cmluZ30gaGV4U3RyaW5nXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIGNvbnZlcnRIZXhUb1JHQiAoaGV4U3RyaW5nKSB7XG4gICAgdmFyIHJnYkFyciA9IGhleFRvUkdCQXJyYXkoaGV4U3RyaW5nKTtcbiAgICByZXR1cm4gJ3JnYignICsgcmdiQXJyWzBdICsgJywnICsgcmdiQXJyWzFdICsgJywnICsgcmdiQXJyWzJdICsgJyknO1xuICB9XG5cbiAgdmFyIGhleFRvUkdCQXJyYXlfcmV0dXJuQXJyYXkgPSBbXTtcbiAgLyohXG4gICAqIENvbnZlcnQgYSBoZXhhZGVjaW1hbCBzdHJpbmcgdG8gYW4gYXJyYXkgd2l0aCB0aHJlZSBpdGVtcywgb25lIGVhY2ggZm9yXG4gICAqIHRoZSByZWQsIGJsdWUsIGFuZCBncmVlbiBkZWNpbWFsIHZhbHVlcy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGhleCBBIGhleGFkZWNpbWFsIHN0cmluZy5cbiAgICpcbiAgICogQHJldHVybnMge0FycmF5LjxudW1iZXI+fSBUaGUgY29udmVydGVkIEFycmF5IG9mIFJHQiB2YWx1ZXMgaWYgYGhleGAgaXMgYVxuICAgKiB2YWxpZCBzdHJpbmcsIG9yIGFuIEFycmF5IG9mIHRocmVlIDAncy5cbiAgICovXG4gIGZ1bmN0aW9uIGhleFRvUkdCQXJyYXkgKGhleCkge1xuXG4gICAgaGV4ID0gaGV4LnJlcGxhY2UoLyMvLCAnJyk7XG5cbiAgICAvLyBJZiB0aGUgc3RyaW5nIGlzIGEgc2hvcnRoYW5kIHRocmVlIGRpZ2l0IGhleCBub3RhdGlvbiwgbm9ybWFsaXplIGl0IHRvXG4gICAgLy8gdGhlIHN0YW5kYXJkIHNpeCBkaWdpdCBub3RhdGlvblxuICAgIGlmIChoZXgubGVuZ3RoID09PSAzKSB7XG4gICAgICBoZXggPSBoZXguc3BsaXQoJycpO1xuICAgICAgaGV4ID0gaGV4WzBdICsgaGV4WzBdICsgaGV4WzFdICsgaGV4WzFdICsgaGV4WzJdICsgaGV4WzJdO1xuICAgIH1cblxuICAgIGhleFRvUkdCQXJyYXlfcmV0dXJuQXJyYXlbMF0gPSBoZXhUb0RlYyhoZXguc3Vic3RyKDAsIDIpKTtcbiAgICBoZXhUb1JHQkFycmF5X3JldHVybkFycmF5WzFdID0gaGV4VG9EZWMoaGV4LnN1YnN0cigyLCAyKSk7XG4gICAgaGV4VG9SR0JBcnJheV9yZXR1cm5BcnJheVsyXSA9IGhleFRvRGVjKGhleC5zdWJzdHIoNCwgMikpO1xuXG4gICAgcmV0dXJuIGhleFRvUkdCQXJyYXlfcmV0dXJuQXJyYXk7XG4gIH1cblxuICAvKiFcbiAgICogQ29udmVydCBhIGJhc2UtMTYgbnVtYmVyIHRvIGJhc2UtMTAuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfFN0cmluZ30gaGV4IFRoZSB2YWx1ZSB0byBjb252ZXJ0XG4gICAqXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9IFRoZSBiYXNlLTEwIGVxdWl2YWxlbnQgb2YgYGhleGAuXG4gICAqL1xuICBmdW5jdGlvbiBoZXhUb0RlYyAoaGV4KSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KGhleCwgMTYpO1xuICB9XG5cbiAgLyohXG4gICAqIFJ1bnMgYSBmaWx0ZXIgb3BlcmF0aW9uIG9uIGFsbCBjaHVua3Mgb2YgYSBzdHJpbmcgdGhhdCBtYXRjaCBhIFJlZ0V4cFxuICAgKlxuICAgKiBAcGFyYW0ge1JlZ0V4cH0gcGF0dGVyblxuICAgKiBAcGFyYW0ge3N0cmluZ30gdW5maWx0ZXJlZFN0cmluZ1xuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKHN0cmluZyl9IGZpbHRlclxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBmaWx0ZXJTdHJpbmdDaHVua3MgKHBhdHRlcm4sIHVuZmlsdGVyZWRTdHJpbmcsIGZpbHRlcikge1xuICAgIHZhciBwYXR0ZW5NYXRjaGVzID0gdW5maWx0ZXJlZFN0cmluZy5tYXRjaChwYXR0ZXJuKTtcbiAgICB2YXIgZmlsdGVyZWRTdHJpbmcgPSB1bmZpbHRlcmVkU3RyaW5nLnJlcGxhY2UocGF0dGVybiwgVkFMVUVfUExBQ0VIT0xERVIpO1xuXG4gICAgaWYgKHBhdHRlbk1hdGNoZXMpIHtcbiAgICAgIHZhciBwYXR0ZW5NYXRjaGVzTGVuZ3RoID0gcGF0dGVuTWF0Y2hlcy5sZW5ndGg7XG4gICAgICB2YXIgY3VycmVudENodW5rO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhdHRlbk1hdGNoZXNMZW5ndGg7IGkrKykge1xuICAgICAgICBjdXJyZW50Q2h1bmsgPSBwYXR0ZW5NYXRjaGVzLnNoaWZ0KCk7XG4gICAgICAgIGZpbHRlcmVkU3RyaW5nID0gZmlsdGVyZWRTdHJpbmcucmVwbGFjZShcbiAgICAgICAgICBWQUxVRV9QTEFDRUhPTERFUiwgZmlsdGVyKGN1cnJlbnRDaHVuaykpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmaWx0ZXJlZFN0cmluZztcbiAgfVxuXG4gIC8qIVxuICAgKiBDaGVjayBmb3IgZmxvYXRpbmcgcG9pbnQgdmFsdWVzIHdpdGhpbiByZ2Igc3RyaW5ncyBhbmQgcm91bmRzIHRoZW0uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtYXR0ZWRTdHJpbmdcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gc2FuaXRpemVSR0JDaHVua3MgKGZvcm1hdHRlZFN0cmluZykge1xuICAgIHJldHVybiBmaWx0ZXJTdHJpbmdDaHVua3MoUl9SR0IsIGZvcm1hdHRlZFN0cmluZywgc2FuaXRpemVSR0JDaHVuayk7XG4gIH1cblxuICAvKiFcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJnYkNodW5rXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIHNhbml0aXplUkdCQ2h1bmsgKHJnYkNodW5rKSB7XG4gICAgdmFyIG51bWJlcnMgPSByZ2JDaHVuay5tYXRjaChSX1VORk9STUFUVEVEX1ZBTFVFUyk7XG4gICAgdmFyIG51bWJlcnNMZW5ndGggPSBudW1iZXJzLmxlbmd0aDtcbiAgICB2YXIgc2FuaXRpemVkU3RyaW5nID0gcmdiQ2h1bmsubWF0Y2goUl9SR0JfUFJFRklYKVswXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtYmVyc0xlbmd0aDsgaSsrKSB7XG4gICAgICBzYW5pdGl6ZWRTdHJpbmcgKz0gcGFyc2VJbnQobnVtYmVyc1tpXSwgMTApICsgJywnO1xuICAgIH1cblxuICAgIHNhbml0aXplZFN0cmluZyA9IHNhbml0aXplZFN0cmluZy5zbGljZSgwLCAtMSkgKyAnKSc7XG5cbiAgICByZXR1cm4gc2FuaXRpemVkU3RyaW5nO1xuICB9XG5cbiAgLyohXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZU9iamVjdFxuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R9IEFuIE9iamVjdCBvZiBmb3JtYXRNYW5pZmVzdHMgdGhhdCBjb3JyZXNwb25kIHRvXG4gICAqIHRoZSBzdHJpbmcgcHJvcGVydGllcyBvZiBzdGF0ZU9iamVjdFxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0Rm9ybWF0TWFuaWZlc3RzIChzdGF0ZU9iamVjdCkge1xuICAgIHZhciBtYW5pZmVzdEFjY3VtdWxhdG9yID0ge307XG5cbiAgICBUd2VlbmFibGUuZWFjaChzdGF0ZU9iamVjdCwgZnVuY3Rpb24gKHByb3ApIHtcbiAgICAgIHZhciBjdXJyZW50UHJvcCA9IHN0YXRlT2JqZWN0W3Byb3BdO1xuXG4gICAgICBpZiAodHlwZW9mIGN1cnJlbnRQcm9wID09PSAnc3RyaW5nJykge1xuICAgICAgICB2YXIgcmF3VmFsdWVzID0gZ2V0VmFsdWVzRnJvbShjdXJyZW50UHJvcCk7XG5cbiAgICAgICAgbWFuaWZlc3RBY2N1bXVsYXRvcltwcm9wXSA9IHtcbiAgICAgICAgICAnZm9ybWF0U3RyaW5nJzogZ2V0Rm9ybWF0U3RyaW5nRnJvbShjdXJyZW50UHJvcClcbiAgICAgICAgICAsJ2NodW5rTmFtZXMnOiBnZXRGb3JtYXRDaHVua3NGcm9tKHJhd1ZhbHVlcywgcHJvcClcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBtYW5pZmVzdEFjY3VtdWxhdG9yO1xuICB9XG5cbiAgLyohXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZU9iamVjdFxuICAgKiBAcGFyYW0ge09iamVjdH0gZm9ybWF0TWFuaWZlc3RzXG4gICAqL1xuICBmdW5jdGlvbiBleHBhbmRGb3JtYXR0ZWRQcm9wZXJ0aWVzIChzdGF0ZU9iamVjdCwgZm9ybWF0TWFuaWZlc3RzKSB7XG4gICAgVHdlZW5hYmxlLmVhY2goZm9ybWF0TWFuaWZlc3RzLCBmdW5jdGlvbiAocHJvcCkge1xuICAgICAgdmFyIGN1cnJlbnRQcm9wID0gc3RhdGVPYmplY3RbcHJvcF07XG4gICAgICB2YXIgcmF3VmFsdWVzID0gZ2V0VmFsdWVzRnJvbShjdXJyZW50UHJvcCk7XG4gICAgICB2YXIgcmF3VmFsdWVzTGVuZ3RoID0gcmF3VmFsdWVzLmxlbmd0aDtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByYXdWYWx1ZXNMZW5ndGg7IGkrKykge1xuICAgICAgICBzdGF0ZU9iamVjdFtmb3JtYXRNYW5pZmVzdHNbcHJvcF0uY2h1bmtOYW1lc1tpXV0gPSArcmF3VmFsdWVzW2ldO1xuICAgICAgfVxuXG4gICAgICBkZWxldGUgc3RhdGVPYmplY3RbcHJvcF07XG4gICAgfSk7XG4gIH1cblxuICAvKiFcbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlT2JqZWN0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBmb3JtYXRNYW5pZmVzdHNcbiAgICovXG4gIGZ1bmN0aW9uIGNvbGxhcHNlRm9ybWF0dGVkUHJvcGVydGllcyAoc3RhdGVPYmplY3QsIGZvcm1hdE1hbmlmZXN0cykge1xuICAgIFR3ZWVuYWJsZS5lYWNoKGZvcm1hdE1hbmlmZXN0cywgZnVuY3Rpb24gKHByb3ApIHtcbiAgICAgIHZhciBjdXJyZW50UHJvcCA9IHN0YXRlT2JqZWN0W3Byb3BdO1xuICAgICAgdmFyIGZvcm1hdENodW5rcyA9IGV4dHJhY3RQcm9wZXJ0eUNodW5rcyhcbiAgICAgICAgc3RhdGVPYmplY3QsIGZvcm1hdE1hbmlmZXN0c1twcm9wXS5jaHVua05hbWVzKTtcbiAgICAgIHZhciB2YWx1ZXNMaXN0ID0gZ2V0VmFsdWVzTGlzdChcbiAgICAgICAgZm9ybWF0Q2h1bmtzLCBmb3JtYXRNYW5pZmVzdHNbcHJvcF0uY2h1bmtOYW1lcyk7XG4gICAgICBjdXJyZW50UHJvcCA9IGdldEZvcm1hdHRlZFZhbHVlcyhcbiAgICAgICAgZm9ybWF0TWFuaWZlc3RzW3Byb3BdLmZvcm1hdFN0cmluZywgdmFsdWVzTGlzdCk7XG4gICAgICBzdGF0ZU9iamVjdFtwcm9wXSA9IHNhbml0aXplUkdCQ2h1bmtzKGN1cnJlbnRQcm9wKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qIVxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVPYmplY3RcbiAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gY2h1bmtOYW1lc1xuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBleHRyYWN0ZWQgdmFsdWUgY2h1bmtzLlxuICAgKi9cbiAgZnVuY3Rpb24gZXh0cmFjdFByb3BlcnR5Q2h1bmtzIChzdGF0ZU9iamVjdCwgY2h1bmtOYW1lcykge1xuICAgIHZhciBleHRyYWN0ZWRWYWx1ZXMgPSB7fTtcbiAgICB2YXIgY3VycmVudENodW5rTmFtZSwgY2h1bmtOYW1lc0xlbmd0aCA9IGNodW5rTmFtZXMubGVuZ3RoO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaHVua05hbWVzTGVuZ3RoOyBpKyspIHtcbiAgICAgIGN1cnJlbnRDaHVua05hbWUgPSBjaHVua05hbWVzW2ldO1xuICAgICAgZXh0cmFjdGVkVmFsdWVzW2N1cnJlbnRDaHVua05hbWVdID0gc3RhdGVPYmplY3RbY3VycmVudENodW5rTmFtZV07XG4gICAgICBkZWxldGUgc3RhdGVPYmplY3RbY3VycmVudENodW5rTmFtZV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGV4dHJhY3RlZFZhbHVlcztcbiAgfVxuXG4gIHZhciBnZXRWYWx1ZXNMaXN0X2FjY3VtdWxhdG9yID0gW107XG4gIC8qIVxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVPYmplY3RcbiAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gY2h1bmtOYW1lc1xuICAgKlxuICAgKiBAcmV0dXJuIHtBcnJheS48bnVtYmVyPn1cbiAgICovXG4gIGZ1bmN0aW9uIGdldFZhbHVlc0xpc3QgKHN0YXRlT2JqZWN0LCBjaHVua05hbWVzKSB7XG4gICAgZ2V0VmFsdWVzTGlzdF9hY2N1bXVsYXRvci5sZW5ndGggPSAwO1xuICAgIHZhciBjaHVua05hbWVzTGVuZ3RoID0gY2h1bmtOYW1lcy5sZW5ndGg7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNodW5rTmFtZXNMZW5ndGg7IGkrKykge1xuICAgICAgZ2V0VmFsdWVzTGlzdF9hY2N1bXVsYXRvci5wdXNoKHN0YXRlT2JqZWN0W2NodW5rTmFtZXNbaV1dKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZ2V0VmFsdWVzTGlzdF9hY2N1bXVsYXRvcjtcbiAgfVxuXG4gIC8qIVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZm9ybWF0U3RyaW5nXG4gICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IHJhd1ZhbHVlc1xuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRGb3JtYXR0ZWRWYWx1ZXMgKGZvcm1hdFN0cmluZywgcmF3VmFsdWVzKSB7XG4gICAgdmFyIGZvcm1hdHRlZFZhbHVlU3RyaW5nID0gZm9ybWF0U3RyaW5nO1xuICAgIHZhciByYXdWYWx1ZXNMZW5ndGggPSByYXdWYWx1ZXMubGVuZ3RoO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByYXdWYWx1ZXNMZW5ndGg7IGkrKykge1xuICAgICAgZm9ybWF0dGVkVmFsdWVTdHJpbmcgPSBmb3JtYXR0ZWRWYWx1ZVN0cmluZy5yZXBsYWNlKFxuICAgICAgICBWQUxVRV9QTEFDRUhPTERFUiwgK3Jhd1ZhbHVlc1tpXS50b0ZpeGVkKDQpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZm9ybWF0dGVkVmFsdWVTdHJpbmc7XG4gIH1cblxuICAvKiFcbiAgICogTm90ZTogSXQncyB0aGUgZHV0eSBvZiB0aGUgY2FsbGVyIHRvIGNvbnZlcnQgdGhlIEFycmF5IGVsZW1lbnRzIG9mIHRoZVxuICAgKiByZXR1cm4gdmFsdWUgaW50byBudW1iZXJzLiAgVGhpcyBpcyBhIHBlcmZvcm1hbmNlIG9wdGltaXphdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZvcm1hdHRlZFN0cmluZ1xuICAgKlxuICAgKiBAcmV0dXJuIHtBcnJheS48c3RyaW5nPnxudWxsfVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0VmFsdWVzRnJvbSAoZm9ybWF0dGVkU3RyaW5nKSB7XG4gICAgcmV0dXJuIGZvcm1hdHRlZFN0cmluZy5tYXRjaChSX1VORk9STUFUVEVEX1ZBTFVFUyk7XG4gIH1cblxuICAvKiFcbiAgICogQHBhcmFtIHtPYmplY3R9IGVhc2luZ09iamVjdFxuICAgKiBAcGFyYW0ge09iamVjdH0gdG9rZW5EYXRhXG4gICAqL1xuICBmdW5jdGlvbiBleHBhbmRFYXNpbmdPYmplY3QgKGVhc2luZ09iamVjdCwgdG9rZW5EYXRhKSB7XG4gICAgVHdlZW5hYmxlLmVhY2godG9rZW5EYXRhLCBmdW5jdGlvbiAocHJvcCkge1xuICAgICAgdmFyIGN1cnJlbnRQcm9wID0gdG9rZW5EYXRhW3Byb3BdO1xuICAgICAgdmFyIGNodW5rTmFtZXMgPSBjdXJyZW50UHJvcC5jaHVua05hbWVzO1xuICAgICAgdmFyIGNodW5rTGVuZ3RoID0gY2h1bmtOYW1lcy5sZW5ndGg7XG4gICAgICB2YXIgZWFzaW5nQ2h1bmtzID0gZWFzaW5nT2JqZWN0W3Byb3BdLnNwbGl0KCcgJyk7XG4gICAgICB2YXIgbGFzdEVhc2luZ0NodW5rID0gZWFzaW5nQ2h1bmtzW2Vhc2luZ0NodW5rcy5sZW5ndGggLSAxXTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaHVua0xlbmd0aDsgaSsrKSB7XG4gICAgICAgIGVhc2luZ09iamVjdFtjaHVua05hbWVzW2ldXSA9IGVhc2luZ0NodW5rc1tpXSB8fCBsYXN0RWFzaW5nQ2h1bms7XG4gICAgICB9XG5cbiAgICAgIGRlbGV0ZSBlYXNpbmdPYmplY3RbcHJvcF07XG4gICAgfSk7XG4gIH1cblxuICAvKiFcbiAgICogQHBhcmFtIHtPYmplY3R9IGVhc2luZ09iamVjdFxuICAgKiBAcGFyYW0ge09iamVjdH0gdG9rZW5EYXRhXG4gICAqL1xuICBmdW5jdGlvbiBjb2xsYXBzZUVhc2luZ09iamVjdCAoZWFzaW5nT2JqZWN0LCB0b2tlbkRhdGEpIHtcbiAgICBUd2VlbmFibGUuZWFjaCh0b2tlbkRhdGEsIGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgICB2YXIgY3VycmVudFByb3AgPSB0b2tlbkRhdGFbcHJvcF07XG4gICAgICB2YXIgY2h1bmtOYW1lcyA9IGN1cnJlbnRQcm9wLmNodW5rTmFtZXM7XG4gICAgICB2YXIgY2h1bmtMZW5ndGggPSBjaHVua05hbWVzLmxlbmd0aDtcbiAgICAgIHZhciBjb21wb3NlZEVhc2luZ1N0cmluZyA9ICcnO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNodW5rTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29tcG9zZWRFYXNpbmdTdHJpbmcgKz0gJyAnICsgZWFzaW5nT2JqZWN0W2NodW5rTmFtZXNbaV1dO1xuICAgICAgICBkZWxldGUgZWFzaW5nT2JqZWN0W2NodW5rTmFtZXNbaV1dO1xuICAgICAgfVxuXG4gICAgICBlYXNpbmdPYmplY3RbcHJvcF0gPSBjb21wb3NlZEVhc2luZ1N0cmluZy5zdWJzdHIoMSk7XG4gICAgfSk7XG4gIH1cblxuICBUd2VlbmFibGUucHJvdG90eXBlLmZpbHRlci50b2tlbiA9IHtcbiAgICAndHdlZW5DcmVhdGVkJzogZnVuY3Rpb24gKGN1cnJlbnRTdGF0ZSwgZnJvbVN0YXRlLCB0b1N0YXRlLCBlYXNpbmdPYmplY3QpIHtcbiAgICAgIHNhbml0aXplT2JqZWN0Rm9ySGV4UHJvcHMoY3VycmVudFN0YXRlKTtcbiAgICAgIHNhbml0aXplT2JqZWN0Rm9ySGV4UHJvcHMoZnJvbVN0YXRlKTtcbiAgICAgIHNhbml0aXplT2JqZWN0Rm9ySGV4UHJvcHModG9TdGF0ZSk7XG4gICAgICB0aGlzLl90b2tlbkRhdGEgPSBnZXRGb3JtYXRNYW5pZmVzdHMoY3VycmVudFN0YXRlKTtcbiAgICB9LFxuXG4gICAgJ2JlZm9yZVR3ZWVuJzogZnVuY3Rpb24gKGN1cnJlbnRTdGF0ZSwgZnJvbVN0YXRlLCB0b1N0YXRlLCBlYXNpbmdPYmplY3QpIHtcbiAgICAgIGV4cGFuZEVhc2luZ09iamVjdChlYXNpbmdPYmplY3QsIHRoaXMuX3Rva2VuRGF0YSk7XG4gICAgICBleHBhbmRGb3JtYXR0ZWRQcm9wZXJ0aWVzKGN1cnJlbnRTdGF0ZSwgdGhpcy5fdG9rZW5EYXRhKTtcbiAgICAgIGV4cGFuZEZvcm1hdHRlZFByb3BlcnRpZXMoZnJvbVN0YXRlLCB0aGlzLl90b2tlbkRhdGEpO1xuICAgICAgZXhwYW5kRm9ybWF0dGVkUHJvcGVydGllcyh0b1N0YXRlLCB0aGlzLl90b2tlbkRhdGEpO1xuICAgIH0sXG5cbiAgICAnYWZ0ZXJUd2Vlbic6IGZ1bmN0aW9uIChjdXJyZW50U3RhdGUsIGZyb21TdGF0ZSwgdG9TdGF0ZSwgZWFzaW5nT2JqZWN0KSB7XG4gICAgICBjb2xsYXBzZUZvcm1hdHRlZFByb3BlcnRpZXMoY3VycmVudFN0YXRlLCB0aGlzLl90b2tlbkRhdGEpO1xuICAgICAgY29sbGFwc2VGb3JtYXR0ZWRQcm9wZXJ0aWVzKGZyb21TdGF0ZSwgdGhpcy5fdG9rZW5EYXRhKTtcbiAgICAgIGNvbGxhcHNlRm9ybWF0dGVkUHJvcGVydGllcyh0b1N0YXRlLCB0aGlzLl90b2tlbkRhdGEpO1xuICAgICAgY29sbGFwc2VFYXNpbmdPYmplY3QoZWFzaW5nT2JqZWN0LCB0aGlzLl90b2tlbkRhdGEpO1xuICAgIH1cbiAgfTtcblxufSAoVHdlZW5hYmxlKSk7XG5cbn0odGhpcykpO1xuIl19
