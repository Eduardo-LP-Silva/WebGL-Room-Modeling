class Animation
{
    constructor(totalTime)
    {
        this.totalTime = totalTime;
        this.elapsedTime = 0;
        this.stage = 0;
        this.initialTransformationMatrix = null;
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