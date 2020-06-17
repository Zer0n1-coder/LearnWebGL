#version 300 es
layout (location = 0) in vec3 aPos;
layout (location = 1) in vec3 aNormal;
layout (location = 2) in vec2 aTexCoords;

//out vec2 TexCoords;

out vec3 vFragPos;
out vec3 vNormal;
out vec2 vTexCoords;
out vec4 vFragPosLightSpace;

uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;
uniform mat4 lightSpaceMatrix;

void main()
{
    vFragPos = vec3(model * vec4(aPos, 1.0));
    vNormal = transpose(inverse(mat3(model))) * aNormal;
    vTexCoords = aTexCoords;
    vFragPosLightSpace = lightSpaceMatrix * vec4(vFragPos, 1.0);
    gl_Position = projection * view * model * vec4(aPos, 1.0);
}