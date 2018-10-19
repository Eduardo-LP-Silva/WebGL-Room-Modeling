/**
 * My Node class, representing a graph node (primitive or component).
 */
 class MyNode
 {
     /**
      * @constructor
      * @param {CGFobject} build 
      * @param {string} id 
      * @param {array} children 
      * @param {mat4} transformations 
      * @param {array} texture 
      * @param {array} materials 
      */
     constructor(build = null, id, children = [], transformations = null, texture = [], materials = [])
     {
        this.id = id;
        this.build = build;
        this.children = children;
        this.texture = texture;
        this.materials = materials;
        this.transformations = transformations;
        this.materialIndex = 0;
     }

     /**
      * Applies its transformation matrix and displays the primitive.
      */
     display()
     {
        build.scene.pushMatrix();
            build.scene.multMatrix(this.transformations);
            build.display();
        build.scene.popMatrix();
     }
 }