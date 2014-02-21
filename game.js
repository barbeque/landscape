var WIDTH = 512, HEIGHT = 384;
var VIEW_ANGLE = 45;
var ASPECT = WIDTH/HEIGHT;
var NEAR = 0.1, FAR = 10000;

var $container = $('#container');
var renderer = new THREE.WebGLRenderer();
var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
var scene = new THREE.Scene();

scene.add(camera);
camera.position.z = 40;
camera.position.x = 40;
camera.position.y = 8;
camera.rotation.y = 16;

// TODO: Set up fullscreen stuff for rendering
// TODO: Set up game loop
// TODO: Write mesh handling tools

var radius = 50, segments = 16, rings = 16;
var terrainMaterial = new THREE.MeshLambertMaterial({
	color: 0x00cc00
});

// Create heightmap geometry
var geometry = new THREE.Geometry();
var MAP_WIDTH = 100;
var MAP_HEIGHT = 100;
for(var z = 0; z < MAP_HEIGHT; ++z) {
	for(var x = 0; x < MAP_WIDTH; ++x) {
		geometry.vertices.push(new THREE.Vector3(x, Math.random() * 3.0, z));
	}
}

// Make faces
for(var z = 0; z < MAP_HEIGHT - 1; ++z) {
	for(var x = 0; x < MAP_WIDTH - 1; ++x) {
		// two triangles of the face
		// (x,z)    (x+1, z)
		// (x,z+1)
		// and
		//          (x+1,z)
		// (x,z+1)  (x+1,z+1)
		a = (z * MAP_WIDTH) + x;
		b = (z + 1) * MAP_WIDTH + x;
		c = (z * MAP_WIDTH) + (x + 1);
		geometry.faces.push(new THREE.Face3(a, b, c))
		d = (z + 1) * MAP_WIDTH + (x + 1);
		geometry.faces.push(new THREE.Face3(c, b, d));
	}
}
geometry.computeFaceNormals();

// Build the mesh
var heightmap = new THREE.Mesh(geometry, terrainMaterial);
// Make each tile 10x10
heightmap.scale.set(10, 1, 10);
heightmap.position.set(-MAP_WIDTH*0.5, -1.5, -MAP_HEIGHT*0.5);

scene.add(heightmap); // todo: position?

var pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 130;
scene.add(pointLight);

// Build the border fence for display purposes.
var extentMaterial = new THREE.LineBasicMaterial({
	color: 0xff00000
});
for(var z = 0; z < MAP_HEIGHT; ++z) {
	for(var x = 0; x < MAP_WIDTH; ++x) {
		if(x != 0 && z != 0 && x != MAP_WIDTH-1 && z != MAP_HEIGHT - 1) {
			continue; // is this more nyquil talking?
		}
		var g = new THREE.Geometry(); // x10 for tile size!
		g.vertices.push(new THREE.Vector3(x * 10, -6, z * 10));
		g.vertices.push(new THREE.Vector3(x * 10, 6, z * 10));
		var line = new THREE.Line(g, extentMaterial);
		scene.add(line);
	}
}

renderer.setSize(WIDTH, HEIGHT);
$container.append(renderer.domElement);

var step = function(renderer, scene, camera) {
	return function() {
		camera.rotation.y += 0.2;
		renderer.render(scene, camera);
	}
}(renderer, scene, camera);

setInterval(step, 100);