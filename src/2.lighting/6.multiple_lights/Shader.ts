import { gl } from './Global.js'

export class Shader {
    constructor(vertexShaderSource: string, fragmentShaderSource: string) {
        //顶点着色器
        let vs = gl.createShader(gl.VERTEX_SHADER);
        if (!vs) {
            alert('unable to create Vshader');
            return;
        }
        gl.shaderSource(vs, vertexShaderSource);
        gl.compileShader(vs);
        this.checkCompileErrors(vs, 'VERTEX');

        //片元着色器
        let fs = gl.createShader(gl.FRAGMENT_SHADER);
        if (!fs) {
            alert('unable to create Fshader');
            return;
        }
        gl.shaderSource(fs, fragmentShaderSource);
        gl.compileShader(fs);
        this.checkCompileErrors(fs, 'FRAGMENT');

        //链接着色器
        this._id = gl.createProgram();
        gl.attachShader(this._id, vs);
        gl.attachShader(this._id, fs);
        gl.linkProgram(this._id);
        this.checkCompileErrors(this._id, 'PROGRAM');
        
        gl.deleteShader(vs);
        gl.deleteShader(fs);
    }

    use(): void {
        gl.useProgram(this._id);
    }

    getAttribLocation(name: string): number {
        return gl.getAttribLocation(this._id, name);
    }

    setInt(name: string, value: number): void {
        gl.uniform1i(gl.getUniformLocation(this._id, name), value);
    }

    setFloat(name: string, value: number): void {
        gl.uniform1f(gl.getUniformLocation(this._id, name), value);
    }

    setMat4(name: string, value: Float32List): void {
        gl.uniformMatrix4fv(gl.getUniformLocation(this._id, name),false, value);
    }

    setVec3(name: string, x: number, y: number, z: number);
    setVec3(name: string, x: Float32Array);
    setVec3(name: string, x: number[]);
    setVec3(name: string, x: Float32Array | number | number[], y?: number, z?: number) {
        if (typeof x === 'number')
            gl.uniform3fv(gl.getUniformLocation(this._id, name), [x, y, z]);
        else
            gl.uniform3fv(gl.getUniformLocation(this._id, name), x);
    }
    
    private checkCompileErrors(shader: WebGLShader, type: string): void {
        if (type !== 'PROGRAM') {
            let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (!compiled) {
                let error = gl.getShaderInfoLog(shader);
                alert('Failed to compile shader: ' + error);
                return;
            }
        }
        else {
            let linked = gl.getProgramParameter(shader, gl.LINK_STATUS);
            if (!linked) {
                let error = gl.getProgramInfoLog(shader);
                alert('Failed to link program: ' + error);
                gl.deleteProgram(shader);
                return;
            }
        }
    }

    private _id: WebGLProgram;
}