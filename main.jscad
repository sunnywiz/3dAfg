
// returns text from 0,0 to X,Y,1 with width.  w=1 skinny w=5 fat
function uniontext(text,width) { 
    var l = vector_text(0,0,text);   // l contains a list of polylines to be drawn
    var o = [];
    l.forEach(function(pl) {                   // pl = polyline (not closed)
       o.push(rectangular_extrude(pl, {w: width, h: 2 }));   // extrude it to 3D
    });
    return union(o);
}


function main() {
  
  var T=120;  // width of triangle, mm across
  var Z=15;   // height, in mm. 
  
  // three points of a triangle
  var TA=[T/2,0];
  var TB=[TA[0] + 120*cos(120), TA[1]+120*sin(120)]; 
  var TC=[-T/2,0];  
  
  // center of circle 
  var CO = [0,(tan(30)*T)/2];
  var CR = T*0.2; 
  
  var triangle = polygon([TA,TB,TC]);
  
  triangle= linear_extrude({height: Z},triangle);
  
  var circul=circle({r: CR, center: true}).translate(CO);
  circul = linear_extrude({height:Z},circul);
  
  return triangle.subtract(circul);
  
  //return uniontext("STEPS RECOVERY");
  /*    
  var triangle = CSG.cylinder({                      
      start: [0, 0, 0],
      end: [0, 0, 15],
      radius: 70,                        
      resolution: 3
    }).setColor([0,0,0.5]);

  var sphere = CSG.cylinder({ 
    start: [0, 0, -0.5],
    end: [0, 0, 20.5],
    radius: 27,                     
    resolution: 80
  }).setColor([1,1,1]);
  
  var symbol = triangle.subtract(sphere);
  
  symbol = expand(1,8,symbol);
  
  return symbol; 
  
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
    
  return recoveryThruSteps; */
}
