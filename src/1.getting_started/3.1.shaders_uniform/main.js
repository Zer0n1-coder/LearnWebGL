define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let vertexShaderSource = 'attribute vec3 aPos;\n' +
        'void main() {\n' +
        '  gl_Position = vec4(aPos,1.0);\n' +
        '}\n';
    // 片元着色器程序
    let fragmentShaderSource = '#ifdef GL_ES\n' +
        '   precision mediump float;\n' + //需要加入这句话，否则会报错：no precision
        '#endif\n' +
        'uniform vec4 ourColor;\n' +
        'void main() {\n' +
        '  gl_FragColor = ourColor;\n' +
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
        //片元着色器
        let fs = gl.createShader(gl.FRAGMENT_SHADER);
        if (!fs) {
            alert('unable to create Fshader');
            return;
        }
        gl.shaderSource(fs, fragmentShaderSource);
        gl.compileShader(fs);
        compiled = gl.getShaderParameter(fs, gl.COMPILE_STATUS);
        if (!compiled) {
            let error = gl.getShaderInfoLog(fs);
            alert('Failed to compile shader: ' + error);
            gl.deleteShader(fs);
            return;
        }
        //链接着色器
        let program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        let linked = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!linked) {
            let error = gl.getProgramInfoLog(program);
            alert('Failed to link program: ' + error);
            gl.deleteProgram(program);
            gl.deleteShader(fs);
            gl.deleteShader(vs);
            return;
        }
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        let vertices = new Float32Array([
            -0.5, -0.5, 0.0,
            0.5, -0.5, 0.0,
            0.0, 0.5, 0.0,
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
        //注意！webgl里的着色器语言删减了部分语法，需要有获取着色器里变量位置的过程
        gl.useProgram(program); //使用着色器程序，获取变量位置
        let aPos = gl.getAttribLocation(program, 'aPos');
        gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.enableVertexAttribArray(aPos);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gles.bindVertexArrayOES(null);
        let vertexColorLocation = gl.getUniformLocation(program, "ourColor");
        //之前的例子都是只绘制了一帧，使用下列方法之后就会进行循环绘制
        function render() {
            gl.clearColor(0.2, 0.3, 0.3, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            //更新
            let date = new Date;
            let timeValue = date.getTime() / 1000; //除以一个常数1000是为了平缓时间的变化，使三角形颜色过渡平缓
            let greenValue = Math.sin(timeValue) / 2.0 + 0.5;
            gl.uniform4f(vertexColorLocation, 0.0, greenValue, 0.0, 1.0);
            gles.bindVertexArrayOES(VAO);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
            requestAnimationFrame(render);
        }
        render();
    }
    exports.main = main;
});
//# sourceMappingURL=main.js.map