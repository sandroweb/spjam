
var PlatformBehavior = require('./behaviors/PlatformBehavior.js');
var SwitchBehavior = require('./behaviors/SwitchBehavior.js');
var EndBehavior = require('./behaviors/EndBehavior.js');
var LightBehavior = require('./behaviors/LightBehavior.js');

module.exports = function Level(game, index) {
  var self = this;

  this.index = index;
  this.segments = [];
  this.levelobjects = [];
  this.playerPos = {};
  this.container = new PIXI.DisplayObjectContainer();

  this.view = new PIXI.DisplayObjectContainer();

  //
  // Level methods
  //

  this.dispose = function() {
    this.levelobjects = null;
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


    for (index = 0; index < data.layers[0].objects.length; ++index) {

      ////search for player start point
      if(data.layers[0].objects[index].type == "start")
      {
        self.playerPos = {x:data.layers[0].objects[index].x, y:data.layers[0].objects[index].y};
        continue;
      }

      ////setup behavior
      var BehaviourClass = require("./behaviors/" + data.layers[0].objects[index].type + ".js");
      var behavior = new BehaviourClass(self.container, data.layers[0].objects[index]);
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
      var size = data.layers[0].objects[index].width;
      var originX = data.layers[0].objects[index].x;
      var originY = data.layers[0].objects[index].y;

      var segmentA = {target:behavior.view,a:{x:originX,y:originY}, b:{x:originX + size,y:originY}};
      var segmentB = {target:behavior.view,a:{x:originX+size,y:originY}, b:{x:originX + size,y:originY+size}};
      var segmentC = {target:behavior.view,a:{x:originX+size,y:originY+size}, b:{x:originX,y:originY + size}};
      var segmentD = {target:behavior.view,a:{x:originX,y:originY + size}, b:{x:originX,y:originY}};

      this.segments.push(segmentA);
      this.segments.push(segmentB);
      this.segments.push(segmentC);
      this.segments.push(segmentD);
    }
  }


  this.update = function(game)
  {
    if (self.levelobjects) {
      for (index = 0; index < self.levelobjects.length; ++index) {
        self.levelobjects[index].update(game);
      }
    }
  }
};
