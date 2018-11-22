attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform sampler2D uSampler2;
uniform float heightScale;
uniform float texScale;
uniform float timeFactor;

varying vec2 vTextureCoord;

void main()
{
    vec4 heightMapColor = texture2D(uSampler2, aTextureCoord*texScale + timeFactor);
    float height = length(heightMapColor);

    vec3 newPosition = aVertexPosition;

    newPosition.z = height*heightScale;

    gl_Position = uPMatrix * uMVMatrix * vec4(newPosition, 1.0);

	vTextureCoord = aTextureCoord;
}