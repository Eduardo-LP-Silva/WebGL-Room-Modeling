attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec3 vNormal;
varying vec3 vEyeVec;

void main() {
    vec4 vertex = uMVMatrix * vec4(aVertexPosition, 1.0);

    vNormal = vec3(uNMatrix * vec4(aVertexNormal, 1.0));

    vEyeVec = -vec3(vertex.xyz);

    gl_Position = uPMatrix * vertex;
}