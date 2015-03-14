
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

	var symbol =  triangle.subtract(circul).setColor([0,0,1]);

	var dashHelper = cube(1).scale([3,TH/2.5,Z/2]);
	
	var text; 
	/* text = uniontext("RECOVERY - STEPS",5);
	text = rescale(text,T,TH,Z); 

	// line up with bottom going TC to TA
	var text1 = text
		.translate([0,-TH+overlap,0])
		.translate(TC);   

	var dashHelper1 = dashHelper
		.translate([0.585*T,-TH/2,0])
		.translate(TC); 
	
	*/
	/*
	text = uniontext("SERVICE - CONCEPTS",5); 
	text = rescale(text, T, TH, Z); 
	
	// line up with left going TC to TB
	var text2 = text
		.translate([0,-overlap,0])
		.rotateZ(60)
		.translate(TC); 
	var dashHelper2 = dashHelper
		.translate([0.435*T,0,0])
		.rotateZ(60)
		.translate(TC); 
	*/	
	
	text = uniontext("UNITY - TRADITIONS", 5); 
	text = rescale(text, T, TH, Z); 
	
	var text3 = text
		.translate([0,-overlap,0])
		.rotateZ(-60)
		.translate(TB); 
	var dashHelper3 = dashHelper
		.translate([0.4*T,0,0])
		.rotateZ(-60)
		.translate(TB); 

	/*
	text = uniontext("UNOFFICIAL - created for fundraiser",3);
	text = rescale(text, T*0.7, TH/3, Z*0.2); 
	var text4 = text
		.rotateY(180)   // now facing the other way
		.translate([T * 0.7 / 2, TH/2, Z*0.2])
		.setColor([1,1,1]); 
	*/
		
	return [symbol,
		// text1, dashHelper1, 
		// text2, dashHelper2, 
		text3, dashHelper3,
		// text4
		]; 
  
}
