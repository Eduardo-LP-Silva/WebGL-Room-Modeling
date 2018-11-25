/**
 * Represents a linear animation.
 */
class LinearAnimation extends Animation
{
    /**
     * @constructor
     * @param {array} trajectory 
     * @param {float} totalTime 
     */
    constructor(trajectory, totalTime)
    {
        super(totalTime);
        this.trajectory = trajectory;
        this.path = [];
        this.lastUpdateTime = 0;
        this.stageInitTime = 0;
        this.stage = 0;
    
        this.calculateVelocity();
    }

    /**
     * Initiates the time stamps neede for control with proper values.
     * @param {float} currTime 
     */
    initTimeStamps(currTime)
    {
        this.initTime = currTime;
        this.lastUpdateTime = currTime;
        this.stageInitTime = currTime;
        this.initAnimation();
    }

    /**
     * Positions the object in the starting position of the animation.
     */
    initAnimation()
    {
        var initialTrajectory = this.trajectory[this.stage].slice(0, 3);

        mat4.translate(this.transformationMatrix, this.transformationMatrix, initialTrajectory);

        this.trajectory[0] = [0, 0, 1];
        this.path[0] = [0, 0, 1];
    }

    /**
     * Calculates the constant velocity = Distance / Span the object should have.
     */
    calculateVelocity()
    {
        var totalDistance = this.calculateDistance();

        this.velocity = totalDistance / this.totalTime;
    }

    /** 
     * Calculates the overall distance, normalizes the control points and removes the ones that do not have any movement
     * (0, 0, 0).
    */
    calculateDistance()
    {
        var totalDistance = 0;
        var stageDistance = 0;


        for(let i = 0; i < this.trajectory.length; i++)
        {
            stageDistance = vec3.length(this.trajectory[i]);

            if(i != 0)
                vec3.normalize(this.trajectory[i], this.trajectory[i]);

            if (i == 0) //First special case
                stageDistance = 0;
             
            if(stageDistance == 0)
            {
                if(i != 0)
                {
                    this.trajectory.splice(i, 1);
                    i--;
                    continue;
                }
            }

            this.trajectory[i].push(stageDistance);
            
            totalDistance += stageDistance;
        }

        this.path = this.trajectory.slice();
        
        return totalDistance;
    }

    /**
     * Updates the animation given the time passed since the last update.
     * @param {float} currentTime 
     */
    update(currentTime)
    {
        var distances = [];
    
        //Make sure the animation hasn't ended
        if(this.stage < this.trajectory.length && this.getElapsedTime(currentTime) <= this.totalTime)
        {
            //stageTime = stageDistance / velocity
            if(this.trajectory[this.stage][3] / this.velocity <= this.getStageTime(currentTime) || this.stage == 0) //Switch stage
            {
            
                this.stageInitTime = currentTime;
                this.lastUpdateTime = this.stageInitTime;

                this.stage++;

                if(this.stage < this.trajectory.length)
                {
                   
                    //Calculate rotation angle

                    let v1 = Array.from(this.trajectory[this.stage - 1]);
                    v1.splice(3, 1);
                    let v2 = Array.from(this.trajectory[this.stage]);
                    v2.splice(3, 1);
                        
                    var angle = -this.angle2V(v1, v2);
    
                    mat4.rotate(this.transformationMatrix, this.transformationMatrix, angle, [0,1,0]);
    
                    let defaultVector = [0,0,1];
                        
                    //Calculate angle between default [0,0,1] and v2

                    let differenceAngle = this.angle2V(defaultVector, v2);
                  
                    this.path[this.stage] = this.rotateVectorY(this.path[this.stage], differenceAngle);
                    
                }
            
            }
            else
            {
                distances.push(this.velocity * ((currentTime - this.lastUpdateTime) / 1000) 
                    * this.path[this.stage][0]);

                distances.push(this.velocity * ((currentTime - this.lastUpdateTime) / 1000) 
                    * this.path[this.stage][1]);

                distances.push(this.velocity * ((currentTime - this.lastUpdateTime) / 1000) 
                    * this.path[this.stage][2]);

                mat4.translate(this.transformationMatrix, mat4.create(), distances);       
            }

            this.lastUpdateTime = currentTime;
            
        }
    }

    /**
     * Returns the amount of seconds the animation has been in the last stage.
     * @param {float} currTime 
     */
    getStageTime(currTime)
    {
        return (currTime - this.stageInitTime) / 1000;
    }
}