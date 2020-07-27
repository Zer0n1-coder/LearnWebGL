import { gl, loadTexture,SCR_WIDTH,SCR_HEIGHT } from "./Global"
import { Shader } from "./Shader"
import { mat4, vec3, glMatrix } from "./gl-matrix-ts/index"
import { Camera, CameraMovement } from "./Camera"

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

    let shader = new Shader("./anti_aliasing.vs","./anti_aliasing.fs");

    let cubeVertices = new Float32Array([
        -0.5, -0.5, -0.5,
         0.5, -0.5, -0.5,
         0.5,  0.5, -0.5,
         0.5,  0.5, -0.5,
        -0.5,  0.5, -0.5,
        -0.5, -0.5, -0.5,

        -0.5, -0.5,  0.5,
         0.5, -0.5,  0.5,
         0.5,  0.5,  0.5,
         0.5,  0.5,  0.5,
        -0.5,  0.5,  0.5,
        -0.5, -0.5,  0.5,

        -0.5,  0.5,  0.5,
        -0.5,  0.5, -0.5,
        -0.5, -0.5, -0.5,
        -0.5, -0.5, -0.5,
        -0.5, -0.5,  0.5,
        -0.5,  0.5,  0.5,

         0.5,  0.5,  0.5,
         0.5,  0.5, -0.5,
         0.5, -0.5, -0.5,
         0.5, -0.5, -0.5,
         0.5, -0.5,  0.5,
         0.5,  0.5,  0.5,

        -0.5, -0.5, -0.5,
         0.5, -0.5, -0.5,
         0.5, -0.5,  0.5,
         0.5, -0.5,  0.5,
        -0.5, -0.5,  0.5,
        -0.5, -0.5, -0.5,

        -0.5,  0.5, -0.5,
         0.5,  0.5, -0.5,
         0.5,  0.5,  0.5,
         0.5,  0.5,  0.5,
        -0.5,  0.5,  0.5,
        -0.5,  0.5, -0.5
    ]);

    let cubeVAO = <WebGLVertexArrayObject>gl.createVertexArray();
    let cubeVBO = <WebGLBuffer>gl.createBuffer();
    
    gl.bindVertexArray(cubeVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER,cubeVBO);
    gl.bufferData(gl.ARRAY_BUFFER,cubeVertices,gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0,3,gl.FLOAT,false,3*Float32Array.BYTES_PER_ELEMENT,0);

    function render() {
        let currentFrame = (new Date).getTime() / 1000;
        deltaTime = currentFrame - lastFrame;
        lastFrame = currentFrame;

        gl.clearColor(0.1,0.1,0.1,1.0);
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

        shader.use();
        let projection = mat4.perspective(mat4.create(),glMatrix.toRadian(camera.Zoom),SCR_WIDTH/SCR_HEIGHT,0.1,1000);
        shader.setMat4("projection",projection);
        shader.setMat4("view",camera.GetViewMatrix());
        shader.setMat4("model",mat4.create());

        gl.bindVertexArray(cubeVAO);
        gl.drawArrays(gl.TRIANGLES,0,36);

        requestAnimationFrame(render);
    }

    render();
}