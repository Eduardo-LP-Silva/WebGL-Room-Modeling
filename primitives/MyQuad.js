class MyQuad extends CGFobject
{
	constructor(scene, x1, y1, x2, y2, minS = 0.0, maxS = 1.0, minT = 0.0, maxT = 1.0)
	{
		super(scene);
		this.minS = minS;
		this.maxS = maxS;
		this.minT = minT;
		this.maxT = maxT;
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;
		this.initBuffers();
	};

	initBuffers()
	{

		this.vertices = [
			this.x1, this.y1, 0,
			this.x2, this.y1, 0,
			this.x2, this.y2, 0,
			this.x1, this.y2, 0
		];

		this.indices = [
			0, 1, 2,
			3, 2, 0,
			0, 2, 3,
			2, 1, 0
		];

		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];

		this.texCoords = [
			0, 1,
			1, 1,
			1, 0,
			0, 0
		];

		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};
