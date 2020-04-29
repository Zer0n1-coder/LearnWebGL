precision mediump float;

varying vec2 TexCoords;

float near = 0.1; 
float far = 100.0; 
float LinearizeDepth(float depth) 
{
    float z = depth * 2.0 - 1.0; //
    return (2.0 * near * far) / (far + near - z * (far - near));	
}

uniform sampler2D texture1;

void main()
{    
	float depth = LinearizeDepth(gl_FragCoord.z) / far; //
    gl_FragColor = vec4(vec3(depth), 1.0);
    //gl_FragColor = texture2D(texture1, TexCoords);
}