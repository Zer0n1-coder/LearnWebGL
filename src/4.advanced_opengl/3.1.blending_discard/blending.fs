precision mediump float;

varying vec2 TexCoords;

uniform sampler2D texture1;

void main()
{             
    vec4 texColor = texture2D(texture1, TexCoords);
    if(texColor.a < 0.1)
        discard;
    gl_FragColor = texColor;
}