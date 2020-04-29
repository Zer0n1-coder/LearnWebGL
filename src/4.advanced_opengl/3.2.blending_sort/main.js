import { gl, gles } from "./Global.js";
import { Shader } from "./Shader.js";
import { mat4, vec3, glMatrix } from "./gl-matrix/index.js";
import { Camera, CameraMovement } from "./Camera.js";
import { TextureFromFile } from "./Model.js";
const SCR_WIDTH = document.getElementById('webgl').width;
const SCR_HEIGHT = document.getElementById('webgl').height;
let camera = new Camera(vec3.fromValues(0.0, 0.0, 3.0));
let lastX = SCR_WIDTH / 2.0;
let lastY = SCR_HEIGHT / 2.0;
let firstMouse = true;
let deltaTime = 0.0;
let lastFrame = 0.0;
function keyDown(ev) {
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
function scroll(ev) {
    camera.ProcessMouseScroll(ev.deltaY / 100); //网页滚轮变化幅度很大，所以除以一个系数100，用户可以自己尝试一个理想的系数值
}
function mouseMove(ev) {
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
export function main() {
    let canvas = document.getElementById('webgl');
    canvas.addEventListener("keydown", keyDown);
    canvas.addEventListener("wheel", scroll);
    canvas.addEventListener("mousemove", mouseMove);
    canvas.setAttribute('tabindex', '0'); // 让canvas获取焦点从而响应事件
    canvas.addEventListener('click', function () {
        canvas.focus();
    });
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    let shader = new Shader('./blending.vs', './blending.fs');
    let cubeVertices = new Float32Array([
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
        -0.5, 0., 0.5, 1.0, 0.0,
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
    let planeVertices = new Float32Array([
        5.0, -0.5, 5.0, 2.0, 0.0,
        -5.0, -0.5, 5.0, 0.0, 0.0,
        -5.0, -0.5, -5.0, 0.0, 2.0,
        5.0, -0.5, 5.0, 2.0, 0.0,
        -5.0, -0.5, -5.0, 0.0, 2.0,
        5.0, -0.5, -5.0, 2.0, 2.0
    ]);
    let transparentVertices = new Float32Array([
        0.0, 0.5, 0.0, 0.0, 0.0,
        0.0, -0.5, 0.0, 0.0, 1.0,
        1.0, -0.5, 0.0, 1.0, 1.0,
        0.0, 0.5, 0.0, 0.0, 0.0,
        1.0, -0.5, 0.0, 1.0, 1.0,
        1.0, 0.5, 0.0, 1.0, 0.0
    ]);
    let cubeVBO = gl.createBuffer();
    let cubeVAO = gles.createVertexArrayOES();
    gles.bindVertexArrayOES(cubeVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVBO);
    gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW);
    shader.use();
    let aPos = shader.getAttribLocation('aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
    let aTexCoords = shader.getAttribLocation('aTexCoords');
    gl.enableVertexAttribArray(aTexCoords);
    gl.vertexAttribPointer(aTexCoords, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    gles.bindVertexArrayOES(null);
    let planeVBO = gl.createBuffer();
    let planeVAO = gles.createVertexArrayOES();
    gles.bindVertexArrayOES(planeVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, planeVBO);
    gl.bufferData(gl.ARRAY_BUFFER, planeVertices, gl.STATIC_DRAW);
    aPos = shader.getAttribLocation('aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
    aTexCoords = shader.getAttribLocation('aTexCoords');
    gl.enableVertexAttribArray(aTexCoords);
    gl.vertexAttribPointer(aTexCoords, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    gles.bindVertexArrayOES(null);
    let transparentVBO = gl.createBuffer();
    let transparentVAO = gles.createVertexArrayOES();
    gles.bindVertexArrayOES(transparentVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, transparentVBO);
    gl.bufferData(gl.ARRAY_BUFFER, transparentVertices, gl.STATIC_DRAW);
    aPos = shader.getAttribLocation('aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
    aTexCoords = shader.getAttribLocation('aTexCoords');
    gl.enableVertexAttribArray(aTexCoords);
    gl.vertexAttribPointer(aTexCoords, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    gles.bindVertexArrayOES(null);
    let cubeTexture = TextureFromFile('marble.jpg', '.');
    let floorTexture = TextureFromFile('metal.png', '.');
    let transparentTexture = TextureFromFile('window.png', '.');
    let windows = [
        [-1.5, 0.0, -0.48],
        [1.5, 0.0, 0.51],
        [0.0, 0.0, 0.7],
        [-0.3, 0.0, -2.3],
        [0.5, 0.0, -0.6]
    ];
    shader.setInt('texture1', 0);
    function sortDistance(a, b) {
        let aDis = vec3.length(vec3.fromValues(camera.Position[0] - a[0], camera.Position[1] - a[1], camera.Position[2] - a[2]));
        let bDis = vec3.length(vec3.fromValues(camera.Position[0] - b[0], camera.Position[1] - b[1], camera.Position[2] - b[2]));
        return bDis - aDis;
    }
    function render() {
        let currentFrame = (new Date).getTime() / 1000;
        deltaTime = currentFrame - lastFrame;
        lastFrame = currentFrame;
        windows.sort(sortDistance);
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        shader.use();
        let model = mat4.create();
        let view = camera.GetViewMatrix();
        let projection = mat4.perspective(mat4.create(), glMatrix.toRadian(camera.Zoom), SCR_WIDTH / SCR_HEIGHT, 0.1, 100.0);
        shader.setMat4('view', view);
        shader.setMat4('projection', projection);
        gles.bindVertexArrayOES(cubeVAO);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, cubeTexture);
        model = mat4.translate(model, model, vec3.fromValues(-1.0, 0.0, -1.0));
        shader.setMat4('model', model);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
        model = mat4.create();
        model = mat4.translate(model, model, vec3.fromValues(2.0, 0.0, 0.0));
        shader.setMat4('model', model);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
        gles.bindVertexArrayOES(planeVAO);
        gl.bindTexture(gl.TEXTURE_2D, floorTexture);
        shader.setMat4('model', mat4.create());
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gles.bindVertexArrayOES(transparentVAO);
        gl.bindTexture(gl.TEXTURE_2D, transparentTexture);
        for (let value of windows) {
            model = mat4.create();
            mat4.translate(model, model, value);
            shader.setMat4('model', model);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
        requestAnimationFrame(render);
    }
    render();
}
//# sourceMappingURL=main.js.map