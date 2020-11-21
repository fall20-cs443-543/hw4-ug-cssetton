//
// filereader.js
// Javascript multiple file reader
// Xueheng Wan <wanxueheng@email.arizona.edu>
//
// Modified from the original version of Joshua A. Levine <josh@email.arizona.edu>
// This script provides functionality to load both a scene file (as a
// JSON formatted file) as well as a collection of .ppm files.
// This is a bit tricky to do in Javascript because the standard
// FileReader interface is based on an onload callback.
//
// In my implementation, the function multiLoad() handles the initial
// file selection.  It identifies which file is the scene file (assuming
// there is only one .js file) and reads it.  Next, it calls
// loadPPMFiles() which loads any PPM Image file that is mentioned in the
// scene file (assuming the scene has a member .billboards and each entry in
// .billboards has a string named .ppm).  For any .ppm file in the list of
// files that also is named in the scene file, it creates another
// FileReader and reads its contents.  I also use an explicit variable
// (the array finished[]) to wait until all files have been loaded, at
// which point the funciton allFilesLoaded() is called.
//
// Your task is to implement allFilesLoaded().

var input = document.getElementById("selectFiles");
var output = document.getElementById("save_image");
var canvas = document.getElementById('c');
var ctx = canvas.getContext('2d');
var shapes =[];

//function to process the multiple load of scene files and OBJ files
function multiLoad() {
    if (input.files.length > 0) {
        //find the first .js file for the scene
        let scene_file = undefined;
        let i = 0;
        while (scene_file === undefined && i < input.files.length) {
            let file = input.files[i];
            if (file.type === "text/javascript") {
                console.log("Using", file.name, "as the scene file");
                scene_file = file;
            }
            i++;
        }

        if (scene_file != undefined) {
            let fReader = new FileReader();

            fReader.onload = function (e) {
                scene = JSON.parse(e.target.result);
                console.log("Scene file loaded");
                console.log(scene);

                //After loading the scene, now load the OBJ files
                loadPPMFiles(input.files, scene);
            }
            fReader.readAsText(scene_file);
        }
    }
}

//function to load the PPM files
function loadPPMFiles(files, scene) {
    //finished will track which files we've loaded
    files = Array.from(files);
    var finished = Array(files.length);
    for (let i = 0; i < files.length; i++) {
        finished[i] = 0;
    }

    //for each file, create a FileReader
    for (let i = 0; i < files.length; i++) {
        let ppmReader = new FileReader();
        let ppmFile = files[i];

        ppmReader.onload = function (e) {
            // PPM file data
            text_data = e.target.result;

            //match input file to its contents, finding the entry in the scene
            //file and storing it in the variable billboard
            if(scene.billboards != null){
                billboard = scene.billboards.find(o => o.filename === ppmFile.name);
            
                        if (billboard != undefined) {
                            console.log("Found PPM file", ppmFile.name);
                            // TODO #1
                            // You may want to parse PPM image file and store the billboard object
                            // [hints: you may need a BillBoard class]
                            var pixelmap = parsePPM(text_data);
                            var board = new Billboard(billboard.UpperLeft,billboard.LowerLeft,billboard.UpperRight,pixelmap,billboard.IsMirror);
                            shapes.push(board);
            
                        } else {
                            console.log("Skipping",ppmFile.name);
                        }
            }

            //track progress
            finished[i] = 1;

            const add = (a, b) => a + b;
            //if all files have been loaded, then post-process
            if (finished.reduce(add) == files.length) {
                allFilesLoaded();
            }
        }
        ppmReader.readAsBinaryString(ppmFile);
    }
}


//function to post-process the scene file
function allFilesLoaded() {
    //TODO #2
    //At this point in the code, all billboards (PPM Images) and the scene file should be
    //loaded, so you can safely do any processing of the scene, parsing of PPM, compute for
    // rays and intersections, etc.
    canvas.width=scene.width;
    canvas.height=scene.height;
    var cam = new Camera(scene.width, scene.height,scene.eye, scene.lookat, scene.up, scene.fov_angle);
    var maxDepth = scene.MaxDepth;
    var circles = scene.spheres;
    var bil = scene.bilboards;
    if(scene.DefaulColor != null){
                defaultColor = { x: scene.DefaulColor[0], y: scene.DefaulColor[1], z: scene.DefaulColor[2]};
            }
    if(circles != null)
                circles.forEach(element => shapes.push(new Sphere(element.center,element.radius,element.ambient,element.IsMirror)));
    if(bil != null){
        for(var i=0; i < bil.length;i++){
            if(bil[i].filename != null)
                 continue;
            else
             shapes.push(new Billboard(bil[i].UpperLeft, bil[i].LowerLeft, bil[i].UpperRight,bil[i].ambient, bil[i].IsMirror));
         }
    }
    v = new Vector(scene.SunLocation[0],scene.SunLocation[1],scene.SunLocation[2]);
    scene = {
        camera: cam,
        shapes: shapes,
        light: v,
        defaultC: defaultColor
    };
    console.log(scene);
    var img = renderScene(scene);
    ctx.putImageData(img, 0, 0);
    console.log("Done loading Scene, Sphere, and Billboard objects");
}

//Function to process download
function download() {
    // create a string containing header, each item is seperated by a whitespace
    var header = "P6\n" + canvas.width + "\t" + canvas.height + "\n255\n";
    //rawData should be Uint8Array of size header length + 3xWxH
    var rawData = new Uint8Array(header.length + canvas.width * canvas.height * 3);

    //Read the data stored in the current canvase
    // convert header to ASCII bytes
    for(var i = 0; i < header.length; i ++){
        rawData[i] = header.charCodeAt(i);
    }
    // extract image data from canvas
    var image_data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    var j = header.length; // set j to pointer on starting point of rawData
    // Processing image data
    for(var i = 0; i < image_data.length; i ++){
        if(i % 4 == 3) continue; // skip A channel, we dont need it in P6 PPM
        rawData[j] = image_data[i];
        j ++;
    }
    console.log(image_data);
    //This line sets the filename of the file to save
    output.download = "example.ppm";

    //This line builds, from the rawData, an output Blob
    var file = new Blob([rawData],
        {type: "image/x-portable-pixmap"});

    //By attached the hyperref, the browser will directly download the
    //file when the link is clicked.
    output.href = window.URL.createObjectURL(file);
    //clean up
    window.URL.revokeObjectURL(file);
}

input.addEventListener("change", multiLoad);
output.addEventListener("click", download);