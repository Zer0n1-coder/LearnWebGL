﻿import { gl } from "../../Global";
import { Shader } from "./Shader"

export function main(): void {
    let ourShader = new Shader(document.getElementById('vs').textContent, document.getElementById('fs').textContent);

    let vertices = new Float32Array([
        0.5, 0.5, 0.0, 1.0, 0.0, 0.0, 0.55, 0.55, //
        0.5, -0.5, 0.0, 0.0, 1.0, 0.0, 0.55, 0.45, // 
        -0.5, -0.5, 0.0, 0.0, 0.0, 1.0, 0.45, 0.45, // 
        -0.5, 0.5, 0.0, 1.0, 1.0, 0.0, 0.45, 0.55  // 
    ]);

    let indices = new Uint16Array([
        0, 1, 3, //第一个三角形
        1, 2, 3  //第二个三角形
    ]);

    //顶点缓存对象
    let VBO = gl.createBuffer();
    if (!VBO) {
        alert('Failed to create the buffer object');
        return;
    }

    //索引缓存对象
    let EBO = gl.createBuffer();
    if (!EBO) {
        alert('Failed to create the buffer object');
        return;
    }

    //注意！webgl里顶点数组对象是作为扩展
    let gles = gl.getExtension('OES_vertex_array_object');
    let VAO = gles.createVertexArrayOES();
    if (!VAO) {
        alert('Failed to create the VAO');
        return;
    }

    gles.bindVertexArrayOES(VAO);

    gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    ourShader.use();   

    let aPos = ourShader.getAttribLocation('aPos');
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 8 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(aPos);

    let aColor = ourShader.getAttribLocation('aColor');
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 8 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(aColor);

    let aTexCoord = ourShader.getAttribLocation('aTexCoord');
    gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 8 * Float32Array.BYTES_PER_ELEMENT, 6 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(aTexCoord);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gles.bindVertexArrayOES(null);

    //纹理1
    let texture1 = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture1); 

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);	
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    let img1 = <HTMLImageElement>document.getElementById('container');
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img1);
    gl.generateMipmap(gl.TEXTURE_2D);

    //纹理2
    let texture2 = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture2);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    let img2 = <HTMLImageElement>document.getElementById('awesomeface');
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img2);
    gl.generateMipmap(gl.TEXTURE_2D);

    ourShader.setInt("texture1", 0);
    ourShader.setInt("texture2", 1);

    function render() {
        gl.clearColor(0.2, 0.3, 0.3, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture1);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texture2);

        gles.bindVertexArrayOES(VAO);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(render);
    }

    render();
}