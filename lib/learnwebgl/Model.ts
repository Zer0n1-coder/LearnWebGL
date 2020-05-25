import { Texture, Mesh, Vertex} from "./Mesh.js"
import { Shader } from "./Shader.js";
import { gl } from "./Global.js"
import { ObjReader, ObjGroup, MtlObj, MtlGroup } from "./ObjReader.js"

export function TextureFromFile(path: string, directory: string, gamma = false){
    let filename = directory + '/' + path;
    let textureID = gl.createTexture();

    let img = new Image;
    img.src = filename;
    
    let format: number;
    if (path.indexOf('.png') !== -1)
        format = gl.RGBA;
    else if (path.indexOf('.jpg') !== -1)
        format = gl.RGB;

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);      //图片数据和纹理坐标反向
    gl.bindTexture(gl.TEXTURE_2D, textureID);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);  //https://www.khronos.org/webgl/wiki/WebGL_and_OpenGL_Differences#Non-Power_of_Two_Texture_Support
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //采用和教程不同得形式原因，详见上面得网址
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.texImage2D(gl.TEXTURE_2D, 0, format, format, gl.UNSIGNED_BYTE, img);
    gl.generateMipmap(gl.TEXTURE_2D);

    return textureID;
}

export class Model {
    textures_loaded = new Map<string, Texture[]>();
    meshes = new Array<Mesh>();
    directory: string;
    gamaCorrection: boolean;
    shader: Shader;

    constructor(directory:string, filename: string,shader:Shader,gamma = false) {
        this.gamaCorrection = gamma;
        this.directory = directory;
        this.shader = shader;
        this.loadModel(directory, filename);
    }

    Draw() {
        for (let i = 0; i < this.meshes.length; ++i) {
            this.meshes[i].Draw(this.shader);
        }
    }

    private loadModel(directory: string, filename: string) {
        let objReader = new ObjReader(directory, filename);
        let objModel = objReader.parseObj();
        let mtlObj = objModel.mtlObj;
        for (let i = 0; i < objModel.groups.length; ++i) {
            let oneGroup = objModel.groups[i];
            this.meshes.push(this.processGroup(oneGroup, mtlObj));
        }
    }

    private processGroup(objGroup: ObjGroup, mtlObj: MtlObj) {
        let vertices = new Array<Vertex>();
        let indices = new Array <number>();
        let textures = new Array <Texture>();

        let verticeNum = objGroup.v.length / 3;
        for (let i = 0; i < verticeNum; ++i) {
            let vertex = new Vertex;

            //顶点和法线
            let index = i * 3;
            vertex.Position[0] = objGroup.v[index];
            vertex.Position[1] = objGroup.v[index + 1];
            vertex.Position[2] = objGroup.v[index + 2];

            vertex.Normal[0] = objGroup.vn[index];
            vertex.Normal[1] = objGroup.vn[index + 1];
            vertex.Normal[2] = objGroup.vn[index + 2];

            //纹理坐标
            index = i * 2;
            vertex.TexCoords[0] = objGroup.vn[index];
            vertex.TexCoords[1] = objGroup.vn[index + 1];

            vertices.push(vertex);
        }
        //三角面片
        for (let i = 0; i < objGroup.f.length; ++i)
        {
            let face = objGroup.f[i];

            indices.push(face.vi[0]);
            indices.push(face.vi[1]);
            indices.push(face.vi[2]);
        }

        //材质
        if (this.textures_loaded.has(objGroup.mtl))
            textures = this.textures_loaded.get(objGroup.mtl);
        else {
            let groupMtl = mtlObj.mtlGroups.get(objGroup.mtl);

            this.loadMaterialTextures(objGroup.mtl, groupMtl);
            textures = this.textures_loaded.get(objGroup.mtl);
        }
        let mesh = new Mesh(vertices, indices, textures);
        mesh.setupMesh(this.shader);
        return mesh;
    }

    private loadMaterialTextures(name: string, mtlGroup: MtlGroup) {
        let textures = new Array<Texture>();
        //diffuse
        if (mtlGroup.map_Kd !== undefined) {
            let diffuse_texture = new Texture;
            diffuse_texture.id = TextureFromFile(mtlGroup.map_Kd, this.directory);
            diffuse_texture.type = 'texture_diffuse';
            diffuse_texture.path = mtlGroup.map_Kd;
            textures.push(diffuse_texture);
        }
        //specular
        if (mtlGroup.map_Ks !== undefined) {
            let specular_texture = new Texture;
            specular_texture.id = TextureFromFile(mtlGroup.map_Ks, this.directory);
            specular_texture.type = 'texture_specular';
            specular_texture.path = mtlGroup.map_Ks;
            textures.push(specular_texture);
        }
        //normal
        //height
        if (mtlGroup.map_Bump !== undefined) {
            let height_texture = new Texture;
            height_texture.id = TextureFromFile(mtlGroup.map_Bump, this.directory);
            height_texture.type = 'texture_height';
            height_texture.path = mtlGroup.map_Bump;
            textures.push(height_texture);
        }

        this.textures_loaded.set(name, textures);
    }
}