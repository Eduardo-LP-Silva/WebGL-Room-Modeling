class MyTriangle extends CGFobject
{
	constructor(scene, vCoords, minS = 0.0, maxS = 1.0, minT = 0.0, maxT = 1.0)
	{
		super(scene);
		this.minS = minS;
		this.maxS = maxS;
		this.minT = minT;
        this.maxT = maxT;
        this.vCoords = vCoords;
		this.initBuffers();
	};

	initBuffers()
	{

		this.vertices = [
			this.vCoords[0][0], this.vCoords[0][1], this.vCoords[0][2],
			this.vCoords[1][0], this.vCoords[1][1], this.vCoords[1][2],
			this.vCoords[2][0], this.vCoords[2][1], this.vCoords[2][2]
		];

		this.indices = [
			0, 1, 2,
			2, 1, 0
		];

		this.primitiveType=this.scene.gl.TRIANGLES;

		const vecAB = [this.vCoords[1][0] - this.vCoords[0][0], this.vCoords[1][1] - this.vCoords[0][1], this.vCoords[1][2] - this.vCoords[0][2]];
    	const vecAC = [this.vCoords[2][0] - this.vCoords[0][0], this.vCoords[2][1] - this.vCoords[0][1], this.vCoords[2][2] - this.vCoords[0][2]];
    	const vecBC = [this.vCoords[2][0] - this.vCoords[1][0], this.vCoords[2][1] - this.vCoords[1][1], this.vCoords[2][2] - this.vCoords[1][2]];

		const normalVector = [
        vecAB[1] * vecAC[2] - vecAB[2] * vecAC[1],
        vecAB[2] * vecAC[0] - vecAB[0] * vecAC[2],
        vecAB[0] * vecAC[1] - vecAB[1] * vecAC[0]
    ];

		this.normals=[normalVector[0], normalVector[1], normalVector[2], normalVector[0], normalVector[1], 
			normalVector[2], normalVector[0], normalVector[1], normalVector[2]];

		this.texCoords = [
			this.minS, this.maxT, // 0,1
			this.maxS, this.maxT, // 1,1,
			this.minS, this.minT, // 0,0,
			this.maxS, this.minT // 1,0
		];

		this.initGLBuffers();
	};

	update(maxS, maxT)
	{
		this.texCoords = [
			this.minS, this.maxT, // 0,1
			this.maxS, this.maxT, // 1,1,
			this.minS, this.minT, // 0,0,
			this.maxS, this.minT // 1,0
		];
	}
};
