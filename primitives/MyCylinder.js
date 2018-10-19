/**
 * MyCylinder class, representing the Cylinder primitive fully assembled.
 */
class MyCylinder extends CGFobject 
{
	/**
	 * @constructor
	 * @param {CGFscene} scene 
	 * @param {float} baseRadius 
	 * @param {float} topRadius 
	 * @param {float} height 
	 * @param {int} slices 
	 * @param {int} stacks 
	 * @param {float} minS 
	 * @param {float} maxS 
	 * @param {float} minT 
	 * @param {float} maxT 
	 */
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

		this.body = new MyCylinderBody(this.scene, baseRadius, topRadius, height, slices, stacks, minS, maxS, minT, maxT);
		this.topDisk = new MyDisk(this.scene, slices, stacks, minS, maxS, minT, maxT);
		this.baseDisk = new MyDisk(this.scene, slices, stacks, minS, maxS, minT, maxT);
	};

	/**
	 * Displays the object.
	 */
	display() 
	{
		this.scene.pushMatrix();
			this.body.display();
			this.scene.scale(this.baseRadius, this.baseRadius, 1);
			this.baseDisk.display();
			this.scene.popMatrix();
			this.scene.pushMatrix();
			//this.scene.rotate(Math.PI/2, 1, 0, 0);
			this.scene.scale(this.topRadius, this.topRadius, 1);
			this.scene.translate(0, 0, this.height);
			this.topDisk.display();
		this.scene.popMatrix();
	};

	/**
	 * Dummy function, does nothing in this class.
	 * @param {float} maxS 
	 * @param {float} maxT 
	 */
	update(maxS, maxT) 
	{
		//Nothing to see here
	}
};
