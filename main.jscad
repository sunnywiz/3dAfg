
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
    }).setColor([0,0,0.5]);

  var sphere = CSG.cylinder({ 
    start: [0, 0, -0.5],
    end: [0, 0, 1.5],
    radius: 3,                        // true cylinder
    resolution: 20
  }).setColor([1,1,1]);
  
  var symbol = triangle.subtract(sphere);
  
  // symbol = expand(0.2,4,symbol);
  
  var steps = uniontext("STEPS")
    .setColor([0,0,1])
    .scale([.05,.05,.5])
    .rotateZ(-30)
    .translate([0,6,0])
  var recovery = uniontext("RECOVERY")
    .setColor([1,1,1])
    .scale([.025,.025,.25])
    .rotateZ(-30)
    .translate([0.5,6.05,0]);
  var recovery2 = recovery.translate([0,0,.5]).setColor([0,0,1]);
  //recovery2 = expand(0.1,4,recovery2);
    
  var recoveryThruSteps = steps.subtract(recovery2).union(recovery);
    
  return recoveryThruSteps;
}
