﻿
function getWebGL() {
    let canvas = <HTMLCanvasElement>document.getElementById('webgl');

    let gl: WebGLRenderingContext = canvas.getContext('webgl', { depth:true,stencil: true });      //开启模板缓存
    if (!gl) {
        window.alert('Failed to get the rendering context for WebGL');
        return null;
    }
    return gl;
}

export let gl = getWebGL();
export let gles = gl.getExtension('OES_vertex_array_object');

export function loadTexture(id: string, type: number) {
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);  //https://www.khronos.org/webgl/wiki/WebGL_and_OpenGL_Differences#Non-Power_of_Two_Texture_Support
    //gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE); //采用和教程不同得形式原因，详见上面得网址
    //gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    let img = <HTMLImageElement>document.getElementById(id);
    gl.texImage2D(gl.TEXTURE_2D, 0, type, type, gl.UNSIGNED_BYTE, img);
    gl.generateMipmap(gl.TEXTURE_2D);

    return texture;
}

export function getTextFromLocation(path: string) {
    let request = new XMLHttpRequest;

    request.open('GET', path, false);
    request.send();

    return request.responseText;
}