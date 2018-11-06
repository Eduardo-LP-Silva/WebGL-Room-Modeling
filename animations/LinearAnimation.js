class LinearAnimation extends Animation
{
    constructor(trajectory, totalTime)
    {
        super(totalTime);
        this.trajectory = trajectory;
        this.path = []; //2D Array containing the following elements in each index: 
        this.stageTime = 0; // distance between two control points | X | Y | Z values to increase/decrease/maintin distance
        this.stage = 0;
        this.calculateVelocity();
        this.generatePath();
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

        for(let i = 0; i < this.trajectory.length - 1; i++)
        {
            stageDistance = vec3.distance(this.trajectory[i], this.trajectory[i + 1]);
            totalDistance += stageDistance;

            this.path[i] = [stageDistance];
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

        if(this.stage < this.path.length && this.elapsedTime <= this.totalTime)
        {
            this.elapsedTime = currentTime;

            //stageTime = stageDistance / velocity
            if(this.path[this.stage][0] / this.velocity <= this.stageTime) //Switch stage
            {
                this.stage++;
                this.stageTime = 0;
                console.log("switch");
                //TODO Rotation
            }
            else
            {
                distances.push(this.velocity * (currentTime - this.stageTime) * this.path[this.stage][1]);
                distances.push(this.velocity * (currentTime - this.stageTime) * this.path[this.stage][2]);
                distances.push(this.velocity * (currentTime - this.stageTime) * this.path[this.stage][3]);

                mat4.translate(this.transformationMatrix, mat4.create(), distances);
            }

            this.stageTime = currentTime;
        }
    }
}