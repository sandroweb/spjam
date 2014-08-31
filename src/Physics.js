module.exports = function Physics()
{
	var self = this;
	var playerPosition = {x:0, y:0};
	var playerVelocity = {x:0, y:0};
	var axis = {x:0, y:0};

	this.process = process;
	this.playerPosition = playerPosition;
	this.playerVelocity = playerVelocity;

	function process(game, direction, vertices)
	{
		axis.x = direction;

		// var vertices = polygons[0];
		var walking = axis.x != 0;
		var offsetX = 20;
		var offsetY = 20;
		var velX = walking ? 2 : 0;
		var velY = 3;

		// var lineHA = {x:playerPosition.x - 1000, y:playerPosition.y};
		// var lineHB = {x:playerPosition.x + 1000, y:playerPosition.y};
		// var lineVA = {x:playerPosition.x, y:playerPosition.y - 1000};
		// var lineVB = {x:playerPosition.x, y:playerPosition.y + 1000};
		// var resultH = raycast(lineHA, lineHB, vertices);
		// var resultV = raycast(lineVA, lineVB, vertices);
		// var nearest = getNearestFaces(playerPosition, resultH.concat(resultV));
		// var isInside = pointInPolygon(playerPosition, vertices);

		// if (axis.x < 0 && nearest.ld - offsetX < velX)
		// {
		// 	velX = nearest.ld - offsetX;
		// }

		// if (axis.x > 0 && nearest.rd - offsetX < velX)
		// {
		// 	velX = nearest.rd - offsetX;
		// }

		// if (axis.y < 0 && nearest.td - offsetY < velY)
		// {
		// 	velY = nearest.td - offsetY;
		// }

		// if (axis.y > 0 && nearest.bd - offsetY < velY)
		// {
		// 	velY = nearest.bd - offsetY;
		// }


		var prevX = playerPosition.x;
		playerPosition.x += axis.x*velX;

		var lineHA = {x:playerPosition.x - 1000, y:playerPosition.y};
		var lineHB = {x:playerPosition.x + 1000, y:playerPosition.y};
		var resultH = raycast(lineHA, lineHB, vertices);
		var nearest = getNearestFaces(playerPosition, resultH);
		var isInside = pointInPolygon(playerPosition, vertices);

		if (isInside)
		{
			if (nearest.l)
			{
				if (playerPosition.x < nearest.l.point.x + offsetX) 
				{
					playerPosition.x = nearest.l.point.x + offsetX;
					playerVelocity.x = 0;
				}
				else
				{
					playerVelocity.x = playerPosition.x - prevX;	
				}
				
				// ctx.beginPath();
				// ctx.moveTo(playerPosition.x, playerPosition.y);
				// ctx.lineTo(nearest.l.point.x, playerPosition.y)
				// ctx.strokeStyle = "#FF0000";
				// ctx.stroke();	
			}
			if (nearest.r)
			{
				if (playerPosition.x > nearest.r.point.x - offsetX) 
				{
					playerPosition.x = nearest.r.point.x - offsetX;
					playerVelocity.x = 0;
				}
				else
				{
					playerVelocity.x = playerPosition.x - prevX;	
				}
				
				// ctx.beginPath();
				// ctx.moveTo(playerPosition.x, playerPosition.y);
				// ctx.lineTo(nearest.r.point.x, playerPosition.y);
				// ctx.strokeStyle = "#FF0000";
				// ctx.stroke();	
			}
		}
		else
		{
			playerPosition.x = prevX;
			
		}
		

		var prevY = playerPosition.y;
		playerPosition.y += 1;

		var lineVA = {x:playerPosition.x, y:playerPosition.y - 1000};
		var lineVB = {x:playerPosition.x, y:playerPosition.y + 1000};
		var resultV = raycast(lineVA, lineVB, vertices);
		var nearest = getNearestFaces(playerPosition, resultV);
		var isInside = pointInPolygon(playerPosition, vertices);


		if (isInside)
		{
			if (nearest.t)
			{
				if (playerPosition.y < nearest.t.point.y + offsetY) playerPosition.y = nearest.t.point.y + offsetY;

				// ctx.beginPath();
				// ctx.moveTo(playerPosition.x, playerPosition.y);
				// ctx.lineTo(playerPosition.x, nearest.t.point.y);
				// ctx.strokeStyle = "#FF0000";
				// ctx.stroke();	
			}

			if (nearest.b)
			{
				if (playerPosition.y > nearest.b.point.y - offsetY) playerPosition.y = nearest.b.point.y - offsetY;

				// ctx.beginPath();
				// ctx.moveTo(playerPosition.x, playerPosition.y);
				// ctx.lineTo(playerPosition.x, nearest.b.point.y);
				// ctx.strokeStyle = "#FF0000";
				// ctx.stroke();	
			}	
		}
		else
		{
			playerPosition.y = prevY;
		}

		
		playerVelocity.y = playerPosition.y - prevY;

		if (playerPosition.x < 20) {
			playerPosition.x = 20;
			playerVelocity.x = 0;
		} else if (playerPosition.x > (game.renderer.width - 20)) {
			playerPosition.x = (game.renderer.width - 20);
			playerVelocity.x = 0;
		}
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

	function lineDistance(point1, point2)
	{
		var xs = 0;
		var ys = 0;

		xs = point2.x - point1.x;
		xs = xs * xs;

		ys = point2.y - point1.y;
		ys = ys * ys;

		return Math.sqrt(xs + ys);
	}
}

//
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

// method from jsfiddle: http://jsfiddle.net/justin_c_rounds/Gd2S2/light/
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