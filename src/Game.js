var Level = require('./Level');
var Gameplay = require('./Gameplay');
var Light = require('./Light');
window.TWEEN = require('./vendor/tween.min.js')

module.exports = function Game() {

  // Stage setup
  var stage = new PIXI.Stage(0xFFFFFF, true);
  stage.setInteractive(true);

  var renderer = PIXI.autoDetectRenderer(960, 640, null, false /* transparent */, true /* antialias */);
  renderer.view.style.display = "block";
  renderer.view.style.border = "1px solid";
  document.body.appendChild(renderer.view);

  //
  // Game methods
  //

  window.light = new Light(200, 50);
  var lightGraphics = new PIXI.Graphics();

  ////LevelIndex
  var levelIndex = 0;

  this.setLevel = function(level) {
    var h = renderer.height,
        w = renderer.width;

    var level = new Level();

    // // add stage border to level segments
    level.segments.unshift( {a:{x:0,y:0}, b:{x:w,y:0}} );
    level.segments.unshift( {a:{x:w,y:0}, b:{x:w,y:h}} );
    level.segments.unshift( {a:{x:w,y:h}, b:{x:0,y:h}} );
    level.segments.unshift( {a:{x:0,y:h}, b:{x:0,y:0}} );

    level.parse(levelData);

    this.level = level;
  };
  this.setLevel = setLevel;

  this.loadLevel = function(levelIndex) {
    console.log("level/level" + levelIndex + ".json");
    var loader = new PIXI.JsonLoader("level/level" + levelIndex + ".json");
    loader.on('loaded', function(evt) {
      //data is in evt.content.json
      console.log("json loaded!");

      setLevel(evt.content.json);
    });

    loader.load();
  }

  this.loadLevel = function(levelIndex) {
    console.log("level/level" + levelIndex + ".json");
    var loader = new PIXI.JsonLoader("level/level" + levelIndex + ".json");
    loader.on('loaded', function(evt) {
      //data is in evt.content.json
      console.log("json loaded!");

      setLevel(evt.content.json);
    });

    loader.load();
  }

  this.start = function() {
    light.setSegments(this.level.segments);
    stage.addChild(lightGraphics);
    this.loop();
  };

  var lastLightX, lastLightY;

  var updateLights = function() {
    // nothing to update, skip
    if (light.x == lastLightX && light.y == lastLightY) {
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
  this.updateLights = updateLights;

  this.loop = function() {
    requestAnimFrame(animate);
    function animate() {
      updateLights();
      renderer.render(stage);
      requestAnimFrame( animate );
    }
  };

}
