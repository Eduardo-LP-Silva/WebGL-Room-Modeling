/**
 * Plane class, represents a plane or a patch formed by NURBS.
 */
class Plane extends CGFobject
{
    /**
     * @constructor
     * @param {CGFscene} scene
     * @param {int} uDivs
     * @param {int} vDivs
     * @param {int} degreeU
     * @param {int} degreeV
     * @param {array} controlPoints
     */
    constructor(scene, uDivs, vDivs, degreeU = null, degreeV = null, controlPoints = [])
    {
        super(scene);

        var surface;



        if(degreeV == null || degreeV == null || controlPoints.length == 0)
            surface = this.generateDefaultSurface();
        else
            surface = this.generateCustomSurface(degreeU, degreeV, controlPoints);


        this.nurbsObject = new CGFnurbsObject(this.scene, uDivs, vDivs, surface);
    }

    /**
     * Generates a default 1x1 plane.
     */
    generateDefaultSurface()
    {
        var controlPoints = [
            [
                [-0.5, -0.5, 0, 1],
                [-0.5, 0.5, 0, 1]
            ],
            [
                [0.5, -0.5, 0, 1],
                [0.5, 0.5, 0, 1]
            ]
        ];

        var nurbsSurface = new CGFnurbsSurface(1, 1, controlPoints);
        return nurbsSurface;
    }

    /**
     * Generates a patch with custom degrees.
     * @param {int} degreeU
     * @param {int} degreeV
     * @param {array} controlPoints
     */
    generateCustomSurface(degreeU, degreeV, controlPoints)
    {

      console.log("controlPoints: ");
      console.log(controlPoints);

      var points = [];
      var indexCount = 0;

      for(var i = 0; i <= degreeU; i++){
        var temp = [];
        for(var j = 0; j <=degreeV; j++){
          temp.push(controlPoints[indexCount]);
          indexCount++;
        }
        points.push(temp);
      }

      console.log("points: ");
      console.log(points);

      return new CGFnurbsSurface(degreeU, degreeV, points);
    }

    /**
     * Displays the NURBS object
     */
    display()
    {

      this.nurbsObject.display();
    }

    /**
     * Dummy function, does nothing in this class.
     * @param {float} S
     * @param {float} T
     */
    updateTexCoords(S, T){}
}
