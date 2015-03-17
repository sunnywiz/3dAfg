
// returns text from 0,0 to X,Y,1 with width.  w=1 skinny w=5 fat
function uniontext(text,width) { 
    var l = vector_text(0,0,text);   // l contains a list of polylines to be drawn
    var o = [];
    l.forEach(function(pl) {                   // pl = polyline (not closed)
       o.push(rectangular_extrude(pl, {w: width, h: 1 }));   // extrude it to 3D
    });
    return union(o);
}

// rescales to something smaller than xmax, ymax, zmax
// relocates to 0,0,0-x,y,z
function rescale(shape,xmax,ymax,zmax) { 
	var b = shape.getBounds(); 
	var xsize = b[1].x-b[0].x; 
	var ysize = b[1].y-b[0].y; 
	var zsize = b[1].z-b[0].z; 
	shape = shape.translate([-b[0].x,-b[0].y,-b[0].z]); 
	shape = shape.scale([xmax/xsize,ymax/ysize,zmax/zsize]); 
	return shape; 	
}

function main() {
  
	var T=120;  // width of triangle, mm across
	var Z=15;   // height, in mm. 
	var TH=10;   // height of text in mm.
    var overlap = 0.5; // how much text is sunk into triangle	
	var expansion = 2;  // how much prettiness we added
	var shapewaysWallThickness = 0.5;  // shapeways = 1 mm on min wall thickness but we add 2 via expand
	var shapewaysEmboss = 0.5;  // shapeways readable text emboss amount
	var shapewaysEscapeHoleDiameter = 5; // they request 2 or 4. 

	// three points of a triangle
	var TA=[T/2,0];
	var TB=[TA[0] + 120*cos(120), TA[1]+120*sin(120)]; 
	var TC=[-T/2,0];  

	// center of circle 
	var CO = [0,(tan(30)*T)/2];
	var CR = T*0.2; 

	var triangle = polygon([TA,TB,TC]);

	triangle= linear_extrude({height: Z},triangle);

	var circul=circle({r: CR, fn: 64, center: true}).translate(CO);
	circul = linear_extrude({height:Z},circul);

	var symbol =  triangle.subtract(circul).setColor([0,0,1]);

	console.log("contracting"); 
	// doing this after the expansion really doesn't change anything, but
	// takes a LOT longer. 
	var innerHollow = contract(shapewaysWallThickness,4,symbol).setColor([1,0,0]); 

	console.log("expanding"); 
	symbol = expand(expansion,8,symbol);

	console.log("holes");
	
	var hole = circle({r: shapewaysEscapeHoleDiameter/2, fn:8, center:true});
    hole = linear_extrude({height:Z/2},hole); 	
	var hole1 = hole.translate([(TA[0]+CO[0])/2,(TA[1]+CO[1])/2,-expansion]); 
	var hole2 = hole.translate([(TB[0]+CO[0])/2,(TB[1]+CO[1])/2,-expansion]); 
	var hole3 = hole.translate([(TC[0]+CO[0])/2,(TC[1]+CO[1])/2,-expansion]); 
	
	console.log("combining"); 

	// return [symbol,innerHollow.translate([0,0,Z]),hole1,hole2,hole3 ]; 
	symbol = symbol.subtract([innerHollow,hole1,hole2,hole3]);
	
	var dashHelper = cube(1).scale([3,TH,Z/2]);
	
	var text; 
	
	console.log("text1"); 
	text = uniontext("RECOVERY - STEPS",5);
	text = rescale(text,T,TH,Z+expansion); 

	// line up with bottom going TC to TA
	var text1 = text
		.translate([0,-TH+overlap-expansion,-expansion])
		.translate(TC)
		.setColor([1,1,1]); 

	var dashHelper1 = dashHelper
		.translate([0.585*T,-TH/2-expansion-1,-expansion])
		.translate(TC); 
	
	console.log("text2"); 
	text = uniontext("SERVICE - CONCEPTS",5); 
	text = rescale(text, T, TH, Z+expansion); 
	
	// line up with left going TC to TB
	var text2 = text
		.translate([0,-overlap+expansion,-expansion])
		.rotateZ(60)
		.translate(TC)
		.setColor([1,1,1]); 
		
	var dashHelper2 = dashHelper
		.translate([0.435*T,-TH/2+expansion,-expansion])
		.rotateZ(60)
		.translate(TC); 
	
	console.log("text3"); 
	text = uniontext("UNITY - TRADITIONS", 5); 
	text = rescale(text, T, TH, Z+expansion); 
	
	var text3 = text
		.translate([0,-overlap+expansion,-expansion])
		.rotateZ(-60)
		.translate(TB)
		.setColor([1,1,1]); 

	var dashHelper3 = dashHelper
		.translate([0.35*T,-TH/2+expansion,-expansion])
		.rotateZ(-60)
		.translate(TB); 

	console.log("text4"); 
	text = uniontext("2015 KY AREA CONVENTION FUNDRAISER",5);
	text = rescale(text, T*0.8, TH/1.5, shapewaysEmboss); 
	var text4 = text
		.rotateY(180)   // now facing the other way
		.translate([T * 0.8 / 2, TH/3, shapewaysEmboss - expansion])
		.setColor([1,1,1]); 
	
	console.log("finalunion");
	
	var result = 
		union(
			symbol,
			text1,dashHelper1,
			text2,dashHelper2,
			text3,dashHelper3
		).subtract(text4); 
	return result; 
}
