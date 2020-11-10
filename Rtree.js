
import {Shape, Sphere, Billboard, Mirror} from 'Shape.js';
import {Vector} from 'vector.js';
class BoundingBox{
 constructor(ll, ur){
 	this.ll=ll;
 	this.ur=ur;
 	this.right=null;
 	this.left=null;
 }
 inRange(x,y,z){
 	if( x < this.ll[0] || y < this.ll[1] || z < this.ll[2])
 		return false;
 	if( x > this.ur[0] || y > this.ur[1] || z > this.ur[2]) 
 		return false
 	return true;
 }
}
//these are leaves that holds a single shape abject in the scene
class MinBoundingBox extends BoundingBox{
	constructor(node, ll,ur){
		super(ll,ur);
 		this.obj=node;
 	}
}
class Rtree{
	//create the root of the tree
	constructor(node){
 		this.root=node;
 	}
 	search (x,y,z,n, result){
 		if(n instanceof MinBoundingBox){
 			//check to see if the point is part of the shape
 			result.push(n);
 		}
 		else{ //check if either leftor right nodes are in range of our point?
 			if(n.left.inRange(x,y,z))
 				search(x,y,z,kid,n.left);
 			if(n.right.inRange(x,y,z))
 				search(x,y,z,kid,n.right);
 		}
 	}
 	insert (){
 	}
}