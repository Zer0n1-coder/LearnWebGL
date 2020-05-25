import { gl } from "./Global";
export class Texture2D {
    constructor() {
        this.internalFormat = gl.RGB;
        this.imageFormat = gl.RGB;
        this.wrapS = gl.REPEAT;
        this.wrapT = gl.REPEAT;
        this.filterMin = gl.LINEAR;
        this.filterMax = gl.LINEAR;
        let tmpTexture = gl.createTexture();
        if (!tmpTexture) {
            alert("unable to create texture!");
            return;
        }
        this.id = tmpTexture;
    }
    generate(id) {
        gl.bindTexture(gl.TEXTURE_2D, this.id);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); //https://www.khronos.org/webgl/wiki/WebGL_and_OpenGL_Differences#Non-Power_of_Two_Texture_Support
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //采用和教程不同得形式原因，详见上面得网址
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.filterMin);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.filterMax);
        let img = document.getElementById(id);
        gl.texImage2D(gl.TEXTURE_2D, 0, this.internalFormat, this.imageFormat, gl.UNSIGNED_BYTE, img);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    generateForFBO(width, height) {
        gl.bindTexture(gl.TEXTURE_2D, this.id);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //需要添加这两句话，教程原参考答案没有这两句在这里没法显示出图像
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        //gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textureColorbuffer, 0);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    bind() {
        gl.bindTexture(gl.TEXTURE_2D, this.id);
    }
}
