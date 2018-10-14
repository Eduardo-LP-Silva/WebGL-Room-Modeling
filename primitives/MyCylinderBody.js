class MyCylinderBody extends CGFobject
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
    this.vertices = [];
    this.indices = [];
		this.normals = [];
		this.texCoords = [];

		const basetopDif = this.baseRadius - this.topRadius;
		const normalX = this.height / Math.sqrt( basetopDif** 2 + this.height ** 2);
		const normalY = basetopDif / Math.sqrt( basetopDif** 2 + this.height ** 2);


        const ang = 2*Math.PI / this.slices;

        //Filling Vertices, normals and texCoords

        for(let i = 0; i <= this.stacks; i++)
        {
            for(let j = 0; j <= this.slices; j++)
            {
				let theta = (j*ang);
				let x = Math.cos(theta);
				let z = Math.sin(theta);
				let y = this.height * i / this.stacks;

				let X = (1 - (i/this.stacks)) * x * this.baseRadius + this.topRadius * x * i/this.stacks;
				let Z = (1 - (i/this.stacks)) * z * this.baseRadius + this.topRadius * z * i/this.stacks;

                this.vertices.push(X, Z, y);
                this.normals.push(x* normalX, z*normalX, normalY);
                this.texCoords.push(this.minS + j * (this.maxS - this.minS) / this.slices,
                this.minT + i * (this.maxT - this.minT) / this.stacks);
            }
        }

        //Filling Indexs

        for(let i = 0; i < this.stacks; i++)
        {
            for(let j = 0; j < this.slices; j++)
            {
                let index = j+i*(this.slices+1);

				this.indices.push(index, index+1, index + this.slices + 2);
				this.indices.push(index, index + this.slices + 2, index + this.slices + 1);

			}
        }

		this.primitiveType=this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	};
};
