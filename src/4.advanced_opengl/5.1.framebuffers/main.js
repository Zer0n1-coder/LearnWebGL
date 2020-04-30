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
    let shader = new Shader('./framebuffers.vs', './framebuffers.fs');
    let screenShader = new Shader('./framebuffers_screen.vs', './framebuffers_screen.fs');
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
    let planeVertices = new Float32Array([
        5.0, -0.5, 5.0, 2.0, 0.0,
        -5.0, -0.5, 5.0, 0.0, 0.0,
        -5.0, -0.5, -5.0, 0.0, 2.0,
        5.0, -0.5, 5.0, 2.0, 0.0,
        -5.0, -0.5, -5.0, 0.0, 2.0,
        5.0, -0.5, -5.0, 2.0, 2.0
    ]);
    let quadVertices = new Float32Array([
        -1.0, 1.0, 0.0, 1.0,
        -1.0, -1.0, 0.0, 0.0,
        1.0, -1.0, 1.0, 0.0,
        -1.0, 1.0, 0.0, 1.0,
        1.0, -1.0, 1.0, 0.0,
        1.0, 1.0, 1.0, 1.0
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
    let quadVBO = gl.createBuffer();
    let quadVAO = gles.createVertexArrayOES();
    gles.bindVertexArrayOES(quadVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, quadVBO);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);
    screenShader.use();
    aPos = screenShader.getAttribLocation('aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 0);
    aTexCoords = screenShader.getAttribLocation('aTexCoords');
    gl.enableVertexAttribArray(aTexCoords);
    gl.vertexAttribPointer(aTexCoords, 2, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
    gles.bindVertexArrayOES(null);
    let cubeTexture = TextureFromFile('container.jpg', '.');
    let floorTexture = TextureFromFile('metal.png', '.');
    shader.use();
    shader.setInt('texture1', 0);
    screenShader.use();
    screenShader.setInt('screenTexture', 0);
    let framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    let textureColorbuffer = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textureColorbuffer);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, SCR_WIDTH, SCR_HEIGHT, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //需要添加这两句话，教程原参考答案没有这两句在这里没法显示出图像
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textureColorbuffer, 0);
    let rbo = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, rbo);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, SCR_WIDTH, SCR_HEIGHT);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, rbo);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
        alert('ERROR::FRAMEBUFFER:: Framebuffer is not complete!');
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    function render() {
        let currentFrame = (new Date).getTime() / 1000;
        deltaTime = currentFrame - lastFrame;
        lastFrame = currentFrame;
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.enable(gl.DEPTH_TEST);
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
        gles.bindVertexArrayOES(null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.disable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT);
        screenShader.use();
        gles.bindVertexArrayOES(quadVAO);
        gl.bindTexture(gl.TEXTURE_2D, textureColorbuffer);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(render);
    }
    render();
}
//# sourceMappingURL=main.js.map