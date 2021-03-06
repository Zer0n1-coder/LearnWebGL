﻿import { Texture2D } from "./Texture2D";
import { SpriteRenderer } from "./SpriteRenderer";

export class GameObject {
    position: number[];
    size: number[];
    velocity: number[];
    color: number[];
    rotation: number;
    isSolid: boolean;
    destroyed: boolean;

    sptite: Texture2D;

    constructor();
    constructor(pos: number[], size: number[], sprite: Texture2D, color: number[]);
    constructor(pos: number[], size: number[], sprite: Texture2D, color: number[], velocity: number[]);
    constructor(pos?: number[], size?: number[], sprite?: Texture2D, color?: number[], velocity?: number[]) {
        if (pos !== undefined &&size !== undefined &&sprite !== undefined &&color !== undefined &&velocity !== undefined) {
            this.position = pos;
            this.size = size;
            this.sptite = sprite;
            this.color = color;
            this.velocity = velocity;
            this.rotation = 0.0;
            this.isSolid = false;
            this.destroyed = false;
        }
        else if (pos !== undefined &&size !== undefined &&sprite !== undefined &&color !== undefined) {
            this.position = pos;
            this.size = size;
            this.sptite = sprite;
            this.color = color;
            this.velocity =[0.0, 0.0];
            this.rotation = 0.0;
            this.isSolid = false;
            this.destroyed = false;
        }
        else {
            this.position = [0,0];
            this.size = [1, 1];
            this.sptite = new Texture2D();
            this.color = [1.0, 1.0, 1.0];
            this.velocity = [0.0, 0.0];
            this.rotation = 0.0;
            this.isSolid = false;
            this.destroyed = false;
        }
    }

    draw(renderer: SpriteRenderer) {
        renderer.drawSprite(this.sptite, this.position, this.size, this.rotation, this.color);
    }
}