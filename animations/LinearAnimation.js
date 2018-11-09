class LinearAnimation extends Animation
{
    constructor(trajectory, totalTime)
    {
        super(totalTime);
        this.trajectory = trajectory;
        /* 2D Array containing the following elements in each index: distance between two control 
        points | X | Y | Z values to increase/decrease/maintin distance */
        this.path = [];
        this.lastUpdateTime = 0;
        this.stageInitTime = 0;
        this.angle = 0;
        this.stage = 0;
    
        this.calculateVelocity();
    }

    initTimeStamps(currTime)
    {
        this.initTime = currTime;
        this.lastUpdateTime = currTime;
        this.stageInitTime = currTime;
    }

    calculateVelocity()
    {
        var totalDistance = this.calculateDistance();

        this.velocity = totalDistance / this.totalTime;
    }

    calculateDistance()
    {
        var totalDistance = 0;
        var stageDistance = 0;


        for(let i = 0; i < this.trajectory.length; i++)
        {
            stageDistance = vec3.length(this.trajectory[i]);
            vec3.normalize(this.trajectory[i], this.trajectory[i]);

            if(stageDistance == 0)
            {
                if(i == 0)
                {
                    this.trajectory[i] = [0,0,1];
                    stageDistance = 1;
                }
                else
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

    update(currentTime)
    {
        var distances = [];
    
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
                    
                    this.angle = -Math.atan2(v1[0] * v2[2] - v1[2]*v2[0], v1[0]*v2[0] + v1[2]*v2[2]);
                    //this.angle = Math.acos(vec3.dot(v1, v2) / (vec3.length(v1) * vec3.length(v2)));
  
                    mat4.rotate(this.transformationMatrix, this.transformationMatrix, this.angle, [0,1,0]);
 
                    //this.stage++;

                    let vector = [0,0,0], defaultVector = [0,0,1];
                    
                    //Calculate angle between default [0,0,1] and v2

                    let differenceAngle = Math.atan2(defaultVector[0] * v2[2] - defaultVector[2]*v2[0], 
                            defaultVector[0]*v2[0] + defaultVector[2]*v2[2]);

                    vector[0] = this.path[this.stage][2] * Math.sin(differenceAngle) 
                        + this.path[this.stage][0] * Math.cos(differenceAngle);
                    
                    vector[1] = this.path[this.stage][1];

                    vector[2] = this.path[this.stage][2] * Math.cos(differenceAngle) 
                        - this.path[this.stage][0] * Math.sin(differenceAngle);
                    
                    this.path[this.stage] = vector;
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

    getStageTime(currTime)
    {
        return (currTime - this.stageInitTime) / 1000;
    }
}