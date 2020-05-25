import { Shader } from "./Shader";
import { Texture2D } from "./Texture2D";
import { GameObject } from "./GameObject";
import *as Vec2 from "./Vec2";
import { gl } from "./Global";

export class Particle{
    position :number[];
    velocity:number[];
    color:number[];
    life:number;

    constructor(){
        this.position = [0.0,0.0];
        this.velocity = [0.0,0.0];
        this.life = 0.0;
        this.color = [1.0,1.0,1.0,1.0];
    }
}

let lastUsedParticle = 0;

export class ParticleGenerator{
    constructor(shader:Shader,texture:Texture2D,amount:number){
        this.shader = shader;
        this.texture = texture;
        this.amount = amount;
        this.particles = new Array<Particle>();
        this.init();
    }

    update(dt:number,object:GameObject,newParticles:number,offset= [0.0,0.0]){
        for(let i =0;i < newParticles;++i){
            let unusedParticles = this.firstUnusedParticle();
            this.respawnParticle(this.particles[unusedParticles],object,offset);
        }

        for(let i = 0 ; i < this.amount; ++i){
            let p = this.particles[i];
            p.life -= dt;
            if(p.life > 0.0){
                p.position = Vec2.subtract(p.position,Vec2.multiply(p.velocity,dt));
                p.color[3] -= dt * 2.5;
            }
        }
    }

    draw(){
        gl.blendFunc(gl.SRC_ALPHA,gl.ONE);
        this.shader.use();
        for(let particle of this.particles){
            if(particle.life > 0.0){
                this.shader.setVec2("offset",particle.position);
                this.shader.setVec4("color",particle.color);
                gl.activeTexture(gl.TEXTURE0);
                this.texture.bind();
                gl.bindVertexArray(this.VAO);
                gl.drawArrays(gl.TRIANGLES,0,6);
                gl.bindVertexArray(null);
            }
        }
        gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
    }

    private init(){
        let particleQuad = new Float32Array([
            0.0, 1.0, 0.0, 1.0,
            1.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 0.0,

            0.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 0.0
        ]);
        let tmpVAO = gl.createVertexArray();
        if(!tmpVAO){
            alert("unable to create particle VAO!");
            return;
        }
        this.VAO = tmpVAO;
        let VBO = gl.createBuffer();
        if(!VBO){
            alert("unable to create particle VBO!");
            return;
        }
        gl.bindVertexArray(this.VAO);
        gl.bindBuffer(gl.ARRAY_BUFFER,VBO);
        gl.bufferData(gl.ARRAY_BUFFER,particleQuad,gl.STATIC_DRAW);

        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0,4,gl.FLOAT,false,4*Float32Array.BYTES_PER_ELEMENT,0);
        gl.bindVertexArray(null);

        for(let i = 0 ; i < this.amount;++i){
            this.particles.push(new Particle);
        }
    }

    firstUnusedParticle(){
        for(let i = lastUsedParticle;i < this.amount;++i){
            if(this.particles[i].life <= 0.0){
                lastUsedParticle = i;
                return i;
            }
        }

        for(let i = 0 ; i < lastUsedParticle;++i){
            if(this.particles[i].life <= 0.0){
                lastUsedParticle = i;
                return i;
            }
        }

        lastUsedParticle = 0;
        return 0;
    }

    respawnParticle(particle:Particle,object:GameObject,offset = [0.0,0.0]){
        let random = (Math.floor(Math.random()*100) - 50) / 10;
        let rColor = 0.5 + (Math.floor(Math.random()*100) / 100.0);
        particle.position =Vec2.add(offset,Vec2.add([random,random],object.position));
        particle.color = [rColor,rColor,rColor,1.0];
        particle.life = 1.0;
        particle.velocity = Vec2.multiply(object.velocity ,0.1);
    }

    private particles:Particle[];
    private amount:number;
    private shader:Shader;
    private texture:Texture2D;
    private VAO!:WebGLVertexArrayObject;

    
}