(function () {
  var scene, camera, renderer, controls;

  function makeThing(c) {
    var that = {};
    
    c.x = c.x || 0; 
    c.y = c.y || 0; 
    c.z = c.z || 0; 
   
    that.init = function () { 
      that.mat = new THREE.MeshLambertMaterial({
        color: c.color
      });
      that.mesh = new THREE.Mesh(that.geom, that.mat);
      that.mesh.position.set(c.x, c.y, c.z);
      
      if (c.shadow) {
        that.mesh.castShadow = true;
        that.mesh.receiveShadow = false;
      } else {
        that.mesh.castShadow = false;
        that.mesh.receiveShadow = true;
      }
    }

    return that;
  }

  function makeCyl(c) {
    var that = makeThing(c);
    
    c.tr = c.tr || 1;
    c.br = c.br || 1;
    c.h = c.h || 1;
    c.color = c.color || 0x483113; // brown
   
    that.br = c.br;
    that.tr = c.tr;
 
    that.geom = new THREE.CylinderGeometry(c.tr, c.br, c.h, 32);
    that.init();   

    return that;
  }

  function makeBox(c) {
    var that = makeThing(c);
   
    c.w = c.w || 1;
    c.h = c.h || 1;
    c.d = c.d || 1;
    c.color = c.color || 0xffff00;
    
    that.geom = new THREE.BoxGeometry(c.w, c.h, c.d);
    that.init();   
 
    return that;
  }

  function makeBranch(objectConstructor, c) {
    var that = objectConstructor(c);

    c.rz = c.rz || 0;
    c.ry = c.ry || 0;
    
    if (c.parent) {
       c.parent.mesh.add(that.mesh);
    }

    that.h = c.h;
    
    var mat1 = new THREE.Matrix4();
    mat1.setPosition(new THREE.Vector3(
      c.x, 
      c.y + c.h/2,
      c.z
    ));
    that.mesh.applyMatrix(mat1);

    var mat2b = new THREE.Matrix4();
    mat2b.makeRotationZ(c.rz);
    that.mesh.applyMatrix(mat2b);
    
    var mat2 = new THREE.Matrix4();
    mat2.makeRotationY(c.ry);
    that.mesh.applyMatrix(mat2);
    
    var ph = (c.parent && c.parent.h && c.parent.h/2) || 0;
    var mat3 = new THREE.Matrix4();
    mat3.setPosition(new THREE.Vector3(
      c.x, 
      c.y + ph, 
      c.z
    ));
    that.mesh.applyMatrix(mat3);

    return that;    
  }

  function makeSphere(c) {
    var that = makeThing(c);
    
    c.r = c.r || 1;
    c.color = c.color || 0xffffff;
    
    that.geom = new THREE.SphereGeometry(c.r, 32, 32);
    that.init();   
 
    return that;
  }

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
    camera.position.set(300,100,-300);
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
      makeBox({w: 500, h: 3, d: 500, color:0x00ff00}),
    ]
    .forEach(function (e) { scene.add(e.mesh); });

    var taper = .5;
    var base = makeBranch(makeCyl, {br: 15, tr:15*taper, h:100, parent:{mesh:scene}, shadow:true});
   
    (function addChildren(parent, numChildren, itr) {
      if (itr <= 0) return;
      if (itr == 1) numChildren = 1;
      for (var i = 0; i < numChildren; i++) {
        if (itr == 1) {
          var child = makeBranch(
            makeBox,
            {
              w: 10,
              d: 1,
              h: 10,
              ry: Math.PI*2*Math.random(), 
              rz: Math.PI/3*Math.random(), 
              color: 0x00FF00,
              shadow: true,
              parent: parent
            }
          );
        } else {
          var child = makeBranch(
            makeCyl,
            {
              br: parent.tr,
              tr: parent.tr*taper,
              h: parent.h*.66,
              ry: Math.PI*2*Math.random(), 
              rz: Math.PI/3*Math.random(), 
              shadow: true,
              parent: parent
            }
          );
        }
        addChildren(child, numChildren, itr-1);
      }
    }(base, 3, 5));
      
    var bottom = makeBox({w: 500, h: 3, d: 500, y:-3, color:0x00ff00});
    bottom.mesh.receiveShadow = false;
    scene.add(bottom.mesh);

    controls = new THREE.OrbitControls(camera);
    controls.update();
    controls.pan(0, HEIGHT/3);  
  }

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
  } 

  init();
  animate();
}());
