/**
 * MyDisk class, representing a flat disk.
 */
class MyDisk extends CGFobject
{
    /**
     * @constructor
     * @param {CGFscene} scene 
     * @param {int} slices 
	 * @param {float} minS 
	 * @param {float} maxS 
	 * @param {float} minT 
	 * @param {float} maxT 
     */
	constructor(scene, slices, minS = 0, maxS = 1, minT = 0, maxT = 1) 
	{
        super(scene);
        this.slices = slices;
        this.minS = minS;
        this.maxS = maxS;
        this.minT = minT;
        this.maxT = maxT;
    
		this.initBuffers();
	};

    /**
     * Initiates the GL Buffers.
     */
	initBuffers() 
	{    
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
        
        var ang = 2 * Math.PI / this.slices;
        var i, j, x, y;
        var n_vertices = 0;
        
        //Filling vertices, normals and texCoords

        for(j = 0; j < this.slices; j++)
        {
            x = Math.cos(j * ang);
            y = Math.sin(j * ang);

            this.vertices.push(x, y, 0);
            this.normals.push(0,0,1);
            this.texCoords.push(x / 2 + 0.5, - y / 2 + 0.5);
            n_vertices++;
        }
        
        this.vertices.push(0,0,0);
        this.normals.push(0,0,1);
        this.texCoords.push(0.5,0.5);

        n_vertices++;
      
        //Filling indexes
        
        for(i = 0; i < n_vertices - 1; i++)
        {
            this.indices.push(n_vertices - 1);

            if(i == this.slices - 1)
                this.indices.push(0);
            else
                this.indices.push(i + 1);
            
            this.indices.push(i);
        }
        
        for(i = 0; i < n_vertices - 1; i++)
        {
            this.indices.push(n_vertices - 1);
            this.indices.push(i);
            
            if(i == this.slices - 1)
                this.indices.push(0);
            else
                this.indices.push(i + 1);
        }

		this.primitiveType=this.scene.gl.TRIANGLES;
		
		this.initGLBuffers();
	};
};