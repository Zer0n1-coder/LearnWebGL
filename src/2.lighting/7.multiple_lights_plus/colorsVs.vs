attribute vec3 aPos;
attribute vec3 aNormal;
attribute vec2 aTexCoords;

varying vec3 FragPos;
varying vec3 Normal;
varying vec2 TexCoords;

uniform mat4 changeMat;
uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main()
{
	FragPos = vec3(model * vec4( aPos, 1.0));
	Normal = mat3(changeMat)*aNormal;
	TexCoords = aTexCoords;

	gl_Position = projection* view * model * vec4( aPos, 1.0);
}