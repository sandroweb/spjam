module.exports = function Level(game) {
  var self = this;

  var levelobjects = [];
  self.levelobjects = [];

  var segments = [];
  self.segments = segments;

  //
  // Level methods
  //

  this.parse = function(data) {
    // TODO: @epaneto
    console.log("parse level"+data.layers[0].objects);

    for (index = 0; index < data.layers[0].objects.length; ++index) {
      ////setup behavior
      var behaviour = null;
      switch (data.layers[0].objects[index].type)
      {
          case "platform":
            behaviour = new PlatformBehavior();
            break;

          case "switch":
            behaviour = new SwitchBehavior(data.layers[0].objects[index].type.properties.move);
            break;
      }

      levelobjects.push(behaviour);

      ////create shadow
      if(!data.layers[0].objects[index].properties.shadow)
        continue;

      var size = data.layers[0].objects[index].width;
      var originX = data.layers[0].objects[index].x;
      var originY = data.layers[0].objects[index].y;

      var segmentA = {a:{x:originX,y:originY}, b:{x:originX + size,y:originY}};
      var segmentB = {a:{x:originX+size,y:originY}, b:{x:originX + size,y:originY+size}};
      var segmentC = {a:{x:originX+size,y:originY+size}, b:{x:originX,y:originY + size}};
      var segmentD = {a:{x:originX,y:originY + size}, b:{x:originX,y:originY}};

      this.segments.push(segmentA);
      this.segments.push(segmentB);
      this.segments.push(segmentC);
      this.segments.push(segmentD);

      console.log(segments);
    }
  }

};
