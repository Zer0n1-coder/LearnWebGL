import { gl } from "./../../Global.js";
import { Shader } from "./Shader.js";
import { mat4, vec3, glMatrix } from "./gl-matrix/index.js";
import { Camera, CameraMovement } from "./Camera.js";
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
    let lightingShader = new Shader(document.getElementById('colorsVs').textContent, document.getElementById('colorsFs').textContent);
    let lampShader = new Shader(document.getElementById('lampVs').textContent, document.getElementById('lampFs').textContent);
    let vertices = new Float32Array([
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5, 0.5, -0.5,
        0.5, 0.5, -0.5,
        -0.5, 0.5, -0.5,
        -0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        -0.5, 0.5, 0.5,
        -0.5, -0.5, 0.5,
        -0.5, 0.5, 0.5,
        -0.5, 0.5, -0.5,
        -0.5, -0.5, -0.5,
        -0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5,
        -0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, 0.5,
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        -0.5, -0.5, 0.5,
        -0.5, -0.5, -0.5,
        -0.5, 0.5, -0.5,
        0.5, 0.5, -0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        -0.5, 0.5, 0.5,
        -0.5, 0.5, -0.5,
    ]);
    let VBO = gl.createBuffer();
    if (!VBO) {
        alert('Failed to create the buffer object');
        return;
    }
    let gles = gl.getExtension('OES_vertex_array_object');
    let cubeVAO = gles.createVertexArrayOES();
    if (!cubeVAO) {
        alert('Failed to create the VAO');
        return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gles.bindVertexArrayOES(cubeVAO);
    lampShader.use();
    let aPos = lampShader.getAttribLocation('aPos');
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(aPos);
    let lightVAO = gles.createVertexArrayOES();
    if (!lightVAO) {
        alert('Failed to create the VAO');
        return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
    gles.bindVertexArrayOES(lightVAO);
    lightingShader.use();
    aPos = lightingShader.getAttribLocation('aPos');
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(aPos);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gles.bindVertexArrayOES(null);
    gl.enable(gl.DEPTH_TEST);
    function render() {
        let currentFrame = (new Date).getTime() / 1000;
        deltaTime = currentFrame - lastFrame;
        lastFrame = currentFrame;
        gl.clearColor(0.2, 0.3, 0.3, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        lightingShader.use();
        lightingShader.setVec3("objectColor", 1.0, 0.5, 0.31);
        lightingShader.setVec3("lightColor", 1.0, 1.0, 1.0);
        let projection = mat4.perspective(mat4.create(), glMatrix.toRadian(camera.Zoom), SCR_WIDTH / SCR_HEIGHT, 0.1, 100.0);
        let view = camera.GetViewMatrix();
        lightingShader.setMat4("projection", projection);
        lightingShader.setMat4("view", view);
        let model = mat4.create();
        lightingShader.setMat4("model", model);
        gles.bindVertexArrayOES(cubeVAO);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
        lampShader.use();
        lampShader.setMat4("projection", projection);
        lampShader.setMat4("view", view);
        model = mat4.create();
        model = mat4.translate(model, model, lightPos);
        model = mat4.scale(model, model, vec3.fromValues(0.2, 0.2, 0.2));
        lampShader.setMat4("model", model);
        gles.bindVertexArrayOES(lightVAO);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
        requestAnimationFrame(render);
    }
    render();
}
//# sourceMappingURL=main.js.map