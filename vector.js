/*  ---------------------------------------
 * |                                       |
 * |      Vector and Camera classes        |
 * |                                       |
 *  ---------------------------------------
 */
//this function returns a pixelmap of the ppm image of the billboard
//taken from Assignment 1
class Vector{
	constructor(x,y,z){
		this.x=x;
		this.y=y;
		this.z=z;
	}
	//this inverts a ray
	invert(){
		return new Vector(-this.x, -this.y, -this.z);
	}
	//we take this vector and a normal in order ot returns a new vector;
	reflectVector(normal){
		var scalr = this.dot(normal);
		var temp = Vector.scale(normal, scalr);
		var doubled = Vector.scale(temp,2);
		return Vector.subtract(doubled,this);
	}
	length2() {
		return (this.x*this.x)+(this.y*this.y)+(this.z*this.z);
	}
	magnitude(){
		return Math.sqrt(this.length2());
	}
	//this adds this vector and vector v
	static dot(a,b){ //this allows vector dot product
		var sum = (a.x * b.x)+(a.y * b.y)+ (a.x * b.z);
		return sum;		
	}
	static add(a,b){
		var nx = a.x + b.x;
		var ny = a.y + b.y;
		var nz =  a.z + b.z;
		return new Vector(nx, ny, nz);
	}
	static add3(a,b,c){
		var nx = a.x+b.x+c.x;
		var ny = a.y + b.y +c.y;
		var nz = a.z + b.z + c.z;
		return new Vector(nx, ny, nz);
	}
	static subtract(a,b){
		var nx = a.x - b.x;
		var ny = a.y - b.y;
		var nz = a.z - b.z;
		let v = new Vector(nx,ny,nz);
		return v;
	}
	// this is a static method that returns a x b
	static cross(a,b){
			var crossX = (a.y * b.z) - (a.z * b.y);
			var crossY = (a.z * b.x) - (a.x * b.z);
			var crossZ = (a.x * b.y) - (a.y * b.x);
			return new Vector(crossX, crossY,crossZ);
	}
	//this scales the Vector v by s
	static scale(v, s){
			return new Vector(v.x*s, v.y*s, v.z*s);

	}
	//this gives us a normalize vector
	static normalize(vector){
			var magni = vector.magnitude();
			var newX = Math.round(vector.x / magni);
			var newY = Math.round(vector.y / magni);
			var newZ = Math.round(vector.z / magni);
			return new Vector(newX,newY,newZ);
	}
	//this gives us a normalized vector
	static normalized(vector){
			var magni = vector.magnitude();
			return Vector.scale(vector,(1/magni));
	}
}
class Camera{
	constructor(w,h,eye,lookat,up, fov){
		this.width = w;
		this.height = h;
		this.fov = fov;
		this.eye = new Vector(eye[0], eye[1], eye[2]);
		this.lookat = new Vector(lookat[0], lookat[1], lookat[2]);
		this.up = new Vector(up[0],up[1],up[2]);
		this.d = Vector.normalize(Vector.subtract(this.lookat, this.eye));
		this.w = Vector.normalize(Vector.subtract(this.eye, this.lookat));
		this.u = Vector.cross(this.up, this.w);
		this.v = Vector.cross(this.w,this.u);
	}
}