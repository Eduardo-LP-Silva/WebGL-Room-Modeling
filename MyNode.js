/**
 * My Node class
 */
 class MyNode
 {
     /**
      * Constructor
      */
     constructor(build, id, children = null, texture = null, material = null)
     {
        this.id = id;
        this.build = build;
        this.children = children;
        this.texture = texture;
        this.material = material;
     }
 }