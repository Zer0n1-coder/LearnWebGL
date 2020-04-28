import { gl,gles } from "./Global.js"
import { Shader } from "./Shader.js"
import { mat4, vec3, glMatrix } from "./gl-matrix/index.js"
import { Camera, CameraMovement } from "./Camera.js"
import { Model } from "./Model.js"

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

    let modelingShader = new Shader('./model_loading.vs', './model_loading.fs');
    let modeling = new Model('./nanosuit', 'nanosuit.obj', modelingShader);

    gl.enable(gl.DEPTH_TEST);
    
    function render() {
        let currentFrame = (new Date).getTime() / 1000;
        deltaTime = currentFrame - lastFrame;
        lastFrame = currentFrame;

        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        modelingShader.use();

        let projection = mat4.perspective(mat4.create(), glMatrix.toRadian(camera.Zoom), SCR_WIDTH / SCR_HEIGHT, 0.1, 100.0);
        let view = camera.GetViewMatrix();
        modelingShader.setMat4('projection', projection);
        modelingShader.setMat4('view', view);

        let model = mat4.create();
        mat4.translate(model, model, vec3.fromValues(0.0, -1.75, 0.0));
        mat4.scale(model, model, vec3.fromValues(0.2, 0.2, 0.2));
        modelingShader.setMat4('model', model);
        modeling.Draw();

        requestAnimationFrame(render);
    }

    render();
}