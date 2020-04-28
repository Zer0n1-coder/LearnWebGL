precision mediump float;

varying vec2 TexCoords;
varying vec3 Normal;

uniform sampler2D texture_diffuse1;

void main()
{
	gl_FragColor = texture2D(texture_diffuse1,TexCoords);
}