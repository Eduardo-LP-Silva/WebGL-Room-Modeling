attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform sampler2D uSampler2; //Sampler containing the height map texture
uniform float heightScale; //Height scale factor
uniform float texScale; //Texture scale factor
uniform float timeFactor; //Time factor

varying vec2 vTextureCoord;

/**
* Main function, changes the z coordinate to fit the color of the height texture which is in turn changed by a time factor.
*/
void main()
{
    //Changes the color of the height map texture.
    vec4 heightMapColor = texture2D(uSampler2, aTextureCoord*texScale + timeFactor);
    float height = length(heightMapColor);

    vec3 newPosition = aVertexPosition;

    //Changes z coordinate
    newPosition.z = height*heightScale;

    gl_Position = uPMatrix * uMVMatrix * vec4(newPosition, 1.0);

	vTextureCoord = aTextureCoord;
}