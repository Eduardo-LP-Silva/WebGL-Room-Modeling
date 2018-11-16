class ShaderPlane extends Plane
{
    constructor(scene, texture, heightMap, parts, heightscale, texscale = null)
    {
        super(scene, parts, parts);

        this.texture = new CGFappearance(scene);
        this.texture.setTexture(texture);

        this.heightMap = heightMap;
        this.heightscale = heightscale;
        this.texscale = texscale;

        if(texscale == null)
        {
            this.shader = new CGFshader(scene.gl, "shaders/height_shader.vert", "shaders/height_shader.frag");
            this.shader.setUniformsValues({uSampler2: 1, heightScale: heightscale});
        }
        
    }

    update()
    {
        this.texture.apply();
        this.scene.setActiveShader(this.shader);
        this.heightMap.bind(1);
        this.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}