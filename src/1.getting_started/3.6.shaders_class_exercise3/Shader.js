define(["require", "exports", "../../Global"], function (require, exports, Global_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Shader {
        constructor(vertexShaderSource, fragmentShaderSource) {
            //顶点着色器
            let vs = Global_1.gl.createShader(Global_1.gl.VERTEX_SHADER);
            if (!vs) {
                alert('unable to create Vshader');
                return;
            }
            Global_1.gl.shaderSource(vs, vertexShaderSource);
            Global_1.gl.compileShader(vs);
            this.checkCompileErrors(vs, 'VERTEX');
            //片元着色器
            let fs = Global_1.gl.createShader(Global_1.gl.FRAGMENT_SHADER);
            if (!fs) {
                alert('unable to create Fshader');
                return;
            }
            Global_1.gl.shaderSource(fs, fragmentShaderSource);
            Global_1.gl.compileShader(fs);
            this.checkCompileErrors(fs, 'FRAGMENT');
            //链接着色器
            this._id = Global_1.gl.createProgram();
            Global_1.gl.attachShader(this._id, vs);
            Global_1.gl.attachShader(this._id, fs);
            Global_1.gl.linkProgram(this._id);
            this.checkCompileErrors(this._id, 'PROGRAM');
            Global_1.gl.deleteShader(vs);
            Global_1.gl.deleteShader(fs);
        }
        use() {
            Global_1.gl.useProgram(this._id);
        }
        getAttribLocation(name) {
            return Global_1.gl.getAttribLocation(this._id, name);
        }
        setInt(name, value) {
            Global_1.gl.uniform1i(Global_1.gl.getUniformLocation(this._id, name), value);
        }
        setFloat(name, value) {
            Global_1.gl.uniform1f(Global_1.gl.getUniformLocation(this._id, name), value);
        }
        checkCompileErrors(shader, type) {
            if (type !== 'PROGRAM') {
                let compiled = Global_1.gl.getShaderParameter(shader, Global_1.gl.COMPILE_STATUS);
                if (!compiled) {
                    let error = Global_1.gl.getShaderInfoLog(shader);
                    alert('Failed to compile shader: ' + error);
                    return;
                }
            }
            else {
                let linked = Global_1.gl.getProgramParameter(shader, Global_1.gl.LINK_STATUS);
                if (!linked) {
                    let error = Global_1.gl.getProgramInfoLog(shader);
                    alert('Failed to link program: ' + error);
                    Global_1.gl.deleteProgram(shader);
                    return;
                }
            }
        }
    }
    exports.Shader = Shader;
});
//# sourceMappingURL=Shader.js.map