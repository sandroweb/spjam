module.exports = function Level() {
  this.polygons = [];

  var segments = [];
  this.segments = segments;

  //
  // Level methods
  //

  this.parse = function(data) {
    // TODO: @epaneto
    console.log("parse level"+data.layers[0].objects);

    for (index = 0; index < data.layers[0].objects.length; ++index) {
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
