/**
 * MyCylinderBody class, representing the Cylinder's body.
 */
class Cylinder2 extends CGFobject
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



        var surface = this.generateCylinderSurface();

        this.Cyl = new CGFnurbsObject(this.scene, this.slices, this.stacks, surface);


    }


    generateCylinderSurface(){

      var points = this.generateControlPoints();
      return new CGFnurbsSurface(8, 1, points);

    }

    generateControlPoints(){

      var t = this.topRadius;
      var b = this.baseRadius;
      var h = this.height;

      var point1T = [0, -t , h, 1];
      var point2T = [-t, -t, h, 0.707];
      var point3T = [-t, 0, h, 1];
      var point4T = [-t, t, h, 0.707];
      var point5T = [0, t, h, 1];
      var point6T = [t, t, h, 0.707];
      var point7T = [t, 0, h, 1];
      var point8T = [t, -t, h, 0.707];
      var point9T = [0, -t, h, 1];

      var point1B = [0, -b , 0, 1];
      var point2B = [-b, -b, 0, 0.707];
      var point3B = [-b, 0, 0, 1];
      var point4B = [-b, b, 0, 0.707];
      var point5B = [0, b, 0, 1];
      var point6B = [b, b, 0, 0.707];
      var point7B = [b, 0, 0, 1];
      var point8B = [b, -b, 0, 0.707];
      var point9B = [0, -b, 0, 1];

      var control = [

        [ point1T, point1B ],
        [ point2T, point2B ],
        [ point3T, point3B ],
        [ point4T, point4B ],
        [ point5T, point5B ],
        [ point6T, point6B ],
        [ point7T, point7B ],
        [ point8T, point8B ],
        [ point9T, point9B ]

      ];

      return control;

    }

    display()
    {
        this.Cyl.display();
    }

    updateTexCoords(S, T){}

};
