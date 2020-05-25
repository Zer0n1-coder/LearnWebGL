import { GameObject } from "./GameObject";
import { SpriteRenderer } from "./SpriteRenderer";
import { getTextFromLocation } from "./Global"
import { ResourceManger } from "./ResourceManager";

export class GameLevel {
    bricks: Array<GameObject>;
    constructor() {
        this.bricks = new Array<GameObject>();
    }

    load(file: string, levelWidth: number, levelHeight: number) {
        this.bricks.length = 0;
        
        let data = getTextFromLocation(file);
        let tileData = new Array<Array<number>>();
        let lines = data.split('\n');
        for (let line of lines) {
            let tileCodes = line.split(' ');
            let row = new Array<number>();
            for (let tileCode of tileCodes)
                row.push(Number.parseInt(tileCode));

            tileData.push(row);
        }
        if (tileData.length > 0) {
            this.init(tileData, levelWidth, levelHeight);
        }
    }

    draw(renderer: SpriteRenderer) {
        for (let tile of this.bricks) {
            if (!tile.destroyed)
                tile.draw(renderer);
        }
    }

    isCompleted() {
        for (let tile of this.bricks) {
            if (!tile.isSolid && !tile.destroyed)
                return false;
        }
        return true;
    }

    private init(tileData: Array<Array<number>>, levelWidth: number, levelHeight: number) {
        let height = tileData.length;
        let width = tileData[0].length;
        let unit_width = levelWidth / width;
        let unit_height = levelHeight / height;

        for (let y = 0; y < height; ++y) {
            for (let x = 0; x < width; ++x) {
                if (tileData[y][x] === 1) {
                    let pos = [unit_width * x, unit_height * y];
                    let size = [unit_width, unit_height];
                    let blockTexture = ResourceManger.getTexture('block_solid');
                    if(blockTexture ===undefined){
                        alert("loading texture is failed!");
                        return;
                    }
                    let obj = new GameObject(pos, size, blockTexture , [0.8, 0.8, 0.7]);
                    obj.isSolid = true;
                    this.bricks.push(obj);
                }
                else if (tileData[y][x] > 1) {
                    let color = [1.0, 1.0, 1.0];
                    if (tileData[y][x] === 2)
                        color = [0.2, 0.6, 1.0];
                    else if (tileData[y][x] == 3)
                        color = [0.0, 0.7, 0.0];
                    else if (tileData[y][x] == 4)
                        color = [0.8, 0.8, 0.4];
                    else if (tileData[y][x] == 5)
                        color = [1.0, 0.5, 0.0];

                    let pos = [unit_width * x, unit_height * y];
                    let size = [unit_width, unit_height];
                    let blockTexture =ResourceManger.getTexture('block');
                    if(blockTexture ===undefined){
                        alert("loading texture is failed!");
                        return;
                    }
                    this.bricks.push(new GameObject(pos, size, blockTexture, color));
                }
            }
        }
    }
}