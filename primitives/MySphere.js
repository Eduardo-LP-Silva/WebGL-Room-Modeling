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


			for (var stackIndex = 0; stackIndex < this.stacks; stackIndex++) {
		 		 for (var sliceIndex = 0; sliceIndex < this.slices; sliceIndex++) {
							 var first = (stackIndex * (this.slices + 1)) + sliceIndex;
							 var second = first + this.slices + 1;

							 this.indices.push(first, second + 1, second);
							 this.indices.push(first, first + 1, second + 1);
					 }
			 }

		for (var stackIndex = 0; stackIndex <= this.stacks; stackIndex++) {
			 var alfa = stackIndex * Math.PI / this.stacks;
			 //number of divisions between poles (alfa is the angle of each division)

			 var sinAlfa = Math.sin(alfa);
			 var cosAlfa = Math.cos(alfa);

			 for (var sliceIndex = 0; sliceIndex <= this.slices; sliceIndex++) {

					 var beta = sliceIndex * 2*Math.PI/ this.slices;
					 //number of divisions between axis (beta is the angle of each slice)

					 var sinBeta = Math.sin(beta);
					 var cosBeta = Math.cos(beta);


					 //generate the coordinates for each point
					 var x = this.radius * cosBeta * sinAlfa;
					 var y = this.radius * cosAlfa;
					 var z = this.radius * sinBeta * sinAlfa;
					 var t = 1 - (stackIndex / this.stacks);
					 var s = 1 - (sliceIndex / this.slices);

					 this.vertices.push(x, y, z);
					 this.normals.push(x, y, z);
					 this.texCoords.push(s, t);
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
				//This semiSphere has now been transformes in a full shpere

	};

	display(){
		this.scene.pushMatrix();
		this.scene.rotate(Math.PI/2, 1, 0, 0);
		this.semiSphere.display();
		/*
		this.scene.translate(0, 0, -0.2);
		this.semiSphere.display();*/
		this.scene.popMatrix();
	}

	update(maxS, maxT)
	{
		//Nothing to see here
	}
}
