class LinearAnimation extends Animation
{
    constructor(trajectory, totalTime)
    {
        super(totalTime);
        this.trajectory = trajectory;
    }

    calculateVelocity()
    {
        var totalDistance = this.calculateDistance();

        this.velocity = totalDistance / this.totalTime;
    }

    calculateDistance()
    {
        var totalDistance = 0;

        for(let i = 0; i < this.trajectory.length - 1; i += 2)
            totalDistance += vec3.distance(this.trajectory[i], this.trajectory[i + 1]);

        return totalDistance;
    }

    update(currentTime)
    {
        //TODO Complete
        //comparar ponto atual da animation com o próximo em termos de coordenadas, ver quais são as diferentes
        //e calcular a distancia = v * dt nesses eixos
    }
}