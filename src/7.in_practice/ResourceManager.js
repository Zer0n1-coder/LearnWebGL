import { Shader } from "./Shader";
import { Texture2D } from "./Texture2D";
import { gl } from "./Global";
let ResourceManger = /** @class */ (() => {
    class ResourceManger {
        static loadShader(vShaderFile, fShaderFile, name) {
            this.shaders.set(name, new Shader(vShaderFile, fShaderFile));
            return this.shaders.get(name);
        }
        static getShader(name) {
            return this.shaders.get(name);
        }
        static loadTexture(id, alpha, name) {
            this.textures.set(name, this.loadTextureFromFile(id, alpha));
            return this.textures.get(name);
        }
        static getTexture(name) {
            return this.textures.get(name);
        }
        static clear() {
            //for (let iter of this.shaders)
            //    gl.deleteProgram(iter[1].id);
            for (let iter of this.textures)
                gl.deleteTexture(iter[1].id);
        }
        static loadShaderFromFile(vShaderFile, fShaderFile) {
        }
        static loadTextureFromFile(id, alpha) {
            let texture = new Texture2D();
            if (alpha) {
                texture.internalFormat = gl.RGBA;
                texture.imageFormat = gl.RGBA;
            }
            texture.generate(id);
            return texture;
        }
    }
    ResourceManger.shaders = new Map();
    ResourceManger.textures = new Map();
    return ResourceManger;
})();
export { ResourceManger };
