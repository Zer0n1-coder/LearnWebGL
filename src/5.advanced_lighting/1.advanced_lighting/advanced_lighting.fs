#version 300 es
precision mediump float;

out vec4 FragColor;

in vec3 FragPos;
in vec3 Normal;
in vec2 TexCoords;

uniform sampler2D floorTexture;
uniform vec3 lightPos;
uniform vec3 viewPos;
uniform bool blinn;

void main()
{
    vec3 color = texture(floorTexture, TexCoords).rgb;

    vec3 ambient = 0.05 * color;

    vec3 lightDir = normalize(lightPos - FragPos);
    vec3 normal = normalize(Normal);
    float diff = max(dot(lightDir,normal),0.0);
    vec3 diffuse = diff * color;

    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 reflectDir = reflect(-lightDir,normal);
    float spec = 0.0;
    if(blinn){
        vec3 halfwayDir = normalize(lightDir + viewDir);
        spec = pow(max(dot(normal,halfwayDir),0.0),2.0);
    }
    else{
        vec3 reflectDir = reflect(-lightDir,normal);
        spec = pow(max(dot(viewDir,reflectDir),0.0),0.5);
    }

    vec3 specular = vec3(0.3) * spec;
    FragColor = vec4(ambient + diffuse + specular,1.0);
}