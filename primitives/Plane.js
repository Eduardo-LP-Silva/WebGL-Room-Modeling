class Plane extends CGFobject
{
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

    generateCustomSurface(degreeU, degreeV, controlPoints)
    {

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

      return new CGFnurbsSurface(degreeU, degreeV, points);
    }

    display()
    {
        this.nurbsObject.display();
    }
    update(S, T){

    }
}
