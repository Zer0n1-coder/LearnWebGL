define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let vertexShaderSource = 'attribute vec3 aPos;\n' +
        'void main() {\n' +
        '  gl_Position = vec4(aPos,1.0);\n' +
        '}\n';
    // 片元着色器程序
    let fragmentShader1Source = 'void main() {\n' +
        '  gl_FragColor = vec4(1.0, 0.5, 0.2, 1.0);\n' +
        '}\n';
    let fragmentShader2Source = 'void main() {\n' +
        '  gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);\n' +
        '}\n';
    function main() {
        let canvas = document.getElementById('webgl');
        let gl = canvas.getContext('webgl');
        if (!gl) {
            window.alert('Failed to get the rendering context for WebGL');
            return;
        }
        //顶点着色器
        let vs = gl.createShader(gl.VERTEX_SHADER);
        if (!vs) {
            alert('unable to create Vshader');
            return;
        }
        gl.shaderSource(vs, vertexShaderSource);
        gl.compileShader(vs);
        let compiled = gl.getShaderParameter(vs, gl.COMPILE_STATUS);
        if (!compiled) {
            let error = gl.getShaderInfoLog(vs);
            alert('Failed to compile shader: ' + error);
            gl.deleteShader(vs);
            return;
        }
        //片元着色器1
        let fs1 = gl.createShader(gl.FRAGMENT_SHADER);
        if (!fs1) {
            alert('unable to create Fshader');
            return;
        }
        gl.shaderSource(fs1, fragmentShader1Source);
        gl.compileShader(fs1);
        compiled = gl.getShaderParameter(fs1, gl.COMPILE_STATUS);
        if (!compiled) {
            let error = gl.getShaderInfoLog(fs1);
            alert('Failed to compile shader: ' + error);
            gl.deleteShader(fs1);
            return;
        }
        //片元着色器2
        let fs2 = gl.createShader(gl.FRAGMENT_SHADER);
        if (!fs2) {
            alert('unable to create Fshader');
            return;
        }
        gl.shaderSource(fs2, fragmentShader2Source);
        gl.compileShader(fs2);
        compiled = gl.getShaderParameter(fs2, gl.COMPILE_STATUS);
        if (!compiled) {
            let error = gl.getShaderInfoLog(fs2);
            alert('Failed to compile shader: ' + error);
            gl.deleteShader(fs2);
            return;
        }
        //链接着色器1
        let program1 = gl.createProgram();
        gl.attachShader(program1, vs);
        gl.attachShader(program1, fs1);
        gl.linkProgram(program1);
        let linked = gl.getProgramParameter(program1, gl.LINK_STATUS);
        if (!linked) {
            let error = gl.getProgramInfoLog(program1);
            alert('Failed to link program: ' + error);
            gl.deleteProgram(program1);
            gl.deleteShader(fs1);
            gl.deleteShader(vs);
            return;
        }
        //链接着色器2
        let program2 = gl.createProgram();
        gl.attachShader(program2, vs);
        gl.attachShader(program2, fs2);
        gl.linkProgram(program2);
        linked = gl.getProgramParameter(program2, gl.LINK_STATUS);
        if (!linked) {
            let error = gl.getProgramInfoLog(program2);
            alert('Failed to link program: ' + error);
            gl.deleteProgram(program2);
            gl.deleteShader(fs2);
            gl.deleteShader(vs);
            return;
        }
        gl.deleteShader(vs);
        gl.deleteShader(fs1);
        gl.deleteShader(fs2);
        //注意！webgl里顶点数组对象是作为扩展
        let gles = gl.getExtension('OES_vertex_array_object');
        //第一个三角形
        let firstTriangle = new Float32Array([
            -0.9, -0.5, 0.0,
            -0.0, -0.5, 0.0,
            -0.45, 0.5, 0.0
        ]);
        // 第二个三角形
        let secondTriangle = new Float32Array([
            0.0, -0.5, 0.0,
            0.9, -0.5, 0.0,
            0.45, 0.5, 0.0
        ]);
        //顶点缓存对象
        let VBO1 = gl.createBuffer();
        if (!VBO1) {
            alert('Failed to create the buffer object');
            return;
        }
        let VAO1 = gles.createVertexArrayOES();
        if (!VAO1) {
            alert('Failed to create the VAO');
            return;
        }
        gles.bindVertexArrayOES(VAO1);
        gl.bindBuffer(gl.ARRAY_BUFFER, VBO1);
        gl.bufferData(gl.ARRAY_BUFFER, firstTriangle, gl.STATIC_DRAW);
        gl.useProgram(program1);
        let aPos = gl.getAttribLocation(program1, 'aPos');
        gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.enableVertexAttribArray(aPos);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gles.bindVertexArrayOES(null);
        let VBO2 = gl.createBuffer();
        if (!VBO2) {
            alert('Failed to create the buffer object');
            return;
        }
        let VAO2 = gles.createVertexArrayOES();
        if (!VAO2) {
            alert('Failed to create the VAO');
            return;
        }
        gles.bindVertexArrayOES(VAO2);
        gl.bindBuffer(gl.ARRAY_BUFFER, VBO2);
        gl.bufferData(gl.ARRAY_BUFFER, secondTriangle, gl.STATIC_DRAW);
        gl.useProgram(program2);
        aPos = gl.getAttribLocation(program2, 'aPos');
        gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.enableVertexAttribArray(aPos);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gles.bindVertexArrayOES(null);
        gl.clearColor(0.2, 0.3, 0.3, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program1);
        gles.bindVertexArrayOES(VAO1);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        gl.useProgram(program2);
        gles.bindVertexArrayOES(VAO2);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    exports.main = main;
});
//# sourceMappingURL=main.js.map