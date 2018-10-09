class MySemiSphere extends CGFobject
{
	constructor(scene, slices, stacks, radius, minS = 0, maxS = 1, minT = 0, maxT = 1)
	{
        super(scene);
        this.slices = slices; //longitude slices
        this.stacks = stacks; //Latitude stacks
        this.radius = radius;
		this.minS = minS;
        this.maxS = maxS;
        this.minT = minT;
        this.maxT = maxT;

		this.initBuffers();
	};

	initBuffers()
	{
   		this.vertices = [];
   		this.normals = [];
   		this.indices = [];
		this.texCoords = [];

   		this.theta = (Math.PI/2) / this.slices; //i
   		this.alpha = 2*Math.PI / this.stacks; //j


   		for(var j = 0; j <= this.stacks; j++)
   		{
    		for(var i = 0; i < this.slices; i++)
     		{

        		// x = r sinθ cosα
        		// y = r cosθ
        		// z = r sinθ sinα

				this.vertices.push( this.radius*Math.cos(this.alpha*j)*Math.sin(this.theta*i),
					this.radius*Math.sin(this.alpha*j)*Math.sin(this.theta*i), this.radius*Math.cos(this.theta*i));

				this.normals.push( this.radius*Math.cos(this.alpha*j)*Math.sin(this.theta*i),
					this.radius*Math.sin(this.alpha*j)*Math.sin(this.theta*i), this.radius*Math.cos(this.theta*i));

				this.texCoords.push(this.minS + i * (this.maxS - this.minS) / this.slices,
					this.minT + j * (this.maxT - this.minT) / this.stacks);
		 	}
   		}

		 // Draw triangles

	   	for(j = 0; j < this.stacks; j++)
		{
	    	for(i = 0; i < this.slices; i++)
			{
	       		//First
	       		this.indices.push(this.slices*j+i);
	       		this.indices.push(this.slices*j+i+1-(i < this.slices-1 ? 0 : this.slices));
						this.indices.push(this.slices*(j+1)+i+1-(i < this.slices-1 ? 0 : this.slices));

	       		//Second
	       		this.indices.push(this.slices*(j+1)+i+1-(i < this.slices-1 ? 0 : this.slices));
	       		this.indices.push(this.slices*(j+1)+i);
	       		this.indices.push(this.slices*j+i);
	     	}
	   }

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 	};
};

class MySphere extends CGFobject
{
	constructor(scene, slices, stacks, radius, minS = 0, maxS = 1, minT = 0, maxT = 1)
	{
        super(scene);
        this.slices = slices; //longitude slices
        this.stacks = stacks; //Latitude stacks
        this.radius = radius;
				this.minS = minS;
        this.maxS = maxS;
        this.minT = minT;
        this.maxT = maxT;

				this.semiSphere = new MySemiSphere(this.scene, slices, stacks, radius, minS, maxS, minT, maxT);

	};

	display(){
		this.scene.pushMatrix();
		this.semiSphere.display();
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.scene.translate(0, 0, -0.5);
		this.semiSphere.display();
		this.scene.popMatrix();
	}
}
