/**
 * MyQuad class, representing a flat quadratic object.
 */
class MyQuad extends CGFobject
{
	/**
	 * @constructor
	 * @param {CGFscene} scene 
	 * @param {float} x1 
	 * @param {float} y1 
	 * @param {float} x2 
	 * @param {float} y2 
	 * @param {float} minS 
	 * @param {float} maxS 
	 * @param {float} minT 
	 * @param {float} maxT 
	 */
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

	/**
	 * Initiates GL Buffers
	 */
	initBuffers()
	{
		this.vertices = [
			this.x1, this.y1, 0,
			this.x2, this.y1, 0,
			this.x2, this.y2, 0,
			this.x1, this.y2, 0,

			
		];

		this.indices = [
			1,2,3,
			1,3,0
		];

		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
		];

		this.texCoords = [
			this.minS, this.maxT,
			this.maxS, this.maxT,
			this.maxS, this.minT,
			this.minS, this.minT,
		];

		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	/**
	 * Updates the texture coordinates.
	 * 
	 * @param {float} maxS 
	 * @param {float} maxT 
	 */
	update(S, T)
	{
		this.texCoords.length = 0;

		this.maxS = S;
		this.maxT = T;

		this.texCoords.push(
			this.minS, T,
			S, T,
			S, this.minT,
			this.minS, this.minT,
		);

		this.updateTexCoordsGLBuffers();
	}
};
