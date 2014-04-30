(function () {
  var scene, camera, renderer, controls, trees = [];
  
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

    camera = new THREE.PerspectiveCamera(
      45, 
      WIDTH/HEIGHT, 
      10, 
      10000
    );
    camera.position.set(0,100,600);
    camera.up = new THREE.Vector3(0,1,0);
    camera.lookAt(new THREE.Vector3(10,10,10));
    scene.add(camera);
   
    
    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( 500, 1000, 500 );

    spotLight.castShadow = true;

    spotLight.shadowMapWidth = 1024;
    spotLight.shadowMapHeight = 1024;
    spotLight.shadowCameraNear = 500;
    spotLight.shadowCameraFar = 4000;
    spotLight.shadowCameraFov = 30;

    scene.add(spotLight); 

    scene.add(new THREE.AmbientLight(0x111111));

    [ 
      new GRAF.Box({w: 500, h: 3, d: 500, color:0x00ff00}),
    ]
    .forEach(function (e) { scene.add(e.mesh); });

    var bottom = new GRAF.Box({w: 500, h: 3, d: 500, y:-3, color:0x00ff00});
    bottom.mesh.receiveShadow = false;
    scene.add(bottom.mesh);

    controls = new THREE.OrbitControls(camera);
    controls.update();
    controls.pan(0, HEIGHT/5);

    for (var i = 0; i < 10; i++) { 
      trees.push(TREE.makeTree(
        {mesh:scene},
        Math.random()*200 - 100, 
        Math.random()*200 - 100
      ));
    }
  }


  setTimeout(function f() {
    trees.forEach(function (e) { e.grow(); });

    setTimeout(f, 100);
  }, 100);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
  } 

  init();
  animate();
}());
