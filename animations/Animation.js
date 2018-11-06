class Animation
{
    constructor(totalTime)
    {
        this.totalTime = totalTime;
        this.elapsedTime = 0;
        this.transformationMatrix = mat4.create();
        this.velocity = null;
    }

    update(currentTime)
    {
        //TODO Complete
    }

    apply()
    {
        //TODO Complete
    }

    //Method to be overriden by child classes
    calculateVelocity() {}

    //Method to be overriden by child classes
    calculateDistance() {}
}