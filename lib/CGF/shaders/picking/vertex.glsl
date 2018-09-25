attribute vec3 aVertexPosition;

uniform bool uUseTexture;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec4 vFinalColor;

uniform vec4 uPickColor;

void main() {

	vec3 pt = vec3(aVertexPosition);
	 
    // Transformed Vertex position
    vec4 vertex = uMVMatrix * vec4(pt, 1.0);
    gl_Position = uPMatrix * vertex;
        
	vFinalColor = uPickColor;
}
