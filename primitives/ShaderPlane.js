class ShaderPlane extends Plane
{
    constructor(scene, texture, heighMap, parts, heightscale, texscale = null)
    {
        super(scene, parts, parts);

        this.texture = new CGFappearance(scene);
        this.texture.setTexture(texture);
        
        this.heighMap = heighMap;
        this.heightscale = heightscale;
        this.texscale = texscale;
    }
}