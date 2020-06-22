import { gl, SCR_WIDTH, SCR_HEIGHT, clamp } from "./Global";
import { Shader } from "./Shader";
import { mat4, vec3, glMatrix } from "./gl-matrix-ts/index";
import { Camera, CameraMovement } from "./Camera";
let camera = new Camera(vec3.fromValues(0.0, 0.0, 3.0));
let lastX = SCR_WIDTH / 2.0;
let lastY = SCR_HEIGHT / 2.0;
let firstMouse = true;
let deltaTime = 0.0;
let lastFrame = 0.0;
//let shadows = true;
let planeVAO;
let woodTexture;
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
let sphereVAO;
let indexCount;
function renderSphere() {
    if (sphereVAO === undefined) {
        sphereVAO = gl.createVertexArray();
        let vbo = gl.createBuffer();
        let ebo = gl.createBuffer();
        let positions = new Array();
        let uv = new Array();
        let normals = new Array();
        let indices = new Array();
        const X_SEGMENTS = 64;
        const Y_SEGMENTS = 64;
        const PI = 3.14159265359;
        for (let y = 0; y <= Y_SEGMENTS; ++y) {
            for (let x = 0; x <= X_SEGMENTS; ++x) {
                let xSegment = x / X_SEGMENTS;
                let ySegment = y / Y_SEGMENTS;
                let xPos = Math.cos(xSegment * 2 * PI) * Math.sin(ySegment * PI);
                let yPos = Math.cos(ySegment * PI);
                let zPos = Math.sin(xSegment * 2 * PI) * Math.sin(ySegment * PI);
                positions.push([xPos, yPos, zPos]);
                uv.push([xSegment, ySegment]);
                normals.push([xPos, yPos, zPos]);
            }
        }
        let oddRow = false;
        for (let y = 0; y < Y_SEGMENTS; ++y) {
            if (!oddRow) {
                for (let x = 0; x < X_SEGMENTS; ++x) {
                    indices.push(y * (X_SEGMENTS + 1) + x);
                    indices.push((y + 1) * (X_SEGMENTS + 1) + x);
                }
            }
            else {
                for (let x = X_SEGMENTS; x >= 0; --x) {
                    indices.push((y + 1) * (X_SEGMENTS + 1) + x);
                    indices.push(y * (X_SEGMENTS + 1) + x);
                }
            }
            oddRow = !oddRow;
        }
        indexCount = indices.length;
        let data = new Array();
        for (let i = 0; i < positions.length; ++i) {
            data.push(positions[i][0]);
            data.push(positions[i][1]);
            data.push(positions[i][2]);
            if (uv.length > 0) {
                data.push(uv[i][0]);
                data.push(uv[i][1]);
            }
            if (normals.length > 0) {
                data.push(normals[i][0]);
                data.push(normals[i][1]);
                data.push(normals[i][2]);
            }
        }
        gl.bindVertexArray(sphereVAO);
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        let stride = (3 + 2 + 3) * Float32Array.BYTES_PER_ELEMENT;
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, stride, 0);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, stride, 3 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(2, 3, gl.FLOAT, false, stride, 5 * Float32Array.BYTES_PER_ELEMENT);
    }
    gl.bindVertexArray(sphereVAO);
    gl.drawElements(gl.TRIANGLE_STRIP, indexCount, gl.UNSIGNED_SHORT, 0);
}
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
    let shader = new Shader("./pbr_vs.glsl", "./pbr_fs.glsl");
    shader.use();
    shader.setVec3("albedo", 0.5, 0, 0);
    shader.setFloat("ao", 1);
    let lightPositions = [
        [-10.0, 10.0, 10.0],
        [10.0, 10.0, 10.0],
        [-10.0, -10.0, 10.0],
        [10.0, -10.0, 10.0],
    ];
    let lightColors = [
        [300.0, 300.0, 300.0],
        [300.0, 300.0, 300.0],
        [300.0, 300.0, 300.0],
        [300.0, 300.0, 300.0]
    ];
    let nrRows = 7;
    let nrColumns = 7;
    let spacing = 2.5;
    let projection = mat4.perspective(mat4.create(), glMatrix.toRadian(camera.Zoom), SCR_WIDTH / SCR_HEIGHT, 0.1, 100);
    shader.setMat4("projection", projection);
    function render() {
        let currentFrame = (new Date).getTime() / 1000;
        deltaTime = currentFrame - lastFrame;
        lastFrame = currentFrame;
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        shader.use();
        let view = camera.GetViewMatrix();
        shader.setMat4("view", view);
        shader.setVec3("camPos", camera.Position);
        let model = mat4.create();
        for (let row = 0; row < nrRows; ++row) {
            shader.setFloat("metallic", row / nrRows);
            for (let col = 0; col < nrColumns; ++col) {
                shader.setFloat("roughness", clamp(col / nrColumns, 0.05, 1));
                model = mat4.create();
                mat4.translate(model, model, [(col - (nrColumns / 2)) * spacing, (row - (nrRows / 2)) * spacing, 0]);
                shader.setMat4("model", model);
                renderSphere();
            }
        }
        for (let i = 0; i < lightPositions.length; ++i) {
            let newPos = vec3.create();
            vec3.add(newPos, lightPositions[i], [Math.sin(currentFrame * 5) * 5, 0, 0]);
            //newPos = lightPositions[i];
            shader.setVec3("lightPositions[" + i.toString() + "]", newPos);
            shader.setVec3("lightColors[" + i.toString() + "]", lightColors[i]);
            model = mat4.create();
            mat4.translate(model, model, newPos);
            mat4.scale(model, model, [0.5, 0.5, 0.5]);
            shader.setMat4("model", model);
            renderSphere();
        }
        requestAnimationFrame(render);
    }
    render();
}
async function hello(what) {
    return "ref";
}
