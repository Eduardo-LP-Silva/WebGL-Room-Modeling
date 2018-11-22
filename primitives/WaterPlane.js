class WaterPlane extends Plane
{
    constructor(scene, texture, waveMap, parts, heightscale, texscale)
    {
        super(scene, parts, parts);

        this.texture = new CGFappearance(scene);
        this.texture.setTexture(texture);

        this.waveMap = waveMap;
        this.lastUpdate = 0;
    
        this.shader = new CGFshader(scene.gl, "shaders/wave_shader.vert", "shaders/wave_shader.frag");
        this.shader.setUniformsValues({uSampler2: 1, heightScale: heightscale, timeFactor: 1, texScale: texscale});
    }

    updateTexCoords(S, T)
    {
   
    }

    updateShader(currTime)
    {
        this.lastUpdate = (this.lastUpdate + 0.002) % 10;

        this.shader.setUniformsValues({timeFactor: this.lastUpdate});  
        
        //console.log(factor);
    }

    activateShader()
    {
        this.texture.apply();
        this.scene.setActiveShader(this.shader);
        this.waveMap.bind(1);
        this.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}