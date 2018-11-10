class CircularAnimation extends Animation
{
    constructor(center, radius, initialAngle, rotationAngle, time)
    {
        super(time);
        this.center = center;
        this.radius = radius;
        this.rotationAngle = rotationAngle * DEGREE_TO_RAD;
        this.lastUpadtedTime = -1;
        this.angle = Math.PI / 2 + initialAngle * DEGREE_TO_RAD;

        this.calculateVelocity();
    }

    initTimeStamps(currTime)
    {
        this.lastUpadtedTime = currTime;
        this.initTime = currTime;
        //this.initAnimation();
    }

    calculateVelocity()
    {
        this.velocity = this.rotationAngle / this.totalTime;
    }

    initAnimation()
    {
        mat4.translate(this.transformationMatrix, this.transformationMatrix, this.center);

        let radiusTranslation = [];

        radiusTranslation.push(this.radius * Math.sin(this.angle));
        radiusTranslation.push(0);
        radiusTranslation.push(this.radius * Math.cos(this.angle));

        mat4.translate(this.transformationMatrix, this.transformationMatrix, radiusTranslation); 

    }

    calculateDistance()
    {
        return this.rotationAngle * this.radius;
    }

    update(currentTime)
    {
        if(this.getElapsedTime(currentTime) <= this.totalTime)
        {
            mat4.translate(this.transformationMatrix, mat4.create(), this.center);
            
            this.angle += this.velocity * ((currentTime - this.lastUpadtedTime) / 1000);
            this.angle %= (2 * Math.PI);

            let radiusTranslation = [];

            radiusTranslation.push(this.radius * Math.sin(this.angle));
            radiusTranslation.push(0);
            radiusTranslation.push(this.radius * Math.cos(this.angle));

            mat4.translate(this.transformationMatrix, this.transformationMatrix, radiusTranslation);

            if(this.rotationAngle >= 0)
                mat4.rotate(this.transformationMatrix, this.transformationMatrix, this.angle + Math.PI / 2, [0,1,0]);
            else
                mat4.rotate(this.transformationMatrix, this.transformationMatrix, this.angle + Math.PI * 3/2, [0,1,0]);
            
            this.lastUpadtedTime = currentTime;
        }

    }

}