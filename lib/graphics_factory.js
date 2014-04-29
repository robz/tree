var GRAF = function () {};

GRAF.Thing = function (config) {
  
  this.x = config.x || 0; 
  this.y = config.y || 0; 
  this.z = config.z || 0; 

  this.shadow = config.shadow;
  this.color = config.color;

};
 
GRAF.Thing.prototype.init = function () { 

  this.mat = new THREE.MeshLambertMaterial({ color: this.color });
  this.mesh = new THREE.Mesh(this.geom, this.mat);
  this.mesh.position.set(this.x, this.y, this.z);
  
  if (this.shadow) {
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = false;
  } else {
    this.mesh.castShadow = false;
    this.mesh.receiveShadow = true;
  }

};


GRAF.Cylinder = function (config) {

  GRAF.Thing.call(this, config);

  this.tr = config.tr || 1;
  this.br = config.br || 1;
  this.h = config.h || 1;
 
  this.geom = new THREE.CylinderGeometry(this.tr, this.br, this.h, 32);

  this.init();

};

GRAF.Cylinder.prototype = Object.create(GRAF.Thing.prototype);


GRAF.Box = function (config) {

  GRAF.Thing.call(this, config);
  
  this.w = config.w || 1;
  this.h = config.h || 1;
  this.d = config.d || 1;
  
  this.geom = new THREE.BoxGeometry(this.w, this.h, this.d);
  
  this.init();   

};

GRAF.Box.prototype = Object.create(GRAF.Thing.prototype);


GRAF.Sphere = function (config) {
  
  GRAF.Thing.call(this, config);

  this.r = config.r || 1;
  this.color = config.color || 0xffffff;
  
  this.geom = new THREE.SphereGeometry(this.r, 32, 32);
  
  this.init();

};

GRAF.Sphere.prototype = Object.create(GRAF.Thing.prototype);


GRAF.makeBranch = function (Obj, c) {
  
  var that = new Obj(c);

  that.rz = c.rz || 0;
  that.ry = c.ry || 0;
  
  if (c.parent) {
     c.parent.mesh.add(that.mesh);
  }

  that.h = c.h;

  var baseMat = that.mesh.matrixWorld.clone();
 
  that.setTransform = function () {
    that.mesh.position.set(0,0,0);
    that.mesh.rotation.set(0,0,0);
    that.mesh.updateMatrix();

    var mat1 = new THREE.Matrix4();
    mat1.setPosition(new THREE.Vector3(
      that.x, 
      that.y + that.h/2 * that.mesh.scale.x,
      that.z
    ));
    that.mesh.applyMatrix(mat1);

    var mat2b = new THREE.Matrix4();
    mat2b.makeRotationZ(that.rz);
    that.mesh.applyMatrix(mat2b);
    
    var mat2 = new THREE.Matrix4();
    mat2.makeRotationY(that.ry);
    that.mesh.applyMatrix(mat2);
    
    var ph = (c.parent && c.parent.h && c.parent.h/2) || 0;
    var mat3 = new THREE.Matrix4();
    mat3.setPosition(new THREE.Vector3(
      that.x, 
      that.y + ph, 
      that.z
    ));
    that.mesh.applyMatrix(mat3);
  }

  that.setTransform();

  return that;    

};

