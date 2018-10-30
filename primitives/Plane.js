class Plane extends CGFobject
{
    constructor(scene, uDivs, vDivs, degreeU = null, degreeV = null, controlPoints = [])
    {
        super(scene);
        
        if(degreeU == null || degreeV == null)
            this.generateDefaultSurface(uDivs, vDivs);
    }

    generateDefaultSurface(uDivs, vDivs)
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

        this.nurbsObject = new CGFnurbsObject(this.scene, uDivs, vDivs, nurbsSurface);
    }

    display()
    {
        this.nurbsObject.display();
    }
}