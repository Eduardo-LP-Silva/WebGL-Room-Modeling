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

		for (var stack = 0; stack <= this.stacks; stack++) {
			 var theta = stack * Math.PI / this.stacks;
			 var sinTheta = Math.sin(theta);
			 var cosTheta = Math.cos(theta);

			 for (var slice = 0; slice <= this.slices; slice++) {
					 var phi = slice * 2*Math.PI/ this.slices;
					 var sinPhi = Math.sin(phi);
					 var cosPhi = Math.cos(phi);

					 var x = this.radius * cosPhi * sinTheta;
					 var y = this.radius * cosTheta;
					 var z = this.radius * sinPhi * sinTheta;
					 var t = 1 - (stack / this.stacks);
					 var s = 1 - (slice / this.slices);

					 this.vertices.push(x, y, z);
					 this.normals.push(x, y, z);
					 this.texCoords.push(s, t);
			 }
	 }

	 for (var stack = 0; stack < this.stacks; stack++) {
			 for (var slice = 0; slice < this.slices; slice++) {
					 var first = (stack * (this.slices + 1)) + slice;
					 var second = first + this.slices + 1;

					 this.indices.push(first, second + 1, second);
					 this.indices.push(first, first + 1, second + 1);
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
		/*this.scene.rotate(Math.PI, 0, 1, 0);
		this.scene.translate(0, 0, -0.2);
		this.semiSphere.display();*/
		this.scene.popMatrix();
	}

	update(maxS, maxT)
	{
		//Nothing to see here
	}
}
