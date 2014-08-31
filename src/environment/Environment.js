var axis = {x:0, y:0};
var heroPos = {x:20, y:0};
var floor = 0;

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);

function onKeyDown(e)
{
	if (e.keyCode == 37)
	{
		axis.x = -1;
	}

	if (e.keyCode == 39)
	{
		axis.x = 1;
	}

	if (e.keyCode == 38)
	{
		axis.y = -1;
	}

	if (e.keyCode == 40)
	{
		axis.y = 1;
	}
}

function onKeyUp(e)
{
	if (e.keyCode == 37 && axis.x == -1)
	{
		axis.x = 0;
	}

	if (e.keyCode == 39 && axis.x == 1)
	{
		axis.x = 0;
	}

	if (e.keyCode == 38 && axis.y == -1)
	{
		axis.y = 0;
	}

	if (e.keyCode == 40 && axis.y == 1)
	{
		axis.y = 0;
	}
}


// Find intersection of RAY & SEGMENT
function getIntersection(ray,segment){

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

function getSightPolygon(sightX,sightY){

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

///////////////////////////////////////////////////////

// DRAWING
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
function draw(){

	// Clear canvas
	ctx.clearRect(0,0,canvas.width,canvas.height);

	// Draw segments
	ctx.strokeStyle = "#999";
	for(var i=0;i<segments.length;i++){
		var seg = segments[i];
		ctx.beginPath();
		ctx.moveTo(seg.a.x,seg.a.y);
		ctx.lineTo(seg.b.x,seg.b.y);
		ctx.stroke();
	}

	// Sight Polygons
	var fuzzyRadius = 0;
	var polygons = [getSightPolygon(Mouse.x,Mouse.y)];

	for(var angle=0;angle<Math.PI*2;angle+=(Math.PI*2)/10){
		var dx = Math.cos(angle)*fuzzyRadius;
		var dy = Math.sin(angle)*fuzzyRadius;
		polygons.push(getSightPolygon(Mouse.x+dx,Mouse.y+dy));
	};

	// DRAW AS A GIANT POLYGON
	// for(var i=1;i<polygons.length;i++){
	// 	drawPolygon(polygons[i],ctx);
	// }
	drawPolygon(polygons[0],ctx,"#fff");

	var vertices = polygons[0];
	var walking = axis.x != 0;
	var offset = 5;
	var velX = walking ? 3 : 0;
	var velY = 3;

	var lineHA = {x:heroPos.x - 1000, y:heroPos.y};
	var lineHB = {x:heroPos.x + 1000, y:heroPos.y};
	var lineVA = {x:heroPos.x, y:heroPos.y - 1000};
	var lineVB = {x:heroPos.x, y:heroPos.y + 1000};
	var resultH = raycast(lineHA, lineHB, vertices);
	var resultV = raycast(lineVA, lineVB, vertices);
	var nearest = getNearestFaces(heroPos, resultH.concat(resultV));
	var isInside = pointInPolygon(heroPos, vertices);

	if (axis.x < 0 && nearest.ld - offset < velX)
	{
		velX = nearest.ld - offset;
	}

	if (axis.x > 0 && nearest.rd - offset < velX)
	{
		velX = nearest.rd - offset;
	}

	if (axis.y < 0 && nearest.td - offset < velY)
	{
		velY = nearest.td - offset;
	}

	if (axis.y > 0 && nearest.bd - offset < velY)
	{
		velY = nearest.bd - offset;
	}


	var prevX = heroPos.x;
	heroPos.x += axis.x*velX;

	var lineHA = {x:heroPos.x - 1000, y:heroPos.y};
	var lineHB = {x:heroPos.x + 1000, y:heroPos.y};
	var resultH = raycast(lineHA, lineHB, vertices);
	var nearest = getNearestFaces(heroPos, resultH);
	var isInside = pointInPolygon(heroPos, vertices);

	if (isInside)
	{
		if (nearest.l)
		{
			if (heroPos.x < nearest.l.point.x + offset) heroPos.x = nearest.l.point.x + offset;

			ctx.beginPath();
			ctx.moveTo(heroPos.x, heroPos.y);
			ctx.lineTo(nearest.l.point.x, heroPos.y)
			ctx.strokeStyle = "#FF0000";
			ctx.stroke();	
		}

		if (nearest.r)
		{
			if (heroPos.x > nearest.r.point.x - offset) heroPos.x = nearest.r.point.x - offset;

			ctx.beginPath();
			ctx.moveTo(heroPos.x, heroPos.y);
			ctx.lineTo(nearest.r.point.x, heroPos.y);
			ctx.strokeStyle = "#FF0000";
			ctx.stroke();	
		}	
	}
	else
	{
		heroPos.x = prevX;
	}
	

	var prevY = heroPos.y;
	heroPos.y += 1;

	var lineVA = {x:heroPos.x, y:heroPos.y - 1000};
	var lineVB = {x:heroPos.x, y:heroPos.y + 1000};
	var resultV = raycast(lineVA, lineVB, vertices);
	var nearest = getNearestFaces(heroPos, resultV);
	var isInside = pointInPolygon(heroPos, vertices);


	if (isInside)
	{
		if (nearest.t)
		{
			if (heroPos.y < nearest.t.point.y + offset) heroPos.y = nearest.t.point.y + offset;

			ctx.beginPath();
			ctx.moveTo(heroPos.x, heroPos.y);
			ctx.lineTo(heroPos.x, nearest.t.point.y);
			ctx.strokeStyle = "#FF0000";
			ctx.stroke();	
		}

		if (nearest.b)
		{
			if (heroPos.y > nearest.b.point.y - offset) heroPos.y = nearest.b.point.y - offset;

			ctx.beginPath();
			ctx.moveTo(heroPos.x, heroPos.y);
			ctx.lineTo(heroPos.x, nearest.b.point.y);
			ctx.strokeStyle = "#FF0000";
			ctx.stroke();	
		}	
	}
	else
	{
		heroPos.y = prevY;
	}
	
	



	ctx.lineWidth = 1;

	// Draw red dots
	ctx.fillStyle = "#dd3838";
	ctx.beginPath();
    ctx.arc(Mouse.x, Mouse.y, 2, 0, 2*Math.PI, false);
    ctx.fill();

    ctx.fillStyle = "#FFCC00";
	ctx.beginPath();
    ctx.arc(heroPos.x, heroPos.y, 6, 0, 6*Math.PI, false);
    ctx.fill();
}

function getNearestFaces(pos, faces)
{
	var result = {l:null, r:null, t:null, b:null, dl:100000, dr:100000, dt:100000, db:100000};

	for (var i = 0; i < faces.length; i++)
	{
		var r = faces[i];

		if (r.point.onLine1 && r.point.onLine2)
		{
			var d = lineDistance(pos, r.point);
			
			if (r.point.x < pos.x)
			{
				if (d < result.dl) 
				{
					result.dl = d;
					result.l = r;
				}
			}

			if (r.point.x > pos.x)
			{
				if (d < result.dr) 
				{
					result.dr = d;
					result.r = r;
				}
			}

			if (r.point.y < pos.y)
			{
				if (d < result.dt) 
				{
					result.dt = d;
					result.t = r;
				}
			}	

			if (r.point.y > pos.y)
			{
				if (d < result.db) 
				{
					result.db = d;
					result.b = r;
				}
			}	
		}
	}

	return result;
}

function drawPolygon(polygon,ctx){
	ctx.fillStyle = "#FFFFFF";
	ctx.beginPath();
	ctx.moveTo(polygon[0].x,polygon[0].y);
	for(var i=1;i<polygon.length;i++){
		var intersect = polygon[i];
		ctx.lineTo(intersect.x,intersect.y);
	}
	ctx.fill();
}

function raycast(startPoint, endPoint, vertices)
{
	var len = vertices.length;
	var result = [];

	for (var i = 0; i < len; i++)
	{
		var a = vertices[i];
		var b = i >= (len - 1) ? vertices[0] : vertices[i+1];
		var r = checkLineIntersection(startPoint.x, startPoint.y, endPoint.x, endPoint.y, a.x, a.y, b.x, b.y);
		if (r.onLine1 && r.onLine2)
		{
			var face = {a:a, b:b, point:r};
			result.push(face);
		}
	}

	return result;
}

function lineDistance( point1, point2 )
{
  var xs = 0;
  var ys = 0;
 
  xs = point2.x - point1.x;
  xs = xs * xs;
 
  ys = point2.y - point1.y;
  ys = ys * ys;
 
  return Math.sqrt( xs + ys );
}

// LINE SEGMENTS
var segments = [

	// Border
	{a:{x:0,y:0}, b:{x:640,y:0}},
	{a:{x:640,y:0}, b:{x:640,y:360}},
	{a:{x:640,y:360}, b:{x:0,y:360}},
	{a:{x:0,y:360}, b:{x:0,y:0}},

	// Polygon #1
	{a:{x:100,y:150}, b:{x:120,y:50}},
	{a:{x:120,y:50}, b:{x:200,y:80}},
	{a:{x:200,y:80}, b:{x:140,y:210}},
	{a:{x:140,y:210}, b:{x:100,y:150}},

	// Polygon #2
	{a:{x:100,y:200}, b:{x:120,y:250}},
	{a:{x:120,y:250}, b:{x:60,y:300}},
	{a:{x:60,y:300}, b:{x:100,y:200}},

	// Polygon #3
	{a:{x:200,y:260}, b:{x:220,y:150}},
	{a:{x:220,y:150}, b:{x:300,y:200}},
	{a:{x:300,y:200}, b:{x:350,y:320}},
	{a:{x:350,y:320}, b:{x:200,y:260}},

	// Polygon #4
	{a:{x:340,y:60}, b:{x:360,y:40}},
	{a:{x:360,y:40}, b:{x:370,y:70}},
	{a:{x:370,y:70}, b:{x:340,y:60}},

	// Polygon #5
	{a:{x:450,y:190}, b:{x:560,y:170}},
	{a:{x:560,y:170}, b:{x:540,y:270}},
	{a:{x:540,y:270}, b:{x:430,y:290}},
	{a:{x:430,y:290}, b:{x:450,y:190}},

	// Polygon #6
	{a:{x:400,y:95}, b:{x:580,y:50}},
	{a:{x:580,y:50}, b:{x:480,y:150}},
	{a:{x:480,y:150}, b:{x:400,y:95}}

];

// DRAW LOOP
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
var updateCanvas = true;

function drawLoop(){
	draw();
    requestAnimationFrame(drawLoop);
    
}
window.onload = function(){
	drawLoop();
};

// MOUSE	
var Mouse = {
	x: 290,
	y: 100
};
canvas.onmousemove = function(event){	
	var vx =  
	Mouse.x = event.clientX;
	Mouse.y = event.clientY;
	updateCanvas = true;
	draw();
};



function pointInPolygon(point, polygon) 
{
	var points = polygon;
	var i, j, nvert = polygon.length;
	var c = false;

	for(i = 0, j = nvert - 1; i < nvert; j = i++) {
		if( ( ((points[i].y) >= point.y ) != (points[j].y >= point.y) ) &&
	    	(point.x <= (points[j].x - points[i].x) * (point.y - points[i].y) / (points[j].y - points[i].y) + points[i].x)
	  	) c = !c;
	}

  return c;
}


function checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null,
        onLine1: false,
        onLine2: false
    };
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator == 0) {
        return result;
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = line1StartX + (a * (line1EndX - line1StartX));
    result.y = line1StartY + (a * (line1EndY - line1StartY));
/*
        // it is worth noting that this should be the same as:
        x = line2StartX + (b * (line2EndX - line2StartX));
        y = line2StartX + (b * (line2EndY - line2StartY));
        */
    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a > 0 && a < 1) {
        result.onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b > 0 && b < 1) {
        result.onLine2 = true;
    }
    // if line1 and line2 are segments, they intersect if both of the above are true
    return result;
};
