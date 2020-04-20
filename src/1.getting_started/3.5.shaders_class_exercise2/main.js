define(["require", "exports", "../../Global", "./Shader"], function (require, exports, Global_1, Shader_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function main() {
        let vertices = new Float32Array([
            0.5, -0.5, 0.0, 1.0, 0.0, 0.0,
            -0.5, -0.5, 0.0, 0.0, 1.0, 0.0,
            0.0, 0.5, 0.0, 0.0, 0.0, 1.0 // 
        ]);
        //顶点缓存对象
        let VBO = Global_1.gl.createBuffer();
        if (!VBO) {
            alert('Failed to create the buffer object');
            return;
        }
        //注意！webgl里顶点数组对象是作为扩展
        let gles = Global_1.gl.getExtension('OES_vertex_array_object');
        let VAO = gles.createVertexArrayOES();
        if (!VAO) {
            alert('Failed to create the VAO');
            return;
        }
        gles.bindVertexArrayOES(VAO);
        Global_1.gl.bindBuffer(Global_1.gl.ARRAY_BUFFER, VBO);
        Global_1.gl.bufferData(Global_1.gl.ARRAY_BUFFER, vertices, Global_1.gl.STATIC_DRAW);
        let ourShader = new Shader_1.Shader(document.getElementById('vs').textContent, document.getElementById('fs').textContent);
        ourShader.use();
        let aPos = ourShader.getAttribLocation('aPos');
        let aColor = ourShader.getAttribLocation('aColor');
        Global_1.gl.vertexAttribPointer(aPos, 3, Global_1.gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
        Global_1.gl.enableVertexAttribArray(aPos);
        Global_1.gl.vertexAttribPointer(aColor, 3, Global_1.gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
        Global_1.gl.enableVertexAttribArray(aColor);
        Global_1.gl.bindBuffer(Global_1.gl.ARRAY_BUFFER, null);
        gles.bindVertexArrayOES(null);
        ourShader.setFloat('offset', 0.5);
        //之前的例子都是只绘制了一帧，使用下列方法之后就会进行循环绘制
        function render() {
            Global_1.gl.clearColor(0.2, 0.3, 0.3, 1.0);
            Global_1.gl.clear(Global_1.gl.COLOR_BUFFER_BIT);
            gles.bindVertexArrayOES(VAO);
            Global_1.gl.drawArrays(Global_1.gl.TRIANGLES, 0, 3);
            requestAnimationFrame(render);
        }
        render();
    }
    exports.main = main;
});
//# sourceMappingURL=main.js.map