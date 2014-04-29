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

    var hsteps = 10;
    var taper = .6;
    
    var base = GRAF.makeBranch(
      GRAF.Cylinder, 
      {
        br: 10, 
        tr:10*taper, 
        steps: hsteps,
        h:80, 
        parent:{mesh:scene}, 
        shadow:true, 
        color: 0x483113
      }
    );

    var leaves = [];
    leaves.push(base);

    function addLeaves() {
      var len = leaves.length;
      
      for (var j = 0; j < len; j++) {
        var leaf = leaves.shift();
        
        for (var i = 0; i < 2; i++) { 
          var branch = GRAF.makeBranch(
            GRAF.Cylinder,
            {
              br: leaf.tr,
              tr: leaf.tr*taper,
              h: leaf.h*.66,
              ry: Math.PI*2*Math.random(), 
              rz: Math.PI/6*(i+1)*Math.random(), 
              color: 0x483113, // brown
              shadow: true,
              parent: leaf
            }
          );
          
          var m = branch.mesh;
          m.scale.x = m.scale.y = m.scale.z = .001;
          
          leaves.push(branch);
        }
      }
    } 

    var itr = 7;
    var itrTime = 50;

    setTimeout(function f() {
      if (itr) { 
        itr -= 1; 

        var hsteps_i = 0;

        setTimeout(function g() {
          hsteps_i += 1;
          
          leaves.forEach(function (e) {
            var m = e.mesh;
            var s = hsteps_i/hsteps;
            m.scale.x = m.scale.y = m.scale.z = s;
            e.setTransform();
          });

          if (hsteps_i < hsteps) {
            setTimeout(g, itrTime);
          } else {     
            addLeaves();
            setTimeout(f, 0);
          }
        }, 0);
      }
    }, itrTime);

    var bottom = new GRAF.Box({w: 500, h: 3, d: 500, y:-3, color:0x00ff00});
    bottom.mesh.receiveShadow = false;
    scene.add(bottom.mesh);

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
