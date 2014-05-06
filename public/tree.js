var TREE = {};

TREE.makeTree = function (parent, x, y, z) {
  var that = {};

  x = x || 0;
  y = y || 0;
  z = z || 0;
  
  var widthDecays = [.6, .5];
  var heightDecays = [.7, .6];
  var zAngleDifs = [.3, 1.5];
  var levels = 6;
  var junctionSize = 2;
  var numSteps = Math.floor(20+20*Math.random());
  var initialHeight = 80;
  
  var base = GRAF.makeBranch(
    GRAF.Cylinder, 
    {
      x: x,
      y: y,
      z: z,
      br: 10, 
      tr: 10 * widthDecays[0],
      steps: numSteps,
      h: initialHeight, 
      parent: parent, 
      shadow: true, 
      color: 0x483113
    }
  );
          
  var m = base.mesh;
  m.scale.x = m.scale.y = m.scale.z = .001;
          

  var tips = [];
  tips.push(base);

  function addTips(areLeaves) {
    var len = tips.length;
    
    for (var j = 0; j < len; j++) {
      var tip = tips.shift();
     
      if (areLeaves) {
        var leaf = GRAF.makeBranch(
          GRAF.Sphere,
          {
            r: 10,
            ry: 0,
            rz: 0,
            color: 0x00ff00,
            shadow: true,
            parent: tip
          }
        );

        var m = leaf.mesh;
        m.scale.x = m.scale.y = m.scale.z = .001;
        
        tips.push(leaf);
      } else { 
        for (var i = 0; i < junctionSize; i++) { 
          var branch = GRAF.makeBranch(
            GRAF.Cylinder,
            {
              br: tip.tr,
              tr: tip.tr * widthDecays[i],
              h: tip.h * heightDecays[i],
              ry: Math.PI*2*Math.random(), 
              rz: zAngleDifs[i]*Math.random(), 
              color: 0x483113, // brown
              shadow: true,
              parent: tip
            }
          );
          
          var m = branch.mesh;
          m.scale.x = m.scale.y = m.scale.z = .001;
          
          tips.push(branch);
        }
      }
    }
  } 

  // returns whether it is done growing
  that.grow = (function () {
    var itr = levels;
    var innerSteps = 0;
    var doneGrowing = false;

    return function() {
      if (doneGrowing) {
        return true;
      }  

      if (innerSteps === numSteps) {
        itr -= 1;
      
        if (itr == 0) {
          doneGrowing = true;
          return true;
        }
        
        addTips(itr === 1);
        innerSteps = 0;
      }
      
      innerSteps += 1;

      tips.forEach(function (e) {
        var m = e.mesh;
        m.scale.x = m.scale.y = m.scale.z = innerSteps / numSteps;
        e.setTransform();
      });

      return false;
    };
  }());

  return that;
};
