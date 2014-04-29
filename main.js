(function () {
  var scene, camera, renderer, controls;
  
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

    var taper = .6;
    var base = GRAF.makeBranch(
      GRAF.Cylinder, 
      {br: 10, tr:10*taper, h:80, parent:{mesh:scene}, shadow:true, color: 0x483113}
    );
 
    var leaves = [];

    (function addChildren(parent, numChildren, itr) {
      if (itr == 1) {
        leaves.push(GRAF.makeBranch(
          GRAF.Sphere,
          {
            r: 1,
            ry: Math.PI*2*Math.random(), 
            rz: Math.PI/3*Math.random(), 
            color: 0x00FF00,
            shadow: true,
            parent: parent
          }
        ));

        return;
      }

      for (var i = 0; i < numChildren; i++) {
        addChildren(
          GRAF.makeBranch(
            GRAF.Cylinder,
            {
              br: parent.tr,
              tr: parent.tr*taper,
              h: parent.h*.66,
              ry: Math.PI*2*Math.random(), 
              rz: Math.PI/6*(i+1)*Math.random(), 
              color: 0x483113, // brown
              shadow: true,
              parent: parent
            }
          ),
          numChildren, 
          itr - 1
        );
      }
    }(base, 2, 7));
      
    var bottom = new GRAF.Box({w: 500, h: 3, d: 500, y:-3, color:0x00ff00});
    bottom.mesh.receiveShadow = false;
    scene.add(bottom.mesh);

    /*
    var x = 1;

    setInterval(function () {
      leaves.forEach(function (e) {
        var m = e.mesh;
  
        if (x < 10) {
          m.scale.x = m.scale.y = m.scale.z = x;
          x += 0.001;
        }
      });
    }, 10);
    */

    controls = new THREE.OrbitControls(camera);
    controls.update();
    controls.pan(0, HEIGHT/5);
  }

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
  } 

  init();
  animate();
}());
