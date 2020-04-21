define(["require", "exports", "../../Global", "./Shader"], function (require, exports, Global_1, Shader_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function main() {
        let ourShader = new Shader_1.Shader(document.getElementById('vs').textContent, document.getElementById('fs').textContent);
        let vertices = new Float32Array([
            0.5, 0.5, 0.0, 1.0, 0.0, 0.0, 2.0, 2.0,
            0.5, -0.5, 0.0, 0.0, 1.0, 0.0, 2.0, 0.0,
            -0.5, -0.5, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0,
            -0.5, 0.5, 0.0, 1.0, 1.0, 0.0, 0.0, 2.0 // 
        ]);
        let indices = new Uint16Array([
            0, 1, 3,
            1, 2, 3 //第二个三角形
        ]);
        //顶点缓存对象
        let VBO = Global_1.gl.createBuffer();
        if (!VBO) {
            alert('Failed to create the buffer object');
            return;
        }
        //索引缓存对象
        let EBO = Global_1.gl.createBuffer();
        if (!EBO) {
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
        Global_1.gl.bindBuffer(Global_1.gl.ELEMENT_ARRAY_BUFFER, EBO);
        Global_1.gl.bufferData(Global_1.gl.ELEMENT_ARRAY_BUFFER, indices, Global_1.gl.STATIC_DRAW);
        ourShader.use();
        let aPos = ourShader.getAttribLocation('aPos');
        Global_1.gl.vertexAttribPointer(aPos, 3, Global_1.gl.FLOAT, false, 8 * Float32Array.BYTES_PER_ELEMENT, 0);
        Global_1.gl.enableVertexAttribArray(aPos);
        let aColor = ourShader.getAttribLocation('aColor');
        Global_1.gl.vertexAttribPointer(aColor, 3, Global_1.gl.FLOAT, false, 8 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
        Global_1.gl.enableVertexAttribArray(aColor);
        let aTexCoord = ourShader.getAttribLocation('aTexCoord');
        Global_1.gl.vertexAttribPointer(aTexCoord, 2, Global_1.gl.FLOAT, false, 8 * Float32Array.BYTES_PER_ELEMENT, 6 * Float32Array.BYTES_PER_ELEMENT);
        Global_1.gl.enableVertexAttribArray(aTexCoord);
        Global_1.gl.bindBuffer(Global_1.gl.ARRAY_BUFFER, null);
        gles.bindVertexArrayOES(null);
        //纹理1
        let texture1 = Global_1.gl.createTexture();
        Global_1.gl.bindTexture(Global_1.gl.TEXTURE_2D, texture1);
        Global_1.gl.texParameteri(Global_1.gl.TEXTURE_2D, Global_1.gl.TEXTURE_WRAP_S, Global_1.gl.REPEAT);
        Global_1.gl.texParameteri(Global_1.gl.TEXTURE_2D, Global_1.gl.TEXTURE_WRAP_T, Global_1.gl.REPEAT);
        Global_1.gl.texParameteri(Global_1.gl.TEXTURE_2D, Global_1.gl.TEXTURE_MIN_FILTER, Global_1.gl.LINEAR);
        Global_1.gl.texParameteri(Global_1.gl.TEXTURE_2D, Global_1.gl.TEXTURE_MAG_FILTER, Global_1.gl.LINEAR);
        let img1 = document.getElementById('container');
        Global_1.gl.texImage2D(Global_1.gl.TEXTURE_2D, 0, Global_1.gl.RGB, Global_1.gl.RGB, Global_1.gl.UNSIGNED_BYTE, img1);
        Global_1.gl.generateMipmap(Global_1.gl.TEXTURE_2D);
        //纹理2
        let texture2 = Global_1.gl.createTexture();
        Global_1.gl.bindTexture(Global_1.gl.TEXTURE_2D, texture2);
        Global_1.gl.texParameteri(Global_1.gl.TEXTURE_2D, Global_1.gl.TEXTURE_WRAP_S, Global_1.gl.REPEAT);
        Global_1.gl.texParameteri(Global_1.gl.TEXTURE_2D, Global_1.gl.TEXTURE_WRAP_T, Global_1.gl.REPEAT);
        Global_1.gl.texParameteri(Global_1.gl.TEXTURE_2D, Global_1.gl.TEXTURE_MIN_FILTER, Global_1.gl.LINEAR);
        Global_1.gl.texParameteri(Global_1.gl.TEXTURE_2D, Global_1.gl.TEXTURE_MAG_FILTER, Global_1.gl.LINEAR);
        let img2 = document.getElementById('awesomeface');
        Global_1.gl.texImage2D(Global_1.gl.TEXTURE_2D, 0, Global_1.gl.RGBA, Global_1.gl.RGBA, Global_1.gl.UNSIGNED_BYTE, img2);
        Global_1.gl.generateMipmap(Global_1.gl.TEXTURE_2D);
        ourShader.setInt("texture1", 0);
        ourShader.setInt("texture2", 1);
        function render() {
            Global_1.gl.clearColor(0.2, 0.3, 0.3, 1.0);
            Global_1.gl.clear(Global_1.gl.COLOR_BUFFER_BIT);
            Global_1.gl.activeTexture(Global_1.gl.TEXTURE0);
            Global_1.gl.bindTexture(Global_1.gl.TEXTURE_2D, texture1);
            Global_1.gl.activeTexture(Global_1.gl.TEXTURE1);
            Global_1.gl.bindTexture(Global_1.gl.TEXTURE_2D, texture2);
            gles.bindVertexArrayOES(VAO);
            Global_1.gl.drawElements(Global_1.gl.TRIANGLES, 6, Global_1.gl.UNSIGNED_SHORT, 0);
            requestAnimationFrame(render);
        }
        render();
    }
    exports.main = main;
});
//# sourceMappingURL=main.js.map