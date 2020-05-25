import { gl } from "./Global";
import { Game } from "./Game";
const SCR_WIDTH = document.getElementById('webgl').width;
const SCR_HEIGHT = document.getElementById('webgl').height;
let lastX = SCR_WIDTH / 2.0;
let lastY = SCR_HEIGHT / 2.0;
let firstMouse = true;
let deltaTime = 0.0;
let lastFrame = 0.0;
let breakout = new Game(SCR_WIDTH, SCR_HEIGHT);
function keyDown(ev) {
    //if (ev.key === 'w') {
    //    camera.ProcessKeyboard(CameraMovement.FORWARD, deltaTime);
    //}
    //else if (ev.key === 's') {
    //    camera.ProcessKeyboard(CameraMovement.BACKWARD, deltaTime);
    //}
    //else if (ev.key === 'a') {
    //    camera.ProcessKeyboard(CameraMovement.LEFT, deltaTime);
    //}
    //else if (ev.key === 'd') {
    //    camera.ProcessKeyboard(CameraMovement.RIGHT, deltaTime);
    //}
    if (ev.keyCode >= 0 && ev.keyCode < 1024) {
        breakout.keys[ev.keyCode] = true;
    }
}
function keyUp(ev) {
    if (ev.keyCode >= 0 && ev.keyCode < 1024) {
        breakout.keys[ev.keyCode] = false;
    }
}
function scroll(ev) {
    //camera.ProcessMouseScroll(ev.deltaY / 100);  //网页滚轮变化幅度很大，所以除以一个系数100，用户可以自己尝试一个理想的系数值
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
    //camera.ProcessMouseMovement(xoffset, yoffset);
}
export function main() {
    let canvas = document.getElementById('webgl');
    canvas.addEventListener("keydown", keyDown);
    canvas.addEventListener("keyup", keyUp);
    canvas.setAttribute('tabindex', '0'); // 让canvas获取焦点从而响应事件
    canvas.addEventListener('click', function () {
        canvas.focus();
    });
    gl.viewport(0, 0, SCR_WIDTH, SCR_HEIGHT);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_CONSTANT_ALPHA);
    breakout.init();
    function render() {
        let currentFrame = (new Date).getTime() / 1000;
        deltaTime = currentFrame - lastFrame;
        lastFrame = currentFrame;
        breakout.processInput(deltaTime);
        breakout.update(deltaTime);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        breakout.render(currentFrame);
        requestAnimationFrame(render);
    }
    render();
}
