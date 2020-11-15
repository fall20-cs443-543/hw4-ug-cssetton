/*  ---------------------------------------
 * |                                       |
 * |            Shape classes              |
 * |                                       |
 *  ---------------------------------------
 */
//this function returns a pixelmap of the ppm image of the billboard
//taken from Assignment 1
 var parserState ={
  HEADER: 0,
  BODY: 1,
  COMMENT: 2,
  ERROR: -1
 };
const shapetype = {
	BILLBOARD:'bilboard',
	SPHERE: 'sphere',
	MIRROR: 'mirror',
	PLANE: 'plane'
};
class Shape{
	constructor(n , is) {
    //set the shape its type
    switch(n){
    	case 'sphere':
    		this.type = shapetype.SPHERE;
    	break
    	case 'plane':
    		this.type = shapetype.PLANE;
    	break;
    	case 'billboard':
    		this.type = shapetype.BILLBOARD;
    	break;
    	case 'mirror':
    		this.type = shapetype.MIRROR;
    	break;
    	default:
    		this.type = null;
    	break;
    }
    this.mirror=is;
  }
}
class Plane extends Shape{
	constructor(upl, lowl, upr, is){
		super('plane',is);
		this.pul = new Vector(upl[0],upl[1], upl[2]);
		this.pll = new Vector(lowl[0],lowl[1],lowl[2]);
		this.pur = new Vector (upr[0],upr[1],upr[2]);
    this.color = new Vector(.3,.4,.6);
    this.pu = Vector.subtract(this.pur,this.pul);
    this.pv = Vector.subtract(this.pll,this.pul);
    this.n = Vector.cross(Vector.subtract(this.pll,this.pul),Vector.subtract(this.pur,this.pul)); //generate normal
	}
  hit(ray){
    var time = 1/ (Vector.dot(ray.dir,this.n));
    var far = Vector.dot(this.pul,this.n) - Vector.dot(ray.point,this.n);
    var t =time*far;
    if(t <= 0)
      return false;
    return t;
  }
}
// this function has beent aken from HW3 but made to be a subclass of the shape object
class Sphere extends Shape{
	constructor(c, r, am, is){
		super('sphere', is);
		this.center= new Vector(c[0],c[1],c[2]);
		this.radius=r;
    this.rsqr = r*r;
		this.color= new Vector(am[0], am[1], am[2]);
	}
  hit(ray) {
    var eye_to_center = Vector.subtract(this.center, ray.point);
    var tca = Vector.dot(eye_to_center, ray.dir);
    if(tca < 0)
      return false
    var d2 = Vector.dot(eye_to_center, eye_to_center) - (tca * tca);
    if(d2 > (this.rsqr))
      return false
    var thc = Math.sqrt(this.rsqr  - d2);
    if((tca-thc) < 0)
      return (tca+thc);
    return (tca-thc);
  }
}
class Billboard extends Plane{
	constructor(upl, lowl, upr, pic, is){
		super(upl,lowl,upr,is);
		this.color = new Vector(.3,.4,.6);
    this.pic=pic;
	}
}
// Load PPM Image to Canvas
  // About PPM Image format: http://netpbm.sourceforge.net/doc/ppm.html
function parsePPM(file_data){
      /*
     * Extract header
     */
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
                state=parserState.BODY;
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
                pixmap[index]=1.0;
                index++;
              }
            pixmap[index]=(file_data.charCodeAt(ptr)/255.0);
            index++;
          break;
          case parserState.ERROR:
            return;
          break;
        }
        ptr++;
        ptr_1++;
        char = file_data.substring(ptr,ptr_1);
      }
      return pixmap;
}