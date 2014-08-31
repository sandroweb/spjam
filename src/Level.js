
var PlatformBehavior = require('./behaviors/PlatformBehavior.js');
var SwitchBehavior = require('./behaviors/SwitchBehavior.js');
var EndBehavior = require('./behaviors/EndBehavior.js');
var LightBehavior = require('./behaviors/LightBehavior.js');

module.exports = function Level(game) {
  var self = this;
  var playerPos = {};

  this.segments = [];
  this.levelobjects = [];
  self.playerPos = playerPos;

  //
  // Level methods
  //

this.parse = function(data) {
    for (index = 0; index < data.layers[0].objects.length; ++index) {

      ////search for player start point
      if(data.layers[0].objects[index].type == "start")
      {
        self.playerPos = {x:data.layers[0].objects[index].x, y:data.layers[0].objects[index].y};
        continue;
      }

      ////setup behavior
      var BehaviourClass = require("./behaviors/" + data.layers[0].objects[index].type + ".js");
      var behavior = new BehaviourClass(data.layers[0].objects[index]);
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
    for (index = 0; index < self.levelobjects.length; ++index) {
      self.levelobjects[index].update(game);
    }
  }
};
