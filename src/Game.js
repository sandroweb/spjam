var Level = require('./Level');
var Begin = require('./Begin');
var LevelEnd = require('./LevelEnd');
var GameOver = require('./GameOver');
var Gameplay = require('./Gameplay');
var Light = require('./Light');
var Tweenable = require('./vendor/shifty')
var GameInput = require('./GameInput.js');

window.Tweenable = Tweenable;
window.tweenable = new Tweenable();

module.exports = function Game() {

  // Stage setup
  var stage = new PIXI.Stage(0xFFFFFF, true);
  stage.setInteractive(true);

  this.stage = stage;

  // stage.click = function(e) {
  //   light.x = e.originalEvent.x;
  //   light.y = e.originalEvent.y;
  // }

  var renderer = new PIXI.CanvasRenderer(640, 960, null, false /* transparent */, true /* antialias */);
  renderer.view.style.display = "block";
  renderer.view.style.border = "1px solid";
  document.body.appendChild(renderer.view);

  this.renderer = renderer;

  ////Input
  var input = new GameInput();

  // LevelIndex
  var levelIndex = 0;
  var self = this;
  window.light = new Light(50, 50);

  var lightGraphics = new PIXI.Graphics(),
      lightContainer = new PIXI.DisplayObjectContainer();

  // level images
  var images = [],
    begin,
    levelend,
    gameover,
    loader;

  this.restart = function() {
    alert('Game.js - this.restart()');
  }

  this.nextLevel = function() {
    alert('Game.js - this.nextLevel()');
  }

  this.setLevel = function(levelData) {
    var h = renderer.height,
        w = renderer.width;

    var level = new Level(self);

    // add stage border to level segments
    level.segments.unshift( {a:{x:0,y:0}, b:{x:w,y:0}} );
    level.segments.unshift( {a:{x:w,y:0}, b:{x:w,y:h}} );
    level.segments.unshift( {a:{x:w,y:h}, b:{x:0,y:h}} );
    level.segments.unshift( {a:{x:0,y:h}, b:{x:0,y:0}} );

    level.parse(levelData);
    light.setSegments(level.segments);

    self.level = level;

    self.loop();
  };

  this.loadLevel = function(levelIndex) {
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
  };

  this.loop = function() {
    requestAnimFrame(animate);

    function animate() {
      self.update(); // logic
      renderer.render(stage);
      requestAnimFrame( animate );
    }
  };

  function addImages(currScreen) {
    var i, image, total = currScreen.images.length;
    for (i = 0; i < total; ++i) {
      image = currScreen.images[i];
      if (images.indexOf(image) === -1) {
        images.push(image);
      }
    }
  }

  this.start = function() {
    stage.addChild(lightGraphics);
    stage.addChild(lightContainer);

    begin = new Begin(this);
    levelend = new LevelEnd(this);
    gameover = new GameOver(this);
    self.loop();
    addImages(begin);
    addImages(levelend);
    addImages(gameover);
    loader = new PIXI.AssetLoader(images);
    loader.onComplete = begin.show;
    loader.load();
  };

  this.start();
}
