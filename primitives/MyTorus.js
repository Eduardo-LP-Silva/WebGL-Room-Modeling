/**
 * MyTorus class, representing a torus.
 */
class MyTorus extends CGFobject 
{
    /**
     * @constructor
	 * @param {CGFscene} scene 
     * @param {float} inner 
     * @param {float} outer 
     * @param {int} slices 
     * @param {int} loops 
     */
    constructor(scene, inner, outer, slices, loops) 
    {
        super(scene);

        this.r = inner;
        this.R = outer;
        this.slices = slices;
        this.loops = loops;

        this.initBuffers();
    }

    /**
     * Initiates the GL buffers.
     */
    initBuffers() 
    {

        this.indices = [];
        this.vertices = [];
        this.normals = [];
        this.texCoords = [];

        for (var stackIndex = 0; stackIndex < this.loops; stackIndex++) 
        {
            for (var sliceIndex = 0; sliceIndex < this.slices; sliceIndex++) 
            {
                var a = (stackIndex * (this.slices + 1)) + sliceIndex;
                var b = a + this.slices + 1;

                this.indices.push(a, b + 1, b);
                this.indices.push(a, a + 1, b + 1);
            }
        }

        for (var stackIndex = 0; stackIndex <= this.loops; stackIndex++) 
        {
            var alfa = stackIndex * 2 * Math.PI / this.loops;
            var sinAlfa = Math.sin(alfa);
            var cosAlfa = Math.cos(alfa);

            for (var sliceIndex = 0; sliceIndex <= this.slices; sliceIndex++) 
            {
                var beta = sliceIndex * 2 * Math.PI / this.slices;
                var sinBeta = Math.sin(beta);
                var cosBeta = Math.cos(beta);

                var x = (this.R + (this.r * cosAlfa)) * cosBeta;
                var y = (this.R + (this.r * cosAlfa)) * sinBeta
                var z = this.r * sinAlfa;
                var s = 1 - (stackIndex / this.loops); // 1 é o valor maximo da textura
                var t = 1 - (sliceIndex / this.slices);

                this.vertices.push(x, y, z);
                this.normals.push(x, y, z);
                this.texCoords.push(s, t);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

	/**
	 * Dummy function, does nothing in this class.
	 * @param {float} maxS 
	 * @param {float} maxT 
	 */
    update(maxS, maxT) 
    {
        //Nothing to see here
    }

}
