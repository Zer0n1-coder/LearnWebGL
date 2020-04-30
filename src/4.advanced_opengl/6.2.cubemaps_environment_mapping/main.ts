import { gl,gles } from "./Global.js"
import { Shader } from "./Shader.js"
import { mat4, vec3, glMatrix } from "./gl-matrix/index.js"
import { Camera, CameraMovement } from "./Camera.js"
import { TextureFromFile } from "./Model.js"

function loadCubemap() {
    let textureID = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, textureID);

    let img = <HTMLImageElement>document.getElementById('right');
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);

    img = <HTMLImageElement>document.getElementById('left');
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);

    img = <HTMLImageElement>document.getElementById('top');
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);

    img = <HTMLImageElement>document.getElementById('bottom');
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);

    img = <HTMLImageElement>document.getElementById('front');
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);

    img = <HTMLImageElement>document.getElementById('back');
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    //gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

    return textureID;
}

const SCR_WIDTH = (<HTMLCanvasElement>document.getElementById('webgl')).width;
const SCR_HEIGHT = (<HTMLCanvasElement>document.getElementById('webgl')).height;

let camera = new Camera(vec3.fromValues(0.0, 0.0, 3.0));
let lastX = SCR_WIDTH / 2.0;
let lastY = SCR_HEIGHT / 2.0;
let firstMouse = true;

let deltaTime = 0.0;	
let lastFrame = 0.0;

function keyDown(ev: KeyboardEvent) {
    
    if (ev.key === 'w') {
        camera.ProcessKeyboard(CameraMovement.FORWARD, deltaTime);
    }
    else if (ev.key === 's') {
        camera.ProcessKeyboard(CameraMovement.BACKWARD, deltaTime);
    }
    else if (ev.key === 'a') {
        camera.ProcessKeyboard(CameraMovement.LEFT, deltaTime);
    }
    else if (ev.key === 'd') {
        camera.ProcessKeyboard(CameraMovement.RIGHT, deltaTime);
    }
}

function scroll(ev: WheelEvent) {
    camera.ProcessMouseScroll(ev.deltaY / 100);  //网页滚轮变化幅度很大，所以除以一个系数100，用户可以自己尝试一个理想的系数值
}

function mouseMove(ev: MouseEvent) {
    if (firstMouse) {
        lastX = ev.clientX;
        lastY = ev.clientY;
        firstMouse = false;
    }

    let xoffset = ev.clientX - lastX;
    let yoffset = lastY - ev.clientY; 

    lastX = ev.clientX;
    lastY = ev.clientY;

    camera.ProcessMouseMovement(xoffset, yoffset);
}

let lightPos = vec3.fromValues(1.2, 1.0, 2.0);

export function main(): void {
    let canvas = <HTMLCanvasElement>document.getElementById('webgl');
    canvas.addEventListener("keydown", keyDown);
    canvas.addEventListener("wheel", scroll);
    canvas.addEventListener("mousemove", mouseMove);

    canvas.setAttribute('tabindex', '0'); // 让canvas获取焦点从而响应事件
    canvas.addEventListener('click', function () {
        canvas.focus();
    });

    gl.enable(gl.DEPTH_TEST);

    let shader = new Shader('./cubemaps.vs', './cubemaps.fs');
    let skyboxShader = new Shader('./skybox.vs', './skybox.fs');

    let cubeVertices = new Float32Array( [
        -0.5, -0.5, -0.5, 0.0, 0.0, -1.0,
        0.5, -0.5, -0.5, 0.0, 0.0, -1.0,
        0.5, 0.5, -0.5, 0.0, 0.0, -1.0,
        0.5, 0.5, -0.5, 0.0, 0.0, -1.0,
        -0.5, 0.5, -0.5, 0.0, 0.0, -1.0,
        -0.5, -0.5, -0.5, 0.0, 0.0, -1.0,

        -0.5, -0.5, 0.5, 0.0, 0.0, 1.0,
        0.5, -0.5, 0.5, 0.0, 0.0, 1.0,
        0.5, 0.5, 0.5, 0.0, 0.0, 1.0,
        0.5, 0.5, 0.5, 0.0, 0.0, 1.0,
        -0.5, 0.5, 0.5, 0.0, 0.0, 1.0,
        -0.5, -0.5, 0.5, 0.0, 0.0, 1.0,

        -0.5, 0.5, 0.5, -1.0, 0.0, 0.0,
        -0.5, 0.5, -0.5, -1.0, 0.0, 0.0,
        -0.5, -0.5, -0.5, -1.0, 0.0, 0.0,
        -0.5, -0.5, -0.5, -1.0, 0.0, 0.0,
        -0.5, -0.5, 0.5, -1.0, 0.0, 0.0,
        -0.5, 0.5, 0.5, -1.0, 0.0, 0.0,

        0.5, 0.5, 0.5, 1.0, 0.0, 0.0,
        0.5, 0.5, -0.5, 1.0, 0.0, 0.0,
        0.5, -0.5, -0.5, 1.0, 0.0, 0.0,
        0.5, -0.5, -0.5, 1.0, 0.0, 0.0,
        0.5, -0.5, 0.5, 1.0, 0.0, 0.0,
        0.5, 0.5, 0.5, 1.0, 0.0, 0.0,

        -0.5, -0.5, -0.5, 0.0, -1.0, 0.0,
        0.5, -0.5, -0.5, 0.0, -1.0, 0.0,
        0.5, -0.5, 0.5, 0.0, -1.0, 0.0,
        0.5, -0.5, 0.5, 0.0, -1.0, 0.0,
        -0.5, -0.5, 0.5, 0.0, -1.0, 0.0,
        -0.5, -0.5, -0.5, 0.0, -1.0, 0.0,

        -0.5, 0.5, -0.5, 0.0, 1.0, 0.0,
        0.5, 0.5, -0.5, 0.0, 1.0, 0.0,
        0.5, 0.5, 0.5, 0.0, 1.0, 0.0,
        0.5, 0.5, 0.5, 0.0, 1.0, 0.0,
        -0.5, 0.5, 0.5, 0.0, 1.0, 0.0,
        -0.5, 0.5, -0.5, 0.0, 1.0, 0.0]);

    let skyboxVertices = new Float32Array([
        -1.0, 1.0, -1.0,
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        -1.0, 1.0, -1.0,

        -1.0, -1.0, 1.0,
        -1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        -1.0, -1.0, 1.0,

        1.0, -1.0, -1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, -1.0,
        1.0, -1.0, -1.0,

        -1.0, -1.0, 1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0,

        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0,

        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0]);

    let cubeVBO = gl.createBuffer();
    let cubeVAO = gles.createVertexArrayOES();
    gles.bindVertexArrayOES(cubeVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVBO);
    gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW);

    shader.use();
    let aPos = shader.getAttribLocation('aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
    let aNormal = shader.getAttribLocation('aNormal');
    gl.enableVertexAttribArray(aNormal);
    gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    gles.bindVertexArrayOES(null);

    let skyVBO = gl.createBuffer();
    let skyVAO = gles.createVertexArrayOES();
    gles.bindVertexArrayOES(skyVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, skyVBO);
    gl.bufferData(gl.ARRAY_BUFFER, skyboxVertices, gl.STATIC_DRAW);

    skyboxShader.use()
    aPos = skyboxShader.getAttribLocation('aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    gles.bindVertexArrayOES(null);
    
    let cubemapTexture = loadCubemap();

    shader.use();
    shader.setInt('skybox', 0);

    skyboxShader.use();
    skyboxShader.setInt('skybox', 0);

    function render() {
        let currentFrame = (new Date).getTime() / 1000;
        deltaTime = currentFrame - lastFrame;
        lastFrame = currentFrame;

        gl.enable(gl.DEPTH_TEST);

        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        shader.use();
        let model = mat4.create();
        let view = camera.GetViewMatrix();
        let projection = mat4.perspective(mat4.create(), glMatrix.toRadian(camera.Zoom), SCR_WIDTH / SCR_HEIGHT, 0.1, 100.0);
        shader.setMat4('model', model);
        shader.setMat4('view', view);
        shader.setMat4('projection', projection);

        let changeMat = mat4.create();
        mat4.multiply(changeMat, view, model);
        mat4.invert(changeMat, changeMat);
        mat4.transpose(changeMat, changeMat);
        shader.setMat4("changeMat", changeMat);

        gles.bindVertexArrayOES(cubeVAO);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemapTexture);
        model = mat4.translate(model, model, vec3.fromValues(-1.0, 0.0, -1.0));
        shader.setMat4('model', model);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
        gles.bindVertexArrayOES(null);

        gl.depthFunc(gl.LEQUAL);
        skyboxShader.use();
        view = camera.GetViewMatrix();
        view[3] = 0.0;
        view[7] = 0.0;
        view[11] = 0.0;
        view[12] = 0.0;
        view[13] = 0.0;
        view[14] = 0.0;
        view[15] = 1.0;
        skyboxShader.setMat4('view', view);
        skyboxShader.setMat4('projection', projection);

        gles.bindVertexArrayOES(skyVAO);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemapTexture);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
        gles.bindVertexArrayOES(null);
        gl.depthFunc(gl.LESS);

        requestAnimationFrame(render);
    }

    render();
}
