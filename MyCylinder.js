class MyCylinder extends CGFobject
{
	constructor(scene, baseRadius, topRadius, height, slices, stacks, minS = 0, maxS = 1, minT = 0, maxT = 1)
	{
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
		this.minS = minS;
        this.maxS = maxS;
        this.minT = minT;
        this.maxT = maxT;
        this.baseRadius = baseRadius;
        this.topRadius = topRadius;
        this.height = height;


		this.initBuffers();
	};

	initBuffers()
	{
        var i;

        this.vertices = [];
        this.indices = [];
        this.normals = [];
	    this.texCoords = [];

        var ang = 2*Math.PI / this.slices;
        var i, j;

        //Filling Vertices, normals and texCoords
        
        for(i = 0; i < this.stacks; i++)
        {
            for(j = 0; j < this.slices; j++)
            {

                this.vertices.push(Math.cos(j * ang),Math.sin(j * ang), i);
                this.normals.push(Math.cos(j * ang), Math.sin(j * ang), 0);
                this.texCoords.push(this.minS + j * (this.maxS - this.minS) / this.slices,
                this.minT + i * (this.maxT - this.minT) / this.stacks);
            }
        }

        //Filling Indexs

        for(i = 0; i <= this.stacks * this.slices -1 - this.slices; i++)
        {
            this.indices.push(i, i + this.slices, i + this.slices - 1);
            this.indices.push(i, i + this.slices - 1, i + this.slices);
            this.indices.push(i, i + 1, i + this.slices);
            this.indices.push(i, i + this.slices, i + 1);
        }

		this.primitiveType=this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	};
};