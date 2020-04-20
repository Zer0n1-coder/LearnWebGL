import { gl } from '../../Global';
import { Shader } from './Shader';

export function main(): void {
    let vertices = new Float32Array([
        0.5, -0.5, 0.0, 1.0, 0.0, 0.0,  // 
        -0.5, -0.5, 0.0, 0.0, 1.0, 0.0,  // 
        0.0, 0.5, 0.0, 0.0, 0.0, 1.0   // 
    ]);

    //顶点缓存对象
    let VBO = gl.createBuffer();
    if (!VBO) {
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

    let ourShader = new Shader(document.getElementById('vs').textContent, document.getElementById('fs').textContent);
    ourShader.use();
    let aPos = ourShader.getAttribLocation('aPos');
    let aColor = ourShader.getAttribLocation('aColor');

    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(aPos);

    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(aColor);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gles.bindVertexArrayOES(null);

    ourShader.setFloat('offset', 0.5);

    //之前的例子都是只绘制了一帧，使用下列方法之后就会进行循环绘制
    function render() {
        gl.clearColor(0.2, 0.3, 0.3, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gles.bindVertexArrayOES(VAO);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        requestAnimationFrame(render);
    }
    render();
}