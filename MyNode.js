/**
 * My Node class
 */
 class MyNode
 {
     /**
      * Constructor
      */
     constructor(build = null, id, children = [], transformations = null, texture = [], materials = [])
     {
        this.id = id;
        this.build = build;
        this.children = children;
        this.texture = texture;
        this.materials = materials;
        this.transformations = transformations;
        this.visited = false;
     }

     /**
      * Displays the node
      */
     display()
     {
        build.scene.pushMatrix();
            build.scene.multMatrix(this.transformations);
            build.display();
        build.scene.popMatrix();
     }
 }