var Level = require('./Level');
var Gameplay = require('./Gameplay');
var Light = require('./Light');
var TWEEN = require('./vendor/tween.min.js');

module.exports = function Game() {

  // Stage setup
  var stage = new PIXI.Stage(0xFFFFFF, true);
  stage.setInteractive(true);

  this.stage = stage;

  var renderer = PIXI.autoDetectRenderer(640, 960, null, false /* transparent */, true /* antialias */);
  renderer.view.style.display = "block";
  renderer.view.style.border = "1px solid";
  document.body.appendChild(renderer.view);

  this.renderer = renderer;

  //
  // Game methods
  //

  window.light = new Light(50, 50);
  var lightGraphics = new PIXI.Graphics();

  ////LevelIndex
  var levelIndex = 0;
  var self = this;

  this.setLevel = function(levelData) {
    var h = renderer.height,
        w = renderer.width;

    var level = new Level();

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

  this.start = function() {
    stage.addChild(lightGraphics);
    this.loop();
  };

  var lastLightX, lastLightY;

  this.updateLights = function() {
    // nothing to update, skip
    if (light.x == lastLightX && light.y == lastLightY) {
      return;
    }

    // FIXME
    if (light.segments.lenght == 0 || !this.level || this.level.segments.length == 0) {
      return;
    }

    lightGraphics.clear();

    // Sight Polygons
    var polygons = light.getSightPolygons();

    // DRAW AS A GIANT POLYGON
    for(var i=1;i<polygons.length;i++){
      stage.addChild( light.getPolygonGraphics(polygons[i], "rgba(255,255,255,0.2)") );
    }
    stage.addChild( light.getPolygonGraphics(polygons[0], "#fff") );

    // // Masked Foreground
    // ctx.globalCompositeOperation = "source-in";
    // ctx.drawImage(foreground,0,0);
    // ctx.globalCompositeOperation = "source-over";

    // Draw dots
    lightGraphics.beginFill(0xfff);
    lightGraphics.arc(light.x, light.y, 2, 0, 2*Math.PI, false);
    lightGraphics.endFill();

    for(var angle=0;angle<Math.PI*2;angle+=(Math.PI*2)/10){
      var dx = Math.cos(angle)*light.fuzzyRadius;
      var dy = Math.sin(angle)*light.fuzzyRadius;
      lightGraphics.beginFill(0xfff);
      lightGraphics.arc(light.x+dx, light.y+dy, 2, 0, 2*Math.PI, false);
      lightGraphics.endFill();
    }

    lastLightX = light.x;
    lastLightY = light.y;
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

}
