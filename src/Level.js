
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
  }
};
