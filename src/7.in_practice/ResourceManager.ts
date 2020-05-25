import { Shader } from "./Shader";
import { Texture2D } from "./Texture2D";
import { gl } from "./Global";

export class ResourceManger {
    static shaders = new Map<string, Shader>();
    static textures = new Map<string, Texture2D>();

    static loadShader(vShaderFile: string, fShaderFile: string, name: string) {
        this.shaders.set(name, new Shader(vShaderFile, fShaderFile));
        return this.shaders.get(name);
    }

    static getShader(name: string) {
        return this.shaders.get(name);
    }

    static loadTexture(id: string, alpha: boolean, name: string) {
        this.textures.set(name, this.loadTextureFromFile(id, alpha));
        return this.textures.get(name);
    }

    static getTexture(name: string) {
        return this.textures.get(name);
    }

    static clear() {
        //for (let iter of this.shaders)
        //    gl.deleteProgram(iter[1].id);

        for (let iter of this.textures)
            gl.deleteTexture(iter[1].id);
    }

    private static loadShaderFromFile(vShaderFile: string, fShaderFile: string) {

    }

    private static loadTextureFromFile(id: string, alpha: boolean) {
        let texture = new Texture2D();
        if (alpha) {
            texture.internalFormat = gl.RGBA;
            texture.imageFormat = gl.RGBA;
        }
        texture.generate(id);
        return texture;
    }
}