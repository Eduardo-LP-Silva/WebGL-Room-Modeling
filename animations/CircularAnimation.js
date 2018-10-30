class CircularAnimation extends Animation
{
    constructor(center, radius, initialAngle, rotationAngle, time)
    {
        super();
        this.center = center;
        this.radius = radius;
        this.initialAngle = initialAngle;
        this.rotationAngle = rotationAngle;
        this.time = time;
    }
}