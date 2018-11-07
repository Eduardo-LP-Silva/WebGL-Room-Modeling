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
        this.stage = 1;
    
        this.calculateVelocity();
        //this.generatePath();
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
            this.trajectory[i].push(stageDistance);
            
            totalDistance += stageDistance;
        }
    
        return totalDistance;
    }

    generatePath()
    {
        var currentPoint, nextPoint;
        var pathNode = [0, 0, 0];

        for(let i = 0; i < this.trajectory.length - 1; i++)
        {
            currentPoint = this.trajectory[i];
            nextPoint = this.trajectory[i + 1];

            for(let j = 0; j < 3; j++)
                if(currentPoint[j] > nextPoint[j])
                    pathNode[j] = -1;
                else
                    if(currentPoint[j] < nextPoint[j])
                        pathNode[j] = 1;
                    else
                        pathNode[j] = 0;

            this.path[i].push(pathNode[0]);
            this.path[i].push(pathNode[1]);
            this.path[i].push(pathNode[2]);
        }
    }

    update(currentTime)
    {
        var distances = [];

        if(this.stage < this.trajectory.length && this.getElapsedTime(currentTime) <= this.totalTime)
        {
            //stageTime = stageDistance / velocity
            if(this.trajectory[this.stage][3] / this.velocity <= this.getStageTime(currentTime)) //Switch stage
            {
                this.stage++;
                this.stageInitTime = currentTime;
                this.lastUpdateTime = this.stageInitTime;
                
                //TODO Rotation
            }
            else
            {
                distances.push(this.velocity * ((currentTime - this.lastUpdateTime) / 1000) * this.trajectory[this.stage][0]);
                distances.push(this.velocity * ((currentTime - this.lastUpdateTime) / 1000) * this.trajectory[this.stage][1]);
                distances.push(this.velocity * ((currentTime - this.lastUpdateTime) / 1000) * this.trajectory[this.stage][2]);

                mat4.translate(this.transformationMatrix, mat4.create(), distances);

                this.lastUpdateTime = currentTime;
            }
        }
    }

    getStageTime(currTime)
    {
        return (currTime - this.stageInitTime) / 1000;
    }
}