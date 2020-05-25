﻿import { gl, getTextFromLocation } from './Global'

export class Shader {
    constructor(vertexShaderPath: string, fragmentShaderPath: string) {
        //顶点着色器
        let vs = gl.createShader(gl.VERTEX_SHADER);
        if (!vs) {
            alert('unable to create Vshader');
            return;
        }
        gl.shaderSource(vs, getTextFromLocation(vertexShaderPath));
        gl.compileShader(vs);
        this.checkCompileErrors(vs, 'VERTEX');

        //片元着色器
        let fs = gl.createShader(gl.FRAGMENT_SHADER);
        if (!fs) {
            alert('unable to create Fshader');
            return;
        }
        gl.shaderSource(fs, getTextFromLocation(fragmentShaderPath));
        gl.compileShader(fs);
        this.checkCompileErrors(fs, 'FRAGMENT');

        //链接着色器
        let tmpProgram = gl.createProgram();
        if(!tmpProgram){
            alert("unable to create program!");
            return;
        }
        this._id = tmpProgram;

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

    setInt(name: string, value: number,useShdaer = false): void {
        if(useShdaer)
            this.use();

        gl.uniform1i(gl.getUniformLocation(this._id, name), value);
    }

    setBoolean(name: string, value: boolean,useShdaer = false): void {
        if(useShdaer)
            this.use();

        gl.uniform1i(gl.getUniformLocation(this._id, name), value?1:0);
    }

    setFloat(name: string, value: number,useShdaer = false): void {
        if(useShdaer)
            this.use();

        gl.uniform1f(gl.getUniformLocation(this._id, name), value);
    }

    setMat4(name: string, value: Float32List,useShdaer = false): void {
        if(useShdaer)
            this.use();

        gl.uniformMatrix4fv(gl.getUniformLocation(this._id, name),false, value);
    }

    setVec2(name:string, vec:number[],useShdaer = false){
        if(useShdaer)
            this.use();

        gl.uniform2fv(gl.getUniformLocation(this._id, name), vec);
    }

    setVec4(name:string, vec:number[],useShdaer = false){
        if(useShdaer)
            this.use();

        gl.uniform4fv(gl.getUniformLocation(this._id, name), vec);
    }

    setVec3(name: string, x: number, y: number, z: number) :void;
    setVec3(name: string, x: Float32Array):void;
    setVec3(name: string, x: number[]):void;
    setVec3(name: string, x: Float32Array | number | number[], y?: number, z?: number):void {
        if (typeof x === 'number' && typeof y === 'number' && typeof z === 'number')
            gl.uniform3fv(gl.getUniformLocation(this._id, name), [x, y, z]);
        else if(typeof x !== 'number')
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

    getID() {
        return this._id;
    }

    private _id!: WebGLProgram;
}