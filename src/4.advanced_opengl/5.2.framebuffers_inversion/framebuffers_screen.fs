precision mediump float;

varying vec2 TexCoords;

uniform sampler2D screenTexture;

void main()
{
    vec3 col = vec3(1.0 - texture2D(screenTexture, TexCoords));
    gl_FragColor = vec4(col, 1.0);
} 