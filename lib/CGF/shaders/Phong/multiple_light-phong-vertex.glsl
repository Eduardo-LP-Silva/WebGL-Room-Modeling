#define NUMBER_OF_LIGHTS 4

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

struct lightProperties {
    vec4 position;                  // Default: (0, 0, 1, 0)
    vec4 ambient;                   // Default: (0, 0, 0, 1)
    vec4 diffuse;                   // Default: (0, 0, 0, 1)
    vec4 specular;                  // Default: (0, 0, 0, 1)
    vec4 half_vector;
    vec3 spot_direction;            // Default: (0, 0, -1)
    float spot_exponent;            // Default: 0 (possible values [0, 128]
    float spot_cutoff;              // Default: 180 (possible values [0, 90] or 180)
    float constant_attenuation;     // Default: 1 (value must be >= 0)
    float linear_attenuation;       // Default: 0 (value must be >= 0)
    float quadratic_attenuation;    // Default: 0 (value must be >= 0)
    bool enabled;                   // Deafult: false
};

uniform lightProperties uLight[NUMBER_OF_LIGHTS];

varying vec3 vNormal;
varying vec3 vLightDir[NUMBER_OF_LIGHTS];
varying vec3 vEyeVec;

void main() {
    vec4 vertex = uMVMatrix * vec4(aVertexPosition, 1.0);

    vNormal = vec3(uNMatrix * vec4(aVertexNormal, 1.0));

    vEyeVec = -vec3(vertex.xyz);

    gl_Position = uPMatrix * vertex;

    for (int i = 0; i < NUMBER_OF_LIGHTS; i++) {
        if (uLight[i].enabled) {
            if (uLight[i].position.w == 1.0) {
                vLightDir[i] = (uMVMatrix * vec4(aVertexPosition, 1.0)).xyz - uLight[i].position.xyz;
            }
        }
    }
}