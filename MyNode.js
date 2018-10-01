/**
 * My Node class
 */
 class MyNode
 {
     /**
      * Constructor
      */
     constructor(build = null, id, children = [], transformations = null, textures = [], materials = [], father = null)
     {
        this.id = id;
        this.build = build;
        this.children = children;
        this.textures = textures;
        this.materials = materials;
        this.transformations = transformations;
        this.father = father;
     }
 }