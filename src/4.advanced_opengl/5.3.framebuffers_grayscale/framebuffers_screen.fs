precision highp float;

varying vec2 TexCoords;

uniform sampler2D screenTexture;

void main()
{
    vec4 col = texture2D(screenTexture, TexCoords);
	float average = 0.2126 * col.r + 0.7152 * col.g + 0.0722 * col.b;
    gl_FragColor = vec4(average,average,average, 1.0);
} 