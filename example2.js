{
    "eye": [ 0 , 0, 5.5 ],
    "lookat": [0, 0, 3 ],
    "up": [0,1,0],
    "fov_angle": 99,
    "width": 729,
    "height": 729,
    "MaxDepth": 6,
    "DefaulColor":[0,0,0],
    "SunLocation":[-900,900,0],
    "OnlyAmbient":1,
    "spheres": [
    {
        "type": "sphere",
        "center": [4,0,3],
        "radius": 1.5,
        "ambient": [0.09, 0.99,0.09],
        "IsMirror":0
    }
    ,
    {
        "type": "sphere",
        "center": [0.3,-2,3],
        "radius": 1.5,
        "ambient": [0.09, 0.09,0.99],
        "IsMirror":0
    }
    ,
    {
        "type": "sphere",
        "center": [0,1,6.5],
        "radius": 0.8,
        "ambient": [0.09, 0.99,0.99],
        "IsMirror":0
    }],
    "billboards": [
	{
    	"type":"billboards",
        "UpperLeft": [ -8, 8 , -1], 
        "LowerLeft": [-8 , -8, -1], 
        "UpperRight": [8 , 8, -1],
        "ambient": [0.99, 0.99,0.99],
        "IsMirror":0}, 
	{
    	"type":"billboards",
        "UpperLeft": [ -6, 3 , 0], 
        "LowerLeft": [-6 , 1, 0], 
        "UpperRight": [-4 , 3, 0],
        "ambient": [0.09, 0.99,0.09],
        "IsMirror":0}, 
	{
    	"type":"billboards",
        "UpperLeft": [ 4, 3 , 0], 
        "LowerLeft": [4 , 1, 0], 
        "UpperRight": [6 , 3, 0],
        "ambient": [0.09, 0.99,0.99],
        "IsMirror":0}, 
	{
    	"type":"billboards",
        "UpperLeft": [ 20, 20 , 7], 
        "LowerLeft": [20 , -20, 7], 
        "UpperRight": [-20,20,7],
        "ambient": [0.99, 0.99,0.99],
        "IsMirror":1},
	{
    	"type":"billboards",
        "UpperLeft": [ -3, 3 , 0], 
        "LowerLeft": [-3 , -3, 0], 
        "UpperRight": [3, 3, 0],
        "ambient": [0.09, 0.99,0.99],
        "IsMirror":1
	}]
}
