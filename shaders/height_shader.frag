#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;

/**
* Main function, applies the regular texture color to the object.
*/
void main()
{
    gl_FragColor = texture2D(uSampler, vTextureCoord);
}