/**
 * My Node class
 */
 class MyNode
 {
     /**
      * Constructor
      */
     constructor(build = null, id, children = [], transformations = null, texture = [], materials = [], father = null)
     {
        this.id = id;
        this.build = build;
        this.children = children;
        this.texture = texture;
        this.materials = materials;
        this.transformations = transformations;
        this.father = father;
     }
 }