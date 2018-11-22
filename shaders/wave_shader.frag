#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float timeFactor; //Time factor
uniform float texScale;

/**
* Main function, applies the regular texture color (changed by the time factor and texture scale).
*/
void main()
{
    gl_FragColor = texture2D(uSampler, vTextureCoord*texScale + timeFactor);
}