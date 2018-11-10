class CircularAnimation extends Animation
{
    constructor(center, radius, initialAngle, rotationAngle, time)
    {
        super(time);
        this.center = center;
        this.radius = radius;
        this.initialAngle = initialAngle * DEGREE_TO_RAD;
        this.rotationAngle = rotationAngle * DEGREE_TO_RAD;
        this.lastUpadtedTime = -1;

        this.calculateVelocity();
    }

    initTimeStamps(currTime)
    {
        this.lastUpadtedTime = currTime;
    }

    calculateVelocity()
    {
        this.velocity = this.rotationAngle / this.totalTime;
    }

    calculateDistance()
    {
        return this.rotationAngle * this.radius;
    }


}