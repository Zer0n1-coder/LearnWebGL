import { getTextFromLocation } from "./Global.js";
export class Triangls {
    constructor() {
        //索引值
        this.vi = new Array();
    }
}
export class ObjGroup {
    constructor() {
        this.v = new Array();
        this.vt = new Array();
        this.vn = new Array();
        this.f = new Array();
    }
}
export class MtlGroup {
    constructor() {
        this.Ka = new Array();
        this.Kd = new Array();
        this.Ks = new Array();
    }
}
export class MtlObj {
    constructor() {
        this.mtlGroups = new Map();
    }
}
export class ObjModel {
    constructor() {
        this.groups = new Array();
    }
}
export class ObjReader {
    constructor(directory, filename) {
        this._directory = directory;
        this._filename = filename;
    }
    parseObj() {
        let objData = getTextFromLocation(this._directory + '/' + this._filename);
        if (objData.length === 0)
            return null;
        let ret = new ObjModel;
        let lines = objData.split("\n");
        let groupIndex = -1; //组编号
        //回掉函数里没法调用类成员变量和函数，所以用了临时变量
        let directory = this._directory;
        let parseMtl = this.parseMtl;
        let indexOffset; //索引值偏移量
        let verSum = 0; //顶点个数统计
        let nomVec = new Array(); //法线容器
        let texVec = new Array(); //纹理坐标容器
        let callback = function (value, index, array) {
            let tokens = value.split(' ');
            if (tokens[0] === 'mtllib') {
                let tmpPath = directory + '/' + tokens[1];
                let mtlData = getTextFromLocation(tmpPath);
                ret.mtlObj = parseMtl(mtlData);
            }
            else if (tokens[0] === 'o' || tokens[0] === 'g') {
                let oneGroup = new ObjGroup;
                oneGroup.name = tokens[1];
                ret.groups.push(oneGroup);
                ++groupIndex;
                indexOffset = verSum;
            }
            else if (tokens[0] === 'v') {
                let curGroup = ret.groups[groupIndex];
                curGroup.v.push(Number.parseFloat(tokens[1]));
                curGroup.v.push(Number.parseFloat(tokens[2]));
                curGroup.v.push(Number.parseFloat(tokens[3]));
                ++verSum;
            }
            else if (tokens[0] === 'vn') {
                nomVec.push(Number.parseFloat(tokens[1]));
                nomVec.push(Number.parseFloat(tokens[2]));
                nomVec.push(Number.parseFloat(tokens[3]));
            }
            else if (tokens[0] === 'vt') {
                texVec.push(Number.parseFloat(tokens[1]));
                texVec.push(Number.parseFloat(tokens[2]));
            }
            else if (tokens[0] === 'f') {
                let values1 = tokens[1].split("/");
                let values2 = tokens[2].split("/");
                let values3 = tokens[3].split("/");
                let curGroup = ret.groups[groupIndex];
                let triange = new Triangls;
                triange.vi.push(Number.parseInt(values1[0]) - indexOffset - 1);
                triange.vi.push(Number.parseInt(values2[0]) - indexOffset - 1);
                triange.vi.push(Number.parseInt(values3[0]) - indexOffset - 1);
                let index = (Number.parseInt(values1[1]) - 1) * 3;
                curGroup.vt.push(texVec[index]);
                curGroup.vt.push(texVec[index + 1]);
                index = (Number.parseInt(values2[1]) - 1) * 3;
                curGroup.vt.push(texVec[index]);
                curGroup.vt.push(texVec[index + 1]);
                index = (Number.parseInt(values3[1]) - 1) * 3;
                curGroup.vt.push(texVec[index]);
                curGroup.vt.push(texVec[index + 1]);
                index = (Number.parseInt(values1[2]) - 1) * 3;
                curGroup.vn.push(texVec[index]);
                curGroup.vn.push(texVec[index + 1]);
                curGroup.vn.push(texVec[index + 2]);
                index = (Number.parseInt(values2[2]) - 1) * 3;
                curGroup.vn.push(texVec[index]);
                curGroup.vn.push(texVec[index + 1]);
                curGroup.vn.push(texVec[index + 2]);
                index = (Number.parseInt(values3[2]) - 1) * 3;
                curGroup.vn.push(texVec[index]);
                curGroup.vn.push(texVec[index + 1]);
                curGroup.vn.push(texVec[index + 2]);
                curGroup.f.push(triange);
            }
            else if (tokens[0] === 'usemtl') {
                ret.groups[groupIndex].mtl = tokens[1];
            }
        };
        lines.forEach(callback);
        return ret;
    }
    parseMtl(data) {
        let lines = data.split("\n");
        let gourpIndex;
        let ret = new MtlObj;
        let callback = function (value, index, array) {
            let tokens = value.split(' ');
            if (tokens[0] === 'newmtl') {
                let tmpGroup = new MtlGroup;
                ret.mtlGroups.set(tokens[1], tmpGroup);
                gourpIndex = tokens[1];
            }
            else if (tokens[0] === 'Ns') {
                ret.mtlGroups.get(gourpIndex).Ns = Number.parseFloat(tokens[1]);
            }
            else if (tokens[0] === 'Ka') {
                let tmpGroup = ret.mtlGroups.get(gourpIndex);
                tmpGroup.Ka.push(Number.parseFloat(tokens[1]));
                tmpGroup.Ka.push(Number.parseFloat(tokens[2]));
                tmpGroup.Ka.push(Number.parseFloat(tokens[3]));
            }
            else if (tokens[0] === 'Kd') {
                let tmpGroup = ret.mtlGroups.get(gourpIndex);
                tmpGroup.Kd.push(Number.parseFloat(tokens[1]));
                tmpGroup.Kd.push(Number.parseFloat(tokens[2]));
                tmpGroup.Kd.push(Number.parseFloat(tokens[3]));
            }
            else if (tokens[0] === 'Ks') {
                let tmpGroup = ret.mtlGroups.get(gourpIndex);
                tmpGroup.Ks.push(Number.parseFloat(tokens[1]));
                tmpGroup.Ks.push(Number.parseFloat(tokens[2]));
                tmpGroup.Ks.push(Number.parseFloat(tokens[3]));
            }
            else if (tokens[0] === 'Ni') {
                ret.mtlGroups.get(gourpIndex).Ni = Number.parseFloat(tokens[1]);
            }
            else if (tokens[0] === 'd') {
                ret.mtlGroups.get(gourpIndex).d = Number.parseFloat(tokens[1]);
            }
            else if (tokens[0] === 'illum') {
                ret.mtlGroups.get(gourpIndex).illum = Number.parseInt(tokens[1]);
            }
            else if (tokens[0] === 'map_Kd') {
                ret.mtlGroups.get(gourpIndex).map_Kd = tokens[1];
            }
            else if (tokens[0] === 'map_Bump') {
                ret.mtlGroups.get(gourpIndex).map_Bump = tokens[1];
            }
            else if (tokens[0] === 'map_Ks') {
                ret.mtlGroups.get(gourpIndex).map_Ks = tokens[1];
            }
        };
        lines.forEach(callback);
        return ret;
    }
}
//# sourceMappingURL=ObjReader.js.map