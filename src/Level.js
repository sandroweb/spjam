
var PlatformBehavior = require('./behaviors/PlatformBehavior.js');
var SwitchBehavior = require('./behaviors/SwitchBehavior.js');

module.exports = function Level(game) {
  var self = this;

  this.segments = [];
  this.levelobjects = [];

  //
  // Level methods
  //

  this.parse = function(data) {
    for (index = 0; index < data.layers[0].objects.length; ++index) {
      ////setup behavior
      var BehaviourClass = require("./behaviors/" + data.layers[0].objects[index].type + ".js");
      var behaviour = new BehaviourClass(data.layers[0].objects[index].properties);
      self.levelobjects.push(behaviour);

      /////retrive position and size specs
      var size = data.layers[0].objects[index].width;
      var originX = data.layers[0].objects[index].x;
      var originY = data.layers[0].objects[index].y;

      /////create visual
      var visual = new PIXI.Sprite(PIXI.Texture.fromImage("img/" + data.layers[0].objects[index].properties.img));
      visual.position.x = originX;
      visual.position.y = originY;
      game.stage.addChild(visual);

      console.log(visual + " " + "img/" + data.layers[0].objects[index].properties.img + " " + originX + " " + originY);

      ////create shadow
      if(!data.layers[0].objects[index].properties.shadow)
        continue;

      var segmentA = {a:{x:originX,y:originY}, b:{x:originX + size,y:originY}};
      var segmentB = {a:{x:originX+size,y:originY}, b:{x:originX + size,y:originY+size}};
      var segmentC = {a:{x:originX+size,y:originY+size}, b:{x:originX,y:originY + size}};
      var segmentD = {a:{x:originX,y:originY + size}, b:{x:originX,y:originY}};

      this.segments.push(segmentA);

      this.segments.push(segmentB);
      this.segments.push(segmentC);
      this.segments.push(segmentD);
    }
  }

  this.update = function(player)
  {
    for (index = 0; index < self.levelobjects.length; ++index) {
      self.levelobjects[index].update(player);
    }
  }
};
