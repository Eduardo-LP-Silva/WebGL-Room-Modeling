/**
 * Animation class, englobing the base features of any type of animation.
 */
class Animation
{
    /**
     * Constructor of the class.
     * @param {float} totalTime 
     */
    constructor(totalTime)
    {
        this.totalTime = totalTime; //The animation's total time in seconds
        this.initTime = -1; //Time at which it has been initiated
        this.transformationMatrix = mat4.create(); //The animation's transformation matrix
        this.velocity = null; //The velocity at which it is performed
    }

    /**
     * Method to be overriden by child classes, it initiates all the respective time stamps.
     * @param {long} currTime 
     */
    initTimeStamps(currTime){}

    /**
     * Method to be overriden by child classes, it updates the animation in function of the time passed.
     * @param {long} currentTime 
     */
    update(currentTime){}

    /**
     * Applies this animation to the scene.
     * @param {mat4} sceneMatrix 
     * @param {mat4} currentAnimationMatrix 
     */
    apply(sceneMatrix, currentAnimationMatrix)
    {
        mat4.mul(sceneMatrix, sceneMatrix, currentAnimationMatrix);
    }

    /**
     * Method to be overriden by child classes, it calculates the velocity at which the animation is performed.
     */
    calculateVelocity() {}

    /**
     * Method to be overriden by child classes, it calculates the total distance "traveled" by the component in this animation
     */
    calculateDistance() {}

    /**
     * Returns the amount of time passed in seconds since the animation was first initiated.
     * @param {long} currTime 
     */
    getElapsedTime(currTime)
    {
        return (currTime - this.initTime) / 1000;
    }
}