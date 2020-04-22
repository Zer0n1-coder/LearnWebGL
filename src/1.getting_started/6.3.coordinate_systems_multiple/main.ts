import { gl } from "./../../Global.js"
import { Shader } from "./Shader.js"
import { mat4, vec3, glMatrix } from "./gl-matrix/index.js"  //不清楚本地起服务之后ts无后缀导入方式没法定位文件的原因，所以采用.js后缀

export function main(): void {
    let ourShader = new Shader(document.getElementById('vs').textContent, document.getElementById('fs').textContent);

    let vertices = new Float32Array([
        -0.5, -0.5, -0.5, 0.0, 0.0,
        0.5, -0.5, -0.5, 1.0, 0.0,
        0.5, 0.5, -0.5, 1.0, 1.0,
        0.5, 0.5, -0.5, 1.0, 1.0,
        -0.5, 0.5, -0.5, 0.0, 1.0,
        -0.5, -0.5, -0.5, 0.0, 0.0,

        -0.5, -0.5, 0.5, 0.0, 0.0,
        0.5, -0.5, 0.5, 1.0, 0.0,
        0.5, 0.5, 0.5, 1.0, 1.0,
        0.5, 0.5, 0.5, 1.0, 1.0,
        -0.5, 0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.5, 0.0, 0.0,

        -0.5, 0.5, 0.5, 1.0, 0.0,
        -0.5, 0.5, -0.5, 1.0, 1.0,
        -0.5, -0.5, -0.5, 0.0, 1.0,
        -0.5, -0.5, -0.5, 0.0, 1.0,
        -0.5, -0.5, 0.5, 0.0, 0.0,
        -0.5, 0.5, 0.5, 1.0, 0.0,

        0.5, 0.5, 0.5, 1.0, 0.0,
        0.5, 0.5, -0.5, 1.0, 1.0,
        0.5, -0.5, -0.5, 0.0, 1.0,
        0.5, -0.5, -0.5, 0.0, 1.0,
        0.5, -0.5, 0.5, 0.0, 0.0,
        0.5, 0.5, 0.5, 1.0, 0.0,

        -0.5, -0.5, -0.5, 0.0, 1.0,
        0.5, -0.5, -0.5, 1.0, 1.0,
        0.5, -0.5, 0.5, 1.0, 0.0,
        0.5, -0.5, 0.5, 1.0, 0.0,
        -0.5, -0.5, 0.5, 0.0, 0.0,
        -0.5, -0.5, -0.5, 0.0, 1.0,

        -0.5, 0.5, -0.5, 0.0, 1.0,
        0.5, 0.5, -0.5, 1.0, 1.0,
        0.5, 0.5, 0.5, 1.0, 0.0,
        0.5, 0.5, 0.5, 1.0, 0.0,
        -0.5, 0.5, 0.5, 0.0, 0.0,
        -0.5, 0.5, -0.5, 0.0, 1.0
    ]);

    let cubePositions = [
        [ 0.0,  0.0,  0.0],
        [ 2.0,  5.0, - 15.0],
        [-1.5, -2.2, -2.5],
        [-3.8, -2.0, -12.3],
        [2.4, -0.4, -3.5],
        [-1.7, 3.0, -7.5],
        [1.3, -2.0, -2.5],
        [1.5, 2.0, -2.5],
        [1.5, 0.2, -1.5],
        [-1.3, 1.0, -1.5]
    ];
   
    let VBO = gl.createBuffer();
    if (!VBO) {
        alert('Failed to create the buffer object');
        return;
    }
    
    let gles = gl.getExtension('OES_vertex_array_object');
    let VAO = gles.createVertexArrayOES();
    if (!VAO) {
        alert('Failed to create the VAO');
        return;
    }

    gles.bindVertexArrayOES(VAO);

    gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    ourShader.use();   

    let aPos = ourShader.getAttribLocation('aPos');
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(aPos);
    
    let aTexCoord = ourShader.getAttribLocation('aTexCoord');
    gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(aTexCoord);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gles.bindVertexArrayOES(null);

    //纹理1
    let texture1 = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture1); 

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);	
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    
    let img1 = <HTMLImageElement>document.getElementById('container');
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img1);
    gl.generateMipmap(gl.TEXTURE_2D);

    //纹理2
    let texture2 = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture2);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    let img2 = <HTMLImageElement>document.getElementById('awesomeface');
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img2);
    gl.generateMipmap(gl.TEXTURE_2D);

    ourShader.setInt("texture1", 0);
    ourShader.setInt("texture2", 1);

    gl.enable(gl.DEPTH_TEST);

    function render() {
        gl.clearColor(0.2, 0.3, 0.3, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture1);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texture2);

        let view = mat4.create();
        let project = mat4.create();
        
        mat4.translate(view, view, vec3.fromValues(0.0, 0.0, -3.0));

        mat4.perspective(project,glMatrix.toRadian(45.0), 800 / 600, 0.1, 100);
        
        ourShader.setMat4('view', view);
        ourShader.setMat4('project', project);

        gles.bindVertexArrayOES(VAO);
        for (let i = 0; i < 10; i++){

            let model = mat4.create();
            mat4.translate(model, model, vec3.fromValues(cubePositions[i][0], cubePositions[i][1], cubePositions[i][2]));    

            let angle = 20.0 * i;
            mat4.rotate(model, model, glMatrix.toRadian(angle), vec3.fromValues(1.0, 0.3, 0.5));

            ourShader.setMat4("model", model);

            gl.drawArrays(gl.TRIANGLES, 0, 36);
        }  
        requestAnimationFrame(render);
    }

    render();
}