class MyTorus
{
    constructor(scene, inner, outer, slices, loops)
    {
        this.scene = scene;
        this.inner = inner;
        this.outer = outer;
        this.slices = slices;
        this.loops = loops;
    }

    initBuffers(){

      this.vertices = [];
   		this.normals = [];
   		this.indices = [];
		  this.texCoords = [];


      


    }
}
