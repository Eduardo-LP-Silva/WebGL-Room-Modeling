class Plane extends CGFobject
{
    constructor(scene, uDivs, vDivs, degreeU = null, degreeV = null, controlPoints = [])
    {
        super(scene);

        var surface;
        
        if(degreeU == null || degreeV == null || controlPoints.length == 0)
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

        return nurbsSurface = new CGFnurbsSurface(1, 1, controlPoints);
    }

    generateCustomSurface(degreeU, degreeV, controlPoints)
    {
        var points = [];

        for(let i = 0; i < controlPoints.length; i++)
        {
            points[i] = [];

            for(let j = 0; j <= degreeV; j++)
                points[i].push(controlPoints[i]);
        }

        return new CGFnurbsSurface(degreeU, degreeV, points);
    }

    display()
    {
        this.nurbsObject.display();
    }
}