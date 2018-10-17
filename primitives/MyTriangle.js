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


		//based on the file given
		var b = Math.sqrt(vecAB[0]**2 + vecAB[1]**2 + vecAB[2]**2);
		var a = Math.sqrt(vecAC[0]**2 + vecAC[1]**2 + vecAC[2]**2);
		var c = Math.sqrt(vecBC[0]**2 + vecBC[1]**2 + vecBC[2]**2);

		var cosBeta = (a**2 - b**2 + c**2)/(2*c*a);

		var sinBeta = Math.sqrt(a**2-(a*cosBeta)*(a*cosBeta))/a;

		this.texCoords = [
			c-a*cosBeta, this.maxT-a*sinBeta,
			0, this.maxT,
			c, this.maxT

		];




		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();

	};

	update(S, T)
	{
		this.texCoords = [
			c-a*cosBeta, T-a*sinBeta,
			0, T,
			c, T
		];

		this.updateTexCoordsGLBuffers();
	}
};
