import { Shader } from "./Shader";
import { Texture2D } from "./Texture2D";
import { gl } from "./Global";

export class PostProcessor{
    postProcessingShader:Shader;
    texture:Texture2D;
    width:number;
    height:number;
    confuse:boolean;
    chaos:boolean;
    shake:boolean;

    constructor(shader:Shader,width:number,height:number){
        this.postProcessingShader = shader;
        this.texture = new Texture2D;
        this.width = width;
        this.height = height;
        this.confuse = false;
        this.chaos = false;
        this.shake = false;

        let tmpFBO = gl.createFramebuffer();
        if(!tmpFBO){
            alert("unable to create MSFBO!");
            return;
        }
        this.MSFBO = tmpFBO;

        tmpFBO = gl.createFramebuffer();
        if(!tmpFBO){
            alert("unable to create FBO!");
            return;
        }
        this.FBO = tmpFBO;

        let tmpRBO = gl.createRenderbuffer();
        if(!tmpRBO){
            alert("unable to create RBO!");
            return;
        }
        this.RBO = tmpRBO;

        gl.bindFramebuffer(gl.FRAMEBUFFER,this.MSFBO);
        gl.bindRenderbuffer(gl.RENDERBUFFER,this.RBO);
        gl.renderbufferStorageMultisample(gl.RENDERBUFFER,4,gl.RGBA8,width,height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.RENDERBUFFER,this.RBO);
        if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!== gl.FRAMEBUFFER_COMPLETE){
            alert("ERROR::POSTPROCESSOR: Failed to initialize MSFBO");
            return;
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER,this.FBO);
        this.texture.generateForFBO(width,height);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.id, 0);
        if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE){
            alert("ERROR::POSTPROCESSOR: Failed to initialize FBO");
            return;
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER,null);

        this.initRenderData();
        this.postProcessingShader.setInt("scene",0,true);
        let offset = 1 / 300;
        let offsets = [
             -offset,  offset ,  
              0.0,    offset  ,  
              offset,  offset ,  
             -offset,  0.0    ,  
              0.0,    0.0     ,  
              offset,  0.0    ,  
             -offset, -offset ,  
              0.0,   -offset  ,  
              offset, -offset     
        ];
        gl.uniform2fv(gl.getUniformLocation(this.postProcessingShader.getID(),"offsets"),offsets);

        let edgeKernel = [
            -1, -1, -1,
            -1,  8, -1,
            -1, -1, -1
        ];
        gl.uniform1fv(gl.getUniformLocation(this.postProcessingShader.getID(), "edge_kernel"),edgeKernel);

        let blurKernel = [
            1.0 / 16.0, 2.0 / 16.0, 1.0 / 16.0,
            2.0 / 16.0, 4.0 / 16.0, 2.0 / 16.0,
            1.0 / 16.0, 2.0 / 16.0, 1.0 / 16.0
        ];
        gl.uniform1fv(gl.getUniformLocation(this.postProcessingShader.getID(), "blur_kernel"),blurKernel);
    }

    beginRender(){
        gl.bindFramebuffer(gl.FRAMEBUFFER,this.MSFBO);
        gl.clearColor(0,0,0,1);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    endRender(){
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER,this.MSFBO);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,this.FBO);
        gl.blitFramebuffer(0,0,this.width,this.height,0,0,this.width,this.height,gl.COLOR_BUFFER_BIT,gl.NEAREST);
        gl.bindFramebuffer(gl.FRAMEBUFFER,null);
    }

    render(time:number){
        this.postProcessingShader.use();
        this.postProcessingShader.setFloat("time",time);
        this.postProcessingShader.setBoolean("confuse",this.confuse);
        this.postProcessingShader.setBoolean("chaos",this.chaos);
        this.postProcessingShader.setBoolean("shake",this.shake);

        gl.activeTexture(gl.TEXTURE0);
        this.texture.bind();
        gl.bindVertexArray(this.VAO);
        gl.drawArrays(gl.TRIANGLES,0,6);
        gl.bindVertexArray(null);
    }

    private initRenderData(){
        let vertices = new Float32Array([
            -1.0, -1.0, 0.0, 0.0,
             1.0,  1.0, 1.0, 1.0,
            -1.0,  1.0, 0.0, 1.0,
    
            -1.0, -1.0, 0.0, 0.0,
             1.0, -1.0, 1.0, 0.0,
             1.0,  1.0, 1.0, 1.0
        ]);

        let VBO = gl.createBuffer();
        if(!VBO){
            alert("unable to create VBO!");
            return;
        }
        let tmpVAO = gl.createVertexArray();
        if(!tmpVAO){
            alert("unable to create VAO!");
            return;
        }
        this.VAO = tmpVAO;

        gl.bindBuffer(gl.ARRAY_BUFFER,VBO);
        gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);

        gl.bindVertexArray(this.VAO);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0,4,gl.FLOAT,false,4*Float32Array.BYTES_PER_ELEMENT,0);
        gl.bindBuffer(gl.ARRAY_BUFFER,null);
        gl.bindVertexArray(null);
    }

    private MSFBO!: WebGLFramebuffer;
    private FBO!:WebGLFramebuffer;
    private RBO!:WebGLRenderbuffer;
    private VAO!:WebGLVertexArrayObject;
}