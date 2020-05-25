import { Shader } from "./Shader";
import { Texture2D } from "./Texture2D";
import { gl } from "./Global"
import { vec3, mat4, glMatrix } from "./gl-matrix-ts/index";

export class SpriteRenderer{
    constructor(shader: Shader) {
        this.shader = shader;
        this.initRenderData();
    }

    drawSprite(
        texture: Texture2D, position: number[],
        size = [10, 10],
        rotate = 0.0,
        color = [1.0,1.0,1.0]) {

        this.shader.use();
        let model = mat4.create();
        mat4.translate(model, model, vec3.fromValues(position[0], position[1], 0.0));

        mat4.translate(model, model, vec3.fromValues(0.5 * size[0], 0.5 * size[1], 0.0));
        mat4.rotateZ(model, model, glMatrix.toRadian(rotate));
        mat4.translate(model, model, vec3.fromValues(-0.5 * size[0], -0.5 * size[1], 0.0));

        mat4.scale(model, model, vec3.fromValues(size[0], size[1], 1.0));

        this.shader.setMat4("model", model);
        this.shader.setVec3("spriteColor", color);

        gl.activeTexture(gl.TEXTURE0);
        texture.bind();

        gl.bindVertexArray(this.quadVAO);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.bindVertexArray(null);
    }

    private shader: Shader;
    private quadVAO!: WebGLVertexArrayObject;

    private initRenderData() {
        let VBO = gl.createBuffer();

        let vertices = new Float32Array([
            // 位置     // 纹理
            0.0, 1.0, 0.0, 1.0,
            1.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 0.0,

            0.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 0.0
        ]);

        let tmpVAO = gl.createVertexArray();
        if(tmpVAO === null){
            alert("unable to create VAO!")
            return;
        }
        this.quadVAO = tmpVAO;

        gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        gl.bindVertexArray(this.quadVAO);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);
    }
}