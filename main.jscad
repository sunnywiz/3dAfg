
function uniontext(text) { 
    var l = vector_text(0,0,text);   // l contains a list of polylines to be drawn
    var o = [];
    l.forEach(function(pl) {                   // pl = polyline (not closed)
       o.push(rectangular_extrude(pl, {w: 2, h: 2}));   // extrude it to 3D
    });
    return union(o);
}


function main() {
   var triangle = CSG.cylinder({                      // object-oriented
      start: [0, 0, 0],
      end: [0, 0, 1],
      radius: 10,                        // true cylinder
      resolution: 3
    });

  var sphere = CSG.cylinder({ 
    start: [0, 0, -0.5],
    end: [0, 0, 1.5],
    radius: 3,                        // true cylinder
    resolution: 20
  });
  
  var symbol = triangle.subtract(sphere);
  var steps = uniontext("   STEPS")
    .scale([.05,.05,.5])
    .rotateZ(-30)
    .translate([-2,7,0]);
  return [symbol, steps];
}
