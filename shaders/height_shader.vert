attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform sampler2D uSampler2; //Sampler containing the height map texture
uniform float heightScale; //The height scale factor.

varying vec2 vTextureCoord;

/**
* Main function, changes the z coordinate of the object so it varies with the color of the height map.
*/
void main()
{
    // Gets the color from the height map texture
    vec4 heightMapColor = texture2D(uSampler2, aTextureCoord);
    float height = length(heightMapColor);

    vec3 newPosition = aVertexPosition;

    newPosition.z = height*heightScale; //Change z coordinate to match the color of the height map

    gl_Position = uPMatrix * uMVMatrix * vec4(newPosition, 1.0);

	vTextureCoord = aTextureCoord;
}