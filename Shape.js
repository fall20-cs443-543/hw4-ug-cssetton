//AUTHOR: Isabela Hutchings
//class: CSC 433 Fall 2020
// this script holds all of the shape classes in order to store the mathmatical values of
// the shapes we will be drawing in our scene as well as our oom file reader function
import {Vector, Camera} from 'vector.js';
var parserState ={
  HEADER: 0,
  BODY: 1,
  COMMENT: 2,
  ERROR: -1
 };
export const shapetype = {
	BILLBOARD:'bilboard',
	SPHERE: 'sphere',
	MIRROR: 'mirror',
	PLANE: 'plane'
};
export class Shape{
	constructor(n) {
    //set the shape its type
    switch(n){
    	case 'sphere':
    		this.type = shapetype.SPHERE;
    	break
    	case 'plane'
    		this.type = shapetype.PLANE;
    	break;
    	case 'billboard':
    		this.type = shapetype.BILLBOARD;
    	break;
    	case 'mirror':
    		this.type = shapetype.MIRROR;
    	break;
    	default
    		this.type = null;
    	break;
    }
  }
}
class Plane{
	constructor(upl, lowl, upr){
		super('plane');
		this.upl = new Vector(upl[0],upl[1], upl[2]);
		this.lowl = new Vector(lowl[0],lowl[1],lowl[2]);
		this.upr = new Vector (upr[0],upr[1],upr[2]);
	}
}
// this function has beent aken from HW3 but made to be a subclass of the shape object
export class Sphere extends Shape{
	constructor(c, r, am){
		super('sphere');
		this.center= new Vector(c[0],c[1],c[2]);
		this.radius=r;
		this.color= new Vector(am[0], am[1], am[2]);
	}
	hit(ray){ 
		var dist = (Vector.subtract(ray.point, this.center));
		var A = Vector.dot(ray.dir,ray.dir);
		var B = Vector.dot(Vector.scale(ray.dir, 2),dist);
		var C = Vector.dot(dist,dist) - (this.radius * this.radius);
		var disc = (B*B) - (4*A*C);
		if (disc < 0)
			return;
		else if(disc == 0)
			return ((-B)/ (2 * A));
		else {
			var t = Math.min((((-B) - Math.sqrt(disc))/(2 * A)),((-B + Math.sqrt(disc))/(2 * A)));
			return t;
		}
	}
	normal(pos){
		return Vector.normalize(Vector.subtract(pos,this.center));
	}
}
export class Billboard extends Plane{
	constructor(upl, lowl, upr, file){
		super(upl,lowl,upr);
		this.color = new Vector(.3,.4,.6);
		var fReader = new FileReader();
		fReader.readAsBinaryString(file);
		fReader.onload = function(e) {
			var file_data = fReader.result;
			this.pixmap = parsePPM(file_data);
		}
		//grab the ppm file that was uploaded from the file input
	}
	hit(ray){

	}
}
export class Mirror extends Plane{
	constructor(upl, lowl, upr){
		super(upl,lowl,upr)
		this.color = new Vector(0,0,0);
		//grab the ppm file that was uploaded from the file input
	}
	hit(ray){

	}
}
/*  ---------------------------------------
 * |                                       |
 * |       read from the ppm files         |
 * |                                       |
 *  ---------------------------------------
 */
//this function returns a pixelmap of the ppm image of the billboard
//taken from Assignment 1
export function parsePPM(file_data){ 
	   // Extract header
	    var format = "";
	    var width = 0;
	    var height = 0;
	    var max_v = 0;
	    var lines = file_data.split(/#[^\n]*\s*|\s+/); // split text by whitespace or text following '#' ending with whitespace
	    var counter = 0;

	    // get attributes
	    for(var i = 0; i < lines.length; i ++){
	        if(lines[i].length == 0) {continue;} // skip it if gets nothing
	        if(counter == 0){
	            format = lines[i];
	        }else if(counter == 1){
	            width = lines[i];
	        }else if(counter == 2){
	            height = lines[i];
	        }else if(counter == 3){
	            max_v = Number(lines[i]);
	        }else if(counter > 3){  
	          break;
	        }
	        counter ++;
	    }
	    if(max_v != 255){
	      console.log("Error: not proper Max Value of 255");
	      return;
	    }
	    //set up PixelImage and our Pixelmap array
	    let pixmap = new Float64Array(4*width*height);
	    //resize the canvas to hold the maximum height and width for our picture
	    console.log("Format: " + format);
	    console.log("Width: " + width);
	    console.log("Height: " + height);
	    console.log("Max Value: " + max_v);
	    //set up char pointers and at the VERY first char in file
	    let ptr=0;
	    let ptr_1=1;
	    var char = file_data.substring(ptr,ptr_1);
	    var newEnctr=0;
	    var index=0;
	    let state= parserState.HEADER;
	    /*
	     * TODO: ADD CODE HERE TO PARSE PIXELS DATA
	     */
	    while(char != ""){
	      //check if we've hit the max of the array
	      switch(state){
	        case parserState.HEADER:
	          if(newEnctr>=3){
	          //check to see if there's a comment after the header
	           if(char !='#'){ 
	              state = parserState.BODY;
	              continue;
	           }
	           else{
	            state=parserState.COMMENT;
	           }
	          }
	          if(char=='\n') //if new line count it
	            newEnctr++;
	        break;
	        case parserState.COMMENT:
	        //if we reached the end of the comment change state back to header
	          if(char =='\n'){
	            state=parserState.HEADER;
	            continue;
	          }
	        break
	        case parserState.BODY: //reading the raw data
	          //check if we're at the A channel
	          if((index+1)%4 == 0){
	              pixmap[index]=1;
	              index++;
	            }
	          pixmap[index]=(file_data.charCodeAt(ptr)/255.0);
	          index++;
	        break;
	        case parserState.ERROR:
	          return [];
	        break;
	      }
	      ptr++;
	      ptr_1++;
	      char = file_data.substring(ptr,ptr_1);
	    }
	   return pixmap;
}