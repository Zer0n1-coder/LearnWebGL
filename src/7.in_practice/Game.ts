import { SpriteRenderer } from "./SpriteRenderer";
import { ResourceManger as ResourceManager } from "./ResourceManager";
import { mat4, vec3 } from "./gl-matrix-ts/index"
import { GameLevel } from "./GameLevel";
import { GameObject } from "./GameObject";
import { BallObject } from "./BallObject";
import * as Vec2 from "./Vec2";
import { ParticleGenerator } from "./ParticleGenerator";
import { PostProcessor } from "./PostProcessor";

const PLAYER_SIZE = [100.0, 20.0];
const PLAYER_VELOCITY = 500.0;

const INITIAL_BALL_VELOCITY = [100.0, -350.0];
const BALL_RADIUS = 12.5;

let shakeTime = 0;

let renderer: SpriteRenderer;
let player: GameObject;
let ball: BallObject;
let particleGenerator :ParticleGenerator;
let effects : PostProcessor;

function clamp(value: number[], min: number[], max: number[]) {
    let one = value[0] < min[0] ? min[0] : (value[0] > max[0] ? max[0] : value[0]);
    let two = value[1] < min[1] ? min[1] : (value[1] > max[1] ? max[1] : value[1]);
    return [one, two];
}

//0:上，1：右，2：下，3：左
function vectorDirection(target: number[]) {
    let compass = [
        [0.0, 1.0],
        [1.0, 0.0],
        [0.0, -1.0],
        [-1.0,0.0]
    ]
    let max = 0.0;
    let best_match = -1;
    for (let i = 0; i < 4; ++i) {
        let dot_product = Vec2.dot(Vec2.normalize(target), compass[i]);
        if (dot_product > max) {
            max = dot_product;
            best_match = i;
        }
    }
    return best_match;
}
                  //碰撞，方向，
type collision = [boolean, number, number[]]; 

function checkCollision(one: BallObject, two: GameObject) {
    let center = [one.position[0] + one.radius, one.position[1] + one.radius];

    let aabb_half_extents = [two.size[0] / 2, two.size[1] / 2];
    let aabb_center = [two.position[0] + aabb_half_extents[0], two.position[1] + aabb_half_extents[1]];

    let difference = [center[0] - aabb_center[0], center[1] - aabb_center[1]];
    let clamped = clamp(difference, [-aabb_half_extents[0], -aabb_half_extents[1]], aabb_half_extents);

    let closest = [aabb_center[0] + clamped[0], aabb_center[1] + clamped[1]];
    difference = [closest[0] - center[0], closest[1] - center[1]];

    if (Vec2.length(difference) < one.radius)
        return [true, vectorDirection(difference), difference];
    else
        return [false, 0, [0.0, 0.0]];
}

export enum GameState {
    GAME_ACTIVE,
    GAME_MENU,
    GAME_WIN
}

export class Game {
    state: GameState;
    keys: Array<boolean>;
    width: number;
    height: number;

    levels: Array<GameLevel>;
    curlevel: number;

    constructor(width: number, height: number) {
        this.state = GameState.GAME_ACTIVE;
        this.keys = new Array<boolean>(1024);
        this.width = width;
        this.height = height;
        this.levels = new Array<GameLevel>();
        this.curlevel = 0;
    }

    doCollisions() {
        for (let box of this.levels[this.curlevel].bricks) {
            if (!box.destroyed) {
                let collision = checkCollision(ball, box);
                if (collision[0]) {
                    if (!box.isSolid)
                        box.destroyed = true;
                    else{
                        shakeTime = 0.05;
                        effects.shake =true;
                    }

                    let dir = collision[1];
                    let diff_vector = <number[]>collision[2];
                    if (dir === 3 || dir === 1) {
                        ball.velocity[0] = - ball.velocity[0];
                        let penetration = ball.radius - Math.abs(diff_vector[0]);
                        if (dir === 3)
                            ball.position[0] += penetration;
                        else
                            ball.position[0] -= penetration;
                    }
                    else {
                        ball.velocity[1] = - ball.velocity[1];
                        let penetration = ball.radius - Math.abs(diff_vector[1]);
                        if (dir === 0)
                            ball.position[1] -= penetration;
                        else
                            ball.position[1] += penetration;
                    }
                } 
            }
        }

        let result = checkCollision(ball, player);
        if (!ball.stuck && result[0]) {
            let centerBoard = player.position[0] + player.size[0] / 2;
            let distance = (ball.position[0] + ball.radius) - centerBoard;
            let percentage = distance / (player.size[0] / 2);

            let strength = 2.0;
            let oldVelocity = ball.velocity;
            ball.velocity[0] = INITIAL_BALL_VELOCITY[0] * percentage * strength;
            ball.velocity = Vec2.multiply(Vec2.normalize(ball.velocity), Vec2.length(oldVelocity));
            ball.velocity[1] = -1 * Math.abs(ball.velocity[1]);  
        }
    }

    init() {
        let shader = ResourceManager.loadShader("./shaders/sprite.vs", "./shaders/sprite.frag", "sprite");
        let particleShader = ResourceManager.loadShader("shaders/particle.vs", "shaders/particle.frag", "particle");
        let postShader = ResourceManager.loadShader("shaders/post_processing.vs", "shaders/post_processing.frag", "post_processing");
        if(shader === undefined){
            alert("loading shader is failed!");
            return;
        }

        if(particleShader === undefined){
            alert("loading particleShader is failed!");
            return;
        }
        if(postShader === undefined){
            alert("loading postShader is failed!");
            return;
        }

        let projection = mat4.ortho(mat4.create(),0.0, this.width, this.height, 0.0, -1.0, 1.0);
        shader.use();
        shader.setInt("sprite", 0);
        shader.setMat4("projection", projection);

        particleShader.use();
        particleShader.setInt("particle", 0);
        particleShader.setMat4("projection", projection);

        //////////////
        ResourceManager.loadTexture('background', false, 'background');
        ResourceManager.loadTexture('face', true, 'face');
        ResourceManager.loadTexture('block', true, 'block');
        ResourceManager.loadTexture('block_solid', true, 'block_solid');
        ResourceManager.loadTexture('paddle', true, 'paddle');
        let particleTexture = ResourceManager.loadTexture("particle", true, "particle");
        if(particleTexture === undefined){
            alert("loading texture is failed!");
            return;
        }

        renderer = new SpriteRenderer(shader);
        particleGenerator = new ParticleGenerator(particleShader,particleTexture,500);
        effects = new PostProcessor(postShader, this.width, this.height);

        let playerPos = [this.width / 2.0 - PLAYER_SIZE[0] / 2.0, this.height - PLAYER_SIZE[1]];
        let paddleTexture = ResourceManager.getTexture('paddle');
        if(paddleTexture === undefined){
            alert("loading paddleTexture is failed！");
            return;
        }
        player = new GameObject(playerPos, PLAYER_SIZE, paddleTexture, [1.0, 1.0, 1.0]);

        let tmpPos = [PLAYER_SIZE[0] / 2 - BALL_RADIUS, -BALL_RADIUS * 2];
        let ballPos = [playerPos[0] + tmpPos[0], playerPos[1] + tmpPos[1]];
        let faceTexture = ResourceManager.getTexture('face');
        if(faceTexture === undefined){
            alert("loading faceTexture is failed!");
            return;
        }
        ball = new BallObject(ballPos, BALL_RADIUS, INITIAL_BALL_VELOCITY, faceTexture);

        let one = new GameLevel();
        let two = new GameLevel();
        let three = new GameLevel();
        let four = new GameLevel();
        one.load('./levels/one.lvl', this.width, this.height * 0.5);
        two.load('./levels/two.lvl', this.width, this.height * 0.5);
        three.load('./levels/three.lvl', this.width, this.height * 0.5);
        four.load('./levels/four.lvl', this.width, this.height * 0.5);
        this.levels.push(one);
        this.levels.push(two);
        this.levels.push(three);
        this.levels.push(four);
        this.curlevel = 0;
    }

    processInput(dt: number) {
        if (this.state === GameState.GAME_ACTIVE) {
            let velocity = PLAYER_VELOCITY * dt;

            if (this.keys[65]) {
                if (player.position[0] >= 0){
                    player.position[0] -= velocity;
                    if(ball.stuck)
                        ball.position[0] -= velocity;
                }
            }
            if (this.keys[68]) {
                if (player.position[0] <= this.width - player.size[0]){
                    player.position[0] += velocity;
                    if(ball.stuck)
                    ball.position[0] += velocity;
                }
                    
            }
            if (this.keys[32]) {
                ball.stuck = false;
            }
        }
    }

    update(dt: number) {
        ball.move(dt, this.width);

        this.doCollisions();

        particleGenerator.update(dt, ball, 2,[ball.radius / 2.0,ball.radius / 2.0]);

        if (ball.position[1] >= this.height) {
            this.resetLevel();
            this.resetPlayer();
        }

        if(shakeTime > 0){
            shakeTime -= dt;
            if(shakeTime <= 0){
                effects.shake = false;
            }
        }
    }

    render(time:number) {
        if (this.state === GameState.GAME_ACTIVE) {
            let backgroundTexture = ResourceManager.getTexture('background');
            if(backgroundTexture === undefined){
                alert("loading background is failed!");
                return;
            }

            effects.beginRender();

            renderer.drawSprite(backgroundTexture, [0, 0], [this.width, this.height], 0.0);
            this.levels[this.curlevel].draw(renderer);
            player.draw(renderer);
            particleGenerator.draw();
            ball.draw(renderer);

            effects.endRender();
            effects.render(time);
        }
    }

    resetLevel() {
        if (this.curlevel === 0)
            this.levels[0].load('levels/one.lvl', this.width, this.height * 0.5);
        else if (this.curlevel === 1)
            this.levels[1].load('levels/two.lvl', this.width, this.height * 0.5);
        else if (this.curlevel === 2)
            this.levels[2].load('levels/three.lvl', this.width, this.height * 0.5);
        else if (this.curlevel === 3)
            this.levels[3].load('levels/four.lvl', this.width, this.height * 0.5);
    }

    resetPlayer() {
        player.size = PLAYER_SIZE;
        player.position = [this.width / 2 - PLAYER_SIZE[0] / 2, this.height - PLAYER_SIZE[1]];
        ball.reset(Vec2.add(player.position, [PLAYER_SIZE[0] / 2 - BALL_RADIUS, -(BALL_RADIUS * 2)]), INITIAL_BALL_VELOCITY);
    }
}