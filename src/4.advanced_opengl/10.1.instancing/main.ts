import {gl} from "./Global";
import { Shader } from "./Shader";

export function main(){
    gl.enable(gl.DEPTH_TEST);
    
    let shader = new Shader("./instancingVs.glsl","./instancingFs.glsl");
    let offset = new Float32Array(200);
    let index = 0;
    let bOffset = 0.1;
    for(let y = -10;y < 10;y+=2){
        for(let x = -10;x<10;x+=2){
            offset[index++] = x / 10 + bOffset;
            offset[index++] = y / 10 + bOffset;
        }
    }

    let instanceVBO = gl.createBuffer();
    if(!instanceVBO){
        alert("creating instanceVBO is failed!");
        return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER,instanceVBO);
    gl.bufferData(gl.ARRAY_BUFFER,offset,gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER,null);

    let quadVertices = new Float32Array([
        -0.05,  0.05,  1.0, 0.0, 0.0,
         0.05, -0.05,  0.0, 1.0, 0.0,
        -0.05, -0.05,  0.0, 0.0, 1.0,

        -0.05,  0.05,  1.0, 0.0, 0.0,
         0.05, -0.05,  0.0, 1.0, 0.0,
         0.05,  0.05,  0.0, 1.0, 1.0
    ]);

    let quadVAO = gl.createVertexArray();
    if(!quadVAO){
        alert("creating quadVAO is failed!");
        return;
    }
    let quadVBO = gl.createBuffer();
    if(!quadVBO){
        alert("creating quadVBO is failed!");
        return;
    }
    gl.bindVertexArray(quadVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER,quadVBO);
    gl.bufferData(gl.ARRAY_BUFFER,quadVertices,gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0,2,gl.FLOAT,false,5*Float32Array.BYTES_PER_ELEMENT,0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1,3,gl.FLOAT,false,5*Float32Array.BYTES_PER_ELEMENT,2*Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(2);
    gl.bindBuffer(gl.ARRAY_BUFFER,instanceVBO);
    gl.vertexAttribPointer(2,2,gl.FLOAT,false,2*Float32Array.BYTES_PER_ELEMENT,0);
    gl.bindBuffer(gl.ARRAY_BUFFER,null);
    gl.vertexAttribDivisor(2,1);

    gl.clearColor(0.1,0.1,0.1,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

    shader.use();
    gl.bindVertexArray(quadVAO);
    gl.drawArraysInstanced(gl.TRIANGLES,0,6,100);
    gl.bindVertexArray(null);
}