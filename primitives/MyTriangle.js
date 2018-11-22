/**
 * MyTriangle class, representing a flat triangle.
 */
class MyTriangle extends CGFobject 
{
	/**
	 * @constructor
	 * @param {CGFscene} scene 
	 * @param {array} vCoords 
	 * @param {float} minS 
	 * @param {float} maxS 
	 * @param {float} minT 
	 * @param {float} maxT 
	 */
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

	/**
	 * Initiates the GL buffers.
	 */
	initBuffers() 
	{

		this.vertices = [
			this.vCoords[0][0], this.vCoords[0][1], this.vCoords[0][2],
			this.vCoords[1][0], this.vCoords[1][1], this.vCoords[1][2],
			this.vCoords[2][0], this.vCoords[2][1], this.vCoords[2][2],
			this.vCoords[0][0], this.vCoords[0][1], this.vCoords[0][2],
			this.vCoords[1][0], this.vCoords[1][1], this.vCoords[1][2],
			this.vCoords[2][0], this.vCoords[2][1], this.vCoords[2][2]
		];

		this.indices = [
			0, 1, 2,
			3, 5, 4
		];

		var vecAB = [this.vCoords[1][0] - this.vCoords[0][0], this.vCoords[1][1] - this.vCoords[0][1], this.vCoords[1][2] - this.vCoords[0][2]];
		var vecAC = [this.vCoords[2][0] - this.vCoords[0][0], this.vCoords[2][1] - this.vCoords[0][1], this.vCoords[2][2] - this.vCoords[0][2]];
		var vecBC = [this.vCoords[2][0] - this.vCoords[1][0], this.vCoords[2][1] - this.vCoords[1][1], this.vCoords[2][2] - this.vCoords[1][2]];

		var normalVector = [
			vecAB[1] * vecAC[2] - vecAB[2] * vecAC[1],
			vecAB[2] * vecAC[0] - vecAB[0] * vecAC[2],
			vecAB[0] * vecAC[1] - vecAB[1] * vecAC[0]
		];

		this.normals = [
			normalVector[0], normalVector[1], normalVector[2],
			normalVector[0], normalVector[1], normalVector[2],
			normalVector[0], normalVector[1], normalVector[2],
			-normalVector[0], -normalVector[1], -normalVector[2],
			-normalVector[0], -normalVector[1], -normalVector[2],
			-normalVector[0], -normalVector[1], -normalVector[2]
		];

		//based on the file given
		var b = Math.sqrt(vecAC[0] ** 2 + vecAC[1] ** 2 + vecAC[2] ** 2);
		var a = Math.sqrt(vecBC[0] ** 2 + vecBC[1] ** 2 + vecBC[2] ** 2);
		var c = Math.sqrt(vecAB[0] ** 2 + vecAB[1] ** 2 + vecAB[2] ** 2);

		var d = (a ** 2 - b ** 2 - c ** 2) / (-2 * c);
		var sinAlfa = Math.sqrt(1 - (d / b) ** 2);
		var h = b * sinAlfa;

		this.c = c;
		this.d = d;
		this.h = h;

		this.texCoords = [
			0, 1,
			this.c, 1,
			this.d, 1 - (this.h),
			0, 1,
			this.c, 1,
			this.d, 1 - (this.h)
		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	/**
	 * Updates the texture coordinates.
	 * @param {float} maxS 
	 * @param {float} maxT 
	 */
	updateTexCoords(S, T) 
	{
		this.texCoords.length = 0;
		this.texCoords.push(
			0, 1,
			this.c / S, 1,
			this.d / S, 1 - (this.h / T),
			0, 1,
			this.c / S, 1,
			this.d / S, 1 - (this.h / T)
		);

		this.updateTexCoordsGLBuffers();
	}
};
