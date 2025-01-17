var canvas = document.getElementById('c');
var ctx = canvas.getContext('2d');
var background = 0;
var maxDepth=1;
var defaultColor = { x: .827, y: .827, z: .827};
//this function reads from the file in order to read our object
var upload =  function() {
	if (input.files.length > 0) {
		var scene;
		var v=null;
		var fReader = new FileReader();
		fReader.readAsText(input.files[0]);
		var shape = new Array();
		fReader.onload = function(e) {
			let file = fReader.result;
			var data= JSON.parse(file);
			cam = new Camera(data.width, data.height,data.eye, data.lookat, data.up, data.fov_angle);
			canvas.width = data.width;
			canvas.height = data.height;
			maxDepth = data.MaxDepth;
			var circles = data.spheres;
			var bilboards = data.billboards;
			if(data.DefaulColor != null){
				defaultColor = { x: data.DefaulColor[0], y: data.DefaulColor[1], z: data.DefaulColor[2]};
			}
			if(circles != null)
				circles.forEach(element => shape.push(new Sphere(element.center,element.radius,element.ambient,element.IsMirror)));
			if(bilboards != null){
				for(var i=0; i < bilboards.length;i++){
					if(bilboards[i].filename != null){
						shape.push(new Billboard(bilboards[i].UpperLeft, bilboards[i].LowerLeft, bilboards[i].UpperRight, bilboards[i].filename, bilboards[i].IsMirror));
					}
					else
						shape.push(new Billboard(bilboards[i].UpperLeft, bilboards[i].LowerLeft, bilboards[i].UpperRight,bilboards[i].ambient, bilboards[i].IsMirror));
				}
			}
			v = new Vector(data.SunLocation[0],data.SunLocation[1],data.SunLocation[2]);
			scene = {
				camera: cam,
				shapes: shape,
				light: v
			};
		}
		fReader.onloadend = function(e){
			console.log(scene);
			renderScene(scene);
		}
	}
}

/*  ---------------------------------------
 * |                                       |
 * |         ray tracing rendering         |
 * |                                       |
 *  ---------------------------------------
 */
function renderScene(scene){
  let camera = scene.camera;
  var lights = scene.lights;
  var height = camera.height; 
  var width = camera.width;
  defaultColor = scene.defaultC;
  let img = new Uint8Array(4* width * height);
  let fovRadian = Math.tan((Math.PI / 180) * (camera.fov/2)); //height
  let aspectRatio = width/height;
  var d = 1/fovRadian;
  var index, color;
  var ray = {
  	point: camera.eye,
  };
  //console.log(camera);
  var dx = 1/(width);
  var dy = 1/(height);
  var sum = 0;
  for( var x = 0; x < width; x++){
  	for (var y = 0; y < height; y++) {
  		var xx= ((2 * x) * dx - 1) * fovRadian * aspectRatio;
  		var yy = ((-2 * y) * dy + 1) * fovRadian;
	  	var vu = Vector.scale(camera.u,xx);
	  	var vv = Vector.scale(camera.v,yy);
	  	ray.dir = Vector.normalize(Vector.add3(camera.w,vu,vv));
	  	color = Raytracing(ray,scene,0);
	  	index = (x*4) + (y*4 * width);
	  	img[index+0]= Math.round(color.x * 255);
	  	img[index+1]= Math.round(color.y * 255);
	  	img[index+2]= Math.round(color.z * 255);
	  	img[index+3]= 255;
	  }
  }
  let temp= new Uint8ClampedArray(img);
  let imgData = new ImageData(temp,width,height);
  return imgData;
}
//this function runs raytracing it deteacts if any ray intersects with any of the objects
//so far it just sees if it intersects with a shaoe and tries to return its main object color;
function Raytracing(ray, scene, depth){
	if (depth > 3)
		return;
	var closest = [Infinity, null];
	//go through each object and check to see if the ray hits it
	for(var i = 0; i < scene.shapes.length; i++){
		var obj = scene.shapes[i];
		var t = obj.hit(ray);
		if( t == false)
			continue;
		if(t < closest[0] && t > 0)
			closest = [t, obj];
	}	
	if(closest[0] === Infinity)
		return defaultColor;
	var newPoint = Vector.add(Vector.scale(ray.dir,closest[0]),ray.point);
	switch(closest[1].type){
		case 'sphere':
			return closest[1].color;
		break;
		case 'billboard':
			if(closest[1].pic.length == 3)
				return closest[1].pic;
			else{
				var temp = closest[1].findpixel(newPoint);
				//console.log(temp);
				return {x: temp[0], y: temp[1], z: temp[2]};
			}
		break;
	}
	
}
//this is an unfinished function that was supposed to detect the color of th object
function surfaceColor(ray, scene, obj, pointAt, norm, depth) {
	var temp = obj.color;
}
