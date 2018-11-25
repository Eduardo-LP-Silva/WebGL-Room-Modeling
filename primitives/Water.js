/**
 * Represents a plane with its own shader to simulate moving water.
 */
class Water extends Plane
{
    /**
     * @constructor
     * @param {CGFscene} scene 
     * @param {CGFtexture} texture 
     * @param {CGFtexture} waveMap 
     * @param {int} parts 
     * @param {float} heightscale 
     * @param {float} texscale 
     */
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

    updateShader()
    {
        this.lastUpdate = (this.lastUpdate + 0.002) % 1;

        this.shader.setUniformsValues({timeFactor: this.lastUpdate});  
    }

    /**
     * Applies the shader to the plane.
     */
    activateShader()
    {
        this.texture.apply();
        this.scene.setActiveShader(this.shader);
        this.waveMap.bind(1); //Binds the height texture to 1
        this.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    }

    /**
     * Dummy function, does nothing in this class.
     * @param {float} S 
     * @param {float} T 
     */
    updateTexCoords(S, T){}
}