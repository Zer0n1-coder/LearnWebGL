import { gl, gles } from './Global.js';
export class Vertex {
    constructor() {
        this.Position = new Array(3); //3
        this.Normal = new Array(3); //3
        this.TexCoords = new Array(2); //2
    }
    //Tangent = new Array<number>(3);      //3
    //Bitangent = new Array<number>(3);    //3
    static sizeof() {
        return Float32Array.BYTES_PER_ELEMENT * 8;
    }
    //连续数据
    data() {
        let ret = new Array();
        ret = ret.concat(this.Position);
        ret = ret.concat(this.Normal);
        ret = ret.concat(this.TexCoords);
        //ret = ret.concat(this.Tangent);
        //ret = ret.concat(this.Bitangent);
        return ret;
    }
}
export class Texture {
}
;
export class Mesh {
    constructor(vertices, indices, textures) {
        this.vertices = vertices;
        this.indices = new Uint16Array(indices);
        this.textures = textures;
        //this.setupMesh();
    }
    Draw(shader) {
        let diffuseNr = 1;
        let specularNr = 1;
        let normalNr = 1;
        let heightNr = 1;
        for (let i = 0; i < this.textures.length; ++i) {
            gl.activeTexture(gl.TEXTURE0 + i);
            let number;
            let name = this.textures[i].type;
            if (name === "texture_diffuse")
                number = (diffuseNr++).toString();
            else if (name === "texture_specular")
                number = (specularNr++).toString();
            else if (name === "texture_normal")
                number = (normalNr++).toString();
            else if (name === "texture_height")
                number = (heightNr++).toString();
            // 
            gl.uniform1i(gl.getUniformLocation(shader.getID(), (name + number)), i);
            // 
            gl.bindTexture(gl.TEXTURE_2D, this.textures[i].id);
        }
        // draw mesh
        gles.bindVertexArrayOES(this.VAO);
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
        gles.bindVertexArrayOES(null);
        // 
        gl.activeTexture(gl.TEXTURE0);
    }
    setupMesh(shader) {
        this.VAO = gles.createVertexArrayOES();
        this.VBO = gl.createBuffer();
        this.EBO = gl.createBuffer();
        gles.bindVertexArrayOES(this.VAO);
        //因为数据是分开的，需要先合并一次
        let tmpVec = new Array();
        for (let i = 0; i < this.vertices.length; ++i) {
            tmpVec = tmpVec.concat(this.vertices[i].data());
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tmpVec), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.EBO);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
        shader.use();
        // vertex Positions
        let aPos = shader.getAttribLocation('aPos');
        gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, Vertex.sizeof(), 0);
        gl.enableVertexAttribArray(aPos);
        // vertex normals
        let aNormal = shader.getAttribLocation('aNormal');
        gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, Vertex.sizeof(), 3 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(aNormal);
        // vertex texture coords
        let aTexCoords = shader.getAttribLocation('aTexCoords');
        gl.vertexAttribPointer(aTexCoords, 2, gl.FLOAT, false, Vertex.sizeof(), 6 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(aTexCoords);
        // vertex tangent
        //let aTangent = shader.getAttribLocation('aTangent');
        //gl.enableVertexAttribArray(aTangent);
        //gl.vertexAttribPointer(aTangent, 2, gl.FLOAT, false, Vertex.sizeof(), 8 * Float32Array.BYTES_PER_ELEMENT);
        //// vertex bitangent
        //let aBit = shader.getAttribLocation('aBit');
        //gl.enableVertexAttribArray(aBit);
        //gl.vertexAttribPointer(aBit, 2, gl.FLOAT, false, Vertex.sizeof(), 11 * Float32Array.BYTES_PER_ELEMENT);
        gles.bindVertexArrayOES(null);
    }
}
//# sourceMappingURL=Mesh.js.map