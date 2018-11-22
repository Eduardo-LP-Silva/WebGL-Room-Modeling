/**
 * Represents a plane with its own shaders to simulate height differences in textures.
 */
class ShaderPlane extends Plane
{
    /**
     * @constructor
     * @param {CGFscene} scene 
     * @param {CGFtexture} texture 
     * @param {CGFtexture} heightMap 
     * @param {int} parts 
     * @param {float} heightscale 
     */
    constructor(scene, texture, heightMap, parts, heightscale)
    {
        super(scene, parts, parts);

        this.texture = new CGFappearance(scene);
        this.texture.setTexture(texture);

        this.heightMap = heightMap;

        this.shader = new CGFshader(scene.gl, "shaders/height_shader.vert", "shaders/height_shader.frag");
        this.shader.setUniformsValues({uSampler2: 1, heightScale: heightscale});
    }

    /**
     * Applies the shader to the plane.
     */
    activateShader()
    {
        this.texture.apply();
        this.scene.setActiveShader(this.shader);
        this.heightMap.bind(1); //Binds the height map texture to 1.
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