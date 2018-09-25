#ifdef GL_ES
precision highp float;
#endif

varying vec4 vFinalColor;

void main() {
	gl_FragColor = vFinalColor;
}