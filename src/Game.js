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


  ////LevelIndex
  var levelIndex = 0;

  this.setLevel = function(level) {
    var h = renderer.height,
        w = renderer.width;

    console.log(level);

    // // add stage border to level segments
    level.segments.unshift( {a:{x:0,y:0}, b:{x:w,y:0}} );
    level.segments.unshift( {a:{x:w,y:0}, b:{x:w,y:h}} );
    level.segments.unshift( {a:{x:w,y:h}, b:{x:0,y:h}} );
    level.segments.unshift( {a:{x:0,y:h}, b:{x:0,y:0}} );

    this.level = level;
  };

  this.loadLevel = function(levelIndex) {
    var loader = new PIXI.JsonLoader("level/level" + levelIndex + ".json");
    loader.on('loaded', function(evt) {
      //data is in evt.content.json
      evt.content.json
      console.log(evt.content.json);
    });
  }

  loadLevel(1);

  this.loop = function() {
    var segments = this.level.segments;

    function getIntersection(ray, segment) {
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
    }

    function getSightPolygon(sightX, sightY){
      // Get all unique points
      var points = (function(segments){
        var a = [];
        segments.forEach(function(seg){
          a.push(seg.a,seg.b);
        });
        return a;
      })(segments);
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
        for(var i=0;i<segments.length;i++){
          var intersect = getIntersection(ray,segments[i]);
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

    function getPolygonGraphics(polygon, fillStyle) {
      var g = new PIXI.Graphics();
      g.beginFill(0x000);
      g.moveTo(polygon[0].x, polygon[0].y);
      for(var i=1;i<polygon.length;i++){
        var intersect = polygon[i];
        g.lineTo(intersect.x, intersect.y);
      }
      g.endFill();
      return g;
    }

    // Create level 1
    function createScene(stage) {
      var g = new PIXI.Graphics();

      // Clear canvas
      g.clear();
      // ctx.clearRect(0, 0, canvas.width, canvas.height);

      var lightX = 50, lightY = 50;

      // Sight Polygons
      var fuzzyRadius = 10;
      var polygons = [ getSightPolygon(lightX, lightY) ];
      for(var angle=0;angle<Math.PI*2;angle+=(Math.PI*2)/10){
        var dx = Math.cos(angle)*fuzzyRadius;
        var dy = Math.sin(angle)*fuzzyRadius;
        polygons.push(getSightPolygon(lightX+dx,lightY+dy));
      };

      // DRAW AS A GIANT POLYGON
      for(var i=1;i<polygons.length;i++){
        stage.addChild( getPolygonGraphics(polygons[i], "rgba(255,255,255,0.2)") );
      }
      stage.addChild( getPolygonGraphics(polygons[0], "#fff") );

      // // Masked Foreground
      // ctx.globalCompositeOperation = "source-in";
      // ctx.drawImage(foreground,0,0);
      // ctx.globalCompositeOperation = "source-over";

      // Draw dots
      g.beginFill(0x000);
      g.arc(lightX, lightY, 2, 0, 2*Math.PI, false);
      g.endFill();
      for(var angle=0;angle<Math.PI*2;angle+=(Math.PI*2)/10){
        var dx = Math.cos(angle)*fuzzyRadius;
        var dy = Math.sin(angle)*fuzzyRadius;
        g.beginFill(0x000);
        g.arc(lightX+dx, lightY+dy, 2, 0, 2*Math.PI, false);
        g.endFill();
      }
      stage.addChild(g);
    }

    createScene(stage);

    requestAnimFrame(animate);
    function animate() {
      renderer.render(stage);
      requestAnimFrame( animate );
    }

  };
}
