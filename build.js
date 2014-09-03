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
    btn.click = btn.tap = function(data) {
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

},{"./Begin":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Begin.js","./GameInput.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/GameInput.js","./GameOver":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/GameOver.js","./Level":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Level.js","./LevelEnd":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/LevelEnd.js","./Light":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Light.js","./Physics.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Physics.js","./Player.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Player.js","./Preloader":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Preloader.js","./Resources":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Resources.js","./Tools.js":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/Tools.js","./vendor/shifty":"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/vendor/shifty.js"}],"/Applications/XAMPP/xamppfiles/htdocs/spjam/src/main.js":[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vc3JjL0JlZ2luLmpzIiwiL0FwcGxpY2F0aW9ucy9YQU1QUC94YW1wcGZpbGVzL2h0ZG9jcy9zcGphbS9zcmMvR2FtZS5qcyIsIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vc3JjL0dhbWVJbnB1dC5qcyIsIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vc3JjL0dhbWVPdmVyLmpzIiwiL0FwcGxpY2F0aW9ucy9YQU1QUC94YW1wcGZpbGVzL2h0ZG9jcy9zcGphbS9zcmMvTGV2ZWwuanMiLCIvQXBwbGljYXRpb25zL1hBTVBQL3hhbXBwZmlsZXMvaHRkb2NzL3NwamFtL3NyYy9MZXZlbEVuZC5qcyIsIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vc3JjL0xpZ2h0LmpzIiwiL0FwcGxpY2F0aW9ucy9YQU1QUC94YW1wcGZpbGVzL2h0ZG9jcy9zcGphbS9zcmMvUGh5c2ljcy5qcyIsIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vc3JjL1BsYXllci5qcyIsIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vc3JjL1ByZWxvYWRlci5qcyIsIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vc3JjL1Jlc291cmNlcy5qcyIsIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vc3JjL1Rvb2xzLmpzIiwiL0FwcGxpY2F0aW9ucy9YQU1QUC94YW1wcGZpbGVzL2h0ZG9jcy9zcGphbS9zcmMvYmVoYXZpb3JzL0VuZEJlaGF2aW9yLmpzIiwiL0FwcGxpY2F0aW9ucy9YQU1QUC94YW1wcGZpbGVzL2h0ZG9jcy9zcGphbS9zcmMvYmVoYXZpb3JzL0VuZENhckJlaGF2aW9yLmpzIiwiL0FwcGxpY2F0aW9ucy9YQU1QUC94YW1wcGZpbGVzL2h0ZG9jcy9zcGphbS9zcmMvYmVoYXZpb3JzL0xpZ2h0QmVoYXZpb3IuanMiLCIvQXBwbGljYXRpb25zL1hBTVBQL3hhbXBwZmlsZXMvaHRkb2NzL3NwamFtL3NyYy9iZWhhdmlvcnMvUGxhdGZvcm1CZWhhdmlvci5qcyIsIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vc3JjL2JlaGF2aW9ycy9Td2l0Y2hCZWhhdmlvci5qcyIsIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vc3JjL2NvbXBvbmVudHMvUGFydGljbGVTeXN0ZW0uanMiLCIvQXBwbGljYXRpb25zL1hBTVBQL3hhbXBwZmlsZXMvaHRkb2NzL3NwamFtL3NyYy9nYW1lLmpzIiwiL0FwcGxpY2F0aW9ucy9YQU1QUC94YW1wcGZpbGVzL2h0ZG9jcy9zcGphbS9zcmMvbWFpbi5qcyIsIi9BcHBsaWNhdGlvbnMvWEFNUFAveGFtcHBmaWxlcy9odGRvY3Mvc3BqYW0vc3JjL3ZlbmRvci9FdmVudEVtaXR0ZXIyLmpzIiwiL0FwcGxpY2F0aW9ucy9YQU1QUC94YW1wcGZpbGVzL2h0ZG9jcy9zcGphbS9zcmMvdmVuZG9yL3NoaWZ0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6aEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9TQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6aEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgUGFydGljbGVTeXN0ZW0gPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvUGFydGljbGVTeXN0ZW0uanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBCZWdpbihnYW1lKSB7XG4gIHdpbmRvdy5nYW1lID0gZ2FtZTtcblxuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciB2aWV3ID0gbmV3IFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lcigpO1xuICB2YXIgb3ZlcmxhcCA9IG51bGw7XG4gIHZhciBjYXIgPSBudWxsO1xuICB2YXIgbG9nbyA9IG51bGw7XG4gIHZhciBsb2dvRGFyayA9IG51bGw7XG4gIHZhciBidG5TdGFydCA9IG51bGw7XG4gIHZhciBwYXJ0aWNsZXMgPSBudWxsO1xuICB2YXIgY291bnQgPSAwO1xuXG4gIHRoaXMudmlldyA9IHZpZXc7XG4gIHRoaXMuc2hvdyA9IHNob3c7XG4gIHRoaXMuaGlkZSA9IGhpZGU7XG4gIHRoaXMudXBkYXRlID0gdXBkYXRlO1xuXG4gIGluaXQoKTtcblxuICBmdW5jdGlvbiBpbml0KClcbiAge1xuICAgIHZpZXcudmlzaWJsZSA9IGZhbHNlO1xuICAgIGdhbWUuc3RhZ2UuYWRkQ2hpbGQodmlldyk7XG5cbiAgICB2YXIgYmcgPSBQSVhJLlNwcml0ZS5mcm9tRnJhbWUoXCJTY2VuYXJpby5wbmdcIik7XG4gICAgdmlldy5hZGRDaGlsZChiZyk7XG5cbiAgICBsb2dvRGFyayA9IFBJWEkuU3ByaXRlLmZyb21GcmFtZShcIkRhcmtMaWdodExvZ28ucG5nXCIpO1xuICAgIHZpZXcuYWRkQ2hpbGQobG9nb0RhcmspO1xuICAgIGxvZ29EYXJrLmFscGhhID0gMC41O1xuICAgIGxvZ29EYXJrLmFuY2hvci54ID0gMC41O1xuICAgIGxvZ29EYXJrLmFuY2hvci55ID0gMC41O1xuICAgIGxvZ29EYXJrLnBvc2l0aW9uLnggPSBzY3JlZW5XaWR0aC8yO1xuICAgIGxvZ29EYXJrLnBvc2l0aW9uLnkgPSBzY3JlZW5IZWlnaHQvMjtcblxuICAgIHZhciBndWFyZHJhaWxEYXJrID0gUElYSS5TcHJpdGUuZnJvbUZyYW1lKFwiR3VhcmRSYWlsLnBuZ1wiKTtcbiAgICB2aWV3LmFkZENoaWxkKGd1YXJkcmFpbERhcmspO1xuICAgIGd1YXJkcmFpbERhcmsucG9zaXRpb24ueSA9IDU1MDtcbiAgICBndWFyZHJhaWxEYXJrLmFscGhhID0gMC41O1xuXG4gICAgdmFyIGZyb250ID0gbmV3IFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lcigpO1xuICAgIHZpZXcuYWRkQ2hpbGQoZnJvbnQpO1xuXG4gICAgdmFyIGZvcmVzdCA9IFBJWEkuU3ByaXRlLmZyb21GcmFtZShcIkZvcmVzdExpZ2h0LnBuZ1wiKTtcbiAgICBmcm9udC5hZGRDaGlsZChmb3Jlc3QpO1xuICAgIGZvcmVzdC5wb3NpdGlvbi55ID0gMTAyO1xuXG4gICAgbG9nbyA9IFBJWEkuU3ByaXRlLmZyb21GcmFtZShcIkRhcmtMaWdodExvZ28ucG5nXCIpO1xuICAgIGZyb250LmFkZENoaWxkKGxvZ28pO1xuICAgIGxvZ28uYW5jaG9yLnggPSAwLjU7XG4gICAgbG9nby5hbmNob3IueSA9IDAuNTtcbiAgICBsb2dvLnBvc2l0aW9uLnggPSBsb2dvRGFyay5wb3NpdGlvbi54O1xuICAgIGxvZ28ucG9zaXRpb24ueSA9IGxvZ29EYXJrLnBvc2l0aW9uLnk7XG5cbiAgICB2YXIgZ3VhcmRyYWlsID0gUElYSS5TcHJpdGUuZnJvbUZyYW1lKFwiR3VhcmRSYWlsLnBuZ1wiKTtcbiAgICBmcm9udC5hZGRDaGlsZChndWFyZHJhaWwpO1xuICAgIGd1YXJkcmFpbC5wb3NpdGlvbi55ID0gZ3VhcmRyYWlsRGFyay5wb3NpdGlvbi55O1xuXG4gICAgb3ZlcmxhcCA9IGNyZWF0ZU92ZXJsYXAoKTtcbiAgICB2aWV3LmFkZENoaWxkKG92ZXJsYXApO1xuICAgIG92ZXJsYXAucG9zaXRpb24ueCA9IHNjcmVlbldpZHRoIC0gMTAwO1xuICAgIG92ZXJsYXAucG9zaXRpb24ueSA9IC0xMDA7XG5cbiAgICBmcm9udC5tYXNrID0gb3ZlcmxhcDtcblxuICAgIGJ0blN0YXJ0ID0gUElYSS5TcHJpdGUuZnJvbUZyYW1lKFwiU3RhcnQucG5nXCIpO1xuICAgIGJ0blN0YXJ0LmFuY2hvci54ID0gMC41O1xuICAgIGJ0blN0YXJ0LmFuY2hvci55ID0gMC41O1xuICAgIGJ0blN0YXJ0LnNldEludGVyYWN0aXZlKHRydWUpO1xuICAgIGJ0blN0YXJ0LmNsaWNrID0gYnRuU3RhcnQudGFwID0gc3RhcnRHYW1lO1xuICAgIHZpZXcuYWRkQ2hpbGQoYnRuU3RhcnQpO1xuICAgIGJ0blN0YXJ0LnBvc2l0aW9uLnggPSBzY3JlZW5XaWR0aC8yO1xuICAgIGJ0blN0YXJ0LnBvc2l0aW9uLnkgPSBzY3JlZW5IZWlnaHQvMiArIDEzMDtcblxuICAgIGNhciA9IFBJWEkuU3ByaXRlLmZyb21GcmFtZShcIkNhci5wbmdcIik7XG4gICAgdmlldy5hZGRDaGlsZChjYXIpO1xuICAgIGNhci5wb3NpdGlvbi54ID0gLTMwMDA7XG4gICAgY2FyLnBvc2l0aW9uLnkgPSBndWFyZHJhaWxEYXJrLnBvc2l0aW9uLnkgLSA3NTtcbiAgICBjYXIucGFzc2VkID0gZmFsc2U7XG5cbiAgICBwYXJ0aWNsZXMgPSBuZXcgUGFydGljbGVTeXN0ZW0oXG4gICAge1xuICAgICAgICBcImltYWdlc1wiOltcInNtb2tlLnBuZ1wiXSxcbiAgICAgICAgXCJudW1QYXJ0aWNsZXNcIjo1MDAsXG4gICAgICAgIFwiZW1pc3Npb25zUGVyVXBkYXRlXCI6MyxcbiAgICAgICAgXCJlbWlzc2lvbnNJbnRlcnZhbFwiOjEsXG4gICAgICAgIFwiYWxwaGFcIjoxLFxuICAgICAgICBcInByb3BlcnRpZXNcIjpcbiAgICAgICAge1xuICAgICAgICAgIFwicmFuZG9tU3Bhd25YXCI6MjAsXG4gICAgICAgICAgXCJyYW5kb21TcGF3bllcIjozLFxuICAgICAgICAgIFwibGlmZVwiOjIwLFxuICAgICAgICAgIFwicmFuZG9tTGlmZVwiOjEwMCxcbiAgICAgICAgICBcImZvcmNlWFwiOjAsXG4gICAgICAgICAgXCJmb3JjZVlcIjotMC4wMSxcbiAgICAgICAgICBcInJhbmRvbUZvcmNlWFwiOjAuMDEsXG4gICAgICAgICAgXCJyYW5kb21Gb3JjZVlcIjowLjAxLFxuICAgICAgICAgIFwidmVsb2NpdHlYXCI6MCxcbiAgICAgICAgICBcInZlbG9jaXR5WVwiOjAsXG4gICAgICAgICAgXCJyYW5kb21WZWxvY2l0eVhcIjowLjEsXG4gICAgICAgICAgXCJyYW5kb21WZWxvY2l0eVlcIjowLjEsXG4gICAgICAgICAgXCJzY2FsZVwiOjEsXG4gICAgICAgICAgXCJncm93dGhcIjowLjEsXG4gICAgICAgICAgXCJyYW5kb21TY2FsZVwiOjAuNSxcbiAgICAgICAgICBcImFscGhhU3RhcnRcIjowLFxuICAgICAgICAgIFwiYWxwaGFGaW5pc2hcIjowLFxuICAgICAgICAgIFwiYWxwaGFSYXRpb1wiOjAuMixcbiAgICAgICAgICBcInRvcnF1ZVwiOjAsXG4gICAgICAgICAgXCJyYW5kb21Ub3JxdWVcIjowXG4gICAgICAgIH1cbiAgICB9KTtcbiAgICB2aWV3LmFkZENoaWxkKHBhcnRpY2xlcy52aWV3KTtcbiAgICBwYXJ0aWNsZXMudmlldy5hbHBoYSA9IDAuMjU7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVPdmVybGFwKClcbiAge1xuICAgIHZhciBudW1TaGFmdHMgPSA4O1xuICAgIHZhciBvcGVuUmF0ZSA9IDAuMjtcbiAgICB2YXIgcmFkaXVzID0gMjAwMDtcbiAgICB2YXIgZ3JhcGggPSBuZXcgUElYSS5HcmFwaGljcygpO1xuXG4gICAgZ3JhcGguYmVnaW5GaWxsKDB4RkZGRkZGKTtcbiAgICBncmFwaC5tb3ZlVG8oMCwgMCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bVNoYWZ0czsgaSsrKVxuICAgIHtcbiAgICAgIHZhciBhID0gTWF0aC5QSSoyL251bVNoYWZ0cyppO1xuICAgICAgZ3JhcGgubGluZVRvKE1hdGguY29zKGEgLSBvcGVuUmF0ZSkqcmFkaXVzLCBNYXRoLnNpbihhIC0gb3BlblJhdGUpKnJhZGl1cyk7XG4gICAgICBncmFwaC5saW5lVG8oTWF0aC5jb3MoYSArIG9wZW5SYXRlKSpyYWRpdXMsIE1hdGguc2luKGEgKyBvcGVuUmF0ZSkqcmFkaXVzKTtcbiAgICAgIGdyYXBoLmxpbmVUbygwLCAwKTtcbiAgICB9XG5cbiAgICBncmFwaC5lbmRGaWxsKCk7XG4gICAgcmV0dXJuIGdyYXBoO1xuXG4gIH1cblxuICBmdW5jdGlvbiBzaG93KClcbiAge1xuICAgIHZpZXcudmlzaWJsZSA9IHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBoaWRlKClcbiAge1xuICAgIHZpZXcudmlzaWJsZSA9IGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlKClcbiAge1xuICAgIGlmICghdmlldy52aXNpYmxlKSByZXR1cm47XG4gICAgb3ZlcmxhcC5yb3RhdGlvbiArPSAwLjAwMTtcbiAgICBjYXIucG9zaXRpb24ueCArPSAyMDtcbiAgICBjYXIuc2NhbGUueCA9IDE7XG4gICAgaWYgKGNhci5wb3NpdGlvbi54ID4gNzAwMCkge1xuICAgICAgY2FyLnBvc2l0aW9uLnggPSAtMzAwMDtcbiAgICAgIGNhci5wYXNzZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoY2FyLnBhc3NlZCA9PT0gZmFsc2UgJiYgY2FyLnBvc2l0aW9uLnggPiAtMTQwMCkge1xuICAgICAgY2FyLnBhc3NlZCA9IHRydWU7XG4gICAgICBnYW1lLnJlc291cmNlcy5jYXJQYXNzLnBsYXkoKTtcbiAgICB9XG5cbiAgICBwYXJ0aWNsZXMucHJvcGVydGllcy5jZW50ZXJYID0gY2FyLnBvc2l0aW9uLng7XG4gICAgcGFydGljbGVzLnByb3BlcnRpZXMuY2VudGVyWSA9IGNhci5wb3NpdGlvbi55ICsgMTAwO1xuICAgIHBhcnRpY2xlcy51cGRhdGUoKTtcblxuICAgIGxvZ28uc2NhbGUueCA9IDAuOTkgKyBNYXRoLnNpbihjb3VudCkqMC4wMjtcbiAgICBsb2dvLnNjYWxlLnkgPSAwLjk5ICsgTWF0aC5jb3MoY291bnQqMC4zKSowLjAyO1xuXG4gICAgbG9nb0Rhcmsuc2NhbGUueCA9IDAuOTkgKyBNYXRoLmNvcyhjb3VudCkqMC4wMjtcbiAgICBsb2dvRGFyay5zY2FsZS55ID0gMC45OSArIE1hdGguc2luKGNvdW50KjAuMykqMC4wMjtcblxuICAgIGJ0blN0YXJ0LmFscGhhID0gMC43NSArIE1hdGguY29zKGNvdW50KjE1KSowLjI1O1xuXG4gICAgY291bnQgKz0gMC4wMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YXJ0R2FtZSgpXG4gIHtcbiAgICBnYW1lLnJlc291cmNlcy5idXR0b25DbGljay5wbGF5KClcbiAgICBoaWRlKCk7XG4gICAgZ2FtZS5sb2FkTGV2ZWwoMSk7XG4gIH1cbn07XG4iLCJ2YXIgUmVzb3VyY2VzID0gcmVxdWlyZSgnLi9SZXNvdXJjZXMnKSxcbiAgUHJlbG9hZGVyID0gcmVxdWlyZSgnLi9QcmVsb2FkZXInKSxcbiAgTGV2ZWwgPSByZXF1aXJlKCcuL0xldmVsJyksXG4gIEJlZ2luID0gcmVxdWlyZSgnLi9CZWdpbicpLFxuICBMZXZlbEVuZCA9IHJlcXVpcmUoJy4vTGV2ZWxFbmQnKSxcbiAgR2FtZU92ZXIgPSByZXF1aXJlKCcuL0dhbWVPdmVyJyksXG4gIExpZ2h0ID0gcmVxdWlyZSgnLi9MaWdodCcpLFxuICBUd2VlbmFibGUgPSByZXF1aXJlKCcuL3ZlbmRvci9zaGlmdHknKSxcbiAgR2FtZUlucHV0ID0gcmVxdWlyZSgnLi9HYW1lSW5wdXQuanMnKSxcbiAgUGxheWVyID0gcmVxdWlyZSgnLi9QbGF5ZXIuanMnKTtcbiAgUGh5c2ljcyA9IHJlcXVpcmUoJy4vUGh5c2ljcy5qcycpO1xuICBUb29scyA9IHJlcXVpcmUoJy4vVG9vbHMuanMnKTtcblxud2luZG93LlR3ZWVuYWJsZSA9IFR3ZWVuYWJsZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBHYW1lKCkge1xuICB0aGlzLnJlc291cmNlcyA9IG5ldyBSZXNvdXJjZXMoKTtcblxuICAvLyBzdGFnZS5jbGljayA9IGZ1bmN0aW9uKGUpIHtcbiAgLy8gICBsaWdodC54ID0gZS5vcmlnaW5hbEV2ZW50Lng7XG4gIC8vICAgbGlnaHQueSA9IGUub3JpZ2luYWxFdmVudC55O1xuICAvLyB9XG5cbiAgd2luZG93LnNjcmVlbldpZHRoID0gKHR5cGVvZihlamVjdGEpPT1cInVuZGVmaW5lZFwiKSA/IDk2MCA6IDQ4MDtcbiAgd2luZG93LnNjcmVlbkhlaWdodCA9ICh0eXBlb2YoZWplY3RhKT09XCJ1bmRlZmluZWRcIikgPyA2NDAgOiAzMjA7XG5cbiAgdGhpcy5yZW5kZXJlciA9IG5ldyBQSVhJLkNhbnZhc1JlbmRlcmVyKHNjcmVlbldpZHRoLCBzY3JlZW5IZWlnaHQsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKSwgZmFsc2UgLyogdHJhbnNwYXJlbnQgKi8sIGZhbHNlIC8qIGFudGlhbGlhcyAqLyk7XG4gIHRoaXMucmVuZGVyZXIudmlldy5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICB0aGlzLnJlbmRlcmVyLnZpZXcuc3R5bGUuYm9yZGVyID0gXCIxcHggc29saWRcIjtcblxuICB0aGlzLnN0YWdlID0gbmV3IFBJWEkuU3RhZ2UoMHgwMGZmZmEsIHRydWUpO1xuXG4gIC8vLy9JbnB1dFxuICB2YXIgaW5wdXQgPSBudWxsO1xuXG4gIC8vLy8vUGxheWVyXG4gIHZhciBwbGF5ZXIgPSBudWxsO1xuICB2YXIgcGh5c2ljcyA9IG51bGw7XG4gIHZhciBkaXJlY3Rpb24gPSAwO1xuICB2YXIgZ2xvdyA9IG51bGw7XG5cbiAgLy8gTGV2ZWxJbmRleFxuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBsZXZlbCA9IG51bGw7XG4gIHZhciBsb3N0ID0gZmFsc2U7XG4gIHZhciBnYW1lUnVubmluZyA9IGZhbHNlO1xuICB3aW5kb3cubGlnaHQgPSBuZXcgTGlnaHQoNTAsIDUwKTtcblxuICBzZWxmLmxldmVsID0gbGV2ZWw7XG5cbiAgdmFyIGxhc3RNb3VzZUNsaWNrID0gMCxcbiAgICAgIG1vdXNlQ2xpY2tJbnRlcnZhbCA9IDEwMDA7IC8vIDEgc2Vjb25kIHRvIGNsaWNrIGFnYWluXG5cbiAgdGhpcy5yZW5kZXJlci52aWV3LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24oZSkge1xuICAgIC8vIHByZXZlbnQgY2xpY2sgb24gZmlyc3QgbGV2ZWxcbiAgICAvLyBpZiAoIXNlbGYubGV2ZWwpIHsgcmV0dXJuOyB9XG5cbiAgICB2YXIgY2xpY2tUaW1lID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcblxuICAgIGlmIChsYXN0TW91c2VDbGljayArIG1vdXNlQ2xpY2tJbnRlcnZhbCA+PSBjbGlja1RpbWUpIHtcbiAgICAgIC8vIGRpc3NhbGxvd2VkXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGFzdE1vdXNlQ2xpY2sgPSBjbGlja1RpbWU7XG5cbiAgICAvLyBsaWdodC5wb3NpdGlvbi54ID0gZS5vZmZzZXRYO1xuICAgIC8vIGxpZ2h0LnBvc2l0aW9uLnkgPSBlLm9mZnNldFk7XG5cbiAgICBpZiAoc2VsZi5idG5Tb3VuZE9uLnZpc2libGUgPT09IHRydWUpIHtcbiAgICAgIGlmIChlLm9mZnNldFggPj0gc2VsZi5idG5Tb3VuZE9uLnggJiYgZS5vZmZzZXRYIDwgc2VsZi5idG5Tb3VuZE9uLnggKyBzZWxmLmJ0blNvdW5kT24ud2lkdGhcbiAgICAgICAgJiYgZS5vZmZzZXRZID49IHNlbGYuYnRuU291bmRPbi55ICYmIGUub2Zmc2V0WSA8IHNlbGYuYnRuU291bmRPbi55ICsgc2VsZi5idG5Tb3VuZE9uLmhlaWdodCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNlbGYuYnRuU291bmRPZmYudmlzaWJsZSA9PT0gdHJ1ZSkge1xuICAgICAgaWYgKGUub2Zmc2V0WCA+PSBzZWxmLmJ0blNvdW5kT2ZmLnggJiYgZS5vZmZzZXRYIDwgc2VsZi5idG5Tb3VuZE9mZi54ICsgc2VsZi5idG5Tb3VuZE9mZi53aWR0aFxuICAgICAgICAmJiBlLm9mZnNldFkgPj0gc2VsZi5idG5Tb3VuZE9mZi55ICYmIGUub2Zmc2V0WSA8IHNlbGYuYnRuU291bmRPZmYueSArIHNlbGYuYnRuU291bmRPZmYuaGVpZ2h0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2VsZi5idG5SZXN0YXJ0LnZpc2libGUgPT09IHRydWUpIHtcbiAgICAgIGlmIChlLm9mZnNldFggPj0gc2VsZi5idG5SZXN0YXJ0LnggJiYgZS5vZmZzZXRYIDwgc2VsZi5idG5SZXN0YXJ0LnggKyBzZWxmLmJ0blJlc3RhcnQud2lkdGhcbiAgICAgICAgJiYgZS5vZmZzZXRZID49IHNlbGYuYnRuUmVzdGFydC55ICYmIGUub2Zmc2V0WSA8IHNlbGYuYnRuUmVzdGFydC55ICsgc2VsZi5idG5SZXN0YXJ0LmhlaWdodCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNlbGYubGV2ZWwgIT09IG51bGwpIHtcbiAgICAgIGdhbWUucmVzb3VyY2VzLm1vdGhlclNvdW5kLnBsYXkoKTtcbiAgICB9XG5cbiAgICB2YXIgZGVzdCA9IHsgeDplLm9mZnNldFgsIHk6ZS5vZmZzZXRZIH07XG4gICAgdmFyIHR3ZWVuYWJsZSA9IG5ldyBUd2VlbmFibGUoKTtcbiAgICB0d2VlbmFibGUudHdlZW4oe1xuICAgICAgZnJvbTogbGlnaHQucG9zaXRpb24sXG4gICAgICB0bzogICBkZXN0LFxuICAgICAgZHVyYXRpb246IG1vdXNlQ2xpY2tJbnRlcnZhbCxcbiAgICAgIGVhc2luZzogJ2Vhc2VPdXRDdWJpYycsXG4gICAgICBzdGFydDogZnVuY3Rpb24gKCkge1xuICAgICAgICBtb3ZpbmcgPSB0cnVlO1xuICAgICAgfSxcbiAgICAgIGZpbmlzaDogZnVuY3Rpb24gKCkge1xuICAgICAgICBtb3ZpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSlcblxuICB2YXIgbGlnaHRHcmFwaGljcyA9IG5ldyBQSVhJLkdyYXBoaWNzKCksXG4gIGxpZ2h0Q29udGFpbmVyID0gbmV3IFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lcigpO1xuXG4gIHRoaXMucmVzdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpID0gc2VsZi5sZXZlbC5pbmRleDtcbiAgICBzZWxmLmxldmVsLmRpc3Bvc2UoKTtcbiAgICB0aGlzLmxvYWRMZXZlbChpKTtcbiAgfVxuXG4gIHRoaXMubmV4dExldmVsID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5sb2FkTGV2ZWwodGhpcy5sZXZlbC5pbmRleCArIDEpO1xuICB9XG5cbiAgdGhpcy5zZXRMZXZlbCA9IGZ1bmN0aW9uKGxldmVsRGF0YSwgbGV2ZWxJbmRleCkge1xuICAgIHZhciBoID0gc2VsZi5yZW5kZXJlci5oZWlnaHQgKyA4MCxcbiAgICAgICAgdyA9IHNlbGYucmVuZGVyZXIud2lkdGgsXG4gICAgICAgIGZyYW1lQm9yZGVyID0gNTA7XG5cbiAgICB2YXIgbmV3TGV2ZWwgPSBuZXcgTGV2ZWwoc2VsZiwgbGV2ZWxJbmRleCk7XG5cbiAgICAvLyBhZGQgc3RhZ2UgYm9yZGVyIHRvIGxldmVsIHNlZ21lbnRzXG4gICAgbmV3TGV2ZWwuc2VnbWVudHMudW5zaGlmdCgge2E6e3g6LWZyYW1lQm9yZGVyLHk6LWZyYW1lQm9yZGVyfSwgYjp7eDp3LHk6LWZyYW1lQm9yZGVyfX0gKTtcbiAgICBuZXdMZXZlbC5zZWdtZW50cy51bnNoaWZ0KCB7YTp7eDp3LHk6LWZyYW1lQm9yZGVyfSwgYjp7eDp3LHk6aH19ICk7XG4gICAgbmV3TGV2ZWwuc2VnbWVudHMudW5zaGlmdCgge2E6e3g6dyx5Omh9LCBiOnt4Oi1mcmFtZUJvcmRlcix5Omh9fSApO1xuICAgIG5ld0xldmVsLnNlZ21lbnRzLnVuc2hpZnQoIHthOnt4Oi1mcmFtZUJvcmRlcix5Omh9LCBiOnt4Oi1mcmFtZUJvcmRlcix5Oi1mcmFtZUJvcmRlcn19ICk7XG5cbiAgICBuZXdMZXZlbC5wYXJzZShsZXZlbERhdGEpO1xuXG4gICAgc2VsZi5sZXZlbCA9IG5ld0xldmVsO1xuICAgIHNlbGYuc3RhZ2UuYWRkQ2hpbGRBdChzZWxmLmxldmVsLnZpZXcsIDApO1xuXG4gICAgbGlnaHQuc2V0U2VnbWVudHMobmV3TGV2ZWwuc2VnbWVudHMpO1xuXG4gICAgLy8gYWRkIGxldmVsIGNvbnRhaW5lciB0byBzdGFnZS5cbiAgICBnYW1lLnN0YWdlLmFkZENoaWxkKG5ld0xldmVsLmNvbnRhaW5lcik7XG5cbiAgICAvLyByZS1jcmVhdGUgdGhlIHBsYXllclxuICAgIHBsYXllciA9IG5ldyBQbGF5ZXIobmV3TGV2ZWwuY29udGFpbmVyLCBuZXdMZXZlbC5wbGF5ZXJQb3MueCxuZXdMZXZlbC5wbGF5ZXJQb3MueSk7XG4gICAgcGh5c2ljcy5wbGF5ZXJQb3NpdGlvbi54ID0gcGxheWVyLnZpZXcucG9zaXRpb24ueDtcbiAgICBwaHlzaWNzLnBsYXllclBvc2l0aW9uLnkgPSBwbGF5ZXIudmlldy5wb3NpdGlvbi55O1xuXG4gICAgLy8gY29uc29sZS5sb2cobmV3TGV2ZWwucGxheWVyUG9zLnggKyBcIiBcIiArIG5ld0xldmVsLnBsYXllclBvcy55KTtcbiAgICBzZWxmLnBsYXllciA9IHBsYXllcjtcblxuICAgIHNlbGYubG9vcCgpO1xuICAgIHNlbGYuc3RhZ2UuYWRkQ2hpbGQoZ2xvdyk7XG4gIH07XG5cbiAgdGhpcy5sb2FkTGV2ZWwgPSBmdW5jdGlvbihsZXZlbEluZGV4KSB7XG4gICAgaWYoIWlucHV0KVxuICAgIHtcbiAgICAgIGlucHV0ID0gbmV3IEdhbWVJbnB1dCgpO1xuICAgICAgc2VsZi5pbnB1dCA9IGlucHV0O1xuICAgIH1cblxuICAgIGlmICghcGh5c2ljcyl7XG4gICAgICBwaHlzaWNzID0gbmV3IFBoeXNpY3MoKTtcbiAgICB9XG5cbiAgICAvLyBsZXZlbEluZGV4ID0gMjtcbiAgICAvLyBjb25zb2xlLmxvZyhcImxldmVsL2xldmVsXCIgKyBsZXZlbEluZGV4ICsgXCIuanNvblwiKTtcbiAgICB2YXIgcGl4aUxvYWRlciA9IG5ldyBQSVhJLkpzb25Mb2FkZXIoXCJsZXZlbC9sZXZlbFwiICsgbGV2ZWxJbmRleCArIFwiLmpzb25cIik7XG4gICAgcGl4aUxvYWRlci5vbignbG9hZGVkJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAvL2RhdGEgaXMgaW4gZXZ0LmNvbnRlbnQuanNvblxuICAgICAgLy8gY29uc29sZS5sb2coXCJqc29uIGxvYWRlZCFcIik7XG4gICAgICBzZWxmLnNldExldmVsKGV2dC5jb250ZW50Lmpzb24sIGxldmVsSW5kZXgpO1xuICAgICAgZ2FtZVJ1bm5pbmcgPSB0cnVlO1xuICAgICAgbG9zdCA9IGZhbHNlO1xuICAgIH0pO1xuXG4gICAgcGl4aUxvYWRlci5sb2FkKCk7XG4gIH1cblxuICB2YXIgbGFzdExpZ2h0WCwgbGFzdExpZ2h0WTtcblxuICB0aGlzLnVwZGF0ZUxpZ2h0cyA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIG5vdGhpbmcgdG8gdXBkYXRlLCBza2lwXG5cbiAgICBpZiAobGlnaHQucG9zaXRpb24ueCA9PSBsYXN0TGlnaHRYICYmIGxpZ2h0LnBvc2l0aW9uLnkgPT0gbGFzdExpZ2h0WSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEZJWE1FXG4gICAgaWYgKGxpZ2h0LnNlZ21lbnRzLmxlbmd0aCA9PSAwIHx8ICF0aGlzLmxldmVsIHx8IHRoaXMubGV2ZWwuc2VnbWVudHMubGVuZ3RoID09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsaWdodEdyYXBoaWNzLmNsZWFyKCk7XG5cbiAgICAvLyByZW1vdmUgcHJldmlvdXMgYWRkZWQgbGlnaHQgaXRlbXNcbiAgICBpZiAobGlnaHRDb250YWluZXIuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgbGlnaHRDb250YWluZXIucmVtb3ZlQ2hpbGRyZW4oKTtcbiAgICB9XG5cbiAgICAvLyBTaWdodCBQb2x5Z29uc1xuICAgIHZhciBwb2x5Z29ucyA9IGxpZ2h0LmdldFNpZ2h0UG9seWdvbnMoKTtcblxuICAgIC8vIERSQVcgQVMgQSBHSUFOVCBQT0xZR09OXG5cbiAgICB2YXIgdmVydGljZXMgPSBwb2x5Z29uc1swXTtcbiAgICB3aW5kb3cucG9seWdvbnMgPSBwb2x5Z29uc1swXTtcblxuICAgIC8vIGxpZ2h0R3JhcGhpY3MuY2xlYXIoKTtcbiAgICAvLyBsaWdodEdyYXBoaWNzLmJlZ2luRmlsbCgweEZGRkZGRik7XG4gICAgLy8gbGlnaHRHcmFwaGljcy5tb3ZlVG8odmVydGljZXNbMF0ueCwgdmVydGljZXNbMF0ueSk7XG4gICAgLy8gZm9yICh2YXIgaSA9IDE7IGk8dmVydGljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAvLyAgIHZhciB2ID0gdmVydGljZXNbaV07XG4gICAgLy8gICBsaWdodEdyYXBoaWNzLmxpbmVUbyh2LngsIHYueSk7XG4gICAgLy8gfVxuICAgIC8vIGxpZ2h0R3JhcGhpY3MuZW5kRmlsbCgpO1xuXG4gICAgbGlnaHRHcmFwaGljcy5jbGVhcigpO1xuICAgIGxpZ2h0R3JhcGhpY3MuYmVnaW5GaWxsKDB4RkZGRkZGKTtcbiAgICBsaWdodEdyYXBoaWNzLm1vdmVUbyh2ZXJ0aWNlc1swXS54LCB2ZXJ0aWNlc1swXS55KTtcbiAgICBmb3IgKHZhciBpID0gMTsgaTx2ZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHYgPSB2ZXJ0aWNlc1tpXTtcbiAgICAgIGxpZ2h0R3JhcGhpY3MubGluZVRvKHYueCwgdi55KTtcbiAgICB9XG4gICAgbGlnaHRHcmFwaGljcy5lbmRGaWxsKCk7XG5cbiAgICAvLyBvdmVybGFwLmFkZENoaWxkKGxpZ2h0R3JhcGhpY3MpO1xuICAgIC8vIG92ZXJsYXBTaGFwZS5tYXNrID0gbGlnaHRHcmFwaGljcztcblxuICAgIHNlbGYubGV2ZWwuYmcyLm1hc2sgPSBsaWdodEdyYXBoaWNzO1xuICAgIC8vIG92ZXJsYXkubWFzayA9IGxpZ2h0R3JhcGhpY3M7XG5cbiAgICBsYXN0TGlnaHRYID0gbGlnaHQucG9zaXRpb24ueDtcbiAgICBsYXN0TGlnaHRZID0gbGlnaHQucG9zaXRpb24ueTtcbiAgfTtcblxuICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgaWYgKHNlbGYuYnRuUmVzdGFydCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoc2VsZi5sZXZlbCA9PT0gbnVsbCkge1xuICAgICAgICBzZWxmLmJ0blJlc3RhcnQudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi5idG5SZXN0YXJ0LnZpc2libGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzZWxmLmJlZ2luKSBzZWxmLmJlZ2luLnVwZGF0ZSgpO1xuICAgIGlmIChzZWxmLmdhbWVvdmVyKSBzZWxmLmdhbWVvdmVyLnVwZGF0ZSgpO1xuXG4gICAgaWYgKCFnYW1lUnVubmluZykgcmV0dXJuO1xuICAgIHRoaXMudXBkYXRlTGlnaHRzKCk7XG5cbiAgICAvLyBjb25zb2xlLmxvZyhpbnB1dCArIFwiIFwiICsgaW5wdXQuS2V5KTtcbiAgICBpZighaW5wdXQpXG4gICAgICByZXR1cm47XG5cbiAgICBpZiAoaW5wdXQuS2V5LmlzRG93bihpbnB1dC5LZXkuTEVGVCkgfHwgaW5wdXQuS2V5LmlzRG93bihpbnB1dC5LZXkuQSkpXG4gICAge1xuICAgICAgZGlyZWN0aW9uIC09IDAuMDk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlucHV0LktleS5pc0Rvd24oaW5wdXQuS2V5LlJJR0hUKSB8fCBpbnB1dC5LZXkuaXNEb3duKGlucHV0LktleS5EKSlcbiAgICB7XG4gICAgICBkaXJlY3Rpb24gKz0gMC4wOTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgIGRpcmVjdGlvbiAqPSAwLjk7XG4gICAgfVxuXG4gICAgZGlyZWN0aW9uID0gVG9vbHMuY2xhbXAoZGlyZWN0aW9uLCAtMSwgMSk7XG5cbiAgICBpZiAoc2VsZi5sZXZlbClcbiAgICB7XG4gICAgICBpZihwaHlzaWNzKVxuICAgICAgICBwaHlzaWNzLnByb2Nlc3MoZ2FtZSwgZGlyZWN0aW9uLCB3aW5kb3cucG9seWdvbnMpO1xuXG4gICAgICBpZihwbGF5ZXIpXG4gICAgICAgIHBsYXllci51cGRhdGUoZ2FtZSwgcGh5c2ljcy5wbGF5ZXJQb3NpdGlvbiwgcGh5c2ljcy5wbGF5ZXJWZWxvY2l0eSk7XG5cbiAgICAgICBzZWxmLmxldmVsLnVwZGF0ZShzZWxmKTtcblxuICAgICAgIGlmICghbG9zdCAmJiBwaHlzaWNzLnBsYXllclBvc2l0aW9uLnkgPiBzY3JlZW5IZWlnaHQgKyA0MCkgdGhpcy5sb3NlR2FtZSgpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgbG9vcEJvdW5kZWQgPSAgZmFsc2UgO1xuICB0aGlzLmxvb3AgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAobG9vcEJvdW5kZWQpeyByZXR1cm47IH1cbiAgICBsb29wQm91bmRlZCA9IHRydWU7XG4gICAgcmVxdWVzdEFuaW1GcmFtZShzZWxmLnJlbmRlckxvb3ApO1xuICB9O1xuXG4gIHRoaXMucmVuZGVyTG9vcCA9IGZ1bmN0aW9uKCkge1xuICAgIHNlbGYudXBkYXRlKCk7IC8vIGxvZ2ljXG4gICAgc2VsZi5yZW5kZXJlci5yZW5kZXIoc2VsZi5zdGFnZSk7XG4gICAgcmVxdWVzdEFuaW1GcmFtZShzZWxmLnJlbmRlckxvb3ApO1xuICB9XG5cbiAgdGhpcy5sb2FkUGl4aSA9IGZ1bmN0aW9uKCkge1xuICAgIHNlbGYuaXRlbXNMb2FkZWQgPSAwLFxuICAgIHNlbGYucGl4aUZpbGVzID0gc2VsZi5yZXNvdXJjZXMuZ2V0UElYSUZpbGVzKCksXG4gICAgc2VsZi5zb3VuZEZpbGVzID0gc2VsZi5yZXNvdXJjZXMuc291bmRzLFxuICAgIHNlbGYudG90YWxJdGVtcyA9IHNlbGYucGl4aUZpbGVzLmxlbmd0aCArIHNlbGYuc291bmRGaWxlcy5sZW5ndGg7XG4gICAgLy8gbG9hZGVyXG4gICAgbG9hZGVyID0gbmV3IFBJWEkuQXNzZXRMb2FkZXIoc2VsZi5waXhpRmlsZXMpO1xuICAgIGxvYWRlci5hZGRFdmVudExpc3RlbmVyKCdvbkNvbXBsZXRlJywgZnVuY3Rpb24oKSB7XG4gICAgICBzZWxmLmxvYWRTb3VuZCgpO1xuICAgIH0pO1xuICAgIGxvYWRlci5hZGRFdmVudExpc3RlbmVyKCdvblByb2dyZXNzJywgZnVuY3Rpb24oZSkge1xuICAgICAgc2VsZi5pdGVtc0xvYWRlZCArPSAxO1xuICAgICAgc2VsZi5wcmVsb2FkZXIucHJvZ3Jlc3Moc2VsZi5pdGVtc0xvYWRlZCwgc2VsZi50b3RhbEl0ZW1zKTtcbiAgICAgIGlmICh0eXBlb2YoZWplY3RhKSE9PVwidW5kZWZpbmVkXCIpIHsgcmV0dXJuOyB9O1xuICAgIH0pO1xuXG4gICAgbG9hZGVyLmxvYWQoKTtcbiAgfVxuXG4gIHRoaXMubG9hZFNvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGkgPSAoc2VsZi5pdGVtc0xvYWRlZCAtIHNlbGYucGl4aUZpbGVzLmxlbmd0aCksXG4gICAgICBvYmogPSBzZWxmLnNvdW5kRmlsZXNbaV07XG4gICAgc2VsZi5yZXNvdXJjZXNbb2JqLm5hbWVdID0gbmV3IEhvd2woe1xuICAgICAgdXJsczogb2JqLnVybHMsXG4gICAgICBhdXRvcGxheTogb2JqLmF1dG9QbGF5IHx8IGZhbHNlLFxuICAgICAgbG9vcDogb2JqLmxvb3AgfHwgZmFsc2UsXG4gICAgICB2b2x1bWU6IG9iai52b2x1bWUgfHwgMSxcbiAgICAgIG9ubG9hZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbGYuaXRlbXNMb2FkZWQrKztcbiAgICAgICAgc2VsZi5wcmVsb2FkZXIucHJvZ3Jlc3Moc2VsZi5pdGVtc0xvYWRlZCwgc2VsZi50b3RhbEl0ZW1zKTtcbiAgICAgICAgaWYgKHNlbGYuaXRlbXNMb2FkZWQgPT0gc2VsZi50b3RhbEl0ZW1zKSB7XG4gICAgICAgICAgc2VsZi5sb2FkZWQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWxmLmxvYWRTb3VuZCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB0aGlzLmxvYWRlZCA9IGZ1bmN0aW9uKCkge1xuICAgIHNlbGYuYmVnaW4gPSBuZXcgQmVnaW4odGhpcyk7XG4gICAgc2VsZi5sZXZlbGVuZCA9IG5ldyBMZXZlbEVuZCh0aGlzKTtcbiAgICBzZWxmLmdhbWVvdmVyID0gbmV3IEdhbWVPdmVyKHRoaXMpO1xuICAgIHNlbGYucHJlbG9hZGVyLmhpZGUoKTtcbiAgICBzZWxmLmJlZ2luLnNob3coKTtcbiAgICBnYW1lLnJlc291cmNlcy5zb3VuZExvb3AuZmFkZUluKC40LCAyMDAwKTtcblxuICAgIGdsb3cgPSBQSVhJLlNwcml0ZS5mcm9tRnJhbWUoXCJnbG93LnBuZ1wiKTtcbiAgICBnbG93LnNjYWxlLnggPSAyO1xuICAgIGdsb3cuc2NhbGUueSA9IDI7XG4gICAgc2VsZi5zdGFnZS5hZGRDaGlsZChnbG93KTtcbiAgICBnbG93LmFscGhhID0gMC42NTtcblxuICAgIHNlbGYuYnRuU291bmRPZmYgPSBQSVhJLlNwcml0ZS5mcm9tRnJhbWUoJ3NvdW5kT24ucG5nJyk7XG4gICAgc2VsZi5idG5Tb3VuZE9mZi5zZXRJbnRlcmFjdGl2ZSh0cnVlKTtcbiAgICBzZWxmLmJ0blNvdW5kT2ZmLmJ1dHRvbk1vZGUgPSB0cnVlO1xuICAgIHNlbGYuYnRuU291bmRPZmYucG9zaXRpb24ueCA9IDEwO1xuICAgIHNlbGYuYnRuU291bmRPZmYucG9zaXRpb24ueSA9IDEwO1xuXG4gICAgc2VsZi5idG5Tb3VuZE9uID0gUElYSS5TcHJpdGUuZnJvbUZyYW1lKCdzb3VuZE9mZi5wbmcnKTtcbiAgICBzZWxmLmJ0blNvdW5kT24uc2V0SW50ZXJhY3RpdmUodHJ1ZSk7XG4gICAgc2VsZi5idG5Tb3VuZE9uLmJ1dHRvbk1vZGUgPSB0cnVlO1xuICAgIHNlbGYuYnRuU291bmRPbi5wb3NpdGlvbi54ID0gc2VsZi5idG5Tb3VuZE9mZi5wb3NpdGlvbi54O1xuICAgIHNlbGYuYnRuU291bmRPbi5wb3NpdGlvbi55ID0gc2VsZi5idG5Tb3VuZE9mZi5wb3NpdGlvbi55O1xuICAgIHNlbGYuYnRuU291bmRPbi52aXNpYmxlID0gZmFsc2U7XG5cbiAgICBzZWxmLnN0YWdlLmFkZENoaWxkKGdhbWUuYnRuU291bmRPZmYpO1xuICAgIHNlbGYuc3RhZ2UuYWRkQ2hpbGQoZ2FtZS5idG5Tb3VuZE9uKTtcblxuICAgIHNlbGYuYnRuU291bmRPZmYuY2xpY2sgPSBzZWxmLmJ0blNvdW5kT2ZmLnRhcCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHNlbGYuYnRuU291bmRPbi52aXNpYmxlID0gdHJ1ZTtcbiAgICAgIHNlbGYuYnRuU291bmRPZmYudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgSG93bGVyLm11dGUoKTtcbiAgICB9XG5cbiAgICBzZWxmLmJ0blNvdW5kT24uY2xpY2sgPSBzZWxmLmJ0blNvdW5kT24udGFwID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgc2VsZi5idG5Tb3VuZE9uLnZpc2libGUgPSBmYWxzZTtcbiAgICAgIHNlbGYuYnRuU291bmRPZmYudmlzaWJsZSA9IHRydWU7XG4gICAgICBIb3dsZXIudW5tdXRlKCk7XG4gICAgfVxuXG4gICAgc2VsZi5idG5SZXN0YXJ0ID0gUElYSS5TcHJpdGUuZnJvbUZyYW1lKCdyZXN0YXJ0LnBuZycpO1xuICAgIHNlbGYuYnRuUmVzdGFydC5zZXRJbnRlcmFjdGl2ZSh0cnVlKTtcbiAgICBzZWxmLmJ0blJlc3RhcnQuYnV0dG9uTW9kZSA9IHRydWU7XG4gICAgc2VsZi5zdGFnZS5hZGRDaGlsZChnYW1lLmJ0blJlc3RhcnQpO1xuICAgIHNlbGYuYnRuUmVzdGFydC5wb3NpdGlvbi54ID0gc2VsZi5yZW5kZXJlci53aWR0aCAtIDEwIC0gc2VsZi5idG5SZXN0YXJ0LndpZHRoO1xuICAgIHNlbGYuYnRuUmVzdGFydC5wb3NpdGlvbi55ID0gMTA7XG4gICAgc2VsZi5idG5SZXN0YXJ0LnZpc2libGUgPSBmYWxzZTtcblxuICAgIHNlbGYuYnRuUmVzdGFydC5jbGljayA9IHNlbGYuYnRuUmVzdGFydC50YXAgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBzZWxmLnJlc3RhcnQoKTtcbiAgICB9XG4gIH1cblxuICB0aGlzLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGltZ3NBcnIgPSBbXSwgaTtcbiAgICBsb3N0ID0gZmFsc2U7XG4gICAgLy8gc3RhcnQgc2NlbmVzXG4gICAgLy8gc2VsZi5zdGFnZS5hZGRDaGlsZChsaWdodEdyYXBoaWNzKTtcblxuICAgIC8vIHN0YXJ0IHNjcmVlbnNcblxuICAgIC8vIHN0YXJ0IGxvb3BcbiAgICBzZWxmLmxvb3AoKTtcblxuICAgIC8vXG4gICAgc2VsZi5wcmVsb2FkZXIgPSBuZXcgUHJlbG9hZGVyKHRoaXMpO1xuXG4gICAgLy8gRklYTUVcbiAgICBzZWxmLmxvYWRQaXhpKCk7XG4gIH07XG5cbiAgdGhpcy5sb3NlR2FtZSA9IGZ1bmN0aW9uKClcbiAge1xuICAgIGlmIChsb3N0KSByZXR1cm47XG4gICAgbG9zdCA9IHRydWU7XG4gICAgZ2FtZVJ1bm5pbmcgPSBmYWxzZTtcbiAgICBzZWxmLmdhbWVvdmVyLnNob3coKTtcbiAgfVxuXG4gIHRoaXMuZ29Ub0JlZ2lubmluZyA9IGZ1bmN0aW9uKClcbiAge1xuICAgIC8vIGdhbWUubG9hZExldmVsKDEpO1xuICAgIGdhbWUubGV2ZWwuZGlzcG9zZSgpO1xuICAgIGdhbWUubGV2ZWwuaW5kZXggPSAwO1xuICAgIGdhbWUubGV2ZWwgPSBudWxsO1xuXG4gICAgc2VsZi5iZWdpbi5zaG93KCk7XG4gIH1cblxuICB2YXIgcGhyYXNlMSA9IG51bGw7XG4gIHZhciBwaHJhc2UyID0gbnVsbDtcbiAgdmFyIHBocmFzZTMgPSBudWxsO1xuICB0aGlzLnNob3dFbmRTdG9yeSA9IGZ1bmN0aW9uKClcbiAge1xuICAgIC8vIGNvbnNvbGUubG9nKFwic2hvdyBlbmQgc3RvcnlcIiwgZ2FtZVJ1bm5pbmcpO1xuXG4gICAgaWYoIWdhbWVSdW5uaW5nKVxuICAgICAgcmV0dXJuO1xuXG4gICAgZ2FtZVJ1bm5pbmcgPSBmYWxzZTtcblxuICAgIHBocmFzZTEgPSBuZXcgUElYSS5UZXh0KCdITU1NLi4uTVkgSEVBRC4uLldIQVQgSEFQUEVORUQ/Jywge1xuICAgICAgZm9udDogJzIycHggUm9ra2l0dCcsXG4gICAgICBmaWxsOiAnI0ZGRkZGRicsXG4gICAgICBhbGlnbjogJ2NlbnRlcidcbiAgICB9KTtcblxuICAgIHBocmFzZTIgPSBuZXcgUElYSS5UZXh0KCdNT00/Li4uTU9NPyEgTk8hISEnLCB7XG4gICAgICBmb250OiAnMjJweCBSb2traXR0JyxcbiAgICAgIGZpbGw6ICcjRkZGRkZGJyxcbiAgICAgIGFsaWduOiAnY2VudGVyJ1xuICAgIH0pO1xuXG4gICAgcGhyYXNlMyA9IG5ldyBQSVhJLlRleHQoJ0JVVC4uLldBSVQuLi5USEFUIExJR0hULCBJVCBXQVMgWU9VPycsIHtcbiAgICAgIGZvbnQ6ICcyMnB4IFJva2tpdHQnLFxuICAgICAgZmlsbDogJyNGRkZGRkYnLFxuICAgICAgYWxpZ246ICdjZW50ZXInXG4gICAgfSk7XG5cbiAgICBwaHJhc2UxLmFscGhhID0gMDtcbiAgICBwaHJhc2UyLmFscGhhID0gMDtcbiAgICBwaHJhc2UzLmFscGhhID0gMDtcblxuICAgIHBocmFzZTEucG9zaXRpb24ueCA9IChzZWxmLnJlbmRlcmVyLndpZHRoIC8gMikgLSAocGhyYXNlMS53aWR0aCAvIDIpO1xuICAgIHBocmFzZTEucG9zaXRpb24ueSA9IHNlbGYucmVuZGVyZXIuaGVpZ2h0IC8gMiAtIDYwO1xuICAgIHNlbGYuc3RhZ2UuYWRkQ2hpbGQocGhyYXNlMSk7XG5cbiAgICBwaHJhc2UyLnBvc2l0aW9uLnggPSAoc2VsZi5yZW5kZXJlci53aWR0aCAvIDIpIC0gKHBocmFzZTIud2lkdGggLyAyKTtcbiAgICBwaHJhc2UyLnBvc2l0aW9uLnkgPSBzZWxmLnJlbmRlcmVyLmhlaWdodCAvIDIgLSAxMDtcbiAgICBzZWxmLnN0YWdlLmFkZENoaWxkKHBocmFzZTIpO1xuXG4gICAgcGhyYXNlMy5wb3NpdGlvbi54ID0gKHNlbGYucmVuZGVyZXIud2lkdGggLyAyKSAtIChwaHJhc2UzLndpZHRoIC8gMik7XG4gICAgcGhyYXNlMy5wb3NpdGlvbi55ID0gc2VsZi5yZW5kZXJlci5oZWlnaHQgLyAyICsgNDA7XG4gICAgc2VsZi5zdGFnZS5hZGRDaGlsZChwaHJhc2UzKTtcblxuXG4gICAgdmFyIHR3ZWVuYWJsZSA9IG5ldyBUd2VlbmFibGUoKTtcbiAgICB0d2VlbmFibGUudHdlZW4oe1xuICAgICAgZnJvbToge2FscGhhOjB9LFxuICAgICAgdG86ICAge2FscGhhOjF9LFxuICAgICAgZHVyYXRpb246IDUwMCxcbiAgICAgIGVhc2luZzogJ2Vhc2VPdXRDdWJpYycsXG4gICAgICBzdGFydDogZnVuY3Rpb24gKCkge1xuICAgICAgfSxcbiAgICAgIHN0ZXA6IGZ1bmN0aW9uKHN0YXRlKXtcbiAgICAgICAgcGhyYXNlMS5hbHBoYSA9IHN0YXRlLmFscGhhO1xuICAgICAgfSxcbiAgICAgIGZpbmlzaDogZnVuY3Rpb24gKCkge1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIHR3ZWVuYWJsZSA9IG5ldyBUd2VlbmFibGUoKTtcbiAgICB0d2VlbmFibGUudHdlZW4oe1xuICAgICAgZnJvbToge2FscGhhOjB9LFxuICAgICAgdG86ICAge2FscGhhOjF9LFxuICAgICAgZHVyYXRpb246IDUwMCxcbiAgICAgIGVhc2luZzogJ2Vhc2VPdXRDdWJpYycsXG4gICAgICBzdGFydDogZnVuY3Rpb24gKCkge1xuICAgICAgfSxcbiAgICAgIHN0ZXA6IGZ1bmN0aW9uKHN0YXRlKXtcbiAgICAgICAgcGhyYXNlMi5hbHBoYSA9IHN0YXRlLmFscGhhO1xuICAgICAgfSxcbiAgICAgIGZpbmlzaDogZnVuY3Rpb24gKCkge1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIHR3ZWVuYWJsZSA9IG5ldyBUd2VlbmFibGUoKTtcbiAgICB0d2VlbmFibGUudHdlZW4oe1xuICAgICAgZnJvbToge2FscGhhOjB9LFxuICAgICAgdG86ICAge2FscGhhOjF9LFxuICAgICAgZHVyYXRpb246IDUwMCxcbiAgICAgIGVhc2luZzogJ2Vhc2VPdXRDdWJpYycsXG4gICAgICBzdGFydDogZnVuY3Rpb24gKCkge1xuICAgICAgfSxcbiAgICAgIHN0ZXA6IGZ1bmN0aW9uKHN0YXRlKXtcbiAgICAgICAgcGhyYXNlMy5hbHBoYSA9IHN0YXRlLmFscGhhO1xuICAgICAgfSxcbiAgICAgIGZpbmlzaDogZnVuY3Rpb24gKCkge1xuICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICBzZWxmLnN0YWdlLnJlbW92ZUNoaWxkKHBocmFzZTEpO1xuICAgICAgc2VsZi5zdGFnZS5yZW1vdmVDaGlsZChwaHJhc2UyKTtcbiAgICAgIHNlbGYuc3RhZ2UucmVtb3ZlQ2hpbGQocGhyYXNlMyk7XG4gICAgICBzZWxmLmdvVG9CZWdpbm5pbmcoKTtcbiAgICB9LDgwMDApO1xuXG4gICAgc2VsZi5nYW1lUnVubmluZyA9IGZhbHNlO1xuICB9XG5cbiAgdGhpcy5zdGFydCgpO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBHYW1lSW5wdXQoKSB7XG5cdHZhciBLZXkgPSB7XG5cdCAgX3ByZXNzZWQ6IHt9LFxuXG5cdCAgTEVGVDogMzcsXG5cdCAgVVA6IDM4LFxuXHQgIFJJR0hUOiAzOSxcblx0ICBET1dOOiA0MCxcblx0ICBBOjY1LFxuXHQgIEQ6NjgsXG5cdCAgXG5cdCAgaXNEb3duOiBmdW5jdGlvbihrZXlDb2RlKSB7XG5cdCAgICByZXR1cm4gdGhpcy5fcHJlc3NlZFtrZXlDb2RlXTtcblx0ICB9LFxuXHQgIFxuXHQgIG9uS2V5ZG93bjogZnVuY3Rpb24oZXZlbnQpIHtcblx0ICAgIHRoaXMuX3ByZXNzZWRbZXZlbnQua2V5Q29kZV0gPSB0cnVlO1xuXHQgIH0sXG5cdCAgXG5cdCAgb25LZXl1cDogZnVuY3Rpb24oZXZlbnQpIHtcblx0ICAgIGRlbGV0ZSB0aGlzLl9wcmVzc2VkW2V2ZW50LmtleUNvZGVdO1xuXHQgIH0sXG5cblx0ICBpc0VtcHR5OiBmdW5jdGlvbiAoKSB7XG4gICAgXHRcdGZvcih2YXIgcHJvcCBpbiB0aGlzLl9wcmVzc2VkKSB7XG4gICAgICAgIFx0XHRpZih0aGlzLl9wcmVzc2VkLmhhc093blByb3BlcnR5KHByb3ApKVxuICAgICAgICAgICBcdFx0cmV0dXJuIGZhbHNlO1xuICAgIFx0XHR9XG5cbiAgICBcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHR9O1xuXG5cdHRoaXMuS2V5ID0gS2V5O1xuXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGZ1bmN0aW9uKGV2ZW50KSB7IEtleS5vbktleXVwKGV2ZW50KTsgfSwgZmFsc2UpO1xuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uKGV2ZW50KSB7IEtleS5vbktleWRvd24oZXZlbnQpOyB9LCBmYWxzZSk7XG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBHYW1lT3ZlcihnYW1lKSB7XG5cbiAgdmFyIGNvbnRlbnQsXG4gICAgc2VsZiA9IHRoaXMsXG4gICAgYmcsXG4gICAgdGV4dCxcbiAgICBjb3VudCxcbiAgICBkZWF0aCxcbiAgICBidG47XG5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBjb250ZW50ID0gbmV3IFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lcigpO1xuICAgIGNvbnRlbnQudmlzaWJsZSA9IGZhbHNlO1xuICAgIGdhbWUuc3RhZ2UuYWRkQ2hpbGQoY29udGVudCk7XG5cbiAgICBiZyA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG4gICAgYmcuYmVnaW5GaWxsKDB4MDAwMDAwKTtcbiAgICBiZy5kcmF3UmVjdCgwLCAwLCBzY3JlZW5XaWR0aCwgc2NyZWVuSGVpZ2h0KTtcbiAgICBiZy5lbmRGaWxsKCk7XG4gICAgY29udGVudC5hZGRDaGlsZChiZyk7XG5cbiAgICBkZWF0aCA9IFBJWEkuU3ByaXRlLmZyb21GcmFtZShcIkRlYXRoU2lsaHVldDIucG5nXCIpO1xuICAgIGRlYXRoLmFuY2hvci54ID0gMC41O1xuICAgIGRlYXRoLmFuY2hvci55ID0gMC41O1xuICAgIGRlYXRoLnNjYWxlLnggPSAxO1xuICAgIGRlYXRoLnNjYWxlLnkgPSAxO1xuICAgIGNvbnRlbnQuYWRkQ2hpbGQoZGVhdGgpO1xuICAgIGRlYXRoLnBvc2l0aW9uLnggPSBzY3JlZW5XaWR0aC8yO1xuICAgIGRlYXRoLnBvc2l0aW9uLnkgPSBzY3JlZW5IZWlnaHQvMjtcbiAgfVxuXG4gIHRoaXMuc2hvdyA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnRlbnQudmlzaWJsZSA9IHRydWU7XG4gICAgYmcuYWxwaGEgPSAwO1xuICAgIGRlYXRoLnZpc2libGUgPSBmYWxzZTtcbiAgICBkZWF0aC5hbHBoYSA9IDA7XG4gICAgY291bnQgPSAwO1xuICB9XG5cbiAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbigpXG4gIHtcbiAgICBpZiAoIWNvbnRlbnQudmlzaWJsZSkgcmV0dXJuO1xuXG4gICAgYmcuYWxwaGEgKz0gMC4wMTtcbiAgICBpZiAoYmcuYWxwaGEgPiAxKSBiZy5hbHBoYSA9IDE7XG5cbiAgICBpZiAoYmcuYWxwaGEgPT0gMSlcbiAgICB7XG4gICAgICBpZiAoY291bnQgPT0gMCkgZ2FtZS5yZXNvdXJjZXMuc3Rvcm0ucGxheSgpO1xuXG4gICAgICBpZiAoY291bnQlMTUgPT0gMCAmJiBjb3VudCA8IDgwKVxuICAgICAge1xuICAgICAgICBkZWF0aC52aXNpYmxlID0gIWRlYXRoLnZpc2libGU7XG4gICAgICB9XG5cbiAgICAgIGRlYXRoLmFscGhhID0gMTtcblxuICAgICAgY291bnQrKztcblxuICAgICAgaWYgKGNvdW50ID49IDE1MCkgaGlkZSgpO1xuICAgIH1cblxuXG4gIH1cblxuICBmdW5jdGlvbiBoaWRlKCkge1xuICAgIGNvbnRlbnQudmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgLy8gZ2FtZS5sb2FkTGV2ZWwoMSk7XG4gICAgLy8gZ2FtZS5sZXZlbC5kaXNwb3NlKCk7XG4gICAgLy8gZ2FtZS5sZXZlbC5pbmRleCA9IDA7XG4gICAgLy8gZ2FtZS5sZXZlbCA9IG51bGw7XG5cbiAgICBnYW1lLmdvVG9CZWdpbm5pbmcoKTtcbiAgfVxuXG4gIGluaXQoKTtcblxufTtcbiIsIlxudmFyIFBsYXRmb3JtQmVoYXZpb3IgPSByZXF1aXJlKCcuL2JlaGF2aW9ycy9QbGF0Zm9ybUJlaGF2aW9yLmpzJyk7XG52YXIgU3dpdGNoQmVoYXZpb3IgPSByZXF1aXJlKCcuL2JlaGF2aW9ycy9Td2l0Y2hCZWhhdmlvci5qcycpO1xudmFyIEVuZEJlaGF2aW9yID0gcmVxdWlyZSgnLi9iZWhhdmlvcnMvRW5kQmVoYXZpb3IuanMnKTtcbnZhciBMaWdodEJlaGF2aW9yID0gcmVxdWlyZSgnLi9iZWhhdmlvcnMvTGlnaHRCZWhhdmlvci5qcycpO1xudmFyIEVuZENhckJlaGF2aW9yID0gcmVxdWlyZSgnLi9iZWhhdmlvcnMvRW5kQ2FyQmVoYXZpb3IuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBMZXZlbChnYW1lLCBpbmRleCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBudW1Td2l0Y2hlcyA9IDA7XG4gIHZhciB0dXRvcmlhbCA9IG51bGw7XG4gIHZhciBjb3VudCA9IDA7XG4gIHNlbGYubnVtU3dpdGNoZXMgPSBudW1Td2l0Y2hlcztcbiAgdGhpcy5pbmRleCA9IGluZGV4O1xuICB0aGlzLnNlZ21lbnRzID0gW107XG4gIHRoaXMubGV2ZWxvYmplY3RzID0gW107XG4gIHRoaXMucGxheWVyUG9zID0ge307XG4gIHRoaXMuY29udGFpbmVyID0gbmV3IFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lcigpO1xuXG4gIHRoaXMudmlldyA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcblxuICBnYW1lLnJlc291cmNlcy5mb3Jlc3RTb3VuZC5wbGF5KCk7XG5cbiAgLy9cbiAgLy8gTGV2ZWwgbWV0aG9kc1xuICAvL1xuXG4gIHRoaXMuZGlzcG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubGV2ZWxvYmplY3RzID0gbnVsbDtcbiAgICBnYW1lLnJlc291cmNlcy5mb3Jlc3RTb3VuZC5zdG9wKCk7XG4gICAgZ2FtZS5zdGFnZS5yZW1vdmVDaGlsZChzZWxmLmNvbnRhaW5lcik7XG4gICAgZ2FtZS5zdGFnZS5yZW1vdmVDaGlsZChzZWxmLnZpZXcpO1xuICB9XG5cbiAgdGhpcy5wYXJzZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBzZWxmLmJnMSA9IFBJWEkuU3ByaXRlLmZyb21GcmFtZShcImJhY2tncm91bmRGb3Jlc3QucG5nXCIpO1xuICAgIHNlbGYudmlldy5hZGRDaGlsZChzZWxmLmJnMSk7XG5cbiAgICBzZWxmLm5vaXNlID0gUElYSS5TcHJpdGUuZnJvbUZyYW1lKFwibm9pc2UucG5nXCIpO1xuICAgIHNlbGYubm9pc2Uuc2NhbGUueCA9IDI7XG4gICAgc2VsZi5ub2lzZS5zY2FsZS55ID0gMjtcbiAgICBzZWxmLnZpZXcuYWRkQ2hpbGQoc2VsZi5ub2lzZSk7XG5cbiAgICBzZWxmLm92ZXJsYXkgPSBuZXcgUElYSS5HcmFwaGljcygpO1xuICAgIHNlbGYub3ZlcmxheS5iZWdpbkZpbGwoMHgwMGZmZmEpO1xuICAgIHNlbGYub3ZlcmxheS5kcmF3UmVjdCgwLCAwLCBzY3JlZW5XaWR0aCwgc2NyZWVuSGVpZ2h0KTtcbiAgICBzZWxmLm92ZXJsYXkuZW5kRmlsbCgpO1xuICAgIHNlbGYub3ZlcmxheS5hbHBoYSA9IDAuMztcbiAgICBzZWxmLnZpZXcuYWRkQ2hpbGQoc2VsZi5vdmVybGF5KTtcblxuXG4gICAgc2VsZi5iZzIgPSBQSVhJLlNwcml0ZS5mcm9tRnJhbWUoXCJiYWNrZ3JvdW5kRm9yZXN0LnBuZ1wiKTtcbiAgICBzZWxmLnZpZXcuYWRkQ2hpbGQoc2VsZi5iZzIpO1xuXG4gICAgaWYgKGluZGV4ID09IDEpXG4gICAge1xuICAgICAgdHV0b3JpYWwgPSBQSVhJLlNwcml0ZS5mcm9tRnJhbWUoXCJjb250cm9scy5wbmdcIik7XG4gICAgICB0dXRvcmlhbC5hbmNob3IueCA9IDAuNTtcbiAgICAgIHR1dG9yaWFsLmFuY2hvci55ID0gMC41O1xuICAgICAgc2VsZi52aWV3LmFkZENoaWxkKHR1dG9yaWFsKTtcbiAgICAgIHR1dG9yaWFsLnBvc2l0aW9uLnggPSBzY3JlZW5XaWR0aC8yO1xuICAgICAgdHV0b3JpYWwucG9zaXRpb24ueSA9IHNjcmVlbkhlaWdodC8yO1xuICAgIH1cblxuICAgIHNlbGYuc2NlbmFyaW8gPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG4gICAgc2VsZi52aWV3LmFkZENoaWxkKHNlbGYuc2NlbmFyaW8pO1xuXG4gICAgc2VsZi5mb3JlZ3JvdW5kID0gbmV3IFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lcigpO1xuICAgIHNlbGYudmlldy5hZGRDaGlsZChzZWxmLmZvcmVncm91bmQpO1xuXG4gICAgZm9yIChpbmRleCA9IDA7IGluZGV4IDwgZGF0YS5sYXllcnNbMF0ub2JqZWN0cy5sZW5ndGg7ICsraW5kZXgpIHtcblxuICAgICAgLy8vL3NlYXJjaCBmb3IgcGxheWVyIHN0YXJ0IHBvaW50XG4gICAgICBpZihkYXRhLmxheWVyc1swXS5vYmplY3RzW2luZGV4XS50eXBlID09IFwic3RhcnRcIilcbiAgICAgIHtcbiAgICAgICAgc2VsZi5wbGF5ZXJQb3MgPSB7eDpkYXRhLmxheWVyc1swXS5vYmplY3RzW2luZGV4XS54LCB5OmRhdGEubGF5ZXJzWzBdLm9iamVjdHNbaW5kZXhdLnl9O1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYoZGF0YS5sYXllcnNbMF0ub2JqZWN0c1tpbmRleF0udHlwZSA9PSBcIlN3aXRjaEJlaGF2aW9yXCIpXG4gICAgICAgIHNlbGYubnVtU3dpdGNoZXMgKys7XG5cbiAgICAgIC8vLy9zZXR1cCBiZWhhdmlvclxuICAgICAgdmFyIEJlaGF2aW91ckNsYXNzID0gcmVxdWlyZShcIi4vYmVoYXZpb3JzL1wiICsgZGF0YS5sYXllcnNbMF0ub2JqZWN0c1tpbmRleF0udHlwZSArIFwiLmpzXCIpO1xuXG4gICAgICB2YXIgYyA9IEJlaGF2aW91ckNsYXNzID09IExpZ2h0QmVoYXZpb3IgPyBzZWxmLmZvcmVncm91bmQgOiBzZWxmLnNjZW5hcmlvO1xuXG4gICAgICB2YXIgYmVoYXZpb3IgPSBuZXcgQmVoYXZpb3VyQ2xhc3MoYywgZGF0YS5sYXllcnNbMF0ub2JqZWN0c1tpbmRleF0pO1xuICAgICAgc2VsZi5sZXZlbG9iamVjdHMucHVzaChiZWhhdmlvcik7XG5cbiAgICAgIGlmKGRhdGEubGF5ZXJzWzBdLm9iamVjdHNbaW5kZXhdLnR5cGUgPT0gXCJMaWdodEJlaGF2aW9yXCIpIHtcbiAgICAgICAgbGlnaHQuYmVoYXZpb3IgPSBiZWhhdmlvcjtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vLy9jcmVhdGUgc2hhZG93XG4gICAgICBpZighZGF0YS5sYXllcnNbMF0ub2JqZWN0c1tpbmRleF0ucHJvcGVydGllcy5zaGFkb3cpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vLy8vcmV0cml2ZSBwb3NpdGlvbiBhbmQgc2l6ZSBzcGVjc1xuICAgICAgdmFyIHNpemVYID0gZGF0YS5sYXllcnNbMF0ub2JqZWN0c1tpbmRleF0ud2lkdGg7XG4gICAgICB2YXIgc2l6ZVkgPSBkYXRhLmxheWVyc1swXS5vYmplY3RzW2luZGV4XS5oZWlnaHQ7XG4gICAgICB2YXIgb3JpZ2luWCA9IGRhdGEubGF5ZXJzWzBdLm9iamVjdHNbaW5kZXhdLng7XG4gICAgICB2YXIgb3JpZ2luWSA9IGRhdGEubGF5ZXJzWzBdLm9iamVjdHNbaW5kZXhdLnk7XG5cbiAgICAgIHZhciBzZWdtZW50QSA9IHt0YXJnZXQ6YmVoYXZpb3IudmlldyxhOnt4Om9yaWdpblgseTpvcmlnaW5ZfSwgYjp7eDpvcmlnaW5YICsgc2l6ZVgseTpvcmlnaW5ZfX07XG4gICAgICB2YXIgc2VnbWVudEIgPSB7dGFyZ2V0OmJlaGF2aW9yLnZpZXcsYTp7eDpvcmlnaW5YK3NpemVYLHk6b3JpZ2luWX0sIGI6e3g6b3JpZ2luWCArIHNpemVYLHk6b3JpZ2luWStzaXplWX19O1xuICAgICAgdmFyIHNlZ21lbnRDID0ge3RhcmdldDpiZWhhdmlvci52aWV3LGE6e3g6b3JpZ2luWCtzaXplWCx5Om9yaWdpblkrc2l6ZVl9LCBiOnt4Om9yaWdpblgseTpvcmlnaW5ZICsgc2l6ZVl9fTtcbiAgICAgIHZhciBzZWdtZW50RCA9IHt0YXJnZXQ6YmVoYXZpb3IudmlldyxhOnt4Om9yaWdpblgseTpvcmlnaW5ZICsgc2l6ZVl9LCBiOnt4Om9yaWdpblgseTpvcmlnaW5ZfX07XG5cbiAgICAgIHRoaXMuc2VnbWVudHMucHVzaChzZWdtZW50QSk7XG4gICAgICB0aGlzLnNlZ21lbnRzLnB1c2goc2VnbWVudEIpO1xuICAgICAgdGhpcy5zZWdtZW50cy5wdXNoKHNlZ21lbnRDKTtcbiAgICAgIHRoaXMuc2VnbWVudHMucHVzaChzZWdtZW50RCk7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coXCJ0b3RhbCBzd2l0Y2hlcyBpbiBsZXZlbDogXCIgKyBzZWxmLm51bVN3aXRjaGVzKTtcbiAgfVxuXG5cbiAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbihnYW1lKVxuICB7XG4gICAgLy8gV0hZIEdPRD8hPyE/ISFcbiAgICB0cnkge1xuICAgICAgc2VsZi5ub2lzZS5hbHBoYSA9IDAuMTtcbiAgICAgIHNlbGYubm9pc2UucG9zaXRpb24ueCA9IE1hdGgucmFuZG9tKCkqOTAwIC0gOTAwO1xuICAgICAgc2VsZi5ub2lzZS5wb3NpdGlvbi55ID0gTWF0aC5yYW5kb20oKSo2MDAgLSA2MDA7XG5cbiAgICAgIGlmICh0dXRvcmlhbCAhPSBudWxsKVxuICAgICAgICB7XG4gICAgICAgICAgdHV0b3JpYWwuYWxwaGEgPSAwLjc1ICsgTWF0aC5zaW4oY291bnQpKjAuMjU7XG4gICAgICAgICAgY291bnQgKz0gMC4xO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNlbGYubGV2ZWxvYmplY3RzKSB7XG4gICAgICAgICAgZm9yIChpbmRleCA9IDA7IGluZGV4IDwgc2VsZi5sZXZlbG9iamVjdHMubGVuZ3RoOyArK2luZGV4KSB7XG4gICAgICAgICAgICBzZWxmLmxldmVsb2JqZWN0c1tpbmRleF0udXBkYXRlKGdhbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICB9XG4gIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIExldmVsRW5kKGdhbWUpIHtcblxuICB2YXIgY29udGVudCxcbiAgICBzZWxmID0gdGhpcyxcbiAgICBiZyxcbiAgICB0ZXh0LFxuICAgIGJ0bjtcblxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIGNvbnRlbnQgPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG4gICAgY29udGVudC52aXNpYmxlID0gZmFsc2U7XG4gICAgZ2FtZS5zdGFnZS5hZGRDaGlsZChjb250ZW50KTtcblxuICAgIGJnID0gUElYSS5TcHJpdGUuZnJvbUltYWdlKGdhbWUucmVzb3VyY2VzLmJhY2tncm91bmQpO1xuICAgIGNvbnRlbnQuYWRkQ2hpbGQoYmcpO1xuXG4gICAgdGV4dCA9IFBJWEkuU3ByaXRlLmZyb21JbWFnZShnYW1lLnJlc291cmNlcy50ZXh0TGV2ZWxFbmQpO1xuICAgIGNvbnRlbnQuYWRkQ2hpbGQodGV4dCk7XG5cbiAgICBidG4gPSBuZXcgUElYSS5TcHJpdGUoUElYSS5UZXh0dXJlLmZyb21JbWFnZShnYW1lLnJlc291cmNlcy5idG5OZXh0KSk7XG4gICAgYnRuLmJ1dHRvbk1vZGUgPSB0cnVlO1xuICAgIGJ0bi5pbnRlcmFjdGl2ZSA9IHRydWU7XG4gICAgY29udGVudC5hZGRDaGlsZChidG4pO1xuICAgIGJ0bi5jbGljayA9IGJ0bi50YXAgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBoaWRlKCk7XG4gICAgICBnYW1lLm5leHRMZXZlbCgpO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBzZXRQb3NpdGlvbnMoKSB7XG4gICAgdGV4dC5wb3NpdGlvbi54ID0gKGdhbWUucmVuZGVyZXIud2lkdGggLyAyKSAtICh0ZXh0LndpZHRoIC8gMik7XG4gICAgdGV4dC5wb3NpdGlvbi55ID0gKGdhbWUucmVuZGVyZXIuaGVpZ2h0IC8gMyk7XG5cbiAgICBidG4ucG9zaXRpb24ueCA9IChnYW1lLnJlbmRlcmVyLndpZHRoIC8gMikgLSAoYnRuLndpZHRoIC8gMik7XG4gICAgYnRuLnBvc2l0aW9uLnkgPSAoZ2FtZS5yZW5kZXJlci5oZWlnaHQgLyAzKSAqIDI7XG4gIH1cblxuICB0aGlzLnNob3cgPSBmdW5jdGlvbigpIHtcbiAgICBjb250ZW50LnZpc2libGUgPSB0cnVlO1xuICAgIHNldFBvc2l0aW9ucygpO1xuICB9XG5cbiAgZnVuY3Rpb24gaGlkZSgpIHtcbiAgICBjb250ZW50LnZpc2libGUgPSBmYWxzZTtcbiAgfVxuXG4gIGluaXQoKTtcblxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gTGlnaHQoeCwgeSkge1xuICB0aGlzLnBvc2l0aW9uID0ge3g6IHgsIHk6IHl9O1xuXG4gIHRoaXMuc2VnbWVudHMgPSBbXTtcbiAgdGhpcy5mdXp6eVJhZGl1cyA9IDEwO1xuXG4gIHRoaXMuc2V0U2VnbWVudHMgPSBmdW5jdGlvbihzZWdtZW50cykge1xuICAgIHRoaXMuc2VnbWVudHMgPSBzZWdtZW50cztcbiAgfTtcblxuICB0aGlzLmdldFNpZ2h0UG9seWdvbnMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcG9seWdvbnMgPSBbIGxpZ2h0LmdldFNpZ2h0UG9seWdvbih0aGlzLnBvc2l0aW9uLngsIHRoaXMucG9zaXRpb24ueSkgXTtcblxuICAgIGZvcih2YXIgYW5nbGU9MDthbmdsZTxNYXRoLlBJKjI7YW5nbGUrPShNYXRoLlBJKjIpLzEwKXtcbiAgICAgIHZhciBkeCA9IE1hdGguY29zKGFuZ2xlKSp0aGlzLmZ1enp5UmFkaXVzO1xuICAgICAgdmFyIGR5ID0gTWF0aC5zaW4oYW5nbGUpKnRoaXMuZnV6enlSYWRpdXM7XG4gICAgICBwb2x5Z29ucy5wdXNoKHRoaXMuZ2V0U2lnaHRQb2x5Z29uKHRoaXMucG9zaXRpb24ueCtkeCx0aGlzLnBvc2l0aW9uLnkrZHkpKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHBvbHlnb25zO1xuICB9O1xuXG4gIHRoaXMuZ2V0UG9seWdvbkdyYXBoaWNzID0gZnVuY3Rpb24ocG9seWdvbiwgZmlsbFN0eWxlKSB7XG4gICAgdmFyIGcgPSBuZXcgUElYSS5HcmFwaGljcygpO1xuICAgIGcuYmVnaW5GaWxsKDB4MDAwKTtcbiAgICBnLm1vdmVUbyhwb2x5Z29uWzBdLngsIHBvbHlnb25bMF0ueSk7XG4gICAgZm9yKHZhciBpPTE7aTxwb2x5Z29uLmxlbmd0aDtpKyspe1xuICAgICAgdmFyIGludGVyc2VjdCA9IHBvbHlnb25baV07XG4gICAgICBnLmxpbmVUbyhpbnRlcnNlY3QueCwgaW50ZXJzZWN0LnkpO1xuICAgIH1cbiAgICBnLmVuZEZpbGwoKTtcbiAgICByZXR1cm4gZztcbiAgfTtcblxuICB0aGlzLmdldEludGVyc2VjdGlvbiA9IGZ1bmN0aW9uKHJheSwgc2VnbWVudCkge1xuICAgIC8vIFJBWSBpbiBwYXJhbWV0cmljOiBQb2ludCArIERlbHRhKlQxXG4gICAgdmFyIHJfcHggPSByYXkuYS54O1xuICAgIHZhciByX3B5ID0gcmF5LmEueTtcbiAgICB2YXIgcl9keCA9IHJheS5iLngtcmF5LmEueDtcbiAgICB2YXIgcl9keSA9IHJheS5iLnktcmF5LmEueTtcblxuICAgIC8vIFNFR01FTlQgaW4gcGFyYW1ldHJpYzogUG9pbnQgKyBEZWx0YSpUMlxuICAgIHZhciBzX3B4ID0gc2VnbWVudC5hLng7XG4gICAgdmFyIHNfcHkgPSBzZWdtZW50LmEueTtcbiAgICB2YXIgc19keCA9IHNlZ21lbnQuYi54LXNlZ21lbnQuYS54O1xuICAgIHZhciBzX2R5ID0gc2VnbWVudC5iLnktc2VnbWVudC5hLnk7XG5cbiAgICAvLyBBcmUgdGhleSBwYXJhbGxlbD8gSWYgc28sIG5vIGludGVyc2VjdFxuICAgIHZhciByX21hZyA9IE1hdGguc3FydChyX2R4KnJfZHgrcl9keSpyX2R5KTtcbiAgICB2YXIgc19tYWcgPSBNYXRoLnNxcnQoc19keCpzX2R4K3NfZHkqc19keSk7XG4gICAgaWYocl9keC9yX21hZz09c19keC9zX21hZyAmJiByX2R5L3JfbWFnPT1zX2R5L3NfbWFnKXtcbiAgICAgIC8vIFVuaXQgdmVjdG9ycyBhcmUgdGhlIHNhbWUuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBTT0xWRSBGT1IgVDEgJiBUMlxuICAgIC8vIHJfcHgrcl9keCpUMSA9IHNfcHgrc19keCpUMiAmJiByX3B5K3JfZHkqVDEgPSBzX3B5K3NfZHkqVDJcbiAgICAvLyA9PT4gVDEgPSAoc19weCtzX2R4KlQyLXJfcHgpL3JfZHggPSAoc19weStzX2R5KlQyLXJfcHkpL3JfZHlcbiAgICAvLyA9PT4gc19weCpyX2R5ICsgc19keCpUMipyX2R5IC0gcl9weCpyX2R5ID0gc19weSpyX2R4ICsgc19keSpUMipyX2R4IC0gcl9weSpyX2R4XG4gICAgLy8gPT0+IFQyID0gKHJfZHgqKHNfcHktcl9weSkgKyByX2R5KihyX3B4LXNfcHgpKS8oc19keCpyX2R5IC0gc19keSpyX2R4KVxuICAgIHZhciBUMiA9IChyX2R4KihzX3B5LXJfcHkpICsgcl9keSoocl9weC1zX3B4KSkvKHNfZHgqcl9keSAtIHNfZHkqcl9keCk7XG4gICAgdmFyIFQxID0gKHNfcHgrc19keCpUMi1yX3B4KS9yX2R4O1xuXG4gICAgLy8gTXVzdCBiZSB3aXRoaW4gcGFyYW1ldGljIHdoYXRldmVycyBmb3IgUkFZL1NFR01FTlRcbiAgICBpZihUMTwwKSByZXR1cm4gbnVsbDtcbiAgICBpZihUMjwwIHx8IFQyPjEpIHJldHVybiBudWxsO1xuXG4gICAgLy8gUmV0dXJuIHRoZSBQT0lOVCBPRiBJTlRFUlNFQ1RJT05cbiAgICByZXR1cm4ge1xuICAgICAgeDogcl9weCtyX2R4KlQxLFxuICAgICAgeTogcl9weStyX2R5KlQxLFxuICAgICAgcGFyYW06IFQxXG4gICAgfTtcbiAgfTtcblxuICB0aGlzLmdldFNpZ2h0UG9seWdvbiA9IGZ1bmN0aW9uKHNpZ2h0WCwgc2lnaHRZKSB7XG4gICAgLy8gR2V0IGFsbCB1bmlxdWUgcG9pbnRzXG4gICAgdmFyIHBvaW50cyA9IChmdW5jdGlvbihzZWdtZW50cyl7XG4gICAgICB2YXIgYSA9IFtdO1xuICAgICAgc2VnbWVudHMuZm9yRWFjaChmdW5jdGlvbihzZWcpe1xuICAgICAgICBhLnB1c2goc2VnLmEsc2VnLmIpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gYTtcbiAgICB9KSh0aGlzLnNlZ21lbnRzKTtcblxuICAgIHZhciB1bmlxdWVQb2ludHMgPSAoZnVuY3Rpb24ocG9pbnRzKXtcbiAgICAgIHZhciBzZXQgPSB7fTtcbiAgICAgIHJldHVybiBwb2ludHMuZmlsdGVyKGZ1bmN0aW9uKHApe1xuICAgICAgICB2YXIga2V5ID0gcC54K1wiLFwiK3AueTtcbiAgICAgICAgaWYoa2V5IGluIHNldCl7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICBzZXRba2V5XT10cnVlO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KShwb2ludHMpO1xuXG4gICAgLy8gR2V0IGFsbCBhbmdsZXNcbiAgICB2YXIgdW5pcXVlQW5nbGVzID0gW107XG4gICAgZm9yKHZhciBqPTA7ajx1bmlxdWVQb2ludHMubGVuZ3RoO2orKyl7XG4gICAgICB2YXIgdW5pcXVlUG9pbnQgPSB1bmlxdWVQb2ludHNbal07XG4gICAgICB2YXIgYW5nbGUgPSBNYXRoLmF0YW4yKHVuaXF1ZVBvaW50Lnktc2lnaHRZLHVuaXF1ZVBvaW50Lngtc2lnaHRYKTtcbiAgICAgIHVuaXF1ZVBvaW50LmFuZ2xlID0gYW5nbGU7XG4gICAgICB1bmlxdWVBbmdsZXMucHVzaChhbmdsZS0wLjAwMDAxLGFuZ2xlLGFuZ2xlKzAuMDAwMDEpO1xuICAgIH1cblxuICAgIC8vIFJBWVMgSU4gQUxMIERJUkVDVElPTlNcbiAgICB2YXIgaW50ZXJzZWN0cyA9IFtdO1xuICAgIGZvcih2YXIgaj0wO2o8dW5pcXVlQW5nbGVzLmxlbmd0aDtqKyspe1xuICAgICAgdmFyIGFuZ2xlID0gdW5pcXVlQW5nbGVzW2pdO1xuXG4gICAgICAvLyBDYWxjdWxhdGUgZHggJiBkeSBmcm9tIGFuZ2xlXG4gICAgICB2YXIgZHggPSBNYXRoLmNvcyhhbmdsZSk7XG4gICAgICB2YXIgZHkgPSBNYXRoLnNpbihhbmdsZSk7XG5cbiAgICAgIC8vIFJheSBmcm9tIGNlbnRlciBvZiBzY3JlZW4gdG8gbW91c2VcbiAgICAgIHZhciByYXkgPSB7XG4gICAgICAgIGE6e3g6c2lnaHRYLHk6c2lnaHRZfSxcbiAgICAgICAgYjp7eDpzaWdodFgrZHgseTpzaWdodFkrZHl9XG4gICAgICB9O1xuXG4gICAgICAvLyBGaW5kIENMT1NFU1QgaW50ZXJzZWN0aW9uXG4gICAgICB2YXIgY2xvc2VzdEludGVyc2VjdCA9IG51bGw7XG4gICAgICBmb3IodmFyIGk9MDtpPHRoaXMuc2VnbWVudHMubGVuZ3RoO2krKyl7XG4gICAgICAgIHZhciBpbnRlcnNlY3QgPSB0aGlzLmdldEludGVyc2VjdGlvbihyYXksdGhpcy5zZWdtZW50c1tpXSk7XG4gICAgICAgIGlmKCFpbnRlcnNlY3QpIGNvbnRpbnVlO1xuICAgICAgICBpZighY2xvc2VzdEludGVyc2VjdCB8fCBpbnRlcnNlY3QucGFyYW08Y2xvc2VzdEludGVyc2VjdC5wYXJhbSl7XG4gICAgICAgICAgY2xvc2VzdEludGVyc2VjdD1pbnRlcnNlY3Q7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gSW50ZXJzZWN0IGFuZ2xlXG4gICAgICBpZighY2xvc2VzdEludGVyc2VjdCkgY29udGludWU7XG4gICAgICBjbG9zZXN0SW50ZXJzZWN0LmFuZ2xlID0gYW5nbGU7XG5cbiAgICAgIC8vIEFkZCB0byBsaXN0IG9mIGludGVyc2VjdHNcbiAgICAgIGludGVyc2VjdHMucHVzaChjbG9zZXN0SW50ZXJzZWN0KTtcbiAgICB9XG5cbiAgICAvLyBTb3J0IGludGVyc2VjdHMgYnkgYW5nbGVcbiAgICBpbnRlcnNlY3RzID0gaW50ZXJzZWN0cy5zb3J0KGZ1bmN0aW9uKGEsYil7XG4gICAgICByZXR1cm4gYS5hbmdsZS1iLmFuZ2xlO1xuICAgIH0pO1xuXG4gICAgLy8gUG9seWdvbiBpcyBpbnRlcnNlY3RzLCBpbiBvcmRlciBvZiBhbmdsZVxuICAgIHJldHVybiBpbnRlcnNlY3RzO1xuICB9XG5cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gUGh5c2ljcygpXG57XG5cdHZhciBzZWxmID0gdGhpcztcblx0dmFyIHBsYXllclBvc2l0aW9uID0ge3g6MCwgeTowfTtcblx0dmFyIHBsYXllclZlbG9jaXR5ID0ge3g6MCwgeTowfTtcblx0dmFyIGF4aXMgPSB7eDowLCB5OjB9O1xuXG5cdHRoaXMucHJvY2VzcyA9IHByb2Nlc3M7XG5cdHRoaXMucGxheWVyUG9zaXRpb24gPSBwbGF5ZXJQb3NpdGlvbjtcblx0dGhpcy5wbGF5ZXJWZWxvY2l0eSA9IHBsYXllclZlbG9jaXR5O1xuXG5cdGZ1bmN0aW9uIHByb2Nlc3MoZ2FtZSwgZGlyZWN0aW9uLCB2ZXJ0aWNlcylcblx0e1xuXHRcdGF4aXMueCA9IGRpcmVjdGlvbjtcblxuXHRcdC8vIHZhciB2ZXJ0aWNlcyA9IHBvbHlnb25zWzBdO1xuXHRcdHZhciB3YWxraW5nID0gYXhpcy54ICE9IDA7XG5cdFx0dmFyIG9mZnNldFggPSAyMDtcblx0XHR2YXIgb2Zmc2V0WSA9IDIwO1xuXHRcdHZhciB2ZWxYID0gd2Fsa2luZyA/IDQgOiAwO1xuXHRcdHZhciB2ZWxZID0gNjtcblxuXHRcdC8vIHZhciBsaW5lSEEgPSB7eDpwbGF5ZXJQb3NpdGlvbi54IC0gMTAwMCwgeTpwbGF5ZXJQb3NpdGlvbi55fTtcblx0XHQvLyB2YXIgbGluZUhCID0ge3g6cGxheWVyUG9zaXRpb24ueCArIDEwMDAsIHk6cGxheWVyUG9zaXRpb24ueX07XG5cdFx0Ly8gdmFyIGxpbmVWQSA9IHt4OnBsYXllclBvc2l0aW9uLngsIHk6cGxheWVyUG9zaXRpb24ueSAtIDEwMDB9O1xuXHRcdC8vIHZhciBsaW5lVkIgPSB7eDpwbGF5ZXJQb3NpdGlvbi54LCB5OnBsYXllclBvc2l0aW9uLnkgKyAxMDAwfTtcblx0XHQvLyB2YXIgcmVzdWx0SCA9IHJheWNhc3QobGluZUhBLCBsaW5lSEIsIHZlcnRpY2VzKTtcblx0XHQvLyB2YXIgcmVzdWx0ViA9IHJheWNhc3QobGluZVZBLCBsaW5lVkIsIHZlcnRpY2VzKTtcblx0XHQvLyB2YXIgbmVhcmVzdCA9IGdldE5lYXJlc3RGYWNlcyhwbGF5ZXJQb3NpdGlvbiwgcmVzdWx0SC5jb25jYXQocmVzdWx0VikpO1xuXHRcdC8vIHZhciBpc0luc2lkZSA9IHBvaW50SW5Qb2x5Z29uKHBsYXllclBvc2l0aW9uLCB2ZXJ0aWNlcyk7XG5cblx0XHQvLyBpZiAoYXhpcy54IDwgMCAmJiBuZWFyZXN0LmxkIC0gb2Zmc2V0WCA8IHZlbFgpXG5cdFx0Ly8ge1xuXHRcdC8vIFx0dmVsWCA9IG5lYXJlc3QubGQgLSBvZmZzZXRYO1xuXHRcdC8vIH1cblxuXHRcdC8vIGlmIChheGlzLnggPiAwICYmIG5lYXJlc3QucmQgLSBvZmZzZXRYIDwgdmVsWClcblx0XHQvLyB7XG5cdFx0Ly8gXHR2ZWxYID0gbmVhcmVzdC5yZCAtIG9mZnNldFg7XG5cdFx0Ly8gfVxuXG5cdFx0Ly8gaWYgKGF4aXMueSA8IDAgJiYgbmVhcmVzdC50ZCAtIG9mZnNldFkgPCB2ZWxZKVxuXHRcdC8vIHtcblx0XHQvLyBcdHZlbFkgPSBuZWFyZXN0LnRkIC0gb2Zmc2V0WTtcblx0XHQvLyB9XG5cblx0XHQvLyBpZiAoYXhpcy55ID4gMCAmJiBuZWFyZXN0LmJkIC0gb2Zmc2V0WSA8IHZlbFkpXG5cdFx0Ly8ge1xuXHRcdC8vIFx0dmVsWSA9IG5lYXJlc3QuYmQgLSBvZmZzZXRZO1xuXHRcdC8vIH1cblxuXG5cdFx0dmFyIHByZXZYID0gcGxheWVyUG9zaXRpb24ueDtcblx0XHRwbGF5ZXJQb3NpdGlvbi54ICs9IGF4aXMueCp2ZWxYO1xuXG5cdFx0dmFyIGxpbmVIQSA9IHt4OnBsYXllclBvc2l0aW9uLnggLSAxMDAwLCB5OnBsYXllclBvc2l0aW9uLnl9O1xuXHRcdHZhciBsaW5lSEIgPSB7eDpwbGF5ZXJQb3NpdGlvbi54ICsgMTAwMCwgeTpwbGF5ZXJQb3NpdGlvbi55fTtcblx0XHR2YXIgcmVzdWx0SCA9IHJheWNhc3QobGluZUhBLCBsaW5lSEIsIHZlcnRpY2VzKTtcblx0XHR2YXIgbmVhcmVzdCA9IGdldE5lYXJlc3RGYWNlcyhwbGF5ZXJQb3NpdGlvbiwgcmVzdWx0SCk7XG5cdFx0dmFyIGlzSW5zaWRlID0gcG9pbnRJblBvbHlnb24ocGxheWVyUG9zaXRpb24sIHZlcnRpY2VzKTtcblxuXHRcdGlmIChpc0luc2lkZSlcblx0XHR7XG5cdFx0XHRpZiAobmVhcmVzdC5sKVxuXHRcdFx0e1xuXHRcdFx0XHRpZiAocGxheWVyUG9zaXRpb24ueCA8IG5lYXJlc3QubC5wb2ludC54ICsgb2Zmc2V0WClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHBsYXllclBvc2l0aW9uLnggPSBuZWFyZXN0LmwucG9pbnQueCArIG9mZnNldFg7XG5cdFx0XHRcdFx0cGxheWVyVmVsb2NpdHkueCA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cGxheWVyVmVsb2NpdHkueCA9IHBsYXllclBvc2l0aW9uLnggLSBwcmV2WDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdFx0Ly8gY3R4Lm1vdmVUbyhwbGF5ZXJQb3NpdGlvbi54LCBwbGF5ZXJQb3NpdGlvbi55KTtcblx0XHRcdFx0Ly8gY3R4LmxpbmVUbyhuZWFyZXN0LmwucG9pbnQueCwgcGxheWVyUG9zaXRpb24ueSlcblx0XHRcdFx0Ly8gY3R4LnN0cm9rZVN0eWxlID0gXCIjRkYwMDAwXCI7XG5cdFx0XHRcdC8vIGN0eC5zdHJva2UoKTtcblx0XHRcdH1cblx0XHRcdGlmIChuZWFyZXN0LnIpXG5cdFx0XHR7XG5cdFx0XHRcdGlmIChwbGF5ZXJQb3NpdGlvbi54ID4gbmVhcmVzdC5yLnBvaW50LnggLSBvZmZzZXRYKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cGxheWVyUG9zaXRpb24ueCA9IG5lYXJlc3Quci5wb2ludC54IC0gb2Zmc2V0WDtcblx0XHRcdFx0XHRwbGF5ZXJWZWxvY2l0eS54ID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRwbGF5ZXJWZWxvY2l0eS54ID0gcGxheWVyUG9zaXRpb24ueCAtIHByZXZYO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gY3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0XHQvLyBjdHgubW92ZVRvKHBsYXllclBvc2l0aW9uLngsIHBsYXllclBvc2l0aW9uLnkpO1xuXHRcdFx0XHQvLyBjdHgubGluZVRvKG5lYXJlc3Quci5wb2ludC54LCBwbGF5ZXJQb3NpdGlvbi55KTtcblx0XHRcdFx0Ly8gY3R4LnN0cm9rZVN0eWxlID0gXCIjRkYwMDAwXCI7XG5cdFx0XHRcdC8vIGN0eC5zdHJva2UoKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHBsYXllclBvc2l0aW9uLnggPSBwcmV2WDtcblxuXHRcdH1cblxuXG5cdFx0dmFyIHByZXZZID0gcGxheWVyUG9zaXRpb24ueTtcblxuICAgIC8vIGdyYXZpdHlcblx0XHRwbGF5ZXJQb3NpdGlvbi55ICs9IDI7XG5cblx0XHR2YXIgbGluZVZBID0ge3g6cGxheWVyUG9zaXRpb24ueCwgeTpwbGF5ZXJQb3NpdGlvbi55IC0gMTAwMH07XG5cdFx0dmFyIGxpbmVWQiA9IHt4OnBsYXllclBvc2l0aW9uLngsIHk6cGxheWVyUG9zaXRpb24ueSArIDEwMDB9O1xuXHRcdHZhciByZXN1bHRWID0gcmF5Y2FzdChsaW5lVkEsIGxpbmVWQiwgdmVydGljZXMpO1xuXHRcdHZhciBuZWFyZXN0ID0gZ2V0TmVhcmVzdEZhY2VzKHBsYXllclBvc2l0aW9uLCByZXN1bHRWKTtcblx0XHR2YXIgaXNJbnNpZGUgPSBwb2ludEluUG9seWdvbihwbGF5ZXJQb3NpdGlvbiwgdmVydGljZXMpO1xuXG5cblx0XHRpZiAoaXNJbnNpZGUpXG5cdFx0e1xuXHRcdFx0aWYgKG5lYXJlc3QudClcblx0XHRcdHtcblx0XHRcdFx0aWYgKHBsYXllclBvc2l0aW9uLnkgPCBuZWFyZXN0LnQucG9pbnQueSArIG9mZnNldFkpIHBsYXllclBvc2l0aW9uLnkgPSBuZWFyZXN0LnQucG9pbnQueSArIG9mZnNldFk7XG5cblx0XHRcdFx0Ly8gY3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0XHQvLyBjdHgubW92ZVRvKHBsYXllclBvc2l0aW9uLngsIHBsYXllclBvc2l0aW9uLnkpO1xuXHRcdFx0XHQvLyBjdHgubGluZVRvKHBsYXllclBvc2l0aW9uLngsIG5lYXJlc3QudC5wb2ludC55KTtcblx0XHRcdFx0Ly8gY3R4LnN0cm9rZVN0eWxlID0gXCIjRkYwMDAwXCI7XG5cdFx0XHRcdC8vIGN0eC5zdHJva2UoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKG5lYXJlc3QuYilcblx0XHRcdHtcblx0XHRcdFx0aWYgKHBsYXllclBvc2l0aW9uLnkgPiBuZWFyZXN0LmIucG9pbnQueSAtIG9mZnNldFkpIHBsYXllclBvc2l0aW9uLnkgPSBuZWFyZXN0LmIucG9pbnQueSAtIG9mZnNldFk7XG5cblx0XHRcdFx0Ly8gY3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0XHQvLyBjdHgubW92ZVRvKHBsYXllclBvc2l0aW9uLngsIHBsYXllclBvc2l0aW9uLnkpO1xuXHRcdFx0XHQvLyBjdHgubGluZVRvKHBsYXllclBvc2l0aW9uLngsIG5lYXJlc3QuYi5wb2ludC55KTtcblx0XHRcdFx0Ly8gY3R4LnN0cm9rZVN0eWxlID0gXCIjRkYwMDAwXCI7XG5cdFx0XHRcdC8vIGN0eC5zdHJva2UoKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHBsYXllclBvc2l0aW9uLnkgPSBwcmV2WTtcblx0XHR9XG5cblxuXHRcdHBsYXllclZlbG9jaXR5LnkgPSBwbGF5ZXJQb3NpdGlvbi55IC0gcHJldlk7XG5cblx0XHRpZiAocGxheWVyUG9zaXRpb24ueSA8IDIwKSB7XG5cdFx0XHRwbGF5ZXJQb3NpdGlvbi55ID0gMjA7XG5cdFx0XHRwbGF5ZXJWZWxvY2l0eS55ID0gMDtcblx0XHR9XG5cblx0XHRpZiAocGxheWVyUG9zaXRpb24ueCA8IDIwKSB7XG5cdFx0XHRwbGF5ZXJQb3NpdGlvbi54ID0gMjA7XG5cdFx0XHRwbGF5ZXJWZWxvY2l0eS54ID0gMDtcblx0XHR9IGVsc2UgaWYgKHBsYXllclBvc2l0aW9uLnggPiAoZ2FtZS5yZW5kZXJlci53aWR0aCAtIDIwKSkge1xuXHRcdFx0cGxheWVyUG9zaXRpb24ueCA9IChnYW1lLnJlbmRlcmVyLndpZHRoIC0gMjApO1xuXHRcdFx0cGxheWVyVmVsb2NpdHkueCA9IDA7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gZ2V0TmVhcmVzdEZhY2VzKHBvcywgZmFjZXMpXG5cdHtcblx0XHR2YXIgcmVzdWx0ID0ge2w6bnVsbCwgcjpudWxsLCB0Om51bGwsIGI6bnVsbCwgZGw6MTAwMDAwLCBkcjoxMDAwMDAsIGR0OjEwMDAwMCwgZGI6MTAwMDAwfTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZmFjZXMubGVuZ3RoOyBpKyspXG5cdFx0e1xuXHRcdFx0dmFyIHIgPSBmYWNlc1tpXTtcblxuXHRcdFx0aWYgKHIucG9pbnQub25MaW5lMSAmJiByLnBvaW50Lm9uTGluZTIpXG5cdFx0XHR7XG5cdFx0XHRcdHZhciBkID0gbGluZURpc3RhbmNlKHBvcywgci5wb2ludCk7XG5cblx0XHRcdFx0aWYgKHIucG9pbnQueCA8IHBvcy54KVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aWYgKGQgPCByZXN1bHQuZGwpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0cmVzdWx0LmRsID0gZDtcblx0XHRcdFx0XHRcdHJlc3VsdC5sID0gcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoci5wb2ludC54ID4gcG9zLngpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZiAoZCA8IHJlc3VsdC5kcilcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRyZXN1bHQuZHIgPSBkO1xuXHRcdFx0XHRcdFx0cmVzdWx0LnIgPSByO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChyLnBvaW50LnkgPCBwb3MueSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGlmIChkIDwgcmVzdWx0LmR0KVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHJlc3VsdC5kdCA9IGQ7XG5cdFx0XHRcdFx0XHRyZXN1bHQudCA9IHI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHIucG9pbnQueSA+IHBvcy55KVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aWYgKGQgPCByZXN1bHQuZGIpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0cmVzdWx0LmRiID0gZDtcblx0XHRcdFx0XHRcdHJlc3VsdC5iID0gcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0ZnVuY3Rpb24gcmF5Y2FzdChzdGFydFBvaW50LCBlbmRQb2ludCwgdmVydGljZXMpXG5cdHtcblx0XHR2YXIgbGVuID0gdmVydGljZXMubGVuZ3RoO1xuXHRcdHZhciByZXN1bHQgPSBbXTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspXG5cdFx0e1xuXHRcdFx0dmFyIGEgPSB2ZXJ0aWNlc1tpXTtcblx0XHRcdHZhciBiID0gaSA+PSAobGVuIC0gMSkgPyB2ZXJ0aWNlc1swXSA6IHZlcnRpY2VzW2krMV07XG5cdFx0XHR2YXIgciA9IGNoZWNrTGluZUludGVyc2VjdGlvbihzdGFydFBvaW50LngsIHN0YXJ0UG9pbnQueSwgZW5kUG9pbnQueCwgZW5kUG9pbnQueSwgYS54LCBhLnksIGIueCwgYi55KTtcblx0XHRcdGlmIChyLm9uTGluZTEgJiYgci5vbkxpbmUyKVxuXHRcdFx0e1xuXHRcdFx0XHR2YXIgZmFjZSA9IHthOmEsIGI6YiwgcG9pbnQ6cn07XG5cdFx0XHRcdHJlc3VsdC5wdXNoKGZhY2UpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cblxuXHRmdW5jdGlvbiBsaW5lRGlzdGFuY2UocG9pbnQxLCBwb2ludDIpXG5cdHtcblx0XHR2YXIgeHMgPSAwO1xuXHRcdHZhciB5cyA9IDA7XG5cblx0XHR4cyA9IHBvaW50Mi54IC0gcG9pbnQxLng7XG5cdFx0eHMgPSB4cyAqIHhzO1xuXG5cdFx0eXMgPSBwb2ludDIueSAtIHBvaW50MS55O1xuXHRcdHlzID0geXMgKiB5cztcblxuXHRcdHJldHVybiBNYXRoLnNxcnQoeHMgKyB5cyk7XG5cdH1cbn1cblxuLy9cbmZ1bmN0aW9uIHBvaW50SW5Qb2x5Z29uKHBvaW50LCBwb2x5Z29uKVxue1xuXHR2YXIgcG9pbnRzID0gcG9seWdvbjtcblx0dmFyIGksIGosIG52ZXJ0ID0gcG9seWdvbi5sZW5ndGg7XG5cdHZhciBjID0gZmFsc2U7XG5cblx0Zm9yKGkgPSAwLCBqID0gbnZlcnQgLSAxOyBpIDwgbnZlcnQ7IGogPSBpKyspIHtcblx0XHRpZiggKCAoKHBvaW50c1tpXS55KSA+PSBwb2ludC55ICkgIT0gKHBvaW50c1tqXS55ID49IHBvaW50LnkpICkgJiZcblx0ICAgIFx0KHBvaW50LnggPD0gKHBvaW50c1tqXS54IC0gcG9pbnRzW2ldLngpICogKHBvaW50LnkgLSBwb2ludHNbaV0ueSkgLyAocG9pbnRzW2pdLnkgLSBwb2ludHNbaV0ueSkgKyBwb2ludHNbaV0ueClcblx0ICBcdCkgYyA9ICFjO1xuXHR9XG5cbiAgcmV0dXJuIGM7XG59XG5cbi8vIG1ldGhvZCBmcm9tIGpzZmlkZGxlOiBodHRwOi8vanNmaWRkbGUubmV0L2p1c3Rpbl9jX3JvdW5kcy9HZDJTMi9saWdodC9cbmZ1bmN0aW9uIGNoZWNrTGluZUludGVyc2VjdGlvbihsaW5lMVN0YXJ0WCwgbGluZTFTdGFydFksIGxpbmUxRW5kWCwgbGluZTFFbmRZLCBsaW5lMlN0YXJ0WCwgbGluZTJTdGFydFksIGxpbmUyRW5kWCwgbGluZTJFbmRZKSB7XG4gICAgLy8gaWYgdGhlIGxpbmVzIGludGVyc2VjdCwgdGhlIHJlc3VsdCBjb250YWlucyB0aGUgeCBhbmQgeSBvZiB0aGUgaW50ZXJzZWN0aW9uICh0cmVhdGluZyB0aGUgbGluZXMgYXMgaW5maW5pdGUpIGFuZCBib29sZWFucyBmb3Igd2hldGhlciBsaW5lIHNlZ21lbnQgMSBvciBsaW5lIHNlZ21lbnQgMiBjb250YWluIHRoZSBwb2ludFxuICAgIHZhciBkZW5vbWluYXRvciwgYSwgYiwgbnVtZXJhdG9yMSwgbnVtZXJhdG9yMiwgcmVzdWx0ID0ge1xuICAgICAgICB4OiBudWxsLFxuICAgICAgICB5OiBudWxsLFxuICAgICAgICBvbkxpbmUxOiBmYWxzZSxcbiAgICAgICAgb25MaW5lMjogZmFsc2VcbiAgICB9O1xuICAgIGRlbm9taW5hdG9yID0gKChsaW5lMkVuZFkgLSBsaW5lMlN0YXJ0WSkgKiAobGluZTFFbmRYIC0gbGluZTFTdGFydFgpKSAtICgobGluZTJFbmRYIC0gbGluZTJTdGFydFgpICogKGxpbmUxRW5kWSAtIGxpbmUxU3RhcnRZKSk7XG4gICAgaWYgKGRlbm9taW5hdG9yID09IDApIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgYSA9IGxpbmUxU3RhcnRZIC0gbGluZTJTdGFydFk7XG4gICAgYiA9IGxpbmUxU3RhcnRYIC0gbGluZTJTdGFydFg7XG4gICAgbnVtZXJhdG9yMSA9ICgobGluZTJFbmRYIC0gbGluZTJTdGFydFgpICogYSkgLSAoKGxpbmUyRW5kWSAtIGxpbmUyU3RhcnRZKSAqIGIpO1xuICAgIG51bWVyYXRvcjIgPSAoKGxpbmUxRW5kWCAtIGxpbmUxU3RhcnRYKSAqIGEpIC0gKChsaW5lMUVuZFkgLSBsaW5lMVN0YXJ0WSkgKiBiKTtcbiAgICBhID0gbnVtZXJhdG9yMSAvIGRlbm9taW5hdG9yO1xuICAgIGIgPSBudW1lcmF0b3IyIC8gZGVub21pbmF0b3I7XG5cbiAgICAvLyBpZiB3ZSBjYXN0IHRoZXNlIGxpbmVzIGluZmluaXRlbHkgaW4gYm90aCBkaXJlY3Rpb25zLCB0aGV5IGludGVyc2VjdCBoZXJlOlxuICAgIHJlc3VsdC54ID0gbGluZTFTdGFydFggKyAoYSAqIChsaW5lMUVuZFggLSBsaW5lMVN0YXJ0WCkpO1xuICAgIHJlc3VsdC55ID0gbGluZTFTdGFydFkgKyAoYSAqIChsaW5lMUVuZFkgLSBsaW5lMVN0YXJ0WSkpO1xuLypcbiAgICAgICAgLy8gaXQgaXMgd29ydGggbm90aW5nIHRoYXQgdGhpcyBzaG91bGQgYmUgdGhlIHNhbWUgYXM6XG4gICAgICAgIHggPSBsaW5lMlN0YXJ0WCArIChiICogKGxpbmUyRW5kWCAtIGxpbmUyU3RhcnRYKSk7XG4gICAgICAgIHkgPSBsaW5lMlN0YXJ0WCArIChiICogKGxpbmUyRW5kWSAtIGxpbmUyU3RhcnRZKSk7XG4gICAgICAgICovXG4gICAgLy8gaWYgbGluZTEgaXMgYSBzZWdtZW50IGFuZCBsaW5lMiBpcyBpbmZpbml0ZSwgdGhleSBpbnRlcnNlY3QgaWY6XG4gICAgaWYgKGEgPiAwICYmIGEgPCAxKSB7XG4gICAgICAgIHJlc3VsdC5vbkxpbmUxID0gdHJ1ZTtcbiAgICB9XG4gICAgLy8gaWYgbGluZTIgaXMgYSBzZWdtZW50IGFuZCBsaW5lMSBpcyBpbmZpbml0ZSwgdGhleSBpbnRlcnNlY3QgaWY6XG4gICAgaWYgKGIgPiAwICYmIGIgPCAxKSB7XG4gICAgICAgIHJlc3VsdC5vbkxpbmUyID0gdHJ1ZTtcbiAgICB9XG4gICAgLy8gaWYgbGluZTEgYW5kIGxpbmUyIGFyZSBzZWdtZW50cywgdGhleSBpbnRlcnNlY3QgaWYgYm90aCBvZiB0aGUgYWJvdmUgYXJlIHRydWVcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbiIsInZhciBUb29scyA9IHJlcXVpcmUoJy4vVG9vbHMuanMnKTtcbnZhciBQYXJ0aWNsZVN5c3RlbSA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9QYXJ0aWNsZVN5c3RlbS5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIFBsYXllcihjb250YWluZXIsIHhQb3MsIHlQb3MpIHtcblx0dmFyIHNlbGYgPSB0aGlzO1xuXHR2YXIgdmVsb2NpdHkgPSAwO1xuXHR2YXIgYWNjZWxlcmF0aW9uID0gMC4yNTtcblx0dmFyIG1heHNwZWVkID0gMi4wO1xuXHR2YXIgZGlyID0gMTtcblx0dmFyIG1vdmllID0gbnVsbDtcblx0dmFyIGRlYWQgPSBmYWxzZTtcblxuXHRtb3ZpZSA9IG5ldyBQSVhJLk1vdmllQ2xpcChUb29scy5nZXRUZXh0dXJlcyhcImJveVwiLCA3LCBcIi5wbmdcIikpO1xuXHRtb3ZpZS5waXZvdCA9IG5ldyBQSVhJLlBvaW50KG1vdmllLndpZHRoLzIsIG1vdmllLmhlaWdodC8yKTtcblx0bW92aWUuYW5pbWF0aW9uU3BlZWQgPSAwLjI7XG5cblx0dGhpcy52aWV3ID0gbmV3IFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lcigpO1xuXHR0aGlzLnZpZXcuYWRkQ2hpbGQobW92aWUpO1xuXHR0aGlzLnZpZXcucG9zaXRpb24ueCA9IHhQb3M7XG5cdHRoaXMudmlldy5wb3NpdGlvbi55ID0geVBvcztcblxuXHR2YXIgZmFkaW5nID0gZmFsc2U7XG5cblx0bW92aWUucGxheSgpO1xuXG5cdHZhciBwYXJ0aWNsZXMgPSBuZXcgUGFydGljbGVTeXN0ZW0oXG5cdCAge1xuXHQgICAgICBcImltYWdlc1wiOltcInBpeGVsU2hpbmUucG5nXCJdLFxuXHQgICAgICBcIm51bVBhcnRpY2xlc1wiOjEwMCxcblx0ICAgICAgXCJlbWlzc2lvbnNQZXJVcGRhdGVcIjowLFxuXHQgICAgICBcImVtaXNzaW9uc0ludGVydmFsXCI6MCxcblx0ICAgICAgXCJhbHBoYVwiOjEsXG5cdCAgICAgIFwicHJvcGVydGllc1wiOlxuXHQgICAgICB7XG5cdCAgICAgICAgXCJyYW5kb21TcGF3blhcIjoxMCxcblx0ICAgICAgICBcInJhbmRvbVNwYXduWVwiOjEwLFxuXHQgICAgICAgIFwibGlmZVwiOjMwLFxuXHQgICAgICAgIFwicmFuZG9tTGlmZVwiOjEwMCxcblx0ICAgICAgICBcImZvcmNlWFwiOjAsXG5cdCAgICAgICAgXCJmb3JjZVlcIjowLFxuXHQgICAgICAgIFwicmFuZG9tRm9yY2VYXCI6MC4xLFxuXHQgICAgICAgIFwicmFuZG9tRm9yY2VZXCI6MC4xLFxuXHQgICAgICAgIFwidmVsb2NpdHlYXCI6Myxcblx0ICAgICAgICBcInZlbG9jaXR5WVwiOjAsXG5cdCAgICAgICAgXCJyYW5kb21WZWxvY2l0eVhcIjoyLFxuXHQgICAgICAgIFwicmFuZG9tVmVsb2NpdHlZXCI6Mixcblx0ICAgICAgICBcInNjYWxlXCI6NSxcblx0ICAgICAgICBcImdyb3d0aFwiOjAuMDEsXG5cdCAgICAgICAgXCJyYW5kb21TY2FsZVwiOjQuNSxcblx0ICAgICAgICBcImFscGhhU3RhcnRcIjowLFxuXHQgICAgICAgIFwiYWxwaGFGaW5pc2hcIjowLFxuXHQgICAgICAgIFwiYWxwaGFSYXRpb1wiOjAuMixcblx0ICAgICAgICBcInRvcnF1ZVwiOjAsXG5cdCAgICAgICAgXCJyYW5kb21Ub3JxdWVcIjowXG5cdCAgICAgIH1cblx0ICB9KTtcblx0ICBwYXJ0aWNsZXMudmlldy5hbHBoYSA9IDAuNTtcblxuXHQgIGNvbnRhaW5lci5hZGRDaGlsZChwYXJ0aWNsZXMudmlldyk7XG5cdCAgY29udGFpbmVyLmFkZENoaWxkKHRoaXMudmlldyk7XG5cblx0dGhpcy51cGRhdGUgPSBmdW5jdGlvbihnYW1lLCBwb3NpdGlvbiwgdmVsb2NpdHkpXG5cdHtcblx0XHRzZWxmLnZpZXcucG9zaXRpb24ueCA9IHBvc2l0aW9uLng7XG5cdFx0c2VsZi52aWV3LnBvc2l0aW9uLnkgPSBwb3NpdGlvbi55IC0gMTA7XG5cblx0XHRpZiAodmVsb2NpdHkueCA+IC0wLjAxICYmIHZlbG9jaXR5LnggPCAwLjAxKSB2ZWxvY2l0eS54ID0gMDtcblxuXHRcdGlmICh2ZWxvY2l0eS54IDwgMCkgbW92aWUuc2NhbGUueCA9IC0xO1xuXHRcdGlmICh2ZWxvY2l0eS54ID4gMCkgbW92aWUuc2NhbGUueCA9IDE7XG5cblx0XHRtb3ZpZS5yb3RhdGlvbiA9IHZlbG9jaXR5LngqMC4xO1xuXG5cdFx0cGFydGljbGVzLnByb3BlcnRpZXMuY2VudGVyWCA9IHNlbGYudmlldy5wb3NpdGlvbi54ICsgMTA7XG5cdFx0cGFydGljbGVzLnByb3BlcnRpZXMuY2VudGVyWSA9IHNlbGYudmlldy5wb3NpdGlvbi55O1xuXHRcdHBhcnRpY2xlcy51cGRhdGUoKTtcblxuXHRcdGlmIChmYWRpbmcgJiYgc2VsZi52aWV3LmFscGhhID4gMC4wMikgc2VsZi52aWV3LmFscGhhIC09IDAuMDI7XG5cdH1cblxuXHR0aGlzLm1vdmVMZWZ0ID0gZnVuY3Rpb24oKVxuXHR7XG5cdH1cblxuXHR0aGlzLm1vdmVSaWdodCA9IGZ1bmN0aW9uKClcblx0e1xuXHR9XG5cblx0dGhpcy5mYWRlT3V0ID0gZnVuY3Rpb24oKVxuXHR7XG5cdFx0cGFydGljbGVzLmVtaXQoMTAwKTtcblx0XHRzZWxmLnZpZXcuYWxwaGEgPSAwLjU7XG5cdFx0ZmFkaW5nID0gdHJ1ZTtcblx0fVxuXG5cdHRoaXMuZG9Db2xsaWRlID0gZnVuY3Rpb24oeHBvcyx5cG9zLHdpZHRoLGhlaWdodClcblx0e1xuXHRcdC8vY29uc29sZS5sb2coXCJjb2xsaWRlOiBcIiArIHNlbGYudmlldy5wb3NpdGlvbi54ID49IHhwb3MgKyBcIiBcIiArIHNlbGYudmlldy5wb3NpdGlvbi54IDwgKHhwb3MgKyB3aWR0aCkgKyBcIiBcIiArIHNlbGYudmlldy5wb3NpdGlvbi55IC0geXBvcyA8IDEwMClcblx0XHRpZihzZWxmLnZpZXcucG9zaXRpb24ueCA+PSB4cG9zICYmIHNlbGYudmlldy5wb3NpdGlvbi54IDwgKHhwb3MgKyB3aWR0aCkgJiYgTWF0aC5hYnMoc2VsZi52aWV3LnBvc2l0aW9uLnkgLSB5cG9zKSA8IDUwKVxuXHRcdFx0cmV0dXJuIHRydWU7XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxufVxuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIFByZWxvYWRlcihnYW1lKSB7XG5cbiAgdmFyIGNvbnRlbnQsXG4gICAgc2VsZiA9IHRoaXMsXG4gICAgYmc7XG5cbiAgc2VsZi50ZXh0O1xuXG4gIHRoaXMucHJvZ3Jlc3MgPSBmdW5jdGlvbihsb2FkZWRJdGVtcywgdG90YWxJdGVtcykge1xuICAgIHZhciBwZXJjZW50ID0gTWF0aC5yb3VuZChsb2FkZWRJdGVtcyAqIDEwMCAvIHRvdGFsSXRlbXMpO1xuICAgIGlmIChsb2FkZWRJdGVtcyA+IDApIHtcbiAgICAgIGlmIChsb2FkZWRJdGVtcyA9PSAxKSB7XG4gICAgICAgIHNlbGYuaW5pdCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mKGVqZWN0YSk9PT1cInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHNlbGYudGV4dC5zZXRUZXh0KCdDQVJSRUdBTkRPICcgKyBwZXJjZW50ICsgJyUnKTtcbiAgICAgICAgc2VsZi50ZXh0LnBvc2l0aW9uLnggPSAoZ2FtZS5yZW5kZXJlci53aWR0aCAvIDIpIC0gKHNlbGYudGV4dC53aWR0aCAvIDIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnRlbnQgPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG4gICAgZ2FtZS5zdGFnZS5hZGRDaGlsZChjb250ZW50KTtcblxuICAgIGJnID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcbiAgICBiZy5iZWdpbkZpbGwoMHgwMDAwMDApO1xuICAgIGJnLmRyYXdSZWN0KDAsIDAsIHNjcmVlbldpZHRoLCBzY3JlZW5IZWlnaHQpO1xuICAgIGJnLmVuZEZpbGwoKTtcblxuICAgIGNvbnRlbnQuYWRkQ2hpbGQoYmcpO1xuXG4gICAgaWYgKHR5cGVvZihlamVjdGEpPT09XCJ1bmRlZmluZWRcIikge1xuICAgICAgc2VsZi50ZXh0ID0gbmV3IFBJWEkuVGV4dCgnQ0FSUkVHQU5ETyAwJScsIHtcbiAgICAgICAgZm9udDogJzE4cHggUm9ra2l0dCcsXG4gICAgICAgIGZpbGw6ICcjNjY2NjY2JyxcbiAgICAgICAgYWxpZ246ICdjZW50ZXInXG4gICAgICB9KTtcbiAgICAgIHNlbGYudGV4dC5wb3NpdGlvbi54ID0gKGdhbWUucmVuZGVyZXIud2lkdGggLyAyKSAtIChzZWxmLnRleHQud2lkdGggLyAyKTtcbiAgICAgIHNlbGYudGV4dC5wb3NpdGlvbi55ID0gZ2FtZS5yZW5kZXJlci5oZWlnaHQgLyAyO1xuICAgICAgY29udGVudC5hZGRDaGlsZChzZWxmLnRleHQpO1xuICAgIH1cblxuICB9XG5cbiAgdGhpcy5oaWRlID0gZnVuY3Rpb24oKSB7XG4gICAgY29udGVudC52aXNpYmxlID0gZmFsc2U7XG4gIH1cblxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gUmVzb3VyY2VzKCkge1xuXG4gIEhvd2xlci5pT1NBdXRvRW5hYmxlID0gZmFsc2U7XG4gIC8vIEhvd2xlci5tdXRlKCk7XG5cbiAgLy8gaW1hZ2VzXG4gIHRoaXMuYmFja2dyb3VuZCA9ICdpbWcvYmctZGVmYXVsdC5qcGcnO1xuICB0aGlzLmJ0blBsYXkgPSdpbWcvYnRuLXBsYXkucG5nJztcbiAgdGhpcy5idG5OZXh0ID0naW1nL2J0bi1uZXh0LnBuZyc7XG4gIHRoaXMuYnRuUmVzdGFydCA9J2ltZy9idG4tcmVzdGFydC5wbmcnO1xuICB0aGlzLnRleHRMZXZlbEVuZCA9J2ltZy90ZXh0LWxldmVsLWVuZC5wbmcnO1xuICB0aGlzLnRleHRHYW1lT3ZlciA9J2ltZy90ZXh0LWdhbWUtb3Zlci5wbmcnO1xuXG4gIC8vIHNwcml0ZXNcbiAgdGhpcy50ZXh0R2FtZU92ZXIgPSdpbWcvc3ByaXRlcy9wbGF5ZXIuanNvbic7XG4gIHRoaXMudGV4dHVyZXMgPSdpbWcvdGV4dHVyZXMuanNvbic7XG5cbiAgLy8gc291bmRzXG4gIHRoaXMuc291bmRzID0gW1xuICAgIHtcbiAgICAgIC8vIGdhbWUucmVzb3VyY2VzLnNvdW5kTG9vcC5wbGF5KCk7XG4gICAgICBuYW1lOiAnc291bmRMb29wJyxcbiAgICAgIHVybHM6IFsnc291bmRzL3NvdW5kTG9vcC5tcDMnXSxcbiAgICAgIGF1dG9QbGF5OiBmYWxzZSxcbiAgICAgIGxvb3A6IHRydWUsXG4gICAgICB2b2x1bWU6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgIC8vIGdhbWUucmVzb3VyY2VzLmJ1dHRvbkNsaWNrLnBsYXkoKTtcbiAgICAgIG5hbWU6ICdidXR0b25DbGljaycsXG4gICAgICB1cmxzOiBbJ3NvdW5kcy9idXR0b25DbGljazIubXAzJ10sXG4gICAgICB2b2x1bWU6IC4zXG4gICAgfSxcbiAgICB7XG4gICAgICAvLyBnYW1lLnJlc291cmNlcy5wb3J0YWxTb3VuZC5wbGF5KCk7XG4gICAgICBuYW1lOiAncG9ydGFsU291bmQnLFxuICAgICAgdXJsczogWydzb3VuZHMvcG9ydGFsLm1wMyddLFxuICAgICAgdm9sdW1lOiAuNVxuICAgIH0sXG4gICAge1xuICAgICAgLy8gZ2FtZS5yZXNvdXJjZXMuZm9yZXN0U291bmQucGxheSgpO1xuICAgICAgbmFtZTogJ2ZvcmVzdFNvdW5kJyxcbiAgICAgIHVybHM6IFsnc291bmRzL2ZvcmVzdC1uaWdodDIubXAzJ10sXG4gICAgICB2b2x1bWU6IC43LFxuICAgICAgbG9vcDogdHJ1ZVxuICAgIH0sXG4gICAge1xuICAgICAgLy8gZ2FtZS5yZXNvdXJjZXMubW90aGVyU291bmQucGxheSgpO1xuICAgICAgbmFtZTogJ21vdGhlclNvdW5kJyxcbiAgICAgIHVybHM6IFsnc291bmRzL2JsaW1ibGltLm1wMyddLFxuICAgICAgdm9sdW1lOiAuM1xuICAgIH0sXG4gICAge1xuICAgICAgLy8gZ2FtZS5yZXNvdXJjZXMuc3dpY2hlclNvdW5kLnBsYXkoKTtcbiAgICAgIG5hbWU6ICdzd2ljaGVyU291bmQnLFxuICAgICAgdXJsczogWydzb3VuZHMvc3dpY2hlcjIubXAzJ10sXG4gICAgICB2b2x1bWU6IC4zXG4gICAgfSxcbiAgICB7XG4gICAgICAvLyBnYW1lLnJlc291cmNlcy5jYXJDcmFzaC5wbGF5KCk7XG4gICAgICBuYW1lOiAnY2FyQ3Jhc2gnLFxuICAgICAgdXJsczogWydzb3VuZHMvY2FyQ3Jhc2gubXAzJ11cbiAgICB9LFxuICAgIHtcbiAgICAgIC8vIGdhbWUucmVzb3VyY2VzLmNhclBhc3MucGxheSgpO1xuICAgICAgbmFtZTogJ2NhclBhc3MnLFxuICAgICAgdXJsczogWydzb3VuZHMvY2FyUGFzczIubXAzJ10sXG4gICAgICB2b2x1bWU6IC4xNVxuICAgIH0sXG4gICAge1xuICAgICAgLy8gZ2FtZS5yZXNvdXJjZXMuc3Rvcm0ucGxheSgpO1xuICAgICAgbmFtZTogJ3N0b3JtJyxcbiAgICAgIHVybHM6IFsnc291bmRzL3N0b3JtMi5tcDMnXSxcbiAgICAgIHZvbHVtZTogMVxuICAgIH1cbiAgXTtcblxuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdGhpcy5nZXRQSVhJRmlsZXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaSxcbiAgICAgIHVybCxcbiAgICAgIHVybFRvSWYsXG4gICAgICBhcnIgPSBbXTtcbiAgICBmb3IgKGkgaW4gc2VsZikge1xuICAgICAgdXJsID0gc2VsZltpXTtcbiAgICAgIGlmICh0eXBlb2YgdXJsID09PSAnc3RyaW5nJykge1xuICAgICAgICB1cmxUb0lmID0gdXJsLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmICh1cmxUb0lmLmxhc3RJbmRleE9mKCcuanBnJykgPiAwXG4gICAgICAgICAgfHwgdXJsVG9JZi5sYXN0SW5kZXhPZignLmpwZWcnKSA+IDBcbiAgICAgICAgICB8fCB1cmxUb0lmLmxhc3RJbmRleE9mKCcucG5nJykgPiAwXG4gICAgICAgICAgfHwgdXJsVG9JZi5sYXN0SW5kZXhPZignLmdpZicpID4gMFxuICAgICAgICAgIHx8IHVybFRvSWYubGFzdEluZGV4T2YoJy5qc29uJykgPiAwXG4gICAgICAgICAgfHwgdXJsVG9JZi5sYXN0SW5kZXhPZignLmF0bGFzJykgPiAwXG4gICAgICAgICAgfHwgdXJsVG9JZi5sYXN0SW5kZXhPZignLmFuaW0nKSA+IDBcbiAgICAgICAgICB8fCB1cmxUb0lmLmxhc3RJbmRleE9mKCcueG1sJykgPiAwXG4gICAgICAgICAgfHwgdXJsVG9JZi5sYXN0SW5kZXhPZignLmZudCcpID4gMCkge1xuICAgICAgICAgIGFyci5wdXNoKHNlbGZbaV0pOyAgXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuXG59O1xuIiwiXG5cbm1vZHVsZS5leHBvcnRzID0gXG57XG5cdGdldFRleHR1cmVzOiAgZnVuY3Rpb24ocHJlZml4LCBudW1GcmFtZXMsIHN1Zml4KVxuXHR7XG5cdFx0aWYgKHN1Zml4ID09IG51bGwpIHN1Zml4ID0gXCJcIjtcblx0XHR2YXIgdGV4dHVyZXMgPSBbXTtcblx0XHR2YXIgaSA9IG51bUZyYW1lcztcblx0XHR3aGlsZSAoaSA+IDApIFxuXHRcdHtcblx0XHRcdHZhciBpZCA9IHRoaXMuaW50VG9TdHJpbmcoaSwgMik7XG5cdFx0XHR2YXIgdGV4dHVyZSA9IFBJWEkuVGV4dHVyZS5mcm9tRnJhbWUocHJlZml4K2lkK3N1Zml4KTtcblx0XHRcdHRleHR1cmVzLnB1c2godGV4dHVyZSk7XG5cdFx0XHRpLS07XG5cdFx0fVxuXG5cdFx0dGV4dHVyZXMucmV2ZXJzZSgpO1xuXHQgICAgcmV0dXJuIHRleHR1cmVzO1xuXHR9LFxuXG5cdGludFRvU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSwgbGVuZ3RoKVxuXHR7XG5cdFx0dmFyIHN0ciA9IHZhbHVlLnRvU3RyaW5nKCk7XG5cdFx0dmFyIHN0cmxlbiA9IHN0ci5sZW5ndGg7XG5cdFx0dmFyIGkgPSBsZW5ndGggLSBzdHJsZW47XG5cdFx0d2hpbGUgKGktLSkgc3RyID0gXCIwXCIgKyBzdHI7IFxuXHRcdHJldHVybiBzdHI7XG5cdH0sXG5cblx0Y2xhbXA6IGZ1bmN0aW9uKHZhbHVlLCBtaW4sIG1heClcblx0e1xuXHRcdGlmICh2YWx1ZSA8IG1pbikgcmV0dXJuIG1pbjtcblx0XHRpZiAodmFsdWUgPiBtYXgpIHJldHVybiBtYXg7XG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9XG59IiwidmFyIFR3ZWVuYWJsZSA9IHJlcXVpcmUoJy4uL3ZlbmRvci9zaGlmdHknKSxcbiAgICBHYW1lID0gcmVxdWlyZSgnLi4vZ2FtZScpLFxuICAgIFBhcnRpY2xlU3lzdGVtID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9QYXJ0aWNsZVN5c3RlbS5qcycpLFxuICAgIFR3ZWVuYWJsZSA9IHJlcXVpcmUoJy4uL3ZlbmRvci9zaGlmdHknKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBFbmRCZWhhdmlvcihjb250YWluZXIsIGRhdGEpIHtcblx0dmFyIHNlbGYgPSB0aGlzLFxuICAgICAgaXRlbURhdGEgPSBkYXRhLFxuICAgICAgdHJpZ2dlcmVkID0gZmFsc2U7XG5cbiAgLy8vLy9yZXRyaXZlIHBvc2l0aW9uIGFuZCBzaXplIHNwZWNzXG4gIHZhciBzaXplID0gZGF0YS53aWR0aDtcbiAgdmFyIG9yaWdpblggPSBkYXRhLng7XG4gIHZhciBvcmlnaW5ZID0gZGF0YS55O1xuXG4gIC8vLy8vcmV0cml2ZSBwb3NpdGlvbiBhbmQgc2l6ZSBzcGVjc1xuICB2YXIgc2l6ZSA9IGRhdGEud2lkdGg7XG4gIHZhciBvcmlnaW5YID0gZGF0YS54O1xuICB2YXIgb3JpZ2luWSA9IGRhdGEueTtcblxuICAvLy8vL2NyZWF0ZSB2aXN1YWxcbiAgdGhpcy52aWV3ID0gbmV3IFBJWEkuRGlzcGxheU9iamVjdENvbnRhaW5lcigpO1xuICB0aGlzLnZpZXcucG9zaXRpb24ueCA9IG9yaWdpblg7XG4gIHRoaXMudmlldy5wb3NpdGlvbi55ID0gb3JpZ2luWSAtIDI3O1xuXG4gIHZhciBwYXJ0aWNsZXMgPSBudWxsO1xuICB2YXIgcG9ydGFsT2ZmU3ByaXRlID0gbmV3IFBJWEkuU3ByaXRlKFBJWEkuVGV4dHVyZS5mcm9tSW1hZ2UoXCJQb3J0YWxPZmYucG5nXCIpKTtcbiAgdmFyIHBvcnRhbE9uU3ByaXRlID0gbmV3IFBJWEkuU3ByaXRlKFBJWEkuVGV4dHVyZS5mcm9tSW1hZ2UoXCJwb3J0YWwucG5nXCIpKTtcbiAgcG9ydGFsT25TcHJpdGUuYWxwaGEgPSAwO1xuXG4gIHRoaXMudmlldy5hZGRDaGlsZChwb3J0YWxPZmZTcHJpdGUpO1xuICBjb250YWluZXIuYWRkQ2hpbGQodGhpcy52aWV3KTtcblxuICB2YXIgZmFkZU91dFNoYXBlID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcbiAgZmFkZU91dFNoYXBlLmFscGhhID0gMDtcblxuICB2YXIgaGFsbyA9IFBJWEkuU3ByaXRlLmZyb21GcmFtZShcImhhbG8ucG5nXCIpO1xuICBoYWxvLmFuY2hvci54ID0gMC41O1xuICBoYWxvLmFuY2hvci55ID0gMC41O1xuICBoYWxvLnNjYWxlLnggPSA1O1xuICBoYWxvLnNjYWxlLnkgPSA1O1xuICBoYWxvLnBvc2l0aW9uLnggPSAzMztcbiAgaGFsby5wb3NpdGlvbi55ID0gMzM7XG4gIGhhbG8uYWxwaGEgPSAwLjI7XG4gIHRoaXMudmlldy5hZGRDaGlsZChoYWxvKTtcbiAgaGFsby52aXNpYmxlID0gZmFsc2U7XG5cbiAgZW1pdHRlci5vbignc3dpdGNoLnByZXNzZWQnLCBmdW5jdGlvbigpIHtcblxuICAgIGlmKGdhbWUubGV2ZWwubnVtU3dpdGNoZXMgPT0gMCkge1xuXG4gICAgICBwYXJ0aWNsZXMgPSBuZXcgUGFydGljbGVTeXN0ZW0oe1xuICAgICAgICBcImltYWdlc1wiOltcIlBvcnRhbFNwYXJrLnBuZ1wiXSxcbiAgICAgICAgXCJudW1QYXJ0aWNsZXNcIjo1MCxcbiAgICAgICAgXCJlbWlzc2lvbnNQZXJVcGRhdGVcIjoxLFxuICAgICAgICBcImVtaXNzaW9uc0ludGVydmFsXCI6MixcbiAgICAgICAgXCJhbHBoYVwiOjEsXG4gICAgICAgIFwicHJvcGVydGllc1wiOiB7XG4gICAgICAgICAgXCJyYW5kb21TcGF3blhcIjoxLFxuICAgICAgICAgIFwicmFuZG9tU3Bhd25ZXCI6MzAsXG4gICAgICAgICAgXCJsaWZlXCI6MzAsXG4gICAgICAgICAgXCJyYW5kb21MaWZlXCI6MTAwLFxuICAgICAgICAgIFwiZm9yY2VYXCI6MCxcbiAgICAgICAgICBcImZvcmNlWVwiOjAuMDEsXG4gICAgICAgICAgXCJyYW5kb21Gb3JjZVhcIjowLjAwNyxcbiAgICAgICAgICBcInJhbmRvbUZvcmNlWVwiOjAuMDEsXG4gICAgICAgICAgXCJ2ZWxvY2l0eVhcIjotMSxcbiAgICAgICAgICBcInZlbG9jaXR5WVwiOjAsXG4gICAgICAgICAgXCJyYW5kb21WZWxvY2l0eVhcIjowLjIsXG4gICAgICAgICAgXCJyYW5kb21WZWxvY2l0eVlcIjowLjIsXG4gICAgICAgICAgXCJzY2FsZVwiOjAuMjUsXG4gICAgICAgICAgXCJncm93dGhcIjowLjAwMSxcbiAgICAgICAgICBcInJhbmRvbVNjYWxlXCI6MC4wNCxcbiAgICAgICAgICBcImFscGhhU3RhcnRcIjowLFxuICAgICAgICAgIFwiYWxwaGFGaW5pc2hcIjowLFxuICAgICAgICAgIFwiYWxwaGFSYXRpb1wiOjAuMixcbiAgICAgICAgICBcInRvcnF1ZVwiOjAsXG4gICAgICAgICAgXCJyYW5kb21Ub3JxdWVcIjowXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBoYWxvLnZpc2libGUgPSB0cnVlO1xuICAgICAgaGFsby5hbHBoYSA9IDA7XG5cbiAgICAgIHBhcnRpY2xlcy52aWV3LmFscGhhID0gMC4yNTtcbiAgICAgIHBhcnRpY2xlcy5wcm9wZXJ0aWVzLmNlbnRlclggPSAxODtcbiAgICAgIHBhcnRpY2xlcy5wcm9wZXJ0aWVzLmNlbnRlclkgPSAzMztcblxuICAgICAgc2VsZi52aWV3LmFkZENoaWxkKHBhcnRpY2xlcy52aWV3KTtcblxuICAgICAgLy8gRmFkZSBwb3J0YWxcbiAgICAgIHZhciBpbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAocG9ydGFsT25TcHJpdGUuYWxwaGEgPj0gMSkge1xuICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBvcnRhbE9uU3ByaXRlLmFscGhhICs9IDAuMDI7XG4gICAgICAgIH1cbiAgICAgIH0sIDEpXG5cbiAgICAgIHNlbGYudmlldy5hZGRDaGlsZChwb3J0YWxPblNwcml0ZSk7XG4gICAgfVxuXG4gIH0pO1xuXG5cdHRoaXMudHJpZ2dlciA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghdHJpZ2dlcmVkKSB7XG4gICAgICBmYWRlT3V0U2hhcGUuYmVnaW5GaWxsKDB4MDAwKTtcbiAgICAgIGZhZGVPdXRTaGFwZS5kcmF3UmVjdCgwLCAwLCBnYW1lLnJlbmRlcmVyLndpZHRoLCBnYW1lLnJlbmRlcmVyLmhlaWdodCk7XG4gICAgICBnYW1lLnN0YWdlLmFkZENoaWxkKGZhZGVPdXRTaGFwZSk7XG4gICAgICBnYW1lLnBsYXllci5mYWRlT3V0KCk7XG4gICAgICBnYW1lLnJlc291cmNlcy5wb3J0YWxTb3VuZC5wbGF5KCk7XG4gICAgICBnYW1lLnJlc291cmNlcy5mb3Jlc3RTb3VuZC5zdG9wKCk7XG4gICAgfVxuICAgIHRyaWdnZXJlZCA9IHRydWU7XG4gIH1cblxuXHR0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKGdhbWUpXG5cdHtcbiAgICBpZiAocGFydGljbGVzKSB7XG4gICAgICBwYXJ0aWNsZXMudXBkYXRlKCk7XG4gICAgfVxuXG4gICAgaWYgKGhhbG8udmlzaWJsZSlcbiAgICB7XG4gICAgICBoYWxvLmFscGhhICs9IDAuMDE7XG4gICAgICBpZiAoaGFsby5hbHBoYSA+IDAuMikgaGFsby5hbHBoYSA9IDAuMjtcbiAgICB9XG5cbiAgICBpZiAodHJpZ2dlcmVkKSB7XG5cbiAgICAgIGZhZGVPdXRTaGFwZS5hbHBoYSArPSAwLjAxO1xuICAgICAgaWYgKGZhZGVPdXRTaGFwZS5hbHBoYSA+PSAxKSB7XG4gICAgICAgIGdhbWUubGV2ZWwuZGlzcG9zZSgpO1xuICAgICAgICBnYW1lLm5leHRMZXZlbCgpO1xuICAgICAgICBnYW1lLnN0YWdlLnJlbW92ZUNoaWxkKGZhZGVPdXRTaGFwZSk7XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy9jb25zb2xlLmxvZyhnYW1lLnBsYXllci5kb0NvbGxpZGUoaXRlbURhdGEueCxpdGVtRGF0YS55LCBpdGVtRGF0YS53aWR0aCxpdGVtRGF0YS5oZWlnaHQpLGdhbWUuaW5wdXQuS2V5LmlzRG93bigzOCkpO1xuICAgICAgaWYoZ2FtZS5wbGF5ZXIuZG9Db2xsaWRlKGl0ZW1EYXRhLngsaXRlbURhdGEueSwgaXRlbURhdGEud2lkdGgsaXRlbURhdGEuaGVpZ2h0KSlcbiAgICAgICAge1xuICAgICAgICAgIGlmKGdhbWUubGV2ZWwubnVtU3dpdGNoZXMgPT0gMCkge1xuICAgICAgICAgICAgc2VsZi50cmlnZ2VyKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJ2YXIgVHdlZW5hYmxlID0gcmVxdWlyZSgnLi4vdmVuZG9yL3NoaWZ0eScpLFxuICAgIEdhbWUgPSByZXF1aXJlKCcuLi9nYW1lJyksXG4gICAgUGFydGljbGVTeXN0ZW0gPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL1BhcnRpY2xlU3lzdGVtLmpzJyksXG4gICAgVHdlZW5hYmxlID0gcmVxdWlyZSgnLi4vdmVuZG9yL3NoaWZ0eScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIEVuZENhckJlaGF2aW9yKGNvbnRhaW5lciwgZGF0YSkge1xuXHR2YXIgc2VsZiA9IHRoaXMsXG4gICAgICBpdGVtRGF0YSA9IGRhdGEsXG4gICAgICB0cmlnZ2VyZWQgPSBmYWxzZTtcblxuICAvLy8vL3JldHJpdmUgcG9zaXRpb24gYW5kIHNpemUgc3BlY3NcbiAgdmFyIHNpemUgPSBkYXRhLndpZHRoO1xuICB2YXIgb3JpZ2luWCA9IGRhdGEueDtcbiAgdmFyIG9yaWdpblkgPSBkYXRhLnk7XG5cbiAgLy8vLy9yZXRyaXZlIHBvc2l0aW9uIGFuZCBzaXplIHNwZWNzXG4gIHZhciBzaXplID0gZGF0YS53aWR0aDtcbiAgdmFyIG9yaWdpblggPSBkYXRhLng7XG4gIHZhciBvcmlnaW5ZID0gZGF0YS55O1xuXG4gIC8vLy8vY3JlYXRlIHZpc3VhbFxuICB0aGlzLnZpZXcgPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG4gIHRoaXMudmlldy5wb3NpdGlvbi54ID0gb3JpZ2luWDtcbiAgdGhpcy52aWV3LnBvc2l0aW9uLnkgPSBvcmlnaW5ZIC0gMjc7XG5cbiAgdmFyIHBhcnRpY2xlcyA9IG51bGw7XG4gIHZhciBjYXJTcHJpdGUgPSBuZXcgUElYSS5TcHJpdGUoUElYSS5UZXh0dXJlLmZyb21JbWFnZShcIkNhckNyYXNoLnBuZ1wiKSk7XG4gIGNhclNwcml0ZS55ID0gMTM7XG4gIHRoaXMudmlldy5hZGRDaGlsZChjYXJTcHJpdGUpO1xuICBjb250YWluZXIuYWRkQ2hpbGQodGhpcy52aWV3KTtcblxuICB2YXIgZmFkZU91dFNoYXBlID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcbiAgZmFkZU91dFNoYXBlLmFscGhhID0gMDtcblxuICBlbWl0dGVyLm9uKCdzd2l0Y2gucHJlc3NlZCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgaWYoZ2FtZS5sZXZlbC5udW1Td2l0Y2hlcyA9PSAwKSB7XG5cbiAgICAgIHBhcnRpY2xlcyA9IG5ldyBQYXJ0aWNsZVN5c3RlbSh7XG4gICAgICAgIFwiaW1hZ2VzXCI6W1wibW90aGVyU2hpbmUucG5nXCJdLFxuICAgICAgICBcIm51bVBhcnRpY2xlc1wiOjUwLFxuICAgICAgICBcImVtaXNzaW9uc1BlclVwZGF0ZVwiOjEsXG4gICAgICAgIFwiZW1pc3Npb25zSW50ZXJ2YWxcIjoyLFxuICAgICAgICBcImFscGhhXCI6MSxcbiAgICAgICAgXCJwcm9wZXJ0aWVzXCI6IHtcbiAgICAgICAgICBcInJhbmRvbVNwYXduWFwiOjEsXG4gICAgICAgICAgXCJyYW5kb21TcGF3bllcIjoxLFxuICAgICAgICAgIFwibGlmZVwiOjMwLFxuICAgICAgICAgIFwicmFuZG9tTGlmZVwiOjEwMCxcbiAgICAgICAgICBcImZvcmNlWFwiOjAsXG4gICAgICAgICAgXCJmb3JjZVlcIjowLFxuICAgICAgICAgIFwicmFuZG9tRm9yY2VYXCI6MC4wMDEsXG4gICAgICAgICAgXCJyYW5kb21Gb3JjZVlcIjowLjAxLFxuICAgICAgICAgIFwidmVsb2NpdHlYXCI6MCxcbiAgICAgICAgICBcInZlbG9jaXR5WVwiOi0wLjAyLFxuICAgICAgICAgIFwicmFuZG9tVmVsb2NpdHlYXCI6MC4yLFxuICAgICAgICAgIFwicmFuZG9tVmVsb2NpdHlZXCI6MC40LFxuICAgICAgICAgIFwic2NhbGVcIjowLjEsXG4gICAgICAgICAgXCJncm93dGhcIjowLjAwMSxcbiAgICAgICAgICBcInJhbmRvbVNjYWxlXCI6MC4wNCxcbiAgICAgICAgICBcImFscGhhU3RhcnRcIjowLFxuICAgICAgICAgIFwiYWxwaGFGaW5pc2hcIjowLFxuICAgICAgICAgIFwiYWxwaGFSYXRpb1wiOjAuMixcbiAgICAgICAgICBcInRvcnF1ZVwiOjAsXG4gICAgICAgICAgXCJyYW5kb21Ub3JxdWVcIjowXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBwYXJ0aWNsZXMudmlldy5hbHBoYSA9IDAuNTtcbiAgICAgIHBhcnRpY2xlcy5wcm9wZXJ0aWVzLmNlbnRlclggKz0gc2VsZi52aWV3LndpZHRoIC8gMjtcbiAgICAgIHBhcnRpY2xlcy5wcm9wZXJ0aWVzLmNlbnRlclkgKz0gc2VsZi52aWV3LmhlaWdodCAvIDI7XG5cbiAgICAgIHNlbGYudmlldy5hZGRDaGlsZChwYXJ0aWNsZXMudmlldyk7XG4gICAgfVxuXG4gIH0pO1xuXG5cdHRoaXMudHJpZ2dlciA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghdHJpZ2dlcmVkKSB7XG4gICAgICBmYWRlT3V0U2hhcGUuYmVnaW5GaWxsKDB4MDAwKTtcbiAgICAgIGZhZGVPdXRTaGFwZS5kcmF3UmVjdCgwLCAwLCBnYW1lLnJlbmRlcmVyLndpZHRoLCBnYW1lLnJlbmRlcmVyLmhlaWdodCk7XG4gICAgICBjb250YWluZXIuYWRkQ2hpbGQoZmFkZU91dFNoYXBlKTtcbiAgICAgIGdhbWUucGxheWVyLmZhZGVPdXQoKTtcbiAgICAgIGdhbWUucmVzb3VyY2VzLnBvcnRhbFNvdW5kLnBsYXkoKTtcbiAgICAgIGdhbWUucmVzb3VyY2VzLmZvcmVzdFNvdW5kLnN0b3AoKTtcbiAgICB9XG4gICAgdHJpZ2dlcmVkID0gdHJ1ZTtcbiAgfVxuXG4gIHZhciBnYW1lb3ZlciA9IGZhbHNlO1xuICBzZWxmLmdhbWVvdmVyID0gZ2FtZW92ZXI7XG5cblx0dGhpcy51cGRhdGUgPSBmdW5jdGlvbihnYW1lKVxuXHR7XG4gICAgaWYoc2VsZi5nYW1lb3ZlcilcbiAgICAgIHJldHVybjtcblxuICAgIGlmIChwYXJ0aWNsZXMpIHtcbiAgICAgIHBhcnRpY2xlcy51cGRhdGUoKTtcbiAgICB9XG5cbiAgICBpZiAodHJpZ2dlcmVkKSB7XG5cbiAgICAgIGZhZGVPdXRTaGFwZS5hbHBoYSArPSAwLjAxO1xuICAgICAgaWYgKGZhZGVPdXRTaGFwZS5hbHBoYSA+PSAwLjcpIHtcbiAgICAgICAgZ2FtZS5zaG93RW5kU3RvcnkoKTtcbiAgICAgICAgc2VsZi5nYW1lb3ZlciA9IHRydWU7XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy9jb25zb2xlLmxvZyhnYW1lLnBsYXllci5kb0NvbGxpZGUoaXRlbURhdGEueCxpdGVtRGF0YS55LCBpdGVtRGF0YS53aWR0aCxpdGVtRGF0YS5oZWlnaHQpLGdhbWUuaW5wdXQuS2V5LmlzRG93bigzOCkpO1xuICAgICAgaWYoZ2FtZS5wbGF5ZXIuZG9Db2xsaWRlKGl0ZW1EYXRhLngsaXRlbURhdGEueSwgaXRlbURhdGEud2lkdGgsaXRlbURhdGEuaGVpZ2h0KSlcbiAgICAgICAge1xuICAgICAgICAgIGlmKGdhbWUubGV2ZWwubnVtU3dpdGNoZXMgPT0gMCkge1xuICAgICAgICAgICAgc2VsZi50cmlnZ2VyKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJ2YXIgVG9vbHMgPSByZXF1aXJlKCcuLi9Ub29scy5qcycpO1xudmFyIFBhcnRpY2xlU3lzdGVtID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9QYXJ0aWNsZVN5c3RlbS5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIExpZ2h0QmVoYXZpb3IoY29udGFpbmVyLCBkYXRhKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5uYW1lID0gXCJMaWdodEJlaGF2aW9yXCI7XG5cbiAgLy8vLy9yZXRyaXZlIHBvc2l0aW9uIGFuZCBzaXplIHNwZWNzXG4gIHZhciBzaXplID0gZGF0YS53aWR0aDtcbiAgdmFyIG9yaWdpblggPSBkYXRhLng7XG4gIHZhciBvcmlnaW5ZID0gZGF0YS55O1xuXG4gIHZhciBtb3ZpZSA9IG51bGw7XG5cbiAgbW92aWUgPSBuZXcgUElYSS5Nb3ZpZUNsaXAoVG9vbHMuZ2V0VGV4dHVyZXMoXCJtb3RoZXJcIiwgMTIsIFwiLnBuZ1wiKSk7XG4gIG1vdmllLnBpdm90ID0gbmV3IFBJWEkuUG9pbnQobW92aWUud2lkdGgvMiwgbW92aWUuaGVpZ2h0LzIgKyAyNSk7XG4gIG1vdmllLmFuaW1hdGlvblNwZWVkID0gMC4yO1xuXG4gIHRoaXMudmlldyA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcbiAgdGhpcy52aWV3LnBvc2l0aW9uLnggPSBvcmlnaW5YO1xuICB0aGlzLnZpZXcucG9zaXRpb24ueSA9IG9yaWdpblk7XG5cbiAgdGhpcy52aWV3LmFkZENoaWxkKG1vdmllKTtcblxuICBtb3ZpZS5wbGF5KCk7XG5cbiAgdmFyIGhhbG8gPSBQSVhJLlNwcml0ZS5mcm9tRnJhbWUoXCJoYWxvLnBuZ1wiKTtcbiAgaGFsby5hbmNob3IueCA9IDAuNTtcbiAgaGFsby5hbmNob3IueSA9IDAuNTtcbiAgaGFsby5zY2FsZS54ID0gMTA7XG4gIGhhbG8uc2NhbGUueSA9IDEwO1xuICBoYWxvLmFscGhhID0gMC4zO1xuICB0aGlzLnZpZXcuYWRkQ2hpbGQoaGFsbyk7XG5cbiAgbGlnaHQucG9zaXRpb24ueCA9IG9yaWdpblg7XG4gIGxpZ2h0LnBvc2l0aW9uLnkgPSBvcmlnaW5ZO1xuXG4gIHZhciBwYXJ0aWNsZXMgPSBuZXcgUGFydGljbGVTeXN0ZW0oXG4gIHtcbiAgICAgIFwiaW1hZ2VzXCI6W1wibW90aGVyU2hpbmUucG5nXCJdLFxuICAgICAgXCJudW1QYXJ0aWNsZXNcIjoxMDAsXG4gICAgICBcImVtaXNzaW9uc1BlclVwZGF0ZVwiOjEsXG4gICAgICBcImVtaXNzaW9uc0ludGVydmFsXCI6MixcbiAgICAgIFwiYWxwaGFcIjoxLFxuICAgICAgXCJwcm9wZXJ0aWVzXCI6XG4gICAgICB7XG4gICAgICAgIFwicmFuZG9tU3Bhd25YXCI6MSxcbiAgICAgICAgXCJyYW5kb21TcGF3bllcIjoxLFxuICAgICAgICBcImxpZmVcIjozMCxcbiAgICAgICAgXCJyYW5kb21MaWZlXCI6MTAwLFxuICAgICAgICBcImZvcmNlWFwiOjAsXG4gICAgICAgIFwiZm9yY2VZXCI6MCxcbiAgICAgICAgXCJyYW5kb21Gb3JjZVhcIjowLjAxLFxuICAgICAgICBcInJhbmRvbUZvcmNlWVwiOjAuMDEsXG4gICAgICAgIFwidmVsb2NpdHlYXCI6MCxcbiAgICAgICAgXCJ2ZWxvY2l0eVlcIjowLFxuICAgICAgICBcInJhbmRvbVZlbG9jaXR5WFwiOjAuMSxcbiAgICAgICAgXCJyYW5kb21WZWxvY2l0eVlcIjowLjEsXG4gICAgICAgIFwic2NhbGVcIjowLjEsXG4gICAgICAgIFwiZ3Jvd3RoXCI6MC4wMDEsXG4gICAgICAgIFwicmFuZG9tU2NhbGVcIjowLjA0LFxuICAgICAgICBcImFscGhhU3RhcnRcIjowLFxuICAgICAgICBcImFscGhhRmluaXNoXCI6MCxcbiAgICAgICAgXCJhbHBoYVJhdGlvXCI6MC4yLFxuICAgICAgICBcInRvcnF1ZVwiOjAsXG4gICAgICAgIFwicmFuZG9tVG9ycXVlXCI6MFxuICAgICAgfVxuICB9KTtcbiAgcGFydGljbGVzLnZpZXcuYWxwaGEgPSAwLjU7XG5cbiAgY29udGFpbmVyLmFkZENoaWxkKHBhcnRpY2xlcy52aWV3KTtcbiAgY29udGFpbmVyLmFkZENoaWxkKHRoaXMudmlldyk7XG5cbiAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbigpXG4gIHtcbiAgICAgIHNlbGYudmlldy5wb3NpdGlvbi54ID0gbGlnaHQucG9zaXRpb24ueDtcbiAgICAgIHNlbGYudmlldy5wb3NpdGlvbi55ID0gbGlnaHQucG9zaXRpb24ueTtcblxuICAgICAgcGFydGljbGVzLnByb3BlcnRpZXMuY2VudGVyWCA9IHNlbGYudmlldy5wb3NpdGlvbi54O1xuICAgICAgcGFydGljbGVzLnByb3BlcnRpZXMuY2VudGVyWSA9IHNlbGYudmlldy5wb3NpdGlvbi55IC0gMTA7XG4gICAgICBwYXJ0aWNsZXMudXBkYXRlKCk7XG5cbiAgICAgIHZhciBvcmllbnRhdGlvbiA9IGxpZ2h0LnBvc2l0aW9uLnggLSBnYW1lLnBsYXllci52aWV3LnBvc2l0aW9uLng7XG5cbiAgICAgIGlmIChvcmllbnRhdGlvbiA8IDApXG4gICAgICB7XG4gICAgICAgIG1vdmllLnNjYWxlLnggPSAtMTtcbiAgICAgIH1cbiAgICAgIGlmIChvcmllbnRhdGlvbiA+IDApXG4gICAgICB7XG4gICAgICAgIG1vdmllLnNjYWxlLnggPSAxO1xuICAgICAgfVxuICB9XG5cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gUGxhdGZvcm1CZWhhdmlvcihjb250YWluZXIsIHByb3BlcnRpZXMpIHtcblxuXHR2YXIgdmlldyA9IG5ldyBQSVhJLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcblx0dmlldy5wb3NpdGlvbi54ID0gcHJvcGVydGllcy54O1xuXHR2aWV3LnBvc2l0aW9uLnkgPSBwcm9wZXJ0aWVzLnk7XG5cblx0Y29udGFpbmVyLmFkZENoaWxkKHZpZXcpO1xuXG5cdHNldHVwU2tpbigpO1xuXG5cdGZ1bmN0aW9uIHNldHVwU2tpbigpXG5cdHtcblx0XHR2YXIgdyA9IDQwO1xuXHRcdHZhciBoID0gNDA7XG5cdFx0dmFyIGNvbHMgPSBNYXRoLmZsb29yKHByb3BlcnRpZXMud2lkdGgvdyk7XG5cdFx0dmFyIHJvd3MgPSBNYXRoLmZsb29yKHByb3BlcnRpZXMuaGVpZ2h0L2gpO1xuXHRcdHZhciBhbW91bnQgPSBjb2xzKnJvd3M7XG5cdFx0dmFyIHB4ID0gMDtcblx0XHR2YXIgcHkgPSAwO1xuXHRcdFxuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhbW91bnQ7IGkrKylcblx0XHR7XG5cdFx0XHRweCA9IGklY29scztcblx0XHRcdHB5ID0gTWF0aC5mbG9vcihpL2NvbHMpO1xuXHRcdFx0dmFyIHRleHR1cmVOYW1lID0gcHkgPT0gMCA/IFwidGlsZVdvb2QwMS5wbmdcIiA6IFwidGlsZVdvb2QwMi5wbmdcIjtcblx0XHRcdHZhciB0ZXh0dXJlID0gUElYSS5UZXh0dXJlLmZyb21JbWFnZSh0ZXh0dXJlTmFtZSk7XG5cdFx0XHR2YXIgdGlsZSA9IG5ldyBQSVhJLlNwcml0ZSh0ZXh0dXJlKTtcblx0XHRcdHRpbGUucG9zaXRpb24ueCA9IHB4Knc7XG5cdFx0XHR0aWxlLnBvc2l0aW9uLnkgPSBweSpoO1xuXHRcdFx0dmlldy5hZGRDaGlsZCh0aWxlKTtcblx0XHR9XHRcblx0fVxuXG5cdFxuXG5cdHRoaXMudXBkYXRlID0gZnVuY3Rpb24oKVxuXHR7XG5cblx0fVxuXG5cdHRoaXMudmlldyA9IHZpZXc7XG59XG4iLCJ2YXIgVHdlZW5hYmxlID0gcmVxdWlyZSgnLi4vdmVuZG9yL3NoaWZ0eScpO1xudmFyIFBhcnRpY2xlU3lzdGVtID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9QYXJ0aWNsZVN5c3RlbS5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIFN3aXRjaEJlaGF2aW9yKGNvbnRhaW5lciwgZGF0YSkge1xuXHR2YXIgc2VsZiA9IHRoaXMsXG4gICAgZ3JpZFNpemUgPSBkYXRhLnByb3BlcnRpZXMuc2l6ZSB8fCBkYXRhLmhlaWdodCxcbiAgICBtb3ZlWCA9IGRhdGEucHJvcGVydGllcy5tb3ZlWCAqIGdyaWRTaXplLFxuICAgIG1vdmVZID0gZGF0YS5wcm9wZXJ0aWVzLm1vdmVZICogZ3JpZFNpemUsXG4gICAgbGlnaHRPcmlnID0gZmFsc2UsXG4gICAgbGlnaHREZXN0ID0geyB4OiBkYXRhLnByb3BlcnRpZXMubW92ZVggKiBncmlkU2l6ZSwgeTogZGF0YS5wcm9wZXJ0aWVzLm1vdmVZICogZ3JpZFNpemUgfSxcbiAgICBpdGVtRGF0YSA9IGRhdGEsXG4gICAgbW92aW5nID0gZmFsc2UsXG4gICAgcHJlc3NlZCA9IGZhbHNlO1xuXG4gIC8vLy8vcmV0cml2ZSBwb3NpdGlvbiBhbmQgc2l6ZSBzcGVjc1xuICB2YXIgb3JpZ2luWCA9IGRhdGEueDtcbiAgdmFyIG9yaWdpblkgPSBkYXRhLnk7XG4gIHZhciBwcmVzc2VkID0gZmFsc2U7XG5cbiAgLy8vLy9jcmVhdGUgdmlzdWFsXG4gIHZhciB0ZXh0dXJlT2ZmID0gUElYSS5UZXh0dXJlLmZyb21JbWFnZShcInN3aXRjaE9mZi5wbmdcIik7XG4gIHZhciB0ZXh0dXJlT24gPSBQSVhJLlRleHR1cmUuZnJvbUltYWdlKFwic3dpdGNoT24ucG5nXCIpO1xuXG4gIHNlbGYudmlldyA9IG5ldyBQSVhJLlNwcml0ZSh0ZXh0dXJlT2ZmKTtcbiAgc2VsZi52aWV3LnBvc2l0aW9uLnggPSBvcmlnaW5YO1xuICBzZWxmLnZpZXcucG9zaXRpb24ueSA9IG9yaWdpblkgLSAyO1xuXG4gIHZhciBwYXJ0aWNsZXMgPSBuZXcgUGFydGljbGVTeXN0ZW0oXG4gIHtcbiAgICAgIFwiaW1hZ2VzXCI6W1wicGl4ZWxTaGluZS5wbmdcIl0sXG4gICAgICBcIm51bVBhcnRpY2xlc1wiOjMwLFxuICAgICAgXCJlbWlzc2lvbnNQZXJVcGRhdGVcIjoxLFxuICAgICAgXCJlbWlzc2lvbnNJbnRlcnZhbFwiOjEwLFxuICAgICAgXCJhbHBoYVwiOjEsXG4gICAgICBcInByb3BlcnRpZXNcIjpcbiAgICAgIHtcbiAgICAgICAgXCJyYW5kb21TcGF3blhcIjoyLFxuICAgICAgICBcInJhbmRvbVNwYXduWVwiOjEsXG4gICAgICAgIFwibGlmZVwiOjQwLFxuICAgICAgICBcInJhbmRvbUxpZmVcIjo1LFxuICAgICAgICBcImZvcmNlWFwiOjAsXG4gICAgICAgIFwiZm9yY2VZXCI6LTAuMDIsXG4gICAgICAgIFwicmFuZG9tRm9yY2VYXCI6MC4wLFxuICAgICAgICBcInJhbmRvbUZvcmNlWVwiOjAuMDEsXG4gICAgICAgIFwidmVsb2NpdHlYXCI6MCxcbiAgICAgICAgXCJ2ZWxvY2l0eVlcIjotMC4xLFxuICAgICAgICBcInJhbmRvbVZlbG9jaXR5WFwiOjAuMCxcbiAgICAgICAgXCJyYW5kb21WZWxvY2l0eVlcIjowLjAsXG4gICAgICAgIFwic2NhbGVcIjoxLFxuICAgICAgICBcImdyb3d0aFwiOi0wLjAwMSxcbiAgICAgICAgXCJyYW5kb21TY2FsZVwiOjAuNSxcbiAgICAgICAgXCJhbHBoYVN0YXJ0XCI6MSxcbiAgICAgICAgXCJhbHBoYUZpbmlzaFwiOjAsXG4gICAgICAgIFwiYWxwaGFSYXRpb1wiOjAuMixcbiAgICAgICAgXCJ0b3JxdWVcIjowLFxuICAgICAgICBcInJhbmRvbVRvcnF1ZVwiOjBcbiAgICAgIH1cbiAgfSk7XG5cbiAgY29udGFpbmVyLmFkZENoaWxkKHRoaXMudmlldyk7XG4gIGNvbnRhaW5lci5hZGRDaGlsZChwYXJ0aWNsZXMudmlldyk7XG4gIHBhcnRpY2xlcy5wcm9wZXJ0aWVzLmNlbnRlclkgPSBzZWxmLnZpZXcucG9zaXRpb24ueSArIDI1O1xuXG4gIHRoaXMudHJpZ2dlciA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIHdoZW4gcHJlc3NpbmcgZm9yIHRoZSBmaXJzdCB0aW1lLCB0aGUgb3JpbmFsIGxpZ2h0IHBvc2l0aW9uIGlzIHN0b3JlZCB0byByZXZlcnQuXG4gICAgLy8gaWYgKCFwcmVzc2VkICYmICFsaWdodE9yaWcpIHtcbiAgICAvLyAgIGxpZ2h0T3JpZyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkobGlnaHQucG9zaXRpb24pKTtcbiAgICAvLyB9XG5cbiAgICAvLyB2YXIgZGVzdCA9ICghcHJlc3NlZCkgPyBsaWdodERlc3QgOiBsaWdodE9yaWc7XG4gICAgLy8gcHJlc3NlZCA9ICFwcmVzc2VkO1xuXG4gICAgaWYgKCFwcmVzc2VkKVxuICAgIHtcbiAgICAgIHNlbGYudmlldy50ZXh0dXJlID0gdGV4dHVyZU9uO1xuICAgICAgc2VsZi52aWV3LnBvc2l0aW9uLnkgPSBvcmlnaW5ZICsgMTI7XG4gICAgICBwYXJ0aWNsZXMucHJvcGVydGllcy5jZW50ZXJZID0gc2VsZi52aWV3LnBvc2l0aW9uLnkgKyA5O1xuICAgICAgcHJlc3NlZCA9IHRydWU7XG4gICAgICBnYW1lLnJlc291cmNlcy5zd2ljaGVyU291bmQucGxheSgpO1xuICAgICAgY29udGFpbmVyLmFkZENoaWxkKHBhcnRpY2xlcy52aWV3KTtcbiAgICB9XG4gICAgLy8gZWxzZVxuICAgIC8vIHtcbiAgICAvLyAgIHNlbGYudmlldy50ZXh0dXJlID0gdGV4dHVyZU9mZjtcbiAgICAvLyB9XG5cbiAgICAvLyB2YXIgdHdlZW5hYmxlID0gbmV3IFR3ZWVuYWJsZSgpO1xuICAgIC8vIHR3ZWVuYWJsZS50d2Vlbih7XG4gICAgLy8gICBmcm9tOiBsaWdodC5wb3NpdGlvbixcbiAgICAvLyAgIHRvOiAgIGRlc3QsXG4gICAgLy8gICBkdXJhdGlvbjogMTAwMCxcbiAgICAvLyAgIGVhc2luZzogJ2Vhc2VPdXRDdWJpYycsXG4gICAgLy8gICBzdGFydDogZnVuY3Rpb24gKCkge1xuICAgIC8vICAgICBtb3ZpbmcgPSB0cnVlO1xuICAgIC8vICAgfSxcbiAgICAvLyAgIGZpbmlzaDogZnVuY3Rpb24gKCkge1xuICAgIC8vICAgICBtb3ZpbmcgPSBmYWxzZTtcbiAgICAvLyAgIH1cbiAgICAvLyB9KTtcbiAgfVxuXG5cdHRoaXMudXBkYXRlID0gZnVuY3Rpb24oZ2FtZSlcblx0e1xuICAgIGlmIChwcmVzc2VkKVxuICAgIHtcbiAgICAgICAgcGFydGljbGVzLnByb3BlcnRpZXMuY2VudGVyWCA9IHNlbGYudmlldy5wb3NpdGlvbi54ICsgMTU7XG4gICAgICAgIHBhcnRpY2xlcy51cGRhdGUoKTsgXG4gICAgfVxuICAgICAgXG4gICAgICBcbiAgICBcblxuICAgIGlmKHByZXNzZWQpXG4gICAgICByZXR1cm47XG5cblx0XHQvL2NvbnNvbGUubG9nKGdhbWUucGxheWVyLmRvQ29sbGlkZShpdGVtRGF0YS54LGl0ZW1EYXRhLnksIGl0ZW1EYXRhLndpZHRoLGl0ZW1EYXRhLmhlaWdodCksZ2FtZS5pbnB1dC5LZXkuaXNEb3duKDM4KSk7XG5cdFx0aWYoZ2FtZS5wbGF5ZXIuZG9Db2xsaWRlKGl0ZW1EYXRhLngsaXRlbURhdGEueSwgaXRlbURhdGEud2lkdGgsaXRlbURhdGEuaGVpZ2h0KSAmJiAhbW92aW5nKVxuXHRcdHtcblx0XHRcdG1vdmluZyA9IHRydWU7XG4gICAgICBnYW1lLmxldmVsLm51bVN3aXRjaGVzIC0tO1xuICAgICAgZW1pdHRlci5lbWl0KCdzd2l0Y2gucHJlc3NlZCcpO1xuXHRcdFx0c2VsZi50cmlnZ2VyKCk7XG5cdFx0fVxuXHR9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIFBhcnRpY2xlU3lzdGVtKHBhcnRpY2xlc0NvbmZpZylcbntcblx0dmFyIHZpZXcgPSBudWxsO1xuXHR2YXIgcHJvcGVydGllcyA9IG51bGw7XG5cdHZhciBmaXJzdFBhcnRpY2xlID0gbnVsbDtcblx0dmFyIGxhc3RQYXJ0aWNsZSA9IG51bGw7XG5cdHZhciBuZXh0UGFydGljbGUgPSAwO1xuXHR2YXIgY291bnQgPSAwO1xuXHR2YXIgbnVtUGFydGljbGVzID0gMjA7XG5cdHZhciBpbWFnZXMgPSBbXTtcblx0dmFyIHNlbGYgPSB0aGlzO1xuXHR2YXIgcGF1c2VkID0gZmFsc2U7XG5cblx0c2VsZi5lbWlzc2lvbnNJbnRlcnZhbCA9IDE7XG5cdHNlbGYuZW1pc3Npb25zUGVyVXBkYXRlID0gMTtcblxuXHRNYXRoLnJhbmRvbVJhbmdlID0gZnVuY3Rpb24obWluLCBtYXgsIHJvdW5kZWQpXG5cdHtcblx0XHR2YXIgZGlmZiA9IG1heCAtIG1pbjtcblx0XHR2YXIgcmVzdWx0ID0gbWluICsgZGlmZipNYXRoLnJhbmRvbSgpO1xuXHRcdGlmIChyb3VuZGVkKSByZXN1bHQgPSBNYXRoLnJvdW5kKHJlc3VsdCk7XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXG5cdGluaXQoKTtcblxuXHRmdW5jdGlvbiBpbml0KClcblx0e1xuXHRcdHZpZXcgPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG5cdFx0cHJvcGVydGllcyA9IG5ldyBQYXJ0aWNsZVByb3BlcnRpZXMoKTtcblx0XHRzZXR1cChwYXJ0aWNsZXNDb25maWcpO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0dXAoY29uZmlnKVxuXHR7XG5cdFx0Y2xlYXIoKTtcblxuXHRcdGlmIChjb25maWcubnVtUGFydGljbGVzICE9IG51bGwpIG51bVBhcnRpY2xlcyA9IGNvbmZpZy5udW1QYXJ0aWNsZXM7XG5cdFx0aWYgKGNvbmZpZy5pbWFnZXMgIT0gbnVsbCkgaW1hZ2VzID0gY29uZmlnLmltYWdlcztcblx0XHRpZiAoY29uZmlnLmVtaXNzaW9uc0ludGVydmFsICE9IG51bGwpIHNlbGYuZW1pc3Npb25zSW50ZXJ2YWwgPSBjb25maWcuZW1pc3Npb25zSW50ZXJ2YWw7XG5cdFx0aWYgKGNvbmZpZy5lbWlzc2lvbnNQZXJVcGRhdGUgIT0gbnVsbCkgc2VsZi5lbWlzc2lvbnNQZXJVcGRhdGUgPSBjb25maWcuZW1pc3Npb25zUGVyVXBkYXRlO1xuXHRcdGlmIChjb25maWcuYWxwaGEgIT0gbnVsbCkgdmlldy5hbHBoYSA9IGNvbmZpZy5hbHBoYTtcblxuXHRcdGlmIChjb25maWcucHJvcGVydGllcyAhPSBudWxsKSB7XG5cdFx0XHRmb3IgKHZhciBmaWVsZCBpbiBjb25maWcucHJvcGVydGllcykge1xuXHRcdFx0XHRwcm9wZXJ0aWVzW2ZpZWxkXSA9IGNvbmZpZy5wcm9wZXJ0aWVzW2ZpZWxkXTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR2YXIgaiA9IDA7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBudW1QYXJ0aWNsZXM7IGkrKykge1xuXHRcdFx0dmFyIHAgPSBuZXcgUGFydGljbGUoaW1hZ2VzW2pdKTtcblx0XHRcdHZpZXcuYWRkQ2hpbGQocC52aWV3KTtcblx0XHRcdGlmIChmaXJzdFBhcnRpY2xlID09IG51bGwpIGZpcnN0UGFydGljbGUgPSBwO1xuXHRcdFx0aWYgKGxhc3RQYXJ0aWNsZSAhPSBudWxsKSBsYXN0UGFydGljbGUubmV4dCA9IHA7XG5cdFx0XHRsYXN0UGFydGljbGUgPSBwO1xuXHRcdFx0aisrO1xuXHRcdFx0aWYgKGogPj0gaW1hZ2VzLmxlbmd0aCkgaiA9IDA7XG5cdFx0fVxuXG5cdFx0bmV4dFBhcnRpY2xlID0gZmlyc3RQYXJ0aWNsZTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNsZWFyKClcblx0e1xuXHRcdHZhciBwID0gZmlyc3RQYXJ0aWNsZTtcblx0XHR3aGlsZSAocCAhPSBudWxsKSB7XG5cdFx0XHRwLmRpc3Bvc2UoKTtcblx0XHRcdHAgPSBwLm5leHQ7XG5cdFx0fVxuXG5cdFx0Zmlyc3RQYXJ0aWNsZSA9IG51bGw7XG5cdFx0bGFzdFBhcnRpY2xlID0gbnVsbDtcblx0XHRuZXh0UGFydGljbGUgPSBudWxsO1xuXHR9XG5cblx0ZnVuY3Rpb24gdXBkYXRlKHRpbWVzdGFtcClcblx0e1xuXHRcdGlmIChjb3VudCA9PSAwICYmICFwYXVzZWQpIGVtaXQoc2VsZi5lbWlzc2lvbnNQZXJVcGRhdGUpO1xuXHRcdGNvdW50Kys7XG5cdFx0aWYgKGNvdW50ID09IHNlbGYuZW1pc3Npb25zSW50ZXJ2YWwpIGNvdW50ID0gMDtcblxuXHRcdHZhciBwID0gZmlyc3RQYXJ0aWNsZTtcblx0XHR3aGlsZSAocCAhPSBudWxsKSB7XG5cdFx0XHRpZiAocC5saXZpbmcpIHtcblx0XHRcdFx0cC51cGRhdGUodGltZXN0YW1wKTtcblx0XHRcdH1cblx0XHRcdHAgPSBwLm5leHQ7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gZW1pdChhbW91bnQpXG5cdHtcblx0XHR3aGlsZSAoYW1vdW50LS0pIHtcblx0XHRcdHZhciBwID0gbmV4dFBhcnRpY2xlO1xuXHRcdFx0aWYgKHAgPT0gbnVsbCkgcCA9IGZpcnN0UGFydGljbGU7XG5cdFx0XHRwLnNwYXduKHByb3BlcnRpZXMpO1xuXHRcdFx0bmV4dFBhcnRpY2xlID0gcC5uZXh0O1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGdldENvdW50KClcblx0e1xuXHRcdHJldHVybiBjb3VudDtcblx0fVxuXG5cdGZ1bmN0aW9uIHBhdXNlRW1pc3Npb25zKClcblx0e1xuXHRcdHBhdXNlZCA9IHRydWU7XG5cdH1cblxuXHRmdW5jdGlvbiByZXN1bWVFbWlzc2lvbnMoKVxuXHR7XG5cdFx0cGF1c2VkID0gZmFsc2U7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNwb3NlKClcblx0e1xuXHRcdGNsZWFyKCk7XG5cdFx0aWYgKHZpZXcgJiYgdmlldy5wYXJlbnQpIHZpZXcucGFyZW50LnJlbW92ZUNoaWxkKHZpZXcpO1xuXHRcdHZpZXcgPSBudWxsO1xuXHR9XG5cblx0dGhpcy5zZXR1cCA9IHNldHVwO1xuXHR0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzO1xuXHR0aGlzLnZpZXcgPSB2aWV3O1xuXHR0aGlzLnVwZGF0ZSA9IHVwZGF0ZTtcblx0dGhpcy5lbWl0ID0gZW1pdDtcblx0dGhpcy5nZXRDb3VudCA9IGdldENvdW50O1xuXHR0aGlzLnBhdXNlRW1pc3Npb25zID0gcGF1c2VFbWlzc2lvbnM7XG5cdHRoaXMucmVzdW1lRW1pc3Npb25zID0gcmVzdW1lRW1pc3Npb25zO1xuXHR0aGlzLmRpc3Bvc2UgPSBkaXNwb3NlO1xuXG59XG5cblx0Ly8gSU5URVJOQUwgQ0xBU1NFUyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdFBhcnRpY2xlID0gZnVuY3Rpb24oaW1hZ2UpXG5cdHtcblx0XHR2YXIgdmlldyA9IG51bGw7XG5cdFx0dmFyIHByb3BlcnRpZXMgPSBudWxsO1xuXHRcdHZhciBwYXJhbXMgPSBudWxsO1xuXHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdGluaXQoKTtcblxuXHRcdGZ1bmN0aW9uIGluaXQoKVxuXHRcdHtcblx0XHRcdHZpZXcgPSBQSVhJLlNwcml0ZS5mcm9tRnJhbWUoaW1hZ2UpO1xuXHRcdFx0dmlldy5hbmNob3IueCA9IDAuNTtcblx0XHRcdHZpZXcuYW5jaG9yLnkgPSAwLjU7XG5cdFx0XHRwcm9wZXJ0aWVzID0gbmV3IFBhcnRpY2xlUHJvcGVydGllcygpO1xuXHRcdFx0dmlldy52aXNpYmxlID0gZmFsc2U7XG5cblx0XHRcdHBhcmFtcyA9IHt9O1xuXHRcdFx0cGFyYW1zLmxpZmVDb3VudCA9IDA7XG5cdFx0XHRwYXJhbXMubGlmZVRvdGFsID0gMDtcblx0XHRcdHBhcmFtcy5hbHBoYVRpbWUgPSAwLjA7XG5cdFx0XHRwYXJhbXMuZmFkZUluRXZvbHV0aW9uID0gMC4wO1xuXHRcdFx0cGFyYW1zLmZhZGVPdXRFdm9sdXRpb24gPSAwLjA7XG5cdFx0XHRwYXJhbXMuc3RlcFRvU3RhcnRGYWRlT3V0ID0gMDtcblxuXHRcdFx0cHJvcGVydGllcyA9IHt9O1xuXHRcdH1cblxuXHRcdHRoaXMubGl2aW5nID0gZmFsc2U7XG5cdFx0dGhpcy5uZXh0ID0gbnVsbDtcblx0XHR0aGlzLnZpZXcgPSB2aWV3O1xuXHRcdHRoaXMucHJvcGVydGllcyA9IHByb3BlcnRpZXM7XG5cdFx0dGhpcy5wYXJhbXMgPSBwYXJhbXM7XG5cdH1cblxuXHRQYXJ0aWNsZS5wcm90b3R5cGUuc3Bhd24gPSBmdW5jdGlvbihuZXdQcm9wZXJ0aWVzKVxuXHR7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdHZhciBwcm9wZXJ0aWVzID0gdGhpcy5wcm9wZXJ0aWVzO1xuXHRcdHZhciBwYXJhbXMgPSB0aGlzLnBhcmFtcztcblx0XHR2YXIgdmlldyA9IHRoaXMudmlldztcblxuXHRcdGZvciAodmFyIGZpZWxkIGluIG5ld1Byb3BlcnRpZXMpIHtcblx0XHRcdHByb3BlcnRpZXNbZmllbGRdID0gbmV3UHJvcGVydGllc1tmaWVsZF07XG5cdFx0fVxuXG5cdFx0dGhpcy5saXZpbmcgPSB0cnVlO1xuXG5cdFx0cGFyYW1zLmxpZmVDb3VudCA9IHByb3BlcnRpZXMubGlmZSArIE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSpwcm9wZXJ0aWVzLnJhbmRvbUxpZmUpO1xuXHRcdHBhcmFtcy5saWZlVG90YWwgPSBwYXJhbXMubGlmZUNvdW50O1xuXG5cdFx0dmlldy52aXNpYmxlID0gdHJ1ZTtcblx0XHR2aWV3LnBvc2l0aW9uLnggPSBwcm9wZXJ0aWVzLmNlbnRlclggKyBNYXRoLnJhbmRvbVJhbmdlKC1wcm9wZXJ0aWVzLnJhbmRvbVNwYXduWCwgcHJvcGVydGllcy5yYW5kb21TcGF3blgpO1xuXHRcdHZpZXcucG9zaXRpb24ueSA9IHByb3BlcnRpZXMuY2VudGVyWSArIE1hdGgucmFuZG9tUmFuZ2UoLXByb3BlcnRpZXMucmFuZG9tU3Bhd25ZLCBwcm9wZXJ0aWVzLnJhbmRvbVNwYXduWSk7XG5cdFx0dmlldy5zY2FsZS54ID0gdmlldy5zY2FsZS55ID0gcHJvcGVydGllcy5zY2FsZTtcblx0XHR2aWV3LmFscGhhID0gcHJvcGVydGllcy5hbHBoYVN0YXJ0O1xuXG5cdFx0aWYgKHByb3BlcnRpZXMucmFuZG9tVmVsb2NpdHlYICE9IDApIHtcblx0XHRcdHByb3BlcnRpZXMudmVsb2NpdHlYICs9IE1hdGgucmFuZG9tUmFuZ2UoLXByb3BlcnRpZXMucmFuZG9tVmVsb2NpdHlYLCBwcm9wZXJ0aWVzLnJhbmRvbVZlbG9jaXR5WCk7XG5cdFx0fVxuXG5cdFx0aWYgKHByb3BlcnRpZXMucmFuZG9tVmVsb2NpdHlZICE9IDApIHtcblx0XHRcdHByb3BlcnRpZXMudmVsb2NpdHlZICs9IE1hdGgucmFuZG9tUmFuZ2UoLXByb3BlcnRpZXMucmFuZG9tVmVsb2NpdHlZLCBwcm9wZXJ0aWVzLnJhbmRvbVZlbG9jaXR5WSk7XG5cdFx0fVxuXG5cdFx0aWYgKHByb3BlcnRpZXMucmFuZG9tRm9yY2VYICE9IDApIHtcblx0XHRcdHByb3BlcnRpZXMuZm9yY2VYICs9IE1hdGgucmFuZG9tUmFuZ2UoLXByb3BlcnRpZXMucmFuZG9tRm9yY2VYLCBwcm9wZXJ0aWVzLnJhbmRvbUZvcmNlWCk7XG5cdFx0fVxuXG5cdFx0aWYgKHByb3BlcnRpZXMucmFuZG9tRm9yY2VZICE9IDApIHtcblx0XHRcdHByb3BlcnRpZXMuZm9yY2VZICs9IE1hdGgucmFuZG9tUmFuZ2UoLXByb3BlcnRpZXMucmFuZG9tRm9yY2VZLCBwcm9wZXJ0aWVzLnJhbmRvbUZvcmNlWSk7XG5cdFx0fVxuXG5cdFx0aWYgKHByb3BlcnRpZXMucmFuZG9tU2NhbGUgIT0gMCkge1xuXHRcdFx0dmlldy5zY2FsZS54ID0gdmlldy5zY2FsZS55ID0gcHJvcGVydGllcy5zY2FsZSArIE1hdGgucmFuZG9tUmFuZ2UoLXByb3BlcnRpZXMucmFuZG9tU2NhbGUsIHByb3BlcnRpZXMucmFuZG9tU2NhbGUpO1xuXHRcdH1cblxuXHRcdGlmIChwcm9wZXJ0aWVzLnJhbmRvbVRvcnF1ZSAhPSAwKSB7XG5cdFx0XHRwcm9wZXJ0aWVzLnRvcnF1ZSArPSBNYXRoLnJhbmRvbVJhbmdlKC1wcm9wZXJ0aWVzLnJhbmRvbVRvcnF1ZSwgcHJvcGVydGllcy5yYW5kb21Ub3JxdWUpO1xuXHRcdH1cblxuXHRcdHBhcmFtcy5hbHBoYVRpbWUgPSBNYXRoLnJvdW5kKHBhcmFtcy5saWZlQ291bnQqcHJvcGVydGllcy5hbHBoYVJhdGlvKTtcblx0XHRwYXJhbXMuZmFkZUluRXZvbHV0aW9uID0gKDEuMCAtIHByb3BlcnRpZXMuYWxwaGFTdGFydCkvcGFyYW1zLmFscGhhVGltZTtcblx0XHRwYXJhbXMuZmFkZU91dEV2b2x1dGlvbiA9ICgxLjAgLSBwcm9wZXJ0aWVzLmFscGhhRmluaXNoKS9wYXJhbXMuYWxwaGFUaW1lO1xuXHRcdHBhcmFtcy5zdGVwVG9TdGFydEZhZGVPdXQgPSBwYXJhbXMuYWxwaGFUaW1lO1xuXHR9XG5cblx0UGFydGljbGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKHRpbWVzdGFtcClcblx0e1xuXHRcdHZhciBzZWxmID0gdGhpcztcblx0XHR2YXIgcHJvcGVydGllcyA9IHRoaXMucHJvcGVydGllcztcblx0XHR2YXIgcGFyYW1zID0gdGhpcy5wYXJhbXM7XG5cdFx0dmFyIHZpZXcgPSB0aGlzLnZpZXc7XG5cblx0XHRpZiAoIXNlbGYubGl2aW5nKSByZXR1cm47XG5cblx0XHR2aWV3LnBvc2l0aW9uLnggKz0gcHJvcGVydGllcy52ZWxvY2l0eVg7XG5cdFx0dmlldy5wb3NpdGlvbi55ICs9IHByb3BlcnRpZXMudmVsb2NpdHlZO1xuXHRcdHZpZXcucm90YXRpb24gKz0gcHJvcGVydGllcy50b3JxdWU7XG5cdFx0cHJvcGVydGllcy52ZWxvY2l0eVggKz0gcHJvcGVydGllcy5mb3JjZVg7XG5cdFx0cHJvcGVydGllcy52ZWxvY2l0eVkgKz0gcHJvcGVydGllcy5mb3JjZVk7XG5cblx0XHRpZiAocGFyYW1zLmxpZmVDb3VudCA+IHBhcmFtcy5saWZlVG90YWwgLSBwYXJhbXMuYWxwaGFUaW1lKSB7XG5cdCAgICBcdHZpZXcuYWxwaGEgKz0gcGFyYW1zLmZhZGVJbkV2b2x1dGlvbjtcblx0ICAgIFx0aWYgKHZpZXcuYWxwaGEgPiAxKSB2aWV3LmFscGhhID0gMTtcblx0ICAgIH1cblxuXHQgICAgaWYgKHBhcmFtcy5saWZlQ291bnQgPD0gcGFyYW1zLmFscGhhVGltZSkge1xuXHQgICAgXHR2aWV3LmFscGhhIC09IHBhcmFtcy5mYWRlT3V0RXZvbHV0aW9uO1xuXHQgICAgXHRpZiAodmlldy5hbHBoYSA8IDApIHZpZXcuYWxwaGEgPSAwO1xuXHQgICAgfVxuXG5cdCAgICBpZiAocHJvcGVydGllcy5ncm93dGggIT0gMCkge1xuXHQgICAgXHR2aWV3LnNjYWxlLnggPSB2aWV3LnNjYWxlLnkgPSAodmlldy5zY2FsZS54ICsgcHJvcGVydGllcy5ncm93dGgpO1xuXHQgICAgfVxuXG5cdFx0cGFyYW1zLmxpZmVDb3VudC0tO1xuXHRcdGlmIChwYXJhbXMubGlmZUNvdW50IDw9IDApIHRoaXMuZGllKCk7XG5cdH1cblxuXHRQYXJ0aWNsZS5wcm90b3R5cGUuZGllID0gZnVuY3Rpb24oKVxuXHR7XG5cdFx0dGhpcy5saXZpbmcgPSBmYWxzZTtcblx0XHR0aGlzLnZpZXcudmlzaWJsZSA9IGZhbHNlO1xuXHRcdHRoaXMudmlldy5hbHBoYSA9IDA7XG5cdH1cblxuXHRQYXJ0aWNsZS5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uKClcblx0e1xuXHRcdGlmICh0aGlzLnZpZXcgPT0gbnVsbCkgcmV0dXJuO1xuXHRcdGlmICh0aGlzLnZpZXcucGFyZW50KSB0aGlzLnZpZXcucGFyZW50LnJlbW92ZUNoaWxkKHRoaXMudmlldyk7XG5cblx0XHR0aGlzLmxpdmluZyA9IGZhbHNlO1xuXHRcdHRoaXMubmV4dCA9IG51bGw7XG5cdFx0dGhpcy52aWV3ID0gbnVsbDtcblx0XHR0aGlzLnByb3BlcnRpZXMgPSBudWxsO1xuXHRcdHRoaXMucGFyYW1zID0gbnVsbDtcblx0fVxuXG5cdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0UGFydGljbGVQcm9wZXJ0aWVzID0gZnVuY3Rpb24oKVxuXHR7XG5cdFx0dGhpcy5yYW5kb21TcGF3blggPSAwO1xuXHRcdHRoaXMucmFuZG9tU3Bhd25ZID0gMDtcblx0XHR0aGlzLmxpZmUgPSA2MDtcblx0XHR0aGlzLnJhbmRvbUxpZmUgPSAwO1xuXHRcdHRoaXMuY2VudGVyWCA9IDA7XG5cdFx0dGhpcy5jZW50ZXJZID0gMDtcblx0XHR0aGlzLmZvcmNlWCA9IDA7XG5cdFx0dGhpcy5mb3JjZVkgPSAwO1xuXHRcdHRoaXMucmFuZG9tRm9yY2VYID0gMDtcblx0XHR0aGlzLnJhbmRvbUZvcmNlWSA9IDA7XG5cdFx0dGhpcy52ZWxvY2l0eVggPSAwO1xuXHRcdHRoaXMudmVsb2NpdHlZID0gMDtcblx0XHR0aGlzLnJhbmRvbVZlbG9jaXR5WCA9IDA7XG5cdFx0dGhpcy5yYW5kb21WZWxvY2l0eVkgPSAwO1xuXHRcdHRoaXMuc2NhbGUgPSAxO1xuXHRcdHRoaXMuZ3Jvd3RoID0gMC4wO1xuXHRcdHRoaXMucmFuZG9tU2NhbGUgPSAwO1xuXHRcdHRoaXMuYWxwaGFTdGFydCA9IDA7XG5cdFx0dGhpcy5hbHBoYUZpbmlzaCA9IDA7XG5cdFx0dGhpcy5hbHBoYVJhdGlvID0gMC4xO1xuXHRcdHRoaXMudG9ycXVlID0gMDtcblx0XHR0aGlzLnJhbmRvbVRvcnF1ZSA9IDA7XG5cdH1cbiIsInZhciBSZXNvdXJjZXMgPSByZXF1aXJlKCcuL1Jlc291cmNlcycpLFxuICBQcmVsb2FkZXIgPSByZXF1aXJlKCcuL1ByZWxvYWRlcicpLFxuICBMZXZlbCA9IHJlcXVpcmUoJy4vTGV2ZWwnKSxcbiAgQmVnaW4gPSByZXF1aXJlKCcuL0JlZ2luJyksXG4gIExldmVsRW5kID0gcmVxdWlyZSgnLi9MZXZlbEVuZCcpLFxuICBHYW1lT3ZlciA9IHJlcXVpcmUoJy4vR2FtZU92ZXInKSxcbiAgTGlnaHQgPSByZXF1aXJlKCcuL0xpZ2h0JyksXG4gIFR3ZWVuYWJsZSA9IHJlcXVpcmUoJy4vdmVuZG9yL3NoaWZ0eScpLFxuICBHYW1lSW5wdXQgPSByZXF1aXJlKCcuL0dhbWVJbnB1dC5qcycpLFxuICBQbGF5ZXIgPSByZXF1aXJlKCcuL1BsYXllci5qcycpO1xuICBQaHlzaWNzID0gcmVxdWlyZSgnLi9QaHlzaWNzLmpzJyk7XG4gIFRvb2xzID0gcmVxdWlyZSgnLi9Ub29scy5qcycpO1xuXG53aW5kb3cuVHdlZW5hYmxlID0gVHdlZW5hYmxlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIEdhbWUoKSB7XG4gIHRoaXMucmVzb3VyY2VzID0gbmV3IFJlc291cmNlcygpO1xuXG4gIC8vIHN0YWdlLmNsaWNrID0gZnVuY3Rpb24oZSkge1xuICAvLyAgIGxpZ2h0LnggPSBlLm9yaWdpbmFsRXZlbnQueDtcbiAgLy8gICBsaWdodC55ID0gZS5vcmlnaW5hbEV2ZW50Lnk7XG4gIC8vIH1cblxuICB3aW5kb3cuc2NyZWVuV2lkdGggPSAodHlwZW9mKGVqZWN0YSk9PVwidW5kZWZpbmVkXCIpID8gOTYwIDogNDgwO1xuICB3aW5kb3cuc2NyZWVuSGVpZ2h0ID0gKHR5cGVvZihlamVjdGEpPT1cInVuZGVmaW5lZFwiKSA/IDY0MCA6IDMyMDtcblxuICB0aGlzLnJlbmRlcmVyID0gbmV3IFBJWEkuQ2FudmFzUmVuZGVyZXIoc2NyZWVuV2lkdGgsIHNjcmVlbkhlaWdodCwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpLCBmYWxzZSAvKiB0cmFuc3BhcmVudCAqLywgZmFsc2UgLyogYW50aWFsaWFzICovKTtcbiAgdGhpcy5yZW5kZXJlci52aWV3LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gIHRoaXMucmVuZGVyZXIudmlldy5zdHlsZS5ib3JkZXIgPSBcIjFweCBzb2xpZFwiO1xuXG4gIHRoaXMuc3RhZ2UgPSBuZXcgUElYSS5TdGFnZSgweDAwZmZmYSwgdHJ1ZSk7XG5cbiAgLy8vL0lucHV0XG4gIHZhciBpbnB1dCA9IG51bGw7XG5cbiAgLy8vLy9QbGF5ZXJcbiAgdmFyIHBsYXllciA9IG51bGw7XG4gIHZhciBwaHlzaWNzID0gbnVsbDtcbiAgdmFyIGRpcmVjdGlvbiA9IDA7XG4gIHZhciBnbG93ID0gbnVsbDtcblxuICAvLyBMZXZlbEluZGV4XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGxldmVsID0gbnVsbDtcbiAgdmFyIGxvc3QgPSBmYWxzZTtcbiAgdmFyIGdhbWVSdW5uaW5nID0gZmFsc2U7XG4gIHdpbmRvdy5saWdodCA9IG5ldyBMaWdodCg1MCwgNTApO1xuXG4gIHNlbGYubGV2ZWwgPSBsZXZlbDtcblxuICB2YXIgbGFzdE1vdXNlQ2xpY2sgPSAwLFxuICAgICAgbW91c2VDbGlja0ludGVydmFsID0gMTAwMDsgLy8gMSBzZWNvbmQgdG8gY2xpY2sgYWdhaW5cblxuICB0aGlzLnJlbmRlcmVyLnZpZXcuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBmdW5jdGlvbihlKSB7XG4gICAgLy8gcHJldmVudCBjbGljayBvbiBmaXJzdCBsZXZlbFxuICAgIC8vIGlmICghc2VsZi5sZXZlbCkgeyByZXR1cm47IH1cblxuICAgIHZhciBjbGlja1RpbWUgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuXG4gICAgaWYgKGxhc3RNb3VzZUNsaWNrICsgbW91c2VDbGlja0ludGVydmFsID49IGNsaWNrVGltZSkge1xuICAgICAgLy8gZGlzc2FsbG93ZWRcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsYXN0TW91c2VDbGljayA9IGNsaWNrVGltZTtcblxuICAgIC8vIGxpZ2h0LnBvc2l0aW9uLnggPSBlLm9mZnNldFg7XG4gICAgLy8gbGlnaHQucG9zaXRpb24ueSA9IGUub2Zmc2V0WTtcblxuICAgIGlmIChzZWxmLmJ0blNvdW5kT24udmlzaWJsZSA9PT0gdHJ1ZSkge1xuICAgICAgaWYgKGUub2Zmc2V0WCA+PSBzZWxmLmJ0blNvdW5kT24ueCAmJiBlLm9mZnNldFggPCBzZWxmLmJ0blNvdW5kT24ueCArIHNlbGYuYnRuU291bmRPbi53aWR0aFxuICAgICAgICAmJiBlLm9mZnNldFkgPj0gc2VsZi5idG5Tb3VuZE9uLnkgJiYgZS5vZmZzZXRZIDwgc2VsZi5idG5Tb3VuZE9uLnkgKyBzZWxmLmJ0blNvdW5kT24uaGVpZ2h0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2VsZi5idG5Tb3VuZE9mZi52aXNpYmxlID09PSB0cnVlKSB7XG4gICAgICBpZiAoZS5vZmZzZXRYID49IHNlbGYuYnRuU291bmRPZmYueCAmJiBlLm9mZnNldFggPCBzZWxmLmJ0blNvdW5kT2ZmLnggKyBzZWxmLmJ0blNvdW5kT2ZmLndpZHRoXG4gICAgICAgICYmIGUub2Zmc2V0WSA+PSBzZWxmLmJ0blNvdW5kT2ZmLnkgJiYgZS5vZmZzZXRZIDwgc2VsZi5idG5Tb3VuZE9mZi55ICsgc2VsZi5idG5Tb3VuZE9mZi5oZWlnaHQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzZWxmLmJ0blJlc3RhcnQudmlzaWJsZSA9PT0gdHJ1ZSkge1xuICAgICAgaWYgKGUub2Zmc2V0WCA+PSBzZWxmLmJ0blJlc3RhcnQueCAmJiBlLm9mZnNldFggPCBzZWxmLmJ0blJlc3RhcnQueCArIHNlbGYuYnRuUmVzdGFydC53aWR0aFxuICAgICAgICAmJiBlLm9mZnNldFkgPj0gc2VsZi5idG5SZXN0YXJ0LnkgJiYgZS5vZmZzZXRZIDwgc2VsZi5idG5SZXN0YXJ0LnkgKyBzZWxmLmJ0blJlc3RhcnQuaGVpZ2h0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2VsZi5sZXZlbCAhPT0gbnVsbCkge1xuICAgICAgZ2FtZS5yZXNvdXJjZXMubW90aGVyU291bmQucGxheSgpO1xuICAgIH1cblxuICAgIHZhciBkZXN0ID0geyB4OmUub2Zmc2V0WCwgeTplLm9mZnNldFkgfTtcbiAgICB2YXIgdHdlZW5hYmxlID0gbmV3IFR3ZWVuYWJsZSgpO1xuICAgIHR3ZWVuYWJsZS50d2Vlbih7XG4gICAgICBmcm9tOiBsaWdodC5wb3NpdGlvbixcbiAgICAgIHRvOiAgIGRlc3QsXG4gICAgICBkdXJhdGlvbjogbW91c2VDbGlja0ludGVydmFsLFxuICAgICAgZWFzaW5nOiAnZWFzZU91dEN1YmljJyxcbiAgICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG1vdmluZyA9IHRydWU7XG4gICAgICB9LFxuICAgICAgZmluaXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG1vdmluZyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9KVxuXG4gIHZhciBsaWdodEdyYXBoaWNzID0gbmV3IFBJWEkuR3JhcGhpY3MoKSxcbiAgbGlnaHRDb250YWluZXIgPSBuZXcgUElYSS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG5cbiAgdGhpcy5yZXN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGkgPSBzZWxmLmxldmVsLmluZGV4O1xuICAgIHNlbGYubGV2ZWwuZGlzcG9zZSgpO1xuICAgIHRoaXMubG9hZExldmVsKGkpO1xuICB9XG5cbiAgdGhpcy5uZXh0TGV2ZWwgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxvYWRMZXZlbCh0aGlzLmxldmVsLmluZGV4ICsgMSk7XG4gIH1cblxuICB0aGlzLnNldExldmVsID0gZnVuY3Rpb24obGV2ZWxEYXRhLCBsZXZlbEluZGV4KSB7XG4gICAgdmFyIGggPSBzZWxmLnJlbmRlcmVyLmhlaWdodCArIDgwLFxuICAgICAgICB3ID0gc2VsZi5yZW5kZXJlci53aWR0aCxcbiAgICAgICAgZnJhbWVCb3JkZXIgPSA1MDtcblxuICAgIHZhciBuZXdMZXZlbCA9IG5ldyBMZXZlbChzZWxmLCBsZXZlbEluZGV4KTtcblxuICAgIC8vIGFkZCBzdGFnZSBib3JkZXIgdG8gbGV2ZWwgc2VnbWVudHNcbiAgICBuZXdMZXZlbC5zZWdtZW50cy51bnNoaWZ0KCB7YTp7eDotZnJhbWVCb3JkZXIseTotZnJhbWVCb3JkZXJ9LCBiOnt4OncseTotZnJhbWVCb3JkZXJ9fSApO1xuICAgIG5ld0xldmVsLnNlZ21lbnRzLnVuc2hpZnQoIHthOnt4OncseTotZnJhbWVCb3JkZXJ9LCBiOnt4OncseTpofX0gKTtcbiAgICBuZXdMZXZlbC5zZWdtZW50cy51bnNoaWZ0KCB7YTp7eDp3LHk6aH0sIGI6e3g6LWZyYW1lQm9yZGVyLHk6aH19ICk7XG4gICAgbmV3TGV2ZWwuc2VnbWVudHMudW5zaGlmdCgge2E6e3g6LWZyYW1lQm9yZGVyLHk6aH0sIGI6e3g6LWZyYW1lQm9yZGVyLHk6LWZyYW1lQm9yZGVyfX0gKTtcblxuICAgIG5ld0xldmVsLnBhcnNlKGxldmVsRGF0YSk7XG5cbiAgICBzZWxmLmxldmVsID0gbmV3TGV2ZWw7XG4gICAgc2VsZi5zdGFnZS5hZGRDaGlsZEF0KHNlbGYubGV2ZWwudmlldywgMCk7XG5cbiAgICBsaWdodC5zZXRTZWdtZW50cyhuZXdMZXZlbC5zZWdtZW50cyk7XG5cbiAgICAvLyBhZGQgbGV2ZWwgY29udGFpbmVyIHRvIHN0YWdlLlxuICAgIGdhbWUuc3RhZ2UuYWRkQ2hpbGQobmV3TGV2ZWwuY29udGFpbmVyKTtcblxuICAgIC8vIHJlLWNyZWF0ZSB0aGUgcGxheWVyXG4gICAgcGxheWVyID0gbmV3IFBsYXllcihuZXdMZXZlbC5jb250YWluZXIsIG5ld0xldmVsLnBsYXllclBvcy54LG5ld0xldmVsLnBsYXllclBvcy55KTtcbiAgICBwaHlzaWNzLnBsYXllclBvc2l0aW9uLnggPSBwbGF5ZXIudmlldy5wb3NpdGlvbi54O1xuICAgIHBoeXNpY3MucGxheWVyUG9zaXRpb24ueSA9IHBsYXllci52aWV3LnBvc2l0aW9uLnk7XG5cbiAgICAvLyBjb25zb2xlLmxvZyhuZXdMZXZlbC5wbGF5ZXJQb3MueCArIFwiIFwiICsgbmV3TGV2ZWwucGxheWVyUG9zLnkpO1xuICAgIHNlbGYucGxheWVyID0gcGxheWVyO1xuXG4gICAgc2VsZi5sb29wKCk7XG4gICAgc2VsZi5zdGFnZS5hZGRDaGlsZChnbG93KTtcbiAgfTtcblxuICB0aGlzLmxvYWRMZXZlbCA9IGZ1bmN0aW9uKGxldmVsSW5kZXgpIHtcbiAgICBpZighaW5wdXQpXG4gICAge1xuICAgICAgaW5wdXQgPSBuZXcgR2FtZUlucHV0KCk7XG4gICAgICBzZWxmLmlucHV0ID0gaW5wdXQ7XG4gICAgfVxuXG4gICAgaWYgKCFwaHlzaWNzKXtcbiAgICAgIHBoeXNpY3MgPSBuZXcgUGh5c2ljcygpO1xuICAgIH1cblxuICAgIC8vIGxldmVsSW5kZXggPSAyO1xuICAgIC8vIGNvbnNvbGUubG9nKFwibGV2ZWwvbGV2ZWxcIiArIGxldmVsSW5kZXggKyBcIi5qc29uXCIpO1xuICAgIHZhciBwaXhpTG9hZGVyID0gbmV3IFBJWEkuSnNvbkxvYWRlcihcImxldmVsL2xldmVsXCIgKyBsZXZlbEluZGV4ICsgXCIuanNvblwiKTtcbiAgICBwaXhpTG9hZGVyLm9uKCdsb2FkZWQnLCBmdW5jdGlvbihldnQpIHtcbiAgICAgIC8vZGF0YSBpcyBpbiBldnQuY29udGVudC5qc29uXG4gICAgICAvLyBjb25zb2xlLmxvZyhcImpzb24gbG9hZGVkIVwiKTtcbiAgICAgIHNlbGYuc2V0TGV2ZWwoZXZ0LmNvbnRlbnQuanNvbiwgbGV2ZWxJbmRleCk7XG4gICAgICBnYW1lUnVubmluZyA9IHRydWU7XG4gICAgICBsb3N0ID0gZmFsc2U7XG4gICAgfSk7XG5cbiAgICBwaXhpTG9hZGVyLmxvYWQoKTtcbiAgfVxuXG4gIHZhciBsYXN0TGlnaHRYLCBsYXN0TGlnaHRZO1xuXG4gIHRoaXMudXBkYXRlTGlnaHRzID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gbm90aGluZyB0byB1cGRhdGUsIHNraXBcblxuICAgIGlmIChsaWdodC5wb3NpdGlvbi54ID09IGxhc3RMaWdodFggJiYgbGlnaHQucG9zaXRpb24ueSA9PSBsYXN0TGlnaHRZKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRklYTUVcbiAgICBpZiAobGlnaHQuc2VnbWVudHMubGVuZ3RoID09IDAgfHwgIXRoaXMubGV2ZWwgfHwgdGhpcy5sZXZlbC5zZWdtZW50cy5sZW5ndGggPT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxpZ2h0R3JhcGhpY3MuY2xlYXIoKTtcblxuICAgIC8vIHJlbW92ZSBwcmV2aW91cyBhZGRlZCBsaWdodCBpdGVtc1xuICAgIGlmIChsaWdodENvbnRhaW5lci5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICBsaWdodENvbnRhaW5lci5yZW1vdmVDaGlsZHJlbigpO1xuICAgIH1cblxuICAgIC8vIFNpZ2h0IFBvbHlnb25zXG4gICAgdmFyIHBvbHlnb25zID0gbGlnaHQuZ2V0U2lnaHRQb2x5Z29ucygpO1xuXG4gICAgLy8gRFJBVyBBUyBBIEdJQU5UIFBPTFlHT05cblxuICAgIHZhciB2ZXJ0aWNlcyA9IHBvbHlnb25zWzBdO1xuICAgIHdpbmRvdy5wb2x5Z29ucyA9IHBvbHlnb25zWzBdO1xuXG4gICAgLy8gbGlnaHRHcmFwaGljcy5jbGVhcigpO1xuICAgIC8vIGxpZ2h0R3JhcGhpY3MuYmVnaW5GaWxsKDB4RkZGRkZGKTtcbiAgICAvLyBsaWdodEdyYXBoaWNzLm1vdmVUbyh2ZXJ0aWNlc1swXS54LCB2ZXJ0aWNlc1swXS55KTtcbiAgICAvLyBmb3IgKHZhciBpID0gMTsgaTx2ZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xuICAgIC8vICAgdmFyIHYgPSB2ZXJ0aWNlc1tpXTtcbiAgICAvLyAgIGxpZ2h0R3JhcGhpY3MubGluZVRvKHYueCwgdi55KTtcbiAgICAvLyB9XG4gICAgLy8gbGlnaHRHcmFwaGljcy5lbmRGaWxsKCk7XG5cbiAgICBsaWdodEdyYXBoaWNzLmNsZWFyKCk7XG4gICAgbGlnaHRHcmFwaGljcy5iZWdpbkZpbGwoMHhGRkZGRkYpO1xuICAgIGxpZ2h0R3JhcGhpY3MubW92ZVRvKHZlcnRpY2VzWzBdLngsIHZlcnRpY2VzWzBdLnkpO1xuICAgIGZvciAodmFyIGkgPSAxOyBpPHZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdiA9IHZlcnRpY2VzW2ldO1xuICAgICAgbGlnaHRHcmFwaGljcy5saW5lVG8odi54LCB2LnkpO1xuICAgIH1cbiAgICBsaWdodEdyYXBoaWNzLmVuZEZpbGwoKTtcblxuICAgIC8vIG92ZXJsYXAuYWRkQ2hpbGQobGlnaHRHcmFwaGljcyk7XG4gICAgLy8gb3ZlcmxhcFNoYXBlLm1hc2sgPSBsaWdodEdyYXBoaWNzO1xuXG4gICAgc2VsZi5sZXZlbC5iZzIubWFzayA9IGxpZ2h0R3JhcGhpY3M7XG4gICAgLy8gb3ZlcmxheS5tYXNrID0gbGlnaHRHcmFwaGljcztcblxuICAgIGxhc3RMaWdodFggPSBsaWdodC5wb3NpdGlvbi54O1xuICAgIGxhc3RMaWdodFkgPSBsaWdodC5wb3NpdGlvbi55O1xuICB9O1xuXG4gIHRoaXMudXBkYXRlID0gZnVuY3Rpb24oKSB7XG5cbiAgICBpZiAoc2VsZi5idG5SZXN0YXJ0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChzZWxmLmxldmVsID09PSBudWxsKSB7XG4gICAgICAgIHNlbGYuYnRuUmVzdGFydC52aXNpYmxlID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLmJ0blJlc3RhcnQudmlzaWJsZSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNlbGYuYmVnaW4pIHNlbGYuYmVnaW4udXBkYXRlKCk7XG4gICAgaWYgKHNlbGYuZ2FtZW92ZXIpIHNlbGYuZ2FtZW92ZXIudXBkYXRlKCk7XG5cbiAgICBpZiAoIWdhbWVSdW5uaW5nKSByZXR1cm47XG4gICAgdGhpcy51cGRhdGVMaWdodHMoKTtcblxuICAgIC8vIGNvbnNvbGUubG9nKGlucHV0ICsgXCIgXCIgKyBpbnB1dC5LZXkpO1xuICAgIGlmKCFpbnB1dClcbiAgICAgIHJldHVybjtcblxuICAgIGlmIChpbnB1dC5LZXkuaXNEb3duKGlucHV0LktleS5MRUZUKSB8fCBpbnB1dC5LZXkuaXNEb3duKGlucHV0LktleS5BKSlcbiAgICB7XG4gICAgICBkaXJlY3Rpb24gLT0gMC4wOTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaW5wdXQuS2V5LmlzRG93bihpbnB1dC5LZXkuUklHSFQpIHx8IGlucHV0LktleS5pc0Rvd24oaW5wdXQuS2V5LkQpKVxuICAgIHtcbiAgICAgIGRpcmVjdGlvbiArPSAwLjA5O1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgZGlyZWN0aW9uICo9IDAuOTtcbiAgICB9XG5cbiAgICBkaXJlY3Rpb24gPSBUb29scy5jbGFtcChkaXJlY3Rpb24sIC0xLCAxKTtcblxuICAgIGlmIChzZWxmLmxldmVsKVxuICAgIHtcbiAgICAgIGlmKHBoeXNpY3MpXG4gICAgICAgIHBoeXNpY3MucHJvY2VzcyhnYW1lLCBkaXJlY3Rpb24sIHdpbmRvdy5wb2x5Z29ucyk7XG5cbiAgICAgIGlmKHBsYXllcilcbiAgICAgICAgcGxheWVyLnVwZGF0ZShnYW1lLCBwaHlzaWNzLnBsYXllclBvc2l0aW9uLCBwaHlzaWNzLnBsYXllclZlbG9jaXR5KTtcblxuICAgICAgIHNlbGYubGV2ZWwudXBkYXRlKHNlbGYpO1xuXG4gICAgICAgaWYgKCFsb3N0ICYmIHBoeXNpY3MucGxheWVyUG9zaXRpb24ueSA+IHNjcmVlbkhlaWdodCArIDQwKSB0aGlzLmxvc2VHYW1lKCk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBsb29wQm91bmRlZCA9ICBmYWxzZSA7XG4gIHRoaXMubG9vcCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChsb29wQm91bmRlZCl7IHJldHVybjsgfVxuICAgIGxvb3BCb3VuZGVkID0gdHJ1ZTtcbiAgICByZXF1ZXN0QW5pbUZyYW1lKHNlbGYucmVuZGVyTG9vcCk7XG4gIH07XG5cbiAgdGhpcy5yZW5kZXJMb29wID0gZnVuY3Rpb24oKSB7XG4gICAgc2VsZi51cGRhdGUoKTsgLy8gbG9naWNcbiAgICBzZWxmLnJlbmRlcmVyLnJlbmRlcihzZWxmLnN0YWdlKTtcbiAgICByZXF1ZXN0QW5pbUZyYW1lKHNlbGYucmVuZGVyTG9vcCk7XG4gIH1cblxuICB0aGlzLmxvYWRQaXhpID0gZnVuY3Rpb24oKSB7XG4gICAgc2VsZi5pdGVtc0xvYWRlZCA9IDAsXG4gICAgc2VsZi5waXhpRmlsZXMgPSBzZWxmLnJlc291cmNlcy5nZXRQSVhJRmlsZXMoKSxcbiAgICBzZWxmLnNvdW5kRmlsZXMgPSBzZWxmLnJlc291cmNlcy5zb3VuZHMsXG4gICAgc2VsZi50b3RhbEl0ZW1zID0gc2VsZi5waXhpRmlsZXMubGVuZ3RoICsgc2VsZi5zb3VuZEZpbGVzLmxlbmd0aDtcbiAgICAvLyBsb2FkZXJcbiAgICBsb2FkZXIgPSBuZXcgUElYSS5Bc3NldExvYWRlcihzZWxmLnBpeGlGaWxlcyk7XG4gICAgbG9hZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ29uQ29tcGxldGUnLCBmdW5jdGlvbigpIHtcbiAgICAgIHNlbGYubG9hZFNvdW5kKCk7XG4gICAgfSk7XG4gICAgbG9hZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ29uUHJvZ3Jlc3MnLCBmdW5jdGlvbihlKSB7XG4gICAgICBzZWxmLml0ZW1zTG9hZGVkICs9IDE7XG4gICAgICBzZWxmLnByZWxvYWRlci5wcm9ncmVzcyhzZWxmLml0ZW1zTG9hZGVkLCBzZWxmLnRvdGFsSXRlbXMpO1xuICAgICAgaWYgKHR5cGVvZihlamVjdGEpIT09XCJ1bmRlZmluZWRcIikgeyByZXR1cm47IH07XG4gICAgfSk7XG5cbiAgICBsb2FkZXIubG9hZCgpO1xuICB9XG5cbiAgdGhpcy5sb2FkU291bmQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaSA9IChzZWxmLml0ZW1zTG9hZGVkIC0gc2VsZi5waXhpRmlsZXMubGVuZ3RoKSxcbiAgICAgIG9iaiA9IHNlbGYuc291bmRGaWxlc1tpXTtcbiAgICBzZWxmLnJlc291cmNlc1tvYmoubmFtZV0gPSBuZXcgSG93bCh7XG4gICAgICB1cmxzOiBvYmoudXJscyxcbiAgICAgIGF1dG9wbGF5OiBvYmouYXV0b1BsYXkgfHwgZmFsc2UsXG4gICAgICBsb29wOiBvYmoubG9vcCB8fCBmYWxzZSxcbiAgICAgIHZvbHVtZTogb2JqLnZvbHVtZSB8fCAxLFxuICAgICAgb25sb2FkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgc2VsZi5pdGVtc0xvYWRlZCsrO1xuICAgICAgICBzZWxmLnByZWxvYWRlci5wcm9ncmVzcyhzZWxmLml0ZW1zTG9hZGVkLCBzZWxmLnRvdGFsSXRlbXMpO1xuICAgICAgICBpZiAoc2VsZi5pdGVtc0xvYWRlZCA9PSBzZWxmLnRvdGFsSXRlbXMpIHtcbiAgICAgICAgICBzZWxmLmxvYWRlZCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlbGYubG9hZFNvdW5kKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHRoaXMubG9hZGVkID0gZnVuY3Rpb24oKSB7XG4gICAgc2VsZi5iZWdpbiA9IG5ldyBCZWdpbih0aGlzKTtcbiAgICBzZWxmLmxldmVsZW5kID0gbmV3IExldmVsRW5kKHRoaXMpO1xuICAgIHNlbGYuZ2FtZW92ZXIgPSBuZXcgR2FtZU92ZXIodGhpcyk7XG4gICAgc2VsZi5wcmVsb2FkZXIuaGlkZSgpO1xuICAgIHNlbGYuYmVnaW4uc2hvdygpO1xuICAgIGdhbWUucmVzb3VyY2VzLnNvdW5kTG9vcC5mYWRlSW4oLjQsIDIwMDApO1xuXG4gICAgZ2xvdyA9IFBJWEkuU3ByaXRlLmZyb21GcmFtZShcImdsb3cucG5nXCIpO1xuICAgIGdsb3cuc2NhbGUueCA9IDI7XG4gICAgZ2xvdy5zY2FsZS55ID0gMjtcbiAgICBzZWxmLnN0YWdlLmFkZENoaWxkKGdsb3cpO1xuICAgIGdsb3cuYWxwaGEgPSAwLjY1O1xuXG4gICAgc2VsZi5idG5Tb3VuZE9mZiA9IFBJWEkuU3ByaXRlLmZyb21GcmFtZSgnc291bmRPbi5wbmcnKTtcbiAgICBzZWxmLmJ0blNvdW5kT2ZmLnNldEludGVyYWN0aXZlKHRydWUpO1xuICAgIHNlbGYuYnRuU291bmRPZmYuYnV0dG9uTW9kZSA9IHRydWU7XG4gICAgc2VsZi5idG5Tb3VuZE9mZi5wb3NpdGlvbi54ID0gMTA7XG4gICAgc2VsZi5idG5Tb3VuZE9mZi5wb3NpdGlvbi55ID0gMTA7XG5cbiAgICBzZWxmLmJ0blNvdW5kT24gPSBQSVhJLlNwcml0ZS5mcm9tRnJhbWUoJ3NvdW5kT2ZmLnBuZycpO1xuICAgIHNlbGYuYnRuU291bmRPbi5zZXRJbnRlcmFjdGl2ZSh0cnVlKTtcbiAgICBzZWxmLmJ0blNvdW5kT24uYnV0dG9uTW9kZSA9IHRydWU7XG4gICAgc2VsZi5idG5Tb3VuZE9uLnBvc2l0aW9uLnggPSBzZWxmLmJ0blNvdW5kT2ZmLnBvc2l0aW9uLng7XG4gICAgc2VsZi5idG5Tb3VuZE9uLnBvc2l0aW9uLnkgPSBzZWxmLmJ0blNvdW5kT2ZmLnBvc2l0aW9uLnk7XG4gICAgc2VsZi5idG5Tb3VuZE9uLnZpc2libGUgPSBmYWxzZTtcblxuICAgIHNlbGYuc3RhZ2UuYWRkQ2hpbGQoZ2FtZS5idG5Tb3VuZE9mZik7XG4gICAgc2VsZi5zdGFnZS5hZGRDaGlsZChnYW1lLmJ0blNvdW5kT24pO1xuXG4gICAgc2VsZi5idG5Tb3VuZE9mZi5jbGljayA9IHNlbGYuYnRuU291bmRPZmYudGFwID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgc2VsZi5idG5Tb3VuZE9uLnZpc2libGUgPSB0cnVlO1xuICAgICAgc2VsZi5idG5Tb3VuZE9mZi52aXNpYmxlID0gZmFsc2U7XG4gICAgICBIb3dsZXIubXV0ZSgpO1xuICAgIH1cblxuICAgIHNlbGYuYnRuU291bmRPbi5jbGljayA9IHNlbGYuYnRuU291bmRPbi50YXAgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBzZWxmLmJ0blNvdW5kT24udmlzaWJsZSA9IGZhbHNlO1xuICAgICAgc2VsZi5idG5Tb3VuZE9mZi52aXNpYmxlID0gdHJ1ZTtcbiAgICAgIEhvd2xlci51bm11dGUoKTtcbiAgICB9XG5cbiAgICBzZWxmLmJ0blJlc3RhcnQgPSBQSVhJLlNwcml0ZS5mcm9tRnJhbWUoJ3Jlc3RhcnQucG5nJyk7XG4gICAgc2VsZi5idG5SZXN0YXJ0LnNldEludGVyYWN0aXZlKHRydWUpO1xuICAgIHNlbGYuYnRuUmVzdGFydC5idXR0b25Nb2RlID0gdHJ1ZTtcbiAgICBzZWxmLnN0YWdlLmFkZENoaWxkKGdhbWUuYnRuUmVzdGFydCk7XG4gICAgc2VsZi5idG5SZXN0YXJ0LnBvc2l0aW9uLnggPSBzZWxmLnJlbmRlcmVyLndpZHRoIC0gMTAgLSBzZWxmLmJ0blJlc3RhcnQud2lkdGg7XG4gICAgc2VsZi5idG5SZXN0YXJ0LnBvc2l0aW9uLnkgPSAxMDtcbiAgICBzZWxmLmJ0blJlc3RhcnQudmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgc2VsZi5idG5SZXN0YXJ0LmNsaWNrID0gc2VsZi5idG5SZXN0YXJ0LnRhcCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHNlbGYucmVzdGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMuc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaW1nc0FyciA9IFtdLCBpO1xuICAgIGxvc3QgPSBmYWxzZTtcbiAgICAvLyBzdGFydCBzY2VuZXNcbiAgICAvLyBzZWxmLnN0YWdlLmFkZENoaWxkKGxpZ2h0R3JhcGhpY3MpO1xuXG4gICAgLy8gc3RhcnQgc2NyZWVuc1xuXG4gICAgLy8gc3RhcnQgbG9vcFxuICAgIHNlbGYubG9vcCgpO1xuXG4gICAgLy9cbiAgICBzZWxmLnByZWxvYWRlciA9IG5ldyBQcmVsb2FkZXIodGhpcyk7XG5cbiAgICAvLyBGSVhNRVxuICAgIHNlbGYubG9hZFBpeGkoKTtcbiAgfTtcblxuICB0aGlzLmxvc2VHYW1lID0gZnVuY3Rpb24oKVxuICB7XG4gICAgaWYgKGxvc3QpIHJldHVybjtcbiAgICBsb3N0ID0gdHJ1ZTtcbiAgICBnYW1lUnVubmluZyA9IGZhbHNlO1xuICAgIHNlbGYuZ2FtZW92ZXIuc2hvdygpO1xuICB9XG5cbiAgdGhpcy5nb1RvQmVnaW5uaW5nID0gZnVuY3Rpb24oKVxuICB7XG4gICAgLy8gZ2FtZS5sb2FkTGV2ZWwoMSk7XG4gICAgZ2FtZS5sZXZlbC5kaXNwb3NlKCk7XG4gICAgZ2FtZS5sZXZlbC5pbmRleCA9IDA7XG4gICAgZ2FtZS5sZXZlbCA9IG51bGw7XG5cbiAgICBzZWxmLmJlZ2luLnNob3coKTtcbiAgfVxuXG4gIHZhciBwaHJhc2UxID0gbnVsbDtcbiAgdmFyIHBocmFzZTIgPSBudWxsO1xuICB2YXIgcGhyYXNlMyA9IG51bGw7XG4gIHRoaXMuc2hvd0VuZFN0b3J5ID0gZnVuY3Rpb24oKVxuICB7XG4gICAgLy8gY29uc29sZS5sb2coXCJzaG93IGVuZCBzdG9yeVwiLCBnYW1lUnVubmluZyk7XG5cbiAgICBpZighZ2FtZVJ1bm5pbmcpXG4gICAgICByZXR1cm47XG5cbiAgICBnYW1lUnVubmluZyA9IGZhbHNlO1xuXG4gICAgcGhyYXNlMSA9IG5ldyBQSVhJLlRleHQoJ0hNTU0uLi5NWSBIRUFELi4uV0hBVCBIQVBQRU5FRD8nLCB7XG4gICAgICBmb250OiAnMjJweCBSb2traXR0JyxcbiAgICAgIGZpbGw6ICcjRkZGRkZGJyxcbiAgICAgIGFsaWduOiAnY2VudGVyJ1xuICAgIH0pO1xuXG4gICAgcGhyYXNlMiA9IG5ldyBQSVhJLlRleHQoJ01PTT8uLi5NT00/ISBOTyEhIScsIHtcbiAgICAgIGZvbnQ6ICcyMnB4IFJva2tpdHQnLFxuICAgICAgZmlsbDogJyNGRkZGRkYnLFxuICAgICAgYWxpZ246ICdjZW50ZXInXG4gICAgfSk7XG5cbiAgICBwaHJhc2UzID0gbmV3IFBJWEkuVGV4dCgnQlVULi4uV0FJVC4uLlRIQVQgTElHSFQsIElUIFdBUyBZT1U/Jywge1xuICAgICAgZm9udDogJzIycHggUm9ra2l0dCcsXG4gICAgICBmaWxsOiAnI0ZGRkZGRicsXG4gICAgICBhbGlnbjogJ2NlbnRlcidcbiAgICB9KTtcblxuICAgIHBocmFzZTEuYWxwaGEgPSAwO1xuICAgIHBocmFzZTIuYWxwaGEgPSAwO1xuICAgIHBocmFzZTMuYWxwaGEgPSAwO1xuXG4gICAgcGhyYXNlMS5wb3NpdGlvbi54ID0gKHNlbGYucmVuZGVyZXIud2lkdGggLyAyKSAtIChwaHJhc2UxLndpZHRoIC8gMik7XG4gICAgcGhyYXNlMS5wb3NpdGlvbi55ID0gc2VsZi5yZW5kZXJlci5oZWlnaHQgLyAyIC0gNjA7XG4gICAgc2VsZi5zdGFnZS5hZGRDaGlsZChwaHJhc2UxKTtcblxuICAgIHBocmFzZTIucG9zaXRpb24ueCA9IChzZWxmLnJlbmRlcmVyLndpZHRoIC8gMikgLSAocGhyYXNlMi53aWR0aCAvIDIpO1xuICAgIHBocmFzZTIucG9zaXRpb24ueSA9IHNlbGYucmVuZGVyZXIuaGVpZ2h0IC8gMiAtIDEwO1xuICAgIHNlbGYuc3RhZ2UuYWRkQ2hpbGQocGhyYXNlMik7XG5cbiAgICBwaHJhc2UzLnBvc2l0aW9uLnggPSAoc2VsZi5yZW5kZXJlci53aWR0aCAvIDIpIC0gKHBocmFzZTMud2lkdGggLyAyKTtcbiAgICBwaHJhc2UzLnBvc2l0aW9uLnkgPSBzZWxmLnJlbmRlcmVyLmhlaWdodCAvIDIgKyA0MDtcbiAgICBzZWxmLnN0YWdlLmFkZENoaWxkKHBocmFzZTMpO1xuXG5cbiAgICB2YXIgdHdlZW5hYmxlID0gbmV3IFR3ZWVuYWJsZSgpO1xuICAgIHR3ZWVuYWJsZS50d2Vlbih7XG4gICAgICBmcm9tOiB7YWxwaGE6MH0sXG4gICAgICB0bzogICB7YWxwaGE6MX0sXG4gICAgICBkdXJhdGlvbjogNTAwLFxuICAgICAgZWFzaW5nOiAnZWFzZU91dEN1YmljJyxcbiAgICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB9LFxuICAgICAgc3RlcDogZnVuY3Rpb24oc3RhdGUpe1xuICAgICAgICBwaHJhc2UxLmFscGhhID0gc3RhdGUuYWxwaGE7XG4gICAgICB9LFxuICAgICAgZmluaXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgdHdlZW5hYmxlID0gbmV3IFR3ZWVuYWJsZSgpO1xuICAgIHR3ZWVuYWJsZS50d2Vlbih7XG4gICAgICBmcm9tOiB7YWxwaGE6MH0sXG4gICAgICB0bzogICB7YWxwaGE6MX0sXG4gICAgICBkdXJhdGlvbjogNTAwLFxuICAgICAgZWFzaW5nOiAnZWFzZU91dEN1YmljJyxcbiAgICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB9LFxuICAgICAgc3RlcDogZnVuY3Rpb24oc3RhdGUpe1xuICAgICAgICBwaHJhc2UyLmFscGhhID0gc3RhdGUuYWxwaGE7XG4gICAgICB9LFxuICAgICAgZmluaXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgdHdlZW5hYmxlID0gbmV3IFR3ZWVuYWJsZSgpO1xuICAgIHR3ZWVuYWJsZS50d2Vlbih7XG4gICAgICBmcm9tOiB7YWxwaGE6MH0sXG4gICAgICB0bzogICB7YWxwaGE6MX0sXG4gICAgICBkdXJhdGlvbjogNTAwLFxuICAgICAgZWFzaW5nOiAnZWFzZU91dEN1YmljJyxcbiAgICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB9LFxuICAgICAgc3RlcDogZnVuY3Rpb24oc3RhdGUpe1xuICAgICAgICBwaHJhc2UzLmFscGhhID0gc3RhdGUuYWxwaGE7XG4gICAgICB9LFxuICAgICAgZmluaXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICB9XG4gICAgfSk7XG5cblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHNlbGYuc3RhZ2UucmVtb3ZlQ2hpbGQocGhyYXNlMSk7XG4gICAgICBzZWxmLnN0YWdlLnJlbW92ZUNoaWxkKHBocmFzZTIpO1xuICAgICAgc2VsZi5zdGFnZS5yZW1vdmVDaGlsZChwaHJhc2UzKTtcbiAgICAgIHNlbGYuZ29Ub0JlZ2lubmluZygpO1xuICAgIH0sODAwMCk7XG5cbiAgICBzZWxmLmdhbWVSdW5uaW5nID0gZmFsc2U7XG4gIH1cblxuICB0aGlzLnN0YXJ0KCk7XG59XG4iLCJ2YXIgR2FtZSA9IHJlcXVpcmUoJy4vR2FtZScpLFxuICAgIFR3ZWVuYWJsZSA9IHJlcXVpcmUoJy4vdmVuZG9yL3NoaWZ0eScpLFxuICAgIEV2ZW50RW1pdHRlcjIgPSByZXF1aXJlKCcuL3ZlbmRvci9FdmVudEVtaXR0ZXIyJykuRXZlbnRFbWl0dGVyMixcbiAgICBnYW1lO1xuXG4vLyBodHRwOi8vY3ViaWMtYmV6aWVyLmNvbS8jLjkyLC4zNCwuNiwuOFxuVHdlZW5hYmxlLnNldEJlemllckZ1bmN0aW9uKFwiY3VzdG9tQmV6aWVyXCIsIC45MiwuMzQsLjYsLjgpO1xuXG4vLyBFdmVudCBiZXR3ZWVuIG9iamVjdHNcbndpbmRvdy5lbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcjIoKTtcblxuY29uc29sZS5sb2coXCJPbmVcIik7XG5cbi8vIEluaXRcbmlmICh0eXBlb2YoZWplY3RhKSE9PVwidW5kZWZpbmVkXCIpIHtcbiAgZ2FtZSA9IEdhbWUuaW5zdGFuY2UgPSBuZXcgR2FtZSgpO1xuXG59IGVsc2Uge1xuXG5XZWJGb250Q29uZmlnID0ge1xuICBnb29nbGU6IHtcbiAgICBmYW1pbGllczogWydSb2traXR0J11cbiAgfSxcblxuICBhY3RpdmU6IGZ1bmN0aW9uKCkge1xuICAgIC8vIGRvIHNvbWV0aGluZ1xuICAgIGdhbWUgPSBHYW1lLmluc3RhbmNlID0gbmV3IEdhbWUoKTtcbiAgfVxuICB9O1xuICAoZnVuY3Rpb24oKSB7XG4gIHZhciB3ZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICB3Zi5zcmMgPSAoJ2h0dHBzOicgPT0gZG9jdW1lbnQubG9jYXRpb24ucHJvdG9jb2wgPyAnaHR0cHMnIDogJ2h0dHAnKSArXG4gICAgICAnOi8vYWpheC5nb29nbGVhcGlzLmNvbS9hamF4L2xpYnMvd2ViZm9udC8xL3dlYmZvbnQuanMnO1xuICB3Zi50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG4gIHdmLmFzeW5jID0gJ3RydWUnO1xuICB2YXIgcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcbiAgcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh3Ziwgcyk7XG59KSgpO1xuXG59XG4iLCIvKiFcbiAqIEV2ZW50RW1pdHRlcjJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9oaWoxbngvRXZlbnRFbWl0dGVyMlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxMyBoaWoxbnhcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqL1xuOyFmdW5jdGlvbih1bmRlZmluZWQpIHtcblxuICB2YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgPyBBcnJheS5pc0FycmF5IDogZnVuY3Rpb24gX2lzQXJyYXkob2JqKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSBcIltvYmplY3QgQXJyYXldXCI7XG4gIH07XG4gIHZhciBkZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBpZiAodGhpcy5fY29uZikge1xuICAgICAgY29uZmlndXJlLmNhbGwodGhpcywgdGhpcy5fY29uZik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY29uZmlndXJlKGNvbmYpIHtcbiAgICBpZiAoY29uZikge1xuXG4gICAgICB0aGlzLl9jb25mID0gY29uZjtcblxuICAgICAgY29uZi5kZWxpbWl0ZXIgJiYgKHRoaXMuZGVsaW1pdGVyID0gY29uZi5kZWxpbWl0ZXIpO1xuICAgICAgY29uZi5tYXhMaXN0ZW5lcnMgJiYgKHRoaXMuX2V2ZW50cy5tYXhMaXN0ZW5lcnMgPSBjb25mLm1heExpc3RlbmVycyk7XG4gICAgICBjb25mLndpbGRjYXJkICYmICh0aGlzLndpbGRjYXJkID0gY29uZi53aWxkY2FyZCk7XG4gICAgICBjb25mLm5ld0xpc3RlbmVyICYmICh0aGlzLm5ld0xpc3RlbmVyID0gY29uZi5uZXdMaXN0ZW5lcik7XG5cbiAgICAgIGlmICh0aGlzLndpbGRjYXJkKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJUcmVlID0ge307XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gRXZlbnRFbWl0dGVyKGNvbmYpIHtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICB0aGlzLm5ld0xpc3RlbmVyID0gZmFsc2U7XG4gICAgY29uZmlndXJlLmNhbGwodGhpcywgY29uZik7XG4gIH1cblxuICAvL1xuICAvLyBBdHRlbnRpb24sIGZ1bmN0aW9uIHJldHVybiB0eXBlIG5vdyBpcyBhcnJheSwgYWx3YXlzICFcbiAgLy8gSXQgaGFzIHplcm8gZWxlbWVudHMgaWYgbm8gYW55IG1hdGNoZXMgZm91bmQgYW5kIG9uZSBvciBtb3JlXG4gIC8vIGVsZW1lbnRzIChsZWFmcykgaWYgdGhlcmUgYXJlIG1hdGNoZXNcbiAgLy9cbiAgZnVuY3Rpb24gc2VhcmNoTGlzdGVuZXJUcmVlKGhhbmRsZXJzLCB0eXBlLCB0cmVlLCBpKSB7XG4gICAgaWYgKCF0cmVlKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIHZhciBsaXN0ZW5lcnM9W10sIGxlYWYsIGxlbiwgYnJhbmNoLCB4VHJlZSwgeHhUcmVlLCBpc29sYXRlZEJyYW5jaCwgZW5kUmVhY2hlZCxcbiAgICAgICAgdHlwZUxlbmd0aCA9IHR5cGUubGVuZ3RoLCBjdXJyZW50VHlwZSA9IHR5cGVbaV0sIG5leHRUeXBlID0gdHlwZVtpKzFdO1xuICAgIGlmIChpID09PSB0eXBlTGVuZ3RoICYmIHRyZWUuX2xpc3RlbmVycykge1xuICAgICAgLy9cbiAgICAgIC8vIElmIGF0IHRoZSBlbmQgb2YgdGhlIGV2ZW50KHMpIGxpc3QgYW5kIHRoZSB0cmVlIGhhcyBsaXN0ZW5lcnNcbiAgICAgIC8vIGludm9rZSB0aG9zZSBsaXN0ZW5lcnMuXG4gICAgICAvL1xuICAgICAgaWYgKHR5cGVvZiB0cmVlLl9saXN0ZW5lcnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgaGFuZGxlcnMgJiYgaGFuZGxlcnMucHVzaCh0cmVlLl9saXN0ZW5lcnMpO1xuICAgICAgICByZXR1cm4gW3RyZWVdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChsZWFmID0gMCwgbGVuID0gdHJlZS5fbGlzdGVuZXJzLmxlbmd0aDsgbGVhZiA8IGxlbjsgbGVhZisrKSB7XG4gICAgICAgICAgaGFuZGxlcnMgJiYgaGFuZGxlcnMucHVzaCh0cmVlLl9saXN0ZW5lcnNbbGVhZl0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbdHJlZV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKChjdXJyZW50VHlwZSA9PT0gJyonIHx8IGN1cnJlbnRUeXBlID09PSAnKionKSB8fCB0cmVlW2N1cnJlbnRUeXBlXSkge1xuICAgICAgLy9cbiAgICAgIC8vIElmIHRoZSBldmVudCBlbWl0dGVkIGlzICcqJyBhdCB0aGlzIHBhcnRcbiAgICAgIC8vIG9yIHRoZXJlIGlzIGEgY29uY3JldGUgbWF0Y2ggYXQgdGhpcyBwYXRjaFxuICAgICAgLy9cbiAgICAgIGlmIChjdXJyZW50VHlwZSA9PT0gJyonKSB7XG4gICAgICAgIGZvciAoYnJhbmNoIGluIHRyZWUpIHtcbiAgICAgICAgICBpZiAoYnJhbmNoICE9PSAnX2xpc3RlbmVycycgJiYgdHJlZS5oYXNPd25Qcm9wZXJ0eShicmFuY2gpKSB7XG4gICAgICAgICAgICBsaXN0ZW5lcnMgPSBsaXN0ZW5lcnMuY29uY2F0KHNlYXJjaExpc3RlbmVyVHJlZShoYW5kbGVycywgdHlwZSwgdHJlZVticmFuY2hdLCBpKzEpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxpc3RlbmVycztcbiAgICAgIH0gZWxzZSBpZihjdXJyZW50VHlwZSA9PT0gJyoqJykge1xuICAgICAgICBlbmRSZWFjaGVkID0gKGkrMSA9PT0gdHlwZUxlbmd0aCB8fCAoaSsyID09PSB0eXBlTGVuZ3RoICYmIG5leHRUeXBlID09PSAnKicpKTtcbiAgICAgICAgaWYoZW5kUmVhY2hlZCAmJiB0cmVlLl9saXN0ZW5lcnMpIHtcbiAgICAgICAgICAvLyBUaGUgbmV4dCBlbGVtZW50IGhhcyBhIF9saXN0ZW5lcnMsIGFkZCBpdCB0byB0aGUgaGFuZGxlcnMuXG4gICAgICAgICAgbGlzdGVuZXJzID0gbGlzdGVuZXJzLmNvbmNhdChzZWFyY2hMaXN0ZW5lclRyZWUoaGFuZGxlcnMsIHR5cGUsIHRyZWUsIHR5cGVMZW5ndGgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoYnJhbmNoIGluIHRyZWUpIHtcbiAgICAgICAgICBpZiAoYnJhbmNoICE9PSAnX2xpc3RlbmVycycgJiYgdHJlZS5oYXNPd25Qcm9wZXJ0eShicmFuY2gpKSB7XG4gICAgICAgICAgICBpZihicmFuY2ggPT09ICcqJyB8fCBicmFuY2ggPT09ICcqKicpIHtcbiAgICAgICAgICAgICAgaWYodHJlZVticmFuY2hdLl9saXN0ZW5lcnMgJiYgIWVuZFJlYWNoZWQpIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnMgPSBsaXN0ZW5lcnMuY29uY2F0KHNlYXJjaExpc3RlbmVyVHJlZShoYW5kbGVycywgdHlwZSwgdHJlZVticmFuY2hdLCB0eXBlTGVuZ3RoKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgbGlzdGVuZXJzID0gbGlzdGVuZXJzLmNvbmNhdChzZWFyY2hMaXN0ZW5lclRyZWUoaGFuZGxlcnMsIHR5cGUsIHRyZWVbYnJhbmNoXSwgaSkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmKGJyYW5jaCA9PT0gbmV4dFR5cGUpIHtcbiAgICAgICAgICAgICAgbGlzdGVuZXJzID0gbGlzdGVuZXJzLmNvbmNhdChzZWFyY2hMaXN0ZW5lclRyZWUoaGFuZGxlcnMsIHR5cGUsIHRyZWVbYnJhbmNoXSwgaSsyKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBObyBtYXRjaCBvbiB0aGlzIG9uZSwgc2hpZnQgaW50byB0aGUgdHJlZSBidXQgbm90IGluIHRoZSB0eXBlIGFycmF5LlxuICAgICAgICAgICAgICBsaXN0ZW5lcnMgPSBsaXN0ZW5lcnMuY29uY2F0KHNlYXJjaExpc3RlbmVyVHJlZShoYW5kbGVycywgdHlwZSwgdHJlZVticmFuY2hdLCBpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsaXN0ZW5lcnM7XG4gICAgICB9XG5cbiAgICAgIGxpc3RlbmVycyA9IGxpc3RlbmVycy5jb25jYXQoc2VhcmNoTGlzdGVuZXJUcmVlKGhhbmRsZXJzLCB0eXBlLCB0cmVlW2N1cnJlbnRUeXBlXSwgaSsxKSk7XG4gICAgfVxuXG4gICAgeFRyZWUgPSB0cmVlWycqJ107XG4gICAgaWYgKHhUcmVlKSB7XG4gICAgICAvL1xuICAgICAgLy8gSWYgdGhlIGxpc3RlbmVyIHRyZWUgd2lsbCBhbGxvdyBhbnkgbWF0Y2ggZm9yIHRoaXMgcGFydCxcbiAgICAgIC8vIHRoZW4gcmVjdXJzaXZlbHkgZXhwbG9yZSBhbGwgYnJhbmNoZXMgb2YgdGhlIHRyZWVcbiAgICAgIC8vXG4gICAgICBzZWFyY2hMaXN0ZW5lclRyZWUoaGFuZGxlcnMsIHR5cGUsIHhUcmVlLCBpKzEpO1xuICAgIH1cblxuICAgIHh4VHJlZSA9IHRyZWVbJyoqJ107XG4gICAgaWYoeHhUcmVlKSB7XG4gICAgICBpZihpIDwgdHlwZUxlbmd0aCkge1xuICAgICAgICBpZih4eFRyZWUuX2xpc3RlbmVycykge1xuICAgICAgICAgIC8vIElmIHdlIGhhdmUgYSBsaXN0ZW5lciBvbiBhICcqKicsIGl0IHdpbGwgY2F0Y2ggYWxsLCBzbyBhZGQgaXRzIGhhbmRsZXIuXG4gICAgICAgICAgc2VhcmNoTGlzdGVuZXJUcmVlKGhhbmRsZXJzLCB0eXBlLCB4eFRyZWUsIHR5cGVMZW5ndGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQnVpbGQgYXJyYXlzIG9mIG1hdGNoaW5nIG5leHQgYnJhbmNoZXMgYW5kIG90aGVycy5cbiAgICAgICAgZm9yKGJyYW5jaCBpbiB4eFRyZWUpIHtcbiAgICAgICAgICBpZihicmFuY2ggIT09ICdfbGlzdGVuZXJzJyAmJiB4eFRyZWUuaGFzT3duUHJvcGVydHkoYnJhbmNoKSkge1xuICAgICAgICAgICAgaWYoYnJhbmNoID09PSBuZXh0VHlwZSkge1xuICAgICAgICAgICAgICAvLyBXZSBrbm93IHRoZSBuZXh0IGVsZW1lbnQgd2lsbCBtYXRjaCwgc28ganVtcCB0d2ljZS5cbiAgICAgICAgICAgICAgc2VhcmNoTGlzdGVuZXJUcmVlKGhhbmRsZXJzLCB0eXBlLCB4eFRyZWVbYnJhbmNoXSwgaSsyKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZihicmFuY2ggPT09IGN1cnJlbnRUeXBlKSB7XG4gICAgICAgICAgICAgIC8vIEN1cnJlbnQgbm9kZSBtYXRjaGVzLCBtb3ZlIGludG8gdGhlIHRyZWUuXG4gICAgICAgICAgICAgIHNlYXJjaExpc3RlbmVyVHJlZShoYW5kbGVycywgdHlwZSwgeHhUcmVlW2JyYW5jaF0sIGkrMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpc29sYXRlZEJyYW5jaCA9IHt9O1xuICAgICAgICAgICAgICBpc29sYXRlZEJyYW5jaFticmFuY2hdID0geHhUcmVlW2JyYW5jaF07XG4gICAgICAgICAgICAgIHNlYXJjaExpc3RlbmVyVHJlZShoYW5kbGVycywgdHlwZSwgeyAnKionOiBpc29sYXRlZEJyYW5jaCB9LCBpKzEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmKHh4VHJlZS5fbGlzdGVuZXJzKSB7XG4gICAgICAgIC8vIFdlIGhhdmUgcmVhY2hlZCB0aGUgZW5kIGFuZCBzdGlsbCBvbiBhICcqKidcbiAgICAgICAgc2VhcmNoTGlzdGVuZXJUcmVlKGhhbmRsZXJzLCB0eXBlLCB4eFRyZWUsIHR5cGVMZW5ndGgpO1xuICAgICAgfSBlbHNlIGlmKHh4VHJlZVsnKiddICYmIHh4VHJlZVsnKiddLl9saXN0ZW5lcnMpIHtcbiAgICAgICAgc2VhcmNoTGlzdGVuZXJUcmVlKGhhbmRsZXJzLCB0eXBlLCB4eFRyZWVbJyonXSwgdHlwZUxlbmd0aCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGxpc3RlbmVycztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdyb3dMaXN0ZW5lclRyZWUodHlwZSwgbGlzdGVuZXIpIHtcblxuICAgIHR5cGUgPSB0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycgPyB0eXBlLnNwbGl0KHRoaXMuZGVsaW1pdGVyKSA6IHR5cGUuc2xpY2UoKTtcblxuICAgIC8vXG4gICAgLy8gTG9va3MgZm9yIHR3byBjb25zZWN1dGl2ZSAnKionLCBpZiBzbywgZG9uJ3QgYWRkIHRoZSBldmVudCBhdCBhbGwuXG4gICAgLy9cbiAgICBmb3IodmFyIGkgPSAwLCBsZW4gPSB0eXBlLmxlbmd0aDsgaSsxIDwgbGVuOyBpKyspIHtcbiAgICAgIGlmKHR5cGVbaV0gPT09ICcqKicgJiYgdHlwZVtpKzFdID09PSAnKionKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgdHJlZSA9IHRoaXMubGlzdGVuZXJUcmVlO1xuICAgIHZhciBuYW1lID0gdHlwZS5zaGlmdCgpO1xuXG4gICAgd2hpbGUgKG5hbWUpIHtcblxuICAgICAgaWYgKCF0cmVlW25hbWVdKSB7XG4gICAgICAgIHRyZWVbbmFtZV0gPSB7fTtcbiAgICAgIH1cblxuICAgICAgdHJlZSA9IHRyZWVbbmFtZV07XG5cbiAgICAgIGlmICh0eXBlLmxlbmd0aCA9PT0gMCkge1xuXG4gICAgICAgIGlmICghdHJlZS5fbGlzdGVuZXJzKSB7XG4gICAgICAgICAgdHJlZS5fbGlzdGVuZXJzID0gbGlzdGVuZXI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZih0eXBlb2YgdHJlZS5fbGlzdGVuZXJzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdHJlZS5fbGlzdGVuZXJzID0gW3RyZWUuX2xpc3RlbmVycywgbGlzdGVuZXJdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlzQXJyYXkodHJlZS5fbGlzdGVuZXJzKSkge1xuXG4gICAgICAgICAgdHJlZS5fbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuXG4gICAgICAgICAgaWYgKCF0cmVlLl9saXN0ZW5lcnMud2FybmVkKSB7XG5cbiAgICAgICAgICAgIHZhciBtID0gZGVmYXVsdE1heExpc3RlbmVycztcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLl9ldmVudHMubWF4TGlzdGVuZXJzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICBtID0gdGhpcy5fZXZlbnRzLm1heExpc3RlbmVycztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG0gPiAwICYmIHRyZWUuX2xpc3RlbmVycy5sZW5ndGggPiBtKSB7XG5cbiAgICAgICAgICAgICAgdHJlZS5fbGlzdGVuZXJzLndhcm5lZCA9IHRydWU7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyZWUuX2xpc3RlbmVycy5sZW5ndGgpO1xuICAgICAgICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgbmFtZSA9IHR5cGUuc2hpZnQoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuXG4gIC8vIDEwIGxpc3RlbmVycyBhcmUgYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaFxuICAvLyBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbiAgLy9cbiAgLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4gIC8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuXG4gIEV2ZW50RW1pdHRlci5wcm90b3R5cGUuZGVsaW1pdGVyID0gJy4nO1xuXG4gIEV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICAgIHRoaXMuX2V2ZW50cyB8fCBpbml0LmNhbGwodGhpcyk7XG4gICAgdGhpcy5fZXZlbnRzLm1heExpc3RlbmVycyA9IG47XG4gICAgaWYgKCF0aGlzLl9jb25mKSB0aGlzLl9jb25mID0ge307XG4gICAgdGhpcy5fY29uZi5tYXhMaXN0ZW5lcnMgPSBuO1xuICB9O1xuXG4gIEV2ZW50RW1pdHRlci5wcm90b3R5cGUuZXZlbnQgPSAnJztcblxuICBFdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbihldmVudCwgZm4pIHtcbiAgICB0aGlzLm1hbnkoZXZlbnQsIDEsIGZuKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBFdmVudEVtaXR0ZXIucHJvdG90eXBlLm1hbnkgPSBmdW5jdGlvbihldmVudCwgdHRsLCBmbikge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbWFueSBvbmx5IGFjY2VwdHMgaW5zdGFuY2VzIG9mIEZ1bmN0aW9uJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlzdGVuZXIoKSB7XG4gICAgICBpZiAoLS10dGwgPT09IDApIHtcbiAgICAgICAgc2VsZi5vZmYoZXZlbnQsIGxpc3RlbmVyKTtcbiAgICAgIH1cbiAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgbGlzdGVuZXIuX29yaWdpbiA9IGZuO1xuXG4gICAgdGhpcy5vbihldmVudCwgbGlzdGVuZXIpO1xuXG4gICAgcmV0dXJuIHNlbGY7XG4gIH07XG5cbiAgRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICB0aGlzLl9ldmVudHMgfHwgaW5pdC5jYWxsKHRoaXMpO1xuXG4gICAgdmFyIHR5cGUgPSBhcmd1bWVudHNbMF07XG5cbiAgICBpZiAodHlwZSA9PT0gJ25ld0xpc3RlbmVyJyAmJiAhdGhpcy5uZXdMaXN0ZW5lcikge1xuICAgICAgaWYgKCF0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgfVxuXG4gICAgLy8gTG9vcCB0aHJvdWdoIHRoZSAqX2FsbCogZnVuY3Rpb25zIGFuZCBpbnZva2UgdGhlbS5cbiAgICBpZiAodGhpcy5fYWxsKSB7XG4gICAgICB2YXIgbCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICB2YXIgYXJncyA9IG5ldyBBcnJheShsIC0gMSk7XG4gICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGw7IGkrKykgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICBmb3IgKGkgPSAwLCBsID0gdGhpcy5fYWxsLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICB0aGlzLmV2ZW50ID0gdHlwZTtcbiAgICAgICAgdGhpcy5fYWxsW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuXG4gICAgICBpZiAoIXRoaXMuX2FsbCAmJlxuICAgICAgICAhdGhpcy5fZXZlbnRzLmVycm9yICYmXG4gICAgICAgICEodGhpcy53aWxkY2FyZCAmJiB0aGlzLmxpc3RlbmVyVHJlZS5lcnJvcikpIHtcblxuICAgICAgICBpZiAoYXJndW1lbnRzWzFdIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICB0aHJvdyBhcmd1bWVudHNbMV07IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5jYXVnaHQsIHVuc3BlY2lmaWVkICdlcnJvcicgZXZlbnQuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgaGFuZGxlcjtcblxuICAgIGlmKHRoaXMud2lsZGNhcmQpIHtcbiAgICAgIGhhbmRsZXIgPSBbXTtcbiAgICAgIHZhciBucyA9IHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJyA/IHR5cGUuc3BsaXQodGhpcy5kZWxpbWl0ZXIpIDogdHlwZS5zbGljZSgpO1xuICAgICAgc2VhcmNoTGlzdGVuZXJUcmVlLmNhbGwodGhpcywgaGFuZGxlciwgbnMsIHRoaXMubGlzdGVuZXJUcmVlLCAwKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgaGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5ldmVudCA9IHR5cGU7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSlcbiAgICAgICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgLy8gc2xvd2VyXG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHZhciBsID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGwgLSAxKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgbDsgaSsrKSBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBlbHNlIGlmIChoYW5kbGVyKSB7XG4gICAgICB2YXIgbCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICB2YXIgYXJncyA9IG5ldyBBcnJheShsIC0gMSk7XG4gICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGw7IGkrKykgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG5cbiAgICAgIHZhciBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGxpc3RlbmVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdGhpcy5ldmVudCA9IHR5cGU7XG4gICAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAobGlzdGVuZXJzLmxlbmd0aCA+IDApIHx8ICEhdGhpcy5fYWxsO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiAhIXRoaXMuX2FsbDtcbiAgICB9XG5cbiAgfTtcblxuICBFdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcblxuICAgIGlmICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5vbkFueSh0eXBlKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignb24gb25seSBhY2NlcHRzIGluc3RhbmNlcyBvZiBGdW5jdGlvbicpO1xuICAgIH1cbiAgICB0aGlzLl9ldmVudHMgfHwgaW5pdC5jYWxsKHRoaXMpO1xuXG4gICAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PSBcIm5ld0xpc3RlbmVyc1wiISBCZWZvcmVcbiAgICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyc1wiLlxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgICBpZih0aGlzLndpbGRjYXJkKSB7XG4gICAgICBncm93TGlzdGVuZXJUcmVlLmNhbGwodGhpcywgdHlwZSwgbGlzdGVuZXIpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pIHtcbiAgICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gICAgfVxuICAgIGVsc2UgaWYodHlwZW9mIHRoaXMuX2V2ZW50c1t0eXBlXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzQXJyYXkodGhpcy5fZXZlbnRzW3R5cGVdKSkge1xuICAgICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuXG4gICAgICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICAgICAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG5cbiAgICAgICAgdmFyIG0gPSBkZWZhdWx0TWF4TGlzdGVuZXJzO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5fZXZlbnRzLm1heExpc3RlbmVycyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBtID0gdGhpcy5fZXZlbnRzLm1heExpc3RlbmVycztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuXG4gICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEV2ZW50RW1pdHRlci5wcm90b3R5cGUub25BbnkgPSBmdW5jdGlvbihmbikge1xuXG4gICAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdvbkFueSBvbmx5IGFjY2VwdHMgaW5zdGFuY2VzIG9mIEZ1bmN0aW9uJyk7XG4gICAgfVxuXG4gICAgaWYoIXRoaXMuX2FsbCkge1xuICAgICAgdGhpcy5fYWxsID0gW107XG4gICAgfVxuXG4gICAgLy8gQWRkIHRoZSBmdW5jdGlvbiB0byB0aGUgZXZlbnQgbGlzdGVuZXIgY29sbGVjdGlvbi5cbiAgICB0aGlzLl9hbGwucHVzaChmbik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUub247XG5cbiAgRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vZmYgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigncmVtb3ZlTGlzdGVuZXIgb25seSB0YWtlcyBpbnN0YW5jZXMgb2YgRnVuY3Rpb24nKTtcbiAgICB9XG5cbiAgICB2YXIgaGFuZGxlcnMsbGVhZnM9W107XG5cbiAgICBpZih0aGlzLndpbGRjYXJkKSB7XG4gICAgICB2YXIgbnMgPSB0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycgPyB0eXBlLnNwbGl0KHRoaXMuZGVsaW1pdGVyKSA6IHR5cGUuc2xpY2UoKTtcbiAgICAgIGxlYWZzID0gc2VhcmNoTGlzdGVuZXJUcmVlLmNhbGwodGhpcywgbnVsbCwgbnMsIHRoaXMubGlzdGVuZXJUcmVlLCAwKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAvLyBkb2VzIG5vdCB1c2UgbGlzdGVuZXJzKCksIHNvIG5vIHNpZGUgZWZmZWN0IG9mIGNyZWF0aW5nIF9ldmVudHNbdHlwZV1cbiAgICAgIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKSByZXR1cm4gdGhpcztcbiAgICAgIGhhbmRsZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgICAgbGVhZnMucHVzaCh7X2xpc3RlbmVyczpoYW5kbGVyc30pO1xuICAgIH1cblxuICAgIGZvciAodmFyIGlMZWFmPTA7IGlMZWFmPGxlYWZzLmxlbmd0aDsgaUxlYWYrKykge1xuICAgICAgdmFyIGxlYWYgPSBsZWFmc1tpTGVhZl07XG4gICAgICBoYW5kbGVycyA9IGxlYWYuX2xpc3RlbmVycztcbiAgICAgIGlmIChpc0FycmF5KGhhbmRsZXJzKSkge1xuXG4gICAgICAgIHZhciBwb3NpdGlvbiA9IC0xO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBoYW5kbGVycy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChoYW5kbGVyc1tpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAgIChoYW5kbGVyc1tpXS5saXN0ZW5lciAmJiBoYW5kbGVyc1tpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpIHx8XG4gICAgICAgICAgICAoaGFuZGxlcnNbaV0uX29yaWdpbiAmJiBoYW5kbGVyc1tpXS5fb3JpZ2luID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwb3NpdGlvbiA8IDApIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHRoaXMud2lsZGNhcmQpIHtcbiAgICAgICAgICBsZWFmLl9saXN0ZW5lcnMuc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0uc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYW5kbGVycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBpZih0aGlzLndpbGRjYXJkKSB7XG4gICAgICAgICAgICBkZWxldGUgbGVhZi5fbGlzdGVuZXJzO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoaGFuZGxlcnMgPT09IGxpc3RlbmVyIHx8XG4gICAgICAgIChoYW5kbGVycy5saXN0ZW5lciAmJiBoYW5kbGVycy5saXN0ZW5lciA9PT0gbGlzdGVuZXIpIHx8XG4gICAgICAgIChoYW5kbGVycy5fb3JpZ2luICYmIGhhbmRsZXJzLl9vcmlnaW4gPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBpZih0aGlzLndpbGRjYXJkKSB7XG4gICAgICAgICAgZGVsZXRlIGxlYWYuX2xpc3RlbmVycztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vZmZBbnkgPSBmdW5jdGlvbihmbikge1xuICAgIHZhciBpID0gMCwgbCA9IDAsIGZucztcbiAgICBpZiAoZm4gJiYgdGhpcy5fYWxsICYmIHRoaXMuX2FsbC5sZW5ndGggPiAwKSB7XG4gICAgICBmbnMgPSB0aGlzLl9hbGw7XG4gICAgICBmb3IoaSA9IDAsIGwgPSBmbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmKGZuID09PSBmbnNbaV0pIHtcbiAgICAgICAgICBmbnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2FsbCA9IFtdO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBFdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vZmY7XG5cbiAgRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICF0aGlzLl9ldmVudHMgfHwgaW5pdC5jYWxsKHRoaXMpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaWYodGhpcy53aWxkY2FyZCkge1xuICAgICAgdmFyIG5zID0gdHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnID8gdHlwZS5zcGxpdCh0aGlzLmRlbGltaXRlcikgOiB0eXBlLnNsaWNlKCk7XG4gICAgICB2YXIgbGVhZnMgPSBzZWFyY2hMaXN0ZW5lclRyZWUuY2FsbCh0aGlzLCBudWxsLCBucywgdGhpcy5saXN0ZW5lclRyZWUsIDApO1xuXG4gICAgICBmb3IgKHZhciBpTGVhZj0wOyBpTGVhZjxsZWFmcy5sZW5ndGg7IGlMZWFmKyspIHtcbiAgICAgICAgdmFyIGxlYWYgPSBsZWFmc1tpTGVhZl07XG4gICAgICAgIGxlYWYuX2xpc3RlbmVycyA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pIHJldHVybiB0aGlzO1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gICAgaWYodGhpcy53aWxkY2FyZCkge1xuICAgICAgdmFyIGhhbmRsZXJzID0gW107XG4gICAgICB2YXIgbnMgPSB0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycgPyB0eXBlLnNwbGl0KHRoaXMuZGVsaW1pdGVyKSA6IHR5cGUuc2xpY2UoKTtcbiAgICAgIHNlYXJjaExpc3RlbmVyVHJlZS5jYWxsKHRoaXMsIGhhbmRsZXJzLCBucywgdGhpcy5saXN0ZW5lclRyZWUsIDApO1xuICAgICAgcmV0dXJuIGhhbmRsZXJzO1xuICAgIH1cblxuICAgIHRoaXMuX2V2ZW50cyB8fCBpbml0LmNhbGwodGhpcyk7XG5cbiAgICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSkgdGhpcy5fZXZlbnRzW3R5cGVdID0gW107XG4gICAgaWYgKCFpc0FycmF5KHRoaXMuX2V2ZW50c1t0eXBlXSkpIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICB9O1xuXG4gIEV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzQW55ID0gZnVuY3Rpb24oKSB7XG5cbiAgICBpZih0aGlzLl9hbGwpIHtcbiAgICAgIHJldHVybiB0aGlzLl9hbGw7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICB9O1xuXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBFdmVudEVtaXR0ZXI7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgLy8gQ29tbW9uSlNcbiAgICBleHBvcnRzLkV2ZW50RW1pdHRlcjIgPSBFdmVudEVtaXR0ZXI7XG4gIH1cbiAgZWxzZSB7XG4gICAgLy8gQnJvd3NlciBnbG9iYWwuXG4gICAgd2luZG93LkV2ZW50RW1pdHRlcjIgPSBFdmVudEVtaXR0ZXI7XG4gIH1cbn0oKTtcbiIsIi8qISBzaGlmdHkgLSB2MS4yLjEgLSAyMDE0LTA2LTI5IC0gaHR0cDovL2plcmVteWNrYWhuLmdpdGh1Yi5pby9zaGlmdHkgKi9cbjsoZnVuY3Rpb24gKHJvb3QpIHtcblxuLyohXG4gKiBTaGlmdHkgQ29yZVxuICogQnkgSmVyZW15IEthaG4gLSBqZXJlbXlja2FobkBnbWFpbC5jb21cbiAqL1xuXG4vLyBVZ2xpZnlKUyBkZWZpbmUgaGFjay4gIFVzZWQgZm9yIHVuaXQgdGVzdGluZy4gIENvbnRlbnRzIG9mIHRoaXMgaWYgYXJlXG4vLyBjb21waWxlZCBhd2F5LlxuaWYgKHR5cGVvZiBTSElGVFlfREVCVUdfTk9XID09PSAndW5kZWZpbmVkJykge1xuICBTSElGVFlfREVCVUdfTk9XID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiArbmV3IERhdGUoKTtcbiAgfTtcbn1cblxudmFyIFR3ZWVuYWJsZSA9IChmdW5jdGlvbiAoKSB7XG5cbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIEFsaWFzZXMgdGhhdCBnZXQgZGVmaW5lZCBsYXRlciBpbiB0aGlzIGZ1bmN0aW9uXG4gIHZhciBmb3JtdWxhO1xuXG4gIC8vIENPTlNUQU5UU1xuICB2YXIgREVGQVVMVF9TQ0hFRFVMRV9GVU5DVElPTjtcbiAgdmFyIERFRkFVTFRfRUFTSU5HID0gJ2xpbmVhcic7XG4gIHZhciBERUZBVUxUX0RVUkFUSU9OID0gNTAwO1xuICB2YXIgVVBEQVRFX1RJTUUgPSAxMDAwIC8gNjA7XG5cbiAgdmFyIF9ub3cgPSBEYXRlLm5vd1xuICAgICAgID8gRGF0ZS5ub3dcbiAgICAgICA6IGZ1bmN0aW9uICgpIHtyZXR1cm4gK25ldyBEYXRlKCk7fTtcblxuICB2YXIgbm93ID0gU0hJRlRZX0RFQlVHX05PV1xuICAgICAgID8gU0hJRlRZX0RFQlVHX05PV1xuICAgICAgIDogX25vdztcblxuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKSBzaGltIGJ5IFBhdWwgSXJpc2ggKG1vZGlmaWVkIGZvciBTaGlmdHkpXG4gICAgLy8gaHR0cDovL3BhdWxpcmlzaC5jb20vMjAxMS9yZXF1ZXN0YW5pbWF0aW9uZnJhbWUtZm9yLXNtYXJ0LWFuaW1hdGluZy9cbiAgICBERUZBVUxUX1NDSEVEVUxFX0ZVTkNUSU9OID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZVxuICAgICAgIHx8IHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgICAgICB8fCB3aW5kb3cub1JlcXVlc3RBbmltYXRpb25GcmFtZVxuICAgICAgIHx8IHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZVxuICAgICAgIHx8ICh3aW5kb3cubW96Q2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gICAgICAgJiYgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSlcbiAgICAgICB8fCBzZXRUaW1lb3V0O1xuICB9IGVsc2Uge1xuICAgIERFRkFVTFRfU0NIRURVTEVfRlVOQ1RJT04gPSBzZXRUaW1lb3V0O1xuICB9XG5cbiAgZnVuY3Rpb24gbm9vcCAoKSB7XG4gICAgLy8gTk9PUCFcbiAgfVxuXG4gIC8qIVxuICAgKiBIYW5keSBzaG9ydGN1dCBmb3IgZG9pbmcgYSBmb3ItaW4gbG9vcC4gVGhpcyBpcyBub3QgYSBcIm5vcm1hbFwiIGVhY2hcbiAgICogZnVuY3Rpb24sIGl0IGlzIG9wdGltaXplZCBmb3IgU2hpZnR5LiAgVGhlIGl0ZXJhdG9yIGZ1bmN0aW9uIG9ubHkgcmVjZWl2ZXNcbiAgICogdGhlIHByb3BlcnR5IG5hbWUsIG5vdCB0aGUgdmFsdWUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAgICogQHBhcmFtIHtGdW5jdGlvbihzdHJpbmcpfSBmblxuICAgKi9cbiAgZnVuY3Rpb24gZWFjaCAob2JqLCBmbikge1xuICAgIHZhciBrZXk7XG4gICAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICAgIGZuKGtleSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyohXG4gICAqIFBlcmZvcm0gYSBzaGFsbG93IGNvcHkgb2YgT2JqZWN0IHByb3BlcnRpZXMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXRPYmplY3QgVGhlIG9iamVjdCB0byBjb3B5IGludG9cbiAgICogQHBhcmFtIHtPYmplY3R9IHNyY09iamVjdCBUaGUgb2JqZWN0IHRvIGNvcHkgZnJvbVxuICAgKiBAcmV0dXJuIHtPYmplY3R9IEEgcmVmZXJlbmNlIHRvIHRoZSBhdWdtZW50ZWQgYHRhcmdldE9iamAgT2JqZWN0XG4gICAqL1xuICBmdW5jdGlvbiBzaGFsbG93Q29weSAodGFyZ2V0T2JqLCBzcmNPYmopIHtcbiAgICBlYWNoKHNyY09iaiwgZnVuY3Rpb24gKHByb3ApIHtcbiAgICAgIHRhcmdldE9ialtwcm9wXSA9IHNyY09ialtwcm9wXTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0YXJnZXRPYmo7XG4gIH1cblxuICAvKiFcbiAgICogQ29waWVzIGVhY2ggcHJvcGVydHkgZnJvbSBzcmMgb250byB0YXJnZXQsIGJ1dCBvbmx5IGlmIHRoZSBwcm9wZXJ0eSB0b1xuICAgKiBjb3B5IHRvIHRhcmdldCBpcyB1bmRlZmluZWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXQgTWlzc2luZyBwcm9wZXJ0aWVzIGluIHRoaXMgT2JqZWN0IGFyZSBmaWxsZWQgaW5cbiAgICogQHBhcmFtIHtPYmplY3R9IHNyY1xuICAgKi9cbiAgZnVuY3Rpb24gZGVmYXVsdHMgKHRhcmdldCwgc3JjKSB7XG4gICAgZWFjaChzcmMsIGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgICBpZiAodHlwZW9mIHRhcmdldFtwcm9wXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGFyZ2V0W3Byb3BdID0gc3JjW3Byb3BdO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyohXG4gICAqIENhbGN1bGF0ZXMgdGhlIGludGVycG9sYXRlZCB0d2VlbiB2YWx1ZXMgb2YgYW4gT2JqZWN0IGZvciBhIGdpdmVuXG4gICAqIHRpbWVzdGFtcC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGZvclBvc2l0aW9uIFRoZSBwb3NpdGlvbiB0byBjb21wdXRlIHRoZSBzdGF0ZSBmb3IuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjdXJyZW50U3RhdGUgQ3VycmVudCBzdGF0ZSBwcm9wZXJ0aWVzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3JpZ2luYWxTdGF0ZTogVGhlIG9yaWdpbmFsIHN0YXRlIHByb3BlcnRpZXMgdGhlIE9iamVjdCBpc1xuICAgKiB0d2VlbmluZyBmcm9tLlxuICAgKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0U3RhdGU6IFRoZSBkZXN0aW5hdGlvbiBzdGF0ZSBwcm9wZXJ0aWVzIHRoZSBPYmplY3RcbiAgICogaXMgdHdlZW5pbmcgdG8uXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBkdXJhdGlvbjogVGhlIGxlbmd0aCBvZiB0aGUgdHdlZW4gaW4gbWlsbGlzZWNvbmRzLlxuICAgKiBAcGFyYW0ge251bWJlcn0gdGltZXN0YW1wOiBUaGUgVU5JWCBlcG9jaCB0aW1lIGF0IHdoaWNoIHRoZSB0d2VlbiBiZWdhbi5cbiAgICogQHBhcmFtIHtPYmplY3R9IGVhc2luZzogVGhpcyBPYmplY3QncyBrZXlzIG11c3QgY29ycmVzcG9uZCB0byB0aGUga2V5cyBpblxuICAgKiB0YXJnZXRTdGF0ZS5cbiAgICovXG4gIGZ1bmN0aW9uIHR3ZWVuUHJvcHMgKGZvclBvc2l0aW9uLCBjdXJyZW50U3RhdGUsIG9yaWdpbmFsU3RhdGUsIHRhcmdldFN0YXRlLFxuICAgIGR1cmF0aW9uLCB0aW1lc3RhbXAsIGVhc2luZykge1xuICAgIHZhciBub3JtYWxpemVkUG9zaXRpb24gPSAoZm9yUG9zaXRpb24gLSB0aW1lc3RhbXApIC8gZHVyYXRpb247XG5cbiAgICB2YXIgcHJvcDtcbiAgICBmb3IgKHByb3AgaW4gY3VycmVudFN0YXRlKSB7XG4gICAgICBpZiAoY3VycmVudFN0YXRlLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgIGN1cnJlbnRTdGF0ZVtwcm9wXSA9IHR3ZWVuUHJvcChvcmlnaW5hbFN0YXRlW3Byb3BdLFxuICAgICAgICAgIHRhcmdldFN0YXRlW3Byb3BdLCBmb3JtdWxhW2Vhc2luZ1twcm9wXV0sIG5vcm1hbGl6ZWRQb3NpdGlvbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGN1cnJlbnRTdGF0ZTtcbiAgfVxuXG4gIC8qIVxuICAgKiBUd2VlbnMgYSBzaW5nbGUgcHJvcGVydHkuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydCBUaGUgdmFsdWUgdGhhdCB0aGUgdHdlZW4gc3RhcnRlZCBmcm9tLlxuICAgKiBAcGFyYW0ge251bWJlcn0gZW5kIFRoZSB2YWx1ZSB0aGF0IHRoZSB0d2VlbiBzaG91bGQgZW5kIGF0LlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBlYXNpbmdGdW5jIFRoZSBlYXNpbmcgY3VydmUgdG8gYXBwbHkgdG8gdGhlIHR3ZWVuLlxuICAgKiBAcGFyYW0ge251bWJlcn0gcG9zaXRpb24gVGhlIG5vcm1hbGl6ZWQgcG9zaXRpb24gKGJldHdlZW4gMC4wIGFuZCAxLjApIHRvXG4gICAqIGNhbGN1bGF0ZSB0aGUgbWlkcG9pbnQgb2YgJ3N0YXJ0JyBhbmQgJ2VuZCcgYWdhaW5zdC5cbiAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgdHdlZW5lZCB2YWx1ZS5cbiAgICovXG4gIGZ1bmN0aW9uIHR3ZWVuUHJvcCAoc3RhcnQsIGVuZCwgZWFzaW5nRnVuYywgcG9zaXRpb24pIHtcbiAgICByZXR1cm4gc3RhcnQgKyAoZW5kIC0gc3RhcnQpICogZWFzaW5nRnVuYyhwb3NpdGlvbik7XG4gIH1cblxuICAvKiFcbiAgICogQXBwbGllcyBhIGZpbHRlciB0byBUd2VlbmFibGUgaW5zdGFuY2UuXG4gICAqIEBwYXJhbSB7VHdlZW5hYmxlfSB0d2VlbmFibGUgVGhlIGBUd2VlbmFibGVgIGluc3RhbmNlIHRvIGNhbGwgdGhlIGZpbHRlclxuICAgKiB1cG9uLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZmlsdGVyTmFtZSBUaGUgbmFtZSBvZiB0aGUgZmlsdGVyIHRvIGFwcGx5LlxuICAgKi9cbiAgZnVuY3Rpb24gYXBwbHlGaWx0ZXIgKHR3ZWVuYWJsZSwgZmlsdGVyTmFtZSkge1xuICAgIHZhciBmaWx0ZXJzID0gVHdlZW5hYmxlLnByb3RvdHlwZS5maWx0ZXI7XG4gICAgdmFyIGFyZ3MgPSB0d2VlbmFibGUuX2ZpbHRlckFyZ3M7XG5cbiAgICBlYWNoKGZpbHRlcnMsIGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIGZpbHRlcnNbbmFtZV1bZmlsdGVyTmFtZV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGZpbHRlcnNbbmFtZV1bZmlsdGVyTmFtZV0uYXBwbHkodHdlZW5hYmxlLCBhcmdzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHZhciB0aW1lb3V0SGFuZGxlcl9lbmRUaW1lO1xuICB2YXIgdGltZW91dEhhbmRsZXJfY3VycmVudFRpbWU7XG4gIHZhciB0aW1lb3V0SGFuZGxlcl9pc0VuZGVkO1xuICAvKiFcbiAgICogSGFuZGxlcyB0aGUgdXBkYXRlIGxvZ2ljIGZvciBvbmUgc3RlcCBvZiBhIHR3ZWVuLlxuICAgKiBAcGFyYW0ge1R3ZWVuYWJsZX0gdHdlZW5hYmxlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lc3RhbXBcbiAgICogQHBhcmFtIHtudW1iZXJ9IGR1cmF0aW9uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjdXJyZW50U3RhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IG9yaWdpbmFsU3RhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IHRhcmdldFN0YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlYXNpbmdcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gc3RlcFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9uKEZ1bmN0aW9uLG51bWJlcil9fSBzY2hlZHVsZVxuICAgKi9cbiAgZnVuY3Rpb24gdGltZW91dEhhbmRsZXIgKHR3ZWVuYWJsZSwgdGltZXN0YW1wLCBkdXJhdGlvbiwgY3VycmVudFN0YXRlLFxuICAgIG9yaWdpbmFsU3RhdGUsIHRhcmdldFN0YXRlLCBlYXNpbmcsIHN0ZXAsIHNjaGVkdWxlKSB7XG4gICAgdGltZW91dEhhbmRsZXJfZW5kVGltZSA9IHRpbWVzdGFtcCArIGR1cmF0aW9uO1xuICAgIHRpbWVvdXRIYW5kbGVyX2N1cnJlbnRUaW1lID0gTWF0aC5taW4obm93KCksIHRpbWVvdXRIYW5kbGVyX2VuZFRpbWUpO1xuICAgIHRpbWVvdXRIYW5kbGVyX2lzRW5kZWQgPSB0aW1lb3V0SGFuZGxlcl9jdXJyZW50VGltZSA+PSB0aW1lb3V0SGFuZGxlcl9lbmRUaW1lO1xuXG4gICAgaWYgKHR3ZWVuYWJsZS5pc1BsYXlpbmcoKSAmJiAhdGltZW91dEhhbmRsZXJfaXNFbmRlZCkge1xuICAgICAgc2NoZWR1bGUodHdlZW5hYmxlLl90aW1lb3V0SGFuZGxlciwgVVBEQVRFX1RJTUUpO1xuXG4gICAgICBhcHBseUZpbHRlcih0d2VlbmFibGUsICdiZWZvcmVUd2VlbicpO1xuICAgICAgdHdlZW5Qcm9wcyh0aW1lb3V0SGFuZGxlcl9jdXJyZW50VGltZSwgY3VycmVudFN0YXRlLCBvcmlnaW5hbFN0YXRlLFxuICAgICAgICB0YXJnZXRTdGF0ZSwgZHVyYXRpb24sIHRpbWVzdGFtcCwgZWFzaW5nKTtcbiAgICAgIGFwcGx5RmlsdGVyKHR3ZWVuYWJsZSwgJ2FmdGVyVHdlZW4nKTtcblxuICAgICAgc3RlcChjdXJyZW50U3RhdGUpO1xuICAgIH0gZWxzZSBpZiAodGltZW91dEhhbmRsZXJfaXNFbmRlZCkge1xuICAgICAgc3RlcCh0YXJnZXRTdGF0ZSk7XG4gICAgICB0d2VlbmFibGUuc3RvcCh0cnVlKTtcbiAgICB9XG4gIH1cblxuXG4gIC8qIVxuICAgKiBDcmVhdGVzIGEgdXNhYmxlIGVhc2luZyBPYmplY3QgZnJvbSBlaXRoZXIgYSBzdHJpbmcgb3IgYW5vdGhlciBlYXNpbmdcbiAgICogT2JqZWN0LiAgSWYgYGVhc2luZ2AgaXMgYW4gT2JqZWN0LCB0aGVuIHRoaXMgZnVuY3Rpb24gY2xvbmVzIGl0IGFuZCBmaWxsc1xuICAgKiBpbiB0aGUgbWlzc2luZyBwcm9wZXJ0aWVzIHdpdGggXCJsaW5lYXJcIi5cbiAgICogQHBhcmFtIHtPYmplY3R9IGZyb21Ud2VlblBhcmFtc1xuICAgKiBAcGFyYW0ge09iamVjdHxzdHJpbmd9IGVhc2luZ1xuICAgKi9cbiAgZnVuY3Rpb24gY29tcG9zZUVhc2luZ09iamVjdCAoZnJvbVR3ZWVuUGFyYW1zLCBlYXNpbmcpIHtcbiAgICB2YXIgY29tcG9zZWRFYXNpbmcgPSB7fTtcblxuICAgIGlmICh0eXBlb2YgZWFzaW5nID09PSAnc3RyaW5nJykge1xuICAgICAgZWFjaChmcm9tVHdlZW5QYXJhbXMsIGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgICAgIGNvbXBvc2VkRWFzaW5nW3Byb3BdID0gZWFzaW5nO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVhY2goZnJvbVR3ZWVuUGFyYW1zLCBmdW5jdGlvbiAocHJvcCkge1xuICAgICAgICBpZiAoIWNvbXBvc2VkRWFzaW5nW3Byb3BdKSB7XG4gICAgICAgICAgY29tcG9zZWRFYXNpbmdbcHJvcF0gPSBlYXNpbmdbcHJvcF0gfHwgREVGQVVMVF9FQVNJTkc7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBjb21wb3NlZEVhc2luZztcbiAgfVxuXG4gIC8qKlxuICAgKiBUd2VlbmFibGUgY29uc3RydWN0b3IuXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0X2luaXRpYWxTdGF0ZSBUaGUgdmFsdWVzIHRoYXQgdGhlIGluaXRpYWwgdHdlZW4gc2hvdWxkIHN0YXJ0IGF0IGlmIGEgXCJmcm9tXCIgb2JqZWN0IGlzIG5vdCBwcm92aWRlZCB0byBUd2VlbmFibGUjdHdlZW4uXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0X2NvbmZpZyBTZWUgVHdlZW5hYmxlLnByb3RvdHlwZS5zZXRDb25maWcoKVxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIGZ1bmN0aW9uIFR3ZWVuYWJsZSAob3B0X2luaXRpYWxTdGF0ZSwgb3B0X2NvbmZpZykge1xuICAgIHRoaXMuX2N1cnJlbnRTdGF0ZSA9IG9wdF9pbml0aWFsU3RhdGUgfHwge307XG4gICAgdGhpcy5fY29uZmlndXJlZCA9IGZhbHNlO1xuICAgIHRoaXMuX3NjaGVkdWxlRnVuY3Rpb24gPSBERUZBVUxUX1NDSEVEVUxFX0ZVTkNUSU9OO1xuXG4gICAgLy8gVG8gcHJldmVudCB1bm5lY2Vzc2FyeSBjYWxscyB0byBzZXRDb25maWcgZG8gbm90IHNldCBkZWZhdWx0IGNvbmZpZ3VyYXRpb24gaGVyZS5cbiAgICAvLyBPbmx5IHNldCBkZWZhdWx0IGNvbmZpZ3VyYXRpb24gaW1tZWRpYXRlbHkgYmVmb3JlIHR3ZWVuaW5nIGlmIG5vbmUgaGFzIGJlZW4gc2V0LlxuICAgIGlmICh0eXBlb2Ygb3B0X2NvbmZpZyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXMuc2V0Q29uZmlnKG9wdF9jb25maWcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDb25maWd1cmUgYW5kIHN0YXJ0IGEgdHdlZW4uXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0X2NvbmZpZyBTZWUgVHdlZW5hYmxlLnByb3RvdHlwZS5zZXRDb25maWcoKVxuICAgKiBAcmV0dXJuIHtUd2VlbmFibGV9XG4gICAqL1xuICBUd2VlbmFibGUucHJvdG90eXBlLnR3ZWVuID0gZnVuY3Rpb24gKG9wdF9jb25maWcpIHtcbiAgICBpZiAodGhpcy5faXNUd2VlbmluZykge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLy8gT25seSBzZXQgZGVmYXVsdCBjb25maWcgaWYgbm8gY29uZmlndXJhdGlvbiBoYXMgYmVlbiBzZXQgcHJldmlvdXNseSBhbmQgbm9uZSBpcyBwcm92aWRlZCBub3cuXG4gICAgaWYgKG9wdF9jb25maWcgIT09IHVuZGVmaW5lZCB8fCAhdGhpcy5fY29uZmlndXJlZCkge1xuICAgICAgdGhpcy5zZXRDb25maWcob3B0X2NvbmZpZyk7XG4gICAgfVxuXG4gICAgdGhpcy5fc3RhcnQodGhpcy5nZXQoKSk7XG4gICAgcmV0dXJuIHRoaXMucmVzdW1lKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHR3ZWVuIGNvbmZpZ3VyYXRpb24uIGBjb25maWdgIG1heSBoYXZlIHRoZSBmb2xsb3dpbmcgb3B0aW9uczpcbiAgICpcbiAgICogLSBfX2Zyb21fXyAoX09iamVjdD1fKTogU3RhcnRpbmcgcG9zaXRpb24uICBJZiBvbWl0dGVkLCB0aGUgY3VycmVudCBzdGF0ZSBpcyB1c2VkLlxuICAgKiAtIF9fdG9fXyAoX09iamVjdD1fKTogRW5kaW5nIHBvc2l0aW9uLlxuICAgKiAtIF9fZHVyYXRpb25fXyAoX251bWJlcj1fKTogSG93IG1hbnkgbWlsbGlzZWNvbmRzIHRvIGFuaW1hdGUgZm9yLlxuICAgKiAtIF9fc3RhcnRfXyAoX0Z1bmN0aW9uKE9iamVjdCk9Xyk6IEZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgdHdlZW4gYmVnaW5zLiAgUmVjZWl2ZXMgdGhlIHN0YXRlIG9mIHRoZSB0d2VlbiBhcyB0aGUgb25seSBwYXJhbWV0ZXIuXG4gICAqIC0gX19zdGVwX18gKF9GdW5jdGlvbihPYmplY3QpPV8pOiBGdW5jdGlvbiB0byBleGVjdXRlIG9uIGV2ZXJ5IHRpY2suICBSZWNlaXZlcyB0aGUgc3RhdGUgb2YgdGhlIHR3ZWVuIGFzIHRoZSBvbmx5IHBhcmFtZXRlci4gIFRoaXMgZnVuY3Rpb24gaXMgbm90IGNhbGxlZCBvbiB0aGUgZmluYWwgc3RlcCBvZiB0aGUgYW5pbWF0aW9uLCBidXQgYGZpbmlzaGAgaXMuXG4gICAqIC0gX19maW5pc2hfXyAoX0Z1bmN0aW9uKE9iamVjdCk9Xyk6IEZ1bmN0aW9uIHRvIGV4ZWN1dGUgdXBvbiB0d2VlbiBjb21wbGV0aW9uLiAgUmVjZWl2ZXMgdGhlIHN0YXRlIG9mIHRoZSB0d2VlbiBhcyB0aGUgb25seSBwYXJhbWV0ZXIuXG4gICAqIC0gX19lYXNpbmdfXyAoX09iamVjdHxzdHJpbmc9Xyk6IEVhc2luZyBjdXJ2ZSBuYW1lKHMpIHRvIHVzZSBmb3IgdGhlIHR3ZWVuLlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXG4gICAqIEByZXR1cm4ge1R3ZWVuYWJsZX1cbiAgICovXG4gIFR3ZWVuYWJsZS5wcm90b3R5cGUuc2V0Q29uZmlnID0gZnVuY3Rpb24gKGNvbmZpZykge1xuICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcbiAgICB0aGlzLl9jb25maWd1cmVkID0gdHJ1ZTtcblxuICAgIC8vIEluaXQgdGhlIGludGVybmFsIHN0YXRlXG4gICAgdGhpcy5fcGF1c2VkQXRUaW1lID0gbnVsbDtcbiAgICB0aGlzLl9zdGFydCA9IGNvbmZpZy5zdGFydCB8fCBub29wO1xuICAgIHRoaXMuX3N0ZXAgPSBjb25maWcuc3RlcCB8fCBub29wO1xuICAgIHRoaXMuX2ZpbmlzaCA9IGNvbmZpZy5maW5pc2ggfHwgbm9vcDtcbiAgICB0aGlzLl9kdXJhdGlvbiA9IGNvbmZpZy5kdXJhdGlvbiB8fCBERUZBVUxUX0RVUkFUSU9OO1xuICAgIHRoaXMuX2N1cnJlbnRTdGF0ZSA9IGNvbmZpZy5mcm9tIHx8IHRoaXMuZ2V0KCk7XG4gICAgdGhpcy5fb3JpZ2luYWxTdGF0ZSA9IHRoaXMuZ2V0KCk7XG4gICAgdGhpcy5fdGFyZ2V0U3RhdGUgPSBjb25maWcudG8gfHwgdGhpcy5nZXQoKTtcbiAgICB0aGlzLl90aW1lc3RhbXAgPSBub3coKTtcblxuICAgIC8vIEFsaWFzZXMgdXNlZCBiZWxvd1xuICAgIHZhciBjdXJyZW50U3RhdGUgPSB0aGlzLl9jdXJyZW50U3RhdGU7XG4gICAgdmFyIHRhcmdldFN0YXRlID0gdGhpcy5fdGFyZ2V0U3RhdGU7XG5cbiAgICAvLyBFbnN1cmUgdGhhdCB0aGVyZSBpcyBhbHdheXMgc29tZXRoaW5nIHRvIHR3ZWVuIHRvLlxuICAgIGRlZmF1bHRzKHRhcmdldFN0YXRlLCBjdXJyZW50U3RhdGUpO1xuXG4gICAgdGhpcy5fZWFzaW5nID0gY29tcG9zZUVhc2luZ09iamVjdChcbiAgICAgIGN1cnJlbnRTdGF0ZSwgY29uZmlnLmVhc2luZyB8fCBERUZBVUxUX0VBU0lORyk7XG5cbiAgICB0aGlzLl9maWx0ZXJBcmdzID1cbiAgICAgIFtjdXJyZW50U3RhdGUsIHRoaXMuX29yaWdpbmFsU3RhdGUsIHRhcmdldFN0YXRlLCB0aGlzLl9lYXNpbmddO1xuXG4gICAgYXBwbHlGaWx0ZXIodGhpcywgJ3R3ZWVuQ3JlYXRlZCcpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBjdXJyZW50IHN0YXRlLlxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuICBUd2VlbmFibGUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gc2hhbGxvd0NvcHkoe30sIHRoaXMuX2N1cnJlbnRTdGF0ZSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGN1cnJlbnQgc3RhdGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZVxuICAgKi9cbiAgVHdlZW5hYmxlLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICB0aGlzLl9jdXJyZW50U3RhdGUgPSBzdGF0ZTtcbiAgfTtcblxuICAvKipcbiAgICogUGF1c2VzIGEgdHdlZW4uICBQYXVzZWQgdHdlZW5zIGNhbiBiZSByZXN1bWVkIGZyb20gdGhlIHBvaW50IGF0IHdoaWNoIHRoZXkgd2VyZSBwYXVzZWQuICBUaGlzIGlzIGRpZmZlcmVudCB0aGFuIFtgc3RvcCgpYF0oI3N0b3ApLCBhcyB0aGF0IG1ldGhvZCBjYXVzZXMgYSB0d2VlbiB0byBzdGFydCBvdmVyIHdoZW4gaXQgaXMgcmVzdW1lZC5cbiAgICogQHJldHVybiB7VHdlZW5hYmxlfVxuICAgKi9cbiAgVHdlZW5hYmxlLnByb3RvdHlwZS5wYXVzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9wYXVzZWRBdFRpbWUgPSBub3coKTtcbiAgICB0aGlzLl9pc1BhdXNlZCA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlc3VtZXMgYSBwYXVzZWQgdHdlZW4uXG4gICAqIEByZXR1cm4ge1R3ZWVuYWJsZX1cbiAgICovXG4gIFR3ZWVuYWJsZS5wcm90b3R5cGUucmVzdW1lID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLl9pc1BhdXNlZCkge1xuICAgICAgdGhpcy5fdGltZXN0YW1wICs9IG5vdygpIC0gdGhpcy5fcGF1c2VkQXRUaW1lO1xuICAgIH1cblxuICAgIHRoaXMuX2lzUGF1c2VkID0gZmFsc2U7XG4gICAgdGhpcy5faXNUd2VlbmluZyA9IHRydWU7XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5fdGltZW91dEhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aW1lb3V0SGFuZGxlcihzZWxmLCBzZWxmLl90aW1lc3RhbXAsIHNlbGYuX2R1cmF0aW9uLCBzZWxmLl9jdXJyZW50U3RhdGUsXG4gICAgICAgIHNlbGYuX29yaWdpbmFsU3RhdGUsIHNlbGYuX3RhcmdldFN0YXRlLCBzZWxmLl9lYXNpbmcsIHNlbGYuX3N0ZXAsXG4gICAgICAgIHNlbGYuX3NjaGVkdWxlRnVuY3Rpb24pO1xuICAgIH07XG5cbiAgICB0aGlzLl90aW1lb3V0SGFuZGxlcigpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIFN0b3BzIGFuZCBjYW5jZWxzIGEgdHdlZW4uXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj19IGdvdG9FbmQgSWYgZmFsc2Ugb3Igb21pdHRlZCwgdGhlIHR3ZWVuIGp1c3Qgc3RvcHMgYXQgaXRzIGN1cnJlbnQgc3RhdGUsIGFuZCB0aGUgXCJmaW5pc2hcIiBoYW5kbGVyIGlzIG5vdCBpbnZva2VkLiAgSWYgdHJ1ZSwgdGhlIHR3ZWVuZWQgb2JqZWN0J3MgdmFsdWVzIGFyZSBpbnN0YW50bHkgc2V0IHRvIHRoZSB0YXJnZXQgdmFsdWVzLCBhbmQgXCJmaW5pc2hcIiBpcyBpbnZva2VkLlxuICAgKiBAcmV0dXJuIHtUd2VlbmFibGV9XG4gICAqL1xuICBUd2VlbmFibGUucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoZ290b0VuZCkge1xuICAgIHRoaXMuX2lzVHdlZW5pbmcgPSBmYWxzZTtcbiAgICB0aGlzLl9pc1BhdXNlZCA9IGZhbHNlO1xuICAgIHRoaXMuX3RpbWVvdXRIYW5kbGVyID0gbm9vcDtcblxuICAgIGlmIChnb3RvRW5kKSB7XG4gICAgICBzaGFsbG93Q29weSh0aGlzLl9jdXJyZW50U3RhdGUsIHRoaXMuX3RhcmdldFN0YXRlKTtcbiAgICAgIGFwcGx5RmlsdGVyKHRoaXMsICdhZnRlclR3ZWVuRW5kJyk7XG4gICAgICB0aGlzLl9maW5pc2guY2FsbCh0aGlzLCB0aGlzLl9jdXJyZW50U3RhdGUpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IGEgdHdlZW4gaXMgcnVubmluZy5cbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIFR3ZWVuYWJsZS5wcm90b3R5cGUuaXNQbGF5aW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9pc1R3ZWVuaW5nICYmICF0aGlzLl9pc1BhdXNlZDtcbiAgfTtcblxuICAvKipcbiAgICogU2V0cyBhIGN1c3RvbSBzY2hlZHVsZSBmdW5jdGlvbi5cbiAgICpcbiAgICogSWYgYSBjdXN0b20gZnVuY3Rpb24gaXMgbm90IHNldCB0aGUgZGVmYXVsdCBvbmUgaXMgdXNlZCBbYHJlcXVlc3RBbmltYXRpb25GcmFtZWBdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS93aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSBpZiBhdmFpbGFibGUsIG90aGVyd2lzZSBbYHNldFRpbWVvdXRgXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2luZG93LnNldFRpbWVvdXQpKS5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbihGdW5jdGlvbixudW1iZXIpfSBzY2hlZHVsZUZ1bmN0aW9uIFRoZSBmdW5jdGlvbiB0byBiZSBjYWxsZWQgdG8gc2NoZWR1bGUgdGhlIG5leHQgZnJhbWUgdG8gYmUgcmVuZGVyZWRcbiAgICovXG4gIFR3ZWVuYWJsZS5wcm90b3R5cGUuc2V0U2NoZWR1bGVGdW5jdGlvbiA9IGZ1bmN0aW9uIChzY2hlZHVsZUZ1bmN0aW9uKSB7XG4gICAgdGhpcy5fc2NoZWR1bGVGdW5jdGlvbiA9IHNjaGVkdWxlRnVuY3Rpb247XG4gIH07XG5cbiAgLyoqXG4gICAqIGBkZWxldGVgcyBhbGwgXCJvd25cIiBwcm9wZXJ0aWVzLiAgQ2FsbCB0aGlzIHdoZW4gdGhlIGBUd2VlbmFibGVgIGluc3RhbmNlIGlzIG5vIGxvbmdlciBuZWVkZWQgdG8gZnJlZSBtZW1vcnkuXG4gICAqL1xuICBUd2VlbmFibGUucHJvdG90eXBlLmRpc3Bvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb3A7XG4gICAgZm9yIChwcm9wIGluIHRoaXMpIHtcbiAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzW3Byb3BdO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKiFcbiAgICogRmlsdGVycyBhcmUgdXNlZCBmb3IgdHJhbnNmb3JtaW5nIHRoZSBwcm9wZXJ0aWVzIG9mIGEgdHdlZW4gYXQgdmFyaW91c1xuICAgKiBwb2ludHMgaW4gYSBUd2VlbmFibGUncyBsaWZlIGN5Y2xlLiAgU2VlIHRoZSBSRUFETUUgZm9yIG1vcmUgaW5mbyBvbiB0aGlzLlxuICAgKi9cbiAgVHdlZW5hYmxlLnByb3RvdHlwZS5maWx0ZXIgPSB7fTtcblxuICAvKiFcbiAgICogVGhpcyBvYmplY3QgY29udGFpbnMgYWxsIG9mIHRoZSB0d2VlbnMgYXZhaWxhYmxlIHRvIFNoaWZ0eS4gIEl0IGlzIGV4dGVuZGlibGUgLSBzaW1wbHkgYXR0YWNoIHByb3BlcnRpZXMgdG8gdGhlIFR3ZWVuYWJsZS5wcm90b3R5cGUuZm9ybXVsYSBPYmplY3QgZm9sbG93aW5nIHRoZSBzYW1lIGZvcm1hdCBhdCBsaW5lYXIuXG4gICAqXG4gICAqIGBwb3NgIHNob3VsZCBiZSBhIG5vcm1hbGl6ZWQgYG51bWJlcmAgKGJldHdlZW4gMCBhbmQgMSkuXG4gICAqL1xuICBUd2VlbmFibGUucHJvdG90eXBlLmZvcm11bGEgPSB7XG4gICAgbGluZWFyOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gcG9zO1xuICAgIH1cbiAgfTtcblxuICBmb3JtdWxhID0gVHdlZW5hYmxlLnByb3RvdHlwZS5mb3JtdWxhO1xuXG4gIHNoYWxsb3dDb3B5KFR3ZWVuYWJsZSwge1xuICAgICdub3cnOiBub3dcbiAgICAsJ2VhY2gnOiBlYWNoXG4gICAgLCd0d2VlblByb3BzJzogdHdlZW5Qcm9wc1xuICAgICwndHdlZW5Qcm9wJzogdHdlZW5Qcm9wXG4gICAgLCdhcHBseUZpbHRlcic6IGFwcGx5RmlsdGVyXG4gICAgLCdzaGFsbG93Q29weSc6IHNoYWxsb3dDb3B5XG4gICAgLCdkZWZhdWx0cyc6IGRlZmF1bHRzXG4gICAgLCdjb21wb3NlRWFzaW5nT2JqZWN0JzogY29tcG9zZUVhc2luZ09iamVjdFxuICB9KTtcblxuICAvLyBgcm9vdGAgaXMgcHJvdmlkZWQgaW4gdGhlIGludHJvL291dHJvIGZpbGVzLlxuXG4gIC8vIEEgaG9vayB1c2VkIGZvciB1bml0IHRlc3RpbmcuXG4gIGlmICh0eXBlb2YgU0hJRlRZX0RFQlVHX05PVyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJvb3QudGltZW91dEhhbmRsZXIgPSB0aW1lb3V0SGFuZGxlcjtcbiAgfVxuXG4gIC8vIEJvb3RzdHJhcCBUd2VlbmFibGUgYXBwcm9wcmlhdGVseSBmb3IgdGhlIGVudmlyb25tZW50LlxuICBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgLy8gQ29tbW9uSlNcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFR3ZWVuYWJsZTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBBTURcbiAgICBkZWZpbmUoZnVuY3Rpb24gKCkge3JldHVybiBUd2VlbmFibGU7fSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHJvb3QuVHdlZW5hYmxlID09PSAndW5kZWZpbmVkJykge1xuICAgIC8vIEJyb3dzZXI6IE1ha2UgYFR3ZWVuYWJsZWAgZ2xvYmFsbHkgYWNjZXNzaWJsZS5cbiAgICByb290LlR3ZWVuYWJsZSA9IFR3ZWVuYWJsZTtcbiAgfVxuXG4gIHJldHVybiBUd2VlbmFibGU7XG5cbn0gKCkpO1xuXG4vKiFcbiAqIEFsbCBlcXVhdGlvbnMgYXJlIGFkYXB0ZWQgZnJvbSBUaG9tYXMgRnVjaHMnIFtTY3JpcHR5Ml0oaHR0cHM6Ly9naXRodWIuY29tL21hZHJvYmJ5L3NjcmlwdHkyL2Jsb2IvbWFzdGVyL3NyYy9lZmZlY3RzL3RyYW5zaXRpb25zL3Blbm5lci5qcykuXG4gKlxuICogQmFzZWQgb24gRWFzaW5nIEVxdWF0aW9ucyAoYykgMjAwMyBbUm9iZXJ0IFBlbm5lcl0oaHR0cDovL3d3dy5yb2JlcnRwZW5uZXIuY29tLyksIGFsbCByaWdodHMgcmVzZXJ2ZWQuIFRoaXMgd29yayBpcyBbc3ViamVjdCB0byB0ZXJtc10oaHR0cDovL3d3dy5yb2JlcnRwZW5uZXIuY29tL2Vhc2luZ190ZXJtc19vZl91c2UuaHRtbCkuXG4gKi9cblxuLyohXG4gKiAgVEVSTVMgT0YgVVNFIC0gRUFTSU5HIEVRVUFUSU9OU1xuICogIE9wZW4gc291cmNlIHVuZGVyIHRoZSBCU0QgTGljZW5zZS5cbiAqICBFYXNpbmcgRXF1YXRpb25zIChjKSAyMDAzIFJvYmVydCBQZW5uZXIsIGFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKi9cblxuOyhmdW5jdGlvbiAoKSB7XG5cbiAgVHdlZW5hYmxlLnNoYWxsb3dDb3B5KFR3ZWVuYWJsZS5wcm90b3R5cGUuZm9ybXVsYSwge1xuICAgIGVhc2VJblF1YWQ6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiBNYXRoLnBvdyhwb3MsIDIpO1xuICAgIH0sXG5cbiAgICBlYXNlT3V0UXVhZDogZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIC0oTWF0aC5wb3coKHBvcyAtIDEpLCAyKSAtIDEpO1xuICAgIH0sXG5cbiAgICBlYXNlSW5PdXRRdWFkOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICBpZiAoKHBvcyAvPSAwLjUpIDwgMSkge3JldHVybiAwLjUgKiBNYXRoLnBvdyhwb3MsMik7fVxuICAgICAgcmV0dXJuIC0wLjUgKiAoKHBvcyAtPSAyKSAqIHBvcyAtIDIpO1xuICAgIH0sXG5cbiAgICBlYXNlSW5DdWJpYzogZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIE1hdGgucG93KHBvcywgMyk7XG4gICAgfSxcblxuICAgIGVhc2VPdXRDdWJpYzogZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIChNYXRoLnBvdygocG9zIC0gMSksIDMpICsgMSk7XG4gICAgfSxcblxuICAgIGVhc2VJbk91dEN1YmljOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICBpZiAoKHBvcyAvPSAwLjUpIDwgMSkge3JldHVybiAwLjUgKiBNYXRoLnBvdyhwb3MsMyk7fVxuICAgICAgcmV0dXJuIDAuNSAqIChNYXRoLnBvdygocG9zIC0gMiksMykgKyAyKTtcbiAgICB9LFxuXG4gICAgZWFzZUluUXVhcnQ6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiBNYXRoLnBvdyhwb3MsIDQpO1xuICAgIH0sXG5cbiAgICBlYXNlT3V0UXVhcnQ6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiAtKE1hdGgucG93KChwb3MgLSAxKSwgNCkgLSAxKTtcbiAgICB9LFxuXG4gICAgZWFzZUluT3V0UXVhcnQ6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIGlmICgocG9zIC89IDAuNSkgPCAxKSB7cmV0dXJuIDAuNSAqIE1hdGgucG93KHBvcyw0KTt9XG4gICAgICByZXR1cm4gLTAuNSAqICgocG9zIC09IDIpICogTWF0aC5wb3cocG9zLDMpIC0gMik7XG4gICAgfSxcblxuICAgIGVhc2VJblF1aW50OiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gTWF0aC5wb3cocG9zLCA1KTtcbiAgICB9LFxuXG4gICAgZWFzZU91dFF1aW50OiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gKE1hdGgucG93KChwb3MgLSAxKSwgNSkgKyAxKTtcbiAgICB9LFxuXG4gICAgZWFzZUluT3V0UXVpbnQ6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIGlmICgocG9zIC89IDAuNSkgPCAxKSB7cmV0dXJuIDAuNSAqIE1hdGgucG93KHBvcyw1KTt9XG4gICAgICByZXR1cm4gMC41ICogKE1hdGgucG93KChwb3MgLSAyKSw1KSArIDIpO1xuICAgIH0sXG5cbiAgICBlYXNlSW5TaW5lOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gLU1hdGguY29zKHBvcyAqIChNYXRoLlBJIC8gMikpICsgMTtcbiAgICB9LFxuXG4gICAgZWFzZU91dFNpbmU6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiBNYXRoLnNpbihwb3MgKiAoTWF0aC5QSSAvIDIpKTtcbiAgICB9LFxuXG4gICAgZWFzZUluT3V0U2luZTogZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuICgtMC41ICogKE1hdGguY29zKE1hdGguUEkgKiBwb3MpIC0gMSkpO1xuICAgIH0sXG5cbiAgICBlYXNlSW5FeHBvOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gKHBvcyA9PT0gMCkgPyAwIDogTWF0aC5wb3coMiwgMTAgKiAocG9zIC0gMSkpO1xuICAgIH0sXG5cbiAgICBlYXNlT3V0RXhwbzogZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIChwb3MgPT09IDEpID8gMSA6IC1NYXRoLnBvdygyLCAtMTAgKiBwb3MpICsgMTtcbiAgICB9LFxuXG4gICAgZWFzZUluT3V0RXhwbzogZnVuY3Rpb24gKHBvcykge1xuICAgICAgaWYgKHBvcyA9PT0gMCkge3JldHVybiAwO31cbiAgICAgIGlmIChwb3MgPT09IDEpIHtyZXR1cm4gMTt9XG4gICAgICBpZiAoKHBvcyAvPSAwLjUpIDwgMSkge3JldHVybiAwLjUgKiBNYXRoLnBvdygyLDEwICogKHBvcyAtIDEpKTt9XG4gICAgICByZXR1cm4gMC41ICogKC1NYXRoLnBvdygyLCAtMTAgKiAtLXBvcykgKyAyKTtcbiAgICB9LFxuXG4gICAgZWFzZUluQ2lyYzogZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIC0oTWF0aC5zcXJ0KDEgLSAocG9zICogcG9zKSkgLSAxKTtcbiAgICB9LFxuXG4gICAgZWFzZU91dENpcmM6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiBNYXRoLnNxcnQoMSAtIE1hdGgucG93KChwb3MgLSAxKSwgMikpO1xuICAgIH0sXG5cbiAgICBlYXNlSW5PdXRDaXJjOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICBpZiAoKHBvcyAvPSAwLjUpIDwgMSkge3JldHVybiAtMC41ICogKE1hdGguc3FydCgxIC0gcG9zICogcG9zKSAtIDEpO31cbiAgICAgIHJldHVybiAwLjUgKiAoTWF0aC5zcXJ0KDEgLSAocG9zIC09IDIpICogcG9zKSArIDEpO1xuICAgIH0sXG5cbiAgICBlYXNlT3V0Qm91bmNlOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICBpZiAoKHBvcykgPCAoMSAvIDIuNzUpKSB7XG4gICAgICAgIHJldHVybiAoNy41NjI1ICogcG9zICogcG9zKTtcbiAgICAgIH0gZWxzZSBpZiAocG9zIDwgKDIgLyAyLjc1KSkge1xuICAgICAgICByZXR1cm4gKDcuNTYyNSAqIChwb3MgLT0gKDEuNSAvIDIuNzUpKSAqIHBvcyArIDAuNzUpO1xuICAgICAgfSBlbHNlIGlmIChwb3MgPCAoMi41IC8gMi43NSkpIHtcbiAgICAgICAgcmV0dXJuICg3LjU2MjUgKiAocG9zIC09ICgyLjI1IC8gMi43NSkpICogcG9zICsgMC45Mzc1KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAoNy41NjI1ICogKHBvcyAtPSAoMi42MjUgLyAyLjc1KSkgKiBwb3MgKyAwLjk4NDM3NSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGVhc2VJbkJhY2s6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHZhciBzID0gMS43MDE1ODtcbiAgICAgIHJldHVybiAocG9zKSAqIHBvcyAqICgocyArIDEpICogcG9zIC0gcyk7XG4gICAgfSxcblxuICAgIGVhc2VPdXRCYWNrOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICB2YXIgcyA9IDEuNzAxNTg7XG4gICAgICByZXR1cm4gKHBvcyA9IHBvcyAtIDEpICogcG9zICogKChzICsgMSkgKiBwb3MgKyBzKSArIDE7XG4gICAgfSxcblxuICAgIGVhc2VJbk91dEJhY2s6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHZhciBzID0gMS43MDE1ODtcbiAgICAgIGlmICgocG9zIC89IDAuNSkgPCAxKSB7cmV0dXJuIDAuNSAqIChwb3MgKiBwb3MgKiAoKChzICo9ICgxLjUyNSkpICsgMSkgKiBwb3MgLSBzKSk7fVxuICAgICAgcmV0dXJuIDAuNSAqICgocG9zIC09IDIpICogcG9zICogKCgocyAqPSAoMS41MjUpKSArIDEpICogcG9zICsgcykgKyAyKTtcbiAgICB9LFxuXG4gICAgZWxhc3RpYzogZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIC0xICogTWF0aC5wb3coNCwtOCAqIHBvcykgKiBNYXRoLnNpbigocG9zICogNiAtIDEpICogKDIgKiBNYXRoLlBJKSAvIDIpICsgMTtcbiAgICB9LFxuXG4gICAgc3dpbmdGcm9tVG86IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHZhciBzID0gMS43MDE1ODtcbiAgICAgIHJldHVybiAoKHBvcyAvPSAwLjUpIDwgMSkgPyAwLjUgKiAocG9zICogcG9zICogKCgocyAqPSAoMS41MjUpKSArIDEpICogcG9zIC0gcykpIDpcbiAgICAgICAgICAwLjUgKiAoKHBvcyAtPSAyKSAqIHBvcyAqICgoKHMgKj0gKDEuNTI1KSkgKyAxKSAqIHBvcyArIHMpICsgMik7XG4gICAgfSxcblxuICAgIHN3aW5nRnJvbTogZnVuY3Rpb24gKHBvcykge1xuICAgICAgdmFyIHMgPSAxLjcwMTU4O1xuICAgICAgcmV0dXJuIHBvcyAqIHBvcyAqICgocyArIDEpICogcG9zIC0gcyk7XG4gICAgfSxcblxuICAgIHN3aW5nVG86IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHZhciBzID0gMS43MDE1ODtcbiAgICAgIHJldHVybiAocG9zIC09IDEpICogcG9zICogKChzICsgMSkgKiBwb3MgKyBzKSArIDE7XG4gICAgfSxcblxuICAgIGJvdW5jZTogZnVuY3Rpb24gKHBvcykge1xuICAgICAgaWYgKHBvcyA8ICgxIC8gMi43NSkpIHtcbiAgICAgICAgcmV0dXJuICg3LjU2MjUgKiBwb3MgKiBwb3MpO1xuICAgICAgfSBlbHNlIGlmIChwb3MgPCAoMiAvIDIuNzUpKSB7XG4gICAgICAgIHJldHVybiAoNy41NjI1ICogKHBvcyAtPSAoMS41IC8gMi43NSkpICogcG9zICsgMC43NSk7XG4gICAgICB9IGVsc2UgaWYgKHBvcyA8ICgyLjUgLyAyLjc1KSkge1xuICAgICAgICByZXR1cm4gKDcuNTYyNSAqIChwb3MgLT0gKDIuMjUgLyAyLjc1KSkgKiBwb3MgKyAwLjkzNzUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuICg3LjU2MjUgKiAocG9zIC09ICgyLjYyNSAvIDIuNzUpKSAqIHBvcyArIDAuOTg0Mzc1KTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYm91bmNlUGFzdDogZnVuY3Rpb24gKHBvcykge1xuICAgICAgaWYgKHBvcyA8ICgxIC8gMi43NSkpIHtcbiAgICAgICAgcmV0dXJuICg3LjU2MjUgKiBwb3MgKiBwb3MpO1xuICAgICAgfSBlbHNlIGlmIChwb3MgPCAoMiAvIDIuNzUpKSB7XG4gICAgICAgIHJldHVybiAyIC0gKDcuNTYyNSAqIChwb3MgLT0gKDEuNSAvIDIuNzUpKSAqIHBvcyArIDAuNzUpO1xuICAgICAgfSBlbHNlIGlmIChwb3MgPCAoMi41IC8gMi43NSkpIHtcbiAgICAgICAgcmV0dXJuIDIgLSAoNy41NjI1ICogKHBvcyAtPSAoMi4yNSAvIDIuNzUpKSAqIHBvcyArIDAuOTM3NSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gMiAtICg3LjU2MjUgKiAocG9zIC09ICgyLjYyNSAvIDIuNzUpKSAqIHBvcyArIDAuOTg0Mzc1KTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZWFzZUZyb21UbzogZnVuY3Rpb24gKHBvcykge1xuICAgICAgaWYgKChwb3MgLz0gMC41KSA8IDEpIHtyZXR1cm4gMC41ICogTWF0aC5wb3cocG9zLDQpO31cbiAgICAgIHJldHVybiAtMC41ICogKChwb3MgLT0gMikgKiBNYXRoLnBvdyhwb3MsMykgLSAyKTtcbiAgICB9LFxuXG4gICAgZWFzZUZyb206IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgIHJldHVybiBNYXRoLnBvdyhwb3MsNCk7XG4gICAgfSxcblxuICAgIGVhc2VUbzogZnVuY3Rpb24gKHBvcykge1xuICAgICAgcmV0dXJuIE1hdGgucG93KHBvcywwLjI1KTtcbiAgICB9XG4gIH0pO1xuXG59KCkpO1xuXG4vKiFcbiAqIFRoZSBCZXppZXIgbWFnaWMgaW4gdGhpcyBmaWxlIGlzIGFkYXB0ZWQvY29waWVkIGFsbW9zdCB3aG9sZXNhbGUgZnJvbVxuICogW1NjcmlwdHkyXShodHRwczovL2dpdGh1Yi5jb20vbWFkcm9iYnkvc2NyaXB0eTIvYmxvYi9tYXN0ZXIvc3JjL2VmZmVjdHMvdHJhbnNpdGlvbnMvY3ViaWMtYmV6aWVyLmpzKSxcbiAqIHdoaWNoIHdhcyBhZGFwdGVkIGZyb20gQXBwbGUgY29kZSAod2hpY2ggcHJvYmFibHkgY2FtZSBmcm9tXG4gKiBbaGVyZV0oaHR0cDovL29wZW5zb3VyY2UuYXBwbGUuY29tL3NvdXJjZS9XZWJDb3JlL1dlYkNvcmUtOTU1LjY2L3BsYXRmb3JtL2dyYXBoaWNzL1VuaXRCZXppZXIuaCkpLlxuICogU3BlY2lhbCB0aGFua3MgdG8gQXBwbGUgYW5kIFRob21hcyBGdWNocyBmb3IgbXVjaCBvZiB0aGlzIGNvZGUuXG4gKi9cblxuLyohXG4gKiAgQ29weXJpZ2h0IChjKSAyMDA2IEFwcGxlIENvbXB1dGVyLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxuICogIG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxuICpcbiAqICAxLiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsXG4gKiAgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbiAqXG4gKiAgMi4gUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLFxuICogIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlIGRvY3VtZW50YXRpb25cbiAqICBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cbiAqXG4gKiAgMy4gTmVpdGhlciB0aGUgbmFtZSBvZiB0aGUgY29weXJpZ2h0IGhvbGRlcihzKSBub3IgdGhlIG5hbWVzIG9mIGFueVxuICogIGNvbnRyaWJ1dG9ycyBtYXkgYmUgdXNlZCB0byBlbmRvcnNlIG9yIHByb21vdGUgcHJvZHVjdHMgZGVyaXZlZCBmcm9tXG4gKiAgdGhpcyBzb2Z0d2FyZSB3aXRob3V0IHNwZWNpZmljIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbi5cbiAqXG4gKiAgVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SU1xuICogIFwiQVMgSVNcIiBBTkQgQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTyxcbiAqICBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0VcbiAqICBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIENPUFlSSUdIVCBPV05FUiBPUiBDT05UUklCVVRPUlMgQkUgTElBQkxFXG4gKiAgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFU1xuICogIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUztcbiAqICBMT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT05cbiAqICBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVFxuICogIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTXG4gKiAgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXG4gKi9cbjsoZnVuY3Rpb24gKCkge1xuICAvLyBwb3J0IG9mIHdlYmtpdCBjdWJpYyBiZXppZXIgaGFuZGxpbmcgYnkgaHR0cDovL3d3dy5uZXR6Z2VzdGEuZGUvZGV2L1xuICBmdW5jdGlvbiBjdWJpY0JlemllckF0VGltZSh0LHAxeCxwMXkscDJ4LHAyeSxkdXJhdGlvbikge1xuICAgIHZhciBheCA9IDAsYnggPSAwLGN4ID0gMCxheSA9IDAsYnkgPSAwLGN5ID0gMDtcbiAgICBmdW5jdGlvbiBzYW1wbGVDdXJ2ZVgodCkge3JldHVybiAoKGF4ICogdCArIGJ4KSAqIHQgKyBjeCkgKiB0O31cbiAgICBmdW5jdGlvbiBzYW1wbGVDdXJ2ZVkodCkge3JldHVybiAoKGF5ICogdCArIGJ5KSAqIHQgKyBjeSkgKiB0O31cbiAgICBmdW5jdGlvbiBzYW1wbGVDdXJ2ZURlcml2YXRpdmVYKHQpIHtyZXR1cm4gKDMuMCAqIGF4ICogdCArIDIuMCAqIGJ4KSAqIHQgKyBjeDt9XG4gICAgZnVuY3Rpb24gc29sdmVFcHNpbG9uKGR1cmF0aW9uKSB7cmV0dXJuIDEuMCAvICgyMDAuMCAqIGR1cmF0aW9uKTt9XG4gICAgZnVuY3Rpb24gc29sdmUoeCxlcHNpbG9uKSB7cmV0dXJuIHNhbXBsZUN1cnZlWShzb2x2ZUN1cnZlWCh4LGVwc2lsb24pKTt9XG4gICAgZnVuY3Rpb24gZmFicyhuKSB7aWYgKG4gPj0gMCkge3JldHVybiBuO31lbHNlIHtyZXR1cm4gMCAtIG47fX1cbiAgICBmdW5jdGlvbiBzb2x2ZUN1cnZlWCh4LGVwc2lsb24pIHtcbiAgICAgIHZhciB0MCx0MSx0Mix4MixkMixpO1xuICAgICAgZm9yICh0MiA9IHgsIGkgPSAwOyBpIDwgODsgaSsrKSB7eDIgPSBzYW1wbGVDdXJ2ZVgodDIpIC0geDsgaWYgKGZhYnMoeDIpIDwgZXBzaWxvbikge3JldHVybiB0Mjt9IGQyID0gc2FtcGxlQ3VydmVEZXJpdmF0aXZlWCh0Mik7IGlmIChmYWJzKGQyKSA8IDFlLTYpIHticmVhazt9IHQyID0gdDIgLSB4MiAvIGQyO31cbiAgICAgIHQwID0gMC4wOyB0MSA9IDEuMDsgdDIgPSB4OyBpZiAodDIgPCB0MCkge3JldHVybiB0MDt9IGlmICh0MiA+IHQxKSB7cmV0dXJuIHQxO31cbiAgICAgIHdoaWxlICh0MCA8IHQxKSB7eDIgPSBzYW1wbGVDdXJ2ZVgodDIpOyBpZiAoZmFicyh4MiAtIHgpIDwgZXBzaWxvbikge3JldHVybiB0Mjt9IGlmICh4ID4geDIpIHt0MCA9IHQyO31lbHNlIHt0MSA9IHQyO30gdDIgPSAodDEgLSB0MCkgKiAwLjUgKyB0MDt9XG4gICAgICByZXR1cm4gdDI7IC8vIEZhaWx1cmUuXG4gICAgfVxuICAgIGN4ID0gMy4wICogcDF4OyBieCA9IDMuMCAqIChwMnggLSBwMXgpIC0gY3g7IGF4ID0gMS4wIC0gY3ggLSBieDsgY3kgPSAzLjAgKiBwMXk7IGJ5ID0gMy4wICogKHAyeSAtIHAxeSkgLSBjeTsgYXkgPSAxLjAgLSBjeSAtIGJ5O1xuICAgIHJldHVybiBzb2x2ZSh0LCBzb2x2ZUVwc2lsb24oZHVyYXRpb24pKTtcbiAgfVxuICAvKiFcbiAgICogIGdldEN1YmljQmV6aWVyVHJhbnNpdGlvbih4MSwgeTEsIHgyLCB5MikgLT4gRnVuY3Rpb25cbiAgICpcbiAgICogIEdlbmVyYXRlcyBhIHRyYW5zaXRpb24gZWFzaW5nIGZ1bmN0aW9uIHRoYXQgaXMgY29tcGF0aWJsZVxuICAgKiAgd2l0aCBXZWJLaXQncyBDU1MgdHJhbnNpdGlvbnMgYC13ZWJraXQtdHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb25gXG4gICAqICBDU1MgcHJvcGVydHkuXG4gICAqXG4gICAqICBUaGUgVzNDIGhhcyBtb3JlIGluZm9ybWF0aW9uIGFib3V0XG4gICAqICA8YSBocmVmPVwiaHR0cDovL3d3dy53My5vcmcvVFIvY3NzMy10cmFuc2l0aW9ucy8jdHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb25fdGFnXCI+XG4gICAqICBDU1MzIHRyYW5zaXRpb24gdGltaW5nIGZ1bmN0aW9uczwvYT4uXG4gICAqXG4gICAqICBAcGFyYW0ge251bWJlcn0geDFcbiAgICogIEBwYXJhbSB7bnVtYmVyfSB5MVxuICAgKiAgQHBhcmFtIHtudW1iZXJ9IHgyXG4gICAqICBAcGFyYW0ge251bWJlcn0geTJcbiAgICogIEByZXR1cm4ge2Z1bmN0aW9ufVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0Q3ViaWNCZXppZXJUcmFuc2l0aW9uICh4MSwgeTEsIHgyLCB5Mikge1xuICAgIHJldHVybiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICByZXR1cm4gY3ViaWNCZXppZXJBdFRpbWUocG9zLHgxLHkxLHgyLHkyLDEpO1xuICAgIH07XG4gIH1cbiAgLy8gRW5kIHBvcnRlZCBjb2RlXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBCZXppZXIgZWFzaW5nIGZ1bmN0aW9uIGFuZCBhdHRhY2hlcyBpdCB0byBgVHdlZW5hYmxlLnByb3RvdHlwZS5mb3JtdWxhYC4gIFRoaXMgZnVuY3Rpb24gZ2l2ZXMgeW91IHRvdGFsIGNvbnRyb2wgb3ZlciB0aGUgZWFzaW5nIGN1cnZlLiAgTWF0dGhldyBMZWluJ3MgW0NlYXNlcl0oaHR0cDovL21hdHRoZXdsZWluLmNvbS9jZWFzZXIvKSBpcyBhIHVzZWZ1bCB0b29sIGZvciB2aXN1YWxpemluZyB0aGUgY3VydmVzIHlvdSBjYW4gbWFrZSB3aXRoIHRoaXMgZnVuY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBlYXNpbmcgY3VydmUuICBPdmVyd3JpdGVzIHRoZSBvbGQgZWFzaW5nIGZ1bmN0aW9uIG9uIFR3ZWVuYWJsZS5wcm90b3R5cGUuZm9ybXVsYSBpZiBpdCBleGlzdHMuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB4MVxuICAgKiBAcGFyYW0ge251bWJlcn0geTFcbiAgICogQHBhcmFtIHtudW1iZXJ9IHgyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB5MlxuICAgKiBAcmV0dXJuIHtmdW5jdGlvbn0gVGhlIGVhc2luZyBmdW5jdGlvbiB0aGF0IHdhcyBhdHRhY2hlZCB0byBUd2VlbmFibGUucHJvdG90eXBlLmZvcm11bGEuXG4gICAqL1xuICBUd2VlbmFibGUuc2V0QmV6aWVyRnVuY3Rpb24gPSBmdW5jdGlvbiAobmFtZSwgeDEsIHkxLCB4MiwgeTIpIHtcbiAgICB2YXIgY3ViaWNCZXppZXJUcmFuc2l0aW9uID0gZ2V0Q3ViaWNCZXppZXJUcmFuc2l0aW9uKHgxLCB5MSwgeDIsIHkyKTtcbiAgICBjdWJpY0JlemllclRyYW5zaXRpb24ueDEgPSB4MTtcbiAgICBjdWJpY0JlemllclRyYW5zaXRpb24ueTEgPSB5MTtcbiAgICBjdWJpY0JlemllclRyYW5zaXRpb24ueDIgPSB4MjtcbiAgICBjdWJpY0JlemllclRyYW5zaXRpb24ueTIgPSB5MjtcblxuICAgIHJldHVybiBUd2VlbmFibGUucHJvdG90eXBlLmZvcm11bGFbbmFtZV0gPSBjdWJpY0JlemllclRyYW5zaXRpb247XG4gIH07XG5cblxuICAvKipcbiAgICogYGRlbGV0ZWBzIGFuIGVhc2luZyBmdW5jdGlvbiBmcm9tIGBUd2VlbmFibGUucHJvdG90eXBlLmZvcm11bGFgLiAgQmUgY2FyZWZ1bCB3aXRoIHRoaXMgbWV0aG9kLCBhcyBpdCBgZGVsZXRlYHMgd2hhdGV2ZXIgZWFzaW5nIGZvcm11bGEgbWF0Y2hlcyBgbmFtZWAgKHdoaWNoIG1lYW5zIHlvdSBjYW4gZGVsZXRlIGRlZmF1bHQgU2hpZnR5IGVhc2luZyBmdW5jdGlvbnMpLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgZWFzaW5nIGZ1bmN0aW9uIHRvIGRlbGV0ZS5cbiAgICogQHJldHVybiB7ZnVuY3Rpb259XG4gICAqL1xuICBUd2VlbmFibGUudW5zZXRCZXppZXJGdW5jdGlvbiA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgZGVsZXRlIFR3ZWVuYWJsZS5wcm90b3R5cGUuZm9ybXVsYVtuYW1lXTtcbiAgfTtcblxufSkoKTtcblxuOyhmdW5jdGlvbiAoKSB7XG5cbiAgZnVuY3Rpb24gZ2V0SW50ZXJwb2xhdGVkVmFsdWVzIChcbiAgICBmcm9tLCBjdXJyZW50LCB0YXJnZXRTdGF0ZSwgcG9zaXRpb24sIGVhc2luZykge1xuICAgIHJldHVybiBUd2VlbmFibGUudHdlZW5Qcm9wcyhcbiAgICAgIHBvc2l0aW9uLCBjdXJyZW50LCBmcm9tLCB0YXJnZXRTdGF0ZSwgMSwgMCwgZWFzaW5nKTtcbiAgfVxuXG4gIC8vIEZha2UgYSBUd2VlbmFibGUgYW5kIHBhdGNoIHNvbWUgaW50ZXJuYWxzLiAgVGhpcyBhcHByb2FjaCBhbGxvd3MgdXMgdG9cbiAgLy8gc2tpcCB1bmVjY2Vzc2FyeSBwcm9jZXNzaW5nIGFuZCBvYmplY3QgcmVjcmVhdGlvbiwgY3V0dGluZyBkb3duIG9uIGdhcmJhZ2VcbiAgLy8gY29sbGVjdGlvbiBwYXVzZXMuXG4gIHZhciBtb2NrVHdlZW5hYmxlID0gbmV3IFR3ZWVuYWJsZSgpO1xuICBtb2NrVHdlZW5hYmxlLl9maWx0ZXJBcmdzID0gW107XG5cbiAgLyoqXG4gICAqIENvbXB1dGUgdGhlIG1pZHBvaW50IG9mIHR3byBPYmplY3RzLiAgVGhpcyBtZXRob2QgZWZmZWN0aXZlbHkgY2FsY3VsYXRlcyBhIHNwZWNpZmljIGZyYW1lIG9mIGFuaW1hdGlvbiB0aGF0IFtUd2VlbmFibGUjdHdlZW5dKHNoaWZ0eS5jb3JlLmpzLmh0bWwjdHdlZW4pIGRvZXMgbWFueSB0aW1lcyBvdmVyIHRoZSBjb3Vyc2Ugb2YgYSB0d2Vlbi5cbiAgICpcbiAgICogRXhhbXBsZTpcbiAgICpcbiAgICogYGBgXG4gICAqICB2YXIgaW50ZXJwb2xhdGVkVmFsdWVzID0gVHdlZW5hYmxlLmludGVycG9sYXRlKHtcbiAgICogICAgd2lkdGg6ICcxMDBweCcsXG4gICAqICAgIG9wYWNpdHk6IDAsXG4gICAqICAgIGNvbG9yOiAnI2ZmZidcbiAgICogIH0sIHtcbiAgICogICAgd2lkdGg6ICcyMDBweCcsXG4gICAqICAgIG9wYWNpdHk6IDEsXG4gICAqICAgIGNvbG9yOiAnIzAwMCdcbiAgICogIH0sIDAuNSk7XG4gICAqXG4gICAqICBjb25zb2xlLmxvZyhpbnRlcnBvbGF0ZWRWYWx1ZXMpO1xuICAgKiAgLy8ge29wYWNpdHk6IDAuNSwgd2lkdGg6IFwiMTUwcHhcIiwgY29sb3I6IFwicmdiKDEyNywxMjcsMTI3KVwifVxuICAgKiBgYGBcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGZyb20gVGhlIHN0YXJ0aW5nIHZhbHVlcyB0byB0d2VlbiBmcm9tLlxuICAgKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0U3RhdGUgVGhlIGVuZGluZyB2YWx1ZXMgdG8gdHdlZW4gdG8uXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvbiBUaGUgbm9ybWFsaXplZCBwb3NpdGlvbiB2YWx1ZSAoYmV0d2VlbiAwLjAgYW5kIDEuMCkgdG8gaW50ZXJwb2xhdGUgdGhlIHZhbHVlcyBiZXR3ZWVuIGBmcm9tYCBhbmQgYHRvYCBmb3IuICBgZnJvbWAgcmVwcmVzZW50cyAwIGFuZCBgdG9gIHJlcHJlc2VudHMgYDFgLlxuICAgKiBAcGFyYW0ge3N0cmluZ3xPYmplY3R9IGVhc2luZyBUaGUgZWFzaW5nIGN1cnZlKHMpIHRvIGNhbGN1bGF0ZSB0aGUgbWlkcG9pbnQgYWdhaW5zdC4gIFlvdSBjYW4gcmVmZXJlbmNlIGFueSBlYXNpbmcgZnVuY3Rpb24gYXR0YWNoZWQgdG8gYFR3ZWVuYWJsZS5wcm90b3R5cGUuZm9ybXVsYWAuICBJZiBvbWl0dGVkLCB0aGlzIGRlZmF1bHRzIHRvIFwibGluZWFyXCIuXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIFR3ZWVuYWJsZS5pbnRlcnBvbGF0ZSA9IGZ1bmN0aW9uIChmcm9tLCB0YXJnZXRTdGF0ZSwgcG9zaXRpb24sIGVhc2luZykge1xuICAgIHZhciBjdXJyZW50ID0gVHdlZW5hYmxlLnNoYWxsb3dDb3B5KHt9LCBmcm9tKTtcbiAgICB2YXIgZWFzaW5nT2JqZWN0ID0gVHdlZW5hYmxlLmNvbXBvc2VFYXNpbmdPYmplY3QoXG4gICAgICBmcm9tLCBlYXNpbmcgfHwgJ2xpbmVhcicpO1xuXG4gICAgbW9ja1R3ZWVuYWJsZS5zZXQoe30pO1xuXG4gICAgLy8gQWxpYXMgYW5kIHJldXNlIHRoZSBfZmlsdGVyQXJncyBhcnJheSBpbnN0ZWFkIG9mIHJlY3JlYXRpbmcgaXQuXG4gICAgdmFyIGZpbHRlckFyZ3MgPSBtb2NrVHdlZW5hYmxlLl9maWx0ZXJBcmdzO1xuICAgIGZpbHRlckFyZ3MubGVuZ3RoID0gMDtcbiAgICBmaWx0ZXJBcmdzWzBdID0gY3VycmVudDtcbiAgICBmaWx0ZXJBcmdzWzFdID0gZnJvbTtcbiAgICBmaWx0ZXJBcmdzWzJdID0gdGFyZ2V0U3RhdGU7XG4gICAgZmlsdGVyQXJnc1szXSA9IGVhc2luZ09iamVjdDtcblxuICAgIC8vIEFueSBkZWZpbmVkIHZhbHVlIHRyYW5zZm9ybWF0aW9uIG11c3QgYmUgYXBwbGllZFxuICAgIFR3ZWVuYWJsZS5hcHBseUZpbHRlcihtb2NrVHdlZW5hYmxlLCAndHdlZW5DcmVhdGVkJyk7XG4gICAgVHdlZW5hYmxlLmFwcGx5RmlsdGVyKG1vY2tUd2VlbmFibGUsICdiZWZvcmVUd2VlbicpO1xuXG4gICAgdmFyIGludGVycG9sYXRlZFZhbHVlcyA9IGdldEludGVycG9sYXRlZFZhbHVlcyhcbiAgICAgIGZyb20sIGN1cnJlbnQsIHRhcmdldFN0YXRlLCBwb3NpdGlvbiwgZWFzaW5nT2JqZWN0KTtcblxuICAgIC8vIFRyYW5zZm9ybSB2YWx1ZXMgYmFjayBpbnRvIHRoZWlyIG9yaWdpbmFsIGZvcm1hdFxuICAgIFR3ZWVuYWJsZS5hcHBseUZpbHRlcihtb2NrVHdlZW5hYmxlLCAnYWZ0ZXJUd2VlbicpO1xuXG4gICAgcmV0dXJuIGludGVycG9sYXRlZFZhbHVlcztcbiAgfTtcblxufSgpKTtcblxuLyoqXG4gKiBBZGRzIHN0cmluZyBpbnRlcnBvbGF0aW9uIHN1cHBvcnQgdG8gU2hpZnR5LlxuICpcbiAqIFRoZSBUb2tlbiBleHRlbnNpb24gYWxsb3dzIFNoaWZ0eSB0byB0d2VlbiBudW1iZXJzIGluc2lkZSBvZiBzdHJpbmdzLiAgQW1vbmcgb3RoZXIgdGhpbmdzLCB0aGlzIGFsbG93cyB5b3UgdG8gYW5pbWF0ZSBDU1MgcHJvcGVydGllcy4gIEZvciBleGFtcGxlLCB5b3UgY2FuIGRvIHRoaXM6XG4gKlxuICogYGBgXG4gKiB2YXIgdHdlZW5hYmxlID0gbmV3IFR3ZWVuYWJsZSgpO1xuICogdHdlZW5hYmxlLnR3ZWVuKHtcbiAqICAgZnJvbTogeyB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDQ1cHgpJ30sXG4gKiAgIHRvOiB7IHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoOTB4cCknfVxuICogfSk7XG4gKiBgYGBcbiAqXG4gKiBgdHJhbnNsYXRlWCg0NSlgIHdpbGwgYmUgdHdlZW5lZCB0byBgdHJhbnNsYXRlWCg5MClgLiAgVG8gZGVtb25zdHJhdGU6XG4gKlxuICogYGBgXG4gKiB2YXIgdHdlZW5hYmxlID0gbmV3IFR3ZWVuYWJsZSgpO1xuICogdHdlZW5hYmxlLnR3ZWVuKHtcbiAqICAgZnJvbTogeyB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDQ1cHgpJ30sXG4gKiAgIHRvOiB7IHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoOTBweCknfSxcbiAqICAgc3RlcDogZnVuY3Rpb24gKHN0YXRlKSB7XG4gKiAgICAgY29uc29sZS5sb2coc3RhdGUudHJhbnNmb3JtKTtcbiAqICAgfVxuICogfSk7XG4gKiBgYGBcbiAqXG4gKiBUaGUgYWJvdmUgc25pcHBldCB3aWxsIGxvZyBzb21ldGhpbmcgbGlrZSB0aGlzIGluIHRoZSBjb25zb2xlOlxuICpcbiAqIGBgYFxuICogdHJhbnNsYXRlWCg2MC4zcHgpXG4gKiAuLi5cbiAqIHRyYW5zbGF0ZVgoNzYuMDVweClcbiAqIC4uLlxuICogdHJhbnNsYXRlWCg5MHB4KVxuICogYGBgXG4gKlxuICogQW5vdGhlciB1c2UgZm9yIHRoaXMgaXMgYW5pbWF0aW5nIGNvbG9yczpcbiAqXG4gKiBgYGBcbiAqIHZhciB0d2VlbmFibGUgPSBuZXcgVHdlZW5hYmxlKCk7XG4gKiB0d2VlbmFibGUudHdlZW4oe1xuICogICBmcm9tOiB7IGNvbG9yOiAncmdiKDAsMjU1LDApJ30sXG4gKiAgIHRvOiB7IGNvbG9yOiAncmdiKDI1NSwwLDI1NSknfSxcbiAqICAgc3RlcDogZnVuY3Rpb24gKHN0YXRlKSB7XG4gKiAgICAgY29uc29sZS5sb2coc3RhdGUuY29sb3IpO1xuICogICB9XG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqIFRoZSBhYm92ZSBzbmlwcGV0IHdpbGwgbG9nIHNvbWV0aGluZyBsaWtlIHRoaXM6XG4gKlxuICogYGBgXG4gKiByZ2IoODQsMTcwLDg0KVxuICogLi4uXG4gKiByZ2IoMTcwLDg0LDE3MClcbiAqIC4uLlxuICogcmdiKDI1NSwwLDI1NSlcbiAqIGBgYFxuICpcbiAqIFRoaXMgZXh0ZW5zaW9uIGFsc28gc3VwcG9ydHMgaGV4YWRlY2ltYWwgY29sb3JzLCBpbiBib3RoIGxvbmcgKGAjZmYwMGZmYCkgYW5kIHNob3J0IChgI2YwZmApIGZvcm1zLiAgQmUgYXdhcmUgdGhhdCBoZXhhZGVjaW1hbCBpbnB1dCB2YWx1ZXMgd2lsbCBiZSBjb252ZXJ0ZWQgaW50byB0aGUgZXF1aXZhbGVudCBSR0Igb3V0cHV0IHZhbHVlcy4gIFRoaXMgaXMgZG9uZSB0byBvcHRpbWl6ZSBmb3IgcGVyZm9ybWFuY2UuXG4gKlxuICogYGBgXG4gKiB2YXIgdHdlZW5hYmxlID0gbmV3IFR3ZWVuYWJsZSgpO1xuICogdHdlZW5hYmxlLnR3ZWVuKHtcbiAqICAgZnJvbTogeyBjb2xvcjogJyMwZjAnfSxcbiAqICAgdG86IHsgY29sb3I6ICcjZjBmJ30sXG4gKiAgIHN0ZXA6IGZ1bmN0aW9uIChzdGF0ZSkge1xuICogICAgIGNvbnNvbGUubG9nKHN0YXRlLmNvbG9yKTtcbiAqICAgfVxuICogfSk7XG4gKiBgYGBcbiAqXG4gKiBUaGlzIHNuaXBwZXQgd2lsbCBnZW5lcmF0ZSB0aGUgc2FtZSBvdXRwdXQgYXMgdGhlIG9uZSBiZWZvcmUgaXQgYmVjYXVzZSBlcXVpdmFsZW50IHZhbHVlcyB3ZXJlIHN1cHBsaWVkIChqdXN0IGluIGhleGFkZWNpbWFsIGZvcm0gcmF0aGVyIHRoYW4gUkdCKTpcbiAqXG4gKiBgYGBcbiAqIHJnYig4NCwxNzAsODQpXG4gKiAuLi5cbiAqIHJnYigxNzAsODQsMTcwKVxuICogLi4uXG4gKiByZ2IoMjU1LDAsMjU1KVxuICogYGBgXG4gKlxuICogIyMgRWFzaW5nIHN1cHBvcnRcbiAqXG4gKiBFYXNpbmcgd29ya3Mgc29tZXdoYXQgZGlmZmVyZW50bHkgaW4gdGhlIFRva2VuIGV4dGVuc2lvbi4gIFRoaXMgaXMgYmVjYXVzZSBzb21lIENTUyBwcm9wZXJ0aWVzIGhhdmUgbXVsdGlwbGUgdmFsdWVzIGluIHRoZW0sIGFuZCB5b3UgbWlnaHQgbmVlZCB0byB0d2VlbiBlYWNoIHZhbHVlIGFsb25nIGl0cyBvd24gZWFzaW5nIGN1cnZlLiAgQSBiYXNpYyBleGFtcGxlOlxuICpcbiAqIGBgYFxuICogdmFyIHR3ZWVuYWJsZSA9IG5ldyBUd2VlbmFibGUoKTtcbiAqIHR3ZWVuYWJsZS50d2Vlbih7XG4gKiAgIGZyb206IHsgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgwcHgpIHRyYW5zbGF0ZVkoMHB4KSd9LFxuICogICB0bzogeyB0cmFuc2Zvcm06ICAgJ3RyYW5zbGF0ZVgoMTAwcHgpIHRyYW5zbGF0ZVkoMTAwcHgpJ30sXG4gKiAgIGVhc2luZzogeyB0cmFuc2Zvcm06ICdlYXNlSW5RdWFkJyB9LFxuICogICBzdGVwOiBmdW5jdGlvbiAoc3RhdGUpIHtcbiAqICAgICBjb25zb2xlLmxvZyhzdGF0ZS50cmFuc2Zvcm0pO1xuICogICB9XG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqIFRoZSBhYm92ZSBzbmlwcGV0IGNyZWF0ZSB2YWx1ZXMgbGlrZSB0aGlzOlxuICpcbiAqIGBgYFxuICogdHJhbnNsYXRlWCgxMS41NjAwMDAwMDAwMDAwMDJweCkgdHJhbnNsYXRlWSgxMS41NjAwMDAwMDAwMDAwMDJweClcbiAqIC4uLlxuICogdHJhbnNsYXRlWCg0Ni4yNDAwMDAwMDAwMDAwMXB4KSB0cmFuc2xhdGVZKDQ2LjI0MDAwMDAwMDAwMDAxcHgpXG4gKiAuLi5cbiAqIHRyYW5zbGF0ZVgoMTAwcHgpIHRyYW5zbGF0ZVkoMTAwcHgpXG4gKiBgYGBcbiAqXG4gKiBJbiB0aGlzIGNhc2UsIHRoZSB2YWx1ZXMgZm9yIGB0cmFuc2xhdGVYYCBhbmQgYHRyYW5zbGF0ZVlgIGFyZSBhbHdheXMgdGhlIHNhbWUgZm9yIGVhY2ggc3RlcCBvZiB0aGUgdHdlZW4sIGJlY2F1c2UgdGhleSBoYXZlIHRoZSBzYW1lIHN0YXJ0IGFuZCBlbmQgcG9pbnRzIGFuZCBib3RoIHVzZSB0aGUgc2FtZSBlYXNpbmcgY3VydmUuICBXZSBjYW4gYWxzbyB0d2VlbiBgdHJhbnNsYXRlWGAgYW5kIGB0cmFuc2xhdGVZYCBhbG9uZyBpbmRlcGVuZGVudCBjdXJ2ZXM6XG4gKlxuICogYGBgXG4gKiB2YXIgdHdlZW5hYmxlID0gbmV3IFR3ZWVuYWJsZSgpO1xuICogdHdlZW5hYmxlLnR3ZWVuKHtcbiAqICAgZnJvbTogeyB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDBweCkgdHJhbnNsYXRlWSgwcHgpJ30sXG4gKiAgIHRvOiB7IHRyYW5zZm9ybTogICAndHJhbnNsYXRlWCgxMDBweCkgdHJhbnNsYXRlWSgxMDBweCknfSxcbiAqICAgZWFzaW5nOiB7IHRyYW5zZm9ybTogJ2Vhc2VJblF1YWQgYm91bmNlJyB9LFxuICogICBzdGVwOiBmdW5jdGlvbiAoc3RhdGUpIHtcbiAqICAgICBjb25zb2xlLmxvZyhzdGF0ZS50cmFuc2Zvcm0pO1xuICogICB9XG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqIFRoZSBhYm92ZSBzbmlwcGV0IGNyZWF0ZSB2YWx1ZXMgbGlrZSB0aGlzOlxuICpcbiAqIGBgYFxuICogdHJhbnNsYXRlWCgxMC44OXB4KSB0cmFuc2xhdGVZKDgyLjM1NTYyNXB4KVxuICogLi4uXG4gKiB0cmFuc2xhdGVYKDQ0Ljg5MDAwMDAwMDAwMDAxcHgpIHRyYW5zbGF0ZVkoODYuNzMwNjI1MDAwMDAwMDJweClcbiAqIC4uLlxuICogdHJhbnNsYXRlWCgxMDBweCkgdHJhbnNsYXRlWSgxMDBweClcbiAqIGBgYFxuICpcbiAqIGB0cmFuc2xhdGVYYCBhbmQgYHRyYW5zbGF0ZVlgIGFyZSBub3QgaW4gc3luYyBhbnltb3JlLCBiZWNhdXNlIGBlYXNlSW5RdWFkYCB3YXMgc3BlY2lmaWVkIGZvciBgdHJhbnNsYXRlWGAgYW5kIGBib3VuY2VgIGZvciBgdHJhbnNsYXRlWWAuICBNaXhpbmcgYW5kIG1hdGNoaW5nIGVhc2luZyBjdXJ2ZXMgY2FuIG1ha2UgZm9yIHNvbWUgaW50ZXJlc3RpbmcgbW90aW9uIGluIHlvdXIgYW5pbWF0aW9ucy5cbiAqXG4gKiBUaGUgb3JkZXIgb2YgdGhlIHNwYWNlLXNlcGFyYXRlZCBlYXNpbmcgY3VydmVzIGNvcnJlc3BvbmQgdGhlIHRva2VuIHZhbHVlcyB0aGV5IGFwcGx5IHRvLiAgSWYgdGhlcmUgYXJlIG1vcmUgdG9rZW4gdmFsdWVzIHRoYW4gZWFzaW5nIGN1cnZlcyBsaXN0ZWQsIHRoZSBsYXN0IGVhc2luZyBjdXJ2ZSBsaXN0ZWQgaXMgdXNlZC5cbiAqL1xuZnVuY3Rpb24gdG9rZW4gKCkge1xuICAvLyBGdW5jdGlvbmFsaXR5IGZvciB0aGlzIGV4dGVuc2lvbiBydW5zIGltcGxpY2l0bHkgaWYgaXQgaXMgbG9hZGVkLlxufSAvKiEqL1xuXG4vLyB0b2tlbiBmdW5jdGlvbiBpcyBkZWZpbmVkIGFib3ZlIG9ubHkgc28gdGhhdCBkb3gtZm91bmRhdGlvbiBzZWVzIGl0IGFzXG4vLyBkb2N1bWVudGF0aW9uIGFuZCByZW5kZXJzIGl0LiAgSXQgaXMgbmV2ZXIgdXNlZCwgYW5kIGlzIG9wdGltaXplZCBhd2F5IGF0XG4vLyBidWlsZCB0aW1lLlxuXG47KGZ1bmN0aW9uIChUd2VlbmFibGUpIHtcblxuICAvKiFcbiAgICogQHR5cGVkZWYge3tcbiAgICogICBmb3JtYXRTdHJpbmc6IHN0cmluZ1xuICAgKiAgIGNodW5rTmFtZXM6IEFycmF5LjxzdHJpbmc+XG4gICAqIH19XG4gICAqL1xuICB2YXIgZm9ybWF0TWFuaWZlc3Q7XG5cbiAgLy8gQ09OU1RBTlRTXG5cbiAgdmFyIFJfRk9STUFUX0NIVU5LUyA9IC8oW15cXC0wLTlcXC5dKykvZztcbiAgdmFyIFJfVU5GT1JNQVRURURfVkFMVUVTID0gL1swLTkuXFwtXSsvZztcbiAgdmFyIFJfUkdCID0gbmV3IFJlZ0V4cChcbiAgICAncmdiXFxcXCgnICsgUl9VTkZPUk1BVFRFRF9WQUxVRVMuc291cmNlICtcbiAgICAoLyxcXHMqLy5zb3VyY2UpICsgUl9VTkZPUk1BVFRFRF9WQUxVRVMuc291cmNlICtcbiAgICAoLyxcXHMqLy5zb3VyY2UpICsgUl9VTkZPUk1BVFRFRF9WQUxVRVMuc291cmNlICsgJ1xcXFwpJywgJ2cnKTtcbiAgdmFyIFJfUkdCX1BSRUZJWCA9IC9eLipcXCgvO1xuICB2YXIgUl9IRVggPSAvIyhbMC05XXxbYS1mXSl7Myw2fS9naTtcbiAgdmFyIFZBTFVFX1BMQUNFSE9MREVSID0gJ1ZBTCc7XG5cbiAgLy8gSEVMUEVSU1xuXG4gIHZhciBnZXRGb3JtYXRDaHVua3NGcm9tX2FjY3VtdWxhdG9yID0gW107XG4gIC8qIVxuICAgKiBAcGFyYW0ge0FycmF5Lm51bWJlcn0gcmF3VmFsdWVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwcmVmaXhcbiAgICpcbiAgICogQHJldHVybiB7QXJyYXkuPHN0cmluZz59XG4gICAqL1xuICBmdW5jdGlvbiBnZXRGb3JtYXRDaHVua3NGcm9tIChyYXdWYWx1ZXMsIHByZWZpeCkge1xuICAgIGdldEZvcm1hdENodW5rc0Zyb21fYWNjdW11bGF0b3IubGVuZ3RoID0gMDtcblxuICAgIHZhciByYXdWYWx1ZXNMZW5ndGggPSByYXdWYWx1ZXMubGVuZ3RoO1xuICAgIHZhciBpO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IHJhd1ZhbHVlc0xlbmd0aDsgaSsrKSB7XG4gICAgICBnZXRGb3JtYXRDaHVua3NGcm9tX2FjY3VtdWxhdG9yLnB1c2goJ18nICsgcHJlZml4ICsgJ18nICsgaSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdldEZvcm1hdENodW5rc0Zyb21fYWNjdW11bGF0b3I7XG4gIH1cblxuICAvKiFcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZvcm1hdHRlZFN0cmluZ1xuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRGb3JtYXRTdHJpbmdGcm9tIChmb3JtYXR0ZWRTdHJpbmcpIHtcbiAgICB2YXIgY2h1bmtzID0gZm9ybWF0dGVkU3RyaW5nLm1hdGNoKFJfRk9STUFUX0NIVU5LUyk7XG5cbiAgICBpZiAoIWNodW5rcykge1xuICAgICAgLy8gY2h1bmtzIHdpbGwgYmUgbnVsbCBpZiB0aGVyZSB3ZXJlIG5vIHRva2VucyB0byBwYXJzZSBpblxuICAgICAgLy8gZm9ybWF0dGVkU3RyaW5nIChmb3IgZXhhbXBsZSwgaWYgZm9ybWF0dGVkU3RyaW5nIGlzICcyJykuICBDb2VyY2VcbiAgICAgIC8vIGNodW5rcyB0byBiZSB1c2VmdWwgaGVyZS5cbiAgICAgIGNodW5rcyA9IFsnJywgJyddO1xuICAgIH0gZWxzZSBpZiAoY2h1bmtzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgY2h1bmtzLnVuc2hpZnQoJycpO1xuICAgIH1cblxuICAgIHJldHVybiBjaHVua3Muam9pbihWQUxVRV9QTEFDRUhPTERFUik7XG4gIH1cblxuICAvKiFcbiAgICogQ29udmVydCBhbGwgaGV4IGNvbG9yIHZhbHVlcyB3aXRoaW4gYSBzdHJpbmcgdG8gYW4gcmdiIHN0cmluZy5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlT2JqZWN0XG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH0gVGhlIG1vZGlmaWVkIG9ialxuICAgKi9cbiAgZnVuY3Rpb24gc2FuaXRpemVPYmplY3RGb3JIZXhQcm9wcyAoc3RhdGVPYmplY3QpIHtcbiAgICBUd2VlbmFibGUuZWFjaChzdGF0ZU9iamVjdCwgZnVuY3Rpb24gKHByb3ApIHtcbiAgICAgIHZhciBjdXJyZW50UHJvcCA9IHN0YXRlT2JqZWN0W3Byb3BdO1xuXG4gICAgICBpZiAodHlwZW9mIGN1cnJlbnRQcm9wID09PSAnc3RyaW5nJyAmJiBjdXJyZW50UHJvcC5tYXRjaChSX0hFWCkpIHtcbiAgICAgICAgc3RhdGVPYmplY3RbcHJvcF0gPSBzYW5pdGl6ZUhleENodW5rc1RvUkdCKGN1cnJlbnRQcm9wKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qIVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uICBzYW5pdGl6ZUhleENodW5rc1RvUkdCIChzdHIpIHtcbiAgICByZXR1cm4gZmlsdGVyU3RyaW5nQ2h1bmtzKFJfSEVYLCBzdHIsIGNvbnZlcnRIZXhUb1JHQik7XG4gIH1cblxuICAvKiFcbiAgICogQHBhcmFtIHtzdHJpbmd9IGhleFN0cmluZ1xuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBjb252ZXJ0SGV4VG9SR0IgKGhleFN0cmluZykge1xuICAgIHZhciByZ2JBcnIgPSBoZXhUb1JHQkFycmF5KGhleFN0cmluZyk7XG4gICAgcmV0dXJuICdyZ2IoJyArIHJnYkFyclswXSArICcsJyArIHJnYkFyclsxXSArICcsJyArIHJnYkFyclsyXSArICcpJztcbiAgfVxuXG4gIHZhciBoZXhUb1JHQkFycmF5X3JldHVybkFycmF5ID0gW107XG4gIC8qIVxuICAgKiBDb252ZXJ0IGEgaGV4YWRlY2ltYWwgc3RyaW5nIHRvIGFuIGFycmF5IHdpdGggdGhyZWUgaXRlbXMsIG9uZSBlYWNoIGZvclxuICAgKiB0aGUgcmVkLCBibHVlLCBhbmQgZ3JlZW4gZGVjaW1hbCB2YWx1ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBoZXggQSBoZXhhZGVjaW1hbCBzdHJpbmcuXG4gICAqXG4gICAqIEByZXR1cm5zIHtBcnJheS48bnVtYmVyPn0gVGhlIGNvbnZlcnRlZCBBcnJheSBvZiBSR0IgdmFsdWVzIGlmIGBoZXhgIGlzIGFcbiAgICogdmFsaWQgc3RyaW5nLCBvciBhbiBBcnJheSBvZiB0aHJlZSAwJ3MuXG4gICAqL1xuICBmdW5jdGlvbiBoZXhUb1JHQkFycmF5IChoZXgpIHtcblxuICAgIGhleCA9IGhleC5yZXBsYWNlKC8jLywgJycpO1xuXG4gICAgLy8gSWYgdGhlIHN0cmluZyBpcyBhIHNob3J0aGFuZCB0aHJlZSBkaWdpdCBoZXggbm90YXRpb24sIG5vcm1hbGl6ZSBpdCB0b1xuICAgIC8vIHRoZSBzdGFuZGFyZCBzaXggZGlnaXQgbm90YXRpb25cbiAgICBpZiAoaGV4Lmxlbmd0aCA9PT0gMykge1xuICAgICAgaGV4ID0gaGV4LnNwbGl0KCcnKTtcbiAgICAgIGhleCA9IGhleFswXSArIGhleFswXSArIGhleFsxXSArIGhleFsxXSArIGhleFsyXSArIGhleFsyXTtcbiAgICB9XG5cbiAgICBoZXhUb1JHQkFycmF5X3JldHVybkFycmF5WzBdID0gaGV4VG9EZWMoaGV4LnN1YnN0cigwLCAyKSk7XG4gICAgaGV4VG9SR0JBcnJheV9yZXR1cm5BcnJheVsxXSA9IGhleFRvRGVjKGhleC5zdWJzdHIoMiwgMikpO1xuICAgIGhleFRvUkdCQXJyYXlfcmV0dXJuQXJyYXlbMl0gPSBoZXhUb0RlYyhoZXguc3Vic3RyKDQsIDIpKTtcblxuICAgIHJldHVybiBoZXhUb1JHQkFycmF5X3JldHVybkFycmF5O1xuICB9XG5cbiAgLyohXG4gICAqIENvbnZlcnQgYSBiYXNlLTE2IG51bWJlciB0byBiYXNlLTEwLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcnxTdHJpbmd9IGhleCBUaGUgdmFsdWUgdG8gY29udmVydFxuICAgKlxuICAgKiBAcmV0dXJucyB7TnVtYmVyfSBUaGUgYmFzZS0xMCBlcXVpdmFsZW50IG9mIGBoZXhgLlxuICAgKi9cbiAgZnVuY3Rpb24gaGV4VG9EZWMgKGhleCkge1xuICAgIHJldHVybiBwYXJzZUludChoZXgsIDE2KTtcbiAgfVxuXG4gIC8qIVxuICAgKiBSdW5zIGEgZmlsdGVyIG9wZXJhdGlvbiBvbiBhbGwgY2h1bmtzIG9mIGEgc3RyaW5nIHRoYXQgbWF0Y2ggYSBSZWdFeHBcbiAgICpcbiAgICogQHBhcmFtIHtSZWdFeHB9IHBhdHRlcm5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHVuZmlsdGVyZWRTdHJpbmdcbiAgICogQHBhcmFtIHtmdW5jdGlvbihzdHJpbmcpfSBmaWx0ZXJcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gZmlsdGVyU3RyaW5nQ2h1bmtzIChwYXR0ZXJuLCB1bmZpbHRlcmVkU3RyaW5nLCBmaWx0ZXIpIHtcbiAgICB2YXIgcGF0dGVuTWF0Y2hlcyA9IHVuZmlsdGVyZWRTdHJpbmcubWF0Y2gocGF0dGVybik7XG4gICAgdmFyIGZpbHRlcmVkU3RyaW5nID0gdW5maWx0ZXJlZFN0cmluZy5yZXBsYWNlKHBhdHRlcm4sIFZBTFVFX1BMQUNFSE9MREVSKTtcblxuICAgIGlmIChwYXR0ZW5NYXRjaGVzKSB7XG4gICAgICB2YXIgcGF0dGVuTWF0Y2hlc0xlbmd0aCA9IHBhdHRlbk1hdGNoZXMubGVuZ3RoO1xuICAgICAgdmFyIGN1cnJlbnRDaHVuaztcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXR0ZW5NYXRjaGVzTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY3VycmVudENodW5rID0gcGF0dGVuTWF0Y2hlcy5zaGlmdCgpO1xuICAgICAgICBmaWx0ZXJlZFN0cmluZyA9IGZpbHRlcmVkU3RyaW5nLnJlcGxhY2UoXG4gICAgICAgICAgVkFMVUVfUExBQ0VIT0xERVIsIGZpbHRlcihjdXJyZW50Q2h1bmspKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmlsdGVyZWRTdHJpbmc7XG4gIH1cblxuICAvKiFcbiAgICogQ2hlY2sgZm9yIGZsb2F0aW5nIHBvaW50IHZhbHVlcyB3aXRoaW4gcmdiIHN0cmluZ3MgYW5kIHJvdW5kcyB0aGVtLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZm9ybWF0dGVkU3RyaW5nXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIHNhbml0aXplUkdCQ2h1bmtzIChmb3JtYXR0ZWRTdHJpbmcpIHtcbiAgICByZXR1cm4gZmlsdGVyU3RyaW5nQ2h1bmtzKFJfUkdCLCBmb3JtYXR0ZWRTdHJpbmcsIHNhbml0aXplUkdCQ2h1bmspO1xuICB9XG5cbiAgLyohXG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZ2JDaHVua1xuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBzYW5pdGl6ZVJHQkNodW5rIChyZ2JDaHVuaykge1xuICAgIHZhciBudW1iZXJzID0gcmdiQ2h1bmsubWF0Y2goUl9VTkZPUk1BVFRFRF9WQUxVRVMpO1xuICAgIHZhciBudW1iZXJzTGVuZ3RoID0gbnVtYmVycy5sZW5ndGg7XG4gICAgdmFyIHNhbml0aXplZFN0cmluZyA9IHJnYkNodW5rLm1hdGNoKFJfUkdCX1BSRUZJWClbMF07XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bWJlcnNMZW5ndGg7IGkrKykge1xuICAgICAgc2FuaXRpemVkU3RyaW5nICs9IHBhcnNlSW50KG51bWJlcnNbaV0sIDEwKSArICcsJztcbiAgICB9XG5cbiAgICBzYW5pdGl6ZWRTdHJpbmcgPSBzYW5pdGl6ZWRTdHJpbmcuc2xpY2UoMCwgLTEpICsgJyknO1xuXG4gICAgcmV0dXJuIHNhbml0aXplZFN0cmluZztcbiAgfVxuXG4gIC8qIVxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVPYmplY3RcbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSBBbiBPYmplY3Qgb2YgZm9ybWF0TWFuaWZlc3RzIHRoYXQgY29ycmVzcG9uZCB0b1xuICAgKiB0aGUgc3RyaW5nIHByb3BlcnRpZXMgb2Ygc3RhdGVPYmplY3RcbiAgICovXG4gIGZ1bmN0aW9uIGdldEZvcm1hdE1hbmlmZXN0cyAoc3RhdGVPYmplY3QpIHtcbiAgICB2YXIgbWFuaWZlc3RBY2N1bXVsYXRvciA9IHt9O1xuXG4gICAgVHdlZW5hYmxlLmVhY2goc3RhdGVPYmplY3QsIGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgICB2YXIgY3VycmVudFByb3AgPSBzdGF0ZU9iamVjdFtwcm9wXTtcblxuICAgICAgaWYgKHR5cGVvZiBjdXJyZW50UHJvcCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdmFyIHJhd1ZhbHVlcyA9IGdldFZhbHVlc0Zyb20oY3VycmVudFByb3ApO1xuXG4gICAgICAgIG1hbmlmZXN0QWNjdW11bGF0b3JbcHJvcF0gPSB7XG4gICAgICAgICAgJ2Zvcm1hdFN0cmluZyc6IGdldEZvcm1hdFN0cmluZ0Zyb20oY3VycmVudFByb3ApXG4gICAgICAgICAgLCdjaHVua05hbWVzJzogZ2V0Rm9ybWF0Q2h1bmtzRnJvbShyYXdWYWx1ZXMsIHByb3ApXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbWFuaWZlc3RBY2N1bXVsYXRvcjtcbiAgfVxuXG4gIC8qIVxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVPYmplY3RcbiAgICogQHBhcmFtIHtPYmplY3R9IGZvcm1hdE1hbmlmZXN0c1xuICAgKi9cbiAgZnVuY3Rpb24gZXhwYW5kRm9ybWF0dGVkUHJvcGVydGllcyAoc3RhdGVPYmplY3QsIGZvcm1hdE1hbmlmZXN0cykge1xuICAgIFR3ZWVuYWJsZS5lYWNoKGZvcm1hdE1hbmlmZXN0cywgZnVuY3Rpb24gKHByb3ApIHtcbiAgICAgIHZhciBjdXJyZW50UHJvcCA9IHN0YXRlT2JqZWN0W3Byb3BdO1xuICAgICAgdmFyIHJhd1ZhbHVlcyA9IGdldFZhbHVlc0Zyb20oY3VycmVudFByb3ApO1xuICAgICAgdmFyIHJhd1ZhbHVlc0xlbmd0aCA9IHJhd1ZhbHVlcy5sZW5ndGg7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmF3VmFsdWVzTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgc3RhdGVPYmplY3RbZm9ybWF0TWFuaWZlc3RzW3Byb3BdLmNodW5rTmFtZXNbaV1dID0gK3Jhd1ZhbHVlc1tpXTtcbiAgICAgIH1cblxuICAgICAgZGVsZXRlIHN0YXRlT2JqZWN0W3Byb3BdO1xuICAgIH0pO1xuICB9XG5cbiAgLyohXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZU9iamVjdFxuICAgKiBAcGFyYW0ge09iamVjdH0gZm9ybWF0TWFuaWZlc3RzXG4gICAqL1xuICBmdW5jdGlvbiBjb2xsYXBzZUZvcm1hdHRlZFByb3BlcnRpZXMgKHN0YXRlT2JqZWN0LCBmb3JtYXRNYW5pZmVzdHMpIHtcbiAgICBUd2VlbmFibGUuZWFjaChmb3JtYXRNYW5pZmVzdHMsIGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgICB2YXIgY3VycmVudFByb3AgPSBzdGF0ZU9iamVjdFtwcm9wXTtcbiAgICAgIHZhciBmb3JtYXRDaHVua3MgPSBleHRyYWN0UHJvcGVydHlDaHVua3MoXG4gICAgICAgIHN0YXRlT2JqZWN0LCBmb3JtYXRNYW5pZmVzdHNbcHJvcF0uY2h1bmtOYW1lcyk7XG4gICAgICB2YXIgdmFsdWVzTGlzdCA9IGdldFZhbHVlc0xpc3QoXG4gICAgICAgIGZvcm1hdENodW5rcywgZm9ybWF0TWFuaWZlc3RzW3Byb3BdLmNodW5rTmFtZXMpO1xuICAgICAgY3VycmVudFByb3AgPSBnZXRGb3JtYXR0ZWRWYWx1ZXMoXG4gICAgICAgIGZvcm1hdE1hbmlmZXN0c1twcm9wXS5mb3JtYXRTdHJpbmcsIHZhbHVlc0xpc3QpO1xuICAgICAgc3RhdGVPYmplY3RbcHJvcF0gPSBzYW5pdGl6ZVJHQkNodW5rcyhjdXJyZW50UHJvcCk7XG4gICAgfSk7XG4gIH1cblxuICAvKiFcbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlT2JqZWN0XG4gICAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IGNodW5rTmFtZXNcbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgZXh0cmFjdGVkIHZhbHVlIGNodW5rcy5cbiAgICovXG4gIGZ1bmN0aW9uIGV4dHJhY3RQcm9wZXJ0eUNodW5rcyAoc3RhdGVPYmplY3QsIGNodW5rTmFtZXMpIHtcbiAgICB2YXIgZXh0cmFjdGVkVmFsdWVzID0ge307XG4gICAgdmFyIGN1cnJlbnRDaHVua05hbWUsIGNodW5rTmFtZXNMZW5ndGggPSBjaHVua05hbWVzLmxlbmd0aDtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2h1bmtOYW1lc0xlbmd0aDsgaSsrKSB7XG4gICAgICBjdXJyZW50Q2h1bmtOYW1lID0gY2h1bmtOYW1lc1tpXTtcbiAgICAgIGV4dHJhY3RlZFZhbHVlc1tjdXJyZW50Q2h1bmtOYW1lXSA9IHN0YXRlT2JqZWN0W2N1cnJlbnRDaHVua05hbWVdO1xuICAgICAgZGVsZXRlIHN0YXRlT2JqZWN0W2N1cnJlbnRDaHVua05hbWVdO1xuICAgIH1cblxuICAgIHJldHVybiBleHRyYWN0ZWRWYWx1ZXM7XG4gIH1cblxuICB2YXIgZ2V0VmFsdWVzTGlzdF9hY2N1bXVsYXRvciA9IFtdO1xuICAvKiFcbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlT2JqZWN0XG4gICAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IGNodW5rTmFtZXNcbiAgICpcbiAgICogQHJldHVybiB7QXJyYXkuPG51bWJlcj59XG4gICAqL1xuICBmdW5jdGlvbiBnZXRWYWx1ZXNMaXN0IChzdGF0ZU9iamVjdCwgY2h1bmtOYW1lcykge1xuICAgIGdldFZhbHVlc0xpc3RfYWNjdW11bGF0b3IubGVuZ3RoID0gMDtcbiAgICB2YXIgY2h1bmtOYW1lc0xlbmd0aCA9IGNodW5rTmFtZXMubGVuZ3RoO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaHVua05hbWVzTGVuZ3RoOyBpKyspIHtcbiAgICAgIGdldFZhbHVlc0xpc3RfYWNjdW11bGF0b3IucHVzaChzdGF0ZU9iamVjdFtjaHVua05hbWVzW2ldXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdldFZhbHVlc0xpc3RfYWNjdW11bGF0b3I7XG4gIH1cblxuICAvKiFcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZvcm1hdFN0cmluZ1xuICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSByYXdWYWx1ZXNcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0Rm9ybWF0dGVkVmFsdWVzIChmb3JtYXRTdHJpbmcsIHJhd1ZhbHVlcykge1xuICAgIHZhciBmb3JtYXR0ZWRWYWx1ZVN0cmluZyA9IGZvcm1hdFN0cmluZztcbiAgICB2YXIgcmF3VmFsdWVzTGVuZ3RoID0gcmF3VmFsdWVzLmxlbmd0aDtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmF3VmFsdWVzTGVuZ3RoOyBpKyspIHtcbiAgICAgIGZvcm1hdHRlZFZhbHVlU3RyaW5nID0gZm9ybWF0dGVkVmFsdWVTdHJpbmcucmVwbGFjZShcbiAgICAgICAgVkFMVUVfUExBQ0VIT0xERVIsICtyYXdWYWx1ZXNbaV0udG9GaXhlZCg0KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZvcm1hdHRlZFZhbHVlU3RyaW5nO1xuICB9XG5cbiAgLyohXG4gICAqIE5vdGU6IEl0J3MgdGhlIGR1dHkgb2YgdGhlIGNhbGxlciB0byBjb252ZXJ0IHRoZSBBcnJheSBlbGVtZW50cyBvZiB0aGVcbiAgICogcmV0dXJuIHZhbHVlIGludG8gbnVtYmVycy4gIFRoaXMgaXMgYSBwZXJmb3JtYW5jZSBvcHRpbWl6YXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtYXR0ZWRTdHJpbmdcbiAgICpcbiAgICogQHJldHVybiB7QXJyYXkuPHN0cmluZz58bnVsbH1cbiAgICovXG4gIGZ1bmN0aW9uIGdldFZhbHVlc0Zyb20gKGZvcm1hdHRlZFN0cmluZykge1xuICAgIHJldHVybiBmb3JtYXR0ZWRTdHJpbmcubWF0Y2goUl9VTkZPUk1BVFRFRF9WQUxVRVMpO1xuICB9XG5cbiAgLyohXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlYXNpbmdPYmplY3RcbiAgICogQHBhcmFtIHtPYmplY3R9IHRva2VuRGF0YVxuICAgKi9cbiAgZnVuY3Rpb24gZXhwYW5kRWFzaW5nT2JqZWN0IChlYXNpbmdPYmplY3QsIHRva2VuRGF0YSkge1xuICAgIFR3ZWVuYWJsZS5lYWNoKHRva2VuRGF0YSwgZnVuY3Rpb24gKHByb3ApIHtcbiAgICAgIHZhciBjdXJyZW50UHJvcCA9IHRva2VuRGF0YVtwcm9wXTtcbiAgICAgIHZhciBjaHVua05hbWVzID0gY3VycmVudFByb3AuY2h1bmtOYW1lcztcbiAgICAgIHZhciBjaHVua0xlbmd0aCA9IGNodW5rTmFtZXMubGVuZ3RoO1xuICAgICAgdmFyIGVhc2luZ0NodW5rcyA9IGVhc2luZ09iamVjdFtwcm9wXS5zcGxpdCgnICcpO1xuICAgICAgdmFyIGxhc3RFYXNpbmdDaHVuayA9IGVhc2luZ0NodW5rc1tlYXNpbmdDaHVua3MubGVuZ3RoIC0gMV07XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2h1bmtMZW5ndGg7IGkrKykge1xuICAgICAgICBlYXNpbmdPYmplY3RbY2h1bmtOYW1lc1tpXV0gPSBlYXNpbmdDaHVua3NbaV0gfHwgbGFzdEVhc2luZ0NodW5rO1xuICAgICAgfVxuXG4gICAgICBkZWxldGUgZWFzaW5nT2JqZWN0W3Byb3BdO1xuICAgIH0pO1xuICB9XG5cbiAgLyohXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlYXNpbmdPYmplY3RcbiAgICogQHBhcmFtIHtPYmplY3R9IHRva2VuRGF0YVxuICAgKi9cbiAgZnVuY3Rpb24gY29sbGFwc2VFYXNpbmdPYmplY3QgKGVhc2luZ09iamVjdCwgdG9rZW5EYXRhKSB7XG4gICAgVHdlZW5hYmxlLmVhY2godG9rZW5EYXRhLCBmdW5jdGlvbiAocHJvcCkge1xuICAgICAgdmFyIGN1cnJlbnRQcm9wID0gdG9rZW5EYXRhW3Byb3BdO1xuICAgICAgdmFyIGNodW5rTmFtZXMgPSBjdXJyZW50UHJvcC5jaHVua05hbWVzO1xuICAgICAgdmFyIGNodW5rTGVuZ3RoID0gY2h1bmtOYW1lcy5sZW5ndGg7XG4gICAgICB2YXIgY29tcG9zZWRFYXNpbmdTdHJpbmcgPSAnJztcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaHVua0xlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbXBvc2VkRWFzaW5nU3RyaW5nICs9ICcgJyArIGVhc2luZ09iamVjdFtjaHVua05hbWVzW2ldXTtcbiAgICAgICAgZGVsZXRlIGVhc2luZ09iamVjdFtjaHVua05hbWVzW2ldXTtcbiAgICAgIH1cblxuICAgICAgZWFzaW5nT2JqZWN0W3Byb3BdID0gY29tcG9zZWRFYXNpbmdTdHJpbmcuc3Vic3RyKDEpO1xuICAgIH0pO1xuICB9XG5cbiAgVHdlZW5hYmxlLnByb3RvdHlwZS5maWx0ZXIudG9rZW4gPSB7XG4gICAgJ3R3ZWVuQ3JlYXRlZCc6IGZ1bmN0aW9uIChjdXJyZW50U3RhdGUsIGZyb21TdGF0ZSwgdG9TdGF0ZSwgZWFzaW5nT2JqZWN0KSB7XG4gICAgICBzYW5pdGl6ZU9iamVjdEZvckhleFByb3BzKGN1cnJlbnRTdGF0ZSk7XG4gICAgICBzYW5pdGl6ZU9iamVjdEZvckhleFByb3BzKGZyb21TdGF0ZSk7XG4gICAgICBzYW5pdGl6ZU9iamVjdEZvckhleFByb3BzKHRvU3RhdGUpO1xuICAgICAgdGhpcy5fdG9rZW5EYXRhID0gZ2V0Rm9ybWF0TWFuaWZlc3RzKGN1cnJlbnRTdGF0ZSk7XG4gICAgfSxcblxuICAgICdiZWZvcmVUd2Vlbic6IGZ1bmN0aW9uIChjdXJyZW50U3RhdGUsIGZyb21TdGF0ZSwgdG9TdGF0ZSwgZWFzaW5nT2JqZWN0KSB7XG4gICAgICBleHBhbmRFYXNpbmdPYmplY3QoZWFzaW5nT2JqZWN0LCB0aGlzLl90b2tlbkRhdGEpO1xuICAgICAgZXhwYW5kRm9ybWF0dGVkUHJvcGVydGllcyhjdXJyZW50U3RhdGUsIHRoaXMuX3Rva2VuRGF0YSk7XG4gICAgICBleHBhbmRGb3JtYXR0ZWRQcm9wZXJ0aWVzKGZyb21TdGF0ZSwgdGhpcy5fdG9rZW5EYXRhKTtcbiAgICAgIGV4cGFuZEZvcm1hdHRlZFByb3BlcnRpZXModG9TdGF0ZSwgdGhpcy5fdG9rZW5EYXRhKTtcbiAgICB9LFxuXG4gICAgJ2FmdGVyVHdlZW4nOiBmdW5jdGlvbiAoY3VycmVudFN0YXRlLCBmcm9tU3RhdGUsIHRvU3RhdGUsIGVhc2luZ09iamVjdCkge1xuICAgICAgY29sbGFwc2VGb3JtYXR0ZWRQcm9wZXJ0aWVzKGN1cnJlbnRTdGF0ZSwgdGhpcy5fdG9rZW5EYXRhKTtcbiAgICAgIGNvbGxhcHNlRm9ybWF0dGVkUHJvcGVydGllcyhmcm9tU3RhdGUsIHRoaXMuX3Rva2VuRGF0YSk7XG4gICAgICBjb2xsYXBzZUZvcm1hdHRlZFByb3BlcnRpZXModG9TdGF0ZSwgdGhpcy5fdG9rZW5EYXRhKTtcbiAgICAgIGNvbGxhcHNlRWFzaW5nT2JqZWN0KGVhc2luZ09iamVjdCwgdGhpcy5fdG9rZW5EYXRhKTtcbiAgICB9XG4gIH07XG5cbn0gKFR3ZWVuYWJsZSkpO1xuXG59KHRoaXMpKTtcbiJdfQ==
