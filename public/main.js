(function () {
  var scene, camera, renderer, controls, trees = [], sun, earth, spotLight;

  var sunDist = 5000,
      sunRad = 300,
      earthRad = 1000;
  
  function init() {
    scene = new THREE.Scene();
    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;

    renderer = new THREE.WebGLRenderer({anitalias: true}); 
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    renderer.setClearColor(0x333F47, 1);
    document.body.appendChild(renderer.domElement);

    sun = new GRAF.Sphere({r: sunRad, color:0xFFFFFF, x: 0, y: -earthRad, z: -sunDist});
    
    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( 0, 0, 0 );
    spotLight.castShadow = true;
    spotLight.shadowMapWidth = 2048;
    spotLight.shadowMapHeight = 2048;
    spotLight.shadowCameraNear = 400;
    spotLight.shadowCameraFar = sunDist+earthRad*2;
    spotLight.shadowCameraFov = 30;
    spotLight.shadowDarkness = 1;
    spotLight.shadowCameraVisible = true;

    sun.mesh.add(spotLight);
    scene.add(sun.mesh);

   var earth = new GRAF.Sphere({r:earthRad, x:0, y:0, z:0, color:0xf4a460, shadow:false, rsegs: 100});
    earth.mat.map = THREE.ImageUtils.loadTexture('pics/dirt.jpg');
    earth.mesh.rotation.set(0,0,1);
    scene.add(earth.mesh);

    for (var i = 0; i < 10; i++) { 
      trees.push(TREE.makeTree(
        {mesh:scene},
        Math.random()*200 - 100,
        earthRad/2 - 20, 
        Math.random()*200 - 100
      ));
    }
   
    var geometry  = new THREE.SphereGeometry(10000, 32, 32)
    var material  = new THREE.MeshBasicMaterial()
    material.map   = THREE.ImageUtils.loadTexture('pics/deep_field.jpg')
    material.side  = THREE.BackSide
    var mesh  = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    camera = new THREE.PerspectiveCamera(
      45, 
      WIDTH/HEIGHT, 
      10, 
      20000
    );
    camera.position.set(0, earthRad, 0);
    camera.up = new THREE.Vector3(0,1,0);
    camera.lookAt(new THREE.Vector3(10,10,10));
    scene.add(camera);
    
    controls = new THREE.OrbitControls(camera);
    controls.update();
    controls.pan(0,earthRad);
  }

  setTimeout(function f() {
    trees.forEach(function (e) { e.grow(); });

    setTimeout(f, 100);
  }, 200);

  var t = 0;
  
  function animate() {
    requestAnimationFrame(animate);
    
    sun.mesh.position.set( 0, sunDist*Math.sin(t), -sunDist*Math.cos(t) );
    t += 0.001;

    renderer.render(scene, camera);
    controls.update();
  } 

  init();
  animate();
}());
