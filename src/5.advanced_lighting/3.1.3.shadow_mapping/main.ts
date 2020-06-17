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

//let shadows = true;

let planeVAO:WebGLVertexArrayObject;
let woodTexture:WebGLTexture;

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

function RenderScene(shader:Shader){
    let model = mat4.create();
    shader.setMat4("model",model);
    gl.bindVertexArray(planeVAO);
    gl.drawArrays(gl.TRIANGLES,0,6);
    gl.bindVertexArray(null);

    model = mat4.create();
    mat4.translate(model,model,[0,1.5,0]);
    shader.setMat4("model",model);
    RenderCube();

    model = mat4.create();
    mat4.translate(model,model,[2,0,1]);
    shader.setMat4("model",model);
    RenderCube();

    model = mat4.create();
    mat4.translate(model,model,[-1,0,2]);
    mat4.rotate(model,model,glMatrix.toRadian(60),vec3.normalize([0,0,0],[1,0,1]));
    mat4.scale(model,model,[0.5,0.5,0.5]);
    shader.setMat4("model",model);
    RenderCube();
}

let quadVAO : WebGLVertexArrayObject;
let quadVBO : WebGLBuffer;
function RenderQuad(){
    if(quadVAO === undefined){
        let quadVertices = new Float32Array([
            -1.0,  1.0, 0.0,  0.0, 1.0,
            -1.0, -1.0, 0.0,  0.0, 0.0,
             1.0,  1.0, 0.0,  1.0, 1.0,
             1.0, -1.0, 0.0,  1.0, 0.0,
        ]);

        quadVAO = <WebGLVertexArrayObject>gl.createVertexArray();
        quadVBO = <WebGLBuffer>gl.createBuffer();
        gl.bindVertexArray(quadVAO);
        gl.bindBuffer(gl.ARRAY_BUFFER,quadVBO);
        gl.bufferData(gl.ARRAY_BUFFER,quadVertices,gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0,3,gl.FLOAT,false,5*Float32Array.BYTES_PER_ELEMENT,0);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1,2,gl.FLOAT,false,5*Float32Array.BYTES_PER_ELEMENT,3*Float32Array.BYTES_PER_ELEMENT);
    }
    gl.bindVertexArray(quadVAO);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    gl.bindVertexArray(null);
}

let cubeVAO : WebGLVertexArrayObject;
let cubeVBO : WebGLBuffer;
function RenderCube(){
    if(cubeVAO === undefined){
        let vertices = new Float32Array([
            // Back face
            -0.5, -0.5, -0.5, 0.0, 0.0, -1.0, 0.0, 0.0, // Bottom-left
            0.5, 0.5, -0.5, 0.0, 0.0, -1.0, 1.0, 1.0, // top-right
            0.5, -0.5, -0.5, 0.0, 0.0, -1.0, 1.0, 0.0, // bottom-right         
            0.5, 0.5, -0.5, 0.0, 0.0, -1.0, 1.0, 1.0,  // top-right
            -0.5, -0.5, -0.5, 0.0, 0.0, -1.0, 0.0, 0.0,  // bottom-left
            -0.5, 0.5, -0.5, 0.0, 0.0, -1.0, 0.0, 1.0,// top-left
            // Front face
            -0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 0.0, 0.0, // bottom-left
            0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 1.0, 0.0,  // bottom-right
            0.5, 0.5, 0.5, 0.0, 0.0, 1.0, 1.0, 1.0,  // top-right
            0.5, 0.5, 0.5, 0.0, 0.0, 1.0, 1.0, 1.0, // top-right
            -0.5, 0.5, 0.5, 0.0, 0.0, 1.0, 0.0, 1.0,  // top-left
            -0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 0.0, 0.0,  // bottom-left
            // Left face
            -0.5, 0.5, 0.5, -1.0, 0.0, 0.0, 1.0, 0.0, // top-right
            -0.5, 0.5, -0.5, -1.0, 0.0, 0.0, 1.0, 1.0, // top-left
            -0.5, -0.5, -0.5, -1.0, 0.0, 0.0, 0.0, 1.0,  // bottom-left
            -0.5, -0.5, -0.5, -1.0, 0.0, 0.0, 0.0, 1.0, // bottom-left
            -0.5, -0.5, 0.5, -1.0, 0.0, 0.0, 0.0, 0.0,  // bottom-right
            -0.5, 0.5, 0.5, -1.0, 0.0, 0.0, 1.0, 0.0, // top-right
            // Right face
            0.5, 0.5, 0.5, 1.0, 0.0, 0.0, 1.0, 0.0, // top-left
            0.5, -0.5, -0.5, 1.0, 0.0, 0.0, 0.0, 1.0, // bottom-right
            0.5, 0.5, -0.5, 1.0, 0.0, 0.0, 1.0, 1.0, // top-right         
            0.5, -0.5, -0.5, 1.0, 0.0, 0.0, 0.0, 1.0,  // bottom-right
            0.5, 0.5, 0.5, 1.0, 0.0, 0.0, 1.0, 0.0,  // top-left
            0.5, -0.5, 0.5, 1.0, 0.0, 0.0, 0.0, 0.0, // bottom-left     
            // Bottom face
            -0.5, -0.5, -0.5, 0.0, -1.0, 0.0, 0.0, 1.0, // top-right
            0.5, -0.5, -0.5, 0.0, -1.0, 0.0, 1.0, 1.0, // top-left
            0.5, -0.5, 0.5, 0.0, -1.0, 0.0, 1.0, 0.0,// bottom-left
            0.5, -0.5, 0.5, 0.0, -1.0, 0.0, 1.0, 0.0, // bottom-left
            -0.5, -0.5, 0.5, 0.0, -1.0, 0.0, 0.0, 0.0, // bottom-right
            -0.5, -0.5, -0.5, 0.0, -1.0, 0.0, 0.0, 1.0, // top-right
            // Top face
            -0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 0.0, 1.0,// top-left
            0.5, 0.5, 0.5, 0.0, 1.0, 0.0, 1.0, 0.0, // bottom-right
            0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 1.0, 1.0, // top-right     
            0.5, 0.5, 0.5, 0.0, 1.0, 0.0, 1.0, 0.0, // bottom-right
            -0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 0.0, 1.0,// top-left
            -0.5, 0.5, 0.5, 0.0, 1.0, 0.0, 0.0, 0.0 // bottom-left        
        ]);

        cubeVAO = <WebGLVertexArrayObject>gl.createVertexArray();
        cubeVBO = <WebGLBuffer>gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER,cubeVBO);
        gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
        
        gl.bindVertexArray(cubeVAO);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0,3,gl.FLOAT,false, 8 * Float32Array.BYTES_PER_ELEMENT,0);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1,3,gl.FLOAT,false,8*Float32Array.BYTES_PER_ELEMENT,3*Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(2,2,gl.FLOAT,false,8*Float32Array.BYTES_PER_ELEMENT,6*Float32Array.BYTES_PER_ELEMENT);
        gl.bindBuffer(gl.ARRAY_BUFFER,null);
        gl.bindVertexArray(null);
    }
    gl.bindVertexArray(cubeVAO);
    gl.drawArrays(gl.TRIANGLES,0,36);
    gl.bindVertexArray(null);
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
    
    let shader = new Shader("./shadow_mapping_vs.glsl","./shadow_mapping_fs.glsl");
    let simpleDepthShader = new Shader("./shadow_mapping_depth_vs.glsl","./shadow_mapping_depth_fs.glsl");
    let debugDepthQuad = new Shader("./debug_quad_vs.glsl","./debug_quad_fs.glsl");

    let planeVertices = new Float32Array([
        25.0, -0.5, 25.0, 0.0, 1.0, 0.0, 25.0, 0.0,
        -25.0, -0.5, -25.0, 0.0, 1.0, 0.0, 0.0, 25.0,
        -25.0, -0.5, 25.0, 0.0, 1.0, 0.0, 0.0, 0.0,

        25.0, -0.5, 25.0, 0.0, 1.0, 0.0, 25.0, 0.0,
        25.0, -0.5, -25.0, 0.0, 1.0, 0.0, 25.0, 25.0,
        - 25.0, -0.5, -25.0, 0.0, 1.0, 0.0, 0.0, 25.0
    ]);

    planeVAO = <WebGLVertexArrayObject>gl.createVertexArray();
    let planeVBO = <WebGLBuffer>gl.createBuffer();
    gl.bindVertexArray(planeVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER,planeVBO);
    gl.bufferData(gl.ARRAY_BUFFER,planeVertices,gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0,3,gl.FLOAT,false, 8 * Float32Array.BYTES_PER_ELEMENT,0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1,3,gl.FLOAT,false,8*Float32Array.BYTES_PER_ELEMENT,3*Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2,2,gl.FLOAT,false,8*Float32Array.BYTES_PER_ELEMENT,6*Float32Array.BYTES_PER_ELEMENT);
    gl.bindVertexArray(null);

    woodTexture = <WebGLTexture>loadTexture("wood",gl.RGBA);

    const SHADOW_WIDTH = 1024;
    const SHADOW_HEIGHT = 1024;
    let depthMapFBO = <WebGLFramebuffer>gl.createFramebuffer();

    let depthMap = <WebGLTexture>gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D,depthMap);

    gl.texImage2D(gl.TEXTURE_2D,0,gl.DEPTH_COMPONENT24,SHADOW_WIDTH,SHADOW_HEIGHT,0,gl.DEPTH_COMPONENT,gl.UNSIGNED_INT,null);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    //let borderColor = [1,1,1,1];
    //gl.texParameterf(gl.TEXTURE_2D,gl.TEXTURE_, borderColor); //webgl2没有TEXTURE_BORDER_COLOR

    gl.bindFramebuffer(gl.FRAMEBUFFER,depthMapFBO);
    gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D,depthMap,0);

    //gl.readBuffer(gl.NONE);
    //gl.drawBuffer(gl.NONE); 没有drawBuffer接口  所以需要自己创建一个颜色缓存对象，因为不会使用到，我就使用了red8通道就足够了
    let rbo = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, rbo);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.R8, SHADOW_WIDTH, SHADOW_HEIGHT);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, rbo);

    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
        alert('ERROR::FRAMEBUFFER:: Framebuffer is not complete!');
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    shader.use();
    shader.setInt("diffuseTexture",0);
    shader.setInt("shadowMap",1);
    debugDepthQuad.use();
    debugDepthQuad.setInt("depthMap",0);

    let lightPos = [-2,4,-1];

    function render() {
        let currentFrame = (new Date).getTime() / 1000;
        deltaTime = currentFrame - lastFrame;
        lastFrame = currentFrame;

        lightPos[0] = Math.sin(currentFrame) * 3.0;
        lightPos[2]= Math.cos(currentFrame) * 2.0;
        lightPos[1] = 5.0 + Math.cos(currentFrame) * 1.0;

        gl.viewport(0,0,SHADOW_WIDTH,SHADOW_HEIGHT);
        gl.bindFramebuffer(gl.FRAMEBUFFER,depthMapFBO);

        gl.clearColor(0.1,0.1,0.1,1.0);
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

        let lightProjection = mat4.create();
        let lightView = mat4.create();
        let lightSpaceMatrix = mat4.create();
        let near_plane = 1;
        let far_plane = 7.5;
        //mat4.perspective(lightProjection,glMatrix.toRadian(45),SHADOW_WIDTH / SHADOW_HEIGHT,near_plane,far_plane);  //投影矩阵
        mat4.ortho(lightProjection,-10,10,-10,10,near_plane,far_plane);     //正交矩阵
        mat4.lookAt(lightView,lightPos,[0,0,0],[0,1,0]);
        mat4.multiply(lightSpaceMatrix,lightProjection,lightView);

        simpleDepthShader.use();
        simpleDepthShader.setMat4("lightSpaceMatrix",lightSpaceMatrix);
        gl.cullFace(gl.FRONT);
        RenderScene(simpleDepthShader);
        gl.cullFace(gl.BACK);
        gl.bindFramebuffer(gl.FRAMEBUFFER,null);

        gl.viewport(0,0,SCR_WIDTH,SCR_HEIGHT);
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

        shader.use();
        let projection = mat4.perspective(mat4.create(),camera.Zoom,SCR_WIDTH / SCR_HEIGHT,0.1,100);
        let view = camera.GetViewMatrix();
        shader.setMat4("projection",projection);
        shader.setMat4("view",view);
        
        shader.setVec3("lightPos",lightPos);
        shader.setVec3("viewPos",camera.Position);
        shader.setMat4("lightSpaceMatrix",lightSpaceMatrix);

        //shader.setBoolean("shadows",shadows);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D,woodTexture);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D,depthMap);
        RenderScene(shader);

        // debugDepthQuad.use();
        // debugDepthQuad.setInt("near_plane",near_plane);
        // debugDepthQuad.setInt("far_plane",far_plane);
        // gl.activeTexture(gl.TEXTURE0);
        // gl.bindTexture(gl.TEXTURE_2D,depthMap);
        // RenderQuad();

        requestAnimationFrame(render);
    }

    render();
}